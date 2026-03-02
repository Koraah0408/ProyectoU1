import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { useTasks } from '../../contexts/TaskContext';
import { subDays, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../../contexts/ThemeContext';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-dark-elevated border border-slate-100 dark:border-dark-border rounded-xl px-4 py-3 shadow-lg">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
            <p className="text-base font-bold text-primary-600 dark:text-primary-400">
                {payload[0].value} <span className="text-xs font-normal text-slate-400">tareas</span>
            </p>
        </div>
    );
};

export default function ProductivityChart() {
    const { tasks } = useTasks();
    const { isDarkMode } = useTheme();

    // Build last 7 days data
    const data = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const count = tasks.filter(t =>
            t.completed && t.updated_at && isSameDay(new Date(t.updated_at), date)
        ).length;
        return {
            day: format(date, 'EEE', { locale: es }),
            date: format(date, 'dd MMM', { locale: es }),
            count,
        };
    });

    const maxCount = Math.max(...data.map(d => d.count), 1);
    const axisColor = isDarkMode ? '#475569' : '#cbd5e1';
    const textColor = isDarkMode ? '#94a3b8' : '#64748b';

    return (
        <div className="bg-white dark:bg-dark-motive rounded-2xl p-6 border border-slate-100 dark:border-dark-border">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white">Productividad semanal</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Tareas completadas por día</p>
                </div>
                <span className="text-xs bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full font-medium">
                    Últimos 7 días
                </span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={axisColor} vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={{ fill: textColor, fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fill: textColor, fontSize: 11, fontFamily: 'Inter' }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, maxCount + 1]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.06)', radius: 8 }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.count === maxCount && maxCount > 0
                                    ? (isDarkMode ? '#818cf8' : '#6366f1')
                                    : (isDarkMode ? '#334155' : '#e2e8f0')}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
