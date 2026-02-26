"use client";

import { useState, useEffect, useCallback, Suspense, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Wrench, Star, MapPin, Clock, ChevronRight,
  Search, TrendingUp, RefreshCw,
  Activity, Filter, Sparkles, Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

function inferServiceTags(name: string): string[] {
  const lower = name.toLowerCase();
  const tags: string[] = [];
  if (lower.includes("tyre") || lower.includes("tire") || lower.includes("wheel")) tags.push("🏎️ Tyres");
  if (lower.includes("ac") || lower.includes("air con") || lower.includes("cooling")) tags.push("❄️ AC");
  if (lower.includes("brake")) tags.push("🔧 Brakes");
  if (lower.includes("body") || lower.includes("panel") || lower.includes("dent") || lower.includes("paint")) tags.push("🔨 Bodywork");
  if (lower.includes("electr")) tags.push("⚡ Electrical");
  if (lower.includes("transmission") || lower.includes("gearbox")) tags.push("⚙️ Gearbox");
  if (lower.includes("oil") || lower.includes("lube")) tags.push("🛢️ Oil Change");
  if (lower.includes("bmw") || lower.includes("mercedes") || lower.includes("toyota") || lower.includes("honda") || lower.includes("nissan") || lower.includes("ford") || lower.includes("audi") || lower.includes("lexus")) tags.push("⭐ Specialist");
  if (lower.includes("quick") || lower.includes("express") || lower.includes("fast")) tags.push("⚡ Express");
  if (tags.length === 0) tags.push("🔧 General Service");
  return tags.slice(0, 3);
}

function GarageCard({ shop, rank, index, onSelect }: { shop: ExtendedPlaceResult; rank?: number; index?: number; onSelect: (id: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mouseAbsX = useMotionValue(0);
  const mouseAbsY = useMotionValue(0);
  const rotateX = useTransform(my, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mx, [-0.5, 0.5], ["-5deg", "5deg"]);
  const glow = useMotionTemplate`radial-gradient(500px circle at ${mouseAbsX}px ${mouseAbsY}px, rgba(249,115,22,0.12) 0%, transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
    mouseAbsX.set(e.clientX - rect.left);
    mouseAbsY.set(e.clientY - rect.top);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  const isOpen = shop.opening_hours?.open_now;
  const rating = shop.rating || 0;
  const tags = inferServiceTags(shop.name);
  const isFeatured = rank && rank <= 3;
  const photoRef = shop.photos?.[0]?.photo_reference;
  const hasRealPhoto = !!photoRef && !imgError;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min((index || 0) * 0.04, 0.5), ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(shop.place_id)}
      whileTap={{ scale: 0.985 }}
      style={{ perspective: "1000px" }}
      className="relative cursor-pointer group"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative rounded-2xl border overflow-hidden ${
          isFeatured
            ? "border-orange-500/30 shadow-lg shadow-orange-500/5"
            : "border-[var(--border)] hover:border-orange-500/25"
        } bg-[var(--surface)]`}
      >
        {/* Cursor-follow glow */}
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0" style={{ background: glow }} />

        {/* Left accent strip */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] z-10 ${
          isOpen
            ? "bg-gradient-to-b from-emerald-400 to-emerald-600"
            : "bg-gradient-to-b from-zinc-700 to-zinc-800"
        }`} />

        {/* Image area */}
        <div className="relative h-44 sm:h-36 overflow-hidden bg-gradient-to-br from-[#1a1008] via-[#121212] to-[#0e0e16]">
          {hasRealPhoto ? (
            <Image
              src={`/api/photo?ref=${encodeURIComponent(photoRef!)}&maxwidth=480`}
              alt={shop.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, 50vw"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <Image
              src={(index ?? 0) % 2 === 0 ? "/images/garage-card-service.png" : "/images/garage-card-tyres.png"}
              alt="Garage"
              fill
              className="object-cover object-center opacity-50 group-hover:opacity-65 transition-opacity duration-500"
              sizes="(max-width: 640px) 100vw, 50vw"
              loading="lazy"
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
          {/* Top-right rank badge */}
          {isFeatured && (
            <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg z-10 ${
              rank === 1 ? "bg-gradient-to-r from-amber-400 to-amber-600 text-black" :
              rank === 2 ? "bg-gradient-to-r from-zinc-300 to-zinc-500 text-black" :
              "bg-gradient-to-r from-orange-600 to-orange-900 text-white"
            }`}>#{rank}</div>
          )}
          {/* Open/closed bottom-left badge */}
          <div className={`absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border z-10 ${
            isOpen
              ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400 backdrop-blur-sm"
              : "bg-zinc-900/80 border-zinc-700/40 text-zinc-500 backdrop-blur-sm"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
            {isOpen ? "Open Now" : "Closed"}
          </div>
          {/* Rating top-left */}
          {rating > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-amber-500/20 z-10">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-amber-300">{rating}</span>
              {shop.user_ratings_total && (
                <span className="text-[10px] text-zinc-500">({shop.user_ratings_total >= 1000 ? `${(shop.user_ratings_total / 1000).toFixed(1)}k` : shop.user_ratings_total})</span>
              )}
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="relative z-10 p-4">
          {/* Shop name */}
          <p className="font-bold text-[14px] text-[var(--text)] leading-tight mb-1.5 group-hover:text-orange-400 transition-colors line-clamp-1">
            {shop.name}
          </p>
          {/* Location */}
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="text-[11px] text-[var(--text-muted)] truncate">
              {shop.vicinity || shop.formatted_address || "UAE"}
            </span>
          </div>
          {/* Service tags + arrow */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 min-w-0 flex-1">
              {tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/10 border border-violet-500/15 text-violet-300/80 group-hover:bg-violet-500/15 group-hover:border-violet-500/25 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
      <div className="shimmer h-44 sm:h-36 w-full" />
      <div className="p-4 space-y-2.5">
        <div className="shimmer h-4 w-3/4 rounded-lg" />
        <div className="shimmer h-3 w-1/2 rounded-lg" />
        <div className="flex gap-1.5 pt-1">
          <div className="shimmer h-5 w-16 rounded-full" />
          <div className="shimmer h-5 w-20 rounded-full" />
          <div className="shimmer h-5 w-14 rounded-full" />
        </div>
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

      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-[var(--border)]" style={{ background: "linear-gradient(135deg, #0d0803 0%, #09090b 50%, #080912 100%)" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-violet-500/6 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        <div className="absolute top-4 left-1/4 w-80 h-80 rounded-full bg-orange-500/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 py-10 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="badge-orange text-[10px]">Live</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-[11px] text-zinc-500 font-medium">
              {loading ? "Searching UAE..." : `${garages.length} garages found`}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-100 to-orange-300">
              UAE Auto Garages
            </span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto mb-6">
            Service centres · repair shops · workshops across all 7 emirates
          </p>
          {/* Quick-filter pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {["Open Now", "Top Rated 4.5+", "24/7 Service", "Luxury Cars", "Electric Vehicles"].map(pill => (
              <span key={pill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80 transition-all cursor-pointer">
                {pill}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link href="/dashboard" className="text-[11px] text-zinc-500 hover:text-orange-400 transition-colors flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> View Dashboard
            </Link>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="relative flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-orange-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 ml-3" />
              Live data
            </span>
          </div>
        </div>
      </div>

      {/* Compact Sticky Filter Bar */}
      <div className="border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-3 py-3">
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
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
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
              { label: "Total Shops", value: stats.total, color: "text-orange-400", bg: "from-orange-500/8 to-transparent", border: "border-orange-500/15", icon: "🔧" },
              { label: "Open Now", value: stats.open, color: "text-emerald-400", bg: "from-emerald-500/8 to-transparent", border: "border-emerald-500/15", icon: "🟢" },
              { label: "Avg Rating", value: stats.avgRating + "★", color: "text-amber-400", bg: "from-amber-500/8 to-transparent", border: "border-amber-500/15", icon: "⭐" },
              { label: "Top Rated", value: stats.topRated, color: "text-violet-400", bg: "from-violet-500/8 to-transparent", border: "border-violet-500/15", icon: "🏆" },
            ].map(s => (
              <div key={s.label} className={`p-3 rounded-xl bg-gradient-to-br ${s.bg} border ${s.border} bg-[var(--surface)]`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm">{s.icon}</span>
                  <p className="text-[10px] text-zinc-500 font-medium">{s.label}</p>
                </div>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {!loading && garages.length > 5 && <StatsCharts shops={garages} />}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-7 h-7 text-red-400" />
            </div>
            <p className="text-[var(--text)] font-semibold mb-1">Failed to load garages</p>
            <p className="text-zinc-500 text-sm mb-4">Check your connection and try again</p>
            <button
              onClick={() => fetchGarages(emirate)}
              className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-400 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : garages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-orange-400" />
            </div>
            <p className="text-[var(--text)] font-semibold mb-1">No garages match your filters</p>
            <p className="text-zinc-500 text-sm mb-4">Try changing your search or removing filters</p>
            <button
              onClick={() => { setSearch(""); setOpenOnly(false); setMinRating(0); }}
              className="px-5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-orange-400 text-sm font-semibold hover:border-orange-500/30 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {garages.map((shop, i) => (
              <GarageCard
                key={shop.place_id}
                shop={shop}
                rank={i + 1}
                index={i}
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
