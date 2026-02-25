"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, Package, ArrowRight, Clock, Wrench } from "lucide-react";
import type { PlaceResult } from "@/types";
import type { ExtendedPlaceResult } from "@/lib/mock-data";
import { SHOP_META } from "@/lib/mock-data";

interface ShopCardProps {
  place: ExtendedPlaceResult | PlaceResult;
  onSelect: (place: PlaceResult) => void;
  tierLabel?: string | null;
  rank?: number;
  index?: number;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden cursor-pointer hover:border-orange-500/25 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 group"
      onClick={() => onSelect(place)}
    >
      {/* Image */}
      <div className="relative w-full h-44 bg-zinc-900 overflow-hidden">
        {hasPhoto ? (
          <Image
            src={getPhotoUrl(photoRef!)}
            alt={place.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-900">
            {isPartsStore ? (
              <Package className="w-10 h-10 text-zinc-700" />
            ) : (
              <Wrench className="w-10 h-10 text-zinc-700" />
            )}
            <span className="text-xs text-zinc-700 font-medium">No photo</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {rank && rank <= 3 && (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-[11px] font-black shadow-lg shadow-orange-500/30">
                {rank}
              </span>
            )}
            {tierLabel && (
              <span className="badge-orange text-[10px]">{tierLabel}</span>
            )}
          </div>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-lg backdrop-blur-sm ${
            isOpen
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-zinc-900/80 text-zinc-500 border border-white/10"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Rating chip */}
        {place.rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-white">{place.rating}</span>
            {place.user_ratings_total && (
              <span className="text-[10px] text-zinc-400">({place.user_ratings_total})</span>
            )}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
            isPartsStore
              ? "bg-orange-500/20 text-orange-300 border border-orange-500/20"
              : "bg-blue-500/20 text-blue-300 border border-blue-500/20"
          }`}>
            {isPartsStore ? "Parts" : "Service"}
          </span>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4">
        <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-orange-300 transition-colors">
          {place.name}
        </h3>

        <div className="flex items-start gap-1.5 text-xs text-zinc-500 mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{place.formatted_address}</span>
        </div>

        {meta?.badge && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
              {meta.badge}
            </span>
          </div>
        )}

        {/* CTA row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{isOpen ? "Open now" : "Closed"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold group-hover:gap-2.5 transition-all">
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
