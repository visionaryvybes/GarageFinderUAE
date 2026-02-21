import { NextRequest, NextResponse } from "next/server";

const GEMINI_KEY = process.env.GEMINI_API_KEY;

export interface MaintenanceItem {
  item: string;
  category: string;
  intervalKm: number;
  lastDoneKm: number | null;
  dueAtKm: number;
  overdueBy: number;
  status: "urgent" | "due_soon" | "ok" | "unknown";
  estimatedCostAed: string;
  description: string;
  diyDifficulty: "Easy" | "Medium" | "Hard" | "Workshop Only";
  uaeNote?: string;
}

export interface SafetyAlert {
  item: string;
  severity: "critical" | "warning" | "info";
  description: string;
  action: string;
  estimatedCostAed?: string;
}

export interface UAEClimateAlert {
  title: string;
  description: string;
  season: "summer" | "winter" | "year-round";
  priority: "high" | "medium" | "low";
}

export interface TyrePressure {
  frontPsi: number;
  rearPsi: number;
  sparePsi: number;
  frontBar: number;
  rearBar: number;
  uaeNote: string;
  checkFrequency: string;
}

export interface WarningLight {
  name: string;
  color: string;
  meaning: string;
  action: string;
  urgency: "stop_now" | "service_soon" | "informational";
}

export interface CarAdvisorResponse {
  aiSummary: string;
  summary: string;
  overallScore: number;
  nextServiceKm: number;
  nextServiceEstimatedDate: string;
  estimatedAnnualCostAed: string;
  maintenanceItems: MaintenanceItem[];
  safetyAlerts: SafetyAlert[];
  uaeClimateAlerts: UAEClimateAlert[];
  tyrePressure: TyrePressure;
  warningLights: WarningLight[];
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
  const avgKmPerYear = Math.round(mileage / Math.max(vehicleAge, 1));

  const prompt = `You are an expert UAE automotive advisor with access to real vehicle specifications and manufacturer data. You must provide ACCURATE, VEHICLE-SPECIFIC information for a ${year} ${brand} ${model}.

Use your knowledge and search capabilities to look up the EXACT specifications for this specific vehicle — do NOT provide generic values that apply to "most cars". Every vehicle has different specs.

Vehicle Details:
- Brand & Model: ${brand} ${model}
- Year: ${year} (${vehicleAge} years old)
- Current Mileage: ${mileage.toLocaleString()} km
- Engine Type: ${engineType}
- Estimated annual mileage: ~${avgKmPerYear.toLocaleString()} km/year
- Last Oil Change: ${lastOilChangeMileage ? `at ${lastOilChangeMileage.toLocaleString()} km (${(mileage - lastOilChangeMileage).toLocaleString()} km ago)` : "Unknown"}
- Last Major Service: ${lastServiceDate || "Unknown"}
${additionalInfo ? `- Driver reported issues: ${additionalInfo}` : ""}

UAE Operating Context: 40-50°C summer heat, heavy desert dust, high UV radiation, sandstorms, Abu Dhabi/Dubai stop-and-go traffic, E11 highway high-speed driving, ADNOC fuel.

CRITICAL REQUIREMENTS:
1. Tyre pressures MUST be the actual manufacturer-specified values for the ${year} ${brand} ${model} as found on the door jamb sticker or owner's manual — NOT a generic "33 PSI for most cars". A Ford F-150 has different pressures than an Audi A4. Search your knowledge.
2. Annual maintenance cost MUST reflect the actual cost tier for this specific vehicle (a Nissan Sentra costs far less than a BMW M5 to maintain in UAE).
3. overallScore MUST be calculated based on the actual age (${vehicleAge} years) and mileage (${mileage.toLocaleString()} km) of THIS vehicle.
4. All maintenance intervals MUST match the actual ${brand} ${model} owner's manual specs.
5. The aiSummary MUST specifically mention "${brand} ${model}" and give advice relevant to this exact vehicle.

Respond with ONLY valid JSON (no markdown, no code blocks, no explanatory text) matching this structure exactly:

{
  "aiSummary": "3-4 sentence paragraph addressed directly to the owner of this specific ${year} ${brand} ${model}. Reference the car by name. Mention its most important service need based on ${mileage.toLocaleString()} km and ${vehicleAge} years of age in UAE conditions.",
  "summary": "2-sentence factual summary for the ${year} ${brand} ${model} at ${mileage.toLocaleString()} km.",
  "overallScore": <integer 0-100 reflecting actual vehicle condition based on age and mileage>,
  "nextServiceKm": <next recommended service interval km milestone for ${brand} ${model}>,
  "nextServiceEstimatedDate": "<month year based on ~${avgKmPerYear.toLocaleString()} km/year usage>",
  "estimatedAnnualCostAed": "<realistic annual maintenance cost range in AED for ${brand} ${model} in UAE, e.g. '2,500 - 4,000' for economy car or '8,000 - 15,000' for luxury>",
  "urgentCount": <count of urgent items>,
  "dueSoonCount": <count of due_soon items>,
  "tips": [
    "<UAE-specific tip for ${brand} ${model} owners>",
    "<UAE-specific tip>",
    "<UAE-specific tip>",
    "<UAE-specific tip>",
    "<UAE-specific tip>"
  ],
  "tyrePressure": {
    "frontPsi": <EXACT manufacturer front tyre pressure in PSI for ${year} ${brand} ${model} — look this up, do NOT use 33 as default>,
    "rearPsi": <EXACT manufacturer rear tyre pressure in PSI for ${year} ${brand} ${model} — may differ from front>,
    "sparePsi": <spare tyre pressure, typically 60 PSI for full-size spare or 60 PSI for compact spare>,
    "frontBar": <frontPsi × 0.0689476, rounded to 1 decimal>,
    "rearBar": <rearPsi × 0.0689476, rounded to 1 decimal>,
    "uaeNote": "Vehicle-specific UAE tyre pressure advice for the ${brand} ${model}. Mention the actual PSI values and why they matter in UAE heat.",
    "checkFrequency": "Weekly in UAE summer (June-Sept), bi-weekly otherwise"
  },
  "safetyAlerts": [
    {
      "item": "<safety item specific to ${brand} ${model} at ${mileage.toLocaleString()} km>",
      "severity": "critical|warning|info",
      "description": "<specific description mentioning ${brand} ${model}>",
      "action": "<specific action>",
      "estimatedCostAed": "<realistic AED cost>"
    }
  ],
  "uaeClimateAlerts": [
    {
      "title": "<UAE climate alert title>",
      "description": "<UAE-specific description for ${brand} ${model}>",
      "season": "summer|winter|year-round",
      "priority": "high|medium|low"
    }
  ],
  "warningLights": [
    {
      "name": "<warning light name>",
      "color": "red|amber|green",
      "meaning": "<what it means on a ${brand} ${model}>",
      "action": "<what driver should do>",
      "urgency": "stop_now|service_soon|informational"
    }
  ],
  "maintenanceItems": [
    {
      "item": "Engine Oil & Filter",
      "category": "Engine",
      "intervalKm": <actual ${brand} ${model} oil change interval from owner's manual>,
      "lastDoneKm": ${lastOilChangeMileage || null},
      "dueAtKm": <calculate based on lastOilChangeMileage + interval, or next round number>,
      "overdueBy": <km overdue if applicable, else 0>,
      "status": "${lastOilChangeMileage && (mileage - lastOilChangeMileage) > 8000 ? "urgent" : lastOilChangeMileage && (mileage - lastOilChangeMileage) > 5000 ? "due_soon" : "ok"}",
      "estimatedCostAed": "<realistic AED range for ${brand} ${model} oil change in UAE>",
      "description": "<${brand} ${model} specific oil type and grade recommendation>",
      "diyDifficulty": "Easy|Medium|Hard|Workshop Only",
      "uaeNote": "<UAE-specific note>"
    },
    {
      "item": "Engine Air Filter",
      "category": "Engine",
      "intervalKm": <actual interval for ${brand} ${model}>,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<AED range>",
      "description": "<${brand} ${model} specific>",
      "diyDifficulty": "Easy",
      "uaeNote": "UAE desert dust clogs air filters 3x faster. Replace every 15,000 km in UAE."
    },
    {
      "item": "Cabin Air Filter",
      "category": "Climate",
      "intervalKm": <actual interval>,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<AED range>",
      "description": "<specific to ${brand} ${model}>",
      "diyDifficulty": "Easy",
      "uaeNote": "Critical in UAE — dirty cabin filter strains AC compressor in 50°C heat."
    },
    {
      "item": "AC System Service",
      "category": "Climate",
      "intervalKm": <actual interval>,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<realistic AED for ${brand} ${model} AC service in UAE>",
      "description": "<${brand} ${model} specific AC system notes>",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "AC failure in UAE summer is a safety emergency. Service annually before June."
    },
    {
      "item": "Brake Pads (Front)",
      "category": "Brakes",
      "intervalKm": <actual interval for ${brand} ${model}>,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<realistic AED for ${brand} ${model} front brakes>",
      "description": "<${brand} ${model} brake spec>",
      "diyDifficulty": "Medium",
      "uaeNote": "UAE highway speeds and Dubai stop-and-go traffic accelerate pad wear."
    },
    {
      "item": "Battery",
      "category": "Electrical",
      "intervalKm": 0,
      "lastDoneKm": null,
      "dueAtKm": 0,
      "overdueBy": 0,
      "status": "${vehicleAge >= 2 ? "due_soon" : "ok"}",
      "estimatedCostAed": "<realistic AED for ${brand} ${model} battery in UAE>",
      "description": "<${brand} ${model} battery spec — group size, CCA rating>",
      "diyDifficulty": "Easy",
      "uaeNote": "UAE heat degrades batteries in 2-3 years vs 5 years in cooler climates. Most UAE roadside breakdowns are battery-related."
    },
    {
      "item": "Coolant / Antifreeze",
      "category": "Cooling",
      "intervalKm": <actual interval for ${brand} ${model}>,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<AED range>",
      "description": "<${brand} ${model} specific coolant type — OAT/HOAT/NOAT>",
      "diyDifficulty": "Medium",
      "uaeNote": "Overheating is the #1 engine killer in UAE. Check coolant monthly in summer."
    },
    {
      "item": "Transmission Fluid",
      "category": "Drivetrain",
      "intervalKm": <actual interval for ${brand} ${model}>,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<AED range for ${brand} ${model}>",
      "description": "<${brand} ${model} transmission fluid type and spec>",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "UAE traffic heat-cycles the transmission constantly. Dark fluid = immediate change."
    },
    {
      "item": "Tyres (Rotation & Inspection)",
      "category": "Tyres",
      "intervalKm": 10000,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "80-150",
      "description": "Rotate tyres every 10,000 km for even wear. Check tread depth (3mm minimum recommended in UAE).",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "UAE hot tarmac (70°C) causes rapid tyre degradation. Check sidewalls monthly for bulges."
    },
    {
      "item": "Spark Plugs",
      "category": "Engine",
      "intervalKm": <actual interval for ${brand} ${model} — varies widely by engine type, skip if diesel/EV>,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<AED range — expensive for some BMW/Mercedes engines>",
      "description": "<${brand} ${model} spark plug type — iridium/platinum/copper, count>",
      "diyDifficulty": "Medium",
      "uaeNote": "UAE fuel quality can foul plugs faster. Use ADNOC 98 for performance engines."
    },
    {
      "item": "Serpentine Belt",
      "category": "Engine",
      "intervalKm": <actual interval for ${brand} ${model}>,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<AED range>",
      "description": "<${brand} ${model} belt routing and components driven>",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "UAE AC load stresses this belt 12 months/year. Inspect at every oil change."
    },
    {
      "item": "Suspension Check",
      "category": "Suspension",
      "intervalKm": 30000,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "<AED range for ${brand} ${model} suspension parts in UAE>",
      "description": "<${brand} ${model} suspension type and known weak points>",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "UAE speed bumps and occasional off-road stress suspension. Listen for clunks."
    },
    {
      "item": "Wiper Blades",
      "category": "Visibility",
      "intervalKm": 20000,
      "lastDoneKm": null,
      "dueAtKm": <calculate>,
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "60-180",
      "description": "Replace annually. UAE UV and heat crack rubber blades within 12 months.",
      "diyDifficulty": "Easy",
      "uaeNote": "Cracked wipers in a UAE rainstorm on the highway are dangerous. Replace proactively."
    }
  ]
}

CRITICAL: Return ONLY valid JSON. No markdown fences. No explanation text. No comments. Ensure all numeric fields are actual numbers (not strings). Ensure tyre PSI values are realistic and specific to the ${brand} ${model}.`;

  try {
    // Use gemini-2.5-pro with Google Search grounding for accurate vehicle specs
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 16384,
          },
        }),
      }
    );

    if (!response.ok) {
      // Fallback to gemini-2.5-flash if pro is unavailable
      const fallback = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 16384,
            },
          }),
        }
      );

      if (!fallback.ok) {
        throw new Error(`Gemini API error: ${fallback.status}`);
      }

      const fallbackData = await fallback.json();
      return processGeminiResponse(fallbackData);
    }

    const geminiData = await response.json();
    return processGeminiResponse(geminiData);

  } catch (error) {
    console.error("Car advisor error:", error);
    return NextResponse.json({ error: "Failed to generate maintenance advice" }, { status: 500 });
  }
}

function processGeminiResponse(geminiData: Record<string, unknown>) {
  const rawText = (geminiData?.candidates as Array<{ content: { parts: Array<{ text: string }> } }>)?.[0]?.content?.parts?.[0]?.text || "";

  // Strip markdown fences if present
  const cleaned = rawText.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();

  // Extract JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON in Gemini response");
  }

  const parsed = JSON.parse(jsonMatch[0]) as CarAdvisorResponse;
  parsed.generatedAt = new Date().toISOString();

  return NextResponse.json(parsed, {
    headers: { "Cache-Control": "no-store" },
  });
}
