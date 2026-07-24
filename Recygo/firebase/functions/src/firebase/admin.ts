/**
 * Initialisation Firebase Admin SDK
 *
 * Utilise les émulateurs en développement.
 * Singleton réutilisable dans toutes les fonctions.
 */

import * as admin from 'firebase-admin';
import { firebaseConfig, isDev } from '../config';

let app: admin.app.App | null = null;

/**
 * Obtient l'instance Firebase Admin (singleton)
 */
export function getFirebaseApp(): admin.app.App {
  if (app) return app;

  app = admin.initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    credential: admin.credential.applicationDefault(),
  });

  // En développement, utiliser les émulateurs
  if (isDev()) {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
    process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST = 'localhost:5001';
  }

  return app;
}

/**
 * Obtient Firestore (initialisé)
 */
export function getFirestore(): admin.firestore.Firestore {
  return getFirebaseApp().firestore();
}

/**
 * Obtient Auth (initialisé)
 */
export function getAuth(): admin.auth.Auth {
  return getFirebaseApp().auth();
}

/**
 * Obtient Storage (initialisé)
 */
export function getStorage(): admin.storage.Storage {
  return getFirebaseApp().storage();
}

export { admin };
export default getFirebaseApp;
