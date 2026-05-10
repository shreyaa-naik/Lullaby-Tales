import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';

const AdminLogin = ({ setAuth }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Exact requirement: "the admin had the deafut passowrd and userbame no one can login thta"
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminAuth', 'true');
            localStorage.setItem('adminUser', username);
            setAuth(true);
            navigate('/dashboard');
        } else {
            setError('Invalid master admin credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF5EC] dark:bg-slate-950 transition-colors duration-300">
            <div className="absolute top-8 right-8">
                <button 
                    onClick={toggleTheme} 
                    className="p-3 bg-[#FFF9F3] dark:bg-slate-800 rounded-2xl shadow-lg border border-orange-100 dark:border-slate-700 hover:bg-[#FFF5EC] dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300"
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
            <div className="w-full max-w-md p-10 bg-[#FFF9F3] dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-orange-100 dark:border-slate-700">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-orange-50 dark:bg-slate-700 rounded-3xl flex items-center justify-center mb-6 transform rotate-3">
                        <Shield className="w-10 h-10 text-orange-500 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Master Admin</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Lullaby Tales Secure Terminal</p>
                </div>

                {error && <div className="bg-rose-900/50 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-1">Admin Username</label>
                        <input 
                            type="text" 
                            className="w-full px-5 py-4 bg-[#FFF5EC] dark:bg-slate-900 border border-orange-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-1">Master Password</label>
                        <input 
                            type="password" 
                            className="w-full px-5 py-4 bg-[#FFF5EC] dark:bg-slate-900 border border-orange-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white dark:text-slate-900 font-black rounded-2xl transition-all mt-4 shadow-lg shadow-orange-500/20 active:scale-[0.98]">
                        Authenticate Access
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
