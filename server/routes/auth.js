const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Story = require('../models/Story');

// Helper to format story response
const formatStory = (story) => {
    if (!story) return null;
    return {
        _id: story._id || story.id,
        title: story.title,
        content: story.content || "",
        author: { 
            _id: story.author?._id || null,
            name: story.author?.name || 'Author' 
        },
        likes: story.likes || 0,
        views: story.views || 0,
        tags: story.tags || [],
        image: story.image,
        isDummy: story.isDummy || false
    };
};

// @route   GET api/auth/profile
// @desc    Get user profile with populated likedStories
router.get('/profile', auth, async (req, res) => {
    try {
        // POPULATE: Fully populates likedStories and their authors
        const userDoc = await User.findById(req.user.id)
            .select('-password')
            .populate({
                path: 'likedStories',
                populate: { path: 'author', select: 'name' }
            });

        if (!userDoc) return res.status(404).json({ msg: 'User not found' });

        const finalUserObj = userDoc.toObject();
        finalUserObj.likedStories = userDoc.likedStories.map(s => formatStory(s));
        
        res.json(finalUserObj);
    } catch (err) {
        console.error("Profile Fetch Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/auth/saved
// @desc    Get fully populated reading list
router.get('/saved', auth, async (req, res) => {
    try {
        const activeUser = await User.findById(req.user.id)
            .populate({
                path: 'savedStories',
                populate: { path: 'author', select: 'name' }
            });

        if (!activeUser) return res.status(404).json({ msg: 'User not found' });

        // Standardize the response structure for every saved story
        const finalReadingList = (activeUser.savedStories || []).map(s => formatStory(s));

        res.json(finalReadingList);
    } catch (err) {
        console.error("Fetch Saved Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/save/:id
router.put('/save/:id', auth, async (req, res) => {
    try {
        const userToUpdate = await User.findById(req.user.id);
        const storyId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(storyId)) {
             return res.status(400).json({ msg: 'Invalid Story ID' });
        }

        let currentSaved = (userToUpdate.savedStories || []).map(s => s.toString());
        const isCurrentlySaved = currentSaved.includes(storyId);

        if (isCurrentlySaved) {
            userToUpdate.savedStories = currentSaved.filter(id => id !== storyId);
        } else {
            userToUpdate.savedStories = [...currentSaved, storyId];
        }

        await userToUpdate.save();
        res.json({ savedStories: userToUpdate.savedStories });
    } catch (err) {
        console.error("Save Story Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(400).json({ msg: 'Invalid Credentials' });
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        const payload = { user: { id: foundUser.id, name: foundUser.name, email: foundUser.email } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: payload.user });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
