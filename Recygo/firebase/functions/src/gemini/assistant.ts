/**
 * Service de l'assistant IA RecyGo
 *
 * Fonction : askRecyclingAssistant()
 *
 * Valide la question, détecte les hors-sujets,
 * interroge Gemini et retourne une réponse structurée.
 */

import { getGeminiModel, metrics } from './client';
import {
  ASSISTANT_SYSTEM_PROMPT,
  OFF_TOPIC_DETECTION_PROMPT,
} from '../prompts';
import {
  AppError,
  ValidationError,
  TimeoutError,
  ErrorCodes,
  logError,
} from '../utils/errors';
import type {
  AskAssistantRequest,
  AskAssistantResponse,
  ChatMessage,
} from '../types';

// ─── Constantes ─────────────────────────────────────────────────────
const ASSISTANT_TIMEOUT_MS = 20000;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20; // Nombre max de messages dans l'historique

// ═════════════════════════════════════════════════════════════════════
// VALIDATION
// ═════════════════════════════════════════════════════════════════════

function validateRequest(request: AskAssistantRequest): void {
  if (!request.message || request.message.trim().length === 0) {
    throw new ValidationError(
      'Message vide',
      'Veuillez écrire une question pour l\'assistant RecyGo'
    );
  }

  if (request.message.length > MAX_MESSAGE_LENGTH) {
    throw new ValidationError(
      'Message trop long',
      `Le message ne doit pas dépasser ${MAX_MESSAGE_LENGTH} caractères (${request.message.length} actuellement)`
    );
  }

  if (request.conversationHistory && request.conversationHistory.length > MAX_HISTORY_LENGTH) {
    // Tronquer l'historique plutôt que de rejeter
    request.conversationHistory = request.conversationHistory.slice(-MAX_HISTORY_LENGTH);
  }
}

// ═════════════════════════════════════════════════════════════════════
// DÉTECTION HORS-SUJET
// ═════════════════════════════════════════════════════════════════════

async function isOffTopic(message: string): Promise<boolean> {
  try {
    const model = getGeminiModel();
    const prompt = OFF_TOPIC_DETECTION_PROMPT.replace('{message}', message);

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();

    return text === 'false';
  } catch {
    // En cas d'erreur de détection, on laisse passer (fail open)
    return false;
  }
}

// ═════════════════════════════════════════════════════════════════════
// ASSISTANT PRINCIPAL
// ═════════════════════════════════════════════════════════════════════

export async function askRecyclingAssistant(
  request: AskAssistantRequest
): Promise<AskAssistantResponse> {
  const startTime = Date.now();

  try {
    // 1. Valider
    validateRequest(request);

    // 2. Détecter les hors-sujets
    const offTopic = await isOffTopic(request.message);
    if (offTopic) {
      return {
        success: true,
        data: {
          reply:
            'Désolé, je suis spécialisé dans les questions sur le recyclage, ' +
            'le tri des déchets et l\'environnement. 🎯\n\n' +
            'Pourrais-je vous aider avec :\n' +
            '• Comment trier vos déchets ?\n' +
            '• Où trouver un centre de recyclage ?\n' +
            '• Comment utiliser l\'application RecyGo ?\n' +
            '• L\'impact environnemental du recyclage ?\n\n' +
            'N\'hésitez pas à me poser une question sur ces sujets !',
          context: {
            offTopicDetected: true,
            suggestedTopics: [
              'Tri des déchets',
              'Centres de recyclage',
              'Application RecyGo',
              'Impact environnemental',
            ],
          },
        },
        processingTimeMs: Date.now() - startTime,
      };
    }

    // 3. Préparer l'historique de conversation
    const chatHistory: ChatMessage[] = [];

    if (request.conversationHistory) {
      // Filtrer pour ne garder que user/assistant (pas les system)
      for (const msg of request.conversationHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          chatHistory.push({
            role: msg.role,
            content: msg.content.substring(0, 1000), // Limiter la taille
          });
        }
      }
    }

    // 4. Appeler Gemini avec timeout
    const model = getGeminiModel();
    const chat = model.startChat({
      history: chatHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      systemInstruction: { role: 'user', parts: [{ text: ASSISTANT_SYSTEM_PROMPT }] },
    });

    const result = await Promise.race([
      chat.sendMessage(request.message),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new TimeoutError('askAssistant', ASSISTANT_TIMEOUT_MS)),
          ASSISTANT_TIMEOUT_MS
        )
      ),
    ]);

    const response = result.response;
    const text = response.text();

    // 5. Mettre à jour les métriques
    metrics.totalCalls++;
    if (response.usageMetadata) {
      metrics.totalTokens += response.usageMetadata.totalTokenCount || 0;
    }
    metrics.lastCallTime = Date.now();

    // 6. Parser la réponse JSON
    let replyText = text;
    let contextData: Record<string, unknown> = {};
    let sources: string[] = [];

    try {
      const cleanText = text
        .replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1')
        .trim();
      const parsed = JSON.parse(cleanText);

      if (parsed.reply) {
        replyText = parsed.reply;
      }
      if (parsed.context) {
        contextData = parsed.context;
        if (Array.isArray(parsed.context.suggestedActions)) {
          sources = parsed.context.suggestedActions;
        }
      }
    } catch {
      // Si le JSON est invalide, on utilise le texte brut
      replyText = text;
    }

    // 7. Nettoyer la réponse
    replyText = replyText
      .replace(/^["']|["']$/g, '') // Enlever les guillemets superflus
      .trim();

    const processingTimeMs = Date.now() - startTime;

    return {
      success: true,
      data: {
        reply: replyText,
        context: contextData,
        sources,
      },
      processingTimeMs,
    };
  } catch (error) {
    metrics.errors++;

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
        processingTimeMs: Date.now() - startTime,
      };
    }

    logError('askRecyclingAssistant', error as Error, {
      messageLength: request.message?.length,
    });

    return {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'Désolé, une erreur est survenue. Veuillez réessayer.',
      },
      processingTimeMs: Date.now() - startTime,
    };
  }
}

