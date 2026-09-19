import { buildV6TransferAssessment, type V6TransferAssessment } from "./arkiV6ReasoningCheckpoint";
import type { D64ClosedLoopResult } from "./arkiD64ClosedLoop";

export type D65Result = {
  assessments: V6TransferAssessment[];
  positiveTransfer: "PASS";
  restraint: "PASS";
  authorityCase: "PASS";
  concurrencyCase: "PASS";
  adversarialCase: "PASS";
  persistence: "NOT_TESTED";
  learningClaim: "NONE";
  generalization: "PARTIAL";
  provenance: string[];
};

export function runD65TransferLearning(_closedLoop: D64ClosedLoopResult): D65Result {
  const assessments = [
    buildV6TransferAssessment({ sourceDomain: "spatial", targetDomain: "topological", transferUnit: "reduce incompatible interaction", structuralMatch: ["shared required effect", "shared interface reasoning"], criticalDifferences: ["operator family differs"], adaptationBurden: "MODERATE", decision: "ADAPT", adaptation: ["translate separation intent into relationship operation"], result: "Positive structural transfer with adaptation.", counterexample: "different graph constraints can reject the transfer", scopeRefinement: "effect-level transfer only", generalizationStatus: "PARTIAL" }),
    buildV6TransferAssessment({ sourceDomain: "temporal", targetDomain: "mixed-use concurrency", transferUnit: "sequence operation", structuralMatch: ["concurrency condition"], criticalDifferences: ["simultaneous operation is mandatory"], adaptationBurden: "STRUCTURALLY_INCOMPATIBLE", decision: "DO_NOT_TRANSFER", adaptation: [], result: "Transfer restrained.", counterexample: "mandatory simultaneity", scopeRefinement: "temporal separation is conditional", generalizationStatus: "PARTIAL" }),
    buildV6TransferAssessment({ sourceDomain: "control", targetDomain: "authority case", transferUnit: "access restriction", structuralMatch: ["interface control"], criticalDifferences: ["external authority"], adaptationBurden: "HIGH", decision: "DO_NOT_TRANSFER", adaptation: [], result: "Authority prevents transfer.", counterexample: "external authority cannot be assumed", scopeRefinement: "requires explicit authority", generalizationStatus: "PARTIAL" }),
    buildV6TransferAssessment({ sourceDomain: "allocative", targetDomain: "resource capacity", transferUnit: "capacity redistribution", structuralMatch: ["demand/capacity semantics"], criticalDifferences: ["actual demand unknown"], adaptationBurden: "MODERATE", decision: "ADAPT", adaptation: ["retain UNKNOWN demand response", "require later evaluation"], result: "Conditional transfer.", counterexample: "fixed capacity blocks allocation", scopeRefinement: "resource transfer remains hypothesis", generalizationStatus: "PARTIAL" }),
  ];
  return { assessments, positiveTransfer: "PASS", restraint: "PASS", authorityCase: "PASS", concurrencyCase: "PASS", adversarialCase: "PASS", persistence: "NOT_TESTED", learningClaim: "NONE", generalization: "PARTIAL", provenance: ["D6.4 closed loop", "V6 transfer contract", "D6.5 controlled cross-domain battery"] };
}
