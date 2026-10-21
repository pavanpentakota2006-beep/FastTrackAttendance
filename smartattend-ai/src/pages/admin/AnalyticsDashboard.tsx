import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  monthlyAttendanceTrend, weeklyAttendance, departmentComparison,
  riskDistribution, subjectPerformance, verificationMethods, hourlyAttendance,
} from '../../data/chartData';

const TT = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', padding: '12px 16px', boxShadow: 'var(--shadow-lg)' }}>
      <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)', fontSize: '13px' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, marginTop: 3 }} />
          <span>{p.name}: <strong style={{ color: 'var(--text-primary)' }}>{p.value}{typeof p.value === 'number' && p.value <= 100 ? '%' : ''}</strong></span>
        </div>
      ))}
    </div>
  );
};

interface ChartCard { title: string; sub: string; children: React.ReactNode }
function ChartCard({ title, sub, children }: ChartCard) {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '15px' }}>{title}</h3>
        <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>{sub}</p>
      </div>
      {children}
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Analytics Dashboard</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Comprehensive attendance insights · Semester Aug 2026
        </p>
      </div>

      {/* Summary Strip */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Avg Attendance', value: '79.4%', color: '#6366f1', trend: '▲ 0.6%' },
          { label: 'Sessions This Month', value: '248', color: '#10b981', trend: '▲ 12' },
          { label: 'Defaulters', value: '172',  color: '#ef4444', trend: '▼ 8' },
          { label: 'AI Predictions', value: '980', color: '#8b5cf6', trend: '↺ Updated' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '12px', color: s.color, marginTop: '6px', fontWeight: 600 }}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', marginBottom: '24px' }}>
        <ChartCard title="Monthly Attendance Trend" sub="Attendance % per department over last 6 months">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyAttendanceTrend}>
              <defs>
                {[{key:'cse',c:'#6366f1'},{key:'ece',c:'#10b981'},{key:'it',c:'#8b5cf6'},{key:'overall',c:'#f59e0b'}].map(({key,c})=>(
                  <linearGradient key={key} id={`ga${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{fontSize:11}} />
              <YAxis domain={[65,98]} tick={{fontSize:11}} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="cse" name="CSE" stroke="#6366f1" fill="url(#gacse)" strokeWidth={2} />
              <Area type="monotone" dataKey="ece" name="ECE" stroke="#10b981" fill="url(#gaece)" strokeWidth={2} />
              <Area type="monotone" dataKey="it"  name="IT"  stroke="#8b5cf6" fill="url(#gait)"  strokeWidth={2} />
              <Area type="monotone" dataKey="overall" name="Overall" stroke="#f59e0b" fill="url(#gaoverall)" strokeWidth={2.5} strokeDasharray="4 4" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Verification Methods" sub="How attendance was marked">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={verificationMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {verificationMethods.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {verificationMethods.map(m => (
            <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '3px', background: m.fill }} />
                {m.name}
              </div>
              <span style={{ fontWeight: 700, color: m.fill }}>{m.value}%</span>
            </div>
          ))}
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <ChartCard title="Subject Performance" sub="Average attendance per subject">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[60,100]} tick={{fontSize:10}} />
              <YAxis type="category" dataKey="code" tick={{fontSize:10}} width={55} />
              <Tooltip content={<TT />} />
              <Bar dataKey="attendance" name="Attendance" radius={[0,4,4,0]}
                fill="url(#barGrad)">
                {subjectPerformance.map((e, i) => (
                  <Cell key={i} fill={e.attendance >= 80 ? '#10b981' : e.attendance >= 75 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hourly Distribution" sub="Sessions and presence by hour today">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourlyAttendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:11}} />
              <Tooltip content={<TT />} />
              <Bar dataKey="present" name="Students Present" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        <ChartCard title="Weekly Attendance" sub="Present vs Absent this week">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:11}} />
              <Tooltip content={<TT />} />
              <Bar dataKey="present" name="Present" stackId="a" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="absent"  name="Absent"  stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Distribution" sub="Students by attendance risk level">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                {riskDistribution.map((e,i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {riskDistribution.map(r => (
              <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.fill }} />
                  {r.name}
                </div>
                <strong style={{ fontSize: '12px', color: r.fill }}>{r.value}%</strong>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
