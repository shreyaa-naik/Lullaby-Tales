import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Heart, Bookmark, MessageCircle, Share2, 
    ChevronLeft, Star, Clock, Eye 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../config';

const StoryDetail = () => {
    const { id } = useParams();
    const { user, saveStory, unsaveStory, savedStories } = useAuth();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchStoryAndComments = async () => {
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
                } else {
                    setError('Tale not found');
                }

                const commRes = await fetch(`${API_BASE_URL}/api/comments/${id}`);
                if (commRes.ok) {
                    setComments(await commRes.json());
                }
            } catch (err) {
                setError("Archives unreachable");
            } finally {
                setLoading(false);
            }
        };
        fetchStoryAndComments();
    }, [id]);

    const handleLike = async () => {
        if (!user) return toast.error('Please sign in to like');
        
        // Optimistic UI
        const willBeLiked = !liked;
        setLiked(willBeLiked);
        setStory(prev => ({ ...prev, likes: willBeLiked ? prev.likes + 1 : prev.likes - 1 }));

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}/like`, {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setStory(prev => ({ ...prev, likes: data.likes }));
                setLiked(data.isLiked);
            }
        } catch (err) {
            setLiked(!willBeLiked);
        }
    };

    const isSaved = savedStories?.some(s => (s._id || s.id) === id);

    const handleSaveToggle = () => {
        if (!user) return toast.error('Please sign in to save');
        if (isSaved) {
            unsaveStory(id);
            toast.success('Removed from bookmark');
        } else {
            saveStory(id);
            toast.success('Added to bookmark');
        }
    };

    if (loading) return <div className="pt-40 text-center text-xl">Entering the archives...</div>;
    if (error) return <div className="pt-40 text-center text-xl text-red-500">{error}</div>;

    return (
        <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
            <Link to="/library" className="flex items-center gap-2 mb-8 text-[#82574A] hover:translate-x-[-4px] transition-transform">
                <ChevronLeft className="w-5 h-5" /> Back to Library
            </Link>

            <article className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-orange-50">
                {/* Header */}
                <div className="p-8 md:p-12 border-b border-orange-50">
                    <div className="flex gap-2 mb-4">
                        {story.tags?.map(t => (
                            <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-[#D49E8D] bg-orange-50/50 px-3 py-1 rounded-full">
                                {t}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#683B2B] mb-6 leading-tight">
                        {story.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-[#82574A]">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(story.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {story.views} Views</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                    <div className="prose prose-stone max-w-none text-lg leading-relaxed text-[#683B2B]">
                        {story.content.split('\n').map((para, i) => para && <p key={i} className="mb-6">{para}</p>)}
                    </div>
                </div>

                {/* Interactivity */}
                <div className="p-8 border-t border-orange-50 flex items-center justify-between bg-orange-50/20">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center gap-2 transition-all ${liked ? 'text-red-500' : 'text-[#82574A]'}`}
                        >
                            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                            <span className="font-bold">{story.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-[#82574A]">
                            <MessageCircle className="w-6 h-6" />
                            <span className="font-bold">{comments.length}</span>
                        </button>
                    </div>
                    <button 
                        onClick={handleSaveToggle}
                        className={`transition-colors ${isSaved ? 'text-orange-500' : 'text-[#82574A]'}`}
                    >
                        <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </article>
        </div>
    );
};

export default StoryDetail;
