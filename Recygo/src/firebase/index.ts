/**
 * Initialisation Firebase Client — RecyGo CI
 *
 * Initialise Firebase App avec Firestore, Authentication et Storage
 * pour utilisation côté client (Expo / React Native)
 */

// Polyfills requis pour utiliser Firebase JS SDK dans React Native / Expo
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import FIREBASE_CONFIG from '@/config/firebase';
import Constants from 'expo-constants';

// ═════════════════════════════════════════════════════════════════════
// INITIALISATION
// ═════════════════════════════════════════════════════════════════════

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage | undefined;

// Éviter les initialisations multiples
if (!getApps().length) {
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
  try {
    storage = getStorage(app);
  } catch (e) {
    // Storage may be unavailable in some lightweight environments — ignore.
    storage = undefined;
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  try {
    storage = getStorage(app);
  } catch (e) {
    storage = undefined;
  }
}

// ═════════════════════════════════════════════════════════════════════
// MODE ÉMULATEUR (développement)
// ═════════════════════════════════════════════════════════════════════

const runtimeEnv = { ...Constants.expoConfig?.extra, ...process.env };
const USE_EMULATOR = runtimeEnv.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (USE_EMULATOR) {
  // Connect Auth emulator
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('[Firebase] Mode émulateur activé (Auth)');
  } catch (e) {
    console.warn('[Firebase] Impossible de connecter l\'émulateur Auth:', e);
  }

  // Connect Firestore emulator
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('[Firebase] Mode émulateur activé (Firestore)');
  } catch (e) {
    console.warn('[Firebase] Impossible de connecter l\'émulateur Firestore:', e);
  }

  // Connect Storage emulator (optional)
  if (storage) {
    try {
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('[Firebase] Mode émulateur activé (Storage)');
    } catch (e) {
      console.warn('[Firebase] Impossible de connecter l\'émulateur Storage:', e);
    }
  }
}

export { app, auth, db, storage };
export default { app, auth, db, storage };

