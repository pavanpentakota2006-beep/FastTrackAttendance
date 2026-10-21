import type {
  Department, Faculty, Student, Subject, Course,
  AttendanceSession, AttendanceRecord, AIPrediction,
  RiskScore, Anomaly, LeaveRequest, CorrectionRequest,
  Notification, AuditLog, TimetableSlot, SystemSettings,
} from '../types';

// ─── Departments ─────────────────────────────────────────────
export const departments: Department[] = [
  { id: 'd1', name: 'Computer Science & Engineering', code: 'CSE', hodId: 'f1', hodName: 'Dr. Rajesh Kumar', studentCount: 240, facultyCount: 18, avgAttendance: 82, color: '#6366f1' },
  { id: 'd2', name: 'Electronics & Communication',    code: 'ECE', hodId: 'f5', hodName: 'Dr. Anita Sharma', studentCount: 180, facultyCount: 14, avgAttendance: 78, color: '#10b981' },
  { id: 'd3', name: 'Mechanical Engineering',         code: 'MECH', hodId: 'f9', hodName: 'Dr. Suresh Patel',  studentCount: 200, facultyCount: 16, avgAttendance: 74, color: '#f59e0b' },
  { id: 'd4', name: 'Civil Engineering',              code: 'CIVIL', hodId: 'f12', hodName: 'Dr. Priya Mehta', studentCount: 160, facultyCount: 12, avgAttendance: 76, color: '#3b82f6' },
  { id: 'd5', name: 'Information Technology',         code: 'IT',  hodId: 'f15', hodName: 'Dr. Kiran Nair',  studentCount: 200, facultyCount: 15, avgAttendance: 80, color: '#8b5cf6' },
];

// ─── Subjects ────────────────────────────────────────────────
export const subjects: Subject[] = [
  { id: 's1',  name: 'Data Structures & Algorithms', code: 'CSE301', courseId: 'c1', facultyId: 'f2', facultyName: 'Prof. Meera Iyer',     semester: 3, totalClasses: 60, conductedClasses: 48, color: '#6366f1' },
  { id: 's2',  name: 'Database Management Systems',  code: 'CSE302', courseId: 'c1', facultyId: 'f3', facultyName: 'Prof. Arun Das',       semester: 3, totalClasses: 60, conductedClasses: 50, color: '#10b981' },
  { id: 's3',  name: 'Operating Systems',            code: 'CSE303', courseId: 'c1', facultyId: 'f4', facultyName: 'Prof. Deepa Nair',     semester: 3, totalClasses: 60, conductedClasses: 45, color: '#f59e0b' },
  { id: 's4',  name: 'Computer Networks',            code: 'CSE401', courseId: 'c1', facultyId: 'f2', facultyName: 'Prof. Meera Iyer',     semester: 4, totalClasses: 60, conductedClasses: 52, color: '#3b82f6' },
  { id: 's5',  name: 'Artificial Intelligence',      code: 'CSE501', courseId: 'c1', facultyId: 'f5', facultyName: 'Prof. Vikram Singh',   semester: 5, totalClasses: 60, conductedClasses: 40, color: '#ef4444' },
  { id: 's6',  name: 'Machine Learning',             code: 'CSE502', courseId: 'c1', facultyId: 'f6', facultyName: 'Prof. Kavitha Rao',    semester: 5, totalClasses: 60, conductedClasses: 38, color: '#8b5cf6' },
  { id: 's7',  name: 'Software Engineering',         code: 'CSE403', courseId: 'c1', facultyId: 'f3', facultyName: 'Prof. Arun Das',       semester: 4, totalClasses: 60, conductedClasses: 44, color: '#06b6d4' },
  { id: 's8',  name: 'Web Technologies',             code: 'CSE304', courseId: 'c1', facultyId: 'f7', facultyName: 'Prof. Sanjay Gupta',   semester: 3, totalClasses: 60, conductedClasses: 42, color: '#f97316' },
];

// ─── Faculty ─────────────────────────────────────────────────
export const faculty: Faculty[] = [
  { id: 'f1', name: 'Dr. Rajesh Kumar',  empId: 'EMP001', email: 'rajesh@smartattend.edu',  phone: '9876543210', departmentId: 'd1', departmentName: 'CSE', designation: 'Professor & HOD',    subjects: ['s1','s4'], joinedAt: '2015-06-01', totalClassesTaken: 420, avgAttendanceRate: 84 },
  { id: 'f2', name: 'Prof. Meera Iyer',  empId: 'EMP002', email: 'meera@smartattend.edu',   phone: '9876543211', departmentId: 'd1', departmentName: 'CSE', designation: 'Associate Professor', subjects: ['s1','s4'], joinedAt: '2018-07-15', totalClassesTaken: 380, avgAttendanceRate: 82 },
  { id: 'f3', name: 'Prof. Arun Das',    empId: 'EMP003', email: 'arun@smartattend.edu',    phone: '9876543212', departmentId: 'd1', departmentName: 'CSE', designation: 'Assistant Professor', subjects: ['s2','s7'], joinedAt: '2020-01-10', totalClassesTaken: 260, avgAttendanceRate: 79 },
  { id: 'f4', name: 'Prof. Deepa Nair',  empId: 'EMP004', email: 'deepa@smartattend.edu',   phone: '9876543213', departmentId: 'd1', departmentName: 'CSE', designation: 'Assistant Professor', subjects: ['s3'],     joinedAt: '2019-08-20', totalClassesTaken: 290, avgAttendanceRate: 77 },
  { id: 'f5', name: 'Prof. Vikram Singh', empId: 'EMP005', email: 'vikram@smartattend.edu', phone: '9876543214', departmentId: 'd2', departmentName: 'ECE', designation: 'Associate Professor', subjects: ['s5'],     joinedAt: '2017-03-01', totalClassesTaken: 310, avgAttendanceRate: 86 },
  { id: 'f6', name: 'Prof. Kavitha Rao', empId: 'EMP006', email: 'kavitha@smartattend.edu', phone: '9876543215', departmentId: 'd1', departmentName: 'CSE', designation: 'Assistant Professor', subjects: ['s6'],     joinedAt: '2021-06-01', totalClassesTaken: 180, avgAttendanceRate: 81 },
  { id: 'f7', name: 'Prof. Sanjay Gupta', empId: 'EMP007', email: 'sanjay@smartattend.edu', phone: '9876543216', departmentId: 'd1', departmentName: 'CSE', designation: 'Assistant Professor', subjects: ['s8'],    joinedAt: '2020-09-01', totalClassesTaken: 220, avgAttendanceRate: 78 },
];

// ─── Students ────────────────────────────────────────────────
export const students: Student[] = [
  { id: 'st1',  name: 'Arjun Sharma',    rollNo: 'CSE21001', email: 'arjun@student.edu',    phone: '9811001001', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 88, presentCount: 158, absentCount: 22,  riskLevel: 'low',    faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 0, predictedAttendance: 86 },
  { id: 'st2',  name: 'Priya Patel',     rollNo: 'CSE21002', email: 'priya@student.edu',    phone: '9811001002', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 82, presentCount: 148, absentCount: 32,  riskLevel: 'low',    faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 0, predictedAttendance: 80 },
  { id: 'st3',  name: 'Rahul Verma',     rollNo: 'CSE21003', email: 'rahul@student.edu',    phone: '9811001003', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 72, presentCount: 130, absentCount: 50,  riskLevel: 'high',   faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 8,  predictedAttendance: 69 },
  { id: 'st4',  name: 'Sneha Nair',      rollNo: 'CSE21004', email: 'sneha@student.edu',    phone: '9811001004', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 76, presentCount: 137, absentCount: 43,  riskLevel: 'medium', faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 3,  predictedAttendance: 74 },
  { id: 'st5',  name: 'Kiran Reddy',     rollNo: 'CSE21005', email: 'kiran@student.edu',    phone: '9811001005', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 91, presentCount: 164, absentCount: 16,  riskLevel: 'low',    faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 0, predictedAttendance: 90 },
  { id: 'st6',  name: 'Ananya Singh',    rollNo: 'CSE21006', email: 'ananya@student.edu',   phone: '9811001006', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 65, presentCount: 117, absentCount: 63,  riskLevel: 'high',   faceEnrolled: false, joinedAt: '2021-08-01', classesNeeded: 18, predictedAttendance: 61 },
  { id: 'st7',  name: 'Vijay Kumar',     rollNo: 'CSE21007', email: 'vijay@student.edu',    phone: '9811001007', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'B', overallAttendance: 78, presentCount: 140, absentCount: 40,  riskLevel: 'medium', faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 2,  predictedAttendance: 76 },
  { id: 'st8',  name: 'Meera Krishnan',  rollNo: 'CSE21008', email: 'meera@student.edu',    phone: '9811001008', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'B', overallAttendance: 85, presentCount: 153, absentCount: 27,  riskLevel: 'low',    faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 0, predictedAttendance: 83 },
  { id: 'st9',  name: 'Aditya Joshi',    rollNo: 'CSE21009', email: 'aditya@student.edu',   phone: '9811001009', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'B', overallAttendance: 70, presentCount: 126, absentCount: 54,  riskLevel: 'high',   faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 10, predictedAttendance: 67 },
  { id: 'st10', name: 'Divya Menon',     rollNo: 'CSE21010', email: 'divya@student.edu',    phone: '9811001010', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'B', overallAttendance: 80, presentCount: 144, absentCount: 36,  riskLevel: 'low',    faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 0, predictedAttendance: 78 },
  { id: 'st11', name: 'Rohan Gupta',     rollNo: 'CSE21011', email: 'rohan@student.edu',    phone: '9811001011', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 60, presentCount: 108, absentCount: 72,  riskLevel: 'high',   faceEnrolled: false, joinedAt: '2021-08-01', classesNeeded: 25, predictedAttendance: 56 },
  { id: 'st12', name: 'Lakshmi Rao',     rollNo: 'CSE21012', email: 'lakshmi@student.edu',  phone: '9811001012', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 93, presentCount: 167, absentCount: 13,  riskLevel: 'low',    faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 0, predictedAttendance: 92 },
  { id: 'st13', name: 'Suresh Babu',     rollNo: 'CSE21013', email: 'suresh@student.edu',   phone: '9811001013', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'B', overallAttendance: 74, presentCount: 133, absentCount: 47,  riskLevel: 'medium', faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 5,  predictedAttendance: 72 },
  { id: 'st14', name: 'Nisha Thomas',    rollNo: 'CSE21014', email: 'nisha@student.edu',    phone: '9811001014', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'B', overallAttendance: 77, presentCount: 139, absentCount: 41,  riskLevel: 'medium', faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 2,  predictedAttendance: 75 },
  { id: 'st15', name: 'Prakash Mishra',  rollNo: 'CSE21015', email: 'prakash@student.edu',  phone: '9811001015', departmentId: 'd1', departmentName: 'CSE', semester: 5, section: 'A', overallAttendance: 69, presentCount: 124, absentCount: 56,  riskLevel: 'high',   faceEnrolled: true,  joinedAt: '2021-08-01', classesNeeded: 12, predictedAttendance: 66 },
];

// ─── Active Sessions ─────────────────────────────────────────
export const activeSessions: AttendanceSession[] = [
  {
    id: 'ses1', subjectId: 's1', subjectName: 'Data Structures & Algorithms', subjectCode: 'CSE301',
    facultyId: 'f2', facultyName: 'Prof. Meera Iyer', room: 'CS-101', date: '2026-08-17',
    startTime: '09:00', status: 'active', totalStudents: 50, presentCount: 42, absentCount: 3,
    verificationMethod: 'face', geofenceRadius: 50, latitude: 13.0827, longitude: 80.2707,
  },
  {
    id: 'ses2', subjectId: 's2', subjectName: 'Database Management Systems', subjectCode: 'CSE302',
    facultyId: 'f3', facultyName: 'Prof. Arun Das', room: 'CS-203', date: '2026-08-17',
    startTime: '11:00', status: 'active', totalStudents: 48, presentCount: 35, absentCount: 5,
    verificationMethod: 'qr', geofenceRadius: 50,
  },
];

export const pastSessions: AttendanceSession[] = [
  {
    id: 'ses3', subjectId: 's3', subjectName: 'Operating Systems', subjectCode: 'CSE303',
    facultyId: 'f4', facultyName: 'Prof. Deepa Nair', room: 'CS-102', date: '2026-08-17',
    startTime: '08:00', endTime: '09:00', status: 'completed', totalStudents: 50, presentCount: 44, absentCount: 6,
    verificationMethod: 'face', geofenceRadius: 50,
  },
  {
    id: 'ses4', subjectId: 's4', subjectName: 'Computer Networks', subjectCode: 'CSE401',
    facultyId: 'f2', facultyName: 'Prof. Meera Iyer', room: 'CS-301', date: '2026-08-16',
    startTime: '10:00', endTime: '11:00', status: 'completed', totalStudents: 45, presentCount: 38, absentCount: 7,
    verificationMethod: 'face', geofenceRadius: 50,
  },
  {
    id: 'ses5', subjectId: 's1', subjectName: 'Data Structures & Algorithms', subjectCode: 'CSE301',
    facultyId: 'f2', facultyName: 'Prof. Meera Iyer', room: 'CS-101', date: '2026-08-15',
    startTime: '09:00', endTime: '10:00', status: 'completed', totalStudents: 50, presentCount: 46, absentCount: 4,
    verificationMethod: 'face', geofenceRadius: 50,
  },
];

// ─── AI Predictions ──────────────────────────────────────────
export const aiPredictions: AIPrediction[] = [
  {
    studentId: 'st2', subjectId: 's1', currentAttendance: 82, predictedFinal: 80, trend: 'stable',
    riskLevel: 'low', classesNeededFor75: 0, classesNeededFor85: 4, maxMissable: 8, confidence: 87,
    scenarios: { attendNext5: 84, attendNext10: 86, missNext3: 80, missNext5: 78 },
  },
  {
    studentId: 'st2', subjectId: 's2', currentAttendance: 74, predictedFinal: 71, trend: 'declining',
    riskLevel: 'medium', classesNeededFor75: 2, classesNeededFor85: 14, maxMissable: 2, confidence: 82,
    scenarios: { attendNext5: 77, attendNext10: 80, missNext3: 70, missNext5: 67 },
  },
  {
    studentId: 'st2', subjectId: 's3', currentAttendance: 89, predictedFinal: 87, trend: 'stable',
    riskLevel: 'low', classesNeededFor75: 0, classesNeededFor85: 0, maxMissable: 18, confidence: 91,
    scenarios: { attendNext5: 91, attendNext10: 92, missNext3: 87, missNext5: 85 },
  },
];

// ─── Risk Scores ─────────────────────────────────────────────
export const riskScores: RiskScore[] = students.map(s => ({
  studentId: s.id,
  studentName: s.name,
  rollNo: s.rollNo,
  department: s.departmentName,
  overallRisk: s.riskLevel,
  score: s.overallAttendance,
  subjects: subjects.slice(0, 4).map(sub => ({
    subjectId: sub.id,
    subjectName: sub.name,
    attendance: Math.max(55, Math.min(98, s.overallAttendance + Math.floor(Math.random() * 20 - 10))),
    risk: s.riskLevel,
  })),
}));

// ─── Anomalies ───────────────────────────────────────────────
export const anomalies: Anomaly[] = [
  {
    id: 'a1', type: 'timing', severity: 'medium', studentId: 'st3', studentName: 'Rahul Verma',
    description: 'Student marked attendance 45 minutes after session started — 3 occurrences this week.',
    detectedAt: '2026-08-17T09:47:00', sessionId: 'ses1', reviewed: false,
  },
  {
    id: 'a2', type: 'location', severity: 'high', studentId: 'st6', studentName: 'Ananya Singh',
    description: 'Location mismatch: Student GPS shows 2.4km away from classroom during attendance.',
    detectedAt: '2026-08-17T11:02:00', sessionId: 'ses2', reviewed: false,
  },
  {
    id: 'a3', type: 'correction_abuse', severity: 'medium', studentId: 'st11', studentName: 'Rohan Gupta',
    description: '5 correction requests in 10 days — exceeds normal threshold.',
    detectedAt: '2026-08-16T14:30:00', reviewed: true, reviewedBy: 'Prof. Meera Iyer', reviewNote: 'Investigated — legitimate reasons found.',
  },
  {
    id: 'a4', type: 'pattern', severity: 'low', studentId: 'st9', studentName: 'Aditya Joshi',
    description: 'Consistent Monday absences — 6 out of last 8 Mondays.',
    detectedAt: '2026-08-16T09:00:00', reviewed: false,
  },
  {
    id: 'a5', type: 'burst', severity: 'medium', studentId: 'st15', studentName: 'Prakash Mishra',
    description: 'Unusual attendance burst — 5 sessions in 2 hours, across 3 different classrooms.',
    detectedAt: '2026-08-15T13:15:00', reviewed: false,
  },
];

// ─── Leave Requests ───────────────────────────────────────────
export const leaveRequests: LeaveRequest[] = [
  {
    id: 'lr1', studentId: 'st2', studentName: 'Priya Patel', rollNo: 'CSE21002',
    type: 'personal',
    fromDate: '2026-08-19', toDate: '2026-08-20', reason: 'Family function — attending sister\'s wedding.',
    status: 'pending', appliedAt: '2026-08-17T10:00:00',
  },
  {
    id: 'lr2', studentId: 'st3', studentName: 'Rahul Verma', rollNo: 'CSE21003',
    type: 'medical',
    fromDate: '2026-08-10', toDate: '2026-08-11', reason: 'Medical — fever and throat infection.',
    status: 'approved', appliedAt: '2026-08-09T08:00:00', reviewedBy: 'Prof. Meera Iyer', reviewedAt: '2026-08-09T14:00:00',
    reviewNote: 'Medical certificate verified.',
  },
  {
    id: 'lr3', studentId: 'st6', studentName: 'Ananya Singh', rollNo: 'CSE21006',
    type: 'academic',
    fromDate: '2026-08-12', toDate: '2026-08-14', reason: 'Sports event — state-level badminton tournament.',
    status: 'approved', appliedAt: '2026-08-10T11:00:00', reviewedBy: 'Admin', reviewedAt: '2026-08-10T16:00:00',
  },
  {
    id: 'lr4', studentId: 'st7', studentName: 'Vijay Kumar', rollNo: 'CSE21007',
    type: 'emergency',
    fromDate: '2026-08-22', toDate: '2026-08-22', reason: 'Personal emergency.',
    status: 'pending', appliedAt: '2026-08-17T15:00:00',
  },
];

// ─── Correction Requests ──────────────────────────────────────
export const correctionRequests: CorrectionRequest[] = [
  {
    id: 'cr1', studentId: 'st2', studentName: 'Priya Patel', rollNo: 'CSE21002',
    sessionId: 'ses4', subjectName: 'Computer Networks', date: '2026-08-16',
    currentStatus: 'absent', requestedStatus: 'present', reason: 'I was present but face recognition failed due to poor lighting.',
    status: 'pending', appliedAt: '2026-08-16T18:00:00',
  },
  {
    id: 'cr2', studentId: 'st4', studentName: 'Sneha Nair', rollNo: 'CSE21004',
    sessionId: 'ses3', subjectName: 'Operating Systems', date: '2026-08-17',
    currentStatus: 'absent', requestedStatus: 'present', reason: 'Medical appointment — arrived 5 mins late, was present for most of the class.',
    status: 'pending', appliedAt: '2026-08-17T12:00:00',
  },
  {
    id: 'cr3', studentId: 'st9', studentName: 'Aditya Joshi', rollNo: 'CSE21009',
    sessionId: 'ses5', subjectName: 'Data Structures & Algorithms', date: '2026-08-15',
    currentStatus: 'absent', requestedStatus: 'present', reason: 'Network issue caused GPS verification failure.',
    status: 'approved', appliedAt: '2026-08-15T20:00:00', reviewedBy: 'Prof. Meera Iyer', reviewedAt: '2026-08-16T09:00:00',
    reviewNote: 'Verified through class register.',
  },
];

// ─── Notifications ────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'n1', userId: 'st2', type: 'warning', title: 'Low Attendance Alert', message: 'Your attendance in DBMS has dropped to 74%. Attend next 2 classes to maintain required 75%.', read: false, createdAt: '2026-08-17T08:00:00' },
  { id: 'n2', userId: 'st2', type: 'info', title: 'Session Started', message: 'Attendance session started for Data Structures & Algorithms in CS-101.', read: false, createdAt: '2026-08-17T09:00:00' },
  { id: 'n3', userId: 'st2', type: 'success', title: 'Leave Approved', message: 'Your leave request for Aug 10-11 has been approved by Prof. Meera Iyer.', read: true, createdAt: '2026-08-09T14:00:00' },
  { id: 'n4', userId: 'st2', type: 'danger', title: 'Correction Request Update', message: 'Your correction request for Computer Networks on Aug 16 is under review.', read: true, createdAt: '2026-08-16T18:30:00' },
  { id: 'n5', userId: 'f2',  type: 'warning', title: 'Low Attendance Students', message: '6 students in CSE301 are below 75% attendance threshold.', read: false, createdAt: '2026-08-17T07:30:00' },
  { id: 'n6', userId: 'f2',  type: 'info', title: 'Correction Request', message: 'Priya Patel (CSE21002) submitted a correction request for Computer Networks.', read: false, createdAt: '2026-08-16T18:05:00' },
];

// ─── Audit Logs ───────────────────────────────────────────────
export const auditLogs: AuditLog[] = [
  { id: 'al1', userId: 'f2', userName: 'Prof. Meera Iyer', userRole: 'faculty', action: 'ATTENDANCE_UPDATED', entity: 'AttendanceRecord', entityId: 'ar_cr3', oldValue: 'absent', newValue: 'present', reason: 'Approved correction request — verified through class register.', ipAddress: '192.168.1.45', timestamp: '2026-08-16T09:02:15' },
  { id: 'al2', userId: 'f2', userName: 'Prof. Meera Iyer', userRole: 'faculty', action: 'SESSION_STARTED', entity: 'AttendanceSession', entityId: 'ses1', ipAddress: '192.168.1.45', timestamp: '2026-08-17T09:00:30' },
  { id: 'al3', userId: 'admin1', userName: 'Admin System', userRole: 'admin', action: 'STUDENT_CREATED', entity: 'Student', entityId: 'st12', ipAddress: '192.168.1.10', timestamp: '2026-08-01T10:15:00' },
  { id: 'al4', userId: 'admin1', userName: 'Admin System', userRole: 'admin', action: 'SETTINGS_UPDATED', entity: 'SystemSettings', oldValue: '75', newValue: '75', reason: 'Annual policy review.', ipAddress: '192.168.1.10', timestamp: '2026-08-05T14:00:00' },
  { id: 'al5', userId: 'st3', userName: 'Rahul Verma', userRole: 'student', action: 'CORRECTION_REQUESTED', entity: 'CorrectionRequest', entityId: 'cr_al5', ipAddress: '10.0.0.15', timestamp: '2026-08-17T12:35:00' },
  { id: 'al6', userId: 'f3', userName: 'Prof. Arun Das', userRole: 'faculty', action: 'SESSION_ENDED', entity: 'AttendanceSession', entityId: 'ses3', ipAddress: '192.168.1.22', timestamp: '2026-08-17T09:00:00' },
  { id: 'al7', userId: 'admin1', userName: 'Admin System', userRole: 'admin', action: 'FACULTY_CREATED', entity: 'Faculty', entityId: 'f7', ipAddress: '192.168.1.10', timestamp: '2026-08-01T09:00:00' },
  { id: 'al8', userId: 'f4', userName: 'Prof. Deepa Nair', userRole: 'faculty', action: 'LEAVE_REVIEWED', entity: 'LeaveRequest', entityId: 'lr2', oldValue: 'pending', newValue: 'approved', reason: 'Medical certificate verified.', ipAddress: '192.168.1.30', timestamp: '2026-08-09T14:00:00' },
];

// ─── Timetable ───────────────────────────────────────────────
export const timetableSlots: TimetableSlot[] = [
  { id: 'tt1', day: 'Monday',    period: 1, startTime: '08:00', endTime: '09:00', subjectId: 's3', subjectName: 'Operating Systems', subjectCode: 'CSE303', facultyId: 'f4', facultyName: 'Prof. Deepa Nair', room: 'CS-102', semester: 5, section: 'A' },
  { id: 'tt2', day: 'Monday',    period: 2, startTime: '09:00', endTime: '10:00', subjectId: 's1', subjectName: 'Data Structures', subjectCode: 'CSE301', facultyId: 'f2', facultyName: 'Prof. Meera Iyer', room: 'CS-101', semester: 5, section: 'A' },
  { id: 'tt3', day: 'Monday',    period: 4, startTime: '11:00', endTime: '12:00', subjectId: 's2', subjectName: 'Database Management', subjectCode: 'CSE302', facultyId: 'f3', facultyName: 'Prof. Arun Das', room: 'CS-203', semester: 5, section: 'A' },
  { id: 'tt4', day: 'Tuesday',   period: 1, startTime: '08:00', endTime: '09:00', subjectId: 's5', subjectName: 'Artificial Intelligence', subjectCode: 'CSE501', facultyId: 'f5', facultyName: 'Prof. Vikram Singh', room: 'CS-301', semester: 5, section: 'A' },
  { id: 'tt5', day: 'Tuesday',   period: 3, startTime: '10:00', endTime: '11:00', subjectId: 's6', subjectName: 'Machine Learning', subjectCode: 'CSE502', facultyId: 'f6', facultyName: 'Prof. Kavitha Rao', room: 'CS-205', semester: 5, section: 'A' },
  { id: 'tt6', day: 'Wednesday', period: 2, startTime: '09:00', endTime: '10:00', subjectId: 's4', subjectName: 'Computer Networks', subjectCode: 'CSE401', facultyId: 'f2', facultyName: 'Prof. Meera Iyer', room: 'CS-102', semester: 5, section: 'A' },
  { id: 'tt7', day: 'Wednesday', period: 4, startTime: '11:00', endTime: '12:00', subjectId: 's8', subjectName: 'Web Technologies', subjectCode: 'CSE304', facultyId: 'f7', facultyName: 'Prof. Sanjay Gupta', room: 'CS-Lab1', semester: 5, section: 'A' },
  { id: 'tt8', day: 'Thursday',  period: 1, startTime: '08:00', endTime: '09:00', subjectId: 's1', subjectName: 'Data Structures', subjectCode: 'CSE301', facultyId: 'f2', facultyName: 'Prof. Meera Iyer', room: 'CS-101', semester: 5, section: 'A' },
  { id: 'tt9', day: 'Thursday',  period: 3, startTime: '10:00', endTime: '11:00', subjectId: 's7', subjectName: 'Software Engineering', subjectCode: 'CSE403', facultyId: 'f3', facultyName: 'Prof. Arun Das', room: 'CS-201', semester: 5, section: 'A' },
  { id: 'tt10', day: 'Friday',   period: 2, startTime: '09:00', endTime: '10:00', subjectId: 's5', subjectName: 'Artificial Intelligence', subjectCode: 'CSE501', facultyId: 'f5', facultyName: 'Prof. Vikram Singh', room: 'CS-301', semester: 5, section: 'A' },
  { id: 'tt11', day: 'Friday',   period: 4, startTime: '11:00', endTime: '12:00', subjectId: 's2', subjectName: 'Database Management', subjectCode: 'CSE302', facultyId: 'f3', facultyName: 'Prof. Arun Das', room: 'CS-203', semester: 5, section: 'A' },
];

// ─── System Settings ─────────────────────────────────────────
export const systemSettings: SystemSettings = {
  minAttendanceThreshold: 75,
  warningThreshold: 80,
  geofenceRadius: 50,
  qrExpiry: 30,
  faceConfidenceMin: 85,
  emailNotifications: true,
  pushNotifications: true,
  autoMarkAbsent: true,
  allowCorrectionRequests: true,
  correctionWindowDays: 7,
};

// ─── Courses ─────────────────────────────────────────────────
export const courses: Course[] = [
  { id: 'c1', name: 'B.Tech Computer Science & Engineering', code: 'BTCSE', departmentId: 'd1', departmentName: 'CSE', semester: 5, credits: 180 },
  { id: 'c2', name: 'B.Tech Electronics & Communication',    code: 'BTECE', departmentId: 'd2', departmentName: 'ECE', semester: 5, credits: 180 },
  { id: 'c3', name: 'B.Tech Information Technology',         code: 'BTIT',  departmentId: 'd5', departmentName: 'IT',  semester: 5, credits: 180 },
];

// ─── Summary Stats ────────────────────────────────────────────
export const summaryStats = {
  totalStudents: 980,
  totalFaculty: 75,
  totalDepartments: 5,
  avgAttendance: 79.4,
  activeSessionsToday: 8,
  lowRiskStudents: 612,
  mediumRiskStudents: 196,
  highRiskStudents: 172,
  todayPresent: 780,
  todayAbsent: 200,
  pendingRequests: 12,
  anomaliesDetected: 5,
};
