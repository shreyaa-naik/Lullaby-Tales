const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find();
        console.log("Current Users in DB:");
        users.forEach(u => console.log(`- "${u.email}" (isAdmin: ${u.isAdmin})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
