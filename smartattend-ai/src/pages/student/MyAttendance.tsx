import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { studentSubjectAttendance } from '../../data/chartData';
import { students } from '../../data/mockData';

const ME = students[1];

export default function MyAttendance() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>My Attendance</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Overall and per-subject attendance summary for this semester
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Overall', value: `${ME.overallAttendance}%`, color: ME.overallAttendance >= 75 ? '#10b981' : '#ef4444' },
          { label: 'Present', value: ME.presentCount, color: '#10b981' },
          { label: 'Absent',  value: ME.absentCount,  color: '#ef4444' },
          { label: 'Needed',  value: ME.classesNeeded > 0 ? `${ME.classesNeeded} classes` : 'On Track ✓', color: ME.classesNeeded > 0 ? '#f59e0b' : '#10b981' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px' }}>Subject-wise Attendance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studentSubjectAttendance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any) => `${v}%`} />
            {/* 75% threshold line */}
            <Bar dataKey="percentage" name="Attendance %" radius={[6, 6, 0, 0]}>
              {studentSubjectAttendance.map((entry, i) => (
                <Cell key={i} fill={entry.percentage >= 75 ? entry.color : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 12, height: 12, borderRadius: '3px', background: '#6366f1' }} /> Above 75% (Safe)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 12, height: 12, borderRadius: '3px', background: '#ef4444' }} /> Below 75% (At Risk)</div>
        </div>
      </div>

      {/* Subject details table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Total</th>
              <th>Attendance %</th>
              <th>Status</th>
              <th>Classes Needed</th>
            </tr>
          </thead>
          <tbody>
            {studentSubjectAttendance.map(s => {
              const needed = s.percentage < 75 ? Math.ceil((0.75 * s.total - s.present) / 0.25) : 0;
              return (
                <tr key={s.code}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '3px', background: s.color }} />
                      {s.subject}
                    </div>
                  </td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>{s.present}</td>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{s.total - s.present}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.total}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 60, height: 5, background: 'var(--bg-glass)', borderRadius: '3px' }}>
                        <div style={{ width: `${s.percentage}%`, height: '100%', background: s.percentage >= 75 ? s.color : 'var(--danger)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontWeight: 700, color: s.percentage >= 75 ? 'var(--success)' : 'var(--danger)' }}>{s.percentage}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${s.percentage >= 75 ? 'badge-success' : 'badge-danger'}`}>
                      {s.percentage >= 75 ? 'Safe' : 'At Risk'}
                    </span>
                  </td>
                  <td style={{ color: needed > 0 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                    {needed > 0 ? `${needed} more` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
