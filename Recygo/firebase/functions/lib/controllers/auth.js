"use strict";
/**
 * Contrôleur d'authentification
 *
 * Gère les endpoints liés à l'authentification :
 * - Inscription
 * - Mise à jour du profil
 * - Gestion des rôles (custom claims)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserHandler = createUserHandler;
exports.deleteUserHandler = deleteUserHandler;
const firebase_1 = require("../firebase");
const admin_1 = require("../firebase/admin");
const errors_1 = require("../utils/errors");
/**
 * Crée un nouvel utilisateur (inscription)
 *
 * Endpoint : POST /createUser
 */
async function createUserHandler(req, res) {
    try {
        const { email, password, displayName, role } = req.body || {};
        if (!email || !password || !displayName || !role) {
            res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'email, password, displayName et role requis' },
            });
            return;
        }
        const auth = (0, firebase_1.getAuth)();
        const firestore = (0, firebase_1.getFirestore)();
        const now = admin_1.admin.firestore.Timestamp.now();
        // 1. Créer l'utilisateur dans Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
            emailVerified: false,
        });
        // 2. Définir le rôle dans les custom claims
        await auth.setCustomUserClaims(userRecord.uid, { role });
        // 3. Créer le document utilisateur dans Firestore
        const userData = {
            uid: userRecord.uid,
            email,
            displayName,
            role: role,
            createdAt: now,
            updatedAt: now,
            isActive: true,
            preferences: {
                language: 'fr',
                notificationsEnabled: true,
                emailNotifications: true,
                smsNotifications: false,
                theme: 'light',
            },
        };
        await firestore.collection('users').doc(userRecord.uid).set(userData);
        // 4. Créer le profil
        const profile = {
            userId: userRecord.uid,
            role: role,
            displayName,
            createdAt: now,
            updatedAt: now,
        };
        await firestore.collection('profiles').doc(userRecord.uid).set(profile);
        console.log(`[AUTH] Utilisateur créé: ${userRecord.uid} (${email}, rôle: ${role})`);
        res.status(201).json({
            success: true,
            data: { uid: userRecord.uid, email, displayName, role },
        });
    }
    catch (error) {
        (0, errors_1.logError)('createUserHandler', error);
        res.status(400).json({
            success: false,
            error: {
                code: 'FIREBASE_AUTH_ERROR',
                message: error instanceof Error ? error.message : 'Erreur lors de la création du compte',
            },
        });
    }
}
/**
 * Supprime un utilisateur
 *
 * Endpoint : DELETE /deleteUser
 */
async function deleteUserHandler(req, res) {
    try {
        const { uid } = req.body || {};
        if (!uid) {
            res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'uid requis' } });
            return;
        }
        const auth = (0, firebase_1.getAuth)();
        const firestore = (0, firebase_1.getFirestore)();
        const batch = firestore.batch();
        batch.delete(firestore.collection('users').doc(uid));
        batch.delete(firestore.collection('profiles').doc(uid));
        await batch.commit();
        await auth.deleteUser(uid);
        res.json({ success: true, message: 'Utilisateur supprimé' });
    }
    catch (error) {
        (0, errors_1.logError)('deleteUserHandler', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Erreur de suppression' },
        });
    }
}
//# sourceMappingURL=auth.js.map