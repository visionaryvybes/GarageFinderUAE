import { NextRequest, NextResponse } from "next/server";
import { summarizeReviews } from "@/lib/ai";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json(
      { error: "placeId is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      place_id: placeId,
      fields:
        "place_id,name,formatted_address,formatted_phone_number,international_phone_number,geometry,rating,user_ratings_total,opening_hours,business_status,types,photos,website,url,reviews,editorial_summary,price_level",
      key: apiKey,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`
    );

    const data = await response.json();

    if (data.status === "OK" && data.result) {
      // Get AI review summary
      let reviewSummary = "";
      if (data.result.reviews?.length > 0) {
        reviewSummary = await summarizeReviews(
          data.result.reviews.map((r: { text: string; rating: number }) => ({
            text: r.text,
            rating: r.rating,
          }))
        );
      }

      return NextResponse.json({
        result: data.result,
        reviewSummary,
      });
    }

    return NextResponse.json(
      { error: data.error_message || data.status },
      { status: 400 }
    );
  } catch (error) {
    console.error("Place Details API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}
