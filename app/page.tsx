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
  MessageSquare, Send, CheckCircle2, Timer,
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
    <div className="w-full h-full bg-[var(--bg)] flex items-center justify-center text-sm text-zinc-500">
      Loading map…
    </div>
  ),
});

const HAS_API_KEY = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/* ─── SEO Structured Data ────────────────────────────────── */
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GarageFinder UAE",
    "url": "https://garage-finder-uae.vercel.app",
    "description": "Find top-rated auto repair shops, car service centers, and spare parts stores across all UAE emirates.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://garage-finder-uae.vercel.app/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Best Auto Repair Shops in UAE",
    "description": "Directory of top-rated automotive service centres across Dubai, Abu Dhabi, Sharjah and all UAE emirates",
    "url": "https://garage-finder-uae.vercel.app/garages",
    "numberOfItems": 850,
    "itemListElement": [
      { "@type": "AutoRepair", "name": "Top Garages in Dubai", "areaServed": "Dubai" },
      { "@type": "AutoRepair", "name": "Top Garages in Abu Dhabi", "areaServed": "Abu Dhabi" },
      { "@type": "AutoRepair", "name": "Top Garages in Sharjah", "areaServed": "Sharjah" }
    ]
  }
];

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

  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Dubai" });
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Dubai" });

  return (
    <div className="flex flex-col items-start gap-1">
      <p className="text-[11px] font-semibold text-zinc-500 tracking-wide">UAE Time (GST)</p>
      <p className="text-2xl font-bold text-[var(--text)] tabular-nums leading-none">{timeStr}</p>
      <p className="text-[11px] text-zinc-500 mt-0.5">{dateStr}</p>
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

/* ─── Live Stats Strip ───────────────────────────────────── */
function LiveStatsStrip() {
  const stats = [
    { label: "Garages Indexed", value: 850, suffix: "+", icon: Wrench, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
    { label: "Parts Stores", value: 320, suffix: "+", icon: Package, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    { label: "Emirates Covered", value: 7, suffix: "", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Service Categories", value: 23, suffix: "+", icon: Sparkles, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  ];

  return (
    <section className="py-5 md:py-6 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {/* UAE Clock */}
          <div className="col-span-2 lg:col-span-1 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-4 flex items-center">
            <UAEClock />
          </div>
          {/* Stats */}
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3 hover:border-[var(--border-glow)] transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold tabular-nums leading-none ${s.color}`}>
                  <AnimCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{s.label}</p>
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
      gradient: "from-orange-500/15 to-orange-600/5",
      border: "hover:border-orange-500/40",
      iconBg: "bg-orange-500/15 border-orange-500/25",
      iconColor: "text-orange-400",
      badge: null,
    },
    {
      href: "/parts",
      icon: Package,
      title: "Find Parts",
      desc: "Spare parts stores & suppliers near you",
      gradient: "from-violet-500/15 to-violet-600/5",
      border: "hover:border-violet-500/40",
      iconBg: "bg-violet-500/15 border-violet-500/25",
      iconColor: "text-violet-400",
      badge: null,
    },
    {
      href: "/my-car",
      icon: Car,
      title: "My Car Advisor",
      desc: "AI health check & maintenance planner",
      gradient: "from-violet-500/15 to-orange-500/10",
      border: "hover:border-violet-500/40",
      iconBg: "bg-violet-500/15 border-violet-500/25",
      iconColor: "text-violet-400",
      badge: "AI",
    },
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
      desc: "UAE automotive stats, charts & insights",
      gradient: "from-cyan-500/10 to-cyan-600/5",
      border: "hover:border-cyan-500/40",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      iconColor: "text-cyan-400",
      badge: null,
    },
  ];

  return (
    <section className="py-8 md:py-10 bg-[var(--bg)]">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h2 className="text-xl font-bold text-[var(--text)]">What are you looking for?</h2>
          <Link href="/services" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors flex items-center gap-1">
            All services <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((a, i) => (
            <motion.div
              key={a.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={a.href}
                className={`group flex flex-col p-4 md:p-5 rounded-2xl bg-gradient-to-br ${a.gradient} border border-[var(--border)] ${a.border} transition-all duration-200 h-full min-h-[120px] md:min-h-[140px] hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${a.iconBg}`}>
                    <a.icon className={`w-5 h-5 ${a.iconColor}`} />
                  </div>
                  {a.badge && (
                    <span className="badge-violet text-[10px] px-2 py-0">{a.badge}</span>
                  )}
                </div>
                <p className="text-[var(--text)] font-semibold text-sm mt-auto leading-snug">{a.title}</p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{a.desc}</p>
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
  { role: "user", text: "My AC is blowing warm air in this Dubai heat." },
  { role: "ai", text: "In UAE summer (45°C+), warm AC typically means low refrigerant or a failing compressor. A recharge typically costs AED 150–300. I'd recommend addressing this soon to avoid engine strain." },
];

function CarAdvisorTeaser() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setVisible(1), 400);
    const t2 = setTimeout(() => setVisible(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  return (
    <section className="py-10 md:py-16 bg-[var(--surface)] border-t border-b border-[var(--border)]">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-violet-500/10 via-[var(--bg)] to-orange-500/5 border border-violet-500/20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: info */}
            <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/[0.06]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 mb-6 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[11px] font-semibold text-violet-400">AI Car Advisor</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4 leading-tight">
                Know your car's health<br />
                <span className="text-violet-400">before issues escalate</span>
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
                Describe your symptoms and get instant UAE-specific advice, AED cost estimates, and urgency ratings — powered by Gemini AI.
              </p>
              <div className="space-y-2.5 mb-6 md:mb-8">
                {[
                  { icon: Cpu, text: "Trained on UAE-specific vehicle data" },
                  { icon: Clock, text: "Maintenance timeline reminders" },
                  { icon: ShieldCheck, text: "AED cost projections included" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-violet-400" />
                    </div>
                    {f.text}
                  </div>
                ))}
              </div>
              <Link
                href="/my-car"
                className="btn-violet inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold w-full sm:w-fit"
              >
                <Car className="w-4 h-4" />
                Check My Car
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: chat demo */}
            <div ref={ref} className="relative bg-[var(--bg)] p-5 md:p-10 flex flex-col justify-end min-h-[280px] md:min-h-[340px]">
              {/* Background illustration */}
              <div className="absolute inset-0 z-0 opacity-10 overflow-hidden rounded-r-3xl">
                <Image
                  src="/illustrations/car-advisor.png"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-end">
                {visible >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] bg-[var(--surface)] text-[var(--text)] p-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed border border-[var(--border)]">
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
                    <div className="max-w-[90%]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                        </div>
                        <span className="text-[11px] font-semibold text-violet-400">AI Advisor</span>
                      </div>
                      <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-2xl rounded-tl-sm text-sm text-zinc-300 leading-relaxed">
                        {DEMO_MESSAGES[1].text}
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Demo input */}
                <div className="flex items-center gap-2 mt-4 p-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                  <input
                    readOnly
                    placeholder="Describe your car issue…"
                    className="flex-1 bg-transparent text-sm text-zinc-500 px-3 outline-none cursor-default"
                  />
                  <Link href="/my-car" className="p-2.5 bg-violet-500 hover:bg-violet-600 transition-colors rounded-xl">
                    <Send className="w-4 h-4 text-white" />
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
    <section className="py-12 bg-[var(--bg)]">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] font-semibold text-orange-400">Top Rated in Dubai</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)]">
              Highly Rated Garages
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Live data · Updated daily</p>
          </div>
          <button
            onClick={() => onSelect(shops[0])}
            className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
          >
            View top shop <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="h-44 w-full shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded-lg shimmer" />
                  <div className="h-3.5 w-1/2 rounded-lg shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

  // Load featured shops for landing page
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">

      {/* SEO Structured Data */}
      {structuredData.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── STICKY SEARCH HEADER ── */}
      <header className="sticky top-14 z-40 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--border)]">
        {/* Row 1: Search bar (full width on mobile) */}
        <div className="px-3 pt-2.5 pb-0 sm:pb-2.5 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchBar onSearch={searchPlaces} isLoading={isLoading} />
            </div>
            {/* Desktop: emirate + map inline */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <RegionPicker value={selectedRegion} onChange={(key) => {
                setSelectedRegion(key);
                const region = UAE_REGIONS[key];
                const newCenter = region ? { lat: region.lat, lng: region.lng } : undefined;
                if (newCenter) setMapCenter(newCenter);
                if (searchPerformed) searchPlaces(currentQuery, false, activeBrand, newCenter);
              }} />
              <button
                onClick={() => setShowMap(!showMap)}
                className={`shrink-0 flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all ${showMap
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-[var(--surface)] border-[var(--border)] text-zinc-400 hover:border-orange-500/40 hover:text-orange-400"
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span>{showMap ? "Close Map" : "Map"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2 (mobile only): Emirate selector + Map toggle — clearly labeled */}
        <div className="flex sm:hidden items-center gap-2 px-3 py-2">
          <RegionPicker value={selectedRegion} onChange={(key) => {
            setSelectedRegion(key);
            const region = UAE_REGIONS[key];
            const newCenter = region ? { lat: region.lat, lng: region.lng } : undefined;
            if (newCenter) setMapCenter(newCenter);
            if (searchPerformed) searchPlaces(currentQuery, false, activeBrand, newCenter);
          }} />
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-2 px-3 h-10 rounded-xl border text-xs font-semibold transition-all shrink-0 ${showMap
              ? "bg-orange-500 border-orange-500 text-white"
              : "bg-[var(--surface)] border-[var(--border)] text-zinc-400 hover:border-orange-500/40 hover:text-orange-400"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            {showMap ? "Close Map" : "Map View"}
          </button>
          {searchPerformed && places.length > 0 && (
            <span className="ml-auto text-[11px] text-zinc-500 font-medium shrink-0">{places.length} found</span>
          )}
        </div>

        <BrandBar activeBrand={activeBrand} onBrandSelect={handleBrandSelect} />
        <FilterBar
          filters={filters}
          onChange={handleFiltersChange}
          resultCount={searchPerformed ? places.length : undefined}
        />
      </header>

      {/* API Key missing banner */}
      {isDemoMode && !HAS_API_KEY && (
        <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs font-medium text-amber-400">
            Set <code className="bg-amber-500/15 px-1.5 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your env to enable live data.
          </p>
        </div>
      )}

      {/* ── HERO ── */}
      {!searchPerformed && !isLoading && (
        <Hero onSearch={searchPlaces} />
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="min-h-screen">

        {aiAnalysis && <AIInsight analysis={aiAnalysis} onDismiss={() => setAiAnalysis(null)} />}

        {/* ── LANDING PAGE SECTIONS ── */}
        {/* Psychology-driven order: hook → trust validators → product proof → differentiation → social proof → action portals → feature upsell → CTA */}
        {!searchPerformed && !isLoading && (
          <>
            <LiveStatsStrip />          {/* 1. Trust validators (live numbers) */}
            <FeaturedShops              /* 2. Product proof (real garages) */
              shops={featuredShops}
              onSelect={(p) => handlePlaceSelect(p.place_id)}
              isLoading={featuredLoading}
            />
            <WhyUs />                   {/* 3. Differentiation (why GarageUAE) */}
            <Testimonials />            {/* 4. Social proof BEFORE action portals */}
            <QuickActionGrid onSearch={searchPlaces} /> {/* 5. Action portals — user is now ready */}
            <CarAdvisorTeaser />        {/* 6. Feature upsell */}
            <CTABanner onSearch={searchPlaces} /> {/* 7. Final CTA */}
          </>
        )}

        {/* ── LOADING SKELETONS ── */}
        {isLoading && (
          <section className="p-4 md:p-8">
            <div className="h-7 w-48 rounded-xl shimmer mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[var(--border)] overflow-hidden">
                  <div className="h-44 w-full shimmer" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 rounded-lg shimmer" />
                    <div className="h-3.5 w-1/2 rounded-lg shimmer" />
                    <div className="pt-3 border-t border-[var(--border)] flex gap-2">
                      <div className="h-4 w-12 rounded-lg shimmer" />
                      <div className="h-4 w-16 rounded-lg shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SEARCH RESULTS ── */}
        {!isLoading && searchPerformed && places.length > 0 && (
          <section className="p-4 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text)] flex flex-wrap items-center gap-2">
                  {brandName ? (
                    <>
                      <span>{brandName}</span>
                      <span className="text-zinc-500">Specialists</span>
                      <span className="badge-orange text-[11px]">{places.length} found</span>
                    </>
                  ) : (
                    <>Results for <span className="text-orange-400">"{currentQuery}"</span>
                      <span className="badge-orange text-[11px]">{places.length}</span>
                    </>
                  )}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {selectedRegion === "all" ? "All UAE" : UAE_REGIONS[selectedRegion]?.label}
                  {isDemoMode ? " · Demo mode" : " · Live data"}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /> Best rated first</span>
              </div>
            </div>

            {serviceShops.length > 0 && (
              <>
                {serviceShops.length >= 3 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-semibold text-orange-400">Top Picks</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <BadgeCheck className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm font-semibold text-zinc-400">More Results</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="pt-8 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-semibold text-violet-400">Parts & Suppliers</span>
                  <span className="badge-violet text-[10px] px-2 py-0">{partsShops.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="p-12 md:p-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-zinc-500" />
            </div>
            {!HAS_API_KEY ? (
              <>
                <h3 className="text-xl font-bold text-[var(--text)] mb-2">API key not configured</h3>
                <p className="text-sm text-zinc-500 max-w-sm">
                  Set <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable live garage data.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[var(--text)] mb-2">No results found</h3>
                <p className="text-sm text-zinc-500 mb-6">Try adjusting your search or filters.</p>
                <button
                  onClick={() => { setFilters(DEFAULT_FILTERS); searchPlaces(currentQuery, false, activeBrand); }}
                  className="btn-orange px-6 py-2.5 text-sm"
                >
                  Reset Filters
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
            className="fixed inset-0 z-50 bg-[var(--bg)]"
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {places.length} locations
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={handleLocate} className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] text-sm font-medium text-zinc-400 hover:border-orange-500/40 hover:text-orange-400 transition-colors flex items-center gap-1.5 rounded-xl">
                  <Locate className="w-4 h-4" /> Locate me
                </button>
                <button onClick={() => setShowMap(false)} className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 rounded-xl">
                  <X className="w-4 h-4" /> Close
                </button>
              </div>
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
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center animate-pulse">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-zinc-500">Loading GarageUAE…</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
