const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for cleanup...');

        const users = await User.find({});
        console.log(`Checking ${users.length} users...`);

        let updatedCount = 0;
        for (let user of users) {
            let changed = false;
            
            // Clean savedStories
            if (user.savedStories && user.savedStories.some(id => id.toString() === '[object Object]')) {
                user.savedStories = user.savedStories.filter(id => id.toString() !== '[object Object]');
                changed = true;
            }

            // Clean likedStories
            if (user.likedStories && user.likedStories.some(id => id.toString() === '[object Object]')) {
                user.likedStories = user.likedStories.filter(id => id.toString() !== '[object Object]');
                changed = true;
            }

            if (changed) {
                await user.save();
                updatedCount++;
                console.log(`Cleaned user: ${user.email}`);
            }
        }

        console.log(`Cleanup complete. Updated ${updatedCount} users.`);
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
