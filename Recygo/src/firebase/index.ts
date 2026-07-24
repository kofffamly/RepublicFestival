/**
 * Initialisation Firebase Client — RecyGo CI
 *
 * Initialise Firebase App avec Firestore et Authentication
 * pour utilisation côté client (Expo / React Native)
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import FIREBASE_CONFIG from '@/config/firebase';

// ═════════════════════════════════════════════════════════════════════
// INITIALISATION
// ═════════════════════════════════════════════════════════════════════

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Éviter les initialisations multiples
if (!getApps().length) {
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

// ═════════════════════════════════════════════════════════════════════
// MODE ÉMULATEUR (développement)
// ═════════════════════════════════════════════════════════════════════

const USE_EMULATOR = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (USE_EMULATOR) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('[Firebase] Mode émulateur activé (Auth)');
  } catch (e) {
    console.warn('[Firebase] Impossible de connecter l\'émulateur:', e);
  }
}

export { app, auth, db };
export default { app, auth, db };

