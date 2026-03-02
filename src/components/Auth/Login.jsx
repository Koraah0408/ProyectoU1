import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckSquare, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error: err } = await signIn(email, password);
        setLoading(false);
        if (err) {
            setError(err.message === 'Invalid login credentials'
                ? 'Correo o contraseña incorrectos.'
                : err.message);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex items-center justify-center p-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm animate-scale-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30">
                        <CheckSquare size={26} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">TaskFlow Pro</h1>
                    <p className="text-slate-400 text-sm mt-1">Inicia sesión para continuar</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Correo electrónico</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email" required autoFocus
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="tu@correo.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Contraseña</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPass ? 'text' : 'password'} required
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                            {loading ? 'Iniciando...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400 mt-5">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Regístrate gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
