import { useGamification } from '../../contexts/GamificationContext';
import { Lock } from 'lucide-react';

export default function BadgeGallery() {
    const { badges } = useGamification();

    return (
        <div className="bg-white dark:bg-dark-motive rounded-2xl p-6 border border-slate-100 dark:border-dark-border">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">🏅 Logros</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {badges.map(badge => (
                    <div
                        key={badge.id}
                        title={badge.earned ? badge.description : `Bloqueado: ${badge.description}`}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 cursor-default
              ${badge.earned
                                ? 'bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-500/10 dark:to-violet-500/10 border-primary-100 dark:border-primary-500/20'
                                : 'bg-slate-50 dark:bg-dark-elevated border-slate-100 dark:border-dark-border opacity-50 grayscale'
                            }`}
                    >
                        <span className="text-2xl">{badge.earned ? badge.emoji : '🔒'}</span>
                        <div className="text-center">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{badge.label}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{badge.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
