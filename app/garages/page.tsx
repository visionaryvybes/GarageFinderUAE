"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Wrench, Star, MapPin, Clock, ChevronRight,
  Search, SlidersHorizontal, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { applyFilters, type ExtendedPlaceResult } from "@/lib/mock-data";

const EMIRATE_FILTERS = [
  { label: "All UAE", query: "auto repair service centre UAE" },
  { label: "Dubai", query: "car repair garage Dubai" },
  { label: "Abu Dhabi", query: "car service centre Abu Dhabi" },
  { label: "Sharjah", query: "auto repair workshop Sharjah" },
  { label: "Ajman", query: "car garage Ajman" },
  { label: "RAK", query: "auto repair Ras Al Khaimah" },
  { label: "Fujairah", query: "car service Fujairah" },
  { label: "UAQ", query: "auto repair Umm Al Quwain" },
];

const REGION_CENTERS: Record<string, { lat: number; lng: number }> = {
  "All UAE": { lat: 24.4539, lng: 54.3773 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
  "Abu Dhabi": { lat: 24.4539, lng: 54.3773 },
  "Sharjah": { lat: 25.3463, lng: 55.4209 },
  "Ajman": { lat: 25.4052, lng: 55.5136 },
  "RAK": { lat: 25.7895, lng: 55.9432 },
  "Fujairah": { lat: 25.1288, lng: 56.3264 },
  "UAQ": { lat: 25.5647, lng: 55.5554 },
};

function GarageCard({ shop }: { shop: ExtendedPlaceResult }) {
  const isOpen = shop.opening_hours?.open_now;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glow-card flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-blue-600/20 transition-colors group cursor-pointer"
    >
      <div className="w-14 h-14 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center shrink-0">
        <Wrench className="w-6 h-6 text-zinc-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors leading-tight">
            {shop.name}
          </h3>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
            isOpen
              ? "bg-emerald-900/40 border-emerald-600/25 text-emerald-400"
              : "bg-zinc-900/60 border-zinc-700/25 text-zinc-600"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
            {isOpen ? "Open" : "Closed"}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-1 mb-2">
          <MapPin className="w-3 h-3 text-zinc-700 shrink-0" />
          <p className="text-xs text-zinc-600 truncate">{shop.vicinity || shop.formatted_address}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {shop.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-zinc-300">{shop.rating}</span>
              {shop.user_ratings_total && (
                <span className="text-[11px] text-zinc-600">({shop.user_ratings_total.toLocaleString()})</span>
              )}
            </div>
          )}
          {shop.price_level !== undefined && (
            <span className="text-xs text-zinc-600">{"$".repeat(Math.max(1, shop.price_level || 1))}</span>
          )}
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#111] border border-[#1e1e1e] text-zinc-600">
            Service Centre
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-blue-500 transition-colors" />
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a]">
      <div className="skeleton w-14 h-14 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-4 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function GaragesContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialQ);
  const [emirate, setEmirate] = useState("All UAE");
  const [openOnly, setOpenOnly] = useState(false);
  const [minRating, setMinRating] = useState<0 | 4 | 4.5>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [allShops, setAllShops] = useState<ExtendedPlaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGarages = useCallback(async (emirateLabel: string) => {
    setLoading(true);
    setError(false);
    try {
      const emFilter = EMIRATE_FILTERS.find(e => e.label === emirateLabel) || EMIRATE_FILTERS[0];
      const center = REGION_CENTERS[emirateLabel] || REGION_CENTERS["All UAE"];
      const params = new URLSearchParams({
        query: emFilter.query,
        lat: String(center.lat),
        lng: String(center.lng),
      });
      const res = await fetch(`/api/places?${params}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      // Service centres only (filter out parts stores returned by API)
      const services = (data.results || []).filter((r: ExtendedPlaceResult) =>
        r.placeType !== "parts"
      );
      setAllShops(services);
    } catch {
      setError(true);
      setAllShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGarages(emirate);
  }, [emirate, fetchGarages]);

  const garages = applyFilters(allShops, {
    openNow: openOnly,
    minRating,
    sortBy: "rating",
  }).filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.vicinity || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.formatted_address || "").toLowerCase().includes(search.toLowerCase())
  );

  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] bg-[#050505]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-2 text-xs text-zinc-600">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Garages</span>
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white">
                UAE <span className="text-blue-400">Garages</span>
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {loading ? "Loading..." : `${garages.length} service centres`}
                {!loading && !error && " · live data"}
              </p>
            </div>
          </div>

          {/* Search + filter row */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search garage name or area..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-600/40 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                showFilters || openOnly || minRating > 0
                  ? "bg-blue-600/15 border-blue-600/30 text-blue-400"
                  : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Emirate pills */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-1">
            {EMIRATE_FILTERS.map(em => (
              <button
                key={em.label}
                onClick={() => setEmirate(em.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all shrink-0 ${
                  emirate === em.label
                    ? "bg-blue-600/15 border-blue-600/30 text-blue-400"
                    : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-500 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {em.label}
              </button>
            ))}
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <div className="mt-3 p-4 rounded-xl bg-[#080808] border border-[#1a1a1a] space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOpenOnly(!openOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    openOnly
                      ? "bg-emerald-600/15 border-emerald-600/30 text-emerald-400"
                      : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-500 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  Open Now
                </button>
                {([0, 4, 4.5] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      minRating === r
                        ? "bg-blue-600/15 border-blue-600/30 text-blue-400"
                        : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-500 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {r === 0 ? "Any Rating" : <><Star className="w-3 h-3 fill-current" />{r}+</>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No API key warning */}
      {!hasApiKey && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-950/40 border border-amber-800/30">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-300/80">
              Add <code className="text-amber-400 font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to <code className="text-amber-400 font-mono">.env.local</code> to see live results.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-3">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="text-center py-16">
            <Wrench className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-400 mb-3">Failed to load garages</p>
            <button
              onClick={() => fetchGarages(emirate)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-500 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : garages.length === 0 ? (
          <div className="text-center py-16">
            <Wrench className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-400 mb-2">No garages match your filters</p>
            <button
              onClick={() => { setSearch(""); setOpenOnly(false); setMinRating(0); }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          garages.map(shop => <GarageCard key={shop.place_id} shop={shop} />)
        )}
      </div>
    </div>
  );
}

export default function GaragesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GaragesContent />
    </Suspense>
  );
}
