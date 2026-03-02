import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

// XP required to reach each level (cumulative)
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000];

const BADGES = [
    { id: 'newcomer', label: 'Primer Paso', emoji: '🌱', description: 'Completa tu primera tarea', xpRequired: 0, tasksRequired: 1 },
    { id: 'on-fire', label: 'En Llamas', emoji: '🔥', description: 'Completa 5 tareas en un día', xpRequired: 0, tasksRequired: 0 },
    { id: 'centurion', label: 'Centurión', emoji: '💯', description: 'Completa 100 tareas', xpRequired: 0, tasksRequired: 100 },
    { id: 'focused', label: 'Enfocado', emoji: '🎯', description: 'Alcanza nivel 3', xpRequired: 250, tasksRequired: 0 },
    { id: 'master', label: 'Maestro', emoji: '👑', description: 'Alcanza nivel 5', xpRequired: 900, tasksRequired: 0 },
    { id: 'night-owl', label: 'Búho Nocturno', emoji: '🦉', description: 'Completa 10 tareas', xpRequired: 0, tasksRequired: 10 },
    { id: 'streak-7', label: 'Racha de 7', emoji: '⚡', description: 'Completa 25 tareas', xpRequired: 0, tasksRequired: 25 },
    { id: 'legend', label: 'Leyenda', emoji: '🌟', description: 'Alcanza nivel 8', xpRequired: 4200, tasksRequired: 0 },
];

const XP_PER_TASK = 25;

function getLevelFromXP(xp) {
    let level = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) { level = i + 1; break; }
    }
    return Math.min(level, LEVEL_THRESHOLDS.length);
}

function getXPProgress(xp) {
    const level = getLevelFromXP(xp);
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const progress = nextThreshold === currentThreshold ? 100
        : Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
    return { progress, xpToNext: Math.max(0, nextThreshold - xp), isMaxLevel: level >= LEVEL_THRESHOLDS.length };
}

function computeEarnedBadges(xp, totalCompleted, currentBadges) {
    const earned = new Set(currentBadges);
    BADGES.forEach(badge => {
        if (badge.xpRequired > 0 && xp >= badge.xpRequired) earned.add(badge.id);
        if (badge.tasksRequired > 0 && totalCompleted >= badge.tasksRequired) earned.add(badge.id);
    });
    return [...earned];
}

export const GamificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ xp: 0, level: 1, badges: [] });
    const [loading, setLoading] = useState(true);
    const [xpToast, setXpToast] = useState(null); // { amount, isLevelUp, newLevel }
    const [totalCompleted, setTotalCompleted] = useState(0);

    const fetchStats = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (data) {
                setStats({ xp: data.xp, level: data.level, badges: data.badges || [] });
            } else {
                // Create initial stats row
                const { data: newRow } = await supabase
                    .from('user_stats')
                    .insert([{ user_id: user.id, xp: 0, level: 1, badges: [] }])
                    .select()
                    .single();
                if (newRow) setStats({ xp: 0, level: 1, badges: [] });
            }

            // Get total completed count for badge checks
            const { count } = await supabase
                .from('tasks')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('completed', true);
            setTotalCompleted(count ?? 0);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const awardXP = useCallback(async (amount = XP_PER_TASK) => {
        if (!user) return;
        setStats(prev => {
            const newXP = prev.xp + amount;
            const oldLevel = getLevelFromXP(prev.xp);
            const newLevel = getLevelFromXP(newXP);
            const isLevelUp = newLevel > oldLevel;
            const newBadges = computeEarnedBadges(newXP, totalCompleted + 1, prev.badges);

            setXpToast({ amount, isLevelUp, newLevel });

            // Persist to Supabase
            supabase.from('user_stats')
                .update({ xp: newXP, level: newLevel, badges: newBadges, updated_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .then(() => { });

            return { xp: newXP, level: newLevel, badges: newBadges };
        });
        setTotalCompleted(prev => prev + 1);
    }, [user, totalCompleted]);

    const dismissToast = useCallback(() => setXpToast(null), []);

    const xpProgressData = getXPProgress(stats.xp);
    const allBadges = BADGES.map(b => ({ ...b, earned: stats.badges.includes(b.id) }));

    const value = {
        xp: stats.xp,
        level: stats.level,
        badges: allBadges,
        earnedBadges: stats.badges,
        loading,
        xpToast,
        dismissToast,
        awardXP,
        xpProgress: xpProgressData.progress,
        xpToNext: xpProgressData.xpToNext,
        isMaxLevel: xpProgressData.isMaxLevel,
        levelThresholds: LEVEL_THRESHOLDS,
        XP_PER_TASK,
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};
