// ============================================================
// SmartAttend AI — TypeScript Type Definitions
// ============================================================

export type UserRole = 'admin' | 'faculty' | 'student';
export type RiskLevel = 'low' | 'medium' | 'high';
export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'holiday';
export type SessionStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type VerificationMethod = 'face' | 'qr' | 'manual';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type NotifType = 'info' | 'warning' | 'danger' | 'success';

// ─── Auth ────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

// ─── Department ──────────────────────────────────────────────
export interface Department {
  id: string;
  name: string;
  code: string;
  hodId: string;
  hodName: string;
  studentCount: number;
  facultyCount: number;
  avgAttendance: number;
  color: string;
}

// ─── Course / Subject ────────────────────────────────────────
export interface Course {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  credits: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  facultyId: string;
  facultyName: string;
  semester: number;
  totalClasses: number;
  conductedClasses: number;
  color: string;
}

// ─── Student ─────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  section: string;
  overallAttendance: number;
  presentCount: number;
  absentCount: number;
  riskLevel: RiskLevel;
  faceEnrolled: boolean;
  deviceId?: string;
  joinedAt: string;
  avatar?: string;
  classesNeeded: number;
  predictedAttendance: number;
}

// ─── Faculty ─────────────────────────────────────────────────
export interface Faculty {
  id: string;
  name: string;
  empId: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  subjects: string[];
  joinedAt: string;
  avatar?: string;
  totalClassesTaken: number;
  avgAttendanceRate: number;
}

// ─── Timetable ───────────────────────────────────────────────
export interface TimetableSlot {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  room: string;
  semester: number;
  section: string;
}

// ─── Attendance Session ──────────────────────────────────────
export interface AttendanceSession {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  room: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: SessionStatus;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  verificationMethod: VerificationMethod;
  qrCode?: string;
  qrExpiry?: number;
  latitude?: number;
  longitude?: number;
  geofenceRadius: number;
}

// ─── Attendance Record ───────────────────────────────────────
export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  subjectId: string;
  subjectName: string;
  date: string;
  status: AttendanceStatus;
  markedAt?: string;
  markedBy?: string;
  method: VerificationMethod | 'auto' | 'manual';
  faceConfidence?: number;
  livenessPass?: boolean;
  locationVerified?: boolean;
  distanceFromClass?: number;
  deviceId?: string;
  notes?: string;
  correctionId?: string;
}

// ─── AI Prediction ───────────────────────────────────────────
export interface AIPrediction {
  studentId: string;
  subjectId: string;
  currentAttendance: number;
  predictedFinal: number;
  trend: 'improving' | 'stable' | 'declining';
  riskLevel: RiskLevel;
  classesNeededFor75: number;
  classesNeededFor85: number;
  maxMissable: number;
  confidence: number;
  scenarios: {
    attendNext5: number;
    attendNext10: number;
    missNext3: number;
    missNext5: number;
  };
}

// ─── Risk Score ──────────────────────────────────────────────
export interface RiskScore {
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  overallRisk: RiskLevel;
  score: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    attendance: number;
    risk: RiskLevel;
  }[];
}

// ─── Anomaly Detection ───────────────────────────────────────
export interface Anomaly {
  id: string;
  type: 'timing' | 'pattern' | 'location' | 'device' | 'correction_abuse' | 'burst';
  severity: 'low' | 'medium' | 'high';
  studentId: string;
  studentName: string;
  description: string;
  detectedAt: string;
  sessionId?: string;
  reviewed: boolean;
  reviewedBy?: string;
  reviewNote?: string;
}

export type LeaveType = 'medical' | 'personal' | 'academic' | 'emergency';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  status: RequestStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  documentUrl?: string;
  documents?: string[];
}

// ─── Correction Request ──────────────────────────────────────
export interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  sessionId: string;
  subjectName: string;
  date: string;
  currentStatus: AttendanceStatus;
  requestedStatus: AttendanceStatus;
  reason: string;
  status: RequestStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

// ─── Notification ─────────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  type: NotifType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// ─── Audit Log ───────────────────────────────────────────────
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
}

// ─── Live Attendance Stream ───────────────────────────────────
export interface LiveStudent {
  id: string;
  name: string;
  rollNo: string;
  status: 'pending' | 'verifying' | 'present' | 'failed';
  verifiedAt?: string;
  faceConfidence?: number;
  locationVerified?: boolean;
  avatar?: string;
}

// ─── Chart Data ───────────────────────────────────────────────
export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

// ─── Report ──────────────────────────────────────────────────
export interface Report {
  id: string;
  type: 'student' | 'subject' | 'faculty' | 'department' | 'monthly' | 'semester' | 'defaulter' | 'ai' | 'audit';
  title: string;
  generatedAt: string;
  generatedBy: string;
  filters: Record<string, string>;
}

// ─── System Settings ─────────────────────────────────────────
export interface SystemSettings {
  minAttendanceThreshold: number;
  warningThreshold: number;
  geofenceRadius: number;
  qrExpiry: number;
  faceConfidenceMin: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoMarkAbsent: boolean;
  allowCorrectionRequests: boolean;
  correctionWindowDays: number;
}
