import { NextRequest, NextResponse } from "next/server";

const GEMINI_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  let body: {
    question: string;
    carDetails: {
      brand: string;
      model: string;
      year: number;
      mileage: number;
      engineType: string;
    };
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { question, carDetails, history = [] } = body;

  const systemContext = `You are a friendly, expert automotive advisor specialising in UAE conditions.
You are chatting with the owner of a ${carDetails.year} ${carDetails.brand} ${carDetails.model} with ${carDetails.mileage.toLocaleString()} km on the odometer, ${carDetails.engineType} engine.
UAE context: extreme heat (40-50°C summers), desert dust, E11 highway driving, ADNOC fuel, 12-month AC usage.
Keep answers concise (2-4 sentences max unless a step-by-step is needed). Be direct, practical, and conversational. Give specific AED cost estimates when relevant.
If the question is not car-related, politely redirect to car topics.`;

  const historyText = history.slice(-4).map(h =>
    `${h.role === "user" ? "Driver" : "Advisor"}: ${h.content}`
  ).join("\n");

  const fullPrompt = `${systemContext}

${historyText ? `Previous conversation:\n${historyText}\n\n` : ""}Driver asks: ${question}

Advisor:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    const geminiData = await response.json();
    const answer = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "I couldn't process that question. Please try again.";

    return NextResponse.json({ answer }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Car chat error:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
