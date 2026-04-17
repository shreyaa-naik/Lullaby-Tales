import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Notifications = () => {
    const { notifications } = useAuth();

    return (
        <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto min-h-screen">
            <div className="flex items-center gap-4 mb-12">
                <div className="p-3 rounded-2xl bg-orange-50 text-[#D49E8D]">
                    <Bell className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-black text-[#683B2B]">Activity</h1>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={notif._id} 
                            className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-orange-50 flex items-center gap-5"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#DED1BD] flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {notif.sender?.avatar ? (
                                    <img src={notif.sender.avatar} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <User className="w-6 h-6 text-[#683B2B]" />
                                )}
                            </div>
                            
                            <div className="flex-1 text-sm text-[#683B2B]">
                                <span className="font-black text-[#D49E8D]">{notif.sender?.name}</span>
                                {notif.type === 'like' && ` liked your tale "${notif.story?.title}"`}
                                {notif.type === 'comment' && ` commented on your story`}
                                <div className="text-[10px] uppercase font-bold text-[#82574A] mt-1 opacity-60">
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="p-2 rounded-lg bg-red-50 text-red-400">
                                {notif.type === 'like' && <Heart className="w-4 h-4 fill-current" />}
                                {notif.type === 'comment' && <MessageCircle className="w-4 h-4" />}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-40">
                        <Bell className="w-16 h-16 mx-auto mb-6 opacity-10" />
                        <h3 className="text-xl font-bold text-slate-300">No activity yet</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
