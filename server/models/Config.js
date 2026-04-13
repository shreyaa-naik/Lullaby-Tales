const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
    siteName: { type: String, default: 'Lullaby Tales' },
    heroSubtitle: { type: String, default: 'Discover thousands of hand-crafted tales from a global community of authentic authors.' },
    brandColor: { type: String, default: '#D49E8D' },
    darkBrandColor: { type: String, default: '#C76A55' }
});

module.exports = mongoose.model('Config', ConfigSchema);
