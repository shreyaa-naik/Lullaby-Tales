import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

const Verify = () => {
    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 relative" style={{ backgroundColor: 'rgba(212, 158, 141, 0.1)' }}>
                <ShieldCheck className="w-12 h-12" style={{ color: '#D49E8D' }} />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D49E8D' }}>
                    <CheckCircle className="w-5 h-5 text-[#FAF6F2]" />
                </div>
            </div>
            
            <h1 className="text-5xl font-display font-black mb-6" style={{ color: '#683B2B' }}>Author Verification</h1>
            <p className="text-lg font-medium leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: '#82574A' }}>
                Protect your creative legacy. Become a verified author on Lullaby Tales to lock your identity, prevent plagiarism, and build lasting trust with your readers.
            </p>

            <div className="p-10 rounded-[2.5rem] backdrop-blur-md mb-12 text-left"
                 style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1px solid rgba(104, 59, 43, 0.1)' }}>
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#683B2B' }}>Requirements for Verification</h3>
                <ul className="space-y-4">
                    {[
                        "At least 3 published original stories",
                        "Minimum 1,000 total reader views",
                        "A completed author profile with bio and avatar",
                        "No community guideline strikes"
                    ].map((req, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5" style={{ color: '#D49E8D' }} />
                            <span className="font-medium" style={{ color: '#82574A' }}>{req}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="px-10 py-5 rounded-2xl font-black text-lg text-[#FAF6F2] transition-colors"
                    style={{ backgroundColor: '#D49E8D', boxShadow: '0 8px 32px rgba(212, 158, 141, 0.3)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C76A55'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D49E8D'}
            >
                Apply for Verification
            </button>
        </div>
    );
};

export default Verify;
