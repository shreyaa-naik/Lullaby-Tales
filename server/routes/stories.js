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
        const id = req.params.id;
        const isDummy = id.startsWith('d000');
        const token = req.header('x-auth-token');
        let isLiked = false;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.user.id);
                if (user && user.likedStories) {
                    isLiked = user.likedStories.includes(id);
                }
            } catch (err) {}
        }

        if (isDummy) {
            const dummyBases = {
                'd000000000000000000000001': { title: 'The Midnight Star', likes: 124 },
                'd000000000000000000000002': { title: 'Echoes of the Forest', likes: 89 },
                'd000000000000000000000003': { title: 'Clockwork Dreams', likes: 245 },
                'd000000000000000000000004': { title: 'The Last Alchemist', likes: 560 }
            };
            const dm = dummyBases[id] || { title: 'Unknown', likes: 0 };
            return res.json({
                _id: id,
                title: dm.title,
                likes: dm.likes + (isLiked ? 1 : 0),
                isLiked,
                isDummy: true
            });
        }

        const story = await Story.findByIdAndUpdate(
            id, 
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
        // Force all IDs to strings for bulletproof comparison
        const likedStoriesArr = (user.likedStories || []).map(s => s.toString());
        const isLiked = likedStoriesArr.includes(req.params.id);

        if (isLiked) {
            // Unlike: Remove the ID
            user.likedStories = likedStoriesArr.filter(id => id !== req.params.id);
            if (story) story.likes = Math.max(0, (story.likes || 1) - 1);
        } else {
            // Like: Add the ID
            user.likedStories = [...likedStoriesArr, req.params.id];
            if (story) story.likes = (story.likes || 0) + 1;
        }

        const dummyBases = {
            'd000000000000000000000001': 124,
            'd000000000000000000000002': 89,
            'd000000000000000000000003': 245,
            'd000000000000000000000004': 560
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
