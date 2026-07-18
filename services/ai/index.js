import Document from '../../models/Document.js';
import { logger } from '../../utils/logger.js';
import { fetchWithTimeoutAndRetry } from '../../utils/http.js';

// 1. Google Gemini Service
export class GeminiService {
  static async generateRecommendation(context, prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn('GEMINI_API_KEY is not set. Returning fallback response.');
      return { text: "AI is currently unavailable because the API key is missing. Please contact support.", roadmap: null };
    }

    try {
      // Check if it's a bearer token (Google OAuth tokens usually start with ya29)
      const isBearer = apiKey.startsWith('ya29.');
      // Upgrade to gemini-flash-lite-latest as it is the latest supported working model
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent${isBearer ? '' : `?key=${apiKey}`}`;
      const headers = { 'Content-Type': 'application/json' };
      if (isBearer) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      logger.info('Gemini Generating Recommendation', { promptLength: prompt.length });
      const response = await fetchWithTimeoutAndRetry(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: "You are Yojana Saathi's AI Welfare Planner, an expert in Indian government schemes. Analyze the citizen's context and prompt. You MUST output ONLY valid JSON matching exactly this structure: { \"text\": \"Conversational greeting and summary of eligibility\", \"roadmap\": { \"schemes\": [{ \"name\": \"Scheme Name\", \"benefit\": \"Subsidy or benefit detail\", \"status\": \"Highly Eligible or Pending\" }], \"steps\": [{ \"num\": \"1\", \"name\": \"Step Title\", \"desc\": \"Step explanation\" }], \"reqDocs\": [\"Doc 1\", \"Doc 2\"], \"missingDocs\": [\"Doc 1\"], \"faqs\": [{ \"q\": \"Question?\", \"a\": \"Answer.\" }] } }"
            }]
          },
          generationConfig: {
            responseMimeType: "application/json"
          },
          contents: [{ parts: [{ text: `Context: ${JSON.stringify(context)}\nUser Request: ${prompt}` }] }]
        })
      }, 2, 500, 15000);

      // Task 1: Log the COMPLETE raw Gemini response before parsing
      const data = await response.json();
      logger.info('Raw Gemini Response Details', { 
        httpStatus: response.status, 
        headers: Object.fromEntries(response.headers.entries()),
        body: data 
      });

      // Task 3 & 4: Verify error object and handle gracefully
      if (!response.ok || data.error) {
        logger.error('Gemini API Error Response', { status: response.status, error: data.error });
        throw new Error(data.error?.message || `Gemini API returned status ${response.status}`);
      }

      // Task 7: Safely handle missing parts
      if (!data.candidates || data.candidates.length === 0) {
        logger.warn('Gemini API returned no candidates', { data });
        throw new Error('Gemini API returned no candidates');
      }

      const candidate = data.candidates[0];

      // Task 5: If the response contains blocked content or finishReason, log it
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        logger.warn('Gemini API returned non-STOP finishReason', { finishReason: candidate.finishReason, safetyRatings: candidate.safetyRatings });
        if (candidate.finishReason === 'SAFETY') {
           throw new Error('Gemini API blocked the response due to safety concerns.');
        }
      }

      const textResponse = candidate.content?.parts?.[0]?.text;
      
      if (textResponse) {
        try {
          return JSON.parse(textResponse);
        } catch (e) {
          logger.error('Gemini Failed to parse JSON', { parseError: e.message, text: textResponse });
          return { text: textResponse, roadmap: null };
        }
      }

      // Task 8: Print raw response whenever parsing fails
      logger.error('Gemini API returned empty text response within candidates', { data });
      throw new Error('Gemini API returned empty text response');
    } catch (error) {
      logger.error('Gemini Service Error', { error: error.message, stack: error.stack });
      throw error;
    }
  }
}

// 2. Mem0 Memory Layer
export class Mem0Service {
  static async storeContext(userId, contextData) {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey) {
      logger.warn('MEM0_API_KEY is not set. Skipping context storage.');
      return false;
    }

    try {
      let memoryContent = typeof contextData === 'string' ? contextData : JSON.stringify(contextData);
      await fetchWithTimeoutAndRetry('https://api.mem0.ai/v1/memories', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          messages: [{ role: 'user', content: memoryContent }] 
        })
      }, 2, 500, 10000);
      logger.info('Mem0 Stored Context', { userId });
      return true;
    } catch (error) {
      logger.error('Mem0 Store Error', error);
      throw error;
    }
  }

  static async retrieveContext(userId) {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey) {
      logger.warn('MEM0_API_KEY is not set. Skipping context retrieval.');
      return null;
    }

    try {
      const res = await fetchWithTimeoutAndRetry(`https://api.mem0.ai/v1/memories?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      }, 2, 500, 10000);
      
      const data = await res.json();
      if (data && Array.isArray(data)) {
        return data.map(m => m.memory).join('\n');
      } else if (data && data.data) {
        return data.data.map(m => m.memory).join('\n');
      }
      return null;
    } catch (error) {
      logger.error('Mem0 Retrieve Error', error);
      // Not throwing here, memory is not mission-critical for planning
      return null;
    }
  }
}

// 3. Outlier LLM Evaluation
export class OutlierService {
  static async evaluateResponse(_prompt, _responseText) {
    // Left as mock/telemetry stub, could integrate real tracking
    try {
      logger.debug('Outlier Logging response evaluation...');
      return { score: 98, status: 'logged' };
    } catch (error) {
      logger.error('Outlier Eval Error', error);
      return { score: 0, status: 'error' };
    }
  }
}

// 4. Alchemyst AI Orchestrator
export class AlchemystService {
  static async orchestrate(userId, currentHousehold, userPrompt) {
    logger.info('Alchemyst Starting orchestration', { userId });
    
    const query = userPrompt;
    const household = currentHousehold;
    const longTermContext = await Mem0Service.retrieveContext(userId).catch(() => null);
    
    let docsContext = 'No uploaded documents.';
    if (userId !== 'anonymous') {
      try {
        const userDocs = await Document.find({ userId });
        if (userDocs && userDocs.length > 0) {
          const docList = userDocs.map(doc => `- ${doc.type} (${doc.status})`).join('\n');
          docsContext = `Uploaded Documents:\n${docList}`;
        }
      } catch (err) {
        logger.error('Alchemyst Error fetching documents', err);
      }
    }
    
    const richContext = {
      household,
      history: longTermContext || 'No previous history.',
      documents: docsContext
    };
    
    // Core Gemini generation
    const response = await GeminiService.generateRecommendation(richContext, query);
    
    OutlierService.evaluateResponse(query, response);
    
    const fullContextToRemember = `
      Saathi ID: ${userId}
      Household Context: ${JSON.stringify(household)}
      Uploaded Documents: ${docsContext}
      User Prompt: ${query}
      Recommended Scheme: ${response?.roadmap?.schemes?.[0]?.name || 'None'}
    `;
    
    // Store asynchronously to not block response
    Mem0Service.storeContext(userId, fullContextToRemember).catch(err => {
      logger.error('Alchemyst async memory store failed', err);
    });
    
    return response;
  }
}
