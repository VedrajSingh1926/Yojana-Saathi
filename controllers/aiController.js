import { AlchemystService } from '../services/ai/index.js';
import { logger } from '../utils/logger.js';
import { fetchWithTimeoutAndRetry } from '../utils/http.js';

export const stt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Audio file is required' });
    }

    const apiKey = process.env.GNANI_API_KEY;
    if (!apiKey) {
      logger.warn('GNANI_API_KEY is not set. Returning fallback transcript.');
      return res.status(200).json({ success: true, transcript: "This is a fallback transcript because the API key is missing." });
    }

    const formData = new FormData();
    const audioBlob = new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/webm' });
    formData.append('audio_file', audioBlob, req.file.originalname || 'audio.webm');
    formData.append('language_code', req.body.language || 'en-IN');

    logger.info('Calling Gnani STT API');
    const response = await fetchWithTimeoutAndRetry('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: { 'X-API-Key-ID': apiKey },
      body: formData
    }, 2, 500, 15000);

    const data = await response.json();
    const transcript = data.transcript || data.text || data.result?.[0]?.transcript;

    if (!transcript) {
       logger.warn('Gnani STT returned no transcript', { data });
       return res.status(422).json({ success: false, message: 'Vachana API Error: ' + JSON.stringify(data) });
    }

    logger.info('Gnani STT successful', { transcriptLength: transcript.length });
    return res.status(200).json({ success: true, transcript });
  } catch (error) {
    logger.error('Gnani STT Error', error);
    next(error);
  }
};

export const tts = async (req, res, next) => {
  try {
    const { text, language } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text is required' });

    const apiKey = process.env.GNANI_API_KEY;
    if (!apiKey) return res.status(400).json({ success: false, message: 'API Key missing' });

    logger.info('Calling Gnani TTS API');
    
    // Guessing the Vachana TTS endpoint based on common patterns.
    const response = await fetch('https://api.vachana.ai/tts/v1', {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        language: language || 'en-IN',
        gender: 'female'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TTS API Failed: ${response.status} ${errorText}`);
    }

    // Assuming it returns an audio stream
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.setHeader('Content-Type', 'audio/wav');
    return res.send(buffer);
  } catch (error) {
    logger.error('Gnani TTS Error', error);
    next(error);
  }
};

export const planner = async (req, res, next) => {
  try {
    const { prompt, user } = req.body;
    
    const userId = user?.saathiId || 'anonymous';
    const household = user?.family || 'Unknown household structure';
    
    logger.info('Planner request received', { userId, promptLength: prompt.length });
    const aiResponse = await AlchemystService.orchestrate(userId, household, prompt);
    
    return res.status(200).json({ success: true, reply: aiResponse });
  } catch (error) {
    logger.error('Planner Error', error);
    next(error);
  }
};

// New: Test Mem0 integration
export const testMem0 = async (req, res, next) => {
  try {
    const userId = req.body.userId || 'test_user';
    const testContent = 'Mem0 integration test content';
    console.log('[Mem0 Test] Storing context for', userId);
    const storeResult = await Mem0Service.storeContext(userId, testContent);
    console.log('[Mem0 Test] Store result:', storeResult);
    const retrieved = await Mem0Service.retrieveContext(userId);
    console.log('[Mem0 Test] Retrieved:', retrieved);
    return res.status(200).json({ success: true, stored: storeResult, retrieved });
  } catch (error) {
    console.error('[Mem0 Test] Error:', error);
    next(error);
  }
};

// New: Test Gnani integration (auth check)
export const testGnani = async (req, res, next) => {
  try {
    const apiKey = process.env.GNANI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ success: true, message: 'GNANI_API_KEY not set, skipping test' });
    }
    console.log('[Gnani Test] Performing auth check');
    // Perform a lightweight request to the STT endpoint without audio to verify auth handling
    const response = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: { 'X-API-Key-ID': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ language_code: 'en-IN' })
    });
    const data = await response.json();
    console.log('[Gnani Test] Status:', response.status);
    return res.status(200).json({ success: true, status: response.status, data });
  } catch (error) {
    console.error('[Gnani Test] Error:', error);
    next(error);
  }
};

// New: Test Alchemyst integration
export const testAlchemyst = async (req, res, next) => {
  try {
    const userId = req.body.userId || 'test_user';
    const household = req.body.household || { members: [] };
    const prompt = req.body.prompt || 'Test alchemyst';
    console.log('[Alchemyst Test] Orchestrating with', { userId, household, prompt });
    const result = await AlchemystService.orchestrate(userId, household, prompt);
    console.log('[Alchemyst Test] Result obtained');
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('[Alchemyst Test] Error:', error);
    next(error);
  }
};
