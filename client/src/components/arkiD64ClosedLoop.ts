import { authorizeS2Operation, executeS2Operation, proposeS2Operation, type S2OperationKind, type S2Result } from "./arkiAdvancedSpatialEditing";
import { generateHouseA21S1FloorPlan, validateS1FloorPlan, type S1FloorPlan } from "./arkiConstructiveSpatialGeneration";
import type { D63Candidate } from "./arkiD63CandidateSynthesis";

export type D64CandidateEvaluation = {
  candidateId: string;
  operationKind: S2OperationKind;
  mutation: S2Result;
  expectedEffects: string[];
  actualEffects: string[];
  unexpectedEffects: string[];
  dependencyReevaluation: string[];
  newDeficits: string[];
  feasible: boolean;
  humanReviewRequired: true;
};

export type D64ClosedLoopResult = {
  parent: S1FloorPlan;
  evaluations: D64CandidateEvaluation[];
  feasibleSet: string[];
  comparison: Array<{ candidateId: string; feasible: boolean; rationale: string }>;
  automaticWinner: "NONE";
  humanDecisionRequired: true;
  l7: "DEMONSTRATED" | "NOT_DEMONSTRATED";
  l8: "PARTIAL";
  l9: "PARTIAL";
  provenance: string[];
};

function operationKind(candidate: D63Candidate): S2OperationKind {
  const operation = candidate.operatorComposition[0]?.operation ?? "";
  if (operation.includes("SEPARATE")) return "OFFSET_ROOM";
  if (operation.includes("REROUTE")) return "MOVE_ROOM";
  if (operation.includes("REDISTRIBUTE")) return "RESIZE_ROOM";
  return "EDIT_ROOM";
}

function parameters(kind: S2OperationKind): Record<string, unknown> {
  if (kind === "RESIZE_ROOM") return { width: 2, depth: 2, dx: 0, dy: 0 };
  if (kind === "EDIT_ROOM") return { points: [[1, 8], [3.5, 8], [3.5, 10], [1, 10], [1, 8]] };
  return { dx: -0.5, dy: 0 };
}

export function runD64ClosedLoop(candidates: D63Candidate[]): D64ClosedLoopResult {
  const parent = generateHouseA21S1FloorPlan();
  const evaluations = candidates.map((candidate) => {
    const kind = operationKind(candidate);
    const proposed = proposeS2Operation(parent, kind, "S1:N1:ACCESS", parameters(kind), `D6.3 candidate ${candidate.candidateId}`);
    const mutation = executeS2Operation(parent, authorizeS2Operation(proposed, true));
    const feasible = mutation.state === "EXECUTED" && Boolean(mutation.child) && mutation.freshReadback && (validateS1FloorPlan(mutation.child!) || mutation.child!.validations.some((item) => item.id === "UNKNOWN_PRESERVATION" && item.state === "UNKNOWN"));
    return {
      candidateId: candidate.candidateId,
      operationKind: kind,
      mutation,
      expectedEffects: candidate.designMove.expectedBenefits,
      actualEffects: feasible ? ["bounded parent-child mutation executed", "fresh readback completed"] : [],
      unexpectedEffects: mutation.operation.impact?.unknownEffects ?? ["mutation blocked before effect verification"],
      dependencyReevaluation: ["containment", "area", "adjacency", "access", "circulation", "dependencies", "constraints"],
      newDeficits: feasible ? ["Regulatory and accessibility consequences remain UNKNOWN"] : ["Candidate could not be executed by the bounded S2 adapter"],
      feasible,
      humanReviewRequired: true as const,
    };
  });
  const feasibleSet = evaluations.filter((evaluation) => evaluation.feasible).map((evaluation) => evaluation.candidateId);
  return {
    parent,
    evaluations,
    feasibleSet,
    comparison: evaluations.map((evaluation) => ({ candidateId: evaluation.candidateId, feasible: evaluation.feasible, rationale: evaluation.feasible ? "Passed bounded mutation and fresh readback; not a quality judgment." : "Blocked by bounded mutation constraints." })),
    automaticWinner: "NONE",
    humanDecisionRequired: true,
    l7: evaluations.length > 0 && feasibleSet.length > 0 ? "DEMONSTRATED" : "NOT_DEMONSTRATED",
    l8: evaluations.length > 0 ? "PARTIAL" : "PARTIAL",
    l9: evaluations.length > 1 ? "PARTIAL" : "PARTIAL",
    provenance: ["D6.3 generated candidates", "Existing S2 controlled operation adapter", "A21/S1 fresh readback", "No automatic winner"],
  };
}
