const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

// @route   GET api/config
// @desc    Get website configuration
router.get('/', async (req, res) => {
    try {
        let config = await Config.findOne();
        if (!config) {
            config = new Config({});
            await config.save();
        }
        res.json(config);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/config
// @desc    Update website configuration (Admin only ideally, but exposed for demo)
router.post('/', async (req, res) => {
    try {
        const { siteName, heroSubtitle, brandColor, darkBrandColor } = req.body;
        
        // Find existing config or create new
        let config = await Config.findOne();
        if (!config) {
            config = new Config({});
        }

        config.siteName = siteName || config.siteName;
        config.heroSubtitle = heroSubtitle || config.heroSubtitle;
        config.brandColor = brandColor || config.brandColor;
        config.darkBrandColor = darkBrandColor || config.darkBrandColor;

        await config.save();
        res.json(config);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
