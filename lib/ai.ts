// Use gemini-2.5-flash with thinking disabled for fast responses
const FAST_MODEL = "gemini-2.5-flash";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface AISearchResult {
  refinedQuery: string;
  serviceType: string;
  possibleIssue: string;
  estimatedCostRange: string;
  urgency: "low" | "medium" | "high";
}

const FALLBACK: AISearchResult = {
  refinedQuery: "",
  serviceType: "general",
  possibleIssue: "",
  estimatedCostRange: "",
  urgency: "medium",
};

export async function analyzeSearchQuery(userQuery: string): Promise<AISearchResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { ...FALLBACK, refinedQuery: userQuery + " auto repair" };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s hard timeout

    const response = await fetch(
      `${GEMINI_BASE}/${FAST_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Automotive search query analyzer. Return ONLY valid JSON.

User query: "${userQuery}"

JSON fields:
{
  "refinedQuery": "optimized Google Places search query",
  "serviceType": "general|body_shop|oil_change|tires|transmission|brakes|electrical|diagnostics|dealer",
  "possibleIssue": "brief symptom description or empty string",
  "estimatedCostRange": "e.g. 'AED 200-500' or empty string",
  "urgency": "low|medium|high"
}` }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    clearTimeout(timeout);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {
    // Timeout or network error — return fallback immediately
  }

  return { ...FALLBACK, refinedQuery: userQuery + " auto repair" };
}

export async function summarizeReviews(reviews: Array<{ text: string; rating: number }>): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || reviews.length === 0) return "";

  try {
    const reviewTexts = reviews.slice(0, 8).map(r => `[${r.rating}/5] ${r.text}`).join("\n");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(
      `${GEMINI_BASE}/${FAST_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Summarize these auto repair shop reviews in 2 concise sentences. Focus on quality, pricing, and specialties.\n\n${reviewTexts}` }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 150,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    clearTimeout(timeout);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch {
    return "";
  }
}
