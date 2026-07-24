/**
 * Middleware d'authentification et d'autorisation
 *
 * Vérifie le token Firebase, charge l'utilisateur,
 * et vérifie les rôles.
 */
import * as functions from 'firebase-functions/v1';
import { admin } from '../firebase/admin';
import type { User, UserRole } from '../types';
/**
 * Contexte d'authentification ajouté à la requête
 */
export interface AuthContext {
    uid: string;
    email: string;
    role: UserRole;
    user: User;
    token: admin.auth.UserRecord;
}
/**
 * Vérifie le token Firebase et retourne le contexte utilisateur
 */
export declare function verifyAuthToken(token: string): Promise<AuthContext>;
/**
 * Middleware : vérifie que l'utilisateur est authentifié
 */
export declare function requireAuth(handler: (context: AuthContext, req: functions.https.Request, res: functions.Response) => Promise<void> | void): (req: functions.https.Request, res: functions.Response) => Promise<void>;
/**
 * Middleware : vérifie que l'utilisateur a un rôle spécifique
 */
export declare function requireRole(...roles: UserRole[]): (handler: (context: AuthContext, req: functions.https.Request, res: functions.Response) => Promise<void> | void) => (req: functions.https.Request, res: functions.Response) => Promise<void>;
/**
 * Middleware : vérifie que l'utilisateur est le propriétaire de la ressource
 */
export declare function requireOwner(resourcePath: string): (handler: (context: AuthContext, req: functions.https.Request, res: functions.Response) => Promise<void> | void) => (req: functions.https.Request, res: functions.Response) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map