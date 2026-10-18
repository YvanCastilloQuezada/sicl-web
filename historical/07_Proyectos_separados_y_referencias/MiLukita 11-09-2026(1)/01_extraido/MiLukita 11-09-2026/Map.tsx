/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 * </MapView>
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new google.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new google.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 * new google.maps.marker.AdvancedMarkerElement({ map, position: place.location });
 *
 * -------------------------------
 * 🧭 GEOCODER (from `geocoding` library)
 * - Standalone service; manually apply results to map.
 * const geocoder = new google.maps.Geocoder();
 * geocoder.geocode({ address: "New York" }, (results, status) => {
 *   if (status === "OK" && results[0]) {
 *     map.setCenter(results[0].geometry.location);
 *     new google.maps.marker.AdvancedMarkerElement({
 *       map,
 *       position: results[0].geometry.location,
 *     });
 *   }
 * });
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new google.maps.DirectionsService();
 * const directionsRenderer = new google.maps.DirectionsRenderer({ map });
 * directionsService.route(
 *   { origin, destination, travelMode: "DRIVING" },
 *   (res, status) => status === "OK" && directionsRenderer.setDirections(res)
 * );
 *
 * -------------------------------
 * 🌦️ MAP LAYERS (attach directly to map)
 * - new google.maps.TrafficLayer().setMap(map);
 * - new google.maps.TransitLayer().setMap(map);
 * - new google.maps.BicyclingLayer().setMap(map);
 *
 * -------------------------------
 * ✅ SUMMARY
 * - “map-attached” → AdvancedMarkerElement, DirectionsRenderer, Layers.
 * - “standalone” → Geocoder, DirectionsService, DistanceMatrixService, ElevationService.
 * - “data-only” → Place, Geometry utilities.
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

function loadMapScript(): Promise<boolean> {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve(true);
      script.remove(); // Clean up immediately
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      script.remove();
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

export interface MapProviderAdapter {
  id: "google-maps-proxy";
  label: string;
  load: () => Promise<boolean>;
  isReady: () => boolean;
  create: (container: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
}

export const googleMapsProxyAdapter: MapProviderAdapter = {
  id: "google-maps-proxy",
  label: "Google Maps proxy",
  load: loadMapScript,
  isReady: () => Boolean(window.google?.maps),
  create: (container, options) => new window.google!.maps.Map(container, options),
};

export interface MapMarker {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  status?: string;
  label?: string;
  onClick?: () => void;
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  zoom?: number;
  center?: google.maps.LatLngLiteral;
  onZoomChanged?: (zoom: number) => void;
  onViewportChanged?: (viewport: { zoom: number; bounds: { north: number; south: number; east: number; west: number } | null }) => void;
  markers?: MapMarker[];
  onMapReady?: (map: google.maps.Map) => void;
  provider?: MapProviderAdapter;
}

export function MapView({
  className,
  initialCenter = { lat: -8.1116, lng: -79.0287 },
  initialZoom = 13,
  zoom,
  center,
  onZoomChanged,
  onViewportChanged,
  markers = [],
  onMapReady,
  provider = googleMapsProxyAdapter,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markerRefs = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [ready, setReady] = useState(false);

  const init = usePersistFn(async () => {
    await provider.load();
    if (!mapContainer.current) {
      console.error("Map container not found");
      return;
    }
    if (!provider.isReady()) {
      return;
    }
    map.current = provider.create(mapContainer.current, {
      zoom: zoom ?? initialZoom,
      center: initialCenter,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: true,
      mapId: "DEMO_MAP_ID",
    });
    if (onMapReady) {
      onMapReady(map.current);
    }
    const reportViewport = () => {
      const currentZoom = map.current?.getZoom();
      const currentBounds = map.current?.getBounds()?.toJSON();
      if (typeof currentZoom === "number") {
        onZoomChanged?.(currentZoom);
        onViewportChanged?.(currentBounds ? { zoom: currentZoom, bounds: { north: currentBounds.north, south: currentBounds.south, east: currentBounds.east, west: currentBounds.west } } : { zoom: currentZoom, bounds: null });
      }
    };
    map.current.addListener("zoom_changed", reportViewport);
    map.current.addListener("bounds_changed", reportViewport);
    setReady(true);
  });

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!map.current || !window.google?.maps?.marker?.AdvancedMarkerElement) return;
    markerRefs.current.forEach(marker => { marker.map = null; });
    markerRefs.current = markers.map(marker => {
      const content = document.createElement("button");
      content.type = "button";
      content.title = marker.title;
      content.setAttribute("aria-label", marker.title);
      content.style.width = "28px";
      content.style.height = "28px";
      content.style.borderRadius = "50%";
      content.style.border = "2px solid #071914";
      content.style.background = marker.status === "PUBLISHED" ? "#6ef7ba" : marker.status === "CONFLICT" || marker.status === "DISPUTED" ? "#ffc078" : "#7ae7d2";
      content.style.boxShadow = "0 0 0 4px rgba(101,247,215,.22)";
      content.style.cursor = "pointer";
      content.textContent = marker.label ?? "";
      content.style.color = "#062019";
      content.style.fontWeight = "800";
      content.style.fontSize = "11px";
      content.addEventListener("click", () => marker.onClick?.());
      const instance = new window.google.maps.marker.AdvancedMarkerElement({ map: map.current, position: marker.position, title: marker.title, content });
      return instance;
    });
    return () => markerRefs.current.forEach(marker => { marker.map = null; });
  }, [markers, ready]);

  useEffect(() => {
    if (map.current && center) map.current.panTo(center);
  }, [center]);

  useEffect(() => {
    if (map.current && typeof zoom === "number" && map.current.getZoom() !== zoom) map.current.setZoom(zoom);
  }, [zoom]);

  return <div ref={mapContainer} className={cn("h-[390px] w-full", className)} aria-label="Mapa cartográfico real" />;
}
