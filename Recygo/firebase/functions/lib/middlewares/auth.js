"use strict";
/**
 * Middleware d'authentification et d'autorisation
 *
 * Vérifie le token Firebase, charge l'utilisateur,
 * et vérifie les rôles.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = verifyAuthToken;
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.requireOwner = requireOwner;
const firebase_1 = require("../firebase");
const errors_1 = require("../utils/errors");
/**
 * Extrait le token Bearer du header Authorization
 */
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new errors_1.AuthError('Token manquant', 'Header Authorization requis (Bearer <token>)');
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new errors_1.AuthError('Format de token invalide', 'Utilisez: Authorization: Bearer <token>');
    }
    return parts[1];
}
/**
 * Vérifie le token Firebase et retourne le contexte utilisateur
 */
async function verifyAuthToken(token) {
    try {
        const auth = (0, firebase_1.getAuth)();
        const decodedToken = await auth.verifyIdToken(token);
        const firestore = (0, firebase_1.getFirestore)();
        const userDoc = await firestore.collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) {
            throw new errors_1.AuthError('Utilisateur introuvable', 'Le compte associé à ce token n\'existe pas');
        }
        const userData = userDoc.data();
        return {
            uid: decodedToken.uid,
            email: decodedToken.email || userData.email,
            role: (decodedToken.role || userData.role),
            user: userData,
            token: decodedToken,
        };
    }
    catch (error) {
        if (error instanceof errors_1.AuthError)
            throw error;
        (0, errors_1.logError)('verifyAuthToken', error, { tokenPrefix: token.substring(0, 10) });
        throw new errors_1.AuthError('Token invalide ou expiré', 'Veuillez vous reconnecter');
    }
}
/**
 * Middleware : vérifie que l'utilisateur est authentifié
 */
function requireAuth(handler) {
    return async (req, res) => {
        try {
            const token = extractToken(req);
            const context = await verifyAuthToken(token);
            await handler(context, req, res);
        }
        catch (error) {
            if (error instanceof errors_1.AuthError) {
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
function requireRole(...roles) {
    return (handler) => {
        return requireAuth(async (context, req, res) => {
            if (!roles.includes(context.role)) {
                throw new errors_1.ForbiddenError('Accès interdit', `Rôle requis: ${roles.join(' ou ')}. Rôle actuel: ${context.role}`);
            }
            await handler(context, req, res);
        });
    };
}
/**
 * Middleware : vérifie que l'utilisateur est le propriétaire de la ressource
 */
function requireOwner(resourcePath) {
    return (handler) => {
        return requireAuth(async (context, req, res) => {
            const resourceId = req.params?.id || req.body?.resourceId;
            if (!resourceId) {
                throw new errors_1.ForbiddenError('ID de ressource requis');
            }
            const firestore = (0, firebase_1.getFirestore)();
            const doc = await firestore.collection(resourcePath).doc(resourceId).get();
            if (!doc.exists) {
                res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ressource introuvable' } });
                return;
            }
            const data = doc.data();
            if (data?.userId !== context.uid && context.role !== 'admin') {
                throw new errors_1.ForbiddenError('Vous n\'êtes pas le propriétaire de cette ressource');
            }
            await handler(context, req, res);
        });
    };
}
//# sourceMappingURL=auth.js.map