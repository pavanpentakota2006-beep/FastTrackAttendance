import React from 'react';
import { Building2, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { departments } from '../../data/mockData';

export default function DepartmentManagement() {
  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Department Management</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            {departments.length} departments · {departments.reduce((a, d) => a + d.studentCount, 0)} total students
          </p>
        </div>
        <button className="btn btn-primary btn-sm"><Building2 size={14} /> Add Department</button>
      </div>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {departments.map((dept, i) => (
          <div key={dept.id} className="glass-card" style={{ padding: '24px', animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: 50, height: 50, borderRadius: '14px', flexShrink: 0,
                background: `${dept.color}20`, color: dept.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 800,
                border: `2px solid ${dept.color}40`,
              }}>
                {dept.code.slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{dept.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>HOD: {dept.hodName}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              {[
                { label: 'Students', value: dept.studentCount, icon: <GraduationCap size={14} />, color: dept.color },
                { label: 'Faculty',  value: dept.facultyCount, icon: <Users size={14} />,        color: '#10b981' },
              ].map(s => (
                <div key={s.label} style={{ padding: '12px', borderRadius: 'var(--radius)', background: 'var(--bg-glass)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ color: s.color, marginBottom: '4px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '20px', color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Avg. Attendance</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} color="var(--success)" />
                  <span style={{ fontWeight: 700, color: dept.avgAttendance >= 75 ? 'var(--success)' : 'var(--danger)', fontSize: '14px' }}>{dept.avgAttendance}%</span>
                </div>
              </div>
              <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${dept.avgAttendance}%`, height: '100%',
                  background: `linear-gradient(90deg, ${dept.color}99, ${dept.color})`,
                  borderRadius: '4px',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Target: 75%</span>
                <span style={{ color: dept.avgAttendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                  {dept.avgAttendance >= 75 ? '✓ Above target' : '⚠ Below target'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>View Details</button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Analytics</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
