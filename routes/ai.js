import express from 'express';
import { AlchemystService } from '../services/ai/index.js';

const router = express.Router();

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
