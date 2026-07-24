/**
 * Configuration Firebase client
 *
 * Centralise l'initialisation Firebase pour toute l'application.
 * Utilise les variables d'environnement Expo ou les valeurs par défaut.
 */

// Ces valeurs seront remplacées par vos vraies clés Firebase
// via les variables d'environnement ou expo-firebase-config
const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoKey',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'recygo-ci-dev.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'recygo-ci-dev',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'recygo-ci-dev.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123',
};

export default FIREBASE_CONFIG;

