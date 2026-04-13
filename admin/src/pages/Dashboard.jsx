import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Users, BookOpen, Star, AlertCircle, RefreshCw, Palette, Save } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Config state
    const [config, setConfig] = useState({
        siteName: 'Lullaby Tales',
        heroSubtitle: '',
        brandColor: '#D49E8D'
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, storiesRes, configRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/auth/users`),
                axios.get(`${API_BASE_URL}/api/stories`),
                axios.get(`${API_BASE_URL}/api/config`)
            ]);
            setUsers(usersRes.data);
            setStories(storiesRes.data);
            if(configRes.data) setConfig(configRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
        setLoading(false);
    };

    const handleSaveConfig = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/config`, config);
            toast.success('Website appearance updated instantly!');
        } catch (error) {
            toast.error('Failed to save config.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalRatings = stories.reduce((sum, story) => sum + (story.likes || 0), 0);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                    <div className="flex gap-4 items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
                            <p className="text-slate-500">Live statistics and user moderation.</p>
                        </div>
                        <div className="ml-8 flex bg-slate-800 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>Overview</button>
                            <button onClick={() => setActiveTab('appearance')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'appearance' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}><Palette className="w-4 h-4"/> Design Editor</button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                        <button onClick={() => { localStorage.removeItem('adminAuth'); window.location.href='/'; }} className="px-4 py-2 border border-rose-500 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-slate-900 transition font-bold text-sm">
                            Lock Panel
                        </button>
                    </div>
                </div>

                {activeTab === 'appearance' ? (
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-3xl">
                        <Toaster />
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Palette className="text-indigo-400"/> Website Design Matrix</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Platform Title</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" value={config.siteName} onChange={e => setConfig({...config, siteName: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Hero Welcome Subtitle</label>
                                <textarea rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" value={config.heroSubtitle} onChange={e => setConfig({...config, heroSubtitle: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Primary Accent Color (Hex code)</label>
                                <div className="flex gap-4">
                                    <input type="color" className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer" value={config.brandColor} onChange={e => setConfig({...config, brandColor: e.target.value})} />
                                    <input type="text" className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono" value={config.brandColor} onChange={e => setConfig({...config, brandColor: e.target.value})} />
                                </div>
                            </div>
                            <button onClick={handleSaveConfig} className="mt-4 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition w-full justify-center">
                                <Save className="w-5 h-5"/> Push Live to Client Website
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-500/10 rounded-xl"><Users className="w-6 h-6 text-blue-400" /></div>
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Total Registered</span>
                        </div>
                        <div className="text-4xl font-black text-white">{users.length}</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-emerald-500/10 rounded-xl"><BookOpen className="w-6 h-6 text-emerald-400" /></div>
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Published Stories</span>
                        </div>
                        <div className="text-4xl font-black text-white">{stories.length}</div>
                    </div>
                </div>

                {/* Registered Users Section */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Registered Users</h2>
                        <span className="text-xs font-bold text-slate-500 uppercase px-3 py-1 bg-slate-900 rounded-full">{users.length} Total</span>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-slate-400 text-sm">ID</th>
                                    <th className="px-6 py-4 font-medium text-slate-400 text-sm">Name</th>
                                    <th className="px-6 py-4 font-medium text-slate-400 text-sm">Email</th>
                                    <th className="px-6 py-4 font-medium text-slate-400 text-sm">Joined At</th>
                                    <th className="px-6 py-4 font-medium text-right text-slate-400 text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr><td colSpan="5" className="p-6 text-center text-slate-500">No users found. Wait for someone to register!</td></tr>
                                ) : (
                                    users.map(u => (
                                        <tr key={u._id} className="border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition">
                                            <td className="px-6 py-4 text-xs font-mono text-slate-500">{u._id}</td>
                                            <td className="px-6 py-4 text-white font-bold">{u.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{u.email}</td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-rose-400 hover:text-rose-300 font-medium text-sm">Suspend</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden divide-y divide-slate-700">
                         {users.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No users found.</div>
                         ) : (
                            users.map(u => (
                                <div key={u._id} className="p-6 flex flex-col gap-4">
                                     <div className="flex justify-between items-start">
                                         <div>
                                             <h3 className="font-bold text-white text-lg">{u.name}</h3>
                                             <p className="text-sm text-slate-400">{u.email}</p>
                                         </div>
                                         <p className="text-[10px] text-slate-500 font-mono">{u._id.slice(-6).toUpperCase()}</p>
                                     </div>
                                     <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-700/50">
                                         <span className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                                         <button className="text-xs font-black uppercase tracking-widest text-rose-500">Suspend</button>
                                     </div>
                                </div>
                            ))
                         )}
                    </div>
                </div>
                </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
