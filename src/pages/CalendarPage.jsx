import { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, eachDayOfInterval,
    isSameMonth, isToday, isSameDay, addMonths, subMonths,
    startOfWeek, endOfWeek
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';
import { isPast } from 'date-fns';

const TAG_COLORS = {
    trabajo: 'bg-violet-500',
    personal: 'bg-emerald-500',
    estudio: 'bg-amber-500',
    salud: 'bg-red-500',
    otro: 'bg-slate-400',
};

export default function CalendarPage() {
    const { tasks } = useTasks();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

    const tasksForDay = (day) =>
        tasks.filter(t => t.deadline && isSameDay(new Date(t.deadline), day));

    const selectedDayTasks = selectedDay ? tasksForDay(selectedDay) : [];

    const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Calendario</h1>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Tareas organizadas por fecha límite</p>
            </div>

            <div className="bg-white dark:bg-dark-motive rounded-2xl border border-slate-100 dark:border-dark-border overflow-hidden">
                {/* Month navigation */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-dark-border">
                    <button
                        onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-dark-elevated rounded-xl transition-colors text-slate-600 dark:text-slate-300"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <h2 className="text-base font-semibold text-slate-800 dark:text-white capitalize">
                        {format(currentMonth, 'MMMM yyyy', { locale: es })}
                    </h2>
                    <button
                        onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-dark-elevated rounded-xl transition-colors text-slate-600 dark:text-slate-300"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-slate-100 dark:border-dark-border">
                    {WEEK_DAYS.map(d => (
                        <div key={d} className="py-2 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7">
                    {calDays.map((day, idx) => {
                        const dayTasks = tasksForDay(day);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = selectedDay && isSameDay(day, selectedDay);
                        const isTodayDay = isToday(day);

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDay(isSelected ? null : day)}
                                className={`relative min-h-[72px] p-2 text-left border-b border-r border-slate-50 dark:border-dark-border/50 transition-colors
                  ${isSelected ? 'bg-primary-50 dark:bg-primary-500/10' : 'hover:bg-slate-50 dark:hover:bg-dark-elevated'}
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                `}
                            >
                                <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full
                  ${isTodayDay
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}
                                >
                                    {format(day, 'd')}
                                </span>

                                {/* Task dots */}
                                <div className="flex flex-wrap gap-0.5 mt-1">
                                    {dayTasks.slice(0, 3).map(t => (
                                        <span
                                            key={t.id}
                                            className={`w-1.5 h-1.5 rounded-full ${t.completed ? 'bg-emerald-400' :
                                                    (isPast(new Date(t.deadline)) ? 'bg-red-400' : 'bg-primary-400')
                                                }`}
                                        />
                                    ))}
                                    {dayTasks.length > 3 && (
                                        <span className="text-xs text-slate-400 leading-none">+{dayTasks.length - 3}</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected day panel */}
            {selectedDay && (
                <div className="bg-white dark:bg-dark-motive rounded-2xl border border-slate-100 dark:border-dark-border p-6 animate-slide-up">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar size={16} className="text-primary-500" />
                        {format(selectedDay, "EEEE, d 'de' MMMM", { locale: es })}
                    </h3>
                    {selectedDayTasks.length === 0 ? (
                        <p className="text-sm text-slate-400 dark:text-slate-500">No hay tareas con vencimiento este día.</p>
                    ) : (
                        <ul className="space-y-2">
                            {selectedDayTasks.map(task => (
                                <li key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border ${task.completed
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
                                        : 'bg-slate-50 dark:bg-dark-elevated border-slate-100 dark:border-dark-border'
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${task.completed ? 'bg-emerald-500' :
                                            isPast(new Date(task.deadline)) ? 'bg-red-500' : 'bg-primary-500'
                                        }`} />
                                    <span className={`text-sm font-medium flex-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {task.title}
                                    </span>
                                    {task.tags?.slice(0, 2).map(tag => (
                                        <span key={tag} className={`w-1.5 h-1.5 rounded-full ${TAG_COLORS[tag] ?? 'bg-slate-400'}`} />
                                    ))}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
