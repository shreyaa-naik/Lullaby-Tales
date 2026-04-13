import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryCard from '../components/StoryCard';
import { Search, Filter, Sparkles, SlidersHorizontal, BookOpen, TrendingUp, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

import API_BASE_URL from '../config';

const StoryFeed = () => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [sortBy, setSortBy] = useState('trending');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [dbStories, setDbStories] = useState([]);

    // Permanent Dummy showcase
    const dummyStories = [
        {
            id: 'd00000000000000000000001',
            title: 'The Midnight Star',
            content: 'Under the silver moon, the stars began to dance in a rhythm only the night knew...',
            authorName: 'Luna Lovegood',
            tags: ['Fantasy', 'Short Story'],
            likes: 124,
            averageRating: 4.8,
            views: '45k',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'd00000000000000000000002',
            title: 'Echoes of the Forest',
            authorName: 'Caspian Thorne',
            tags: ['Adventure', 'Nature'],
            likes: 89,
            averageRating: 4.7,
            views: '12k',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'd00000000000000000000003',
            title: 'Clockwork Dreams',
            authorName: 'Arthur Gears',
            tags: ['Steampunk', 'Mystery'],
            likes: 245,
            averageRating: 4.8,
            views: '31k',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'd00000000000000000000004',
            title: 'The Last Alchemist',
            authorName: 'Julian Thorne',
            tags: ['Historical', 'Magic'],
            likes: 560,
            averageRating: 5.0,
            views: '58k',
            image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80'
        }
    ];

    React.useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/stories`);
                const data = await res.json();
                
                // Map the backend DB structure to match the frontend StoryCard format
                const formattedRemoteStories = data.map(dbStory => ({
                    id: dbStory._id,
                    title: dbStory.title,
                    content: dbStory.content,
                    authorName: dbStory.author?.name || 'Inba',
                    tags: dbStory.tags && dbStory.tags.length > 0 ? dbStory.tags : ['FRESH!'],
                    likes: dbStory.likes || 0,
                    averageRating: dbStory.rating || 0,
                    views: dbStory.views || 0,
                    image: dbStory.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' 
                }));
                setDbStories(formattedRemoteStories);
            } catch (err) {
                console.error("Failed to fetch stories", err);
            }
        };
        fetchStories();
    }, []);

    const allStories = [...dummyStories, ...dbStories];

    const filteredStories = allStories.filter(s => 
        (s.title || '').toLowerCase().includes(search.toLowerCase()) || 
        (s.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => {
        if (sortBy === 'trending') return b.likes - a.likes;
        if (sortBy === 'rating') return b.averageRating - a.averageRating;
        if (sortBy === 'newest') return 1; 
        return 0;
    });

    const handleSortChange = (method) => {
        setSortBy(method);
        setShowSortMenu(false);
    };

    return (
        <div className="min-h-screen pb-32 font-sans" style={{ backgroundColor: 'transparent' }}>
            <header className="relative pt-48 pb-32 px-4 overflow-hidden backdrop-blur-sm" style={{ backgroundColor: 'rgba(250, 246, 242, 0.6)', borderBottom: '1.5px solid rgba(104,59,43,0.1)' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top right,rgba(212,158,141,0.05),transparent)' }}></div>
                <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-rose-100/30 blur-[120px] rounded-full"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 shadow-sm"
                        style={{ backgroundColor: 'rgba(250,246,242,0.8)', border: '1.5px solid rgba(104,59,43,0.1)' }}
                    >
                        <Sparkles className="w-4 h-4" style={{ color: '#D49E8D' }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#D49E8D' }}>Infinite Stories Await</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-display font-black mb-8 tracking-tight"
                        style={{ color: '#683B2B' }}
                    >
                        The Library of <br/>
                        <span className="italic" style={{ color: '#D49E8D' }}>Dreamers.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl font-medium max-w-2xl mx-auto leading-relaxed"
                        style={{ color: '#82574A' }}
                    >
                        Discover thousands of hand-crafted tales from a global community of authentic authors.
                    </motion.p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[2.5rem] shadow-2xl p-4 md:p-6"
                    style={{ backgroundColor: 'rgba(250,246,242,0.9)', border: '1.5px solid rgba(104,59,43,0.1)', boxShadow: '0 8px 40px rgba(104,59,43,0.07)' }}
                >
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: '#D49E8D' }} />
                            <input
                                type="text"
                                placeholder="Search stories, authors, or magic tags..."
                                className="w-full pl-16 pr-6 py-5 rounded-2xl font-bold transition-all border-none"
                                style={{ backgroundColor: 'rgba(250,246,242,0.5)', color: '#683B2B', outline: 'none' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2.5 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                            {['all', 'trending', 'recent', 'curated'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="h-14 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all flex items-center gap-2"
                                    style={activeTab === tab
                                        ? { backgroundColor: '#D49E8D', color: '#FAF6F2', boxShadow: '0 4px 16px rgba(212,158,141,0.20)' }
                                        : { backgroundColor: 'transparent', color: '#82574A', border: '1.5px solid rgba(104,59,43,0.15)' }
                                    }
                                >
                                    {tab === 'trending' && <TrendingUp className="w-3.5 h-3.5" />}
                                    {tab === 'recent' && <Clock className="w-3.5 h-3.5" />}
                                    {tab}
                                    {tab === 'all' && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <main className="max-w-7xl mx-auto px-4 mt-24">
                <div className="flex items-center justify-between mb-16 px-4">
                    <div>
                        <h2 className="text-4xl font-display font-black tracking-tight" style={{ color: '#683B2B' }}>
                            {search ? `Search Results (${filteredStories.length})` : 'Curated for You'}
                        </h2>
                        {!search && <p className="font-medium mt-1 uppercase text-[10px] tracking-widest" style={{ color: '#D49E8D' }}>Hand-picked by our editors</p>}
                    </div>
                    <div className="relative">
                        <div 
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-colors font-black text-[10px] uppercase tracking-widest"
                            style={{ backgroundColor: 'rgba(250,246,242,0.6)', color: '#D49E8D', border: '1.5px solid rgba(104,59,43,0.15)' }}
                        >
                            Sort By: {sortBy} <ChevronDown className="w-4 h-4 ml-1" style={{ color: '#D49E8D' }} />
                        </div>
                        {showSortMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl border overflow-hidden z-30"
                                 style={{ backgroundColor: 'rgba(250, 246, 242, 0.95)', borderColor: 'rgba(104,59,43,0.1)' }}>
                                {['trending', 'rating', 'newest'].map(option => (
                                    <div 
                                        key={option}
                                        onClick={() => handleSortChange(option)}
                                        className="px-6 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white transition-colors"
                                        style={{ color: sortBy === option ? '#D49E8D' : '#82574A' }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredStories.map((story, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            key={story.id}
                            transition={{ delay: (idx % 4) * 0.1 }}
                        >
                            <StoryCard story={story} />
                        </motion.div>
                    ))}
                </div>

                {filteredStories.length === 0 && (
                    <div className="py-40 text-center">
                        <Search className="w-16 h-16 mx-auto mb-6 opacity-20" />
                        <h3 className="text-2xl font-bold mb-2">No stories found</h3>
                        <p className="text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StoryFeed;
