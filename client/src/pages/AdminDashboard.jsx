import React, { useState, useEffect } from 'react';
import { Shield, Users, BookOpen, Star, TrendingUp, Search, UserMinus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock Admin Data
    const stats = [
        { label: 'Total Users', value: '1,245', icon: <Users className="w-5 h-5 text-blue-500" /> },
        { label: 'Total Tales', value: '4,890', icon: <BookOpen className="w-5 h-5 text-rose-500" /> },
        { label: 'Avg Rating', value: '4.8', icon: <Star className="w-5 h-5 text-amber-500" /> },
        { label: 'Server Status', value: 'Healthy', icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> }
    ];

    const mockUsers = [
        { id: 1, name: 'Luna Lovegood', email: 'luna@storyverse.com', tales: 12, joined: '2024-01-15' },
        { id: 2, name: 'Silas Vane', email: 'silas@storyverse.com', tales: 5, joined: '2024-02-12' },
        { id: 3, name: 'Astra Orion', email: 'astra@storyverse.com', tales: 8, joined: '2024-03-01' }
    ];

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
                                        <th className="px-6 py-4">Stories</th>
                                        <th className="px-6 py-4">Joined Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockUsers.map(user => (
                                        <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#683B2B]">{user.name}</div>
                                                <div className="text-xs text-slate-400">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-[#D49E8D]">{user.tales}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{user.joined}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors tooltip" title="Delete User">
                                                    <UserMinus className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'stories' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                        <BookOpen className="w-16 h-16 mb-4 text-[#DED1BD]" />
                        <h4 className="text-lg font-bold text-[#683B2B]">Story Moderation Suite</h4>
                        <p className="text-sm text-[#82574A]">Review reported stories and manage platform content here.</p>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
