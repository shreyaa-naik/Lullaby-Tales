const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Rating = require('../models/Rating');
const Story = require('../models/Story');

// @route   POST api/ratings
// @desc    Rate a story
router.post('/', auth, async (req, res) => {
    try {
        const { storyId, rating } = req.body;
        
        let existingRating = await Rating.findOne({ user: req.user.id, story: storyId });
        
        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            const newRating = new Rating({
                user: req.user.id,
                story: storyId,
                rating
            });
            await newRating.save();
        }

        res.json({ msg: 'Rating submitted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
