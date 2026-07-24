/**
 * Configuration Firebase client — RecyGo CI
 *
 * Centralise l'initialisation Firebase pour toute l'application.
 * Utilise les variables d'environnement Expo (EXPO_PUBLIC_*).
 * Aucune valeur codée en dur — les variables doivent être définies
 * dans le fichier .env.local ou l'environnement de déploiement.
 */

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
import type { FirebaseOptions } from 'firebase/app';

const missingKeys = REQUIRED_KEYS.filter((key) => !process.env[key]);

// If running with the local Firebase emulator, allow missing production keys
// so the app can run for local demos. Production builds should still provide
// the real keys — this guard only activates when EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true'.
const USE_FIREBASE_EMULATOR = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
const USE_DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

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
} else if (missingKeys.length > 0 && process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  // When using the emulator, log a clear warning and continue with placeholders.
  // This keeps the app running for demos and local development.
  // eslint-disable-next-line no-console
  console.warn('[DEV_MODE] Firebase prod keys missing but emulator mode is enabled. Continuing with emulator settings.');
}

// ─── Configuration ──────────────────────────────────────────────────
const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default FIREBASE_CONFIG;
