import type { V6StrategyFamily } from "./arkiV6ReasoningCheckpoint";
import { classifyV6Discovery, type V6ReuseDisposition } from "./arkiV6ReasoningCheckpoint";

export type V62ReasoningInput = {
  observedDeficit: string;
  cause: string;
  requiredEffect: string;
  conditionTags: string[];
  stateTags: string[];
  scenarioTags: string[];
  mutability: "MUTABLE" | "PARTIALLY_MUTABLE" | "IMMUTABLE" | "UNKNOWN";
  authority: "PROJECT_CONTROLLED" | "SHARED_AUTHORITY" | "EXTERNAL_AUTHORITY" | "UNKNOWN";
  hardConstraints: string[];
};

export type V62StrategyKnowledge = {
  id: string;
  family: V6StrategyFamily;
  intent: string;
  potentialEffects: string[];
  preconditions: string[];
  forbiddenConditions: string[];
  targetTypes: string[];
  requiredAuthority: V62ReasoningInput["authority"][];
  dependencies: string[];
  possibleSideEffects: string[];
  unknownEffects: string[];
  provenance: string[];
};

export type V62ApplicableStrategy = V62StrategyKnowledge & {
  applicability: "APPLICABLE";
  rationale: string;
  matchedEffects: string[];
};

export type V62RejectedStrategy = {
  strategyId: string;
  family: V6StrategyFamily;
  applicability: "REJECTED";
  reasons: string[];
  provenance: string[];
};

export type V62SynthesisResult = {
  input: V62ReasoningInput;
  potentialStrategies: V62StrategyKnowledge[];
  applicableStrategies: V62ApplicableStrategy[];
  rejectedStrategies: V62RejectedStrategy[];
  distinctFamilies: V6StrategyFamily[];
  provenance: string[];
  disposition: V6ReuseDisposition;
};

const STRATEGY_KNOWLEDGE: V62StrategyKnowledge[] = [
  {
    id: "SK-SEPARATE-SPATIAL",
    family: "SPATIAL",
    intent: "Reduce incompatible interaction by changing spatial separation or interface distance.",
    potentialEffects: ["reduce incompatible interaction", "increase interface separation", "clarify access boundary"],
    preconditions: ["target geometry or interface is mutable", "required effect concerns interaction or separation"],
    forbiddenConditions: ["target geometry is immutable", "authority does not permit project mutation"],
    targetTypes: ["space", "interface", "journey"],
    requiredAuthority: ["PROJECT_CONTROLLED", "SHARED_AUTHORITY"],
    dependencies: ["adjacency", "circulation", "accessibility"],
    possibleSideEffects: ["increased travel distance", "area or capacity pressure"],
    unknownEffects: ["secondary flow interaction", "regulatory consequence"],
    provenance: ["ARKI generic strategy knowledge", "D6.2 reasoning grammar"],
  },
  {
    id: "SK-REROUTE-TOPOLOGICAL",
    family: "TOPOLOGICAL",
    intent: "Reduce incompatible interaction by changing relationships, sequence or route connectivity without presupposing a room solution.",
    potentialEffects: ["reduce incompatible interaction", "reroute journey", "clarify sequence"],
    preconditions: ["relationship graph is mutable", "required effect concerns journey or interaction"],
    forbiddenConditions: ["relationship graph is immutable", "required authority is unavailable"],
    targetTypes: ["relationship", "journey", "flow"],
    requiredAuthority: ["PROJECT_CONTROLLED", "SHARED_AUTHORITY"],
    dependencies: ["topology", "circulation", "interfaces"],
    possibleSideEffects: ["new crossing", "longer route", "capacity redistribution"],
    unknownEffects: ["downstream scenario effects", "accessibility impact"],
    provenance: ["ARKI generic strategy knowledge", "D6.2 reasoning grammar"],
  },
  {
    id: "SK-SEQUENCE-TEMPORAL",
    family: "TEMPORAL",
    intent: "Reduce incompatible simultaneous interaction by separating use states or time windows.",
    potentialEffects: ["reduce incompatible interaction", "reduce concurrency", "separate operating states"],
    preconditions: ["operating schedule or state is mutable", "required effect concerns concurrency or simultaneous interaction"],
    forbiddenConditions: ["operation requires simultaneous use", "time/state is immutable"],
    targetTypes: ["operation", "flow", "capacity"],
    requiredAuthority: ["PROJECT_CONTROLLED", "SHARED_AUTHORITY"],
    dependencies: ["schedule", "capacity", "operational rules"],
    possibleSideEffects: ["reduced peak availability", "coordination burden"],
    unknownEffects: ["user behavior under schedule change", "peak demand displacement"],
    provenance: ["ARKI generic strategy knowledge", "D6.2 reasoning grammar"],
  },
  {
    id: "SK-CONTROL-ACCESS",
    family: "CONTROL",
    intent: "Reduce incompatible interaction by changing access, permission or interface control.",
    potentialEffects: ["reduce incompatible interaction", "control access", "clarify authority boundary"],
    preconditions: ["access rules or interface control are mutable", "required effect concerns incompatible access"],
    forbiddenConditions: ["authority is external and unavailable", "control would violate a hard constraint"],
    targetTypes: ["interface", "journey", "operation"],
    requiredAuthority: ["PROJECT_CONTROLLED", "SHARED_AUTHORITY"],
    dependencies: ["authority", "access", "operational protocol"],
    possibleSideEffects: ["reduced openness", "new supervision requirement"],
    unknownEffects: ["behavioral adaptation", "equity/accessibility impact"],
    provenance: ["ARKI generic strategy knowledge", "D6.2 reasoning grammar"],
  },
  {
    id: "SK-ALLOCATE-RESOURCE",
    family: "ALLOCATIVE",
    intent: "Reduce incompatible interaction by allocating capacity, resources or users across compatible channels.",
    potentialEffects: ["reduce incompatible interaction", "redistribute capacity", "reduce peak conflict"],
    preconditions: ["capacity or resource allocation is mutable", "required effect concerns demand, capacity or concurrency"],
    forbiddenConditions: ["available capacity is fixed", "allocation would violate a hard constraint"],
    targetTypes: ["capacity", "resource", "flow"],
    requiredAuthority: ["PROJECT_CONTROLLED", "SHARED_AUTHORITY"],
    dependencies: ["demand", "capacity", "scenario", "time"],
    possibleSideEffects: ["inequitable allocation", "residual peak conflict"],
    unknownEffects: ["actual demand response", "secondary resource effects"],
    provenance: ["ARKI generic strategy knowledge", "D6.2 reasoning grammar"],
  },
];

function includesAny(values: string[], needles: string[]): boolean {
  const haystack = values.join(" ").toLowerCase();
  return needles.some((needle) => haystack.includes(needle.toLowerCase()));
}

function effectMatches(input: V62ReasoningInput, strategy: V62StrategyKnowledge): string[] {
  const text = `${input.cause} ${input.requiredEffect} ${input.conditionTags.join(" ")} ${input.stateTags.join(" ")} ${input.scenarioTags.join(" ")}`.toLowerCase();
  return strategy.potentialEffects.filter((effect) => effect.toLowerCase().split(" ").every((token) => text.includes(token)));
}

function evaluateStrategy(input: V62ReasoningInput, strategy: V62StrategyKnowledge): { ok: boolean; reasons: string[]; matchedEffects: string[] } {
  const reasons: string[] = [];
  const matchedEffects = effectMatches(input, strategy);
  if (matchedEffects.length === 0) reasons.push("required effect is not supported by the strategy effects");
  if (strategy.requiredAuthority.includes(input.authority) === false) reasons.push(`authority ${input.authority} is not accepted by this strategy`);
  if (strategy.forbiddenConditions.some((condition) => includesAny([...input.conditionTags, ...input.stateTags, ...input.hardConstraints], [condition]))) reasons.push("forbidden condition matched");
  if (strategy.preconditions.some((condition) => condition.includes("geometry") && input.mutability === "IMMUTABLE")) reasons.push("geometry mutability is insufficient");
  if (strategy.preconditions.some((condition) => condition.includes("relationship graph") && input.mutability === "IMMUTABLE")) reasons.push("relationship mutability is insufficient");
  if (strategy.preconditions.some((condition) => condition.includes("schedule") && includesAny(input.scenarioTags, ["simultaneous", "mandatory simultaneous"]))) reasons.push("temporal separation conflicts with simultaneous-use condition");
  return { ok: reasons.length === 0, reasons, matchedEffects };
}

export function listV62StrategyKnowledge(): V62StrategyKnowledge[] {
  return STRATEGY_KNOWLEDGE.map((strategy) => ({ ...strategy, potentialEffects: [...strategy.potentialEffects], preconditions: [...strategy.preconditions], forbiddenConditions: [...strategy.forbiddenConditions], targetTypes: [...strategy.targetTypes], requiredAuthority: [...strategy.requiredAuthority], dependencies: [...strategy.dependencies], possibleSideEffects: [...strategy.possibleSideEffects], unknownEffects: [...strategy.unknownEffects], provenance: [...strategy.provenance] }));
}

export function synthesizeV62Strategies(input: V62ReasoningInput): V62SynthesisResult {
  const potentialStrategies = listV62StrategyKnowledge();
  const applicableStrategies: V62ApplicableStrategy[] = [];
  const rejectedStrategies: V62RejectedStrategy[] = [];
  for (const strategy of potentialStrategies) {
    const evaluation = evaluateStrategy(input, strategy);
    if (evaluation.ok) {
      applicableStrategies.push({ ...strategy, applicability: "APPLICABLE", rationale: `The generic effects match the required effect and all known preconditions/authority checks pass.`, matchedEffects: evaluation.matchedEffects });
    } else {
      rejectedStrategies.push({ strategyId: strategy.id, family: strategy.family, applicability: "REJECTED", reasons: evaluation.reasons, provenance: [...strategy.provenance] });
    }
  }
  return {
    input: { ...input, conditionTags: [...input.conditionTags], stateTags: [...input.stateTags], scenarioTags: [...input.scenarioTags], hardConstraints: [...input.hardConstraints] },
    potentialStrategies,
    applicableStrategies,
    rejectedStrategies,
    distinctFamilies: Array.from(new Set(applicableStrategies.map((strategy) => strategy.family))),
    provenance: ["ARKI generic strategy knowledge registry", "D6.2 generic applicability checks", "No typology name used for dispatch"],
    disposition: "EXTEND",
  };
}
