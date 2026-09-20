import { buildProjectBGeometricVariants, type ProjectBGeometryVariant } from "./arkiP9ProjectBGeometry";

export const P93_SCENARIOS = ["S0_NORMAL_DAILY", "S1_HIGH_DEMAND_EVENT", "S2_REPAIR_MAKER_SERVICE", "S3_EMERGENCY_SAFE_EXIT"] as const;
export type P93Scenario = typeof P93_SCENARIOS[number];
type Status = "PASS_CONCEPTUAL" | "CONDITIONAL" | "UNKNOWN" | "SPECIALIST_INPUT_REQUIRED";
export type P93Cell = Readonly<{
  candidateId: string;
  scenario: P93Scenario;
  activeTopology: Status;
  journey: Status;
  flowConflicts: string[];
  interfaceConflicts: string[];
  bottlenecks: string[];
  deficits: string[];
  dependencies: string[];
  unknowns: Array<{ what: string; why: string; blocks: string; resolution: string; authority: string }>;
  specialistDependency: "NONE_IDENTIFIED" | "SPECIALIST_INPUT_REQUIRED";
  evidenceSufficiency: "RELATIONAL_PROXY" | "INSUFFICIENT";
  humanDecisionRequired: boolean;
}>;
export type P93Evaluation = Readonly<{
  phase: "P9.3";
  candidates: ReadonlyArray<{ candidateId: string; projectId: string; modelVersion: string; sourcePlanId: string; elementFingerprint: string; parentGeometryHash: string; immutable: true }>;
  cells: ReadonlyArray<P93Cell>;
  crossScenario: Record<string, "STABLE" | "CONDITIONALLY_STABLE" | "SCENARIO_SENSITIVE" | "INSUFFICIENT_EVIDENCE">;
  preferenceReversal: "NONE_OBSERVED" | "OBSERVED";
  dominance: "INCOMPARABLE_DUE_TO_UNKNOWN" | "NON_DOMINATED" | "INSUFFICIENT_EVIDENCE";
  automaticWinner: "NONE";
  automaticRecommendation: "NONE";
  learningCandidate: "NONE" | "LEARNING_CANDIDATE_PENDING_CHALLENGE";
  k1: "NOT_CREATED";
}>;

const hash = (value: unknown) => {
  const text = JSON.stringify(value);
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return `fnv1a:${(h >>> 0).toString(16).padStart(8, "0")}`;
};
const evidence = (variant: ProjectBGeometryVariant) => hash(variant.model.elements.map((e) => ({ id: e.arkiId, kind: e.kind, geometry: e.geometry })));
const unknown = (what: string, why: string, blocks: string, resolution: string, authority: string) => ({ what, why, blocks, resolution, authority });

function evaluateCell(variant: ProjectBGeometryVariant, scenario: P93Scenario): P93Cell {
  const hasSingleRoute = variant.model.elements.filter((e) => e.kind === "ROUTE").length === 1;
  const hasDoors = variant.model.elements.filter((e) => e.kind === "DOOR").length > 0;
  const scenarioIsEmergency = scenario === "S3_EMERGENCY_SAFE_EXIT";
  const scenarioIsConcurrent = scenario === "S1_HIGH_DEMAND_EVENT" || scenario === "S2_REPAIR_MAKER_SERVICE";
  const unknowns = [
    unknown("Occupancy, cycle time and service rate", "No operational numeric inputs were supplied.", "Static/service/throughput capacity claims", "Provide measured or agreed scenario parameters", "Human architect plus operator/specialist evidence"),
    unknown("Regulatory applicability and limits", "Jurisdiction and applicable code parameters are absent from Project B.", "Compliance and permit conclusions", "Provide jurisdiction, code edition and specialist review", "Human architect and qualified regulator/code specialist"),
  ];
  if (scenarioIsEmergency) unknowns.push(unknown("Egress and fire-engineering evidence", "Only conceptual topology is represented.", "Evacuation compliance and safe-exit certification", "Provide code-based egress analysis and fire-engineering evidence", "Qualified fire/life-safety specialist"));
  return {
    candidateId: variant.variantId,
    scenario,
    activeTopology: scenario === "S0_NORMAL_DAILY" ? "PASS_CONCEPTUAL" : "CONDITIONAL",
    journey: scenario === "S0_NORMAL_DAILY" && hasDoors ? "PASS_CONCEPTUAL" : "CONDITIONAL",
    flowConflicts: scenarioIsConcurrent ? ["Public, learning and support/service interactions require operational control; conflict is conditional, not verified."] : [],
    interfaceConflicts: hasDoors ? ["Shared thresholds and door interfaces may become bottlenecks under changed demand; width/control data is absent."] : ["No traversable interface is evidenced."],
    bottlenecks: hasSingleRoute ? ["Single represented public route is a potential common-mode dependency; capacity is not asserted."] : [],
    deficits: scenarioIsConcurrent ? ["Potential scenario-dependent separation/control deficit; evidence is relational proxy only."] : [],
    dependencies: ["Route availability", "Door/interface control", "Capacity parameters", "Specialist/regulatory evidence"],
    unknowns,
    specialistDependency: scenarioIsEmergency ? "SPECIALIST_INPUT_REQUIRED" : "SPECIALIST_INPUT_REQUIRED",
    evidenceSufficiency: scenarioIsEmergency || scenarioIsConcurrent ? "INSUFFICIENT" : "RELATIONAL_PROXY",
    humanDecisionRequired: true,
  };
}

export function evaluateProjectBP93(variants = buildProjectBGeometricVariants()): P93Evaluation {
  const candidates = variants.map((variant) => ({ candidateId: variant.variantId, projectId: variant.model.projectId, modelVersion: variant.model.modelVersion, sourcePlanId: variant.model.sourcePlanId, elementFingerprint: hash(variant.model.elements.map((e) => e.arkiId)), parentGeometryHash: evidence(variant), immutable: true as const }));
  const cells = variants.flatMap((variant) => P93_SCENARIOS.map((scenario) => evaluateCell(variant, scenario)));
  return {
    phase: "P9.3",
    candidates,
    cells,
    crossScenario: Object.fromEntries(variants.map((variant) => [variant.variantId, "SCENARIO_SENSITIVE"])),
    preferenceReversal: "NONE_OBSERVED",
    dominance: "INCOMPARABLE_DUE_TO_UNKNOWN",
    automaticWinner: "NONE",
    automaticRecommendation: "NONE",
    learningCandidate: "NONE",
    k1: "NOT_CREATED",
  };
}

export function validateP93Evaluation(result: P93Evaluation, original = buildProjectBGeometricVariants()): boolean {
  if (result.cells.length !== 8 || result.candidates.length !== 2) return false;
  if (result.automaticWinner !== "NONE" || result.automaticRecommendation !== "NONE" || result.k1 !== "NOT_CREATED") return false;
  return result.candidates.every((candidate) => candidate.immutable && original.some((variant) => variant.variantId === candidate.candidateId && evidence(variant) === candidate.parentGeometryHash)) && result.cells.every((cell) => cell.humanDecisionRequired && cell.unknowns.length > 0);
}

export function p93Markdown(result: P93Evaluation): string {
  const lines = ["# ARKI — P9.3 Project B Multi-Scenario Adversarial Evaluation", "", "## Status", "", "P9.3 = COMPLETED_WITH_UNKNOWN_AND_HUMAN_DECISION_REQUIRED", "", "No candidate geometry was mutated. No winner or recommendation was created. Evidence is relational/topological proxy only.", "", "## Candidate × scenario matrix", "", "| Candidate | Scenario | Active topology | Journey | Conflicts | Bottlenecks | Evidence | Specialist dependency |", "|---|---|---|---|---|---|---|---|"];
  for (const cell of result.cells) lines.push(`| ${cell.candidateId} | ${cell.scenario} | ${cell.activeTopology} | ${cell.journey} | ${cell.flowConflicts.length + cell.interfaceConflicts.length} | ${cell.bottlenecks.length} | ${cell.evidenceSufficiency} | ${cell.specialistDependency} |`);
  lines.push("", "## Cross-scenario conclusions", "", `- B-CANDIDATE-01: ${result.crossScenario["B-CANDIDATE-01"]}.`, `- B-CANDIDATE-02: ${result.crossScenario["B-CANDIDATE-02"]}.`, `- Preference reversal: ${result.preferenceReversal}.`, `- Dominance: ${result.dominance}.`, "- Automatic winner: NONE.", "- Automatic recommendation: NONE.", "- Learning candidate: NONE; K1: NOT_CREATED.", "", "## Human deliberation required", "", "Choose whether to develop B-01, develop B-02, retain both and request targeted evidence, authorize a mutation, reject both, or request a new candidate family. This packet does not encode a preferred option.");
  return lines.join("\n") + "\n";
}
