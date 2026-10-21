import React, { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { systemSettings as initial } from '../../data/mockData';

export default function SystemSettings() {
  const [settings, setSettings] = useState({ ...initial });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof settings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
  };

  const SettingRow = ({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '3px' }}>{label}</div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 24, borderRadius: '12px', cursor: 'pointer', flexShrink: 0,
        background: on ? 'var(--accent)' : 'var(--bg-glass)',
        border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
        position: 'relative', transition: 'all var(--transition)',
        boxShadow: on ? 'var(--shadow-accent)' : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: on ? 22 : 2,
        width: 18, height: 18, borderRadius: '50%',
        background: 'white', transition: 'left var(--transition)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </div>
  );

  const NumberInput = ({ value, onChange, min, max, suffix }: { value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="number" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: 80, textAlign: 'center' }}
      />
      {suffix && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{suffix}</span>}
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>System Settings</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Configure attendance thresholds, verification, and notification preferences
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setSettings({ ...initial })}><RotateCcw size={13} /> Reset</button>
          <button className="btn btn-primary btn-sm" onClick={save}><Save size={13} /> Save Changes</button>
        </div>
      </div>

      {saved && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius)', background: 'var(--success-subtle)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success)', fontSize: '13.5px', fontWeight: 600, marginBottom: '20px', animation: 'bounceIn 0.4s ease' }}>
          ✅ Settings saved successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Attendance Rules */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '4px' }}>Attendance Rules</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Thresholds and policies</p>
          <SettingRow label="Minimum Attendance Threshold" desc="Students below this % are flagged as high risk">
            <NumberInput value={settings.minAttendanceThreshold} onChange={v => update('minAttendanceThreshold', v)} min={50} max={100} suffix="%" />
          </SettingRow>
          <SettingRow label="Warning Threshold" desc="Students below this % receive warnings">
            <NumberInput value={settings.warningThreshold} onChange={v => update('warningThreshold', v)} min={50} max={100} suffix="%" />
          </SettingRow>
          <SettingRow label="Auto-Mark Absent" desc="Automatically mark absent after session ends">
            <Toggle on={settings.autoMarkAbsent} onChange={v => update('autoMarkAbsent', v)} />
          </SettingRow>
          <SettingRow label="Allow Correction Requests" desc="Students can submit attendance corrections">
            <Toggle on={settings.allowCorrectionRequests} onChange={v => update('allowCorrectionRequests', v)} />
          </SettingRow>
          <SettingRow label="Correction Window" desc="Days allowed after session to request correction">
            <NumberInput value={settings.correctionWindowDays} onChange={v => update('correctionWindowDays', v)} min={1} max={30} suffix="days" />
          </SettingRow>
        </div>

        {/* Verification Settings */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '4px' }}>Verification Settings</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Face recognition, GPS, and QR</p>
          <SettingRow label="Geofence Radius" desc="Max distance from classroom for GPS verification">
            <NumberInput value={settings.geofenceRadius} onChange={v => update('geofenceRadius', v)} min={10} max={500} suffix="meters" />
          </SettingRow>
          <SettingRow label="QR Code Expiry" desc="Seconds before a QR code rotates">
            <NumberInput value={settings.qrExpiry} onChange={v => update('qrExpiry', v)} min={10} max={120} suffix="sec" />
          </SettingRow>
          <SettingRow label="Min Face Confidence" desc="Minimum % confidence for face recognition to pass">
            <NumberInput value={settings.faceConfidenceMin} onChange={v => update('faceConfidenceMin', v)} min={70} max={99} suffix="%" />
          </SettingRow>
        </div>

        {/* Notifications */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '4px' }}>Notifications</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Alert channels and preferences</p>
          <SettingRow label="Email Notifications" desc="Send attendance alerts via email">
            <Toggle on={settings.emailNotifications} onChange={v => update('emailNotifications', v)} />
          </SettingRow>
          <SettingRow label="Push Notifications" desc="Send mobile push notifications">
            <Toggle on={settings.pushNotifications} onChange={v => update('pushNotifications', v)} />
          </SettingRow>
        </div>

        {/* System Info */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '4px' }}>System Information</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Version and health status</p>
          {[
            ['Platform', 'SmartAttend AI v2.4.1'],
            ['Backend', 'Spring Boot 3.2.4'],
            ['AI Service', 'Python 3.11 · FastAPI'],
            ['Database', 'PostgreSQL 15.3'],
            ['Last Updated', 'Aug 17, 2026'],
            ['Status', '🟢 All Systems Operational'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
