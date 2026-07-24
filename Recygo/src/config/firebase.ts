/**
 * Configuration Firebase client — RecyGo CI
 *
 * Centralise l'initialisation Firebase pour toute l'application.
 * Utilise les variables d'environnement Expo (EXPO_PUBLIC_*).
 * Aucune valeur codée en dur — les variables doivent être définies
 * dans le fichier .env.local ou l'environnement de déploiement.
 */

const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export default FIREBASE_CONFIG;
