"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, Star, CircleDot,
  Wrench, Package, ChevronDown, X, MessageSquare, MapPin,
} from "lucide-react";

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
  color = "violet",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: "violet" | "cyan" | "orange";
}) {
  const activeStyles: Record<string, string> = {
    violet: "bg-blue-600/15 border-blue-500/40 text-blue-300",
    cyan: "bg-cyan-600/15 border-cyan-500/40 text-cyan-300",
    orange: "bg-orange-600/15 border-orange-500/40 text-orange-300",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all ${
        active
          ? activeStyles[color]
          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
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
    <div className="bg-zinc-950 border-b border-zinc-800/60">
      {/* Quick filter row */}
      <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none">
        {/* Filter toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 transition-all ${
            expanded || activeCount > 0
              ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 bg-gradient-to-br from-blue-600 to-blue-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm shadow-blue-900/40">
              {activeCount}
            </span>
          )}
        </button>

        <div className="w-px h-5 bg-zinc-800 shrink-0" />

        {/* Type quick chips */}
        <Chip active={filters.placeType === "all"} onClick={() => update({ placeType: "all" })}>
          <span className="flex items-center gap-1"><CircleDot className="w-3 h-3" /> All</span>
        </Chip>
        <Chip
          active={filters.placeType === "service"}
          onClick={() => update({ placeType: "service" })}
          color="violet"
        >
          <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> Service</span>
        </Chip>
        <Chip
          active={filters.placeType === "parts"}
          onClick={() => update({ placeType: "parts" })}
          color="orange"
        >
          <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Parts</span>
        </Chip>

        <div className="w-px h-5 bg-zinc-800 shrink-0" />

        {/* Open now */}
        <Chip active={filters.openNow} onClick={() => update({ openNow: !filters.openNow })} color="cyan">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${filters.openNow ? "bg-cyan-400 animate-pulse" : "bg-zinc-600"}`} />
            Open Now
          </span>
        </Chip>

        {/* Rating */}
        <Chip active={filters.minRating === 4} onClick={() => update({ minRating: filters.minRating === 4 ? 0 : 4 })}>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> 4+</span>
        </Chip>
        <Chip active={filters.minRating === 4.5} onClick={() => update({ minRating: filters.minRating === 4.5 ? 0 : 4.5 })}>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> 4.5+</span>
        </Chip>

        {/* Sort */}
        <div className="relative shrink-0 ml-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filters.sortBy !== "relevance"
                ? "border-blue-500/40 bg-blue-600/15 text-blue-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            Sort
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-zinc-800/60"
          >
            <div className="p-4 space-y-5">
              {/* Sort by */}
              <div>
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2.5">Sort by</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "relevance" as const, label: "Relevance", icon: <MapPin className="w-3 h-3" /> },
                    { id: "rating" as const, label: "Top Rated", icon: <Star className="w-3 h-3" /> },
                    { id: "reviews" as const, label: "Most Reviews", icon: <MessageSquare className="w-3 h-3" /> },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => update({ sortBy: opt.id })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        filters.sortBy === opt.id
                          ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min rating */}
              <div>
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2.5">Minimum Rating</p>
                <div className="flex flex-wrap gap-2">
                  {([0, 4, 4.5] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => update({ minRating: r })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        filters.minRating === r
                          ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      {r === 0 ? (
                        "Any"
                      ) : (
                        <>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {r}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price level */}
              <div>
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2.5">Price Level</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 0 as const, label: "Any" },
                    { val: 1 as const, label: "AED Budget" },
                    { val: 2 as const, label: "AED Mid-range" },
                    { val: 3 as const, label: "AED Premium" },
                    { val: 4 as const, label: "AED Luxury" },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => update({ maxPrice: opt.val })}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        filters.maxPrice === opt.val
                          ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                {resultCount !== undefined && (
                  <span className="text-xs text-zinc-600">
                    {resultCount} result{resultCount !== 1 ? "s" : ""}
                  </span>
                )}
                <div className="flex gap-2 ml-auto">
                  {activeCount > 0 && (
                    <button
                      onClick={reset}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-600/30 transition-all"
                    >
                      <X className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setExpanded(false)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all shadow-lg shadow-blue-900/20"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
