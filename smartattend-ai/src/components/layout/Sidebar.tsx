import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, Building2, BookOpen, Calendar,
  Activity, BarChart3, FileText, Shield, Settings, LogOut, ChevronLeft,
  ChevronRight, Brain, Bell, Clock, ClipboardList, UserCircle, Tv2,
  AlertTriangle, MapPin, QrCode, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

function getNavItems(role: UserRole, unreadCount: number): NavItem[] {
  if (role === 'admin') return [
    { to: '/admin/dashboard',   icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/students',    icon: <GraduationCap size={18} />,   label: 'Students' },
    { to: '/admin/faculty',     icon: <Users size={18} />,           label: 'Faculty' },
    { to: '/admin/departments', icon: <Building2 size={18} />,       label: 'Departments' },
    { to: '/admin/subjects',    icon: <BookOpen size={18} />,        label: 'Subjects' },
    { to: '/admin/timetable',   icon: <Calendar size={18} />,        label: 'Timetable' },
    { to: '/admin/monitoring',  icon: <Tv2 size={18} />,             label: 'Live Monitor' },
    { to: '/admin/analytics',   icon: <BarChart3 size={18} />,       label: 'Analytics' },
    { to: '/admin/reports',     icon: <FileText size={18} />,        label: 'Reports' },
    { to: '/admin/audit-logs',  icon: <ClipboardList size={18} />,   label: 'Audit Logs' },
    { to: '/admin/security',    icon: <Shield size={18} />,          label: 'Security', badge: 5 },
    { to: '/admin/settings',    icon: <Settings size={18} />,        label: 'Settings' },
  ];

  if (role === 'faculty') return [
    { to: '/faculty/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/faculty/sessions',  icon: <Clock size={18} />,           label: 'Sessions' },
    { to: '/faculty/live',      icon: <Activity size={18} />,        label: 'Live Attendance' },
    { to: '/faculty/history',   icon: <Calendar size={18} />,        label: 'History' },
    { to: '/faculty/analytics', icon: <TrendingUp size={18} />,      label: 'Analytics' },
    { to: '/faculty/requests',  icon: <ClipboardList size={18} />,   label: 'Requests', badge: 2 },
  ];

  // student
  return [
    { to: '/student/dashboard',   icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/student/mark',        icon: <QrCode size={18} />,          label: 'Mark Attendance' },
    { to: '/student/attendance',  icon: <Calendar size={18} />,        label: 'My Attendance' },
    { to: '/student/subjects',    icon: <BookOpen size={18} />,        label: 'Subject-wise' },
    { to: '/student/calendar',    icon: <MapPin size={18} />,          label: 'Calendar' },
    { to: '/student/prediction',  icon: <Brain size={18} />,           label: 'AI Prediction' },
    { to: '/student/leave',       icon: <FileText size={18} />,        label: 'Leave' },
    { to: '/student/corrections', icon: <ClipboardList size={18} />,   label: 'Corrections' },
    { to: '/student/timetable',   icon: <Clock size={18} />,           label: 'Timetable' },
    { to: '/student/profile',     icon: <UserCircle size={18} />,      label: 'Profile' },
    { to: '/student/prediction',  icon: <AlertTriangle size={18} />,   label: 'Notifications', badge: unreadCount || undefined },
  ];
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  faculty: 'Faculty Portal',
  student: 'Student Portal',
};

const roleColors: Record<UserRole, string> = {
  admin:   '#6366f1',
  faculty: '#10b981',
  student: '#f59e0b',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar, unreadCount } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = getNavItems(user.role, unreadCount);
  const roleColor = roleColors[user.role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside style={{
      width: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width var(--transition)',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '12px',
        minHeight: 'var(--header-height)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
          background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 20px ${roleColor}40`,
        }}>
          <Brain size={18} color="white" />
        </div>
        {!sidebarCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800,
              fontSize: '15px', color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
            }}>
              SmartAttend
            </div>
            <div style={{
              fontSize: '10px', color: roleColor, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {roleLabels[user.role]}
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={sidebarCollapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: 'var(--radius)',
              marginBottom: '2px', textDecoration: 'none',
              fontSize: '13.5px', fontWeight: 500,
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? `linear-gradient(135deg, ${roleColor}, ${roleColor}bb)` : 'transparent',
              boxShadow: isActive ? `0 4px 12px ${roleColor}30` : 'none',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap', overflow: 'hidden',
              position: 'relative',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget;
              if (!el.style.background.includes('gradient')) {
                el.style.background = 'var(--bg-glass)';
                el.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              if (!el.style.background.includes('gradient')) {
                el.style.background = 'transparent';
                el.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {!sidebarCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
            {!sidebarCollapsed && item.badge && (
              <span style={{
                background: 'var(--danger)', color: 'white',
                fontSize: '10px', fontWeight: 700,
                padding: '1px 6px', borderRadius: 'var(--radius-full)',
                minWidth: '18px', textAlign: 'center',
              }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
        {/* Avatar row */}
        {!sidebarCollapsed && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 12px', borderRadius: 'var(--radius)',
            marginBottom: '4px',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, color: 'white',
            }}>
              {user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user.role}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={sidebarCollapsed ? 'Logout' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: 'var(--radius)',
            width: '100%', border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--text-muted)',
            fontSize: '13.5px', fontWeight: 500,
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--danger-subtle)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
        >
          <LogOut size={16} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', padding: '9px 12px', borderRadius: 'var(--radius)',
            width: '100%', border: 'none', cursor: 'pointer', marginTop: '4px',
            background: 'transparent', color: 'var(--text-muted)',
            fontSize: '13.5px', transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-glass)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
