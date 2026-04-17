const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Story = require('../models/Story');

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        const payload = { user: { id: newUser.id, name: newUser.name, email: newUser.email } };
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
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/auth/profile
router.get('/profile', auth, async (req, res) => {
    try {
        const userDoc = await User.findById(req.user.id).select('-password');
        if (!userDoc) return res.status(404).json({ msg: 'User not found' });

        const rawLikedIds = (userDoc.likedStories || []).map(id => id.toString());
        
        // Filter out corrupted data or dummy IDs for the real DB lookup
        const dbLikedIds = rawLikedIds.filter(id => mongoose.Types.ObjectId.isValid(id) && !id.startsWith('d000'));
        const populatedRealStories = await Story.find({ _id: { $in: dbLikedIds } }).populate('author', 'name');
        
        const dummyLookup = {
            'd00000000000000000000001': { title: 'The Midnight Star', author: { name: 'Luna Lovegood' }, likes: 124, views: 0, tags: ['Fantasy'] },
            'd00000000000000000000002': { title: 'Echoes of the Forest', author: { name: 'Caspian Thorne' }, likes: 89, views: 0, tags: ['Adventure'] },
            'd00000000000000000000003': { title: 'Clockwork Dreams', author: { name: 'Arthur Gears' }, likes: 245, views: 0, tags: ['Steampunk'] },
            'd00000000000000000000004': { title: 'The Last Alchemist', author: { name: 'Julian Thorne' }, likes: 560, views: 0, tags: ['Historical'] }
        };

        const assembledLiked = rawLikedIds.map(id => {
            const realStory = populatedRealStories.find(s => s._id.toString() === id);
            if (realStory) return realStory;
            if (dummyLookup[id]) {
                const dm = dummyLookup[id];
                return { _id: id, title: dm.title, author: dm.author, likes: dm.likes, views: dm.views, tags: dm.tags, isDummy: true };
            }
            return null;
        }).filter(Boolean);
        
        const finalUserObj = userDoc.toObject();
        finalUserObj.likedStories = assembledLiked;
        
        res.json(finalUserObj);
    } catch (err) {
        console.error("Profile Fetch Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/auth/save/:id
router.put('/save/:id', auth, async (req, res) => {
    try {
        const userToUpdate = await User.findById(req.user.id);
        const storyIdToSave = req.params.id;
        
        // Ensure we only store strings, filter out bad data
        let currentSaved = (userToUpdate.savedStories || [])
            .map(s => s.toString())
            .filter(s => s !== '[object Object]');
            
        const isCurrentlySaved = currentSaved.includes(storyIdToSave);

        if (isCurrentlySaved) {
            userToUpdate.savedStories = currentSaved.filter(id => id !== storyIdToSave);
        } else {
            userToUpdate.savedStories = [...currentSaved, storyIdToSave];
        }

        await userToUpdate.save();
        res.json({ savedStories: userToUpdate.savedStories });
    } catch (err) {
        console.error("Save Story Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/saved
router.get('/saved', auth, async (req, res) => {
    try {
        const activeUser = await User.findById(req.user.id);
        const idsToPopulate = (activeUser.savedStories || [])
            .map(id => id.toString())
            .filter(id => id !== '[object Object]');
        
        const realIds = idsToPopulate.filter(id => mongoose.Types.ObjectId.isValid(id) && !id.startsWith('d000'));
        const realPopulated = await Story.find({ _id: { $in: realIds } }).populate('author', 'name');
        
        const dummyLookup = {
            'd00000000000000000000001': { title: 'The Midnight Star', author: { name: 'Luna Lovegood' }, likes: 124, views: 0, tags: ['Fantasy'] },
            'd00000000000000000000002': { title: 'Echoes of the Forest', author: { name: 'Caspian Thorne' }, likes: 89, views: 0, tags: ['Adventure'] },
            'd00000000000000000000003': { title: 'Clockwork Dreams', author: { name: 'Arthur Gears' }, likes: 245, views: 0, tags: ['Steampunk'] },
            'd00000000000000000000004': { title: 'The Last Alchemist', author: { name: 'Julian Thorne' }, likes: 560, views: 0, tags: ['Historical'] }
        };

        const finalReadingList = idsToPopulate.map(id => {
            const real = realPopulated.find(s => s._id.toString() === id);
            if (real) return real;
            if (dummyLookup[id]) return { _id: id, ...dummyLookup[id], isDummy: true };
            return { _id: id, title: 'Archived Story', isDummy: true };
        });

        res.json(finalReadingList);
    } catch (err) {
        console.error("Fetch Saved Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/update-profile
router.put('/update-profile', auth, async (req, res) => {
    const { name, bio, avatar } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;

        await user.save();
        res.json({ id: user.id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
