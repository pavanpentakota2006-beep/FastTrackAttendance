import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { subjectPerformance } from '../../data/chartData';
import { subjects, students } from '../../data/mockData';

export default function FacultyAnalytics() {
  const highRisk = students.filter(s => s.riskLevel === 'high');

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Faculty Analytics</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>Performance insights for your subjects and students</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 20px' }}>Subject Performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="code" tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Bar dataKey="attendance" name="Attendance" radius={[0, 4, 4, 0]}
                fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 20px' }}>Attendance Trend (My Classes)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={[
              { week: 'W1', avg: 82 }, { week: 'W2', avg: 79 }, { week: 'W3', avg: 84 },
              { week: 'W4', avg: 80 }, { week: 'W5', avg: 83 }, { week: 'W6', avg: 81 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis domain={[70, 95]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Line type="monotone" dataKey="avg" name="Avg Attendance" stroke="#10b981" strokeWidth={2.5} dot={{ r: 5, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', margin: '0 0 16px' }}>My Subjects Overview</h3>
        <table>
          <thead>
            <tr>
              <th>Subject</th><th>Code</th><th>Classes Conducted</th><th>Avg Attendance</th><th>Risk Students</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subjects.slice(0, 4).map(s => {
              const avg = 72 + Math.floor(Math.random() * 20);
              const risk = Math.floor(Math.random() * 6) + 1;
              return (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td><code style={{ fontSize: '12px' }}>{s.code}</code></td>
                  <td>{s.conductedClasses}/{s.totalClasses}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: 50, height: 5, background: 'var(--bg-glass)', borderRadius: '3px' }}>
                        <div style={{ width: `${avg}%`, height: '100%', background: avg >= 75 ? 'var(--success)' : 'var(--warning)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontWeight: 600, color: avg >= 75 ? 'var(--success)' : 'var(--warning)', fontSize: '13px' }}>{avg}%</span>
                    </div>
                  </td>
                  <td><span className="badge badge-danger">{risk}</span></td>
                  <td><span className={`badge ${avg >= 75 ? 'badge-success' : 'badge-warning'}`}>{avg >= 75 ? 'On Track' : 'Needs Attention'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', margin: '0 0 16px' }}>High Risk Students Alert</h3>
        <div className="grid-3">
          {highRisk.slice(0, 6).map(s => (
            <div key={s.id} style={{ padding: '14px', borderRadius: 'var(--radius)', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '4px' }}>{s.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{s.rollNo}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-heading)' }}>{s.overallAttendance}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Needs {s.classesNeeded} more classes</div>
              <button className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: '10px', justifyContent: 'center', fontSize: '11.5px' }}>
                Send Warning
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
