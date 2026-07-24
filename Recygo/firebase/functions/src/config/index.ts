/**
 * Configuration centralisée de RecyGo CI
 *
 * Charge les variables d'environnement et fournit une configuration typée.
 * Supporte les environnements development et production.
 */

// ─── Types de configuration ─────────────────────────────────────────
export interface FirebaseConfig {
  projectId: string;
  storageBucket: string;
  databaseURL?: string;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
}

export interface AppConfig {
  env: 'development' | 'production';
  locale: string;
  timezone: string;
  maxImageSizeMB: number;
  cleanupDaysThreshold: number;
}

// ─── Lecture des variables d'environnement ─────────────────────────
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${key}`);
  }
  return value;
}

function getEnvInt(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue !== undefined) return defaultValue;
  if (!value) throw new Error(`Variable d'environnement manquante: ${key}`);
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) throw new Error(`Variable invalide (doit être un entier): ${key}`);
  return parsed;
}

function getEnvFloat(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue !== undefined) return defaultValue;
  if (!value) throw new Error(`Variable d'environnement manquante: ${key}`);
  const parsed = parseFloat(value);
  if (isNaN(parsed)) throw new Error(`Variable invalide (doit être un nombre): ${key}`);
  return parsed;
}

// ─── Configuration exposée ─────────────────────────────────────────
export const appConfig: AppConfig = {
  env: (getEnv('NODE_ENV', 'development') as AppConfig['env']),
  locale: getEnv('FUNCTIONS_LOCALE', 'fr-CI'),
  timezone: getEnv('FUNCTIONS_TIMEZONE', 'Africa/Abidjan'),
  maxImageSizeMB: getEnvInt('MAX_IMAGE_SIZE_MB', 10),
  cleanupDaysThreshold: getEnvInt('CLEANUP_DAYS_THRESHOLD', 90),
};

export const isDev = (): boolean => appConfig.env === 'development';
export const isProd = (): boolean => appConfig.env === 'production';

export const firebaseConfig: FirebaseConfig = {
  projectId: getEnv('FIREBASE_PROJECT_ID', 'recygo-ci-dev'),
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET', 'recygo-ci-dev.appspot.com'),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

export const geminiConfig: GeminiConfig = {
  apiKey: getEnv('GEMINI_API_KEY', isDev() ? 'dev-mode-no-api-key' : undefined),
  model: getEnv('GEMINI_MODEL', 'gemini-2.0-flash-exp'),
  maxTokens: getEnvInt('GEMINI_MAX_TOKENS', 4096),
  temperature: getEnvFloat('GEMINI_TEMPERATURE', 0.3),
  topP: getEnvFloat('GEMINI_TOP_P', 0.95),
  topK: getEnvInt('GEMINI_TOP_K', 40),
};

export default {
  firebase: firebaseConfig,
  gemini: geminiConfig,
  app: appConfig,
  isDev,
  isProd,
};
