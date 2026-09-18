import { describe, expect, it } from "vitest";
import { applyCrazyProfile, simulateHouseEnvironment } from "./houseEnvironmentalCrazy";

describe("house environmental and CRAZY exploration", () => {
  it("simulates daylight as a proxy and keeps thermal comfort unassessed", () => {
    const result = simulateHouseEnvironment();
    expect(result.daylightByLevel).toHaveLength(2);
    expect(result.daylightByLevel.every((item) => item.daylightContext === "PARTIAL_PROXY")).toBe(true);
    expect(result.daylightByLevel.every((item) => item.estimatedLuxBand === "MEDIUM")).toBe(true);
    expect(result.thermalByLevel.every((item) => item.thermalContext === "AMBIENT_CONTEXT")).toBe(true);
    expect(result.comfort).toBe("NOT_ASSESSED");
    expect(result.thermalByLevel.every((item) => item.noComfortFormula && item.noThermalSimulation)).toBe(true);
  });

  it("applies hyperbolic and ruled CRAZY surfaces without losing level identity", () => {
    const result = applyCrazyProfile();
    expect(result.shapeFamilies).toEqual(["RULED_SURFACE", "HYPERBOLIC_PROFILE"]);
    expect(result.rooms.filter((room) => room.levelId === "N1").length).toBeGreaterThan(0);
    expect(result.rooms.filter((room) => room.levelId === "N2").length).toBeGreaterThan(0);
    expect(result.structuralHypothesis.hyperbolicChecks).toContain("BUCKLING_NOT_ASSESSED");
    expect(result.validation.preserved).toContain("vertical cores");
    expect(result.validation.humanReviewRequired).toBe(true);
  });
});
