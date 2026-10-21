import React from 'react';
import { timetableSlots } from '../../data/mockData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6];
const PERIOD_TIMES = ['08:00–09:00', '09:00–10:00', '10:00–11:00', '11:00–12:00', '12:00–01:00', '02:00–03:00'];

const SUBJECT_COLORS: Record<string, string> = {
  's1': '#6366f1', 's2': '#10b981', 's3': '#f59e0b',
  's4': '#3b82f6', 's5': '#ef4444', 's6': '#8b5cf6',
  's7': '#06b6d4', 's8': '#f97316',
};

export default function TimetableManagement() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Timetable Management</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          CSE — Semester 5 · Section A & B
        </p>
      </div>

      {/* Legend */}
      <div className="glass-card" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {timetableSlots.filter((s, i, arr) => arr.findIndex(t => t.subjectId === s.subjectId) === i).map(s => (
          <div key={s.subjectId} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '3px', background: SUBJECT_COLORS[s.subjectId] ?? '#6366f1' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.subjectCode} — {s.subjectName}</span>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 120 }}>Period / Time</th>
              {DAYS.map(d => <th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period, pi) => (
              <tr key={period}>
                <td style={{ fontWeight: 600, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Period {period}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{PERIOD_TIMES[pi]}</div>
                </td>
                {DAYS.map(day => {
                  const slot = timetableSlots.find(t => t.day === day && t.period === period);
                  const color = slot ? (SUBJECT_COLORS[slot.subjectId] ?? '#6366f1') : '#6366f1';
                  return (
                    <td key={day} style={{ padding: '8px', verticalAlign: 'top', minWidth: 140, height: 80 }}>
                      {slot ? (
                        <div style={{
                          background: `${color}18`, border: `1px solid ${color}40`,
                          borderRadius: 'var(--radius)', padding: '10px 12px',
                          borderLeft: `3px solid ${color}`,
                          cursor: 'pointer', transition: 'all var(--transition-fast)',
                          height: '100%',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = `${color}28`)}
                          onMouseLeave={e => (e.currentTarget.style.background = `${color}18`)}
                        >
                          <div style={{ fontWeight: 700, fontSize: '12.5px', color: color, marginBottom: '3px' }}>
                            {slot.subjectCode}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                            {slot.subjectName.length > 20 ? slot.subjectName.substring(0, 18) + '…' : slot.subjectName}
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                            {slot.room} · {slot.facultyName.split(' ').slice(-1)[0]}
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          height: 64, borderRadius: 'var(--radius)', border: '1px dashed var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        >
                          + Add
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
