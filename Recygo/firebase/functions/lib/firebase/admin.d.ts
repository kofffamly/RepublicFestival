/**
 * Initialisation Firebase Admin SDK
 *
 * Utilise les émulateurs en développement.
 * Singleton réutilisable dans toutes les fonctions.
 */
import * as admin from 'firebase-admin';
/**
 * Obtient l'instance Firebase Admin (singleton)
 */
export declare function getFirebaseApp(): admin.app.App;
/**
 * Obtient Firestore (initialisé)
 */
export declare function getFirestore(): admin.firestore.Firestore;
/**
 * Obtient Auth (initialisé)
 */
export declare function getAuth(): admin.auth.Auth;
/**
 * Obtient Storage (initialisé)
 */
export declare function getStorage(): admin.storage.Storage;
export { admin };
export default getFirebaseApp;
//# sourceMappingURL=admin.d.ts.map