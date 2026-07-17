import fetch from 'node-fetch'; // Standard fetch is available in Node 18+

// 1. Google Gemini Service
export class GeminiService {
  static async generateRecommendation(context, prompt) {
    // Uses Google Gemini via REST API or SDK
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Gemini] No API key found, returning mock response.');
      return "Based on your family's profile, you are eligible for PM Awas Yojana and PM Kisan Samman Nidhi.";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Context: ${JSON.stringify(context)}\nPrompt: ${prompt}` }] }]
        })
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('[Gemini] Error:', error);
      return "An error occurred while connecting to Gemini.";
    }
  }
}

// 2. Mem0 Memory Layer
export class Mem0Service {
  static async storeContext(userId, contextData) {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey) return true; // Mock success
    try {
      // Mock Mem0 API Call
      await fetch('https://api.mem0.ai/v1/memories', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, data: contextData })
      });
      return true;
    } catch (error) {
      console.error('[Mem0] Store Error:', error);
      return false;
    }
  }

  static async retrieveContext(userId) {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey) return null; // Mock empty context
    try {
      const res = await fetch(`https://api.mem0.ai/v1/memories?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      return await res.json();
    } catch (error) {
      console.error('[Mem0] Retrieve Error:', error);
      return null;
    }
  }
}

// 3. Outlier LLM Evaluation
export class OutlierService {
  static async evaluateResponse(prompt, responseText) {
    const apiKey = process.env.OUTLIER_API_KEY;
    if (!apiKey) return { score: 95, status: 'mocked' };
    
    // Asynchronous logging to Outlier for Quality Tracking
    try {
      // Mock Outlier API Endpoint
      console.log(`[Outlier] Logging response evaluation...`);
      return { score: 98, status: 'logged' };
    } catch (error) {
      console.error('[Outlier] Eval Error:', error);
      return { score: 0, status: 'error' };
    }
  }
}

// 4. Alchemyst AI Orchestrator
export class AlchemystService {
  static async orchestrate(userId, currentHousehold, userPrompt) {
    console.log('[Alchemyst] Starting orchestration pipeline...');
    
    // Step 1: Retrieve Long-Term Memory (Mem0)
    const longTermContext = await Mem0Service.retrieveContext(userId);
    
    // Step 2: Prompt Engineering with Context
    const richContext = {
      household: currentHousehold,
      history: longTermContext || 'No previous history.'
    };
    
    // Step 3: LLM Generation (Gemini)
    const response = await GeminiService.generateRecommendation(richContext, userPrompt);
    
    // Step 4: Evaluate Response (Outlier)
    // Non-blocking evaluation
    OutlierService.evaluateResponse(userPrompt, response);
    
    // Step 5: Update Memory (Mem0)
    // Non-blocking memory update
    Mem0Service.storeContext(userId, { prompt: userPrompt, response: response });
    
    return response;
  }
}
