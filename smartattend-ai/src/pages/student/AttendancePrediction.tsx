import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { students } from '../../data/mockData';
import { studentSubjectAttendance } from '../../data/chartData';

const ME = students[1];

// AI prediction simulation
const predictionData = [
  { week: 'W1', actual: 85, predicted: null },
  { week: 'W2', actual: 82, predicted: null },
  { week: 'W3', actual: 79, predicted: null },
  { week: 'W4', actual: 74, predicted: null },
  { week: 'W5', actual: 76, predicted: null },
  { week: 'W6', actual: 75, predicted: null },
  { week: 'W7', actual: null, predicted: 77 },
  { week: 'W8', actual: null, predicted: 78 },
  { week: 'W9', actual: null, predicted: 80 },
  { week: 'W10', actual: null, predicted: ME.predictedAttendance },
];

const insights = [
  { icon: '📉', type: 'warning', text: 'Attendance dropped 7% over the last 3 weeks — Friday absences are the main cause.' },
  { icon: '⚡', type: 'info',    text: 'Model predicts attendance will recover as you improve Friday/Monday class habits.' },
  { icon: '🎯', type: 'success', text: 'If you attend all remaining sessions, end-semester attendance will reach 82%.' },
  { icon: '📅', type: 'danger',  text: 'You have 6 sessions where attendance would fall below 75% if absent. Prioritize these.' },
];

const scenarioColors: Record<string, string> = {
  'worst':   '#ef4444',
  'current': '#f59e0b',
  'best':    '#10b981',
};

function AIPredictionLoader({ done, children }: { done: boolean; children: React.ReactNode }) {
  return done ? (
    <>{children}</>
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', color: 'var(--text-muted)', fontSize: '13.5px' }}>
      <div style={{ width: 20, height: 20, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Running AI prediction model...
    </div>
  );
}

export default function AttendancePrediction() {
  const [loaded, setLoaded] = useState(false);
  const [scenario, setScenario] = useState<'worst' | 'current' | 'best'>('current');

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const scenariosResult = { worst: 68, current: ME.predictedAttendance, best: 85 };
  const resultColor = scenariosResult[scenario] >= 75 ? 'var(--success)' : 'var(--danger)';

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139,92,246,0.4)',
          }}>
            <Brain size={20} color="white" />
          </div>
          <h2 style={{ margin: 0 }}>AI Attendance Prediction</h2>
        </div>
        <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Machine learning model trained on your attendance patterns, day-of-week habits, and subject difficulty
        </p>
      </div>

      {/* Prediction result banner */}
      <AIPredictionLoader done={loaded}>
        <div className="glass-card" style={{
          padding: '24px 28px', marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 100%)',
          border: '1px solid rgba(139,92,246,0.25)',
          animation: 'bounceIn 0.6s ease',
        }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '6px' }}>PREDICTED END-SEMESTER</div>
              <div style={{ fontSize: '64px', fontWeight: 900, fontFamily: 'var(--font-heading)', color: ME.predictedAttendance >= 75 ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>
                {ME.predictedAttendance}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Confidence: <strong style={{ color: 'var(--accent)' }}>92%</strong>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <span>Current: {ME.overallAttendance}%</span>
                  <span>Predicted: {ME.predictedAttendance}%</span>
                </div>
                <div style={{ height: 12, background: 'var(--bg-glass)', borderRadius: '6px', position: 'relative', overflow: 'visible' }}>
                  {/* Current */}
                  <div style={{ width: `${ME.overallAttendance}%`, height: '100%', background: 'var(--warning)', borderRadius: '6px', position: 'absolute' }} />
                  {/* Predicted delta */}
                  <div style={{ position: 'absolute', left: `${ME.overallAttendance}%`, width: `${ME.predictedAttendance - ME.overallAttendance}%`, height: '100%', background: ME.predictedAttendance >= 75 ? 'var(--success)' : 'var(--danger)', borderRadius: '0 6px 6px 0', opacity: 0.5 }} />
                  {/* 75% line */}
                  <div style={{ position: 'absolute', left: '75%', top: '-4px', bottom: '-4px', width: 2, background: 'var(--accent)', borderRadius: '2px' }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--accent)', marginTop: '4px' }}>← 75% minimum</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {ME.predictedAttendance >= 75 ? (
                  <div className="badge badge-success" style={{ fontSize: '12.5px', padding: '6px 12px' }}>
                    <TrendingUp size={13} /> Predicted to PASS minimum threshold
                  </div>
                ) : (
                  <div className="badge badge-danger" style={{ fontSize: '12.5px', padding: '6px 12px' }}>
                    <AlertTriangle size={13} /> At risk — attend {ME.classesNeeded} more classes
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AIPredictionLoader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Prediction chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 20px' }}>Predicted vs Actual Attendance</h3>
          <AIPredictionLoader done={loaded}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={predictionData}>
                <defs>
                  <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 95]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any, name: any) => [v !== null ? `${v}%` : '—', name]} />
                <ReferenceLine y={75} stroke="var(--danger)" strokeDasharray="5 5" label={{ value: '75%', position: 'right', fontSize: 10, fill: 'var(--danger)' }} />
                <Line type="monotone" dataKey="actual"    name="Actual"    stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} connectNulls={false} />
                <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} strokeDasharray="6 3" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </AIPredictionLoader>
        </div>

        {/* Scenario Analysis */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 20px' }}>What-If Scenarios</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {(['worst', 'current', 'best'] as const).map(s => {
              const labels = { worst: 'Worst Case (0% remaining)', current: 'Current Pace', best: 'Perfect Attendance' };
              const values = scenariosResult;
              const c = scenarioColors[s];
              return (
                <div
                  key={s}
                  onClick={() => setScenario(s)}
                  style={{
                    padding: '14px 16px', borderRadius: 'var(--radius)', cursor: 'pointer',
                    border: `2px solid ${scenario === s ? c : 'var(--border)'}`,
                    background: scenario === s ? `${c}10` : 'var(--bg-glass)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span style={{ fontSize: '13.5px', fontWeight: 500 }}>{labels[s]}</span>
                  <span style={{ fontWeight: 800, color: c, fontSize: '16px', fontFamily: 'var(--font-heading)' }}>{values[s]}%</span>
                </div>
              );
            })}
          </div>
          <div style={{
            padding: '16px', borderRadius: 'var(--radius)',
            background: `${scenarioColors[scenario]}10`, border: `1px solid ${scenarioColors[scenario]}30`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '36px', fontWeight: 900, color: scenarioColors[scenario], fontFamily: 'var(--font-heading)' }}>
              {scenariosResult[scenario]}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Predicted end-semester ({scenario} case)</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: resultColor, marginTop: '8px' }}>
              {scenariosResult[scenario] >= 75 ? '✅ Passes minimum threshold' : '❌ Below minimum — need improvement'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Zap size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '15px', margin: 0 }}>AI-Generated Insights</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {insights.map((item, i) => {
            const colors = { info: 'var(--info)', success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)' };
            const bgs = { info: 'var(--info-subtle)', success: 'var(--success-subtle)', warning: 'var(--warning-subtle)', danger: 'var(--danger-subtle)' };
            const c = colors[item.type as keyof typeof colors];
            const bg = bgs[item.type as keyof typeof bgs];
            return (
              <div key={i} style={{
                padding: '14px 16px', borderRadius: 'var(--radius)',
                background: bg, border: `1px solid ${c}30`,
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                animation: `fadeInUp 0.4s ease ${i * 0.1}s both`,
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
