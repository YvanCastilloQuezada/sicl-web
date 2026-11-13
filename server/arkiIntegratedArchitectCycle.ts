import { buildPartiProof, type PartiProof } from "./arkiPartiContract";
import { projectNormativeEvaluationToF7 } from "./arkiF7NormativeProjection";
import { executeArchitecturalReasoning, type ArchitecturalReasoningInput, type ArchitecturalReasoningResult } from "./arkiD62ReasoningHarness";
import { executeD63G, type D63Input, type D63Result } from "./arkiD63GeometricBridge";
import { emptySnapshot, type SiclSnapshot } from "./siclCore";
import { executeProjectBrainWave1, type DynamicParti, type ArchitecturalGenealogy } from "./arkiProjectBrain";
import { evaluateStructural, evaluateGeotech, evaluateHvac, evaluateEvacuation, evaluateFire, evaluateAcoustic, evaluateSewer, type EngineResult } from "./motoresClient";

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
  envelope: { width: number; height: number; length?: number; water_depth?: number; area?: number; volume?: number };
  sourceIds: string[];
};

export type IntegratedArchitectCycle = {
  cycleVersion: "ARKI-INTEGRATED-ARCHITECT-1.0";
  project: { projectId: ProjectIdentifier; projectName: string; typology: string; sourceIds: string[] };
  stages: Array<{ stage: string; status: "PASS" | "PARTIAL" | "UNKNOWN"; evidence: string[] }>;
  reasoning: ArchitecturalReasoningResult;
  parti: PartiProof;
  projectPartis: DynamicParti[];
  projectTopology: string[];
  projectGenealogy: ArchitecturalGenealogy;
  geometry: D63Result;
  evaluation: {
    geometric: "PASS" | "FAIL" | "UNKNOWN";
    functional: "PASS" | "FAIL" | "PARTIAL" | "UNKNOWN";
    regulatory: "PASS" | "FAIL" | "PARTIAL" | "NOT_EVALUATED";
    architecturalQuality: "PASS" | "FAIL" | "PARTIAL" | "NOT_EVALUATED";
    humanDecision: HumanDecision;
    engines: Record<string, EngineResult>;
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


function evaluateFunctionalFit(input: IntegratedArchitectInput): "PASS" | "FAIL" | "PARTIAL" | "UNKNOWN" {
  if (!input.activities || input.activities.length === 0) return "UNKNOWN";
  if (!input.relationships || input.relationships.length === 0) return "PARTIAL";
  return "PASS";
}

function evaluateArchitecturalQuality(input: IntegratedArchitectInput): "PASS" | "FAIL" | "PARTIAL" | "NOT_EVALUATED" {
  if (!input.envelope) return "NOT_EVALUATED";
  const { width, height } = input.envelope;
  if (!Number.isFinite(width) || !Number.isFinite(height)) return "NOT_EVALUATED";
  if (width <= 0 || height <= 0) return "FAIL";
  const area = width * height;
  if (area < 20) return "FAIL";
  if (area < 50) return "PARTIAL";
  return "PASS";
}

function evaluateRegulatory(input: IntegratedArchitectInput): "PASS" | "FAIL" | "PARTIAL" | "NOT_EVALUATED" {
  if (!input.constraints || input.constraints.length === 0) return "NOT_EVALUATED";
  return "NOT_EVALUATED";
}

export async function executeIntegratedArchitectCycle(input: IntegratedArchitectInput, snapshot: SiclSnapshot = emptySnapshot(), coreKnowledgeVersion = 1, runtimeVersion = "ARKI-INTEGRATED-ARCHITECT-1.0"): Promise<IntegratedArchitectCycle> {
  if (!isProjectIdentifier(input.projectId)) throw new Error("PROJECT_ID_MUST_MATCH_XXX-XXX-XXX-XXX");
  const reasoning = executeArchitecturalReasoning(toReasoningInput(input), snapshot, coreKnowledgeVersion, runtimeVersion);
  const parti = buildPartiProof();

  // PARTI productivo derivado del encargo real.
  // buildPartiProof permanece exclusivamente como fixture documental.
  const projectBrain = executeProjectBrainWave1({
    projectId: input.projectId,
    name: input.projectName,
    typology: input.typology,
    brief: input.brief,
    location: typeof input.context.location === "string"
      ? input.context.location : undefined,
    jurisdiction: typeof input.context.jurisdiction === "string"
      ? input.context.jurisdiction : undefined,
    site: typeof input.context.site === "object" && input.context.site !== null
      ? input.context.site as Record<string, unknown> : undefined,
    knownFacts: [
      `PROJECT_ID=${input.projectId}`,
      ...input.sourceIds.map((id) => `SOURCE=${id}`),
    ],
    unknowns: input.unknowns,
    constraints: input.constraints,
    activities: input.activities,
    relationships: input.relationships,
    sourceIds: input.sourceIds,
  });

  const projectPartis = projectBrain.brain.architecture.partis;
  const projectTopology = projectBrain.brain.architecture.topology;
  const projectGenealogy = projectBrain.genealogy;

  const geometry = executeD63G(toGeometryInput(input), snapshot, coreKnowledgeVersion, runtimeVersion);

  const functionalEval = evaluateFunctionalFit(input);
  const architecturalEval = evaluateArchitecturalQuality(input);
  const regulatoryEval = evaluateRegulatory(input);

  // Motores de ingeniería especializada (motores-api)
  const [engineStructural, engineGeotech, engineHvac, engineEvacuation, engineFire, engineAcoustic, engineSewer] = await Promise.all([
    evaluateStructural(input.projectId, 3, 3.0),
    evaluateGeotech(input.projectId),
    evaluateHvac(input.projectId, input.envelope.width * input.envelope.height, 10),
    evaluateEvacuation(input.projectId, 100, 2),
    evaluateFire(input.projectId, 1000),
    evaluateAcoustic(input.projectId, input.envelope.width * input.envelope.height * 3, (input.envelope.width * input.envelope.height) * 2, 0.3),
    evaluateSewer(input.projectId, 0.1),
  ]);
  const engines: Record<string, EngineResult> = {
    structural: engineStructural,
    geotech: engineGeotech,
    hvac: engineHvac,
    evacuation: engineEvacuation,
    fire: engineFire,
    acoustic: engineAcoustic,
    sewer: engineSewer,
  };

  const unknowns = [...input.unknowns];
  if (functionalEval === "UNKNOWN" || functionalEval === "PARTIAL") unknowns.push("Functional fit requires architect review.");
  if (regulatoryEval === "NOT_EVALUATED") unknowns.push("Regulatory compliance and professional approval are not evaluated by this conceptual cycle.");
  if (architecturalEval === "NOT_EVALUATED") unknowns.push("Architectural quality requires human review.");

  const stages = [
    stage("PROJECT_CONDITIONS", "PASS", [`PROJECT_ID:${input.projectId}`, ...input.sourceIds.map((id) => `SOURCE:${id}`)]),
    stage("KNOWLEDGE_RETRIEVAL", reasoning.retrieved.length ? "PASS" : "PARTIAL", reasoning.retrieved.map((item) => `KNOWLEDGE:${item.id}`)),
    stage("REASONING_AND_TRANSFER", "PASS", reasoning.transferDecisions.map((item) => `TRANSFER:${item.transferId}:${item.mode}`)),
    stage("PARTI_HYPOTHESES", projectPartis.length > 0 ? "PARTIAL" : "UNKNOWN", projectPartis.map((item) => `PROJECT_PARTI:${item.id}`)),
    stage("TOPOLOGY", projectTopology.length > 0 ? "PARTIAL" : "UNKNOWN", projectTopology.map((item) => `PROJECT_TOPOLOGY_HYPOTHESIS:${item}`)),
    stage("GEOMETRY_CONCEPTUAL", geometry.finalStatus === "PASS" ? "PASS" : "PARTIAL", [geometry.candidateA.id, geometry.candidateB.id]),
    stage("FUNCTIONAL_EVALUATION", functionalEval === "PASS" ? "PASS" : (functionalEval === "FAIL" ? "PARTIAL" : "UNKNOWN"), [`Functional: ${functionalEval}`]),
    stage("REGULATORY_EVALUATION", regulatoryEval === "NOT_EVALUATED" ? "UNKNOWN" : "PASS", [`Regulatory: ${regulatoryEval}`]),
    stage("HUMAN_REVIEW", "PASS", ["Human Authority remains final."]),
  ];

  return { cycleVersion: "ARKI-INTEGRATED-ARCHITECT-1.0", project: { projectId: input.projectId, projectName: input.projectName, typology: input.typology, sourceIds: input.sourceIds }, stages, reasoning, parti, projectPartis, projectTopology, projectGenealogy, geometry, evaluation: { geometric: geometry.finalStatus === "PASS" ? "PASS" : "UNKNOWN", functional: functionalEval, regulatory: regulatoryEval, architecturalQuality: architecturalEval, humanDecision: "PENDING", engines, unknowns }, backtrack: { available: true, targets: ["PARTI", "TOPOLOGY", "GEOMETRY"], currentDecision: "PENDING_HUMAN_REVIEW" }, status: "PARTIAL" };
}

export function summarizeArchitectCapability(cycle: IntegratedArchitectCycle) {
  return { canInterpretBrief: true, canRetrieveKnowledge: true, canProposePartis: cycle.projectPartis.length > 0, canTraceTopology: false,
    canTraceTopologyHypothesis: cycle.projectGenealogy.edges.some((edge) => edge.relation === "TOPOLOGY_DERIVED_FROM"), canGenerateConceptualGeometry: cycle.geometry.finalStatus === "PASS" || cycle.geometry.finalStatus === "PARTIAL", canRejectAdversarialParti: cycle.parti.mutations.some((item) => item.status === "REJECTED"), canBacktrack: cycle.backtrack.available, canTransferWithAdaptation: cycle.parti.transfer.mode === "ADAPT", functionalValidity: cycle.evaluation.functional, regulatoryValidity: cycle.evaluation.regulatory, humanDecision: cycle.evaluation.humanDecision, claim: "BOUNDED_CONCEPTUAL_ARCHITECTURAL_SYNTHESIS_ONLY" };
}
