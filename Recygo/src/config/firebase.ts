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
const missingKeys = REQUIRED_KEYS.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
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
}

// ─── Configuration ──────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export default FIREBASE_CONFIG;
