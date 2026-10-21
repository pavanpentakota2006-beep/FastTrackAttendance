import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

// Pages — Login
import LoginPage from './pages/LoginPage';

// Pages — Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import FacultyManagement from './pages/admin/FacultyManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import SubjectManagement from './pages/admin/SubjectManagement';
import TimetableManagement from './pages/admin/TimetableManagement';
import AttendanceMonitoring from './pages/admin/AttendanceMonitoring';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import ReportsPage from './pages/admin/ReportsPage';
import AuditLogs from './pages/admin/AuditLogs';
import SecurityMonitor from './pages/admin/SecurityMonitor';
import SystemSettings from './pages/admin/SystemSettings';

// Pages — Faculty
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AttendanceSessions from './pages/faculty/AttendanceSessions';
import LiveAttendance from './pages/faculty/LiveAttendance';
import AttendanceHistory from './pages/faculty/AttendanceHistory';
import FacultyAnalytics from './pages/faculty/FacultyAnalytics';
import CorrectionRequests from './pages/faculty/CorrectionRequests';

// Pages — Student
import StudentDashboard from './pages/student/StudentDashboard';
import MarkAttendance from './pages/student/MarkAttendance';
import MyAttendance from './pages/student/MyAttendance';
import SubjectAttendance from './pages/student/SubjectAttendance';
import AttendanceCalendar from './pages/student/AttendanceCalendar';
import AttendancePrediction from './pages/student/AttendancePrediction';
import LeaveManagement from './pages/student/LeaveManagement';
import StudentCorrections from './pages/student/StudentCorrections';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentProfile from './pages/student/StudentProfile';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user!.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={
          isAuthenticated
            ? <Navigate to={`/${user!.role}/dashboard`} replace />
            : <LoginPage />
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppProvider>
              <AppLayout>
                <Routes>
                  <Route path="dashboard"   element={<AdminDashboard />} />
                  <Route path="students"    element={<StudentManagement />} />
                  <Route path="faculty"     element={<FacultyManagement />} />
                  <Route path="departments" element={<DepartmentManagement />} />
                  <Route path="subjects"    element={<SubjectManagement />} />
                  <Route path="timetable"   element={<TimetableManagement />} />
                  <Route path="monitoring"  element={<AttendanceMonitoring />} />
                  <Route path="analytics"   element={<AnalyticsDashboard />} />
                  <Route path="reports"     element={<ReportsPage />} />
                  <Route path="audit-logs"  element={<AuditLogs />} />
                  <Route path="security"    element={<SecurityMonitor />} />
                  <Route path="settings"    element={<SystemSettings />} />
                  <Route path="*"           element={<Navigate to="dashboard" replace />} />
                </Routes>
              </AppLayout>
            </AppProvider>
          </ProtectedRoute>
        } />

        {/* Faculty Routes */}
        <Route path="/faculty/*" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppProvider>
              <AppLayout>
                <Routes>
                  <Route path="dashboard"   element={<FacultyDashboard />} />
                  <Route path="sessions"    element={<AttendanceSessions />} />
                  <Route path="live"        element={<LiveAttendance />} />
                  <Route path="history"     element={<AttendanceHistory />} />
                  <Route path="analytics"   element={<FacultyAnalytics />} />
                  <Route path="requests"    element={<CorrectionRequests />} />
                  <Route path="*"           element={<Navigate to="dashboard" replace />} />
                </Routes>
              </AppLayout>
            </AppProvider>
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <AppProvider>
              <AppLayout>
                <Routes>
                  <Route path="dashboard"   element={<StudentDashboard />} />
                  <Route path="mark"        element={<MarkAttendance />} />
                  <Route path="attendance"  element={<MyAttendance />} />
                  <Route path="subjects"    element={<SubjectAttendance />} />
                  <Route path="calendar"    element={<AttendanceCalendar />} />
                  <Route path="prediction"  element={<AttendancePrediction />} />
                  <Route path="leave"       element={<LeaveManagement />} />
                  <Route path="corrections" element={<StudentCorrections />} />
                  <Route path="timetable"   element={<StudentTimetable />} />
                  <Route path="profile"     element={<StudentProfile />} />
                  <Route path="*"           element={<Navigate to="dashboard" replace />} />
                </Routes>
              </AppLayout>
            </AppProvider>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
