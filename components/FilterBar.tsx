"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Star, CircleDot, Wrench, Package, X } from "lucide-react";

export interface ActiveFilters {
  sortBy: "relevance" | "rating" | "reviews";
  openNow: boolean;
  minRating: 0 | 4 | 4.5;
  maxPrice: 0 | 1 | 2 | 3 | 4;
  placeType: "all" | "service" | "parts";
}

export const DEFAULT_FILTERS: ActiveFilters = {
  sortBy: "relevance",
  openNow: false,
  minRating: 0,
  maxPrice: 0,
  placeType: "all",
};

interface FilterBarProps {
  filters: ActiveFilters;
  onChange: (f: ActiveFilters) => void;
  resultCount?: number;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
        active
          ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
          : "bg-zinc-900/60 border border-white/[0.07] text-zinc-500 hover:text-white hover:border-white/20"
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (patch: Partial<ActiveFilters>) => onChange({ ...filters, ...patch });

  const activeCount = [
    filters.sortBy !== "relevance",
    filters.openNow,
    filters.minRating > 0,
    filters.maxPrice > 0,
    filters.placeType !== "all",
  ].filter(Boolean).length;

  const reset = () => onChange(DEFAULT_FILTERS);

  return (
    <div className="bg-[#09090b] border-b border-white/[0.06]">
      {/* Quick filter row */}
      <div className="flex items-center gap-2 px-4 md:px-6 py-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all shrink-0 ${
            expanded || activeCount > 0
              ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
              : "bg-zinc-900/60 border-white/[0.07] text-zinc-500 hover:text-white hover:border-white/20"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-black">
              {activeCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <Chip active={filters.placeType === "all"} onClick={() => update({ placeType: "all" })}>
            <CircleDot className="w-3 h-3" />
            All
          </Chip>
          <Chip active={filters.placeType === "service"} onClick={() => update({ placeType: "service" })}>
            <Wrench className="w-3 h-3" />
            Garages
          </Chip>
          <Chip active={filters.placeType === "parts"} onClick={() => update({ placeType: "parts" })}>
            <Package className="w-3 h-3" />
            Parts
          </Chip>
        </div>

        {resultCount !== undefined && (
          <div className="ml-auto shrink-0 hidden sm:block">
            <span className="text-xs font-semibold text-zinc-500">{resultCount} results</span>
          </div>
        )}
      </div>

      {/* Expanded filter panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <div className="px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#111113]">

              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-400 block">Sort by</span>
                <div className="flex flex-col gap-2">
                  {(["relevance", "rating", "reviews"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => update({ sortBy: opt })}
                      className={`text-left px-4 py-2.5 text-sm rounded-xl border transition-all ${
                        filters.sortBy === opt
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/25"
                          : "text-zinc-400 border-white/[0.07] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {opt === "relevance" ? "Best Match" : opt === "rating" ? "Top Rated" : "Most Reviewed"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-400 block">Availability</span>
                <button
                  onClick={() => update({ openNow: !filters.openNow })}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-sm rounded-xl border transition-all ${
                    filters.openNow
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : "text-zinc-400 border-white/[0.07] hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${filters.openNow ? "bg-emerald-400 animate-pulse" : "bg-zinc-700"}`} />
                    Open now
                  </span>
                  {filters.openNow && <X className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-400 block">Min rating</span>
                <div className="flex flex-col gap-2">
                  {([0, 4, 4.5] as const).map((rating) => (
                    <button
                      key={rating}
                      onClick={() => update({ minRating: rating })}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border transition-all ${
                        filters.minRating === rating
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/25"
                          : "text-zinc-400 border-white/[0.07] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {rating === 0 ? (
                        "Any rating"
                      ) : (
                        <>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {rating}+ stars
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 md:px-6 py-3 bg-[#09090b] border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-zinc-600">{activeCount} filter{activeCount !== 1 ? "s" : ""} active</span>
              <div className="flex items-center gap-3">
                {activeCount > 0 && (
                  <button onClick={reset} className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setExpanded(false)}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
