import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const BRAND    = '#D49E8D';
const BRAND_DK = '#C76A55';
const TEXT_H   = '#683B2B';
const TEXT_B   = '#82574A';
const BORDER   = 'rgba(104,59,43,0.1)';
const ICON_C   = '#D49E8D';
const WHITE_OP = 'rgba(250, 246, 242, 0.85)';

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
            toast.error('Server connection error');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center py-20 px-4"
        >
            <div className="max-w-xl w-full">

                {/* Header */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-10"
                >
                    <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                        <motion.div 
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            className="p-2.5 rounded-xl shadow-md" style={{ backgroundColor: BRAND }}
                        >
                            <BookOpen className="w-5 h-5 text-[#FAF6F2]" />
                        </motion.div>
                        <span className="text-2xl font-display font-black tracking-tight" style={{ color: TEXT_H }}>
                            Lullaby<span style={{ color: BRAND }}>Tales</span>
                        </span>
                    </Link>
                    <h2 className="text-4xl font-display font-black" style={{ color: TEXT_H }}>
                        Sign in to your account
                    </h2>
                    <p className="mt-3 font-medium opacity-80" style={{ color: TEXT_B }}>
                        Welcome back! Please enter your details.
                    </p>
                </motion.div>

                {/* Card */}
                <motion.form 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                    onSubmit={handleSubmit} 
                    className="p-10 md:p-12 rounded-[3.5rem] space-y-6 backdrop-blur-xl relative overflow-hidden"
                    style={{ backgroundColor: WHITE_OP, border: `1.5px solid ${BORDER}`, boxShadow: '0 20px 60px rgba(104,59,43,0.12)' }}
                >
                    {/* Decorative element */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D49E8D]/10 rounded-full blur-3xl pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <label className="block text-sm font-bold mb-2 ml-1" style={{ color: TEXT_H }}>Email address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 group-focus-within:text-[#C76A55]" style={{ color: ICON_C }} />
                            <input type="email" required className="input-field pl-12"
                                   placeholder="name@example.com"
                                   value={formData.email}
                                   onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="block text-sm font-bold mb-2 ml-1" style={{ color: TEXT_H }}>Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 group-focus-within:text-[#C76A55]" style={{ color: ICON_C }} />
                            <input type="password" required className="input-field pl-12"
                                   placeholder="••••••••"
                                   value={formData.password}
                                   onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                    </motion.div>

                    <motion.button 
                        whileHover={{ scale: 1.02, backgroundColor: BRAND_DK }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-6 rounded-3xl flex items-center justify-center gap-4 font-black text-xl text-[#FAF6F2] transition-all duration-300 group mt-4 shadow-xl"
                        style={{ backgroundColor: BRAND, boxShadow: '0 10px 30px rgba(212,158,141,0.3)' }}
                    >
                        Sign In
                        <motion.span
                            animate={{ x: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <ArrowRight className="w-7 h-7" />
                        </motion.span>
                    </motion.button>
                </motion.form>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-10 font-medium" style={{ color: TEXT_B }}
                >
                    Don't have an account?{' '}
                    <Link to="/register" className="font-black hover:underline transition-all" style={{ color: BRAND }}>
                        Create an account
                    </Link>
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Login;
