import { describe, expect, it } from "vitest";
import { appendDesignMemoryEntry, createDesignMemory, recordHumanDesignDecision, type DesignMemoryDecision } from "./a21DesignMemory";
import { generateFloorPlanAlternative, validateFloorPlanAlternative, crossValidateN2DesignMemory, type A24Core } from "./a24IntelligentFloorplan";
import type { SpatialZoneProposal } from "./a21SpatialRelationships";

const site = { minX: 0, minY: 0, maxX: 24, maxY: 16 };
const core: A24Core = { coreId: "CORE-N1-N2", coreType: "STAIR_AND_ELEVATOR", levelIds: ["N1", "N2"], footprint: { minX: 10, minY: 6, maxX: 14, maxY: 10 }, continuityState: "CONTINUOUS", provenance: ["A22.core-transition:N1-N2"] };
const zone = (zoneId: string, programItemIds: string[], level: string): SpatialZoneProposal => ({ zoneId, name: `${level} ${zoneId}`, zoneType: "PRIVATE", programItemIds, rationale: "Human reviewed N2 zone", supportingRelationIds: [], excludedRelationIds: [], provenance: [`A24.fixture:${level}`, "decision:1"], epistemicState: "HUMAN_CONFIRMED", status: "HUMAN_CONFIRMED", noGeometryMutation: true, noDecision: true });

describe("A24 intelligent floorplan generation", () => {
  it("keeps CRAZY geometry bounded and connected to a continuous vertical core", () => {
    const plan = generateFloorPlanAlternative({ projectId: "UPAO-001", alternativeId: "UPAO-001-A", profile: "CRAZY", levelIds: ["N1", "N2"], site, zones: [zone("n2-private", ["BEDROOM-N2"], "N2")], cores: [core], spaces: [{ spaceId: "BEDROOM-N2", programId: "BEDROOM", levelId: "N2", zoneId: "n2-private" }] });
    expect(plan.shapeFamilies).toEqual(["RULED_SURFACE", "HYPERBOLIC_PROFILE"]);
    expect(plan.constructabilityState).toBe("CONTROLLED_HYPOTHESIS");
    expect(plan.spaces[0]?.coreAccess).toContain("CORE-N1-N2");
    const validated = validateFloorPlanAlternative(plan, site);
    expect(validated.validationState).toBe("SUPPORTED");
    expect(validated.conflicts).toEqual([]);
    expect(validated.noAutomaticDecision).toBe(true);
  });

  it("rejects a generated space outside the site instead of accepting absurd geometry", () => {
    const plan = generateFloorPlanAlternative({ projectId: "UPAO-001", alternativeId: "UPAO-001-A", profile: "CRAZY", levelIds: ["N1", "N2"], site, zones: [zone("n2-private", ["BEDROOM-N2"], "N2")], cores: [core], spaces: [{ spaceId: "BEDROOM-N2", programId: "BEDROOM", levelId: "N2", zoneId: "n2-private" }] });
    const invalid = { ...plan, spaces: [{ ...plan.spaces[0], footprint: { minX: 100, minY: 100, maxX: 110, maxY: 110 } }] };
    expect(validateFloorPlanAlternative(invalid, site).validationState).toBe("CONFLICTING");
    expect(validateFloorPlanAlternative(invalid, site).conflicts).toContain("SPACE_OUTSIDE_SITE_OR_INVALID");
  });

  it("cross-validates an explicitly human-confirmed N2 zoning decision", () => {
    let memory = createDesignMemory("UPAO-001", "branch-n2");
    memory = appendDesignMemoryEntry(memory, { entryId: "entry-zone-n2", entryType: "ZONE_CONFIRMED", branchId: "branch-n2", author: "ARCHITECT", trigger: "N2 zoning review", statement: "N2 PRIVATE zone confirmed for BEDROOM-N2", architecturalQuestion: "Which private spaces belong on N2?", observations: ["N2 private zone reviewed"], alternativesConsidered: ["n2-private"], selectedAlternative: "n2-private", rejectedAlternatives: [], tradeoffIds: [], consequences: ["N2 remains private"], unresolvedQuestions: [], sourceRefs: ["A21"], geometryRefs: [], programRefs: ["BEDROOM-N2"], adjacencyRefs: [], zoningRefs: ["n2-private"], circulationRefs: [], reviewState: "CONFIRMED", epistemicState: "HUMAN_CONFIRMED" });
    const decision: Omit<DesignMemoryDecision, "decisionId" | "createdAt" | "humanConfirmed"> = { memoryEntryId: "entry-zone-n2", actor: "architect-01", statement: "N2 zoning selected", scope: "ZONE", selectedBranchId: "branch-n2", rejectedBranchIds: [], reason: "N2 private zone preserves privacy", constraintsAcknowledged: ["CORE-N1-N2"], evidenceAcknowledged: ["n2-private"] };
    memory = recordHumanDesignDecision(memory, decision);
    const result = crossValidateN2DesignMemory(memory, [zone("n2-private", ["BEDROOM-N2"], "N2")], memory.decisions, "N2");
    expect(result.state).toBe("SUPPORTED");
    expect(result.memoryValid).toBe(true);
    expect(result.zoningValid).toBe(true);
    expect(result.zoneRefs).toContain("n2-private");
    expect(result.noAutomaticDecision).toBe(true);
  });
});
