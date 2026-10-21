import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="app-layout">
      <div className="bg-mesh" />
      <Sidebar />
      <div
        className="main-content"
        style={{
          marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          transition: 'margin-left var(--transition)',
        }}
      >
        <Header />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
