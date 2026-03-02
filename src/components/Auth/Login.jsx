import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-dark-bg p-4">
            <div className="w-full max-w-md bg-white dark:bg-dark-motive rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-500 rounded-full flex items-center justify-center mb-4">
                        <LogIn size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30 disabled:opacity-70 flex justify-center items-center"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
