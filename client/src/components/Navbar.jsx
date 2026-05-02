import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, PlusCircle, BookOpen, Menu, X, ArrowLeft, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_BG = 'transparent';
const NAV_BG_DARK = 'rgba(250, 246, 242, 0.2)'; // Very subtle frosted look on scroll
const NAV_BRAND = '#D49E8D';
const NAV_BRAND_DK = '#C76A55';
const NAV_TEXT_H = '#381611';
const NAV_TEXT_B = '#5A453B';

const Navbar = () => {
    const { user, logout, notifications } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
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

                {/* Logo Area */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-4 group">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            animate={{
                                y: [0, -4, 0],
                                rotate: [0, 2, -2, 0]
                            }}
                            transition={{
                                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="w-12 h-12 rounded-[0.6rem] flex items-center justify-center shadow-md cursor-pointer"
                            style={{ backgroundColor: '#D49E8D' }}
                        >
                            <BookOpen className="w-6 h-6" style={{ color: '#FAF6F2' }} />
                        </motion.div>
                        <motion.span
                            whileHover={{ x: 3 }}
                            className="text-2xl font-display font-black tracking-tight"
                            style={{ color: NAV_TEXT_H }}
                        >
                            Lullaby<span className="font-normal" style={{ color: NAV_TEXT_H }}>Tales</span>
                        </motion.span>
                    </Link>
                </div>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        <Link to="/feed" className="text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#D49E8D]" style={{ color: NAV_TEXT_H }}>Library</Link>
                        <Link to="/#community" className="text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#D49E8D]" style={{ color: NAV_TEXT_H }}>Community</Link>
                        <Link to="/about" className="text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#D49E8D]" style={{ color: NAV_TEXT_H }}>About</Link>
                    </div>

                    <div className="flex items-center gap-5">
                        {user ? (
                            <>
                                <Link to="/create-story"
                                    className="flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                                    style={{ backgroundColor: '#C76A55', color: '#FAF6F2' }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#A95846'; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C76A55'; }}
                                >
                                    <PlusCircle className="w-4 h-4" /> New Tale
                                </Link>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-1 hover:text-[#D49E8D] transition-colors"
                                        style={{ color: NAV_TEXT_H }}
                                    >
                                        <Bell className="w-5 h-5" />
                                        {notifications?.length > 0 && (
                                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FAF6F2]"></span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-[#DED1BD]/50 overflow-hidden z-50"
                                            >
                                                <div className="p-4 border-b border-[#DED1BD]/30 bg-[#FAF6F2]/50 flex justify-between items-center">
                                                    <span className="font-display font-bold text-[#683B2B]">Notifications</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D49E8D]">{notifications?.length || 0} New</span>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications?.length > 0 ? (
                                                        notifications.map((n, i) => (
                                                            <div key={i} className="p-4 border-b border-[#DED1BD]/20 hover:bg-[#FAF6F2] transition-colors cursor-pointer group">
                                                                <div className="flex gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-[#DED1BD]/30 flex-shrink-0 flex items-center justify-center">
                                                                        <Bell className="w-4 h-4 text-[#683B2B]" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm text-[#683B2B] leading-tight">
                                                                            <span className="font-bold">{n.from || 'Someone'}</span> {n.message || 'interacted with your story'}
                                                                        </p>
                                                                        <span className="text-[10px] text-[#82574A] opacity-60 mt-1 block uppercase font-bold tracking-tighter">Just now</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 text-center">
                                                            <div className="w-16 h-16 rounded-full bg-[#FAF6F2] flex items-center justify-center mx-auto mb-4">
                                                                <Bell className="w-8 h-8 text-[#DED1BD]" />
                                                            </div>
                                                            <p className="text-[#82574A] font-medium">No new notifications</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {notifications?.length > 0 && (
                                                    <Link to="/notifications" onClick={() => setShowNotifications(false)} className="block p-3 text-center text-[10px] font-black uppercase tracking-[0.2em] bg-[#FAF6F2] text-[#D49E8D] hover:text-[#C76A55] transition-colors border-t border-[#DED1BD]/30">
                                                        View All Activity
                                                    </Link>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-[#DED1BD] hover:border-[#D49E8D] transition-all flex items-center justify-center bg-[#D49E8D]">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
                                    ) : (
                                        <span className="text-white font-black text-xs">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
                                    )}
                                </Link>

                                <button 
                                    onClick={handleLogout}
                                    className="p-2 text-[#82574A] hover:text-[#C76A55] transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#D49E8D]" style={{ color: NAV_TEXT_H }}>Sign In</Link>
                                <Link to="/register"
                                    className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md"
                                    style={{ backgroundColor: '#D49E8D', color: '#FAF6F2' }}
                                >
                                    Join Community
                                </Link>
                            </>
                        )}
                    </div>
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
                                    <Link to="/create-story" className="text-xl font-display font-black" style={{ color: NAV_BRAND }} onClick={() => setMobileMenuOpen(false)}>New Tale</Link>
                                    <button onClick={handleLogout} className="text-xl font-display font-black text-left" style={{ color: NAV_BRAND }}>Sign Out</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-xl font-display font-black" style={{ color: NAV_TEXT_H }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <Link to="/about" className="text-xl font-display font-black" style={{ color: NAV_TEXT_H }} onClick={() => setMobileMenuOpen(false)}>About</Link>
                                    <Link to="/#community" className="text-xl font-display font-black" style={{ color: NAV_TEXT_H }} onClick={() => setMobileMenuOpen(false)}>Why Lullaby?</Link>
                                    <Link to="/register" className="p-5 rounded-2xl text-center font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: NAV_BRAND, color: '#FAF6F2' }} onClick={() => setMobileMenuOpen(false)}>Join Community</Link>
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
