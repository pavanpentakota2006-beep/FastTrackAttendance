import React, { useState } from 'react';
import { Plus, BookOpen, Users, BarChart2, Edit2 } from 'lucide-react';
import { subjects, faculty } from '../../data/mockData';

export default function SubjectManagement() {
  const [search, setSearch] = useState('');
  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Subject Management</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            {subjects.length} subjects configured
          </p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Subject</button>
      </div>

      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search subjects by name or code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <div className="grid-2">
        {filtered.map((s, i) => {
          const f = faculty.find(f => f.id === s.facultyId);
          const completionPct = Math.round(s.conductedClasses / s.totalClasses * 100);
          return (
            <div key={s.id} className="glass-card" style={{
              padding: '22px',
              borderLeft: `3px solid ${s.color}`,
              animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '8px',
                      background: `${s.color}20`, color: s.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <BookOpen size={15} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{s.name}</div>
                      <span className="badge badge-muted" style={{ fontSize: '10.5px', marginTop: '2px' }}>{s.code}</span>
                    </div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm btn-icon"><Edit2 size={13} /></button>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="badge badge-accent" style={{ fontSize: '11px' }}><Users size={10} /> {f?.name ?? 'Unassigned'}</span>
                <span className="badge badge-muted" style={{ fontSize: '11px' }}>Sem {s.semester}</span>
                <span className="badge badge-muted" style={{ fontSize: '11px' }}>{s.totalClasses} total classes</span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Syllabus Completion</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart2 size={12} color={s.color} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: s.color }}>
                      {s.conductedClasses}/{s.totalClasses}
                    </span>
                  </div>
                </div>
                <div style={{ height: 7, background: 'var(--bg-glass)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${completionPct}%`, height: '100%',
                    background: `linear-gradient(90deg, ${s.color}99, ${s.color})`,
                    borderRadius: '4px',
                    transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                  {completionPct}% complete
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
