import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Notification } from '../types';
import { notifications as initialNotifs } from '../data/mockData';
import { useAuth } from './AuthContext';

interface AppContextType {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifs.filter(n => n.userId === (user?.id ?? ''))
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <AppContext.Provider value={{
      notifications, unreadCount, markRead, markAllRead,
      sidebarCollapsed, toggleSidebar,
      activeSessionId, setActiveSessionId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
