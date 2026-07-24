/**
 * Point d'entrée des Cloud Functions Firebase pour RecyGo CI
 *
 * Ce fichier exporte les fonctions cloud deployables :
 * - analyse d'image de déchet (Gemini AI)
 * - assistant IA conversationnel
 * - notifications push
 * - inscriptions utilisateurs
 * - webhooks externes
 */
import * as functions from 'firebase-functions/v1';
/**
 * Analyse une image de déchet via Gemini AI
 *
 * POST /analyzeWaste
 * Body : { imageBase64: string, mimeType: string, userId?: string }
 */
export declare const analyzeWaste: functions.HttpsFunction;
/**
 * Pose une question à l'assistant IA RecyGo
 *
 * POST /askAssistant
 * Headers:
 *   Authorization: Bearer <token>
 *   X-Firebase-AppCheck: <appCheckToken>
 * Body : { message: string, conversationHistory?: Array<{role, content}>, userId?: string }
 *
 * Sécurité :
 * - Firebase Authentication (Bearer token)
 * - Firebase App Check (header optionnel en dev)
 * - Rate limiting (20 req/min par utilisateur)
 * - Validation stricte des entrées
 * - Protection XSS
 */
export declare const askAssistant: functions.HttpsFunction;
/**
 * Crée un nouvel utilisateur (inscription)
 *
 * POST /createUser
 * Body : { email, password, displayName, role }
 */
export declare const createUser: functions.HttpsFunction;
/**
 * Supprime un utilisateur
 *
 * POST /deleteUser
 * Body : { uid }
 */
export declare const deleteUser: functions.HttpsFunction;
/**
 * Déclenché quand un nouvel utilisateur Firebase Auth est créé
 * Ajoute un document de base dans Firestore
 */
export declare const onUserCreated: functions.CloudFunction<import("firebase-admin/auth").UserRecord>;
/**
 * Déclenché quand un utilisateur Firebase Auth est supprimé
 * Nettoie les données Firestore
 */
export declare const onUserDeleted: functions.CloudFunction<import("firebase-admin/auth").UserRecord>;
/**
 * Endpoint de vérification de santé
 *
 * GET /health
 */
export declare const health: functions.HttpsFunction;
//# sourceMappingURL=index.d.ts.map