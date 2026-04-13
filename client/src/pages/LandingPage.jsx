import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Sparkles, 
    PenTool, 
    Users, 
    Star, 
    ArrowRight, 
    BookOpen, 
    TrendingUp, 
    ShieldCheck, 
    Heart, 
    Zap, 
    MessageCircle,
    Bookmark,
    Eye,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const [config, setConfig] = React.useState({ siteName: 'LullabyTales', heroSubtitle: 'Discover thousands of hand-crafted tales from a global community of authentic authors.' });
    
    React.useEffect(() => {
        fetch('http://localhost:5000/api/config').then(r=>r.json()).then(data => {
            if(data) setConfig(data);
        }).catch(()=>{});
    }, []);

    const BRAND = 'var(--brand-color, #D49E8D)';
    const BRAND_DK = '#C76A55'; // Darker variant

    const genres = [
        { name: 'Fantasy', icon: '✨', count: '12k+', color: 'bg-purple-50 text-purple-600' },
        { name: 'Mystery', icon: '🔍', count: '8k+', color: 'bg-indigo-50 text-indigo-600' },
        { name: 'Romance', icon: '💖', count: '15k+', color: 'bg-rose-50 text-rose-600' },
        { name: 'Sci-Fi', icon: '🚀', count: '5k+', color: 'bg-cyan-50 text-cyan-600' },
        { name: 'Horror', icon: '👻', count: '3k+', color: 'bg-orange-50 text-rose-600' },
        { name: 'Adventure', icon: '🏔️', count: '10k+', color: 'bg-emerald-50 text-emerald-600' },
    ];

    const trendingStories = [
        {
            title: "The Whispering Willows",
            author: "Luna Moonwell",
            reads: "45.2k",
            rating: "4.9",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            category: "Fantasy"
        },
        {
            title: "Echoes of Silence",
            author: "Silas Vane",
            reads: "12.8k",
            rating: "4.7",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            category: "Mystery"
        },
        {
            title: "Heart of the Nebula",
            author: "Astra Orion",
            reads: "31.5k",
            rating: "4.8",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            category: "Sci-Fi"
        },
        {
            title: "The Last Alchemist",
            author: "Julian Thorne",
            reads: "56k",
            rating: "5.0",
            image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80",
            category: "Historical"
        }
    ];

    return (
        <div className="relative min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
            
            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
                {/* Soft Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[600px] bg-gradient-to-b from-rose-100/40 to-transparent -z-10 rounded-[100%] blur-3xl"></div>
                <div className="absolute top-[15%] left-[15%] w-72 h-72 bg-rose-200/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-[20%] right-[15%] w-80 h-80 bg-rose-100/30 rounded-full blur-[100px] animate-pulse delay-500"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-6 py-2 rounded-full flex items-center gap-2 mb-10 cursor-default backdrop-blur-md"
                            style={{ backgroundColor: 'rgba(250, 246, 242, 0.4)', border: '1.5px solid #D49E8D', boxShadow: '0 2px 8px rgba(104, 59, 43, 0.08)' }}
                        >
                            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#D49E8D' }}></span>
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#D49E8D' }}>Spark your imagination • Online Now</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.85] mb-8 max-w-5xl"
                            style={{ color: '#683B2B' }}
                        >
                            Welcome to <br/>
                            <span className="italic relative" style={{ color: BRAND }}>
                                {config.siteName}.
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 600 20" fill="none">
                                    <path d="M5 15Q150 5 300 15T595 15" stroke={BRAND} strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl max-w-2xl font-medium leading-relaxed mb-12"
                            style={{ color: '#82574A' }}
                        >
                            {config.heroSubtitle}
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
                        >
                            <Link
                                to="/register"
                                className="h-16 md:h-20 px-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-xl"
                                style={{ backgroundColor: BRAND, color: '#FAF6F2', boxShadow: '0 8px 32px rgba(212, 158, 141, 0.22)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor=BRAND_DK}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor=BRAND}
                            >
                                Start Writing
                            </Link>
                            <Link
                                to="/feed"
                                className="h-16 md:h-20 px-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all"
                                style={{ backgroundColor: 'transparent', color: '#683B2B', border: '1.5px solid #683B2B' }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor='#683B2B'; e.currentTarget.style.color='#FAF6F2'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='#683B2B'; }}
                            >
                                <BookOpen className="w-5 h-5 mr-3" /> Explore Library
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- GENRE BAR --- */}
            <section className="py-7 sticky top-0 z-40 backdrop-blur-xl" style={{ backgroundColor: 'rgba(250, 246, 242, 0.6)', borderTop: '1px solid rgba(104,59,43,0.1)', borderBottom: '1px solid rgba(104,59,43,0.1)' }}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
                        <div
                            className="flex-shrink-0 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest cursor-pointer shadow-md"
                            style={{ backgroundColor: '#D49E8D', color: '#FAF6F2' }}
                        >
                            Featured
                        </div>
                        {genres.map((genre) => (
                            <div
                                key={genre.name}
                                className="flex-shrink-0 h-12 px-6 rounded-xl flex items-center gap-3 font-black text-xs uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform"
                                style={{ backgroundColor: 'rgba(250,246,242,0.6)', color: '#683B2B', border: '1.5px solid #D49E8D' }}
                            >
                                <span>{genre.icon}</span>
                                {genre.name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SHELVES --- */}
            <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
                
                {/* SHELF 1 */}
                <section>
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-rose-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Popular Choice</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-black" style={{ color: '#683B2B' }}>Trending Now</h2>
                        </div>
                        <Link to="/feed" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 -mx-4 px-4">
                        {trendingStories.map((story, i) => (
                            <motion.div key={i} style={{ perspective: 1000 }} className="flex-shrink-0 w-72 group cursor-pointer z-10">
                                <motion.div
                                    whileHover={{ y: -15, rotateX: 10, rotateY: -10, scale: 1.05, boxShadow: '0 30px 60px rgba(104, 59, 43, 0.3)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl shadow-slate-200 border border-slate-100 bg-ivory transform-gpu"
                                >
                                    <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-5 left-5 bg-ivory/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white">
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                            <span className="text-[10px] font-black">{story.rating}</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </motion.div>
                                <h3 className="text-xl font-display font-bold mb-2 truncate transition-colors" style={{ color: '#683B2B' }}>{story.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium" style={{ color: '#D49E8D' }}>By {story.author}</span>
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400">
                                        <Eye className="w-3.5 h-3.5" /> {story.reads}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- STATS --- */}
                <section className="rounded-[4rem] p-12 md:p-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAF6F2, #DED1BD)', border: '1.5px solid rgba(104,59,43,0.1)', boxShadow: '0 16px 64px rgba(104, 59, 43, 0.08)' }}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/50 blur-[120px] rounded-full"></div>
                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { val: '250k', label: 'Stories' },
                            { val: '1.2m', label: 'Readers' },
                            { val: '4.9/5', label: 'Rating' },
                            { val: '150+', label: 'Countries' }
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-5xl md:text-7xl font-display font-black italic tracking-tighter mb-2" style={{ color: '#683B2B' }}>{s.val}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#D49E8D' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- FEATURES --- */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[
                        { icon: <Zap className="w-7 h-7" />, title: 'Smart Editor', desc: 'Intelligent writing tools to help you perfect every plot twist and character arc.', iconBg: 'rgba(250,246,242,0.8)', iconColor: '#D49E8D' },
                        { icon: <ShieldCheck className="w-7 h-7" />, title: 'Identity Lock', desc: 'Advanced protection for your creative works and author identity.', iconBg: 'rgba(250,246,242,0.8)', iconColor: '#683B2B' },
                        { icon: <Heart className="w-7 h-7" />, title: 'Heartfelt Feedback', desc: 'Join a community that celebrates every word with meaningful interaction.', iconBg: 'rgba(250,246,242,0.8)', iconColor: '#D49E8D' },
                    ].map((feat, i) => (
                        <div key={i} style={{ perspective: 1000 }} className="h-full">
                            <motion.div 
                                whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                className="p-12 rounded-[3rem] transition-shadow hover:shadow-xl backdrop-blur-md h-full transform-gpu" style={{ backgroundColor: 'rgba(250,246,242,0.6)', border: '1.5px solid #D49E8D', boxShadow: '0 2px 12px rgba(104,59,43,0.06)' }}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border" style={{ backgroundColor: feat.iconBg, color: feat.iconColor, borderColor: '#DED1BD' }}>{feat.icon}</div>
                                <h3 className="text-2xl font-display font-bold mb-4" style={{ color: '#683B2B' }}>{feat.title}</h3>
                                <p className="font-medium leading-relaxed" style={{ color: '#82574A' }}>{feat.desc}</p>
                            </motion.div>
                        </div>
                    ))}
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="py-32 px-4 mb-20">
                <div className="max-w-6xl mx-auto rounded-[4rem] p-16 md:py-32 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #683B2B 0%, #4A2A1E 100%)', boxShadow: '0 24px 80px rgba(104, 59, 43, 0.20)' }}>
                    <div className="absolute top-0 right-0 w-full h-full" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.12), transparent)' }}></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl sm:text-5xl md:text-8xl font-display font-black text-white mb-10 leading-none">Ready to Begin <br/>Your Legend?</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to="/register"
                                className="h-16 md:h-20 px-12 rounded-2xl font-black text-xl hover:scale-105 transition-transform w-full sm:w-auto flex items-center justify-center shadow-xl"
                                style={{ backgroundColor: '#D49E8D', color: '#FAF6F2' }}
                            >Join the Tribe</Link>
                            <Link
                                to="/feed"
                                className="h-16 md:h-20 px-12 rounded-2xl font-black text-xl transition-colors w-full sm:w-auto flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.30)' }}
                            >Read First</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
