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
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase border whitespace-nowrap transition-colors flex items-center gap-2 ${active
          ? "bg-white border-white text-black hover:bg-zinc-200"
          : "bg-[#050505] border-white/20 text-zinc-400 hover:border-white hover:text-white"
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
    <div className="bg-[#000] border-grid-b">
      {/* ── Quick Filter Row ── */}
      <div className="flex items-center gap-0 px-4 md:px-8 py-0 overflow-x-auto scrollbar-none border-grid-b bg-[#050505]">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`group flex items-center gap-3 px-6 py-4 text-[10px] font-black tracking-widest uppercase border-l border-r transition-colors shrink-0 ${expanded || activeCount > 0
              ? "bg-white border-white text-black"
              : "bg-[#050505] border-white/20 text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>PARAMETERS</span>
          {activeCount > 0 && (
            <span className="ml-2 w-5 h-5 flex items-center justify-center border border-black bg-black text-white text-[9px]">
              {activeCount}
            </span>
          )}
        </button>

        <div className="flex items-center p-2 gap-2">
          <Chip
            active={filters.placeType === "all"}
            onClick={() => update({ placeType: "all" })}
          >
            <CircleDot className="w-3 h-3" />
            ALL NODES
          </Chip>
          <Chip
            active={filters.placeType === "service"}
            onClick={() => update({ placeType: "service" })}
            color="cyan"
          >
            <Wrench className="w-3 h-3" />
            SERVICES
          </Chip>
          <Chip
            active={filters.placeType === "parts"}
            onClick={() => update({ placeType: "parts" })}
            color="orange"
          >
            <Package className="w-3 h-3" />
            HARDWARE
          </Chip>
        </div>

        {resultCount !== undefined && (
          <div className="ml-auto flex flex-col px-6 py-3 border-l border-white/20 items-end shrink-0 hidden sm:flex">
            <span className="text-[9px] font-black tracking-widest uppercase text-zinc-500">QUERY RESULT</span>
            <span className="text-sm font-black text-white leading-none">{resultCount} FOUND</span>
          </div>
        )}
      </div>

      {/* ── Expanded Parameters Panel ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#0a0a0a] border-grid-b border-t border-white"
          >
            <div className="px-4 md:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-800 pb-2 block">
                  SORT ALGORITHM
                </span>
                <div className="flex flex-col gap-2">
                  {(["relevance", "rating", "reviews"] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => update({ sortBy: opt })}
                      className={`text-left px-4 py-3 text-[10px] font-black tracking-widest uppercase border transition-colors ${filters.sortBy === opt
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-zinc-400 border-white/20 hover:border-white hover:text-white"
                        }`}
                    >
                      {opt === "relevance" ? "BEST MATCH" : opt === "rating" ? "OPTIMAL RATING" : "MOST REVIEWED"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-800 pb-2 block">
                  HARDWARE STATE
                </span>
                <button
                  onClick={() => update({ openNow: !filters.openNow })}
                  className={`flex items-center justify-between w-full px-4 py-3 text-[10px] font-black tracking-widest uppercase border transition-colors ${filters.openNow
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-zinc-400 border-white/20 hover:border-white hover:text-white"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 border border-black ${filters.openNow ? 'bg-emerald-400 animate-pulse' : 'bg-[#111]'}`} />
                    ONLINE NOW
                  </span>
                  {filters.openNow && <X className="w-3 h-3 text-black" />}
                </button>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-800 pb-2 block">
                  EVALUATION FLOOR
                </span>
                <div className="flex flex-col gap-2">
                  {([0, 4, 4.5] as const).map(rating => (
                    <button
                      key={rating}
                      onClick={() => update({ minRating: rating })}
                      className={`flex items-center justify-between px-4 py-3 text-[10px] font-black tracking-widest uppercase border transition-colors ${filters.minRating === rating
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-zinc-400 border-white/20 hover:border-white hover:text-white"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        {rating === 0 ? "ANY RATING" : `${rating}.0+ RATING`}
                        {rating > 0 && <Star className={`w-3 h-3 ${filters.minRating === rating ? 'text-black fill-current' : 'text-zinc-500'}`} />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Panel Footer */}
            <div className="px-4 md:px-8 py-4 bg-[#050505] border-t border-white/20 flex items-center justify-between">
              <span className="text-[9px] font-black tracking-widest uppercase text-zinc-500">{activeCount} OVERRIDES ACTIVE</span>
              <div className="flex items-center gap-4">
                {activeCount > 0 && (
                  <button onClick={reset} className="text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest">
                    PURGE SETTINGS
                  </button>
                )}
                <button
                  onClick={() => setExpanded(false)}
                  className="px-6 py-2 bg-white text-black text-[10px] font-black tracking-widest uppercase hover:bg-zinc-200 transition-colors"
                >
                  MINIMIZE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
