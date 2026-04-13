const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    likedStories: [String], // All story IDs (Real & Dummy)
    savedStories: [String], // Reading List IDs (Real & Dummy)
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
