import React, { useState } from 'react';
import { Search, Plus, Filter, Download, UserCheck, UserX, AlertTriangle, CheckCircle } from 'lucide-react';
import { students } from '../../data/mockData';
import type { Student, RiskLevel } from '../../types';

const riskColors: Record<RiskLevel, { bg: string; color: string; label: string }> = {
  low:    { bg: 'var(--success-subtle)', color: 'var(--success)', label: 'Low' },
  medium: { bg: 'var(--warning-subtle)', color: 'var(--warning)', label: 'Medium' },
  high:   { bg: 'var(--danger-subtle)',  color: 'var(--danger)',  label: 'High' },
};

export default function StudentManagement() {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | RiskLevel>('all');
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'risk'>('name');
  const [selected, setSelected] = useState<Student | null>(null);

  const filtered = students
    .filter(s =>
      (filterRisk === 'all' || s.riskLevel === filterRisk) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
       s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
       s.email.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      if (sortBy === 'attendance') return a.overallAttendance - b.overallAttendance;
      const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
      return order[a.riskLevel] - order[b.riskLevel];
    });

  const stats = {
    total: students.length,
    low:   students.filter(s => s.riskLevel === 'low').length,
    med:   students.filter(s => s.riskLevel === 'medium').length,
    high:  students.filter(s => s.riskLevel === 'high').length,
    enrolled: students.filter(s => s.faceEnrolled).length,
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Student Management</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            {stats.total} students enrolled across {5} departments
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
          <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Student</button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total', value: stats.total, icon: '👨‍🎓', color: '#6366f1' },
          { label: 'Low Risk', value: stats.low, icon: '🟢', color: '#10b981' },
          { label: 'Medium Risk', value: stats.med, icon: '🟡', color: '#f59e0b' },
          { label: 'High Risk', value: stats.high, icon: '🔴', color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 220,
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '8px 14px',
          }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search students by name, roll no..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', padding: 0, flex: 1, fontSize: '13.5px', color: 'var(--text-primary)', boxShadow: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'low', 'medium', 'high'] as const).map(r => (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                className={`btn btn-sm ${filterRisk === r ? 'btn-primary' : 'btn-secondary'}`}
                style={filterRisk === r ? {} : {}}
              >
                <Filter size={12} /> {r === 'all' ? 'All' : `${r.charAt(0).toUpperCase() + r.slice(1)} Risk`}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'attendance' | 'risk')}
            style={{ width: 'auto', minWidth: 130 }}
          >
            <option value="name">Sort by Name</option>
            <option value="attendance">Sort by Attendance</option>
            <option value="risk">Sort by Risk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Section</th>
                <th>Attendance</th>
                <th>Risk</th>
                <th>Face Enrolled</th>
                <th>Classes Needed</th>
                <th>Predicted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const rStyle = riskColors[s.riskLevel];
                return (
                  <tr key={s.id} onClick={() => setSelected(s)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                          background: `linear-gradient(135deg, ${rStyle.color}, ${rStyle.color}88)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 700, color: 'white',
                        }}>
                          {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{s.name}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontSize: '12px' }}>{s.rollNo}</code></td>
                    <td><span className="badge badge-muted">{s.section}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 50, height: 5, background: 'var(--bg-glass)', borderRadius: '3px' }}>
                          <div style={{
                            width: `${s.overallAttendance}%`, height: '100%',
                            background: s.overallAttendance >= 80 ? 'var(--success)' : s.overallAttendance >= 75 ? 'var(--warning)' : 'var(--danger)',
                            borderRadius: '3px',
                          }} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: s.overallAttendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                          {s.overallAttendance}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: rStyle.bg, color: rStyle.color, border: `1px solid ${rStyle.color}30` }}>
                        {rStyle.label}
                      </span>
                    </td>
                    <td>
                      {s.faceEnrolled
                        ? <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Yes</span>
                        : <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}><UserX size={14} /> No</span>
                      }
                    </td>
                    <td>
                      {s.classesNeeded > 0
                        ? <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{s.classesNeeded} classes</span>
                        : <span style={{ color: 'var(--success)' }}>On track</span>
                      }
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{s.predictedAttendance}%</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                        <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="View Details">
                          <UserCheck size={13} />
                        </button>
                        <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="Send Alert">
                          <AlertTriangle size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary row */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {students.length} students
          </span>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--success)' }}>🟢 {stats.low} Low</span>
            <span style={{ color: 'var(--warning)' }}>🟡 {stats.med} Medium</span>
            <span style={{ color: 'var(--danger)' }}>🔴 {stats.high} High</span>
          </div>
        </div>
      </div>

      {/* Student Detail Panel */}
      {selected && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(4px)' }}
            onClick={() => setSelected(null)}
          />
          <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: 420,
            background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)',
            zIndex: 201, padding: '28px', overflowY: 'auto',
            animation: 'slideInRight 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h3 style={{ margin: 0 }}>Student Profile</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
                background: `linear-gradient(135deg, ${riskColors[selected.riskLevel].color}, ${riskColors[selected.riskLevel].color}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: 800, color: 'white',
                boxShadow: `0 0 30px ${riskColors[selected.riskLevel].color}40`,
              }}>
                {selected.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{selected.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{selected.rollNo} · {selected.departmentName}</div>
              <div style={{ marginTop: '12px' }}>
                <span className="badge" style={{
                  background: riskColors[selected.riskLevel].bg,
                  color: riskColors[selected.riskLevel].color,
                  fontSize: '13px', padding: '5px 14px',
                }}>
                  {riskColors[selected.riskLevel].label} Risk
                </span>
              </div>
            </div>

            {/* Attendance ring */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="45" fill="none" stroke="var(--bg-glass)" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="45" fill="none"
                  stroke={selected.overallAttendance >= 75 ? 'var(--success)' : 'var(--danger)'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${selected.overallAttendance * 2.827} ${283 - selected.overallAttendance * 2.827}`}
                  strokeDashoffset="0"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div style={{ marginTop: '-90px', fontSize: '26px', fontWeight: 800, color: selected.overallAttendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                {selected.overallAttendance}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '70px' }}>Overall Attendance</div>
            </div>

            {/* Info rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Semester', `Semester ${selected.semester}`],
                ['Section', selected.section],
                ['Present', `${selected.presentCount} classes`],
                ['Absent', `${selected.absentCount} classes`],
                ['Face Enrolled', selected.faceEnrolled ? '✅ Yes' : '❌ No'],
                ['Classes Needed', selected.classesNeeded > 0 ? `${selected.classesNeeded} more to reach 75%` : '✅ On track'],
                ['Predicted End', `${selected.predictedAttendance}%`],
              ].map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{key}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>Send Notification</button>
              <button className="btn btn-secondary" style={{ flex: 1 }}>View Full Report</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
