import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StoryCard = ({ story, isOwner, onDelete }) => {
    const { user, saveStory, unsaveStory, savedStories } = useAuth();
    
    const isSaved = savedStories?.some(s => {
        const sid = typeof s === 'string' ? s : (s.id || s._id);
        return sid === (story.id || story._id);
    });

    const formatCount = (count) => {
        if (!count) return '0';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count.toString();
    };

    const handleSaveToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            toast.error('Please sign in to save stories');
            return;
        }
        if (isSaved) {
            unsaveStory(story.id || story._id);
            toast.success('Removed from Reading List');
        } else {
            saveStory(story.id || story._id);
            toast.success('Saved to Reading List!');
        }
    };

    const displayImage = story.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
    const displayCategory = story.tags?.[0] || 'Fantasy';
    const displayExcerpt = story.excerpt || (story.content?.substring(0, 100) + '...') || 'A beautiful story waiting to be discovered in the archives of StoryVerse...';

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            className="group relative bg-[#FAF9F6] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(104,59,43,0.12)] transition-all duration-500 border border-[#F0EBE5] flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <Link to={`/story/${story.id || story._id}`}>
                    <img 
                        src={displayImage} 
                        alt={story.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                </Link>
                
                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#D49E8D]/90 backdrop-blur-sm border border-white/20 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {displayCategory}
                    </span>
                </div>

                {/* Bookmark Toggle */}
                <button 
                    onClick={handleSaveToggle}
                    className="absolute top-4 right-4 text-white hover:text-[#D49E8D] transition-colors"
                >
                    <Bookmark 
                        className={`w-6 h-6 transition-all ${isSaved ? 'fill-white stroke-white' : 'stroke-[2px]'}`} 
                        strokeWidth={2}
                    />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <Link to={`/story/${story.id || story._id}`}>
                    <h3 className="text-2xl font-display font-black mb-3 leading-tight tracking-tight group-hover:text-[#D49E8D] transition-colors duration-300" 
                        style={{ color: '#381611' }}>
                        {story.title}
                    </h3>
                </Link>
                
                <p className="text-[14px] font-medium leading-relaxed mb-8 opacity-80 line-clamp-3 flex-grow" 
                   style={{ color: '#5A453B' }}>
                    {displayExcerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-[#683B2B]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D49E8D] flex items-center justify-center text-white text-xs font-black shadow-sm ring-2 ring-white overflow-hidden">
                            {story.author?.avatar || story.authorAvatar ? (
                                <img src={story.author?.avatar || story.authorAvatar} className="w-full h-full object-cover" alt="" />
                            ) : (
                                (story.authorName || story.author?.name || 'A').charAt(0).toUpperCase()
                            )}
                        </div>
                        <span className="text-[12px] font-bold tracking-tight" style={{ color: '#381611' }}>
                            {story.authorName || story.author?.name || 'Anonymous'}
                        </span>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-[#D49E8D]" />
                            <span className="text-[12px] font-bold" style={{ color: '#683B2B' }}>{formatCount(story.likes || 0)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <MessageCircle className="w-4 h-4 text-[#683B2B]" />
                            <span className="text-[12px] font-bold" style={{ color: '#683B2B' }}>{story.comments?.length || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Owner Controls */}
            {isOwner && (
                <div className="absolute bottom-20 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => { e.preventDefault(); onDelete(story.id || story._id); }}
                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                        <User className="w-4 h-4" />
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default StoryCard;
