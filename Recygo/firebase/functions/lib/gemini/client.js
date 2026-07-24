"use strict";
/**
 * Client Google Gemini AI
 *
 * Service singleton pour interagir avec l'API Gemini.
 * Gère le quota, le timeout et les erreurs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
exports.getGeminiModel = getGeminiModel;
exports.resetGeminiModel = resetGeminiModel;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
let genAI = null;
let model = null;
/**
 * Initialise et retourne le modèle Gemini (singleton)
 */
function getGeminiModel() {
    if (model)
        return model;
    if (!config_1.geminiConfig.apiKey || config_1.geminiConfig.apiKey === 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') {
        throw new errors_1.GeminiError(errors_1.ErrorCodes.GEMINI_NOT_CONFIGURED, 'Gemini API non configurée. Définissez GEMINI_API_KEY dans les variables d\'environnement.', 'Vérifiez que le fichier .env contient une clé API Gemini valide. Obtenez-en une sur https://aistudio.google.com/app/apikey');
    }
    genAI = new generative_ai_1.GoogleGenerativeAI(config_1.geminiConfig.apiKey);
    model = genAI.getGenerativeModel({
        model: config_1.geminiConfig.model,
        generationConfig: {
            maxOutputTokens: config_1.geminiConfig.maxTokens,
            temperature: config_1.geminiConfig.temperature,
            topP: config_1.geminiConfig.topP,
            topK: config_1.geminiConfig.topK,
        },
        safetySettings: [
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ],
    });
    if ((0, config_1.isDev)()) {
        console.log('[Gemini] Modèle initialisé:', config_1.geminiConfig.model);
    }
    return model;
}
/**
 * Compteur simple d'appels pour monitoring
 */
exports.metrics = {
    totalCalls: 0,
    totalTokens: 0,
    errors: 0,
    lastCallTime: 0,
};
/**
 * Réinitialise le modèle (utile pour les tests)
 */
function resetGeminiModel() {
    model = null;
    genAI = null;
}
exports.default = getGeminiModel;
//# sourceMappingURL=client.js.map