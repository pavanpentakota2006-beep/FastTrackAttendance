// ============================================================
// SmartAttend AI — Chart & Analytics Data
// ============================================================

// Monthly attendance trend (last 6 months)
export const monthlyAttendanceTrend = [
  { month: 'Mar', cse: 82, ece: 78, mech: 72, civil: 74, it: 80, overall: 78 },
  { month: 'Apr', cse: 79, ece: 76, mech: 70, civil: 72, it: 77, overall: 75 },
  { month: 'May', cse: 84, ece: 80, mech: 75, civil: 76, it: 81, overall: 79 },
  { month: 'Jun', cse: 80, ece: 77, mech: 71, civil: 73, it: 78, overall: 76 },
  { month: 'Jul', cse: 83, ece: 79, mech: 74, civil: 77, it: 82, overall: 79 },
  { month: 'Aug', cse: 82, ece: 78, mech: 74, civil: 76, it: 80, overall: 79 },
];

// Weekly attendance (current week)
export const weeklyAttendance = [
  { day: 'Mon', present: 820, absent: 160 },
  { day: 'Tue', present: 790, absent: 190 },
  { day: 'Wed', present: 840, absent: 140 },
  { day: 'Thu', present: 780, absent: 200 },
  { day: 'Fri', present: 760, absent: 220 },
  { day: 'Sat', present: 680, absent: 140 },
];

// Department comparison
export const departmentComparison = [
  { department: 'CSE',   attendance: 82, target: 75, students: 240 },
  { department: 'ECE',   attendance: 78, target: 75, students: 180 },
  { department: 'MECH',  attendance: 74, target: 75, students: 200 },
  { department: 'CIVIL', attendance: 76, target: 75, students: 160 },
  { department: 'IT',    attendance: 80, target: 75, students: 200 },
];

// Risk distribution
export const riskDistribution = [
  { name: 'Low Risk (>80%)',    value: 62, fill: '#10b981' },
  { name: 'Medium Risk (75-80%)', value: 20, fill: '#f59e0b' },
  { name: 'High Risk (<75%)',    value: 18, fill: '#ef4444' },
];

// Subject performance (faculty analytics)
export const subjectPerformance = [
  { subject: 'Data Structures', code: 'CSE301', attendance: 84, sessions: 48 },
  { subject: 'Database Mgmt',   code: 'CSE302', attendance: 78, sessions: 50 },
  { subject: 'Operating Sys',   code: 'CSE303', attendance: 81, sessions: 45 },
  { subject: 'Comp Networks',   code: 'CSE401', attendance: 88, sessions: 52 },
  { subject: 'AI',              code: 'CSE501', attendance: 91, sessions: 40 },
  { subject: 'Machine Learn',   code: 'CSE502', attendance: 76, sessions: 38 },
  { subject: 'Soft. Engg.',     code: 'CSE403', attendance: 82, sessions: 44 },
  { subject: 'Web Tech',        code: 'CSE304', attendance: 73, sessions: 42 },
];

// Student attendance per subject (for student dashboard)
export const studentSubjectAttendance = [
  { subject: 'Data Structures', code: 'CSE301', present: 40, absent: 8,  total: 48, percentage: 83, color: '#6366f1' },
  { subject: 'DBMS',            code: 'CSE302', present: 37, absent: 13, total: 50, percentage: 74, color: '#10b981' },
  { subject: 'Operating Sys',   code: 'CSE303', present: 39, absent: 6,  total: 45, percentage: 87, color: '#f59e0b' },
  { subject: 'Comp Networks',   code: 'CSE401', present: 44, absent: 8,  total: 52, percentage: 85, color: '#3b82f6' },
  { subject: 'AI',              code: 'CSE501', present: 36, absent: 4,  total: 40, percentage: 90, color: '#ef4444' },
  { subject: 'Machine Learn',   code: 'CSE502', present: 30, absent: 8,  total: 38, percentage: 79, color: '#8b5cf6' },
];

// Calendar heatmap data (last 30 days)
const today = new Date('2026-08-17');
export const calendarData: { date: string; status: 'present' | 'absent' | 'leave' | 'holiday' | 'none'; sessions: number }[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  const dow = d.getDay();
  const dateStr = d.toISOString().split('T')[0];
  if (dow === 0) return { date: dateStr, status: 'holiday', sessions: 0 };
  const rand = Math.random();
  if (rand > 0.85) return { date: dateStr, status: 'absent', sessions: Math.floor(Math.random() * 3) + 1 };
  if (rand > 0.78) return { date: dateStr, status: 'leave', sessions: 0 };
  return { date: dateStr, status: 'present', sessions: Math.floor(Math.random() * 4) + 2 };
});

// Prediction forecast data (next 8 weeks)
export const predictionForecast = [
  { week: 'W1',  actual: 82,  predicted: null, lower: null, upper: null },
  { week: 'W2',  actual: 80,  predicted: null, lower: null, upper: null },
  { week: 'W3',  actual: 83,  predicted: null, lower: null, upper: null },
  { week: 'W4',  actual: 79,  predicted: null, lower: null, upper: null },
  { week: 'W5',  actual: 81,  predicted: 80,   lower: 77,   upper: 83  },
  { week: 'W6',  actual: null, predicted: 79,   lower: 75,   upper: 83  },
  { week: 'W7',  actual: null, predicted: 78,   lower: 73,   upper: 83  },
  { week: 'W8',  actual: null, predicted: 77,   lower: 71,   upper: 83  },
  { week: 'W9',  actual: null, predicted: 76,   lower: 69,   upper: 83  },
  { week: 'W10', actual: null, predicted: 75,   lower: 67,   upper: 83  },
];

// Verification method distribution
export const verificationMethods = [
  { name: 'Face Recognition', value: 68, fill: '#6366f1' },
  { name: 'QR Code',          value: 22, fill: '#10b981' },
  { name: 'Manual',           value: 10, fill: '#94a3b8' },
];

// Anomaly type distribution
export const anomalyTypes = [
  { name: 'Location Mismatch',    value: 32, fill: '#ef4444' },
  { name: 'Timing Pattern',       value: 25, fill: '#f59e0b' },
  { name: 'Correction Abuse',     value: 18, fill: '#f97316' },
  { name: 'Suspicious Burst',     value: 15, fill: '#8b5cf6' },
  { name: 'Device Mismatch',      value: 10, fill: '#3b82f6' },
];

// Hourly attendance for today
export const hourlyAttendance = [
  { hour: '8AM',  sessions: 6,  present: 240 },
  { hour: '9AM',  sessions: 12, present: 480 },
  { hour: '10AM', sessions: 10, present: 390 },
  { hour: '11AM', sessions: 14, present: 520 },
  { hour: '12PM', sessions: 8,  present: 280 },
  { hour: '2PM',  sessions: 10, present: 380 },
  { hour: '3PM',  sessions: 8,  present: 300 },
  { hour: '4PM',  sessions: 4,  present: 140 },
];
