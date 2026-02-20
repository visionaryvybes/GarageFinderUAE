"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { loadGoogleMaps, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/google-maps";
import type { PlaceResult } from "@/types";

interface MapProps {
  places: PlaceResult[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
  center: { lat: number; lng: number };
  zoom: number;
  onBoundsChange?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
    center: { lat: number; lng: number };
  }) => void;
  userLocation?: { lat: number; lng: number } | null;
}

// Dark mode map styles
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b8b8b" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1a2e1a" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a2a3e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3a3a4e" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2a2a3e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e6d8c" }],
  },
];

export default function Map({
  places,
  selectedPlaceId,
  onPlaceSelect,
  center,
  zoom,
  onBoundsChange,
  userLocation,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;

    loadGoogleMaps().then(async (maps) => {
      if (cancelled || !mapRef.current) return;

      try {
        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        await google.maps.importLibrary("marker");

        const map = new Map(mapRef.current, {
          center,
          zoom,
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy",
          mapId: "garage-finder-map",
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);

        map.addListener("idle", () => {
          const bounds = map.getBounds();
          const center = map.getCenter();
          if (bounds && center && onBoundsChange) {
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            onBoundsChange({
              north: ne.lat(),
              south: sw.lat(),
              east: ne.lng(),
              west: sw.lng(),
              center: { lat: center.lat(), lng: center.lng() },
            });
          }
        });
      } catch (err) {
        console.warn("Map initialization failed:", err);
      }
    }).catch((err) => {
      console.warn("Google Maps API failed to load:", err);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Update center
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(center);
    }
  }, [center.lat, center.lng]);

  // User location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
    }

    const dot = document.createElement("div");
    dot.innerHTML = `
      <div style="position:relative;">
        <div style="width:16px;height:16px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
        <div style="position:absolute;inset:-8px;border:2px solid rgba(66,133,244,0.3);border-radius:50%;animation:marker-pulse 2s infinite;"></div>
      </div>
    `;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: mapInstanceRef.current,
      position: userLocation,
      content: dot,
      title: "Your location",
    });

    userMarkerRef.current = marker;
  }, [userLocation, mapLoaded]);

  // Place markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    places.forEach((place, index) => {
      const isSelected = place.place_id === selectedPlaceId;

      const pin = document.createElement("div");
      pin.innerHTML = `
        <div style="
          display:flex;align-items:center;justify-content:center;
          width:${isSelected ? "36px" : "30px"};
          height:${isSelected ? "36px" : "30px"};
          background:${isSelected ? "#2563eb" : "#e4e4e7"};
          color:${isSelected ? "#ffffff" : "#3f3f46"};
          border-radius:50%;
          font-size:${isSelected ? "14px" : "12px"};
          font-weight:700;
          box-shadow:0 2px 8px rgba(0,0,0,${isSelected ? "0.4" : "0.2"});
          border:2px solid ${isSelected ? "#60a5fa" : "white"};
          transition:all 0.2s;
          cursor:pointer;
          ${isSelected ? "transform:scale(1.1);" : ""}
        ">${index + 1}</div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current!,
        position: place.geometry.location,
        content: pin,
        title: place.name,
        zIndex: isSelected ? 1000 : index,
      });

      marker.addListener("gmp-click", () => {
        onPlaceSelect(place.place_id);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have places
    if (places.length > 0 && !selectedPlaceId) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((p) => bounds.extend(p.geometry.location));
      if (userLocation) bounds.extend(userLocation);
      mapInstanceRef.current.fitBounds(bounds, {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60,
      });
    }
  }, [places, selectedPlaceId, mapLoaded]);

  // Pan to selected place
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlaceId) return;
    const place = places.find((p) => p.place_id === selectedPlaceId);
    if (place) {
      mapInstanceRef.current.panTo(place.geometry.location);
      if (mapInstanceRef.current.getZoom()! < 15) {
        mapInstanceRef.current.setZoom(15);
      }
    }
  }, [selectedPlaceId]);

  return (
    <div ref={mapRef} className="w-full h-full" style={{ minHeight: "400px" }} />
  );
}
