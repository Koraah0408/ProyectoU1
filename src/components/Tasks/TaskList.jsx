import { useTasks } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import { KanbanSquare } from 'lucide-react';

function TaskSkeleton() {
    return (
        <div className="bg-white dark:bg-dark-motive rounded-2xl border border-slate-100 dark:border-dark-border p-4 pl-4 priority-medium">
            <div className="flex items-start gap-3">
                <div className="skeleton w-5 h-5 rounded-full mt-0.5 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                    <div className="flex gap-2 mt-2">
                        <div className="skeleton h-4 w-16 rounded-full" />
                        <div className="skeleton h-4 w-20 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TaskList() {
    const { filteredTasks, loading, error } = useTasks();

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => <TaskSkeleton key={i} />)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-sm">
                Error al cargar las tareas: {error}
            </div>
        );
    }

    if (filteredTasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-dark-motive rounded-2xl border border-dashed border-slate-200 dark:border-dark-border">
                <div className="w-14 h-14 bg-slate-100 dark:bg-dark-elevated text-slate-400 rounded-2xl flex items-center justify-center mb-3">
                    <KanbanSquare size={28} />
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Sin tareas aquí</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                    Crea una nueva tarea o ajusta los filtros activos.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {filteredTasks.map((task) => (
                <div key={task.id} className="animate-fade-in">
                    <TaskItem task={task} />
                </div>
            ))}
        </div>
    );
}
