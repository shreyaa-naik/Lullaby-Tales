require('dotenv').config();
const mongoose = require('mongoose');
const Story = require('./models/Story');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    const stories = await Story.find();
    console.log(`Found ${stories.length} stories in total`);
    console.log(JSON.stringify(stories, null, 2));
    process.exit(0);
})
.catch(console.error);
