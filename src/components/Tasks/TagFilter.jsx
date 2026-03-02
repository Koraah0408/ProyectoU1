import { useTasks } from '../../contexts/TaskContext';

const TAGS = [
    { id: 'all', label: 'Todas', className: 'bg-slate-100 text-slate-600 dark:bg-dark-elevated dark:text-slate-300' },
    { id: 'trabajo', label: '💼 Trabajo', className: 'tag-trabajo' },
    { id: 'personal', label: '🏠 Personal', className: 'tag-personal' },
    { id: 'estudio', label: '📚 Estudio', className: 'tag-estudio' },
    { id: 'salud', label: '❤️ Salud', className: 'tag-salud' },
    { id: 'otro', label: '📌 Otro', className: 'tag-otro' },
];

export default function TagFilter() {
    const { activeTag, setActiveTag } = useTasks();

    return (
        <div className="flex gap-2 flex-wrap mb-4">
            {TAGS.map(tag => (
                <button
                    key={tag.id}
                    onClick={() => setActiveTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border-2
            ${activeTag === tag.id
                            ? `${tag.className} border-current scale-105 shadow-sm`
                            : `${tag.className} border-transparent opacity-70 hover:opacity-100 hover:scale-105`
                        }`}
                >
                    {tag.label}
                </button>
            ))}
        </div>
    );
}
