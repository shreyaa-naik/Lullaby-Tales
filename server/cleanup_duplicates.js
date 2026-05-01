const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected for cleanup...");

        const users = await User.find();
        for (let user of users) {
             let modified = false;

             // Deduplicate likedStories
             const originalLikedCount = user.likedStories.length;
             user.likedStories = [...new Set(user.likedStories.map(id => id.toString()))];
             if (user.likedStories.length !== originalLikedCount) modified = true;

             // Deduplicate savedStories
             const originalSavedCount = user.savedStories.length;
             user.savedStories = [...new Set(user.savedStories.map(id => id.toString()))];
             if (user.savedStories.length !== originalSavedCount) modified = true;

             if (modified) {
                 await user.save();
                 console.log(`Cleaned up user: ${user.name}`);
             }
        }

        console.log("Cleanup complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanup();
