import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, PenTool, Users, ArrowRight } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden" style={{ backgroundColor: 'transparent', fontFamily: "'Lora', serif" }}>
            <div className="max-w-7xl mx-auto relative z-10">
                {/* --- TOP SECTION --- */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-32">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.2 }
                            }
                        }}
                        className="flex-1 text-left"
                    >
                        <motion.h1 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="text-6xl md:text-8xl font-display font-bold mb-4" 
                            style={{ color: '#683B2B', fontFamily: "'Marcellus', serif" }}
                        >
                            About <br/>
                            <span style={{ color: '#D49E8D', fontStyle: 'italic' }}>Lullaby Tales</span>
                        </motion.h1>
                        
                        <motion.div 
                            variants={{
                                hidden: { scaleX: 0, opacity: 0 },
                                visible: { scaleX: 1, opacity: 1, transition: { duration: 1 } }
                            }}
                            className="flex items-center gap-4 mb-8 origin-left"
                        >
                            <div className="h-[1px] w-12 bg-[#D49E8D]"></div>
                            <Heart className="w-5 h-5 text-[#D49E8D]" fill="#D49E8D" />
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                            }}
                        >
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#683B2B' }}>
                                <Sparkles className="w-5 h-5 text-[#D49E8D]" /> Where Stories Come Alive.
                            </h3>
                            <p className="text-xl leading-relaxed max-w-lg opacity-80" style={{ color: '#5A453B' }}>
                                Lullaby Tales is a global community of dreamers, readers, and writers connected by the love for stories that inspire, heal, and imagine.
                            </p>
                        </motion.div>
                    </motion.div>

                    <div className="flex-1 relative">
                        {/* Floral Sprig Accents with Floating Animation */}
                        <motion.img 
                            src="/floral_sprig.svg" 
                            alt="" 
                            animate={{ 
                                y: [0, -15, 0],
                                rotate: [-15, -10, -15]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-10 -bottom-10 w-32 h-auto z-20" 
                        />
                        <motion.img 
                            src="/floral_sprig.svg" 
                            alt="" 
                            animate={{ 
                                y: [0, 15, 0],
                                rotate: [45, 50, 45]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -right-5 top-10 w-24 h-auto z-20" 
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            animate={{ 
                                y: [0, -10, 0] 
                            }}
                            transition={{ 
                                opacity: { duration: 1 },
                                scale: { duration: 1 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="relative"
                        >
                            <img 
                                src="/about_hero.svg" 
                                alt="Storytelling Collage" 
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* --- MIDDLE SECTION: OUR STORY --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="flex flex-col md:flex-row items-center gap-20 mb-32 bg-white/30 backdrop-blur-sm p-12 rounded-[3rem] border border-white/50 shadow-sm"
                >
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex-1 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-[#FAF6F2]"
                    >
                        <motion.img 
                            src="/about_writing_desk.svg" 
                            alt="Writing Desk" 
                            animate={{ 
                                y: [0, -8, 0],
                                rotate: [0, 1, 0]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-[450px] object-contain p-12"
                        />
                    </motion.div>
                    
                    <div className="flex-1 text-left">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 mb-6 uppercase tracking-[0.3em] text-xs font-black text-[#D49E8D]"
                        >
                            <Sparkles className="w-4 h-4" /> Our Story
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight" style={{ color: '#683B2B', fontFamily: "'Marcellus', serif" }}
                        >
                            Every great journey <br/>
                            begins with <span style={{ color: '#D49E8D', fontStyle: 'italic' }}>a story.</span>
                        </motion.h2>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-6 text-lg leading-relaxed opacity-90" style={{ color: '#5A453B' }}
                        >
                            <p>
                                Lullaby Tales was born from a simple belief — that stories have the power to bring people together, spark imagination, and create lasting memories.
                            </p>
                            <p>
                                We built this space for storytellers and dreamers from around the world to write, share, and cherish tales that touch hearts across generations.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* --- BOTTOM SECTION: OUR MISSION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-4 text-left">
                        <div className="flex items-center gap-3 mb-6 uppercase tracking-[0.3em] text-xs font-black text-[#D49E8D]">
                            <Sparkles className="w-4 h-4" /> Our Mission
                        </div>
                        <h2 className="text-4xl font-display font-bold mb-8 leading-tight" style={{ color: '#683B2B', fontFamily: "'Marcellus', serif" }}>
                            Inspire. Connect. <br/>
                            Create. <span style={{ color: '#D49E8D', fontStyle: 'italic' }}>Repeat.</span>
                        </h2>
                        <p className="text-lg leading-relaxed opacity-90" style={{ color: '#5A453B' }}>
                            Our mission is to inspire creativity, connect people through meaningful stories, and build a community where every voice matters.
                        </p>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <PenTool className="w-6 h-6" />,
                                title: "Inspire Creativity",
                                desc: "We encourage writers to explore their imagination and tell stories that inspire the world."
                            },
                            {
                                icon: <Users className="w-6 h-6" />,
                                title: "Build Connections",
                                desc: "Stories connect us. We create a global community of readers and writers."
                            },
                            {
                                icon: <Heart className="w-6 h-6" />,
                                title: "Spread Positivity",
                                desc: "We believe in stories that heal, uplift, and spread kindness everywhere."
                            }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[2rem] bg-[#FAF6F2]/80 border border-[#D49E8D]/20 shadow-sm hover:shadow-xl transition-all text-center group"
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110" style={{ backgroundColor: '#fff', color: '#D49E8D', boxShadow: '0 10px 30px rgba(212,158,141,0.2)' }}>
                                    {card.icon}
                                </div>
                                <h4 className="text-xl font-display font-bold mb-4" style={{ color: '#683B2B' }}>{card.title}</h4>
                                <p className="text-sm leading-relaxed opacity-80" style={{ color: '#5A453B' }}>{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Background Decorative Accents with Floating Animation */}
            <motion.div 
                animate={{ 
                    x: [0, 30, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-[10%] w-64 h-64 bg-[#D49E8D]/5 rounded-full blur-[100px] pointer-events-none"
            ></motion.div>
            <motion.div 
                animate={{ 
                    x: [0, -40, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-40 left-[5%] w-96 h-96 bg-amber-100/10 rounded-full blur-[120px] pointer-events-none"
            ></motion.div>
        </div>
    );
};

export default About;
