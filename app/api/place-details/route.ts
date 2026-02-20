import { NextRequest, NextResponse } from "next/server";
import { summarizeReviews } from "@/lib/ai";

const MOCK_DETAILS: Record<string, object> = {
  mock_001: {
    place_id: "mock_001",
    name: "Emirates German Auto Centre",
    formatted_address: "Al Quoz Industrial Area 1, Dubai, UAE",
    formatted_phone_number: "+971 4 321 8844",
    website: "https://emiratesgermanauto.ae",
    url: "https://maps.google.com/?q=Emirates+German+Auto+Dubai",
    geometry: { location: { lat: 25.1367, lng: 55.2282 } },
    rating: 4.9,
    user_ratings_total: 847,
    price_level: 3,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 8:00 AM – 7:00 PM",
        "Tuesday: 8:00 AM – 7:00 PM",
        "Wednesday: 8:00 AM – 7:00 PM",
        "Thursday: 8:00 AM – 7:00 PM",
        "Friday: 8:00 AM – 6:00 PM",
        "Saturday: 9:00 AM – 4:00 PM",
        "Sunday: Closed",
      ],
    },
    editorial_summary: { overview: "Al Quoz's premier BMW, Mercedes-Benz and Audi specialist. Master-certified technicians with 20+ years experience and genuine OEM parts. Free pick-up and delivery within Dubai." },
    reviews: [
      { author_name: "Khalid Al Mansoori", rating: 5, text: "Best German car specialist in Dubai. Fixed my BMW M5 issue that two other garages couldn't diagnose. Transparent pricing and finished same day.", relative_time_description: "1 week ago", time: 0 },
      { author_name: "Sarah J.", rating: 5, text: "Brought my Audi Q7 for full service. They used genuine OEM parts, showed me everything before fitting. Outstanding service.", relative_time_description: "3 weeks ago", time: 0 },
      { author_name: "Ahmed K.", rating: 5, text: "Porsche Cayenne needed brake and suspension work. Perfect job, reasonable for the quality. Will only use them now.", relative_time_description: "1 month ago", time: 0 },
      { author_name: "Fatima R.", rating: 4, text: "Really professional team. My Mercedes E-Class runs perfectly after the service. A bit expensive but worth every dirham.", relative_time_description: "2 months ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_002: {
    place_id: "mock_002",
    name: "Speedline Auto Service",
    formatted_address: "Al Muteena St, Deira, Dubai, UAE",
    formatted_phone_number: "+971 4 267 5533",
    website: "https://speedlineauto.ae",
    url: "https://maps.google.com/?q=Speedline+Auto+Deira",
    geometry: { location: { lat: 25.2697, lng: 55.3095 } },
    rating: 4.7,
    user_ratings_total: 1203,
    price_level: 2,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 7:30 AM – 8:00 PM",
        "Tuesday: 7:30 AM – 8:00 PM",
        "Wednesday: 7:30 AM – 8:00 PM",
        "Thursday: 7:30 AM – 8:00 PM",
        "Friday: 7:30 AM – 7:00 PM",
        "Saturday: 8:00 AM – 6:00 PM",
        "Sunday: 9:00 AM – 4:00 PM",
      ],
    },
    editorial_summary: { overview: "Deira's most trusted all-makes service centre. Over 1,200 Google reviews, transparent pricing and no hidden charges. Walk-ins welcome." },
    reviews: [
      { author_name: "Ravi M.", rating: 5, text: "Most honest garage in Deira. They diagnosed my Toyota quickly and fixed it for AED 300 less than the dealer quote.", relative_time_description: "5 days ago", time: 0 },
      { author_name: "Omar H.", rating: 5, text: "Got my Honda CRV AC fixed here in 3 hours. Ice cold now. Good price, excellent work.", relative_time_description: "2 weeks ago", time: 0 },
      { author_name: "Jessica L.", rating: 4, text: "Great service overall. The waiting area is clean and they kept me updated throughout. Would recommend.", relative_time_description: "1 month ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_003: {
    place_id: "mock_003",
    name: "Royal Prestige Motors",
    formatted_address: "Gate Village 4, DIFC, Dubai, UAE",
    formatted_phone_number: "+971 4 399 7711",
    website: "https://royalprestigemotors.ae",
    url: "https://maps.google.com/?q=Royal+Prestige+Motors+DIFC",
    geometry: { location: { lat: 25.2131, lng: 55.2797 } },
    rating: 4.8,
    user_ratings_total: 389,
    price_level: 4,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: false,
      weekday_text: [
        "Monday: 9:00 AM – 6:00 PM",
        "Tuesday: 9:00 AM – 6:00 PM",
        "Wednesday: 9:00 AM – 6:00 PM",
        "Thursday: 9:00 AM – 6:00 PM",
        "Friday: 9:00 AM – 5:00 PM",
        "Saturday: By Appointment Only",
        "Sunday: Closed",
      ],
    },
    editorial_summary: { overview: "Dubai's premier exotic car specialist. Ferrari, Lamborghini, Bentley and Rolls-Royce certified technicians. Concierge pick-up and delivery across the UAE." },
    reviews: [
      { author_name: "Sultan Al Rashid", rating: 5, text: "The only workshop I trust with my Ferrari SF90. Picked it up from my villa, serviced it perfectly, delivered fully detailed. Exceptional.", relative_time_description: "2 weeks ago", time: 0 },
      { author_name: "Emma W.", rating: 5, text: "My Bentley Bentayga needed specialist attention. They sourced genuine OEM parts from the UK and the result was flawless.", relative_time_description: "1 month ago", time: 0 },
      { author_name: "Tariq F.", rating: 4, text: "Premium service at premium prices. For an exotic car, this is exactly what you want. Peace of mind is priceless.", relative_time_description: "2 months ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_004: {
    place_id: "mock_004",
    name: "GreenMotors EV Centre",
    formatted_address: "Cluster T, Jumeirah Lake Towers, Dubai, UAE",
    formatted_phone_number: "+971 4 453 1122",
    website: "https://greenmotorsuae.com",
    url: "https://maps.google.com/?q=GreenMotors+EV+JLT",
    geometry: { location: { lat: 25.0704, lng: 55.1474 } },
    rating: 4.8,
    user_ratings_total: 562,
    price_level: 3,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 8:00 AM – 8:00 PM",
        "Tuesday: 8:00 AM – 8:00 PM",
        "Wednesday: 8:00 AM – 8:00 PM",
        "Thursday: 8:00 AM – 8:00 PM",
        "Friday: 9:00 AM – 6:00 PM",
        "Saturday: 9:00 AM – 6:00 PM",
        "Sunday: 10:00 AM – 4:00 PM",
      ],
    },
    editorial_summary: { overview: "Dubai's leading Tesla and EV specialist. Certified technicians for all electric and hybrid vehicles. Battery health checks, charging system repair and software updates." },
    reviews: [
      { author_name: "Priya S.", rating: 5, text: "Only Tesla specialist in JLT area. Fixed my Model 3 charging port issue same day. Dealer quoted 3 weeks!", relative_time_description: "1 week ago", time: 0 },
      { author_name: "Daniel M.", rating: 5, text: "My hybrid Lexus needed a battery diagnostic. They were thorough, professional and the price was fair.", relative_time_description: "3 weeks ago", time: 0 },
      { author_name: "Aisha K.", rating: 4, text: "Great knowledge of EVs. They explained everything clearly. Slightly expensive but you pay for expertise.", relative_time_description: "2 months ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_005: {
    place_id: "mock_005",
    name: "Flash Tyres & Service Centre",
    formatted_address: "Sheikh Zayed Rd, Al Barsha, Dubai, UAE",
    formatted_phone_number: "+971 4 338 9900",
    website: "https://flashtyres.ae",
    url: "https://maps.google.com/?q=Flash+Tyres+Al+Barsha",
    geometry: { location: { lat: 25.1105, lng: 55.1870 } },
    rating: 4.6,
    user_ratings_total: 1584,
    price_level: 2,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 7:00 AM – 10:00 PM",
        "Tuesday: 7:00 AM – 10:00 PM",
        "Wednesday: 7:00 AM – 10:00 PM",
        "Thursday: 7:00 AM – 10:00 PM",
        "Friday: 7:00 AM – 11:00 PM",
        "Saturday: 7:00 AM – 11:00 PM",
        "Sunday: 8:00 AM – 9:00 PM",
      ],
    },
    editorial_summary: { overview: "Dubai's fastest tyre and wheel service. Walk-ins welcome, average wait under 25 minutes. All major brands stocked including Pirelli, Michelin, Bridgestone, and Continental." },
    reviews: [
      { author_name: "Hamad A.", rating: 5, text: "In and out in 20 minutes for 4 new Pirelli tyres. Best price I found in Dubai. No appointment needed.", relative_time_description: "2 days ago", time: 0 },
      { author_name: "Maria G.", rating: 5, text: "They balanced all 4 wheels perfectly and fixed a slow puncture on the spot. Great service, very fair price.", relative_time_description: "1 week ago", time: 0 },
      { author_name: "James T.", rating: 4, text: "Always busy but they manage the queue well. Genuine brand tyres, competitive prices. My go-to for tyres.", relative_time_description: "1 month ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_006: {
    place_id: "mock_006",
    name: "Al Quoz Transmission Experts",
    formatted_address: "Al Quoz Industrial Area 3, Dubai, UAE",
    formatted_phone_number: "+971 4 347 6688",
    website: "https://alquoztransmission.ae",
    url: "https://maps.google.com/?q=Al+Quoz+Transmission",
    geometry: { location: { lat: 25.1289, lng: 55.2334 } },
    rating: 4.7,
    user_ratings_total: 618,
    price_level: 3,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 8:00 AM – 6:30 PM",
        "Tuesday: 8:00 AM – 6:30 PM",
        "Wednesday: 8:00 AM – 6:30 PM",
        "Thursday: 8:00 AM – 6:30 PM",
        "Friday: 8:00 AM – 5:00 PM",
        "Saturday: 9:00 AM – 3:00 PM",
        "Sunday: Closed",
      ],
    },
    editorial_summary: { overview: "Al Quoz's transmission and drivetrain specialists for over 18 years. Complete rebuilds, gearbox repair and CVT service. Free towing with any major repair." },
    reviews: [
      { author_name: "Mohammed S.", rating: 5, text: "Rebuilt my Chevy Tahoe's transmission perfectly. 2-year warranty included. Professional and honest team.", relative_time_description: "3 weeks ago", time: 0 },
      { author_name: "Lisa K.", rating: 5, text: "My Honda Accord was slipping gears. They fixed it for half the dealer price. Excellent quality work.", relative_time_description: "1 month ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_007: {
    place_id: "mock_007",
    name: "Cosworth Performance Garage",
    formatted_address: "Al Quoz Industrial Area 2, Dubai, UAE",
    formatted_phone_number: "+971 4 388 5599",
    website: "https://cosworthgaragedubai.com",
    url: "https://maps.google.com/?q=Cosworth+Performance+Dubai",
    geometry: { location: { lat: 25.1317, lng: 55.2415 } },
    rating: 4.9,
    user_ratings_total: 274,
    price_level: 4,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 9:00 AM – 7:00 PM",
        "Tuesday: 9:00 AM – 7:00 PM",
        "Wednesday: 9:00 AM – 7:00 PM",
        "Thursday: 9:00 AM – 7:00 PM",
        "Friday: 9:00 AM – 5:00 PM",
        "Saturday: 10:00 AM – 4:00 PM",
        "Sunday: Closed",
      ],
    },
    editorial_summary: { overview: "Dubai's premier performance tuning garage. Dyno testing, ECU remapping, turbo upgrades and stage tuning for all performance vehicles. All work guaranteed." },
    reviews: [
      { author_name: "Yousef N.", rating: 5, text: "Stage 2 tune on my BMW M2. Gained 80hp and the car pulls like a rocket. Best tuning garage in the UAE.", relative_time_description: "2 weeks ago", time: 0 },
      { author_name: "Chris P.", rating: 5, text: "Dyno tested my Porsche before and after their map. Massive improvement. Professional setup, they know what they're doing.", relative_time_description: "1 month ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_008: {
    place_id: "mock_008",
    name: "Gulf Auto Body Works",
    formatted_address: "Al Qusais Industrial Area, Dubai, UAE",
    formatted_phone_number: "+971 4 258 8877",
    website: "https://gulfautobody.ae",
    url: "https://maps.google.com/?q=Gulf+Auto+Body+Works+Dubai",
    geometry: { location: { lat: 25.2831, lng: 55.3766 } },
    rating: 4.5,
    user_ratings_total: 712,
    price_level: 2,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 8:00 AM – 7:00 PM",
        "Tuesday: 8:00 AM – 7:00 PM",
        "Wednesday: 8:00 AM – 7:00 PM",
        "Thursday: 8:00 AM – 7:00 PM",
        "Friday: 9:00 AM – 5:00 PM",
        "Saturday: 9:00 AM – 4:00 PM",
        "Sunday: Closed",
      ],
    },
    editorial_summary: { overview: "Insurance-approved body shop in Al Qusais. Full dent repair, respray, and accident repair services. Computer colour-matching for a perfect finish." },
    reviews: [
      { author_name: "Nora A.", rating: 5, text: "Fixed my car after a side-swipe accident. Paint match was perfect, totally invisible repair. Insurance handled smoothly.", relative_time_description: "1 month ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_009: {
    place_id: "mock_009",
    name: "Swiss Auto Services Abu Dhabi",
    formatted_address: "Mussafah Industrial Area, Abu Dhabi, UAE",
    formatted_phone_number: "+971 2 554 3300",
    website: "https://swissauto.ae",
    url: "https://maps.google.com/?q=Swiss+Auto+Mussafah",
    geometry: { location: { lat: 24.3595, lng: 54.4921 } },
    rating: 4.8,
    user_ratings_total: 924,
    price_level: 3,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 7:30 AM – 8:00 PM",
        "Tuesday: 7:30 AM – 8:00 PM",
        "Wednesday: 7:30 AM – 8:00 PM",
        "Thursday: 7:30 AM – 8:00 PM",
        "Friday: 8:00 AM – 6:00 PM",
        "Saturday: 8:00 AM – 5:00 PM",
        "Sunday: 9:00 AM – 3:00 PM",
      ],
    },
    editorial_summary: { overview: "Abu Dhabi's leading multi-brand service centre with 18+ years of dealership experience. Agency-quality service at competitive prices." },
    reviews: [
      { author_name: "Abdullah M.", rating: 5, text: "Best garage in Mussafah. Agency quality service at much better prices. My Lexus has never run better.", relative_time_description: "1 week ago", time: 0 },
      { author_name: "Samira T.", rating: 4, text: "Very professional team in Abu Dhabi. Good value for Toyota and Honda service.", relative_time_description: "3 weeks ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_010: {
    place_id: "mock_010",
    name: "Capital Motors Service Centre",
    formatted_address: "Electra St, Abu Dhabi, UAE",
    formatted_phone_number: "+971 2 633 4455",
    website: "https://capitalmotors.ae",
    url: "https://maps.google.com/?q=Capital+Motors+Abu+Dhabi",
    geometry: { location: { lat: 24.4889, lng: 54.3638 } },
    rating: 4.6,
    user_ratings_total: 488,
    price_level: 2,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: false,
      weekday_text: [
        "Monday: 8:00 AM – 6:00 PM",
        "Tuesday: 8:00 AM – 6:00 PM",
        "Wednesday: 8:00 AM – 6:00 PM",
        "Thursday: 8:00 AM – 6:00 PM",
        "Friday: 8:00 AM – 5:00 PM",
        "Saturday: 9:00 AM – 3:00 PM",
        "Sunday: Closed",
      ],
    },
    editorial_summary: { overview: "General repair and maintenance in central Abu Dhabi. All makes and models, with fleet service available." },
    reviews: [
      { author_name: "Hasan N.", rating: 5, text: "Good honest garage in central Abu Dhabi. Fixed my Nissan Patrol quickly at a fair price.", relative_time_description: "2 weeks ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_011: {
    place_id: "mock_011",
    name: "Al Wahda Auto Repair Sharjah",
    formatted_address: "Industrial Area 17, Sharjah, UAE",
    formatted_phone_number: "+971 6 533 7744",
    website: "",
    url: "https://maps.google.com/?q=Al+Wahda+Auto+Sharjah",
    geometry: { location: { lat: 25.3463, lng: 55.4641 } },
    rating: 4.4,
    user_ratings_total: 391,
    price_level: 1,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 8:00 AM – 9:00 PM",
        "Tuesday: 8:00 AM – 9:00 PM",
        "Wednesday: 8:00 AM – 9:00 PM",
        "Thursday: 8:00 AM – 9:00 PM",
        "Friday: 8:00 AM – 8:00 PM",
        "Saturday: 8:00 AM – 8:00 PM",
        "Sunday: 9:00 AM – 5:00 PM",
      ],
    },
    editorial_summary: { overview: "Budget-friendly all-makes repair in Sharjah Industrial Area. Quick turnaround and honest pricing for general maintenance and repairs." },
    reviews: [
      { author_name: "Imran S.", rating: 4, text: "Cheap and reliable for basic repairs in Sharjah. Good value for what you get.", relative_time_description: "1 month ago", time: 0 },
    ],
    types: ["car_repair", "establishment"],
  },
  mock_012: {
    place_id: "mock_012",
    name: "AutoParts Express Dubai",
    formatted_address: "Al Qusais Industrial Area, Dubai, UAE",
    formatted_phone_number: "+971 4 267 4433",
    website: "https://autopartsexpress.ae",
    url: "https://maps.google.com/?q=AutoParts+Express+Dubai",
    geometry: { location: { lat: 25.2714, lng: 55.3818 } },
    rating: 4.6,
    user_ratings_total: 832,
    price_level: 2,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 8:00 AM – 8:00 PM",
        "Tuesday: 8:00 AM – 8:00 PM",
        "Wednesday: 8:00 AM – 8:00 PM",
        "Thursday: 8:00 AM – 8:00 PM",
        "Friday: 9:00 AM – 6:00 PM",
        "Saturday: 8:00 AM – 7:00 PM",
        "Sunday: 9:00 AM – 4:00 PM",
      ],
    },
    editorial_summary: { overview: "Dubai's largest independent auto parts store. OEM, aftermarket and used parts for all makes. Same-day delivery within Dubai available." },
    reviews: [
      { author_name: "Vikram J.", rating: 5, text: "Huge stock of parts. Found a genuine OEM brake kit for my BMW cheaper than any dealer. Fast service.", relative_time_description: "1 week ago", time: 0 },
      { author_name: "Leila A.", rating: 4, text: "Great selection. They helped me find the right part for my Nissan. Good prices.", relative_time_description: "3 weeks ago", time: 0 },
    ],
    types: ["car_repair", "store", "establishment"],
  },
  mock_013: {
    place_id: "mock_013",
    name: "Al Sharqi Spare Parts Market",
    formatted_address: "Naif, Deira, Dubai, UAE",
    formatted_phone_number: "+971 4 226 3311",
    website: "",
    url: "https://maps.google.com/?q=Al+Sharqi+Parts+Deira",
    geometry: { location: { lat: 25.2806, lng: 55.3207 } },
    rating: 4.5,
    user_ratings_total: 1147,
    price_level: 2,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 8:30 AM – 9:30 PM",
        "Tuesday: 8:30 AM – 9:30 PM",
        "Wednesday: 8:30 AM – 9:30 PM",
        "Thursday: 8:30 AM – 9:30 PM",
        "Friday: 8:30 AM – 8:00 PM",
        "Saturday: 8:30 AM – 9:30 PM",
        "Sunday: 9:00 AM – 6:00 PM",
      ],
    },
    editorial_summary: { overview: "Deira's original spare parts bazaar. Over 30 vendors under one roof. All makes, wholesale available, expert staff to help you find the right part." },
    reviews: [
      { author_name: "Sanjay P.", rating: 5, text: "Best place in Dubai for used and aftermarket parts. Found everything I needed for my Toyota at half the price.", relative_time_description: "4 days ago", time: 0 },
      { author_name: "Mohammed R.", rating: 4, text: "Great market. Always busy, many options. Bargaining gets you good prices.", relative_time_description: "2 weeks ago", time: 0 },
    ],
    types: ["car_repair", "store", "establishment"],
  },
  mock_014: {
    place_id: "mock_014",
    name: "OEM Parts Centre Abu Dhabi",
    formatted_address: "Mussafah Industrial Area, Abu Dhabi, UAE",
    formatted_phone_number: "+971 2 553 1188",
    website: "https://oempartsabudhabi.ae",
    url: "https://maps.google.com/?q=OEM+Parts+Abu+Dhabi",
    geometry: { location: { lat: 24.3701, lng: 54.5019 } },
    rating: 4.7,
    user_ratings_total: 556,
    price_level: 3,
    business_status: "OPERATIONAL",
    opening_hours: {
      open_now: true,
      weekday_text: [
        "Monday: 8:00 AM – 7:00 PM",
        "Tuesday: 8:00 AM – 7:00 PM",
        "Wednesday: 8:00 AM – 7:00 PM",
        "Thursday: 8:00 AM – 7:00 PM",
        "Friday: 9:00 AM – 5:00 PM",
        "Saturday: 9:00 AM – 5:00 PM",
        "Sunday: Closed",
      ],
    },
    editorial_summary: { overview: "Abu Dhabi's trusted source for genuine OEM parts. Specialising in luxury and European brands. Same-day availability for most items." },
    reviews: [
      { author_name: "Waleed K.", rating: 5, text: "Only place in Abu Dhabi I trust for genuine BMW parts. Great stock, fast service, excellent team.", relative_time_description: "2 weeks ago", time: 0 },
    ],
    types: ["car_repair", "store", "establishment"],
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  if (placeId.startsWith("mock_")) {
    const mockData = MOCK_DETAILS[placeId];
    if (mockData) {
      return NextResponse.json({ result: mockData, reviewSummary: "" });
    }
    return NextResponse.json({ error: "Mock place not found" }, { status: 404 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
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
      // Filter out places that are permanently closed or have suspicious data
      if (data.result.business_status === "CLOSED_PERMANENTLY") {
        return NextResponse.json({ error: "Place is permanently closed" }, { status: 404 });
      }

      let reviewSummary = "";
      if (data.result.reviews?.length > 0) {
        reviewSummary = await summarizeReviews(
          data.result.reviews.map((r: { text: string; rating: number }) => ({
            text: r.text,
            rating: r.rating,
          }))
        );
      }
      return NextResponse.json({ result: data.result, reviewSummary });
    }

    return NextResponse.json(
      { error: data.error_message || data.status },
      { status: 400 }
    );
  } catch (error) {
    console.error("Place Details API error:", error);
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 });
  }
}
