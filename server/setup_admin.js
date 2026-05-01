const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const setup = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing in .env file");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to StoryVerse Database...");

        // 1. Initialize all users with isAdmin: false if they don't have it
        const initResult = await User.updateMany(
            { isAdmin: { $exists: false } }, 
            { $set: { isAdmin: false } }
        );
        console.log(`Initialized ${initResult.modifiedCount} accounts with default role.`);

        // 2. Set your specific account as Admin
        const myEmail = "shreyaa4950@gmail.com"; 
        const adminUser = await User.findOneAndUpdate(
            { email: myEmail }, 
            { $set: { isAdmin: true } },
            { new: true }
        );
        
        if (adminUser) {
            console.log(`\nSUCCESS: ${myEmail} is now a Master Admin! 🛡️`);
        } else {
            console.warn(`\nWARNING: User with email ${myEmail} not found. Please check the email and try again.`);
        }

        console.log("\nSetup complete. You can now access the Admin Dashboard.");
        process.exit(0);
    } catch (err) {
        console.error("Setup Error:", err.message);
        process.exit(1);
    }
};

setup();
