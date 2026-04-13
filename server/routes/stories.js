const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');

// @route   GET api/stories
// @desc    Get all stories
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find().populate('author', ['name']).sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/:id
// @desc    Get story by ID (Increment views + check if liked)
router.get('/:id', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        let isLiked = false;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.user.id).select('-password');
                console.log("Profile Fetch - User Liked IDs:", user.likedStories);
                
                if (user && user.likedStories) {
                    isLiked = user.likedStories.some(sid => sid.toString() === req.params.id);
                }
            } catch (err) {
                // Token invalid, ignore
            }
        }

        const story = await Story.findByIdAndUpdate(
            req.params.id, 
            { $inc: { views: 1 } }, 
            { new: true }
        ).populate('author', ['name']);
        
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        
        const storyObj = story.toObject();
        storyObj.isLiked = isLiked;
        
        res.json(storyObj);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Story not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories
// @desc    Create a story
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, tags, image } = req.body;
        
        const newStory = new Story({
            title,
            content,
            tags,
            image,
            author: req.user.id
        });

        const story = await newStory.save();
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/stories/:id
// @desc    Update a story
router.put('/:id', auth, async (req, res) => {
    const { title, content, tags, image } = req.body;

    try {
        let story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        // Make sure user owns story
        if (story.author.toString() !== req.user.id) {
            console.log("Auth mismatch:", story.author.toString(), "vs", req.user.id);
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updateFields = {};
        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        if (tags) updateFields.tags = tags;
        if (image) updateFields.image = image;

        story = await Story.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        res.json(story);
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/stories/:id
// @desc    Delete a story
router.delete('/:id', auth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        // Make sure user owns story
        if (story.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Story.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Story removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/stories/:id/like
// @desc    Like a story (Supports real and dummy stories)
router.put('/:id/like', auth, async (req, res) => {
    try {
        const isDummy = req.params.id.startsWith('d000');
        let story = null;
        
        if (!isDummy) {
            story = await Story.findById(req.params.id);
            if (!story) return res.status(404).json({ msg: 'Story not found' });
        }
        
        const user = await User.findById(req.user.id);
        console.log("Current User Liked Stories:", user.likedStories);
        const isLiked = user.likedStories.includes(req.params.id);
        console.log("Is Story Liked already?", isLiked);

        if (isLiked) {
            // Unlike
            user.likedStories = user.likedStories.filter(id => id.toString() !== req.params.id);
            if (story) story.likes = Math.max(0, (story.likes || 1) - 1);
        } else {
            // Like
            user.likedStories.push(req.params.id);
            if (story) story.likes = (story.likes || 0) + 1;
        }

        const dummyBases = {
            'd00000000000000000000001': 124,
            'd00000000000000000000002': 89,
            'd00000000000000000000003': 245,
            'd00000000000000000000004': 560
        };

        const totalLikes = story ? story.likes : 
                          (dummyBases[req.params.id] + (!isLiked ? 1 : 0));

        console.log("Saving user with likedStories:", user.likedStories);
        await user.save();
        if (story) await story.save();

        res.json({ 
            likes: totalLikes,
            isLiked: !isLiked 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/stories/:id/rate
// @desc    Rate a story
router.put('/:id/rate', auth, async (req, res) => {
    try {
        const { rating } = req.body;
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        // Simple averaging logic or just overwrite for now to keep it simple
        const currentCount = 10; // Mock historical count
        const currentAvg = story.rating || 0;
        const newAvg = ((currentAvg * currentCount) + rating) / (currentCount + 1);
        
        story.rating = Number(newAvg.toFixed(1));
        await story.save();
        res.json(story.rating);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
