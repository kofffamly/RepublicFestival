/**
 * Service d'analyse d'image de déchet via Gemini
 *
 * Fonction : analyzeWasteImage()
 *
 * Valide l'image, l'envoie à Gemini, parse la réponse JSON
 * et retourne une analyse structurée.
 */

import { getGeminiModel, metrics } from './client';
import { ANALYZE_WASTE_SYSTEM_PROMPT } from '../prompts';
import {
  AppError,
  GeminiError,
  ImageError,
  TimeoutError,
  ValidationError,
  ErrorCodes,
  logError,
} from '../utils/errors';
import type { AIAnalysis, AnalyzeWasteRequest, AnalyzeWasteResponse } from '../types';

// ─── Constantes ─────────────────────────────────────────────────────
const ANALYSIS_TIMEOUT_MS = 30000; // 30 secondes
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

// ─── Validation ─────────────────────────────────────────────────────

function validateImageRequest(request: AnalyzeWasteRequest): void {
  if (!request.imageBase64 || request.imageBase64.length === 0) {
    throw new ValidationError('L\'image est vide', 'Aucune donnée image fournie');
  }

  if (!request.mimeType) {
    throw new ValidationError('Type MIME manquant', 'Spécifiez le type MIME de l\'image');
  }

  if (!ALLOWED_MIME_TYPES.includes(request.mimeType)) {
    throw new ImageError(
      ErrorCodes.IMAGE_UNSUPPORTED_FORMAT,
      `Format d'image non supporté: ${request.mimeType}`,
      `Formats acceptés: ${ALLOWED_MIME_TYPES.join(', ')}`
    );
  }

  // Calculer la taille approximative (base64 → bytes)
  const imageSize = Math.ceil((request.imageBase64.length * 3) / 4);
  if (imageSize > MAX_IMAGE_SIZE_BYTES) {
    throw new ImageError(
      ErrorCodes.IMAGE_TOO_LARGE,
      `L'image dépasse la taille maximale de ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`,
      `Taille approximative: ${(imageSize / 1024 / 1024).toFixed(2)}MB`
    );
  }
}

// ─── Parsing de la réponse Gemini ──────────────────────────────────

function parseAnalysisResponse(text: string): AIAnalysis {
  // Nettoyer la réponse (enlever les markdown ```json ```)
  let cleanText = text.trim();
  const jsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    cleanText = jsonMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(cleanText);

    // Vérifier le cas spécial "NO_WASTE_DETECTED"
    if (parsed.code === 'NO_WASTE_DETECTED' || parsed.wasteType === 'NO_WASTE_DETECTED') {
      throw new ImageError(
        ErrorCodes.IMAGE_NO_OBJECT,
        'Aucun déchet identifié dans l\'image',
        'L\'image ne semble pas contenir de déchet recyclable identifiable. Essayez de cadrer le déchet au centre de l\'image.'
      );
    }

    // Valider les champs requis
    const requiredFields = ['wasteType', 'category', 'material', 'confidence'];
    for (const field of requiredFields) {
      if (!parsed[field]) {
        throw new GeminiError(
          ErrorCodes.GEMINI_INVALID_RESPONSE,
          `Réponse IA invalide: champ "${field}" manquant`,
          `La réponse de l'IA ne contient pas le champ requis "${field}". Réponse brute: ${cleanText.substring(0, 200)}`
        );
      }
    }

    return {
      wasteType: parsed.wasteType,
      category: parsed.category,
      material: parsed.material,
      confidence: Math.min(Math.max(parsed.confidence, 0), 100),
      description: parsed.description || '',
      recommendation: parsed.recommendation || '',
      recyclingInstructions: parsed.recyclingInstructions || '',
      binType: parsed.binType || 'autre',
      hazardLevel: parsed.hazardLevel || 'none',
      estimatedWeight: parsed.estimatedWeight || 0,
      estimatedValueMin: parsed.estimatedValueMin || 0,
      estimatedValueMax: parsed.estimatedValueMax || 0,
      recyclable: parsed.recyclable !== false,
      tags: parsed.tags || [],
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new GeminiError(
      ErrorCodes.GEMINI_INVALID_RESPONSE,
      'Réponse IA invalide: impossible de parser le JSON',
      `Erreur de parsing: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Réponse brute: ${cleanText.substring(0, 300)}`
    );
  }
}

// ─── Analyse principale ────────────────────────────────────────────

export async function analyzeWasteImage(request: AnalyzeWasteRequest): Promise<AnalyzeWasteResponse> {
  const startTime = Date.now();

  try {
    // 1. Valider la requête
    validateImageRequest(request);

    // 2. Préparer le contenu pour Gemini
    const imageData = {
      inlineData: {
        data: request.imageBase64,
        mimeType: request.mimeType,
      },
    };

    // 3. Appeler Gemini avec timeout
    const model = getGeminiModel();

    const timeoutPromise = new Promise<never>((resolve, reject) => {
      const timer = setTimeout(
        () => {
          clearTimeout(timer);
          reject(new TimeoutError('analyzeWaste', ANALYSIS_TIMEOUT_MS));
        },
        ANALYSIS_TIMEOUT_MS
      );
      // Permettre l'annulation du timeout si la promesse Gemini gagne
      (timeoutPromise as any).__timer = timer;
    });

    const result = await Promise.race([
      model.generateContent([
        { text: ANALYZE_WASTE_SYSTEM_PROMPT },
        imageData,
      ]),
      timeoutPromise,
    ]);
    // Nettoyer le timer après la course
    const timerToClear = (timeoutPromise as any).__timer;
    if (timerToClear) clearTimeout(timerToClear);

    const response = result.response;
    const text = response.text();

    // 4. Mettre à jour les métriques
    metrics.totalCalls++;
    if (response.usageMetadata) {
      metrics.totalTokens += response.usageMetadata.totalTokenCount || 0;
    }
    metrics.lastCallTime = Date.now();

    // 5. Vérifier si la réponse a été bloquée
    if (!text || text.trim().length === 0) {
      const blockReason = response.promptFeedback?.blockReason;
      if (blockReason) {
        throw new GeminiError(
          ErrorCodes.GEMINI_SAFETY_BLOCKED,
          'La requête a été bloquée par les filtres de sécurité Gemini',
          `Raison: ${blockReason}`
        );
      }
      throw new GeminiError(
        ErrorCodes.GEMINI_EMPTY_RESPONSE,
        'Gemini a retourné une réponse vide',
        'Aucun texte généré pour cette image'
      );
    }

    // 6. Parser et retourner
    const analysis = parseAnalysisResponse(text);

    const processingTimeMs = Date.now() - startTime;

    return {
      success: true,
      data: analysis,
      processingTimeMs,
    };
  } catch (error) {
    metrics.errors++;

    if (error instanceof AppError) {
      // Vérifier si c'est un timeout
      if (error.code === ErrorCodes.TIMEOUT) {
        return {
          success: false,
          error: {
            code: error.code,
            message: 'L\'analyse a pris trop de temps. Veuillez réessayer avec une image plus petite.',
            details: error.details,
          },
          processingTimeMs: Date.now() - startTime,
        };
      }

      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        processingTimeMs: Date.now() - startTime,
      };
    }

    // Erreur inattendue
    logError('analyzeWasteImage', error as Error, { mimeType: request.mimeType });
    return {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'Une erreur inattendue est survenue lors de l\'analyse',
      },
      processingTimeMs: Date.now() - startTime,
    };
  }
}
