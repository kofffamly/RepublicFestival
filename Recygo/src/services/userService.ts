/**
 * Service utilisateur Firestore — RecyGo CI
 *
 * Gère toutes les opérations CRUD des utilisateurs dans Firestore :
 * - Création du document utilisateur
 * - Lecture avec écoute temps réel
 * - Mise à jour du profil
 * - Suppression
 */

import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../firebase';

// ═════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════

export type Role = 'citizen' | 'pro' | 'collector';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: Role;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  // Stats
  collections?: number;
  recycledKg?: number;
  earnings?: number;
  // Préférences
  language?: string;
  notificationsEnabled?: boolean;
  theme?: 'light' | 'dark';
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  profile: UserProfile | null;
  error: string | null;
}

// ═════════════════════════════════════════════════════════════════════
// AUTHENTIFICATION
// ═════════════════════════════════════════════════════════════════════

/**
 * Inscription avec email + mot de passe
 * Crée automatiquement le document Firestore
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: Role = 'citizen',
  phone?: string
): Promise<FirebaseUser> {
  // 1. Créer l'utilisateur Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // 2. Mettre à jour le displayName dans Auth
  await updateProfile(firebaseUser, { displayName });

  // 3. Créer le document Firestore
  const userData: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || email,
    displayName,
    phone: phone || '',
    role,
    collections: 0,
    recycledKg: 0,
    earnings: 0,
    language: 'fr',
    notificationsEnabled: true,
    theme: 'light',
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return firebaseUser;
}

/**
 * Connexion avec email + mot de passe
 */
export async function loginUser(email: string, password: string): Promise<FirebaseUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Déconnexion
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// ═════════════════════════════════════════════════════════════════════
// LISTENER FIRESTORE EN TEMPS RÉEL
// ═════════════════════════════════════════════════════════════════════

/**
 * Écoute les changements du document utilisateur dans Firestore
 * Retourne une fonction de nettoyage (unsubscribe)
 */
export function listenToUserProfile(
  uid: string,
  onProfile: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void
): () => void {
  const userRef = doc(db, 'users', uid);

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        onProfile({
          ...data,
          uid: snapshot.id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        onProfile(null);
      }
    },
    (error) => {
      console.error('[UserService] Erreur listener Firestore:', error);
      onError?.(error);
    }
  );
}

/**
 * Écoute l'état d'authentification global
 * Retourne une fonction de nettoyage
 */
export function listenToAuthState(
  onAuthChange: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, onAuthChange);
}

// ═════════════════════════════════════════════════════════════════════
// MISE À JOUR DU PROFIL
// ═════════════════════════════════════════════════════════════════════

/**
 * Met à jour le profil utilisateur dans Firestore
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Récupère le profil une seule fois (sans écoute)
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return {
      ...snapshot.data(),
      uid: snapshot.id,
    } as UserProfile;
  }

  return null;
}
