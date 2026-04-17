import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';

const InstagramStories = () => {
    const { user } = useAuth();
    const [dailyStories, setDailyStories] = useState([]);
    const [viewingStory, setViewingStory] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newStoryImg, setNewStoryImg] = useState('');
    const [newStoryContent, setNewStoryContent] = useState('');

    useEffect(() => {
        fetchDailyStories();
    }, []);

    const fetchDailyStories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/daily`);
            if (res.ok) {
                const data = await res.json();
                setDailyStories(data);
            }
        } catch (e) { console.error('Failed to fetch daily stories', e); }
    };

    const handleCreateStory = async (e) => {
        e.preventDefault();
        if (!newStoryImg) return toast.error('An image URL is required!');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/daily`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ imageUrl: newStoryImg, content: newStoryContent })
            });
            if (res.ok) {
                toast.success('Status uploaded!');
                setIsCreating(false);
                setNewStoryImg('');
                setNewStoryContent('');
                fetchDailyStories();
            } else {
                toast.error('Failed to post story');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/daily/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                toast.success('Status deleted');
                setViewingStory(null);
                fetchDailyStories();
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="w-full relative mb-12">
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide" style={{ maxWidth: '100vw' }}>
                {user && (
                    <div className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 relative group" onClick={() => setIsCreating(true)}>
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D49E8D] flex items-center justify-center bg-white transition-transform group-hover:scale-105">
                            <Plus className="w-6 h-6" style={{ color: '#D49E8D' }} />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: '#683B2B' }}>Add Status</span>
                    </div>
                )}
                
                {dailyStories.map((group, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group" onClick={() => setViewingStory(group)}>
                        <div className="w-16 h-16 rounded-full p-[2px] transition-transform group-hover:scale-105" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                                <img src={group.user.avatar || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100'} alt={group.user.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: '#683B2B' }}>{group.user.name.split(' ')[0]}</span>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {viewingStory && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <button onClick={() => setViewingStory(null)} className="absolute top-6 right-6 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="relative w-full max-w-sm aspect-[9/16] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
                            {/* Assuming viewing the first story in their group for now. Real IG lets you tap to go to next */}
                            <img src={viewingStory.stories[0].imageUrl} alt="Status" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none"></div>
                            
                            <div className="absolute top-4 left-4 right-4 flex items-center gap-3">
                                <img src={viewingStory.user.avatar || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100'} className="w-8 h-8 rounded-full border border-white/50" />
                                <span className="text-white font-bold text-sm shadow-sm">{viewingStory.user.name}</span>
                                <span className="text-white/60 text-xs ml-auto">
                                    {Math.floor((Date.now() - new Date(viewingStory.stories[0].createdAt).getTime()) / 3600000)}h
                                </span>
                            </div>

                            {viewingStory.stories[0].content && (
                                <div className="absolute bottom-12 left-6 right-6 text-center">
                                    <p className="text-white text-lg font-bold drop-shadow-md">{viewingStory.stories[0].content}</p>
                                </div>
                            )}

                            {user && user.id === viewingStory.user._id && (
                                <button 
                                    onClick={() => handleDelete(viewingStory.stories[0]._id)}
                                    className="absolute bottom-4 right-6 text-xs font-bold uppercase text-rose-400 hover:text-rose-300"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {isCreating && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative">
                            <button onClick={() => setIsCreating(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-2xl font-black mb-6" style={{ color: '#683B2B' }}>Add Temporary Status</h3>
                            <p className="text-xs font-medium mb-6 text-slate-500">Statuses erase automatically after 24 hours.</p>
                            
                            <form onSubmit={handleCreateStory} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Image URL</label>
                                    <input type="text" required value={newStoryImg} onChange={e => setNewStoryImg(e.target.value)}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E8D]" placeholder="https://example.com/image.jpg" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Caption (Optional)</label>
                                    <input type="text" value={newStoryContent} onChange={e => setNewStoryContent(e.target.value)}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E8D]" placeholder="Living the dream..." />
                                </div>
                                <button type="submit" className="w-full py-4 rounded-xl text-white font-black uppercase text-sm mt-4 flex items-center justify-center gap-2 transition-all shadow-lg hover:opacity-90" style={{ backgroundColor: '#D49E8D' }}>
                                    <Upload className="w-4 h-4" /> Share Status
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InstagramStories;
