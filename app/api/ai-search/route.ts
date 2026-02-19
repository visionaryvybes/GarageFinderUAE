import { NextRequest, NextResponse } from "next/server";
import { analyzeSearchQuery } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { query, lat, lng } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "query is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeSearchQuery(query);

    // Now search Google Places with the refined query
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        analysis,
        results: [],
        error: "Google Maps API key not configured",
      });
    }

    const params = new URLSearchParams({
      query: analysis.refinedQuery,
      location: `${lat || 40.7128},${lng || -74.006}`,
      radius: "8000",
      type: "car_repair",
      key: apiKey,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
    );

    const data = await response.json();

    return NextResponse.json({
      analysis,
      results: data.results || [],
    });
  } catch (error) {
    console.error("AI Search error:", error);
    return NextResponse.json(
      { error: "AI search failed" },
      { status: 500 }
    );
  }
}
