import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { auditLogs } from '../../data/mockData';
import type { UserRole } from '../../types';

const actionColors: Record<string, string> = {
  ATTENDANCE_UPDATED:   'var(--warning)',
  SESSION_STARTED:      'var(--success)',
  SESSION_ENDED:        'var(--text-muted)',
  STUDENT_CREATED:      'var(--accent)',
  FACULTY_CREATED:      'var(--accent)',
  SETTINGS_UPDATED:     'var(--info)',
  CORRECTION_REQUESTED: 'var(--warning)',
  LEAVE_REVIEWED:       'var(--success)',
};

const roleColors: Record<UserRole, string> = {
  admin:   '#6366f1',
  faculty: '#10b981',
  student: '#f59e0b',
};

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');

  const filtered = auditLogs.filter(l =>
    (filterRole === 'all' || l.userRole === filterRole) &&
    (l.userName.toLowerCase().includes(search.toLowerCase()) ||
     l.action.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Audit Logs</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Complete system activity trail — every sensitive action is logged
        </p>
      </div>

      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 220,
          background: 'var(--bg-input)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '8px 14px',
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text" placeholder="Search by user or action..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', padding: 0, flex: 1, fontSize: '13.5px', color: 'var(--text-primary)', boxShadow: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'admin', 'faculty', 'student'] as const).map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`btn btn-sm ${filterRole === r ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Filter size={12} /> {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 20, top: 20, bottom: 20,
            width: 2, background: 'var(--border)',
          }} />

          {filtered.map((log, i) => {
            const color = actionColors[log.action] ?? 'var(--text-muted)';
            const rc = roleColors[log.userRole];
            return (
              <div key={log.id} style={{
                display: 'flex', gap: '20px', marginBottom: '20px',
                animation: `fadeInLeft 0.4s ease ${i * 0.06}s both`,
                position: 'relative',
              }}>
                {/* Dot */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: `${rc}20`, border: `2px solid ${rc}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, color: rc,
                  position: 'relative', zIndex: 1,
                }}>
                  {log.userName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>

                <div style={{
                  flex: 1, padding: '14px 18px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{log.userName}</span>
                      <span className="badge" style={{ background: `${rc}18`, color: rc, border: `1px solid ${rc}30`, fontSize: '10.5px' }}>
                        {log.userRole}
                      </span>
                      <span style={{
                        fontSize: '12px', fontWeight: 700, color,
                        background: `${color === 'var(--text-muted)' ? 'var(--bg-glass)' : color + '18'}`,
                        padding: '2px 8px', borderRadius: 'var(--radius-full)',
                      }}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Entity: <strong>{log.entity}</strong>
                    {log.oldValue && <span> · <span style={{ color: 'var(--danger)' }}>From: {log.oldValue}</span></span>}
                    {log.newValue && <span> → <span style={{ color: 'var(--success)' }}>To: {log.newValue}</span></span>}
                  </div>

                  {log.reason && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '2px solid var(--border)', paddingLeft: '10px' }}>
                      {log.reason}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>IP: {log.ipAddress}</span>
                    {log.entityId && <span>ID: {log.entityId}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
