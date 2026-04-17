const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');

// Helper to format story response exactly as requested by the frontend
const formatStory = (story, isLiked = false) => {
    if (!story) return null;
    return {
        _id: story._id || story.id,
        title: story.title,
        content: story.content,
        author: { 
            _id: story.author?._id || null,
            name: story.author?.name || 'Grand Storyteller' 
        },
        likes: story.likes || 0,
        views: story.views || 0,
        tags: story.tags || [],
        image: story.image,
        averageRating: story.rating || 0,
        isLiked: isLiked,
        createdAt: story.createdAt
    };
};

// @route   GET api/stories
// @desc    Get all published stories
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find({ status: 'Published' })
            .populate('author', ['name'])
            .sort({ createdAt: -1 });
        
        res.json(stories.map(s => formatStory(s)));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/me
// @desc    Get current user's stories
router.get('/me', auth, async (req, res) => {
    try {
        // FILTER: Only returns stories where author matches logged-in user id
        const myStories = await Story.find({ author: req.user.id })
            .populate('author', ['name'])
            .sort({ createdAt: -1 });
        
        res.json(myStories.map(s => formatStory(s)));
    } catch (err) {
        console.error("Fetch My Stories Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/:id
router.get('/:id', async (req, res) => {
    try {
        const targetId = req.params.id;
        const token = req.header('x-auth-token');
        let isStoryLiked = false;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.user.id);
                if (user && user.likedStories) {
                    isStoryLiked = user.likedStories.map(s => s.toString()).includes(targetId);
                }
            } catch (err) {}
        }

        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(404).json({ msg: 'Invalid ID format' });
        }

        const foundStory = await Story.findByIdAndUpdate(
            targetId, 
            { $inc: { views: 1 } }, 
            { new: true }
        ).populate('author', ['name']);
        
        if (!foundStory) return res.status(404).json({ msg: 'Story not found' });
        
        res.json(formatStory(foundStory, isStoryLiked));
    } catch (err) {
        console.error("Fetch Story Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories
// @desc    Create a story
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, tags, image } = req.body;
        
        // BUG FIX: Explicitly setting the author from authenticated user session
        const newStory = new Story({
            title,
            content,
            tags,
            image,
            author: req.user.id 
        });

        const savedStory = await newStory.save();
        const populated = await Story.findById(savedStory._id).populate('author', ['name']);
        res.json(formatStory(populated));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/stories/:id/like
router.put('/:id/like', auth, async (req, res) => {
    try {
        const storyId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({ msg: 'Invalid Story ID' });
        }
        let story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        
        const user = await User.findById(req.user.id);
        const likedStoriesArr = (user.likedStories || []).map(s => s.toString());
        const alreadyLiked = likedStoriesArr.includes(storyId);

        if (alreadyLiked) {
            // BUG FIX: Standardizing array manipulation
            user.likedStories = likedStoriesArr.filter(id => id !== storyId);
            if (story) story.likes = Math.max(0, (story.likes || 1) - 1);
        } else {
            user.likedStories = [...likedStoriesArr, storyId];
            if (story) story.likes = (story.likes || 0) + 1;
        }

        await user.save();
        if (story) await story.save();

        res.json({ 
            likes: story ? story.likes : 0, 
            isLiked: !alreadyLiked 
        });
    } catch (err) {
        console.error("Like Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// ... (other routes like delete, rate) ...

module.exports = router;
