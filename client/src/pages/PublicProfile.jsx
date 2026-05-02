import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StoryCard from '../components/StoryCard';
import { User, ShieldCheck, MapPin, Calendar, BookOpen, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const ProfileIllustration = ({ user, storiesCount }) => (
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
                {/* Profile Picture */}
                <div className="relative group flex-shrink-0">
                    <div className="w-44 h-44 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-8 ring-[#FAF6F2]/30">
                        {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                        ) : (
                            <div className="w-full h-full bg-[#DED1BD] flex items-center justify-center">
                                <User className="w-20 h-20 text-[#683B2B]" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left mt-6 md:mt-0 max-w-xl md:max-w-[40%]">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
                        <h1 className="text-6xl font-display font-black text-[#381611] tracking-tight flex items-center justify-center md:justify-start gap-4">
                            {user.name}
                            <motion.span animate={{ rotate: [0, 15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                <Edit3 className="w-8 h-8 text-[#D49E8D]/60" strokeWidth={1.5} />
                            </motion.span>
                        </h1>
                    </div>
                    
                    <p className="text-xl font-medium text-[#82574A] mb-4 tracking-wide opacity-80">
                        {user.tagline || "Story Architect · Dream Weaver"}
                    </p>
                    
                    <p className="text-2xl font-display italic text-[#683B2B] leading-relaxed opacity-90 max-w-lg">
                        "{user.bio || "Crafting worlds through the magic of words."}"
                    </p>

                    <div className="mt-8 flex flex-wrap gap-6 justify-center md:justify-start">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-[#381611]">{storiesCount}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D49E8D]">Published</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PublicProfile = () => {
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfileUser(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div className="pt-40 text-center text-xl font-bold">Loading Architect...</div>;
    if (!profileUser) return <div className="pt-40 text-center text-xl font-bold">User Not Found</div>;

    const publishedStories = profileUser.publishedStories || [];

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen font-sans">
            <ProfileIllustration user={profileUser} storiesCount={publishedStories.length} />

            <h2 className="text-2xl font-bold mb-8" style={{ color: '#683B2B' }}>Published Tales by {profileUser.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedStories.length > 0 ? (
                    publishedStories.map(story => (
                        <StoryCard 
                            key={story._id} 
                            story={{...story, authorName: profileUser.name, id: story._id}} 
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center rounded-[2rem] border backdrop-blur-sm"
                         style={{ backgroundColor: 'rgba(250,246,242,0.4)', borderColor: 'rgba(104,59,43,0.1)' }}>
                        <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: '#D49E8D', opacity: 0.5 }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#683B2B' }}>No tales published yet</h3>
                        <p className="font-medium" style={{ color: '#82574A' }}>This author hasn't shared any magic with the world just yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicProfile;
