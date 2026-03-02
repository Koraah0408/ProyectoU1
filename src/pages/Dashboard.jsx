import { useState } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import Stats from '../components/Dashboard/Stats';
import TaskList from '../components/Tasks/TaskList';
import TagFilter from '../components/Tasks/TagFilter';
import TaskModal from '../components/Tasks/TaskModal';
import { useTasks } from '../contexts/TaskContext';

const STATUS_FILTERS = ['all', 'pending', 'completed'];
const STATUS_LABELS = { all: 'Todas', pending: 'Pendientes', completed: 'Completadas' };

export default function Dashboard() {
    const { activeFilter, setActiveFilter } = useTasks();
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Mis Tareas</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Organiza y completa tus pendientes del día</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    Nueva Tarea
                </button>
            </div>

            {/* Stats */}
            <Stats />

            {/* Filters Section */}
            <div className="bg-white dark:bg-dark-motive rounded-2xl border border-slate-100 dark:border-dark-border p-4 mb-4">
                {/* Status Tabs */}
                <div className="flex items-center gap-1 mb-3">
                    <SlidersHorizontal size={14} className="text-slate-400 mr-1" />
                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-dark-elevated rounded-xl">
                        {STATUS_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize
                  ${activeFilter === f
                                        ? 'bg-white dark:bg-dark-motive text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                {STATUS_LABELS[f]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tag Filter */}
                <TagFilter />
            </div>

            {/* Task List */}
            <TaskList />

            {/* Add Task Modal */}
            {showAddModal && <TaskModal onClose={() => setShowAddModal(false)} />}
        </div>
    );
}
