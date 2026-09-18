import { describe, expect, it } from "vitest";
import { critiqueArchitecturalDesign, validateCritique } from "./arquiDesignCritic";
import type { ArchitecturalDesignReading } from "./arquiArchitecturalReading";

const reading = (overrides: Partial<ArchitecturalDesignReading> = {}): ArchitecturalDesignReading => ({
  alternativeId: "UPAO-001-B", sourceStrategyId: "strategy-b", sourcePartiId: "strategy-b", sourceOrganizationId: "org-b", sourceRealizationPlanId: "plan-b", observedElements: [], observedHierarchy: [], observedRelationships: [], observedMassVoid: { massCount: 4, footprintType: "multipolygon", centralVoid: "OBSERVED", status: "COMPUTED", basis: ["geometry"] }, observedAccess: { status: "UNKNOWN", basis: [] }, observedCirculation: { status: "OBSERVED", elementIds: ["circ"], basis: ["geometry"] }, observedVerticalOrganization: { status: "OBSERVED", floorCount: 4, height: 12, basis: ["metadata"] }, observedSiteRelationship: { status: "OBSERVED", position: "WITHIN_SITE", basis: ["geometry"] }, correspondence: [
    { expected: "CENTRAL_VOID", status: "PRESERVED", observed: "four masses around void", basis: ["geometry"] },
    { expected: "CIRCULATION_LOOP", status: "UNVERIFIABLE", observed: "loop semantics unavailable", basis: ["geometry"] },
    { expected: "PROGRAM_ZONES", status: "UNVERIFIABLE", observed: "no program assignment", basis: ["absence"] },
  ], transformations: [], missingExpectedElements: [], unverifiableElements: ["CIRCULATION_LOOP", "PROGRAM_ZONES"], contradictions: [], provenance: ["A15"], epistemicStatus: "DERIVED", noCritique: true, noRecommendation: true, noMutation: true, noDecision: true, ...overrides });

describe("A16 traceable architectural critic", () => {
  it("creates aligned, unresolved and unknown findings from A15 without inventing defects", () => {
    const result = critiqueArchitecturalDesign({ reading: reading() });
    expect(result.findings.find((item) => item.kind === "ALIGNED")?.category).toBe("MASS_VOID");
    expect(result.findings.find((item) => item.kind === "UNRESOLVED")?.category).toBe("CIRCULATION");
    expect(result.findings.find((item) => item.kind === "UNKNOWN")?.category).toBe("PROGRAM");
    expect(result.noQualityScore).toBe(true);
  });
  it("creates a bounded hypothesis but never an operation or recommendation", () => {
    const result = critiqueArchitecturalDesign({ reading: reading() });
    expect(result.hypotheses[0].candidateCapability).toBe("CREATE_SPINE");
    expect(result.hypotheses[0].capabilityStatus).toBe("UNSUPPORTED");
    expect(result.hypotheses[0].epistemicStatus).toBe("HYPOTHESIS");
    expect(result.hypotheses[0].noExecution).toBe(true);
    expect(result.noDecision).toBe(true);
  });
  it("exposes an explicit geometric conflict with its basis", () => {
    const result = critiqueArchitecturalDesign({ reading: reading({ contradictions: [{ expected: "SEPARATED_MASSES", observed: "mass-1 overlaps mass-2", basis: ["geometry"] }] }) });
    expect(result.findings.some((item) => item.kind === "CONFLICT" && item.basis.includes("OBSERVED_GEOMETRY"))).toBe(true);
  });
  it("does not create performance, compliance, winner or autonomous loop claims", () => {
    const result = critiqueArchitecturalDesign({ reading: reading() });
    expect(validateCritique(result)).toBe(true);
    expect(result.findings.some((item) => /daylight|comfort|ventilation|compliance|optimal|best/i.test(`${item.observation} ${item.interpretation} ${item.implication}`))).toBe(false);
    expect(result.noWinner).toBe(true);
    expect(result.noAutonomousLoop).toBe(true);
    expect(result.noGeometryMutation).toBe(true);
  });
  it("allows objective context without inventing attainment percentage", () => {
    const result = critiqueArchitecturalDesign({ reading: reading(), projectObjectives: ["MAXIMIZE PUBLIC OPEN SPACE"] });
    expect(result.tradeoffs[0]).toContain("no measurable target");
    expect(result.tradeoffs[0]).not.toContain("%");
  });
});
