import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Star, MessageCircle, Sparkles, User, Calendar, ArrowLeft, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

const StoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, savedStories, saveStory, unsaveStory } = useAuth();
    
    const [liked, setLiked] = useState(false);
    const [rating, setRating] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [comment, setComment] = useState('');
    const [story, setStory] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [summaryText, setSummaryText] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);

    const dummyData = {
        'd00000000000000000000001': {
            title: 'The Midnight Star',
            content: "Under the silver moon, the stars began to dance in a rhythm only the night knew. Leo lived in a coastal village where the ocean roared like a lion. Every night, Leo would climb the highest cliff, reaching his small hands toward the velvet sky, hoping for a spark to land in his palm. He had heard legends of the Star-Fall, a night every hundred years when the heavens weep light. The villagers laughed at his obsession, calling him the 'Boy of Dust', but Leo knew better. He felt the pull of the cosmos in his bones. \n\nOne evening, as the tide pulled back further than ever before, a trail of stardust appeared on the damp sand. Leo followed it, his heart pounding a frantic rhythm against his ribs. The trail led him to a hidden grotto, where the walls glowed with phosphorescence. In the center, a fragment of the sun itself seemed to pulse. It wasn't just light; it was a living, breathing ember of the universe. Leo reached out, his fingertips grazing the warmth, and in that moment, the entire village was bathed in a brilliant, sapphire glow that stayed in the sky for three full days.",
            authorName: 'Luna Lovegood',
            tags: ['Fantasy', 'Short Story'],
            likes: 124,
            averageRating: 4.9,
            createdAt: new Date().toISOString(),
            comments: []
        },
        'd00000000000000000000002': {
            title: 'Echoes of the Forest',
            content: "Caspian walked through the ancient groves where the trees whispered secrets of a time before man. The moss felt like a plush carpet under his boots as he followed the trail of glowing butterflies deep into the heart of the woods. He had been a tracker for ten years, but these woods were different. The sunlight filtered through the leaves in patterns that seemed like a forgotten language. \n\nSuddenly, the wind died down, and the silence became heavy. Caspian knelt by a stream that flowed with silver water. In the reflection, he didn't see himself; he saw a version of the forest that was vibrant and full of mythical beasts. A dragon made of vines and flowers watched him from the other side. It didn't growl; it nodded, as if acknowledging a fellow guardian. Caspian realized then that he wasn't tracking the forest—the forest was tracking him, testing his worthiness to enter the Inner Sanctum where the Heart of Nature beats eternally.",
            authorName: 'Caspian Thorne',
            tags: ['Adventure', 'Nature'],
            likes: 89,
            averageRating: 4.7,
            createdAt: new Date().toISOString(),
            comments: []
        },
        'd00000000000000000000003': {
            title: 'Clockwork Dreams',
            content: "In the city of brass and steam, Arthur worked on his greatest invention: a heart made of clockwork. Ticking and whirring, the device promised to bring life to his silent mechanical daughter, Elara. The city, known as Gear-Haven, was a labyrinth of copper pipes and soot-stained clouds. Arthur had spent forty years scavenging the rarest metals and polishing the finest gems to power the core. \n\nAs the lightning storm reached its peak, Arthur connected the final conduit. The workshop vibrated with the power of the heavens. Elara's eyes, made of sapphire glass, suddenly flickered. Her metal chest rose and fell in a perfectly timed sequence of clicks. She reached out a cold, brass hand and touched Arthur's tear-stained cheek. 'Father?' she whispered, the voice clear as a silver bell. The miracle of Gear-Haven had been achieved, not through cold science alone, but through the desperate love of a man who refused to give up on his dreams.",
            authorName: 'Arthur Gears',
            tags: ['Steampunk', 'Mystery'],
            likes: 245,
            averageRating: 4.8,
            createdAt: new Date().toISOString(),
            comments: []
        },
        'd00000000000000000000004': {
            title: 'The Last Alchemist',
            content: "Julian stirred the golden liquid in the vial, watching as the smoke turned from violent purple to a soothing blue. The Philosopher's Stone was finally within his grasp, but the cost was higher than he had ever imagined. He sat in his basement laboratory, surrounded by leather-bound journals and jars of powdered dragon-scale. The air smelled of sulfur and ancient spices. \n\nTo achieve the Final Transmutation, one required the sacrifice of a memory. Not just any memory, but the one you hold most dear. Julian looked at the portrait of his late wife, Clara. It was the memory of their first dance under the willow tree that the ritual demanded. He hesitated, the golden liquid shimmering temptingly. In the end, he poured the potion into the earth. 'Gold is but lead that has learned to lie,' he whispered. He would rather live in poverty with his memories than in a castle of gold with a hollow heart. The stone remained unformed, but Julian found a peace that no alchemy could ever provide.",
            authorName: 'Julian Thorne',
            tags: ['Historical', 'Magic'],
            likes: 560,
            averageRating: 5.0,
            createdAt: new Date().toISOString(),
            comments: []
        }
    };

    const getAISummary = async (text) => {
        if (!text) return "This tale remains a mystery, waiting to be unfolded.";
        
        // Use backend API if it's a real story
        if (!id.startsWith('d0000')) {
          try {
              const res = await fetch(`${API_BASE_URL}/api/summary`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ content: text })
              });
              const data = await res.json();
              if (res.ok) return data.summary;
          } catch (e) {
              console.error("AI Summary API error", e);
          }
        }

        // Fallback or Dummy story logic
        if (id === 'd00000000000000000000001') return "A poignant exploration of hope and cosmic connection, following young Leo as he discovers that the stars aren't just light in the sky, but living embers of a larger destiny hidden within a coastal grotto.";
        if (id === 'd00000000000000000000002') return "A mystical adventure deep into the heart of an ancient forest, where Nature itself acts as a sentient witness. Caspian's journey transitions from a simple track to a spiritual test of worthiness among mythical guardians.";
        if (id === 'd00000000000000000000003') return "A touching steampunk drama centered on the intersection of cold machinery and hot-blooded love. Arthur's lifelong obsession with clockwork culminates in a miracle that breathes life into brass and soul into gears.";
        if (id === 'd00000000000000000000004') return "A profound historical fantasy about the true nature of wealth. Julian's pursuit of the Philosopher's Stone ends not with gold, but with the realization that cherished memories are the most stable currency of the human heart.";

        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10);
        if (sentences.length < 3) return text;
        const coreIdea = sentences[0].trim();
        const genre = story?.tags?.[0] || "emotive";
        return `This ${genre} narrative begins as ${coreIdea.charAt(0).toLowerCase() + coreIdea.slice(1)}. As the story unfolds, a deeper layer of complexity emerges, touching upon themes of ${genre.toLowerCase()} and human resilience.`;
    };

    useEffect(() => {
        const fetchStoryAndComments = async () => {
            const token = localStorage.getItem('token');

            try {
                // 1. Handle Story Data
                if (dummyData[id]) {
                    setStory(dummyData[id]);
                } else {
                    const res = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
                        headers: { 'x-auth-token': token || '' }
                    });
                    const found = await res.json();
                    
                    if (res.ok && found && found.title) {
                        setStory({
                            title: found.title,
                            content: found.content || '',
                            authorName: found.author?.name || 'Grand Storyteller',
                            tags: found.tags || [],
                            likes: found.likes || 0,
                            views: found.views || 0,
                            averageRating: found.rating || 0,
                            createdAt: found.createdAt || new Date(),
                        });
                        setLiked(!!found.isLiked);
                    }
                }

                // 2. Always Handle Comments Data
                const commRes = await fetch(`${API_BASE_URL}/api/comments/${id}`);
                if (commRes.ok) {
                    const commData = await commRes.json();
                    setComments(commData);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchStoryAndComments();
    }, [id]);

    const handlePostComment = async () => {
        if (!user) return toast.error("Please login to comment");
        if (!comment.trim()) return;

        if (!user) {
            toast.error("Please log in to post a comment.");
            return;
        }

        setPosting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/comments`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ storyId: id, comment: comment })
            });

            if (res.ok) {
                const newComm = await res.json();
                setComments([newComm, ...comments]);
                setComment('');
                toast.success("Comment posted!");
            }
        } catch (e) {
            toast.error("Failed to post");
        }
        setPosting(false);
    };

    if (loading) return (
        <div className="pt-60 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-20 h-20 mb-8 animate-pulse">
                <div 
                    className="absolute inset-0 rounded-3xl opacity-20 animate-ping"
                    style={{ backgroundColor: '#D49E8D' }}
                ></div>
                <div 
                    className="relative w-full h-full rounded-2xl flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: '#FAF6F2', border: '2px solid #D49E8D' }}
                >
                    <BookOpen className="w-10 h-10" style={{ color: '#D49E8D' }} />
                </div>
            </div>
            <p className="text-xl font-display font-black tracking-tight animate-bounce" style={{ color: '#683B2B' }}>
                Opening the book...
            </p>
        </div>
    );

    if (!story) return (
        <div className="pt-60 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-display font-black mb-4 tracking-tight" style={{ color: '#683B2B' }}>Tale not found.</h2>
            <p className="text-slate-500 mb-10 font-medium text-lg max-w-md">This book seems to have disappeared from our archives or never existed in this realm.</p>
            <Link to="/feed" className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-xl hover:scale-105 active:scale-95" style={{ backgroundColor: '#D49E8D' }}>
                Back to Library
            </Link>
        </div>
    );

    const handleRating = async (r) => {
        if (!user) return toast.error('Please sign in to rate');
        setRating(r);

        // Dummy story: just show toast
        if (dummyData[id]) {
            toast.success(`You rated this showcase story ${r} stars!`);
            return;
        }

        // Real story: save to DB
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}/rate`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ rating: r })
            });
            if (res.ok) {
                const newAvg = await res.json();
                setStory({ ...story, averageRating: newAvg });
                toast.success('Rating preserved in the archives!');
            }
        } catch (err) { console.error(err); }
    };

    const handleLike = async () => {
        if (!user) return toast.error('Please sign in to like');
        
        // Optimistic UI update
        const willBeLiked = !liked;
        setLiked(willBeLiked);

        // Dummy story: early exit
        if (dummyData[id]) return;

        // Real story: save to DB
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/stories/${id}/like`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setStory({ ...story, likes: data.likes });
                setLiked(data.isLiked);
            }
        } catch (err) { 
            console.error(err);
            setLiked(!willBeLiked); // Revert on failure
        }
    };

    const isSaved = savedStories?.some(s => (s.id || s._id) === id || s.title === story.title);

    const handleSaveToggle = () => {
        if (!user) {
            toast.error('Please sign in to save stories');
            return;
        }
        if (isSaved) {
            const storyToUnsave = savedStories.find(s => (s.id || s._id) === id || s.title === story.title);
            if (storyToUnsave) unsaveStory(storyToUnsave.id || storyToUnsave._id);
            toast.success('Removed from Reading List');
        } else {
            saveStory({ ...story, id: id }); 
            toast.success('Saved to Reading List!');
        }
    };

    return (
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden">
                <div className="p-8 md:p-12 border-b border-slate-50">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {story.tags?.map(tag => (
                            <span key={tag} className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-[1.15]">
                        {story.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                                {story.authorName?.[0] || 'A'}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{story.authorName}</p>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={async () => {
                                    setShowSummary(true);
                                    if (!summaryText) {
                                        setLoadingSummary(true);
                                        const res = await getAISummary(story.content);
                                        setSummaryText(res);
                                        setLoadingSummary(false);
                                    }
                                }}
                                className="px-4 py-2 border rounded-xl text-sm gap-2 flex items-center border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                <Sparkles className="w-4 h-4" style={{ color: '#D49E8D' }} />
                                {loadingSummary ? 'Summarizing...' : 'View AI Summary'}
                            </button>
                            <button 
                                onClick={handleSaveToggle}
                                className={`p-3 rounded-full border transition-all ${isSaved ? 'bg-[#D49E8D] text-white border-[#D49E8D]' : 'border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900'}`}>
                                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                            </button>
                            <button className="p-3 rounded-full border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 prose prose-slate max-w-none">
                    {story.content?.split('\n\n').map((para, i) => (
                        <p key={i} className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6 font-serif">
                            {para}
                        </p>
                    ))}
                </div>

                <div className="px-8 md:px-12 py-8 bg-slate-50 border-t border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 group transition-all"
                            >
                                <div className={`p-3 rounded-full ${liked ? 'bg-rose-50 text-rose-500' : 'bg-white text-slate-400 group-hover:text-rose-500'} shadow-sm transition-all`}>
                                    <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                                </div>
                                <span className={`font-bold ${liked ? 'text-rose-500' : 'text-slate-500'}`}>
                                    {story.likes} {story.likes === 1 ? 'Like' : 'Likes'}
                                </span>
                            </button>

                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                                <Sparkles className="w-5 h-5" style={{ color: '#D49E8D' }} />
                                <span>{story.views || 0} Views</span>
                            </div>


                        </div>


                    </div>
                </div>
            </div>

            {showSummary && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSummary(false)}></div>
                    <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">AI Narrative Summary</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-8 italic">
                            {loadingSummary ? "Our archives are synthesizing the story core..." : `"${summaryText}"`}
                        </p>
                        <button
                            onClick={() => setShowSummary(false)}
                            className="w-full py-3 rounded-xl font-bold text-white transition-colors"
                            style={{ backgroundColor: '#D49E8D' }}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-16">
                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    Community Feedback
                </h3>

                {user ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
                        <textarea
                            placeholder="Share your thoughts on this tale..."
                            className="w-full min-h-[120px] p-4 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none mb-4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end">
                            <button 
                                onClick={handlePostComment}
                                disabled={posting}
                                className="px-6 py-2 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                                style={{ backgroundColor: '#D49E8D' }}
                            >
                                {posting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-100/50 rounded-2xl border border-dashed border-slate-200 p-10 text-center mb-8">
                        <p className="text-slate-500 font-medium mb-4">Want to join the conversation?</p>
                        <Link to="/login" className="inline-block px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: '#D49E8D' }}>
                            Log in to Comment
                        </Link>
                    </div>
                )}

                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-center text-slate-400 py-10 font-medium">No comments yet. Be the first to share your thoughts!</p>
                    ) : comments.map(c => (
                        <div key={c._id} className="bg-white rounded-2xl border border-slate-50 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs text-uppercase">
                                    {c.user?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{c.user?.name || 'User'}</p>
                                    <p className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{c.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoryDetail;
