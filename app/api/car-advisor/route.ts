import { NextRequest, NextResponse } from "next/server";

const GEMINI_KEY = process.env.GEMINI_API_KEY;

export interface MaintenanceItem {
  item: string;
  category: string;
  intervalKm: number;
  lastDoneKm: number | null;
  dueAtKm: number;
  overdueBy: number; // km overdue (0 if not overdue)
  status: "urgent" | "due_soon" | "ok" | "unknown";
  estimatedCostAed: string;
  description: string;
  diyDifficulty: "Easy" | "Medium" | "Hard" | "Workshop Only";
}

export interface CarAdvisorResponse {
  summary: string;
  overallScore: number; // 0-100
  nextServiceKm: number;
  maintenanceItems: MaintenanceItem[];
  urgentCount: number;
  dueSoonCount: number;
  tips: string[];
  generatedAt: string;
}

export async function POST(request: NextRequest) {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  let body: {
    brand: string;
    model: string;
    year: number;
    mileage: number;
    engineType: string;
    lastOilChangeMileage?: number;
    lastServiceDate?: string;
    additionalInfo?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    brand, model, year, mileage, engineType,
    lastOilChangeMileage, lastServiceDate, additionalInfo,
  } = body;

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;

  const prompt = `You are an expert automotive maintenance advisor for UAE conditions (extreme heat 40-50°C summer, desert dust, high mileage highway driving, fuel quality variations).

Vehicle Details:
- Brand & Model: ${brand} ${model}
- Year: ${year} (${vehicleAge} years old)
- Current Mileage: ${mileage.toLocaleString()} km
- Engine Type: ${engineType}
- Last Oil Change: ${lastOilChangeMileage ? `at ${lastOilChangeMileage.toLocaleString()} km (${mileage - lastOilChangeMileage} km ago)` : "Unknown"}
- Last Major Service: ${lastServiceDate || "Unknown"}
${additionalInfo ? `- Additional Info: ${additionalInfo}` : ""}

Provide a comprehensive maintenance schedule in STRICT JSON format. UAE conditions require more frequent service intervals. Consider the vehicle age and mileage.

Response must be valid JSON with this exact structure:
{
  "summary": "2-3 sentence overall health assessment",
  "overallScore": 75,
  "nextServiceKm": 85000,
  "urgentCount": 2,
  "dueSoonCount": 3,
  "tips": ["UAE-specific tip 1", "tip 2", "tip 3"],
  "maintenanceItems": [
    {
      "item": "Engine Oil & Filter",
      "category": "Engine",
      "intervalKm": 10000,
      "lastDoneKm": ${lastOilChangeMileage || null},
      "dueAtKm": ${lastOilChangeMileage ? lastOilChangeMileage + 10000 : mileage + 5000},
      "overdueBy": 0,
      "status": "ok",
      "estimatedCostAed": "180-280",
      "description": "Synthetic oil recommended for UAE heat",
      "diyDifficulty": "Easy"
    }
  ]
}

Include ALL of these maintenance items (adjust intervals for UAE conditions and vehicle type):
1. Engine Oil & Filter
2. Air Filter (engine)
3. Cabin Air Filter
4. Spark Plugs (if petrol)
5. Fuel Filter
6. Brake Pads (front)
7. Brake Pads (rear)
8. Brake Fluid
9. Transmission Fluid (auto or manual)
10. Coolant/Antifreeze
11. Power Steering Fluid
12. AC Filter & Service (critical for UAE)
13. Tyres (rotation & wear check)
14. Wheel Alignment
15. Battery (UAE heat degrades batteries faster)
16. Timing Belt/Chain (if due based on mileage/age)
17. Serpentine/Drive Belt
18. Wiper Blades
19. PCV Valve
20. Suspension Check
21. Brake Rotor Inspection
22. Differential Fluid (if AWD/4WD)
23. Transfer Case Fluid (if 4WD)
24. CV Joints/Boots

Status rules:
- "urgent": overdueBy > 0 or critical items
- "due_soon": within 3000 km or 2 months
- "ok": more than 3000 km away
- "unknown": cannot determine from given info

Respond ONLY with valid JSON, no markdown, no explanation.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    const geminiData = await response.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON in Gemini response");
    }

    const parsed = JSON.parse(jsonMatch[0]) as CarAdvisorResponse;
    parsed.generatedAt = new Date().toISOString();

    return NextResponse.json(parsed, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Car advisor error:", error);
    return NextResponse.json({ error: "Failed to generate maintenance advice" }, { status: 500 });
  }
}
