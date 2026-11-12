import { describe, expect, it } from "vitest";
import { createProjectIdentifier, executeIntegratedArchitectCycle, isProjectIdentifier, summarizeArchitectCapability, type IntegratedArchitectInput } from "./arkiIntegratedArchitectCycle";

const base = (projectId: IntegratedArchitectInput["projectId"], typology: string, brief: string): IntegratedArchitectInput => ({ projectId, projectName: `${typology} proof`, typology, brief, context: { location: "Peru", siteCondition: "single public edge", occupancy: typology === "RESTAURANT" ? 500 : 5 }, constraints: ["Conceptual geometry only", "Separate public and service flows", "Human review required"], activities: [{ id: "public", label: "public arrival and use", subjects: ["visitor"], capacity: typology === "RESTAURANT" ? 500 : 5, frequency: "daily", duration: "long", temporalOverlap: true, privacy: "shared" }, { id: "service", label: "service and supply", subjects: ["staff"], capacity: 20, frequency: "daily", duration: "medium", temporalOverlap: true, accessControl: "staff", privacy: "controlled" }], relationships: [{ id: "r1", from: "public", to: "service", relation: "controlled interface", subjects: ["visitor", "staff"], state: "open", frequency: "daily", time: "operating-hours", control: "staff-mediated" }], subjects: ["visitor", "staff"], conditions: ["public and service flows must remain legible", "service route must reach storage and preparation"], unknowns: ["exact egress and code parameters require jurisdictional review"], envelope: { width: 20, height: 40 }, sourceIds: ["SRC-USER-BRIEF", "SRC-TYPOLOGY-REGISTRY"] });

describe("ARKI-INTEGRATED-ARCHITECT-1.0", () => {
  it("accepts the required project identifier format", () => {
    expect(isProjectIdentifier("ABC-DEF-123-456")).toBe(true);
    expect(isProjectIdentifier("ARKI-001-ABC-123")).toBe(false);
    expect(isProjectIdentifier(createProjectIdentifier("ARKI"))).toBe(true);
  });

  it("runs the complete bounded cycle for a residential project", () => {
    const cycle = executeIntegratedArchitectCycle(base("RES-HOU-200-001", "RESIDENTIAL", "A two-storey home with private, social and service zoning."));
    expect(cycle.status).toBe("PARTIAL");
    expect(cycle.stages.map((item) => item.stage)).toEqual(expect.arrayContaining(["PROJECT_CONDITIONS", "KNOWLEDGE_RETRIEVAL", "REASONING_AND_TRANSFER", "PARTI_HYPOTHESES", "TOPOLOGY", "GEOMETRY_CONCEPTUAL", "FUNCTIONAL_EVALUATION", "HUMAN_REVIEW"]));
    expect(cycle.parti.partis).toHaveLength(3);
    expect(cycle.geometry.finalStatus).toBe("PARTIAL");
    expect(cycle.evaluation.functional).toBe("UNKNOWN");
    expect(cycle.evaluation.humanDecision).toBe("PENDING");
  });

  it("runs the same cycle for a 500-person restaurant without falsely claiming compliance", () => {
    const cycle = executeIntegratedArchitectCycle(base("RES-TAU-500-002", "RESTAURANT", "A restaurant for 500 people with independent public, service, supply and waste flows."));
    const summary = summarizeArchitectCapability(cycle);
    expect(cycle.status).toBe("PARTIAL");
    expect(summary.canProposePartis).toBe(true);
    expect(summary.canRejectAdversarialParti).toBe(true);
    expect(summary.canBacktrack).toBe(true);
    expect(summary.canTransferWithAdaptation).toBe(true);
    expect(summary.functionalValidity).toBe("UNKNOWN");
    expect(summary.regulatoryValidity).toBe("NOT_EVALUATED");
    expect(summary.claim).toBe("BOUNDED_CONCEPTUAL_ARCHITECTURAL_SYNTHESIS_ONLY");
  });

  it("keeps the cycle human-governed and rejects malformed project identifiers", () => {
    expect(() => executeIntegratedArchitectCycle({ ...base("BAD-ID" as IntegratedArchitectInput["projectId"], "OFFICE", "Invalid project id") })).toThrow("PROJECT_ID_MUST_MATCH");
    const cycle = executeIntegratedArchitectCycle(base("LIB-LIB-300-003", "LIBRARY", "A library with public reading, collection and service flows."));
    expect(cycle.backtrack.targets).toEqual(["PARTI", "TOPOLOGY", "GEOMETRY"]);
    expect(cycle.stages.find((item) => item.stage === "HUMAN_REVIEW")?.status).toBe("PASS");
  });
});


describe("ARKI project PARTI and topology genealogy", () => {
  it("derives topology hypotheses from each project PARTI", () => {
    const cycle = executeIntegratedArchitectCycle(
      base("RES-HOU-200-001", "RESIDENTIAL",
        "A home with private, social and service activities.")
    );

    expect(cycle.projectPartis.length).toBeGreaterThan(0);
    expect(cycle.projectTopology).toHaveLength(cycle.projectPartis.length);

    const partiNodes = cycle.projectGenealogy.nodes.filter(
      (node) => node.type === "PARTI"
    );
    const topologyNodes = cycle.projectGenealogy.nodes.filter(
      (node) => node.type === "TOPOLOGY"
    );

    expect(partiNodes).toHaveLength(cycle.projectPartis.length);
    expect(topologyNodes).toHaveLength(cycle.projectPartis.length);

    for (const node of topologyNodes) {
      expect(node.parentIds).toHaveLength(1);
      expect(partiNodes.some((parti) =>
        node.parentIds.includes(parti.id)
      )).toBe(true);
    }

    expect(cycle.stages.find((item) =>
      item.stage === "TOPOLOGY"
    )?.status).toBe("PARTIAL");
  });

  it("does not confuse documentary fixture capability with project capability", () => {
    const cycle = executeIntegratedArchitectCycle(
      base("RES-TAU-500-002", "RESTAURANT",
        "A restaurant with public and service flows.")
    );

    const summary = summarizeArchitectCapability(cycle);

    expect(summary.canProposePartis).toBe(cycle.projectPartis.length > 0);
    expect(summary.canTraceTopology).toBe(false);
    expect(summary.canTraceTopologyHypothesis).toBe(true);
    expect(cycle.status).toBe("PARTIAL");
    expect(cycle.parti.partis).toHaveLength(3);
  });
});
