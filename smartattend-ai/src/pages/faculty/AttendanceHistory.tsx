import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { pastSessions } from '../../data/mockData';
import type { CorrectionRequest } from '../../types';

export default function AttendanceHistory() {
  const sessions = pastSessions;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Attendance History</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          All past attendance sessions with student records
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sessions.map((s: typeof pastSessions[0]) => {
          const pct = Math.round(s.presentCount / s.totalStudents * 100);
          return (
            <div key={s.id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{s.subjectName}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    {s.subjectCode} · Room {s.room} · {new Date(s.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })} · {s.startTime}–{s.endTime}
                  </div>
                </div>
                <span className="badge badge-muted">Completed</span>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-heading)' }}>{s.presentCount}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Present</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-heading)' }}>{s.absentCount}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Absent</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}>{s.totalStudents}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Attendance</span>
                    <span style={{ fontWeight: 700, color: pct >= 75 ? 'var(--success)' : 'var(--warning)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct >= 75 ? 'var(--success)' : 'var(--warning)', borderRadius: '4px' }} />
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm">View Records</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
