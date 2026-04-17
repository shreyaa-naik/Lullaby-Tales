const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DailyStory = require('../models/DailyStory');
const User = require('../models/User');

// @route   GET api/daily
// @desc    Get all active daily stories grouped by user
router.get('/', async (req, res) => {
    try {
        const stories = await DailyStory.find().populate('userId', ['name', 'avatar']).sort({ createdAt: -1 });
        
        // Group by user
        const grouped = {};
        stories.forEach(story => {
            const uId = story.userId._id.toString();
            if (!grouped[uId]) {
                grouped[uId] = {
                    user: story.userId,
                    stories: []
                };
            }
            grouped[uId].stories.push(story);
        });

        res.json(Object.values(grouped));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/daily
// @desc    Create a new daily story
router.post('/', auth, async (req, res) => {
    try {
        const { imageUrl, content } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ msg: 'Image URL is required' });
        }

        const newDailyStory = new DailyStory({
            userId: req.user.id,
            imageUrl,
            content
        });

        const story = await newDailyStory.save();
        const populatedStory = await DailyStory.findById(story._id).populate('userId', ['name', 'avatar']);
        res.json(populatedStory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/daily/:id
// @desc    Delete a daily story manually
router.delete('/:id', auth, async (req, res) => {
    try {
        const story = await DailyStory.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        
        if (story.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await DailyStory.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Daily story removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
