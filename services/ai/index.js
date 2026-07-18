import Document from '../../models/Document.js';
import { logger } from '../../utils/logger.js';
import { fetchWithTimeoutAndRetry } from '../../utils/http.js';
import { MemoryClient } from 'mem0ai';

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
              text: context?.type === "scam_analysis" 
                ? "You are a Cybersecurity Analyst protecting Indian citizens from welfare fraud. You MUST output ONLY raw JSON without any markdown formatting. The JSON MUST perfectly match this schema: { \"riskScore\": Number (0-100), \"category\": \"String (e.g. Phishing/Safe/Malware/Fraud)\", \"reason\": \"String explaining the analysis in detail\", \"recommendation\": \"String telling the user what action to take\" }" 
                : "You are Yojana Saathi's AI Welfare Agent, an expert orchestrator for Indian government schemes. Analyze the citizen's context, answer their questions, and recommend the best schemes based on their profile. Do not force missing documents. You MUST output ONLY valid JSON. Your JSON must contain a `text` field with your reply, and a `detectedLang` field containing the ISO language code (en, hi, ta, te, bn). \n\nCRITICAL FORMATTING INSTRUCTION:\nYou MUST use beautiful, structured Markdown in the `text` field. Never use flat boring paragraphs! Use bullet points, bold text for emphasis, and numbered lists to create a step-by-step roadmap. Whenever you recommend a scheme, format it exactly as:\n\n### [Scheme Name]\n**Description:** [Short]\n**Eligibility:** [Criteria]\n**Benefits:** [Benefits]\n**Required Documents:** [Docs]\n**Official Website:** [URL]\n\n[Apply Now]([URL]) [Learn More]([URL])\n\nExample JSON: { \"text\": \"Here is your step-by-step roadmap:\\n1. **Step 1**...\", \"detectedLang\": \"en\" }"
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

      let textResponse = candidate.content?.parts?.[0]?.text;
      
      if (textResponse) {
        try {
          // Remove potential markdown JSON formatting
          textResponse = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          textResponse = textResponse.trim();
          
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
  static getClient() {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey) return null;
    return new MemoryClient({ apiKey });
  }

  static async storeContext(userId, contextData) {
    const client = this.getClient();
    if (!client) {
      logger.warn('MEM0_API_KEY is not set. Skipping context storage.');
      return false;
    }

    try {
      let memoryContent = typeof contextData === 'string' ? contextData : JSON.stringify(contextData);
      await client.add(
        [{ role: 'user', content: memoryContent }],
        { user_id: userId }
      );
      logger.info('Mem0 Stored Context', { userId });
      return true;
    } catch (error) {
      logger.error('Mem0 Store Error', error);
      throw error;
    }
  }

  static async retrieveContext(userId) {
    const client = this.getClient();
    if (!client) {
      logger.warn('MEM0_API_KEY is not set. Skipping context retrieval.');
      return null;
    }

    try {
      // Use search to retrieve relevant context
      const results = await client.search(userId, { user_id: userId, limit: 5 });
      
      let memories = [];
      // Handle various response shapes from Mem0
      if (Array.isArray(results)) {
        memories = results;
      } else if (results && Array.isArray(results.data)) {
        memories = results.data;
      } else if (results && Array.isArray(results.results)) {
        memories = results.results;
      }
      
      if (memories.length > 0) {
        return memories.map(m => m.memory).join('\n');
      }
      return null;
    } catch (error) {
      logger.error('Mem0 Retrieve Error', error);
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
  static async orchestrate(userId, currentHousehold, userPrompt, lang = 'en', state = 'All States') {
    logger.info('Alchemyst Starting orchestration', { userId, lang });
    
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
      documents: docsContext,
      stateContext: `The user's selected state is: ${state}. Focus recommendations on Central Government schemes and specifically ${state} State Government schemes.`
    };
    
    // Inject Language requirement into the prompt
    let localizedQuery = query;
    const langNames = { en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu", bn: "Bengali" };
    const requestedLanguage = langNames[lang] || lang;
    
    localizedQuery = `The selected application language is: ${requestedLanguage}.
You MUST generate your ENTIRE response in this language.
Do NOT mix English except for:
- Official Government Scheme Names
- Government Departments
- URLs
- Official Document Names
Everything else including headings, explanations, recommendations, summaries, lists and action items must be written in the selected language.

User Request:
${query}`;

    // Core Gemini generation
    const response = await GeminiService.generateRecommendation(richContext, localizedQuery);
    
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
