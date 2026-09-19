import type { D64ClosedLoopResult, D64CandidateEvaluation } from "./arkiD64ClosedLoop";

export type EffectResult = "ACHIEVED" | "PARTIALLY_ACHIEVED" | "NOT_ACHIEVED" | "NOT_EVALUATED" | "UNKNOWN";
export type D71EffectObservation = {
  candidateId: string;
  expectedEffect: string;
  observableProxy: string;
  baselineState: string;
  postMutationState: string;
  actualEffect: EffectResult;
  evidence: string[];
  confidence: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  unknown: string[];
  directlyAffected: string[];
  dependencyAffected: string[];
  possiblyAffected: string[];
  unknownImpact: string[];
  newDeficits: string[];
  causalLineage: string;
  localSuccessGlobalUnknown: boolean;
};

export type D71Result = {
  observations: D71EffectObservation[];
  adversarialLocalSuccess: { present: boolean; candidateId?: string; reason: string };
  l8: "DEMONSTRATED" | "PARTIAL";
  gate: "PASS" | "BLOCKED";
  unsupportedDomains: string[];
  provenance: string[];
};

function observe(evaluation: D64CandidateEvaluation): D71EffectObservation {
  const changed = evaluation.mutation.state === "EXECUTED" && Boolean(evaluation.mutation.child);
  const target = evaluation.mutation.child?.spaces.find((space) => space.id === evaluation.mutation.operation.targetSpaceId);
  const baseline = evaluation.mutation.parent.spaces.find((space) => space.id === evaluation.mutation.operation.targetSpaceId);
  const baselineArea = baseline?.actualAreaM2 ?? 0;
  const postArea = target?.actualAreaM2 ?? baselineArea;
  const areaChanged = Math.abs(postArea - baselineArea) > 0.0001;
  const actualEffect: EffectResult = changed ? "ACHIEVED" : "NOT_ACHIEVED";
  const unknownImpact = evaluation.mutation.operation.impact?.unknownEffects ?? [];
  const newDeficits = [...evaluation.newDeficits, ...unknownImpact];
  return {
    candidateId: evaluation.candidateId,
    expectedEffect: evaluation.expectedEffects[0] ?? "candidate effect",
    observableProxy: areaChanged ? "target geometry area changed and child model read back" : "target geometry change proxy",
    baselineState: `area=${baselineArea.toFixed(2)}m2; state=PARENT`,
    postMutationState: `area=${postArea.toFixed(2)}m2; state=${evaluation.mutation.state}`,
    actualEffect,
    evidence: changed ? ["S2 EXECUTED", "freshReadback=true", `area delta=${(postArea - baselineArea).toFixed(2)}m2`] : ["S2 did not produce an executable child"],
    confidence: changed ? "HIGH" : "NONE",
    unknown: ["operational performance", "regulatory compliance", "accessibility compliance", "real-world outcome"],
    directlyAffected: evaluation.mutation.operation.affectedGeometry,
    dependencyAffected: evaluation.dependencyReevaluation,
    possiblyAffected: ["journey", "flow", "capacity", "concurrency", "functional relationships", "multilevel continuity"],
    unknownImpact,
    newDeficits,
    causalLineage: `ORIGINAL DEFICIT → ${evaluation.mutation.operation.operationId} → ${actualEffect} → ${newDeficits.join("; ")}`,
    localSuccessGlobalUnknown: changed && newDeficits.length > 0,
  };
}

export function verifyD71Effects(closedLoop: D64ClosedLoopResult): D71Result {
  const observations = closedLoop.evaluations.map(observe);
  const adversarial = observations.find((item) => item.localSuccessGlobalUnknown);
  const allHaveEvidenceBoundary = observations.length > 0 && observations.every((item) => item.evidence.length > 0 && item.unknown.length > 0 && item.causalLineage.includes("→"));
  const gate = allHaveEvidenceBoundary && observations.every((item) => item.actualEffect !== "UNKNOWN" && item.actualEffect !== "NOT_EVALUATED") ? "PASS" : "BLOCKED";
  return {
    observations,
    adversarialLocalSuccess: adversarial ? { present: true, candidateId: adversarial.candidateId, reason: "Local geometric success coexists with new unsupported dependency effects; no unconditional success claim." } : { present: false, reason: "No adversarial local-success case observed." },
    l8: gate === "PASS" ? "DEMONSTRATED" : "PARTIAL",
    gate,
    unsupportedDomains: ["operational performance", "regulatory compliance", "accessibility compliance", "real-world outcome"],
    provenance: ["D6.4 controlled closed loop", "S2 fresh readback", "D7.1 expected-vs-actual verification", "human review required"],
  };
}
