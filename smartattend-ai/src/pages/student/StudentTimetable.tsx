import React from 'react';
import { timetableSlots } from '../../data/mockData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6];
const PERIOD_TIMES = ['08:00–09:00', '09:00–10:00', '10:00–11:00', '11:00–12:00', '12:00–01:00', '02:00–03:00'];

const COLORS: Record<string, string> = {
  's1': '#6366f1', 's2': '#10b981', 's3': '#f59e0b',
  's4': '#3b82f6', 's5': '#ef4444', 's6': '#8b5cf6',
};

export default function StudentTimetable() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long' });

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>My Timetable</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          CSE Semester 5 · Section A · Current week
        </p>
      </div>

      {/* Today's classes quick view */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--accent)' }}>
          📅 Today — {today}
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {timetableSlots.filter(t => t.day === today).sort((a, b) => a.period - b.period).map(slot => {
            const color = COLORS[slot.subjectId] ?? '#6366f1';
            return (
              <div key={slot.id} style={{
                padding: '10px 14px', borderRadius: 'var(--radius)',
                background: `${color}12`, border: `1px solid ${color}40`,
                borderLeft: `3px solid ${color}`,
              }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color }}>P{slot.period} · {PERIOD_TIMES[slot.period - 1].split('–')[0]}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{slot.subjectCode}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{slot.room}</div>
              </div>
            );
          })}
          {timetableSlots.filter(t => t.day === today).length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>No classes today 🎉</div>
          )}
        </div>
      </div>

      {/* Full grid */}
      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table style={{ minWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 120 }}>Period</th>
              {DAYS.map(d => (
                <th key={d} style={{ color: d === today ? 'var(--accent)' : undefined }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period, pi) => (
              <tr key={period}>
                <td style={{ background: 'rgba(255,255,255,0.02)', fontWeight: 600 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Period {period}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{PERIOD_TIMES[pi]}</div>
                </td>
                {DAYS.map(day => {
                  const slot = timetableSlots.find(t => t.day === day && t.period === period);
                  const color = slot ? (COLORS[slot.subjectId] ?? '#6366f1') : null;
                  const isToday = day === today;
                  return (
                    <td key={day} style={{ padding: '8px', verticalAlign: 'top', height: 75, background: isToday ? 'rgba(99,102,241,0.03)' : 'transparent' }}>
                      {slot && color ? (
                        <div style={{
                          background: `${color}15`, border: `1px solid ${color}40`,
                          borderRadius: 'var(--radius)', padding: '10px',
                          borderLeft: `3px solid ${color}`, height: '100%',
                          boxShadow: isToday ? `0 0 12px ${color}20` : 'none',
                        }}>
                          <div style={{ fontWeight: 700, fontSize: '12px', color, marginBottom: '3px' }}>{slot.subjectCode}</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {slot.subjectName.length > 18 ? slot.subjectName.substring(0, 16) + '…' : slot.subjectName}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>{slot.room}</div>
                        </div>
                      ) : (
                        <div style={{ height: '100%' }} />
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
