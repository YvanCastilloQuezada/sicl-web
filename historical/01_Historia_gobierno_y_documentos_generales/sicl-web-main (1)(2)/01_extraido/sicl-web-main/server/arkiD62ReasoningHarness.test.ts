import { describe, expect, it } from "vitest";
import { executeArchitecturalReasoning, replayArchitecturalReasoning } from "./arkiD62ReasoningHarness";
import { emptySnapshot } from "./siclCore";

describe("D6.2 executable reasoning harness", () => {
  const input = {
    executionId: "TEST-D62-001", projectId: "P-D62", brief: "Design a public neighborhood library with reading, children, events and staff flows.", context: { typology: "LIBRARY", location: "Trujillo", activities: ["reading", "children activities", "public events", "staff operations"] }, constraints: ["separate incompatible flows when demonstrated", "support partial evening operation"], knownFacts: [], unknowns: ["capacity ratios are not supplied"], requestedReasoningDepth: "DEEP" as const,
    perturbations: [{ id: "P1", statement: "Children activity for 35, public talk for 80 and ordinary reading occur simultaneously." }],
    failures: [{ id: "F1", statement: "The east secondary access is temporarily unavailable.", affectedElement: "east-access" }],
    counterexamples: [{ id: "C1", claim: "If separating flows improves operation, then all flows should have physically separate routes.", observation: "Some flows may be compatible by time, control and capacity." }],
  };
  const snapshot = { ...emptySnapshot(), knowledge: [
    { id: "KN-FACT", kind: "INVARIANT", title: "Program distinction", statement: "PROGRAM is not a room list.", epistemicStatus: "FACT", promotionState: "K7_CANONICAL_HUMAN_CONFIRMED", scopeId: "SCP-GENERAL", sourceIds: ["SRC-1"], evidenceIds: [], transferability: "TRANSFER", version: 1 },
    { id: "STR-1", kind: "STRATEGY", title: "Separate flows", statement: "Separate incompatible flows when the condition is demonstrated.", epistemicStatus: "HYPOTHESIS", promotionState: "K2_CANDIDATE", scopeId: "SCP-GENERAL", sourceIds: ["SRC-1"], evidenceIds: [], transferability: "ADAPT", version: 1 },
    { id: "TYP-HOSPITAL", kind: "TYPOLOGY", title: "HOSPITAL", statement: "Healthcare operational model.", epistemicStatus: "UNKNOWN", promotionState: "PROVISIONAL", scopeId: "TYPOLOGY_PARTIAL", sourceIds: [], evidenceIds: [], transferability: "UNKNOWN", version: 1 },
  ] };

  it("retrieves, models needs before spaces and preserves unknowns", () => {
    const result = executeArchitecturalReasoning(input, snapshot, 2, "test");
    expect(result.execution.retrievedKnowledgeIds.length).toBeGreaterThan(0);
    expect(result.execution.trace).toHaveProperty("FUNCTIONAL_MODEL");
    expect(result.execution.trace).toHaveProperty("DERIVED_PROGRAM");
    expect(result.execution.trace).toHaveProperty("UNKNOWN");
    expect(result.execution.output).toMatchObject({ geometry: "NOT_REQUIRED_D6_2", candidateCount: 2 });
    expect(result.execution.trace).toHaveProperty("NEW_LEARNING_CANDIDATE");
  });

  it("makes bounded transfer decisions including do-not-transfer and adapt", () => {
    const result = executeArchitecturalReasoning(input, snapshot, 2, "test");
    expect(result.transferDecisions).toEqual(expect.arrayContaining([
      expect.objectContaining({ knowledgeId: "KN-FACT", mode: "TRANSFER" }),
      expect.objectContaining({ knowledgeId: "STR-1", mode: "ADAPT" }),
      expect.objectContaining({ knowledgeId: "TYP-HOSPITAL", mode: "DO_NOT_TRANSFER" }),
    ]));
  });

  it("produces genuinely different strategy logics and evaluates perturbation/failure/counterexample", () => {
    const result = executeArchitecturalReasoning(input, snapshot, 2, "test");
    expect(result.strategies).toHaveLength(2);
    expect(result.strategies[0].organizationalLogic).not.toBe(result.strategies[1].organizationalLogic);
    const trace = result.execution.trace as Record<string, any>;
    expect(trace.PERTURBATION_RESULT[0]).toMatchObject({ perturbationId: "P1", result: expect.stringContaining("PARTIAL") });
    expect(trace.FAILURE_RESULT[0]).toMatchObject({ failureId: "F1", activeOperationalTopology: expect.stringContaining("DEGRADED") });
    expect(trace.COUNTEREXAMPLE_RESULT[0]).toMatchObject({ counterexampleId: "C1", decision: "REFINE" });
  });

  it("replays deterministically and never promotes learning automatically", () => {
    const result = executeArchitecturalReasoning(input, snapshot, 2, "test");
    expect(replayArchitecturalReasoning(result.execution, input, snapshot, 2, "test")).toBe("PASS");
    expect((result.execution.trace as Record<string, any>).NEW_LEARNING_CANDIDATE).toEqual(expect.arrayContaining([expect.objectContaining({ promotion: "HUMAN_REVIEW_REQUIRED" })]));
  });
});
