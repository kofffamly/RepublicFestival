/**
 * Service de l'assistant IA RecyGo CI — Production
 *
 * Fonction : askRecyclingAssistant()
 *
 * Sécurité :
 * - Firebase Authentication (token Bearer)
 * - Firebase App Check (header X-Firebase-AppCheck)
 * - Rate limiting (Firestore sliding window)
 * - Validation stricte des entrées
 * - Détection hors-sujet locale (regex) + Gemini (fallback)
 * - Timeout robuste avec AbortController
 * - Résumé automatique de l'historique
 * - Journalisation complète
 */
import type { AskAssistantRequest, AskAssistantResponse } from '../types';
/**
 * Traite une question et retourne une réponse de l'assistant RecyGo
 *
 * @param request - La requête contenant le message et optionnellement l'historique
 * @param authToken - Token Bearer Firebase Authentication
 * @param appCheckToken - Token Firebase App Check
 * @returns AskAssistantResponse
 */
export declare function askRecyclingAssistant(request: AskAssistantRequest, authToken?: string, appCheckToken?: string): Promise<AskAssistantResponse>;
//# sourceMappingURL=assistant.d.ts.map