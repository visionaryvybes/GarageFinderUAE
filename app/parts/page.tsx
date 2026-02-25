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
import PlaceDetail from "@/components/PlaceDetail";

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

function PartsCard({ shop, rank, onSelect }: { shop: ExtendedPlaceResult; rank?: number; onSelect: (id: string) => void }) {
  const isOpen = shop.opening_hours?.open_now;
  const isUsed = shop.name.toLowerCase().includes("used") ||
    shop.name.toLowerCase().includes("second") ||
    (shop.vicinity || shop.formatted_address || "").toLowerCase().includes("al aweer");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(shop.place_id)}
      className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-orange-500/30 active:scale-[0.99] transition-all group cursor-pointer"
    >
      {rank && rank <= 3 ? (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
          rank === 1 ? "rank-badge-gold text-white" :
          rank === 2 ? "rank-badge-silver text-white" :
          "rank-badge-bronze text-white"
        }`}>
          #{rank}
        </div>
      ) : (
        <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
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
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
                OEM
              </span>
            )}
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
              isOpen
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-zinc-800/50 border-zinc-700/30 text-zinc-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
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
    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
      <div className="shimmer w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="shimmer h-3.5 w-3/4 rounded-lg" />
        <div className="shimmer h-2.5 w-1/2 rounded-lg" />
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
    <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-4">
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
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchParts = useCallback(async (cat: string, em: string, searchTerm = "") => {
    setLoading(true);
    setError(false);
    try {
      const catFilter = PARTS_CATEGORIES.find(c => c.label === cat) || PARTS_CATEGORIES[0];
      const emFilter = EMIRATE_CONFIG.find(e => e.label === em) || EMIRATE_CONFIG[0];

      // Build query — include search term in API call so brand names like "volkswagen" work
      let query: string;
      if (searchTerm.trim()) {
        const catPart = cat === "All Parts" ? "spare parts" : cat.toLowerCase();
        query = em !== "All UAE"
          ? `${searchTerm.trim()} ${catPart} ${em}`
          : `${searchTerm.trim()} ${catPart} UAE`;
      } else if (em !== "All UAE") {
        const catPart = cat === "All Parts" ? "spare parts" : cat;
        query = `${catPart} auto shop ${em}`;
      } else {
        query = catFilter.query;
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

  // Fetch when category or emirate changes (reset search)
  useEffect(() => {
    fetchParts(category, emirate, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, emirate, fetchParts]);

  // Debounced fetch when search text changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParts(category, emirate, search);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filtered = useMemo(() => {
    return allShops
      .filter(s => !openOnly || s.opening_hours?.open_now)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [allShops, openOnly]);

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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-20 md:pb-6">
      {/* Compact sticky header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-3 py-3">
          {/* Title */}
          <div className="flex items-center gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
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
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search parts store or area..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-zinc-500 outline-none focus:border-orange-500/40 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                showFilters || openOnly
                  ? "bg-orange-500/10 border-orange-500/25 text-orange-400"
                  : "bg-[var(--surface)] border-[var(--border)] text-zinc-500 hover:border-[var(--border-glow)]"
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
                    ? "bg-orange-500/10 border-orange-500/25 text-orange-400"
                    : "bg-[var(--surface)] border-[var(--border)] text-zinc-500 hover:border-[var(--border-glow)] hover:text-[var(--text)]"
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
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-[var(--surface)] border-[var(--border)] text-zinc-500 hover:border-[var(--border-glow)]"
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
      <div className="bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--border)]">
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
                    : "bg-[var(--surface)] border-[var(--border)] text-zinc-500 hover:border-[var(--border-glow)] hover:text-[var(--text)]"
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
              { label: "Avg ★", value: stats.avgRating, color: "text-amber-400" },
            ].map(s => (
              <div key={s.label} className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {filtered.length > 3 && <CategoryChart shops={filtered} />}

        {/* Results */}
        {loading && filtered.length === 0 ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-3">Failed to load parts stores</p>
            <button
              onClick={() => fetchParts(category, emirate)}
              className="px-4 py-2 bg-orange-600 text-white  text-sm font-semibold hover:bg-orange-500"
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
          <div className={`space-y-2 transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            {filtered.map((shop, i) => (
              <PartsCard
                key={shop.place_id}
                shop={shop}
                rank={i + 1}
                onSelect={(id) => { setSelectedPlaceId(id); setShowDetail(true); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Place Detail Panel */}
      <PlaceDetail
        placeId={showDetail ? selectedPlaceId : null}
        onClose={() => { setShowDetail(false); setSelectedPlaceId(null); }}
      />
    </div>
  );
}
