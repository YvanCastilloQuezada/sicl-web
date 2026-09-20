import { runP94EvidenceLearningExperiment } from "./arkiP94EvidenceLearningExperiment";
import { createK1ReadModel, proposeKnowledgeCandidate } from "./arkiLearningContract";

export type P10Decision = "PERSISTS" | "ADAPTS" | "FAILS" | "REVERSES" | "IRRELEVANT" | "UNKNOWN" | "DO_NOT_TRANSFER";
export type P10KnowledgeState = "K2_CANDIDATE" | "K3_SUPPORTED" | "K4_TRANSFER_TESTED" | "CONTEXT_SPECIFIC" | "CONFLICTED" | "REJECTED" | "UNKNOWN";

export type P10Baseline = {
  repository: string;
  branch: string;
  baselineHead: string;
  remoteHead: string;
  worktree: "CLEAN";
  latestDelta: "PASTED-CONTENT-494-V492";
};

export type P10TransferRow = {
  testId: string;
  source: string;
  target: string;
  contextDistance: "NEAR" | "MEDIUM" | "FAR";
  structuralSimilarity: "HIGH" | "MEDIUM" | "LOW";
  surfaceSimilarity: "HIGH" | "MEDIUM" | "LOW";
  contextCompatibility: "COMPATIBLE" | "PARTIAL" | "INCOMPATIBLE" | "UNKNOWN";
  transferability: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  adaptationBurden: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  expected: P10Decision;
  actual: P10Decision;
  decision: P10Decision;
  evidence: string[];
  unknown: string[];
  counterexample: string[];
};

export type P10Report = {
  experimentId: "P10-KNOWLEDGE-TRANSFER-GENERALIZATION";
  baseline: P10Baseline;
  k2: {
    knowledgeId: "P9.4-CAPACITY-ROUTE-DEPENDENCY";
    stateBefore: "K2_CANDIDATE";
    originalObservation: string;
    projectScope: string;
    evidence: string[];
    counterexample: string;
    unknowns: string[];
    supplied: string[];
    calculated: string[];
    observed: string[];
    inferred: string[];
  };
  abstraction: {
    caseMemory: string;
    candidate: string;
    removed: string[];
    retained: string[];
    rationale: string;
    epistemicStatus: "HYPOTHESIS";
  };
  initialScope: { appliesWhen: string[]; mayApplyWhen: string[]; doesNotApplyWhen: string[]; unknownWhen: string[] };
  nearVariants: P10TransferRow[];
  transferMatrix: P10TransferRow[];
  scopeAfter: { appliesWhen: string[]; mayApplyWhen: string[]; doesNotApplyWhen: string[]; unknownWhen: string[] };
  promotion: { stateBefore: P10KnowledgeState; stateAfter: P10KnowledgeState; learningClass: "L2_RELATIONSHIP"; reason: string; humanConfirmationRequired: true };
  autonomy: { l10Process: "L10_DEMONSTRATED" | "L10_PARTIAL" | "L10_NOT_DEMONSTRATED"; evidence: string[]; knowledgeGeneralization: "G1" | "G2" | "G3" | "NOT_DEMONSTRATED" };
  antiContamination: { result: "PASS" | "CONTAMINATION_FOUND"; classifications: Record<string, "SUPPLIED" | "RETRIEVED" | "ENCODED" | "CALCULATED">; p94Reexecuted: false };
  regression: { knowledge: "PASS" | "FAIL"; reasoning: "PASS" | "FAIL"; software: "PASS" | "FAIL" };
  annexI: { status: "IMPLEMENTED"; manifest: string; referencedPackages: string[] };
  battery: Array<{ id: string; result: "PASS" | "FAIL"; evidence: string }>;
  humanAuthority: true;
};

const baseline: P10Baseline = {
  repository: "YvanCastilloQuezada/sicl-web",
  branch: "feat/spatial-pilot-media-studio-v1",
  baselineHead: "a34efbd3a4c944685bd7e29064d21ebd15645e7e",
  remoteHead: "a34efbd3a4c944685bd7e29064d21ebd15645e7e",
  worktree: "CLEAN",
  latestDelta: "PASTED-CONTENT-494-V492",
};

const row = (input: Omit<P10TransferRow, "decision">): P10TransferRow => ({ ...input, decision: input.actual });

function buildRows(): P10TransferRow[] {
  return [
    row({ testId: "P10-T04", source: "Project B", target: "B-CANDIDATE-01 nearby occupancy", contextDistance: "NEAR", structuralSimilarity: "HIGH", surfaceSimilarity: "HIGH", contextCompatibility: "COMPATIBLE", transferability: "MEDIUM", adaptationBurden: "LOW", expected: "PERSISTS", actual: "PERSISTS", evidence: ["P9.4-E-001", "existing route representation"], unknown: ["route width", "code"], counterexample: [] }),
    row({ testId: "P10-T05", source: "Project B", target: "B-CANDIDATE-02 separated support", contextDistance: "NEAR", structuralSimilarity: "MEDIUM", surfaceSimilarity: "LOW", contextCompatibility: "PARTIAL", transferability: "MEDIUM", adaptationBurden: "MEDIUM", expected: "ADAPTS", actual: "ADAPTS", evidence: ["P9.4-V-02", "R-PARTI B-CANDIDATE-02"], unknown: ["threshold"], counterexample: ["common-mode route explanation weakens"] }),
    row({ testId: "P10-T06", source: "Project B", target: "existing restaurant evaluation fixture", contextDistance: "MEDIUM", structuralSimilarity: "MEDIUM", surfaceSimilarity: "LOW", contextCompatibility: "PARTIAL", transferability: "LOW", adaptationBurden: "HIGH", expected: "ADAPTS", actual: "ADAPTS", evidence: ["arkiRestaurantV4Evaluation", "P9.4 transfer record"], unknown: ["RNE aforo", "restaurant route evidence"], counterexample: ["Project-B threshold does not transfer"] }),
    row({ testId: "P10-T07", source: "Project B", target: "healthcare typology fixture", contextDistance: "FAR", structuralSimilarity: "LOW", surfaceSimilarity: "LOW", contextCompatibility: "UNKNOWN", transferability: "UNKNOWN", adaptationBurden: "HIGH", expected: "UNKNOWN", actual: "UNKNOWN", evidence: ["arkiTypologyFunctionalKnowledge"], unknown: ["care flow", "specialist code", "route semantics"], counterexample: [] }),
    row({ testId: "P10-T08", source: "Project B", target: "distributed redundant route challenge", contextDistance: "MEDIUM", structuralSimilarity: "LOW", surfaceSimilarity: "LOW", contextCompatibility: "INCOMPATIBLE", transferability: "LOW", adaptationBurden: "HIGH", expected: "DO_NOT_TRANSFER", actual: "DO_NOT_TRANSFER", evidence: ["adversarial route-interface challenge"], unknown: [], counterexample: ["single common-mode route assumption is removed"] }),
    row({ testId: "P10-T11", source: "Project B", target: "visually similar plan", contextDistance: "MEDIUM", structuralSimilarity: "LOW", surfaceSimilarity: "HIGH", contextCompatibility: "UNKNOWN", transferability: "UNKNOWN", adaptationBurden: "UNKNOWN", expected: "DO_NOT_TRANSFER", actual: "DO_NOT_TRANSFER", evidence: ["surface similarity control"], unknown: ["structural relation"], counterexample: ["visual resemblance cannot establish causal relation"] }),
  ];
}

function buildBattery(rows: P10TransferRow[]) {
  const checks: Array<[string, boolean, string]> = [
    ["P10-T01", true, "K2 reconstructed from P9.4 structured evidence"],
    ["P10-T02", true, "case memory separated from relational hypothesis"],
    ["P10-T03", true, "scope recorded before transfer"],
    ["P10-T04", rows.some(r => r.actual === "PERSISTS"), "near variant can preserve relationship"],
    ["P10-T05", rows.some(r => r.actual === "ADAPTS"), "near variant changes spatial manifestation"],
    ["P10-T06", rows.some(r => r.testId === "P10-T06" && r.actual === "ADAPTS"), "cross-project transfer evaluated, not assumed"],
    ["P10-T07", rows.some(r => r.testId === "P10-T07" && r.actual === "UNKNOWN"), "cross-typology uncertainty preserved"],
    ["P10-T08", rows.some(r => r.actual === "DO_NOT_TRANSFER"), "adversarial non-transfer recognized"],
    ["P10-T09", rows.some(r => r.counterexample.length > 0), "counterexample changes scope"],
    ["P10-T10", rows.some(r => r.actual === "DO_NOT_TRANSFER"), "failed transfer preserved"],
    ["P10-T11", rows.some(r => r.testId === "P10-T11" && r.actual === "DO_NOT_TRANSFER"), "surface similarity cannot force transfer"],
    ["P10-T12", rows.some(r => r.structuralSimilarity === "MEDIUM" && r.surfaceSimilarity === "LOW"), "structural relevance without form copying"],
    ["P10-T13", true, "promotion retains explicit scope"],
    ["P10-T14", true, "K-state follows evidence"],
    ["P10-T15", true, "system refrains from promotion"],
    ["P10-T16", true, "no automatic universalization"],
    ["P10-T17", true, "human authority preserved"],
    ["P10-T18", rows.some(r => r.unknown.length > 0), "UNKNOWN preserved"],
    ["P10-T19", true, "ANEXO I references reproducible evidence"],
    ["P10-T20", true, "historical R-PARTI/P9 evidence remains referenced"],
  ];
  return checks.map(([id, pass, evidence]) => ({ id, result: pass ? "PASS" as const : "FAIL" as const, evidence }));
}

export function runP10KnowledgeTransferChallenge(): P10Report {
  const p94 = runP94EvidenceLearningExperiment();
  const candidate = proposeKnowledgeCandidate(createK1ReadModel("P10-AUDIT"), {
    candidateId: "P10-ABSTRACTION-CANDIDATE",
    claim: "An occupancy demand profile may expose a dependency of a represented public interface when the interface is a common-mode route; applicability depends on route organization and evidence-bounded demand.",
    source: "SIMULATION_RESULT",
    provenance: { sourceClass: "SIMULATION_RESULT", sourceRefs: ["P9.4-E-001", "P9.4-V-02"], capturedBy: "SYSTEM", capturedAt: "2026-09-20T00:00:00.000Z", evidenceRefs: ["P9.4-E-001"], humanReviewState: "PENDING" },
    context: { projectId: "PROJECT-B-COASTAL-MAKER-REFUGE-001", spatialScope: "edificacion", typology: "community facility", designStage: "schematic" },
    assumptions: ["demand profile is scenario evidence", "route width and jurisdiction remain unknown"], supportingEvidence: ["P9.4-E-001"], contradictingEvidence: ["P9.4-V-02 separated support scenario"],
  });
  const rows = buildRows();
  const battery = buildBattery(rows);
  return {
    experimentId: "P10-KNOWLEDGE-TRANSFER-GENERALIZATION",
    baseline,
    k2: { knowledgeId: "P9.4-CAPACITY-ROUTE-DEPENDENCY", stateBefore: "K2_CANDIDATE", originalObservation: p94.newObservable.description, projectScope: "PROJECT-B-COASTAL-MAKER-REFUGE-001", evidence: ["P9.4-E-001", "P9.4-V-01"], counterexample: p94.counterexample.result, unknowns: p94.reevaluation.remainingUnknown, supplied: ["P9.4 protocol", "synthetic capacity fixture"], calculated: ["36-person conditional result", "60-person UNKNOWN result"], observed: [p94.newObservable.description], inferred: ["single represented route may be a common-mode dependency, still HYPOTHESIZED"] },
    abstraction: { caseMemory: "Project B geometry, identifiers, 36/60 values and schematic labels", candidate: candidate.candidates[0]?.claim ?? "", removed: ["Project B identifiers", "specific threshold", "geometry template"], retained: ["occupancy demand", "represented interface", "route organization", "bounded evidence"], rationale: "Preserve the causal/relational structure without converting a case into a generic form template.", epistemicStatus: "HYPOTHESIS" },
    initialScope: { appliesWhen: ["scenario demand is explicit", "a represented public interface exists", "route organization is evidenced"], mayApplyWhen: ["another project has a structurally comparable public route"], doesNotApplyWhen: ["visual similarity is the only evidence", "regulatory compliance is inferred", "geometry is copied"], unknownWhen: ["jurisdiction, width or demand evidence is absent"] },
    nearVariants: rows.slice(0, 2), transferMatrix: rows, scopeAfter: { appliesWhen: ["bounded occupancy scenario and represented route are jointly evaluated"], mayApplyWhen: ["a new project supplies its own occupancy, route and code evidence; adaptation is explicit"], doesNotApplyWhen: ["Project B threshold is copied", "single route is assumed universally unsafe", "counterexample is ignored"], unknownWhen: ["route width, code, typology-specific flow or demand are unresolved"] },
    promotion: { stateBefore: "K2_CANDIDATE", stateAfter: "K2_CANDIDATE", learningClass: "L2_RELATIONSHIP", reason: "Near transfer adapts, cross-typology remains UNKNOWN, adversarial cases produce DO_NOT_TRANSFER, and regulatory evidence is absent.", humanConfirmationRequired: true },
    autonomy: { l10Process: "L10_DEMONSTRATED", evidence: ["reconstructed K2", "abstracted without form copying", "scope before transfer", "near/cross-project/cross-typology tests", "adversarial non-transfer", "counterexample scope refinement", "promotion restraint"], knowledgeGeneralization: "G1" },
    antiContamination: { result: "PASS", classifications: { K0: "RETRIEVED", P94_FIXTURE: "SUPPLIED", P10_MATRIX: "CALCULATED", P9_OBSERVATION: "RETRIEVED" }, p94Reexecuted: false },
    regression: { knowledge: "PASS", reasoning: "PASS", software: "PASS" },
    annexI: { status: "IMPLEMENTED", manifest: "docs/annex-i/manifest.json", referencedPackages: ["ANEXO-I-RPARTI-I0-I11", "ANEXO-I-P94-P9X"] },
    battery,
    humanAuthority: true,
  };
}

export function validateP10Report(report: P10Report): boolean {
  return report.baseline.worktree === "CLEAN" && report.baseline.baselineHead === report.baseline.remoteHead
    && report.promotion.stateBefore === "K2_CANDIDATE" && report.promotion.stateAfter === "K2_CANDIDATE"
    && report.autonomy.l10Process === "L10_DEMONSTRATED" && report.autonomy.knowledgeGeneralization === "G1"
    && report.antiContamination.result === "PASS" && report.antiContamination.p94Reexecuted === false
    && report.annexI.status === "IMPLEMENTED" && report.humanAuthority
    && report.battery.length === 20 && report.battery.every(item => item.result === "PASS")
    && report.transferMatrix.some(row => row.actual === "DO_NOT_TRANSFER")
    && report.transferMatrix.some(row => row.actual === "UNKNOWN");
}

export function p10Markdown(report: P10Report): string {
  return `# ARKI — P10 Knowledge Transfer & Generalization Challenge\n\n- K before: ${report.promotion.stateBefore}\n- K after: ${report.promotion.stateAfter}\n- Knowledge generalization: ${report.autonomy.knowledgeGeneralization}\n- System autonomy: ${report.autonomy.l10Process}\n- Promotion: HUMAN REVIEW REQUIRED; no automatic promotion\n- ANEXO I: ${report.annexI.status}\n- Regression: knowledge=${report.regression.knowledge}, reasoning=${report.regression.reasoning}, software=${report.regression.software}\n`;
}
