"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, Package, ImageOff, ArrowRight } from "lucide-react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="h-full border-grid bg-[#050505] hover:bg-white group transition-colors duration-300 flex flex-col cursor-pointer"
      onClick={() => onSelect(place)}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-grid-b bg-[#0a0a0a] group-hover:bg-[#f4f4f5] transition-colors">
        <div className="flex items-center gap-3">
          {rank && rank <= 3 && (
            <span className="text-[10px] font-black w-6 h-6 bg-white text-black group-hover:bg-black group-hover:text-white flex items-center justify-center border border-black">
              0{rank}
            </span>
          )}
          {tierLabel ? (
            <span className="text-[10px] font-black tracking-widest uppercase text-white group-hover:text-black">
              {tierLabel}
            </span>
          ) : (
            <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500 group-hover:text-zinc-600">
              {isPartsStore ? "HARDWARE" : "SERVICE"} NODE
            </span>
          )}
        </div>

        {/* Open Status Indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 border border-black ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-[#111]'}`} />
          <span className="text-[9px] font-black tracking-widest uppercase text-zinc-500 group-hover:text-zinc-600">
            {isOpen ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Image Block */}
      <div className="relative w-full h-48 bg-[#111] border-grid-b overflow-hidden shrink-0 filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500">
        {hasPhoto ? (
          <Image
            src={getPhotoUrl(photoRef!)}
            alt={place.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center border border-white/5">
            {isPartsStore ? (
              <Package className="w-12 h-12 text-zinc-800" />
            ) : (
              <ImageOff className="w-12 h-12 text-zinc-800" />
            )}
          </div>
        )}

        {/* Floating Rating UI */}
        {place.rating && (
          <div className="absolute bottom-0 right-0 bg-[#050505] border-t border-l border-white/20 px-3 py-2 flex items-center gap-2 group-hover:bg-white group-hover:border-black transition-colors">
            <Star className="w-3 h-3 text-white group-hover:text-black fill-current" />
            <span className="text-xs font-black text-white group-hover:text-black">{place.rating}</span>
            {place.user_ratings_total && (
              <span className="text-[9px] font-bold text-zinc-500">
                ({place.user_ratings_total})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Data Section */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-black tracking-tighter uppercase text-white group-hover:text-black mb-2 line-clamp-1 leading-none">
          {place.name}
        </h3>

        <div className="flex items-start gap-2 text-[10px] font-bold tracking-widest uppercase text-zinc-500 group-hover:text-zinc-600 mb-6">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="line-clamp-2 leading-relaxed">{place.formatted_address}</span>
        </div>

        {meta?.badge && (
          <div className="mt-auto mb-6 inline-flex border border-zinc-800 group-hover:border-zinc-300 px-3 py-1">
            <span className="text-[9px] font-black tracking-widest uppercase text-zinc-400 group-hover:text-zinc-500">
              {meta.badge}
            </span>
          </div>
        )}

        {/* Execute Button */}
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/10 group-hover:border-black/10">
          <span className="text-[10px] font-black tracking-widest uppercase text-white group-hover:text-black flex items-center gap-2">
            ACCESS PROFILER
          </span>
          <div className="w-8 h-8 border border-white/20 group-hover:border-black flex items-center justify-center bg-transparent group-hover:bg-black group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
