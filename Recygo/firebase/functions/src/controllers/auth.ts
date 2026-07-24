/**
 * Contrôleur d'authentification
 *
 * Gère les endpoints liés à l'authentification :
 * - Inscription
 * - Mise à jour du profil
 * - Gestion des rôles (custom claims)
 */

import * as functions from 'firebase-functions/v1';
import { getAuth, getFirestore } from '../firebase';
import { admin } from '../firebase/admin';
import { logError } from '../utils/errors';
import type { User, Profile } from '../types';

/**
 * Crée un nouvel utilisateur (inscription)
 *
 * Endpoint : POST /createUser
 */
export async function createUserHandler(
  req: functions.https.Request,
  res: functions.Response
): Promise<void> {
  try {
    const { email, password, displayName, role } = req.body || {};

    if (!email || !password || !displayName || !role) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'email, password, displayName et role requis' },
      });
      return;
    }

    const auth = getAuth();
    const firestore = getFirestore();
    const now = admin.firestore.Timestamp.now();

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
    const userData: User = {
      uid: userRecord.uid,
      email,
      displayName,
      role: role as User['role'],
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
    const profile: Profile = {
      userId: userRecord.uid,
      role: role as Profile['role'],
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
  } catch (error) {
    logError('createUserHandler', error as Error);
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
export async function deleteUserHandler(
  req: functions.https.Request,
  res: functions.Response
): Promise<void> {
  try {
    const { uid } = req.body || {};
    if (!uid) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'uid requis' } });
      return;
    }

    const auth = getAuth();
    const firestore = getFirestore();

    const batch = firestore.batch();
    batch.delete(firestore.collection('users').doc(uid));
    batch.delete(firestore.collection('profiles').doc(uid));
    await batch.commit();

    await auth.deleteUser(uid);

    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    logError('deleteUserHandler', error as Error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Erreur de suppression' },
    });
  }
}

