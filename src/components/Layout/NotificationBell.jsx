import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useTasks } from '../../contexts/TaskContext';
import { formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NotificationBell() {
    const { tasks } = useTasks();
    const [isOpen, setIsOpen] = useState(false);
    const [dismissed, setDismissed] = useState([]);

    const notifications = tasks
        .filter(t => !t.completed && t.deadline)
        .filter(t => {
            const d = new Date(t.deadline);
            return isPast(d) || isToday(d) || isTomorrow(d);
        })
        .filter(t => !dismissed.includes(t.id))
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 10);

    const unread = notifications.length;

    const getDeadlineLabel = (deadline) => {
        const d = new Date(deadline);
        if (isPast(d) && !isToday(d)) return { label: 'Vencida', color: 'text-red-500 bg-red-50 dark:bg-red-500/10' };
        if (isToday(d)) return { label: 'Hoy', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' };
        if (isTomorrow(d)) return { label: 'Mañana', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' };
        return { label: formatDistanceToNow(d, { locale: es }), color: 'text-slate-500 bg-slate-50 dark:bg-slate-800' };
    };

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (!e.target.closest('#notification-panel')) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    return (
        <div className="relative" id="notification-panel">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-elevated rounded-xl transition-colors"
                title="Notificaciones"
            >
                <Bell size={20} />
                {unread > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-dark-motive border border-slate-100 dark:border-dark-border rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-down">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-dark-border">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Recordatorios</h3>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-400">
                            <X size={14} />
                        </button>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                            <Bell size={28} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Sin recordatorios pendientes</p>
                        </div>
                    ) : (
                        <ul className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-dark-border">
                            {notifications.map(task => {
                                const { label, color } = getDeadlineLabel(task.deadline);
                                return (
                                    <li key={task.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-dark-elevated transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{task.title}</p>
                                        </div>
                                        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
                                        <button
                                            onClick={() => setDismissed(prev => [...prev, task.id])}
                                            className="shrink-0 p-1 text-slate-300 hover:text-slate-500 rounded"
                                        >
                                            <X size={12} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
