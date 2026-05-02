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
import API_BASE_URL from '../config';

const LandingPage = () => {
    const [config, setConfig] = React.useState({ siteName: 'LullabyTales', heroSubtitle: 'Discover thousands of hand-crafted tales from a global community of authentic authors.' });
    
    const [trendingStories, setTrendingStories] = React.useState([]);
    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/config`).then(r=>r.json()).then(data => {
            if(data) setConfig(data);
        }).catch(()=>{});

        fetch(`${API_BASE_URL}/api/stories/trending`)
            .then(res => res.json())
            .then(data => {
                if(Array.isArray(data)) setTrendingStories(data);
            }).catch(()=>{});

        // Handle Anchor Scrolling (e.g. #community)
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 500); // Small delay to ensure content is rendered
        }
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

    return (
        <div className="relative min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
            
            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
                {/* Animated AR-like Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[600px] bg-gradient-to-b from-rose-100/40 to-transparent -z-10 rounded-[100%] blur-3xl"></div>
                {/* --- THEMATIC FLOATING ICONS (Story Elements) --- */}
                <motion.div 
                    animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] left-[10%] opacity-20 text-[#D49E8D] z-0"
                >
                    <BookOpen className="w-24 h-24 md:w-32 md:h-32" />
                </motion.div>
                <motion.div 
                    animate={{ y: [0, 40, 0], x: [0, -20, 0], rotate: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[25%] right-[15%] opacity-10 text-[#683B2B] z-0"
                >
                    <PenTool className="w-32 h-32 md:w-48 md:h-48" />
                </motion.div>
                <motion.div 
                    animate={{ y: [0, -50, 0], rotate: [0, 45, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-20 left-[20%] opacity-20 text-amber-500 z-0"
                >
                    <Sparkles className="w-16 h-16 md:w-24 md:h-24" />
                </motion.div>

                {/* --- LITERARY MARQUEE --- */}
                <div className="absolute top-[35%] left-0 w-[200vw] overflow-hidden -z-10 opacity-10 pointer-events-none select-none">
                    <motion.div 
                        animate={{ x: [0, -1500] }}
                        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap text-[12rem] md:text-[15rem] font-display font-black tracking-tighter" style={{ color: '#683B2B' }}
                    >
                        "Once upon a time..." • "In a galaxy far away..." • "It was a dark and stormy night..." • "Call me Ishmael..." •
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* --- LEFT COLUMN: TEXT --- */}
                        <div className="flex-1 text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex px-4 py-1.5 rounded-full items-center gap-2 mb-8 bg-[#EEDBC9]"
                            >
                                <Sparkles className="w-3.5 h-3.5" style={{ color: '#C26A5A' }} strokeWidth={2} />
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4D2C22' }}>Spark your imagination</span>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-4xl sm:text-6xl md:text-8xl font-black leading-[1.1] md:leading-[0.9] mb-6"
                                style={{ color: '#381611', fontFamily: '"Playfair Display", serif' }}
                            >
                                Every Tale <br/>
                                <span className="italic relative inline-block" style={{ color: '#CB6C5B' }}>
                                    Lives Here.
                                    <svg className="absolute -bottom-3 left-0 w-[100%] text-[#CB6C5B]" viewBox="0 0 300 20" fill="none">
                                        <path d="M5 10 Q150 20 295 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                    <Heart className="absolute -bottom-6 -right-5 w-6 h-6 text-[#CB6C5B]" strokeWidth={2.5} />
                                </span>
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg sm:text-xl mb-10 max-w-sm leading-relaxed"
                                style={{ color: '#5A453B', fontWeight: 500 }}
                            >
                                {config.heroSubtitle}
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Link
                                    to="/register"
                                    className="px-8 py-3.5 rounded-xl font-bold text-base transition-all flex items-center gap-2 shadow-sm"
                                    style={{ backgroundColor: '#B9745E', color: '#FAF6F2' }}
                                >
                                    <PenTool className="w-5 h-5" /> Start Writing
                                </Link>
                                <Link
                                    to="/feed"
                                    className="px-8 py-3.5 rounded-xl font-bold text-base transition-all flex items-center gap-2"
                                    style={{ backgroundColor: 'transparent', color: '#381611', border: '1.5px solid #DABBA7' }}
                                >
                                    <BookOpen className="w-5 h-5" /> Explore Library
                                </Link>
                            </motion.div>


                        </div>

                        {/* --- RIGHT COLUMN: COLLAGE IMAGE --- */}
                        <div className="flex-1 relative w-full mt-12 lg:mt-0 flex justify-center lg:justify-end">
                            <motion.img 
                                src="/hero_collage.svg" 
                                alt="Story Collage" 
                                className="w-full max-w-[1050px] h-auto object-contain scale-110 lg:scale-125"
                                style={{ transformOrigin: 'center center' }}
                            />
                        </div>

                    </div>
                </div>
            </section>



            {/* --- POPULAR STORIES --- */}
            <div className="w-full" style={{ backgroundColor: 'rgba(244, 233, 220, 0.6)' }}>
                <div className="max-w-7xl mx-auto px-4 py-20">
                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-[#D49E8D]/30 pb-4">
                        <h2 className="text-4xl font-display font-bold flex items-center gap-2" style={{ color: '#683B2B' }}>
                            Popular Stories <Sparkles className="w-6 h-6 text-[#D49E8D] opacity-70" strokeWidth={1.5} />
                        </h2>
                        <Link to="/feed" className="group flex items-center gap-2 text-base font-bold text-[#82574A] hover:text-[#683B2B] transition-colors">
                            View all stories <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingStories.length > 0 ? trendingStories.slice(0, 4).map((story, i) => (
                            <motion.div key={i} whileHover={{ y: -5 }} className="group cursor-pointer">
                                <Link to={`/story/${story._id}`} className="block h-full bg-[#FAF6F2] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-[#DED1BD]">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img src={story.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'} alt={story.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-3 left-3 bg-[#D49E8D]/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                                            {genres[i % genres.length]?.name || 'Story'}
                                        </div>
                                        <div className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors">
                                            <Bookmark className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col justify-between h-[230px]">
                                        <div>
                                            <h3 className="text-xl font-display font-bold mb-2 truncate" style={{ color: '#683B2B' }}>{story.title}</h3>
                                            <p className="text-base line-clamp-3 leading-relaxed" style={{ color: '#82574A' }}>
                                                {story.content ? story.content.replace(/<[^>]+>/g, '') : 'No description available for this story.'}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#DED1BD]/50">
                                            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#683B2B' }}>
                                                <div className="w-6 h-6 rounded-full bg-[#D49E8D] text-white flex items-center justify-center text-[11px] overflow-hidden">
                                                    {story.author?.avatar ? (
                                                        <img src={story.author.avatar} alt={story.author.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        (story.author?.name || 'U').charAt(0)
                                                    )}
                                                </div>
                                                {story.author?.name || 'Unknown'}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm font-medium" style={{ color: '#82574A' }}>
                                                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {story.likesCount || story.likes?.length || 0}</span>
                                                <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {story.commentsCount || story.comments?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )) : (
                            [1,2,3,4].map(i => (
                                <div key={i} className="bg-[#FAF6F2] rounded-xl overflow-hidden border border-[#DED1BD] h-[400px] animate-pulse">
                                    <div className="h-[230px] bg-[#E8DCCB]"></div>
                                    <div className="p-5">
                                        <div className="h-5 bg-[#E8DCCB] rounded w-3/4 mb-3"></div>
                                        <div className="h-3 bg-[#E8DCCB] rounded w-full mb-2"></div>
                                        <div className="h-3 bg-[#E8DCCB] rounded w-5/6"></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
                </div>
            </div>

            {/* --- WHY LULLABY TALES? (COMMUNITY) --- */}
            <div id="community" className="w-full relative" style={{ backgroundColor: 'rgba(244, 233, 220, 0.4)' }}>
                    {/* Floating Interactive Elements */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute pointer-events-none opacity-20"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 5 + i,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                color: '#D49E8D'
                            }}
                        >
                            {i % 2 === 0 ? <Sparkles className="w-6 h-6" /> : <Heart className="w-4 h-4" />}
                        </motion.div>
                    ))}

                    <section className="py-12 text-center relative overflow-hidden">
                        {/* Decorative Scrapbook Elements */}
                        <div className="absolute top-0 left-10 w-24 h-10 bg-amber-100/40 -rotate-12 border border-amber-200/30 backdrop-blur-sm -z-10 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Handmade</div>
                        <div className="absolute bottom-10 right-20 w-16 h-16 rounded-full border-2 border-dashed border-[#D49E8D]/30 -z-10 animate-spin"></div>

                        <div className="flex flex-col items-center justify-center gap-4 mb-10 px-4">
                            <div className="flex items-center justify-center gap-6">
                                <motion.img 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 0.6, x: 0 }}
                                    src="/floral_divider.svg" alt="Floral Divider Left" className="hidden lg:block w-32 h-auto" style={{ transform: 'scaleX(-1)' }} />
                                <h2 className="text-5xl md:text-6xl font-display font-bold text-[#683B2B] tracking-tight relative">
                                    Why Lullaby Tales?
                                    <motion.div 
                                        className="absolute -bottom-2 left-0 h-1 bg-[#D49E8D]/30 rounded-full"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </h2>
                                <motion.img 
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 0.6, x: 0 }}
                                    src="/floral_divider.svg" alt="Floral Divider Right" className="hidden lg:block w-32 h-auto" />
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between px-8 relative gap-8 md:gap-4">
                            {[
                                { icon: <BookOpen className="w-8 h-8" strokeWidth={1} />, title: 'Endless Stories', desc: 'Explore a vast library of stories across every genre.' },
                                { icon: <PenTool className="w-8 h-8" strokeWidth={1} />, title: 'Write & Share', desc: 'Bring your imagination to life and share your tales.' },
                                { icon: <Users className="w-8 h-8" strokeWidth={1} />, title: 'Global Community', desc: 'Connect with passionate readers and writers globally.' },
                                { icon: <Heart className="w-8 h-8" strokeWidth={1} />, title: 'Made with Love', desc: 'Every story here is crafted with artistic creativity.' },
                            ].map((feat, i) => (
                                <React.Fragment key={i}>
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                        whileHover={{ y: -8 }}
                                        className="flex flex-col items-center bg-transparent z-10 flex-1 px-4 text-center group cursor-default"
                                    >
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/40 backdrop-blur-md border border-[#D49E8D]/40 transition-all duration-500 group-hover:bg-[#683B2B] group-hover:text-white group-hover:shadow-2xl" style={{ color: '#683B2B' }}>
                                                {feat.icon}
                                            </div>
                                            {/* Decorative Ring */}
                                            <div className="absolute -inset-1 rounded-full border border-[#D49E8D]/20 group-hover:scale-125 group-hover:opacity-0 transition-all duration-700"></div>
                                        </div>
                                        <h3 className="text-3xl font-display font-bold mb-3 transition-colors duration-300 group-hover:text-[#D49E8D]" style={{ color: '#683B2B' }}>{feat.title}</h3>
                                        <p className="text-lg font-medium leading-relaxed max-w-[250px]" style={{ color: '#82574A' }}>{feat.desc}</p>
                                    </motion.div>
                                    {i < 3 && (
                                        <div className="hidden lg:flex flex-col items-center justify-center relative w-10 opacity-20">
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                whileInView={{ height: '128px' }}
                                                className="w-[1px] bg-[#D49E8D]"
                                            />
                                            <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-[#D49E8D]"></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </section>
                </div>

            {/* --- FINAL CTA --- */}
            <section className="py-20 px-4 mb-20 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden min-h-[350px] md:min-h-[450px] flex items-center justify-center text-center shadow-xl border border-white/20"
                    style={{ 
                        backgroundImage: "url('/cta_banner.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>

                    <div className="relative z-10 max-w-2xl px-6 py-12 flex flex-col items-center">
                        <h2 className="text-4xl md:text-6xl font-display font-bold mb-3 leading-tight" style={{ color: '#381611' }}>
                            Ready to start your <br/> 
                            <span className="italic" style={{ color: '#D49E8D' }}>own story?</span> 
                            <motion.span 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block ml-3"
                            >
                                <Heart className="w-8 h-8 md:w-12 md:h-12 text-[#381611]" fill="transparent" strokeWidth={1} />
                            </motion.span>
                        </h2>
                        
                        <p className="text-xl md:text-2xl mb-10 font-medium" style={{ color: '#5A453B' }}>
                            Join thousands of writers and readers.
                        </p>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/register"
                                className="px-16 py-5 rounded-2xl font-bold text-2xl flex items-center gap-4 shadow-lg transition-all"
                                style={{ backgroundColor: '#B9745E', color: '#FAF6F2' }}
                            >
                                <PenTool className="w-7 h-7" /> Create Your Tale
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default LandingPage;
