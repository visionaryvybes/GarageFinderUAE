"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Locate,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Sparkles,
  List,
  Map as MapIcon,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import AIInsight from "@/components/AIInsight";
import { SERVICE_TYPE_KEYWORDS, DEFAULT_CENTER } from "@/lib/google-maps";
import type { PlaceResult, ServiceType } from "@/types";

// Dynamic import for Map (no SSR)
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-text-muted">Loading map...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom] = useState(13);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ServiceType>("all");
  const [openNow, setOpenNow] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("map");
  const [aiAnalysis, setAiAnalysis] = useState<{
    possibleIssue: string;
    estimatedCostRange: string;
    urgency: "low" | "medium" | "high";
    serviceType: string;
  } | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  // Get user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        () => {
          // Fallback to default center
          setMapCenter(DEFAULT_CENTER);
        }
      );
    }
  }, []);

  // Search for places
  const searchPlaces = useCallback(
    async (query: string, isAI: boolean = false) => {
      setIsLoading(true);
      setSearchPerformed(true);
      setCurrentQuery(query);
      setAiAnalysis(null);

      try {
        if (isAI) {
          // AI-powered search
          const res = await fetch("/api/ai-search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query,
              lat: userLocation?.lat || mapCenter.lat,
              lng: userLocation?.lng || mapCenter.lng,
            }),
          });
          const data = await res.json();
          setPlaces(data.results || []);
          if (data.analysis) {
            setAiAnalysis(data.analysis);
          }
        } else {
          // Standard search
          const params = new URLSearchParams({
            query: query,
            lat: String(userLocation?.lat || mapCenter.lat),
            lng: String(userLocation?.lng || mapCenter.lng),
            openNow: String(openNow),
          });

          const res = await fetch(`/api/places?${params}`);
          const data = await res.json();
          setPlaces(data.results || []);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userLocation, mapCenter, openNow]
  );

  // Filter change handler
  const handleFilterChange = useCallback(
    (filter: ServiceType) => {
      setActiveFilter(filter);
      const keyword = SERVICE_TYPE_KEYWORDS[filter] || "auto repair";
      searchPlaces(keyword, false);
    },
    [searchPlaces]
  );

  // Open Now filter
  const handleOpenNowChange = useCallback(
    (value: boolean) => {
      setOpenNow(value);
      if (searchPerformed) {
        const keyword =
          currentQuery ||
          SERVICE_TYPE_KEYWORDS[activeFilter] ||
          "auto repair";
        // Re-search with updated filter
        setTimeout(() => searchPlaces(keyword, false), 0);
      }
    },
    [searchPerformed, currentQuery, activeFilter, searchPlaces]
  );

  // Place selection
  const handlePlaceSelect = useCallback((placeId: string) => {
    setSelectedPlaceId(placeId);
    setShowDetail(true);
  }, []);

  // Locate user
  const handleLocateUser = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
      });
    }
  }, []);

  // Initial search on location
  useEffect(() => {
    if (userLocation && !searchPerformed) {
      searchPlaces("auto repair", false);
    }
  }, [userLocation, searchPerformed, searchPlaces]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-border px-4 py-3 z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-zinc-950" />
            </div>
            <h1 className="text-lg font-bold hidden sm:block">
              Garage<span className="text-accent">Finder</span>
            </h1>
          </div>
          <div className="flex-1">
            <SearchBar onSearch={searchPlaces} isLoading={isLoading} />
          </div>
        </div>
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          openNow={openNow}
          onOpenNowChange={handleOpenNowChange}
        />
      </header>

      {/* Mobile view toggle */}
      <div className="sm:hidden flex border-b border-border">
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${
            mobileView === "list"
              ? "text-accent border-b-2 border-accent"
              : "text-text-muted"
          }`}
        >
          <List className="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${
            mobileView === "map"
              ? "text-accent border-b-2 border-accent"
              : "text-text-muted"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          Map
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - Results list */}
        <div
          className={`
            ${sidebarCollapsed ? "w-0" : "w-full sm:w-[380px]"}
            ${mobileView === "map" ? "hidden sm:flex" : "flex"}
            flex-col border-r border-border bg-zinc-950 transition-all duration-300 overflow-hidden shrink-0
          `}
        >
          {/* Results header */}
          <div className="px-4 py-2 border-b border-border flex items-center justify-between shrink-0">
            <span className="text-xs text-text-muted">
              {isLoading
                ? "Searching..."
                : `${places.length} results found`}
            </span>
            {places.length > 0 && (
              <span className="text-xs text-text-muted">
                Near{" "}
                {userLocation ? "your location" : "default area"}
              </span>
            )}
          </div>

          {/* AI Insight */}
          {aiAnalysis && (
            <div className="px-3 pt-3">
              <AIInsight
                analysis={aiAnalysis}
                onDismiss={() => setAiAnalysis(null)}
              />
            </div>
          )}

          {/* Places list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-border bg-surface"
                >
                  <div className="flex gap-3">
                    <div className="skeleton w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                      <div className="skeleton h-3 w-2/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : places.length === 0 && searchPerformed ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MapPin className="w-12 h-12 text-text-muted mb-3" />
                <p className="text-text-secondary font-medium">
                  No results found
                </p>
                <p className="text-sm text-text-muted mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : !searchPerformed ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Sparkles className="w-12 h-12 text-accent/40 mb-3" />
                <p className="text-text-secondary font-medium">
                  Find your perfect mechanic
                </p>
                <p className="text-sm text-text-muted mt-1 max-w-xs">
                  Search for shops or describe your car problem — our AI will
                  match you with the right specialist
                </p>
              </div>
            ) : (
              places.map((place, index) => (
                <PlaceCard
                  key={place.place_id}
                  place={place}
                  index={index}
                  isSelected={place.place_id === selectedPlaceId}
                  onClick={() => handlePlaceSelect(place.place_id)}
                  userLocation={userLocation}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar collapse toggle (desktop) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-5 h-12 items-center justify-center bg-surface border border-border rounded-r-lg hover:bg-surface-hover transition-colors"
          style={{ left: sidebarCollapsed ? 0 : "380px" }}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Map */}
        <div
          className={`
            flex-1 relative
            ${mobileView === "list" ? "hidden sm:block" : "block"}
          `}
        >
          <Map
            places={places}
            selectedPlaceId={selectedPlaceId}
            onPlaceSelect={handlePlaceSelect}
            center={mapCenter}
            zoom={mapZoom}
            userLocation={userLocation}
          />

          {/* Locate me button */}
          <button
            onClick={handleLocateUser}
            className="absolute bottom-6 right-6 p-3 bg-surface border border-border rounded-full shadow-lg hover:bg-surface-hover transition-colors z-10"
            title="Find my location"
          >
            <Locate className="w-5 h-5 text-text-primary" />
          </button>

          {/* Place Detail Panel */}
          <PlaceDetail
            placeId={showDetail ? selectedPlaceId : null}
            onClose={() => {
              setShowDetail(false);
              setSelectedPlaceId(null);
            }}
            userLocation={userLocation}
          />
        </div>
      </div>
    </div>
  );
}
