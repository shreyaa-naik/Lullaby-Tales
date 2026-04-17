const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');

// @route   GET api/stories
// @desc    Get all published stories
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find({ status: 'Published' }).populate('author', ['name']).sort({ createdAt: -1 });
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
        const targetId = req.params.id;
        const isDummyTale = targetId.startsWith('d000');
        const token = req.header('x-auth-token');
        let isStoryLiked = false;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.user.id);
                if (user && user.likedStories) {
                    isStoryLiked = user.likedStories.map(s => s.toString()).includes(targetId);
                }
            } catch (err) {}
        }

        if (isDummyTale) {
            const dummyBases = {
                'd00000000000000000000001': { title: 'The Midnight Star', likes: 124 },
                'd00000000000000000000002': { title: 'Echoes of the Forest', likes: 89 },
                'd00000000000000000000003': { title: 'Clockwork Dreams', likes: 245 },
                'd00000000000000000000004': { title: 'The Last Alchemist', likes: 560 }
            };
            const dm = dummyBases[targetId] || { title: 'Unknown', likes: 0 };
            return res.json({
                _id: targetId,
                title: dm.title,
                likes: dm.likes + (isStoryLiked ? 1 : 0),
                isLiked: isStoryLiked,
                isDummy: true
            });
        }

        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(404).json({ msg: 'Tale not found (Invalid ID format)' });
        }

        const foundStory = await Story.findByIdAndUpdate(
            targetId, 
            { $inc: { views: 1 } }, 
            { new: true }
        ).populate('author', ['name']);
        
        if (!foundStory) return res.status(404).json({ msg: 'Story not found in archives' });
        
        const storyPayload = foundStory.toObject();
        storyPayload.isLiked = isStoryLiked;
        res.json(storyPayload);
    } catch (err) {
        console.error("Fetch Story Error:", err.message);
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

        const savedStory = await newStory.save();
        res.json(savedStory);
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
        let storyToUpdate = await Story.findById(req.params.id);
        if (!storyToUpdate) return res.status(404).json({ msg: 'Story not found' });

        if (storyToUpdate.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updateFields = {};
        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        if (tags) updateFields.tags = tags;
        if (image) updateFields.image = image;

        const updatedStory = await Story.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        res.json(updatedStory);
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/me
// @desc    Get current user's stories
router.get('/me', auth, async (req, res) => {
    try {
        const myStories = await Story.find({ author: req.user.id }).sort({ createdAt: -1 });
        res.json(myStories);
    } catch (err) {
        console.error("Fetch My Stories Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/stories/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const storyToDelete = await Story.findById(req.params.id);
        if (!storyToDelete) return res.status(404).json({ msg: 'Story not found' });

        if (storyToDelete.author.toString() !== req.user.id) {
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
router.put('/:id/like', auth, async (req, res) => {
    try {
        const storyIdToLike = req.params.id;
        const isDummy = storyIdToLike.startsWith('d000');
        let actualStory = await Story.findById(storyIdToLike);
        
        if (!actualStory && isDummy) {
            const dummyBases = {
                'd00000000000000000000001': { title: 'The Midnight Star', likes: 124, content: "Leo was a collector of forgotten things...", authorName: 'Luna Lovegood' },
                'd00000000000000000000002': { title: 'Echoes of the Forest', likes: 89, content: "In the heart of the Emerald Woods...", authorName: 'Caspian Thorne' },
                'd00000000000000000000003': { title: 'Clockwork Dreams', likes: 245, content: "The city of Oakhaven breathed smoke...", authorName: 'Arthur Gears' },
                'd00000000000000000000004': { title: 'The Last Alchemist', likes: 560, content: "Nicholas stood before the golden crucible...", authorName: 'Julian Thorne' }
            };
            const baseData = dummyBases[storyIdToLike];
            if (baseData) {
                actualStory = new Story({
                    _id: storyIdToLike,
                    title: baseData.title,
                    content: baseData.content,
                    likes: baseData.likes,
                    author: req.user.id,
                    isDummy: true
                });
            }
        }
        
        if (!isDummy && !actualStory) return res.status(404).json({ msg: 'Story not found' });
        
        const user = await User.findById(req.user.id);
        const likedStoriesArr = (user.likedStories || []).map(s => s.toString());
        const alreadyLiked = likedStoriesArr.includes(storyIdToLike);

        if (alreadyLiked) {
            user.likedStories = likedStoriesArr.filter(id => id !== storyIdToLike);
            if (actualStory) actualStory.likes = Math.max(0, (actualStory.likes || 1) - 1);
        } else {
            user.likedStories = [...likedStoriesArr, storyIdToLike];
            if (actualStory) actualStory.likes = (actualStory.likes || 0) + 1;
        }

        await user.save();
        if (actualStory) await actualStory.save();

        res.json({ 
            likes: actualStory ? actualStory.likes : 0, 
            isLiked: !alreadyLiked 
        });
    } catch (err) {
        console.error("Like Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/stories/:id/rate
router.put('/:id/rate', auth, async (req, res) => {
    try {
        const { rating } = req.body;
        const storyToRate = await Story.findById(req.params.id);
        if (!storyToRate) return res.status(404).json({ msg: 'Story not found' });

        const currentCount = 10;
        const currentAvg = storyToRate.rating || 0;
        const newAvg = ((currentAvg * currentCount) + rating) / (currentCount + 1);
        
        storyToRate.rating = Number(newAvg.toFixed(1));
        await storyToRate.save();
        res.json(storyToRate.rating);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
