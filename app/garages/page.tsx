"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Wrench, Star, MapPin, Clock, ChevronRight,
  Search, SlidersHorizontal, TrendingUp, RefreshCw,
  Activity, Filter,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { applyFilters, type ExtendedPlaceResult } from "@/lib/mock-data";
import PlaceDetail from "@/components/PlaceDetail";

// Each emirate can have multiple search regions for full coverage
const EMIRATE_CONFIG = [
  {
    label: "All UAE", color: "#8b5cf6",
    regions: [
      { q: "car service centre workshop", lat: 25.2048, lng: 55.2708, radius: 40000 },
      { q: "auto repair service centre", lat: 24.4539, lng: 54.3773, radius: 40000 },
      { q: "auto repair garage", lat: 25.3463, lng: 55.4209, radius: 25000 },
    ],
  },
  {
    label: "Dubai", color: "#8b5cf6",
    regions: [{ q: "car repair garage Dubai", lat: 25.2048, lng: 55.2708, radius: 35000 }],
  },
  {
    label: "Abu Dhabi", color: "#06b6d4",
    regions: [{ q: "car service centre Abu Dhabi", lat: 24.4539, lng: 54.3773, radius: 45000 }],
  },
  {
    label: "Sharjah", color: "#10b981",
    regions: [{ q: "auto repair workshop Sharjah", lat: 25.3463, lng: 55.4209, radius: 25000 }],
  },
  {
    label: "Ajman", color: "#f59e0b",
    regions: [{ q: "car garage Ajman UAE", lat: 25.4052, lng: 55.5136, radius: 20000 }],
  },
  {
    label: "RAK", color: "#ef4444",
    regions: [{ q: "auto repair Ras Al Khaimah", lat: 25.7895, lng: 55.9432, radius: 30000 }],
  },
  {
    label: "Fujairah", color: "#ec4899",
    regions: [{ q: "car service Fujairah UAE", lat: 25.1288, lng: 56.3264, radius: 25000 }],
  },
  {
    label: "UAQ", color: "#a78bfa",
    regions: [{ q: "auto repair Umm Al Quwain", lat: 25.5647, lng: 55.5554, radius: 20000 }],
  },
];

async function fetchRegion(q: string, lat: number, lng: number, radius: number): Promise<ExtendedPlaceResult[]> {
  const params = new URLSearchParams({
    query: q,
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
  });
  const res = await fetch(`/api/places?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

function GarageCard({ shop, rank, onSelect }: { shop: ExtendedPlaceResult; rank?: number; onSelect: (id: string) => void }) {
  const isOpen = shop.opening_hours?.open_now;
  const rating = shop.rating || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(shop.place_id)}
      className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-orange-500/30 active:scale-[0.99] transition-all group cursor-pointer"
    >
      {/* Rank badge */}
      {rank && rank <= 3 ? (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
          rank === 1 ? "rank-badge-gold text-white" :
          rank === 2 ? "rank-badge-silver text-white" :
          "rank-badge-bronze text-white"
        }`}>
          #{rank}
        </div>
      ) : (
        <div className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shrink-0">
          <Wrench className="w-4 h-4 text-zinc-500" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-[13px] text-zinc-100 leading-tight truncate pr-1">
            {shop.name}
          </p>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
            isOpen
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-zinc-800/50 border-zinc-700/30 text-zinc-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
            {isOpen ? "Open" : "Closed"}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <div className="flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-zinc-700" />
            <span className="text-[11px] text-zinc-600 truncate max-w-[160px]">{shop.vicinity || shop.formatted_address || "UAE"}</span>
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
              <span className="text-[11px] font-bold text-zinc-300">{rating}</span>
              {shop.user_ratings_total && (
                <span className="text-[10px] text-zinc-600">({shop.user_ratings_total.toLocaleString()})</span>
              )}
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-orange-400 transition-colors shrink-0" />
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
      <div className="shimmer w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="shimmer h-3.5 w-3/4 rounded-lg" />
        <div className="shimmer h-2.5 w-1/2 rounded-lg" />
      </div>
    </div>
  );
}

const CHART_COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#8b5cf6"];

function StatsCharts({ shops }: { shops: ExtendedPlaceResult[] }) {
  const ratingBuckets = useMemo(() => {
    const b = { "< 4.0": 0, "4.0–4.4": 0, "4.5–4.8": 0, "4.9–5.0": 0 };
    shops.forEach(s => {
      const r = s.rating || 0;
      if (r < 4.0) b["< 4.0"]++;
      else if (r < 4.5) b["4.0–4.4"]++;
      else if (r < 4.9) b["4.5–4.8"]++;
      else b["4.9–5.0"]++;
    });
    return Object.entries(b).map(([name, value]) => ({ name, value }));
  }, [shops]);

  const openData = useMemo(() => {
    const open = shops.filter(s => s.opening_hours?.open_now).length;
    const closed = shops.length - open;
    return [
      { name: "Open", value: open },
      { name: "Closed", value: closed },
    ];
  }, [shops]);

  if (shops.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* Rating distribution */}
      <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        <p className="text-[10px] text-zinc-500 font-semibold mb-2 flex items-center gap-1">
          <Activity className="w-3 h-3" /> Rating Distribution
        </p>
        <div style={{ height: 80 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingBuckets} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 11 }}
                cursor={{ fill: "rgba(59,130,246,0.05)" }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Open/Closed donut */}
      <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        <p className="text-[10px] text-zinc-500 font-semibold mb-2 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Open Right Now
        </p>
        <div style={{ height: 80 }} className="relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={openData} cx="50%" cy="50%" innerRadius={22} outerRadius={36} dataKey="value" strokeWidth={0}>
                {openData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#10b981" : "#27272a"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center pointer-events-none">
            <span className="text-lg font-black text-emerald-400">{openData[0].value}</span>
            <span className="text-[9px] text-zinc-600">open</span>
          </div>
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
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [allShops, setAllShops] = useState<ExtendedPlaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGarages = useCallback(async (emirateLabel: string) => {
    setLoading(true);
    setError(false);
    try {
      const config = EMIRATE_CONFIG.find(e => e.label === emirateLabel) || EMIRATE_CONFIG[0];

      // Fetch all regions in parallel and merge + deduplicate
      const allResults = await Promise.all(
        config.regions.map(r => fetchRegion(r.q, r.lat, r.lng, r.radius))
      );

      const seen = new Set<string>();
      const merged: ExtendedPlaceResult[] = [];
      for (const batch of allResults) {
        for (const shop of batch) {
          if (shop.place_id && !seen.has(shop.place_id)) {
            seen.add(shop.place_id);
            // Filter: only service centres (not parts stores)
            if (shop.placeType !== "parts") {
              merged.push(shop);
            }
          }
        }
      }

      setAllShops(merged);
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

  const garages = useMemo(() => {
    return applyFilters(allShops, {
      openNow: openOnly,
      minRating,
      sortBy: "rating",
    }).filter(s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.vicinity || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.formatted_address || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [allShops, openOnly, minRating, search]);

  // Stats
  const stats = useMemo(() => {
    const open = garages.filter(s => s.opening_hours?.open_now).length;
    const rated = garages.filter(s => s.rating);
    const avgRating = rated.length > 0
      ? (rated.reduce((sum, s) => sum + (s.rating || 0), 0) / rated.length).toFixed(1)
      : "—";
    const topRated = garages.filter(s => (s.rating || 0) >= 4.5).length;
    return { total: garages.length, open, avgRating, topRated };
  }, [garages]);

  const activeEmirate = EMIRATE_CONFIG.find(e => e.label === emirate);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-20 md:pb-6">
      {/* Compact Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-3 py-3">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
                  UAE <span className="text-orange-400">Garages</span>
                </h1>
                {loading && <RefreshCw className="w-3.5 h-3.5 text-zinc-600 animate-spin" />}
              </div>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                {loading ? "Searching..." : `${garages.length} service centres · ${emirate}`}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/dashboard" className="text-[11px] text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Dashboard
              </Link>
            </div>
          </div>

          {/* Search + filter row */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search garage or area..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-zinc-500 outline-none focus:border-orange-500/40 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                showFilters || openOnly || minRating > 0
                  ? "bg-orange-500/10 border-orange-500/25 text-orange-400"
                  : "bg-[var(--surface)] border-[var(--border)] text-zinc-500 hover:border-[var(--border-glow)]"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {(openOnly || minRating > 0) && (
                <span className="w-1.5 h-1.5  bg-blue-400" />
              )}
            </button>
          </div>

          {/* Emirate pills */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {EMIRATE_CONFIG.map(em => (
              <button
                key={em.label}
                onClick={() => setEmirate(em.label)}
                style={emirate === em.label ? { borderColor: em.color + "50", color: em.color, backgroundColor: em.color + "15" } : {}}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap transition-all shrink-0 ${
                  emirate === em.label
                    ? ""
                    : "bg-[var(--surface)] border-[var(--border)] text-zinc-500 hover:border-[var(--border-glow)] hover:text-[var(--text)]"
                }`}
              >
                {em.label}
              </button>
            ))}
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setOpenOnly(!openOnly)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                      openOnly
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-[var(--surface)] border-[var(--border)] text-zinc-500 hover:border-[var(--border-glow)]"
                    }`}
                  >
                    <Clock className="w-3 h-3" /> Open Now
                  </button>
                  {[0, 3.5, 4, 4.5, 4.8].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(minRating === r && r !== 0 ? 0 : r)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                        minRating === r
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                          : "bg-[var(--surface)] border-[var(--border)] text-zinc-500 hover:border-[var(--border-glow)]"
                      }`}
                    >
                      {r === 0 ? "All Ratings" : <><Star className="w-2.5 h-2.5 fill-current" />{r}+</>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-3 pt-4">
        {/* Stats strip */}
        {!loading && garages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { label: "Total", value: stats.total, color: "text-orange-400" },
              { label: "Open Now", value: stats.open, color: "text-emerald-400" },
              { label: "Avg ★", value: stats.avgRating, color: "text-amber-400" },
              { label: "4.5+ ★", value: stats.topRated, color: "text-violet-400" },
            ].map(s => (
              <div key={s.label} className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {!loading && garages.length > 5 && <StatsCharts shops={garages} />}

        {/* Results */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Wrench className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-3">Failed to load garages</p>
            <button
              onClick={() => fetchGarages(emirate)}
              className="px-4 py-2 bg-blue-600 text-white  text-sm font-semibold hover:bg-blue-500"
            >
              Retry
            </button>
          </div>
        ) : garages.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-2">No garages match your filters</p>
            <button
              onClick={() => { setSearch(""); setOpenOnly(false); setMinRating(0); }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {garages.map((shop, i) => (
              <GarageCard
                key={shop.place_id}
                shop={shop}
                rank={i + 1}
                onSelect={(id) => { setSelectedPlaceId(id); setShowDetail(true); }}
              />
            ))}
          </div>
        )}
      </div>

      <PlaceDetail
        placeId={showDetail ? selectedPlaceId : null}
        onClose={() => { setShowDetail(false); setSelectedPlaceId(null); }}
      />
    </div>
  );
}

export default function GaragesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GaragesContent />
    </Suspense>
  );
}
