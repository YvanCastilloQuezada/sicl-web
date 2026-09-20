import { validateAuthoringIdentity, type CanonicalBuildingModel, type DrawingView } from "./arkiBuildingAuthoring";
import { validateS1FloorPlan, type S1FloorPlan } from "./arkiConstructiveSpatialGeneration";

export type RPartiProvenanceState = "SOURCE_DOCUMENTED" | "SOURCE_DERIVED" | "ARKI_INTERPRETATION" | "ARKI_DERIVED" | "ARKI_GENERATED" | "ARKI_DISCOVERED_CANDIDATE" | "HUMAN_CONFIRMED";
export type RPartiRetrievalMode = "PRECEDENT" | "REFERENCE" | "ANALOGICAL_EXPLORATORY";
export type RPartiDistance = "R0" | "R1" | "R2" | "R3" | "R4";
export type RPartiDesignLayer = "VISUAL_MEMORY" | "CASE_MEMORY" | "ABSTRACT_ARCHITECTURAL_KNOWLEDGE";
export type RPartiDesignSpaceState = "AVAILABLE" | "ACCESSIBLE" | "EXPLORED";

export type RPartiEntry = {
  id: string;
  title: string;
  layer: RPartiDesignLayer;
  kind: "FORM" | "ORGANIZATION" | "RELATION" | "PRECEDENT" | "REFERENCE" | "ANALOGY" | "PARTI" | "OPERATOR" | "COUNTEREXAMPLE";
  description: string;
  provenanceState: RPartiProvenanceState;
  sourceRefs: string[];
  derivedFrom: string[];
  authorIntent: "DOCUMENTED" | "UNKNOWN" | "NOT_APPLICABLE";
  humanReviewRequired: true;
};

export type RPartiDesignSpace = { available: string[]; accessible: string[]; explored: string[] };

export type RPartiArchitecturalSeed = {
  seedId: string;
  conditions: string[];
  references: string[];
  intents: string[];
  rationale: string;
  provenance: string[];
  architecturalSeed: true;
  computationalSeed?: string;
};

export type RPartiHypothesis = {
  partiId: string;
  seedId: string;
  organizingHypothesis: string;
  relations: string[];
  formInterpretations: string[];
  realizationFamilyIds: string[];
  provenance: string[];
  status: "HYPOTHESIS" | "HUMAN_CONFIRMED" | "REJECTED";
  noAutomaticWinner: true;
};

export type RPartiRealizationFamily = { familyId: string; partiId: string; realizationIds: string[]; notTemplate: true };

export type RPartiBranchEvent = {
  type: "BACKTRACK" | "REFRAME";
  fromLevel: "B0_GEOMETRY" | "B1_CANDIDATE" | "B2_REALIZATION_FAMILY" | "B3_PARTI" | "B4_ARCHITECTURAL_SEED" | "B5_GENERATOR" | "B6_PROBLEM_FRAME";
  toLevel: string;
  preservedEvidence: string[];
  reason: string;
  humanReviewRequired: true;
};

export type RPartiRetrievalResult = {
  entryId: string;
  mode: RPartiRetrievalMode;
  distance: RPartiDistance;
  structuralSimilarity: string[];
  surfaceSimilarity: string[];
  contextCompatibility: "COMPATIBLE" | "PARTIAL" | "UNKNOWN" | "INCOMPATIBLE";
  transferability: "POSSIBLE" | "ADAPT_REQUIRED" | "UNKNOWN" | "NOT_SUPPORTED";
  adaptationBurden: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  fixationRisk: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  relationFirst: true;
  noFormCopying: true;
};

export type RPartiHardConstraintResult = { status: "PASS" | "CONFLICT" | "UNKNOWN"; failedChecks: string[]; unknowns: string[]; sourcePlanId: string };
export type RPartiAestheticReview = { candidateId: string; action: "ACCEPT" | "REJECT" | "REQUEST_MORE_EVIDENCE"; reason: string; humanConfirmed: true; createsWinner: false; createsLearning: false };
export type RPartiFixationResult = { fixed: boolean; repeatedPartiIds: string[]; threshold: number; reason: string };
export type RPartiAlternative = { candidateId: string; partiId: string; changedRelations: string[]; preservedConstraints: string[]; status: "CANDIDATE"; noAutomaticWinner: true };
export type RPartiRepresentationResolution = { status: "PASS" | "CONFLICT" | "UNKNOWN"; missingElementIds: string[]; inconsistentViewIds: string[]; reason: string };

export const R_PARTI_MANUAL_ID = "ARKI-MANUAL-FORMAS-ARQUITECTONICAS";
export const R_PARTI_MANUAL_VERSION = "0.2.0-CHECKPOINT";

export const R_PARTI_FIXTURES: RPartiEntry[] = [
  { id: "RPF-01", title: "Patio como vacío relacional", layer: "ABSTRACT_ARCHITECTURAL_KNOWLEDGE", kind: "RELATION", description: "El vacío organiza proximidad, luz y secuencia; no prescribe una planta.", provenanceState: "SOURCE_DERIVED", sourceRefs: ["R-PARTI checkpoint / M03"], derivedFrom: [], authorIntent: "UNKNOWN", humanReviewRequired: true },
  { id: "RPF-02", title: "Barra + espina de circulación", layer: "ABSTRACT_ARCHITECTURAL_KNOWLEDGE", kind: "ORGANIZATION", description: "Una organización lineal potencial que requiere validación programática y contextual.", provenanceState: "ARKI_INTERPRETATION", sourceRefs: ["R-PARTI checkpoint / M02-M03"], derivedFrom: [], authorIntent: "UNKNOWN", humanReviewRequired: true },
  { id: "RPF-03", title: "Casa patio de referencia", layer: "CASE_MEMORY", kind: "PRECEDENT", description: "Caso de referencia para recuperar relaciones, no para copiar forma.", provenanceState: "SOURCE_DOCUMENTED", sourceRefs: ["R-PARTI fixture case / source required"], derivedFrom: [], authorIntent: "DOCUMENTED", humanReviewRequired: true },
  { id: "RPF-04", title: "Ramificación de un sistema natural", layer: "VISUAL_MEMORY", kind: "ANALOGY", description: "Analogía cross-domain cuyo valor depende de la relación transferida, no de la apariencia.", provenanceState: "ARKI_INTERPRETATION", sourceRefs: ["R-PARTI checkpoint / R4"], derivedFrom: [], authorIntent: "NOT_APPLICABLE", humanReviewRequired: true },
  { id: "RPF-05", title: "Interfaz limpia/sucia", layer: "ABSTRACT_ARCHITECTURAL_KNOWLEDGE", kind: "COUNTEREXAMPLE", description: "Contraejemplo de transferencia indiscriminada: una separación puede ser necesaria en un contexto y no en otro.", provenanceState: "ARKI_DERIVED", sourceRefs: ["R-PARTI checkpoint / I20"], derivedFrom: ["RPF-02"], authorIntent: "UNKNOWN", humanReviewRequired: true },
];

export function createArchitecturalSeed(input: Omit<RPartiArchitecturalSeed, "architecturalSeed">): RPartiArchitecturalSeed { return { ...input, architecturalSeed: true }; }
export function createPartiHypothesis(input: Omit<RPartiHypothesis, "noAutomaticWinner">): RPartiHypothesis { return { ...input, noAutomaticWinner: true }; }
export function createRealizationFamily(input: Omit<RPartiRealizationFamily, "notTemplate">): RPartiRealizationFamily { return { ...input, notTemplate: true }; }

export function retrieveManualEntry(entry: RPartiEntry, mode: RPartiRetrievalMode, distance: RPartiDistance): RPartiRetrievalResult {
  const contextCompatibility = mode === "PRECEDENT" && distance === "R0" ? "COMPATIBLE" : "UNKNOWN";
  const transferability = distance === "R0" || distance === "R1" ? "ADAPT_REQUIRED" : "UNKNOWN";
  return { entryId: entry.id, mode, distance, structuralSimilarity: [], surfaceSimilarity: [], contextCompatibility, transferability, adaptationBurden: distance === "R0" ? "LOW" : "UNKNOWN", fixationRisk: mode === "REFERENCE" ? "MODERATE" : "UNKNOWN", relationFirst: true, noFormCopying: true };
}

export function validateRPartiEntry(entry: RPartiEntry): boolean { return Boolean(entry.id && entry.description && entry.provenanceState && entry.sourceRefs.length > 0 && entry.humanReviewRequired && (entry.provenanceState !== "SOURCE_DOCUMENTED" || entry.authorIntent === "DOCUMENTED")); }
export function validateDesignSpace(space: RPartiDesignSpace): boolean { return Array.isArray(space.available) && Array.isArray(space.accessible) && Array.isArray(space.explored) && space.explored.every((item) => space.accessible.includes(item)); }
export function validateRPartiInvariants(seed: RPartiArchitecturalSeed, parti: RPartiHypothesis, family: RPartiRealizationFamily): boolean { return seed.architecturalSeed && parti.seedId === seed.seedId && family.partiId === parti.partiId && family.notTemplate && parti.noAutomaticWinner && parti.status !== "HUMAN_CONFIRMED"; }
export function classifyBacktrackOrReframe(event: RPartiBranchEvent): "BACKTRACK" | "REFRAME" { return event.type; }

/** RP-06: consume the existing S1 hard validations; regulatory compliance stays separate. */
export function evaluatePartiHardConstraints(plan: S1FloorPlan): RPartiHardConstraintResult {
  const checks = ["ROOM_CONTAINMENT", "ROOM_NON_OVERLAP", "TARGET_AREA_TOLERANCE", "ADJACENCY_GEOMETRY", "DOOR_CONNECTION", "WALL_CLOSURE", "CIRCULATION_CONTINUITY", "STAIR_LEVEL_CONNECTION", "SHAFT_CONTINUITY", "ACCESSIBLE_ROUTE_CONTINUITY"];
  const failedChecks = checks.filter((id) => plan.validations.find((item) => item.id === id)?.state !== "PASS");
  const unknowns = plan.validations.filter((item) => item.state === "UNKNOWN").map((item) => item.id);
  return { status: failedChecks.length ? "CONFLICT" : validateS1FloorPlan(plan) ? "PASS" : "UNKNOWN", failedChecks, unknowns, sourcePlanId: plan.id };
}

/** RP-09: a human review is data, not an automatic aesthetic score or learning event. */
export function recordHumanAestheticReview(input: Omit<RPartiAestheticReview, "humanConfirmed" | "createsWinner" | "createsLearning">): RPartiAestheticReview {
  return { ...input, humanConfirmed: true, createsWinner: false, createsLearning: false };
}

/** RP-10/RP-13: preserve evidence while returning to a prior design level. */
export function deriveGeometryBacktrack(candidateId: string, reason: string, evidence: string[]): RPartiBranchEvent {
  return { type: "BACKTRACK", fromLevel: "B0_GEOMETRY", toLevel: "B2_REALIZATION_FAMILY", preservedEvidence: [`candidate:${candidateId}`, ...evidence], reason, humanReviewRequired: true };
}

/** RP-12: detection only; no automatic rejection or mutation. */
export function detectPartiFixation(history: Array<{ partiId: string; changedRelations: string[] }>, threshold = 3): RPartiFixationResult {
  const counts = new Map<string, number>();
  history.forEach((item) => counts.set(item.partiId, (counts.get(item.partiId) ?? 0) + 1));
  const repeatedPartiIds = Array.from(counts.entries()).filter(([id, count]) => count >= threshold && history.filter((item) => item.partiId === id).every((item) => item.changedRelations.length === 0)).map(([id]) => id);
  return { fixed: repeatedPartiIds.length > 0, repeatedPartiIds, threshold, reason: repeatedPartiIds.length ? "Repeated same-parti exploration without relation change; human review required." : "No fixation detected by the bounded heuristic." };
}

/** RP-16: verify that representations reference the same canonical identity. */
export function validateRPartiRepresentationResolution(model: CanonicalBuildingModel, views: DrawingView[], requiredElementIds: string[]): RPartiRepresentationResolution {
  if (!validateAuthoringIdentity(model, views)) return { status: "CONFLICT", missingElementIds: requiredElementIds.filter((id) => !model.elements.some((element) => element.arkiId === id)), inconsistentViewIds: views.map((view) => view.viewId), reason: "Canonical model or view identity validation failed." };
  const missingElementIds = requiredElementIds.filter((id) => !model.elements.some((element) => element.arkiId === id));
  const inconsistentViewIds = views.filter((view) => view.modelVersion !== model.modelVersion || requiredElementIds.some((id) => view.elementIds.includes(id) && !model.elements.some((element) => element.arkiId === id))).map((view) => view.viewId);
  return { status: missingElementIds.length || inconsistentViewIds.length ? "CONFLICT" : "PASS", missingElementIds, inconsistentViewIds, reason: missingElementIds.length || inconsistentViewIds.length ? "Some required canonical IDs are unresolved." : "All required IDs resolve to the same canonical model version." };
}

/** RP-18: semantic alternative expansion preserves hard constraints before geometry. */
export function expandConstraintPreservingAlternatives(partiId: string, relationOptions: string[][], hardConstraints: string[]): RPartiAlternative[] {
  return relationOptions.filter((relations) => relations.length > 0).map((relations, index) => ({ candidateId: `${partiId}:ALT:${index + 1}`, partiId, changedRelations: relations, preservedConstraints: [...hardConstraints], status: "CANDIDATE", noAutomaticWinner: true }));
}

export function summarizeRealizationFamily(family: RPartiRealizationFamily, materialization?: { geometricallyDistinct: boolean; status: "PASS" | "BLOCKED" }): { status: "SUPPORTED" | "REQUIRES_GEOMETRIC_MATERIALIZATION"; realizationCount: number; distinctGeometryProven: boolean } {
  const distinctGeometryProven = materialization?.status === "PASS" && materialization.geometricallyDistinct;
  return { status: family.realizationIds.length <= 1 || distinctGeometryProven ? "SUPPORTED" : "REQUIRES_GEOMETRIC_MATERIALIZATION", realizationCount: family.realizationIds.length, distinctGeometryProven };
}
