import { buildV6DesignMove, type V6DesignMove, type V6OperatorFamily } from "./arkiV6ReasoningCheckpoint";
import type { V62ContextualStrategy } from "./arkiV62StrategyKnowledge";

export type D63Candidate = {
  candidateId: string;
  strategyId: string;
  designMove: V6DesignMove;
  operatorComposition: Array<{ family: V6OperatorFamily; operation: string; target: string }>;
  lineage: string[];
  status: "CANDIDATE" | "REJECTED";
  epistemicStatus: "HYPOTHESIS";
  geometryMutation: "NOT_EXECUTED";
  noAutomaticWinner: true;
  humanReviewRequired: true;
  provenance: string[];
};

export type D63SynthesisResult = {
  contextualStrategies: number;
  designMoves: V6DesignMove[];
  candidates: D63Candidate[];
  rejected: Array<{ strategyId: string; reason: string }>;
  gate: "PASS" | "BLOCKED";
  l6: "DEMONSTRATED" | "NOT_DEMONSTRATED";
  l7: "NOT_EXECUTED";
};

function operatorFor(strategy: V62ContextualStrategy): { family: V6OperatorFamily; operation: string; target: string } {
  const target = strategy.contextualization.find((item) => item.startsWith("Target conditions:"))?.replace("Target conditions: ", "") || "current interface";
  switch (strategy.family) {
    case "SPATIAL": return { family: "SPATIAL", operation: "SEPARATE_INTERFACE", target };
    case "TOPOLOGICAL": return { family: "TOPOLOGICAL", operation: "REROUTE_RELATIONSHIP", target };
    case "TEMPORAL": return { family: "TEMPORAL", operation: "SEQUENCE_OPERATION", target };
    case "CONTROL": return { family: "CONTROL", operation: "RESTRICT_INTERFACE_ACCESS", target };
    case "ALLOCATIVE": return { family: "ALLOCATIVE", operation: "REDISTRIBUTE_CAPACITY", target };
    default: return { family: "COMPOSITIONAL", operation: "COMPOSE_CONTEXTUAL_TRANSFORMATION", target };
  }
}

export function synthesizeD63Candidates(strategies: V62ContextualStrategy[]): D63SynthesisResult {
  const designMoves: V6DesignMove[] = [];
  const candidates: D63Candidate[] = [];
  const rejected: Array<{ strategyId: string; reason: string }> = [];
  for (const strategy of strategies) {
    const operator = operatorFor(strategy);
    if (!strategy.provenance.length || strategy.epistemicStatus !== "HYPOTHESIS") {
      rejected.push({ strategyId: strategy.strategyId, reason: "CONTEXTUAL_STRATEGY_PROVENANCE_OR_STATE_INVALID" });
      continue;
    }
    const move = buildV6DesignMove({
      moveId: `D63-MOVE:${strategy.strategyId}`,
      intent: strategy.statement,
      target: operator.target,
      strategyFamilies: [strategy.family],
      operators: [operator],
      preconditions: ["Human review of contextual strategy", ...strategy.applicabilityEvidence],
      forbiddenConditions: ["automatic mutation", "unverified regulatory claim"],
      authorityScope: "HUMAN_ARCHITECT_REVIEW_REQUIRED",
      expectedBenefits: [strategy.requiredEffect],
      expectedCosts: strategy.unknowns,
      expectedRisks: strategy.unknowns,
      unknownEffects: strategy.unknowns,
      impactScope: "POSSIBLE",
      verificationPlan: ["Generate candidate without mutating parent", "Re-evaluate dependencies before any authorized mutation", "Human review required"],
      provenance: [...strategy.provenance, "D6.3 operator selection", "D6.3 composition"],
    });
    designMoves.push(move);
    candidates.push({
      candidateId: `D63-CANDIDATE:${strategy.strategyId}`,
      strategyId: strategy.strategyId,
      designMove: move,
      operatorComposition: [operator],
      lineage: ["D6.2R contextual strategy", strategy.strategyId, move.moveId],
      status: "CANDIDATE",
      epistemicStatus: "HYPOTHESIS",
      geometryMutation: "NOT_EXECUTED",
      noAutomaticWinner: true,
      humanReviewRequired: true,
      provenance: [...strategy.provenance, "D6.3 candidate synthesis"],
    });
  }
  return {
    contextualStrategies: strategies.length,
    designMoves,
    candidates,
    rejected,
    gate: candidates.length > 0 && candidates.length === designMoves.length ? "PASS" : "BLOCKED",
    l6: candidates.length > 0 && candidates.length === designMoves.length ? "DEMONSTRATED" : "NOT_DEMONSTRATED",
    l7: "NOT_EXECUTED",
  };
}
