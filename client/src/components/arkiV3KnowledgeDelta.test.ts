import { describe, expect, it } from "vitest";
import { buildMinimumSystemRequirement } from "./arkiCanonicalFunctionalOperationalization";
import { ARKI_V3_KNOWLEDGE_BASE, ARKI_V3_KNOWLEDGE_UNITS, assessV3Capability, buildV3CapabilityAssessmentFromRequirement, deriveV3FlowSegment, deriveV3Relationship, summarizeV3Delta, validateV3CapabilityAssessment, validateV3KnowledgeUnit } from "./arkiV3KnowledgeDelta";
import { fromV3KnowledgeUnit } from "./arkiKnowledgeStore";

describe("ARKI v3.0 knowledge delta", () => {
  it("preserves the five semantic layers without creating parallel engines", () => {
    expect(ARKI_V3_KNOWLEDGE_BASE.layers).toHaveLength(5);
    expect(ARKI_V3_KNOWLEDGE_BASE.noParallelEngine).toBe(true);
    expect(ARKI_V3_KNOWLEDGE_BASE.humanAuthority).toBe(true);
    expect(ARKI_V3_KNOWLEDGE_UNITS.every(validateV3KnowledgeUnit)).toBe(true);
  });

  it("assesses capability satisfaction from provider, interface, capacity, performance and evidence", () => {
    const requirement = buildMinimumSystemRequirement({ id: "SYS-ARRIVAL", name: "Arrival", role: "PRIMARY", rationale: "Arrival is essential." });
    const satisfied = buildV3CapabilityAssessmentFromRequirement({ requirement, providerSystemIds: ["ENTRY-SYSTEM"], interfaceState: "VALID", capacity: { value: 20, unit: "persons", timeBasis: "peak", demandBasis: "declared demand", state: "PEAK" }, availability: "AVAILABLE", performance: "SUPPORTED" });
    expect(satisfied.satisfied).toBe("SATISFIED");
    expect(validateV3CapabilityAssessment(satisfied)).toBe(true);
    const absent = buildV3CapabilityAssessmentFromRequirement({ requirement, providerSystemIds: [], interfaceState: "UNKNOWN", availability: "UNKNOWN", performance: "UNKNOWN" });
    expect(absent.deficit).toBe("ABSENCE");
    expect(absent.satisfied).toBe("UNSATISFIED");
  });

  it("keeps capacity, temporal, interface and evidence deficits distinguishable", () => {
    const base = { capabilityId: "CAP-1", requirementId: "REQ-1", necessity: "ESSENTIAL" as const, realizationModes: ["INTERNAL"] as const, persistenceModes: ["PERMANENT"] as const, providerSystemIds: ["SYSTEM-1"], interfaceState: "VALID" as const, availability: "AVAILABLE" as const, performance: "SUPPORTED" as const, evidence: [] };
    expect(assessV3Capability({ ...base }).deficit).toBe("CAPACITY");
    expect(assessV3Capability({ ...base, availability: "UNAVAILABLE" }).deficit).toBe("TEMPORAL");
    expect(assessV3Capability({ ...base, interfaceState: "PARTIAL" }).deficit).toBe("INTERFACE");
    expect(assessV3Capability({ ...base, interfaceState: "UNKNOWN" }).deficit).toBe("EVIDENCE");
  });

  it("extends existing relationships and flows rather than replacing them", () => {
    const relationship = deriveV3Relationship({ id: "REL-PRIVACY", from: "SOCIAL", to: "BEDROOM", dimensions: ["PRIVACY", "ACCESS", "VISUAL"], compatibility: "SEPARATE", reason: "Protect domestic privacy.", evidence: [] });
    const flow = deriveV3FlowSegment({ id: "FLOW-SERVICE-1", segmentId: "SEG-1", kind: "SERVICE", from: "RECEIVING", to: "KITCHEN", separation: "PHYSICALLY_SEPARATED", operationalStates: ["NORMAL", "PEAK", "EMERGENCY"], compatibility: "COMPATIBLE", evidence: [] });
    expect(relationship.kind).toBe("MULTIDIMENSIONAL");
    expect(relationship.dimensions).toContain("PRIVACY");
    expect(flow.separation).toBe("PHYSICALLY_SEPARATED");
    expect(flow.humanReviewRequired).toBe(true);
  });

  it("reports the implemented delta explicitly", () => {
    const summary = summarizeV3Delta();
    expect(summary.layers).toBe(5);
    expect(summary.deficits).toHaveLength(8);
    expect(summary.relationshipDimensions).toBe(17);
    expect(summary.operationalStates).toBe(9);
    expect(summary.parallelEngine).toBe(false);
  });

  it("maps v3 research into the existing K4 store without promoting maturity", () => {
    const record = fromV3KnowledgeUnit(ARKI_V3_KNOWLEDGE_UNITS[0]);
    expect(record.origin).toBe("SOURCE_DERIVED");
    expect(record.validation).toBe("CANDIDATE");
    expect(record.noAutomaticDecision).toBe(true);
    expect(record.noAutomaticWinner).toBe(true);
  });
});
