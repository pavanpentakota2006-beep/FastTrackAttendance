import React from 'react';
import { Plus, Mail, Phone, BookOpen, Star } from 'lucide-react';
import { faculty, subjects } from '../../data/mockData';

export default function FacultyManagement() {
  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Faculty Management</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            {faculty.length} faculty members across all departments
          </p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Faculty</button>
      </div>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {faculty.map((f, i) => {
          const fSubjects = subjects.filter(s => f.subjects.includes(s.id));
          const avgPct = Math.round(f.avgAttendanceRate);
          return (
            <div key={f.id} className="glass-card" style={{ padding: '22px', animation: `fadeInUp 0.4s ease ${i * 0.07}s both` }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 800, color: 'white',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                }}>
                  {f.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary)' }}>{f.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500, marginTop: '2px' }}>{f.designation}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{f.departmentName}</div>
                </div>
                <span className="badge badge-accent">EMP{f.empId.slice(3)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <Mail size={13} color="var(--accent)" /> {f.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <Phone size={13} color="var(--success)" /> {f.phone}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Subjects</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {fSubjects.map(s => (
                    <span key={s.id} className="badge badge-accent" style={{ fontSize: '11px' }}>
                      <BookOpen size={10} /> {s.code}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius)', background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Avg Attendance Rate</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={11} color="var(--warning)" fill="var(--warning)" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: avgPct >= 80 ? 'var(--success)' : 'var(--warning)' }}>{avgPct}%</span>
                  </div>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                  <div style={{ width: `${avgPct}%`, height: '100%', background: avgPct >= 80 ? 'var(--success)' : 'var(--warning)', borderRadius: '3px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{f.totalClassesTaken} classes taken</span>
                  <span>Joined {new Date(f.joinedAt).getFullYear()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>View Profile</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Analytics</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
