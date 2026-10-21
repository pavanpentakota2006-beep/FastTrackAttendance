import React, { useState } from 'react';
import {
  User, Mail, Phone, Building2, BookOpen, Shield,
  Camera, Smartphone, Key, Bell, CheckCircle2, AlertCircle,
  RefreshCw, Save, Check
} from 'lucide-react';
import { students } from '../../data/mockData';

const ME = students[1]; // Priya Patel

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState<'details' | 'biometrics' | 'security' | 'preferences'>('details');
  const [enrollingFace, setEnrollingFace] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  // Form states
  const [phone, setPhone] = useState(ME.phone);
  const [email, setEmail] = useState(ME.email);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  const triggerFaceEnrollment = () => {
    setEnrollingFace(true);
    setEnrollSuccess(false);
    setTimeout(() => {
      setEnrollingFace(false);
      setEnrollSuccess(true);
      setTimeout(() => setEnrollSuccess(false), 4000);
    }, 2500);
  };

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  return (
    <div className="page-container">
      {/* Profile Header Banner */}
      <div className="glass-card" style={{
        padding: '32px', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: 800, color: 'white',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
              border: '3px solid rgba(255,255,255,0.2)'
            }}>
              {ME.name.split(' ').map(w => w[0]).join('')}
            </div>
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--success)', border: '3px solid var(--bg-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} title="Active & Enrolled" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>{ME.name}</h2>
              <span className="badge badge-accent">Semester {ME.semester}</span>
              <span className="badge badge-success">Section {ME.section}</span>
            </div>
            <p style={{ margin: '0 0 6px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Roll Number: <strong style={{ color: 'var(--text-primary)' }}>{ME.rollNo}</strong> · {ME.departmentName}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <span>Batch 2023–2027</span>
              <span>•</span>
              <span>Enrolled Biometrics: <strong style={{ color: 'var(--success)' }}>Active (98.4% Match)</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary btn-sm" onClick={triggerFaceEnrollment}>
            <Camera size={14} /> Re-scan Face
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSaveSettings}>
            <Save size={14} /> Save Profile
          </button>
        </div>
      </div>

      {savedSettings && (
        <div style={{
          padding: '12px 18px', borderRadius: 'var(--radius)',
          background: 'var(--success-subtle)', border: '1px solid rgba(16,185,129,0.3)',
          color: 'var(--success)', fontSize: '13.5px', fontWeight: 600,
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'bounceIn 0.4s ease'
        }}>
          <CheckCircle2 size={16} /> Changes saved successfully to your profile!
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        {[
          { id: 'details', label: 'Academic & Personal Details', icon: <User size={15} /> },
          { id: 'biometrics', label: 'Biometrics & Facial Data', icon: <Camera size={15} /> },
          { id: 'security', label: 'Security & Device Binding', icon: <Shield size={15} /> },
          { id: 'preferences', label: 'Notification Preferences', icon: <Bell size={15} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Academic & Personal Details */}
      {activeTab === 'details' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent)" /> Personal Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label>Full Legal Name</label>
                <input type="text" value={ME.name} readOnly style={{ marginTop: '6px', background: 'var(--bg-glass)', opacity: 0.8 }} />
              </div>
              <div>
                <label>Registered Email</label>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>
              <div>
                <label>Phone Number</label>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>
              <div>
                <label>Permanent Residential Address</label>
                <input type="text" defaultValue="Sector 14, Tech Park Enclave, Bangalore, KA" style={{ marginTop: '6px' }} />
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--accent-2)" /> Academic Profile
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['Institution', 'National Institute of Technology'],
                ['Degree', 'Bachelor of Technology (B.Tech)'],
                ['Department', ME.departmentName],
                ['Current Semester', `Semester ${ME.semester}`],
                ['Section', `Section ${ME.section}`],
                ['Roll Number', ME.rollNo],
                ['Academic Advisor', 'Prof. Meera Iyer (HOD - CSE)'],
                ['Admission Year', '2023'],
                ['Current CGPA', '8.94 / 10.0'],
                ['Overall Attendance Status', `${ME.overallAttendance}% (${ME.overallAttendance >= 75 ? 'Good Standing' : 'At Risk'})`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Biometrics & Facial Data */}
      {activeTab === 'biometrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} color="var(--success)" /> Facial Biometric Vector Status
            </h3>

            <div style={{
              padding: '20px', borderRadius: 'var(--radius)',
              background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <CheckCircle2 size={24} color="var(--success)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--success)' }}>Face Embeddings Active</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>512-dimension vector generated via FaceNet architecture</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', fontSize: '12.5px' }}>
                <div>Enrolled Date: <strong>14 Aug 2026</strong></div>
                <div>Liveness Verified: <strong style={{ color: 'var(--success)' }}>Pass (Anti-Spoof v2)</strong></div>
                <div>Avg Match Score: <strong style={{ color: 'var(--accent)' }}>97.8%</strong></div>
                <div>Embedding Hash: <code style={{ fontSize: '11px' }}>sha256:7f8a9...</code></div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              SmartAttend AI stores only 128/512-point mathematical feature vectors using encrypted one-way hashes.
              Raw camera photos are never retained on central servers in compliance with student privacy regulations.
            </p>

            <button
              className="btn btn-primary w-full"
              style={{ marginTop: '16px', justifyContent: 'center' }}
              onClick={triggerFaceEnrollment}
              disabled={enrollingFace}
            >
              {enrollingFace ? (
                <><RefreshCw size={14} className="animate-spin" /> Processing Neural Embeddings...</>
              ) : (
                <><Camera size={14} /> Re-Enroll Face Profile</>
              )}
            </button>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Biometric Verification History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { date: 'Today, 11:02 AM', subject: 'Computer Networks', score: 98.4, status: 'Success', loc: 'Room CS-201' },
                { date: 'Yesterday, 09:05 AM', subject: 'Data Structures', score: 96.2, status: 'Success', loc: 'Room CS-101' },
                { date: '14 Aug 2026, 02:00 PM', subject: 'Operating Systems', score: 99.1, status: 'Success', loc: 'Room CS-102' },
                { date: '13 Aug 2026, 10:00 AM', subject: 'Database Systems', score: 94.8, status: 'Success', loc: 'Lab CS-03' },
              ].map((h, i) => (
                <div key={i} style={{
                  padding: '12px 14px', borderRadius: 'var(--radius)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{h.subject}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{h.date} · {h.loc}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success">{h.status} ({h.score}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Device Binding */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="var(--accent)" /> Bound Trusted Devices
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Attendance can only be marked from authorized hardware fingerprints to prevent proxy attempts.
            </p>

            <div style={{ padding: '16px', borderRadius: 'var(--radius)', background: 'var(--bg-glass)', border: '1px solid var(--border)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>OnePlus 11 5G (Current)</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Fingerprint ID: <code>dev_99f4a8b21c</code></div>
                </div>
                <span className="badge badge-success">Primary Device</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Registered on 01 Aug 2026 · GPS & BLE Sensors active
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              + Bind New Authorized Device
            </button>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="var(--warning)" /> Password & Security
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" style={{ marginTop: '6px' }} />
              </div>
              <div>
                <label>New Password</label>
                <input type="password" placeholder="New secure password" style={{ marginTop: '6px' }} />
              </div>
              <div>
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm new password" style={{ marginTop: '6px' }} />
              </div>
              <button className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '4px' }}>
                Update Security Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Preferences */}
      {activeTab === 'preferences' && (
        <div className="glass-card" style={{ padding: '24px', maxWidth: 680 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--accent)" /> Notification & Alert Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                title: 'Low Attendance Warning Alerts',
                desc: 'Receive immediate alerts whenever a subject attendance drops below 75%',
                checked: notifEmail,
                toggle: () => setNotifEmail(!notifEmail)
              },
              {
                title: 'Class Session Start Reminders',
                desc: 'Get notified 10 minutes before attendance sessions open in your scheduled room',
                checked: notifPush,
                toggle: () => setNotifPush(!notifPush)
              },
              {
                title: 'Correction Request Status Updates',
                desc: 'Instant updates when a faculty reviews or approves an attendance dispute',
                checked: notifSMS,
                toggle: () => setNotifSMS(!notifSMS)
              },
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px', borderRadius: 'var(--radius)', background: 'var(--bg-glass)',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                </div>
                <div
                  onClick={item.toggle}
                  style={{
                    width: 44, height: 24, borderRadius: '12px', cursor: 'pointer', flexShrink: 0,
                    background: item.checked ? 'var(--accent)' : 'var(--bg-tertiary)',
                    border: `1px solid ${item.checked ? 'var(--accent)' : 'var(--border)'}`,
                    position: 'relative', transition: 'all var(--transition)'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 2, left: item.checked ? 22 : 2,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'white', transition: 'left var(--transition)'
                  }} />
                </div>
              </div>
            ))}

            <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }} onClick={handleSaveSettings}>
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
