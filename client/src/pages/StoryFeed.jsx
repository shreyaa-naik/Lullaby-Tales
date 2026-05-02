import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, BookOpen, Heart, Sparkles, 
    Compass, Feather, Grid, ChevronDown, 
    Bookmark, MessageCircle, Share2, MoreHorizontal 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StoryCard from '../components/StoryCard';
import API_BASE_URL from '../config';

const LibraryIllustration = () => (
    <svg width="100%" height="auto" viewBox="0 0 800 650" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-3xl">
        <defs>
            <filter id="premiumShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#4A2A1E" flood-opacity="0.22"/>
            </filter>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            
            <linearGradient id="agedPaper" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FDF5E8"/>
                <stop offset="100%" stop-color="#E8D0B0"/>
            </linearGradient>
            <linearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#D49E8D"/>
                <stop offset="100%" stop-color="#B9745E"/>
            </linearGradient>
            <linearGradient id="quillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#A67B5B"/>
                <stop offset="100%" stop-color="#683B2B"/>
            </linearGradient>
        </defs>

        {/* --- LUSH BOTANICALS BACKGROUND --- */}
        <g opacity="0.6">
            {/* Lavender Sprigs */}
            <path d="M150 550 Q160 400 130 300" stroke="#8E7DAB" stroke-width="2" fill="none" />
            <circle cx="130" cy="300" r="4" fill="#A892C7" />
            <circle cx="135" cy="315" r="3" fill="#A892C7" />
            <circle cx="125" cy="330" r="3" fill="#A892C7" />
            
            <path d="M650 550 Q630 420 670 320" stroke="#8E7DAB" stroke-width="2" fill="none" />
            <circle cx="670" cy="320" r="4" fill="#A892C7" />
            <circle cx="660" cy="335" r="3" fill="#A892C7" />
        </g>

        {/* --- COLLAGE PAPERS --- */}
        <g filter="url(#premiumShadow)">
            <rect x="180" y="80" width="420" height="500" rx="4" fill="#E8D1B5" transform="rotate(12 390 330)"/>
            <rect x="200" y="60" width="380" height="480" rx="2" fill="url(#agedPaper)" transform="rotate(-5 390 300)"/>
            <rect x="250" y="40" width="340" height="450" rx="1" fill="#FAF6F2" transform="rotate(2 420 265)"/>
            
            <g transform="rotate(2 420 265) translate(300, 150)">
                <text font-family="serif" font-size="34" fill="#683B2B" font-style="italic" opacity="0.75">Stories are</text>
                <text x="25" y="55" font-family="serif" font-size="34" fill="#683B2B" font-style="italic" opacity="0.75">the keys to</text>
                <text x="50" y="110" font-family="serif" font-size="34" fill="#683B2B" font-style="italic" opacity="0.75">our hearts.</text>
                <path d="M160 170 Q160 155 175 155 Q190 155 190 170 Q190 190 160 210 Q130 190 130 170 Q130 155 145 155 Q160 155 160 170Z" 
                    fill="none" stroke="#D49E8D" stroke-width="2.5" opacity="0.5"/>
            </g>
        </g>

        {/* --- FLOWERS OVERLAY --- */}
        
        {/* Large Aesthetic Roses */}
        <g transform="translate(200, 500) scale(0.8)">
            <path d="M0 0 Q20 -30 40 0 Q60 -30 80 0 Q60 30 40 60 Q20 30 0 0Z" fill="url(#roseGrad)" opacity="0.9" />
            <circle cx="40" cy="15" r="15" fill="#FAF6F2" opacity="0.2" />
        </g>
        <g transform="translate(550, 100) rotate(160) scale(0.6)">
            <path d="M0 0 Q20 -30 40 0 Q60 -30 80 0 Q60 30 40 60 Q20 30 0 0Z" fill="url(#roseGrad)" opacity="0.8" />
        </g>

        {/* Baby's Breath Clouds */}
        <g fill="white" stroke="#E8D0B0" stroke-width="0.3" opacity="0.8">
            <circle cx="140" cy="350" r="4"/>
            <circle cx="160" cy="340" r="3"/>
            <circle cx="150" cy="370" r="3.5"/>
            <circle cx="180" cy="360" r="2.5"/>
            
            <circle cx="680" cy="450" r="4"/>
            <circle cx="700" cy="440" r="3"/>
            <circle cx="690" cy="470" r="3.5"/>
        </g>

        {/* --- THE QUILL & INK --- */}
        <g filter="url(#premiumShadow)">
            <path d="M640 460 Q640 500 680 505 Q720 505 740 495 L740 410 Q710 400 680 405 Q640 410 640 460 Z" fill="#0F0A06"/>
            <ellipse cx="690" cy="410" rx="45" ry="18" fill="#1A120B"/>
            <ellipse cx="690" cy="405" rx="28" ry="12" fill="#B08D57" stroke="#8B6A40" stroke-width="1"/>
            
            <g transform="rotate(-18 690 400)">
                <path d="M690 400 Q705 250 780 80" stroke="#3D2510" stroke-width="4" stroke-linecap="round"/>
                <path d="M780 80 Q730 110 710 230 Q720 320 690 400 Q680 340 660 230 Q670 110 780 80" fill="url(#quillGrad)" opacity="0.95"/>
            </g>
        </g>

        {/* --- SPARKLES & DUST --- */}
        <g filter="url(#softGlow)" fill="#D49E8D" opacity="0.5">
            <circle cx="250" cy="120" r="2.5"/>
            <circle cx="650" cy="80" r="3"/>
            <circle cx="100" cy="450" r="2"/>
            <circle cx="750" cy="580" r="2.5"/>
        </g>
    </svg>
);

// Mock data for initial view matching the image perfectly
const CATEGORIES = [
    { id: 'all', name: 'All Stories', count: '12,450 stories', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'romance', name: 'Romance', count: '2,350 stories', icon: <Heart className="w-6 h-6" /> },
    { id: 'fantasy', name: 'Fantasy', count: '2,180 stories', icon: <Sparkles className="w-6 h-6" /> },
    { id: 'mystery', name: 'Mystery', count: '1,870 stories', icon: <Search className="w-6 h-6" /> },
    { id: 'adventure', name: 'Adventure', count: '1,650 stories', icon: <Compass className="w-6 h-6" /> },
    { id: 'poetry', name: 'Poetry', count: '1,220 stories', icon: <Feather className="w-6 h-6" /> },
    { id: 'others', name: 'Others', count: '1,230 stories', icon: <Grid className="w-6 h-6" /> },
];

const TABS = ['Trending', 'Newest', 'Most Loved'];

const StoryFeed = () => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeTab, setActiveTab] = useState('Trending');
    const [sortBy, setSortBy] = useState('Most Popular');
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/stories`);
                const data = await res.json();
                
                // Fallback high-quality images if user hasn't uploaded one
                const fallbackImages = [
                    '/library_beach_romance.png',
                    '/library_dark_book.png',
                    '/library_fantasy_castle.png',
                    '/library_mountain_wanderer.png',
                    '/library_poetry_letter.png',
                    '/library_rainy_romance.png',
                    '/library_forest_gate.png',
                    '/library_misty_city.png'
                ];

                const formatted = data.map((s, idx) => ({
                    id: s._id,
                    title: s.title,
                    excerpt: s.content?.substring(0, 80) + '...',
                    author: s.author?.name || 'Adventurer',
                    authorAvatar: s.author?.avatar || null,
                    likes: s.likes || 0,
                    comments: s.comments?.length || 0,
                    category: s.tags?.[0] || (['ROMANCE', 'MYSTERY', 'FANTASY', 'ADVENTURE', 'POETRY'][idx % 5]),
                    // Only use fallback if story has no image
                    image: s.image || fallbackImages[idx % fallbackImages.length]
                }));

                // Only use complete mock dataset if DB is totally empty
                if (formatted.length === 0) {
                    setStories([]);
                } else {
                    setStories(formatted);
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch stories", err);
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    // Filter and Sort logic
    useEffect(() => {
        let result = [...stories];

        // Search Filter
        if (search) {
            result = result.filter(s => 
                s.title.toLowerCase().includes(search.toLowerCase()) || 
                s.author.toLowerCase().includes(search.toLowerCase()) ||
                s.category.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Tab Filtering / Sorting
        if (activeTab === 'Trending') {
            result.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
        } else if (activeTab === 'Newest') {
            result.sort((a, b) => b.id.localeCompare(a.id));
        } else if (activeTab === 'Most Loved') {
            result.sort((a, b) => (parseFloat(b.likes) + b.comments) - (parseFloat(a.likes) + a.comments));
        }

        // Sort Dropdown
        if (sortBy === 'Most Popular') {
            result.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
        } else if (sortBy === 'Alphabetical') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        setFilteredStories(result);
    }, [stories, search, activeTab, sortBy]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pb-24 relative overflow-hidden" style={{ backgroundColor: 'transparent', fontFamily: "'Lora', serif" }}>
            <div className="relative z-10">
                {/* --- HEADER SECTION --- */}
            <header className="relative pt-40 pb-20 px-6 lg:px-20 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-left z-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-[#D49E8D]/10 border border-[#D49E8D]/20 mb-6"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D49E8D]">
                                ✨ Discover. Read. Imagine.
                            </span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight"
                            style={{ color: '#683B2B', fontFamily: "'Marcellus', serif" }}
                        >
                            Welcome to the <br/>
                            <span style={{ color: '#D49E8D' }}>Library.</span>
                            <motion.span 
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="inline-block ml-4"
                            >
                                <Heart className="w-12 h-12 text-[#D49E8D]/40" />
                            </motion.span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl max-w-lg leading-relaxed mb-10"
                            style={{ color: '#5A453B' }}
                        >
                            Explore thousands of hand-crafted tales from our global community of writers across every genre and mood.
                        </motion.p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl">
                            <div className="relative flex-1 w-full group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D49E8D]" />
                                <input 
                                    type="text"
                                    placeholder="Search stories, authors, or keywords..."
                                    className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-[#D49E8D]/20 transition-all text-[#683B2B] font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-white border border-[#683B2B]/10 shadow-sm flex items-center justify-center gap-3 font-bold text-[#683B2B] hover:bg-white/80 transition-all">
                                <Filter className="w-5 h-5" /> Filters
                            </button>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1 }}
                        className="flex-1 relative hidden lg:block"
                    >
                        <LibraryIllustration />
                    </motion.div>
                </div>
            </header>



            {/* --- TABS & SORT --- */}
            <div className="max-w-7xl mx-auto px-6 lg:px-20 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8 border-b border-[#683B2B]/10 w-full md:w-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold tracking-widest uppercase relative transition-all ${
                                activeTab === tab ? 'text-[#D49E8D]' : 'text-[#82574A]/50 hover:text-[#82574A]'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D49E8D]"
                                />
                            )}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <span className="text-xs font-bold text-[#82574A]">Sort by:</span>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-white border border-[#683B2B]/10 text-xs font-bold text-[#683B2B] focus:outline-none focus:ring-2 focus:ring-[#D49E8D]/20 cursor-pointer appearance-none pr-10 relative"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D49E8D' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                    >
                        <option>Most Popular</option>
                        <option>Alphabetical</option>
                    </select>
                </div>
            </div>

            {/* --- STORY GRID --- */}
            <main className="max-w-7xl mx-auto px-6 lg:px-20">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {filteredStories.map((story) => (
                        <motion.div 
                            key={story.id} 
                            variants={itemVariants}
                        >
                            <StoryCard story={{
                                ...story,
                                authorName: story.author,
                                tags: [story.category]
                            }} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* --- FOOTER CTA --- */}
                <div className="mt-20 text-center">
                    <button className="px-10 py-4 rounded-2xl bg-white border border-[#683B2B]/10 shadow-sm flex items-center justify-center gap-3 font-bold text-[#683B2B] mx-auto hover:bg-[#FAF6F2] hover:border-[#D49E8D]/30 transition-all">
                        Load More Stories <ChevronDown className="w-5 h-5 text-[#D49E8D]" />
                    </button>
                </div>
            </main>

            </div>

            {/* Background Decorative Accents */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#D49E8D]/5 blur-[150px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#683B2B]/5 blur-[150px] -z-10 pointer-events-none"></div>
        </div>
    );
};

export default StoryFeed;
