import { describe, expect, it } from "vitest";
import { A25_PRECEDENTS, analyzeDaylight, analyzeThermalContext, checkCrazyStructuralHypothesis, simulateEvacuationAndPedestrianFlow } from "./a25ArchitecturalIntelligence";
import type { A24FloorPlanAlternative } from "./a24IntelligentFloorplan";

const plan: A24FloorPlanAlternative = { floorPlanAlternativeId: "a24-floorplan:UPAO-001-A:crazy", projectId: "UPAO-001", alternativeId: "UPAO-001-A", profile: "CRAZY", levelIds: ["N1", "N2"], shapeFamilies: ["RULED_SURFACE", "HYPERBOLIC_PROFILE"], shapeParameters: { ruledSurfaceTwist: 0.22, hyperbolicCurvature: 0.16 }, spaces: [{ spaceId: "N2-BEDROOM", programId: "BEDROOM", levelId: "N2", zoneId: "n2-private", footprint: { minX: 1, minY: 1, maxX: 6, maxY: 5 }, adjacentTo: [], separatedFrom: [], coreAccess: ["CORE-N1-N2"], provenance: ["A24"] }], cores: [{ coreId: "CORE-N1-N2", coreType: "STAIR_AND_ELEVATOR", levelIds: ["N1", "N2"], footprint: { minX: 10, minY: 6, maxX: 14, maxY: 10 }, continuityState: "CONTINUOUS", provenance: ["A22"] }], unresolvedRequirements: [], conflicts: [], constructabilityState: "CONTROLLED_HYPOTHESIS", validationState: "SUPPORTED", humanReviewRequired: true, noAutomaticDecision: true, noAutomaticWinner: true, provenance: ["A24"] };

describe("A25 architectural intelligence", () => {
  it("keeps internet precedents attributable and non-authoritative", () => {
    expect(A25_PRECEDENTS.length).toBeGreaterThanOrEqual(3);
    expect(A25_PRECEDENTS.every((precedent) => precedent.sourceUrl.startsWith("https://"))).toBe(true);
    expect(A25_PRECEDENTS.every((precedent) => precedent.authorIsNotAgent && precedent.precedentIsNotRequirement)).toBe(true);
  });

  it("reports daylight as a partial proxy, never as annual simulation", () => {
    const result = analyzeDaylight(plan, { orientationDeg: 15, apertureToWallRatio: 0.35, sourceRefs: ["site:orientation"] });
    expect(result.state).toBe("SUPPORTED");
    expect(result.daylightContext).toBe("PARTIAL_PROXY");
    expect(result.noDaylightSimulation).toBe(true);
  });

  it("keeps ambient weather separate from thermal comfort", () => {
    const result = analyzeThermalContext(plan, { airTemperatureC: 26, relativeHumidityPct: 65, windSpeedMs: 2.4, sourceRefs: ["Open-Meteo:hourly"] });
    expect(result.state).toBe("SUPPORTED");
    expect(result.thermalContext).toBe("AMBIENT_CONTEXT");
    expect(result.comfortState).toBe("NOT_ASSESSED");
    expect(result.noThermalSimulation).toBe(true);
  });

  it("flags structural questions for ruled and hyperbolic CRAZY forms", () => {
    const result = checkCrazyStructuralHypothesis(plan);
    expect(result.state).toBe("PARTIAL");
    expect(result.ruledSurfaceChecks).toContain("LOAD_PATH_NOT_ASSESSED");
    expect(result.hyperbolicChecks).toContain("BUCKLING_NOT_ASSESSED");
    expect(result.noStructuralCertification).toBe(true);
  });

  it("finds N1 to N2 stair and elevator routes and exposes flow limits", () => {
    const result = simulateEvacuationAndPedestrianFlow({ plan, nodes: [
      { nodeId: "ORIGIN-N2", levelId: "N2", role: "ORIGIN", capacityPersons: 20, provenance: ["A24"] },
      { nodeId: "STAIR-N2", levelId: "N2", role: "STAIR", capacityPersons: 20, provenance: ["A22"] },
      { nodeId: "STAIR-N1", levelId: "N1", role: "STAIR", capacityPersons: 20, provenance: ["A22"] },
      { nodeId: "EXIT-N1", levelId: "N1", role: "EXIT", capacityPersons: 20, provenance: ["A25"] },
    ], edges: [
      { edgeId: "E1", from: "ORIGIN-N2", to: "STAIR-N2", lengthM: 4, capacityPersonsPerMin: 20, state: "OBSERVED", provenance: ["A22"] },
      { edgeId: "E2", from: "STAIR-N2", to: "STAIR-N1", lengthM: 3, capacityPersonsPerMin: 20, state: "OBSERVED", provenance: ["A23"] },
      { edgeId: "E3", from: "STAIR-N1", to: "EXIT-N1", lengthM: 4, capacityPersonsPerMin: 20, state: "OBSERVED", provenance: ["A20-P1"] },
    ], demandByOrigin: { "ORIGIN-N2": 15 }, exits: ["EXIT-N1"] });
    expect(result.state).toBe("PARTIAL");
    expect(result.routes[0]?.reachable).toBe(true);
    expect(result.routes[0]?.path).toEqual(["ORIGIN-N2", "STAIR-N2", "STAIR-N1", "EXIT-N1"]);
    expect(result.evacuationCompliance).toBe("NOT_ASSESSED");
  });
});
