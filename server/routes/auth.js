const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Story = require('../models/Story');
const Notification = require('../models/Notification');

// Helper to format story response
const formatStory = (story) => {
    if (!story) return null;
    return {
        _id: story._id,
        title: story.title,
        content: story.content || "",
        author: { 
            _id: story.author?._id || story.author,
            name: story.author?.name || 'Grand Storyteller' 
        },
        likes: story.likes || 0,
        views: story.views || 0,
        tags: story.tags || [],
        image: story.image,
        createdAt: story.createdAt
    };
};

// @route   GET api/auth/profile
// @desc    Get user data + populated Liked Stories
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate({
                path: 'likedStories',
                populate: { path: 'author', select: 'name' }
            });
        
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const userObj = user.toObject();
        userObj.likedStories = user.likedStories.map(s => formatStory(s));
        res.json(userObj);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/saved
// @desc    Get populated Reading List
router.get('/saved', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'savedStories',
                populate: { path: 'author', select: 'name' }
            });

        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user.savedStories.map(s => formatStory(s)));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/notifications
// @desc    Get user notifications
router.get('/notifications', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .populate('sender', ['name', 'avatar'])
            .populate('story', ['title'])
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, name: user.name, email: user.email } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: payload.user });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
