import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Send, X, Plus, Info, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';

const CreateStory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', content: '', tags: '', image: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.content.length < 50) {
            return toast.error("Your story is a bit too short! Make it at least 50 characters.");
        }
        
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
                    tags: formData.tags.split(',').map(tag => tag.trim())
                })
            });
            
            if (res.ok) {
                toast.success('Tale published to the stars!');
                navigate('/feed');
            } else {
                toast.error('Failed to publish story');
            }
        } catch (err) {
            toast.error('Server error. Is the backend connected?');
        }
    };

    const inputStyle = { color: '#683B2B', backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' };

    return (
        <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" style={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
            <div className="flex flex-col md:flex-row gap-12">

                {/* Main Editor */}
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-xl shadow-md" style={{ backgroundColor: '#D49E8D' }}>
                            <Plus className="w-5 h-5 text-[#FAF6F2]" />
                        </div>
                        <h1 className="text-3xl font-display font-black" style={{ color: '#683B2B' }}>Write New Tale</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="rounded-[2rem] p-8 md:p-12 backdrop-blur-md" style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1.5px solid rgba(104,59,43,0.1)', boxShadow: '0 8px 40px rgba(104,59,43,0.07)' }}>
                            <input
                                type="text"
                                placeholder="Story Title"
                                style={{ ...inputStyle, fontSize: '2.5rem', fontWeight: '900', fontFamily: "'Playfair Display', serif", marginBottom: '2rem', display: 'block', color: '#683B2B' }}
                                className="placeholder:opacity-50"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <div className="mb-6">
                                <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D49E8D' }}>Story Tags</label>
                                <input
                                    type="text"
                                    placeholder="Fantasy, Mystery, Romance..."
                                    style={{ ...inputStyle, fontSize: '0.875rem', fontWeight: '500', color: '#683B2B', display: 'block', backgroundColor: 'rgba(255,255,255,0.3)', padding: '10px', borderRadius: '8px' }}
                                    className="placeholder:opacity-50"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D49E8D' }}>Cover Image URL (Front Page)</label>
                                <input
                                    type="text"
                                    placeholder="Paste an image URL here..."
                                    style={{ ...inputStyle, fontSize: '0.875rem', fontWeight: '500', color: '#683B2B', display: 'block', backgroundColor: 'rgba(255,255,255,0.3)', padding: '10px', borderRadius: '8px' }}
                                    className="placeholder:opacity-50"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                                <p className="mt-1 text-[10px]" style={{ color: '#82574A' }}>Use an image link from Unsplash or Google for your cover.</p>
                            </div>

                            <div className="h-px mb-8" style={{ backgroundColor: 'rgba(104,59,43,0.2)' }}></div>

                            <textarea
                                placeholder="Once upon a time..."
                                style={{ ...inputStyle, minHeight: '500px', fontSize: '1.125rem', lineHeight: '1.8', resize: 'none', fontFamily: 'Merriweather, serif', color: '#683B2B', display: 'block' }}
                                className="placeholder:opacity-50"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="font-bold flex items-center gap-2 transition-colors"
                                style={{ color: '#D49E8D' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#683B2B'}
                                onMouseLeave={e => e.currentTarget.style.color = '#D49E8D'}
                            >
                                <X className="w-5 h-5" /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-[#FAF6F2] text-lg transition-all"
                                style={{ backgroundColor: '#D49E8D', boxShadow: '0 8px 24px rgba(212,158,141,0.22)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C76A55'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D49E8D'}
                            >
                                <Send className="w-5 h-5" /> Publish Story
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Tips */}
                <div className="w-full md:w-80 shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div className="p-6 rounded-3xl backdrop-blur-md" style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1.5px solid #D49E8D', boxShadow: '0 2px 12px rgba(104,59,43,0.06)' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="w-5 h-5" style={{ color: '#D49E8D' }} />
                                <h3 className="font-bold" style={{ color: '#683B2B' }}>Writing Tips</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="text-sm" style={{ color: '#82574A' }}>
                                    <span className="font-bold block mb-1" style={{ color: '#683B2B' }}>Engaging Hooks</span>
                                    Start with a sentence that demands attention.
                                </li>
                                <li className="text-sm" style={{ color: '#82574A' }}>
                                    <span className="font-bold block mb-1" style={{ color: '#683B2B' }}>Show, Don't Tell</span>
                                    Use sensory details instead of simple descriptions.
                                </li>
                                <li className="text-sm" style={{ color: '#82574A' }}>
                                    <span className="font-bold block mb-1" style={{ color: '#683B2B' }}>Short Paragraphs</span>
                                    Keep paragraphs short for better readability on mobile.
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-3xl" style={{ background: 'linear-gradient(135deg, #683B2B, #4A2A1E)' }}>
                            <h3 className="font-bold mb-2 text-[#FAF6F2]">Publishing Agreement</h3>
                            <p className="text-xs leading-relaxed mb-4" style={{ color: '#DED1BD' }}>
                                By publishing, you agree to our Community Guidelines. Keep your tales respectful and magical.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#DED1BD' }}>
                                <ShieldCheck className="w-4 h-4" /> Community First
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStory;
