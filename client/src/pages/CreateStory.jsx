import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Send, X, Plus, Info, ShieldCheck, 
    Image as ImageIcon, Link as LinkIcon, 
    Upload, Feather, Heart, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';

const CreateIllustration = () => (
    <svg width="100%" height="auto" viewBox="0 0 800 650" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-3xl">
        <defs>
            <filter id="premiumShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#4A2A1E" flood-opacity="0.22"/>
            </filter>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="agedPaper" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FDF5E8"/>
                <stop offset="100%" stop-color="#E8D0B0"/>
            </linearGradient>
            <linearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#D49E8D"/>
                <stop offset="100%" stop-color="#B9745E"/>
            </linearGradient>
            <linearGradient id="quillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#A67B5B"/>
                <stop offset="100%" stop-color="#683B2B"/>
            </linearGradient>
        </defs>

        {/* --- BOTANICAL BACKGROUND --- */}
        <g opacity="0.5">
            <path d="M120 500 Q150 350 100 250" stroke="#8E7DAB" stroke-width="2" fill="none" />
            <circle cx="100" cy="250" r="4" fill="#A892C7" />
            <circle cx="105" cy="265" r="3" fill="#A892C7" />
            
            <path d="M700 500 Q650 350 720 200" stroke="#5A7040" stroke-width="1.5" fill="none" />
            <circle cx="720" cy="200" r="3" fill="#FAF6F2" stroke="#E8D0B0" stroke-width="0.5" />
        </g>

        <g filter="url(#premiumShadow)">
            {/* Stack of papers with variety */}
            <rect x="220" y="120" width="380" height="480" rx="4" fill="#D4B896" transform="rotate(10 410 360)"/>
            <rect x="200" y="100" width="380" height="480" rx="2" fill="#E8D0B0" transform="rotate(-4 390 340)"/>
            <rect x="230" y="70" width="340" height="450" rx="1" fill="url(#agedPaper)" transform="rotate(2 400 295)"/>
            <rect x="240" y="60" width="340" height="450" rx="1" fill="#FAF6F2" transform="rotate(0 410 285)"/>
            
            {/* Written text on top paper */}
            <g transform="translate(280, 150)">
                <text font-family="serif" font-size="34" fill="#683B2B" font-style="italic" opacity="0.65">The best stories</text>
                <text x="40" y="55" font-family="serif" font-size="34" fill="#683B2B" font-style="italic" opacity="0.65">come from</text>
                <text x="50" y="110" font-family="serif" font-size="34" fill="#683B2B" font-style="italic" opacity="0.65">the heart.</text>
                
                <path d="M160 170 Q160 155 175 155 Q190 155 190 170 Q190 190 160 210 Q130 190 130 170 Q130 155 145 155 Q160 155 160 170Z" 
                    fill="none" stroke="#D49E8D" stroke-width="2.5" opacity="0.4"/>
            </g>
        </g>

        {/* --- FLORAL OVERLAY --- */}
        {/* Large Aesthetic Roses */}
        <g transform="translate(180, 480) scale(0.7)">
            <path d="M0 0 Q20 -30 40 0 Q60 -30 80 0 Q60 30 40 60 Q20 30 0 0Z" fill="url(#roseGrad)" opacity="0.9" />
            <circle cx="40" cy="15" r="15" fill="#FAF6F2" opacity="0.2" />
        </g>
        
        <g transform="translate(580, 120) rotate(15) scale(0.5)">
            <path d="M0 0 Q20 -30 40 0 Q60 -30 80 0 Q60 30 40 60 Q20 30 0 0Z" fill="url(#roseGrad)" opacity="0.8" />
        </g>

        {/* Clusters of Baby's Breath */}
        <g fill="white" stroke="#E8D0B0" stroke-width="0.3" opacity="0.8">
            <circle cx="210" cy="420" r="4"/>
            <circle cx="230" cy="410" r="3"/>
            <circle cx="220" cy="435" r="3.5"/>
            
            <circle cx="620" cy="480" r="4"/>
            <circle cx="640" cy="470" r="3"/>
        </g>

        {/* --- THE INK & QUILL --- */}
        <g filter="url(#premiumShadow)">
            <path d="M640 460 Q640 500 680 505 Q720 505 740 495 L740 410 Q710 400 680 405 Q640 410 640 460 Z" fill="#0F0A06"/>
            <ellipse cx="690" cy="410" rx="45" ry="18" fill="#1A120B"/>
            <ellipse cx="690" cy="405" rx="28" ry="12" fill="#B08D57" stroke="#8B6A40" stroke-width="1"/>
            
            <g transform="rotate(-22 690 400)">
                <path d="M690 400 Q705 250 780 80" stroke="#3D2510" stroke-width="4" stroke-linecap="round"/>
                <path d="M780 80 Q730 110 710 230 Q720 320 690 400 Q680 340 660 230 Q670 110 780 80" fill="url(#quillGrad)" opacity="0.95"/>
            </g>
        </g>

        {/* --- SPARKLES & MAGIC --- */}
        <g filter="url(#softGlow)" fill="#D49E8D" opacity="0.4">
            <circle cx="150" cy="150" r="3"/>
            <circle cx="700" cy="100" r="4"/>
            <circle cx="300" cy="550" r="2"/>
            <circle cx="750" cy="500" r="2.5"/>
        </g>
    </svg>
);

const CreateStory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', content: '', tags: '', image: '' });
    const [imageType, setImageType] = useState('url'); // 'url' or 'file'
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image is too large! Please use a file under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.content.length < 50) {
            return toast.error("Your story is a bit too short! Make it at least 50 characters.");
        }
        
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    image: formData.image,
                    tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t)
                })
            });
            
            if (res.ok) {
                toast.success('Tale published to the stars!');
                navigate('/profile');
            } else {
                toast.error('Failed to publish story');
            }
        } catch (err) {
            toast.error('Server error. Is the backend connected?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pb-24 relative overflow-hidden" style={{ backgroundColor: 'transparent', fontFamily: "'Lora', serif" }}>
            <div className="relative z-10">
                {/* --- HEADER SECTION --- */}
                <header className="relative pt-40 pb-20 px-6 lg:px-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-left z-10">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-block px-4 py-1.5 rounded-full bg-[#D49E8D]/10 border border-[#D49E8D]/20 mb-6"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D49E8D]">
                                    ✨ Your Story, Your World
                                </span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight"
                                style={{ color: '#683B2B', fontFamily: "'Marcellus', serif" }}
                            >
                                Create a Tale <br/>
                                <span style={{ color: '#D49E8D' }}>From Your Imagination.</span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl max-w-lg leading-relaxed mb-10"
                                style={{ color: '#5A453B' }}
                            >
                                Every great story begins with a single thought. Bring your imagination to life and share your tale with the world.
                            </motion.p>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1 }}
                            className="flex-1 relative hidden lg:block"
                        >
                            <CreateIllustration />
                        </motion.div>
                    </div>
                </header>

                {/* --- EDITOR SECTION --- */}
                <main className="max-w-7xl mx-auto px-6 lg:px-20">
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar Tips */}
                        <div className="w-full lg:w-80 shrink-0 order-2 lg:order-1">
                            <div className="sticky top-32 space-y-8">
                                <div className="p-8 rounded-[2.5rem] bg-white shadow-sm border border-[#683B2B]/5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Feather className="w-5 h-5 text-[#D49E8D]" />
                                        <h3 className="font-bold text-[#683B2B]">Writing Tips</h3>
                                    </div>
                                    <ul className="space-y-6">
                                        <li className="text-sm leading-relaxed" style={{ color: '#82574A' }}>
                                            <span className="font-bold block mb-1 text-[#683B2B]">Engaging Hooks</span>
                                            Start with a sentence that demands attention.
                                        </li>
                                        <li className="text-sm leading-relaxed" style={{ color: '#82574A' }}>
                                            <span className="font-bold block mb-1 text-[#683B2B]">Show, Don't Tell</span>
                                            Use sensory details instead of simple descriptions.
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-[#683B2B] text-white overflow-hidden relative group">
                                    <Sparkles className="absolute -top-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                                    <h3 className="font-bold mb-3 relative z-10">Community Rules</h3>
                                    <p className="text-xs leading-relaxed opacity-70 mb-6 relative z-10">
                                        By publishing, you agree to our Guidelines. Keep your tales respectful and magical.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest relative z-10" style={{ color: '#D49E8D' }}>
                                        <ShieldCheck className="w-4 h-4" /> Safety First
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Editor Main */}
                        <div className="flex-grow order-1 lg:order-2">
                            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-[#683B2B]/5">
                                <input
                                    type="text"
                                    placeholder="Enter your story title..."
                                    className="w-full text-4xl md:text-6xl font-display font-bold mb-10 border-none focus:ring-0 placeholder:opacity-20 text-[#683B2B]"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#D49E8D] mb-4">Category Tags</label>
                                        <input 
                                            type="text"
                                            placeholder="Fantasy, Romance, Mystery..."
                                            className="w-full px-6 py-4 rounded-2xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#D49E8D]/20 text-sm font-medium text-[#683B2B]"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#D49E8D] mb-4">Cover Image</label>
                                        <div className="flex items-center gap-2 mb-3">
                                            <button 
                                                type="button"
                                                onClick={() => setImageType('file')}
                                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${imageType === 'file' ? 'bg-[#D49E8D] text-white' : 'bg-[#FAF6F2] text-[#82574A]'}`}
                                            >
                                                Upload File
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setImageType('url')}
                                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${imageType === 'url' ? 'bg-[#D49E8D] text-white' : 'bg-[#FAF6F2] text-[#82574A]'}`}
                                            >
                                                Image URL
                                            </button>
                                        </div>
                                        
                                        {imageType === 'url' ? (
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D49E8D]" />
                                                <input 
                                                    type="text"
                                                    placeholder="Paste image link here..."
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#D49E8D]/20 text-sm font-medium text-[#683B2B]"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative h-[52px]">
                                                <input 
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#FAF6F2] text-[#82574A] text-sm font-medium border-2 border-dashed border-[#D49E8D]/30 group-hover:border-[#D49E8D] transition-all">
                                                    <Upload className="w-4 h-4 text-[#D49E8D]" />
                                                    {formData.image && formData.image.startsWith('data:') ? 'Image selected!' : 'Choose an image file'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-[#683B2B]/5 mb-12"></div>

                                <textarea
                                    placeholder="Once upon a time..."
                                    className="w-full min-h-[600px] text-lg leading-relaxed border-none focus:ring-0 placeholder:opacity-20 text-[#683B2B] resize-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                ></textarea>

                                <div className="flex items-center justify-between mt-12 pt-12 border-t border-[#683B2B]/5">
                                    <button 
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="text-sm font-black uppercase tracking-widest text-[#82574A] hover:text-[#683B2B] flex items-center gap-2 transition-all"
                                    >
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-12 py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 shadow-2xl transition-all ${isSubmitting ? 'bg-[#D49E8D]/50 cursor-wait' : 'bg-[#D49E8D] hover:bg-[#C76A55] hover:scale-105 active:scale-95'}`}
                                    >
                                        <Send className="w-4 h-4" /> 
                                        {isSubmitting ? 'Publishing...' : 'Publish Tale'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>

            {/* Background Decorative Accents */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#D49E8D]/5 blur-[150px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#683B2B]/5 blur-[150px] -z-10 pointer-events-none"></div>
        </div>
    );
};

export default CreateStory;
