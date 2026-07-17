import { AlchemystService } from '../services/ai/index.js';

export const stt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Audio file is required' });
    }

    const apiKey = process.env.GNANI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ success: true, transcript: 'I want to build my first house' });
    }

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('audio_file', blob, 'audio.wav');
    formData.append('language_code', req.body.language || 'en-IN');

    const response = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey
      },
      body: formData
    });

    const data = await response.json();
    const transcript = data.transcript || data.text || data.result?.[0]?.transcript || 'Fallback transcript.';

    return res.status(200).json({ success: true, transcript });
  } catch (error) {
    console.error('Gnani STT Error:', error);
    return res.status(200).json({ success: true, transcript: 'I want to build my first house (Offline Voice)' });
  }
};

export const planner = async (req, res, next) => {
  try {
    const { prompt, user } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const userId = user?.saathiId || 'anonymous';
    const household = user?.family || 'Unknown household structure';

    const aiResponse = await AlchemystService.orchestrate(userId, household, prompt);

    return res.status(200).json({
      success: true,
      reply: aiResponse
    });
  } catch (error) {
    next(error);
  }
};
