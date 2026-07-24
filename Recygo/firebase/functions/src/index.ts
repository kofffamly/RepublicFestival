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
 * Body : { message: string, conversationHistory?: Array<{role, content}>, userId?: string }
 */
export const askAssistant = functions
  .runWith({
    memory: '512MB',
    timeoutSeconds: 60,
    secrets: ['GEMINI_API_KEY'],
  })
  .https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Méthode non autorisée. Utilisez POST.' } });
      return;
    }

    try {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS' as string) {
        res.status(204).send('');
        return;
      }

      const validatedRequest = validateAssistantRequest(req.body || {});
      const result = await askRecyclingAssistant(validatedRequest);

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
