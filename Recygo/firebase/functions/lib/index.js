"use strict";
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
exports.health = exports.onUserDeleted = exports.onUserCreated = exports.deleteUser = exports.createUser = exports.askAssistant = exports.analyzeWaste = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const analyze_1 = require("./gemini/analyze");
const assistant_1 = require("./gemini/assistant");
const auth_1 = require("./controllers/auth");
const validators_1 = require("./validators");
const firebase_1 = require("./firebase");
const errors_1 = require("./utils/errors");
// ═════════════════════════════════════════════════════════════════════
// INITIALISATION
// ═════════════════════════════════════════════════════════════════════
admin.initializeApp();
// ═════════════════════════════════════════════════════════════════════
// ANALYSE D'IMAGE (Gemini AI)
// ═════════════════════════════════════════════════════════════════════
/**
 * Analyse une image de déchet via Gemini AI
 *
 * POST /analyzeWaste
 * Body : { imageBase64: string, mimeType: string, userId?: string }
 */
exports.analyzeWaste = functions
    .runWith({
    memory: '1GB',
    timeoutSeconds: 120,
    secrets: ['GEMINI_API_KEY'],
})
    .https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Méthode non autorisée. Utilisez POST.' } });
        return;
    }
    try {
        // Validation CORS basique
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }
        const validatedRequest = (0, validators_1.validateAnalyzeWasteRequest)(req.body || {});
        const result = await (0, analyze_1.analyzeWasteImage)(validatedRequest);
        res.json(result);
    }
    catch (error) {
        (0, errors_1.logError)('analyzeWaste', error);
        res.status(500).json({
            success: false,
            error: {
                code: errors_1.ErrorCodes.INTERNAL_ERROR,
                message: 'Erreur interne lors de l\'analyse',
            },
        });
    }
});
// ═════════════════════════════════════════════════════════════════════
// ASSISTANT IA CONVERSATIONNEL
// ═════════════════════════════════════════════════════════════════════
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
exports.askAssistant = functions
    .runWith({
    memory: '512MB',
    timeoutSeconds: 60,
    secrets: ['GEMINI_API_KEY'],
})
    .https.onRequest(async (req, res) => {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Firebase-AppCheck');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Méthode non autorisée. Utilisez POST.' } });
        return;
    }
    try {
        // Extraire les tokens des headers
        const authHeader = req.headers.authorization;
        const appCheckHeader = req.headers['x-firebase-appcheck'];
        const validatedRequest = (0, validators_1.validateAssistantRequest)(req.body || {});
        // Passer les tokens de sécurité à la fonction d'assistant
        // Le token Bearer et AppCheck sont extraits dans askRecyclingAssistant
        const authToken = authHeader?.startsWith('Bearer ') ? authHeader : undefined;
        const result = await (0, assistant_1.askRecyclingAssistant)(validatedRequest, authToken, appCheckHeader);
        // Gérer les codes HTTP spécifiques
        if (!result.success && result.error) {
            switch (result.error.code) {
                case 'UNAUTHORIZED':
                    res.status(401).json(result);
                    return;
                case 'RATE_LIMITED':
                    res.status(429).json(result);
                    return;
                case 'VALIDATION_ERROR':
                    res.status(400).json(result);
                    return;
                default:
                    res.status(500).json(result);
                    return;
            }
        }
        res.json(result);
    }
    catch (error) {
        (0, errors_1.logError)('askAssistant', error);
        res.status(500).json({
            success: false,
            error: {
                code: errors_1.ErrorCodes.INTERNAL_ERROR,
                message: 'Erreur interne de l\'assistant',
            },
        });
    }
});
// ═════════════════════════════════════════════════════════════════════
// CRÉATION D'UTILISATEUR
// ═════════════════════════════════════════════════════════════════════
/**
 * Crée un nouvel utilisateur (inscription)
 *
 * POST /createUser
 * Body : { email, password, displayName, role }
 */
exports.createUser = functions
    .runWith({
    memory: '256MB',
    timeoutSeconds: 30,
})
    .https.onRequest(auth_1.createUserHandler);
/**
 * Supprime un utilisateur
 *
 * POST /deleteUser
 * Body : { uid }
 */
exports.deleteUser = functions
    .runWith({
    memory: '256MB',
    timeoutSeconds: 30,
})
    .https.onRequest(auth_1.deleteUserHandler);
// ═════════════════════════════════════════════════════════════════════
// FONCTIONS DÉCLENCHÉES (Firestore + Auth)
// ═════════════════════════════════════════════════════════════════════
/**
 * Déclenché quand un nouvel utilisateur Firebase Auth est créé
 * Ajoute un document de base dans Firestore
 */
exports.onUserCreated = functions.auth
    .user()
    .onCreate(async (user) => {
    try {
        const db = (0, firebase_1.getFirestore)();
        const now = admin.firestore.Timestamp.now();
        const userData = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Anonyme',
            role: 'citizen',
            createdAt: now,
            updatedAt: now,
            lastLoginAt: now,
            isActive: true,
            preferences: {
                language: 'fr',
                notificationsEnabled: true,
                emailNotifications: true,
                theme: 'light',
            },
        };
        await db.collection('users').doc(user.uid).set(userData, { merge: true });
        console.log(`[AUTH TRIGGER] Utilisateur créé: ${user.uid}`);
    }
    catch (error) {
        (0, errors_1.logError)('onUserCreated', error, { uid: user.uid });
    }
});
/**
 * Déclenché quand un utilisateur Firebase Auth est supprimé
 * Nettoie les données Firestore
 */
exports.onUserDeleted = functions.auth
    .user()
    .onDelete(async (user) => {
    try {
        const db = (0, firebase_1.getFirestore)();
        const batch = db.batch();
        // Supprimer les collections associées
        batch.delete(db.collection('users').doc(user.uid));
        batch.delete(db.collection('profiles').doc(user.uid));
        batch.delete(db.collection('notifications').doc(user.uid));
        // Collectes associées
        const collections = await db.collection('collections')
            .where('userId', '==', user.uid)
            .get();
        collections.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        console.log(`[AUTH TRIGGER] Données nettoyées pour: ${user.uid}`);
    }
    catch (error) {
        (0, errors_1.logError)('onUserDeleted', error, { uid: user.uid });
    }
});
// ═════════════════════════════════════════════════════════════════════
// WEBHOOK HEALTH
// ═════════════════════════════════════════════════════════════════════
/**
 * Endpoint de vérification de santé
 *
 * GET /health
 */
exports.health = functions
    .https
    .onRequest(async (req, res) => {
    res.json({
        status: 'ok',
        version: '1.0.0',
        app: 'RecyGo CI',
        timestamp: admin.firestore.Timestamp.now().toMillis(),
        uptime: process.uptime(),
    });
});
//# sourceMappingURL=index.js.map