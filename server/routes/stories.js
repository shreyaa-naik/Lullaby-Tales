const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper to format story response exactly as requested by the frontend
const formatStory = (story, isLiked = false) => {
    if (!story) return null;
    return {
        _id: story._id,
        title: story.title,
        content: story.content,
        author: { 
            _id: story.author?._id || story.author,
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
// @desc    Global Feed - Return all stories
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

// @route   GET api/stories/trending
// @desc    Return high-engagement stories
router.get('/trending', async (req, res) => {
    try {
        const stories = await Story.find({ status: 'Published' })
            .populate('author', ['name'])
            .sort({ likes: -1, views: -1 })
            .limit(10);
        res.json(stories.map(s => formatStory(s)));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/me
// @desc    Self profile stories
router.get('/me', auth, async (req, res) => {
    try {
        const myStories = await Story.find({ author: req.user.id })
            .populate('author', ['name'])
            .sort({ createdAt: -1 });
        res.json(myStories.map(s => formatStory(s)));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories
// @desc    Create story (Instagram-style post)
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, tags, image } = req.body;
        const newStory = new Story({
            title,
            content,
            tags,
            image,
            author: req.user.id // Critical: Linking to authenticated user
        });

        const savedStory = await newStory.save();
        const populated = await Story.findById(savedStory._id).populate('author', ['name']);
        res.json(formatStory(populated));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/:id
router.get('/:id', async (req, res) => {
    try {
        const targetId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(targetId)) return res.status(404).json({ msg: 'Invalid ID' });

        const token = req.header('x-auth-token');
        let isStoryLiked = false;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.user.id);
                if (user) isStoryLiked = user.likedStories.includes(targetId);
            } catch (err) {}
        }

        const foundStory = await Story.findByIdAndUpdate(targetId, { $inc: { views: 1 } }, { new: true })
            .populate('author', ['name']);
        
        if (!foundStory) return res.status(404).json({ msg: 'Story not found' });
        res.json(formatStory(foundStory, isStoryLiked));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories/:id/like
// @desc    Instagram-like Like/Unlike
router.post('/:id/like', auth, async (req, res) => {
    try {
        const storyId = req.params.id;
        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        
        const user = await User.findById(req.user.id);
        const alreadyLiked = user.likedStories.includes(storyId);

        if (alreadyLiked) {
            user.likedStories = user.likedStories.filter(id => id.toString() !== storyId);
            story.likes = Math.max(0, (story.likes || 1) - 1);
        } else {
            user.likedStories.push(storyId);
            story.likes = (story.likes || 0) + 1;

            // Trigger Notification (only if liking someone else's story)
            if (story.author.toString() !== req.user.id) {
                const newNotif = new Notification({
                    user: story.author,
                    sender: req.user.id,
                    story: storyId,
                    type: 'like'
                });
                await newNotif.save();
            }
        }

        await user.save();
        await story.save();
        res.json({ likes: story.likes, isLiked: !alreadyLiked });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories/:id/save
// @desc    Bookmark/Save story
router.post('/:id/save', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const storyId = req.params.id;
        const alreadySaved = user.savedStories.includes(storyId);

        if (alreadySaved) {
            user.savedStories = user.savedStories.filter(id => id.toString() !== storyId);
        } else {
            user.savedStories.push(storyId);
        }

        await user.save();
        res.json({ isSaved: !alreadySaved });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/stories/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        if (story.author.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

        await Story.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Tale deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
