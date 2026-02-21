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

// ─── Vehicle-specific tyre pressure lookup ───────────────────────────────────
// Format: { front: PSI, rear: PSI, spare: PSI }
// Sources: manufacturer door-sticker specs (driver side door jamb label)
const TYRE_PRESSURE_DB: Record<string, { front: number; rear: number; spare: number }> = {
  // Ford
  "ford f-150": { front: 35, rear: 60, spare: 60 },
  "ford f-250": { front: 50, rear: 70, spare: 60 },
  "ford mustang": { front: 35, rear: 35, spare: 60 },
  "ford explorer": { front: 35, rear: 35, spare: 60 },
  "ford ranger": { front: 35, rear: 50, spare: 60 },
  "ford focus": { front: 32, rear: 30, spare: 60 },
  "ford fusion": { front: 33, rear: 33, spare: 60 },
  // Toyota
  "toyota camry": { front: 32, rear: 32, spare: 60 },
  "toyota corolla": { front: 32, rear: 32, spare: 60 },
  "toyota land cruiser": { front: 35, rear: 35, spare: 60 },
  "toyota fortuner": { front: 33, rear: 33, spare: 60 },
  "toyota hilux": { front: 33, rear: 47, spare: 60 },
  "toyota rav4": { front: 33, rear: 33, spare: 60 },
  "toyota prado": { front: 33, rear: 33, spare: 60 },
  "toyota prius": { front: 35, rear: 33, spare: 60 },
  "toyota yaris": { front: 32, rear: 29, spare: 60 },
  // Nissan
  "nissan patrol": { front: 36, rear: 40, spare: 60 },
  "nissan navara": { front: 33, rear: 47, spare: 60 },
  "nissan altima": { front: 32, rear: 32, spare: 60 },
  "nissan sentra": { front: 32, rear: 32, spare: 60 },
  "nissan pathfinder": { front: 33, rear: 33, spare: 60 },
  "nissan x-trail": { front: 33, rear: 33, spare: 60 },
  "nissan kicks": { front: 33, rear: 33, spare: 60 },
  // BMW
  "bmw 3 series": { front: 35, rear: 38, spare: 60 },
  "bmw 5 series": { front: 35, rear: 38, spare: 60 },
  "bmw 7 series": { front: 36, rear: 42, spare: 60 },
  "bmw x3": { front: 36, rear: 39, spare: 60 },
  "bmw x5": { front: 36, rear: 44, spare: 60 },
  "bmw m3": { front: 32, rear: 35, spare: 60 },
  "bmw m5": { front: 32, rear: 39, spare: 60 },
  "bmw 1 series": { front: 33, rear: 35, spare: 60 },
  // Mercedes-Benz
  "mercedes c-class": { front: 35, rear: 35, spare: 60 },
  "mercedes e-class": { front: 35, rear: 38, spare: 60 },
  "mercedes s-class": { front: 38, rear: 41, spare: 60 },
  "mercedes glc": { front: 36, rear: 39, spare: 60 },
  "mercedes gle": { front: 35, rear: 38, spare: 60 },
  "mercedes gls": { front: 35, rear: 38, spare: 60 },
  "mercedes amg": { front: 32, rear: 35, spare: 60 },
  // Audi
  "audi a3": { front: 33, rear: 30, spare: 60 },
  "audi a4": { front: 35, rear: 33, spare: 60 },
  "audi a6": { front: 36, rear: 33, spare: 60 },
  "audi q3": { front: 33, rear: 33, spare: 60 },
  "audi q5": { front: 36, rear: 36, spare: 60 },
  "audi q7": { front: 36, rear: 41, spare: 60 },
  "audi a8": { front: 33, rear: 33, spare: 60 },
  // Volkswagen
  "volkswagen golf": { front: 32, rear: 30, spare: 60 },
  "volkswagen passat": { front: 33, rear: 30, spare: 60 },
  "volkswagen tiguan": { front: 33, rear: 33, spare: 60 },
  // Honda
  "honda civic": { front: 32, rear: 30, spare: 60 },
  "honda accord": { front: 32, rear: 32, spare: 60 },
  "honda cr-v": { front: 33, rear: 33, spare: 60 },
  "honda pilot": { front: 35, rear: 35, spare: 60 },
  // Hyundai / Kia
  "hyundai elantra": { front: 33, rear: 33, spare: 60 },
  "hyundai tucson": { front: 33, rear: 33, spare: 60 },
  "hyundai santa fe": { front: 35, rear: 35, spare: 60 },
  "kia sportage": { front: 33, rear: 33, spare: 60 },
  "kia sorento": { front: 35, rear: 35, spare: 60 },
  // Chevrolet / GMC
  "chevrolet tahoe": { front: 35, rear: 35, spare: 60 },
  "chevrolet suburban": { front: 35, rear: 35, spare: 60 },
  "chevrolet silverado": { front: 35, rear: 50, spare: 60 },
  "chevrolet malibu": { front: 32, rear: 32, spare: 60 },
  "gmc yukon": { front: 35, rear: 35, spare: 60 },
  // Dodge / Jeep
  "dodge challenger": { front: 33, rear: 33, spare: 60 },
  "dodge charger": { front: 33, rear: 33, spare: 60 },
  "jeep wrangler": { front: 37, rear: 37, spare: 37 },
  "jeep cherokee": { front: 33, rear: 33, spare: 60 },
  "jeep grand cherokee": { front: 36, rear: 36, spare: 60 },
  // Land Rover
  "land rover range rover": { front: 38, rear: 38, spare: 60 },
  "land rover discovery": { front: 35, rear: 38, spare: 60 },
  "land rover defender": { front: 42, rear: 42, spare: 42 },
  // Porsche
  "porsche 911": { front: 29, rear: 36, spare: 60 },
  "porsche cayenne": { front: 33, rear: 36, spare: 60 },
  "porsche macan": { front: 33, rear: 36, spare: 60 },
  // Tesla
  "tesla model 3": { front: 42, rear: 42, spare: 60 },
  "tesla model s": { front: 42, rear: 42, spare: 60 },
  "tesla model x": { front: 45, rear: 45, spare: 60 },
  "tesla model y": { front: 42, rear: 42, spare: 60 },
  // Lexus
  "lexus es": { front: 33, rear: 33, spare: 60 },
  "lexus rx": { front: 33, rear: 33, spare: 60 },
  "lexus lx": { front: 35, rear: 35, spare: 60 },
  // Mitsubishi
  "mitsubishi pajero": { front: 33, rear: 33, spare: 60 },
  "mitsubishi outlander": { front: 33, rear: 33, spare: 60 },
  // Infiniti
  "infiniti qx80": { front: 36, rear: 36, spare: 60 },
  "infiniti q50": { front: 33, rear: 33, spare: 60 },
};

// Vehicle class → annual cost range (AED)
type VehicleClass = "economy" | "midsize" | "luxury" | "premium_luxury" | "compact_suv" | "midsize_suv" | "fullsize_suv" | "pickup" | "sports" | "hypercar" | "ev";
const COST_BY_CLASS: Record<VehicleClass, string> = {
  economy: "1,500 - 3,000",
  midsize: "2,500 - 4,500",
  luxury: "5,000 - 10,000",
  premium_luxury: "10,000 - 25,000",
  compact_suv: "2,500 - 5,000",
  midsize_suv: "3,500 - 7,000",
  fullsize_suv: "6,000 - 15,000",
  pickup: "3,000 - 7,000",
  sports: "7,000 - 18,000",
  hypercar: "20,000 - 60,000",
  ev: "2,000 - 5,000",
};

function getVehicleClass(brand: string, model: string, engineType: string): VehicleClass {
  const b = brand.toLowerCase();
  const m = model.toLowerCase();
  if (engineType === "Electric") return "ev";
  if (["ferrari", "lamborghini", "bugatti", "koenigsegg", "mclaren"].some(x => b.includes(x))) return "hypercar";
  if (["porsche", "bmw m", "mercedes amg", "audi rs", "dodge challenger", "dodge charger", "chevrolet corvette"].some(x => (b + " " + m).includes(x))) return "sports";
  if (["range rover", "s-class", "7 series", "a8", "q8", "lexus ls", "infiniti qx80"].some(x => (b + " " + m).includes(x))) return "premium_luxury";
  if (["bmw", "mercedes", "audi", "lexus", "infiniti", "cadillac", "lincoln"].some(x => b.includes(x))) return "luxury";
  if (["land cruiser", "patrol", "tahoe", "suburban", "navigator", "expedition", "gls", "gle", "x5", "q7", "prado", "defender"].some(x => (b + " " + m).includes(x))) return "fullsize_suv";
  if (["f-150", "f150", "hilux", "navara", "silverado", "ranger", "tundra", "ram 1500"].some(x => (b + " " + m).includes(x))) return "pickup";
  if (["rav4", "cr-v", "tiguan", "tucson", "sportage", "x3", "q3", "glc", "macan"].some(x => (b + " " + m).includes(x))) return "compact_suv";
  if (["fortuner", "pathfinder", "explorer", "santa fe", "sorento", "4runner", "pilot", "x5", "q5"].some(x => (b + " " + m).includes(x))) return "midsize_suv";
  if (["corolla", "civic", "sentra", "golf", "focus", "yaris", "elantra", "kicks", "fit"].some(x => (b + " " + m).includes(x))) return "economy";
  return "midsize";
}

function getTyrePressure(brand: string, model: string): { front: number; rear: number; spare: number } {
  const key = `${brand.toLowerCase()} ${model.toLowerCase()}`;
  if (TYRE_PRESSURE_DB[key]) return TYRE_PRESSURE_DB[key];
  // Try partial match
  for (const [k, v] of Object.entries(TYRE_PRESSURE_DB)) {
    if (key.includes(k) || k.includes(key.split(" ")[1] || "")) return v;
  }
  // Fallback by brand
  const brandMap: Record<string, { front: number; rear: number; spare: number }> = {
    toyota: { front: 33, rear: 33, spare: 60 }, nissan: { front: 33, rear: 33, spare: 60 },
    honda: { front: 32, rear: 30, spare: 60 }, ford: { front: 35, rear: 35, spare: 60 },
    bmw: { front: 35, rear: 38, spare: 60 }, mercedes: { front: 35, rear: 38, spare: 60 },
    audi: { front: 35, rear: 33, spare: 60 }, chevrolet: { front: 35, rear: 35, spare: 60 },
    hyundai: { front: 33, rear: 33, spare: 60 }, kia: { front: 33, rear: 33, spare: 60 },
    volkswagen: { front: 32, rear: 30, spare: 60 }, porsche: { front: 32, rear: 35, spare: 60 },
    lexus: { front: 33, rear: 33, spare: 60 }, land: { front: 36, rear: 38, spare: 60 },
    tesla: { front: 42, rear: 42, spare: 60 }, mitsubishi: { front: 33, rear: 33, spare: 60 },
  };
  for (const [k, v] of Object.entries(brandMap)) {
    if (brand.toLowerCase().includes(k)) return v;
  }
  return { front: 33, rear: 33, spare: 60 };
}

function calcHealthScore(mileage: number, vehicleAge: number, vehicleClass: VehicleClass): number {
  // Base score starts at 95, degrades with age and mileage
  let score = 95;
  // Age penalty: -3 per year after year 2
  score -= Math.max(0, vehicleAge - 2) * 3;
  // Mileage penalty: -5 per 50k km after 30k
  score -= Math.max(0, Math.floor((mileage - 30000) / 50000)) * 5;
  // Luxury/premium cars have higher base maintenance risk
  if (vehicleClass === "premium_luxury" || vehicleClass === "luxury") score -= 3;
  // Keep within 30-95 range
  return Math.max(30, Math.min(95, Math.round(score)));
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

  // Pre-calculate vehicle-specific values server-side
  const tyreSpec = getTyrePressure(brand, model);
  const vehicleClass = getVehicleClass(brand, model, engineType);
  const annualCostRange = COST_BY_CLASS[vehicleClass];
  const healthScore = calcHealthScore(mileage, vehicleAge, vehicleClass);
  const tyreNote = `For your ${brand} ${model}, manufacturer-specified cold tyre pressures are: Front ${tyreSpec.front} PSI, Rear ${tyreSpec.rear} PSI. In UAE summer heat, tyres expand — always check pressure in the morning when cool. Your tyres can gain 4-6 PSI when hot. ${tyreSpec.front !== tyreSpec.rear ? `Note: Front and rear pressures differ for your vehicle — this is intentional for handling balance.` : ""}`;


  const prompt = `You are a senior automotive service advisor at a premium UAE dealership. You are speaking DIRECTLY to the car owner. Be conversational, helpful, and specific to their vehicle and UAE conditions.

Vehicle Details:
- Brand & Model: ${brand} ${model}
- Year: ${year} (${vehicleAge} years old)
- Current Mileage: ${mileage.toLocaleString()} km
- Engine Type: ${engineType}
- Vehicle Class: ${vehicleClass}
- Estimated annual mileage: ~${avgKmPerYear.toLocaleString()} km/year
- Last Oil Change: ${lastOilChangeMileage ? `at ${lastOilChangeMileage.toLocaleString()} km (${(mileage - lastOilChangeMileage).toLocaleString()} km ago)` : "Unknown"}
- Last Major Service: ${lastServiceDate || "Unknown"}
${additionalInfo ? `- Driver reported issues: ${additionalInfo}` : ""}

IMPORTANT — USE THESE EXACT PRE-CALCULATED VALUES (do NOT change these numbers):
- overallScore: ${healthScore} (pre-calculated based on age + mileage)
- estimatedAnnualCostAed: "${annualCostRange}" (pre-calculated for this vehicle class)
- tyrePressure.frontPsi: ${tyreSpec.front} (manufacturer door-sticker spec)
- tyrePressure.rearPsi: ${tyreSpec.rear} (manufacturer door-sticker spec)
- tyrePressure.sparePsi: ${tyreSpec.spare}
- tyrePressure.frontBar: ${(tyreSpec.front * 0.0689476).toFixed(1)}
- tyrePressure.rearBar: ${(tyreSpec.rear * 0.0689476).toFixed(1)}

UAE Operating Conditions: Extreme heat (40-50°C summer), heavy desert dust, high UV radiation, occasional sandstorms, Abu Dhabi/Dubai heavy traffic, E11 highway high-speed driving, fuel quality variations (ADNOC 98 recommended for performance cars).

Respond with ONLY valid JSON (no markdown, no code blocks) with this EXACT structure:

{
  "aiSummary": "A warm, conversational 3-4 sentence paragraph speaking directly to the owner. Mention the car by name (${brand} ${model}). Highlight the most important thing they need to know based on their specific mileage and age. Be specific about UAE conditions. Sound like a trusted mechanic friend.",
  "summary": "2-sentence factual technical summary for a ${year} ${brand} ${model} at ${mileage.toLocaleString()} km in UAE",
  "overallScore": ${healthScore},
  "nextServiceKm": ${Math.ceil((mileage + 10000) / 5000) * 5000},
  "nextServiceEstimatedDate": "${new Date(Date.now() + (10000 / Math.max(avgKmPerYear, 5000)) * 365 * 24 * 3600000).toLocaleDateString("en-AE", { month: "long", year: "numeric" })}",
  "estimatedAnnualCostAed": "${annualCostRange}",
  "urgentCount": 2,
  "dueSoonCount": 4,
  "tips": [
    "UAE-specific practical tip 1",
    "UAE-specific practical tip 2",
    "UAE-specific practical tip 3",
    "UAE-specific practical tip 4",
    "UAE-specific practical tip 5"
  ],
  "tyrePressure": {
    "frontPsi": ${tyreSpec.front},
    "rearPsi": ${tyreSpec.rear},
    "sparePsi": ${tyreSpec.spare},
    "frontBar": ${(tyreSpec.front * 0.0689476).toFixed(1)},
    "rearBar": ${(tyreSpec.rear * 0.0689476).toFixed(1)},
    "uaeNote": "${tyreNote}",
    "checkFrequency": "Weekly in summer, bi-weekly in winter"
  },
  "safetyAlerts": [
    {
      "item": "Brake System Check",
      "severity": "critical",
      "description": "At ${mileage.toLocaleString()} km, brake pads and rotors should be carefully inspected. UAE stop-and-go Dubai traffic accelerates pad wear.",
      "action": "Have brakes inspected at a certified garage within the next 1,000 km or immediately if you notice any grinding noise, vibration, or increased stopping distance.",
      "estimatedCostAed": "400-800"
    }
  ],
  "uaeClimateAlerts": [
    {
      "title": "Pre-Summer AC Service",
      "description": "UAE temperatures reach 50°C. Your AC compressor, refrigerant level, and condenser coils must be checked before June. A failing AC in UAE summer is a safety emergency.",
      "season": "summer",
      "priority": "high"
    },
    {
      "title": "Coolant System Check",
      "description": "Engine coolant in UAE conditions should be changed every 40,000 km or 2 years, not the standard 60,000 km. Overheating is the #1 engine killer in UAE.",
      "season": "year-round",
      "priority": "high"
    },
    {
      "title": "Battery UAE Life",
      "description": "Car batteries last only 2-3 years in UAE vs 4-5 years in Europe due to extreme heat degrading cells. Test your battery if it is over 2 years old.",
      "season": "summer",
      "priority": "high"
    },
    {
      "title": "Desert Dust Filters",
      "description": "Engine air filter and cabin filter clog 3x faster in UAE from desert dust and sand. Check every 10,000 km instead of the standard 30,000 km.",
      "season": "year-round",
      "priority": "medium"
    },
    {
      "title": "Tyre Pressure Management",
      "description": "Hot UAE tarmac (up to 70°C) causes tyre pressure to spike. Always check pressure in the morning. Overinflated tyres in extreme heat increase blowout risk.",
      "season": "summer",
      "priority": "high"
    },
    {
      "title": "Sandstorm Preparation",
      "description": "After a haboob (sandstorm), change your cabin air filter, check wiper blades, and inspect the paint for sand scratches. Sand infiltrates engine bay openings.",
      "season": "year-round",
      "priority": "medium"
    }
  ],
  "warningLights": [
    {
      "name": "Engine Warning (Check Engine)",
      "color": "amber",
      "meaning": "A sensor or system is outside normal range. Could be minor (loose fuel cap) or serious (catalytic converter).",
      "action": "Get OBD-II scan within 1 week. If flashing, pull over safely and call for assistance immediately.",
      "urgency": "service_soon"
    },
    {
      "name": "Oil Pressure Warning",
      "color": "red",
      "meaning": "Oil pressure is critically low. Continuing to drive will destroy the engine within minutes.",
      "action": "STOP THE CAR IMMEDIATELY. Turn off the engine. Do NOT restart. Call roadside assistance.",
      "urgency": "stop_now"
    },
    {
      "name": "Battery / Charging",
      "color": "red",
      "meaning": "Alternator is not charging the battery. You have limited time before the car dies.",
      "action": "Drive directly to nearest garage. Turn off all non-essential electronics (AC, radio). Expect 15-30 minutes of driving before shutdown.",
      "urgency": "stop_now"
    },
    {
      "name": "Temperature Warning",
      "color": "red",
      "meaning": "Engine is overheating. Extremely common in UAE summer. Continuing will cause catastrophic engine damage.",
      "action": "Pull over safely, turn off AC, turn on heater to max (extracts heat from engine), idle for 2 minutes, then turn off engine. Call for assistance. Do NOT open radiator cap.",
      "urgency": "stop_now"
    },
    {
      "name": "Tyre Pressure (TPMS)",
      "color": "amber",
      "meaning": "One or more tyres is significantly under or over-inflated.",
      "action": "Check all tyre pressures at nearest petrol station. In UAE summer, also check for bulges or damage from hot road surfaces.",
      "urgency": "service_soon"
    },
    {
      "name": "ABS Warning",
      "color": "amber",
      "meaning": "Anti-lock Braking System has a fault. Regular brakes still work but ABS assistance is disabled.",
      "action": "Get diagnosed within 1 week. Avoid hard braking on UAE sand-covered roads until fixed.",
      "urgency": "service_soon"
    }
  ],
  "maintenanceItems": [
    {
      "item": "Engine Oil & Filter",
      "category": "Engine",
      "intervalKm": 10000,
      "lastDoneKm": ${lastOilChangeMileage || null},
      "dueAtKm": ${lastOilChangeMileage ? lastOilChangeMileage + 10000 : Math.round(mileage / 10000) * 10000 + 10000},
      "overdueBy": ${lastOilChangeMileage && (mileage - lastOilChangeMileage) > 10000 ? mileage - lastOilChangeMileage - 10000 : 0},
      "status": ${lastOilChangeMileage && (mileage - lastOilChangeMileage) > 10000 ? '"urgent"' : lastOilChangeMileage && (mileage - lastOilChangeMileage) > 7000 ? '"due_soon"' : '"ok"'},
      "estimatedCostAed": "180-280",
      "description": "Use full synthetic oil (5W-30 or 5W-40) for UAE extreme heat. Mobil 1 or Castrol EDGE recommended. UAE heat degrades oil faster — stick to 10,000 km intervals.",
      "diyDifficulty": "Easy",
      "uaeNote": "UAE heat causes oil to thin faster. Never exceed 10,000 km intervals in UAE conditions."
    },
    {
      "item": "Engine Air Filter",
      "category": "Engine",
      "intervalKm": 15000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 15000) * 15000 + 15000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "80-150",
      "description": "UAE desert dust clogs air filters 3x faster than European conditions. Inspect every 10,000 km, replace every 15,000 km.",
      "diyDifficulty": "Easy",
      "uaeNote": "Critical: desert sand and dust can enter the engine if filter is blocked. Replace more frequently during sandstorm seasons."
    },
    {
      "item": "Cabin Air Filter",
      "category": "Climate",
      "intervalKm": 15000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 15000) * 15000 + 15000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "60-120",
      "description": "Filters dust and allergens entering the cabin. UAE sand clogs these rapidly, reducing AC efficiency and air quality. Replace every 6-12 months.",
      "diyDifficulty": "Easy",
      "uaeNote": "Dirty cabin filter forces the AC to work harder, increasing fuel consumption and stressing the AC compressor — critical in UAE."
    },
    {
      "item": "AC System Full Service",
      "category": "Climate",
      "intervalKm": 40000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 40000) * 40000 + 40000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "350-800",
      "description": "Full AC service: refrigerant top-up, compressor check, condenser cleaning, leak test, evaporator inspection. UAE AC works 12 months/year — it wears out 3x faster than in cooler climates.",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "CRITICAL in UAE. AC failure in summer is a safety emergency. Service annually before June."
    },
    {
      "item": "Coolant / Antifreeze",
      "category": "Cooling",
      "intervalKm": 40000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 40000) * 40000 + 40000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "150-300",
      "description": "Flush and replace coolant. UAE heat degrades coolant faster — use OAT (Organic Acid Technology) coolant rated for high temperatures. Never use water-only in UAE.",
      "diyDifficulty": "Medium",
      "uaeNote": "Overheating is the #1 engine killer in UAE. Check coolant level monthly in summer."
    },
    {
      "item": "Brake Pads (Front)",
      "category": "Brakes",
      "intervalKm": 30000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 30000) * 30000 + 30000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "300-600",
      "description": "Front brakes take 70% of braking force. Dubai stop-and-go traffic accelerates wear. Replace when less than 3mm pad thickness remains.",
      "diyDifficulty": "Medium",
      "uaeNote": "UAE highway speeds and frequent hard braking in traffic require premium brake pads. Brembo or Bosch recommended."
    },
    {
      "item": "Brake Pads (Rear)",
      "category": "Brakes",
      "intervalKm": 50000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 50000) * 50000 + 50000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "200-450",
      "description": "Rear brakes wear slower than front. Inspect annually. Replace when less than 3mm thickness.",
      "diyDifficulty": "Medium",
      "uaeNote": "Inspect rear brakes at same time as front for efficiency."
    },
    {
      "item": "Brake Fluid",
      "category": "Brakes",
      "intervalKm": 40000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 40000) * 40000 + 40000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "100-200",
      "description": "Brake fluid absorbs moisture over time, lowering boiling point. Critical safety item. Use DOT 4 or DOT 5.1. UAE heat accelerates moisture absorption.",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "Brake fade on UAE highways from overheated fluid is dangerous. Change every 2 years regardless of mileage."
    },
    {
      "item": "Transmission Fluid",
      "category": "Drivetrain",
      "intervalKm": 60000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 60000) * 60000 + 60000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "400-900",
      "description": "Automatic transmission fluid (ATF) deteriorates in UAE heat. Change every 60,000 km for automatic, 45,000 km for manual in UAE conditions.",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "UAE traffic heat-cycles the transmission constantly. Dark, burnt-smelling fluid means immediate change."
    },
    {
      "item": "Spark Plugs",
      "category": "Engine",
      "intervalKm": 40000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 40000) * 40000 + 40000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "200-600",
      "description": "Iridium or platinum spark plugs recommended for UAE heat and fuel quality. Replace every 40,000 km (petrol engines only). UAE fuel sulphur content can foul plugs faster.",
      "diyDifficulty": "Medium",
      "uaeNote": "Only applies to petrol/hybrid engines. Misfires waste fuel and increase engine temperature."
    },
    {
      "item": "Battery & Terminals",
      "category": "Electrical",
      "intervalKm": 0,
      "lastDoneKm": null,
      "dueAtKm": 0,
      "overdueBy": 0,
      "status": ${vehicleAge >= 2 ? '"due_soon"' : '"ok"'},
      "estimatedCostAed": "300-600",
      "description": "Car batteries last only 2-3 years in UAE (vs 4-5 years in Europe) due to extreme heat degrading lead-acid cells. ${vehicleAge >= 2 ? 'Your vehicle is ' + vehicleAge + ' years old — battery test recommended.' : 'Battery should be tested annually after year 2.'}",
      "diyDifficulty": "Easy",
      "uaeNote": "Never park in direct sun if possible — it cooks the battery. Most roadside breakdowns in UAE are battery-related."
    },
    {
      "item": "Tyres (Rotation & Inspection)",
      "category": "Tyres",
      "intervalKm": 10000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 10000) * 10000 + 10000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "60-120",
      "description": "Rotate tyres every 10,000 km for even wear. Check tread depth (minimum 1.6mm legal limit, 3mm recommended in UAE for wet grip in rare rain events). Check for UAE heat-related sidewall cracking.",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "UAE hot tarmac (up to 70°C) causes rapid tyre degradation. Inspect sidewalls for bulges monthly."
    },
    {
      "item": "Wheel Alignment",
      "category": "Tyres",
      "intervalKm": 20000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 20000) * 20000 + 20000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "120-200",
      "description": "UAE road conditions and speed bumps cause alignment drift. Misalignment causes uneven tyre wear and reduces fuel efficiency. Check after hitting any significant pothole.",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "Check alignment when you notice the car pulling to one side. UAE roads have many speed humps that affect alignment."
    },
    {
      "item": "Power Steering Fluid",
      "category": "Steering",
      "intervalKm": 50000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 50000) * 50000 + 50000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "80-180",
      "description": "Check and top up power steering fluid. Flush every 50,000 km or if fluid is dark/contaminated. UAE heat can cause seals to leak.",
      "diyDifficulty": "Easy",
      "uaeNote": "Whining noise when turning at low speed indicates low or contaminated fluid."
    },
    {
      "item": "Serpentine / Drive Belt",
      "category": "Engine",
      "intervalKm": 80000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 80000) * 80000 + 80000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "200-400",
      "description": "Drives alternator, AC compressor, and power steering. UAE heat and AC load stress this belt significantly. Inspect for cracks every 30,000 km.",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "Belt failure strands you and kills AC. Inspect for fraying at every oil change in UAE heat."
    },
    {
      "item": "Fuel Filter",
      "category": "Fuel System",
      "intervalKm": 40000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 40000) * 40000 + 40000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "100-300",
      "description": "Filters contaminants from fuel. UAE fuel quality varies across petrol stations. Replace every 40,000 km to protect injectors.",
      "diyDifficulty": "Medium",
      "uaeNote": "Use premium ADNOC 98 fuel for performance cars. Avoid leaving tank near-empty in UAE heat (fuel pump cooling)."
    },
    {
      "item": "Wiper Blades",
      "category": "Visibility",
      "intervalKm": 20000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 20000) * 20000 + 20000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "60-150",
      "description": "UAE UV radiation and heat degrades rubber wiper blades rapidly. Replace every 12 months regardless of mileage. Critical for rare but heavy UAE rain events.",
      "diyDifficulty": "Easy",
      "uaeNote": "Cracked wipers in a sudden UAE rainstorm on the highway are extremely dangerous. Replace proactively."
    },
    {
      "item": "Suspension Check",
      "category": "Suspension",
      "intervalKm": 30000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 30000) * 30000 + 30000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "200-800",
      "description": "Check shock absorbers, struts, ball joints, tie rod ends, and bushings. UAE speed bumps and occasional off-road driving stress suspension components.",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "Worn suspension increases stopping distance — critical at UAE highway speeds. Listen for clunks on speed bumps."
    },
    {
      "item": "CV Joints & Boots",
      "category": "Drivetrain",
      "intervalKm": 60000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 60000) * 60000 + 60000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "300-800",
      "description": "CV joint boots protect against desert sand and dust ingress. Check for cracked boots every 20,000 km. Sand contamination destroys CV joints rapidly.",
      "diyDifficulty": "Workshop Only",
      "uaeNote": "Clicking noise on full-lock turns indicates CV joint wear. Desert sand is abrasive and accelerates wear through torn boots."
    },
    {
      "item": "PCV Valve",
      "category": "Engine",
      "intervalKm": 50000,
      "lastDoneKm": null,
      "dueAtKm": ${Math.round(mileage / 50000) * 50000 + 50000},
      "overdueBy": 0,
      "status": "unknown",
      "estimatedCostAed": "80-200",
      "description": "Positive Crankcase Ventilation valve controls engine pressure. UAE dust and heat cause faster clogging, leading to oil leaks and increased engine wear.",
      "diyDifficulty": "Easy",
      "uaeNote": "Cheap part, but ignoring it can cause oil seal failures and expensive repairs."
    }
  ]
}

CRITICAL: Return ONLY valid JSON. No markdown. No explanation. No code fences.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 16384,
            thinkingConfig: { thinkingBudget: 0 },
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

    // Forcibly override with server-calculated values — Gemini may ignore prompt instructions
    const frontBar = parseFloat((tyreSpec.front * 0.0689476).toFixed(1));
    const rearBar = parseFloat((tyreSpec.rear * 0.0689476).toFixed(1));
    parsed.tyrePressure = {
      ...parsed.tyrePressure,
      frontPsi: tyreSpec.front,
      rearPsi: tyreSpec.rear,
      sparePsi: tyreSpec.spare,
      frontBar,
      rearBar,
      uaeNote: tyreNote,
    };
    parsed.estimatedAnnualCostAed = annualCostRange;
    // Clamp health score within ±5 of our calculation to allow minor AI nuance
    if (parsed.overallScore) {
      parsed.overallScore = Math.max(healthScore - 5, Math.min(healthScore + 5, parsed.overallScore));
    } else {
      parsed.overallScore = healthScore;
    }

    return NextResponse.json(parsed, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Car advisor error:", error);
    return NextResponse.json({ error: "Failed to generate maintenance advice" }, { status: 500 });
  }
}
