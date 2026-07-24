/**
 * Client Google Gemini AI
 *
 * Service singleton pour interagir avec l'API Gemini.
 * Gère le quota, le timeout et les erreurs.
 */
import { GenerativeModel } from '@google/generative-ai';
/**
 * Initialise et retourne le modèle Gemini (singleton)
 */
export declare function getGeminiModel(): GenerativeModel;
/**
 * Compteur simple d'appels pour monitoring
 */
export declare const metrics: {
    totalCalls: number;
    totalTokens: number;
    errors: number;
    lastCallTime: number;
};
/**
 * Réinitialise le modèle (utile pour les tests)
 */
export declare function resetGeminiModel(): void;
export default getGeminiModel;
//# sourceMappingURL=client.d.ts.map