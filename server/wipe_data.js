const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Story = require('./models/Story');
const Notification = require('./models/Notification');

const nuke = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected for Total Reset...");

        // 1. Delete all stories
        const storiesCount = await Story.deleteMany({});
        console.log(`Removed ${storiesCount.deletedCount} stories.`);

        // 2. Delete all notifications
        const notifCount = await Notification.deleteMany({});
        console.log(`Removed ${notifCount.deletedCount} notifications.`);

        // 3. Delete all users
        const usersCount = await User.deleteMany({});
        console.log(`Removed ${usersCount.deletedCount} users.`);

        console.log("\nDATABASE WIPE COMPLETE! 🧹");
        console.log("Next Step: Register a new account and then run 'node setup_admin.js' to promote it.");
        
        process.exit(0);
    } catch (err) {
        console.error("Wipe failed:", err.message);
        process.exit(1);
    }
};

nuke();
