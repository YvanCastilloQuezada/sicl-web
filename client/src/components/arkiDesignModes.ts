import type { GDIContinuum } from "./arkiGenerativeDesignContinuum";
import type { IntegratedProductFoundation } from "./arkiIntegratedProductFoundation";

export type ArkiDesignMode = "JUNIOR" | "SENIOR" | "MASTER" | "CRAZY";
export type ArkiIntensity = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
export type ModeProfile = {
  mode: ArkiDesignMode;
  intent: string;
  reasoningDepth: number;
  alternativeBudget: number;
  designSpaceBreadth: number;
  critiqueDepth: number;
  knowledgePerspectives: number;
  counterfactualBudget: number;
  mutationAmplitude: "LOW" | "MEDIUM" | "HIGH" | "RADICAL_BOUNDED";
  noveltyTolerance: "LOW" | "BALANCED" | "HIGH" | "RADICAL_BOUNDED";
  explanationDepth: number;
  technicalCoordinationDepth: number;
  environmentalReasoningDepth: number;
  preserves: readonly ["TRUTH", "EVIDENCE", "HUMAN_AUTHORITY", "HARD_CONSTRAINTS", "UNKNOWN"];
};

const profiles: Record<ArkiDesignMode, Omit<ModeProfile, "mode">> = {
  JUNIOR: { intent: "Fast, clear, conservative and educational exploration.", reasoningDepth: 1, alternativeBudget: 1, designSpaceBreadth: 1, critiqueDepth: 1, knowledgePerspectives: 2, counterfactualBudget: 0, mutationAmplitude: "LOW", noveltyTolerance: "LOW", explanationDepth: 3, technicalCoordinationDepth: 1, environmentalReasoningDepth: 1, preserves: ["TRUTH", "EVIDENCE", "HUMAN_AUTHORITY", "HARD_CONSTRAINTS", "UNKNOWN"] },
  SENIOR: { intent: "Balanced professional architectural design exploration.", reasoningDepth: 2, alternativeBudget: 3, designSpaceBreadth: 2, critiqueDepth: 2, knowledgePerspectives: 4, counterfactualBudget: 1, mutationAmplitude: "MEDIUM", noveltyTolerance: "BALANCED", explanationDepth: 3, technicalCoordinationDepth: 2, environmentalReasoningDepth: 2, preserves: ["TRUTH", "EVIDENCE", "HUMAN_AUTHORITY", "HARD_CONSTRAINTS", "UNKNOWN"] },
  MASTER: { intent: "Deep multi-domain architectural exploration and self-critique.", reasoningDepth: 4, alternativeBudget: 3, designSpaceBreadth: 4, critiqueDepth: 4, knowledgePerspectives: 6, counterfactualBudget: 3, mutationAmplitude: "HIGH", noveltyTolerance: "HIGH", explanationDepth: 4, technicalCoordinationDepth: 4, environmentalReasoningDepth: 4, preserves: ["TRUTH", "EVIDENCE", "HUMAN_AUTHORITY", "HARD_CONSTRAINTS", "UNKNOWN"] },
  CRAZY: { intent: "Controlled radical speculation with explicit soft-constraint proposals.", reasoningDepth: 5, alternativeBudget: 3, designSpaceBreadth: 5, critiqueDepth: 5, knowledgePerspectives: 6, counterfactualBudget: 5, mutationAmplitude: "RADICAL_BOUNDED", noveltyTolerance: "RADICAL_BOUNDED", explanationDepth: 5, technicalCoordinationDepth: 4, environmentalReasoningDepth: 4, preserves: ["TRUTH", "EVIDENCE", "HUMAN_AUTHORITY", "HARD_CONSTRAINTS", "UNKNOWN"] },
};

export function getModeProfile(mode: ArkiDesignMode = "SENIOR"): ModeProfile { return { mode, ...profiles[mode] }; }
export function getIntensity(value: number): ArkiIntensity { const bounded = Math.max(0, Math.min(100, Math.round(value / 10) * 10)); return bounded as ArkiIntensity; }
export function modeView(continuum: GDIContinuum, mode: ArkiDesignMode, intensity: ArkiIntensity = 50) {
  const profile = getModeProfile(mode);
  const count = Math.max(1, Math.min(profile.alternativeBudget, continuum.alternatives.length));
  return { mode, intensity, profile, alternatives: continuum.alternatives.slice(0, count), critiques: continuum.challenges.slice(0, count), noTruthMutation: true as const, humanSelectionRequired: true as const, hardConstraintsPreserved: true as const };
}

export type UnifiedArchitecturalDesignState = {
  project: { projectId: string; modelVersion: string; maturity: IntegratedProductFoundation["model"]["maturity"] };
  site: IntegratedProductFoundation["site"];
  program: { spaces: string[]; areas: Array<{ id: string; areaM2: number | null; state: "ACTUAL" | "UNKNOWN" }>; relationships: "AVAILABLE_FROM_A21" };
  design: { concept: "AVAILABLE_FROM_EXISTING_INTENT"; parti: "AVAILABLE_FROM_EXISTING_SYNTHESIS"; zoning: "AVAILABLE_FROM_A21"; alternatives: string[]; lineage: string[] };
  realization: { plan: string[]; section: string[]; massing: string[]; circulation: string[]; views: string[] };
  technical: { engineering: string[]; regulation: string[]; cost: string[]; constructability: string[] };
  evidence: { knowledge: string[]; unknown: string[]; humanReviews: "REQUIRED" };
  controls: { singleCanonicalModel: true; singleDesignOperationSystem: true; noAutomaticDecision: true; noAutomaticWinner: true; epistemicIntegrity: true };
};

export function buildUnifiedArchitecturalDesignState(foundation: IntegratedProductFoundation, continuum: GDIContinuum): UnifiedArchitecturalDesignState {
  const spaces = foundation.model.elements.filter((item) => item.kind === "SPACE");
  return {
    project: { projectId: foundation.projectId, modelVersion: foundation.model.modelVersion, maturity: foundation.model.maturity },
    site: foundation.site,
    program: { spaces: spaces.map((item) => item.arkiId), areas: spaces.map((item) => ({ id: item.arkiId, areaM2: typeof item.properties.areaM2 === "number" ? item.properties.areaM2 : null, state: typeof item.properties.areaM2 === "number" ? "ACTUAL" : "UNKNOWN" })), relationships: "AVAILABLE_FROM_A21" },
    design: { concept: "AVAILABLE_FROM_EXISTING_INTENT", parti: "AVAILABLE_FROM_EXISTING_SYNTHESIS", zoning: "AVAILABLE_FROM_A21", alternatives: continuum.alternatives.map((item) => item.id), lineage: continuum.branches },
    realization: { plan: foundation.drawings.filter((item) => item.kind === "FLOOR_PLAN").map((item) => item.viewId), section: foundation.drawings.filter((item) => item.kind === "BUILDING_SECTION").map((item) => item.viewId), massing: ["CANONICAL_MODEL_MASSING"], circulation: ["A21_CIRCULATION_INTENT", "CANONICAL_MODEL_ROUTES"], views: foundation.drawings.map((item) => item.viewId) },
    technical: { engineering: foundation.engineering.records.map((item) => item.id), regulation: foundation.regulatory.map((item) => item.result), cost: foundation.quantities.map((item) => item.rateState), constructability: ["CONCEPTUAL_PRESSURE_ONLY"] },
    evidence: { knowledge: ["K1-K11"], unknown: ["REGULATORY_APPLICABILITY", "MARKET_RATES", "EXTERNAL_SOLVER_RESULTS"], humanReviews: "REQUIRED" },
    controls: { singleCanonicalModel: true, singleDesignOperationSystem: true, noAutomaticDecision: true, noAutomaticWinner: true, epistemicIntegrity: true },
  };
}
