import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Colour tokens ──────────────────────────── */
const BG       = 'transparent';
const BRAND    = '#D49E8D';
const BRAND_DK = '#C76A55';
const TEXT_H   = '#683B2B';
const TEXT_B   = '#82574A';
const BORDER   = 'rgba(104,59,43,0.1)';
const ICON_C   = '#D49E8D';
const WHITE_OP = 'rgba(250, 246, 242, 0.85)';

import API_BASE_URL from '../config';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success('Welcome back!');
                login(data.user, data.token);
                navigate('/feed');
            } else {
                toast.error(data.msg || 'Login failed');
            }
        } catch (err) {
            toast.error('Server connection error. Is backend running?');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: BG }}>
            <div className="max-w-md w-full">

                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div className="p-2.5 rounded-xl shadow-md" style={{ backgroundColor: BRAND }}>
                            <BookOpen className="w-5 h-5 text-[#FAF6F2]" />
                        </div>
                        <span className="text-xl font-display font-black tracking-tight" style={{ color: TEXT_H }}>
                            Lullaby<span style={{ color: BRAND }}>Tales</span>
                        </span>
                    </Link>
                    <h2 className="text-3xl font-display font-black" style={{ color: TEXT_H }}>
                        Sign in to your account
                    </h2>
                    <p className="mt-2 font-medium" style={{ color: TEXT_B }}>
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {/* Card */}
                <form onSubmit={handleSubmit} className="p-8 rounded-3xl space-y-6 backdrop-blur-md"
                      style={{ backgroundColor: WHITE_OP, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 40px rgba(104,59,43,0.09)' }}>

                    <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: TEXT_H }}>Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: ICON_C }} />
                            <input type="email" required className="input-field pl-12 bg-white/50"
                                   placeholder="name@example.com"
                                   value={formData.email}
                                   onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: TEXT_H }}>Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: ICON_C }} />
                            <input type="password" required className="input-field pl-12 bg-white/50"
                                   placeholder="••••••••"
                                   value={formData.password}
                                   onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                    </div>

                    <button type="submit"
                        className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-base text-[#FAF6F2] transition-all duration-200 group"
                        style={{ backgroundColor: BRAND, boxShadow: '0 4px 20px rgba(212,158,141,0.22)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = BRAND_DK}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = BRAND}
                    >
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="text-center mt-8 font-medium" style={{ color: TEXT_B }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-black hover:underline" style={{ color: BRAND }}>
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
