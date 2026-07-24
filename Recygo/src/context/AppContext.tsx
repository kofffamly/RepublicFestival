import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'citizen' | 'pro';

export interface User {
  name: string;
  phone: string;
  email?: string;
  role: Role;
  avatar?: string;
  memberSince?: string;
  collections?: number;
  recycledKg?: number;
  earnings?: number;
  address?: string;
}

export interface Notification {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  titleColor: string;
  subtitle: string;
  time: string;
  unread: boolean;
  action?: string;
}

interface AppContextType {
  role: Role | null;
  user: User | null;
  balance: number;
  notifications: Notification[];
  setRole: (role: Role) => void;
  login: (user: User) => void;
  logout: () => void;
  addBalance: (amount: number) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: '✓',
    iconBg: '#E9F8EF',
    iconColor: '#2ECC71',
    title: 'Collecte terminée !',
    titleColor: '#2ECC71',
    subtitle: 'Ibrahim a collecté vos déchets. 812 FCFA crédités.',
    time: 'Il y a 5 min',
    unread: true,
    action: '/tracking',
  },
  {
    id: '2',
    icon: '🚛',
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
    title: 'Recycleur en route',
    titleColor: '#3B82F6',
    subtitle: 'Ibrahim Coulibaly arrive dans 12 minutes.',
    time: 'Il y a 12 min',
    unread: true,
    action: '/tracking',
  },
  {
    id: '3',
    icon: '⭐',
    iconBg: '#FEF3C7',
    iconColor: '#F5A524',
    title: 'Notez votre expérience',
    titleColor: '#111827',
    subtitle: "Comment s'est passée votre collecte du 18 juil. ?",
    time: 'Hier',
    unread: false,
  },
  {
    id: '4',
    icon: '♻️',
    iconBg: '#E9F8EF',
    iconColor: '#2ECC71',
    title: 'Impact ce mois',
    titleColor: '#2ECC71',
    subtitle: 'Vous avez évité 42 kg de CO2 ce mois-ci. Bravo !',
    time: 'Il y a 3 j',
    unread: false,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(300);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);

  const setRole = (r: Role) => setRoleState(r);

  const login = (u: User) => {
    setUser(u);
    setRoleState(u.role);
  };

  const logout = () => {
    setUser(null);
    setRoleState(null);
  };

  const addBalance = (amount: number) => setBalance(prev => prev + amount);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <AppContext.Provider
      value={{
        role,
        user,
        balance,
        notifications,
        setRole,
        login,
        logout,
        addBalance,
        markAllNotificationsRead,
        markNotificationRead,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
