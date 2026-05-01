const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper to format story response
const formatStory = (story, userId = null) => {
    if (!story) return null;
    const isLiked = userId ? story.likedBy?.map(id => id.toString()).includes(userId.toString()) : false;
    const actualLikes = Array.isArray(story.likedBy) ? story.likedBy.length : Math.max(0, story.likes || 0);
    
    return {
        _id: story._id,
        title: story.title,
        content: story.content,
        author: { 
            _id: story.author?._id || story.author,
            name: story.author?.name || 'Grand Storyteller' 
        },
        likes: actualLikes,
        views: story.views || 0,
        tags: story.tags || [],
        image: story.image,
        averageRating: story.rating || 0,
        isLiked: isLiked,
        comments: story.comments || [],
        createdAt: story.createdAt
    };
};

// @route   GET api/stories
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find({ status: 'Published' })
            .populate('author', ['name'])
            .sort({ createdAt: -1 });
        res.json(stories.map(s => formatStory(s)));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/trending
router.get('/trending', async (req, res) => {
    try {
        const stories = await Story.find({ status: 'Published' })
            .populate('author', ['name'])
            .sort({ likes: -1, views: -1, rating: -1 })
            .limit(10);
        res.json(stories.map(s => formatStory(s)));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/recent
router.get('/recent', async (req, res) => {
    try {
        const stories = await Story.find({ status: 'Published' })
            .populate('author', ['name'])
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(stories.map(s => formatStory(s)));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const stories = await Story.find({ author: req.params.userId, status: 'Published' })
            .populate('author', ['name'])
            .sort({ createdAt: -1 });
        res.json(stories.map(s => formatStory(s)));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/liked/:userId
router.get('/liked/:userId', async (req, res) => {
    try {
        const stories = await Story.find({ likedBy: req.params.userId })
            .populate('author', ['name'])
            .sort({ createdAt: -1 });
        res.json(stories.map(s => formatStory(s)));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Define Routes
// @route   GET api/stories/:id
router.get('/:id', async (req, res) => {
    try {
        const storyId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(storyId)) return res.status(404).json({ msg: 'Invalid ID' });

        const token = req.header('x-auth-token');
        let userId = null;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.user.id;
            } catch (err) {}
        }

        const story = await Story.findByIdAndUpdate(storyId, { $inc: { views: 1 } }, { new: true })
            .populate('author', ['name'])
            .populate('comments.user', ['name', 'avatar']);
        
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        res.json(formatStory(story, userId));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories/:id/like
router.post('/:id/like', auth, async (req, res) => {
    try {
        const storyId = req.params.id;
        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        const userId = req.user.id;
        const alreadyLiked = story.likedBy.some(id => id.toString() === userId);

        if (alreadyLiked) {
            // Unlike: Remove from both
            const updatedStory = await Story.findByIdAndUpdate(storyId, { 
                $pull: { likedBy: userId }
            }, { new: true });
            
            updatedStory.likes = updatedStory.likedBy.length;
            await updatedStory.save();

            await User.findByIdAndUpdate(userId, {
                $pull: { likedStories: storyId }
            });
        } else {
            // Like: Add to both safely
            const updatedStory = await Story.findByIdAndUpdate(storyId, { 
                $addToSet: { likedBy: userId }
            }, { new: true });

            updatedStory.likes = updatedStory.likedBy.length;
            await updatedStory.save();

            await User.findByIdAndUpdate(userId, {
                $addToSet: { likedStories: storyId }
            });

            // Notification
            if (story.author.toString() !== userId) {
                const newNotif = new Notification({
                    user: story.author,
                    sender: userId,
                    story: storyId,
                    type: 'like'
                });
                await newNotif.save();
            }
        }

        const updatedStory = await Story.findById(storyId);
        res.json({ likes: updatedStory.likes, isLiked: !alreadyLiked });
    } catch (err) {
        console.error("Like Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories/:id/comment
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { text } = req.body;
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        const newComment = {
            user: req.user.id,
            text
        };

        story.comments.unshift(newComment);
        await story.save();

        // Create Notification
        if (story.author.toString() !== req.user.id) {
            const newNotif = new Notification({
                user: story.author,
                sender: req.user.id,
                story: story._id,
                type: 'comment'
            });
            await newNotif.save();
        }
        
        const updatedStory = await Story.findById(req.params.id).populate('comments.user', ['name', 'avatar']);
        res.json(updatedStory.comments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories/:id/save
router.post('/:id/save', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const storyId = req.params.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isCurrentlySaved = (user.savedStories || []).some(id => id.toString() === storyId);

        if (isCurrentlySaved) {
            await User.findByIdAndUpdate(userId, { $pull: { savedStories: storyId } });
        } else {
            await User.findByIdAndUpdate(userId, { $addToSet: { savedStories: storyId } });
        }

        res.json({ isSaved: !isCurrentlySaved });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories
// @desc    Create a story
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, tags, image, status } = req.body;
        
        const newStory = new Story({
            title,
            content,
            tags,
            image,
            status: status || 'Published',
            author: req.user.id
        });

        const story = await newStory.save();
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/me
// @desc    Get current user stories
router.get('/me', auth, async (req, res) => {
    try {
        const stories = await Story.find({ author: req.user.id }).sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/stories/:id
// @desc    Update a story
router.put('/:id', auth, async (req, res) => {
     try {
        const { title, content, tags, image, status } = req.body;
        let story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        if (story.author.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        story = await Story.findByIdAndUpdate(
            req.params.id,
            { $set: { title, content, tags, image, status } },
            { new: true }
        );
        res.json(story);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/stories/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        if (story.author.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        await story.deleteOne();
        res.json({ msg: 'Story removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
