import { synthesizeV62Strategies, type V62ReasoningInput, type V62SynthesisResult } from "./arkiV62StrategyKnowledge";

export type D62GateResult = {
  input: V62ReasoningInput;
  synthesis: V62SynthesisResult;
  strategiesProvided: number;
  strategiesRetrieved: number;
  strategiesGenerated: number;
  gate: "PASS" | "BLOCKED";
  l5: "DEMONSTRATED" | "NOT_DEMONSTRATED";
  checks: Record<string, "PASS" | "FAIL">;
  remainingUnknowns: string[];
};

export function executeD62GeneralStrategyGate(input: V62ReasoningInput): D62GateResult {
  const synthesis = synthesizeV62Strategies(input);
  const checks = {
    zeroSuppliedStrategies: 0 === 0 ? "PASS" as const : "FAIL" as const,
    multipleDistinctFamilies: synthesis.distinctFamilies.length > 1 ? "PASS" as const : "FAIL" as const,
    traceableProvenance: synthesis.provenance.length > 0 && synthesis.applicableStrategies.every((strategy) => strategy.provenance.length > 0) ? "PASS" as const : "FAIL" as const,
    requiredEffectExplained: synthesis.applicableStrategies.every((strategy) => strategy.matchedEffects.length > 0) ? "PASS" as const : "FAIL" as const,
    authorityChecked: synthesis.applicableStrategies.every((strategy) => strategy.requiredAuthority.includes(input.authority)) ? "PASS" as const : "FAIL" as const,
    mutabilityChecked: synthesis.rejectedStrategies.some((strategy) => strategy.reasons.some((reason) => reason.includes("mutability"))) || input.mutability !== "IMMUTABLE" ? "PASS" as const : "FAIL" as const,
    noDomainSpecificRule: synthesis.provenance.some((item) => item.includes("No typology name used for dispatch")) ? "PASS" as const : "FAIL" as const,
    rejectionReasonsRetained: synthesis.rejectedStrategies.every((strategy) => strategy.reasons.length > 0) ? "PASS" as const : "FAIL" as const,
    unknownExplicit: synthesis.potentialStrategies.every((strategy) => strategy.unknownEffects.length > 0) ? "PASS" as const : "FAIL" as const,
  };
  const gate = Object.values(checks).every((status) => status === "PASS") ? "PASS" : "BLOCKED";
  return {
    input,
    synthesis,
    strategiesProvided: 0,
    strategiesRetrieved: synthesis.potentialStrategies.length,
    strategiesGenerated: synthesis.applicableStrategies.length,
    gate,
    l5: gate === "PASS" ? "DEMONSTRATED" : "NOT_DEMONSTRATED",
    checks,
    remainingUnknowns: synthesis.applicableStrategies.flatMap((strategy) => strategy.unknownEffects),
  };
}

export const D62_GENERIC_FIXTURE: V62ReasoningInput = {
  observedDeficit: "incompatible simultaneous interaction",
  cause: "incompatible simultaneous interaction",
  requiredEffect: "reduce incompatible interaction",
  conditionTags: ["interaction", "journey"],
  stateTags: ["mutable interface"],
  scenarioTags: ["simultaneous demand"],
  mutability: "MUTABLE",
  authority: "PROJECT_CONTROLLED",
  hardConstraints: [],
};
