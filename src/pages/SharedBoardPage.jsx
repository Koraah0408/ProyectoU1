import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CheckSquare, Check, Calendar, Tag, ExternalLink, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TAG_STYLES = {
    trabajo: 'tag-trabajo', personal: 'tag-personal',
    estudio: 'tag-estudio', salud: 'tag-salud', otro: 'tag-otro',
};
const TAG_EMOJIS = { trabajo: '💼', personal: '🏠', estudio: '📚', salud: '❤️', otro: '📌' };

function TaskSkeleton() {
    return (
        <div className="bg-white dark:bg-dark-motive rounded-2xl border border-slate-100 dark:border-dark-border p-4">
            <div className="flex gap-3">
                <div className="skeleton w-5 h-5 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                </div>
            </div>
        </div>
    );
}

export default function SharedBoardPage() {
    const { shareId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShared = async () => {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .select('id, title, description, completed, tags, deadline, priority, created_at')
                    .eq('share_id', shareId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTasks(data ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchShared();
    }, [shareId]);

    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white">
            {/* Header */}
            <header className="border-b border-slate-100 dark:border-dark-border bg-white dark:bg-dark-surface sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-violet-600 rounded-lg flex items-center justify-center">
                            <CheckSquare size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">TaskFlow Pro</span>
                        <span className="text-xs bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-medium ml-1">
                            Lista compartida
                        </span>
                    </div>
                    <Link
                        to="/"
                        className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                        Crear mi cuenta <ExternalLink size={12} />
                    </Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Progress bar */}
                {!loading && !error && total > 0 && (
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Progreso</span>
                            <span className="text-slate-500 dark:text-slate-400">{completed} / {total}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-dark-elevated rounded-full h-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-violet-500 transition-all duration-700"
                                style={{ width: total ? `${(completed / total) * 100}%` : '0%' }}
                            />
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl">
                        <AlertCircle size={18} />
                        <span className="text-sm">Error al cargar: {error}</span>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => <TaskSkeleton key={i} />)}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && tasks.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <CheckSquare size={40} className="mx-auto mb-3 opacity-30" />
                        <p>No se encontraron tareas con este enlace.</p>
                    </div>
                )}

                {/* Tasks */}
                {!loading && !error && tasks.length > 0 && (
                    <div className="space-y-2.5">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className={`bg-white dark:bg-dark-motive rounded-2xl border border-slate-100 dark:border-dark-border p-4 transition-opacity ${task.completed ? 'opacity-60' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}
                                    >
                                        {task.completed && <Check size={11} strokeWidth={3} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{task.description}</p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                            {task.tags?.map(tag => (
                                                <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TAG_STYLES[tag] ?? 'tag-otro'}`}>
                                                    {TAG_EMOJIS[tag]} {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                                </span>
                                            ))}
                                            {task.deadline && (
                                                <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-50 dark:bg-dark-elevated px-2 py-0.5 rounded-full">
                                                    <Calendar size={10} />
                                                    {format(new Date(task.deadline), 'd MMM', { locale: es })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8">
                    Vista de solo lectura · Compartida vía TaskFlow Pro
                </p>
            </main>
        </div>
    );
}
