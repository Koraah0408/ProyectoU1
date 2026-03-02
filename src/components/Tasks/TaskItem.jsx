import { useState } from 'react';
import { Check, Trash2, Share2, Edit2, Calendar, Flag } from 'lucide-react';
import { useTasks } from '../../contexts/TaskContext';
import ShareModal from './ShareModal';
import TaskModal from './TaskModal';
import { format, isPast, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

const TAG_STYLES = {
    trabajo: 'tag-trabajo',
    personal: 'tag-personal',
    estudio: 'tag-estudio',
    salud: 'tag-salud',
    otro: 'tag-otro',
};

const TAG_EMOJIS = {
    trabajo: '💼', personal: '🏠', estudio: '📚', salud: '❤️', otro: '📌'
};

const PRIORITY_STYLES = {
    low: { border: 'priority-low', dot: 'bg-slate-400', label: 'Baja' },
    medium: { border: 'priority-medium', dot: 'bg-primary-500', label: 'Media' },
    high: { border: 'priority-high', dot: 'bg-red-500', label: 'Alta' },
};

function DeadlineBadge({ deadline }) {
    if (!deadline) return null;
    const d = new Date(deadline);
    const overdue = isPast(d) && !isToday(d);
    const dueToday = isToday(d);

    const label = dueToday
        ? 'Hoy'
        : overdue
            ? `Vencida · ${format(d, 'd MMM', { locale: es })}`
            : format(d, 'd MMM, HH:mm', { locale: es });

    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
      ${overdue
                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                : dueToday
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                    : 'bg-slate-50 text-slate-500 dark:bg-dark-elevated dark:text-slate-400'
            }`}
        >
            <Calendar size={10} />
            {label}
        </span>
    );
}

export default function TaskItem({ task }) {
    const { toggleTaskComplete, deleteTask } = useTasks();
    const [showShare, setShowShare] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [completing, setCompleting] = useState(false);

    const priorityStyle = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;

    const handleComplete = async () => {
        setCompleting(true);
        await toggleTaskComplete(task.id, task.completed);
        setCompleting(false);
    };

    return (
        <>
            <div
                className={`group bg-white dark:bg-dark-motive rounded-2xl border border-slate-100 dark:border-dark-border
          transition-all duration-200 hover:border-slate-200 dark:hover:border-dark-elevated hover:shadow-md dark:hover:shadow-black/20
          ${task.completed ? 'opacity-60' : ''} ${priorityStyle.border} pl-4`}
            >
                <div className="flex items-start gap-3 p-4 pr-3">
                    {/* Checkbox */}
                    <button
                        onClick={handleComplete}
                        disabled={completing}
                        className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
              ${task.completed
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500'
                            } ${completing ? 'opacity-50' : ''}`}
                    >
                        {task.completed && <Check size={11} strokeWidth={3} />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium transition-all leading-snug ${task.completed
                                ? 'text-slate-400 dark:text-slate-500 line-through'
                                : 'text-slate-800 dark:text-white'
                            }`}>
                            {task.title}
                        </h3>

                        {task.description && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        {/* Tags + Deadline row */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {/* Priority dot */}
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityStyle.dot}`} title={`Prioridad: ${priorityStyle.label}`} />

                            {task.tags?.map(tag => (
                                <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TAG_STYLES[tag] ?? 'tag-otro'}`}>
                                    {TAG_EMOJIS[tag]} {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </span>
                            ))}

                            <DeadlineBadge deadline={task.deadline} />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                            onClick={() => setShowEdit(true)}
                            className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Edit2 size={14} />
                        </button>
                        {task.share_id && (
                            <button
                                onClick={() => setShowShare(true)}
                                className="p-1.5 text-slate-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-lg transition-colors"
                                title="Compartir"
                            >
                                <Share2 size={14} />
                            </button>
                        )}
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {showShare && <ShareModal task={task} onClose={() => setShowShare(false)} />}
            {showEdit && <TaskModal editTask={task} onClose={() => setShowEdit(false)} />}
        </>
    );
}
