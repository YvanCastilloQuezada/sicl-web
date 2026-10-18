import { describe, expect, it } from "vitest";
import { emptySnapshot } from "./siclCore";
import { executeReasoningToTopology, type BridgeProjectInput } from "./arkiD62ReasoningHarness";

describe("D6.2-M minimal reasoning-to-synthesis bridge", () => {
  const project: BridgeProjectInput = {
    executionId: "D62M-MICRO-001",
    projectId: "D62M-PROJECT",
    brief: "A small civic consultation service with a public orientation activity and a staff intake activity.",
    typology: "CIVIC_CONSULTATION_UNIT",
    activities: [
      { id: "public-orientation", label: "public orientation", subjects: ["visitor"], capacity: 8, frequency: "daily", duration: "short", temporalOverlap: true, privacy: "shared" },
      { id: "staff-intake", label: "staff intake", subjects: ["staff"], capacity: 3, frequency: "daily", duration: "medium", temporalOverlap: true, accessControl: "staff", privacy: "controlled" },
    ],
    subjects: ["visitor", "staff"],
    relationships: [{ id: "r1", from: "public-orientation", to: "staff-intake", relation: "controlled service interface", subjects: ["visitor", "staff"], state: "open", frequency: "daily", time: "business-hours", control: "staff-mediated" }],
    conditions: ["visitor and staff activities may overlap", "staff controls service intake"],
    unknowns: ["capacity of the service process after peak demand is not supplied"],
    perturbation: { id: "p1", statement: "Staff-mediated control is unavailable during the peak period.", changes: { control: "unavailable" } },
  };

  it("retrieves knowledge and reaches conceptual topology without rooms or geometry", () => {
    const snapshot = { ...emptySnapshot(), knowledge: [{ id: "KN-TOPOLOGY-1", kind: "INVARIANT", title: "Topology before geometry", statement: "Topology is not geometry and program is not a room list.", epistemicStatus: "FACT", scopeId: "SCP-GENERAL", sourceIds: ["SRC-1"], evidenceIds: [], transferability: "TRANSFER", version: 1 }] };
    const result = executeReasoningToTopology(project, snapshot, 1, "D6.2-M-test");
    expect(result.status).toBe("PASS");
    expect(result.retrievedKnowledge.map((item) => item.id)).toContain("KN-TOPOLOGY-1");
    expect(result.topology.nodes).toHaveLength(2);
    expect(result.topology.relationships[0].relationType).toBe("CONTROLLED_ROUTE_REQUIRED");
    expect(result.topology).not.toHaveProperty("coordinates");
    expect(result.topology).not.toHaveProperty("walls");
    expect(result.topology).not.toHaveProperty("rooms");
    expect(result.unknown.length).toBeGreaterThan(0);
    expect(result.strategies.length).toBeGreaterThanOrEqual(2);
    expect(result.realizations.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps strategy, realization and topology distinct and preserves causal traceability", () => {
    const result = executeReasoningToTopology(project, emptySnapshot(), 1, "D6.2-M-test");
    expect(result.strategies[0]).toHaveProperty("designIntent");
    expect(result.realizations[0]).toHaveProperty("strategyId");
    expect(result.topology.traceability[0]).toMatchObject({ derivedElement: "public-orientation->staff-intake" });
    expect(result.topology.traceability[0].why.toLowerCase()).toContain("functional relation");
    expect(result.topology.relationships[0].requirementAddressed).toBe("REQ-REL-r1");
  });

  it("reevaluates only the perturbed dependency and retains unknowns", () => {
    const result = executeReasoningToTopology(project, emptySnapshot(), 1, "D6.2-M-test");
    expect(result.perturbation).toMatchObject({ id: "p1", status: "PARTIAL_REEVALUATION_REQUIRED" });
    expect(result.perturbation).toHaveProperty("unknown");
    expect(result.perturbation).toHaveProperty("affectedRequirementIds");
    expect(result.perturbation).toHaveProperty("preservedRequirementIds");
  });
});
