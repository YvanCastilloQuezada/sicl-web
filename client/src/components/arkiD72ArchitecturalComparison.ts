import type { D64ClosedLoopResult } from "./arkiD64ClosedLoop";
import type { D71Result } from "./arkiD71EffectVerification";

export type D72Profile = {
  candidateId: string;
  hardConstraints: "PASS" | "FAIL" | "UNKNOWN";
  requiredEffect: "ACHIEVED" | "PARTIALLY_ACHIEVED" | "NOT_ACHIEVED" | "NOT_EVALUATED" | "UNKNOWN";
  newDeficits: string[];
  dependencyConsequences: string[];
  journeyFlow: "NOT_EVALUATED" | "UNKNOWN";
  capacityConcurrency: "NOT_EVALUATED" | "UNKNOWN";
  authority: "HUMAN_REVIEW_REQUIRED";
  mutability: "EXECUTED" | "BLOCKED";
  reversibility: "REVERSIBLE_PARENT_PRESERVED";
  implementationBurden: "BOUNDED_S2";
  knownPerformanceEffects: "NOT_EVALUATED";
  regulatoryStatus: "UNKNOWN";
  evidenceCoverage: string[];
};

export type D72Result = {
  profiles: D72Profile[];
  feasibleSet: string[];
  dominated: string[];
  nonDominatedTradeoffSet: string[];
  tradeoffs: Array<{ candidateId: string; betterOn: string[]; worseOrUnknownOn: string[] }>;
  architecturalJudgment: "HUMAN_REQUIRED";
  automaticWinner: "NONE";
  l9: "DEMONSTRATED" | "PARTIAL";
  gate: "PASS" | "BLOCKED";
  provenance: string[];
};

export function compareD72Candidates(closedLoop: D64ClosedLoopResult, effects: D71Result): D72Result {
  const profiles: D72Profile[] = effects.observations.map((observation) => {
    const evaluation = closedLoop.evaluations.find((item) => item.candidateId === observation.candidateId)!;
    return {
      candidateId: observation.candidateId,
      hardConstraints: evaluation.feasible ? "PASS" : "FAIL",
      requiredEffect: observation.actualEffect,
      newDeficits: observation.newDeficits,
      dependencyConsequences: observation.dependencyAffected,
      journeyFlow: "UNKNOWN",
      capacityConcurrency: "UNKNOWN",
      authority: "HUMAN_REVIEW_REQUIRED",
      mutability: evaluation.mutation.state === "EXECUTED" ? "EXECUTED" : "BLOCKED",
      reversibility: "REVERSIBLE_PARENT_PRESERVED",
      implementationBurden: "BOUNDED_S2",
      knownPerformanceEffects: "NOT_EVALUATED",
      regulatoryStatus: "UNKNOWN",
      evidenceCoverage: observation.evidence,
    };
  });
  const feasibleSet = profiles.filter((profile) => profile.hardConstraints === "PASS").map((profile) => profile.candidateId);
  const nonDominatedTradeoffSet = feasibleSet.length > 1 ? [...feasibleSet] : [];
  const tradeoffs = profiles.filter((profile) => feasibleSet.includes(profile.candidateId)).map((profile) => ({ candidateId: profile.candidateId, betterOn: ["geometric execution", "fresh readback", "parent preservation"], worseOrUnknownOn: ["operational performance", "regulatory status", "journey/flow", "capacity/concurrency", "architectural judgment"] }));
  const gate = feasibleSet.length >= 2 && nonDominatedTradeoffSet.length >= 2 && profiles.every((profile) => profile.authority === "HUMAN_REVIEW_REQUIRED") ? "PASS" : "BLOCKED";
  return { profiles, feasibleSet, dominated: profiles.filter((profile) => !feasibleSet.includes(profile.candidateId)).map((profile) => profile.candidateId), nonDominatedTradeoffSet, tradeoffs, architecturalJudgment: "HUMAN_REQUIRED", automaticWinner: "NONE", l9: gate === "PASS" ? "DEMONSTRATED" : "PARTIAL", gate, provenance: ["D7.1 effect observations", "hard-gates-before-preference", "no universal scalar architecture score", "human architectural judgment preserved"] };
}
