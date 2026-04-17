import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StoryCard from '../components/StoryCard';
import { User, ShieldCheck, MapPin, Calendar, BookOpen } from 'lucide-react';
import API_BASE_URL from '../config';

const PublicProfile = () => {
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfileUser(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div className="pt-40 text-center text-xl font-bold">Loading Architect...</div>;
    if (!profileUser) return <div className="pt-40 text-center text-xl font-bold">User Not Found</div>;

    const publishedStories = profileUser.publishedStories || [];

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen">
            <div className="rounded-[3rem] p-8 md:p-12 mb-12 relative overflow-hidden backdrop-blur-md"
                 style={{ backgroundColor: 'rgba(250,246,242,0.8)', border: '1.5px solid rgba(104,59,43,0.1)', boxShadow: '0 12px 40px rgba(104,59,43,0.08)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/20 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-lg border overflow-hidden"
                         style={{ backgroundColor: '#DED1BD', borderColor: 'rgba(104,59,43,0.1)' }}>
                        {profileUser.avatar ? (
                            <img src={profileUser.avatar} className="w-full h-full object-cover" alt={profileUser.name} />
                        ) : (
                            <User className="w-12 h-12" style={{ color: '#683B2B' }} />
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h1 className="text-4xl font-display font-black tracking-tight" style={{ color: '#683B2B' }}>
                                {profileUser.name}
                            </h1>
                            <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm w-max mx-auto md:mx-0"
                                 style={{ backgroundColor: '#D49E8D', color: '#FAF6F2' }}>
                                <ShieldCheck className="w-3.5 h-3.5" /> Author
                            </div>
                        </div>
                        <p className="text-base font-medium leading-relaxed max-w-2xl mb-6" style={{ color: '#82574A' }}>
                            {profileUser.bio || "This author prefers to let their tales do the talking."}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-bold" style={{ color: '#82574A' }}>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> The Storyverse</div>
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {new Date(profileUser.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-8" style={{ color: '#683B2B' }}>Published Tales by {profileUser.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedStories.length > 0 ? (
                    publishedStories.map(story => (
                        <StoryCard 
                            key={story._id} 
                            story={{...story, authorName: profileUser.name, id: story._id}} 
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center rounded-[2rem] border backdrop-blur-sm"
                         style={{ backgroundColor: 'rgba(250,246,242,0.4)', borderColor: 'rgba(104,59,43,0.1)' }}>
                        <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: '#D49E8D', opacity: 0.5 }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#683B2B' }}>No tales published yet</h3>
                        <p className="font-medium" style={{ color: '#82574A' }}>This author hasn't shared any magic with the world just yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicProfile;
