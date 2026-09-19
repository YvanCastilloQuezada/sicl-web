import {
  ARKI_L00_L08_PRACTICES,
  ARKI_CANONICAL_KNOWLEDGE_UNITS,
  buildL08ControlledFixture,
  type CanonicalKnowledgeUnit,
  validateCanonicalPracticeRegistry,
  validateL08Fixture,
} from "./arkiCanonicalKnowledgeOperationalization";

export type LearningPhase =
  | "PRINCIPLE"
  | "EXPLANATION"
  | "PRACTICE"
  | "EVALUATION"
  | "CORRECTION"
  | "TRANSFER"
  | "HUMAN_REVIEW";

export type LearningOutcome = "NOT_STARTED" | "IN_PROGRESS" | "PASS_WITH_OBSERVATIONS" | "PASS" | "NOT_PROVEN" | "FAIL";
export type HumanReviewAction = "CONFIRM" | "CORRECT" | "REJECT" | "REQUEST_MORE_EVIDENCE";
export type LearningMaturity = "IMPORTED_CURRICULAR_KNOWLEDGE" | "PRACTICE_PENDING" | "HUMAN_REVIEWED" | "TRANSFERRED" | "MATURE";

export type LearningContext = {
  projectId: string;
  spatialScope: string;
  typology: string;
  designStage: string;
  description: string;
};

export type LearningPractice = {
  practiceId: string;
  canonicalPracticeId: string;
  type: "APPLICATION" | "NON_APPLICATION" | "INTEGRATED" | "TRANSFER";
  prompt: string;
  expectedTrace: string[];
  context: LearningContext;
  sourceRefs: string[];
  fixtureRefs: string[];
  humanReviewRequired: true;
};

export type LearningAttempt = {
  attemptId: string;
  phase: LearningPhase;
  statement: string;
  evidenceRefs: string[];
  unknowns: string[];
  contradictions: string[];
  epistemicState: "HYPOTHESIS" | "UNKNOWN" | "HUMAN_CONFIRMED";
};

export type LearningAssessment = {
  assessmentId: string;
  outcome: LearningOutcome;
  criteria: string[];
  observed: string[];
  missingEvidence: string[];
  correctionRequired: boolean;
  humanReviewRequired: true;
  automaticPromotion: false;
};

export type LearningCorrection = {
  correctionId: string;
  action: HumanReviewAction;
  statement: string;
  changed: string[];
  preservedUnknowns: string[];
  reviewer: "ARCHITECT";
  humanReviewState: "CONFIRMED" | "REJECTED" | "PENDING";
};

export type LearningTransfer = {
  transferId: string;
  fromContext: LearningContext;
  toContext: LearningContext;
  preservedPrinciples: string[];
  changedConditions: string[];
  nonApplicationCases: string[];
  outcome: "NOT_PROVEN" | "PASS_WITH_OBSERVATIONS" | "PASS";
  reason: string;
  humanReviewRequired: true;
};

export type ArkiLearningCycle = {
  cycleId: string;
  knowledgeUnitIds: string[];
  knowledgeUnits: CanonicalKnowledgeUnit[];
  principle: { phase: "PRINCIPLE"; sourceRefs: string[]; epistemicState: "IMPORTED_CURRICULAR_KNOWLEDGE" };
  explanation: LearningAttempt | null;
  practices: LearningPractice[];
  topologyEvidence: { fixtureId: string; hypothesisIds: string[]; validated: boolean } | null;
  attempts: LearningAttempt[];
  assessment: LearningAssessment | null;
  correction: LearningCorrection | null;
  transfer: LearningTransfer | null;
  currentPhase: LearningPhase;
  maturity: LearningMaturity;
  humanAuthority: "PRESERVED";
  noAutomaticPromotion: true;
  noAutomaticDecision: true;
  noAutomaticWinner: true;
};

const byIds = (ids: string[]) => ids.map((id) => ARKI_CANONICAL_KNOWLEDGE_UNITS.find((unit) => unit.id === id)).filter((unit): unit is CanonicalKnowledgeUnit => Boolean(unit));

const unique = (values: string[]) => Array.from(new Set(values));

export function createLearningCycle(input: { cycleId: string; knowledgeUnitIds: string[]; practices: LearningPractice[]; topologyEvidence?: ArkiLearningCycle["topologyEvidence"] }): ArkiLearningCycle {
  const knowledgeUnits = byIds(input.knowledgeUnitIds);
  if (knowledgeUnits.length !== input.knowledgeUnitIds.length) {
    throw new Error("Learning cycle references an unknown canonical knowledge unit");
  }
  if (input.practices.length === 0) throw new Error("Learning cycle requires at least one controlled practice");
  return {
    cycleId: input.cycleId,
    knowledgeUnitIds: input.knowledgeUnitIds,
    knowledgeUnits,
    principle: { phase: "PRINCIPLE", sourceRefs: unique(knowledgeUnits.flatMap((unit) => unit.sourceRefs)), epistemicState: "IMPORTED_CURRICULAR_KNOWLEDGE" },
    explanation: null,
    practices: input.practices,
    topologyEvidence: input.topologyEvidence ?? null,
    attempts: [],
    assessment: null,
    correction: null,
    transfer: null,
    currentPhase: "PRINCIPLE",
    maturity: "IMPORTED_CURRICULAR_KNOWLEDGE",
    humanAuthority: "PRESERVED",
    noAutomaticPromotion: true,
    noAutomaticDecision: true,
    noAutomaticWinner: true,
  };
}

export function recordExplanation(cycle: ArkiLearningCycle, attempt: Omit<LearningAttempt, "phase">): ArkiLearningCycle {
  return { ...cycle, explanation: { ...attempt, phase: "EXPLANATION" }, attempts: [...cycle.attempts, { ...attempt, phase: "EXPLANATION" }], currentPhase: "PRACTICE" };
}

export function recordPractice(cycle: ArkiLearningCycle, attempt: Omit<LearningAttempt, "phase">): ArkiLearningCycle {
  if (!cycle.explanation) throw new Error("Explanation is required before practice");
  return { ...cycle, attempts: [...cycle.attempts, { ...attempt, phase: "PRACTICE" }], currentPhase: "EVALUATION" };
}

export function evaluateLearningCycle(cycle: ArkiLearningCycle): ArkiLearningCycle {
  const application = cycle.practices.some((practice) => practice.type === "APPLICATION");
  const nonApplication = cycle.practices.some((practice) => practice.type === "NON_APPLICATION");
  const traceComplete = cycle.attempts.some((attempt) => attempt.phase === "PRACTICE" && attempt.evidenceRefs.length > 0);
  const unknownPreserved = cycle.attempts.every((attempt) => attempt.unknowns.length > 0);
  const criteria = ["application case present", "non-application case present", "practice has evidence trace", "unknowns remain explicit"];
  const observed = [application && "application case present", nonApplication && "non-application case present", traceComplete && "practice has evidence trace", unknownPreserved && "unknowns remain explicit"].filter((item): item is string => Boolean(item));
  const missingEvidence = criteria.filter((criterion) => !observed.includes(criterion));
  const outcome: LearningOutcome = missingEvidence.length === 0 ? "PASS_WITH_OBSERVATIONS" : "NOT_PROVEN";
  return {
    ...cycle,
    assessment: { assessmentId: `${cycle.cycleId}:assessment`, outcome, criteria, observed, missingEvidence, correctionRequired: true, humanReviewRequired: true, automaticPromotion: false },
    currentPhase: "CORRECTION",
  };
}

export function recordCorrection(cycle: ArkiLearningCycle, correction: LearningCorrection): ArkiLearningCycle {
  if (!cycle.assessment) throw new Error("Evaluation is required before correction");
  if (correction.reviewer !== "ARCHITECT") throw new Error("Only the human architect can correct a learning cycle");
  return { ...cycle, correction, currentPhase: "TRANSFER", maturity: correction.action === "REJECT" ? "PRACTICE_PENDING" : "HUMAN_REVIEWED" };
}

export function recordTransfer(cycle: ArkiLearningCycle, transfer: LearningTransfer): ArkiLearningCycle {
  if (!cycle.correction || cycle.correction.humanReviewState !== "CONFIRMED") throw new Error("Human-confirmed correction is required before transfer");
  const outcome = transfer.changedConditions.length > 0 && transfer.nonApplicationCases.length > 0 ? transfer.outcome : "NOT_PROVEN";
  const normalizedTransfer = { ...transfer, outcome };
  return { ...cycle, transfer: normalizedTransfer, currentPhase: "HUMAN_REVIEW", maturity: outcome === "PASS" ? "TRANSFERRED" : "HUMAN_REVIEWED" };
}

export function reviewLearningCycle(cycle: ArkiLearningCycle, action: "CONFIRM" | "REJECT"): ArkiLearningCycle {
  if (!cycle.transfer) throw new Error("Transfer evidence is required before final human review");
  if (action === "REJECT") return { ...cycle, maturity: "PRACTICE_PENDING", currentPhase: "CORRECTION" };
  const mature = cycle.transfer.outcome === "PASS" && cycle.assessment?.outcome === "PASS_WITH_OBSERVATIONS";
  return { ...cycle, maturity: mature ? "MATURE" : "HUMAN_REVIEWED", currentPhase: "HUMAN_REVIEW" };
}

export function buildL00L08HouseLearningPilot(): ArkiLearningCycle {
  const fixture = buildL08ControlledFixture();
  if (!validateCanonicalPracticeRegistry() || !validateL08Fixture(fixture)) throw new Error("Canonical L00-L08 practice registry or topology fixture is invalid");
  const residential: LearningContext = { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "residential", designStage: "schematic design", description: "House program with social, private, service and courtyard hypotheses" };
  const smallNonResidential: LearningContext = { projectId: "PAVILION-TRANSFER-01", spatialScope: "edificacion", typology: "small non-residential", designStage: "concept", description: "Small pavilion using the same principles under different users and flows" };
  const practices: LearningPractice[] = [
    { practiceId: "L00-L02-L05-L08:APPLICATION", canonicalPracticeId: "P-L02-01", type: "APPLICATION", prompt: "Build activities, multidimensional relationships and three topology hypotheses for HOUSE-A21.", expectedTrace: ["activity", "relationship", "topology"], context: residential, sourceRefs: ["L08-controlled-fixture", "HOUSE-A21"], fixtureRefs: fixture.hypotheses.map((hypothesis) => hypothesis.id), humanReviewRequired: true },
    { practiceId: "L00-L02-L05-L08:NON_APPLICATION", canonicalPracticeId: "P-L05-01", type: "NON_APPLICATION", prompt: "Explain why a room label, a line or adjacency alone cannot prove activity, circulation or access.", expectedTrace: ["non-application", "unknown"], context: residential, sourceRefs: ["ARKI negative controls"], fixtureRefs: ["REL-ARRIVAL-SOCIAL", "REL-SOCIAL-OUTDOOR"], humanReviewRequired: true },
    { practiceId: "L00-L02-L05-L08:TRANSFER", canonicalPracticeId: "P-L08-03", type: "TRANSFER", prompt: "Rebuild the reasoning for a small pavilion without copying the house solution.", expectedTrace: ["changed users", "changed flows", "changed topology"], context: smallNonResidential, sourceRefs: ["ARKI transfer protocol"], fixtureRefs: fixture.hypotheses.map((hypothesis) => hypothesis.id), humanReviewRequired: true },
  ];
  return createLearningCycle({ cycleId: "ARKI-PILOT-L00-L02-L05-L08-HOUSE", knowledgeUnitIds: ["KU-L00-001", "KU-L02-001", "KU-L05-001", "KU-L08-001"], practices, topologyEvidence: { fixtureId: "L08-controlled-fixture", hypothesisIds: fixture.hypotheses.map((hypothesis) => hypothesis.id), validated: true } });
}

export function validateLearningCycle(cycle: ArkiLearningCycle): boolean {
  return cycle.knowledgeUnits.length === cycle.knowledgeUnitIds.length
    && cycle.knowledgeUnits.every((unit) => unit.importedKnowledge && unit.practiceRequired && unit.transferRequired && unit.humanReviewRequired)
    && cycle.practices.every((practice) => ARKI_L00_L08_PRACTICES.some((registered) => registered.id === practice.canonicalPracticeId) && practice.fixtureRefs.length > 0)
    && (!cycle.topologyEvidence || (cycle.topologyEvidence.validated && cycle.topologyEvidence.hypothesisIds.length >= 3))
    && cycle.practices.every((practice) => practice.humanReviewRequired)
    && cycle.humanAuthority === "PRESERVED"
    && cycle.noAutomaticPromotion && cycle.noAutomaticDecision && cycle.noAutomaticWinner;
}

export function runLearningCycleNegativeControls() {
  const pilot = buildL00L08HouseLearningPilot();
  const evaluated = evaluateLearningCycle(recordPractice(recordExplanation(pilot, { attemptId: "explanation", statement: "A room label is not an activity model; relationships must remain multidimensional.", evidenceRefs: ["L00-L02-L05-L08"], unknowns: ["household schedule"], contradictions: ["courtyard preference versus privacy"], epistemicState: "HYPOTHESIS" }), { attemptId: "practice", statement: "HOUSE-A21 retains three topology hypotheses before coordinates.", evidenceRefs: ["L08-TOPOLOGY-A", "L08-TOPOLOGY-B", "L08-TOPOLOGY-C"], unknowns: ["site orientation", "pavilion user profile"], contradictions: ["privacy versus openness"], epistemicState: "HYPOTHESIS" }));
  const noTransferBeforeHumanCorrection = (() => { try { recordTransfer(evaluated, { transferId: "invalid", fromContext: pilot.practices[0].context, toContext: pilot.practices[2].context, preservedPrinciples: ["topology before coordinates"], changedConditions: ["users", "flows"], nonApplicationCases: ["room label does not determine activity"], outcome: "PASS", reason: "fixture" , humanReviewRequired: true }); return false; } catch { return true; } })();
  return { importedNotMature: pilot.maturity === "IMPORTED_CURRICULAR_KNOWLEDGE", noTransferBeforeHumanCorrection, humanAuthorityPreserved: evaluated.humanAuthority === "PRESERVED", automaticPromotionBlocked: evaluated.noAutomaticPromotion, unknownPreserved: evaluated.attempts.every((attempt) => attempt.unknowns.length > 0) };
}
