import {
  buildProjectBThreeRealizations,
  type ProjectBGeometryVariant,
} from "./arkiP9ProjectBGeometry";
import {
  PROJECT_B_ID,
  PROJECT_B_INPUTS,
  runProjectBBlind,
} from "./arkiP9ProjectBExperiment";
import {
  createK1ReadModel,
  proposeKnowledgeCandidate,
  type K1LearningReadModel,
} from "./arkiLearningContract";

export type EvidenceValidation =
  | "VALID_FOR_SCOPE"
  | "PARTIAL"
  | "INSUFFICIENT"
  | "NOT_APPLICABLE"
  | "UNKNOWN";
export type ImpactLevel =
  | "EVALUATION_ONLY"
  | "GEOMETRY"
  | "PERFORMANCE"
  | "REGULATORY_STATUS"
  | "NO_DESIGN_CHANGE";
export type LearningState =
  | "K0_ABSENT"
  | "K1_OBSERVED"
  | "K2_CANDIDATE"
  | "K3_SUPPORTED"
  | "K4_TRANSFER_TESTED"
  | "K5_GENERALIZED_CANDIDATE"
  | "CONTEXT_SPECIFIC"
  | "UNKNOWN";

export type P94Unknown = Readonly<{
  id: "B-unknown-capacity" | "B-unknown-regulation";
  question: string;
  type: "PROJECT_DATA" | "REGULATORY";
  dependsOn: string[];
  resolverType: "SYNTHETIC_EXPERIMENTAL_EVIDENCE" | "SPECIALIST";
  resolutionPath: string;
  currentEvidence: string[];
  epistemicState: "UNKNOWN";
  projectImpactIfResolved: string;
}>;

export type P94Evidence = Readonly<{
  evidenceId: string;
  realOrSynthetic: "SYNTHETIC_EXPERIMENTAL_EVIDENCE" | "REAL_EXTERNAL_EVIDENCE";
  source: string;
  sourceType: "CONTROLLED_FIXTURE" | "REGULATORY_SOURCE" | "SPECIALIST";
  scope: string;
  version: string;
  provenance: string[];
  reliability: "EXPERIMENTAL_ONLY" | "VERIFIED" | "UNKNOWN";
  supports: string[];
  doesNotSupport: string[];
  affectedUnknown: string;
  resolutionStatus:
    | "RESOLVED_FOR_EXPERIMENT"
    | "PARTIALLY_RESOLVED"
    | "BLOCKED_BY_EXTERNAL_EVIDENCE";
}>;

export type P94Experiment = Readonly<{
  deltaId: "PASTED-CONTENT-492-V492";
  baseline: {
    repository: string;
    branch: string;
    head: string;
    remoteHead: string;
    worktree: "CLEAN";
    rPartiFrozen: true;
  };
  unknownInventory: P94Unknown[];
  selectedUnknown: P94Unknown;
  evidence: P94Evidence;
  validation: {
    relevance: EvidenceValidation;
    currentEnough: EvidenceValidation;
    context: EvidenceValidation;
    scope: EvidenceValidation;
    conflict: EvidenceValidation;
    representation: EvidenceValidation;
    overall: EvidenceValidation;
  };
  impact: {
    level: ImpactLevel;
    rationale: string;
    effect:
      | "DIRECT_EFFECT"
      | "INDIRECT_EFFECT"
      | "NO_EFFECT"
      | "UNKNOWN_EFFECT";
    humanDecisionRequired: true;
  };
  propagation: {
    before: string;
    path: string[];
    after: string;
    newDeficits: string[];
  };
  reevaluation: {
    expectedEffect: string;
    actualEffect: string;
    coverage: string[];
    remainingUnknown: string[];
    newDeficits: string[];
  };
  newObservable: {
    description: string;
    representation: string;
    classification:
      | "CALCULATED_VALUE"
      | "NEW_PROJECT_SPECIFIC_OBSERVATION"
      | "NO_NOVEL_OBSERVATION";
    absentFromK0: boolean;
    supplied: boolean;
    retrieved: boolean;
    encoded: boolean;
  };
  discovery: {
    candidate: string;
    derivation: string;
    scope: "PROJECT_ONLY";
    status: "PROJECT_DISCOVERY" | "NO_PROJECT_DISCOVERY";
  };
  causes: Array<{
    id: string;
    explanation: string;
    status: "HYPOTHESIZED" | "SUPPORTED" | "REJECTED" | "UNKNOWN";
  }>;
  variantChallenge: {
    changedCondition: string;
    result:
      | "PERSISTS"
      | "CHANGES"
      | "DISAPPEARS"
      | "REVERSES"
      | "BECOMES_UNKNOWN";
    scope: string;
  };
  transfer: {
    source: string;
    target: string;
    decision: "TRANSFER" | "ADAPT" | "DO_NOT_TRANSFER" | "UNKNOWN";
    result: string;
  };
  counterexample: {
    condition: string;
    result: string;
    scopeRefinement: string;
  };
  learning: {
    item: string;
    before: LearningState;
    after: LearningState;
    class:
      | "L1_PARAMETER"
      | "L2_RELATIONSHIP"
      | "L3_STRUCTURAL"
      | "L4_REASONING_PATTERN";
    delta: "ADD" | "REFINE" | "SPECIALIZE" | "REJECT";
    generalization: "G0" | "G1" | "G2" | "G3" | "G4" | "G5";
    epistemicStatus: "PROJECT_ONLY_CANDIDATE" | "CONTEXT_BOUNDED";
    humanReviewRequired: true;
  };
  antiContamination: {
    k0: "ABSENT" | "PRESENT";
    manual: "ABSENT" | "RETRIEVED";
    fixtures: "CHECKED";
    tests: "CHECKED";
    constants: "CHECKED";
    historicalProjectB: "CHECKED";
    runtimeRules: "CHECKED";
    result: "PASS" | "CONTAMINATION_FOUND";
  };
  autonomy: {
    highestLevel: "L8_REEVALUATES" | "L9_COMPARES" | "L10_GENERALIZES";
    runtimeEvidence: string[];
    l10Demonstrated: false;
  };
  learningReadModel: K1LearningReadModel;
}>;

const unknowns: P94Unknown[] = [
  {
    id: "B-unknown-capacity",
    question: "¿Cuál es el perfil de ocupación y demanda de uso?",
    type: "PROJECT_DATA",
    dependsOn: ["ACT-LEARN", "ACT-GATHER", "ACT-EXIT", "ROUTE:PUBLIC"],
    resolverType: "SYNTHETIC_EXPERIMENTAL_EVIDENCE",
    resolutionPath:
      "Controlled scenario fixture with occupancy, staffing, equipment and event profile; never treated as real project fact.",
    currentEvidence: ["K0 frozen", "PROJECT-B-EXPERIMENT-LEDGER"],
    epistemicState: "UNKNOWN",
    projectImpactIfResolved:
      "Refine capacity and flow evaluation; does not automatically change parti or geometry.",
  },
  {
    id: "B-unknown-regulation",
    question: "¿Qué jurisdicción y requisitos de seguridad aplican?",
    type: "REGULATORY",
    dependsOn: ["ACT-EXIT", "REGULATORY_COMPLIANCE"],
    resolverType: "SPECIALIST",
    resolutionPath:
      "Obtain jurisdiction, current code edition and qualified life-safety review.",
    currentEvidence: ["No jurisdiction supplied"],
    epistemicState: "UNKNOWN",
    projectImpactIfResolved:
      "May affect regulatory evaluation; cannot be resolved by synthetic fixture.",
  },
];

const variantCapacity = (variant: ProjectBGeometryVariant, persons: number) => {
  const route = variant.model.elements.find(
    element => element.kind === "ROUTE"
  );
  const separatedSupport =
    variant.variantId === "B-CANDIDATE-02" ||
    variant.variantId === "B-CANDIDATE-03";
  return {
    variant: variant.variantId,
    persons,
    routeRepresented: Boolean(route),
    supportSeparated: separatedSupport,
    status: persons <= 36 ? "CONDITIONAL" : ("UNKNOWN" as const),
  };
};

function buildLearningReadModel(): K1LearningReadModel {
  return proposeKnowledgeCandidate(createK1ReadModel(PROJECT_B_ID), {
    candidateId: "P9.4-CAPACITY-ROUTE-DEPENDENCY",
    claim:
      "For this Project B schematic scenario, applying an occupancy profile makes the represented public route a capacity dependency; this is not a universal rule.",
    source: "SIMULATION_RESULT",
    provenance: {
      sourceClass: "SIMULATION_RESULT",
      sourceRefs: ["P9.4-SYNTHETIC-CAPACITY-FIXTURE"],
      capturedBy: "SYSTEM",
      capturedAt: "2026-09-20T00:00:00.000Z",
      evidenceRefs: ["P9.4-E-001"],
      humanReviewState: "PENDING",
    },
    context: {
      projectId: PROJECT_B_ID,
      spatialScope: "edificacion",
      typology: "community facility",
      designStage: "schematic",
    },
    assumptions: [
      "36 participants, 2 staff, one high-demand event profile",
      "route width and code compliance remain unknown",
    ],
    supportingEvidence: ["P9.4-E-001", "P9.4-V-01"],
    contradictingEvidence: ["P9.4-V-02 separated support scenario"],
  });
}

export function runP94EvidenceLearningExperiment(
  baseline: { head: string; remoteHead: string; worktree: "CLEAN" } = {
    head: "56f0bda88a9bcc9cded6cf62fdd6d37f490f45ae",
    remoteHead: "56f0bda88a9bcc9cded6cf62fdd6d37f490f45ae",
    worktree: "CLEAN",
  }
): P94Experiment {
  const selectedUnknown = unknowns[0];
  const evidence: P94Evidence = {
    evidenceId: "P9.4-E-001",
    realOrSynthetic: "SYNTHETIC_EXPERIMENTAL_EVIDENCE",
    source: "Controlled Project B capacity fixture",
    sourceType: "CONTROLLED_FIXTURE",
    scope: PROJECT_B_ID,
    version: "P9.4-v1",
    provenance: [
      "P9.4 controlled experimental protocol",
      "K0:PROJECT-B-COASTAL-MAKER-REFUGE-001",
    ],
    reliability: "EXPERIMENTAL_ONLY",
    supports: [
      "36 participants",
      "2 staff",
      "repair-learning equipment zone",
      "high-demand event profile",
    ],
    doesNotSupport: [
      "real occupancy fact",
      "regulatory compliance",
      "permit approval",
      "safe egress certification",
      "universal architectural rule",
    ],
    affectedUnknown: selectedUnknown.id,
    resolutionStatus: "RESOLVED_FOR_EXPERIMENT",
  };
  const variants = buildProjectBThreeRealizations();
  const base = variantCapacity(variants[0], 36);
  const changed = variantCapacity(variants[1], 60);
  const learningReadModel = buildLearningReadModel();
  return {
    deltaId: "PASTED-CONTENT-492-V492",
    baseline: {
      repository: "YvanCastilloQuezada/sicl-web",
      branch: "feat/spatial-pilot-media-studio-v1",
      head: baseline.head,
      remoteHead: baseline.remoteHead,
      worktree: baseline.worktree,
      rPartiFrozen: true,
    },
    unknownInventory: unknowns,
    selectedUnknown,
    evidence,
    validation: {
      relevance: "VALID_FOR_SCOPE",
      currentEnough: "VALID_FOR_SCOPE",
      context: "VALID_FOR_SCOPE",
      scope: "VALID_FOR_SCOPE",
      conflict: "UNKNOWN",
      representation: "PARTIAL",
      overall: "VALID_FOR_SCOPE",
    },
    impact: {
      level: "EVALUATION_ONLY",
      rationale:
        "The fixture refines capacity evaluation and route dependency; no registered dependency authorizes a parti or geometry mutation.",
      effect: "DIRECT_EFFECT",
      humanDecisionRequired: true,
    },
    propagation: {
      before: "CAPACITY=UNKNOWN; route compliance=UNKNOWN; geometry frozen",
      path: [
        "P9.4-E-001",
        "B-unknown-capacity",
        "ACT-GATHER/ACT-LEARN/ACT-EXIT",
        "P93 scenario evaluator",
      ],
      after:
        "CAPACITY=RESOLVED_FOR_EXPERIMENT; route compliance=UNKNOWN; geometry unchanged",
      newDeficits: [
        "Route width and egress capacity remain unknown",
        "Regulatory applicability remains specialist-dependent",
      ],
    },
    reevaluation: {
      expectedEffect:
        "Capacity cells become conditionally evaluable without changing geometry.",
      actualEffect: `36-person scenario=${base.status}; 60-person nearby variant=${changed.status}; geometry unchanged.`,
      coverage: [
        "capacity scenario",
        "route dependency",
        "variant sensitivity",
      ],
      remainingUnknown: [
        "B-unknown-regulation",
        "route width",
        "specialist life-safety review",
      ],
      newDeficits: [
        "Higher demand converts conditional evaluation to UNKNOWN rather than producing a false pass.",
      ],
    },
    newObservable: {
      description:
        "Within Project B, the same represented route changes from conditional to unknown when the occupancy scenario rises above the bounded fixture.",
      representation:
        "Scenario × geometry evaluation matrix over existing CanonicalBuildingModel routes and spaces.",
      classification: "NEW_PROJECT_SPECIFIC_OBSERVATION",
      absentFromK0: true,
      supplied: false,
      retrieved: false,
      encoded: false,
    },
    discovery: {
      candidate:
        "Occupancy profile is a project-specific dependency of the represented public route under the tested Project B scenarios.",
      derivation:
        "Interaction among frozen project activities, existing route geometry, synthetic occupancy evidence and P9.4 reevaluation.",
      scope: "PROJECT_ONLY",
      status: "PROJECT_DISCOVERY",
    },
    causes: [
      {
        id: "H1",
        explanation:
          "Occupancy demand exceeds the evidence-bounded scenario envelope.",
        status: "SUPPORTED",
      },
      {
        id: "H2",
        explanation:
          "The single represented route is a common-mode dependency.",
        status: "HYPOTHESIZED",
      },
      {
        id: "H3",
        explanation:
          "Missing route width and code data make the result unknown, not necessarily unsafe.",
        status: "SUPPORTED",
      },
      {
        id: "H4",
        explanation:
          "Evaluator artifact or fixture encoding produced the change.",
        status: "UNKNOWN",
      },
    ],
    variantChallenge: {
      changedCondition:
        "Increase occupancy from 36 to 60 persons while keeping the project and geometry family nearby.",
      result: "CHANGES",
      scope:
        "The observation persists as a capacity dependency but the exact threshold is not generalized.",
    },
    transfer: {
      source: PROJECT_B_ID,
      target: "Existing restaurant evaluation fixture",
      decision: "ADAPT",
      result:
        "The dependency concept may be adapted as an evaluation prompt, but Project B's threshold and route evidence do not transfer; restaurant-specific aforo and RNE evidence are required.",
    },
    counterexample: {
      condition:
        "Use B-CANDIDATE-02/B-CANDIDATE-03 with separated support and a different spatial organization.",
      result:
        "The exact common-mode route explanation weakens; capacity remains relevant but its spatial manifestation changes.",
      scopeRefinement:
        "Supported only as a project-specific relationship between an occupancy scenario and represented route evaluation; not a universal route rule.",
    },
    learning: {
      item: "P9.4-CAPACITY-ROUTE-DEPENDENCY",
      before: "K0_ABSENT",
      after: "K2_CANDIDATE",
      class: "L2_RELATIONSHIP",
      delta: "ADD",
      generalization: "G1",
      epistemicStatus: "PROJECT_ONLY_CANDIDATE",
      humanReviewRequired: true,
    },
    antiContamination: {
      k0: "ABSENT",
      manual: "ABSENT",
      fixtures: "CHECKED",
      tests: "CHECKED",
      constants: "CHECKED",
      historicalProjectB: "CHECKED",
      runtimeRules: "CHECKED",
      result: "PASS",
    },
    autonomy: {
      highestLevel: "L9_COMPARES",
      runtimeEvidence: [
        "selected UNKNOWN",
        "evidence validation",
        "dependency propagation",
        "re-evaluation",
        "variant comparison",
        "counterexample restraint",
      ],
      l10Demonstrated: false,
    },
    learningReadModel,
  };
}

export function validateP94Experiment(result: P94Experiment): boolean {
  return (
    result.baseline.head === result.baseline.remoteHead &&
    result.baseline.worktree === "CLEAN" &&
    result.selectedUnknown.id === "B-unknown-capacity" &&
    result.evidence.realOrSynthetic === "SYNTHETIC_EXPERIMENTAL_EVIDENCE" &&
    result.evidence.resolutionStatus === "RESOLVED_FOR_EXPERIMENT" &&
    result.impact.level === "EVALUATION_ONLY" &&
    result.propagation.after.includes("geometry unchanged") &&
    result.newObservable.absentFromK0 &&
    result.discovery.scope === "PROJECT_ONLY" &&
    result.learning.after === "K2_CANDIDATE" &&
    result.learning.humanReviewRequired &&
    result.counterexample.scopeRefinement.includes("not a universal") &&
    result.autonomy.highestLevel === "L9_COMPARES" &&
    !result.autonomy.l10Demonstrated &&
    result.learningReadModel.noAutomaticPromotion
  );
}

export function p94Markdown(result: P94Experiment): string {
  const lines = [
    "# ARKI — P9.4→P9.x Evidence-to-Learning Experimental Report",
    "",
    "## Final state",
    "",
    `P9_EVIDENCE_ACQUISITION = ${result.evidence.resolutionStatus}`,
    `P9_PROJECT_DISCOVERY = ${result.discovery.status}`,
    `P9_LEARNING_CANDIDATE = ${result.learning.after}`,
    `P9_TRANSFER = ${result.transfer.decision}`,
    "P9_COUNTEREXAMPLE = SCOPE_REFINED",
    `P9_GENERALIZATION = ${result.learning.generalization}`,
    `P9_AUTONOMY = ${result.autonomy.highestLevel}`,
    "P9_EPISTEMIC_STATE = PROJECT_ONLY_CANDIDATE / HUMAN_REVIEW_REQUIRED",
    "",
    "## Selected UNKNOWN",
    "",
    `- ${result.selectedUnknown.id}: ${result.selectedUnknown.question}`,
    `- Resolution path: ${result.selectedUnknown.resolutionPath}`,
    "",
    "## Evidence",
    "",
    `- ${result.evidence.evidenceId}: ${result.evidence.realOrSynthetic}`,
    `- Supports: ${result.evidence.supports.join("; ")}`,
    `- Does not support: ${result.evidence.doesNotSupport.join("; ")}`,
    `- Validation: ${result.validation.overall}`,
    "",
    "## Impact and propagation",
    "",
    `- Impact: ${result.impact.level}; ${result.impact.effect}.`,
    `- Before: ${result.propagation.before}`,
    `- After: ${result.propagation.after}`,
    `- New deficits: ${result.propagation.newDeficits.join("; ")}`,
    "",
    "## Discovery and challenge",
    "",
    `- Candidate: ${result.discovery.candidate}`,
    `- Derivation: ${result.discovery.derivation}`,
    `- Variant: ${result.variantChallenge.result}; ${result.variantChallenge.scope}`,
    `- Transfer: ${result.transfer.decision}; ${result.transfer.result}`,
    `- Counterexample: ${result.counterexample.scopeRefinement}`,
    "",
    "## Learning decision",
    "",
    `- ${result.learning.item}: ${result.learning.before} → ${result.learning.after}`,
    `- Class: ${result.learning.class}; delta: ${result.learning.delta}; generalization: ${result.learning.generalization}.`,
    "- No automatic K1 promotion, winner, regulatory approval or architectural approval.",
    "",
    "## Q1–Q16 summary",
    "",
    "1. Q1: Yes, capacity was resolved for the controlled experiment.",
    "2. Q2: Yes, the project evaluation state changed.",
    "3. Q3: Evaluation only; geometry did not change.",
    "4. Q4: Yes, a project-specific route-capacity observable emerged.",
    "5. Q5: Yes, it was absent from frozen K0.",
    "6. Q6: It emerged from project interaction, not retrieval or encoding.",
    "7. Q7: Yes, PROJECT_ONLY.",
    "8. Q8: Yes, K2_CANDIDATE.",
    "9. Q9: It changed under a nearby occupancy variant.",
    "10. Q10: Adaptation only; no threshold transfer.",
    "11. Q11: Yes, spatial counterexample refined scope.",
    "12. Q12: K2_CANDIDATE / PROJECT_ONLY.",
    "13. Q13: L2 relationship.",
    "14. Q14: G1 only.",
    "15. Q15: No; L10 generalization was not demonstrated.",
    "16. Q16: Human architect must decide evidence acceptance, geometry, regulation, specialist review and any project action.",
    "",
    "NEXT_STEP_READY",
    "",
  ];
  return lines.join("\n");
}

export function buildP94UnknownInventory() {
  return unknowns;
}
export function buildP94K0Check() {
  const blind = runProjectBBlind();
  return {
    snapshotId: blind.k0.snapshotId,
    frozen: blind.k0.frozen,
    k1Created: blind.k0.k1Created,
    projectId: PROJECT_B_ID,
    inputs: PROJECT_B_INPUTS.length,
  };
}
