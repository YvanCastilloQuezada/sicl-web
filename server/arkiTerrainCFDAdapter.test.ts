import { describe, expect, it } from "vitest";
import {
  ARKI_TERRAIN_CFD_ADAPTER,
  readTerrain,
  simulateWind,
  type TerrainPoint
} from "./arkiTerrainCFDAdapter";

describe("ARKI Terrain & CFD Adapter", () => {
  const sampleTerrain: TerrainPoint[] = [
    { lat: -8.1, lon: -79.0, elevation: 50 },
    { lat: -8.2, lon: -79.1, elevation: 100 },
    { lat: -8.3, lon: -79.2, elevation: 150 },
    { lat: -8.4, lon: -79.3, elevation: 200 },
  ];

  it("declares basic implementation status", () => {
    expect(ARKI_TERRAIN_CFD_ADAPTER.status).toBe("BASIC_IMPLEMENTATION");
    expect(ARKI_TERRAIN_CFD_ADAPTER.limitations.length).toBeGreaterThan(0);
  });

  it("reads terrain elevations correctly", () => {
    const result = readTerrain(sampleTerrain);
    expect(result.elevations).toEqual([50, 100, 150, 200]);
    expect(result.min).toBe(50);
    expect(result.max).toBe(200);
    expect(result.avg).toBe(125);
  });

  it("throws on empty terrain", () => {
    expect(() => readTerrain([])).toThrow("TERRAIN_EMPTY");
  });

  it("simulates wind over terrain", () => {
    const terrain = readTerrain(sampleTerrain);
    const result = simulateWind(terrain, 10, 180);
    expect(result.windSpeed).toBeGreaterThan(0);
    expect(result.windDirection).toBe(180);
    expect(result.pressure).toBeGreaterThan(0);
    expect(result.turbulenceIntensity).toBeGreaterThan(0);
  });

  it("throws on invalid wind parameters", () => {
    const terrain = readTerrain(sampleTerrain);
    expect(() => simulateWind(terrain, -1, 180)).toThrow("WIND_SPEED_NEGATIVE");
    expect(() => simulateWind(terrain, 10, 400)).toThrow("WIND_DIRECTION_INVALID");
  });
});
