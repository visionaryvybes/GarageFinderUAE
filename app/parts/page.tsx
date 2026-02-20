"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Package, Star, MapPin, ChevronRight,
  Search, SlidersHorizontal, AlertCircle, RefreshCw, Zap, Clock,
} from "lucide-react";
import Link from "next/link";
import { type ExtendedPlaceResult } from "@/lib/mock-data";

const PARTS_CATEGORIES = [
  { label: "All Parts", query: "auto spare parts UAE" },
  { label: "Engine Parts", query: "engine parts auto UAE" },
  { label: "Brakes", query: "brake parts auto shop UAE" },
  { label: "Suspension", query: "suspension parts car UAE" },
  { label: "Electrical", query: "car electrical parts auto UAE" },
  { label: "Body Parts", query: "car body parts panel UAE" },
  { label: "Tyres & Wheels", query: "tyres wheels car UAE" },
  { label: "Used / OEM", query: "used second hand car parts OEM UAE" },
  { label: "Performance", query: "car performance parts tuning UAE" },
];

const EMIRATE_FILTERS = [
  { label: "All UAE", query: "auto spare parts UAE", lat: 25.2048, lng: 55.2708 },
  { label: "Dubai", query: "spare parts auto Dubai", lat: 25.2048, lng: 55.2708 },
  { label: "Al Aweer", query: "used car parts Al Aweer Dubai", lat: 25.1833, lng: 55.4167 },
  { label: "Abu Dhabi", query: "spare parts auto Abu Dhabi", lat: 24.4539, lng: 54.3773 },
  { label: "Mussafah", query: "auto parts Mussafah Abu Dhabi", lat: 24.3595, lng: 54.4921 },
  { label: "Sharjah", query: "spare parts auto Sharjah", lat: 25.3463, lng: 55.4209 },
  { label: "Ajman", query: "car parts Ajman", lat: 25.4052, lng: 55.5136 },
];

function PartsCard({ shop }: { shop: ExtendedPlaceResult }) {
  const isOpen = shop.opening_hours?.open_now;
  const isUsed = shop.name.toLowerCase().includes("used") ||
    shop.name.toLowerCase().includes("second") ||
    (shop.vicinity || shop.formatted_address || "").toLowerCase().includes("al aweer");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glow-card flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-orange-600/20 transition-colors group cursor-pointer"
    >
      <div className="w-14 h-14 rounded-xl bg-orange-600/8 border border-orange-600/15 flex items-center justify-center shrink-0">
        <Package className="w-6 h-6 text-orange-400" />
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
          {isUsed && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-600/10 border border-amber-600/20 text-amber-400 font-semibold">
              Used & OEM
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-orange-400 transition-colors" />
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

export default function PartsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Parts");
  const [emirate, setEmirate] = useState("All UAE");
  const [openOnly, setOpenOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [allShops, setAllShops] = useState<ExtendedPlaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchParts = useCallback(async (cat: string, em: string) => {
    setLoading(true);
    setError(false);
    try {
      const catFilter = PARTS_CATEGORIES.find(c => c.label === cat) || PARTS_CATEGORIES[0];
      const emFilter = EMIRATE_FILTERS.find(e => e.label === em) || EMIRATE_FILTERS[0];

      // Combine category + emirate into one smart query
      let query = catFilter.query;
      if (em !== "All UAE") {
        query = `${catFilter.label === "All Parts" ? "spare parts" : catFilter.label} ${em}`;
      }

      const params = new URLSearchParams({
        query,
        lat: String(emFilter.lat),
        lng: String(emFilter.lng),
      });
      const res = await fetch(`/api/places?${params}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setAllShops(data.results || []);
    } catch {
      setError(true);
      setAllShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParts(category, emirate);
  }, [category, emirate, fetchParts]);

  const filtered = allShops.filter(s =>
    (!search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.vicinity || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.formatted_address || "").toLowerCase().includes(search.toLowerCase())) &&
    (!openOnly || s.opening_hours?.open_now)
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
            <span className="text-zinc-400">Spare Parts</span>
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white">
                Spare <span className="text-orange-400">Parts</span>
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {loading ? "Loading..." : `${filtered.length} stores`}
                {!loading && " · New, used & OEM parts across UAE"}
                {!loading && !error && " · live data"}
              </p>
            </div>
          </div>

          {/* Info strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
            {[
              { icon: Package, label: "New Parts", desc: "OEM & aftermarket" },
              { icon: RefreshCw, label: "Used Parts", desc: "Al Aweer & Sharjah souqs" },
              { icon: Zap, label: "Performance", desc: "Tuning & upgrades" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                <item.icon className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-300">{item.label}</p>
                  <p className="text-[11px] text-zinc-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search + filters */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search parts store or area..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-white placeholder:text-zinc-600 outline-none focus:border-orange-600/40 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                showFilters || openOnly
                  ? "bg-orange-600/15 border-orange-600/30 text-orange-400"
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
                    ? "bg-orange-600/15 border-orange-600/30 text-orange-400"
                    : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-500 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {em.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="mt-3 p-4 rounded-xl bg-[#080808] border border-[#1a1a1a]">
              <button
                onClick={() => setOpenOnly(!openOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  openOnly
                    ? "bg-emerald-600/15 border-emerald-600/30 text-emerald-400"
                    : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-500 hover:border-zinc-700 hover:text-white"
                }`}
              >
                <Clock className="w-3 h-3" />
                Open Now Only
              </button>
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
        {/* Parts categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {PARTS_CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => setCategory(cat.label)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all shrink-0 ${
                category === cat.label
                  ? "bg-orange-600/15 border-orange-600/30 text-orange-400"
                  : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-500 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-400 mb-3">Failed to load parts stores</p>
            <button
              onClick={() => fetchParts(category, emirate)}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-500 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-400 mb-2">No parts stores found</p>
            <button
              onClick={() => { setSearch(""); setOpenOnly(false); setCategory("All Parts"); setEmirate("All UAE"); }}
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map(shop => <PartsCard key={shop.place_id} shop={shop} />)
        )}
      </div>
    </div>
  );
}
