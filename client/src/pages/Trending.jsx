import React from 'react';
import { TrendingUp, Flame, Star } from 'lucide-react';

const Trending = () => {
    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(212, 158, 141, 0.2)' }}>
                    <TrendingUp className="w-8 h-8" style={{ color: '#D49E8D' }} />
                </div>
                <h1 className="text-5xl font-display font-black mb-4" style={{ color: '#683B2B' }}>Trending Tales</h1>
                <p className="text-lg font-medium" style={{ color: '#82574A' }}>Discover what the world is reading right now.</p>
            </div>

            <div className="space-y-6">
                {[
                    { title: "The Painted Moon", author: "Elara Vance", reads: "24.5k", rank: 1 },
                    { title: "Whispers of the Deep", author: "Marcus Thorne", reads: "18.2k", rank: 2 },
                    { title: "A Clockwork Heart", author: "Sylvia Wren", reads: "15.9k", rank: 3 },
                    { title: "Beyond the Velvet Veil", author: "Julian Ash", reads: "12.4k", rank: 4 }
                ].map((tale) => (
                    <div key={tale.rank} className="p-8 rounded-[2rem] flex items-center justify-between transition-transform hover:-translate-y-1 cursor-pointer backdrop-blur-md"
                         style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1px solid rgba(104, 59, 43, 0.1)', boxShadow: '0 8px 32px rgba(104, 59, 43, 0.05)' }}>
                        <div className="flex items-center gap-6">
                            <span className="text-4xl font-display font-black" style={{ color: '#D49E8D', opacity: 0.5 }}>#0{tale.rank}</span>
                            <div>
                                <h3 className="text-2xl font-bold mb-1" style={{ color: '#683B2B' }}>{tale.title}</h3>
                                <p className="text-sm font-medium uppercase tracking-widest" style={{ color: '#82574A' }}>By {tale.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 font-bold px-4 py-2 rounded-xl" style={{ backgroundColor: '#FAF6F2', color: '#C76A55' }}>
                            <Flame className="w-4 h-4" /> {tale.reads} hits
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Trending;
