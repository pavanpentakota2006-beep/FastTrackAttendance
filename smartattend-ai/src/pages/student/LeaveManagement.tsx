import React, { useState } from 'react';
import { Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { leaveRequests as initial } from '../../data/mockData';
import type { LeaveRequest } from '../../types';

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'medical' as LeaveRequest['type'], fromDate: '', toDate: '', reason: '', subjects: [] as string[] });
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!form.fromDate || !form.toDate || !form.reason) return;
    const newLeave: LeaveRequest = {
      id: `l${Date.now()}`,
      studentId: 'st2',
      studentName: 'Priya Patel',
      rollNo: 'CSE21001',
      type: form.type,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      documents: [],
    };
    setLeaves(prev => [newLeave, ...prev]);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ type: 'medical', fromDate: '', toDate: '', reason: '', subjects: [] });
  };

  const statusIcon = { pending: <Clock size={14} color="var(--warning)" />, approved: <CheckCircle size={14} color="var(--success)" />, rejected: <XCircle size={14} color="var(--danger)" /> };
  const statusBadge = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
  const typeLabel = { medical: '🏥 Medical', personal: '👤 Personal', academic: '📚 Academic', emergency: '🚨 Emergency' };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Leave Management</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Apply for leave and track approval status
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} /> Apply Leave
        </button>
      </div>

      {submitted && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius)', background: 'var(--success-subtle)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success)', fontSize: '13.5px', fontWeight: 600, marginBottom: '20px', animation: 'bounceIn 0.4s ease' }}>
          ✅ Leave application submitted successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Applied', value: leaves.length, color: 'var(--accent)' },
          { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: 'var(--success)' },
          { label: 'Pending', value: leaves.filter(l => l.status === 'pending').length, color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {leaves.map((l, i) => (
          <div key={l.id} style={{
            padding: '20px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
          }}>
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{typeLabel[l.type]}</span>
                <span className={`badge ${statusBadge[l.status]}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {statusIcon[l.status]} {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                📅 {new Date(l.fromDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                {l.fromDate !== l.toDate && ` – ${new Date(l.toDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: 500 }}>
                "{l.reason.substring(0, 100)}{l.reason.length > 100 ? '...' : ''}"
              </div>
              {l.reviewNote && (
                <div style={{ fontSize: '12px', color: l.status === 'approved' ? 'var(--success)' : 'var(--danger)', marginTop: '6px' }}>
                  Faculty note: {l.reviewNote}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Applied {new Date(l.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Leave Modal */}
      {showForm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 500, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-strong)', zIndex: 201, padding: '28px',
            animation: 'fadeInScale 0.3s ease',
          }}>
            <h3 style={{ margin: '0 0 24px' }}>Apply for Leave</h3>
            <div style={{ marginBottom: '16px' }}>
              <label>Leave Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                {(['medical','personal','academic','emergency'] as const).map(t => (
                  <div key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                    padding: '10px 14px', borderRadius: 'var(--radius)', cursor: 'pointer',
                    border: `2px solid ${form.type === t ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.type === t ? 'var(--accent-subtle)' : 'var(--bg-input)',
                    fontSize: '13px', fontWeight: 500, color: form.type === t ? 'var(--accent)' : 'var(--text-secondary)',
                  }}>
                    {typeLabel[t]}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label>From Date</label>
                <input type="date" value={form.fromDate} onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))} style={{ marginTop: '8px' }} />
              </div>
              <div>
                <label>To Date</label>
                <input type="date" value={form.toDate} onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))} style={{ marginTop: '8px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Reason</label>
              <textarea rows={3} placeholder="Describe your reason for leave..." value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} style={{ marginTop: '8px', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={submit}>
                <FileText size={14} /> Submit Application
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
