import React from 'react';
import { Activity, Users, CheckCircle, Clock, QrCode } from 'lucide-react';
import { activeSessions, pastSessions } from '../../data/mockData';

export default function AttendanceMonitoring() {
  const allSessions = [...activeSessions, ...pastSessions];

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Live Attendance Monitor</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Real-time overview of all attendance sessions today
        </p>
      </div>

      {/* Live sessions */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div className="status-dot online" />
          <h3 style={{ margin: 0, fontSize: '15px' }}>Active Sessions ({activeSessions.length})</h3>
        </div>
        <div className="grid-2">
          {activeSessions.map(s => {
            const pct = Math.round(s.presentCount / s.totalStudents * 100);
            return (
              <div key={s.id} className="glass-card" style={{
                padding: '22px',
                border: '1px solid rgba(16,185,129,0.3)',
                background: 'rgba(16,185,129,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{s.subjectName}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      {s.room} · {s.facultyName}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      LIVE
                    </span>
                    <span className="badge badge-muted" style={{ fontSize: '11px' }}>
                      {s.verificationMethod === 'face' ? '📷 Face' : <><QrCode size={10} /> QR</>}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: 'Present', value: s.presentCount, icon: <CheckCircle size={16} />, color: 'var(--success)' },
                    { label: 'Absent',  value: s.absentCount,  icon: <Clock size={16} />,       color: 'var(--danger)'  },
                    { label: 'Total',   value: s.totalStudents,icon: <Users size={16} />,        color: 'var(--accent)'  },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      padding: '10px', textAlign: 'center', borderRadius: 'var(--radius)',
                      background: 'var(--bg-glass)', border: '1px solid var(--border)',
                    }}>
                      <div style={{ color: stat.color, marginBottom: '4px' }}>{stat.icon}</div>
                      <div style={{ fontWeight: 800, fontSize: '22px', color: stat.color, fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Attendance Progress</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: pct >= 75 ? 'var(--success)' : 'var(--warning)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 10, background: 'var(--bg-glass)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: `linear-gradient(90deg, var(--success), #34d399)`,
                      borderRadius: '5px',
                      transition: 'width 1s ease',
                      animation: 'pulse 2s ease-in-out infinite',
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed sessions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div className="status-dot idle" />
          <h3 style={{ margin: 0, fontSize: '15px' }}>Completed Today ({pastSessions.filter(s => s.date === '2026-08-17').length})</h3>
        </div>
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Room</th>
                <th>Time</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance %</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {allSessions.filter(s => s.status === 'completed').map(s => {
                const pct = Math.round(s.presentCount / s.totalStudents * 100);
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.subjectName}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{s.facultyName}</td>
                    <td><span className="badge badge-muted">{s.room}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{s.startTime} – {s.endTime}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{s.presentCount}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{s.absentCount}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 50, height: 5, background: 'var(--bg-glass)', borderRadius: '3px' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct >= 75 ? 'var(--success)' : 'var(--warning)', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: pct >= 75 ? 'var(--success)' : 'var(--warning)' }}>{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-accent" style={{ fontSize: '11px' }}>
                        {s.verificationMethod === 'face' ? '📷 Face' : s.verificationMethod === 'qr' ? '📱 QR' : '✍️ Manual'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
