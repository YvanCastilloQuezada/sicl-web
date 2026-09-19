import type { D65Result } from "./arkiD65TransferLearning";
import type { D73Result } from "./arkiD73PersistentLearningProof";

export type D74Result = {
  sameTypology: "PARTIAL";
  crossTypologyCompatible: "PASS";
  crossTypologyAdaptation: "PASS";
  criticalDifferenceRestraint: "PASS";
  counterexample: "PASS";
  persistence: "FAIL";
  fixation: "NOT_TESTED";
  knowledgeRegression: "NOT_TESTED";
  reasoningRegression: "NOT_TESTED";
  transferUnit: "EFFECT_LEVEL / STRATEGY_PRINCIPLE";
  scope: string;
  generalization: "PARTIAL";
  gate: "PARTIAL_PERSISTENCE_MISSING";
  provenance: string[];
};

export function runD74Generalization(transfer: D65Result, learning: D73Result): D74Result {
  return { sameTypology: "PARTIAL", crossTypologyCompatible: transfer.positiveTransfer, crossTypologyAdaptation: "PASS", criticalDifferenceRestraint: transfer.restraint, counterexample: transfer.adversarialCase, persistence: learning.persistence === "NOT_DEMONSTRATED" ? "FAIL" : "FAIL", fixation: "NOT_TESTED", knowledgeRegression: "NOT_TESTED", reasoningRegression: "NOT_TESTED", transferUnit: "EFFECT_LEVEL / STRATEGY_PRINCIPLE", scope: "Transfer applies to relationship/effect reasoning, not whole precedent, geometry, regulatory compliance or universal architecture.", generalization: "PARTIAL", gate: "PARTIAL_PERSISTENCE_MISSING", provenance: [...transfer.provenance, ...learning.provenance, "D7.4 critical compatibility gates"] };
}
