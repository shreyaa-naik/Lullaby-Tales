import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Edit3, Heart, Settings, ShieldCheck, MapPin, Bookmark, BookOpen } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';

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
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen font-sans">
            {/* Profile Header */}
            <div className="rounded-[3.5rem] p-10 mb-12 relative overflow-hidden backdrop-blur-md"
                 style={{ backgroundColor: 'rgba(250,246,242,0.8)', border: '1.5px solid rgba(104,59,43,0.1)', boxShadow: '0 12px 40px rgba(104,59,43,0.08)' }}>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                    {/* Avatar */}
                    <div className="w-40 h-40 rounded-[2.5rem] flex items-center justify-center flex-shrink-0 shadow-xl border-4 overflow-hidden"
                         style={{ backgroundColor: '#DED1BD', borderColor: 'white' }}>
                        {user?.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                        ) : (
                            <User className="w-16 h-16" style={{ color: '#683B2B' }} />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
                            <h1 className="text-5xl font-display font-black tracking-tight" style={{ color: '#683B2B' }}>
                                {user?.name || 'Author Name'}
                            </h1>
                            <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm w-max mx-auto md:mx-0"
                                 style={{ backgroundColor: '#D49E8D', color: '#FAF6F2' }}>
                                <ShieldCheck className="w-4 h-4" /> Verified Author
                            </div>
                        </div>

                        {/* STATS SECTION (INSTAGRAM STYLE) */}
                        <div className="flex items-center justify-center md:justify-start gap-12 mb-8 border-y md:border-y-0 py-6 md:py-0 border-orange-100">
                            <div className="text-center md:text-left">
                                <span className="block text-2xl font-black text-[#683B2B]">{published.length}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#82574A]">Tales Published</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-2xl font-black text-[#683B2B]">{totalLikes}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#82574A]">Total Likes</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-2xl font-black text-[#683B2B]">{liked.length}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#82574A]">Hearts Given</span>
                            </div>
                        </div>

                        <p className="text-lg font-medium leading-relaxed max-w-2xl mb-8" style={{ color: '#82574A' }}>
                            {user?.bio || "A regular contributor to the library of dreams. Every word is a step into the unknown."}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-bold" style={{ color: '#82574A' }}>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> StoryVerse</div>
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user?.email}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <Link to="/settings" className="h-14 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg font-black text-xs uppercase tracking-widest text-white"
                            style={{ backgroundColor: '#D49E8D' }}>
                        <Settings className="w-5 h-5" /> Edit Profile
                    </Link>
                </div>
            </div>

            {/* Content Tabs (with counts) */}
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

            {/* Content Grid */}
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
