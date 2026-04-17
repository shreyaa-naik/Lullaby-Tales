const mongoose = require('mongoose');

const DailyStorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Erases after 24 hours (86400 seconds)
    }
});

module.exports = mongoose.model('DailyStory', DailyStorySchema);
