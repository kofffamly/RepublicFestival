/**
 * Client Google Gemini AI
 *
 * Service singleton pour interagir avec l'API Gemini.
 * Gère le quota, le timeout et les erreurs.
 */

import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { geminiConfig, isDev } from '../config';
import { GeminiError, ErrorCodes } from '../utils/errors';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

/**
 * Initialise et retourne le modèle Gemini (singleton)
 */
export function getGeminiModel(): GenerativeModel {
  if (model) return model;

  if (!geminiConfig.apiKey || geminiConfig.apiKey === 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') {
    throw new GeminiError(
      ErrorCodes.GEMINI_NOT_CONFIGURED,
      'Gemini API non configurée. Définissez GEMINI_API_KEY dans les variables d\'environnement.',
      'Vérifiez que le fichier .env contient une clé API Gemini valide. Obtenez-en une sur https://aistudio.google.com/app/apikey'
    );
  }

  genAI = new GoogleGenerativeAI(geminiConfig.apiKey);

  model = genAI.getGenerativeModel({
    model: geminiConfig.model,
    generationConfig: {
      maxOutputTokens: geminiConfig.maxTokens,
      temperature: geminiConfig.temperature,
      topP: geminiConfig.topP,
      topK: geminiConfig.topK,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  if (isDev()) {
    console.log('[Gemini] Modèle initialisé:', geminiConfig.model);
  }

  return model;
}

/**
 * Compteur simple d'appels pour monitoring
 */
export const metrics = {
  totalCalls: 0,
  totalTokens: 0,
  errors: 0,
  lastCallTime: 0,
};

/**
 * Réinitialise le modèle (utile pour les tests)
 */
export function resetGeminiModel(): void {
  model = null;
  genAI = null;
}

export default getGeminiModel;
