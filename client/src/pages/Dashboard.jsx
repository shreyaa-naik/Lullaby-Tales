import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Heart, MessageCircle, Star, Plus, Settings, ChevronRight, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [userStories, setUserStories] = useState([]);

    const fetchStories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/me`, {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setUserStories(data);
        } catch(e) { console.error(e); }
    };

    useEffect(() => {
        fetchStories();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                toast.success('Story deleted successfully');
                fetchStories(); // Refresh list
            } else {
                toast.error('Failed to delete story');
            }
        } catch (err) {
            toast.error('Server error');
        }
    };

    return (
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ minHeight: '100vh' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: '#683B2B' }}>Writer Dashboard</h1>
                    <p className="font-medium" style={{ color: '#82574A' }}>Manage your tales and track your influence.</p>
                </div>
                <Link to="/create-story" 
                    className="px-8 py-3.5 gap-2 shadow-lg rounded-2xl flex items-center font-bold text-[#FAF6F2] transition-colors"
                    style={{ backgroundColor: '#D49E8D' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C76A55'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D49E8D'}
                >
                    <Plus className="w-5 h-5" /> Write New Story
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Stories', value: userStories.length, icon: <BookOpen className="w-5 h-5" style={{ color: '#D49E8D' }} />, bg: 'rgba(250,246,242,0.8)' },
                    { label: 'Total Likes', value: userStories.reduce((n,s) => n + (s.likes||0), 0), icon: <Heart className="w-5 h-5" style={{ color: '#D49E8D' }} />, bg: 'rgba(250,246,242,0.8)' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-3xl border shadow-sm flex items-center gap-4 backdrop-blur-md"
                         style={{ backgroundColor: stat.bg, borderColor: 'rgba(104,59,43,0.1)' }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: '#FAF6F2', borderColor: '#DED1BD' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#683B2B', opacity: 0.7 }}>{stat.label}</p>
                            <p className="text-2xl font-bold" style={{ color: '#683B2B' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stories List */}
            <div className="rounded-[2.5rem] border shadow-xl overflow-hidden backdrop-blur-md"
                 style={{ backgroundColor: 'rgba(250,246,242,0.8)', borderColor: 'rgba(104,59,43,0.1)' }}>
                <div className="p-8 border-b flex items-center justify-between" style={{ borderColor: 'rgba(104,59,43,0.1)' }}>
                    <h2 className="text-xl font-bold" style={{ color: '#683B2B' }}>Your Published Tales</h2>
                    <button className="text-sm font-bold flex items-center gap-1 transition-colors hover:opacity-100" style={{ color: '#82574A', opacity: 0.8 }}>
                        See all <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(104,59,43,0.02)' }}>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest" style={{ color: '#82574A' }}>Story Title</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest" style={{ color: '#82574A' }}>Date</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest" style={{ color: '#82574A' }}>Status</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest" style={{ color: '#82574A' }}>Stats</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-right" style={{ color: '#82574A' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userStories.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center" style={{ color: '#82574A' }}>
                                        You haven't written any tales yet! Click "Write New Story" to get started.
                                    </td>
                                </tr>
                            ) : userStories.map((story) => (
                                <tr key={story._id || story.id} className="border-t transition-colors group" style={{ borderColor: 'rgba(104,59,43,0.05)' }}>
                                    <td className="p-6">
                                        <p className="font-bold transition-colors" style={{ color: '#683B2B' }}>{story.title}</p>
                                    </td>
                                    <td className="p-6 text-sm font-medium" style={{ color: '#82574A' }}>{new Date(story.createdAt || story.date).toLocaleDateString()}</td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full"
                                              style={{ backgroundColor: '#DED1BD', color: '#683B2B' }}>
                                            {story.status || 'Published'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3.5 h-3.5" style={{ fill: '#D49E8D', color: '#D49E8D' }} />
                                                <span className="text-xs font-bold" style={{ color: '#683B2B' }}>{story.likes || 0}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link to={`/story/${story._id || story.id}`} title="Read Story" className="p-2 rounded-lg transition-all shadow-sm border border-transparent hover:bg-white text-slate-400 hover:text-slate-900">
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                            <Link to={`/edit-story/${story._id || story.id}`} title="Edit Story" className="p-2 rounded-lg transition-all shadow-sm border border-transparent hover:bg-white text-slate-400 hover:text-indigo-600">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(story._id || story.id)}
                                                title="Delete Story"
                                                className="p-2 rounded-lg transition-all shadow-sm border border-transparent hover:bg-white text-slate-400 hover:text-rose-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Table Replacement */}
                <div className="md:hidden divide-y divide-slate-100">
                    {userStories.length === 0 ? (
                        <div className="p-8 text-center" style={{ color: '#82574A' }}>
                            No stories yet.
                        </div>
                    ) : userStories.map((story) => (
                        <div key={story._id || story.id} className="p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg" style={{ color: '#683B2B' }}>{story.title}</h3>
                                    <p className="text-xs font-medium" style={{ color: '#82574A' }}>{new Date(story.createdAt || story.date).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full"
                                      style={{ backgroundColor: '#DED1BD', color: '#683B2B' }}>
                                    {story.status || 'Published'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Heart className="w-3.5 h-3.5" style={{ fill: '#D49E8D', color: '#D49E8D' }} />
                                    <span className="text-xs font-bold" style={{ color: '#683B2B' }}>{story.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link to={`/edit-story/${story._id || story.id}`} className="p-2.5 bg-white rounded-xl border border-slate-100 text-slate-500">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(story._id || story.id)} className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <Link to={`/story/${story._id || story.id}`} className="p-2.5 bg-slate-900 rounded-xl text-white">
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
