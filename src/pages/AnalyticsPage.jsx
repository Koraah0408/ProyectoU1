import Stats from '../components/Dashboard/Stats';
import ProductivityChart from '../components/Dashboard/ProductivityChart';
import BadgeGallery from '../components/Gamification/BadgeGallery';
import { useGamification } from '../contexts/GamificationContext';
import { useTasks } from '../contexts/TaskContext';
import { Star, Zap, Target } from 'lucide-react';

function XPWidget() {
    const { xp, level, xpProgress, xpToNext, isMaxLevel } = useGamification();
    return (
        <div className="bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl p-6 text-white col-span-full sm:col-span-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-white/70 text-sm font-medium">Tu Nivel</p>
                    <p className="text-4xl font-bold mt-0.5">{level}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Star size={26} className="text-yellow-300" />
                </div>
            </div>
            <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/70">
                    <span>{xp} XP totales</span>
                    {!isMaxLevel && <span>{xpToNext} XP para nivel {level + 1}</span>}
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-2 rounded-full bg-white/90 xp-bar-fill"
                        style={{ width: `${xpProgress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function TagBreakdown() {
    const { tasks } = useTasks();
    const TAG_LABELS = { trabajo: '💼 Trabajo', personal: '🏠 Personal', estudio: '📚 Estudio', salud: '❤️ Salud', otro: '📌 Otro' };
    const counts = {};
    tasks.forEach(t => (t.tags ?? []).forEach(tag => { counts[tag] = (counts[tag] ?? 0) + 1; }));
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
    if (entries.length === 0) return null;
    return (
        <div className="bg-white dark:bg-dark-motive rounded-2xl p-6 border border-slate-100 dark:border-dark-border">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Target size={16} className="text-primary-500" /> Por Etiqueta
            </h3>
            <div className="space-y-3">
                {entries.map(([tag, count]) => (
                    <div key={tag}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-300">{TAG_LABELS[tag] ?? tag}</span>
                            <span className="font-semibold text-slate-800 dark:text-white">{count}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-dark-elevated rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-violet-500 transition-all duration-700"
                                style={{ width: `${(count / total) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    const { tasks } = useTasks();
    const completedThisWeek = tasks.filter(t => {
        if (!t.completed || !t.updated_at) return false;
        const d = new Date(t.updated_at);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
    }).length;

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analíticas</h1>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Tu progreso y productividad de un vistazo</p>
            </div>

            {/* Stats */}
            <Stats />

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <ProductivityChart />
                </div>
                <div className="space-y-4">
                    <XPWidget />
                    <div className="bg-white dark:bg-dark-motive rounded-2xl p-5 border border-slate-100 dark:border-dark-border flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <Zap size={20} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Esta semana</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-white">{completedThisWeek} completadas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tag breakdown */}
            <TagBreakdown />

            {/* Badge Gallery */}
            <BadgeGallery />
        </div>
    );
}
