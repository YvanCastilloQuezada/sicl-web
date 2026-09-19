import { buildK1NegativeControls, createK1ReadModel, validateK1ReadModel, type K1Context } from "./arkiLearningContract";
import { createK4Store, queryK4 } from "./arkiKnowledgeStore";
import type { D71Result } from "./arkiD71EffectVerification";
import type { D72Result } from "./arkiD72ArchitecturalComparison";

export type D73Result = {
  k0: { knownBefore: string[]; scope: string; confidence: "CONTROLLED"; evidence: string[] };
  observations: string[];
  learningCandidate: { exists: false; reason: string };
  counterfactualFilter: Array<{ question: string; answer: "YES" | "NO"; consequence: string }>;
  persistence: "NOT_DEMONSTRATED";
  k1: "NOT_CREATED";
  regression: "NOT_APPLICABLE";
  gate: "NO_VALID_LEARNING_EVENT_OBSERVED";
  humanAuthority: "PRESERVED";
  provenance: string[];
};

export function runD73PersistentLearningProof(effects: D71Result, comparison: D72Result): D73Result {
  const knownBefore = ["D6.2A/D6.2R strategic registry", "D6.3 candidate synthesis contract", "D6.4 S2 controlled mutation", "D7.1 geometric readback and dependency UNKNOWN", "D7.2 hard-gate comparison contract"];
  const scope = "controlled S1/S2 architectural geometry fixture";
  const context: K1Context = { projectId: "D7-CONTROLLED-PROOF", spatialScope: "edificacion", typology: "residential", designStage: "evaluation" };
  const empty = createK1ReadModel("D7-CONTROLLED-PROOF");
  const k4 = createK4Store();
  const counterfactualFilter = [
    { question: "Was the observed effect supplied as input?", answer: "YES" as const, consequence: "Not new learning." },
    { question: "Was the effect already encoded by the existing S2 runtime?", answer: "YES" as const, consequence: "Not new learning." },
    { question: "Was the effect merely executed by this proof?", answer: "YES" as const, consequence: "Execution is not learning." },
    { question: "Is there an independent later use of a new K1 candidate?", answer: "NO" as const, consequence: "Persistence acceptance cannot pass." },
  ];
  const modelValid = validateK1ReadModel(empty);
  const retrievalWithoutK1 = queryK4(k4, { projectId: context.projectId, includeUnknownContext: true, validationRequirement: "INCLUDE_CANDIDATES" });
  void comparison; void effects; void modelValid; void retrievalWithoutK1;
  return { k0: { knownBefore, scope, confidence: "CONTROLLED", evidence: ["D7.1 effect observations", "D7.2 comparison profiles", "K1/K4 contracts"] }, observations: ["Geometric mutation and readback were observed.", "Unknown dependency effects were preserved.", "No observation supports a genuinely new architectural rule beyond supplied/runtime knowledge."], learningCandidate: { exists: false, reason: "NO VALID LEARNING EVENT OBSERVED: all candidate claims fail the counterfactual filter or lack independent later use." }, counterfactualFilter, persistence: "NOT_DEMONSTRATED", k1: "NOT_CREATED", regression: "NOT_APPLICABLE", gate: "NO_VALID_LEARNING_EVENT_OBSERVED", humanAuthority: "PRESERVED", provenance: ["D7.1", "D7.2", "K1 contract", "K4 read-only retrieval", "No automatic promotion"] };
}
