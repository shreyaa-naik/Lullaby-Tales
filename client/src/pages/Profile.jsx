import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Edit3, Heart, Settings, ShieldCheck, MapPin, Bookmark, BookOpen } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('stories');

    const [userStories, setUserStories] = useState([]);
    const [likedStoriesList, setLikedStoriesList] = useState([]);
    const [readingList, setReadingList] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) return;
            
            try {
                const token = localStorage.getItem('token');
                
                // 1. Fetch User's Created Stories (Drafts + Published)
                const res = await fetch(`${API_BASE_URL}/api/stories/me`, {
                    headers: { 'x-auth-token': token }
                });
                const myStories = await res.json();
                setUserStories(myStories.map(s => ({
                    id: s._id,
                    title: s.title,
                    authorName: s.author?.name || user?.name,
                    views: s.views || 0,
                    likes: s.likes || 0,
                    averageRating: s.rating || 0,
                    tags: s.tags,
                    image: s.image,
                    status: s.status
                })));

                // 2. Fetch User's Private Reading List
                const readRes = await fetch(`${API_BASE_URL}/api/auth/saved`, {
                    headers: { 'x-auth-token': token }
                });
                if (readRes.ok) {
                    const readData = await readRes.json();
                    setReadingList(readData.map(s => ({
                        id: s._id || s.id,
                        title: s.title,
                        authorName: s.author?.name || 'Author',
                        views: s.views || 0,
                        likes: s.likes || 0,
                        averageRating: s.rating || 0,
                        tags: s.tags,
                        image: s.image
                    })));
                }

                // 3. Fetch User's Liked Stories
                const profRes = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                    headers: { 'x-auth-token': token }
                });
                if (profRes.ok) {
                    const profData = await profRes.json();
                    if (profData && profData.likedStories) {
                        setLikedStoriesList(profData.likedStories.map(s => ({
                            id: s._id || s.id,
                            title: s.title || 'Untitled Tale',
                            authorName: s.author?.name || 'Author',
                            views: s.views || 0,
                            likes: s.likes || 0,
                            averageRating: s.rating || 0,
                            tags: s.tags,
                            image: s.image
                        })));
                    }
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
                toast.success('Tale removed from your collection');
                // Local state update
                setUserStories(prev => prev.filter(s => s.id !== id));
            } else {
                toast.error('Could not delete story');
            }
        } catch (err) { toast.error('Server error'); }
    };

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen">
            {/* Profile Header */}
            <div className="rounded-[3rem] p-8 md:p-12 mb-12 relative overflow-hidden backdrop-blur-md"
                 style={{ backgroundColor: 'rgba(250,246,242,0.8)', border: '1.5px solid rgba(104,59,43,0.1)', boxShadow: '0 12px 40px rgba(104,59,43,0.08)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/20 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-lg border overflow-hidden"
                         style={{ backgroundColor: '#DED1BD', borderColor: 'rgba(104,59,43,0.1)' }}>
                        {user?.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                        ) : (
                            <User className="w-12 h-12" style={{ color: '#683B2B' }} />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h1 className="text-4xl font-display font-black tracking-tight" style={{ color: '#683B2B' }}>
                                {user?.name || 'Author Name'}
                            </h1>
                            <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm w-max mx-auto md:mx-0"
                                 style={{ backgroundColor: '#D49E8D', color: '#FAF6F2' }}>
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified Author
                            </div>
                        </div>
                        <p className="text-base font-medium leading-relaxed max-w-2xl mb-6" style={{ color: '#82574A' }}>
                            Weaving tales of magic and mystery since the dawn of the new age. I write stories that make you question the stars. Follow my journey into the unknown.
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-bold" style={{ color: '#82574A' }}>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Earth, Milky Way</div>
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined March 2024</div>
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user?.email || 'author@example.com'}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <Link to="/settings" className="h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-sm tooltip"
                                style={{ backgroundColor: 'rgba(250,246,242,0.9)', border: '1.5px solid rgba(104,59,43,0.1)', color: '#683B2B' }}
                                title="Edit Profile">
                            <Edit3 className="w-5 h-5" />
                        </Link>
                        <Link to="/settings" className="h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-sm"
                                style={{ backgroundColor: 'rgba(250,246,242,0.9)', border: '1.5px solid rgba(104,59,43,0.1)', color: '#683B2B' }}
                                title="Account Settings">
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto scrollbar-hide py-2">
                {[
                    { id: 'stories', label: 'Published Tales' },
                    { id: 'bookmarks', label: 'Reading List' },
                    { id: 'likes', label: 'Liked Stories' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border"
                        style={activeTab === tab.id 
                            ? { backgroundColor: '#D49E8D', color: '#FAF6F2', borderColor: '#D49E8D', boxShadow: '0 4px 16px rgba(212,158,141,0.2)' } 
                            : { backgroundColor: 'transparent', color: '#82574A', borderColor: 'rgba(104,59,43,0.15)' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeTab === 'stories' && (
                    userStories.length > 0 ? (
                        userStories.map(story => (
                            <StoryCard 
                                key={story.id} 
                                story={story} 
                                isOwner={true} 
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center rounded-[2rem] border backdrop-blur-sm"
                             style={{ backgroundColor: 'rgba(250,246,242,0.4)', borderColor: 'rgba(104,59,43,0.1)' }}>
                            <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: '#D49E8D', opacity: 0.5 }} />
                            <h3 className="text-xl font-bold mb-2" style={{ color: '#683B2B' }}>No tales published yet</h3>
                            <p className="font-medium" style={{ color: '#82574A' }}>Your journey as a storyteller begins with your first word.</p>
                            <Link to="/create-story" className="inline-block mt-6 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-md"
                                  style={{ backgroundColor: '#D49E8D' }}>
                                Start Writing
                            </Link>
                        </div>
                    )
                )}

                {activeTab === 'bookmarks' && (
                    readingList.length > 0 ? (
                        readingList.map((story, i) => (
                            <StoryCard key={story.id || story._id || i} story={story} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center rounded-[2rem] border backdrop-blur-sm"
                             style={{ backgroundColor: 'rgba(250,246,242,0.4)', borderColor: 'rgba(104,59,43,0.1)' }}>
                            <Bookmark className="w-10 h-10 mx-auto mb-4" style={{ color: '#D49E8D', opacity: 0.5 }} />
                            <h3 className="text-xl font-bold mb-2" style={{ color: '#683B2B' }}>No saved stories</h3>
                            <p className="font-medium" style={{ color: '#82574A' }}>Stories you save to your reading list will appear here.</p>
                        </div>
                    )
                )}
                
                {activeTab === 'likes' && (
                    likedStoriesList.length > 0 ? (
                        likedStoriesList.map(story => (
                            <StoryCard key={story.id} story={story} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center rounded-[2rem] border backdrop-blur-sm"
                             style={{ backgroundColor: 'rgba(250,246,242,0.4)', borderColor: 'rgba(104,59,43,0.1)' }}>
                            <Heart className="w-10 h-10 mx-auto mb-4" style={{ color: '#D49E8D', opacity: 0.5 }} />
                            <h3 className="text-xl font-bold mb-2" style={{ color: '#683B2B' }}>No liked stories yet</h3>
                            <p className="font-medium" style={{ color: '#82574A' }}>The stories you heart will appear here for you to revisit.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;
