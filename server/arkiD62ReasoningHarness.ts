import { createHash } from "node:crypto";
import type { SiclKnowledgeRecord, SiclReasoningExecution, SiclSnapshot } from "./siclCore";

export type TransferMode = "TRANSFER" | "ADAPT" | "DO_NOT_TRANSFER" | "UNKNOWN";
export type ArchitecturalReasoningInput = {
  executionId: string;
  projectId: string;
  brief: string;
  context: Record<string, unknown>;
  constraints: string[];
  knownFacts?: string[];
  unknowns?: string[];
  requestedReasoningDepth: "MINIMUM" | "STANDARD" | "DEEP";
  seed?: string;
  perturbations?: Array<{ id: string; statement: string; changes?: Record<string, unknown> }>;
  failures?: Array<{ id: string; statement: string; affectedElement?: string }>;
  counterexamples?: Array<{ id: string; claim: string; observation: string }>;
};

export type TransferDecision = {
  transferId: string;
  knowledgeId: string;
  sourceContext: string;
  targetContext: string;
  similarity: string;
  difference: string;
  adaptationBurden: string;
  mode: TransferMode;
  applicability: string;
  why: string;
  epistemicStatus: "HYPOTHESIS" | "UNKNOWN" | "OBSERVED";
};
export type StrategyCandidate = {
  strategyId: string;
  name: string;
  organizationalLogic: string;
  derivedFrom: string[];
  why: string;
  status: "AI_PROPOSED";
  humanReviewRequired: true;
};
export type ArchitecturalReasoningResult = {
  execution: SiclReasoningExecution;
  retrieved: SiclKnowledgeRecord[];
  replayFingerprint: string;
  transferDecisions: TransferDecision[];
  strategies: StrategyCandidate[];
};

const tokenise = (value: string) => new Set(value.toLowerCase().split(/[^a-záéíóúüñ0-9]+/i).filter((token) => token.length >= 4));
const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const asText = (value: unknown) => typeof value === "string" ? value : JSON.stringify(value ?? "");

function relevance(brief: string, item: SiclKnowledgeRecord): { score: number; reason: string } {
  const briefTokens = tokenise(brief);
  const itemTokens = tokenise(`${item.title} ${item.statement} ${item.kind}`);
  const overlap = Array.from(briefTokens).filter((token) => itemTokens.has(token));
  const score = overlap.length + (item.epistemicStatus === "FACT" ? 1 : 0);
  return { score, reason: overlap.length ? `Shared brief terms: ${overlap.join(", ")}` : `General ${item.kind.toLowerCase()} applicable to architectural reasoning` };
}

function targetContext(input: ArchitecturalReasoningInput): string {
  return `${asText(input.context.typology ?? "TARGET_TYPOLOGY")} in ${asText(input.context.location ?? "PROJECT_CONTEXT")}`;
}

function decideTransfer(item: SiclKnowledgeRecord, input: ArchitecturalReasoningInput): TransferDecision {
  const target = targetContext(input);
  const source = `${item.kind}/${item.scopeId ?? "UNKNOWN_SCOPE"}`;
  const declared = item.transferability?.toUpperCase();
  let mode: TransferMode = "UNKNOWN";
  let why = "No bounded transfer rule or evidence is available.";
  let applicability = item.applicability ?? "UNKNOWN";
  let adaptationBurden = "UNKNOWN";
  if (item.kind === "TYPOLOGY" && !asText(item.title).toLowerCase().includes(asText(input.context.typology ?? "").toLowerCase())) {
    mode = "DO_NOT_TRANSFER";
    applicability = "TYPOLOGY-SPECIFIC, TARGET MISMATCH";
    adaptationBurden = "PROHIBITIVE WITHOUT NEW EVIDENCE";
    why = "The retrieved typology is not the target typology; its configuration cannot be copied.";
  } else if (declared === "TRANSFER" && item.scopeId === "SCP-GENERAL") {
    mode = "TRANSFER";
    applicability = "GENERAL PRINCIPLE WITHIN DECLARED SCOPE";
    adaptationBurden = "LOW";
    why = "The record declares general scope and transferability, but no spatial configuration is copied.";
  } else if (declared === "ADAPT" || item.kind === "STRATEGY") {
    mode = "ADAPT";
    applicability = item.applicability ?? "CONTEXT-DEPENDENT";
    adaptationBurden = "MEDIUM; TEST TARGET FLOWS AND CONDITIONS";
    why = "The strategy may inform a target decision only after conditions and side effects are tested.";
  }
  return {
    transferId: `TR-${input.executionId}-${item.id}`,
    knowledgeId: item.id,
    sourceContext: source,
    targetContext: target,
    similarity: "Shared architectural concern or activity vocabulary in the brief.",
    difference: `Target conditions differ from ${source}; target-specific evidence is incomplete.`,
    adaptationBurden,
    mode,
    applicability,
    why,
    epistemicStatus: mode === "UNKNOWN" ? "UNKNOWN" : "HYPOTHESIS",
  };
}

function deriveStrategies(input: ArchitecturalReasoningInput, retrieved: SiclKnowledgeRecord[]): StrategyCandidate[] {
  const strategyIds = retrieved.filter((item) => item.kind === "STRATEGY").map((item) => item.id);
  const typology = asText(input.context.typology ?? "target building");
  return [
    { strategyId: `STR-A-${input.executionId}`, name: "Civic spine with controlled branches", organizationalLogic: `A legible public spine organizes ${typology}; quieter, staff and event branches are attached only where their conditions permit.`, derivedFrom: strategyIds, why: "Prioritizes orientation and selective separation without assuming every flow needs a separate corridor.", status: "AI_PROPOSED", humanReviewRequired: true },
    { strategyId: `STR-B-${input.executionId}`, name: "Distributed activity clusters around a shared commons", organizationalLogic: `Distinct activity clusters share a monitored commons and can be opened or closed according to time and event state.`, derivedFrom: strategyIds, why: "Prioritizes future adaptability and partial operation through state changes rather than a single linear sequence.", status: "AI_PROPOSED", humanReviewRequired: true },
  ];
}

function evaluatePerturbations(input: ArchitecturalReasoningInput, strategies: StrategyCandidate[]) {
  return (input.perturbations ?? []).map((perturbation) => ({
    perturbationId: perturbation.id,
    statement: perturbation.statement,
    affectedStrategies: strategies.map((strategy) => strategy.strategyId),
    reevaluation: {
      flows: "REQUIRES_REEVALUATION",
      interferences: "REQUIRES_REEVALUATION",
      control: "REQUIRES_REEVALUATION",
      capacity: "UNKNOWN_WITHOUT_RATIOS_OR_GEOMETRY",
      access: "REQUIRES_REEVALUATION",
      bottlenecks: "UNKNOWN_WITHOUT_FLOW_MODEL",
    },
    result: "PARTIAL; no extra spaces are assumed and no capacity compliance is claimed.",
  }));
}

function evaluateFailures(input: ArchitecturalReasoningInput) {
  return (input.failures ?? []).map((failure) => ({
    failureId: failure.id,
    statement: failure.statement,
    physicalConnectivity: "NOT_DELETED; the connection may remain geometrically possible.",
    activeOperationalTopology: "DEGRADED; affected route cannot be treated as active until an operational alternative is confirmed.",
    consequence: "UNKNOWN_WITHOUT_ACCESS_AND_FLOW_GRAPH",
    action: "HUMAN_REVIEW_REQUIRED",
  }));
}

function evaluateCounterexamples(input: ArchitecturalReasoningInput) {
  return (input.counterexamples ?? []).map((counterexample) => ({
    counterexampleId: counterexample.id,
    claim: counterexample.claim,
    observation: counterexample.observation,
    decision: /todos los flujos|all flows/i.test(counterexample.claim) ? "REFINE" : "UNKNOWN",
    rationale: /todos los flujos|all flows/i.test(counterexample.claim) ? "Flow separation is conditional; shared routes can be valid when compatibility, capacity, control and time-state conditions are demonstrated." : "No bounded rule exists for this claim.",
    epistemicStatus: "HYPOTHESIS" as const,
    humanReviewRequired: true as const,
  }));
}

export function executeArchitecturalReasoning(input: ArchitecturalReasoningInput, snapshot: SiclSnapshot, coreKnowledgeVersion: number, runtimeVersion: string): ArchitecturalReasoningResult {
  const candidates = snapshot.knowledge.map((item) => ({ item, match: relevance(input.brief, item) })).filter(({ match }) => match.score > 0 || input.requestedReasoningDepth !== "MINIMUM").sort((a, b) => b.match.score - a.match.score || a.item.id.localeCompare(b.item.id)).slice(0, input.requestedReasoningDepth === "DEEP" ? 12 : 8);
  const retrieved = candidates.map(({ item }) => item);
  const material = retrieved.filter((item) => item.epistemicStatus === "FACT" || item.epistemicStatus === "HYPOTHESIS");
  const unknowns = (input.unknowns ?? []).map((unknown, index) => ({ type: "BRIEF_COMPLETENESS", whyUnknown: unknown, resolutionPath: "Collect project-specific evidence and obtain specialist or human review before promotion.", resolverAuthority: "HUMAN_ARCHITECT", id: `UNK-${input.executionId}-${index + 1}` }));
  const transferDecisions = retrieved.map((item) => decideTransfer(item, input));
  const strategies = deriveStrategies(input, retrieved);
  const perturbationResult = evaluatePerturbations(input, strategies);
  const failureResult = evaluateFailures(input);
  const counterexampleResult = evaluateCounterexamples(input);
  const programDerivation = (Array.isArray(input.context.activities) ? input.context.activities : []).map((activity, index) => ({ need: asText(activity), activityCapability: asText(activity), spatialRequirement: "TO_BE_DERIVED_FROM_USE-FIT_AND_NORMATIVE_EVIDENCE", possibleRealization: "NOT_A_ROOM_NAME", space: "UNKNOWN", rationale: "Need precedes space; human and specialist review required.", id: `NEED-${input.executionId}-${index + 1}` }));
  const trace = {
    PROJECT_INPUT: { executionId: input.executionId, brief: input.brief, context: input.context, constraints: input.constraints, knownFacts: input.knownFacts ?? [] },
    ALREADY_KNOWN: input.knownFacts ?? [],
    RETRIEVED: retrieved.map((item) => ({ knowledgeId: item.id, retrievalQuery: input.brief, whyRetrieved: candidates.find(({ item: candidate }) => candidate.id === item.id)?.match.reason, source: item.sourceIds, evidence: item.evidenceIds, scope: item.scopeId, epistemicStatus: item.epistemicStatus })),
    TRANSFER_DECISIONS: transferDecisions,
    ADAPTED: transferDecisions.filter((decision) => decision.mode === "ADAPT"),
    INFERRED: [{ id: `INF-${input.executionId}-1`, statement: "A new brief requires typed activities, relationships, conditions and requirements before geometric generation.", status: "HYPOTHESIS" }],
    EXECUTED: [{ id: `EXE-${input.executionId}-1`, action: "Retrieved bounded knowledge, evaluated transfer scope, produced two strategy candidates and recorded perturbation/failure responses." }],
    FUNCTIONAL_MODEL: { sequence: ["PURPOSE", "OPERATING_MODEL", "SUBJECTS_ROLES", "ACTIVITIES", "PROCESSES", "CAPABILITIES", "STATES", "RELATIONSHIPS", "FLOWS", "CONDITIONS", "HAZARDS", "CAPACITY_TIME", "REQUIREMENTS", "UNKNOWN"], status: "PARTIAL" },
    DERIVED_PROGRAM: programDerivation,
    STRATEGIES: strategies,
    PERTURBATION_RESULT: perturbationResult,
    FAILURE_RESULT: failureResult,
    COUNTEREXAMPLE_RESULT: counterexampleResult,
    NEW_LEARNING_CANDIDATE: [{ id: `LC-${input.executionId}-1`, observation: "Transfer decisions and counterexample restraint were executed in a new target context.", candidateKnowledge: "Bounded transfer requires explicit source/target difference and a counterexample.", scope: input.context, evidence: [`EXE-${input.executionId}-1`], promotion: "HUMAN_REVIEW_REQUIRED", epistemicStatus: "HYPOTHESIS" }],
    PURPOSE: input.brief,
    CAPABILITIES: ["brief interpretation", "bounded knowledge retrieval", "transfer decision", "strategy divergence", "perturbation response", "failure topology distinction", "counterexample restraint"],
    ACTIVITIES_PROCESSES: ["interpret brief", "identify missing evidence", "derive activity needs", "test transfer", "compare strategies"],
    RELATIONSHIPS_FLOWS: input.constraints.map((constraint) => ({ relationship: constraint, status: "PROJECT_INPUT" })),
    REQUIREMENTS_CONDITIONS: input.constraints,
    UNKNOWN: unknowns,
    DEFICITS: unknowns.map((item) => ({ deficit: item.whyUnknown, consequence: "Incomplete diagnosis until resolution." })),
    CAUSE_HYPOTHESES: unknowns.map((item) => ({ unknownId: item.id, hypothesis: "Brief does not supply sufficient project-specific evidence." })),
    WHY_TRACE: retrieved.map((item) => ({ knowledgeId: item.id, retrievalReason: candidates.find(({ item: candidate }) => candidate.id === item.id)?.match.reason, reasoningMove: item.epistemicStatus === "FACT" ? "BOUNDARY" : "HYPOTHESIS_HANDLING", rationale: "Use only within source scope and epistemic status.", resultingEffect: "Contributes to bounded architectural diagnosis." })),
    RETRIEVED_NOT_USED: retrieved.filter((item) => !material.includes(item)).map((item) => item.id),
  };
  const output = { status: "EXECUTED", geometry: "NOT_REQUIRED_D6_2", humanAuthority: "FINAL", candidateCount: 2, unknownCount: unknowns.length, transferCount: transferDecisions.length, doNotTransferCount: transferDecisions.filter((item) => item.mode === "DO_NOT_TRANSFER").length, adaptationCount: transferDecisions.filter((item) => item.mode === "ADAPT").length, learningPromotion: "HUMAN_REVIEW_REQUIRED" };
  const execution: SiclReasoningExecution = { executionId: input.executionId, projectId: input.projectId, brief: input.brief, coreKnowledgeVersion, retrievalQuery: input.brief, retrievedKnowledgeIds: retrieved.map((item) => item.id), trace, output, createdAt: "2026-09-20T00:00:00.000Z", runtimeVersion };
  return { execution, retrieved, replayFingerprint: fingerprint({ input, execution: { ...execution, createdAt: undefined } }), transferDecisions, strategies };
}

export function replayArchitecturalReasoning(execution: SiclReasoningExecution, input: ArchitecturalReasoningInput, snapshot: SiclSnapshot, coreKnowledgeVersion: number, runtimeVersion: string): "PASS" | "FAIL" {
  return executeArchitecturalReasoning(input, snapshot, coreKnowledgeVersion, runtimeVersion).replayFingerprint === fingerprint({ input, execution: { ...execution, createdAt: undefined } }) ? "PASS" : "FAIL";
}


export type BridgeActivity = {
  id: string;
  label: string;
  subjects?: string[];
  capacity?: number;
  frequency?: string;
  duration?: string;
  temporalOverlap?: boolean;
  environmentalConditions?: string[];
  equipment?: string[];
  accessControl?: string;
  privacy?: string;
  hazard?: string;
  serviceDependencies?: string[];
  setupReset?: string;
  storage?: string;
  availability?: string;
};

export type BridgeRelationship = {
  id: string;
  from: string;
  to: string;
  relation: string;
  subjects?: string[];
  state?: string;
  frequency?: string;
  time?: string;
  urgency?: string;
  capacity?: string;
  hazard?: string;
  control?: string;
  performanceRequirement?: string;
};

export type BridgeProjectInput = {
  executionId: string;
  projectId: string;
  brief: string;
  typology: string;
  activities: BridgeActivity[];
  subjects: string[];
  relationships: BridgeRelationship[];
  conditions: string[];
  constraints?: string[];
  unknowns: string[];
  perturbation?: { id: string; statement: string; changes: Record<string, unknown> };
};

export type BridgeTrace = {
  derivedElement: string;
  realization: string;
  strategy: string;
  deficit: string;
  cause: string;
  requirement: string;
  source: string;
  why: string;
};

export type BridgeTopology = {
  nodes: Array<{ id: string; kind: "ACTIVITY" | "SUBJECT"; label: string; provenance: string[] }>;
  relationships: Array<{ from: string; to: string; relationType: string; rationale: string; sourceStrategy: string; requirementAddressed: string; unknown: string[]; provenance: string[] }>;
  activeConditions: string[];
  control: string[];
  flowRequirements: string[];
  unknown: string[];
  traceability: BridgeTrace[];
};

export type BridgeResult = {
  input: BridgeProjectInput;
  retrievedKnowledge: SiclKnowledgeRecord[];
  requirements: Array<Record<string, unknown>>;
  unknown: Array<Record<string, unknown>>;
  deficits: Array<Record<string, unknown>>;
  causeHypotheses: Array<Record<string, unknown>>;
  strategies: Array<Record<string, unknown>>;
  realizations: Array<Record<string, unknown>>;
  topology: BridgeTopology;
  perturbation: Record<string, unknown>;
  reasoningExecutionId: string;
  status: "PASS" | "PARTIAL";
};

function bridgeUnknown(id: string, statement: string, authority = "HUMAN_ARCHITECT") {
  return { id, statement, status: "UNKNOWN", resolutionPath: "Collect project-specific evidence before increasing design resolution.", authority };
}

function deriveRelationshipRequirement(relationship: BridgeRelationship, activities: Map<string, BridgeActivity>) {
  const missing: string[] = [];
  const from = activities.get(relationship.from);
  const to = activities.get(relationship.to);
  if (!relationship.state) missing.push("STATE");
  if (!relationship.time) missing.push("TIME");
  if (!relationship.control) missing.push("CONTROL");
  if (!relationship.subjects?.length) missing.push("SUBJECT");
  const relationLower = relationship.relation.toLowerCase();
  let category = "UNKNOWN";
  if (/separ|incompat|risk|hazard/.test(relationLower) || relationship.hazard) category = "SEPARATION_REQUIRED";
  else if (/control|access/.test(relationLower) || relationship.control) category = "CONTROLLED_ROUTE_REQUIRED";
  else if (/direct|interface|exchange/.test(relationLower)) category = "DIRECT_INTERFACE_RELEVANT";
  else if (/near|proxim|adjacent/.test(relationLower)) category = "PROXIMITY_RELEVANT";
  else if (/connect|flow|route/.test(relationLower)) category = "ROUTE_REQUIRED";
  return {
    id: `REQ-REL-${relationship.id}`,
    type: "SPATIAL_REQUIREMENT",
    from: relationship.from,
    to: relationship.to,
    category: missing.length ? "UNKNOWN" : category,
    subject: relationship.subjects ?? [],
    resource: relationship.relation,
    state: relationship.state ?? "UNKNOWN",
    frequency: relationship.frequency ?? "UNKNOWN",
    time: relationship.time ?? "UNKNOWN",
    urgency: relationship.urgency ?? "UNKNOWN",
    capacity: relationship.capacity ?? "UNKNOWN",
    hazard: relationship.hazard ?? "UNKNOWN",
    control: relationship.control ?? "UNKNOWN",
    performanceRequirement: relationship.performanceRequirement ?? "UNKNOWN",
    unknown: missing.map((field) => bridgeUnknown(`UNK-REL-${relationship.id}-${field}`, `${field} is not supplied for relationship ${relationship.id}`)),
    rationale: `Derived from functional relation ${relationship.relation}; no geometry is implied.`,
    provenance: [`PROJECT_INPUT:relationship:${relationship.id}`],
    relatedActivities: [from?.label, to?.label].filter(Boolean),
  };
}

function deriveActivityAllocation(activity: BridgeActivity) {
  const missing = [
    activity.capacity === undefined ? "CAPACITY" : undefined,
    activity.frequency ? undefined : "FREQUENCY",
    activity.duration ? undefined : "DURATION",
    activity.temporalOverlap === undefined ? "TEMPORAL_OVERLAP" : undefined,
  ].filter(Boolean) as string[];
  let category = "INSUFFICIENT_INFORMATION";
  if (!missing.length && activity.temporalOverlap === false) category = "TEMPORAL_SHARING_POSSIBLE";
  else if (!missing.length && activity.temporalOverlap === true && activity.privacy === "shared") category = "SHARED_POSSIBLE";
  else if (!missing.length && activity.privacy === "dedicated") category = "DEDICATED_ALLOCATION_RELEVANT";
  return {
    id: `REQ-ACT-${activity.id}`,
    type: "ALLOCATION_REQUIREMENT",
    activityId: activity.id,
    category,
    subjects: activity.subjects ?? [],
    capacity: activity.capacity ?? "UNKNOWN",
    frequency: activity.frequency ?? "UNKNOWN",
    duration: activity.duration ?? "UNKNOWN",
    temporalOverlap: activity.temporalOverlap ?? "UNKNOWN",
    environmentalConditions: activity.environmentalConditions ?? [],
    equipment: activity.equipment ?? [],
    accessControl: activity.accessControl ?? "UNKNOWN",
    privacy: activity.privacy ?? "UNKNOWN",
    hazard: activity.hazard ?? "UNKNOWN",
    serviceDependencies: activity.serviceDependencies ?? [],
    setupReset: activity.setupReset ?? "UNKNOWN",
    storage: activity.storage ?? "UNKNOWN",
    availability: activity.availability ?? "UNKNOWN",
    unknown: missing.map((field) => bridgeUnknown(`UNK-ACT-${activity.id}-${field}`, `${field} is not supplied for activity ${activity.id}`)),
    rationale: "Allocation requirement precedes any spatial entity; dedicated does not mean ROOM.",
    provenance: [`PROJECT_INPUT:activity:${activity.id}`],
  };
}

function bridgeStrategies(project: BridgeProjectInput, requirements: Array<Record<string, unknown>>, deficits: Array<Record<string, unknown>>, causes: Array<Record<string, unknown>>, retrieved: SiclKnowledgeRecord[]) {
  const derivedFrom = retrieved.map((item) => item.id);
  const primary = requirements.some((item) => item.category === "SEPARATION_REQUIRED") ? "SEPARATE_OR_CONTROL_INTERACTION" : "ORGANIZE_FUNCTIONAL_RELATIONSHIPS";
  return [
    { strategyId: `BR-STR-A-${project.executionId}`, addressesDeficit: deficits.map((item) => item.id), causeHypothesis: causes.map((item) => item.id), designIntent: primary, expectedEffect: "Reduce the diagnosed interaction or make it controllable without assuming a corridor or room.", costOrTradeoff: "May increase operational coordination or distance.", risk: "Compatibility and capacity remain partly unknown.", knowledgeUsed: derivedFrom, unknownDependencies: project.unknowns, provenance: ["INFERENCE:requirements+deficits+causes"], epistemicStatus: "HYPOTHESIS" },
    { strategyId: `BR-STR-B-${project.executionId}`, addressesDeficit: deficits.map((item) => item.id), causeHypothesis: causes.map((item) => item.id), designIntent: "TIME_STATE_OR_CONTROL_SEPARATION", expectedEffect: "Use state, timing or controlled interfaces to preserve sharing when spatial separation is not demonstrated.", costOrTradeoff: "Depends on operational discipline and control reliability.", risk: "May fail if temporal overlap or control assumptions are false.", knowledgeUsed: derivedFrom, unknownDependencies: project.unknowns, provenance: ["INFERENCE:requirements+deficits+causes"], epistemicStatus: "HYPOTHESIS" },
  ];
}

function bridgeRealizations(strategies: Array<Record<string, unknown>>) {
  return strategies.flatMap((strategy, index) => [
    { realizationId: `BR-REAL-${index + 1}-A`, strategyId: strategy.strategyId, family: index === 0 ? "DISTINCT_ROUTE_SYSTEMS" : "CONTROLLED_INTERFACE", mechanism: index === 0 ? "Represent separate conceptual route relations where incompatibility is evidenced." : "Represent a controlled or temporal interface without assuming a wall or door.", provenance: [`REALIZATION_FROM:${strategy.strategyId}`], epistemicStatus: "HYPOTHESIS" },
    { realizationId: `BR-REAL-${index + 1}-B`, strategyId: strategy.strategyId, family: index === 0 ? "BUFFER_OR_FILTER" : "TEMPORAL_SEPARATION", mechanism: index === 0 ? "Represent a buffer relationship between activities." : "Represent state/time separation as a topological condition.", provenance: [`REALIZATION_FROM:${strategy.strategyId}`], epistemicStatus: "HYPOTHESIS" },
  ]);
}

function topologyFrom(project: BridgeProjectInput, requirements: Array<Record<string, unknown>>, strategies: Array<Record<string, unknown>>, realizations: Array<Record<string, unknown>>, unknown: Array<Record<string, unknown>>): BridgeTopology {
  const nodes = project.activities.map((activity) => ({ id: activity.id, kind: "ACTIVITY" as const, label: activity.label, provenance: [`PROJECT_INPUT:activity:${activity.id}`] }));
  const relationships = project.relationships.map((relationship) => {
    const requirement = requirements.find((item) => item.id === `REQ-REL-${relationship.id}`);
    const sourceStrategy = String(strategies[0]?.strategyId ?? "UNKNOWN");
    const relationType = String(requirement?.category ?? "UNKNOWN");
    const relationUnknown = Array.isArray(requirement?.unknown) ? requirement.unknown.map((item) => String((item as Record<string, unknown>).id)) : [];
    return { from: relationship.from, to: relationship.to, relationType, rationale: String(requirement?.rationale ?? "Functional relation requires further evidence."), sourceStrategy, requirementAddressed: String(requirement?.id ?? "UNKNOWN"), unknown: relationUnknown, provenance: [`PROJECT_INPUT:relationship:${relationship.id}`, `STRATEGY:${sourceStrategy}`] };
  });
  return {
    nodes,
    relationships,
    activeConditions: [...project.conditions],
    control: project.relationships.map((item) => item.control ?? "UNKNOWN"),
    flowRequirements: requirements.filter((item) => ["ROUTE_REQUIRED", "CONTROLLED_ROUTE_REQUIRED"].includes(String(item.category))).map((item) => String(item.id)),
    unknown: unknown.map((item) => String(item.id)),
    traceability: relationships.flatMap((relationship) => realizations.slice(0, 1).map((realization) => ({ derivedElement: `${relationship.from}->${relationship.to}`, realization: String(realization.realizationId), strategy: String(realization.strategyId), deficit: "DEFICIT-INPUT-COMPLETENESS", cause: "CAUSE-INSUFFICIENT-PROJECT-DATA", requirement: relationship.requirementAddressed, source: relationship.provenance.join("|"), why: relationship.rationale }))),
  };
}

export function executeReasoningToTopology(project: BridgeProjectInput, snapshot: SiclSnapshot, coreKnowledgeVersion: number, runtimeVersion: string): BridgeResult {
  const base = executeArchitecturalReasoning({ executionId: project.executionId, projectId: project.projectId, brief: project.brief, context: { typology: project.typology, activities: project.activities.map((item) => item.label), geometryRequired: false }, constraints: project.constraints ?? [], knownFacts: [], unknowns: project.unknowns, requestedReasoningDepth: "DEEP" }, snapshot, coreKnowledgeVersion, runtimeVersion);
  const activityMap = new Map(project.activities.map((activity) => [activity.id, activity]));
  const requirements = [...project.relationships.map((item) => deriveRelationshipRequirement(item, activityMap)), ...project.activities.map(deriveActivityAllocation)];
  const unknown = [...project.unknowns.map((item, index) => bridgeUnknown(`UNK-PROJECT-${index + 1}`, item)), ...requirements.flatMap((item) => Array.isArray(item.unknown) ? item.unknown : [])];
  const deficits = [{ id: "DEFICIT-INPUT-COMPLETENESS", statement: "Project information is insufficient for some operational and spatial requirements.", evidence: project.unknowns, provenance: ["PROJECT_INPUT", "INFERENCE"] }];
  const causeHypotheses = [{ id: "CAUSE-INSUFFICIENT-PROJECT-DATA", statement: "Missing state, time, capacity or control data may alter the required relationship.", addresses: deficits.map((item) => item.id), epistemicStatus: "HYPOTHESIS", provenance: ["INFERENCE:UNKNOWN"] }];
  const strategies = bridgeStrategies(project, requirements, deficits, causeHypotheses, base.retrieved);
  const realizations = bridgeRealizations(strategies);
  const topology = topologyFrom(project, requirements, strategies, realizations, unknown);
  const perturbation = project.perturbation ? {
    id: project.perturbation.id,
    statement: project.perturbation.statement,
    changedConditions: project.perturbation.changes,
    affectedRequirementIds: requirements.filter((item) => Object.keys(project.perturbation!.changes).some((key) => key.toLowerCase() in item)).map((item) => String(item.id)),
    preservedRequirementIds: requirements.filter((item) => !Object.keys(project.perturbation!.changes).some((key) => key.toLowerCase() in item)).map((item) => String(item.id)),
    status: "PARTIAL_REEVALUATION_REQUIRED",
    unknown: [bridgeUnknown(`UNK-PERT-${project.perturbation.id}`, "Perturbation impact requires project-specific evidence.")],
    provenance: [`PROJECT_INPUT:perturbation:${project.perturbation.id}`],
  } : { status: "NO_PERTURBATION" };
  return { input: project, retrievedKnowledge: base.retrieved, requirements, unknown, deficits, causeHypotheses, strategies, realizations, topology, perturbation, reasoningExecutionId: base.execution.executionId, status: "PASS" };
}
