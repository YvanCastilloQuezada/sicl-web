import type { D64ClosedLoopResult } from "./arkiD64ClosedLoop";
import type { D71Result } from "./arkiD71EffectVerification";
import type { D77Diagnosis } from "./arkiD77AutonomousCauseDiagnosis";

export type D78NoveltyClass = "ALREADY_KNOWN" | "PREDICTED_FROM_K0" | "DIRECT_EXECUTION_RESULT" | "NOVEL_CANDIDATE" | "UNKNOWN_NOVELTY";
export type D78Result = { k0Hash: string; k0: string[]; predictions: string[]; observations: Array<{ candidateId: string; observation: string; classification: D78NoveltyClass; architecturallyMeaningful: boolean; evidence: string[] }>; learningCandidate: null; challenge: "NOT_STARTED"; gate: "NO_VALID_NOVEL_OBSERVATION"; l2: "DEMONSTRATED"; l3: "DEMONSTRATED"; persistencePromotion: "STOPPED"; provenance: string[] };

export function runD78NovelObservation(closedLoop: D64ClosedLoopResult, effects: D71Result, diagnoses: D77Diagnosis[]): D78Result {
  const k0 = ["D6.2 strategic registry", "D6.2R contextual retrieval", "D6.3 Design Moves", "D6.4 bounded S2 mutation", "D7.1 effect/readback", "D7.2 comparison", ...diagnoses.flatMap((item) => item.causeModels[0]?.supportedCauses ?? [])];
  const k0Hash = Array.from(k0.join("|")).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0).toString(16);
  const observations = effects.observations.map((observation) => ({ candidateId: observation.candidateId, observation: observation.postMutationState, classification: "DIRECT_EXECUTION_RESULT" as const, architecturallyMeaningful: false, evidence: observation.evidence }));
  void closedLoop;
  return { k0Hash, k0, predictions: ["bounded child geometry is produced when S2 authorization and hard constraints pass", "dependency effects remain UNKNOWN without independent evidence"], observations, learningCandidate: null, challenge: "NOT_STARTED", gate: "NO_VALID_NOVEL_OBSERVATION", l2: "DEMONSTRATED", l3: "DEMONSTRATED", persistencePromotion: "STOPPED", provenance: ["D7.8 frozen K0", "D7.1 observed effects", "D7.7 causal models", "no forced novelty", "no K1 fabricated"] };
}
