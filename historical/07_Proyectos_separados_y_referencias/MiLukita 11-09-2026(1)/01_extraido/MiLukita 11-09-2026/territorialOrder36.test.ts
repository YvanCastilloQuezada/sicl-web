import { describe, expect, it } from "vitest";
import { clusterTerritorialPoints, matchesTerritorialMapFilters, openStreetMapTile } from "../client/src/components/TerritorialFieldTools";

describe("territorial order 36", () => {
  it("filters map points by sync status and explainable confidence", () => {
    expect(matchesTerritorialMapFilters({ sync: "SYNCED", confidence: 92 }, "SYNCED", "HIGH")).toBe(true);
    expect(matchesTerritorialMapFilters({ sync: "CONFLICT", confidence: 92 }, "SYNCED", "HIGH")).toBe(false);
    expect(matchesTerritorialMapFilters({ sync: "SYNCED", confidence: 45 }, "SYNCED", "HIGH")).toBe(false);
    expect(matchesTerritorialMapFilters({ sync: "SYNCED", confidence: 45 }, "SYNCED", "LOW")).toBe(true);
  });

  it("clusters nearby points while preserving the member records", () => {
    const clusters = clusterTerritorialPoints([{ id: "a", lat: -8.1116, lng: -79.0287 }, { id: "b", lat: -8.1117, lng: -79.0288 }, { id: "c", lat: -8.12, lng: -79.04 }]);
    expect(clusters).toHaveLength(2);
    expect(clusters.find(cluster => cluster.count === 2)?.members.map(member => member.id)).toEqual(["a", "b"]);
  });

  it("changes cluster granularity with the zoom precision", () => {
    const points = [{ id: "a", lat: -8.11161, lng: -79.02871 }, { id: "b", lat: -8.11169, lng: -79.02879 }];
    expect(clusterTerritorialPoints(points, 2)[0]?.count).toBe(2);
    expect(clusterTerritorialPoints(points, 4)).toHaveLength(2);
  });

  it("generates a valid OpenStreetMap raster tile URL around Trujillo", () => {
    const url = openStreetMapTile(-8.1116, -79.0287, 13);
    expect(url).toMatch(/^https:\/\/tile\.openstreetmap\.org\/13\/\d+\/\d+\.png$/);
  });
});
