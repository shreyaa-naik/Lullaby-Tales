import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Edit3, Heart, Settings, ShieldCheck, MapPin, Bookmark, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import StoryCard from '../components/StoryCard';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';

const ProfileIllustration = ({ user, published, totalLikes, liked }) => (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] mb-12 shadow-2xl border border-[#DED1BD]/50" 
         style={{ background: '#FAF6F2' }}>
        {/* Crushed Paper Texture Layer */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/crushed-paper.png")' }}></div>
        
        {/* SVG Decorative Layer */}
        <svg viewBox="0 0 1200 400" className="w-full h-auto block" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#4A2A1E" flood-opacity="0.15"/>
                </filter>
                <linearGradient id="agedPaperGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#FDF5E8"/>
                    <stop offset="100%" stop-color="#E8D0B0"/>
                </linearGradient>
            </defs>

            {/* Background Base with "Tattered" Edges feel */}
            <path d="M20 40 Q40 20 80 25 L1120 15 Q1180 20 1175 80 L1185 320 Q1180 380 1120 375 L80 385 Q20 380 25 320 Z" fill="#FDF9F4" filter="url(#shadow)" />
            
            {/* Aesthetic Collage on the Right */}
            <g transform="translate(750, 40)">
                {/* Photo Stack */}
                <rect x="0" y="20" width="280" height="320" fill="#E8D0B0" transform="rotate(8 140 160)" stroke="#D4B896" stroke-width="1" />
                <rect x="15" y="10" width="280" height="320" fill="#E8D0B0" transform="rotate(-3 155 170)" stroke="#D4B896" stroke-width="1" />
                <g filter="url(#shadow)" transform="rotate(2 150 160)">
                    <rect x="25" y="5" width="270" height="310" fill="white" />
                    <rect x="40" y="20" width="240" height="240" fill="#E8DCCB" />
                    <image x="40" y="20" width="240" height="240" href="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=800&q=80" preserveAspectRatio="xMidYMid slice" opacity="0.9" />
                    <text x="160" y="290" text-anchor="middle" font-family="serif" font-style="italic" font-size="14" fill="#82574A">Memories of Gold</text>
                </g>

                {/* Inkwell & Quill */}
                <g transform="translate(230, 240)">
                    <path d="M0 40 Q0 80 40 85 Q80 85 100 75 L100 -10 Q70 -20 40 -15 Q0 -10 0 40 Z" fill="#1A120B" filter="url(#shadow)" />
                    <ellipse cx="50" cy="-10" rx="45" ry="15" fill="#2A1E15" />
                    <ellipse cx="50" cy="-15" rx="25" ry="10" fill="#B08D57" stroke="#8B6A40" stroke-width="1" />
                    
                    {/* Quill */}
                    <g transform="rotate(15 50 -15) translate(60, -220)">
                        <path d="M10 220 Q20 50 80 -100" stroke="#3D2510" stroke-width="4" stroke-linecap="round" />
                        <path d="M80 -100 Q40 -80 25 20 Q30 110 10 220 Q5 160 -15 20 Q-10 -80 80 -100" fill="url(#agedPaperGrad)" opacity="0.9" />
                    </g>
                </g>

                {/* Floral Sprig */}
                <g transform="translate(-150, 100) scale(0.8)" stroke="#5A7040" stroke-width="1.5" opacity="0.6">
                    <path d="M0 250 Q50 150 20 50" fill="none" />
                    <circle cx="20" cy="50" r="4" fill="white" stroke="#DED1BD" />
                    <circle cx="35" cy="70" r="3" fill="white" stroke="#DED1BD" />
                    <circle cx="10" cy="90" r="2.5" fill="white" stroke="#DED1BD" />
                    <circle cx="45" cy="110" r="3.5" fill="white" stroke="#DED1BD" />
                </g>
            </g>

            {/* Note on the far right */}
            <g transform="translate(1040, 100)">
                <text font-family="serif" font-style="italic" font-size="18" fill="#683B2B" opacity="0.7">
                    <tspan x="0" dy="0">Every story</tspan>
                    <tspan x="0" dy="25">shapes a</tspan>
                    <tspan x="0" dy="25">beautiful</tspan>
                    <tspan x="0" dy="25">soul.</tspan>
                </text>
                <path d="M20 120 Q35 110 50 120 Q65 130 50 145 Q35 130 20 120" stroke="#D49E8D" stroke-width="1.5" fill="none" opacity="0.6" />
            </g>
        </svg>

        {/* --- ACTUAL CONTENT OVERLAY --- */}
        <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full overflow-y-auto md:overflow-visible">
                {/* Profile Picture with Edit Icon */}
                <div className="relative group flex-shrink-0">
                    <div className="w-44 h-44 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-8 ring-[#FAF6F2]/30">
                        {user?.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={user.name} />
                        ) : (
                            <div className="w-full h-full bg-[#D49E8D] flex items-center justify-center text-white font-black text-4xl">
                                {(user?.name || 'A').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <Link to="/settings" className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#DED1BD] text-[#683B2B] hover:text-[#D49E8D] transition-all hover:scale-110">
                        <Edit3 className="w-5 h-5" />
                    </Link>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left mt-6 md:mt-0 max-w-xl md:max-w-[40%]">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
                        <h1 className="text-6xl font-display font-black text-[#381611] tracking-tight flex items-center justify-center md:justify-start gap-4">
                            {user?.name || 'Author'}
                            <motion.span animate={{ rotate: [0, 15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                <Edit3 className="w-8 h-8 text-[#D49E8D]/60" strokeWidth={1.5} />
                            </motion.span>
                        </h1>
                    </div>
                    
                    <p className="text-xl font-medium text-[#82574A] mb-4 tracking-wide opacity-80">
                        {user?.tagline || "Dreamer · Writer · Story Collector"}
                    </p>
                    
                    <p className="text-2xl font-display italic text-[#683B2B] leading-relaxed opacity-90 max-w-lg">
                        "{user?.bio || "Stories are the compass that guide us through the stars."}"
                    </p>

                    <div className="mt-8 flex flex-wrap gap-6 justify-center md:justify-start">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-[#381611]">{published.length}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D49E8D]">Tales</span>
                        </div>
                        <div className="w-[1px] h-10 bg-[#DED1BD] self-center opacity-50"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-[#381611]">{totalLikes}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D49E8D]">Appreciation</span>
                        </div>
                        <div className="w-[1px] h-10 bg-[#DED1BD] self-center opacity-50"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-[#381611]">{liked.length}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D49E8D]">Hearts</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Profile = () => {
    const { user, savedStories } = useAuth();
    const [activeTab, setActiveTab] = useState('stories');

    const [published, setPublished] = useState([]);
    const [liked, setLiked] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id && !user?._id) return;
            
            try {
                const token = localStorage.getItem('token');
                
                // 1. Fetch Published
                const publishedRes = await fetch(`${API_BASE_URL}/api/stories/user/${user.id || user._id}`, {
                    headers: { 'x-auth-token': token }
                });
                if (publishedRes.ok) {
                    const data = await publishedRes.json();
                    setPublished(data);
                }

                // 2. Fetch Liked
                const likedRes = await fetch(`${API_BASE_URL}/api/stories/liked/${user.id || user._id}`, {
                    headers: { 'x-auth-token': token }
                });
                if (likedRes.ok) {
                    const data = await likedRes.json();
                    setLiked(data);
                }

            } catch (err) {
                console.error("Failed to fetch profile data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tale forever?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                toast.success('Tale removed');
                setPublished(prev => prev.filter(s => (s._id || s.id) !== id));
            }
        } catch (err) { toast.error('Server error'); }
    };

    // Calculate Stats
    const totalLikes = published.reduce((acc, story) => acc + (story.likes || 0), 0);

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen font-sans">
            <ProfileIllustration user={user} published={published} totalLikes={totalLikes} liked={liked} />

            <div className="flex items-center border-b border-orange-100 mb-12">
                {[
                    { id: 'stories', label: 'Published', count: published.length, icon: <BookOpen className="w-4 h-4" /> },
                    { id: 'bookmarks', label: 'Saved', count: savedStories.length, icon: <Bookmark className="w-4 h-4" /> },
                    { id: 'likes', label: 'Liked', count: liked.length, icon: <Heart className="w-4 h-4" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                            activeTab === tab.id 
                            ? 'border-[#D49E8D] text-[#D49E8D]' 
                            : 'border-transparent text-[#82574A] opacity-50 hover:opacity-100'
                        }`}
                    >
                        {tab.icon} {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeTab === 'stories' && (
                    published.length > 0 ? (
                        published.map(story => (
                            <StoryCard 
                                key={story._id || story.id} 
                                story={{...story, id: story._id || story.id}} 
                                isOwner={true} 
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-orange-100">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold mb-6 text-[#683B2B]">Your story starts here</h3>
                            <Link to="/create-story" className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg"
                                  style={{ backgroundColor: '#D49E8D' }}>
                                Create First Tale
                            </Link>
                        </div>
                    )
                )}

                {activeTab === 'bookmarks' && (
                    savedStories.length > 0 ? (
                        savedStories.map((story, i) => (
                             <StoryCard key={story._id || story.id || i} story={{
                                 ...story,
                                 id: story._id || story.id,
                                 authorName: story.author?.name || 'Author'
                             }} />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center opacity-40">
                            <Bookmark className="w-12 h-12 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest text-xs">Reading List is Empty</p>
                        </div>
                    )
                )}
                
                {activeTab === 'likes' && (
                    liked.length > 0 ? (
                        liked.map((story, i) => (
                            <StoryCard key={story._id || story.id || i} story={{
                                ...story,
                                id: story._id || story.id,
                                authorName: story.author?.name || 'Author'
                            }} />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center opacity-40">
                            <Heart className="w-12 h-12 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest text-xs">No liked stories</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;
