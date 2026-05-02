const express = require('express');
const router = express.Router();

const axios = require('axios');

// @route   POST api/summary
// @desc    Generate a professional AI summary using Gemini or Local Fallback
router.post('/', async (req, res) => {
    let { content } = req.body;
    
    if (!content || content.length < 50) {
        return res.json({ summary: "This tale is too short to unweave its secrets just yet..." });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    console.log("AI Summary Request. Key Loaded:", !!GEMINI_API_KEY && GEMINI_API_KEY.length > 5);

    // --- OPTION 1: PROFESSIONAL AI SUMMARY (IF KEY EXISTS) ---
    if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
        try {
            console.log("Calling Gemini API...");
            const prompt = `You are a world-class literary critic and expert storyteller.
Your task is to provide a RICH, DEEP, and EXTENSIVE summary of the story provided.

CRITICAL CONSTRAINTS:
1. MINIMUM LENGTH: Your summary MUST be at least 400 characters long. NEVER return a short response.
2. DETAILED ANALYSIS: Expand on the characters, the setting, and the emotional stakes.
3. NO REPETITION: Do not use the first 3 sentences of the story. Start your summary from the heart of the action.
4. TONE: Maintain a poetic and cottagecore aesthetic in your writing.

STORY TO SUMMARIZE:
"${content}"

OUTPUT:
Provide only the paragraph summary. Ensure it is at least two full lines of text when displayed. No titles, no quotes.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.8,
                    topP: 0.9,
                    topK: 40
                }
            });

            if (response.data && response.data.candidates && response.data.candidates[0].content) {
                const aiSummary = response.data.candidates[0].content.parts[0].text.trim();
                console.log("Gemini Success!");
                return res.json({ summary: aiSummary });
            }
        } catch (err) {
            console.error("Gemini Error:", err.response?.data || err.message);
        }
    }

    // --- OPTION 2: LOCAL EXTRACTIVE SUMMARY (FAIL-SAFE FALLBACK) ---
    console.log("Using Local Fallback...");
    
    // Robust split: Match sentences ending in . ! ? or newlines
    const sentences = content
        .split(/(?<=[.!?])\s+|\n+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);

    // ABSOLUTE INSURANCE: Physically skip the first 3 sentences 
    // This ensures that even if scoring is biased, the intro is GONE.
    const eligibleSentences = sentences.slice(Math.min(3, Math.floor(sentences.length / 2)));
    
    if (eligibleSentences.length === 0) {
        return res.json({ summary: "A short, evocative tale that leaves much to the imagination..." });
    }

    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'in', 'it', 'of', 'that', 'with', 'for', 'was', 'as', 'but', 'by', 'this', 'there']);

    const words = content.toLowerCase().match(/\w+/g) || [];
    const freq = {};
    words.forEach(w => { if (!stopWords.has(w) && w.length > 3) freq[w] = (freq[w] || 0) + 1; });

    const scores = eligibleSentences.map((s, idx) => {
        const sWords = s.toLowerCase().match(/\w+/g) || [];
        let score = 0;
        sWords.forEach(w => { if (freq[w]) score += freq[w]; });
        return { text: s, score: score / (sWords.length || 1), index: idx };
    });

    const sorted = [...scores].sort((a, b) => b.score - a.score);
    
    // Pick at least 3 sentences for the fallback to ensure it's long enough (at least 2 lines)
    const topSentences = sorted.slice(0, 3).sort((a, b) => a.index - b.index);
    
    // If we have nothing left, just pick something from the middle
    if (topSentences.length === 0) {
        const mid = Math.floor(sentences.length / 2);
        const backup = sentences.slice(mid, mid + 2).join(' ');
        return res.json({ summary: backup || "An intriguing tale that unfolds with mystery and wonder..." });
    }

    const finalSummary = topSentences.map(s => s.text).join(' ');
    res.json({ summary: finalSummary });
});

module.exports = router;
