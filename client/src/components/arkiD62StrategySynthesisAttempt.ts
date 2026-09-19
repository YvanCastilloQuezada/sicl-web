import { classifyV6Discovery, type V6StrategyFamily } from "./arkiV6ReasoningCheckpoint";

export type D62StrategyCandidate = {
  family: V6StrategyFamily;
  intent: string;
  requiredEffect: string;
  preconditions: string[];
  forbiddenConditions: string[];
  authority: string;
  provenance: string[];
};

export type D62Attempt = {
  problem: string;
  providedStrategies: string[];
  retrievedStrategies: string[];
  generatedStrategies: D62StrategyCandidate[];
  rejectedStrategies: Array<{ label: string; reason: string }>;
  provenance: string[];
  gate: "PASS" | "BLOCKED";
  l5: "DEMONSTRATED" | "NOT_DEMONSTRATED";
  capabilityGap: { missing: string; whyCurrentCoreCannotDoIt: string; minimumGeneralCapability: string } | null;
  discovery: ReturnType<typeof classifyV6Discovery>;
};

export function attemptD62StrategySynthesis(problem: string): D62Attempt {
  const discovery = classifyV6Discovery({
    capabilityId: "D6.2-GENERAL-STRATEGY-SYNTHESIS",
    existingArtifact: "V6StrategyFamily types + V6DesignMove contract",
    currentCapability: "Can represent strategy families and design moves after a strategy exists.",
    gap: "No general strategy knowledge registry or applicability/synthesis procedure produces unseeded strategies.",
    disposition: "EXTEND",
    affectedFiles: ["client/src/components/arkiV6ReasoningCheckpoint.ts"],
  });
  return {
    problem,
    providedStrategies: [],
    retrievedStrategies: [],
    generatedStrategies: [],
    rejectedStrategies: [{ label: "fixture-specific repair answers", reason: "Rejected by the anti-hardcoding rule; no domain name may secretly determine the answer." }],
    provenance: ["D6.2 macroorder", "V6StrategyFamily", "V6DesignMove contract", "arkiV6ReasoningCheckpoint.ts"],
    gate: "BLOCKED",
    l5: "NOT_DEMONSTRATED",
    capabilityGap: {
      missing: "A provenance-bearing general strategy synthesis and applicability layer.",
      whyCurrentCoreCannotDoIt: "The current core represents strategy families and moves but has no strategy effect/precondition registry and no general procedure mapping cause + required effect + conditions + authority + mutability to applicable strategies.",
      minimumGeneralCapability: "Extend the existing v6 contracts with generic strategy knowledge records, applicability checks, rejection reasons and provenance; do not create typology-specific repair engines.",
    },
    discovery,
  };
}

export const D62_PROBLEM_FIXTURE = "A structurally new project reports incompatible simultaneous interaction under known conditions, with authority and mutability explicitly bounded; no strategy is supplied.";
