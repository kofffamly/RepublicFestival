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
import * as admin from 'firebase-admin';
import { analyzeWasteImage } from './gemini/analyze';
import { askRecyclingAssistant } from './gemini/assistant';
import { createUserHandler, deleteUserHandler } from './controllers/auth';
import { validateAnalyzeWasteRequest, validateAssistantRequest } from './validators';
import { getFirestore } from './firebase';
import { logError, ErrorCodes } from './utils/errors';

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
export const analyzeWaste = functions
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

      if (req.method === 'OPTIONS' as string) {
        res.status(204).send('');
        return;
      }

      const validatedRequest = validateAnalyzeWasteRequest(req.body || {});
      const result = await analyzeWasteImage(validatedRequest);

      res.json(result);
    } catch (error) {
      logError('analyzeWaste', error as Error);
      res.status(500).json({
        success: false,
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
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
export const askAssistant = functions
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
      const authHeader = req.headers.authorization as string | undefined;
      const appCheckHeader = req.headers['x-firebase-appcheck'] as string | undefined;

      const validatedRequest = validateAssistantRequest(req.body || {});

      // Passer les tokens de sécurité à la fonction d'assistant
      // Le token Bearer et AppCheck sont extraits dans askRecyclingAssistant
      const authToken = authHeader?.startsWith('Bearer ') ? authHeader : undefined;
      const result = await askRecyclingAssistant(
        validatedRequest,
        authToken,
        appCheckHeader
      );

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
    } catch (error) {
      logError('askAssistant', error as Error);
      res.status(500).json({
        success: false,
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
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
export const createUser = functions
  .runWith({
    memory: '256MB',
    timeoutSeconds: 30,
  })
  .https.onRequest(createUserHandler);

/**
 * Supprime un utilisateur
 *
 * POST /deleteUser
 * Body : { uid }
 */
export const deleteUser = functions
  .runWith({
    memory: '256MB',
    timeoutSeconds: 30,
  })
  .https.onRequest(deleteUserHandler);

// ═════════════════════════════════════════════════════════════════════
// FONCTIONS DÉCLENCHÉES (Firestore + Auth)
// ═════════════════════════════════════════════════════════════════════

/**
 * Déclenché quand un nouvel utilisateur Firebase Auth est créé
 * Ajoute un document de base dans Firestore
 */
export const onUserCreated = functions.auth
  .user()
  .onCreate(async (user) => {
    try {
      const db = getFirestore();
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
    } catch (error) {
      logError('onUserCreated', error as Error, { uid: user.uid });
    }
  });

/**
 * Déclenché quand un utilisateur Firebase Auth est supprimé
 * Nettoie les données Firestore
 */
export const onUserDeleted = functions.auth
  .user()
  .onDelete(async (user) => {
    try {
      const db = getFirestore();
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
    } catch (error) {
      logError('onUserDeleted', error as Error, { uid: user.uid });
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
export const health = functions
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
