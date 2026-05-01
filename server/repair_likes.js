require('dotenv').config();
const mongoose = require('mongoose');
const Story = require('./models/Story');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    const stories = await Story.find();
    for (let story of stories) {
        let actualLikes = story.likedBy ? story.likedBy.length : 0;
        if (story.likes !== actualLikes || story.likes < 0) {
            story.likes = actualLikes;
            await story.save();
            console.log(`Repaired story ${story._id} likes to ${actualLikes}`);
        }
    }
    console.log('Done repairing likes.');
    process.exit(0);
})
.catch(console.error);
