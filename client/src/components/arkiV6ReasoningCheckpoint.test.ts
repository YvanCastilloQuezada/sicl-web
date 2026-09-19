import { describe, expect, it } from "vitest";
import {
  buildV6CheckpointDelta,
  buildV6DesignMove,
  buildV6LearningLedger,
  buildV6TransferAssessment,
  classifyV6Discovery,
  validateV6EvaluationReport,
  type V6EvaluationReport,
} from "./arkiV6ReasoningCheckpoint";

const report = (): V6EvaluationReport => ({
  reportId: "V6-RESTAURANT-001",
  baseline: { k0: ["separate service circulation"], repository: "sicl-web", branch: "feat/spatial-pilot-media-studio-v1", head: "41d647a", worktree: "CLEAN" },
  suppliedInput: ["restaurant 500 occupants"],
  initialUnknowns: [{ type: "PROJECT_DATA", statement: "exact peak schedule", resolutionPath: "confirm with client" }],
  reasoningActivated: ["functional deficit audit", "dependency-scoped reevaluation"],
  knowledgeReused: ["typology circulation", "canonical building model"],
  reasoningProvenance: ["v3-v5 restaurant evaluations"],
  deficitsDetected: ["service route lacks dedicated return area"],
  causeModels: [{ observedDeficit: "service route conflict", causeHypotheses: ["shared topology"], supportedCauses: [], verifiedCauses: [], certainty: "UNKNOWN", evidenceRefs: [], unknowns: [{ type: "EVIDENCE", statement: "route observation is incomplete", resolutionPath: "inspect canonical geometry" }] }],
  strategiesGenerated: [{ family: "TOPOLOGICAL", rationale: "reroute service journey", distinctFrom: ["SPATIAL"] }, { family: "SPATIAL", rationale: "dedicate service area", distinctFrom: ["TOPOLOGICAL"] }],
  candidates: [{ candidateId: "candidate-1", lineage: ["baseline-restaurant"], strategyFamilies: ["TOPOLOGICAL"], status: "CANDIDATE" }],
  rejectedCandidates: [],
  geometryMutations: ["add service return zone"],
  relationshipsChanged: ["service route CONNECTS waste return"],
  activeTopology: ["service actor / peak state / normal scenario"],
  scenarioResults: ["normal route evaluated"],
  dependencyPropagation: ["kitchen access reevaluated"],
  newDeficitsCreated: [],
  expectedVsActualEffects: { expected: ["service route separated"], actual: ["not yet verified"], unexpected: [] },
  coverage: { candidate: ["candidate-1"], applicable: ["candidate-1"], evaluated: [], unevaluated: ["egress" ] },
  evidenceProvenance: ["ARKI restaurant v5"],
  unknowns: [{ type: "REGULATORY", statement: "project-specific approval not checked", resolutionPath: "official RNE applicability review" }],
  regulatoryStatus: "REQUIRES_VERIFICATION",
  humanDecisionsRequired: ["select candidate"],
  learning: { k0: ["separate service circulation"], suppliedInput: ["restaurant 500 occupants"], retrievedKnowledge: ["typology circulation"], adaptedKnowledge: ["service route applied to changed geometry"], executedReasoning: ["functional deficit audit"], observations: ["dedicated return zone is a candidate"], k1: [], deltaType: "EXECUTION", persisted: false, learningClaim: "NONE" },
  transfer: [],
  adversarialTests: [{ id: "AT-07", result: "PASS", finding: "unknown retained" }],
  regressions: { software: "PASS", knowledge: "PASS", reasoning: "PASS", geometry: "PASS", epistemic: "PASS", regulatory: "PASS" },
  runtimeMaturity: { research: "FORMALIZED", teachability: "TEACHABLE", implementation: "PARTIAL", validation: "CONTROLLED_TESTED", generalization: "NONE", autonomy: "L4_EVALUATES" },
  finalEpistemicState: "HYPOTHESIS",
  humanAuthority: true,
  noAutomaticWinner: true,
  noAutomaticCanonization: true,
});

describe("ARKI v6 reasoning checkpoint", () => {
  it("classifies discovery without creating a parallel capability", () => {
    expect(classifyV6Discovery({ capabilityId: "strategy-layer", existingArtifact: "A21 + DesignMemory", currentCapability: "memory only", gap: "no generic strategy contract", disposition: "EXTEND", affectedFiles: ["a21DesignMemory.ts"] }).disposition).toBe("EXTEND");
  });

  it("requires post-mutation verification in a design move", () => {
    const move = buildV6DesignMove({ moveId: "move-1", intent: "separate incompatible journeys", target: "service-flow", strategyFamilies: ["TOPOLOGICAL"], operators: [{ family: "TOPOLOGICAL", operation: "REROUTE", target: "service-route" }], preconditions: ["route evidence exists"], forbiddenConditions: ["emergency path blocked"], authorityScope: "HUMAN_ARCHITECT", expectedBenefits: ["less crossing"], expectedCosts: ["longer route"], expectedRisks: ["new bottleneck"], unknownEffects: ["peak concurrency"], impactScope: "DEPENDENCY", verificationPlan: ["reevaluate kitchen, egress and accessibility"], provenance: ["v6 checkpoint"] });
    expect(move.noAutomaticDecision).toBe(true);
    expect(move.verificationPlan).toHaveLength(1);
  });

  it("does not call supplied input or execution learning", () => {
    expect(() => buildV6LearningLedger({ k0: ["x"], suppliedInput: ["y"], retrievedKnowledge: [], adaptedKnowledge: [], executedReasoning: ["rule"], observations: [], k1: [], deltaType: "EXECUTION", persisted: false, learningClaim: "SUPPORTED" })).toThrow();
  });

  it("requires persistence for a genuine learning claim", () => {
    expect(() => buildV6LearningLedger({ k0: [], suppliedInput: [], retrievedKnowledge: [], adaptedKnowledge: [], executedReasoning: [], observations: ["new reusable relation"], k1: ["new reusable relation"], deltaType: "ADD", persisted: false, learningClaim: "CANDIDATE" })).toThrow();
    expect(buildV6LearningLedger({ k0: [], suppliedInput: [], retrievedKnowledge: [], adaptedKnowledge: [], executedReasoning: [], observations: ["new reusable relation"], k1: ["new reusable relation"], deltaType: "ADD", persisted: true, learningClaim: "CANDIDATE" }).learningClaim).toBe("CANDIDATE");
  });

  it("rejects transfer into structurally incompatible conditions", () => {
    expect(() => buildV6TransferAssessment({ sourceDomain: "restaurant", targetDomain: "laboratory", transferUnit: "separate dirty return", structuralMatch: ["incompatible flow"], criticalDifferences: ["biosafety hazard"], adaptationBurden: "STRUCTURALLY_INCOMPATIBLE", decision: "TRANSFER", adaptation: [], result: "", counterexample: "biosafety containment differs", scopeRefinement: "do not transfer", generalizationStatus: "NONE" })).toThrow();
  });

  it("accepts the complete report only with unknown paths and authority guards", () => {
    expect(validateV6EvaluationReport(report())).toBe(true);
    const invalid = { ...report(), humanAuthority: false };
    expect(validateV6EvaluationReport(invalid)).toBe(false);
  });

  it("computes a traceable K0 to K1 delta without erasing history", () => {
    expect(buildV6CheckpointDelta(["A", "B"], ["A", "C"], "REVISE")).toEqual({ before: ["A", "B"], after: ["A", "C"], type: "REVISE", newItems: ["C"], retiredItems: ["B"] });
  });
});
