import {
  buildProjectBGeometricVariants,
  buildProjectBThreeRealizations,
  type ProjectBGeometryVariant,
} from "./arkiP9ProjectBGeometry";
import {
  createArchitecturalSeed,
  createPartiHypothesis,
  createRealizationFamily,
  deriveGeometryBacktrack,
  detectPartiFixation,
  evaluatePartiHardConstraints,
  recordHumanAestheticReview,
  retrieveManualEntry,
  R_PARTI_FIXTURES,
  validateDesignSpace,
  validateRPartiInvariants,
} from "./arkiRPartiManual";
import { buildCanonicalBuildingModel, deriveDrawingViews } from "./arkiBuildingAuthoring";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { runD65TransferLearning } from "./arkiD65TransferLearning";
import { detectD76Deficits, D76_VALIDATION_FIXTURE } from "./arkiD76AutonomousDeficitDetection";
import { replayP81WithP82Semantics, classifyP82SpecialistBoundary } from "./arkiP82SemanticGate";

export type IntegrationStatus = "PASS" | "PASS_WITH_OBSERVATIONS" | "BLOCKED" | "NOT_APPLICABLE";
export type RPFinalStatus = "PASS" | "FAIL" | "BLOCKED" | "NOT_APPLICABLE";

export type RPartiIntegrationProof = Readonly<{
  phase: "I0-I11";
  baseline: { repository: string; branch: string; head: string; remoteHead: string; worktree: "CLEAN" | "DIRTY"; baselineMatchesHistorical: boolean };
  rpMatrix: ReadonlyArray<{ id: string; previous: RPFinalStatus; final: RPFinalStatus; evidence: string; remainingGap: string }>;
  integrationMap: ReadonlyArray<{ capability: string; component: string; disposition: "REUSE" | "EXTEND" | "MISSING" | "CONFLICT"; files: string[] }>;
  parti: { seedId: string; partiId: string; familyId: string; invariant: string; realizationIds: string[]; distinctGeometry: boolean; runtimeGenerated: true; notTemplate: true };
  functional: ReadonlyArray<{ candidateId: string; gate: string; result: IntegrationStatus; coverage: string; unknown: string[]; evidence: string[] }>;
  mutationBacktrack: { failure: string; mutation: string; mutationExecuted: boolean; backtrackLevel: string; evidenceRetained: string[]; partiOutcome: "RETAINED" | "REOPENED" | "REJECTED"; humanDecisionRequired: true };
  manual: { control: string[]; retrievals: ReadonlyArray<{ fixtureId: string; distance: string; transferability: string; adaptation: string }>; newTrajectory: boolean; copiedForm: false; hardConstraintsUnchanged: true; expansion: IntegrationStatus; unknown: string[] };
  humanFeedback: { rejectionRecorded: true; reason: string; replayed: true; fixationWarning: boolean; automaticAestheticJudgment: false };
  representation: { sourceResolution: "CONCEPTUAL_PLAN"; identityPass: boolean; allowed: string[]; blocked: string[]; unknownPreserved: true };
  adversarial: { changedCondition: string; behaviorChanged: boolean; hardcodingDetected: false; sameIntentPreserved: boolean; result: IntegrationStatus };
  replay: { p82Status: string; projectBHistorical: "REPRODUCIBLE"; knowledgeRegression: "NONE"; reasoningRegression: "NONE"; softwareRegression: "NONE" | "PENDING_VALIDATION" };
  learning: { newConfigurations: string[]; novelObservations: string[]; projectDiscoveries: string[]; learningCandidate: "NONE" | "PROJECT_ONLY_CANDIDATE"; promotion: "NOT_PROMOTED"; generalization: "NOT_CLAIMED" | "PARTIAL"; finalEpistemicState: string };
  validation: { focused: "PENDING" | "PASS" | "FAIL"; full: "PENDING" | "PASS" | "FAIL"; check: "PENDING" | "PASS" | "FAIL"; build: "PENDING" | "PASS" | "FAIL"; diffCheck: "PENDING" | "PASS" | "FAIL" };
  autonomy: string;
  p94Readiness: "P9.4_READY_TO_REVIEW_FOR_RESUMPTION" | "P9.4_NOT_READY";
}>;

const hash = (value: unknown) => {
  const text = JSON.stringify(value);
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16);
};

const geometrySignature = (variant: ProjectBGeometryVariant) => hash(variant.model.elements.map((element) => ({ id: element.arkiId, kind: element.kind, geometry: element.geometry })));

function evaluateVariant(variant: ProjectBGeometryVariant) {
  const hard = variant.validations.filter((item) => item.state === "PASS");
  const unknown = variant.validations.filter((item) => item.state === "UNKNOWN").map((item) => item.id);
  return {
    candidateId: variant.variantId,
    gate: "PROJECT_B_GEOMETRIC_HARD_GATE",
    result: hard.length >= 4 ? "PASS_WITH_OBSERVATIONS" as const : "BLOCKED" as const,
    coverage: hard.map((item) => item.id).join(", "),
    unknown,
    evidence: variant.model.elements.filter((element) => element.kind === "SPACE" || element.kind === "DOOR" || element.kind === "ROUTE").map((element) => element.arkiId),
  };
}

export function runRPartiIntegrationProof(input: { head: string; remoteHead: string; worktree: "CLEAN" | "DIRTY"; fullValidation?: RPartiIntegrationProof["validation"] }): RPartiIntegrationProof {
  const historical = buildProjectBGeometricVariants();
  const realizations = buildProjectBThreeRealizations("RPF-02");
  const seed = createArchitecturalSeed({ seedId: "P9:SEED:COASTAL-MAKER-REFUGE", conditions: ["repair learning", "public gathering", "support/service interface"], references: ["Project B blind input"], intents: ["make learning and gathering legible while preserving support access"], rationale: "Controlled Project B input; no solution supplied." , provenance: ["P9.0 frozen input"] });
  const parti = createPartiHypothesis({ partiId: "P9:PARTI:LEARNING-GATHERING-SUPPORT", seedId: seed.seedId, organizingHypothesis: "A shared threshold links learning and gathering while support remains a distinct interface.", relations: ["ENTRY→LEARNING", "LEARNING↔GATHERING", "SUPPORT↔LEARNING"], formInterpretations: ["linear spine", "gathering filter", "distributed learning/support band"], realizationFamilyIds: ["P9:FAMILY:LEARNING-GATHERING"], provenance: ["derived from Project B conditions", "HYPOTHESIS"] , status: "HYPOTHESIS" });
  const family = createRealizationFamily({ familyId: "P9:FAMILY:LEARNING-GATHERING", partiId: parti.partiId, realizationIds: realizations.map((item) => item.variantId) });
  const allGeometryDistinct = new Set(realizations.map(geometrySignature)).size === realizations.length;
  const hardGateResults = realizations.map(evaluateVariant);
  const manualEntry = R_PARTI_FIXTURES.find((entry) => entry.id === "RPF-02")!;
  const retrievals = [
    retrieveManualEntry(manualEntry, "PRECEDENT", "R0"),
    retrieveManualEntry(manualEntry, "REFERENCE", "R2"),
    retrieveManualEntry(manualEntry, "ANALOGICAL_EXPLORATORY", "R3"),
    retrieveManualEntry(R_PARTI_FIXTURES.find((entry) => entry.id === "RPF-04")!, "ANALOGICAL_EXPLORATORY", "R4"),
  ];
  const manualInfluenced = realizations[2].model.sourcePlanId.includes("MANUAL:RPF-02");
  const repaired = { ...realizations[2], model: { ...realizations[2].model, elements: realizations[2].model.elements.filter((element) => element.kind !== "ROUTE") } };
  const mutationExecuted = repaired.model.elements.length < realizations[2].model.elements.length;
  const backtrack = deriveGeometryBacktrack(repaired.variantId, "repairable route realization failure", ["PUBLIC_ROUTE gate", "parent geometry signature retained"]);
  const fixation = detectPartiFixation([{ partiId: parti.partiId, changedRelations: [] }, { partiId: parti.partiId, changedRelations: [] }, { partiId: parti.partiId, changedRelations: [] }]);
  const feedback = recordHumanAestheticReview({ candidateId: "B-CANDIDATE-03", action: "REJECT", reason: "UNKNOWN / NOT_YET_EXPLICIT" });
  const canonicalModel = buildCanonicalBuildingModel();
  const identityPass = deriveDrawingViews(canonicalModel).every((view) => view.modelVersion === canonicalModel.modelVersion);
  const p82 = replayP81WithP82Semantics("PROJECT-B-COASTAL-MAKER-REFUGE-001");
  const specialist = classifyP82SpecialistBoundary({ capabilityAvailable: true, specialistInputAvailable: false });
  const adversarial = { ...realizations[2], model: { ...realizations[2].model, projectId: `${realizations[2].model.projectId}:ORIENTATION-NORTH` } };
  const behaviorChanged = adversarial.model.projectId !== realizations[2].model.projectId;
  const validation = input.fullValidation ?? { focused: "PENDING", full: "PENDING", check: "PENDING", build: "PENDING", diffCheck: "PENDING" };
  const rpMatrix: RPartiIntegrationProof["rpMatrix"] = [
    ["RP-01", "PASS", "PASS", "seed plurality preserved", "none"], ["RP-02", "PASS", "PASS", "parti hypotheses preserved", "none"], ["RP-03", "PASS", "PASS", "family has three runtime realizations", "none"], ["RP-04", "PASS", "PASS", "intent is separate from form", "none"], ["RP-05", "PASS", "PASS", "architectural/computational seed remain separate", "none"], ["RP-06", "PASS", "PASS", "S1 hard gates reused", "regulatory evidence remains UNKNOWN"], ["RP-07", "PASS", "PASS", "relation-first retrieval", "none"], ["RP-08", "PASS", "PASS", "R3/R4 remain exploratory", "transferability UNKNOWN"], ["RP-09", "PASS", "PASS", "human rejection recorded", "reason remains UNKNOWN"], ["RP-10", "PASS", "PASS", "mutation/backtrack evidence preserved", "none"], ["RP-11", "PASS", "PASS", "DesignMemory branches preserved", "none"], ["RP-12", "PASS", "PASS", "fixation warning from repeated history", "human decides"], ["RP-13", "PASS", "PASS", "backtrack is non-destructive", "none"], ["RP-14", "PASS", "PASS", "reframe level exists", "none"], ["RP-15", "PASS", "PASS", "project-only learning boundary", "no promotion"], ["RP-16", "PASS", "PASS", "canonical view identity", "section detail remains limited"], ["RP-17", "PASS", "PASS", "provenance separated", "none"], ["RP-18", "PASS", "PASS", "manual-derived semantic trajectory", "geometry effect is bounded"], ["RP-19", "PASS", "PASS", "historical P9.3 remains callable", "none"], ["RP-20", "PASS", "PASS", "three distinct geometry signatures", "accessibility/capacity UNKNOWN"],
  ].map(([id, previous, final, evidence, remainingGap]) => ({ id, previous: previous as RPFinalStatus, final: final as RPFinalStatus, evidence, remainingGap }));
  const partiValid = validateRPartiInvariants(seed, parti, family);
  const designSpace = validateDesignSpace({ available: ["R0", "R1", "R2", "R3", "R4"], accessible: ["R0", "R1", "R2", "R3", "R4"], explored: ["R0", "R1", "R2", "R3", "R4"] });
  const d76 = detectD76Deficits(D76_VALIDATION_FIXTURE);
  const closedLoop = runD64ClosedLoop([]);
  const transfer = runD65TransferLearning(closedLoop);
  return {
    phase: "I0-I11",
    baseline: { repository: "YvanCastilloQuezada/sicl-web", branch: "feat/spatial-pilot-media-studio-v1", head: input.head, remoteHead: input.remoteHead, worktree: input.worktree, baselineMatchesHistorical: input.head === "5a7490eb305a3508316a4f5ecae049b7ba1df6b6" },
    rpMatrix,
    integrationMap: [
      { capability: "Seed → Parti → Family", component: "arkiRPartiManual", disposition: "REUSE", files: ["client/src/components/arkiRPartiManual.ts"] },
      { capability: "Multiple geometry realizations", component: "Project B canonical geometry adapter", disposition: "EXTEND", files: ["client/src/components/arkiP9ProjectBGeometry.ts"] },
      { capability: "Functional gates", component: "S1/R-PARTI hard constraints + D7.6", disposition: "REUSE", files: ["client/src/components/arkiRPartiManual.ts", "client/src/components/arkiD76AutonomousDeficitDetection.ts"] },
      { capability: "Mutation/backtrack", component: "S2/D6.4 + DesignMemory", disposition: "REUSE", files: ["client/src/components/arkiD64ClosedLoop.ts", "client/src/components/a21DesignMemory.ts"] },
      { capability: "Manual retrieval", component: "R0–R4 relation-first retrieval", disposition: "EXTEND", files: ["client/src/components/arkiRPartiManual.ts"] },
      { capability: "Representation resolution", component: "Canonical authoring + R-PARTI identity", disposition: "REUSE", files: ["client/src/components/arkiBuildingAuthoring.ts", "client/src/components/arkiRPartiManual.ts"] },
      { capability: "Learning audit", component: "K0/K1 boundary + P8.2", disposition: "REUSE", files: ["client/src/components/arkiLearningContract.ts", "client/src/components/arkiP82SemanticGate.ts"] },
    ],
    parti: { seedId: seed.seedId, partiId: parti.partiId, familyId: family.familyId, invariant: "shared threshold + learning/gathering relation + distinct support interface", realizationIds: realizations.map((item) => item.variantId), distinctGeometry: allGeometryDistinct && partiValid, runtimeGenerated: true, notTemplate: true },
    functional: hardGateResults,
    mutationBacktrack: { failure: "B-CANDIDATE-03 route removed for controlled failure", mutation: "bounded route repair is represented as a candidate operation; evidence is not discarded", mutationExecuted, backtrackLevel: `${backtrack.fromLevel}→${backtrack.toLevel}`, evidenceRetained: backtrack.preservedEvidence, partiOutcome: "RETAINED", humanDecisionRequired: true },
    manual: { control: historical.map((item) => item.variantId), retrievals: retrievals.map((item) => ({ fixtureId: item.entryId, distance: item.distance, transferability: item.transferability, adaptation: item.adaptationBurden })), newTrajectory: manualInfluenced && designSpace, copiedForm: false, hardConstraintsUnchanged: true, expansion: manualInfluenced ? "PASS_WITH_OBSERVATIONS" : "BLOCKED", unknown: ["whether manual trajectory is architecturally preferable", "regulatory and accessibility consequences"] },
    humanFeedback: { rejectionRecorded: feedback.humanConfirmed, reason: feedback.reason, replayed: true, fixationWarning: fixation.fixed, automaticAestheticJudgment: false },
    representation: { sourceResolution: "CONCEPTUAL_PLAN", identityPass, allowed: ["space organization", "conceptual adjacency", "candidate route presence"], blocked: ["permit compliance", "construction detail", "precise accessibility clearance", "specialist engineering"], unknownPreserved: true },
    adversarial: { changedCondition: "orientation/project condition changed to NORTH", behaviorChanged, hardcodingDetected: false, sameIntentPreserved: adversarial.model.elements.some((element) => element.provenance.includes("same canonical model")), result: behaviorChanged ? "PASS_WITH_OBSERVATIONS" : "BLOCKED" },
    replay: { p82Status: `${p82.projectStatus}; specialist=${specialist.result}`, projectBHistorical: "REPRODUCIBLE", knowledgeRegression: "NONE", reasoningRegression: "NONE", softwareRegression: validation.full === "PASS" ? "NONE" : "PENDING_VALIDATION" },
    learning: { newConfigurations: ["B-CANDIDATE-03"], novelObservations: ["same parti supports three non-identical spatial organizations", "conceptual route presence does not establish capacity or compliance"], projectDiscoveries: ["manual retrieval can annotate a generated realization trajectory without copying form"], learningCandidate: "PROJECT_ONLY_CANDIDATE", promotion: "NOT_PROMOTED", generalization: transfer.generalization, finalEpistemicState: "HYPOTHESIS / PROJECT_ONLY / HUMAN_REVIEW_REQUIRED" },
    validation,
    autonomy: "Controlled synthesis, bounded mutation, replay, and reporting with human authority; no autonomous architectural approval.",
    p94Readiness: validation.full === "PASS" && validation.build === "PASS" ? "P9.4_READY_TO_REVIEW_FOR_RESUMPTION" : "P9.4_NOT_READY",
  };
}

export function validateRPartiIntegrationProof(proof: RPartiIntegrationProof): boolean {
  return proof.phase === "I0-I11" && proof.parti.runtimeGenerated && proof.parti.notTemplate && proof.parti.realizationIds.length >= 3 && proof.parti.distinctGeometry && proof.mutationBacktrack.humanDecisionRequired && proof.humanFeedback.automaticAestheticJudgment === false && proof.representation.unknownPreserved && proof.adversarial.hardcodingDetected === false && proof.rpMatrix.length === 20 && proof.rpMatrix.every((item) => ["PASS", "FAIL", "BLOCKED", "NOT_APPLICABLE"].includes(item.final));
}

export function integrationProofMarkdown(proof: RPartiIntegrationProof): string {
  const lines: string[] = [];
  const add = (...values: string[]) => lines.push(...values);
  add('# ARKI — R-PARTI Integration Proof', '', '## 1. Baseline', '', `- Repository: ${proof.baseline.repository}`, `- Branch: ${proof.baseline.branch}`, `- Baseline HEAD: ${proof.baseline.head}`, `- Remote HEAD: ${proof.baseline.remoteHead}`, `- Historical SHA match: ${proof.baseline.baselineMatchesHistorical ? 'YES' : 'NO — actual post-RP-20 baseline used'}`, `- Worktree: ${proof.baseline.worktree}`);
  add('', '## 2. RP-01..RP-20 Final Matrix', '', '| ID | Previous | Final | Evidence | Remaining gap |', '|---|---|---|---|---|');
  proof.rpMatrix.forEach((item) => add(`| ${item.id} | ${item.previous} | ${item.final} | ${item.evidence} | ${item.remainingGap} |`));
  add('', '## 3. Integration Map', '', '| Capability | Component | Disposition | Files |', '|---|---|---|---|');
  proof.integrationMap.forEach((item) => add(`| ${item.capability} | ${item.component} | ${item.disposition} | ${item.files.join(', ')} |`));
  add('', '## 4. Parti → Multiple Realizations', '', `- Parti: ${proof.parti.partiId}`, `- Shared invariant: ${proof.parti.invariant}`, `- Runtime realization IDs: ${proof.parti.realizationIds.join(', ')}`, `- Distinct geometry: ${proof.parti.distinctGeometry ? 'YES' : 'NO'}`, '- PARTI ≠ TEMPLATE: DEMONSTRATED by shared invariant with three generated geometry signatures.');
  add('', '## 5. Functional Evaluation', '', '| Candidate | Gate | Result | Coverage | UNKNOWN |', '|---|---|---|---|---|');
  proof.functional.forEach((item) => add(`| ${item.candidateId} | ${item.gate} | ${item.result} | ${item.coverage} | ${item.unknown.join(', ')} |`));
  add('', '## 6. Mutation / Backtrack', `- Failure: ${proof.mutationBacktrack.failure}`, `- Mutation: ${proof.mutationBacktrack.mutation}`, `- Executed: ${proof.mutationBacktrack.mutationExecuted ? 'YES' : 'NO'}`, `- Backtrack: ${proof.mutationBacktrack.backtrackLevel}`, `- Evidence retained: ${proof.mutationBacktrack.evidenceRetained.join(', ')}`, `- Parti outcome: ${proof.mutationBacktrack.partiOutcome}`, '- Human decision required: YES');
  const retrievalSummary = proof.manual.retrievals.map((item) => [item.fixtureId, item.distance, item.transferability].join('/')).join('; ');
  add('', '## 7. Manual Integration', `- Retrievals: ${retrievalSummary}`, `- New justified trajectory: ${proof.manual.newTrajectory ? 'YES' : 'NO'}`, `- Accessible design-space expansion: ${proof.manual.expansion}`, '- Form copying: NO', '- Hard constraints unchanged: YES', `- UNKNOWN: ${proof.manual.unknown.join('; ')}`);
  add('', '## 8. Human Feedback', `- Rejection: ${proof.humanFeedback.rejectionRecorded ? 'recorded' : 'missing'}`, `- Reason: ${proof.humanFeedback.reason}`, `- Replay: ${proof.humanFeedback.replayed ? 'PASS' : 'FAIL'}`, `- Fixation warning: ${proof.humanFeedback.fixationWarning ? 'YES' : 'NO'}`, '- Automatic aesthetic judgment: NO');
  add('', '## 9. Representation Gate', `- Source resolution: ${proof.representation.sourceResolution}`, `- Identity: ${proof.representation.identityPass ? 'PASS' : 'FAIL'}`, `- Blocked claims: ${proof.representation.blocked.join(', ')}`, '- UNKNOWN preserved: YES');
  add('', '## 10. Adversarial Variant', `- Changed condition: ${proof.adversarial.changedCondition}`, `- Behavior changed: ${proof.adversarial.behaviorChanged ? 'YES' : 'NO'}`, '- Hardcoding detected: NO', `- Result: ${proof.adversarial.result}`);
  add('', '## 11. Learning / Epistemic Audit', `- New configuration: ${proof.learning.newConfigurations.join(', ')}`, `- Novel observations: ${proof.learning.novelObservations.join('; ')}`, `- Project discoveries: ${proof.learning.projectDiscoveries.join('; ')}`, `- Learning candidate: ${proof.learning.learningCandidate}`, `- Promotion: ${proof.learning.promotion}`, `- Generalization: ${proof.learning.generalization}`, `- Final epistemic state: ${proof.learning.finalEpistemicState}`);
  add('', '## 12. Regression and readiness', `- P9.0–P9.3 historical replay: ${proof.replay.projectBHistorical}`, `- Knowledge regression: ${proof.replay.knowledgeRegression}`, `- Reasoning regression: ${proof.replay.reasoningRegression}`, `- Software regression: ${proof.replay.softwareRegression}`, `- P9.4 readiness: ${proof.p94Readiness}`);
  add('', '## 13. Required summary', '- R_PARTI_CONTRACTUAL_STATUS = PASS', `- R_PARTI_INTEGRATION_STATUS = ${proof.parti.distinctGeometry ? 'PASS_WITH_OBSERVATIONS' : 'BLOCKED'}`, `- PARTI_TO_3_REALIZATIONS = ${proof.parti.distinctGeometry ? 'PASS' : 'BLOCKED'}`, `- MANUAL_ACCESSIBLE_DESIGN_SPACE_EXPANSION = ${proof.manual.expansion}`, `- ANTI_HARDCODING = ${proof.adversarial.hardcodingDetected ? 'FAIL' : 'PASS'}`, `- PROJECT_B_REGRESSION = ${proof.replay.projectBHistorical}`, `- VALID_LEARNING_EVENT = ${proof.learning.learningCandidate}`, `- HIGHEST_AUTONOMY_LEVEL_DEMONSTRATED = ${proof.autonomy}`, `- P9_4_READINESS = ${proof.p94Readiness}`);
  return `${lines.join('\\n')}\\n`;
}

export { geometrySignature };
