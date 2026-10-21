import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Users, TrendingUp, AlertTriangle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subjects, students, activeSessions, correctionRequests, notifications } from '../../data/mockData';
import { weeklyAttendance } from '../../data/chartData';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const mySubjects = subjects.slice(0, 3);
  const highRisk = students.filter(s => s.riskLevel === 'high').slice(0, 5);
  const myNotifs = notifications.filter(n => n.userId === 'f2').slice(0, 3);
  const pending = correctionRequests.filter(r => r.status === 'pending').length;

  const todayClasses = [
    { time: '09:00', subject: 'Data Structures & Algorithms', room: 'CS-101', status: 'active' as const },
    { time: '11:00', subject: 'Computer Networks', room: 'CS-201', status: 'upcoming' as const },
    { time: '02:00', subject: 'Data Structures & Algorithms (Lab)', room: 'CS-Lab1', status: 'upcoming' as const },
  ];

  const statusStyle = { active: { bg: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: 'rgba(16,185,129,0.3)' }, upcoming: { bg: 'var(--bg-glass)', color: 'var(--text-muted)', border: 'var(--border)' } };

  return (
    <div className="page-container">
      {/* Greeting */}
      <div className="glass-card" style={{
        padding: '24px 28px', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '22px' }}>Good Morning, Prof. Meera 👋</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
              You have <strong style={{ color: 'var(--accent)' }}>3 classes</strong> today and{' '}
              <strong style={{ color: 'var(--warning)' }}>{pending} pending</strong> correction requests.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'My Subjects', value: mySubjects.length, icon: <BookOpen size={20} />, color: '#6366f1' },
          { label: 'My Students', value: 48, icon: <Users size={20} />, color: '#10b981' },
          { label: 'Avg Attendance', value: '82%', icon: <TrendingUp size={20} />, color: '#f59e0b' },
          { label: 'Pending Requests', value: pending, icon: <AlertTriangle size={20} />, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '18px 22px' }}>
            <div style={{ color: s.color, marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Today's Classes */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Today's Classes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todayClasses.map((c, i) => {
              const st = statusStyle[c.status];
              return (
                <div key={i} style={{
                  padding: '14px 16px', borderRadius: 'var(--radius)',
                  background: st.bg, border: `1px solid ${st.border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', minWidth: 40 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: st.color }}>{c.time}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AM/PM</div>
                    </div>
                    <div style={{ width: 1, height: 30, background: 'var(--border)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{c.subject}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Room {c.room}</div>
                    </div>
                  </div>
                  {c.status === 'active' ? (
                    <button className="btn btn-success btn-sm" onClick={() => navigate('/faculty/live')}>
                      <Play size={12} /> Live
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm">
                      <Play size={12} /> Start
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyAttendance}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="present" name="Present" stroke="#10b981" fill="url(#wGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Subjects */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>My Subjects</h3>
        <div className="grid-3">
          {mySubjects.map(sub => {
            const pct = Math.round((sub.conductedClasses / sub.totalClasses) * 100);
            const avgAtt = 78 + Math.floor(Math.random() * 15);
            return (
              <div key={sub.id} style={{
                padding: '16px', borderRadius: 'var(--radius)',
                background: `${sub.color}10`, border: `1px solid ${sub.color}40`,
                borderLeft: `3px solid ${sub.color}`,
              }}>
                <div style={{ fontWeight: 700, fontSize: '13.5px', color: sub.color, marginBottom: '4px' }}>{sub.code}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{sub.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Avg Attendance</span>
                  <span style={{ fontWeight: 700, color: avgAtt >= 75 ? 'var(--success)' : 'var(--warning)' }}>{avgAtt}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg-glass)', borderRadius: '3px' }}>
                  <div style={{ width: `${avgAtt}%`, height: '100%', background: sub.color, borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {sub.conductedClasses}/{sub.totalClasses} classes · {pct}% complete
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Low Attendance Students */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '15px' }}>High Risk Students in My Classes</h3>
          <button className="btn btn-secondary btn-sm">Send Alert to All</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {highRisk.map(s => (
            <div key={s.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 14px', borderRadius: 'var(--radius)',
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444, #f97316)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, color: 'white',
                }}>
                  {s.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{s.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{s.rollNo}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--danger)' }}>{s.overallAttendance}%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>needs {s.classesNeeded} more</div>
                </div>
                <button className="btn btn-danger btn-sm"><AlertTriangle size={12} /> Alert</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
