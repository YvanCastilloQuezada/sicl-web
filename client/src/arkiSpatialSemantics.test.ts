import { describe, expect, it } from "vitest";
import { BLOCK_2_RULES, classifySpace, resolveSpatialBoundary, wallIsBoundaryRealization } from "@shared/arkiSpatialSemantics";

describe("E-KNOW Block 2 spatial semantics", () => {
  it("keeps an open shared patio as SPACE, not ROOM", () => {
    const result = classifySpace({ id: "PATIO-01", activities: ["gather", "light"], identifiableExtent: true, enclosure: "OPEN", dedicatedUse: "SHARED", accessCondition: "direct", continuity: "CONTINUOUS" });
    expect(result.classification).toBe("SPACE");
    expect(result.isSpace).toBe(true);
    expect(result.isRoom).toBe(false);
    expect(result.epistemicStatus).toBe("HYPOTHESIS");
    expect(result.kState).toBe("K2_CANDIDATE");
  });

  it("classifies a closed dedicated accessible entity as a candidate ROOM", () => {
    const result = classifySpace({ id: "ROOM-01", activities: ["sleep"], identifiableExtent: true, enclosure: "CLOSED", dedicatedUse: true, accessCondition: "door", continuity: "DISCRETE" });
    expect(result.classification).toBe("ROOM");
    expect(result.isRoom).toBe(true);
    expect(result.unknowns).toHaveLength(0);
  });

  it("does not infer a wall from perceptual differentiation when air, light and circulation remain shared", () => {
    const result = resolveSpatialBoundary({ boundaryId: "B-01", differentiatedActivities: ["read", "talk"], requirement: "VISUAL", sharedAirAllowed: true, sharedLightAllowed: true, sharedCirculationAllowed: true, separationCanBeTemporal: true, wallEvidence: false });
    expect(result.wallDecision).toBe("NOT_REQUIRED");
    expect(result.boundaryKind).toBe("VISUAL");
    expect(wallIsBoundaryRealization(result)).toBe(false);
    expect(result.epistemicStatus).toBe("HYPOTHESIS");
  });

  it("keeps wall selection conditional when the required effect is known but evidence is incomplete", () => {
    const result = resolveSpatialBoundary({ boundaryId: "B-02", differentiatedActivities: ["lab", "public"], requirement: "ACCESS", sharedAirAllowed: false, sharedLightAllowed: true, sharedCirculationAllowed: false, separationCanBeTemporal: false, wallEvidence: false });
    expect(result.wallDecision).toBe("CONDITIONAL");
    expect(result.possibleRealizations).toContain("ACCESS_CONTROL");
    expect(result.possibleRealizations).toContain("CONSTRUCTIVE");
  });

  it("preserves UNKNOWN rather than inventing a wall requirement", () => {
    const result = resolveSpatialBoundary({ boundaryId: "B-03", differentiatedActivities: ["a", "b"], requirement: "UNKNOWN", sharedAirAllowed: "UNKNOWN", sharedLightAllowed: "UNKNOWN", sharedCirculationAllowed: "UNKNOWN", separationCanBeTemporal: "UNKNOWN", wallEvidence: "UNKNOWN" });
    expect(result.wallDecision).toBe("UNKNOWN");
    expect(result.unknowns.length).toBeGreaterThan(0);
    expect(wallIsBoundaryRealization(result)).toBe(false);
  });

  it("keeps the new rules proposed and human-review gated", () => {
    expect(BLOCK_2_RULES).toHaveLength(3);
    expect(BLOCK_2_RULES.every((rule) => rule.epistemicStatus === "HYPOTHESIS" && rule.kState === "K2_CANDIDATE" && rule.promotion === "HUMAN_REVIEW_REQUIRED")).toBe(true);
  });
});
