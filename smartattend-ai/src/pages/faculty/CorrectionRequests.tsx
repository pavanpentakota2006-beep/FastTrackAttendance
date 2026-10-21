import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { correctionRequests as initial } from '../../data/mockData';
import type { CorrectionRequest } from '../../types';

export default function CorrectionRequests() {
  const [requests, setRequests] = useState<CorrectionRequest[]>(initial);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewing, setReviewing] = useState<string | null>(null);

  const handle = (id: string, action: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? {
      ...r, status: action, reviewedBy: 'Prof. Meera Iyer',
      reviewedAt: new Date().toISOString(), reviewNote,
    } : r));
    setReviewing(null);
    setReviewNote('');
  };

  const pending = requests.filter(r => r.status === 'pending');
  const done    = requests.filter(r => r.status !== 'pending');

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Correction Requests</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          {pending.length} pending · {done.length} reviewed
        </p>
      </div>

      {pending.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--warning)', marginBottom: '14px' }}>
            ⏳ PENDING REVIEW ({pending.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pending.map(r => (
              <div key={r.id} className="glass-card" style={{
                padding: '20px',
                border: '1px solid rgba(245,158,11,0.3)',
                background: 'rgba(245,158,11,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--warning), #f97316)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: 'white',
                    }}>
                      {r.studentName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14.5px' }}>{r.studentName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.rollNo} · {r.subjectName} · {new Date(r.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge badge-danger">{r.currentStatus}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>→</span>
                    <span className="badge badge-success">{r.requestedStatus}</span>
                  </div>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)', border: '1px solid var(--border)', marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--warning)' }}>
                  "{r.reason}"
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Submitted: {new Date(r.appliedAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                </div>

                {reviewing === r.id ? (
                  <div>
                    <textarea
                      placeholder="Add a review note (optional)..."
                      value={reviewNote}
                      onChange={e => setReviewNote(e.target.value)}
                      rows={2}
                      style={{ marginBottom: '10px', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-success btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handle(r.id, 'approved')}>
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handle(r.id, 'rejected')}>
                        <XCircle size={13} /> Reject
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setReviewing(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => setReviewing(r.id)}>
                    <AlertCircle size={13} /> Review Request
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '14px' }}>
            REVIEWED ({done.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {done.map(r => (
              <div key={r.id} className="glass-card" style={{ padding: '16px 20px', opacity: 0.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{r.studentName}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginLeft: '8px' }}>{r.rollNo} · {r.subjectName}</span>
                  </div>
                  <span className={`badge ${r.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                    {r.status === 'approved' ? <CheckCircle size={11} /> : <XCircle size={11} />} {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
