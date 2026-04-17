const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');

// @route   GET api/users/:id
// @desc    Get user public profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        // Get published stories by this user
        const publishedStories = await Story.find({ author: req.params.id, status: 'Published' }).populate('author', ['name']);
        
        const userObj = user.toObject();
        userObj.publishedStories = publishedStories;
        
        res.json(userObj);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
        res.status(500).send('Server Error');
    }
});

module.exports = router;
