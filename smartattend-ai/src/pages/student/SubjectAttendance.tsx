import React, { useState } from 'react';
import { studentSubjectAttendance } from '../../data/chartData';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function SubjectAttendance() {
  const [selected, setSelected] = useState(studentSubjectAttendance[0]);

  const radarData = studentSubjectAttendance.map(s => ({
    subject: s.code,
    value: s.percentage,
    fullMark: 100,
  }));

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Subject-wise Attendance</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Detailed breakdown per subject with trends and session history
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Subject list */}
        <div className="glass-card" style={{ padding: '16px', height: 'fit-content' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.06em' }}>MY SUBJECTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {studentSubjectAttendance.map(s => (
              <div
                key={s.code}
                onClick={() => setSelected(s)}
                style={{
                  padding: '12px 14px', borderRadius: 'var(--radius)', cursor: 'pointer',
                  border: selected.code === s.code ? `1px solid ${s.color}60` : '1px solid var(--border)',
                  background: selected.code === s.code ? `${s.color}10` : 'transparent',
                  transition: 'all var(--transition-fast)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12.5px', color: selected.code === s.code ? s.color : 'var(--text-primary)' }}>{s.code}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.subject.substring(0, 22)}{s.subject.length > 22 ? '…' : ''}</div>
                </div>
                <span style={{
                  fontWeight: 800, fontSize: '14px',
                  color: s.percentage >= 75 ? 'var(--success)' : 'var(--danger)',
                }}>
                  {s.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px', borderLeft: `4px solid ${selected.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', color: selected.color }}>{selected.code}</h3>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>{selected.subject}</div>
              </div>
              <span className={`badge ${selected.percentage >= 75 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                {selected.percentage}%
              </span>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              {[
                { label: 'Present', value: selected.present, color: 'var(--success)' },
                { label: 'Absent', value: selected.total - selected.present, color: 'var(--danger)' },
                { label: 'Total', value: selected.total, color: 'var(--text-muted)' },
                { label: 'Needed', value: selected.percentage < 75 ? Math.ceil((0.75 * selected.total - selected.present) / 0.25) : 0, color: 'var(--warning)' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', height: 10, background: 'var(--bg-glass)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${selected.percentage}%`, height: '100%', background: selected.color, borderRadius: '5px', transition: 'width 0.8s ease' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14px', margin: '0 0 16px' }}>All Subjects Radar</h4>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <Radar dataKey="value" stroke={selected.color} fill={selected.color} fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14px', margin: '0 0 16px' }}>Comparison</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={studentSubjectAttendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="code" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Tooltip formatter={(v: any) => `${v}%`} />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]}
                    fill="#6366f1"
                    label={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
