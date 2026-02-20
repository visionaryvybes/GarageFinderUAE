"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Map as MapIcon, X, Locate, AlertCircle,
  Sparkles, ChevronRight, TrendingUp, Star, Zap, Clock,
  Package, BadgeCheck,
} from "lucide-react";
import Hero from "@/components/Hero";
import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import WhyUs from "@/components/WhyUs";
import LiveStats from "@/components/LiveStats";
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
      <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const HAS_API_KEY = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function HomeContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [places, setPlaces] = useState<ExtendedPlaceResult[]>([]);
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

  /* ── Search Logic ── */
  const searchPlaces = useCallback(async (query: string, isAI = true, brandId: string | null = null) => {
    setIsLoading(true);
    setSearchPerformed(true);
    setCurrentQuery(query);
    setAiAnalysis(null);
    if (brandId !== undefined) setActiveBrand(brandId);

    // No API key — show empty state, do not use mock data
    if (!HAS_API_KEY) {
      await new Promise(r => setTimeout(r, 400));
      setPlaces([]);
      setIsDemoMode(true);
      setIsLoading(false);
      return;
    }

    // LIVE API FLOW
    try {
      const center = userLocation || mapCenter;
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

  // Handle ?q= param from service page links
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
    // Re-run the search with new filters applied (live data only)
    if (searchPerformed) {
      searchPlaces(currentQuery, false, activeBrand);
    }
  }, [searchPerformed, activeBrand, currentQuery, searchPlaces]);

  useEffect(() => {
    if (userLocation && !searchPerformed && !initialQuery) {
      searchPlaces("auto repair in UAE", false);
    }
  }, [userLocation, searchPerformed, searchPlaces, initialQuery]);

  // Split results by type
  const serviceShops = places.filter(p => (p as ExtendedPlaceResult).placeType !== "parts");
  const partsShops = places.filter(p => (p as ExtendedPlaceResult).placeType === "parts");

  const brandName = activeBrand
    ? activeBrand.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : null;

  return (
    <div className="min-h-screen bg-black text-zinc-100">

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Logo */}
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
              <div className="absolute inset-0 bg-violet-600 rounded-xl blur opacity-40" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Wrench className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[17px] font-black tracking-tight leading-none text-white">
                Garage<span className="text-violet-400">Finder</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium tracking-wide">UAE · AI-POWERED</p>
            </div>
          </button>

          {/* Search */}
          <div className="flex-1">
            <SearchBar onSearch={searchPlaces} isLoading={isLoading} />
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2">
            <RegionPicker value={selectedRegion} onChange={(key) => {
              setSelectedRegion(key);
              const region = UAE_REGIONS[key];
              if (region) setMapCenter({ lat: region.lat, lng: region.lng });
              if (searchPerformed) searchPlaces(currentQuery, false, activeBrand);
            }} />

            <button
              onClick={() => setShowMap(!showMap)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all
                ${showMap
                  ? "bg-violet-500/10 border-violet-500/40 text-violet-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{showMap ? "Hide Map" : "Map"}</span>
            </button>
          </div>
        </div>

        {/* Brand bar */}
        <BrandBar activeBrand={activeBrand} onBrandSelect={handleBrandSelect} />

        {/* Filter bar */}
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
            Live search requires a Google Maps API key in <code className="text-amber-400 font-mono">.env.local</code> as <code className="text-amber-400 font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>.
          </p>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-10">

        {/* AI Insight */}
        {aiAnalysis && (
          <AIInsight analysis={aiAnalysis} onDismiss={() => setAiAnalysis(null)} />
        )}

        {/* ── HERO / LANDING ── */}
        {!searchPerformed && !isLoading && (
          <Hero onSearch={searchPlaces} />
        )}

        {!searchPerformed && (
          <>
            <ServiceBentoGrid onSearch={searchPlaces} />
            <LiveStats />
            <WhyUs />
            <Testimonials />
            <CTABanner onSearch={searchPlaces} />
          </>
        )}

        {/* ── LOADING SKELETONS ── */}
        {isLoading && (
          <section>
            <div className="skeleton h-6 w-40 mb-4 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
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
            {/* Section header */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2 flex-wrap">
                  {brandName ? (
                    <>
                      <span>{brandName}</span>
                      <span className="text-zinc-500">Specialists</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-400">
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
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-violet-400" /> AI matched</span>
              </div>
            </div>

            {/* Service Centres */}
            {serviceShops.length > 0 && (
              <>
                {/* Top 3 */}
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
                          onSelect={(p) => handlePlaceSelect(p.place_id)}
                          tierLabel={activeBrand ? getBrandTierLabel(place.place_id, activeBrand) : null}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Remaining */}
                {serviceShops.length > 3 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <BadgeCheck className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm font-bold text-zinc-400">More Nearby</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {serviceShops.slice(3).map((place) => (
                        <ShopCard
                          key={place.place_id}
                          place={place}
                          onSelect={(p) => handlePlaceSelect(p.place_id)}
                          tierLabel={activeBrand ? getBrandTierLabel(place.place_id, activeBrand) : null}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Spare Parts */}
            {partsShops.length > 0 && (
              <div className="mt-8 pt-8 border-t border-zinc-800/60">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-bold text-zinc-300">Spare Parts Stores</span>
                  <span className="text-xs text-zinc-600">{partsShops.length} locations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partsShops.map((place) => (
                    <ShopCard
                      key={place.place_id}
                      place={place}
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
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-zinc-700" />
            </div>
            {!HAS_API_KEY ? (
              <>
                <h3 className="text-lg font-bold text-zinc-400 mb-2">Google Maps API key required</h3>
                <p className="text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
                  Add your <code className="text-zinc-400 bg-[#111] px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to <code className="text-zinc-400 bg-[#111] px-1.5 py-0.5 rounded font-mono">.env.local</code> to search live UAE data.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-zinc-400 mb-2">No results found</h3>
                <p className="text-sm text-zinc-600 mb-4">Try adjusting your filters, expanding your area, or using different keywords.</p>
                <button
                  onClick={() => { setFilters(DEFAULT_FILTERS); searchPlaces(currentQuery, false, activeBrand); }}
                  className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"
                >
                  Clear filters & retry
                </button>
              </>
            )}
          </div>
        )}

        {/* ── TRENDING ── */}
        {!isLoading && (
          <section className={searchPerformed ? "border-t border-zinc-800/60 pt-8" : ""}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <h3 className="text-lg font-bold text-zinc-100">Trending in UAE</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "BMW specialist Dubai",      tag: "Popular" },
                { label: "Oil change near me",        tag: "Quick"   },
                { label: "Emergency towing UAE",      tag: "Urgent"  },
                { label: "Check engine light",        tag: "AI"      },
                { label: "Tyre change Abu Dhabi",     tag: "Quick"   },
                { label: "AC repair Sharjah",         tag: "Hot"     },
                { label: "Ceramic coating Dubai",     tag: "Trending"},
                { label: "Pre-purchase inspection",   tag: "Smart"   },
              ].map(({ label, tag }) => (
                <button
                  key={label}
                  onClick={() => searchPlaces(label, true)}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left group"
                >
                  <span className="text-sm text-zinc-400 group-hover:text-white transition-colors line-clamp-1">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-violet-400 transition-colors shrink-0 ml-1" />
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
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-4 py-3 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/60">
              <h2 className="font-bold text-zinc-100 flex-1">
                {places.length} locations on map
              </h2>
              <button
                onClick={handleLocate}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-violet-500/40 transition-colors"
              >
                <Locate className="w-4 h-4 text-zinc-400" />
              </button>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-600 transition-colors"
              >
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

      {/* ── SHOP DETAIL PANEL ── */}
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
        <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
