interface AISearchResult {
  refinedQuery: string;
  serviceType: string;
  possibleIssue: string;
  estimatedCostRange: string;
  urgency: "low" | "medium" | "high";
}

export async function analyzeSearchQuery(
  userQuery: string
): Promise<AISearchResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      refinedQuery: userQuery + " auto repair",
      serviceType: "general",
      possibleIssue: "",
      estimatedCostRange: "",
      urgency: "medium",
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an automotive expert assistant. Analyze this user search query for finding an auto repair shop and return a JSON response.

User query: "${userQuery}"

Return ONLY valid JSON with these fields:
{
  "refinedQuery": "optimized Google Places search query for finding the right shop",
  "serviceType": "one of: general, body_shop, oil_change, tires, transmission, brakes, electrical, diagnostics, dealer",
  "possibleIssue": "brief description of what the car issue might be based on symptoms described, or empty string",
  "estimatedCostRange": "estimated repair cost range like '$100-$300' or empty string if unclear",
  "urgency": "low, medium, or high based on safety implications"
}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("AI search analysis failed:", e);
  }

  return {
    refinedQuery: userQuery + " auto repair",
    serviceType: "general",
    possibleIssue: "",
    estimatedCostRange: "",
    urgency: "medium",
  };
}

export async function summarizeReviews(
  reviews: Array<{ text: string; rating: number }>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || reviews.length === 0) return "";

  try {
    const reviewTexts = reviews
      .slice(0, 10)
      .map((r) => `[${r.rating}/5] ${r.text}`)
      .join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize these auto repair shop reviews in 2-3 concise sentences. Focus on: quality of work, pricing, wait times, and specialties. Be direct and helpful.

Reviews:
${reviewTexts}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (e) {
    console.error("Review summary failed:", e);
    return "";
  }
}
