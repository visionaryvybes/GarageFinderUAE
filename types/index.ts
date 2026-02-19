export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  business_status?: string;
  types?: string[];
  photos?: PlacePhoto[];
  price_level?: number;
  vicinity?: string;
}

export interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions: string[];
}

export interface PlaceDetails extends PlaceResult {
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string; // Google Maps URL
  reviews?: PlaceReview[];
  address_components?: AddressComponent[];
  utc_offset?: number;
  editorial_summary?: {
    overview: string;
  };
}

export interface PlaceReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface SearchFilters {
  query: string;
  serviceType: string;
  openNow: boolean;
  minRating: number;
  sortBy: "relevance" | "distance" | "rating";
}

export interface MapViewport {
  center: { lat: number; lng: number };
  zoom: number;
}

export type ServiceType =
  | "all"
  | "general"
  | "body_shop"
  | "oil_change"
  | "tires"
  | "transmission"
  | "brakes"
  | "electrical"
  | "diagnostics"
  | "dealer";
