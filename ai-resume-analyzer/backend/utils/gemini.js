import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate content using Gemini Flash model
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} - The generated text
 */
export async function generateWithGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Parse JSON from Gemini response safely
 */
export function parseJsonResponse(text) {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.error('Failed to parse JSON:', text.slice(0, 200));
    throw new Error('AI returned invalid JSON format');
  }
}
