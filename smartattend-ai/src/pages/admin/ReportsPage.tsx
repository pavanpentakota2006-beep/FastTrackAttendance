import React, { useState } from 'react';
import { FileText, Download, Filter } from 'lucide-react';

const reportTypes = [
  { id: 'student',    label: 'Student Attendance',  icon: '👨‍🎓', desc: 'Individual student attendance records with subject breakdown', color: '#6366f1' },
  { id: 'subject',    label: 'Subject Report',       icon: '📚', desc: 'Per-subject attendance statistics and trend analysis', color: '#10b981' },
  { id: 'faculty',    label: 'Faculty Report',       icon: '👨‍🏫', desc: 'Faculty-wise session data and class performance', color: '#3b82f6' },
  { id: 'department', label: 'Department Report',    icon: '🏢', desc: 'Department-level attendance comparison and trends', color: '#8b5cf6' },
  { id: 'defaulter',  label: 'Defaulters List',      icon: '⚠️', desc: 'Students below minimum attendance threshold (75%)', color: '#ef4444' },
  { id: 'monthly',    label: 'Monthly Summary',      icon: '📅', desc: 'Month-wise attendance summary for all departments', color: '#f59e0b' },
  { id: 'ai',         label: 'AI Prediction Report', icon: '🤖', desc: 'ML-powered attendance predictions and risk analysis', color: '#a78bfa' },
  { id: 'audit',      label: 'Audit Report',         icon: '🔒', desc: 'System activity audit trail for compliance', color: '#06b6d4' },
];

export default function ReportsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateReport = async () => {
    setGenerating(true);
    setGenerated(false);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Reports</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Generate, preview, and export attendance reports in PDF, CSV, or Excel format
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Report Type Selection */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-secondary)' }}>
            SELECT REPORT TYPE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reportTypes.map(r => (
              <div
                key={r.id}
                onClick={() => { setSelected(r.id); setGenerated(false); }}
                className="glass-card"
                style={{
                  padding: '16px 18px', cursor: 'pointer',
                  border: selected === r.id ? `1px solid ${r.color}60` : '1px solid var(--border)',
                  background: selected === r.id ? `${r.color}08` : 'var(--bg-glass)',
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                  background: `${r.color}18`, fontSize: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px', color: selected === r.id ? r.color : 'var(--text-primary)' }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{r.desc}</div>
                </div>
                {selected === r.id && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Configuration & Preview */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-secondary)' }}>
            CONFIGURE & GENERATE
          </h3>
          <div className="glass-card" style={{ padding: '24px' }}>
            {!selected ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>Select a report type to configure and generate</p>
              </div>
            ) : (
              <>
                {/* Filters */}
                <div style={{ marginBottom: '20px' }}>
                  <label>Date Range</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <input type="date" defaultValue="2026-08-01" style={{ flex: 1 }} />
                    <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>to</span>
                    <input type="date" defaultValue="2026-08-17" style={{ flex: 1 }} />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label>Department</label>
                  <select style={{ marginTop: '8px' }}>
                    <option value="">All Departments</option>
                    <option>Computer Science & Engineering</option>
                    <option>Electronics & Communication</option>
                    <option>Information Technology</option>
                  </select>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label>Export Format</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    {['PDF', 'CSV', 'Excel'].map(fmt => (
                      <label key={fmt} style={{
                        flex: 1, padding: '10px', textAlign: 'center', borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)', cursor: 'pointer',
                        background: fmt === 'PDF' ? 'var(--accent-subtle)' : 'var(--bg-input)',
                        color: fmt === 'PDF' ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: '13px', fontWeight: 500,
                      }}>
                        <input type="radio" name="format" value={fmt} defaultChecked={fmt === 'PDF'} style={{ display: 'none' }} />
                        {fmt}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-primary w-full"
                  style={{ justifyContent: 'center', marginBottom: '12px' }}
                  onClick={generateReport}
                  disabled={generating}
                >
                  {generating ? (
                    <><span className="animate-spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} /> Generating...</>
                  ) : (
                    <><FileText size={14} /> Generate Report</>
                  )}
                </button>

                {generated && (
                  <div style={{
                    padding: '16px', borderRadius: 'var(--radius)',
                    background: 'var(--success-subtle)', border: '1px solid rgba(16,185,129,0.3)',
                    animation: 'bounceIn 0.4s ease',
                  }}>
                    <div style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '8px' }}>✅ Report Generated!</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      {reportTypes.find(r => r.id === selected)?.label} · Aug 1–17, 2026
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-success btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        <Download size={13} /> Download PDF
                      </button>
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        <Download size={13} /> Download CSV
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
