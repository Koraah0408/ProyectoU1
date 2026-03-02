import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { TaskProvider } from './contexts/TaskContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import CalendarPage from './pages/CalendarPage';
import SharedBoardPage from './pages/SharedBoardPage';
import Sidebar from './components/Layout/Sidebar';
import NotificationBell from './components/Layout/NotificationBell';
import XPToast from './components/Gamification/XPToast';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-50/90 dark:bg-dark-bg/90 backdrop-blur-sm border-b border-slate-100 dark:border-dark-border px-6 py-3 flex items-center justify-end lg:pl-6 pl-16">
          <NotificationBell />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
      <XPToast />
    </div>
  );
};

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <GamificationProvider>
      <TaskProvider>
        <AppLayout>
          {children}
        </AppLayout>
      </TaskProvider>
    </GamificationProvider>
  </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shared/:shareId" element={<SharedBoardPage />} />
            <Route path="/" element={
              <ProtectedLayout><Dashboard /></ProtectedLayout>
            } />
            <Route path="/analytics" element={
              <ProtectedLayout><AnalyticsPage /></ProtectedLayout>
            } />
            <Route path="/calendar" element={
              <ProtectedLayout><CalendarPage /></ProtectedLayout>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
