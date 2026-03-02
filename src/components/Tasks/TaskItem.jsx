import { useState } from 'react';
import { Check, Trash2, Edit2, X, MoreVertical } from 'lucide-react';
import { useTasks } from '../../contexts/TaskContext';

export default function TaskItem({ task }) {
    const { toggleTaskComplete, deleteTask, updateTask } = useTasks();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || '');

    const handleUpdate = async () => {
        if (!editTitle.trim()) return;
        await updateTask(task.id, {
            title: editTitle.trim(),
            description: editDescription.trim()
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-dark-motive p-5 rounded-2xl shadow-sm border border-primary-500 dark:border-primary-500 transition-all">
                <div className="space-y-3">
                    <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm resize-none h-20"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description..."
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={() => {
                                setEditTitle(task.title);
                                setEditDescription(task.description || '');
                                setIsEditing(false);
                            }}
                            className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={!editTitle.trim() || (editTitle === task.title && editDescription === task.description)}
                            className="px-4 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group bg-white dark:bg-dark-motive p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-slate-200 dark:hover:border-slate-700 ${task.completed ? 'opacity-75' : ''}`}>
            <div className="flex items-start gap-4">
                <button
                    onClick={() => toggleTaskComplete(task.id, task.completed)}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400'
                        }`}
                >
                    {task.completed && <Check size={14} strokeWidth={3} />}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate transition-all ${task.completed
                            ? 'text-slate-400 dark:text-slate-500 line-through'
                            : 'text-slate-800 dark:text-white'
                        }`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`text-sm mt-1 line-clamp-2 transition-all ${task.completed ? 'text-slate-400/70 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                            {task.description}
                        </p>
                    )}

                    <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <span>
                            {new Date(task.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${task.completed
                                ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                            }`}>
                            {task.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                        title="Edit task"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
