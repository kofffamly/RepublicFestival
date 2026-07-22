import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'citizen' | 'pro';

export interface User {
  name: string;
  phone: string;
  role: Role;
}

interface AppContextType {
  role: Role | null;
  user: User | null;
  balance: number;
  setRole: (role: Role) => void;
  login: (user: User) => void;
  logout: () => void;
  addBalance: (amount: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(300);

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

  return (
    <AppContext.Provider value={{ role, user, balance, setRole, login, logout, addBalance }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

