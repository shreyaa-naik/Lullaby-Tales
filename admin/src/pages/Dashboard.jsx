import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Users, BookOpen, Star, AlertCircle, RefreshCw, Palette, Save, Sun, Moon } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode, toggleTheme } = useTheme();
    
    // Config state
    const [config, setConfig] = useState({
        siteName: 'Lullaby Tales',
        heroSubtitle: '',
        brandColor: '#D49E8D'
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const masterConfig = {
                headers: { 'x-master-key': 'StoryVerse_Master_2026' }
            };
            const [usersRes, storiesRes, configRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admin/users`, masterConfig),
                axios.get(`${API_BASE_URL}/api/admin/stories`, masterConfig),
                axios.get(`${API_BASE_URL}/api/config`, masterConfig)
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

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            const masterConfig = {
                headers: { 'x-master-key': 'StoryVerse_Master_2026' }
            };
            await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, masterConfig);
            toast.success('User deleted successfully!');
            fetchData();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error('Failed to delete user.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalRatings = stories.reduce((sum, story) => sum + (story.likes || 0), 0);

    return (
        <div className="min-h-screen bg-[#FFF5EC] dark:bg-slate-950 text-slate-700 dark:text-slate-300 p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex gap-4 items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
                            <p className="text-slate-500">Live statistics and user moderation.</p>
                            <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2 font-mono bg-emerald-100 dark:bg-emerald-400/10 inline-block px-2 py-1 rounded">Logged in as: <span className="font-bold">{localStorage.getItem('adminUser') || 'admin'}</span></p>
                        </div>
                        <div className="ml-8 flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-[#FFF9F3] dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Overview</button>
                            <button onClick={() => setActiveTab('appearance')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'appearance' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><Palette className="w-4 h-4"/> Design Editor</button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                        <button onClick={() => { localStorage.removeItem('adminAuth'); localStorage.removeItem('adminUser'); window.location.href='/'; }} className="px-4 py-2 border border-rose-500 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition font-bold text-sm">
                            Lock Panel
                        </button>
                    </div>
                </div>

                {activeTab === 'appearance' ? (
                    <div className="bg-[#FFF9F3] dark:bg-slate-800 p-8 rounded-2xl border border-orange-100 dark:border-slate-700 max-w-3xl shadow-sm">
                        <Toaster />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3"><Palette className="text-indigo-500 dark:text-indigo-400"/> Website Design Matrix</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">Platform Title</label>
                                <input type="text" className="w-full bg-[#FFF5EC] dark:bg-slate-900 border border-orange-100 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-400" value={config.siteName} onChange={e => setConfig({...config, siteName: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">Hero Welcome Subtitle</label>
                                <textarea rows="3" className="w-full bg-[#FFF5EC] dark:bg-slate-900 border border-orange-100 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-400" value={config.heroSubtitle} onChange={e => setConfig({...config, heroSubtitle: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">Primary Accent Color (Hex code)</label>
                                <div className="flex gap-4">
                                    <input type="color" className="w-14 h-14 bg-[#FFF5EC] dark:bg-slate-900 border border-orange-100 dark:border-slate-700 rounded-lg cursor-pointer p-1" value={config.brandColor} onChange={e => setConfig({...config, brandColor: e.target.value})} />
                                    <input type="text" className="flex-1 bg-[#FFF5EC] dark:bg-slate-900 border border-orange-100 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-400 font-mono" value={config.brandColor} onChange={e => setConfig({...config, brandColor: e.target.value})} />
                                </div>
                            </div>
                            <button onClick={handleSaveConfig} className="mt-4 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition w-full justify-center shadow-lg shadow-indigo-500/30">
                                <Save className="w-5 h-5"/> Push Live to Client Website
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#FFF9F3] dark:bg-slate-800 p-6 rounded-2xl border border-orange-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-orange-500/10 rounded-xl"><Users className="w-6 h-6 text-orange-600 dark:text-orange-400" /></div>
                            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">Total Registered</span>
                        </div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white">{users.length}</div>
                    </div>
                    <div className="bg-[#FFF9F3] dark:bg-slate-800 p-6 rounded-2xl border border-orange-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-emerald-500/10 rounded-xl"><BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /></div>
                            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">Published Stories</span>
                        </div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white">{stories.length}</div>
                    </div>
                </div>

                {/* Registered Users Section */}
                <div className="bg-[#FFF9F3] dark:bg-slate-800 rounded-2xl border border-orange-100 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-orange-100 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registered Users</h2>
                        <span className="text-xs font-bold text-orange-500 dark:text-slate-500 uppercase px-3 py-1 bg-[#FFF5EC] dark:bg-slate-900 rounded-full">{users.length} Total</span>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FFF5EC] dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">ID</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Name</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Email</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Joined At</th>
                                    <th className="px-6 py-4 font-medium text-right text-slate-500 dark:text-slate-400 text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr><td colSpan="5" className="p-6 text-center text-slate-400 dark:text-slate-500">No users found. Wait for someone to register!</td></tr>
                                ) : (
                                    users.map(u => (
                                        <tr key={u._id} className="border-b border-orange-50 dark:border-slate-700 last:border-0 hover:bg-[#FFF5EC] dark:hover:bg-slate-700/50 transition">
                                            <td className="px-6 py-4 text-xs font-mono text-slate-400 dark:text-slate-500">{u._id}</td>
                                            <td className="px-6 py-4 text-slate-900 dark:text-white font-bold">{u.name}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteUser(u._id)} className="text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-medium text-sm">Suspend</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden divide-y divide-orange-50 dark:divide-slate-700">
                         {users.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 dark:text-slate-500">No users found.</div>
                         ) : (
                            users.map(u => (
                                <div key={u._id} className="p-6 flex flex-col gap-4">
                                     <div className="flex justify-between items-start">
                                         <div>
                                             <h3 className="font-bold text-slate-900 dark:text-white text-lg">{u.name}</h3>
                                             <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                                         </div>
                                         <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{u._id.slice(-6).toUpperCase()}</p>
                                     </div>
                                     <div className="flex justify-between items-center bg-[#FFF5EC] dark:bg-slate-900/40 p-3 rounded-xl border border-orange-100 dark:border-slate-700/50">
                                         <span className="text-xs text-slate-500 dark:text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                                         <button onClick={() => handleDeleteUser(u._id)} className="text-xs font-black uppercase tracking-widest text-rose-500">Suspend</button>
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
