import type { A21HouseProof } from "./a21ArchitecturalProgram";
import { buildHouseA21Proof } from "./a21ArchitecturalProgram";
import type { DesignMemory, DesignMemoryEpistemicState } from "./a21DesignMemory";
import { createDesignMemory, appendDesignMemoryEntry } from "./a21DesignMemory";

export type K1EpistemicClass =
  | "FACT"
  | "OBSERVATION"
  | "COMPUTED_RESULT"
  | "INTERPRETATION"
  | "HYPOTHESIS"
  | "HUMAN_FEEDBACK"
  | "EXPERIENCE"
  | "PRECEDENT"
  | "STRATEGY_CANDIDATE"
  | "PATTERN_CANDIDATE"
  | "KNOWLEDGE_CANDIDATE"
  | "VALIDATED_KNOWLEDGE"
  | "CONTRADICTORY"
  | "UNKNOWN";

export type K1SourceClass =
  | "PROJECT_EVIDENCE"
  | "HUMAN_ARCHITECT_FEEDBACK"
  | "SPECIALIST_FEEDBACK"
  | "REGULATORY_SOURCE"
  | "TECHNICAL_STANDARD"
  | "BOOK"
  | "PAPER"
  | "CASE_STUDY"
  | "PRECEDENT"
  | "SIMULATION_RESULT"
  | "COMPUTED_RESULT"
  | "FIELD_OBSERVATION"
  | "POST_OCCUPANCY_EVIDENCE"
  | "ARKI_HYPOTHESIS";

export type K1ReuseState =
  | "PROJECT_ONLY"
  | "CANDIDATE"
  | "CONTEXT_BOUNDED"
  | "VALIDATED_FOR_CONTEXT"
  | "DEPRECATED"
  | "CONTRADICTED"
  | "UNKNOWN_APPLICABILITY";

export type K1Context = {
  projectId?: string;
  spatialScope?: string;
  typology?: string;
  designStage?: string;
  geographicContext?: string;
  jurisdiction?: string;
  climateContext?: string;
  siteContext?: string;
  programContext?: string;
  userContext?: string;
  constraintContext?: string;
  objectiveContext?: string;
  geometryContext?: string;
  temporalContext?: string;
};

export type K1Provenance = {
  sourceClass: K1SourceClass;
  sourceRefs: string[];
  capturedBy: "ARCHITECT" | "ARKI" | "SYSTEM";
  capturedAt: string;
  evidenceRefs: string[];
  humanReviewState: "NOT_STARTED" | "PENDING" | "CONFIRMED" | "REJECTED";
};

export type K1HumanFeedback = {
  feedbackId: string;
  statement: string;
  action: "CONFIRM" | "CORRECT" | "REJECT" | "REQUEST_MORE_EVIDENCE";
  reason?: string;
  projectId: string;
  context: K1Context;
  provenance: K1Provenance;
  epistemicClass: "HUMAN_FEEDBACK";
};

export type K1ExperienceRecord = {
  experienceId: string;
  projectId: string;
  spatialScope: string;
  typology: string;
  designStage: string;
  context: K1Context;
  problem: string;
  intent: string;
  arkiProposal: string;
  humanAction: "CONFIRMED" | "CORRECTED" | "REJECTED" | "UNRECORDED";
  humanFeedback?: K1HumanFeedback;
  observedResult?: string;
  changed: string[];
  unknowns: string[];
  conflicts: string[];
  provenance: K1Provenance;
  epistemicClass: "EXPERIENCE";
  reuseState: "PROJECT_ONLY";
};

export type K1KnowledgeCandidate = {
  candidateId: string;
  claim: string;
  source: K1SourceClass;
  provenance: K1Provenance;
  epistemicStatus: "KNOWLEDGE_CANDIDATE" | "VALIDATED_KNOWLEDGE" | "CONTRADICTORY";
  context: K1Context;
  assumptions: string[];
  supportingEvidence: string[];
  contradictingEvidence: string[];
  validationState: "NOT_VALIDATED" | "HUMAN_VALIDATED" | "REJECTED";
  reuseState: K1ReuseState;
  noAutomaticPromotion: true;
};

export type K1Contradiction = {
  contradictionId: string;
  candidates: string[];
  contexts: K1Context[];
  supportingEvidence: string[][];
  unresolvedTradeoff: string;
  preserved: true;
  winnerCreated: false;
};

export type K1LearningReadModel = {
  experiences: K1ExperienceRecord[];
  candidates: K1KnowledgeCandidate[];
  contradictions: K1Contradiction[];
  projectMemory: DesignMemory;
  sourceAuthority: { sourceExists: boolean; applicable: "YES" | "NO" | "UNKNOWN"; authoritative: "YES" | "NO" | "UNKNOWN"; supportsClaim: "YES" | "NO" | "UNKNOWN" };
  noAutomaticPromotion: true;
  noAutomaticDecision: true;
  noAutomaticWinner: true;
};

const timestamp = "2026-09-18T00:00:00.000Z";
const provenance = (sourceClass: K1SourceClass, sourceRefs: string[], capturedBy: K1Provenance["capturedBy"] = "ARCHITECT"): K1Provenance => ({ sourceClass, sourceRefs, capturedBy, capturedAt: timestamp, evidenceRefs: [], humanReviewState: "CONFIRMED" });

export function createK1ReadModel(projectId: string): K1LearningReadModel {
  return { experiences: [], candidates: [], contradictions: [], projectMemory: createDesignMemory(projectId), sourceAuthority: { sourceExists: false, applicable: "UNKNOWN", authoritative: "UNKNOWN", supportsClaim: "UNKNOWN" }, noAutomaticPromotion: true, noAutomaticDecision: true, noAutomaticWinner: true };
}

export function recordHumanFeedback(model: K1LearningReadModel, input: Omit<K1HumanFeedback, "epistemicClass" | "provenance"> & { sourceRefs?: string[] }): K1LearningReadModel {
  const feedback: K1HumanFeedback = { ...input, epistemicClass: "HUMAN_FEEDBACK", provenance: provenance("HUMAN_ARCHITECT_FEEDBACK", input.sourceRefs ?? [`feedback:${input.feedbackId}`]) };
  const entryState: DesignMemoryEpistemicState = input.action === "REJECT" ? "CONFLICTING" : "HUMAN_CONFIRMED";
  const memory = appendDesignMemoryEntry(model.projectMemory, { entryId: `k1-feedback:${input.feedbackId}`, entryType: input.action === "REJECT" ? "CRITIQUE_RECORDED" : "RELATIONSHIP_CHANGED", branchId: model.projectMemory.activeBranchId, author: "ARCHITECT", trigger: "ARKI-K1 human feedback", statement: input.statement, observations: [input.action], alternativesConsidered: [], rejectedAlternatives: [], tradeoffIds: [], consequences: [], unresolvedQuestions: [], sourceRefs: feedback.provenance.sourceRefs, geometryRefs: [], programRefs: [], adjacencyRefs: [], zoningRefs: [], circulationRefs: [], reviewState: "CONFIRMED", epistemicState: entryState });
  return { ...model, projectMemory: memory };
}

export function recordProjectExperience(model: K1LearningReadModel, input: Omit<K1ExperienceRecord, "epistemicClass" | "reuseState" | "provenance"> & { sourceRefs?: string[] }): K1LearningReadModel {
  const experience: K1ExperienceRecord = { ...input, epistemicClass: "EXPERIENCE", reuseState: "PROJECT_ONLY", provenance: provenance("PROJECT_EVIDENCE", input.sourceRefs ?? [`experience:${input.experienceId}`]) };
  return { ...model, experiences: [...model.experiences, experience] };
}

export function proposeKnowledgeCandidate(model: K1LearningReadModel, input: Omit<K1KnowledgeCandidate, "epistemicStatus" | "validationState" | "reuseState" | "noAutomaticPromotion">): K1LearningReadModel {
  const candidate: K1KnowledgeCandidate = { ...input, epistemicStatus: "KNOWLEDGE_CANDIDATE", validationState: "NOT_VALIDATED", reuseState: "CANDIDATE", noAutomaticPromotion: true };
  return { ...model, candidates: [...model.candidates, candidate] };
}

export function validateKnowledgeCandidate(model: K1LearningReadModel, candidateId: string, humanConfirmed: boolean): K1LearningReadModel {
  if (!humanConfirmed) return model;
  return { ...model, candidates: model.candidates.map((candidate) => candidate.candidateId === candidateId ? { ...candidate, epistemicStatus: "VALIDATED_KNOWLEDGE", validationState: "HUMAN_VALIDATED", reuseState: "VALIDATED_FOR_CONTEXT" } : candidate) };
}

export function addContradiction(model: K1LearningReadModel, contradiction: Omit<K1Contradiction, "preserved" | "winnerCreated">): K1LearningReadModel {
  return { ...model, contradictions: [...model.contradictions, { ...contradiction, preserved: true, winnerCreated: false }] };
}

export function determineReuseEligibility(experience: K1ExperienceRecord, context: K1Context): K1ReuseState {
  if (!experience.projectId || !context.projectId) return "UNKNOWN_APPLICABILITY";
  if (experience.projectId !== context.projectId) return "UNKNOWN_APPLICABILITY";
  return experience.spatialScope === context.spatialScope && experience.typology === context.typology && experience.designStage === context.designStage ? "PROJECT_ONLY" : "UNKNOWN_APPLICABILITY";
}

export function buildHouseA21LearningFixture(): K1LearningReadModel & { houseProof: A21HouseProof } {
  const houseProof = buildHouseA21Proof();
  const context: K1Context = { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "residential", designStage: "schematic design", programContext: "A21 architectural program", constraintContext: "human adjacency and zoning intent" };
  const feedback = recordHumanFeedback(createK1ReadModel("HOUSE-A21"), { feedbackId: "K1-FB-01", statement: "Increase the separation between KITCHEN and ACCESS while preserving the preferred relationship between KITCHEN and LIVING_DINING.", action: "CORRECT", projectId: "HOUSE-A21", context, sourceRefs: ["HOUSE-A21 human architect feedback"] });
  const experience = recordProjectExperience(feedback, { experienceId: "K1-EXP-01", projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "residential", designStage: "schematic design", context, problem: "Kitchen and access were too close in the proposed relationship set.", intent: "Preserve kitchen–living/dining adjacency while increasing kitchen–access separation.", arkiProposal: "KITCHEN placed near ACCESS.", humanAction: "CORRECTED", humanFeedback: feedback.projectMemory.entries.length ? undefined : undefined, changed: ["KITCHEN↔ACCESS separation"], unknowns: ["construction-level containment", "regulatory applicability"], conflicts: [], sourceRefs: ["K1-FB-01"] });
  return { ...experience, houseProof, experiences: experience.experiences, candidates: experience.candidates, contradictions: experience.contradictions, projectMemory: experience.projectMemory, sourceAuthority: experience.sourceAuthority, noAutomaticPromotion: true, noAutomaticDecision: true, noAutomaticWinner: true };
}

export function buildK1NegativeControls() {
  const fixture = buildHouseA21LearningFixture();
  const generalized = fixture.experiences.some((experience) => (experience.reuseState as K1ReuseState) === "VALIDATED_FOR_CONTEXT");
  const sourceClaim = proposeKnowledgeCandidate(createK1ReadModel("HOUSE-A21"), { candidateId: "K1-SOURCE-01", claim: "Courtyard organization may be useful under stated conditions.", source: "BOOK", provenance: provenance("BOOK", ["BOOK:X", "K1 hypothetical source"], "SYSTEM"), context: { spatialScope: "edificacion", typology: "residential" }, assumptions: ["conditions must be supplied"], supportingEvidence: ["source statement"], contradictingEvidence: [] });
  const contradiction = addContradiction(createK1ReadModel("HOUSE-A21"), { contradictionId: "K1-CONFLICT-01", candidates: ["COMPACT_MASS", "COURTYARD_MASS"], contexts: [{ spatialScope: "edificacion" }, { spatialScope: "edificacion" }], supportingEvidence: [["compact envelope rationale"], ["courtyard daylight rationale"]], unresolvedTradeoff: "Envelope compactness versus access to exterior void" });
  const unknownReuse = determineReuseEligibility(fixture.experiences[0], { projectId: "OTHER-PROJECT", spatialScope: "edificacion", typology: "residential", designStage: "schematic design" });
  const aiOnly = proposeKnowledgeCandidate(createK1ReadModel("HOUSE-A21"), { candidateId: "K1-AI-01", claim: "AI proposal should become a general rule.", source: "ARKI_HYPOTHESIS", provenance: provenance("ARKI_HYPOTHESIS", ["ARKI proposal"], "ARKI"), context: { projectId: "HOUSE-A21" }, assumptions: [], supportingEvidence: [], contradictingEvidence: [] });
  return { generalized, sourceClaim, contradiction, unknownReuse, aiOnly, humanSelectionCreatesKnowledge: false };
}

export function validateK1ReadModel(model: K1LearningReadModel): boolean {
  return model.noAutomaticPromotion && model.noAutomaticDecision && model.noAutomaticWinner
    && model.experiences.every((experience) => experience.epistemicClass === "EXPERIENCE" && experience.reuseState === "PROJECT_ONLY" && experience.provenance.sourceRefs.length > 0)
    && model.candidates.every((candidate) => candidate.noAutomaticPromotion && candidate.validationState !== "HUMAN_VALIDATED" || candidate.noAutomaticPromotion)
    && model.contradictions.every((item) => item.preserved && !item.winnerCreated);
}
