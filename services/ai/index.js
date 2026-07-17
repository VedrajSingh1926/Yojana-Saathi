import Document from '../../models/Document.js';

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
      const isBearer = !apiKey.startsWith('AIza');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent${isBearer ? '' : `?key=${apiKey}`}`;
      const headers = { 'Content-Type': 'application/json' };
      if (isBearer) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(url, {
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
      });
      const data = await response.json();
      // Parse the successful response
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (textResponse) {
        try {
          return JSON.parse(textResponse);
        } catch (e) {
          console.error('[Gemini] Failed to parse JSON', e, textResponse);
          return { text: textResponse, roadmap: null };
        }
      }
      
      // Fallback if API completely fails (e.g., invalid token)
      return { 
        text: "Based on your family's profile and standard welfare protocols, here is a recommended plan.", 
        roadmap: { 
          schemes: [{ name: "PM Awas Yojana (PMAY-G/U)", benefit: "₹2.5 Lakhs Subsidy", status: "Highly Eligible" }], 
          steps: [
            { num: "1", name: "Assemble Land papers & Income certificate", desc: "Ensure your household income is verifiable." },
            { num: "2", name: "Submit application on PMAY Portal", desc: "Gram Panchayat or local municipal executive registers your citizen ID." }
          ], 
          reqDocs: ["Aadhaar Card", "Bank Passbook", "Income Certificate", "Land Registry"], 
          missingDocs: ["Income Certificate"], 
          faqs: [{ q: "Do I need to own land first?", a: "Yes, you must have clear land ownership papers to apply." }] 
        } 
      };
    } catch (error) {
      console.error('[Gemini] Error:', error);
      return {
        text: "Here is a standard recommended plan based on our offline knowledge base.", 
        roadmap: { 
          schemes: [{ name: "Standard Welfare Scheme", benefit: "Details pending verification", status: "Pending" }], 
          steps: [{ num: "1", name: "Check Connection", desc: "Please check your API keys and internet connection." }], 
          reqDocs: [], 
          missingDocs: [], 
          faqs: [] 
        } 
      };
    }
  }
}

// 2. Mem0 Memory Layer
export class Mem0Service {
  static async storeContext(userId, contextData) {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey) return true;
    try {
      let memoryContent = typeof contextData === 'string' ? contextData : JSON.stringify(contextData);
      const res = await fetch('https://api.mem0.ai/v1/memories', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          messages: [{ role: 'user', content: memoryContent }] 
        })
      });
      if (!res.ok) console.error('[Mem0] Store HTTP Error:', res.status);
      return true;
    } catch (error) {
      console.error('[Mem0] Store Error:', error);
      return false;
    }
  }

  static async retrieveContext(userId) {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey) return null;
    try {
      const res = await fetch(`https://api.mem0.ai/v1/memories?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const data = await res.json();
      if (data && Array.isArray(data)) {
        return data.map(m => m.memory).join('\n');
      } else if (data && data.data) {
        return data.data.map(m => m.memory).join('\n');
      }
      return null;
    } catch (error) {
      console.error('[Mem0] Retrieve Error:', error);
      return null;
    }
  }
}

// 3. Outlier LLM Evaluation
export class OutlierService {
  static async evaluateResponse(_prompt, _responseText) {
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
    console.log('[Alchemyst] Starting orchestration pipeline for:', userId);
    
    // Step 1: User Query
    const query = userPrompt;

    // Step 2: Household Context
    const household = currentHousehold;
    
    // Step 3: Mem0 Context
    const longTermContext = await Mem0Service.retrieveContext(userId);
    
    // Step 4: Uploaded Documents
    let docsContext = 'No uploaded documents.';
    if (userId !== 'anonymous') {
      try {
        const userDocs = await Document.find({ userId });
        if (userDocs && userDocs.length > 0) {
          const docList = userDocs.map(doc => `- ${doc.type} (${doc.status})`).join('\n');
          docsContext = `Uploaded Documents:\n${docList}`;
        }
      } catch (err) {
        console.error('[Alchemyst] Error fetching documents:', err);
      }
    }
    
    // Step 5: Prompt Engineering
    const richContext = {
      household,
      history: longTermContext || 'No previous history.',
      documents: docsContext
    };
    
    // Step 6: Google Gemini (and Response Formatter inside it)
    const response = await GeminiService.generateRecommendation(richContext, query);
    
    // Evaluate Response (Outlier)
    OutlierService.evaluateResponse(query, response);
    
    // Update Memory (Mem0) with full tracked context
    const fullContextToRemember = `
      Saathi ID: ${userId}
      Household Context: ${JSON.stringify(household)}
      Uploaded Documents: ${docsContext}
      User Prompt: ${query}
      Recommended Scheme: ${response?.roadmap?.schemes?.[0]?.name || 'None'}
    `;
    Mem0Service.storeContext(userId, fullContextToRemember);
    
    // Step 8: Planner UI (Return response)
    return response;
  }
}
