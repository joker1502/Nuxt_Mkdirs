import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 4096,
    responseMimeType: 'application/json',
  },
});

/**
 * Generate structured JSON from Gemini with retry logic
 */
export async function generateJSON(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Strip markdown code fences if present
      const cleaned = text
        .replace(/^```json\s*\n?/i, '')
        .replace(/\n?```\s*$/, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (e) {
      if (i === retries - 1) throw e;
      console.warn(`⚠️ Gemini API retry ${i + 1}/${retries}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
