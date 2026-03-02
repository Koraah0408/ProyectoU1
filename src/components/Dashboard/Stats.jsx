import { useTasks } from '../../contexts/TaskContext';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

export default function Stats() {
    const { tasks } = useTasks();

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    // Calculate percentage
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-dark-motive rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tasks</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{total}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-500 rounded-xl flex items-center justify-center">
                        <ListTodo size={24} />
                    </div>
                </div>
                <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-dark-motive rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completed}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-motive rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</p>
                        <p className="text-3xl font-bold text-amber-500 dark:text-amber-400 mt-1">{pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 rounded-xl flex items-center justify-center">
                        <Circle size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
}
