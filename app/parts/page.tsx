"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Star, MapPin, ChevronRight,
  Search, Clock, Activity, Filter, RefreshCw, Zap,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { type ExtendedPlaceResult } from "@/lib/mock-data";

const PARTS_CATEGORIES = [
  { label: "All Parts", query: "auto spare parts UAE", color: "#3b82f6" },
  { label: "Engine", query: "engine parts auto UAE", color: "#ef4444" },
  { label: "Brakes", query: "brake parts auto shop UAE", color: "#f59e0b" },
  { label: "Suspension", query: "suspension parts car UAE", color: "#10b981" },
  { label: "Electrical", query: "car electrical parts auto UAE", color: "#8b5cf6" },
  { label: "Body Parts", query: "car body parts panel UAE", color: "#06b6d4" },
  { label: "Tyres & Wheels", query: "tyres wheels car UAE", color: "#ec4899" },
  { label: "Used / OEM", query: "used second hand car parts OEM UAE", color: "#a78bfa" },
  { label: "Performance", query: "car performance parts tuning UAE", color: "#f97316" },
];

const EMIRATE_CONFIG = [
  { label: "All UAE", lat: 25.2048, lng: 55.2708, radius: 50000 },
  { label: "Dubai", lat: 25.2048, lng: 55.2708, radius: 35000 },
  { label: "Al Aweer", lat: 25.1833, lng: 55.4167, radius: 15000 },
  { label: "Abu Dhabi", lat: 24.4539, lng: 54.3773, radius: 45000 },
  { label: "Mussafah", lat: 24.3595, lng: 54.4921, radius: 15000 },
  { label: "Sharjah", lat: 25.3463, lng: 55.4209, radius: 25000 },
  { label: "Ajman", lat: 25.4052, lng: 55.5136, radius: 20000 },
];

function PartsCard({ shop, rank }: { shop: ExtendedPlaceResult; rank?: number }) {
  const isOpen = shop.opening_hours?.open_now;
  const isUsed = shop.name.toLowerCase().includes("used") ||
    shop.name.toLowerCase().includes("second") ||
    (shop.vicinity || shop.formatted_address || "").toLowerCase().includes("al aweer");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-600/20 transition-colors group cursor-pointer"
    >
      {rank && rank <= 3 ? (
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
          rank === 1 ? "rank-badge-gold text-white" :
          rank === 2 ? "rank-badge-silver text-white" :
          "rank-badge-bronze text-white"
        }`}>
          #{rank}
        </div>
      ) : (
        <div className="w-9 h-9 rounded-lg bg-orange-600/8 border border-orange-600/15 flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-orange-400" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-[13px] text-zinc-100 leading-tight truncate pr-1">
            {shop.name}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {isUsed && (
              <span className="text-[9px] px-1 py-0.5 rounded bg-amber-600/10 border border-amber-600/20 text-amber-400 font-bold">
                OEM
              </span>
            )}
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
              isOpen
                ? "bg-emerald-900/40 border-emerald-600/25 text-emerald-400"
                : "bg-zinc-900/60 border-zinc-700/25 text-zinc-500"
            }`}>
              <span className={`w-1 h-1 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
              {isOpen ? "Open" : "Closed"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-zinc-700" />
            <span className="text-[11px] text-zinc-600 truncate max-w-[160px]">{shop.vicinity || shop.formatted_address || "UAE"}</span>
          </div>
          {shop.rating && (
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
              <span className="text-[11px] font-bold text-zinc-300">{shop.rating}</span>
              {shop.user_ratings_total && (
                <span className="text-[10px] text-zinc-600">({shop.user_ratings_total.toLocaleString()})</span>
              )}
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-orange-400 transition-colors shrink-0" />
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
      <div className="skeleton w-9 h-9 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="skeleton h-3.5 w-3/4 rounded" />
        <div className="skeleton h-2.5 w-1/2 rounded" />
      </div>
    </div>
  );
}

function CategoryChart({ shops }: { shops: ExtendedPlaceResult[] }) {
  const data = useMemo(() => {
    const ratingBuckets = [
      { name: "< 4.0", value: 0, fill: "#27272a" },
      { name: "4.0–4.4", value: 0, fill: "#3b82f6" },
      { name: "4.5–4.8", value: 0, fill: "#06b6d4" },
      { name: "4.9+", value: 0, fill: "#10b981" },
    ];
    shops.forEach(s => {
      const r = s.rating || 0;
      if (r < 4.0) ratingBuckets[0].value++;
      else if (r < 4.5) ratingBuckets[1].value++;
      else if (r < 4.9) ratingBuckets[2].value++;
      else ratingBuckets[3].value++;
    });
    return ratingBuckets;
  }, [shops]);

  if (shops.length === 0) return null;

  return (
    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
      <p className="text-[10px] text-zinc-500 font-semibold mb-2 flex items-center gap-1">
        <Activity className="w-3 h-3" /> Rating Distribution · {shops.length} stores
      </p>
      <div style={{ height: 64 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -24 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 11 }}
              cursor={{ fill: "rgba(249,115,22,0.05)" }}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
      const emFilter = EMIRATE_CONFIG.find(e => e.label === em) || EMIRATE_CONFIG[0];

      // Build query with specific emirate context
      let query = catFilter.query;
      if (em !== "All UAE") {
        const catPart = cat === "All Parts" ? "spare parts" : cat;
        query = `${catPart} auto shop ${em}`;
      }

      const params = new URLSearchParams({
        query,
        lat: String(emFilter.lat),
        lng: String(emFilter.lng),
        radius: String(emFilter.radius),
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

  const filtered = useMemo(() => {
    return allShops
      .filter(s =>
        (!search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.vicinity || "").toLowerCase().includes(search.toLowerCase()) ||
          (s.formatted_address || "").toLowerCase().includes(search.toLowerCase())) &&
        (!openOnly || s.opening_hours?.open_now)
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [allShops, search, openOnly]);

  const stats = useMemo(() => {
    const open = filtered.filter(s => s.opening_hours?.open_now).length;
    const rated = filtered.filter(s => s.rating);
    const avgRating = rated.length > 0
      ? (rated.reduce((sum, s) => sum + (s.rating || 0), 0) / rated.length).toFixed(1)
      : "—";
    return { total: filtered.length, open, avgRating };
  }, [filtered]);

  const activeCat = PARTS_CATEGORIES.find(c => c.label === category);

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-6">
      {/* Compact sticky header */}
      <div className="border-b border-zinc-800/60 bg-zinc-950 sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-3 py-3">
          {/* Title */}
          <div className="flex items-center gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">
                  Spare <span className="text-orange-400">Parts</span>
                </h1>
                {loading && <RefreshCw className="w-3.5 h-3.5 text-zinc-600 animate-spin" />}
              </div>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                {loading ? "Searching..." : `${filtered.length} stores · ${category} · ${emirate}`}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                {[
                  { icon: Package, label: "New & OEM" },
                  { icon: RefreshCw, label: "Used Parts" },
                  { icon: Zap, label: "Performance" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-1">
                    <item.icon className="w-3 h-3 text-orange-400" />
                    <span className="text-[11px] text-zinc-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search parts store or area..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-orange-600/40 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all shrink-0 ${
                showFilters || openOnly
                  ? "bg-orange-600/15 border-orange-600/30 text-orange-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {openOnly && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
            </button>
          </div>

          {/* Emirate pills */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {EMIRATE_CONFIG.map(em => (
              <button
                key={em.label}
                onClick={() => setEmirate(em.label)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap transition-all shrink-0 ${
                  emirate === em.label
                    ? "bg-orange-600/15 border-orange-600/30 text-orange-400"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {em.label}
              </button>
            ))}
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <button
                    onClick={() => setOpenOnly(!openOnly)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                      openOnly
                        ? "bg-emerald-600/15 border-emerald-600/30 text-emerald-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
                    }`}
                  >
                    <Clock className="w-3 h-3" /> Open Now Only
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-[calc(3.5rem+var(--header-h,140px))] z-20 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/60">
        <div className="max-w-5xl mx-auto px-3 py-2">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {PARTS_CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                style={category === cat.label ? { borderColor: cat.color + "50", color: cat.color, backgroundColor: cat.color + "15" } : {}}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap transition-all shrink-0 ${
                  category === cat.label
                    ? ""
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-3 pt-4">
        {/* Stats strip */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Stores", value: stats.total, color: "text-orange-400" },
              { label: "Open Now", value: stats.open, color: "text-emerald-400" },
              { label: "Avg ★", value: stats.avgRating, color: "text-yellow-400" },
            ].map(s => (
              <div key={s.label} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-zinc-600">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {!loading && filtered.length > 3 && <CategoryChart shops={filtered} />}

        {/* Results */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-3">Failed to load parts stores</p>
            <button
              onClick={() => fetchParts(category, emirate)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-500"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-2">No parts stores found</p>
            <button
              onClick={() => { setSearch(""); setOpenOnly(false); setCategory("All Parts"); setEmirate("All UAE"); }}
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((shop, i) => (
              <PartsCard key={shop.place_id} shop={shop} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
