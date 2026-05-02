import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, Lock, Bell, Palette, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const Settings = () => {
    const navigate = useNavigate();
    const { user, login, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({ 
        name: user?.name || '', 
        email: user?.email || '', 
        bio: user?.bio || '', 
        tagline: user?.tagline || '',
        avatar: user?.avatar || '' 
    });

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you absolutely sure? This will permanently delete your tales, your profile, and all your data. This action cannot be undone.')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                toast.success('Your story has ended here. We hope to see you again.');
                logout();
                navigate('/');
            } else {
                toast.error('Failed to delete account. Please try again.');
            }
        } catch (err) {
            toast.error('Could not connect to the archives.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    name: formData.name,
                    bio: formData.bio,
                    tagline: formData.tagline,
                    avatar: formData.avatar
                })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                login(updatedUser, token);
                toast.success('Your settings have been saved to the stars!');
            } else {
                const text = await res.text();
                try {
                    const errData = JSON.parse(text);
                    toast.error(`Failed: ${errData.msg || 'Unknown error'}`);
                } catch(e) {
                    console.error("Non-JSON error response:", text);
                    toast.error(`Server error (HTML): Check console`);
                }
            }
        } catch (err) {
            console.error("Profile update failed", err);
            toast.error(`Network error: ${err.message}`);
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                <h2 className="text-2xl font-display font-black mb-6 px-4" style={{ color: '#683B2B' }}>Settings</h2>
                
                {[
                    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Edit Profile' },
                    { id: 'security', icon: <Lock className="w-5 h-5" />, label: 'Security' },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-left"
                        style={activeTab === tab.id 
                            ? { backgroundColor: '#D49E8D', color: '#FAF6F2', boxShadow: '0 4px 12px rgba(212,158,141,0.2)' }
                            : { backgroundColor: 'transparent', color: '#82574A' }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}

                <div className="mt-auto pt-8 border-t border-[#683B2B]/5">
                    <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all text-left"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md"
                 style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1.5px solid rgba(104,59,43,0.1)', boxShadow: '0 8px 40px rgba(104,59,43,0.06)' }}>
                
                <form onSubmit={handleSave} className="space-y-8">
                    {activeTab === 'profile' && (
                        <div className="animate-fade-in-up">
                            <h3 className="text-2xl font-bold mb-6" style={{ color: '#683B2B' }}>Public Profile</h3>
                            
                            <div className="mb-8 flex items-center gap-6">
                                <div className="w-24 h-24 rounded-[2rem] overflow-hidden flex items-center justify-center flex-shrink-0 border shadow-sm relative group cursor-pointer"
                                     style={{ backgroundColor: '#DED1BD', borderColor: 'rgba(104,59,43,0.1)' }}>
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#D49E8D] text-white font-black text-2xl">
                                            {(formData.name || 'A').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Change</span>
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1" style={{ color: '#683B2B' }}>Profile Photo</h4>
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs font-medium" style={{ color: '#82574A' }}>Upload a picture to personalize your author identity.</p>
                                        {formData.avatar && (
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({ ...formData, avatar: '' })}
                                                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Remove Photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#683B2B' }}>Pen Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-2xl font-medium outline-none transition-all"
                                           style={{ backgroundColor: 'rgba(250,246,242,0.5)', border: '1.5px solid rgba(104,59,43,0.1)', color: '#683B2B' }}
                                           value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#683B2B' }}>Author Tagline</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-2xl font-medium outline-none transition-all"
                                           style={{ backgroundColor: 'rgba(250,246,242,0.5)', border: '1.5px solid rgba(104,59,43,0.1)', color: '#683B2B' }}
                                           placeholder="e.g. Dreamer · Writer · Story Collector"
                                           value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#683B2B' }}>Author Bio</label>
                                    <textarea className="w-full px-4 py-3 rounded-2xl font-medium outline-none transition-all min-h-[120px] resize-none"
                                              style={{ backgroundColor: 'rgba(250,246,242,0.5)', border: '1.5px solid rgba(104,59,43,0.1)', color: '#683B2B' }}
                                              placeholder="Tell the world about yourself..."
                                              value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-fade-in-up space-y-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-6" style={{ color: '#683B2B' }}>Account Security</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#683B2B' }}>Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-2xl font-medium outline-none" style={{ backgroundColor: 'rgba(250,246,242,0.5)', border: '1.5px solid rgba(104,59,43,0.1)', color: '#683B2B' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#683B2B' }}>New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-2xl font-medium outline-none" style={{ backgroundColor: 'rgba(250,246,242,0.5)', border: '1.5px solid rgba(104,59,43,0.1)', color: '#683B2B' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-red-100">
                                <h3 className="text-xl font-bold mb-2 text-red-600">Danger Zone</h3>
                                <p className="text-sm text-[#82574A] mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                                <button 
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-3 rounded-xl border-2 border-red-200 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                >
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="pt-8 border-t" style={{ borderColor: 'rgba(104,59,43,0.1)' }}>
                            <button type="submit" className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-[#FAF6F2] transition-colors"
                                    style={{ backgroundColor: '#D49E8D', boxShadow: '0 4px 16px rgba(212,158,141,0.3)' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C76A55'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D49E8D'}>
                                <Save className="w-5 h-5" /> Save Changes
                            </button>
                        </div>
                    )}
                </form>

            </div>
        </div>
    );
};

export default Settings;
