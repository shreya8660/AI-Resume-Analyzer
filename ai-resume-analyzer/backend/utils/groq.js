import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generate content using Groq (llama-3.3-70b-versatile)
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function generateWithGroq(prompt) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  });
  return completion.choices[0]?.message?.content || '';
}

/**
 * Parse JSON from Groq response safely
 */
export function parseJsonResponse(text) {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.error('Failed to parse JSON:', text.slice(0, 200));
    throw new Error('AI returned invalid JSON format');
  }
}
