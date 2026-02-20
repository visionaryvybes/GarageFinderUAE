"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView, useSpring } from "framer-motion";
import {
  Wrench, Map as MapIcon, X, Locate, AlertCircle,
  Sparkles, ChevronRight, TrendingUp, Star, Zap, Clock,
  Package, BadgeCheck, Car, LayoutDashboard, Newspaper,
  ShieldCheck, Search, ArrowRight, Activity, MapPin, Cpu,
  MessageSquare, Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import SearchBar from "@/components/SearchBar";
import BrandBar from "@/components/BrandBar";
import FilterBar, { type ActiveFilters, DEFAULT_FILTERS } from "@/components/FilterBar";
import ShopCard from "@/components/ShopCard";
import PlaceDetail from "@/components/PlaceDetail";
import AIInsight from "@/components/AIInsight";
import RegionPicker from "@/components/RegionPicker";
import { DEFAULT_CENTER, UAE_REGIONS } from "@/lib/google-maps";
import { getBrandTierLabel, applyFilters, type ExtendedPlaceResult } from "@/lib/mock-data";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const HAS_API_KEY = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/* ─── UAE Live Clock ─────────────────────────────────────── */
function UAEClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: "Asia/Dubai" });
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Dubai" });

  return (
    <div className="flex flex-col items-center">
      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-0.5">UAE TIME</p>
      <p className="text-2xl font-black text-white tabular-nums tracking-tight leading-none">{timeStr}</p>
      <p className="text-xs text-zinc-500 mt-1">{dateStr} · GST (UTC+4)</p>
    </div>
  );
}

/* ─── Animated Counter ───────────────────────────────────── */
function AnimCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 60, damping: 14 });
  const [display, setDisplay] = useState("0");
  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v).toLocaleString())), [spring]);
  useEffect(() => { if (inView) spring.set(value); }, [inView, value, spring]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── Dashboard Strip (live stats on homepage) ───────────── */
function DashboardStrip() {
  const stats = [
    { label: "Garages Indexed", value: 850, suffix: "+", icon: Wrench, color: "text-blue-400", bg: "bg-blue-600/10" },
    { label: "Parts Stores", value: 320, suffix: "+", icon: Package, color: "text-orange-400", bg: "bg-orange-600/10" },
    { label: "Open Right Now", value: 89, suffix: "", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-600/10" },
    { label: "AI Searches Today", value: 1240, suffix: "+", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-600/10" },
  ];

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* UAE Clock card */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center py-5 px-4">
            <UAEClock />
          </div>
          {/* Stats */}
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-4 flex flex-col gap-2"
            >
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-black tabular-nums ${s.color}`}>
                  <AnimCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[11px] text-zinc-600 font-medium mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Quick Action Grid ──────────────────────────────────── */
function QuickActionGrid({ onSearch }: { onSearch: (q: string, ai?: boolean) => void }) {
  const actions = [
    {
      href: "/garages",
      icon: Wrench,
      title: "Find a Garage",
      desc: "AI-matched repair shops across all UAE emirates",
      accent: "from-blue-600/20 to-blue-600/5 hover:from-blue-600/30",
      border: "hover:border-blue-600/30",
      iconBg: "bg-blue-600/15",
      iconColor: "text-blue-400",
      badge: null,
      large: true,
    },
    {
      href: "/parts",
      icon: Package,
      title: "Find Parts",
      desc: "Spare parts stores & suppliers near you",
      accent: "from-orange-600/20 to-orange-600/5 hover:from-orange-600/30",
      border: "hover:border-orange-600/30",
      iconBg: "bg-orange-600/15",
      iconColor: "text-orange-400",
      badge: null,
      large: false,
    },
    {
      href: "/my-car",
      icon: Car,
      title: "My Car Advisor",
      desc: "AI health check & maintenance planner",
      accent: "from-blue-600/20 to-blue-600/5 hover:from-blue-600/30",
      border: "hover:border-blue-600/30",
      iconBg: "bg-blue-600/15",
      iconColor: "text-blue-400",
      badge: "AI",
      large: false,
    },
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
      desc: "UAE automotive stats, charts & insights",
      accent: "from-zinc-800/60 to-zinc-900/30",
      border: "hover:border-zinc-700",
      iconBg: "bg-zinc-800",
      iconColor: "text-zinc-300",
      badge: null,
      large: false,
    },
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-white tracking-tight">Quick Access</h2>
          <Link href="/services" className="text-xs text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1">
            All Services <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((a) => (
            <motion.div
              key={a.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Link
                href={a.href}
                className={`group flex flex-col gap-3 p-5 rounded-2xl bg-gradient-to-br ${a.accent} border border-[#1a1a1a] ${a.border} transition-all duration-300 h-full min-h-[140px]`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${a.iconBg} flex items-center justify-center`}>
                    <a.icon className={`w-5 h-5 ${a.iconColor}`} />
                  </div>
                  {a.badge && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400">
                      {a.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-white mb-1 group-hover:text-white">{a.title}</p>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">{a.desc}</p>
                </div>
                <ArrowRight className={`w-4 h-4 ${a.iconColor} opacity-0 group-hover:opacity-100 transition-opacity mt-auto`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Car Advisor Teaser ─────────────────────────────────── */
const DEMO_MESSAGES = [
  { role: "user", text: "My AC is blowing warm air in this heat 😩" },
  { role: "ai", text: "In UAE summer (45°C+), warm AC usually means low refrigerant or a failing compressor. First check: is the compressor clutch engaging? A recharge costs AED 150–300 at most workshops. Book a diagnostic ASAP — driving without AC in this heat stresses the engine." },
];

function CarAdvisorTeaser() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setVisible(1), 400);
    const t2 = setTimeout(() => setVisible(2), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-[#080808] border border-[#1a1a1a] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: info */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-600/25 bg-blue-600/8 mb-6 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-bold text-blue-400 tracking-wider uppercase">AI-Powered</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-4 leading-tight">
                Your Personal
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                  Car Advisor
                </span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-sm">
                Describe any car problem in plain English. Get instant UAE-specific advice, cost estimates in AED, and urgency ratings — tailored for extreme heat, desert dust, and E11 driving.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: Cpu, text: "AI trained on UAE automotive data" },
                  { icon: Clock, text: "Maintenance timeline & reminders" },
                  { icon: ShieldCheck, text: "AED cost estimates for all services" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="w-6 h-6 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <f.icon className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    {f.text}
                  </div>
                ))}
              </div>
              <Link
                href="/my-car"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02] w-fit"
              >
                <Car className="w-4 h-4" />
                Try My Car Advisor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: chat demo */}
            <div ref={ref} className="relative bg-[#040404] border-l border-[#1a1a1a] p-6 md:p-8 flex flex-col justify-end min-h-[340px]">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#040404] to-transparent z-10 pointer-events-none" />
              <div className="space-y-4">
                {visible >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] bg-blue-600 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13px] text-white leading-relaxed">
                      {DEMO_MESSAGES[0].text}
                    </div>
                  </motion.div>
                )}
                {visible >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600">GarageFinder AI</span>
                      </div>
                      <div className="bg-[#111] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-zinc-300 leading-relaxed border border-[#1e1e1e]">
                        {DEMO_MESSAGES[1].text}
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Demo input */}
                <div className="flex items-center gap-2 mt-4 p-2 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e]">
                  <input
                    readOnly
                    placeholder="Ask about your car..."
                    className="flex-1 bg-transparent text-sm text-zinc-500 px-2 outline-none cursor-default"
                  />
                  <Link href="/my-car" className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors">
                    <Send className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Featured Shops (auto-loaded) ──────────────────────── */
function FeaturedShops({
  shops,
  onSelect,
  isLoading,
}: {
  shops: ExtendedPlaceResult[];
  onSelect: (p: ExtendedPlaceResult) => void;
  isLoading: boolean;
}) {
  if (!isLoading && shops.length === 0) return null;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Top Rated Near You</h2>
            <p className="text-xs text-zinc-600 mt-0.5">Live data · Dubai area</p>
          </div>
          <button
            onClick={() => onSelect(shops[0])}
            className="text-xs text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a]">
                <div className="skeleton h-44 w-full" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {shops.slice(0, 3).map((place, i) => (
              <ShopCard
                key={place.place_id}
                place={place}
                rank={i + 1}
                index={i}
                onSelect={(p) => onSelect(p as ExtendedPlaceResult)}
                tierLabel={getBrandTierLabel(place.place_id, "")}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Main HomeContent ───────────────────────────────────── */
function HomeContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [places, setPlaces] = useState<ExtendedPlaceResult[]>([]);
  const [featuredShops, setFeaturedShops] = useState<ExtendedPlaceResult[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: DEFAULT_CENTER.lat, lng: DEFAULT_CENTER.lng });
  const [isLoading, setIsLoading] = useState(false);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    possibleIssue: string; estimatedCostRange: string;
    urgency: "low" | "medium" | "high"; serviceType: string;
  } | null>(null);
  const [currentQuery, setCurrentQuery] = useState("auto repair");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [filters, setFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);
  const didInit = useRef(false);
  const didFeatured = useRef(false);

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        () => setMapCenter(DEFAULT_CENTER)
      );
    }
  }, []);

  // Load featured shops silently for landing page (does NOT set searchPerformed)
  useEffect(() => {
    if (!HAS_API_KEY || didFeatured.current) return;
    didFeatured.current = true;
    setFeaturedLoading(true);
    const center = DEFAULT_CENTER;
    fetch(`/api/places?query=car+repair+service&lat=${center.lat}&lng=${center.lng}&radius=20000`)
      .then(r => r.json())
      .then(d => setFeaturedShops((d.results || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setFeaturedLoading(false));
  }, []);

  /* ── Search Logic ── */
  const searchPlaces = useCallback(async (
    query: string,
    isAI = true,
    brandId: string | null = null,
    overrideCenter?: { lat: number; lng: number }
  ) => {
    setIsLoading(true);
    setSearchPerformed(true);
    setCurrentQuery(query);
    setAiAnalysis(null);
    if (brandId !== undefined) setActiveBrand(brandId);

    if (!HAS_API_KEY) {
      await new Promise(r => setTimeout(r, 400));
      setPlaces([]);
      setIsDemoMode(true);
      setIsLoading(false);
      return;
    }

    try {
      const center = overrideCenter || userLocation || mapCenter;
      if (isAI) {
        const res = await fetch("/api/ai-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, lat: center.lat, lng: center.lng }),
        });
        const data = await res.json();
        let results: ExtendedPlaceResult[] = data.results || [];
        setIsDemoMode(false);
        results = applyFilters(results as ExtendedPlaceResult[], {
          openNow: filters.openNow,
          minRating: filters.minRating,
          maxPrice: filters.maxPrice || undefined,
          placeType: filters.placeType,
          sortBy: filters.sortBy === "relevance" ? undefined : filters.sortBy,
        });
        setPlaces(results);
        if (data.analysis) setAiAnalysis(data.analysis);
      } else {
        const params = new URLSearchParams({
          query,
          lat: String(center.lat),
          lng: String(center.lng),
        });
        const res = await fetch(`/api/places?${params}`);
        const data = await res.json();
        let results: ExtendedPlaceResult[] = data.results || [];
        setIsDemoMode(false);
        results = applyFilters(results as ExtendedPlaceResult[], {
          openNow: filters.openNow,
          minRating: filters.minRating,
          maxPrice: filters.maxPrice || undefined,
          placeType: filters.placeType,
          sortBy: filters.sortBy === "relevance" ? undefined : filters.sortBy,
        });
        setPlaces(results);
      }
    } catch {
      setPlaces([]);
      setIsDemoMode(false);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, mapCenter, filters]);

  useEffect(() => {
    if (initialQuery && !didInit.current) {
      didInit.current = true;
      searchPlaces(initialQuery, false);
    }
  }, [initialQuery, searchPlaces]);

  const handleBrandSelect = useCallback((query: string, brandId: string | null) => {
    setActiveBrand(brandId);
    searchPlaces(query, false, brandId);
  }, [searchPlaces]);

  const handlePlaceSelect = useCallback((placeId: string) => {
    setSelectedPlaceId(placeId);
    setShowDetail(true);
    if (showMap) setShowMap(false);
  }, [showMap]);

  const handleLocate = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setMapCenter(loc);
      });
    }
  }, []);

  const handleFiltersChange = useCallback((newFilters: ActiveFilters) => {
    setFilters(newFilters);
    if (searchPerformed) {
      searchPlaces(currentQuery, false, activeBrand);
    }
  }, [searchPerformed, activeBrand, currentQuery, searchPlaces]);

  const serviceShops = places.filter(p => (p as ExtendedPlaceResult).placeType !== "parts");
  const partsShops = places.filter(p => (p as ExtendedPlaceResult).placeType === "parts");

  const brandName = activeBrand
    ? activeBrand.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : null;

  return (
    <div className="min-h-screen bg-black text-zinc-100">

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-14 z-40 bg-black/95 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              setSearchPerformed(false);
              setShowDetail(false);
              setSelectedPlaceId(null);
              setActiveBrand(null);
            }}
            className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-40" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Wrench className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[17px] font-black tracking-tight leading-none text-white">
                Garage<span className="text-blue-400">Finder</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium tracking-wide">UAE · AI-POWERED</p>
            </div>
          </button>

          <div className="flex-1">
            <SearchBar onSearch={searchPlaces} isLoading={isLoading} />
          </div>

          <div className="flex items-center gap-2">
            <RegionPicker value={selectedRegion} onChange={(key) => {
              setSelectedRegion(key);
              const region = UAE_REGIONS[key];
              const newCenter = region ? { lat: region.lat, lng: region.lng } : undefined;
              if (newCenter) setMapCenter(newCenter);
              if (searchPerformed) searchPlaces(currentQuery, false, activeBrand, newCenter);
            }} />

            <button
              onClick={() => setShowMap(!showMap)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                showMap
                  ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{showMap ? "Hide Map" : "Map"}</span>
            </button>
          </div>
        </div>

        <BrandBar activeBrand={activeBrand} onBrandSelect={handleBrandSelect} />
        <FilterBar
          filters={filters}
          onChange={handleFiltersChange}
          resultCount={searchPerformed ? places.length : undefined}
        />
      </header>

      {/* Demo banner */}
      {isDemoMode && !HAS_API_KEY && (
        <div className="sticky top-0 z-30 flex items-center gap-2 px-4 py-2 bg-amber-950/60 border-b border-amber-800/30 backdrop-blur-sm">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300/80">
            Add <code className="text-amber-400 font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to <code className="text-amber-400 font-mono">.env.local</code> for live search.
          </p>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-2">

        {aiAnalysis && <AIInsight analysis={aiAnalysis} onDismiss={() => setAiAnalysis(null)} />}

        {/* ── LANDING PAGE ── */}
        {!searchPerformed && !isLoading && (
          <>
            <Hero onSearch={searchPlaces} />
            <DashboardStrip />
            <QuickActionGrid onSearch={searchPlaces} />
            <FeaturedShops
              shops={featuredShops}
              onSelect={(p) => handlePlaceSelect(p.place_id)}
              isLoading={featuredLoading}
            />
            <CarAdvisorTeaser />
            <WhyUs />
            <Testimonials />
            <CTABanner onSearch={searchPlaces} />
          </>
        )}

        {/* ── LOADING ── */}
        {isLoading && (
          <section>
            <div className="skeleton h-6 w-40 mb-4 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a]">
                  <div className="skeleton h-44 w-full" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="flex gap-1 mt-3">
                      <div className="skeleton h-5 w-16 rounded-full" />
                      <div className="skeleton h-5 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── RESULTS ── */}
        {!isLoading && searchPerformed && places.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2 flex-wrap">
                  {brandName ? (
                    <>
                      <span>{brandName}</span>
                      <span className="text-zinc-500">Specialists</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400">
                        {places.length} found
                      </span>
                    </>
                  ) : (
                    <>
                      {currentQuery === "auto repair in UAE" || currentQuery === "auto repair near me"
                        ? "Service Centres Near You"
                        : `Results for "${currentQuery}"`}
                    </>
                  )}
                </h3>
                <p className="text-sm text-zinc-600 mt-0.5">
                  {places.length} shops · {selectedRegion === "all" ? "All UAE" : UAE_REGIONS[selectedRegion]?.label}
                  {isDemoMode ? " · demo data" : " · live data"}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-600">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400" /> Top rated</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-blue-400" /> AI matched</span>
              </div>
            </div>

            {serviceShops.length > 0 && (
              <>
                {serviceShops.length >= 3 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-bold text-zinc-300">Top Ranked</span>
                      <span className="text-xs text-zinc-600">{brandName ? `${brandName} specialists` : "near you"}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {serviceShops.slice(0, 3).map((place, i) => (
                        <ShopCard
                          key={place.place_id}
                          place={place}
                          rank={i + 1}
                          index={i}
                          onSelect={(p) => handlePlaceSelect(p.place_id)}
                          tierLabel={activeBrand ? getBrandTierLabel(place.place_id, activeBrand) : null}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {serviceShops.length > 3 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <BadgeCheck className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm font-bold text-zinc-400">More Nearby</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {serviceShops.slice(3).map((place, i) => (
                        <ShopCard
                          key={place.place_id}
                          place={place}
                          index={i + 3}
                          onSelect={(p) => handlePlaceSelect(p.place_id)}
                          tierLabel={activeBrand ? getBrandTierLabel(place.place_id, activeBrand) : null}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {partsShops.length > 0 && (
              <div className="mt-8 pt-8 border-t border-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-bold text-zinc-300">Spare Parts Stores</span>
                  <span className="text-xs text-zinc-600">{partsShops.length} locations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partsShops.map((place, i) => (
                    <ShopCard
                      key={place.place_id}
                      place={place}
                      index={i}
                      onSelect={(p) => handlePlaceSelect(p.place_id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* No results */}
        {!isLoading && searchPerformed && places.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-zinc-700" />
            </div>
            {!HAS_API_KEY ? (
              <>
                <h3 className="text-lg font-bold text-zinc-400 mb-2">Google Maps API key required</h3>
                <p className="text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
                  Add <code className="text-zinc-400 bg-[#111] px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to <code className="text-zinc-400 bg-[#111] px-1.5 py-0.5 rounded font-mono">.env.local</code>.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-zinc-400 mb-2">No results found</h3>
                <p className="text-sm text-zinc-600 mb-4">Try adjusting your filters, expanding your area, or using different keywords.</p>
                <button
                  onClick={() => { setFilters(DEFAULT_FILTERS); searchPlaces(currentQuery, false, activeBrand); }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
                >
                  Clear filters & retry
                </button>
              </>
            )}
          </div>
        )}

        {/* ── TRENDING ── */}
        {!isLoading && (
          <section className={searchPerformed ? "border-t border-[#1a1a1a] pt-8" : ""}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h3 className="text-lg font-bold text-zinc-100">Trending in UAE</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "BMW specialist Dubai" },
                { label: "Oil change near me" },
                { label: "Emergency towing UAE" },
                { label: "Check engine light" },
                { label: "Tyre change Abu Dhabi" },
                { label: "AC repair Sharjah" },
                { label: "Ceramic coating Dubai" },
                { label: "Pre-purchase inspection" },
              ].map(({ label }) => (
                <button
                  key={label}
                  onClick={() => searchPlaces(label, true)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-zinc-700 hover:bg-zinc-900/80 transition-all text-left group"
                >
                  <span className="text-sm text-zinc-400 group-hover:text-white transition-colors line-clamp-1">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-blue-400 transition-colors shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── MAP OVERLAY ── */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950"
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-4 py-3 bg-zinc-950/90 backdrop-blur border-b border-[#1a1a1a]">
              <h2 className="font-bold text-zinc-100 flex-1">{places.length} locations on map</h2>
              <button onClick={handleLocate} className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-blue-500/40 transition-colors">
                <Locate className="w-4 h-4 text-zinc-400" />
              </button>
              <button onClick={() => setShowMap(false)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-600 transition-colors">
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <div className="w-full h-full pt-[56px]">
              <Map
                places={places}
                selectedPlaceId={selectedPlaceId}
                onPlaceSelect={handlePlaceSelect}
                center={mapCenter}
                zoom={13}
                userLocation={userLocation}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PlaceDetail
        placeId={showDetail ? selectedPlaceId : null}
        onClose={() => { setShowDetail(false); setSelectedPlaceId(null); }}
        userLocation={userLocation}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
