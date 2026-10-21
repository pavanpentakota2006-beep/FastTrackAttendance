import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, Shield, Zap, BarChart3, ChevronRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

const roles: { value: UserRole; label: string; icon: string; color: string; email: string }[] = [
  { value: 'admin',   label: 'Administrator', icon: '👨‍💼', color: '#6366f1', email: 'admin@smartattend.edu' },
  { value: 'faculty', label: 'Faculty',        icon: '👨‍🏫', color: '#10b981', email: 'meera@smartattend.edu' },
  { value: 'student', label: 'Student',         icon: '👨‍🎓', color: '#f59e0b', email: 'priya@student.edu' },
];

const features = [
  { icon: <Brain size={20} />, title: 'AI Face Verification', desc: 'Multi-point biometric attendance with liveness detection' },
  { icon: <Shield size={20} />, title: 'Multi-Factor Auth',   desc: 'Face + GPS + QR + Device fingerprinting' },
  { icon: <BarChart3 size={20} />, title: 'Predictive Analytics', desc: 'ML-powered attendance forecasting & risk scoring' },
  { icon: <Zap size={20} />, title: 'Real-time Streaming', desc: 'WebSocket-powered live attendance dashboard' },
];

// Floating particles background
function Particles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#10b981' : '#f59e0b',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
            animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('priya@student.edu');
  const [password, setPassword] = useState('demo123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const r = roles.find(r => r.value === role);
    if (r) setEmail(r.email);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      const ok = await login(email, password, selectedRole);
      if (ok) navigate(`/${selectedRole}/dashboard`);
      else setError('Invalid credentials. Use the demo buttons below.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role: UserRole) => {
    setLoading(true);
    const r = roles.find(x => x.value === role)!;
    await login(r.email, 'demo123', role);
    navigate(`/${role}/dashboard`);
    setLoading(false);
  };

  const accentColor = roles.find(r => r.value === selectedRole)?.color ?? '#6366f1';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-primary)',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #070b14 0%, #0d1117 50%, #111827 100%)',
        padding: '60px 48px',
        minWidth: 0,
      }}>
        <Particles />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', top: '-20%', left: '-20%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', bottom: '-10%', right: '-10%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, width: '100%', animation: 'fadeInUp 0.8s ease' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(99,102,241,0.4)',
              animation: 'glow 3s ease-in-out infinite',
            }}>
              <Brain size={28} color="white" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 900,
                fontSize: '28px', color: 'white', letterSpacing: '-0.02em',
              }}>
                SmartAttend<span style={{ color: '#6366f1' }}> AI</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                Intelligent Attendance Platform
              </div>
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800,
            fontSize: '36px', color: 'white',
            letterSpacing: '-0.03em', marginBottom: '12px',
            lineHeight: 1.1,
          }}>
            Attendance that
            <br />
            <span className="gradient-text">thinks for you</span>
          </h2>

          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '48px' }}>
            AI-powered multi-factor verification • Real-time analytics • Predictive risk scoring
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '14px 16px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass)', border: '1px solid var(--border)',
                backdropFilter: 'blur(8px)',
                animation: `fadeInUp 0.6s ease ${i * 0.1 + 0.3}s both`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                  background: 'var(--accent-subtle)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        width: 460, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
        padding: '48px 40px',
        animation: 'slideInRight 0.6s ease',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Sign in to your SmartAttend account
            </p>
          </div>

          {/* Role Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label>Select Role</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleRoleChange(r.value)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 'var(--radius)',
                    border: `2px solid ${selectedRole === r.value ? r.color : 'var(--border)'}`,
                    background: selectedRole === r.value ? `${r.color}15` : 'var(--bg-input)',
                    cursor: 'pointer', transition: 'all var(--transition-fast)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    boxShadow: selectedRole === r.value ? `0 0 16px ${r.color}25` : 'none',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{r.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: selectedRole === r.value ? r.color : 'var(--text-muted)' }}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.edu"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: '36px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    padding: '4px',
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius)',
                background: 'var(--danger-subtle)', color: 'var(--danger)',
                fontSize: '13px', marginBottom: '16px',
                border: '1px solid rgba(239,68,68,0.2)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{
                width: '100%', justifyContent: 'center', fontSize: '15px',
                padding: '12px', borderRadius: 'var(--radius-md)',
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                borderColor: accentColor,
                boxShadow: `0 6px 20px ${accentColor}40`,
              }}
            >
              {loading ? (
                <span className="animate-spin" style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
              ) : (
                <>Sign In <ChevronRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick Demo Access</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {roles.map(r => (
              <button
                key={r.value}
                type="button"
                disabled={loading}
                onClick={() => quickLogin(r.value)}
                style={{
                  padding: '10px 16px', borderRadius: 'var(--radius)',
                  background: 'var(--bg-glass)', border: `1px solid var(--border)`,
                  cursor: 'pointer', transition: 'all var(--transition-fast)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  color: 'var(--text-secondary)', fontSize: '13.5px',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = r.color;
                  (e.currentTarget as HTMLButtonElement).style.color = r.color;
                  (e.currentTarget as HTMLButtonElement).style.background = `${r.color}10`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-glass)';
                }}
              >
                <span style={{ fontSize: '16px' }}>{r.icon}</span>
                <span>Continue as <strong style={{ color: r.color }}>{r.label}</strong></span>
                <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '24px' }}>
            Demo platform — All data is simulated for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
}
