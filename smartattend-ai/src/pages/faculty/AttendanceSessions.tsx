import React, { useState } from 'react';
import { Play, Plus, Clock, Users, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { activeSessions, pastSessions, subjects } from '../../data/mockData';

export default function AttendanceSessions() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ subjectId: 's1', room: 'CS-101', method: 'face' });

  const allSessions = [...activeSessions, ...pastSessions];

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Attendance Sessions</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Create and manage attendance sessions for your classes
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={15} /> Create Session
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {allSessions.map(s => {
          const pct = Math.round(s.presentCount / s.totalStudents * 100);
          const isActive = s.status === 'active';
          return (
            <div key={s.id} className="glass-card" style={{
              padding: '20px',
              border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)',
              background: isActive ? 'rgba(16,185,129,0.04)' : 'var(--bg-glass)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', marginBottom: '4px' }}>{s.subjectName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {s.subjectCode} · Room {s.room} · {new Date(s.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
                {isActive ? (
                  <span className="badge badge-success">LIVE</span>
                ) : (
                  <span className="badge badge-muted">Completed</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                {[
                  { label: 'Present', value: s.presentCount, color: 'var(--success)' },
                  { label: 'Absent', value: s.absentCount, color: 'var(--danger)' },
                  { label: 'Total', value: s.totalStudents, color: 'var(--text-muted)' },
                ].map(stat => (
                  <div key={stat.label} style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: 'var(--radius)', background: 'var(--bg-glass)' }}>
                    <div style={{ fontWeight: 800, fontSize: '18px', color: stat.color, fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ height: 6, background: 'var(--bg-glass)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct >= 75 ? 'var(--success)' : 'var(--warning)', borderRadius: '3px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{s.startTime} {s.endTime ? `– ${s.endTime}` : '(ongoing)'}</span>
                  <span style={{ fontWeight: 700, color: pct >= 75 ? 'var(--success)' : 'var(--warning)' }}>{pct}%</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {isActive && (
                  <button className="btn btn-success btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/faculty/live')}>
                    <Play size={13} /> View Live
                  </button>
                )}
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <Users size={13} /> Students
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Session Modal */}
      {showCreate && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(4px)' }} onClick={() => setShowCreate(false)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 500, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-strong)', zIndex: 201, padding: '28px',
            animation: 'fadeInScale 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Create Attendance Session</h3>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowCreate(false)}><X size={16} /></button>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {['Subject', 'Config', 'Start'].map((label, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', margin: '0 auto 4px',
                    background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--accent)' : 'var(--bg-glass)',
                    border: `2px solid ${step >= i + 1 ? (step > i + 1 ? 'var(--success)' : 'var(--accent)') : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, color: step >= i + 1 ? 'white' : 'var(--text-muted)',
                  }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: '11px', color: step === i + 1 ? 'var(--accent)' : 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label>Select Subject</label>
                  <select style={{ marginTop: '8px' }} value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label>Classroom / Room No</label>
                  <input type="text" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} style={{ marginTop: '8px' }} />
                </div>
                <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={() => setStep(2)}>
                  Next → Configure
                </button>
              </div>
            )}
            {step === 2 && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label>Verification Method</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    {[
                      { value: 'face', label: '📷 Face Recognition', desc: 'Biometric + liveness' },
                      { value: 'qr',   label: '📱 QR Code',          desc: 'Dynamic QR scan' },
                      { value: 'manual', label: '✍️ Manual',          desc: 'Faculty marks manually' },
                    ].map(m => (
                      <div
                        key={m.value}
                        onClick={() => setForm(f => ({ ...f, method: m.value }))}
                        style={{
                          flex: 1, padding: '12px', borderRadius: 'var(--radius)',
                          border: `2px solid ${form.method === m.value ? 'var(--accent)' : 'var(--border)'}`,
                          background: form.method === m.value ? 'var(--accent-subtle)' : 'var(--bg-input)',
                          cursor: 'pointer', textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>{m.label.split(' ')[0]}</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: form.method === m.value ? 'var(--accent)' : 'var(--text-secondary)' }}>{m.label.split(' ').slice(1).join(' ')}</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={() => setStep(3)}>Next → Review</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <div style={{ padding: '16px', borderRadius: 'var(--radius)', background: 'var(--bg-glass)', border: '1px solid var(--border)', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px' }}>Session Summary</h4>
                  {[
                    ['Subject', subjects.find(s => s.id === form.subjectId)?.name ?? ''],
                    ['Room', form.room],
                    ['Method', form.method === 'face' ? '📷 Face Recognition' : form.method === 'qr' ? '📱 QR Code' : '✍️ Manual'],
                    ['Date', new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
                    ['Time', new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(2)}>← Back</button>
                  <button
                    className="btn btn-success"
                    style={{ flex: 2, justifyContent: 'center' }}
                    onClick={() => { setShowCreate(false); navigate('/faculty/live'); }}
                  >
                    <Play size={14} /> Start Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
