import { NextRequest, NextResponse } from "next/server";

const UAE_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  "abu dhabi": { lat: 24.4539, lng: 54.3773 },
  "abudhabi": { lat: 24.4539, lng: 54.3773 },
  "mussafah": { lat: 24.3595, lng: 54.4921 },
  "dubai": { lat: 25.2048, lng: 55.2708 },
  "al quoz": { lat: 25.1367, lng: 55.2282 },
  "deira": { lat: 25.2697, lng: 55.3095 },
  "sharjah": { lat: 25.3463, lng: 55.4209 },
  "ajman": { lat: 25.4052, lng: 55.5136 },
  "rak": { lat: 25.7895, lng: 55.9432 },
  "ras al khaimah": { lat: 25.7895, lng: 55.9432 },
  "fujairah": { lat: 25.1288, lng: 56.3264 },
  "uaq": { lat: 25.5647, lng: 55.5554 },
  "umm al quwain": { lat: 25.5647, lng: 55.5554 },
  "al aweer": { lat: 25.1833, lng: 55.4167 },
  "international city": { lat: 25.1716, lng: 55.4136 },
};

// Detect if query is about spare parts / stores (not repair)
function detectIntent(query: string): "parts" | "service" | "both" {
  const q = query.toLowerCase();
  const partsKeywords = [
    "spare part", "auto part", "car part", "parts",
    "oem", "used part", "second hand", "breakage",
    "gearbox", "engine part", "spares", "accessories",
  ];
  const serviceKeywords = [
    "repair", "service", "garage", "mechanic", "workshop",
    "oil change", "brake", "tyre", "alignment", "check",
    "diagnos", "fix", "maintenance",
  ];
  const hasParts = partsKeywords.some(k => q.includes(k));
  const hasService = serviceKeywords.some(k => q.includes(k));
  if (hasParts && !hasService) return "parts";
  if (hasService && !hasParts) return "service";
  return "both";
}

// Extract UAE location from query text
function extractLocation(query: string, defaultLat: string, defaultLng: string) {
  const q = query.toLowerCase();
  for (const [name, coords] of Object.entries(UAE_LOCATIONS)) {
    if (q.includes(name)) {
      return coords;
    }
  }
  return { lat: parseFloat(defaultLat), lng: parseFloat(defaultLng) };
}

// Build a cleaner Google Places query (strip location since we use lat/lng)
function buildSearchQuery(query: string): string {
  let q = query;
  for (const name of Object.keys(UAE_LOCATIONS)) {
    q = q.replace(new RegExp(`\\b${name}\\b`, "gi"), "").trim();
  }
  // Clean up "in", "near", "at" at end
  q = q.replace(/\b(in|near|at|around|uae)\b\s*$/gi, "").trim();
  return q || query;
}

interface PlacePage {
  results: unknown[];
  next_page_token?: string;
}

async function fetchPage(url: string): Promise<PlacePage> {
  const res = await fetch(url);
  const data = await res.json();
  return { results: data.results || [], next_page_token: data.next_page_token };
}

async function searchPlaces(
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

  const baseUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
  const page1 = await fetchPage(`${baseUrl}?${params}`);
  let allResults = page1.results;

  // Fetch page 2 if available (Google requires ~2s delay before using next_page_token)
  if (page1.next_page_token && allResults.length >= 20) {
    await new Promise(r => setTimeout(r, 2200));
    const page2Params = new URLSearchParams({ pagetoken: page1.next_page_token, key: apiKey });
    const page2 = await fetchPage(`${baseUrl}?${page2Params}`);
    allResults = [...allResults, ...page2.results];
  }

  return allResults;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "auto repair";
  const defaultLat = searchParams.get("lat") || "25.2048";
  const defaultLng = searchParams.get("lng") || "55.2708";
  const openNow = searchParams.get("openNow") === "true";

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 });
  }

  try {
    const intent = detectIntent(query);
    const location = extractLocation(query, defaultLat, defaultLng);
    const cleanedQuery = buildSearchQuery(query);

    let results: unknown[] = [];

    if (intent === "parts") {
      // Search for parts stores specifically — NO type filter lets Google return stores
      const [storeResults, noTypeResults] = await Promise.all([
        searchPlaces(cleanedQuery, location.lat, location.lng, "store", apiKey, 20000),
        searchPlaces(query, location.lat, location.lng, null, apiKey, 25000),
      ]);
      // Merge and deduplicate
      const seen = new Set<string>();
      for (const r of [...storeResults, ...noTypeResults]) {
        const id = (r as { place_id: string }).place_id;
        if (!seen.has(id)) {
          seen.add(id);
          results.push(r);
        }
      }
    } else if (intent === "service") {
      // Service garages
      const [repairResults, noTypeResults] = await Promise.all([
        searchPlaces(cleanedQuery, location.lat, location.lng, "car_repair", apiKey, 15000),
        searchPlaces(cleanedQuery, location.lat, location.lng, null, apiKey, 15000),
      ]);
      const seen = new Set<string>();
      for (const r of [...repairResults, ...noTypeResults]) {
        const id = (r as { place_id: string }).place_id;
        if (!seen.has(id)) {
          seen.add(id);
          results.push(r);
        }
      }
    } else {
      // Both — search everything in parallel
      const [repairResults, storeResults, broadResults] = await Promise.all([
        searchPlaces(cleanedQuery, location.lat, location.lng, "car_repair", apiKey, 15000),
        searchPlaces(cleanedQuery, location.lat, location.lng, "store", apiKey, 20000),
        searchPlaces(query, location.lat, location.lng, null, apiKey, 20000),
      ]);
      const seen = new Set<string>();
      for (const r of [...repairResults, ...storeResults, ...broadResults]) {
        const id = (r as { place_id: string }).place_id;
        if (!seen.has(id)) {
          seen.add(id);
          results.push(r);
        }
      }
    }

    // Apply open_now filter after fetching (more accurate than API-side)
    if (openNow) {
      results = results.filter(
        (r) => (r as { opening_hours?: { open_now?: boolean } }).opening_hours?.open_now
      );
    }

    // Remove permanently closed
    results = results.filter(
      (r) => (r as { business_status?: string }).business_status !== "CLOSED_PERMANENTLY"
    );

    return NextResponse.json({
      results,
      intent,
      searchedLocation: location,
      count: results.length,
    });
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
