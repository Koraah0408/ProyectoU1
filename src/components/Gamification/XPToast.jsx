import { useEffect } from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function XPToast() {
    const { xpToast, dismissToast } = useGamification();

    useEffect(() => {
        if (!xpToast) return;
        const t = setTimeout(dismissToast, xpToast.isLevelUp ? 3000 : 2000);
        return () => clearTimeout(t);
    }, [xpToast, dismissToast]);

    if (!xpToast) return null;

    if (xpToast.isLevelUp) {
        return (
            <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                {/* Confetti dots */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'][i % 6],
                            left: `${15 + (i * 6.5)}%`,
                            top: `${10 + (i % 3) * 8}%`,
                            animation: `confetti-fall ${0.8 + (i * 0.1)}s ease-out forwards`,
                            animationDelay: `${i * 0.05}s`,
                        }}
                    />
                ))}
                <div className="animate-bounce-in bg-gradient-to-br from-primary-500 to-violet-600 rounded-3xl px-10 py-8 text-center shadow-2xl shadow-primary-500/40 animate-level-pulse">
                    <div className="text-5xl mb-2">🏆</div>
                    <p className="text-white/80 text-sm font-medium mb-1">¡Subiste de nivel!</p>
                    <p className="text-white text-3xl font-bold">Nivel {xpToast.newLevel}</p>
                    <p className="text-white/70 text-sm mt-2">+{xpToast.amount} XP ganados</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] pointer-events-none animate-xp-float">
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-violet-500 text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-primary-500/40 font-semibold text-sm">
                <Sparkles size={15} className="shrink-0" />
                +{xpToast.amount} XP
                <TrendingUp size={14} className="shrink-0" />
            </div>
        </div>
    );
}
