"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Clock,
  Phone,
  Globe,
  MapPin,
  Navigation,
  ExternalLink,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  ThumbsUp,
} from "lucide-react";
import type { PlaceDetails, PlaceReview } from "@/types";

interface PlaceDetailProps {
  placeId: string | null;
  onClose: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

function RatingStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const starSize = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= Math.round(rating)
              ? "fill-warning text-warning"
              : "fill-zinc-700 text-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: PlaceReview }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 200;

  return (
    <div className="py-3 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
          {review.profile_photo_url ? (
            <img
              src={review.profile_photo_url}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-text-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {review.author_name}
            </span>
            <span className="text-xs text-text-muted">
              {review.relative_time_description}
            </span>
          </div>
          <div className="mt-0.5">
            <RatingStars rating={review.rating} />
          </div>
          <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
            {isLong && !expanded
              ? review.text.slice(0, 200) + "..."
              : review.text}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-accent mt-1 hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlaceDetail({
  placeId,
  onClose,
  userLocation,
}: PlaceDetailProps) {
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [reviewSummary, setReviewSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    if (!placeId) {
      setDetails(null);
      return;
    }

    setLoading(true);
    setShowHours(false);
    setShowAllReviews(false);
    setActivePhotoIndex(0);

    fetch(`/api/place-details?placeId=${placeId}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data.result);
        setReviewSummary(data.reviewSummary || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [placeId]);

  const getDirectionsUrl = () => {
    if (!details) return "#";
    const dest = `${details.geometry.location.lat},${details.geometry.location.lng}`;
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : "";
    return `https://www.google.com/maps/dir/${origin}/${dest}`;
  };

  const apiKey = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : "";

  return (
    <AnimatePresence>
      {placeId && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 w-full sm:w-[420px] bg-zinc-950 border-l border-border z-30 flex flex-col overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 bg-zinc-950/80 backdrop-blur rounded-full border border-border hover:bg-surface-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {loading ? (
            <div className="flex-1 p-4 space-y-4">
              <div className="skeleton h-48 w-full" />
              <div className="skeleton h-6 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-32 w-full mt-4" />
            </div>
          ) : details ? (
            <div className="flex-1 overflow-y-auto">
              {/* Photos */}
              {details.photos && details.photos.length > 0 && (
                <div className="relative">
                  <div className="photo-scroll h-56">
                    {details.photos.slice(0, 10).map((photo, i) => (
                      <img
                        key={i}
                        src={`/api/photo?ref=${photo.photo_reference}&maxwidth=600`}
                        alt={`${details.name} photo ${i + 1}`}
                        className={`h-full w-80 object-cover cursor-pointer transition-opacity ${
                          i === activePhotoIndex ? "opacity-100" : "opacity-70"
                        }`}
                        onClick={() => setActivePhotoIndex(i)}
                        loading="lazy"
                      />
                    ))}
                  </div>
                  {/* Photo counter */}
                  <div className="absolute bottom-2 right-2 bg-zinc-950/70 backdrop-blur px-2 py-0.5 rounded-full text-xs text-zinc-300">
                    {details.photos.length} photos
                  </div>
                </div>
              )}

              <div className="p-4 space-y-4">
                {/* Name & Rating */}
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    {details.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    {details.rating && (
                      <>
                        <span className="text-lg font-bold text-warning">
                          {details.rating.toFixed(1)}
                        </span>
                        <RatingStars rating={details.rating} size="lg" />
                        {details.user_ratings_total && (
                          <span className="text-sm text-text-muted">
                            ({details.user_ratings_total.toLocaleString()} reviews)
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-text-secondary">Auto repair shop</span>
                    {details.price_level !== undefined && (
                      <>
                        <span className="text-text-muted">·</span>
                        <span className="text-sm text-text-secondary">
                          {"$".repeat(details.price_level || 1)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-hover text-zinc-950 rounded-xl font-medium text-sm transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </a>
                  {details.formatted_phone_number && (
                    <a
                      href={`tel:${details.formatted_phone_number}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface border border-border hover:border-border-light rounded-xl font-medium text-sm transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  )}
                  <button className="p-2.5 bg-surface border border-border hover:border-border-light rounded-xl transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-surface border border-border hover:border-border-light rounded-xl transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info section */}
                <div className="space-y-3 py-3 border-t border-b border-border">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-text-muted shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">
                      {details.formatted_address}
                    </span>
                  </div>

                  {/* Hours */}
                  {details.opening_hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-text-muted shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <button
                          onClick={() => setShowHours(!showHours)}
                          className="flex items-center gap-1 text-sm"
                        >
                          <span
                            className={
                              details.opening_hours.open_now
                                ? "text-success font-medium"
                                : "text-danger font-medium"
                            }
                          >
                            {details.opening_hours.open_now ? "Open now" : "Closed"}
                          </span>
                          {showHours ? (
                            <ChevronUp className="w-4 h-4 text-text-muted" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-text-muted" />
                          )}
                        </button>
                        {showHours && details.opening_hours.weekday_text && (
                          <div className="mt-2 space-y-1">
                            {details.opening_hours.weekday_text.map((day) => (
                              <p
                                key={day}
                                className="text-xs text-text-secondary"
                              >
                                {day}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {details.formatted_phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-text-muted shrink-0" />
                      <a
                        href={`tel:${details.formatted_phone_number}`}
                        className="text-sm text-accent hover:underline"
                      >
                        {details.formatted_phone_number}
                      </a>
                    </div>
                  )}

                  {/* Website */}
                  {details.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-text-muted shrink-0" />
                      <a
                        href={details.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline truncate"
                      >
                        {details.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                      </a>
                    </div>
                  )}

                  {/* Google Maps link */}
                  {details.url && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-text-muted shrink-0" />
                      <a
                        href={details.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  )}
                </div>

                {/* AI Review Summary */}
                {reviewSummary && (
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        AI Summary
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {reviewSummary}
                    </p>
                  </div>
                )}

                {/* Editorial Summary */}
                {details.editorial_summary?.overview && !reviewSummary && (
                  <div className="p-3 bg-surface rounded-xl border border-border">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {details.editorial_summary.overview}
                    </p>
                  </div>
                )}

                {/* Reviews */}
                {details.reviews && details.reviews.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-text-primary">
                        Reviews
                      </h3>
                      <span className="text-xs text-text-muted">
                        Sorted by relevance
                      </span>
                    </div>
                    <div>
                      {(showAllReviews
                        ? details.reviews
                        : details.reviews.slice(0, 3)
                      ).map((review, i) => (
                        <ReviewCard key={i} review={review} />
                      ))}
                    </div>
                    {details.reviews.length > 3 && (
                      <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="w-full mt-2 py-2 text-sm text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      >
                        {showAllReviews
                          ? "Show fewer reviews"
                          : `Show all ${details.reviews.length} reviews`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
