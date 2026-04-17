import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const Trending = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/stories/trending`);
                if (res.ok) {
                    setStories(await res.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(212, 158, 141, 0.2)' }}>
                    <TrendingUp className="w-8 h-8" style={{ color: '#D49E8D' }} />
                </div>
                <h1 className="text-5xl font-display font-black mb-4" style={{ color: '#683B2B' }}>Trending Tales</h1>
                <p className="text-lg font-medium" style={{ color: '#82574A' }}>Discover what the world is reading right now.</p>
            </div>

            <div className="space-y-6">
                {!loading ? (
                    stories.map((tale, idx) => (
                        <Link 
                            to={`/story/${tale._id}`} 
                            key={tale._id} 
                            className="p-8 rounded-[2rem] flex items-center justify-between transition-all hover:scale-[1.01] group backdrop-blur-md"
                            style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1px solid rgba(104, 59, 43, 0.1)', boxShadow: '0 8px 32px rgba(104, 59, 43, 0.05)' }}
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-display font-black group-hover:text-[#D49E8D] transition-colors" style={{ color: 'rgba(212, 158, 141, 0.3)' }}>
                                    #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                </span>
                                <div>
                                    <h3 className="text-2xl font-bold mb-1" style={{ color: '#683B2B' }}>{tale.title}</h3>
                                    <p className="text-sm font-medium uppercase tracking-widest" style={{ color: '#82574A' }}>By {tale.author?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex items-center gap-2 font-bold px-4 py-2 rounded-xl" style={{ backgroundColor: '#FAF6F2', color: '#C76A55' }}>
                                    <Flame className="w-4 h-4" /> {tale.likes} likes
                                </div>
                                <ChevronRight className="w-6 h-6 text-[#D49E8D] opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-20 text-[#82574A] font-bold animate-pulse">Consulting the star charts...</div>
                )}
            </div>
        </div>
    );
};

export default Trending;
