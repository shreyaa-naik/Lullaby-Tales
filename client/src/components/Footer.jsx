import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Camera, Mail, MessageCircle, Heart } from 'lucide-react';

const FOOT_BG   = '#683B2B'; // Dark chocolate background
const FOOT_TEXT = 'rgba(250, 246, 242, 0.7)'; // cream with opacity
const PILL_BG   = 'rgba(250, 246, 242, 0.1)';

const Footer = () => {
    return (
        <footer
            className="py-20 mt-auto relative overflow-hidden"
            style={{ backgroundColor: FOOT_BG, color: FOOT_TEXT, borderTop: '4px solid #D49E8D' }}
        >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none"
                 style={{ backgroundColor: '#D49E8D', opacity: 0.2 }}></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 blur-[80px] rounded-full -ml-28 -mb-28 pointer-events-none"
                 style={{ backgroundColor: '#D49E8D', opacity: 0.15 }}></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">

                    {/* Brand */}
                    <div className="md:col-span-5">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-500"
                                 style={{ backgroundColor: '#D49E8D' }}>
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-display font-black tracking-tighter text-white">
                                Lullaby<span style={{ color: '#DED1BD' }}>Tales</span>
                            </span>
                        </Link>
                        <p className="text-base font-medium leading-relaxed max-w-sm mb-8" style={{ color: FOOT_TEXT }}>
                            The world's most beloved storytelling community. Empowering authors to enchant hearts and minds.
                        </p>
                        <div className="flex gap-3">
                            {[Globe, Camera, MessageCircle, Mail].map((Icon, i) => (
                                <a key={i} href="#"
                                   className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                                   style={{ backgroundColor: PILL_BG, color: '#FAF6F2' }}
                                   onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(250, 246, 242, 0.2)'; e.currentTarget.style.color = '#D49E8D'; }}
                                   onMouseLeave={e => { e.currentTarget.style.backgroundColor = PILL_BG; e.currentTarget.style.color = '#FAF6F2'; }}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
                        {[
                            {
                                heading: 'Platform',
                                links: [
                                    { to: '/feed',      label: 'Library' },
                                    { to: '/trending',  label: 'Trending' },
                                    { to: '/awards',    label: 'Awards' },
                                    { to: '/verify',    label: 'Verification' },
                                ],
                            },
                            {
                                heading: 'Author Studio',
                                links: [
                                    { to: '/create-story', label: 'Start Writing' },
                                    { to: '/dashboard',    label: 'My Analytics' },
                                    { to: '/community',    label: 'Writer Forum' },
                                ],
                            },
                            {
                                heading: 'Support',
                                links: [
                                    { to: '/help',    label: 'Help Center' },
                                    { to: '/privacy', label: 'Privacy Policy' },
                                ],
                                span: true,
                            },
                        ].map((col) => (
                            <div key={col.heading} className={col.span ? 'col-span-2 md:col-span-1' : ''}>
                                <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-6" style={{ color: '#DED1BD' }}>
                                    {col.heading}
                                </h4>
                                <ul className="space-y-3 font-semibold text-sm">
                                    {col.links.map(l => (
                                        <li key={l.to}>
                                            <Link to={l.to}
                                                style={{ color: FOOT_TEXT }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#D49E8D'}
                                                onMouseLeave={e => e.currentTarget.style.color = FOOT_TEXT}
                                                className="transition-colors"
                                            >{l.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6"
                     style={{ borderTop: '1px solid rgba(250, 246, 242, 0.1)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: FOOT_TEXT }}>
                        © 2024 Lullaby Tales Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: FOOT_TEXT }}>
                        Crafted with <Heart className="w-4 h-4 mx-1" style={{ color: '#D49E8D', fill: '#D49E8D' }} /> by Dreamers
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
