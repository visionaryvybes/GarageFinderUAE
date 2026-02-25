"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Star, Clock, Phone, Globe, MapPin, Navigation,
  ExternalLink, Share2, ChevronDown, ChevronUp,
  Sparkles, BadgeCheck, Package, Wrench,
} from "lucide-react";
import type { PlaceDetails, PlaceReview } from "@/types";

interface PlaceDetailProps {
  placeId: string | null;
  onClose: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

function RatingStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const starSize = size === "lg" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-700 text-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-orange-500", "bg-violet-500", "bg-cyan-500",
  "bg-emerald-500", "bg-pink-500", "bg-blue-500",
];

function ReviewCard({ review, index }: { review: PlaceReview; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 200;
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initial = review.author_name?.[0]?.toUpperCase() || "?";

  return (
    <div className="py-4 border-b border-white/[0.06] last:border-0">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl ${avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden`}>
          {review.profile_photo_url ? (
            <img src={review.profile_photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-semibold text-white truncate">{review.author_name}</span>
            <span className="text-xs text-zinc-600 shrink-0">{review.relative_time_description}</span>
          </div>
          <div className="mb-2"><RatingStars rating={review.rating} /></div>
          <p className="text-sm text-zinc-400 leading-relaxed break-words">
            {isLong && !expanded ? review.text.slice(0, 200) + "..." : review.text}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlaceDetail({ placeId, onClose, userLocation }: PlaceDetailProps) {
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [reviewSummary, setReviewSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!placeId) { setDetails(null); return; }
    setLoading(true);
    setReviewSummary("");
    setDetails(null);

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
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : "";
    return `https://www.google.com/maps/dir/${origin}/${dest}`;
  };

  const isOpen = details?.opening_hours?.open_now;
  const isPartsStore = details?.types?.includes("store") && !details?.types?.includes("car_repair");

  const content = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-white/[0.07]">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isPartsStore ? "bg-orange-500/15" : "bg-blue-500/15"}`}>
            {isPartsStore
              ? <Package className="w-6 h-6 text-orange-400" />
              : <Wrench className="w-6 h-6 text-blue-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 w-48 bg-zinc-800 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-zinc-800 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                <h2 className="text-base font-bold text-white leading-tight line-clamp-2">
                  {details?.name || "Loading..."}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {details?.rating && (
                    <div className="flex items-center gap-1">
                      <RatingStars rating={details.rating} />
                      <span className="text-xs font-semibold text-white ml-1">{details.rating}</span>
                      {details.user_ratings_total && (
                        <span className="text-xs text-zinc-500">({details.user_ratings_total})</span>
                      )}
                    </div>
                  )}
                  <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    isOpen
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : "bg-zinc-800 text-zinc-500 border border-white/10"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                    {isOpen ? "Open now" : "Closed"}
                  </span>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <p className="text-sm text-zinc-500">Loading details...</p>
          </div>
        )}

        {details && !loading && (
          <div className="p-5 space-y-4">
            {/* Photos strip */}
            {details.photos && details.photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-5 px-5">
                {details.photos.slice(0, 6).map((photo, i) => (
                  <img
                    key={i}
                    src={`/api/photo?ref=${photo.photo_reference}&maxwidth=400`}
                    alt={`${details.name} ${i + 1}`}
                    className="h-28 w-44 rounded-xl object-cover shrink-0 border border-white/[0.07]"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                Directions
              </a>
              {details.formatted_phone_number ? (
                <a
                  href={`tel:${details.formatted_phone_number}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-2xl transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              ) : (
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-2xl transition-all active:scale-95">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>

            {/* Info cards */}
            <div className="space-y-2">
              {details.formatted_address && (
                <div className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-2xl">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-zinc-300">{details.formatted_address}</p>
                </div>
              )}
              {details.formatted_phone_number && (
                <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-2xl">
                  <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                  <p className="text-sm text-zinc-300">{details.formatted_phone_number}</p>
                </div>
              )}
              {details.website && (
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-2xl hover:bg-zinc-800/50 transition-colors"
                >
                  <Globe className="w-4 h-4 text-orange-400 shrink-0" />
                  <p className="text-sm text-zinc-300 truncate flex-1">{details.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </a>
              )}
            </div>

            {/* Opening hours */}
            {details.opening_hours?.weekday_text && (
              <div className="p-4 bg-zinc-900/50 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold text-white">Opening Hours</span>
                </div>
                <div className="space-y-1.5">
                  {details.opening_hours.weekday_text.map((line, i) => {
                    const [day, ...rest] = line.split(": ");
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">{day}</span>
                        <span className="text-zinc-300 font-medium">{rest.join(": ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Review Summary */}
            {reviewSummary && (
              <div className="p-4 bg-violet-500/8 border border-violet-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-400">AI Summary</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{reviewSummary}</p>
              </div>
            )}

            {/* Reviews */}
            {details.reviews && details.reviews.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BadgeCheck className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold text-white">Reviews ({details.reviews.length})</span>
                </div>
                <div>
                  {details.reviews.map((review, i) => (
                    <ReviewCard key={i} review={review} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {placeId && (
        <>
          {/* Mobile: bottom modal */}
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-[70] bg-[#111113] rounded-t-3xl border-t border-white/[0.08]"
              style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
            >
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-zinc-700" />
              </div>
              {content}
            </motion.div>
          </div>

          {/* Desktop: right side panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="hidden md:flex fixed right-0 top-0 bottom-0 w-[460px] z-[60] bg-[#111113] border-l border-white/[0.08] flex-col shadow-2xl shadow-black/50"
          >
            {content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
