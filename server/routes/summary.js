const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   POST api/summary
// @desc    Generate a professional AI summary with a poetic fallback
router.post('/', async (req, res) => {
    let { content } = req.body;
    
    if (!content || content.length < 50) {
        return res.json({ summary: "This tale is too brief to reveal its deeper truths just yet..." });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // --- OPTION 1: PROFESSIONAL AI SUMMARY ---
    if (GEMINI_API_KEY && GEMINI_API_KEY.length > 20) {
        try {
            const prompt = `You are an expert storyteller with a cottagecore soul. 
Summarize the following story in a RICH, POETIC, and EXTENSIVE paragraph (minimum 400 characters). 
Focus on the atmosphere, characters, and emotional journey. 
Maintain a vintage, cozy tone. Do not start with "This story is about...".

STORY:
"${content}"`;

            // Updated to the latest recommended stable endpoint
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            });

            if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return res.json({ summary: response.data.candidates[0].content.parts[0].text.trim() });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error?.message || "";
            if (errorMsg.includes("leaked")) {
                console.error("CRITICAL: Your GEMINI_API_KEY is blocked/leaked. Please update .env with a new key.");
            } else {
                console.error("Gemini API Error:", errorMsg || err.message);
            }
            // Continue to fallback if API fails
        }
    }

    // --- OPTION 2: PREMIUM COTTAGECORE FALLBACK ---
    // If the API key is leaked or missing, we use this intelligent fallback
    const sentences = content
        .split(/(?<=[.!?])\s+|\n+/)
        .map(s => s.trim())
        .filter(s => s.length > 15);

    // Skip the very first sentence to avoid repetition
    const middleContent = sentences.length > 4 ? sentences.slice(1, -1) : sentences;
    
    // Pick sentences with the most descriptive words
    const descriptors = ['whisper', 'forest', 'heart', 'journey', 'golden', 'shadow', 'silent', 'ancient', 'soft', 'eternal', 'magic', 'dream', 'starlight'];
    
    const scored = middleContent.map(s => {
        let score = s.length;
        descriptors.forEach(word => { if (s.toLowerCase().includes(word)) score += 20; });
        return { text: s, score };
    });

    const topSentences = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(s => s.text);

    const fallbackSummary = `Within these lines lies a journey that ${topSentences[0] || "unfolds with mystery"}. As the narrative deepens, we see how ${topSentences[1] || "every choice carries weight"}, ultimately revealing that ${topSentences[2] || "some tales are meant to be felt rather than just read"}. A truly evocative piece that captures the essence of the storyteller's soul.`;

    res.json({ summary: fallbackSummary });
});

module.exports = router;
