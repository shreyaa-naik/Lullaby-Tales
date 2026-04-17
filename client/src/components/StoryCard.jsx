import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, User, Eye, Bookmark, BookmarkCheck, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BG      = 'rgba(250, 246, 242, 0.8)';
const SOFT    = '#DED1BD';
const BRAND   = '#D49E8D';
const TEXT_H  = '#683B2B';
const TEXT_B  = '#82574A';
const BORDER  = 'rgba(104, 59, 43, 0.15)';

const StoryCard = ({ story, isOwner, onDelete }) => {
    const { user, saveStory, unsaveStory, savedStories } = useAuth();
    
    // Check if the story is already saved
    // savedStories might contain strings (from AuthContext) or objects (from Profile)
    const isSaved = savedStories?.some(s => {
        const sid = typeof s === 'string' ? s : (s.id || s._id);
        return sid === (story.id || story._id);
    });

    const handleSaveToggle = (e) => {
        e.preventDefault(); // Prevent linking if the button is within a link or something
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

    return (
        <motion.div
            style={{ perspective: 1200 }}
            className="group w-full max-w-sm mx-auto cursor-pointer"
        >
            <motion.div
                whileHover={{ 
                    y: -15, 
                    rotateX: 8, 
                    rotateY: -8, 
                    scale: 1.02, 
                    boxShadow: '0 25px 50px -12px rgba(104, 59, 43, 0.25)' 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full h-full transform-gpu"
            >
                {/* Cover */}
                <div
                    className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-5 shadow-lg backdrop-blur-sm"
                    style={{ backgroundColor: SOFT, border: `1.5px solid ${BORDER}` }}
                >
                    {story.image ? (
                        <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-6 text-center shadow-inner"
                             style={{ background: `linear-gradient(135deg, ${SOFT}, #FAF6F2)` }}>
                            <span className="font-display font-black text-4xl leading-tight uppercase tracking-tighter opacity-30"
                                  style={{ color: TEXT_H }}>
                                {story.title}
                            </span>
                        </div>
                    )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2A1E]/80 via-[#683B2B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Owner Controls */}
                {isOwner && (
                    <div className="absolute top-5 left-5 z-20 flex gap-2">
                        <Link 
                            to={`/edit-story/${story.id || story._id}`}
                            className="w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-all bg-white/90 text-indigo-600 shadow-lg hover:scale-110"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete && onDelete(story.id || story._id);
                            }}
                            className="w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-all bg-white/90 text-rose-600 shadow-lg hover:scale-110"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Rating & tag badges */}
                <div className={`absolute top-5 ${isOwner ? 'right-20' : 'left-5'} flex flex-col gap-2`}>

                    {story.tags?.[0] && (
                        <div className="px-3 py-1.5 rounded-full shadow-md backdrop-blur-md"
                             style={{ backgroundColor: BRAND }}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FAF6F2]">{story.tags[0]}</span>
                        </div>
                    )}
                </div>

                {/* Bookmark */}
                <div className="absolute top-5 right-5 z-10">
                    <button
                        onClick={handleSaveToggle}
                        className="w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 shadow-md group/save hover:scale-105"
                        style={{ 
                            backgroundColor: isSaved ? BRAND : 'rgba(250, 246, 242, 0.4)', 
                            borderColor: isSaved ? BRAND : 'rgba(250, 246, 242, 0.6)', 
                            color: isSaved ? '#FAF6F2' : TEXT_H 
                        }}
                    >
                        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                </div>

                {/* Read action (hover reveal) */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <Link
                        to={`/story/${story.id || story._id}`}
                        className="w-full h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-xl transition-colors"
                        style={{ backgroundColor: BG, color: TEXT_H }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FAF6F2'; e.currentTarget.style.color = BRAND; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = BG; e.currentTarget.style.color = TEXT_H; }}
                    >
                        Read Story
                    </Link>
                </div>
            </div>

            {/* Info */}
            <div className="px-2">
                <Link to={`/story/${story.id || story._id}`}>
                    <h3 className="text-xl font-display font-black mb-1 truncate transition-colors duration-300"
                        style={{ color: TEXT_H }}
                        onMouseEnter={e => e.currentTarget.style.color = BRAND}
                        onMouseLeave={e => e.currentTarget.style.color = TEXT_H}
                    >
                        {story.title}
                    </h3>
                </Link>
                <p className="text-[11px] font-medium mb-3 line-clamp-2" style={{ color: '#82574A', opacity: 0.8 }}>
                    {story.content || 'A tale yet to be unraveled...'}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center overflow-hidden"
                             style={{ backgroundColor: SOFT, border: `1.5px solid ${BORDER}` }}>
                            <User className="w-3.5 h-3.5" style={{ color: TEXT_H }} />
                        </div>
                        <Link to={story.author?._id ? `/user/${story.author._id}` : (story.author || '')} className="text-xs font-bold hover:underline" style={{ color: TEXT_B }}>
                            {story.authorName || 'Adventurer'}
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase" style={{ color: TEXT_B }}>
                            <Eye className="w-3 h-3" /> {story.views || 0}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase" style={{ color: '#D49E8D' }}>
                            <Star className="w-3 h-3 fill-[#D49E8D]" /> {story.averageRating || 0}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase" style={{ color: BORDER }}>
                            <Heart className="w-3 h-3" style={{ fill: BORDER }} /> {story.likes || 0}
                        </div>
                    </div>
                </div>
            </div>
            </motion.div>
        </motion.div>
    );
};

export default StoryCard;
