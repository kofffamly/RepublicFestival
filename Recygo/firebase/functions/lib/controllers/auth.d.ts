/**
 * Contrôleur d'authentification
 *
 * Gère les endpoints liés à l'authentification :
 * - Inscription
 * - Mise à jour du profil
 * - Gestion des rôles (custom claims)
 */
import * as functions from 'firebase-functions/v1';
/**
 * Crée un nouvel utilisateur (inscription)
 *
 * Endpoint : POST /createUser
 */
export declare function createUserHandler(req: functions.https.Request, res: functions.Response): Promise<void>;
/**
 * Supprime un utilisateur
 *
 * Endpoint : DELETE /deleteUser
 */
export declare function deleteUserHandler(req: functions.https.Request, res: functions.Response): Promise<void>;
//# sourceMappingURL=auth.d.ts.map