const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');

// @route   POST api/comments
// @desc    Create a comment
router.post('/', auth, async (req, res) => {
    try {
        const { storyId, comment } = req.body;
        
        const newReview = new Review({
            user: req.user.id,
            story: storyId,
            comment
        });

        const review = await newReview.save();
        const populatedReview = await Review.findById(review._id).populate('user', ['name']);
        
        res.json(populatedReview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/comments/:storyId
// @desc    Get comments for a story
router.get('/:storyId', async (req, res) => {
    try {
        const reviews = await Review.find({ story: req.params.storyId })
            .populate('user', ['name'])
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
