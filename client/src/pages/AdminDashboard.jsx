import React, { useState, useEffect } from 'react';
import { Shield, Users, BookOpen, Star, TrendingUp, UserMinus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../config';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [stories, setStories] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [usersRes, storiesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/admin/users`, { headers: { 'x-auth-token': token } }),
                fetch(`${API_BASE_URL}/api/admin/stories`, { headers: { 'x-auth-token': token } })
            ]);

            if (usersRes.ok && storiesRes.ok) {
                const usersData = await usersRes.json();
                const storiesData = await storiesRes.json();
                setUsers(usersData);
                setStories(storiesData);
                
                // Calculate Stats
                setStats([
                    { label: 'Total Users', value: usersData.length, icon: <Users className="w-5 h-5 text-blue-500" /> },
                    { label: 'Total Tales', value: storiesData.length, icon: <BookOpen className="w-5 h-5 text-rose-500" /> },
                    { label: 'Avg Reads', value: Math.round(storiesData.reduce((acc, s) => acc + (s.views || 0), 0) / (storiesData.length || 1)), icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
                    { label: 'Engagement', value: `${storiesData.reduce((acc, s) => acc + (s.likes || 0), 0)} Likes`, icon: <Star className="w-5 h-5 text-amber-500" /> }
                ]);
            } else {
                toast.error("Failed to load administration data");
            }
        } catch (err) {
            toast.error("Network error on moderation bridge");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const deleteUser = async (userId) => {
        if (!window.confirm('Erase this user and ALL their tales? This is permanent.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                toast.success('User removed from StoryVerse');
                fetchAdminData();
            } else {
                const data = await res.json();
                toast.error(data.msg || 'Deletion failed');
            }
        } catch (err) { toast.error('Server error'); }
    };

    const deleteStory = async (storyId) => {
        if (!window.confirm('Remove this tale from the library?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/stories/${storyId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                toast.success('Tale unbooked by administrator');
                fetchAdminData();
            } else {
                toast.error('Could not remove tale');
            }
        } catch (err) { toast.error('Server error'); }
    };

    if (loading && activeTab === 'overview') {
        return (
            <div className="pt-40 text-center">
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[#D49E8D]" />
                <p className="font-display font-black text-[#683B2B]">Accessing Master Logs...</p>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto min-h-screen flex flex-col md:flex-row gap-8">
            
            {/* Admin Sidebar */}
            <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-3 mb-8 px-4">
                    <Shield className="w-8 h-8 text-[#D49E8D]" />
                    <div>
                        <h2 className="text-xl font-display font-black text-[#683B2B] leading-none">Admin Portal</h2>
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Master Access</span>
                    </div>
                </div>
                
                {[
                    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
                    { id: 'users', label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
                    { id: 'stories', label: 'Manage Stories', icon: <BookOpen className="w-4 h-4" /> }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all text-left text-sm"
                        style={activeTab === tab.id 
                            ? { backgroundColor: '#D49E8D', color: '#FAF6F2', boxShadow: '0 4px 12px rgba(212,158,141,0.2)' }
                            : { backgroundColor: 'transparent', color: '#82574A' }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Admin Area */}
            <div className="flex-1 rounded-[2.5rem] p-8 backdrop-blur-md border shadow-xl"
                 style={{ backgroundColor: 'rgba(250, 246, 242, 0.95)', borderColor: 'rgba(104,59,43,0.1)' }}>
                
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-2xl font-bold mb-6 text-[#683B2B]">Platform Statistics</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            {stats.map((stat, i) => (
                                <div key={i} className="p-6 rounded-2xl border bg-white shadow-sm flex flex-col gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-[#683B2B]">{stat.value}</div>
                                        <div className="text-[10px] font-bold text-[#82574A] uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-2xl font-bold mb-6 text-[#683B2B]">User Moderation</h3>
                        <div className="bg-white rounded-2xl border overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b text-xs font-bold text-[#82574A] uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Author</th>
                                        <th className="px-6 py-4">Joined Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b last:border-0 hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#683B2B]">{u.name} {u.isAdmin && <span className="ml-2 px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md text-[10px]">Admin</span>}</div>
                                                <div className="text-xs text-slate-400">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                {!u.isAdmin && (
                                                    <button onClick={() => deleteUser(u._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Delete User">
                                                        <UserMinus className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'stories' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-2xl font-bold mb-6 text-[#683B2B]">Tale Moderation</h3>
                        <div className="bg-white rounded-2xl border overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b text-xs font-bold text-[#82574A] uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Story Title</th>
                                        <th className="px-6 py-4">Author</th>
                                        <th className="px-6 py-4">Engagement</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stories.map(s => (
                                        <tr key={s._id} className="border-b last:border-0 hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-bold text-[#683B2B]">{s.title}</td>
                                            <td className="px-6 py-4 text-sm text-[#82574A]">{s.author?.name}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">{s.views} Views · {s.likes} Likes</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => deleteStory(s._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Story">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
