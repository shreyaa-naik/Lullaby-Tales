import React from 'react';
import { Users, MessageSquare } from 'lucide-react';

const Community = () => {
    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(212, 158, 141, 0.2)' }}>
                    <Users className="w-8 h-8" style={{ color: '#D49E8D' }} />
                </div>
                <h1 className="text-5xl font-display font-black mb-4" style={{ color: '#683B2B' }}>Writer Forum</h1>
                <p className="text-lg font-medium" style={{ color: '#82574A' }}>Connect, collaborate, and critique with fellow loremasters.</p>
            </div>

            <div className="space-y-4">
                {[
                    { topic: "Worldbuilding 101: Crafting Magic Systems", replies: 142, author: "MageScribe" },
                    { topic: "Looking for beta readers for a Sci-Fi Noir", replies: 38, author: "NeonWriter" },
                    { topic: "How do you handle writer's block?", replies: 215, author: "InkWell" },
                    { topic: "Weekly Prompt: \"The last door on the left\"", replies: 89, author: "Moderator" }
                ].map((thread, i) => (
                    <div key={i} className="p-6 rounded-[1.5rem] flex items-center justify-between backdrop-blur-md transition-colors cursor-pointer hover:bg-white/40"
                         style={{ backgroundColor: 'rgba(250, 246, 242, 0.6)', border: '1px solid rgba(104, 59, 43, 0.1)' }}>
                        <div>
                            <h3 className="text-xl font-bold mb-1" style={{ color: '#683B2B' }}>{thread.topic}</h3>
                            <p className="text-xs font-medium" style={{ color: '#82574A' }}>Started by <span style={{ color: '#D49E8D' }}>{thread.author}</span></p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#82574A' }}>
                            <MessageSquare className="w-4 h-4" /> {thread.replies}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
