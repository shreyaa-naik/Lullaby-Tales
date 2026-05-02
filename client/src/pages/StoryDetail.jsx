import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Heart, Bookmark, MessageCircle, Share2, 
    ChevronLeft, Send, Clock, Eye, User as UserIcon, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../config';

const StoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, saveStory, unsaveStory, savedStories } = useAuth();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState('');
    const [summarizing, setSummarizing] = useState(false);

    const fetchSummary = async () => {
        if (!story?.content) return;
        setSummarizing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/summary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: story.content })
            });
            const data = await res.json();
            setSummary(data.summary);
        } catch (err) {
            toast.error('The magic is fading... try again later');
        } finally {
            setSummarizing(false);
        }
    };

    useEffect(() => {
        const fetchStory = async () => {
            const token = localStorage.getItem('token');
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
                    headers: token ? { 'x-auth-token': token } : {}
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setStory(data);
                    setLiked(data.isLiked);
                    setComments(data.comments || []);
                } else {
                    setError('Tale not found');
                }
            } catch (err) {
                setError("Library connection lost");
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);

    const handleLike = async () => {
        if (!user) return toast.error('Please sign in to like');
        const willBeLiked = !liked;
        // Optimistic UI
        setLiked(willBeLiked);
        setStory(prev => ({ ...prev, likes: willBeLiked ? prev.likes + 1 : prev.likes - 1 }));

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}/like`, {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });
            if (!res.ok) {
                // Revert if failed
                setLiked(!willBeLiked);
                setStory(prev => ({ ...prev, likes: !willBeLiked ? prev.likes + 1 : prev.likes - 1 }));
            }
        } catch (err) {
            setLiked(!willBeLiked);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please sign in to comment');
        if (!commentText.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}/comment`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify({ text: commentText })
            });

            if (res.ok) {
                const updatedComments = await res.json();
                setComments(updatedComments);
                setCommentText('');
                toast.success('Your thought was woven into the tale');
            }
        } catch (err) {
            toast.error('Could not send comment');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this tale? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                toast.success('Your tale has returned to the stars');
                navigate('/profile');
            } else {
                toast.error('Could not remove the story');
            }
        } catch (err) {
            toast.error('Archive connection lost');
        }
    };

    const isSaved = savedStories?.some(s => (s._id || s.id) === id);

    const handleSaveToggle = () => {
        if (!user) return toast.error('Please sign in to save');
        if (isSaved) {
            unsaveStory(id);
            toast.success('Unbooked');
        } else {
            saveStory(id);
            toast.success('Saved to your shelf');
        }
    };

    if (loading) return <div className="pt-40 text-center font-black animate-pulse text-[#D49E8D]">Opening the Tome...</div>;
    if (error) return <div className="pt-40 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto font-sans">
            <Link to="/feed" className="flex items-center gap-2 mb-8 text-[#82574A] font-bold hover:-translate-x-1 transition-transform">
                <ChevronLeft className="w-5 h-5" /> Library
            </Link>

            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-orange-50/50 overflow-hidden">
                {/* Header Section */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-orange-50/20 to-transparent">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {story.tags?.map(t => (
                            <span key={t} className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-orange-100 text-[10px] font-black uppercase tracking-widest text-[#D49E8D]">
                                {t}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#683B2B] mb-8 leading-[1.1]">
                        {story.title}
                    </h1>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-6 text-[#82574A] text-sm font-medium">
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(story.createdAt).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> {story.views}</div>
                        </div>

                        {/* Author Controls */}
                        {user && (story.author?._id === user.id || story.author?._id === user._id) && (
                            <div className="flex items-center gap-4">
                                <Link 
                                    to={`/edit-story/${id}`}
                                    className="px-6 py-2 rounded-xl bg-[#D49E8D]/10 text-[#D49E8D] text-[10px] font-black uppercase tracking-widest border border-[#D49E8D]/20 hover:bg-[#D49E8D] hover:text-white transition-all shadow-sm"
                                >
                                    Edit Tale
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    className="px-6 py-2 rounded-xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Analyzer Section */}
                {story.content && (
                    <div className="px-8 md:px-12 pt-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-[2rem] bg-gradient-to-br from-[#FAF6F2] to-[#F5E6D3] border border-[#D49E8D]/20 shadow-inner relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-12 h-12 text-[#683B2B]" />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-white shadow-sm">
                                    <Sparkles className="w-4 h-4 text-[#D49E8D]" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#683B2B]">Tale Insight</h3>
                            </div>

                            {!summary ? (
                                <button 
                                    onClick={fetchSummary}
                                    disabled={summarizing}
                                    className="text-xs font-bold text-[#82574A] hover:text-[#D49E8D] transition-colors flex items-center gap-2"
                                >
                                    {summarizing ? 'Unweaving the magic...' : 'Reveal Story Essence'}
                                    <ChevronLeft className="w-3 h-3 rotate-180" />
                                </button>
                            ) : (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm italic font-medium leading-relaxed text-[#5A453B] border-l-2 border-[#D49E8D]/30 pl-4"
                                >
                                    "{summary}"
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Content Section */}
                <div className="p-8 md:px-12 md:pb-12 text-[#683B2B] text-lg leading-relaxed font-serif">
                    {story.content.split('\n').map((p, i) => p && <p key={i} className="mb-6">{p}</p>)}
                </div>

                {/* Engagement Bar */}
                <div className="px-8 py-6 bg-orange-50/30 border-t border-orange-100 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <button onClick={handleLike} className={`flex items-center gap-2 transition-all group ${liked ? 'text-red-500' : 'text-[#82574A]'}`}>
                            <Heart className={`w-7 h-7 ${liked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-black">{story.likes}</span>
                        </button>
                        <div className="flex items-center gap-2 text-[#82574A]">
                            <MessageCircle className="w-7 h-7" />
                            <span className="font-black">{comments.length}</span>
                        </div>
                    </div>
                    <button onClick={handleSaveToggle} className={`transition-all ${isSaved ? 'text-orange-500 scale-110' : 'text-[#82574A] hover:scale-110'}`}>
                        <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Comments Section */}
                <div className="p-8 md:p-12 border-t border-orange-50 bg-[#FAF6F2]/30">
                    <h3 className="text-2xl font-black text-[#683B2B] mb-8">Community Thoughts</h3>
                    
                    {user && (
                        <form onSubmit={handleComment} className="flex gap-4 mb-12">
                            <input 
                                type="text" 
                                placeholder="Share your reflection..."
                                className="flex-1 px-6 py-4 rounded-2xl bg-white border-none shadow-inner focus:ring-2 focus:ring-[#D49E8D] outline-none text-[#683B2B] font-medium"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit" className="p-4 bg-[#D49E8D] rounded-2xl text-white shadow-lg hover:bg-[#C76A55] transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    )}

                    <div className="space-y-6">
                        {comments.map((comm, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-[#D49E8D] flex-shrink-0 flex items-center justify-center overflow-hidden text-white font-black text-xs shadow-sm">
                                    {comm.user?.avatar ? (
                                        <img src={comm.user.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        (comm.user?.name || 'D').charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-black text-sm text-[#D49E8D]">{comm.user?.name || 'Dreamer'}</span>
                                        <span className="text-[10px] font-bold text-[#82574A] opacity-50">{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-[#683B2B] font-medium text-sm leading-relaxed">{comm.text}</p>
                                </div>
                            </div>
                        ))}
                        {comments.length === 0 && <p className="text-center py-10 text-[#82574A] font-bold italic opacity-40">Be the first to leave a shadow of your thought...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryDetail;
