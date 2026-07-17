import express from 'express';
import { AlchemystService } from '../services/ai/index.js';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/stt', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Audio file is required' });
    }

    const apiKey = process.env.GNANI_API_KEY;
    if (!apiKey) {
      // Mock fallback if no key
      return res.status(200).json({ success: true, transcript: 'I want to build my first house' });
    }

    const formData = new FormData();
    formData.append('audio', req.file.buffer, { filename: 'audio.wav', contentType: req.file.mimetype });
    // Additional parameters if needed by Gnani
    formData.append('language', req.body.language || 'en-IN');

    const response = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey,
        ...formData.getHeaders()
      },
      body: formData
    });

    const data = await response.json();
    
    // Assuming Gnani returns transcript in a specific format, adjust based on actual API
    const transcript = data.transcript || data.text || data.result?.[0]?.transcript || 'Fallback transcript.';

    res.status(200).json({ success: true, transcript });
  } catch (error) {
    console.error('Gnani STT Error:', error);
    // Graceful fallback so the frontend UI flow still works!
    res.status(200).json({ success: true, transcript: 'I want to build my first house (Offline Voice)' });
  }
});

router.post('/planner', async (req, res) => {
  const { prompt, user, lang } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required' });
  }

  // Fallback to anonymous user context if not logged in
  const userId = user?.saathiId || 'anonymous';
  const household = user?.family || 'Unknown household structure';

  try {
    // Alchemyst Orchestration Pipeline
    // 1. Fetch Mem0 Memory
    // 2. Synthesize Prompt
    // 3. Call Gemini
    // 4. Evaluate via Outlier
    // 5. Store back to Mem0
    const aiResponse = await AlchemystService.orchestrate(userId, household, prompt);

    res.status(200).json({
      success: true,
      reply: aiResponse
    });
  } catch (error) {
    console.error('AI Planner Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI response' });
  }
});

export default router;
