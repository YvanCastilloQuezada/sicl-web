export type ArAvailability = "CHECKING" | "AVAILABLE" | "UNAVAILABLE";
export type GpsState = "UNKNOWN" | "REQUESTING" | "READY" | "DENIED" | "UNAVAILABLE";

export type PublishedPoi = {
  publicId: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "PUBLISHED";
};

export function isPublishedPoi(value: unknown): value is { publicId: string; name: string; latitude: string | number; longitude: string | number } {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.publicId === "string" && typeof item.name === "string" && Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude));
}

export function normalizePublishedPoi(value: { publicId: string; name: string; latitude: string | number; longitude: string | number }): PublishedPoi {
  return { publicId: value.publicId, name: value.name, latitude: Number(value.latitude), longitude: Number(value.longitude), status: "PUBLISHED" };
}

export function distanceMeters(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }): number {
  const earthRadius = 6371000;
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function arFallbackLabel(arAvailability: ArAvailability): string {
  return arAvailability === "AVAILABLE" ? "AR listo" : "Continuar en 2D";
}

export function canRenderPoi(poi: PublishedPoi): boolean {
  return poi.status === "PUBLISHED";
}
