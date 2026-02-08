import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/chat/completions'; // Correct DeepSeek API Endpoint

export interface NarrativeUnitResult {
  title: string;
  summary: string;
  sentiment: string;
  entities: string[];
  keywords: string[];
  conflict?: string;
}

const SYSTEM_PROMPT = `
You are a highly capable financial narrative intelligence analyst.
Your task is to analyze financial news texts and extract structured narrative components.

CRITICAL INSTRUCTIONS:
1. Output MUST be valid, parsable JSON. Do not include markdown formatting like \`\`\`json.
2. EXTRACT 3-5 high-quality "keywords" that represent the core theme (e.g., "AI Agents", "Crypto Regulation", "Market Rally"). These will be used for clustering.
3. EXTRACT key "entities" (companies, people, tokens, countries).
4. Sentiment should be strictly one of: "Bullish", "Bearish", "Neutral".
5. IMPORTANT: The "title", "summary", "conflict" and "keywords" fields MUST be in Simplified Chinese (简体中文).
`;

const USER_PROMPT_TEMPLATE = `
Analyze the following text and return a JSON object with this exact structure:
{
  "title": "Concise, impact-focused title (max 10 words, in Chinese)",
  "summary": "Clear 2-sentence summary of the event and its implication (in Chinese)",
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "entities": ["entity1", "entity2", ...],
  "keywords": ["keyword1 (Chinese)", "keyword2 (Chinese)", ...],
  "conflict": "Brief description of conflict/controversy if present (in Chinese), else null"
}

Text to analyze:
`;

export async function extractNarrative(text: string): Promise<NarrativeUnitResult | null> {
  if (!DEEPSEEK_API_KEY) {
    console.error("DeepSeek API Key is missing.");
    return null;
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "deepseek-chat", 
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: USER_PROMPT_TEMPLATE + text }
        ],
        temperature: 0.1, // Lower temperature for more deterministic/structured output
        response_format: { type: "json_object" } // Enforce JSON mode if supported (DeepSeek V3 supports this)
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30s timeout
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    if (!content) return null;

    // Clean potential markdown just in case, though response_format should handle it
    const jsonStr = content.replace(/```json\n?|```/g, '').trim();
    
    try {
        const result = JSON.parse(jsonStr) as NarrativeUnitResult;
        return result;
    } catch (parseError) {
        console.error("Failed to parse JSON from DeepSeek:", content);
        return null;
    }

  } catch (error) {
    console.error("Error calling DeepSeek API:", error instanceof Error ? error.message : error);
    return null;
  }
}
