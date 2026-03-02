import { useState } from 'react';
import Stats from '../components/Dashboard/Stats';
import TaskList from '../components/Tasks/TaskList';
import { Plus } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';

export default function Dashboard() {
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const { addTask } = useTasks();

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        await addTask(newTitle.trim(), newDescription.trim());
        setNewTitle('');
        setNewDescription('');
        setIsAdding(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Lista de tareas</h1>
                    <p className="text-slate-500 dark:text-slate-400">Administra tus tareas eficientemente</p>
                </div>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30"
                >
                    <Plus size={20} className={isAdding ? 'rotate-45 transition-transform' : 'transition-transform'} />
                    <span>{isAdding ? 'Cancelar' : 'Nueva Tarea'}</span>
                </button>
            </div>

            <Stats />

            {isAdding && (
                <div className="bg-white dark:bg-dark-motive p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleAddTask} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                            <input
                                type="text"
                                required
                                placeholder="What needs to be done?"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                            <textarea
                                placeholder="Add some details..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none h-24"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl font-medium transition-colors"
                                disabled={!newTitle.trim()}
                            >
                                Save Task
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-6 max-w-fit">
                {['all', 'pending', 'completed'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <TaskList filter={filter} />
        </div>
    );
}
