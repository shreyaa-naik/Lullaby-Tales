import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Info, ShieldCheck, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';

const EditStory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', content: '', tags: '', image: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/stories/${id}`);
                const story = await res.json();
                if (story) {
                    setFormData({
                        title: story.title,
                        content: story.content,
                        tags: story.tags?.join(', ') || '',
                        image: story.image || ''
                    });
                }
            } catch (err) {
                toast.error("Failed to load story data");
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
                method: 'PUT',
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
                toast.success('Tale updated and preserved!');
                navigate('/profile');
            } else {
                const errorData = await res.json();
                toast.error(`Error: ${errorData.msg || 'Update failed'}`);
            }
        } catch (err) {
            console.error("Update request failed:", err);
            toast.error(`System error: ${err.message}`);
        }
    };

    const inputStyle = { color: '#683B2B', backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' };

    if (loading) return <div className="pt-40 text-center font-black" style={{ color: '#D49E8D' }}>Loading your tale...</div>;

    return (
        <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" style={{ minHeight: '100vh' }}>
            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-xl shadow-md" style={{ backgroundColor: '#D49E8D' }}>
                            <Edit3 className="w-5 h-5 text-[#FAF6F2]" />
                        </div>
                        <h1 className="text-3xl font-display font-black" style={{ color: '#683B2B' }}>Edit Your Tale</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="rounded-[2rem] p-8 md:p-12 backdrop-blur-md" style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1.5px solid rgba(104,59,43,0.1)', boxShadow: '0 8px 40px rgba(104,59,43,0.07)' }}>
                            <input
                                type="text"
                                placeholder="Story Title"
                                style={{ ...inputStyle, fontSize: '2.5rem', fontWeight: '900', fontFamily: "'Playfair Display', serif", marginBottom: '2rem', display: 'block' }}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <div className="mb-6">
                                <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D49E8D' }}>Story Tags</label>
                                <input
                                    type="text"
                                    placeholder="Fantasy, Romance..."
                                    style={{ ...inputStyle, fontSize: '0.875rem', fontWeight: '500', color: '#683B2B', backgroundColor: 'rgba(255,255,255,0.3)', padding: '10px', borderRadius: '8px' }}
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D49E8D' }}>Cover Image URL (Front Page)</label>
                                <input
                                    type="text"
                                    style={{ ...inputStyle, fontSize: '0.875rem', fontWeight: '500', color: '#683B2B', backgroundColor: 'rgba(255,255,255,0.3)', padding: '10px', borderRadius: '8px' }}
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            <div className="h-px mb-8" style={{ backgroundColor: 'rgba(104,59,43,0.2)' }}></div>

                            <textarea
                                placeholder="Once upon a time..."
                                style={{ ...inputStyle, minHeight: '500px', fontSize: '1.125rem', lineHeight: '1.8', resize: 'none' }}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between">
                            <button type="button" onClick={() => navigate(-1)} className="font-bold flex items-center gap-2" style={{ color: '#D49E8D' }}>
                                <X className="w-5 h-5" /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-[#FAF6F2] text-lg transition-all"
                                style={{ backgroundColor: '#D49E8D', boxShadow: '0 8px 24px rgba(212,158,141,0.22)' }}
                            >
                                <Save className="w-5 h-5" /> Update Tale
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditStory;
