import React from 'react';
import { LifeBuoy, Book, Mail } from 'lucide-react';

const Help = () => {
    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(212, 158, 141, 0.2)' }}>
                    <LifeBuoy className="w-8 h-8" style={{ color: '#D49E8D' }} />
                </div>
                <h1 className="text-5xl font-display font-black mb-4" style={{ color: '#683B2B' }}>Help Center</h1>
                <p className="text-lg font-medium" style={{ color: '#82574A' }}>How can we help you tell your story today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="p-10 rounded-[2rem] text-center backdrop-blur-md"
                     style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1px solid rgba(104, 59, 43, 0.1)' }}>
                    <Book className="w-8 h-8 mx-auto mb-6" style={{ color: '#D49E8D' }} />
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#683B2B' }}>Knowledge Base</h3>
                    <p className="font-medium mb-6" style={{ color: '#82574A' }}>Browse our comprehensive guides on publishing, formatting, and community guidelines.</p>
                    <button className="text-sm font-black uppercase tracking-widest hover:underline" style={{ color: '#D49E8D' }}>Read Articles</button>
                </div>
                <div className="p-10 rounded-[2rem] text-center backdrop-blur-md"
                     style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1px solid rgba(104, 59, 43, 0.1)' }}>
                    <Mail className="w-8 h-8 mx-auto mb-6" style={{ color: '#D49E8D' }} />
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#683B2B' }}>Contact Support</h3>
                    <p className="font-medium mb-6" style={{ color: '#82574A' }}>Having a technical issue or account trouble? Our library sages are here to help.</p>
                    <button className="text-sm font-black uppercase tracking-widest hover:underline" style={{ color: '#D49E8D' }}>Send a Raven</button>
                </div>
            </div>
            
            <div className="text-center">
                <h3 className="text-xl font-bold mb-6" style={{ color: '#683B2B' }}>Frequently Asked Questions</h3>
                <div className="text-left max-w-2xl mx-auto space-y-6">
                    {["How do I delete a story?", "Can I change my pen name?", "How does the rating system work?"].map((q, i) => (
                        <div key={i} className="pb-4 border-b" style={{ borderColor: 'rgba(104, 59, 43, 0.1)' }}>
                            <p className="font-bold mb-2" style={{ color: '#683B2B' }}>{q}</p>
                            <p className="text-sm" style={{ color: '#82574A' }}>This is a dummy answer to the frequently asked question. It provides helpful information to the user.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Help;
