import { describe, expect, it } from "vitest";
import { googleMapsProxyAdapter } from "../client/src/components/Map";
import { offlineMapTileUrls, offlineMapTileUrlsForPolygon } from "../client/src/components/TerritorialFieldTools";

describe("territorial order 37", () => {
  it("expone el proveedor cartográfico detrás de un adapter estable", () => {
    expect(googleMapsProxyAdapter.id).toBe("google-maps-proxy");
    expect(googleMapsProxyAdapter.label).toContain("Google Maps");
    expect(typeof googleMapsProxyAdapter.load).toBe("function");
  });

  it("genera una zona offline determinista y acotada", () => {
    const urls = offlineMapTileUrls(-8.1116, -79.0287, 13, 1);
    expect(urls).toHaveLength(9);
    expect(new Set(urls).size).toBe(9);
    expect(urls.every(url => /^https:\/\/tile\.openstreetmap\.org\/13\/\d+\/\d+\.png$/.test(url))).toBe(true);
  });

  it("genera teselas acotadas para una zona poligonal", () => {
    const urls = offlineMapTileUrlsForPolygon([
      { lat: -8.12, lng: -79.04 },
      { lat: -8.10, lng: -79.04 },
      { lat: -8.10, lng: -79.02 },
      { lat: -8.12, lng: -79.02 },
    ], 13);
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.length).toBeLessThanOrEqual(25);
    expect(urls.every(url => /^https:\/\/tile\.openstreetmap\.org\/13\/\d+\/\d+\.png$/.test(url))).toBe(true);
    expect(offlineMapTileUrlsForPolygon([{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }], 13)).toEqual([]);
  });

  it("limita zoom y radio para evitar descargas ilimitadas", () => {
    expect(offlineMapTileUrls(-8.1116, -79.0287, 0, 99)).toHaveLength(9);
    expect(offlineMapTileUrls(-8.1116, -79.0287, 99, -2)[0]).toMatch(/\/16\/\d+\/\d+\.png$/);
  });
});
