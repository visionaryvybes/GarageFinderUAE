import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "auto repair";
  const lat = searchParams.get("lat") || "40.7128";
  const lng = searchParams.get("lng") || "-74.006";
  const radius = searchParams.get("radius") || "8000";
  const openNow = searchParams.get("openNow") === "true";

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      query: query,
      location: `${lat},${lng}`,
      radius: radius,
      type: "car_repair",
      key: apiKey,
    });

    if (openNow) {
      params.set("opennow", "true");
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
    );

    const data = await response.json();

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      return NextResponse.json({
        results: data.results || [],
        next_page_token: data.next_page_token,
      });
    }

    return NextResponse.json(
      { error: data.error_message || data.status },
      { status: 400 }
    );
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
