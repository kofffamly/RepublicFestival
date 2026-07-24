/**
 * Contexte global de l'application — RecyGo CI
 *
 * Fournit l'état d'authentification, le profil utilisateur
 * et les données globales à toute l'application.
 *
 * Utilise Firebase Auth pour l'authentification et Firestore
 * en temps réel pour le profil utilisateur et les notifications.
 *
 * Chaque utilisateur possède un document Firestore unique lié à son UID.
 * Aucune donnée n'est mélangée entre utilisateurs.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import * as authSDK from 'firebase/auth';
import * as firestoreSDK from 'firebase/firestore';
import * as authShim from '@/firebase/authShim';
import * as fsShim from '@/firebase/firestoreShim';
import { auth, db } from '@/firebase';

// Demo mode flag: use shims when emulator mode is enabled and demo fallback requested
const DEMO_MODE = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true' && process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

// Pick implementations (shims or real SDK)
// @ts-ignore - selected bindings may differ between shim and SDK
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} = DEMO_MODE ? authShim : authSDK as any;

// @ts-ignore
const {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  // Types may differ — import types separately when needed
  query,
  collection,
  where,
  orderBy,
  writeBatch,
  getDocs,
} = DEMO_MODE ? fsShim as any : firestoreSDK as any;

// ─── Types ──────────────────────────────────────────────────────────

export type UserRole = 'citizen' | 'pro' | 'collector';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  photoURL: string;
  role: UserRole;
  address: string;
  collections: number;
  recycledKg: number;
  earnings: number;
  language: string;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  subtitle?: string;
  type: 'info' | 'success' | 'warning' | 'reward';
  read: boolean;
  createdAt: Date;
  action?: string;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  titleColor?: string;
  time?: string;
}

interface AppContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  firebaseUser: FirebaseUser | null;
  user: UserData | null;
  balance: number;
  notifications: AppNotification[];
  unreadCount: number;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  register: (email: string, password: string, displayName: string, role: UserRole, phone?: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  setRole: (role: UserRole) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  error: string | null;
}

// ─── Contexte ──────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;
    let unsubNotif: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        if (unsubFirestore) unsubFirestore();
        if (unsubNotif) unsubNotif();

        // ─── Écoute du document utilisateur (UID comme ID) ────────
        const userRef = doc(db, 'users', fbUser.uid);
        unsubFirestore = onSnapshot(
          userRef,
          (snapshot: DocumentSnapshot) => {
            if (snapshot.exists()) {
              const d = snapshot.data();
              const ca = d.createdAt as Timestamp | null;
              const ua = d.updatedAt as Timestamp | null;
              setUser({
                uid: snapshot.id,
                email: d.email || fbUser.email || '',
                displayName: d.displayName || fbUser.displayName || '',
                phone: d.phone || '',
                photoURL: d.photoURL || fbUser.photoURL || '',
                role: (d.role as UserRole) || 'citizen',
                address: d.address || '',
                collections: d.collections ?? 0,
                recycledKg: d.recycledKg ?? 0,
                earnings: d.earnings ?? 0,
                language: d.language || 'fr',
                notificationsEnabled: d.notificationsEnabled ?? true,
                theme: (d.theme as 'light' | 'dark') || 'light',
                createdAt: ca?.toDate() || null,
                updatedAt: ua?.toDate() || null,
              });
            } else {
              // Crée le document utilisateur s'il n'existe pas
              // en utilisant uniquement les données de Firebase Auth
              setDoc(userRef, {
                uid: fbUser.uid,
                email: fbUser.email || '',
                displayName: fbUser.displayName || '',
                phone: '',
                photoURL: '',
                role: 'citizen',
                address: '',
                collections: 0,
                recycledKg: 0,
                earnings: 0,
                language: 'fr',
                notificationsEnabled: true,
                theme: 'light',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              }).catch(console.error);
            }
          },
          (err) => { console.error('[AppContext] Firestore error:', err); }
        );

        // ─── Écoute des notifications (documents individuels) ─────
        const notifQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', fbUser.uid),
          orderBy('createdAt', 'desc')
        );
        unsubNotif = onSnapshot(notifQuery, (querySnapshot) => {
          const list: AppNotification[] = [];
          querySnapshot.forEach((docSnap) => {
            const d = docSnap.data();
            const ca = d.createdAt as Timestamp | null;
            list.push({
              id: docSnap.id,
              title: d.title || '',
              message: d.body || d.message || '',
              subtitle: d.subtitle,
              type: (d.type as AppNotification['type']) || 'info',
              read: d.read ?? false,
              createdAt: ca?.toDate() || new Date(),
              action: d.actionUrl || d.action,
              icon: d.icon,
              iconBg: d.iconBg,
              iconColor: d.iconColor,
              titleColor: d.titleColor,
              time: d.time,
            });
          });
          setNotifications(list);
        });
      } else {
        setUser(null);
        setNotifications([]);
      }

      setIsLoading(false);
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
      if (unsubNotif) unsubNotif();
    };
  }, []);

  // ─── Valeurs dérivées ───────────────────────────────────────────

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const balance = useMemo(() => user?.earnings ?? 0, [user?.earnings]);

  // ─── Authentification ───────────────────────────────────────────

  const login = useCallback(async (email: string, password: string): Promise<FirebaseUser> => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Erreur';
      if (m.includes('user-not-found')) setError('Aucun compte trouvé');
      else if (m.includes('wrong-password') || m.includes('invalid-credential')) setError('Email ou mot de passe incorrect');
      else if (m.includes('too-many-requests')) setError('Trop de tentatives');
      else setError(m);
      throw err;
    }
  }, []);

  const register = useCallback(async (
    email: string, password: string, displayName: string, role: UserRole, phone?: string
  ): Promise<FirebaseUser> => {
    setError(null);
    try {
      // 1. Crée l'utilisateur dans Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Met à jour le displayName dans Firebase Auth
      await updateProfile(cred.user, { displayName });

      // 3. Crée le document Firestore avec UID comme identifiant
      //    Uniquement les données réellement saisies + valeurs initiales
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: email,
        displayName,
        phone: phone || '',
        photoURL: '',
        role,
        address: '',
        collections: 0,
        recycledKg: 0,
        earnings: 0,
        language: 'fr',
        notificationsEnabled: true,
        theme: 'light',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return cred.user;
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Erreur';
      if (m.includes('email-already-in-use')) setError('Email déjà utilisé');
      else if (m.includes('weak-password')) setError('Mot de passe trop faible (min 6 car.)');
      else if (m.includes('configuration-not-found')) {
        setError('Firebase Auth configuration introuvable. Vérifiez vos variables d’environnement et les identifiants du projet.');
      } else setError(m);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await signOut(auth);
  }, []);

  // ─── Mise à jour du profil ──────────────────────────────────────

  const updateUserProfile = useCallback(async (data: Partial<UserData>) => {
    if (!firebaseUser) {
      setError('Non connecté');
      return;
    }
    try {
      // Met à jour Firebase Auth si displayName ou photoURL change
      const authUpdates: { displayName?: string; photoURL?: string } = {};
      if (data.displayName !== undefined) authUpdates.displayName = data.displayName;
      if (data.photoURL !== undefined) authUpdates.photoURL = data.photoURL;
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(firebaseUser, authUpdates);
      }

      // Met à jour Firestore
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Erreur';
      setError(m);
      throw err;
    }
  }, [firebaseUser]);

  const setRole = useCallback(async (role: UserRole) => {
    if (!firebaseUser) {
      setError('Non connecté');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        role,
        updatedAt: serverTimestamp(),
      });
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Erreur';
      setError(m);
      throw err;
    }
  }, [firebaseUser]);

  // ─── Notifications ──────────────────────────────────────────────

  const markAllNotificationsRead = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const batch = writeBatch(db);
      const notifQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', firebaseUser.uid),
        where('read', '==', false)
      );
      const snapshot = await getDocs(notifQuery);
      snapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, { read: true, readAt: serverTimestamp() });
      });
      await batch.commit();
    } catch (err: unknown) {
      console.error('[AppContext] markAllNotificationsRead error:', err);
    }
  }, [firebaseUser]);

  const markNotificationRead = useCallback(async (id: string) => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'notifications', id), {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (err: unknown) {
      console.error('[AppContext] markNotificationRead error:', err);
    }
  }, [firebaseUser]);

  // ─── Valeur du contexte ─────────────────────────────────────────

  const value: AppContextValue = useMemo(() => ({
    isLoading,
    isAuthenticated: !!firebaseUser,
    firebaseUser,
    user,
    balance,
    notifications,
    unreadCount,
    login,
    register,
    logout,
    updateUserProfile,
    setRole,
    markAllNotificationsRead,
    markNotificationRead,
    error,
  }), [
    isLoading, firebaseUser, user, balance, notifications, unreadCount,
    login, register, logout, updateUserProfile, setRole,
    markAllNotificationsRead, markNotificationRead, error,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp doit être utilisé dans AppProvider');
  return context;
}

export default AppContext;
