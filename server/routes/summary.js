const express = require('express');
const router = express.Router();

// @route   POST api/summary
// @desc    Generate a simple non-API summary of content
router.post('/', (req, res) => {
    const { content } = req.body;
    
    if (!content) {
        return res.status(400).json({ msg: 'Content is required for summary' });
    }

    // Free basic NLP/summarization logic: take the first 2-3 sentences.
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    
    let summary = '';
    if (sentences.length > 0) {
        // Take up to 2 sentences
        summary = sentences.slice(0, Math.min(2, sentences.length)).join(' ').trim();
        // Fallback for very long sentences
        if (summary.length > 300) {
            summary = summary.substring(0, 300) + '...';
        }
    } else {
        // Fallback if no punctuation: take first 200 chars
        summary = content.substring(0, 200) + '...';
    }

    res.json({ summary });
});

module.exports = router;
