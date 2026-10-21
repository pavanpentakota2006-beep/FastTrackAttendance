import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { correctionRequests as initial } from '../../data/mockData';
import type { CorrectionRequest } from '../../types';

export default function StudentCorrections() {
  const myRequests = initial.filter(r => r.studentId === 'st2');
  const [requests, setRequests] = useState<CorrectionRequest[]>(myRequests);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subjectId: 's1', date: '', reason: '' });

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Correction Requests</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Submit attendance correction requests for review
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} /> New Request
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {requests.map(r => (
          <div key={r.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.5px', marginBottom: '4px' }}>{r.subjectName}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {new Date(r.date).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge badge-danger">{r.currentStatus}</span>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
                <span className="badge badge-success">{r.requestedStatus}</span>
                <span className={`badge ${r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                  {r.status === 'approved' ? <CheckCircle size={11} /> : r.status === 'rejected' ? <XCircle size={11} /> : <Clock size={11} />}
                  {' '}{r.status}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '2px solid var(--border)', paddingLeft: '10px', marginBottom: '8px' }}>
              "{r.reason}"
            </div>
            {r.reviewNote && (
              <div style={{ fontSize: '12px', color: r.status === 'approved' ? 'var(--success)' : 'var(--danger)', padding: '8px 12px', borderRadius: 'var(--radius)', background: r.status === 'approved' ? 'var(--success-subtle)' : 'var(--danger-subtle)' }}>
                Faculty: {r.reviewNote}
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 460, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-strong)', zIndex: 201, padding: '28px',
            animation: 'fadeInScale 0.3s ease',
          }}>
            <h3 style={{ margin: '0 0 20px' }}>New Correction Request</h3>
            <div style={{ marginBottom: '14px' }}>
              <label>Subject</label>
              <select style={{ marginTop: '8px' }} value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
                <option value="s1">CS-DSA-501 — Data Structures</option>
                <option value="s2">CS-OS-502 — Operating Systems</option>
                <option value="s3">CS-CN-501 — Computer Networks</option>
              </select>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label>Date of Session</label>
              <input type="date" style={{ marginTop: '8px' }} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Reason for Correction</label>
              <textarea rows={3} placeholder="Explain why your attendance should be corrected..." style={{ marginTop: '8px', resize: 'vertical' }} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={() => setShowForm(false)}>Submit Request</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
