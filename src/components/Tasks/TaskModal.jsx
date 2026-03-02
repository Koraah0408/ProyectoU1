import { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { useTasks } from '../../contexts/TaskContext';

const TAGS = [
    { id: 'trabajo', label: 'Trabajo', emoji: '💼' },
    { id: 'personal', label: 'Personal', emoji: '🏠' },
    { id: 'estudio', label: 'Estudio', emoji: '📚' },
    { id: 'salud', label: 'Salud', emoji: '❤️' },
    { id: 'otro', label: 'Otro', emoji: '📌' },
];

const PRIORITIES = [
    { id: 'low', label: 'Baja', color: 'text-slate-500' },
    { id: 'medium', label: 'Media', color: 'text-primary-500' },
    { id: 'high', label: 'Alta', color: 'text-red-500' },
];

export default function TaskModal({ onClose, editTask = null }) {
    const { addTask, updateTask } = useTasks();
    const [title, setTitle] = useState(editTask?.title ?? '');
    const [description, setDescription] = useState(editTask?.description ?? '');
    const [selectedTags, setSelectedTags] = useState(editTask?.tags ?? []);
    const [deadline, setDeadline] = useState(
        editTask?.deadline ? editTask.deadline.slice(0, 16) : ''
    );
    const [priority, setPriority] = useState(editTask?.priority ?? 'medium');
    const [saving, setSaving] = useState(false);

    // Trap focus & close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    const toggleTag = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSaving(true);
        if (editTask) {
            await updateTask(editTask.id, {
                title: title.trim(),
                description: description.trim(),
                tags: selectedTags,
                deadline: deadline || null,
                priority,
            });
        } else {
            await addTask({
                title: title.trim(),
                description: description.trim(),
                tags: selectedTags,
                deadline: deadline || null,
                priority,
            });
        }
        setSaving(false);
        onClose();
    };

    return (
        <div className="modal-backdrop animate-fade-in" onClick={onClose}>
            <div
                className="bg-white dark:bg-dark-motive rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-dark-border animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-dark-border">
                    <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                        {editTask ? 'Editar tarea' : 'Nueva tarea'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-elevated rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Título <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            autoFocus
                            placeholder="¿Qué necesitas hacer?"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-elevated text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Descripción <span className="text-slate-400 font-normal">(opcional)</span>
                        </label>
                        <textarea
                            placeholder="Agrega más detalles..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-elevated text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <Tag size={14} /> Etiquetas
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TAGS.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2 tag-${tag.id}
                    ${selectedTags.includes(tag.id)
                                            ? 'border-current scale-105 shadow-sm'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    {tag.emoji} {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Deadline + Priority row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                <Calendar size={14} /> Fecha límite
                            </label>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-elevated text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                <AlertTriangle size={14} /> Prioridad
                            </label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-elevated text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
                            >
                                {PRIORITIES.map(p => (
                                    <option key={p.id} value={p.id}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || saving}
                            className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-primary-600 to-violet-600 text-white rounded-xl hover:from-primary-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/30"
                        >
                            {saving ? 'Guardando...' : editTask ? 'Guardar cambios' : 'Crear tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
