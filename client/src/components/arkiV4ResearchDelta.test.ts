import { describe, expect, it } from "vitest";
import { fromV4KnowledgeUnit } from "./arkiKnowledgeStore";
import { ARKI_V4_KNOWLEDGE_UNITS, ARKI_V4_RESEARCH_DELTA, createV4SubjectState, deriveV4ActiveTopology, evaluateV4DependencyGraph, evaluateV4Redundancy, summarizeV4Delta, validateV4ConcurrentDemand, validateV4Coverage, validateV4KnowledgeUnit, validateV4SubjectState } from "./arkiV4ResearchDelta";

const evidence = [{ id: "SRC-V4-TEST", source: "v4.0 test fixture" }];

describe("ARKI v4.0 research delta", () => {
  it("preserves the incremental, human-governed, no-parallel-engine contract", () => {
    expect(ARKI_V4_RESEARCH_DELTA.implementationMode).toBe("EXTEND_EXISTING_ABSTRACTIONS");
    expect(ARKI_V4_RESEARCH_DELTA.humanAuthority).toBe(true);
    expect(ARKI_V4_RESEARCH_DELTA.noParallelEngine).toBe(true);
    expect(ARKI_V4_RESEARCH_DELTA.researchOnlyAuthority).toBe(true);
    expect(ARKI_V4_KNOWLEDGE_UNITS.every(validateV4KnowledgeUnit)).toBe(true);
  });

  it("keeps state subject-scoped and multidimensional", () => {
    const state = createV4SubjectState({ subjectId: "ROUTE-1", subjectKind: "ROUTE", dimensions: { LOCATION: "NORTH", ACCESS: "OPEN", SECURITY: "NORMAL" }, dependencies: [{ from: "SECURITY", to: "ACCESS", condition: "security state may restrict route access" }], evidence });
    expect(validateV4SubjectState(state)).toBe(true);
    expect(state.dimensions.SECURITY).toBe("NORMAL");
  });

  it("derives active topology instead of creating a second geometry model", () => {
    const topology = deriveV4ActiveTopology({ id: "ACTIVE-LOCKDOWN", canonicalGraphId: "GRAPH-1", scenarioId: "SCENARIO-LOCKDOWN", stateIds: ["LOCKDOWN"], availableNodeIds: ["LOBBY", "STAIR-2"], restrictedNodeIds: ["PUBLIC-DOOR"], availableEdgeIds: ["EDGE-LOBBY-STAIR"], blockedEdgeIds: ["EDGE-DOOR-LOBBY"] });
    expect(topology.derivedOnly).toBe(true);
    expect(topology.canonicalGraphId).toBe("GRAPH-1");
  });

  it("blocks an unresolved essential dependency unless an alternate is valid", () => {
    const unresolved = evaluateV4DependencyGraph({ capabilityId: "EGRESS", nodes: [{ id: "PRIMARY", requirement: "primary route", necessity: "ESSENTIAL", status: "UNKNOWN", evidence }], andGroups: [["PRIMARY"]], orGroups: [] , humanReviewRequired: true });
    expect(unresolved).toBe("UNKNOWN");
    const alternate = evaluateV4DependencyGraph({ capabilityId: "EGRESS", nodes: [{ id: "PRIMARY", requirement: "primary route", necessity: "ESSENTIAL", status: "UNSATISFIED", evidence }, { id: "ALTERNATE", requirement: "alternate route", necessity: "ESSENTIAL", status: "SATISFIED", evidence }], andGroups: [], orGroups: [["PRIMARY", "ALTERNATE"]], humanReviewRequired: true });
    expect(alternate).toBe("SATISFIED");
  });

  it("requires shared resources or segments for a concurrency claim", () => {
    expect(validateV4ConcurrentDemand({ id: "CONCURRENT-1", activityIds: ["A", "B"], sharedResourceIds: ["DOOR-1"], sharedSegmentIds: [], compatible: "UNKNOWN", reason: "two actors claim the same controlled door", evidence, humanReviewRequired: true })).toBe(true);
    expect(validateV4ConcurrentDemand({ id: "CONCURRENT-2", activityIds: ["A"], sharedResourceIds: [], sharedSegmentIds: [], compatible: "UNKNOWN", reason: "missing shared domain", evidence, humanReviewRequired: true })).toBe(false);
  });

  it("does not call duplicate objects redundancy without independence and endurance", () => {
    const partial = evaluateV4Redundancy({ capabilityId: "POWER", alternatePathIds: ["PATH-B"], remainingCapacity: { value: 50, unit: "kW", timeBasis: "1h" }, independentFailureDomains: false, distributionPathsIndependent: false, plannedMaintenanceSupported: true, singleFailureSupported: false, endurance: "1h", limits: ["shared upstream path"], humanReviewRequired: true });
    expect(partial.result).toBe("PARTIAL");
    const unknown = evaluateV4Redundancy({ capabilityId: "POWER", alternatePathIds: ["PATH-B"], remainingCapacity: { unit: "kW" }, independentFailureDomains: "UNKNOWN", distributionPathsIndependent: "UNKNOWN", plannedMaintenanceSupported: "UNKNOWN", singleFailureSupported: "UNKNOWN", endurance: "UNKNOWN", limits: ["not evaluated"], humanReviewRequired: true });
    expect(unknown.result).toBe("UNKNOWN");
  });

  it("requires explicit coverage and preserves unknown verification", () => {
    const record = { subjectId: "SCENARIO-1", claim: "all relevant routes evaluated", state: "UNRESOLVED" as const, evidence, scope: "emergency scenarios", humanReviewRequired: true as const };
    expect(validateV4Coverage(record)).toBe(true);
    expect(record.state).not.toBe("RESOLVED");
  });

  it("maps v4 research into the existing K4 store as a candidate", () => {
    const record = fromV4KnowledgeUnit(ARKI_V4_KNOWLEDGE_UNITS[0]);
    expect(record.origin).toBe("SOURCE_DERIVED");
    expect(record.validation).toBe("CANDIDATE");
    expect(record.noAutomaticDecision).toBe(true);
    expect(record.noAutomaticWinner).toBe(true);
  });

  it("reports the delta summary", () => {
    const summary = summarizeV4Delta();
    expect(summary.version).toBe("4.0");
    expect(summary.knowledgeUnits).toBe(7);
    expect(summary.invariantCount).toBe(52);
    expect(summary.sourceCount).toBe(8);
    expect(summary.noParallelEngine).toBe(true);
  });
});
