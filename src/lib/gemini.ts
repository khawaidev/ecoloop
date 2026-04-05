// Frontend Gemini client - calls the backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface GeminiAnalysis {
  types: string[];
  count: number;
  weight_kg: number;
  impact: string;
  time_context: string;
}

export async function analyzeWithGemini(
  imageBase64: string,
  timeSpentSeconds: number
): Promise<GeminiAnalysis> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_base64: imageBase64,
      time_spent_seconds: timeSpentSeconds,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Server error' }));
    throw new Error(err.error || `Server responded with ${response.status}`);
  }

  return response.json();
}
