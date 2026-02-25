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
    <div className="w-full h-full bg-[#050505] border-grid flex items-center justify-center uppercase font-black tracking-widest text-xs text-zinc-500">
      INITIALIZING MAP ENGINE...
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
      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 border-b border-white pb-1 w-full text-center">UAE TIME</p>
      <p className="text-3xl font-black text-white tabular-nums tracking-tighter leading-none">{timeStr}</p>
      <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-widest">{dateStr} · GST (UTC+4)</p>
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
    { label: "Garages Indexed", value: 850, suffix: "+", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Parts Stores", value: 320, suffix: "+", icon: Package, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
    { label: "Open Right Now", value: 89, suffix: "", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "AI Searches Today", value: 1240, suffix: "+", icon: Sparkles, color: "text-white", bg: "bg-white/10 border-white/20" },
  ];

  return (
    <section className="py-8 bg-[#000] border-grid-b">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-0 border-grid">
          {/* UAE Clock card */}
          <div className="col-span-2 lg:col-span-1 bg-[#050505] border-grid flex items-center justify-center p-8 group hover:bg-white transition-colors duration-500">
            <div className="group-hover:invert transition-colors duration-500 w-full">
              <UAEClock />
            </div>
          </div>
          {/* Stats */}
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] border-grid p-6 md:p-8 flex flex-col justify-between group hover:bg-white transition-colors duration-500 min-h-[160px]"
            >
              <div className={`w-10 h-10 border flex items-center justify-center mb-6 group-hover:border-black group-hover:bg-transparent transition-colors ${s.bg}`}>
                <s.icon className={`w-5 h-5 group-hover:text-black transition-colors ${s.color}`} />
              </div>
              <div>
                <p className="text-3xl font-black tabular-nums text-white group-hover:text-black transition-colors tracking-tighter">
                  <AnimCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">{s.label}</p>
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
      title: "FIND A GARAGE",
      desc: "AI-MATCHED REPAIR SHOPS ACROSS ALL UAE EMIRATES",
      iconColor: "text-blue-500",
      badge: null,
      large: true,
    },
    {
      href: "/parts",
      icon: Package,
      title: "FIND PARTS",
      desc: "SPARE PARTS STORES & SUPPLIERS NEAR YOU",
      iconColor: "text-orange-500",
      badge: null,
      large: false,
    },
    {
      href: "/my-car",
      icon: Car,
      title: "MY CAR ADVISOR",
      desc: "AI HEALTH CHECK & MAINTENANCE PLANNER",
      iconColor: "text-blue-500",
      badge: "AI",
      large: false,
    },
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "DASHBOARD",
      desc: "UAE AUTOMOTIVE STATS, CHARTS & INSIGHTS",
      iconColor: "text-white",
      badge: null,
      large: false,
    },
  ];

  return (
    <section className="py-12 bg-[#050505] border-grid-b">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-grid-b">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">QUICK ACCESS PORTALS</h2>
          <Link href="/services" className="text-[10px] font-black tracking-widest uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
            ALL EXECUTABLES <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-grid">
          {actions.map((a) => (
            <motion.div
              key={a.href}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="border-grid bg-[#0a0a0a]"
            >
              <Link
                href={a.href}
                className={`group flex flex-col p-8 transition-colors duration-300 h-full min-h-[220px] hover:bg-white`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-12 h-12 border flex items-center justify-center group-hover:border-black group-hover:bg-transparent transition-colors border-white/20 bg-white/5`}>
                    <a.icon className={`w-6 h-6 group-hover:text-black transition-colors ${a.iconColor}`} />
                  </div>
                  {a.badge && (
                    <span className="text-[10px] font-black px-2 py-1 border border-blue-500 bg-blue-500/10 text-blue-500 group-hover:bg-blue-100 group-hover:border-blue-600 transition-colors">
                      {a.badge}
                    </span>
                  )}
                </div>
                <div className="mt-auto">
                  <p className="font-black text-lg text-white mb-2 group-hover:text-black uppercase tracking-tight transition-colors">{a.title}</p>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest leading-relaxed group-hover:text-zinc-600 transition-colors">{a.desc}</p>
                </div>
                <ArrowRight className={`w-5 h-5 text-black opacity-0 group-hover:opacity-100 transition-opacity mt-6`} />
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
  { role: "user", text: "My AC is blowing warm air in this heat." },
  { role: "ai", text: "IN UAE SUMMER (45°C+), WARM AC TYPICALLY INDICATES LOW REFRIGERANT OR COMPRESSOR FAILURE. DIAGNOSTIC RECHARGE COST: ~AED 150-300. PROCEED IMMEDIATELY TO PREVENT ENGINE OVERHEATING." },
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
    <section className="py-24 bg-[#0a0a0a] border-grid-b">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="border border-white bg-[#050505]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: info */}
            <div className="p-10 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/20 relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-l border-b border-white/20" />

              <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500 mb-8 w-fit bg-blue-500/5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">AI DIAGNOSTIC PROTOCOL</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.9]">
                VEHICLE
                <br />
                <span className="text-zinc-600">
                  HEALTH ENGINE
                </span>
              </h2>
              <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase leading-relaxed mb-10 max-w-sm">
                INPUT SYMPTOMS. GET INSTANT UAE-SPECIFIC ADVICE, COST PROJECTIONS IN AED, AND URGENCY RATINGS.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { icon: Cpu, text: "TRAINED ON LOCAL DATA" },
                  { icon: Clock, text: "ROUTINE MAINTENANCE TIMELINES" },
                  { icon: ShieldCheck, text: "EXACT AED EXPENDITURE PROJECTIONS" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-4 text-[10px] font-black tracking-widest text-zinc-300 uppercase">
                    <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                      <f.icon className="w-4 h-4 text-white" />
                    </div>
                    {f.text}
                  </div>
                ))}
              </div>
              <Link
                href="/my-car"
                className="inline-flex items-center justify-between px-6 py-4 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest transition-colors w-full sm:w-fit group border border-transparent"
              >
                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4" />
                  INITIALIZE SCAN
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-8" />
              </Link>
            </div>

            {/* Right: chat demo */}
            <div ref={ref} className="relative bg-[#000] p-8 md:p-12 flex flex-col justify-end min-h-[400px]">
              <div className="space-y-6 flex-1 flex flex-col justify-end">
                {visible >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] bg-white text-black p-4 text-[11px] font-black uppercase tracking-widest leading-relaxed border border-white">
                      {DEMO_MESSAGES[0].text}
                    </div>
                  </motion.div>
                )}
                {visible >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[90%] font-mono">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 border border-blue-500 flex items-center justify-center bg-blue-500/10">
                          <Sparkles className="w-3 h-3 text-blue-500" />
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">GARAGEFINDER TERMINAL</span>
                      </div>
                      <div className="bg-[#0a0a0a] border border-blue-500/30 p-5 text-[11px] text-zinc-300 leading-relaxed uppercase tracking-widest">
                        {DEMO_MESSAGES[1].text}
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Demo input */}
                <div className="flex items-center gap-3 mt-6 p-3 bg-[#050505] border border-white/20">
                  <input
                    readOnly
                    placeholder="ENTER SYMPTOMS..."
                    className="flex-1 bg-transparent text-[10px] font-black tracking-widest text-zinc-500 px-3 outline-none cursor-default uppercase"
                  />
                  <Link href="/my-car" className="p-3 bg-white hover:bg-zinc-200 transition-colors">
                    <Send className="w-4 h-4 text-black" />
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
    <section className="py-24 bg-[#000] border-grid-b border-grid-t">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-white pb-6 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">HIGHLY RANKED<br /><span className="text-zinc-600">NODES</span></h2>
            <p className="text-[10px] font-bold tracking-widest text-zinc-500 mt-4 uppercase">LIVE TELEMETRY · DUBAI SECTOR</p>
          </div>
          <button
            onClick={() => onSelect(shops[0])}
            className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-6 py-3 hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            EXECUTE OVERVIEW <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-grid bg-[#050505]">
                <div className="h-44 w-full bg-white/5 animate-pulse" />
                <div className="p-8 space-y-4">
                  <div className="h-6 w-3/4 bg-white/5 animate-pulse" />
                  <div className="h-3 w-1/2 bg-white/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-grid">
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

  // Load featured shops silently for landing page
  useEffect(() => {
    if (!HAS_API_KEY || didFeatured.current) return;
    didFeatured.current = true;
    setFeaturedLoading(true);
    const center = DEFAULT_CENTER;
    fetch(`/api/places?query=car+repair+service&lat=${center.lat}&lng=${center.lng}&radius=20000`)
      .then(r => r.json())
      .then(d => setFeaturedShops((d.results || []).slice(0, 3)))
      .catch(() => { })
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
    if (filters.placeType === "parts") {
      setFilters(prev => ({ ...prev, placeType: "all" }));
    }
    setActiveBrand(brandId);
    searchPlaces(query, false, brandId);
  }, [searchPlaces, filters.placeType]);

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
      if (newFilters.placeType === "parts" && activeBrand) {
        const formattedBrand = activeBrand.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        setActiveBrand(null);
        searchPlaces(`${formattedBrand} spare parts`, false, null);
      } else {
        searchPlaces(currentQuery, false, activeBrand);
      }
    }
  }, [searchPerformed, activeBrand, currentQuery, searchPlaces]);

  const serviceShops = places.filter(p => (p as ExtendedPlaceResult).placeType !== "parts");
  const partsShops = places.filter(p => (p as ExtendedPlaceResult).placeType === "parts");

  const brandName = activeBrand
    ? activeBrand.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden uppercase font-mono selection:bg-white selection:text-black">

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#050505] border-grid-b">
        <div className="px-4 py-3 flex items-center gap-4 max-w-screen-2xl mx-auto border-grid-b bg-[#0a0a0a] border-l border-r border-[#1a1a1a]">
          <button
            onClick={() => {
              setSearchPerformed(false);
              setShowDetail(false);
              setSelectedPlaceId(null);
              setActiveBrand(null);
            }}
            className="flex items-center gap-3 shrink-0 group hover:opacity-100 transition-opacity"
          >
            <div className="w-10 h-10 bg-white group-hover:bg-zinc-200 border border-white flex items-center justify-center transition-colors">
              <Wrench className="w-5 h-5 text-black" />
            </div>
            <div className="hidden sm:block text-left">
              <h1 className="text-xl font-black tracking-tighter leading-none text-white uppercase">
                GARAGE<span className="text-zinc-500">FINDER</span>
              </h1>
              <p className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">UAE TERMINAL</p>
            </div>
          </button>

          <div className="flex-1 ml-4 border-l border-white/10 pl-4">
            <SearchBar onSearch={searchPlaces} isLoading={isLoading} />
          </div>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4 h-12">
            <RegionPicker value={selectedRegion} onChange={(key) => {
              setSelectedRegion(key);
              const region = UAE_REGIONS[key];
              const newCenter = region ? { lat: region.lat, lng: region.lng } : undefined;
              if (newCenter) setMapCenter(newCenter);
              if (searchPerformed) searchPlaces(currentQuery, false, activeBrand, newCenter);
            }} />

            <button
              onClick={() => setShowMap(!showMap)}
              className={`shrink-0 flex items-center gap-2 px-6 h-full border text-xs font-black tracking-widest transition-colors ${showMap
                  ? "bg-white border-white text-black"
                  : "bg-[#050505] border-white/20 text-white hover:border-white hover:bg-white/5"
                }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{showMap ? "CLOSE MAP" : "TOGGLE MAP"}</span>
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
        <div className="sticky top-0 z-30 flex items-center justify-center gap-3 px-4 py-3 bg-red-600 border-grid-b">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <p className="text-[10px] font-black tracking-widest text-white uppercase">
            AUTHORIZATION REQUIRED: SET NEXT_PUBLIC_GOOGLE_MAPS_API_KEY IN ENV TO ENABLE LIVE DATA FEED.
          </p>
        </div>
      )}

      {/* ── HERO ── */}
      {!searchPerformed && !isLoading && (
        <Hero onSearch={searchPlaces} />
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-screen-2xl mx-auto bg-[#000] border-l border-r border-[#1a1a1a] min-h-screen">

        {aiAnalysis && <AIInsight analysis={aiAnalysis} onDismiss={() => setAiAnalysis(null)} />}

        {/* ── LANDING PAGE ── */}
        {!searchPerformed && !isLoading && (
          <>
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
          <section className="p-8">
            <div className="h-8 w-64 bg-white/5 animate-pulse mb-8 border border-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#050505] border-grid">
                  <div className="h-44 w-full bg-white/5 animate-pulse" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 w-3/4 bg-white/5 animate-pulse" />
                    <div className="h-3 w-1/2 bg-white/5 animate-pulse" />
                    <div className="pt-4 border-t border-white/5 flex gap-2">
                      <div className="h-4 w-12 bg-white/5 animate-pulse" />
                      <div className="h-4 w-16 bg-white/5 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── RESULTS ── */}
        {!isLoading && searchPerformed && places.length > 0 && (
          <section className="p-8 bg-[#000]">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white">
              <div>
                <h3 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                  {brandName ? (
                    <>
                      <span>{brandName}</span>
                      <span className="text-zinc-600">SPECIALISTS</span>
                      <span className="text-[10px] uppercase font-black px-3 py-1 bg-white text-black tracking-widest">
                        {places.length} IDENTIFIED
                      </span>
                    </>
                  ) : (
                    <>
                      {currentQuery === "auto repair in UAE" || currentQuery === "auto repair near me"
                        ? "PROXIMAL FACILITIES"
                        : `QUERY RESULTS: ${currentQuery}`}
                    </>
                  )}
                </h3>
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 mt-2 uppercase">
                  {places.length} ACTIVE NODES // {selectedRegion === "all" ? "GLOBAL UAE SCAN" : UAE_REGIONS[selectedRegion]?.label.toUpperCase()}
                  {isDemoMode ? " // SIMULATION FEED" : " // LIVE TELEMETRY"}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-6 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                <span className="flex items-center gap-2"><Star className="w-4 h-4 text-white" /> OPTIMAL RATING</span>
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-white" /> AI VERIFIED</span>
              </div>
            </div>

            {serviceShops.length > 0 && (
              <>
                {serviceShops.length >= 3 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6 bg-white text-black py-2 px-4 w-fit">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">TIER 1 FACILITIES</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-grid">
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
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6 bg-[#050505] text-white border border-white py-2 px-4 w-fit">
                      <BadgeCheck className="w-4 h-4 text-zinc-500" />
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-300">ADDITIONAL NODES</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-grid">
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
              <div className="pt-16 border-t border-white/20">
                <div className="flex items-center gap-3 mb-6 bg-white text-black py-2 px-4 w-fit">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">HARDWARE SUPPLIERS</span>
                  <span className="text-[10px] text-zinc-500 ml-2">[{partsShops.length}]</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-grid">
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
          <div className="p-24 bg-[#0a0a0a] border-grid flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-red-600 text-white flex items-center justify-center mb-8">
              <X className="w-12 h-12" />
            </div>
            {!HAS_API_KEY ? (
              <>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">SYSTEM OFFLINE</h3>
                <p className="text-xs text-zinc-400 max-w-sm uppercase tracking-widest leading-relaxed">
                  MISSING CREDENTIAL: <span className="text-white border border-white px-2 py-1 mx-1 block my-2 text-center bg-[#050505]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span>
                </p>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">NO QUERY RESULTS</h3>
                <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest">ADJUST PARAMETERS AND RETRY SEQUENCE.</p>
                <button
                  onClick={() => { setFilters(DEFAULT_FILTERS); searchPlaces(currentQuery, false, activeBrand); }}
                  className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  RESET FILTERS
                </button>
              </>
            )}
          </div>
        )}

      </main>

      {/* ── MAP OVERLAY ── */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#000]"
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-[#050505] border-b border-white">
              <h2 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-3">
                <span className="w-2 h-2 bg-white animate-pulse" />
                {places.length} ACTIVE LOCATIONS
              </h2>
              <div className="flex items-center gap-4">
                <button onClick={handleLocate} className="px-4 py-2 bg-[#000] border border-white/20 text-xs font-black tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-colors flex items-center gap-2">
                  <Locate className="w-4 h-4" /> RELOCATE
                </button>
                <button onClick={() => setShowMap(false)} className="px-4 py-2 bg-white text-black hover:bg-zinc-300 font-black tracking-widest uppercase text-xs transition-colors flex items-center gap-2">
                  <X className="w-4 h-4" /> CLOSE
                </button>
              </div>
            </div>
            <div className="w-full h-full pt-[64px] bg-[#000]">
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
      <div className="min-h-screen bg-[#000] flex items-center justify-center font-mono text-zinc-500 uppercase font-black tracking-widest text-[10px]">
        INITIALIZING GARAGEFINDER TERMINAL...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
