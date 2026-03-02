import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import { Moon, Sun, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Header = () => {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-motive border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
            Lista de tareas
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 px-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 rounded-lg transition-colors border border-transparent dark:border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Alternar tema"
          >
            {isDarkMode ? (
              <>
                <Sun size={20} />
                <span className="hidden sm:inline text-sm font-medium text-slate-600 dark:text-slate-300">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon size={20} />
                <span className="hidden sm:inline text-sm font-medium text-slate-600 dark:text-slate-300">Modo Oscuro</span>
              </>
            )}
          </button>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white transition-colors duration-200">
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
