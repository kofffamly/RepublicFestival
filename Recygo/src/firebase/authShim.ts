// Minimal auth shim for demo mode
// Exports compatible functions used throughout the app when demo mode is enabled.

// Simple UID generator for demo
function makeUid() { return `demo-${Date.now()}-${Math.floor(Math.random()*100000)}`; }

export interface DemoUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

type AuthStateListener = (user: DemoUser | null) => void;

const users: Record<string, { uid: string; email: string; password: string; displayName?: string }> = {};
let currentUser: DemoUser | null = null;
const listeners: AuthStateListener[] = [];

function notifyAuthState() {
  listeners.forEach((l) => l(currentUser));
}

export async function createUserWithEmailAndPassword(_auth: unknown, email: string, password: string) {
  // Simple in-memory user creation
  const uid = uuidv4();
  users[email] = { uid, email, password, displayName: '' };
  currentUser = { uid, email, displayName: '' };
  notifyAuthState();
  return { user: currentUser };
}

export async function signInWithEmailAndPassword(_auth: unknown, email: string, password: string) {
  const u = users[email];
  if (!u) {
    const err: any = new Error('auth/user-not-found');
    err.code = 'auth/user-not-found';
    throw err;
  }
  if (u.password !== password) {
    const err: any = new Error('auth/wrong-password');
    err.code = 'auth/wrong-password';
    throw err;
  }
  currentUser = { uid: u.uid, email: u.email, displayName: u.displayName };
  notifyAuthState();
  return { user: currentUser };
}

export async function signOut(_auth: unknown) {
  currentUser = null;
  notifyAuthState();
}

export async function updateProfile(user: any, { displayName, photoURL }: { displayName?: string; photoURL?: string }) {
  if (!currentUser || currentUser.uid !== user.uid) {
    const err: any = new Error('No such user');
    throw err;
  }
  if (displayName !== undefined) currentUser.displayName = displayName;
  if (photoURL !== undefined) currentUser.photoURL = photoURL;
  // also update stored user if exists
  if (currentUser.email && users[currentUser.email]) users[currentUser.email].displayName = currentUser.displayName || '';
}

export function onAuthStateChanged(_auth: unknown, cb: AuthStateListener) {
  listeners.push(cb);
  // call immediately with current state
  cb(currentUser);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export type User = DemoUser;

export const demoAuth = { /* placeholder for compatibility */ };

export default { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged };
