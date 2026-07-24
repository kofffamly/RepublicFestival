/**
 * Contexte global de l'application — RecyGo CI
 *
 * Fournit l'état d'authentification, le profil utilisateur
 * et les données globales à toute l'application.
 *
 * Utilise Firebase Auth pour l'authentification et Firestore
 * en temps réel pour le profil utilisateur.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, type DocumentSnapshot, type Timestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';

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
  type: 'info' | 'success' | 'warning' | 'reward';
  read: boolean;
  createdAt: Date;
}

interface AppContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  firebaseUser: FirebaseUser | null;
  user: UserData | null;
  notifications: AppNotification[];
  unreadCount: number;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  register: (email: string, password: string, displayName: string, role: UserRole, phone?: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  error: string | null;
}

// ─── Contexte ──────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_USER: UserData = {
  uid: '',
  email: '',
  displayName: '',
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
  createdAt: null,
  updatedAt: null,
};

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
                email: d.email || '',
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
              setDoc(userRef, {
                uid: fbUser.uid, email: fbUser.email || '', displayName: fbUser.displayName || '',
                phone: '', photoURL: '', role: 'citizen', address: '',
                collections: 0, recycledKg: 0, earnings: 0,
                language: 'fr', notificationsEnabled: true, theme: 'light',
                createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
              }).catch(console.error);
            }
          },
          (err) => { console.error("[AppContext] Firestore error:", err); }
        );

        const notifRef = doc(db, 'notifications', fbUser.uid);
        unsubNotif = onSnapshot(notifRef, (snap: DocumentSnapshot) => {
          if (snap.exists()) {
            const d = snap.data();
            const list: AppNotification[] = (d.list || []).map((n: Record<string, unknown>, i: number) => ({
              id: (n.id as string) || String(i),
              title: (n.title as string) || '',
              message: (n.message as string) || '',
              type: (n.type as AppNotification['type']) || 'info',
              read: (n.read as boolean) || false,
              createdAt: ((n.createdAt as Timestamp)?.toDate()) || new Date(),
            }));
            setNotifications(list);
          }
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

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const login = useCallback(async (email: string, password: string): Promise<FirebaseUser> => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Erreur';
      if (m.includes('user-not-found')) setError("Aucun compte trouvé");
      else if (m.includes('wrong-password') || m.includes('invalid-credential')) setError("Email ou mot de passe incorrect");
      else if (m.includes('too-many-requests')) setError("Trop de tentatives");
      else setError(m);
      throw err;
    }
  }, []);

  const register = useCallback(async (
    email: string, password: string, displayName: string, role: UserRole, phone?: string
  ): Promise<FirebaseUser> => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid, email: email, displayName, phone: phone || '', photoURL: '',
        role, address: '', collections: 0, recycledKg: 0, earnings: 0,
        language: 'fr', notificationsEnabled: true, theme: 'light',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      return cred.user;
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Erreur";
      if (m.includes('email-already-in-use')) setError("Email déjà utilisé");
      else if (m.includes('weak-password')) setError("Mot de passe trop faible (min 6 car.)");
      else setError(m);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await signOut(auth);
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<UserData>) => {
    if (!firebaseUser) { setError("Non connecté"); return; }
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), { ...data, updatedAt: serverTimestamp() });
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Erreur';
      setError(m);
      throw err;
    }
  }, [firebaseUser]);

  const value: AppContextValue = useMemo(() => ({
    isLoading, isAuthenticated: !!firebaseUser, firebaseUser, user,
    notifications, unreadCount, login, register, logout, updateUserProfile, error,
  }), [isLoading, firebaseUser, user, notifications, unreadCount, login, register, logout, updateUserProfile, error]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp doit être utilisé dans AppProvider');
  return context;
}

export default AppContext;
