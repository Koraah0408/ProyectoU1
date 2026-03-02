import { useState } from 'react';
import { X, Copy, Check, Link2 } from 'lucide-react';

export default function ShareModal({ task, onClose }) {
    const [copied, setCopied] = useState(false);
    const shareUrl = `${window.location.origin}/shared/${task.share_id}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const el = document.createElement('textarea');
            el.value = shareUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="modal-backdrop animate-fade-in" onClick={onClose}>
            <div
                className="bg-white dark:bg-dark-motive rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-dark-border animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-2">
                        <Link2 size={18} className="text-primary-500" />
                        <h2 className="text-base font-semibold text-slate-800 dark:text-white">Compartir tarea</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-400 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Cualquier persona con este enlace podrá ver esta lista de tareas en modo de solo lectura.
                    </p>

                    <div className="flex gap-2">
                        <div className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-600 dark:text-slate-300 truncate font-mono">
                            {shareUrl}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${copied
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30'
                                }`}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? '¡Copiado!' : 'Copiar'}
                        </button>
                    </div>

                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        💡 El ID de compartir es único por tarea y no expira automáticamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
