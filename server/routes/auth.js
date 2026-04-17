const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log("Registering user with email:", email);
        let user = await User.findOne({ email });
        if (user) {
            console.log("Registration failed: User with email " + email + " already exists in DB");
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id, name: user.name, email: user.email } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: payload.user });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
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
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/auth/users
// @desc    Get all users for Admin Panel
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/auth/profile
// @desc    Get user profile (including liked stories)
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const likedIds = (user.likedStories || []).map(id => id.toString());
        
        // Manually populate liked stories
        const mongoose = require('mongoose');
        const validLikedIds = likedIds.filter(id => mongoose.Types.ObjectId.isValid(id) && !id.startsWith('d000'));
        const Story = require('../models/Story');
        const populatedLiked = await Story.find({ _id: { $in: validLikedIds } }).populate('author', 'name');
        
        // Metadata for default stories so they show up in profile
        const dummyMeta = {
            'd00000000000000000000001': { title: 'The Midnight Star', author: { name: 'Luna Lovegood' }, likes: 124, views: 0, tags: ['Fantasy'] },
            'd00000000000000000000002': { title: 'Echoes of the Forest', author: { name: 'Caspian Thorne' }, likes: 89, views: 0, tags: ['Adventure'] },
            'd00000000000000000000003': { title: 'Clockwork Dreams', author: { name: 'Arthur Gears' }, likes: 245, views: 0, tags: ['Steampunk'] },
            'd00000000000000000000004': { title: 'The Last Alchemist', author: { name: 'Julian Thorne' }, likes: 560, views: 0, tags: ['Historical'] }
        };

        const finalLiked = likedIds.map(id => {
            const real = populatedLiked.find(s => s._id.toString() === id);
            if (real) return real;
            if (dummyMeta[id]) {
                const dm = dummyMeta[id];
                return { 
                    _id: id, 
                    title: dm.title, 
                    author: dm.author, 
                    likes: dm.likes + 1, // Reflect the user's like
                    views: dm.views,
                    tags: dm.tags,
                    isDummy: true 
                };
            }
            return null;
        }).filter(item => item !== null);
        
        const userObj = user.toObject();
        userObj.likedStories = finalLiked;
        
        res.json(userObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/auth/update-profile
// @desc    Update user profile
router.put('/update-profile', auth, async (req, res) => {
    const { name, bio, avatar } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;

        await user.save();
        
        // Return updated user (excluding password)
        const updatedUser = { 
            id: user.id, 
            name: user.name, 
            email: user.email,
            bio: user.bio,
            avatar: user.avatar
        };
        
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/auth/save/:id
// @desc    Save/Unsave story to reading list
router.put('/save/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const storyId = req.params.id;
        
        let savedArr = (user.savedStories || []).map(s => s.toString());
        const isSaved = savedArr.includes(storyId);

        if (isSaved) {
            user.savedStories = savedArr.filter(id => id !== storyId);
        } else {
            user.savedStories = [...savedArr, storyId];
        }

        await user.save();
        res.json({ savedStories: user.savedStories });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/saved
// @desc    Get populated reading list
router.get('/saved', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const savedIds = (user.savedStories || []).map(id => id.toString());
        
        const mongoose = require('mongoose');
        const validSavedIds = savedIds.filter(id => mongoose.Types.ObjectId.isValid(id) && !id.startsWith('d000'));
        const Story = require('../models/Story');
        const populated = await Story.find({ _id: { $in: validSavedIds } }).populate('author', 'name');
        
        const dummyMeta = {
            'd000000000000000000000001': { title: 'The Midnight Star', author: { name: 'Luna Lovegood' }, likes: 124, views: 0, tags: ['Fantasy'] },
            'd000000000000000000000002': { title: 'Echoes of the Forest', author: { name: 'Caspian Thorne' }, likes: 89, views: 0, tags: ['Adventure'] },
            'd000000000000000000000003': { title: 'Clockwork Dreams', author: { name: 'Arthur Gears' }, likes: 245, views: 0, tags: ['Steampunk'] },
            'd000000000000000000000004': { title: 'The Last Alchemist', author: { name: 'Julian Thorne' }, likes: 560, views: 0, tags: ['Historical'] }
        };

        const final = savedIds.map(id => {
            const real = populated.find(s => s._id.toString() === id);
            if (real) return real;
            if (dummyMeta[id]) return { _id: id, ...dummyMeta[id], isDummy: true };
            return { _id: id, title: 'Unknown Story', isDummy: true };
        });

        res.json(final);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
