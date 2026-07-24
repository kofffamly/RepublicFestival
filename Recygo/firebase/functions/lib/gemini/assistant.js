"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.askRecyclingAssistant = askRecyclingAssistant;
const client_1 = require("./client");
const firebase_1 = require("../firebase");
const prompts_1 = require("../prompts");
const errors_1 = require("../utils/errors");
const admin = __importStar(require("firebase-admin"));
// ═════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═════════════════════════════════════════════════════════════════════
const ASSISTANT_TIMEOUT_MS = 25000;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20;
const MAX_HISTORY_MESSAGES = 10;
// ═════════════════════════════════════════════════════════════════════
// AUTHENTIFICATION
// ═════════════════════════════════════════════════════════════════════
/**
 * Vérifie le token Firebase et retourne le contexte utilisateur
 */
async function verifyAuth(token) {
    try {
        const auth = (0, firebase_1.getAuth)();
        const decoded = await auth.verifyIdToken(token);
        return {
            uid: decoded.uid,
            email: decoded.email || 'inconnu',
            authenticated: true,
        };
    }
    catch (error) {
        (0, errors_1.logError)('verifyAuth', error, { tokenPrefix: token.substring(0, 10) });
        throw new errors_1.AuthError('Token invalide ou expiré', 'Veuillez vous reconnecter');
    }
}
/**
 * Vérifie Firebase App Check
 */
async function verifyAppCheck(appCheckToken, uid) {
    if (!appCheckToken) {
        // Mode développement : on tolère l'absence d'App Check
        if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
            return true;
        }
        (0, errors_1.logError)('verifyAppCheck', new Error('AppCheck token manquant'), { uid });
        return false;
    }
    try {
        const appCheck = admin.appCheck();
        await appCheck.verifyToken(appCheckToken);
        return true;
    }
    catch (error) {
        (0, errors_1.logError)('verifyAppCheck', error, { uid });
        return false;
    }
}
// ═════════════════════════════════════════════════════════════════════
// RATE LIMITING
// ═════════════════════════════════════════════════════════════════════
/**
 * Vérifie le rate limiting via Firestore (sliding window)
 * Stocke un timestamp par requête dans /rateLimits/{uid}/requests/{docId}
 */
async function checkRateLimit(uid) {
    const firestore = (0, firebase_1.getFirestore)();
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    try {
        const userRequestsRef = firestore
            .collection('rateLimits')
            .doc(uid)
            .collection('requests')
            .where('timestamp', '>=', windowStart);
        const snapshot = await userRequestsRef.get();
        if (snapshot.size >= RATE_LIMIT_MAX_REQUESTS) {
            const oldestRequest = snapshot.docs[0];
            const retryAfter = Math.ceil((oldestRequest.data().timestamp + RATE_LIMIT_WINDOW_MS - now) / 1000);
            throw new errors_1.AppError(errors_1.ErrorCodes.RATE_LIMITED, 'Trop de requêtes. Veuillez patienter.', `Limite: ${RATE_LIMIT_MAX_REQUESTS} requêtes par minute. Réessayez dans ${retryAfter} seconde(s).`, 429);
        }
        // Enregistrer la requête
        await firestore
            .collection('rateLimits')
            .doc(uid)
            .collection('requests')
            .add({ timestamp: now });
        // Nettoyer les entrées anciennes (une fois sur 10)
        if (snapshot.size > 0 && Math.random() < 0.1) {
            const oldRequests = await firestore
                .collection('rateLimits')
                .doc(uid)
                .collection('requests')
                .where('timestamp', '<', windowStart)
                .get();
            const batch = firestore.batch();
            oldRequests.docs.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();
        }
    }
    catch (error) {
        if (error instanceof errors_1.AppError)
            throw error;
        // En cas d'erreur Firestore, fail open pour ne pas bloquer l'utilisateur
        (0, errors_1.logError)('checkRateLimit', error, { uid });
    }
}
// ═════════════════════════════════════════════════════════════════════
// VALIDATION
// ═════════════════════════════════════════════════════════════════════
function validateRequest(request) {
    if (!request.message || typeof request.message !== 'string') {
        throw new errors_1.ValidationError('Message invalide', 'Le message doit être une chaîne de caractères');
    }
    const trimmed = request.message.trim();
    if (trimmed.length === 0) {
        throw new errors_1.ValidationError('Message vide', 'Veuillez écrire une question pour l\'assistant RecyGo');
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
        throw new errors_1.ValidationError('Message trop long', `Le message ne doit pas dépasser ${MAX_MESSAGE_LENGTH} caractères (${trimmed.length} actuellement)`);
    }
    // Protection XSS basique
    const xssPattern = /<script|javascript:|on\w+\s*=|alert\(|prompt\(|confirm\(/i;
    if (xssPattern.test(trimmed)) {
        throw new errors_1.ValidationError('Contenu non autorisé', 'Le message contient du code non autorisé');
    }
}
// ═════════════════════════════════════════════════════════════════════
// DÉTECTION HORS-SUJET
// ═════════════════════════════════════════════════════════════════════
/**
 * Détection locale par mots-clés et patterns
 */
function detectOffTopicLocal(message) {
    const lowerMessage = message.toLowerCase();
    // 1. Vérifier les patterns hors-sujet
    for (const pattern of prompts_1.OFF_TOPIC_PATTERNS) {
        if (pattern.test(lowerMessage)) {
            return {
                isOffTopic: true,
                confidence: 95,
                reason: `Pattern détecté: ${pattern}`,
            };
        }
    }
    // 2. Vérifier si au moins un mot-clé de recyclage est présent
    const hasKeyword = prompts_1.RECYCLING_KEYWORDS.some((keyword) => lowerMessage.includes(keyword.toLowerCase()));
    // 3. Si mots-clés trouvés, c'est probablement dans le domaine
    if (hasKeyword) {
        return {
            isOffTopic: false,
            confidence: 85,
        };
    }
    // 4. Si message trop court, on demande à Gemini
    if (message.length < 15) {
        return null; // Nécessite vérification Gemini
    }
    // 5. Sinon, probablement hors-sujet mais on vérifie avec Gemini
    return null;
}
/**
 * Détection hors-sujet via Gemini (fallback)
 */
async function detectOffTopicGemini(message) {
    try {
        const model = (0, client_1.getGeminiModel)();
        const prompt = prompts_1.OFF_TOPIC_GEMINI_PROMPT.replace('{message}', message.replace(/"/g, "'"));
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        // Parser le JSON
        const cleanText = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').trim();
        const parsed = JSON.parse(cleanText);
        return {
            isOffTopic: parsed.isOffTopic === true,
            confidence: Math.min(Math.max(parsed.confidence || 50, 0), 100),
            reason: parsed.reason,
        };
    }
    catch {
        // En cas d'erreur, on laisse passer (fail open)
        return { isOffTopic: false, confidence: 50 };
    }
}
// ═════════════════════════════════════════════════════════════════════
// OPTIMISATION : HISTORIQUE
// ═════════════════════════════════════════════════════════════════════
/**
 * Résume et nettoie l'historique de conversation
 */
function optimizeHistory(history) {
    if (!history || history.length === 0)
        return [];
    // 1. Limiter le nombre de messages
    const messages = history.slice(-MAX_HISTORY_MESSAGES);
    // 2. Ne garder que user/assistant
    const filtered = messages.filter((msg) => msg.role === 'user' || msg.role === 'assistant');
    // 3. Convertir au format Gemini
    return filtered.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content.substring(0, 1000) }],
    }));
}
function parseResponse(text) {
    const result = {
        reply: text,
        context: {},
        sources: [],
    };
    try {
        // Nettoyer les délimiteurs markdown
        const cleanText = text
            .replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1')
            .trim();
        const parsed = JSON.parse(cleanText);
        if (typeof parsed.reply === 'string' && parsed.reply.length > 0) {
            result.reply = parsed.reply;
        }
        if (parsed.context && typeof parsed.context === 'object') {
            result.context = parsed.context;
            if (Array.isArray(parsed.context.suggestedActions)) {
                result.sources = parsed.context.suggestedActions.slice(0, 5);
            }
        }
    }
    catch {
        // JSON invalide = on garde le texte brut
        // Nettoyer les guillemets superflus
        result.reply = text.replace(/^["']|["']$/g, '').trim();
    }
    // Nettoyage final
    result.reply = result.reply
        .replace(/\*\*(.*?)\*\*/g, '$1') // Enlever le markdown gras
        .replace(/__(.*?)__/g, '$1') // Enlever le markdown souligné
        .trim();
    return result;
}
// ═════════════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE
// ═════════════════════════════════════════════════════════════════════
/**
 * Traite une question et retourne une réponse de l'assistant RecyGo
 *
 * @param request - La requête contenant le message et optionnellement l'historique
 * @param authToken - Token Bearer Firebase Authentication
 * @param appCheckToken - Token Firebase App Check
 * @returns AskAssistantResponse
 */
async function askRecyclingAssistant(request, authToken, appCheckToken) {
    const startTime = Date.now();
    let authContext = { uid: 'anonymous', email: 'inconnu', authenticated: false };
    try {
        // ═══ 1. Authentification ═══
        if (authToken) {
            authContext = await verifyAuth(authToken);
        }
        else if (process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV === 'development') {
            // En émulateur, on tolère l'anonyme
            authContext = { uid: 'dev-user', email: 'dev@recygo.ci', authenticated: true };
        }
        else {
            throw new errors_1.AuthError('Authentification requise', 'Token Bearer requis');
        }
        // ═══ 2. App Check ═══
        const appCheckValid = await verifyAppCheck(appCheckToken, authContext.uid);
        if (!appCheckValid && !process.env.FUNCTIONS_EMULATOR) {
            throw new errors_1.AuthError('Vérification de sécurité échouée', 'AppCheck token invalide');
        }
        // ═══ 3. Rate Limiting ═══
        await checkRateLimit(authContext.uid);
        // ═══ 4. Validation ═══
        validateRequest(request);
        // ═══ 5. Détection hors-sujet ═══
        let offTopicResult = detectOffTopicLocal(request.message);
        // Si la détection locale n'est pas concluante, utiliser Gemini
        if (offTopicResult === null) {
            offTopicResult = await detectOffTopicGemini(request.message);
        }
        if (offTopicResult.isOffTopic && offTopicResult.confidence >= 70) {
            const elapsed = Date.now() - startTime;
            return {
                success: true,
                data: {
                    reply: 'Désolé, je suis spécialisé dans les questions sur le recyclage, ' +
                        'le tri des déchets et l\'environnement. 🎯\n\n' +
                        'Pourrais-je vous aider avec :\n' +
                        '• Comment trier vos déchets ?\n' +
                        '• Les déchets recyclables en Côte d\'Ivoire\n' +
                        '• Comment utiliser l\'application RecyGo\n' +
                        '• L\'impact environnemental du recyclage\n\n' +
                        'N\'hésitez pas à me poser une question sur ces sujets !',
                    context: {
                        offTopicDetected: true,
                        confidence: offTopicResult.confidence,
                        suggestedTopics: [
                            'Tri des déchets en Côte d\'Ivoire',
                            'Déchets recyclables',
                            'Application RecyGo',
                            'Impact environnemental',
                        ],
                    },
                },
                processingTimeMs: elapsed,
            };
        }
        // ═══ 6. Optimiser l'historique ═══
        const geminiHistory = optimizeHistory(request.conversationHistory);
        // ═══ 7. Appeler Gemini ═══
        const model = (0, client_1.getGeminiModel)();
        const chat = model.startChat({
            history: geminiHistory,
            systemInstruction: {
                role: 'user',
                parts: [{ text: prompts_1.ASSISTANT_SYSTEM_PROMPT }],
            },
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.3,
                topP: 0.9,
                topK: 32,
            },
        });
        // Timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new errors_1.TimeoutError('askAssistant', ASSISTANT_TIMEOUT_MS));
            }, ASSISTANT_TIMEOUT_MS);
        });
        const result = await Promise.race([
            chat.sendMessage(request.message),
            timeoutPromise,
        ]);
        const response = result.response;
        const text = response.text();
        // ═══ 8. Vérifier si bloqué par les filtres de sécurité ═══
        if (!text || text.trim().length === 0) {
            const blockReason = response.promptFeedback?.blockReason;
            if (blockReason) {
                return {
                    success: false,
                    error: {
                        code: errors_1.ErrorCodes.GEMINI_SAFETY_BLOCKED,
                        message: 'La réponse a été filtrée pour des raisons de sécurité.',
                        details: `Raison: ${blockReason}`,
                    },
                    processingTimeMs: Date.now() - startTime,
                };
            }
        }
        // ═══ 9. Parser la réponse ═══
        const parsed = parseResponse(text);
        // ═══ 10. Journaliser la métrique ═══
        if (response.usageMetadata) {
            console.log(`[Assistant] Tokens utilisés: ${response.usageMetadata.totalTokenCount || 0}`);
        }
        const elapsed = Date.now() - startTime;
        console.log(`[Assistant] Succès | uid=${authContext.uid} | temps=${elapsed}ms`);
        return {
            success: true,
            data: {
                reply: parsed.reply,
                context: parsed.context,
                sources: parsed.sources,
            },
            processingTimeMs: elapsed,
        };
    }
    catch (error) {
        // ═══ Gestion des erreurs ═══
        const elapsed = Date.now() - startTime;
        // Erreur opérationnelle connue
        if (error instanceof errors_1.AppError) {
            if (error.statusCode === 429) {
                console.warn(`[Assistant] Rate limit | uid=${authContext.uid}`);
            }
            return {
                success: false,
                error: {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                },
                processingTimeMs: elapsed,
            };
        }
        // Erreur inattendue (Gemini API, réseau, etc.)
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        // Détection des erreurs Gemini spécifiques
        if (errorMessage.includes('SAFETY')) {
            return {
                success: false,
                error: {
                    code: errors_1.ErrorCodes.GEMINI_SAFETY_BLOCKED,
                    message: 'La requête a été bloquée par les filtres de sécurité.',
                },
                processingTimeMs: elapsed,
            };
        }
        if (errorMessage.includes('quota') || errorMessage.includes('429')) {
            return {
                success: false,
                error: {
                    code: errors_1.ErrorCodes.GEMINI_QUOTA_EXCEEDED,
                    message: 'Le service est temporairement saturé. Veuillez réessayer dans quelques instants.',
                },
                processingTimeMs: elapsed,
            };
        }
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            return {
                success: false,
                error: {
                    code: errors_1.ErrorCodes.GEMINI_API_ERROR,
                    message: 'Impossible de contacter le service d\'intelligence artificielle. Vérifiez votre connexion.',
                },
                processingTimeMs: elapsed,
            };
        }
        // Erreur générique
        (0, errors_1.logError)('askRecyclingAssistant', error, {
            uid: authContext.uid,
            messageLength: request.message?.length,
        });
        return {
            success: false,
            error: {
                code: errors_1.ErrorCodes.INTERNAL_ERROR,
                message: 'Désolé, une erreur est survenue. Veuillez réessayer.',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
            },
            processingTimeMs: elapsed,
        };
    }
}
//# sourceMappingURL=assistant.js.map