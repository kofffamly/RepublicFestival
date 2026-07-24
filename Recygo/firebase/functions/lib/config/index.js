"use strict";
/**
 * Configuration centralisée de RecyGo CI
 *
 * Charge les variables d'environnement et fournit une configuration typée.
 * Supporte les environnements development et production.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiConfig = exports.firebaseConfig = exports.isProd = exports.isDev = exports.appConfig = void 0;
// ─── Lecture des variables d'environnement ─────────────────────────
function getEnv(key, defaultValue) {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Variable d'environnement manquante: ${key}`);
    }
    return value;
}
function getEnvInt(key, defaultValue) {
    const value = process.env[key];
    if (!value && defaultValue !== undefined)
        return defaultValue;
    if (!value)
        throw new Error(`Variable d'environnement manquante: ${key}`);
    const parsed = parseInt(value, 10);
    if (isNaN(parsed))
        throw new Error(`Variable invalide (doit être un entier): ${key}`);
    return parsed;
}
function getEnvFloat(key, defaultValue) {
    const value = process.env[key];
    if (!value && defaultValue !== undefined)
        return defaultValue;
    if (!value)
        throw new Error(`Variable d'environnement manquante: ${key}`);
    const parsed = parseFloat(value);
    if (isNaN(parsed))
        throw new Error(`Variable invalide (doit être un nombre): ${key}`);
    return parsed;
}
// ─── Configuration exposée ─────────────────────────────────────────
exports.appConfig = {
    env: getEnv('NODE_ENV', 'development'),
    locale: getEnv('FUNCTIONS_LOCALE', 'fr-CI'),
    timezone: getEnv('FUNCTIONS_TIMEZONE', 'Africa/Abidjan'),
    maxImageSizeMB: getEnvInt('MAX_IMAGE_SIZE_MB', 10),
    cleanupDaysThreshold: getEnvInt('CLEANUP_DAYS_THRESHOLD', 90),
};
const isDev = () => exports.appConfig.env === 'development';
exports.isDev = isDev;
const isProd = () => exports.appConfig.env === 'production';
exports.isProd = isProd;
exports.firebaseConfig = {
    projectId: getEnv('FIREBASE_PROJECT_ID', 'recygo-ci-dev'),
    storageBucket: getEnv('FIREBASE_STORAGE_BUCKET', 'recygo-ci-dev.appspot.com'),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
};
exports.geminiConfig = {
    apiKey: getEnv('GEMINI_API_KEY', (0, exports.isDev)() ? 'dev-mode-no-api-key' : undefined),
    model: getEnv('GEMINI_MODEL', 'gemini-2.0-flash-exp'),
    maxTokens: getEnvInt('GEMINI_MAX_TOKENS', 4096),
    temperature: getEnvFloat('GEMINI_TEMPERATURE', 0.3),
    topP: getEnvFloat('GEMINI_TOP_P', 0.95),
    topK: getEnvInt('GEMINI_TOP_K', 40),
};
exports.default = {
    firebase: exports.firebaseConfig,
    gemini: exports.geminiConfig,
    app: exports.appConfig,
    isDev: exports.isDev,
    isProd: exports.isProd,
};
//# sourceMappingURL=index.js.map