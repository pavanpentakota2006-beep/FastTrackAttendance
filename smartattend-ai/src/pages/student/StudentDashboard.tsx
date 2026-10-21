import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { students, timetableSlots } from '../../data/mockData';
import { studentSubjectAttendance } from '../../data/chartData';

const ME = students[1]; // Priya Patel

function AttendanceRing({ pct }: { pct: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const color = pct >= 80 ? '#10b981' : pct >= 75 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={90} cy={90} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={14} />
        <circle
          cx={90} cy={90} r={r} fill="none" stroke={color} strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          strokeDashoffset={c / 4}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dasharray 1.2s ease' }}
        />
        <text x={90} y={82} textAnchor="middle" fill={color} fontSize={36} fontWeight={800} fontFamily="Outfit, sans-serif">{pct}%</text>
        <text x={90} y={108} textAnchor="middle" fill="#94a3b8" fontSize={13}>Overall</text>
        <text x={90} y={125} textAnchor="middle" fill="#64748b" fontSize={11}>Attendance</text>
      </svg>
      <div style={{
        position: 'absolute', inset: -8, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [count, setCount] = useState({ present: 0, absent: 0 });

  useEffect(() => {
    let p = 0, a = 0;
    const t = setInterval(() => {
      if (p < ME.presentCount) { p += 3; setCount(v => ({ ...v, present: Math.min(p, ME.presentCount) })); }
      if (a < ME.absentCount)  { a += 1; setCount(v => ({ ...v, absent: Math.min(a, ME.absentCount) })); }
      if (p >= ME.presentCount && a >= ME.absentCount) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, []);

  const today = new Date();
  const dayName = today.toLocaleDateString('en-IN', { weekday: 'long' });
  const todaySlots = timetableSlots.filter(t => t.day === dayName).sort((a, b) => a.period - b.period);

  const riskColor = { low: 'var(--success)', medium: 'var(--warning)', high: 'var(--danger)' }[ME.riskLevel];

  return (
    <div className="page-container">
      {/* Top hero */}
      <div className="glass-card" style={{
        padding: '28px 32px', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
          <AttendanceRing pct={ME.overallAttendance} />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: '24px' }}>
              Good Morning, Priya! 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { label: 'Present', value: count.present, color: 'var(--success)' },
                { label: 'Absent',  value: count.absent,  color: 'var(--danger)'  },
                { label: 'Subjects', value: 6,            color: 'var(--accent)'  },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '12px 20px', borderRadius: 'var(--radius)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  textAlign: 'center', minWidth: 80,
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
              <div style={{ padding: '12px 20px', borderRadius: 'var(--radius)', background: `${riskColor}12`, border: `1px solid ${riskColor}30`, textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>RISK LEVEL</div>
                <div style={{ fontWeight: 700, color: riskColor, fontSize: '15px' }}>
                  {ME.riskLevel === 'low' ? '🟢' : ME.riskLevel === 'medium' ? '🟡' : '🔴'} {ME.riskLevel.toUpperCase()}
                </div>
              </div>
              {ME.classesNeeded > 0 && (
                <div style={{ padding: '12px 20px', borderRadius: 'var(--radius)', background: 'var(--warning-subtle)', border: '1px solid rgba(245,158,11,0.3)', textAlign: 'center', minWidth: 120 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>CLASSES NEEDED</div>
                  <div style={{ fontWeight: 800, color: 'var(--warning)', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>{ME.classesNeeded}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>to reach 75%</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/student/mark')}
                style={{ boxShadow: '0 8px 24px rgba(99,102,241,0.4)', fontSize: '14px', padding: '11px 22px' }}
              >
                📷 Mark Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Subject progress */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Subject-wise Attendance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {studentSubjectAttendance.map(s => (
              <div key={s.code}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '3px', background: s.color }} />
                    <span style={{ fontSize: '12.5px', fontWeight: 500 }}>{s.subject}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: s.percentage >= 75 ? 'var(--success)' : 'var(--danger)' }}>{s.percentage}%</span>
                </div>
                <div style={{ height: 7, background: 'var(--bg-glass)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${s.percentage}%`, height: '100%', background: s.color, borderRadius: '4px', transition: 'width 1s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  <span>{s.present}/{s.total} classes</span>
                  {s.percentage < 75 && <span style={{ color: 'var(--danger)' }}>⚠ Below threshold</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's timetable */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px' }}>Today's Schedule</h3>
            <span className="badge badge-muted">{dayName}</span>
          </div>
          {todaySlots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              No classes today 🎉
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todaySlots.map(slot => {
                const sub = studentSubjectAttendance.find(s => s.code === slot.subjectCode);
                const isNow = new Date().getHours() >= parseInt(slot.startTime) && new Date().getHours() < parseInt(slot.endTime);
                return (
                  <div key={slot.id} style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    padding: '12px 14px', borderRadius: 'var(--radius)',
                    background: isNow ? 'rgba(99,102,241,0.1)' : 'var(--bg-glass)',
                    border: isNow ? '1px solid rgba(99,102,241,0.3)' : '1px solid var(--border)',
                  }}>
                    <div style={{ textAlign: 'center', minWidth: 46 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: isNow ? 'var(--accent)' : 'var(--text-muted)' }}>{slot.startTime}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{slot.endTime}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{slot.subjectName}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{slot.room} · {slot.facultyName.split(' ').slice(-1)[0]}</div>
                    </div>
                    {isNow && (
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/student/mark')}>
                        Mark
                      </button>
                    )}
                    {sub && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: sub.percentage >= 75 ? 'var(--success)' : 'var(--danger)',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AI Prediction strip */}
      <div className="glass-card" style={{
        padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 100%)',
        border: '1px solid rgba(139,92,246,0.25)', flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '36px' }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>AI Attendance Prediction</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: 0 }}>
            Based on your current trend, your predicted semester-end attendance is{' '}
            <strong style={{ color: ME.predictedAttendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
              {ME.predictedAttendance}%
            </strong>.{' '}
            {ME.predictedAttendance < 75
              ? `Attend the next ${ME.classesNeeded} consecutive classes to reach safety.`
              : 'You are on track! Keep up the good attendance.'
            }
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/prediction')}>
          <TrendingUp size={13} /> View Details
        </button>
      </div>
    </div>
  );
}
