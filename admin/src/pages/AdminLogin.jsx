import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminLogin = ({ setAuth }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="w-full max-w-md p-8 bg-slate-800 rounded-3xl shadow-2xl border border-slate-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Master Admin Portal</h1>
                    <p className="text-slate-400 text-sm">StoryVerse secure management terminal</p>
                </div>

                {error && <div className="bg-rose-900/50 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Admin Username</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Master Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-xl transition-colors mt-4">
                        Authenticate Access
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
