import type { PlaceResult } from "@/types";

export type PlaceType = "service" | "parts";

export interface ExtendedPlaceResult extends PlaceResult {
  placeType?: PlaceType;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shop display metadata (keyed by Google place_id for live results,
// or by mock id for brand-tier UI on the home page)
// ─────────────────────────────────────────────────────────────────────────────
export const SHOP_META: Record<string, {
  specialties: string[];
  verified: boolean;
  waitTime: string;
  badge?: string;
}> = {
  mock_001: { specialties: ["BMW", "Mercedes", "Audi", "Porsche"],         verified: true,  waitTime: "~45 min",  badge: "Top Rated"     },
  mock_002: { specialties: ["All Makes", "Body Work", "Paint"],            verified: true,  waitTime: "~30 min",  badge: "Most Reviewed" },
  mock_003: { specialties: ["Ferrari", "Lamborghini", "Rolls-Royce"],      verified: true,  waitTime: "By appt",  badge: "Luxury"        },
  mock_004: { specialties: ["Tesla", "Electric", "Hybrid"],                verified: true,  waitTime: "~1 hr",    badge: "EV Specialist" },
  mock_005: { specialties: ["Tyres", "Alignment", "Brakes"],               verified: true,  waitTime: "~20 min",  badge: "Fast Service"  },
  mock_006: { specialties: ["Transmission", "Engine", "Diagnostics"],      verified: false, waitTime: "~2 hrs"                           },
  mock_007: { specialties: ["Dyno Tuning", "ECU Remap", "Performance"],    verified: true,  waitTime: "By appt",  badge: "Performance"   },
  mock_008: { specialties: ["Body Repair", "Paint", "Insurance Work"],     verified: true,  waitTime: "~3 hrs"                           },
  mock_009: { specialties: ["All Makes", "AC", "Electrical"],              verified: true,  waitTime: "~1 hr",    badge: "Top Rated"     },
  mock_010: { specialties: ["General Repair", "Fleet", "Commercial"],      verified: false, waitTime: "~1.5 hrs"                         },
  mock_011: { specialties: ["All Makes", "Budget Service"],                verified: false, waitTime: "~40 min"                          },
  mock_012: { specialties: ["OEM Parts", "Aftermarket", "All Makes"],      verified: true,  waitTime: "In Stock",  badge: "OEM Certified" },
  mock_013: { specialties: ["Used Parts", "All Makes", "Wholesale"],       verified: true,  waitTime: "In Stock"                         },
  mock_014: { specialties: ["Genuine Parts", "Luxury Cars", "Abu Dhabi"],  verified: true,  waitTime: "In Stock",  badge: "Genuine OEM"   },
  mock_015: { specialties: ["BMW", "Mercedes", "VW", "Audi"],              verified: true,  waitTime: "~50 min",  badge: "German Expert" },
  mock_016: { specialties: ["VW", "Audi", "Skoda", "Seat"],                verified: true,  waitTime: "~1 hr",    badge: "VAG Certified" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Brand → Shop mapping for the home page brand filter
// ─────────────────────────────────────────────────────────────────────────────
type Tier = "primary" | "secondary" | "general";
const BRAND_MAP: Record<string, { id: string; tier: Tier }[]> = {
  "bmw":           [{ id: "mock_001", tier: "primary"   }, { id: "mock_007", tier: "secondary" }, { id: "mock_015", tier: "secondary" }, { id: "mock_002", tier: "general"  }],
  "mercedes-benz": [{ id: "mock_001", tier: "primary"   }, { id: "mock_002", tier: "general"   }, { id: "mock_009", tier: "general"   }],
  "audi":          [{ id: "mock_001", tier: "primary"   }, { id: "mock_016", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
  "volkswagen":    [{ id: "mock_016", tier: "primary"   }, { id: "mock_015", tier: "secondary" }, { id: "mock_001", tier: "secondary" }],
  "porsche":       [{ id: "mock_001", tier: "primary"   }, { id: "mock_003", tier: "secondary" }, { id: "mock_007", tier: "secondary" }],
  "mini":          [{ id: "mock_001", tier: "secondary" }, { id: "mock_002", tier: "general"   }],
  "ferrari":       [{ id: "mock_003", tier: "primary"   }, { id: "mock_007", tier: "secondary" }],
  "lamborghini":   [{ id: "mock_003", tier: "primary"   }, { id: "mock_007", tier: "secondary" }],
  "bentley":       [{ id: "mock_003", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
  "rolls-royce":   [{ id: "mock_003", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
  "maserati":      [{ id: "mock_003", tier: "primary"   }, { id: "mock_001", tier: "secondary" }],
  "jaguar":        [{ id: "mock_003", tier: "secondary" }, { id: "mock_001", tier: "secondary" }],
  "alfa-romeo":    [{ id: "mock_001", tier: "secondary" }, { id: "mock_003", tier: "secondary" }],
  "volvo":         [{ id: "mock_001", tier: "secondary" }, { id: "mock_009", tier: "general"   }],
  "land-rover":    [{ id: "mock_001", tier: "secondary" }, { id: "mock_002", tier: "general"   }],
  "tesla":         [{ id: "mock_004", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
  "toyota":        [{ id: "mock_005", tier: "primary"   }, { id: "mock_009", tier: "secondary" }, { id: "mock_002", tier: "general"  }],
  "honda":         [{ id: "mock_005", tier: "primary"   }, { id: "mock_009", tier: "secondary" }, { id: "mock_002", tier: "general"  }],
  "nissan":        [{ id: "mock_005", tier: "primary"   }, { id: "mock_002", tier: "general"   }, { id: "mock_011", tier: "general"  }],
  "mazda":         [{ id: "mock_005", tier: "secondary" }, { id: "mock_002", tier: "general"   }],
  "mitsubishi":    [{ id: "mock_005", tier: "secondary" }, { id: "mock_002", tier: "general"   }],
  "lexus":         [{ id: "mock_005", tier: "primary"   }, { id: "mock_009", tier: "secondary" }],
  "infiniti":      [{ id: "mock_001", tier: "secondary" }, { id: "mock_009", tier: "secondary" }],
  "hyundai":       [{ id: "mock_005", tier: "primary"   }, { id: "mock_009", tier: "secondary" }],
  "kia":           [{ id: "mock_005", tier: "primary"   }, { id: "mock_009", tier: "secondary" }],
  "ford":          [{ id: "mock_006", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
  "chevrolet":     [{ id: "mock_006", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
  "dodge":         [{ id: "mock_006", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
  "jeep":          [{ id: "mock_006", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
  "cadillac":      [{ id: "mock_006", tier: "primary"   }, { id: "mock_002", tier: "general"   }],
};

const TIER_SCORE: Record<Tier, number> = { primary: 3, secondary: 2, general: 1 };

export function getBrandTierLabel(placeId: string, brandId: string): string | null {
  const entry = BRAND_MAP[brandId]?.find(e => e.id === placeId);
  if (!entry) return null;
  if (entry.tier === "primary")   return "Specialist";
  if (entry.tier === "secondary") return "Certified";
  if (entry.tier === "general")   return "All Makes";
  return null;
}

export function applyFilters(
  shops: ExtendedPlaceResult[],
  opts: {
    openNow?: boolean;
    minRating?: number;
    maxPrice?: number;
    placeType?: "all" | "service" | "parts";
    sortBy?: "rating" | "reviews" | "relevance";
  }
): ExtendedPlaceResult[] {
  let result = [...shops];
  if (opts.placeType && opts.placeType !== "all") {
    result = result.filter(s => (s.placeType || "service") === opts.placeType);
  }
  if (opts.openNow) result = result.filter(s => s.opening_hours?.open_now);
  if (opts.minRating) result = result.filter(s => (s.rating || 0) >= opts.minRating!);
  if (opts.maxPrice !== undefined && opts.maxPrice > 0) {
    result = result.filter(s => (s.price_level || 0) <= opts.maxPrice!);
  }
  if (opts.sortBy === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (opts.sortBy === "reviews") result.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
  return result;
}
