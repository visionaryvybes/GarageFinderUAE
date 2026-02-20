"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, Clock, BadgeCheck, ImageOff, Package, Sparkles, ChevronRight } from "lucide-react";
import type { PlaceResult } from "@/types";
import type { ExtendedPlaceResult } from "@/lib/mock-data";
import { SHOP_META } from "@/lib/mock-data";
import TiltCard from "./TiltCard";

interface ShopCardProps {
  place: ExtendedPlaceResult | PlaceResult;
  onSelect: (place: PlaceResult) => void;
  tierLabel?: string | null;
  rank?: number;
  index?: number;
}

function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, string> = {
    1: "rank-badge-gold text-black",
    2: "rank-badge-silver text-black",
    3: "rank-badge-bronze text-white",
  };
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
      className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center z-10 text-[12px] font-black shadow-xl ${styles[rank]}`}
    >
      {rank}
    </motion.div>
  );
}

function getPhotoUrl(photoRef: string): string {
  return `/api/photo?ref=${encodeURIComponent(photoRef)}&maxwidth=480`;
}

export default function ShopCard({ place, onSelect, tierLabel, rank, index = 0 }: ShopCardProps) {
  const [imgError, setImgError] = useState(false);
  const photoRef = place.photos?.[0]?.photo_reference;
  const hasPhoto = !!photoRef && !imgError;
  const isOpen = place.opening_hours?.open_now;
  const meta = SHOP_META[place.place_id];
  const isPartsStore =
    (place as ExtendedPlaceResult).placeType === "parts" ||
    place.types?.includes("store");

  const glowColor = isPartsStore ? "orange" : "violet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.04 }}
      className="h-full"
    >
      <TiltCard
        glowColor={glowColor}
        intensity={5}
        className="h-full"
      >
        <div
          onClick={() => onSelect(place)}
          className={`group relative flex flex-col h-full rounded-2xl bg-zinc-900 border cursor-pointer overflow-hidden transition-colors duration-300 ${
            isPartsStore
              ? "border-zinc-800 hover:border-orange-500/20"
              : "border-zinc-800 hover:border-blue-500/20"
          }`}
        >
          {/* Left accent strip for tier */}
          {tierLabel === "Specialist" && (
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-transparent z-10" />
          )}

          {/* ── Photo area ── */}
          <div className="relative w-full h-48 bg-zinc-900 overflow-hidden shrink-0">
            {hasPhoto ? (
              <Image
                src={getPhotoUrl(photoRef!)}
                alt={place.name}
                fill
                className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${
                isPartsStore ? "from-orange-950/20 to-zinc-900" : "from-violet-950/20 to-zinc-900"
              }`}>
                {isPartsStore
                  ? <Package className="w-10 h-10 text-orange-900/60" />
                  : <ImageOff className="w-8 h-8 text-zinc-800" />}
              </div>
            )}

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

            {/* Rank badge */}
            {rank && rank <= 3 && <RankBadge rank={rank} />}

            {/* Meta badge */}
            {meta?.badge && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-zinc-300">
                {meta.badge}
              </div>
            )}

            {/* Open/Closed */}
            <div
              className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm border text-[10px] font-bold ${
                isOpen
                  ? "bg-zinc-900/80 border-cyan-500/30 text-cyan-300"
                  : "bg-zinc-900/70 border-zinc-700/40 text-zinc-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-cyan-400 animate-pulse" : "bg-zinc-600"}`}
              />
              {isOpen ? "Open" : "Closed"}
            </div>

            {/* Rating chip */}
            {place.rating && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-black text-white">{place.rating}</span>
                {place.user_ratings_total && (
                  <span className="text-[10px] text-zinc-500">
                    ({place.user_ratings_total >= 1000
                      ? `${(place.user_ratings_total / 1000).toFixed(1)}k`
                      : place.user_ratings_total})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── Content ── */}
          <div className="flex flex-col flex-1 p-4 pb-3">
            {/* Name */}
            <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors line-clamp-1 leading-snug tracking-tight mb-1">
              {place.name}
            </h3>

            {/* Address */}
            <div className="flex items-start gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 text-zinc-700 mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-600 line-clamp-1 leading-relaxed">
                {place.vicinity || place.formatted_address}
              </p>
            </div>

            {/* Specialties */}
            {meta?.specialties && (
              <div className="flex flex-wrap gap-1 mb-3">
                {meta.specialties.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/60 text-zinc-500 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {tierLabel && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    tierLabel === "Specialist"
                      ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-300 border-blue-500/30"
                      : tierLabel === "Certified"
                      ? "bg-blue-600/8 text-blue-400 border-blue-600/15"
                      : "bg-zinc-800 text-zinc-500 border-zinc-700"
                  }`}
                >
                  {tierLabel === "Specialist" && <Sparkles className="w-2.5 h-2.5" />}
                  {tierLabel}
                </span>
              )}

              {isPartsStore && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-orange-600/10 text-orange-400 border-orange-500/25">
                  <Package className="w-2.5 h-2.5" />
                  Parts Store
                </span>
              )}

              {meta?.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-600/8 text-emerald-400 border-emerald-600/20">
                  <BadgeCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-4 pb-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-zinc-600">
              {meta?.waitTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {meta.waitTime}
                </span>
              )}
              {place.price_level !== undefined && (
                <span className="text-zinc-600">
                  {"AED " + ["Budget", "Mid", "Premium", "Luxury"][Math.min(Math.max(0, (place.price_level || 1) - 1), 3)]}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-blue-600/15 group-hover:border-blue-500/30 transition-all duration-200`}>
                <Phone className="w-3 h-3 text-zinc-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isPartsStore
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 group-hover:from-orange-500 group-hover:to-orange-400 text-white shadow-lg shadow-orange-900/20"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 group-hover:from-blue-500 group-hover:to-blue-400 text-white shadow-lg shadow-blue-900/20"
              }`}>
                <span className="hidden sm:inline">Book</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
