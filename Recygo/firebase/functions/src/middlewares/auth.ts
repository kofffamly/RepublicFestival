/**
 * Middleware d'authentification et d'autorisation
 *
 * Vérifie le token Firebase, charge l'utilisateur,
 * et vérifie les rôles.
 */

import * as functions from 'firebase-functions/v1';
import { getAuth, getFirestore } from '../firebase';
import { admin } from '../firebase/admin';
import { AuthError, ForbiddenError, logError } from '../utils/errors';
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
 * Extrait le token Bearer du header Authorization
 */
function extractToken(req: functions.https.Request): string {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AuthError('Token manquant', 'Header Authorization requis (Bearer <token>)');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new AuthError('Format de token invalide', 'Utilisez: Authorization: Bearer <token>');
  }

  return parts[1];
}

/**
 * Vérifie le token Firebase et retourne le contexte utilisateur
 */
export async function verifyAuthToken(token: string): Promise<AuthContext> {
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);

    const firestore = getFirestore();
    const userDoc = await firestore.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      throw new AuthError('Utilisateur introuvable', 'Le compte associé à ce token n\'existe pas');
    }

    const userData = userDoc.data() as User;

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || userData.email,
      role: (decodedToken.role || userData.role) as UserRole,
      user: userData,
      token: decodedToken as unknown as admin.auth.UserRecord,
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;

    logError('verifyAuthToken', error as Error, { tokenPrefix: token.substring(0, 10) });
    throw new AuthError(
      'Token invalide ou expiré',
      'Veuillez vous reconnecter'
    );
  }
}

/**
 * Middleware : vérifie que l'utilisateur est authentifié
 */
export function requireAuth(
  handler: (context: AuthContext, req: functions.https.Request, res: functions.Response) => Promise<void> | void
) {
  return async (req: functions.https.Request, res: functions.Response): Promise<void> => {
    try {
      const token = extractToken(req);
      const context = await verifyAuthToken(token);
      await handler(context, req, res);
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erreur d\'authentification',
        },
      });
    }
  };
}

/**
 * Middleware : vérifie que l'utilisateur a un rôle spécifique
 */
export function requireRole(...roles: UserRole[]) {
  return (
    handler: (context: AuthContext, req: functions.https.Request, res: functions.Response) => Promise<void> | void
  ) => {
    return requireAuth(async (context, req, res) => {
      if (!roles.includes(context.role)) {
        throw new ForbiddenError(
          'Accès interdit',
          `Rôle requis: ${roles.join(' ou ')}. Rôle actuel: ${context.role}`
        );
      }
      await handler(context, req, res);
    });
  };
}

/**
 * Middleware : vérifie que l'utilisateur est le propriétaire de la ressource
 */
export function requireOwner(resourcePath: string) {
  return (
    handler: (context: AuthContext, req: functions.https.Request, res: functions.Response) => Promise<void> | void
  ) => {
    return requireAuth(async (context, req, res) => {
      const resourceId = req.params?.id || req.body?.resourceId;
      if (!resourceId) {
        throw new ForbiddenError('ID de ressource requis');
      }

      const firestore = getFirestore();
      const doc = await firestore.collection(resourcePath).doc(resourceId).get();

      if (!doc.exists) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ressource introuvable' } });
        return;
      }

      const data = doc.data();
      if (data?.userId !== context.uid && context.role !== 'admin') {
        throw new ForbiddenError('Vous n\'êtes pas le propriétaire de cette ressource');
      }

      await handler(context, req, res);
    });
  };
}
