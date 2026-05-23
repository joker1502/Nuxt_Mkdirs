const OPENCODE_BASE = 'https://opencode.ai/zen/go/v1';
const OPENCODE_MODEL = 'deepseek-v4-pro';

/**
 * Generate structured JSON from OpenCode Go (OpenAI-compatible) API with retry logic
 * @param {string} prompt - The prompt to send
 * @param {number} maxTokens - Max output tokens
 * @param {number} retries - Number of retries on failure
 */
export async function generateJSON(prompt, maxTokens = 8192, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${OPENCODE_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENCODE_API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENCODE_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that outputs valid JSON only. Return ONLY a JSON object, no markdown fences, no explanation, no thinking process. Start directly with {.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.9,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
      }

      const result = await response.json();
      const text = result.choices?.[0]?.message?.content || '';

      // Strip markdown code fences if present
      const cleaned = text
        .replace(/^```(?:json)?\s*\n?/i, '')
        .replace(/\n?```\s*$/, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (e) {
      if (i === retries - 1) throw e;
      console.warn(`⚠️ AI API retry ${i + 1}/${retries}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}
