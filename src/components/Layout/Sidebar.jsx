import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    CheckSquare, BarChart2, Calendar, LogOut,
    Sun, Moon, Monitor, ChevronRight, X, Menu, Trophy, Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useGamification } from '../../contexts/GamificationContext';

const NAV_ITEMS = [
    { to: '/', label: 'Tareas', icon: CheckSquare },
    { to: '/analytics', label: 'Analíticas', icon: BarChart2 },
    { to: '/calendar', label: 'Calendario', icon: Calendar },
];

const THEME_OPTIONS = [
    { key: 'light', label: 'Claro', icon: Sun },
    { key: 'dark', label: 'Oscuro', icon: Moon },
    { key: 'system', label: 'Sistema', icon: Monitor },
];

export default function Sidebar() {
    const { user, signOut } = useAuth();
    const { theme, setThemeMode } = useTheme();
    const { xp, level, xpProgress, xpToNext } = useGamification();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-dark-border">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 shrink-0">
                    <CheckSquare size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-slate-800 dark:text-white leading-none">TaskFlow</h1>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pro</p>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="ml-auto p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 lg:hidden"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
              ${isActive
                                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated hover:text-slate-900 dark:hover:text-white'
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                        <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                ))}
            </nav>

            {/* Theme Switcher */}
            <div className="px-3 pb-3">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2">Tema</p>
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-dark-elevated rounded-xl">
                    {THEME_OPTIONS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setThemeMode(key)}
                            title={label}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all
                ${theme === key
                                    ? 'bg-white dark:bg-dark-motive text-primary-600 dark:text-primary-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <Icon size={13} />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Gamification Footer */}
            <div className="px-3 pb-3">
                <div className="bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-500/10 dark:to-violet-500/10 rounded-2xl p-4 border border-primary-100 dark:border-primary-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-600 rounded-lg flex items-center justify-center">
                            <Star size={14} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary-700 dark:text-primary-300">Nivel {level}</p>
                            <p className="text-xs text-primary-500 dark:text-primary-400">{xp} XP total</p>
                        </div>
                        <Trophy size={16} className="ml-auto text-amber-500" />
                    </div>
                    <div className="w-full bg-primary-100 dark:bg-primary-500/20 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-violet-500 xp-bar-fill"
                            style={{ width: `${xpProgress}%` }}
                        />
                    </div>
                    <p className="mt-1.5 text-xs text-primary-500 dark:text-primary-400">
                        {xpToNext} XP para nivel {level + 1}
                    </p>
                </div>
            </div>

            {/* User & Sign Out */}
            <div className="px-3 pb-4 border-t border-slate-100 dark:border-dark-border pt-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate flex-1">{user?.email}</p>
                    <button
                        onClick={handleSignOut}
                        className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Cerrar sesión"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-dark-motive border border-slate-200 dark:border-dark-border rounded-xl shadow-sm lg:hidden"
            >
                <Menu size={20} className="text-slate-600 dark:text-slate-300" />
            </button>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-60 border-r border-slate-100 dark:border-dark-border bg-white dark:bg-dark-surface h-screen sticky top-0">
                <SidebarContent />
            </aside>

            {/* Mobile drawer */}
            <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-dark-surface border-r border-slate-100 dark:border-dark-border z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>
        </>
    );
}
