import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, PlusCircle, BookOpen, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_BG       = 'rgba(250, 246, 242, 0.95)'; // opaque initially
const NAV_BG_DARK  = 'rgba(250, 246, 242, 0.4)'; // transparent on scroll
const NAV_BRAND    = '#D49E8D'; // Light Rose
const NAV_BRAND_DK = '#C76A55'; // Darker Rose
const NAV_TEXT_H   = '#683B2B'; // Dark brown
const NAV_TEXT_B   = '#82574A'; // Medium brown

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled]       = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handle = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handle);
        return () => window.removeEventListener('scroll', handle);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-400 backdrop-blur-xl"
            style={{
                backgroundColor: scrolled ? NAV_BG_DARK : NAV_BG,
                boxShadow: scrolled
                    ? '0 4px 24px rgba(104, 59, 43, 0.1)'
                    : 'none',
                borderBottom: scrolled ? '1px solid rgba(212, 158, 141, 0.3)' : '1px solid transparent',
            }}
        >
            <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">

                {/* Logo & Back */}
                <div className="flex items-center gap-4">
                    {location.pathname !== '/' && (
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/50 group"
                            style={{ color: NAV_TEXT_H }}
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    )}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-md"
                             style={{ backgroundColor: scrolled ? NAV_BRAND : NAV_BRAND }}>
                            <BookOpen className="w-5 h-5" style={{ color: '#FAF6F2' }} />
                        </div>
                        <span className="text-2xl font-display font-black tracking-tighter" style={{ color: NAV_TEXT_H }}>
                            Lullaby<span style={{ color: NAV_BRAND }}>Tales</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/feed"
                        className="text-[11px] font-black uppercase tracking-widest transition-colors"
                        style={{ color: NAV_TEXT_B }}
                        onMouseEnter={e => e.currentTarget.style.color = NAV_BRAND}
                        onMouseLeave={e => e.currentTarget.style.color = NAV_TEXT_B}
                    >Library</Link>

                    {user ? (
                        <div className="flex items-center gap-6">
                            <Link to="/dashboard"
                                className="text-[11px] font-black uppercase tracking-widest transition-colors"
                                style={{ color: NAV_TEXT_B }}
                                onMouseEnter={e => e.currentTarget.style.color = NAV_BRAND}
                                onMouseLeave={e => e.currentTarget.style.color = NAV_TEXT_B}
                            >Studio</Link>

                            <Link to="/create-story"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
                                style={{ backgroundColor: NAV_BRAND, color: '#FAF6F2' }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = NAV_BRAND_DK; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = NAV_BRAND; }}
                            >
                                <PlusCircle className="w-4 h-4" /> New Tale
                            </Link>

                            <div className="flex items-center gap-3 pl-5" style={{ borderLeft: `1px solid rgba(104, 59, 43, 0.2)` }}>
                                <Link to="/profile" className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-transform overflow-hidden shadow-sm" style={{ backgroundColor: '#DED1BD' }}>
                                    {user.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                    ) : (
                                        <User className="w-4 h-4" style={{ color: NAV_TEXT_H }} />
                                    )}
                                </Link>
                                <div className="flex flex-col">
                                    <Link to="/profile" className="text-xs font-black hover:underline" style={{ color: NAV_TEXT_H }}>{user.name}</Link>
                                    <span className="text-[10px] font-bold" style={{ color: NAV_TEXT_B }}>Verified Author</span>
                                </div>
                                <button onClick={handleLogout} className="p-1 ml-1 transition-colors"
                                    style={{ color: NAV_TEXT_B }}
                                    onMouseEnter={e => e.currentTarget.style.color = NAV_BRAND}
                                    onMouseLeave={e => e.currentTarget.style.color = NAV_TEXT_B}
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login"
                                className="text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all"
                                style={{ color: NAV_TEXT_H }}
                                onMouseEnter={e => { e.currentTarget.style.color = NAV_BRAND; e.currentTarget.style.backgroundColor = 'rgba(104, 59, 43, 0.05)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = NAV_TEXT_H; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >Sign In</Link>
                            <Link to="/register"
                                className="px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
                                style={{ backgroundColor: NAV_BRAND, color: '#FAF6F2' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = NAV_BRAND_DK}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = NAV_BRAND}
                            >Join Community</Link>
                        </div>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: '#DED1BD', color: NAV_TEXT_H }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="md:hidden absolute top-full left-0 right-0 p-8 z-40 border-t"
                        style={{ backgroundColor: '#FAF6F2', borderColor: 'rgba(104, 59, 43, 0.1)' }}
                    >
                        <div className="flex flex-col gap-6">
                            <Link to="/feed" className="text-xl font-display font-black" style={{ color: NAV_TEXT_H }} onClick={() => setMobileMenuOpen(false)}>Library</Link>
                            {user ? (
                                <>
                                    <Link to="/profile" className="text-xl font-display font-black" style={{ color: NAV_TEXT_H }} onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                                    <Link to="/dashboard" className="text-xl font-display font-black" style={{ color: NAV_TEXT_H }} onClick={() => setMobileMenuOpen(false)}>Studio</Link>
                                    <Link to="/create-story" className="text-xl font-display font-black" style={{ color: NAV_BRAND }} onClick={() => setMobileMenuOpen(false)}>New Tale</Link>
                                    <button onClick={handleLogout} className="text-xl font-display font-black text-left" style={{ color: NAV_BRAND }}>Sign Out</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-xl font-display font-black" style={{ color: NAV_TEXT_H }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <Link to="/register" className="p-5 rounded-2xl text-center font-black uppercase tracking-widest" style={{ backgroundColor: NAV_BRAND, color: '#FAF6F2' }} onClick={() => setMobileMenuOpen(false)}>Join Community</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
