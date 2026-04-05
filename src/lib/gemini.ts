// Multi-key Gemini API system with automatic fallback and retry
const GEMINI_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY1,
  import.meta.env.VITE_GEMINI_API_KEY2,
].filter(Boolean);

const GEMINI_MODEL = 'gemini-2.0-flash';

export interface GeminiAnalysis {
  types: string[];
  count: number;
  weight_kg: number;
  impact: string;
  time_context: string;
}

// Sleep helper for retry delays
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function analyzeWithGemini(
  imageBase64: string,
  timeSpentSeconds: number
): Promise<GeminiAnalysis> {
  const minutes = Math.floor(timeSpentSeconds / 60);
  const secs = timeSpentSeconds % 60;
  const timeStr = minutes > 0 ? `${minutes} minutes and ${secs} seconds` : `${secs} seconds`;

  const prompt = `Analyze this image of collected plastic waste.

Return a JSON object with these exact fields:
1. "types": array of plastic/trash item types found (e.g. ["bottle", "wrapper", "bag"])
2. "count": estimated total number of plastic items visible
3. "weight_kg": approximate total weight in kg (use a reasonable estimate)
4. "impact": a 2-3 sentence description of the positive environmental impact of collecting this waste. Include an estimate of pollution reduced.
5. "time_context": a motivational sentence about how collecting this amount in ${timeStr} is impressive and the difference it makes today

Respond ONLY with valid JSON, no markdown, no code fences, no explanation.`;

  let lastError: Error | null = null;

  // Try each key, with one retry per key if rate limited
  for (let keyIndex = 0; keyIndex < GEMINI_KEYS.length; keyIndex++) {
    const key = GEMINI_KEYS[keyIndex];

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
                ]
              }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
            })
          }
        );

        if (response.status === 429) {
          console.warn(`Key ${keyIndex + 1} rate limited (attempt ${attempt + 1})`);
          if (attempt === 0) {
            // Wait before retrying same key
            await sleep(5000);
            continue;
          }
          // Move to next key
          lastError = new Error('Rate limited on all attempts');
          break;
        }

        if (!response.ok) {
          lastError = new Error(`API error ${response.status}`);
          break; // Try next key
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          lastError = new Error('No JSON in response');
          break;
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return {
          types: parsed.types || [],
          count: parsed.count || 0,
          weight_kg: parsed.weight_kg || 0,
          impact: parsed.impact || 'Great work cleaning up!',
          time_context: parsed.time_context || `You spent ${timeStr} making a difference!`
        };
      } catch (err: any) {
        console.warn(`Key ${keyIndex + 1} attempt ${attempt + 1} failed:`, err.message);
        lastError = err;
        if (attempt === 0) {
          await sleep(2000);
          continue;
        }
        break;
      }
    }
  }

  throw lastError || new Error('All Gemini API keys exhausted. Please wait a minute and try again.');
}
