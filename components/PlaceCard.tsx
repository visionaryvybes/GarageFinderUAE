"use client";

import { Star, Clock, MapPin, Navigation } from "lucide-react";
import type { PlaceResult } from "@/types";

interface PlaceCardProps {
  place: PlaceResult;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string {
  const R = 3959; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 0.1 ? `${Math.round(d * 5280)} ft` : `${d.toFixed(1)} mi`;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-semibold text-warning">{rating.toFixed(1)}</span>
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? "fill-warning text-warning"
                : "fill-zinc-700 text-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PlaceCard({
  place,
  index,
  isSelected,
  onClick,
  userLocation,
}: PlaceCardProps) {
  const photoUrl = place.photos?.[0]?.photo_reference
    ? `/api/photo?ref=${place.photos[0].photo_reference}&maxwidth=200`
    : null;

  const distance =
    userLocation
      ? getDistance(
          userLocation.lat,
          userLocation.lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        )
      : null;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-xl border transition-all duration-200
        ${
          isSelected
            ? "bg-accent/10 border-accent/30 shadow-lg shadow-accent/5"
            : "bg-surface border-border hover:border-border-light hover:bg-surface-hover"
        }
      `}
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-lg bg-zinc-800 overflow-hidden">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={place.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-text-muted" />
              </div>
            )}
          </div>
          {/* Index badge */}
          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-accent text-zinc-950 rounded-full text-[10px] font-bold flex items-center justify-center">
            {index + 1}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-text-primary truncate">
            {place.name}
          </h3>

          <div className="flex items-center gap-2 mt-0.5">
            {place.rating && (
              <RatingStars rating={place.rating} />
            )}
            {place.user_ratings_total && (
              <span className="text-xs text-text-muted">
                ({place.user_ratings_total.toLocaleString()})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            {place.opening_hours && (
              <span
                className={`text-xs font-medium ${
                  place.opening_hours.open_now ? "text-success" : "text-danger"
                }`}
              >
                {place.opening_hours.open_now ? "Open" : "Closed"}
              </span>
            )}
            {place.opening_hours && distance && (
              <span className="text-text-muted">·</span>
            )}
            {distance && (
              <span className="flex items-center gap-0.5 text-xs text-text-secondary">
                <Navigation className="w-3 h-3" />
                {distance}
              </span>
            )}
          </div>

          <p className="text-xs text-text-muted mt-1 truncate">
            {place.formatted_address || place.vicinity}
          </p>
        </div>
      </div>
    </button>
  );
}
