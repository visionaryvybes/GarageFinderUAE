"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Star, Clock, Phone, Globe, MapPin, Navigation,
  ExternalLink, Share2, ChevronDown, ChevronUp,
  Sparkles, User, BadgeCheck, Package,
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
            ? "fill-white text-white"
            : "fill-[#111] text-[#111]"
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
    <div className="py-6 border-b border-white/20 last:border-0 relative">
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/20" />
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 border border-white/20 bg-[#111] flex items-center justify-center shrink-0">
          {review.profile_photo_url ? (
            <img src={review.profile_photo_url} alt="" className="w-full h-full object-cover filter grayscale" />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <span className="text-xs font-black uppercase text-white tracking-widest truncate">{review.author_name}</span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest shrink-0">{review.relative_time_description}</span>
          </div>
          <div className="mb-4"><RatingStars rating={review.rating} /></div>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed break-words">
            {isLong && !expanded ? review.text.slice(0, 200) + "..." : review.text}
          </p>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="text-[10px] font-black text-white mt-4 border border-white px-3 py-1 hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
              {expanded ? "[ COMPRESS ]" : "[ EXPAND ]"}
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

  const isPartsStore = details?.types?.includes("store") || details?.name?.toLowerCase().includes("parts");

  return (
    <AnimatePresence>
      {placeId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000]/80 z-40 sm:hidden"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[#050505] border-l border-white z-50 flex flex-col overflow-hidden"
          >
            {/* ── Brutalist Header ── */}
            <div className="flex items-center justify-between border-grid-b bg-white text-black shrink-0">
              <div className="flex items-center gap-3 px-6 py-4">
                {isPartsStore ? (
                  <Package className="w-5 h-5 text-black" />
                ) : (
                  <BadgeCheck className="w-5 h-5 text-black" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isPartsStore ? "HARDWARE NODE" : "SERVICE CENTRE"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-16 h-full flex items-center justify-center border-l border-black hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Scrollable Body ── */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-12">
              {loading ? (
                <div className="p-8 space-y-6">
                  <div className="h-48 w-full bg-[#111] animate-pulse border border-white/20" />
                  <div className="h-8 w-3/4 bg-[#111] animate-pulse border border-white/20" />
                  <div className="h-4 w-1/2 bg-[#111] animate-pulse" />
                  <div className="space-y-3 pt-6 border-t border-white/20">
                    <div className="h-4 w-full bg-[#111] animate-pulse" />
                    <div className="h-4 w-2/3 bg-[#111] animate-pulse" />
                  </div>
                </div>
              ) : details ? (
                <>
                  {/* Photos Grid */}
                  {details.photos && details.photos.length > 0 && (
                    <div className="border-b border-white">
                      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-64 bg-[#111]">
                        {details.photos.slice(0, 8).map((photo, i) => (
                          <img
                            key={i}
                            src={`/api/photo?ref=${photo.photo_reference}&maxwidth=600`}
                            alt={`${details.name} ${i + 1}`}
                            className={`h-full shrink-0 snap-center object-cover cursor-pointer transition-all duration-500 filter ${i === 0 ? "w-full" : "w-72 border-l border-black"
                              } ${i === activePhotoIndex ? "grayscale-0" : "grayscale opacity-50 hover:opacity-100 hover:grayscale-0"}`}
                            onClick={() => setActivePhotoIndex(i)}
                            loading="lazy"
                          />
                        ))}
                      </div>
                      <div className="px-4 py-2 bg-black text-white text-[9px] font-black tracking-widest uppercase border-t border-white/20">
                        {details.photos.length} VISUAL RECORDS
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header Info */}
                    <div className="mb-8">
                      <h2 className="text-3xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-6">{details.name}</h2>

                      {details.rating && (
                        <div className="flex items-center gap-4 border border-white/20 p-3 w-fit">
                          <span className="text-2xl font-black text-white leading-none">{details.rating.toFixed(1)}</span>
                          <div className="flex flex-col gap-1 border-l border-white/20 pl-4">
                            <RatingStars rating={details.rating} size="lg" />
                            {details.user_ratings_total && (
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                {details.user_ratings_total} EVALUATIONS
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Grid */}
                    <div className="grid grid-cols-2 gap-0 border border-white mb-8 bg-[#000]">
                      <a
                        href={getDirectionsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-3 p-4 border-r border-white hover:bg-white hover:text-black transition-colors group"
                      >
                        <Navigation className="w-5 h-5 text-white group-hover:text-black" />
                        <span className="text-[10px] font-black tracking-widest uppercase">NAVIGATE</span>
                      </a>
                      <button className="flex flex-col items-center justify-center gap-3 p-4 hover:bg-white hover:text-black transition-colors group">
                        <Share2 className="w-5 h-5 text-white group-hover:text-black" />
                        <span className="text-[10px] font-black tracking-widest uppercase">TRANSMIT</span>
                      </button>
                    </div>

                    {/* Info Lines */}
                    <div className="space-y-0 border border-white/20 bg-[#0a0a0a] mb-8">
                      {/* Address */}
                      <div className="flex items-start gap-4 p-4 border-b border-white/20">
                        <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 leading-relaxed">{details.formatted_address}</p>
                      </div>

                      {/* Hours */}
                      {details.opening_hours && (
                        <div className="flex items-start gap-4 p-4 border-b border-white/20">
                          <Clock className="w-4 h-4 text-white shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => setShowHours(!showHours)}
                              className="flex items-center justify-between w-full"
                            >
                              <span className={`text-[10px] font-black tracking-widest uppercase ${details.opening_hours.open_now ? "text-white" : "text-zinc-600"}`}>
                                {details.opening_hours.open_now ? "STATUS: ONLINE" : "STATUS: OFFLINE"}
                              </span>
                              {showHours
                                ? <ChevronUp className="w-4 h-4 text-white" />
                                : <ChevronDown className="w-4 h-4 text-white" />}
                            </button>
                            {showHours && details.opening_hours.weekday_text && (
                              <div className="mt-4 space-y-2 border-t border-white/20 pt-4">
                                {details.opening_hours.weekday_text.map((day) => {
                                  const [name, ...rest] = day.split(": ");
                                  return (
                                    <div key={day} className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                      <span className="text-zinc-600 w-24 shrink-0">{name}</span>
                                      <span className="text-zinc-300 text-right">{rest.join(": ")}</span>
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
                        <div className="flex items-center gap-4 p-4 border-b border-white/20">
                          <Phone className="w-4 h-4 text-white shrink-0" />
                          <a href={`tel:${details.formatted_phone_number}`} className="text-[11px] font-black tracking-widest uppercase text-white hover:text-zinc-400">
                            {details.formatted_phone_number}
                          </a>
                        </div>
                      )}

                      {/* Web */}
                      {details.website && (
                        <div className="flex items-center gap-4 p-4">
                          <Globe className="w-4 h-4 text-white shrink-0" />
                          <a href={details.website} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black tracking-widest uppercase text-white hover:text-zinc-400 truncate">
                            {details.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* AI Insight Module */}
                    {reviewSummary && (
                      <div className="p-6 border border-white bg-[#000] mb-8 relative">
                        <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-white/20" />
                        <div className="flex items-center gap-3 mb-4 inline-flex bg-white text-black px-3 py-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">AI SUMMARY MODULE</span>
                        </div>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">{reviewSummary}</p>
                      </div>
                    )}

                    {/* Reviews list */}
                    {details.reviews && details.reviews.length > 0 && (
                      <div className="border border-white/20 p-6 bg-[#000]">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">FIELD REPORTS</h3>
                          <span className="text-[10px] font-black text-zinc-500 bg-white/5 px-2 py-1 border border-white/10 uppercase tracking-widest">
                            {details.reviews.length} ENTRIES
                          </span>
                        </div>
                        <div>
                          {(showAllReviews ? details.reviews : details.reviews.slice(0, 3)).map((review, i) => (
                            <ReviewCard key={i} review={review} />
                          ))}
                        </div>
                        {details.reviews.length > 3 && (
                          <button
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            className="w-full mt-6 py-4 border border-white bg-transparent text-white text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
                          >
                            {showAllReviews ? "COLLAPSE REPORTS" : `LOAD ALL ${details.reviews.length} REPORTS`}
                          </button>
                        )}
                      </div>
                    )}
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
