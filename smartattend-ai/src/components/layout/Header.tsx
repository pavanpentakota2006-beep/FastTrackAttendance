import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, CheckCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { Notification } from '../../types';

const PAGE_TITLES: Record<string, string> = {
  'dashboard': 'Dashboard',
  'students': 'Student Management',
  'faculty': 'Faculty Management',
  'departments': 'Department Management',
  'subjects': 'Subject Management',
  'timetable': 'Timetable',
  'monitoring': 'Live Attendance Monitor',
  'analytics': 'Analytics Dashboard',
  'reports': 'Reports',
  'audit-logs': 'Audit Logs',
  'security': 'Security Monitor',
  'settings': 'System Settings',
  'sessions': 'Attendance Sessions',
  'live': 'Live Attendance',
  'history': 'Attendance History',
  'requests': 'Correction Requests',
  'mark': 'Mark Attendance',
  'attendance': 'My Attendance',
  'subjects-student': 'Subject-wise Attendance',
  'calendar': 'Attendance Calendar',
  'prediction': 'AI Prediction',
  'leave': 'Leave Management',
  'corrections': 'Correction Requests',
  'profile': 'My Profile',
};

const notifTypeStyles: Record<Notification['type'], { bg: string; color: string }> = {
  info:    { bg: 'var(--info-subtle)',    color: 'var(--info)' },
  warning: { bg: 'var(--warning-subtle)', color: 'var(--warning)' },
  danger:  { bg: 'var(--danger-subtle)',  color: 'var(--danger)' },
  success: { bg: 'var(--success-subtle)', color: 'var(--success)' },
};

export default function Header() {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead, toggleSidebar } = useApp();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);

  const pageName = location.pathname.split('/').pop() || 'dashboard';
  const pageTitle = PAGE_TITLES[pageName] || 'SmartAttend AI';

  const timeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header style={{
      position: 'fixed', top: 0, right: 0, zIndex: 90,
      left: 'var(--sidebar-width)',
      height: 'var(--header-height)',
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '0 24px',
      transition: 'left var(--transition)',
    }}>
      {/* Mobile menu */}
      <button onClick={toggleSidebar} className="btn btn-ghost btn-icon" style={{ display: 'none' }}>
        <Menu size={18} />
      </button>

      {/* Title area */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '17px', fontWeight: 700, margin: 0, lineHeight: 1 }}>
          {pageTitle}
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
          {timeGreeting()}, {user?.name.split(' ')[0]}!  &nbsp;·&nbsp;
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Search bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'var(--bg-input)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '8px 14px',
        minWidth: '220px',
      }}>
        <Search size={15} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search..."
          style={{
            background: 'none', border: 'none', outline: 'none', padding: 0,
            width: '100%', fontSize: '13.5px', color: 'var(--text-primary)',
            boxShadow: 'none',
          }}
        />
        <kbd style={{
          fontSize: '10px', color: 'var(--text-muted)',
          background: 'var(--bg-glass)', border: '1px solid var(--border)',
          borderRadius: '4px', padding: '1px 5px',
        }}>⌘K</kbd>
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setShowNotifs(v => !v)}
          style={{ position: 'relative' }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--danger)',
              border: '2px solid var(--bg-secondary)',
            }} />
          )}
        </button>

        {showNotifs && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 140 }}
              onClick={() => setShowNotifs(false)}
            />
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 360, background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 150, overflow: 'hidden',
              animation: 'fadeInScale 0.2s ease',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>Notifications</div>
                  {unreadCount > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{unreadCount} unread</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <button className="btn btn-ghost btn-sm" onClick={markAllRead} style={{ gap: '4px', fontSize: '12px' }}>
                      <CheckCheck size={12} /> All Read
                    </button>
                  )}
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowNotifs(false)}>
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map(n => {
                    const { bg, color } = notifTypeStyles[n.type];
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        style={{
                          padding: '14px 20px',
                          borderBottom: '1px solid var(--border)',
                          cursor: 'pointer',
                          background: n.read ? 'transparent' : 'rgba(99,102,241,0.04)',
                          transition: 'background var(--transition-fast)',
                          display: 'flex', gap: '12px', alignItems: 'flex-start',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass)')}
                        onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(99,102,241,0.04)')}
                      >
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: n.read ? 'var(--text-muted)' : color,
                          flexShrink: 0, marginTop: 6,
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: n.read ? 400 : 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                            {n.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {n.message}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div style={{
                          padding: '2px 8px', borderRadius: 'var(--radius-full)',
                          fontSize: '10px', fontWeight: 600,
                          background: bg, color,
                          flexShrink: 0,
                        }}>
                          {n.type}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: 700, color: 'white',
        cursor: 'pointer', flexShrink: 0,
        boxShadow: 'var(--shadow-accent)',
      }}>
        {user?.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
      </div>
    </header>
  );
}
