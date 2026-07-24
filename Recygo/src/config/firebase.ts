/**
 * Configuration Firebase client — RecyGo CI
 *
 * Centralise l'initialisation Firebase pour toute l'application.
 * Utilise les variables d'environnement Expo (EXPO_PUBLIC_*).
 * Aucune valeur codée en dur — les variables doivent être définies
 * dans le fichier .env ou l'environnement de déploiement.
 */

import Constants from 'expo-constants';
import type { FirebaseOptions } from 'firebase/app';

// ─── Variables d'environnement requises ─────────────────────────────
const REQUIRED_KEYS = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
] as const;

// ─── Validation au chargement ───────────────────────────────────────

const runtimeEnv = {
  ...Constants.expoConfig?.extra,
  ...process.env,
};

const missingKeys = REQUIRED_KEYS.filter((key) => !runtimeEnv[key]);

// If running with the local Firebase emulator, allow missing production keys
// so the app can run for local demos. Production builds should still provide
// the real keys — this guard only activates when EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true'.
const USE_FIREBASE_EMULATOR = runtimeEnv.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
const USE_DEMO_MODE = runtimeEnv.EXPO_PUBLIC_DEMO_MODE === 'true';

if (USE_DEMO_MODE && !USE_FIREBASE_EMULATOR) {
  throw new Error(
    'EXPO_PUBLIC_DEMO_MODE=true requires EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true. ' +
    'Disable demo mode to connect to the real Firebase project.'
  );
}

if (missingKeys.length > 0 && !USE_FIREBASE_EMULATOR) {
  const message = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '❌  Configuration Firebase invalide — variables manquantes',
    '',
    'Les variables d\'environnement suivantes ne sont pas définies :',
    ...missingKeys.map((k) => `  • ${k}`),
    '',
    '👉  Solution :',
    '   1. Copiez .env.example → .env',
    '   2. Remplissez les valeurs depuis :',
    '      https://console.firebase.google.com/project/recygo-ci-dev/settings/general/',
    '',
    '   Les valeurs se trouvent sous :',
    '   Project settings → Your apps → Web app → SDK setup / Config',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ].join('\n');

  // Throw a clear error instead of the cryptic "auth/invalid-api-key"
  throw new Error(message);
} else if (missingKeys.length > 0 && runtimeEnv.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  // When using the emulator, log a clear warning and continue with placeholders.
  // This keeps the app running for demos and local development.
  // eslint-disable-next-line no-console
  console.warn('[DEV_MODE] Firebase prod keys missing but emulator mode is enabled. Continuing with emulator settings.');
}

// ─── Configuration ──────────────────────────────────────────────────
const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: runtimeEnv.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: runtimeEnv.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: runtimeEnv.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    runtimeEnv.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    `${runtimeEnv.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: runtimeEnv.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: runtimeEnv.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: runtimeEnv.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default FIREBASE_CONFIG;
