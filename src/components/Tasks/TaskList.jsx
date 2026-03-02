import { useTasks } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import { Loader2, KanbanSquare } from 'lucide-react';

export default function TaskList({ filter }) {
    const { tasks, loading, error } = useTasks();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
                <p>Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center">
                Error loading tasks: {error}
            </div>
        );
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // 'all'
    });

    if (filteredTasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400 bg-white dark:bg-dark-motive rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
                    <KanbanSquare size={32} />
                </div>
                <p className="font-medium text-slate-700 dark:text-slate-300">No tasks found</p>
                <p className="text-sm mt-1">
                    {filter === 'all'
                        ? "You don't have any tasks yet. Create one to get started!"
                        : `You have no ${filter} tasks right now.`}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
}
