import React, { useState, useEffect } from 'react';
import {
  Users, GraduationCap, Building2, TrendingUp, TrendingDown,
  Activity, AlertTriangle, BarChart3, CheckCircle, Clock,
  ArrowUpRight, Zap, Brain,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { summaryStats, anomalies, students, auditLogs, activeSessions } from '../../data/mockData';
import { monthlyAttendanceTrend, riskDistribution, departmentComparison } from '../../data/chartData';

function StatCard({ label, value, icon, color, change, suffix = '' }: {
  label: string; value: string | number; icon: React.ReactNode;
  color: string; change?: number; suffix?: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const num = typeof value === 'number' ? value : parseFloat(value as string);

  useEffect(() => {
    let start = 0;
    const end = num;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplayed(end); clearInterval(timer); }
      else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [num]);

  return (
    <div className="glass-card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
          background: `${color}18`, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        {change !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '12px', fontWeight: 600,
            color: change >= 0 ? 'var(--success)' : 'var(--danger)',
          }}>
            {change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', lineHeight: 1 }}>
        {displayed.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>{label}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-tertiary)', border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius)', padding: '12px 16px', boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', fontSize: '13px' }}>{label}</p>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
            <span>{p.name}: <strong style={{ color: 'var(--text-primary)' }}>{p.value}%</strong></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const lowRisk = students.filter(s => s.riskLevel === 'low').length;
  const medRisk = students.filter(s => s.riskLevel === 'medium').length;
  const highRisk = students.filter(s => s.riskLevel === 'high').length;

  return (
    <div className="page-container">
      {/* Top Stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <StatCard label="Total Students"     value={summaryStats.totalStudents}   icon={<GraduationCap size={22} />} color="#6366f1" change={3.2} />
        <StatCard label="Total Faculty"      value={summaryStats.totalFaculty}    icon={<Users size={22} />}         color="#10b981" change={1.1} />
        <StatCard label="Avg Attendance"     value={summaryStats.avgAttendance}   icon={<BarChart3 size={22} />}     color="#f59e0b" suffix="%" change={-0.8} />
        <StatCard label="Active Sessions"    value={summaryStats.activeSessionsToday} icon={<Activity size={22} />} color="#3b82f6" />
      </div>

      {/* Second row stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <StatCard label="Present Today"       value={summaryStats.todayPresent}        icon={<CheckCircle size={22} />}  color="#10b981" />
        <StatCard label="Absent Today"        value={summaryStats.todayAbsent}         icon={<Clock size={22} />}        color="#ef4444" />
        <StatCard label="Pending Requests"    value={summaryStats.pendingRequests}     icon={<AlertTriangle size={22} />} color="#f59e0b" />
        <StatCard label="Anomalies Detected"  value={summaryStats.anomaliesDetected}   icon={<Zap size={22} />}          color="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Monthly Trend Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', margin: 0 }}>Attendance Trend</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Monthly across departments</p>
            </div>
            <span className="badge badge-success">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyAttendanceTrend}>
              <defs>
                {[
                  { id: 'cse', color: '#6366f1' },
                  { id: 'ece', color: '#10b981' },
                  { id: 'it',  color: '#8b5cf6' },
                ].map(({ id, color }) => (
                  <linearGradient key={id} id={`grad_${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[65, 95]} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cse" name="CSE" stroke="#6366f1" fill="url(#grad_cse)" strokeWidth={2} />
              <Area type="monotone" dataKey="ece" name="ECE" stroke="#10b981" fill="url(#grad_ece)" strokeWidth={2} />
              <Area type="monotone" dataKey="it"  name="IT"  stroke="#8b5cf6" fill="url(#grad_it)"  strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Risk Distribution</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Student attendance risk levels</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value"
                >
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Low Risk', count: lowRisk,  pct: 62, color: '#10b981' },
                { label: 'Medium',   count: medRisk,  pct: 20, color: '#f59e0b' },
                { label: 'High Risk', count: highRisk, pct: 18, color: '#ef4444' },
              ].map(({ label, count, pct, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg-glass)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, background: color,
                      borderRadius: '3px', animation: 'progressFill 1s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Department Comparison */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Department Comparison</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Average attendance vs target (75%)</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[60, 95]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 11 }} width={45} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Bar dataKey="target"     name="Target"     fill="rgba(255,255,255,0.1)" radius={[0,4,4,0]} />
              <Bar dataKey="attendance" name="Actual"     fill="#6366f1"              radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Sessions */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', margin: 0 }}>Active Sessions</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Currently running attendance sessions</p>
            </div>
            <span className="badge badge-success">
              <span className="status-dot online" style={{ marginRight: '4px' }} />
              {activeSessions.length} Live
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeSessions.map(s => {
              const pct = Math.round(s.presentCount / s.totalStudents * 100);
              return (
                <div key={s.id} style={{
                  padding: '14px 16px', borderRadius: 'var(--radius)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.subjectName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.room} · {s.facultyName}</div>
                    </div>
                    <span className="badge badge-success">{s.startTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {s.presentCount} / {s.totalStudents} present
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: pct >= 75 ? 'var(--success)' : 'var(--warning)' }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-glass)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: pct >= 75 ? 'var(--success)' : 'var(--warning)',
                      borderRadius: '3px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Anomaly Alerts */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', margin: 0 }}>Anomaly Alerts</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>AI-detected suspicious patterns</p>
            </div>
            <span className="badge badge-danger">{anomalies.filter(a => !a.reviewed).length} Unreviewed</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {anomalies.slice(0, 4).map(a => {
              const sevColor = { low: 'var(--info)', medium: 'var(--warning)', high: 'var(--danger)' }[a.severity];
              return (
                <div key={a.id} style={{
                  display: 'flex', gap: '12px', padding: '12px 14px',
                  borderRadius: 'var(--radius)', background: 'var(--bg-glass)',
                  border: `1px solid ${a.reviewed ? 'var(--border)' : `${sevColor}30`}`,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: sevColor, flexShrink: 0, marginTop: 5,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {a.studentName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {a.description.substring(0, 80)}...
                    </div>
                  </div>
                  {a.reviewed && <span className="badge badge-muted" style={{ fontSize: '10px', flexShrink: 0 }}>Reviewed</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Log */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Recent Activity</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Latest system audit events</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {auditLogs.slice(0, 5).map((log, i) => {
              const actionColor: Record<string, string> = {
                ATTENDANCE_UPDATED: 'var(--warning)',
                SESSION_STARTED: 'var(--success)',
                STUDENT_CREATED: 'var(--accent)',
                SETTINGS_UPDATED: 'var(--info)',
                CORRECTION_REQUESTED: 'var(--warning)',
                SESSION_ENDED: 'var(--text-muted)',
                FACULTY_CREATED: 'var(--accent)',
                LEAVE_REVIEWED: 'var(--success)',
              };
              return (
                <div key={log.id} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--bg-glass)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
                  }}>
                    {log.userName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '2px' }}>
                      <strong>{log.userName}</strong>{' '}
                      <span style={{ color: actionColor[log.action] ?? 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {new Date(log.timestamp).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                      {' · '}{log.entity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* High Risk Students */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', margin: 0 }}>High Risk Students</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Students with attendance below 75%</p>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
            View All <ArrowUpRight size={13} />
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Attendance</th>
                <th>Risk Level</th>
                <th>Classes Needed</th>
                <th>Predicted</th>
              </tr>
            </thead>
            <tbody>
              {students.filter(s => s.riskLevel === 'high').map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ef4444, #f97316)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0,
                      }}>
                        {s.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td><code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.rollNo}</code></td>
                  <td>{s.departmentName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 60, height: 5, background: 'var(--bg-glass)', borderRadius: '3px' }}>
                        <div style={{ width: `${s.overallAttendance}%`, height: '100%', background: 'var(--danger)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--danger)', fontSize: '13px' }}>{s.overallAttendance}%</span>
                    </div>
                  </td>
                  <td><span className="badge badge-danger">High Risk</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--warning)' }}>{s.classesNeeded}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {s.predictedAttendance}%{' '}
                    {s.predictedAttendance < s.overallAttendance ? <TrendingDown size={12} color="var(--danger)" style={{ display:'inline' }} /> : <TrendingUp size={12} color="var(--success)" style={{ display:'inline' }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
