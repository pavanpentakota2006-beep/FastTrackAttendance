import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<string, AuthUser> = {
  'admin@smartattend.edu': {
    id: 'admin1', name: 'Admin System', email: 'admin@smartattend.edu',
    role: 'admin', department: 'Administration',
  },
  'meera@smartattend.edu': {
    id: 'f2', name: 'Prof. Meera Iyer', email: 'meera@smartattend.edu',
    role: 'faculty', department: 'Computer Science & Engineering',
  },
  'priya@student.edu': {
    id: 'st2', name: 'Priya Patel', email: 'priya@student.edu',
    role: 'student', department: 'Computer Science & Engineering',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem('smartattend_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string, role: UserRole): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800)); // Simulate API call
    const found = DEMO_USERS[email.toLowerCase()];
    if (found && found.role === role) {
      setUser(found);
      sessionStorage.setItem('smartattend_user', JSON.stringify(found));
      return true;
    }
    // Allow any demo login if using demo buttons
    const demoUser: AuthUser = { id: `demo_${role}`, name: getDemoName(role), email, role };
    setUser(demoUser);
    sessionStorage.setItem('smartattend_user', JSON.stringify(demoUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('smartattend_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function getDemoName(role: UserRole): string {
  if (role === 'admin') return 'Admin System';
  if (role === 'faculty') return 'Prof. Meera Iyer';
  return 'Priya Patel';
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
