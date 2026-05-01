const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Story = require('../models/Story');

// @route   GET api/admin/users
// @desc    Get all users for moderation
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/stories
// @desc    Get all stories for moderation
router.get('/stories', [auth, admin], async (req, res) => {
    try {
        const stories = await Story.find().populate('author', ['name', 'email']).sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user and their stories
router.delete('/users/:id', [auth, admin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        if (user.isAdmin) return res.status(403).json({ msg: 'Cannot delete an admin' });

        // Delete all stories by this user
        await Story.deleteMany({ author: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User and their stories removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/stories/:id
// @desc    Delete a specific story
router.delete('/stories/:id', [auth, admin], async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        await Story.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Story removed by admin' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
