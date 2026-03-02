import { useTasks } from '../../contexts/TaskContext';
import { CheckCircle2, Circle, ListTodo, TrendingUp } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, bg, subtext }) {
    return (
        <div className="bg-white dark:bg-dark-motive rounded-2xl p-5 border border-slate-100 dark:border-dark-border transition-colors">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} className={color} />
                </div>
            </div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>}
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="bg-white dark:bg-dark-motive rounded-2xl p-5 border border-slate-100 dark:border-dark-border">
            <div className="flex items-center justify-between mb-3">
                <div className="skeleton h-4 w-20" />
                <div className="skeleton w-9 h-9 rounded-xl" />
            </div>
            <div className="skeleton h-8 w-12 mt-1" />
            <div className="skeleton h-3 w-24 mt-2" />
        </div>
    );
}

export default function Stats() {
    const { tasks, loading } = useTasks();

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
        );
    }

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                label="Total"
                value={total}
                icon={ListTodo}
                color="text-primary-600 dark:text-primary-400"
                bg="bg-primary-50 dark:bg-primary-500/20"
                subtext="tareas creadas"
            />
            <StatCard
                label="Completadas"
                value={completed}
                icon={CheckCircle2}
                color="text-emerald-600 dark:text-emerald-400"
                bg="bg-emerald-50 dark:bg-emerald-500/20"
                subtext={`${rate}% del total`}
            />
            <StatCard
                label="Pendientes"
                value={pending}
                icon={Circle}
                color="text-amber-500 dark:text-amber-400"
                bg="bg-amber-50 dark:bg-amber-500/20"
                subtext="por completar"
            />
            <StatCard
                label="Tasa"
                value={`${rate}%`}
                icon={TrendingUp}
                color="text-violet-600 dark:text-violet-400"
                bg="bg-violet-50 dark:bg-violet-500/20"
                subtext="completitud"
            />
        </div>
    );
}
