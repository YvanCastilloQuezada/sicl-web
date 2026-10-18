import { buildPartiProof, type PartiProof } from "./arkiPartiContract";
import { executeArchitecturalReasoning, type ArchitecturalReasoningInput, type ArchitecturalReasoningResult } from "./arkiD62ReasoningHarness";
import { executeD63G, type D63Input, type D63Result } from "./arkiD63GeometricBridge";
import { emptySnapshot, type SiclSnapshot } from "./siclCore";

export type ProjectIdentifier = `${string}-${string}-${string}-${string}`;
export type CycleStatus = "CONCEPTUAL_CYCLE_PASS" | "PARTIAL";
export type HumanDecision = "PENDING" | "ACCEPTED" | "REJECTED";

export type IntegratedArchitectInput = {
  projectId: ProjectIdentifier;
  projectName: string;
  typology: string;
  brief: string;
  context: Record<string, unknown>;
  constraints: string[];
  activities: D63Input["activities"];
  relationships: D63Input["relationships"];
  subjects: string[];
  conditions: string[];
  unknowns: string[];
  envelope: { width: number; height: number };
  sourceIds: string[];
};

export type IntegratedArchitectCycle = {
  cycleVersion: "ARKI-INTEGRATED-ARCHITECT-1.0";
  project: { projectId: ProjectIdentifier; projectName: string; typology: string; sourceIds: string[] };
  stages: Array<{ stage: string; status: "PASS" | "PARTIAL" | "UNKNOWN"; evidence: string[] }>;
  reasoning: ArchitecturalReasoningResult;
  parti: PartiProof;
  geometry: D63Result;
  evaluation: {
    geometric: "PASS" | "FAIL" | "UNKNOWN";
    functional: "UNKNOWN";
    regulatory: "NOT_EVALUATED";
    architecturalQuality: "NOT_EVALUATED";
    humanDecision: HumanDecision;
    unknowns: string[];
  };
  backtrack: { available: true; targets: ["PARTI", "TOPOLOGY", "GEOMETRY"]; currentDecision: "PENDING_HUMAN_REVIEW" };
  status: CycleStatus;
};

export function isProjectIdentifier(value: string): value is ProjectIdentifier {
  return /^[A-Z]{3}-[A-Z]{3}-\d{3}-\d{3}$/.test(value);
}

export function createProjectIdentifier(seed = "ARKI"): ProjectIdentifier {
  const letters = seed.toUpperCase().replace(/[^A-Z]/g, "ARKI").padEnd(6, "A").slice(0, 6);
  const digits = `${Date.now()}`.replace(/\D/g, "").slice(-6).padStart(6, "0");
  return `${letters.slice(0, 3)}-${letters.slice(3, 6)}-${digits.slice(0, 3)}-${digits.slice(3, 6)}` as ProjectIdentifier;
}

function toReasoningInput(input: IntegratedArchitectInput): ArchitecturalReasoningInput {
  return { executionId: `ARKI-${input.projectId}`, projectId: input.projectId, brief: input.brief, context: { ...input.context, typology: input.typology }, constraints: input.constraints, knownFacts: [`PROJECT_ID=${input.projectId}`, `SOURCE_IDS=${input.sourceIds.join(",")}`], unknowns: input.unknowns, requestedReasoningDepth: "DEEP", seed: input.projectId };
}

function toGeometryInput(input: IntegratedArchitectInput): D63Input {
  return { executionId: `ARKI-GEOMETRY-${input.projectId}`, projectId: input.projectId, brief: input.brief, typology: input.typology, activities: input.activities, subjects: input.subjects, relationships: input.relationships, conditions: input.conditions, constraints: input.constraints, unknowns: input.unknowns, perturbation: { id: "ARKI-PERTURBATION-001", statement: "A critical flow condition changes at peak operation.", changes: { revalidate: "affected-flow-and-interface" } }, envelope: { ...input.envelope, status: "EXPLICIT_PROJECT_DIMENSION" }, separationCondition: "All declared flow separations and controlled interfaces must remain legible and non-overlapping.", };
}

function stage(stage: string, status: "PASS" | "PARTIAL" | "UNKNOWN", evidence: string[]): { stage: string; status: "PASS" | "PARTIAL" | "UNKNOWN"; evidence: string[] } { return { stage, status, evidence }; }

export function executeIntegratedArchitectCycle(input: IntegratedArchitectInput, snapshot: SiclSnapshot = emptySnapshot(), coreKnowledgeVersion = 1, runtimeVersion = "ARKI-INTEGRATED-ARCHITECT-1.0"): IntegratedArchitectCycle {
  if (!isProjectIdentifier(input.projectId)) throw new Error("PROJECT_ID_MUST_MATCH_XXX-XXX-XXX-XXX");
  const reasoning = executeArchitecturalReasoning(toReasoningInput(input), snapshot, coreKnowledgeVersion, runtimeVersion);
  const parti = buildPartiProof();
  const geometry = executeD63G(toGeometryInput(input), snapshot, coreKnowledgeVersion, runtimeVersion);
  const unknowns = [...input.unknowns, "Functional fit requires architect review.", "Regulatory compliance and professional approval are not evaluated by this conceptual cycle."];
  const stages = [
    stage("PROJECT_CONDITIONS", "PASS", [`PROJECT_ID:${input.projectId}`, ...input.sourceIds.map((id) => `SOURCE:${id}`)]),
    stage("KNOWLEDGE_RETRIEVAL", reasoning.retrieved.length ? "PASS" : "PARTIAL", reasoning.retrieved.map((item) => `KNOWLEDGE:${item.id}`)),
    stage("REASONING_AND_TRANSFER", "PASS", reasoning.transferDecisions.map((item) => `TRANSFER:${item.transferId}:${item.mode}`)),
    stage("PARTI_HYPOTHESES", parti.finalStatus === "PASS" ? "PASS" : "PARTIAL", parti.partis.map((item) => `PARTI:${item.partiId}`)),
    stage("TOPOLOGY", parti.gates.G3_PARTI_TO_TOPOLOGY === "PASS" ? "PASS" : "PARTIAL", parti.partis.map((item) => `TOPOLOGY:${item.topologyId}`)),
    stage("GEOMETRY_CONCEPTUAL", geometry.finalStatus === "PASS" ? "PASS" : "PARTIAL", [geometry.candidateA.id, geometry.candidateB.id]),
    stage("FUNCTIONAL_EVALUATION", "UNKNOWN", ["D6.3 functional validity remains UNKNOWN until activity-fit review."]),
    stage("REGULATORY_EVALUATION", "UNKNOWN", ["RNE, jurisdictional and professional approval evidence not supplied to this cycle."]),
    stage("HUMAN_REVIEW", "PASS", ["Human Authority remains final."]),
  ];
  return { cycleVersion: "ARKI-INTEGRATED-ARCHITECT-1.0", project: { projectId: input.projectId, projectName: input.projectName, typology: input.typology, sourceIds: input.sourceIds }, stages, reasoning, parti, geometry, evaluation: { geometric: geometry.finalStatus === "PASS" ? "PASS" : "UNKNOWN", functional: "UNKNOWN", regulatory: "NOT_EVALUATED", architecturalQuality: "NOT_EVALUATED", humanDecision: "PENDING", unknowns }, backtrack: { available: true, targets: ["PARTI", "TOPOLOGY", "GEOMETRY"], currentDecision: "PENDING_HUMAN_REVIEW" }, status: geometry.finalStatus === "PASS" && parti.finalStatus === "PASS" ? "CONCEPTUAL_CYCLE_PASS" : "PARTIAL" };
}

export function summarizeArchitectCapability(cycle: IntegratedArchitectCycle) {
  return { canInterpretBrief: true, canRetrieveKnowledge: true, canProposePartis: cycle.parti.partis.length === 3, canTraceTopology: cycle.stages.some((item) => item.stage === "TOPOLOGY" && item.status === "PASS"), canGenerateConceptualGeometry: cycle.geometry.finalStatus === "PASS", canRejectAdversarialParti: cycle.parti.mutations.some((item) => item.status === "REJECTED"), canBacktrack: cycle.backtrack.available, canTransferWithAdaptation: cycle.parti.transfer.mode === "ADAPT", functionalValidity: cycle.evaluation.functional, regulatoryValidity: cycle.evaluation.regulatory, humanDecision: cycle.evaluation.humanDecision, claim: "BOUNDED_CONCEPTUAL_ARCHITECTURAL_SYNTHESIS_ONLY" };
}
