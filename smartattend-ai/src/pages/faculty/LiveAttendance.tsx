import React, { useState, useEffect } from 'react';
import { Play, Square, Clock, Users, CheckCircle, XCircle, AlertCircle, QrCode, RefreshCw } from 'lucide-react';
import { activeSessions, students } from '../../data/mockData';
import type { LiveStudent } from '../../types';

const SESSION = activeSessions[0];

const initialStudents: LiveStudent[] = students.slice(0, 12).map((s, i) => ({
  id: s.id, name: s.name, rollNo: s.rollNo,
  status: i < 3 ? 'present' : 'pending',
  verifiedAt: i < 3 ? '09:02' : undefined,
  faceConfidence: i < 3 ? Math.floor(Math.random() * 10 + 88) : undefined,
  locationVerified: i < 3 ? true : undefined,
}));

function QRTimer({ expiry }: { expiry: number }) {
  const [time, setTime] = useState(expiry);
  useEffect(() => {
    const t = setInterval(() => setTime(v => v <= 1 ? expiry : v - 1), 1000);
    return () => clearInterval(t);
  }, [expiry]);
  const pct = (time / expiry) * 100;
  const color = time > 15 ? 'var(--success)' : time > 8 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
        <svg width="80" height="80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="5" />
          <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round" strokeDasharray={`${213.6}`}
            strokeDashoffset={`${213.6 * (1 - pct / 100)}`}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
          <text x="40" y="45" textAnchor="middle" fill={color} fontSize="18" fontWeight="700">{time}s</text>
        </svg>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>QR refreshes in {time}s</div>
    </div>
  );
}

export default function LiveAttendance() {
  const [liveStudents, setLiveStudents] = useState<LiveStudent[]>(initialStudents);
  const [sessionActive, setSessionActive] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [showQR, setShowQR] = useState(false);

  // Auto-stream students
  useEffect(() => {
    if (!sessionActive) return;
    const interval = setInterval(() => {
      setLiveStudents(prev => {
        const pendingIdx = prev.findIndex(s => s.status === 'pending');
        if (pendingIdx === -1) return prev;
        const updated = [...prev];
        const isSuccess = Math.random() > 0.15;
        updated[pendingIdx] = {
          ...updated[pendingIdx],
          status: isSuccess ? 'present' : 'failed',
          verifiedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          faceConfidence: isSuccess ? Math.floor(Math.random() * 10 + 88) : Math.floor(Math.random() * 15 + 60),
          locationVerified: isSuccess ? Math.random() > 0.1 : false,
        };
        return updated;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [sessionActive]);

  // Timer
  useEffect(() => {
    if (!sessionActive) return;
    const t = setInterval(() => setElapsed(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [sessionActive]);

  const present = liveStudents.filter(s => s.status === 'present').length;
  const failed  = liveStudents.filter(s => s.status === 'failed').length;
  const verifying = liveStudents.filter(s => s.status === 'verifying').length;
  const pending   = liveStudents.filter(s => s.status === 'pending').length;
  const pct = Math.round(present / liveStudents.length * 100);

  const formatElapsed = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const statusIcon = {
    present:   <CheckCircle size={16} color="var(--success)" />,
    failed:    <XCircle size={16} color="var(--danger)" />,
    verifying: <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />,
    pending:   <Clock size={16} color="var(--text-muted)" />,
  };

  return (
    <div className="page-container">
      {/* Session Header */}
      <div className="glass-card" style={{
        padding: '24px', marginBottom: '24px',
        background: sessionActive ? 'rgba(16,185,129,0.06)' : 'var(--bg-glass)',
        border: sessionActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{SESSION.subjectName}</h2>
              {sessionActive && (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  LIVE SESSION
                </span>
              )}
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13.5px' }}>
              {SESSION.subjectCode} · Room {SESSION.room} · {SESSION.facultyName}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--success)' }}>
                {formatElapsed(elapsed)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Session Duration</div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowQR(v => !v)}
              style={{ gap: '6px' }}
            >
              <QrCode size={15} /> {showQR ? 'Hide QR' : 'Show QR'}
            </button>
            <button
              onClick={() => setSessionActive(false)}
              className="btn btn-danger btn-sm"
              disabled={!sessionActive}
            >
              <Square size={14} /> End Session
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showQR ? '1fr 1fr 1fr 1fr auto' : '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Present', value: present, icon: <CheckCircle size={22} />, color: 'var(--success)' },
          { label: 'Failed', value: failed, icon: <XCircle size={22} />, color: 'var(--danger)' },
          { label: 'Pending', value: pending, icon: <Clock size={22} />, color: 'var(--text-muted)' },
          { label: 'Attendance %', value: `${pct}%`, icon: <Users size={22} />, color: pct >= 75 ? 'var(--success)' : 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}

        {showQR && (
          <div className="glass-card" style={{ padding: '18px', textAlign: 'center', minWidth: 160 }}>
            <div style={{ marginBottom: '10px' }}>
              {/* QR Code visual */}
              <div style={{
                width: 90, height: 90, margin: '0 auto',
                background: 'white', borderRadius: '8px', padding: '6px',
                display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '2px',
              }}>
                {Array.from({ length: 64 }, (_, i) => (
                  <div key={i} style={{ borderRadius: '1px', background: [0,1,2,8,9,10,16,17,18,3,4,5,11,12,13,19,20,21,48,49,50,40,41,42,32,33,34,24,25,26].includes(i) || Math.random() > 0.55 ? '#111' : 'transparent' }} />
                ))}
              </div>
            </div>
            <QRTimer expiry={30} />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {present} of {liveStudents.length} students verified
          </span>
          <span style={{ fontWeight: 700, color: pct >= 75 ? 'var(--success)' : 'var(--warning)' }}>{pct}%</span>
        </div>
        <div style={{ height: 10, background: 'var(--bg-glass)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((present + failed) / liveStudents.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--success), #34d399)',
            borderRadius: '5px',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* Live Student Grid */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '15px' }}>Live Student Verification Stream</h3>
          <button className="btn btn-ghost btn-sm"><RefreshCw size={13} /> Refresh</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
          {liveStudents.map((s, i) => {
            const bg = { present: 'rgba(16,185,129,0.08)', failed: 'rgba(239,68,68,0.08)', verifying: 'rgba(99,102,241,0.08)', pending: 'var(--bg-glass)' }[s.status];
            const borderC = { present: 'rgba(16,185,129,0.3)', failed: 'rgba(239,68,68,0.3)', verifying: 'rgba(99,102,241,0.3)', pending: 'var(--border)' }[s.status];
            return (
              <div key={s.id} style={{
                padding: '12px 14px', borderRadius: 'var(--radius)', border: `1px solid ${borderC}`,
                background: bg, display: 'flex', gap: '10px', alignItems: 'center',
                animation: `fadeInScale 0.4s ease ${i * 0.04}s both`,
                transition: 'all 0.5s ease',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${borderC}, ${borderC}44)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, color: 'white',
                }}>
                  {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {s.rollNo}
                    {s.faceConfidence && <span style={{ marginLeft: '6px', color: s.faceConfidence >= 85 ? 'var(--success)' : 'var(--danger)' }}>{s.faceConfidence}%</span>}
                  </div>
                </div>
                {statusIcon[s.status]}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', padding: '14px', borderRadius: 'var(--radius)', background: 'var(--bg-glass)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { label: 'Present', count: present, color: 'var(--success)' },
            { label: 'Failed', count: failed, color: 'var(--danger)' },
            { label: 'Pending', count: pending, color: 'var(--text-muted)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
              <span style={{ color: s.color, fontWeight: 600 }}>{s.count}</span>
              <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
