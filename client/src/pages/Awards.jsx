import React from 'react';
import { Award, Star } from 'lucide-react';

const Awards = () => {
    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(212, 158, 141, 0.2)' }}>
                    <Award className="w-8 h-8" style={{ color: '#D49E8D' }} />
                </div>
                <h1 className="text-5xl font-display font-black mb-4" style={{ color: '#683B2B' }}>Lullaby Awards</h1>
                <p className="text-lg font-medium" style={{ color: '#82574A' }}>Celebrating literary excellence across our magical community.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    { category: "Story of the Year", winner: "The Last Lighthouse", year: 2024 },
                    { category: "Best Fantasy", winner: "Dragons of the Void", year: 2024 },
                    { category: "Rising Star", winner: "Amelia Croft", year: 2024 },
                    { category: "Reader's Choice", winner: "Midnight in Paris", year: 2024 }
                ].map((award, i) => (
                    <div key={i} className="p-10 rounded-[2rem] text-center backdrop-blur-md"
                         style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1px solid rgba(104, 59, 43, 0.1)', boxShadow: '0 8px 32px rgba(104, 59, 43, 0.05)' }}>
                        <Star className="w-8 h-8 mx-auto mb-6" style={{ color: '#D49E8D', fill: 'rgba(212, 158, 141, 0.2)' }} />
                        <h4 className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: '#D49E8D' }}>{award.category}</h4>
                        <h3 className="text-2xl font-display font-bold mb-2" style={{ color: '#683B2B' }}>{award.winner}</h3>
                        <p className="text-xs font-bold" style={{ color: '#82574A' }}>Won in {award.year}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Awards;
