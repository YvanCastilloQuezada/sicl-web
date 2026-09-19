import type { V6CauseModel, V6EpistemicStatus } from "./arkiV6ReasoningCheckpoint";
import type { D76Finding } from "./arkiD76AutonomousDeficitDetection";

export type D77Hypothesis = { hypothesisId: string; statement: string; status: "SUPPORTED" | "UNSUPPORTED" | "UNKNOWN"; evidenceRefs: string[]; reason: string; retained: boolean };
export type D77Diagnosis = { deficitId: string; causeModels: V6CauseModel[]; hypotheses: D77Hypothesis[]; resolutionPath: string[]; multiCausalAllowed: true; failureLocationNotCauseLocation: true; gate: "PASS" | "BLOCKED"; l3: "DEMONSTRATED" | "PARTIAL"; provenance: string[] };

function diagnose(finding: D76Finding): D77Diagnosis {
  const hypotheses: D77Hypothesis[] = [
    { hypothesisId: `${finding.findingId}:CAUSE:RELATIONSHIP`, statement: "The required relational interface is absent from the active topology or interaction graph.", status: finding.affectedCapability === "RELATIONSHIP_REASONING" || finding.affectedCapability === "JOURNEY_REASONING" ? "SUPPORTED" : "UNKNOWN", evidenceRefs: finding.evidence, reason: "The detected mismatch directly concerns required-versus-actual relationship/journey semantics.", retained: true },
    { hypothesisId: `${finding.findingId}:CAUSE:CAPACITY`, statement: "The condition is caused by a demand-capacity mismatch.", status: finding.affectedCapability === "CAPACITY_REASONING" ? "SUPPORTED" : "UNSUPPORTED", evidenceRefs: finding.affectedCapability === "CAPACITY_REASONING" ? finding.evidence : [], reason: finding.affectedCapability === "CAPACITY_REASONING" ? "Capacity evidence supports this hypothesis." : "No capacity evidence supports this hypothesis for this finding.", retained: true },
    { hypothesisId: `${finding.findingId}:CAUSE:GEOMETRY`, statement: "A geometric placement or boundary condition is the primary cause.", status: "UNKNOWN", evidenceRefs: [], reason: "The relational evidence does not discriminate geometry as the cause; geometric inspection is required.", retained: true },
  ];
  const supported = hypotheses.filter((item) => item.status === "SUPPORTED");
  const unknown = hypotheses.filter((item) => item.status === "UNKNOWN");
  const certainty: V6CauseModel["certainty"] = supported.length === 1 && unknown.length === 0 ? "SUPPORTED" : supported.length > 0 ? "SUPPORTED" : "UNKNOWN";
  const causeModels: V6CauseModel[] = [{ observedDeficit: finding.findingId, causeHypotheses: hypotheses.map((item) => item.statement), supportedCauses: supported.map((item) => item.statement), verifiedCauses: [], certainty, evidenceRefs: supported.flatMap((item) => item.evidenceRefs), unknowns: unknown.map((item) => ({ type: "EVIDENCE", statement: item.reason, resolutionPath: "Collect independent relationship, geometry, capacity and process evidence before promotion." })) }];
  const discriminated = hypotheses.some((item) => item.status === "SUPPORTED") && hypotheses.some((item) => item.status === "UNSUPPORTED" || item.status === "UNKNOWN");
  return { deficitId: finding.findingId, causeModels, hypotheses, resolutionPath: ["Collect independent evidence for candidate causes.", "Recompute dependency and process relationships.", "Inspect geometry only as evidence, not as automatic cause.", "Retain unsupported and unknown hypotheses until resolved."], multiCausalAllowed: true, failureLocationNotCauseLocation: true, gate: discriminated ? "PASS" : "BLOCKED", l3: discriminated ? "DEMONSTRATED" : "PARTIAL", provenance: ["D7.6 detected finding", "D7.7 causal hypothesis generation", "V6CauseModel", "evidence discrimination", "UNKNOWN preservation"] };
}

export function diagnoseD77(findings: D76Finding[]): { diagnoses: D77Diagnosis[]; gate: "PASS" | "BLOCKED"; l3: "DEMONSTRATED" | "PARTIAL"; causeNotSupplied: true; typologyLookup: false; provenance: string[] } {
  const diagnoses = findings.filter((finding) => finding.epistemicStatus === "OBSERVED").map(diagnose);
  const gate = diagnoses.length > 0 && diagnoses.some((item) => item.gate === "PASS") ? "PASS" : "BLOCKED";
  return { diagnoses, gate, l3: gate === "PASS" ? "DEMONSTRATED" : "PARTIAL", causeNotSupplied: true, typologyLookup: false, provenance: ["D7.7", "D7.6 output only", "no cause supplied", "multi-causal hypotheses", "unsupported hypotheses retained"] };
}
