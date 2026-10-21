import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Generate a full month of attendance data
function generateCalendarData(year: number, month: number) {
  const data: Record<string, 'present' | 'absent' | 'holiday' | 'weekend'> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const day = date.getDay();
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (day === 0 || day === 6) {
      data[key] = 'weekend';
    } else if ([10, 15].includes(d)) {
      data[key] = 'holiday';
    } else if (d > new Date().getDate() && month >= new Date().getMonth()) {
      // future — no data
    } else {
      data[key] = Math.random() > 0.2 ? 'present' : 'absent';
    }
  }
  return data;
}

const STATUS_STYLE = {
  present: { bg: '#10b98118', color: '#10b981', border: '#10b98130', symbol: '✓' },
  absent:  { bg: '#ef444418', color: '#ef4444', border: '#ef444430', symbol: '✗' },
  holiday: { bg: '#6366f118', color: '#6366f1', border: '#6366f130', symbol: '🎉' },
  weekend: { bg: 'transparent', color: 'var(--text-muted)', border: 'transparent', symbol: '' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function AttendanceCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const calData = generateCalendarData(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to 6 rows
  while (days.length % 7 !== 0) days.push(null);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); };

  const counts = Object.values(calData).reduce((acc, v) => {
    acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Attendance Calendar</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Day-by-day attendance history with status indicators
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          {/* Calendar header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={prev}><ChevronLeft size={16} /></button>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {MONTHS[month]} {year}
            </h3>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={next}><ChevronRight size={16} /></button>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', padding: '6px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {days.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} />;
              const dateKey = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
              const status = calData[dateKey];
              const s = status ? STATUS_STYLE[status] : null;
              const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
              return (
                <div key={d} style={{
                  aspectRatio: '1', borderRadius: 'var(--radius)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                  background: s?.bg ?? 'transparent',
                  border: isToday ? '2px solid var(--accent)' : `1px solid ${s?.border ?? 'transparent'}`,
                  cursor: s ? 'pointer' : 'default',
                  transition: 'all var(--transition-fast)',
                }}>
                  <span style={{
                    fontSize: '13px', fontWeight: isToday ? 800 : 500,
                    color: isToday ? 'var(--accent)' : s?.color ?? 'var(--text-muted)',
                  }}>{d}</span>
                  {s?.symbol && (
                    <span style={{ fontSize: '10px', color: s.color }}>{s.symbol}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { key: 'present', label: 'Present', ...STATUS_STYLE.present },
              { key: 'absent',  label: 'Absent',  ...STATUS_STYLE.absent  },
              { key: 'holiday', label: 'Holiday', ...STATUS_STYLE.holiday },
              { key: 'weekend', label: 'Weekend', ...STATUS_STYLE.weekend },
            ].map(s => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div style={{ width: 14, height: 14, borderRadius: '3px', background: s.bg, border: `1px solid ${s.border || 'var(--border)'}` }} />
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Stats panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '14px', margin: '0 0 14px' }}>{MONTHS[month]} Summary</h4>
            {[
              { label: 'Present',  value: counts.present  ?? 0, color: 'var(--success)' },
              { label: 'Absent',   value: counts.absent   ?? 0, color: 'var(--danger)'  },
              { label: 'Holidays', value: counts.holiday  ?? 0, color: 'var(--accent)'  },
              { label: 'Weekends', value: counts.weekend  ?? 0, color: 'var(--text-muted)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
            <div style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>Month Attendance</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                  {counts.present && (counts.present + (counts.absent ?? 0)) > 0
                    ? Math.round(counts.present / (counts.present + (counts.absent ?? 0)) * 100)
                    : 0}%
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${counts.present && (counts.present + (counts.absent ?? 0)) > 0 ? Math.round(counts.present / (counts.present + (counts.absent ?? 0)) * 100) : 0}%`,
                  height: '100%', background: 'var(--success)', borderRadius: '4px',
                }} />
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '14px', margin: '0 0 12px' }}>Streak Tracker</h4>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--warning)', fontFamily: 'var(--font-heading)' }}>7</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Day consecutive streak 🔥</div>
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6 }}>
              Best streak this semester: <strong style={{ color: 'var(--success)' }}>14 days</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
