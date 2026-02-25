import { NextRequest, NextResponse } from "next/server";
import { analyzeSearchQuery } from "@/lib/ai";

const UAE_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  "abu dhabi": { lat: 24.4539, lng: 54.3773 },
  abudhabi: { lat: 24.4539, lng: 54.3773 },
  mussafah: { lat: 24.3595, lng: 54.4921 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  "al quoz": { lat: 25.1367, lng: 55.2282 },
  deira: { lat: 25.2697, lng: 55.3095 },
  sharjah: { lat: 25.3463, lng: 55.4209 },
  ajman: { lat: 25.4052, lng: 55.5136 },
  rak: { lat: 25.7895, lng: 55.9432 },
  "ras al khaimah": { lat: 25.7895, lng: 55.9432 },
  fujairah: { lat: 25.1288, lng: 56.3264 },
  uaq: { lat: 25.5647, lng: 55.5554 },
  "umm al quwain": { lat: 25.5647, lng: 55.5554 },
  "al aweer": { lat: 25.1833, lng: 55.4167 },
};

function detectIntent(query: string): "parts" | "service" | "both" {
  const q = query.toLowerCase();
  const partsKw = ["spare part", "auto part", "car part", "parts", "oem", "used part", "second hand", "spares", "accessories"];
  const serviceKw = ["repair", "service", "garage", "mechanic", "workshop", "oil change", "brake", "tyre", "fix", "maintenance", "diagnos"];
  const hasParts = partsKw.some(k => q.includes(k));
  const hasService = serviceKw.some(k => q.includes(k));
  if (hasParts && !hasService) return "parts";
  if (hasService && !hasParts) return "service";
  return "both";
}

function extractLocation(query: string, defaultLat: number, defaultLng: number) {
  const q = query.toLowerCase();
  for (const [name, coords] of Object.entries(UAE_LOCATIONS)) {
    if (q.includes(name)) return coords;
  }
  return { lat: defaultLat, lng: defaultLng };
}

async function fetchPlaces(
  query: string,
  lat: number,
  lng: number,
  type: string | null,
  apiKey: string,
  radius = 15000
): Promise<unknown[]> {
  const params = new URLSearchParams({
    query,
    location: `${lat},${lng}`,
    radius: String(radius),
    key: apiKey,
  });
  if (type) params.set("type", type);
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`);
  const data = await res.json();
  return (data.results || []) as unknown[];
}

export async function POST(request: NextRequest) {
  try {
    const { query, lat, lng } = await request.json();
    if (!query) return NextResponse.json({ error: "query is required" }, { status: 400 });

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 });
    }

    const location = extractLocation(query, lat || 25.2048, lng || 55.2708);
    const intent = detectIntent(query);

    // Run AI analysis and Places searches in PARALLEL — no sequential bottleneck
    let placesFetches: Promise<unknown[]>[];

    if (intent === "parts") {
      placesFetches = [
        fetchPlaces(query, location.lat, location.lng, "store", apiKey, 20000),
        fetchPlaces(query, location.lat, location.lng, null, apiKey, 25000),
      ];
    } else if (intent === "service") {
      placesFetches = [
        fetchPlaces(query, location.lat, location.lng, "car_repair", apiKey, 20000),
        fetchPlaces(query, location.lat, location.lng, null, apiKey, 20000),
      ];
    } else {
      placesFetches = [
        fetchPlaces(query, location.lat, location.lng, "car_repair", apiKey, 20000),
        fetchPlaces(query, location.lat, location.lng, "store", apiKey, 25000),
        fetchPlaces(query, location.lat, location.lng, null, apiKey, 25000),
      ];
    }

    // AI analysis races against Places — both run simultaneously
    const [analysis, ...placesArrays] = await Promise.all([
      analyzeSearchQuery(query),
      ...placesFetches,
    ]);

    // Deduplicate results
    const seen = new Set<string>();
    let results: unknown[] = [];
    for (const arr of placesArrays) {
      for (const r of arr) {
        const id = (r as { place_id: string }).place_id;
        if (!seen.has(id)) { seen.add(id); results.push(r); }
      }
    }

    // Remove permanently closed
    results = results.filter(r => (r as { business_status?: string }).business_status !== "CLOSED_PERMANENTLY");

    return NextResponse.json(
      { analysis, results, intent, searchedLocation: location },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (error) {
    console.error("AI Search error:", error);
    return NextResponse.json({ error: "AI search failed" }, { status: 500 });
  }
}
