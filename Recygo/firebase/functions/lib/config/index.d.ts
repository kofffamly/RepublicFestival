/**
 * Configuration centralisée de RecyGo CI
 *
 * Charge les variables d'environnement et fournit une configuration typée.
 * Supporte les environnements development et production.
 */
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
export declare const appConfig: AppConfig;
export declare const isDev: () => boolean;
export declare const isProd: () => boolean;
export declare const firebaseConfig: FirebaseConfig;
export declare const geminiConfig: GeminiConfig;
declare const _default: {
    firebase: FirebaseConfig;
    gemini: GeminiConfig;
    app: AppConfig;
    isDev: () => boolean;
    isProd: () => boolean;
};
export default _default;
//# sourceMappingURL=index.d.ts.map