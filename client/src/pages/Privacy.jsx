import React from 'react';
import { Shield } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(212, 158, 141, 0.2)' }}>
                    <Shield className="w-8 h-8" style={{ color: '#D49E8D' }} />
                </div>
                <h1 className="text-5xl font-display font-black mb-4" style={{ color: '#683B2B' }}>Privacy Policy</h1>
                <p className="text-lg font-medium" style={{ color: '#82574A' }}>Your tales are yours. We protect them fiercely.</p>
            </div>

            <div className="p-10 md:p-16 rounded-[2.5rem] backdrop-blur-md prose prose-rose max-w-none text-[#82574A]"
                 style={{ backgroundColor: 'rgba(250, 246, 242, 0.8)', border: '1px solid rgba(104, 59, 43, 0.1)' }}>
                <h2 style={{ color: '#683B2B' }}>1. Introduction</h2>
                <p>Welcome to Lullaby Tales. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
                
                <h2 style={{ color: '#683B2B' }}>2. Information We Collect</h2>
                <p>We collect personal information that you voluntarily provide to us when registering at the Services expressing an interest in obtaining information about us or our products and services.</p>
                <ul>
                    <li>Account information (email, password)</li>
                    <li>Profile information (display name, avatar)</li>
                    <li>Content you create (stories, comments, likes)</li>
                </ul>

                <h2 style={{ color: '#683B2B' }}>3. How We Use Your Information</h2>
                <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests.</p>
                
                <h2 style={{ color: '#683B2B' }}>4. Content Ownership</h2>
                <p><strong>You retain all ownership rights to the stories you publish on Lullaby Tales.</strong> We do not claim ownership over any of your creative works. By posting your content, you grant us a license to display it on our platform.</p>
            </div>
        </div>
    );
};

export default Privacy;
