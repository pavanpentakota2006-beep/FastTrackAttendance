import React from 'react';
import { Shield, AlertTriangle, Eye, CheckCircle, XCircle } from 'lucide-react';
import { anomalies } from '../../data/mockData';

export default function SecurityMonitor() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Security Monitor</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          AI-detected anomalies, authentication events, and security monitoring
        </p>
      </div>

      {/* Security Stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Active Sessions', value: '3', color: '#10b981', icon: '🔐' },
          { label: 'Failed Auths (24h)', value: '12', color: '#ef4444', icon: '🚫' },
          { label: 'Anomalies Flagged', value: anomalies.length.toString(), color: '#f59e0b', icon: '⚠️' },
          { label: 'Reviewed', value: anomalies.filter(a => a.reviewed).length.toString(), color: '#6366f1', icon: '✅' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Anomalies */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>AI-Detected Anomalies</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Suspicious patterns identified by the anomaly detection engine
            </p>
          </div>
          <span className="badge badge-warning">{anomalies.filter(a => !a.reviewed).length} Pending Review</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {anomalies.map((a, i) => {
            const sevColor = { low: 'var(--info)', medium: 'var(--warning)', high: 'var(--danger)' }[a.severity];
            const typeIcon: Record<string, string> = {
              timing: '⏱️', pattern: '📊', location: '📍', device: '📱', correction_abuse: '✏️', burst: '⚡',
            };
            return (
              <div key={a.id} style={{
                padding: '18px 20px', borderRadius: 'var(--radius-md)',
                background: a.reviewed ? 'var(--bg-glass)' : `${sevColor === 'var(--danger)' ? 'rgba(239,68,68,0.06)' : sevColor === 'var(--warning)' ? 'rgba(245,158,11,0.06)' : 'rgba(59,130,246,0.06)'}`,
                border: `1px solid ${a.reviewed ? 'var(--border)' : sevColor + '40'}`,
                animation: `fadeInUp 0.4s ease ${i * 0.07}s both`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '20px' }}>{typeIcon[a.type] ?? '🔎'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{a.studentName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Type: {a.type.replace(/_/g, ' ')} · {new Date(a.detectedAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge" style={{
                      background: sevColor === 'var(--danger)' ? 'var(--danger-subtle)' : sevColor === 'var(--warning)' ? 'var(--warning-subtle)' : 'var(--info-subtle)',
                      color: sevColor, border: `1px solid ${sevColor}30`,
                    }}>
                      {a.severity.toUpperCase()}
                    </span>
                    {a.reviewed
                      ? <span className="badge badge-success"><CheckCircle size={11} /> Reviewed</span>
                      : <span className="badge badge-warning"><AlertTriangle size={11} /> Pending</span>
                    }
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                  {a.description}
                </p>

                {a.reviewNote && (
                  <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--success-subtle)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '12px', color: 'var(--success)', marginBottom: '12px' }}>
                    Review Note: {a.reviewNote}
                  </div>
                )}

                {!a.reviewed && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm"><Eye size={13} /> Investigate</button>
                    <button className="btn btn-success btn-sm"><CheckCircle size={13} /> Mark Reviewed</button>
                    <button className="btn btn-danger btn-sm"><XCircle size={13} /> Escalate</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Auth Events */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Recent Authentication Events</h3>
        <table>
          <thead>
            <tr>
              <th>User</th><th>Role</th><th>Event</th><th>IP Address</th><th>Time</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { user: 'Priya Patel',    role: 'student', event: 'Login', ip: '10.0.0.42', time: '09:01', ok: true },
              { user: 'Prof. Meera Iyer', role: 'faculty', event: 'Login', ip: '192.168.1.45', time: '08:45', ok: true },
              { user: 'Unknown',        role: 'student', event: 'Failed Login', ip: '10.0.5.100', time: '08:30', ok: false },
              { user: 'Admin System',   role: 'admin',   event: 'Login', ip: '192.168.1.10', time: '08:00', ok: true },
              { user: 'Unknown',        role: 'faculty', event: 'Failed Login', ip: '172.16.0.55', time: '07:50', ok: false },
            ].map((e, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{e.user}</td>
                <td><span className="badge badge-muted" style={{ textTransform: 'capitalize' }}>{e.role}</span></td>
                <td>{e.event}</td>
                <td><code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{e.ip}</code></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>{e.time}</td>
                <td>
                  {e.ok
                    ? <span className="badge badge-success"><CheckCircle size={11} /> Success</span>
                    : <span className="badge badge-danger"><XCircle size={11} /> Failed</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
