"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Star, Clock, Phone, Globe, MapPin, Navigation,
  ExternalLink, Share2, Bookmark, ChevronDown, ChevronUp,
  Sparkles, User, Copy, Check, BadgeCheck, Package,
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
          className={`${starSize} ${star <= Math.round(rating)
            ? "fill-blue-500 text-blue-500"
            : "fill-zinc-800 text-zinc-800"
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
    <div className="py-4 border-b border-zinc-800/60 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0 overflow-hidden">
          {review.profile_photo_url ? (
            <img src={review.profile_photo_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-zinc-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white truncate">{review.author_name}</span>
            <span className="text-[11px] text-zinc-600 shrink-0">{review.relative_time_description}</span>
          </div>
          <div className="mt-1"><RatingStars rating={review.rating} /></div>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed break-words">
            {isLong && !expanded ? review.text.slice(0, 200) + "..." : review.text}
          </p>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-blue-500 mt-1.5 hover:text-blue-400 font-medium">
              {expanded ? "Show less" : "Read more"}
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
  const [showHours, setShowHours] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!placeId) { setDetails(null); return; }
    setLoading(true);
    setShowHours(false);
    setShowAllReviews(false);
    setActivePhotoIndex(0);
    setReviewSummary("");

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

  const copyAddress = () => {
    if (details?.formatted_address) {
      navigator.clipboard.writeText(details.formatted_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPartsStore = details?.types?.includes("store") || details?.name?.toLowerCase().includes("parts");

  return (
    <AnimatePresence>
      {placeId && (
        <>
          {/* Backdrop on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 sm:hidden"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-zinc-950 border-l border-[#1a1a1a] z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 shrink-0">
              <div className="flex items-center gap-2">
                {isPartsStore ? (
                  <Package className="w-4 h-4 text-orange-400" />
                ) : (
                  <BadgeCheck className="w-4 h-4 text-blue-400" />
                )}
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  {isPartsStore ? "Parts Store" : "Service Centre"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#1a1a1a] hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {loading ? (
                <div className="p-5 space-y-4">
                  <div className="skeleton h-52 w-full rounded-2xl" />
                  <div className="skeleton h-6 w-3/4 rounded-lg" />
                  <div className="skeleton h-4 w-1/2 rounded-lg" />
                  <div className="space-y-2 pt-2">
                    <div className="skeleton h-4 w-full rounded-lg" />
                    <div className="skeleton h-4 w-2/3 rounded-lg" />
                    <div className="skeleton h-4 w-4/5 rounded-lg" />
                  </div>
                  <div className="skeleton h-24 w-full rounded-xl mt-4" />
                </div>
              ) : details ? (
                <>
                  {/* Photos */}
                  {details.photos && details.photos.length > 0 && (
                    <div className="relative">
                      <div className="flex gap-1.5 overflow-x-auto snap-x snap-mandatory scrollbar-none h-56">
                        {details.photos.slice(0, 8).map((photo, i) => (
                          <img
                            key={i}
                            src={`/api/photo?ref=${photo.photo_reference}&maxwidth=600`}
                            alt={`${details.name} ${i + 1}`}
                            className={`h-full shrink-0 snap-center object-cover cursor-pointer transition-all duration-200 ${
                              i === 0 ? "w-full" : "w-64"
                            } ${i === activePhotoIndex ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
                            onClick={() => setActivePhotoIndex(i)}
                            loading="lazy"
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-medium text-zinc-300">
                        {details.photos.length} photos
                      </div>
                    </div>
                  )}

                  <div className="p-5 space-y-5">
                    {/* Name, Rating */}
                    <div>
                      <h2 className="text-xl font-bold text-white leading-tight pr-4">{details.name}</h2>
                      <div className="flex flex-wrap items-center gap-2.5 mt-2">
                        {details.rating && (
                          <>
                            <span className="text-xl font-bold text-blue-500">{details.rating.toFixed(1)}</span>
                            <RatingStars rating={details.rating} size="lg" />
                            {details.user_ratings_total && (
                              <span className="text-sm text-zinc-500">
                                {details.user_ratings_total.toLocaleString()} reviews
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {details.business_status === "OPERATIONAL" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-400 font-medium">
                            ● Operational
                          </span>
                        )}
                        {details.price_level !== undefined && (
                          <span className="text-sm text-zinc-500">
                            {"$".repeat(Math.max(1, details.price_level || 1))}
                          </span>
                        )}
                        <span className="text-sm text-zinc-600 capitalize">
                          {isPartsStore ? "Auto parts" : "Auto repair"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={getDirectionsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
                      >
                        <Navigation className="w-4 h-4" />
                        Directions
                      </a>
                      {details.formatted_phone_number ? (
                        <a
                          href={`tel:${details.formatted_phone_number}`}
                          className="flex items-center justify-center gap-2 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl font-semibold text-sm text-white transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      ) : (
                        <button className="flex items-center justify-center gap-2 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-600 cursor-default">
                          <Phone className="w-4 h-4" />
                          No phone
                        </button>
                      )}
                      <button
                        onClick={copyAddress}
                        className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm text-zinc-400 hover:text-white transition-all"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy address"}
                      </button>
                      <button className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm text-zinc-400 hover:text-white transition-all">
                        <Bookmark className="w-4 h-4" />
                        Save
                      </button>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-3.5 py-4 border-t border-b border-zinc-800/60">
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-zinc-400 leading-relaxed">{details.formatted_address}</p>
                      </div>

                      {/* Hours */}
                      {details.opening_hours && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => setShowHours(!showHours)}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className={details.opening_hours.open_now ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                                {details.opening_hours.open_now ? "Open now" : "Closed"}
                              </span>
                              {showHours
                                ? <ChevronUp className="w-3.5 h-3.5 text-zinc-600" />
                                : <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />}
                            </button>
                            {showHours && details.opening_hours.weekday_text && (
                              <div className="mt-2.5 space-y-1.5 bg-zinc-900 rounded-xl p-3 border border-zinc-800">
                                {details.opening_hours.weekday_text.map((day) => {
                                  const [name, ...rest] = day.split(": ");
                                  return (
                                    <div key={day} className="flex justify-between text-xs">
                                      <span className="text-zinc-500 font-medium w-24 shrink-0">{name}</span>
                                      <span className="text-zinc-400 text-right">{rest.join(": ")}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {details.formatted_phone_number && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-zinc-600 shrink-0" />
                          <a
                            href={`tel:${details.formatted_phone_number}`}
                            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                          >
                            {details.formatted_phone_number}
                          </a>
                        </div>
                      )}

                      {/* Website */}
                      {details.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-zinc-600 shrink-0" />
                          <a
                            href={details.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 truncate"
                          >
                            {details.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                          </a>
                        </div>
                      )}

                      {/* Google Maps */}
                      {details.url && (
                        <div className="flex items-center gap-3">
                          <ExternalLink className="w-4 h-4 text-zinc-600 shrink-0" />
                          <a
                            href={details.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      )}
                    </div>

                    {/* AI Summary */}
                    {reviewSummary && (
                      <div className="p-4 bg-blue-600/5 border border-blue-600/15 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-500" />
                          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">AI Summary</span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{reviewSummary}</p>
                      </div>
                    )}

                    {/* Editorial Summary */}
                    {details.editorial_summary?.overview && !reviewSummary && (
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-sm text-zinc-400 leading-relaxed italic">
                          "{details.editorial_summary.overview}"
                        </p>
                      </div>
                    )}

                    {/* Reviews */}
                    {details.reviews && details.reviews.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold text-white">Customer Reviews</h3>
                          <span className="text-[11px] text-zinc-600">{details.reviews.length} reviews</span>
                        </div>
                        <div>
                          {(showAllReviews ? details.reviews : details.reviews.slice(0, 3)).map((review, i) => (
                            <ReviewCard key={i} review={review} />
                          ))}
                        </div>
                        {details.reviews.length > 3 && (
                          <button
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            className="w-full mt-3 py-2.5 text-sm font-medium text-blue-500 hover:bg-blue-600/5 rounded-xl transition-colors border border-zinc-800 hover:border-blue-600/20"
                          >
                            {showAllReviews ? "Show fewer reviews" : `See all ${details.reviews.length} reviews`}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Share */}
                    <div className="flex gap-2 pt-2 border-t border-zinc-800/60">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm text-zinc-500 hover:text-white transition-all">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <a
                        href={getDirectionsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm text-zinc-500 hover:text-white transition-all"
                      >
                        <Navigation className="w-4 h-4" />
                        Navigate
                      </a>
                    </div>

                    {/* Bottom safe area */}
                    <div className="h-20 md:h-6" />
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
