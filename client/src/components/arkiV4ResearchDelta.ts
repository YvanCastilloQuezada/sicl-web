import type { EvidenceRef } from "./arkiCanonicalFunctionalOperationalization";

export const ARKI_V4_RESEARCH_DELTA = {
  version: "4.0",
  workbook: "ARKI_ARQUI_Canonical_Research_Delta_v4.0.xlsx",
  workbookSha256: "03ad41f0092c5e92c3e2a66c16cee4d02b351010b9e2c9ca1e3825d12e5e6c99",
  baseline: "v3.0 + local implementation 54d0c2224256779825c2694f73c637c39c5aba65",
  researchScope: ["MUSEUM", "PERFORMING_ARTS", "LIBRARY_ARCHIVE", "SPORTS", "FIRE_EMERGENCY", "POLICE_CORRECTIONAL", "DATA_CENTER_MISSION_CRITICAL"],
  invariantCount: 52,
  implementationMode: "EXTEND_EXISTING_ABSTRACTIONS" as const,
  humanAuthority: true as const,
  noParallelEngine: true as const,
  researchOnlyAuthority: true as const,
  sourceIds: ["SRC-401", "SRC-402", "SRC-403", "SRC-404", "SRC-405", "SRC-406", "SRC-407", "SRC-408"],
};

export type V4KnowledgeStatus = "RESEARCHED" | "UNKNOWN";
export type V4ImplementationStatus = "NOT_YET_IMPLEMENTED" | "PARTIAL" | "DATA_ONLY" | "DERIVED_VIEW" | "RESEARCH_ONLY";
export type V4ScenarioPhase = "INITIAL" | "SUSTAINED" | "RECOVERY";
export type V4StateDimension = "LOCATION" | "ACCESS" | "CUSTODY" | "AUTHORITY" | "ALLOCATION" | "THERMAL" | "MAINTENANCE" | "SECURITY" | "AVAILABILITY" | "CONTROL";
export type V4SubjectKind = "ACTOR" | "RESOURCE" | "SYSTEM" | "SPACE" | "ROUTE" | "CAPABILITY" | "PROCESS" | "SCENARIO";
export type V4CapabilityResult = "SATISFIED" | "PARTIAL" | "UNSATISFIED" | "UNKNOWN";
export type V4CoverageState = "RELEVANT" | "REQUIRED" | "EVALUATED" | "RESOLVED" | "UNRESOLVED" | "NOT_EVALUATED";

export type V4KnowledgeUnit = {
  id: string;
  domain: string;
  claim: string;
  applicability: string;
  sourceBasis: string[];
  researchStatus: V4KnowledgeStatus;
  implementationStatus: V4ImplementationStatus;
  normativeStatus: "REFERENCE" | "FOREIGN_INDUSTRY_STANDARD" | "FOREIGN_TECHNICAL_STANDARD" | "UNKNOWN";
  limits: string[];
  lastReviewed: string;
  humanReviewRequired: true;
};

export type V4SubjectState = {
  subjectId: string;
  subjectKind: V4SubjectKind;
  dimensions: Partial<Record<V4StateDimension, string>>;
  dependencies?: Array<{ from: V4StateDimension; to: V4StateDimension; condition: string }>;
  evidence: EvidenceRef[];
  humanReviewRequired: true;
};

export type V4TemporalProfile = {
  duration?: number;
  durationUnit?: string;
  sequence?: string[];
  overlap?: string[];
  frequency?: string;
  deadline?: string;
  responseTime?: string;
  recoveryTime?: string;
  endurance?: string;
};

export type V4Scenario = {
  id: string;
  name: string;
  demandProfile: string;
  stateIds: string[];
  temporalProfile: V4TemporalProfile;
  phases?: V4ScenarioPhase[];
  activeTopologyId?: string;
  humanReviewRequired: true;
};

export type V4DependencyNode = {
  id: string;
  requirement: string;
  necessity: "ESSENTIAL" | "SUPPORTING";
  status: V4CapabilityResult;
  evidence: EvidenceRef[];
};

export type V4DependencyGraph = {
  capabilityId: string;
  nodes: V4DependencyNode[];
  andGroups: string[][];
  orGroups: string[][];
  condition?: string;
  humanReviewRequired: true;
};

export type V4ActiveTopology = {
  id: string;
  canonicalGraphId: string;
  scenarioId: string;
  stateIds: string[];
  availableNodeIds: string[];
  restrictedNodeIds: string[];
  availableEdgeIds: string[];
  blockedEdgeIds: string[];
  derivedOnly: true;
  humanReviewRequired: true;
};

export type V4ConcurrentDemand = {
  id: string;
  activityIds: string[];
  sharedResourceIds: string[];
  sharedSegmentIds: string[];
  compatible: "COMPATIBLE" | "INCOMPATIBLE" | "UNKNOWN";
  reason: string;
  evidence: EvidenceRef[];
  humanReviewRequired: true;
};

export type V4RedundancyAssessment = {
  capabilityId: string;
  alternatePathIds: string[];
  remainingCapacity?: { value?: number; unit: string; timeBasis?: string };
  independentFailureDomains: boolean | "UNKNOWN";
  distributionPathsIndependent: boolean | "UNKNOWN";
  plannedMaintenanceSupported: boolean | "UNKNOWN";
  singleFailureSupported: boolean | "UNKNOWN";
  endurance: string | "UNKNOWN";
  result: V4CapabilityResult;
  limits: string[];
  humanReviewRequired: true;
};

export type V4CoverageRecord = {
  subjectId: string;
  claim: string;
  state: V4CoverageState;
  evidence: EvidenceRef[];
  scope: string;
  humanReviewRequired: true;
};

export const ARKI_V4_KNOWLEDGE_UNITS: V4KnowledgeUnit[] = [
  { id: "V4-MULTIDIMENSIONAL-SUBJECT-STATE", domain: "STATE", claim: "State belongs to a subject and may contain independent dimensions with explicit dependencies.", applicability: "Cross-domain scenarios where actor, resource, route, system or space conditions change independently.", sourceBasis: ["v4.0 02_Invariants I4-001..I4-004", "v4.0 03_State_Scenario"], researchStatus: "RESEARCHED", implementationStatus: "NOT_YET_IMPLEMENTED", normativeStatus: "REFERENCE", limits: ["Does not authorize a universal state enum.", "Requires human review of cross-dimension dependencies."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V4-ACTIVE-TOPOLOGY-DERIVED", domain: "TOPOLOGY", claim: "Active topology is a scenario and state-dependent view over canonical geometry and controls; it is not a second geometry model.", applicability: "Normal, degraded, maintenance, emergency or controlled-access operations.", sourceBasis: ["v4.0 01_Delta_Map D-005", "v4.0 02_Invariants I4-005..I4-007"], researchStatus: "RESEARCHED", implementationStatus: "DERIVED_VIEW", normativeStatus: "REFERENCE", limits: ["Physical connectivity does not prove operational connectivity.", "The canonical geometry remains the source of truth."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V4-CAPABILITY-DEPENDENCY-GRAPH", domain: "CAPABILITY", claim: "Capability satisfaction is an end-to-end dependency graph with essential links, valid alternates, interfaces, capacity, availability, performance and evidence.", applicability: "Capabilities whose satisfaction cannot be established by counting rooms or objects.", sourceBasis: ["v4.0 04_Capability_Graph", "v4.0 02_Invariants I4-021..I4-023"], researchStatus: "RESEARCHED", implementationStatus: "PARTIAL", normativeStatus: "REFERENCE", limits: ["An unresolved essential dependency blocks verified PASS unless a valid alternate path exists.", "An alternate must be evaluated for capacity and independence."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V4-CONCURRENT-FEASIBILITY", domain: "CONCURRENCY", claim: "Individually valid activities, flows or resources may be infeasible when their demands overlap on shared resources or segments.", applicability: "Complex buildings, emergency, service, security, healthcare, sports and mission-critical scenarios.", sourceBasis: ["v4.0 05_Concurrency", "v4.0 02_Invariants I4-008..I4-009"], researchStatus: "RESEARCHED", implementationStatus: "PARTIAL", normativeStatus: "REFERENCE", limits: ["Flow crossing is not automatically flow conflict.", "Controlled sharing requires a declared control mechanism."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V4-COVERAGE-DECLARATION", domain: "VERIFICATION", claim: "Verification must declare the relevant and required set, evaluated items, resolved items and unresolved items; PASS without coverage is not complete verification.", applicability: "Regulatory, functional, scenario, evidence and project verification.", sourceBasis: ["v4.0 01_Delta_Map D-006", "v4.0 02_Invariants I4-018..I4-020"], researchStatus: "RESEARCHED", implementationStatus: "DERIVED_VIEW", normativeStatus: "REFERENCE", limits: ["All tested scenarios do not imply all relevant scenarios were tested.", "NOT_EVALUATED remains distinct from PASS and FAIL."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V4-REDUNDANCY-FAILURE-DOMAIN", domain: "MISSION_CRITICAL", claim: "Redundancy requires a usable alternate capability path, sufficient remaining capacity, appropriate independence, interfaces and endurance; duplicate objects alone are not redundancy.", applicability: "Mission-critical and resilience studies as a source-derived candidate concept.", sourceBasis: ["v4.0 07_Mission_Critical", "v4.0 08_Redundancy", "SRC-401", "SRC-404", "SRC-406", "SRC-408"], researchStatus: "RESEARCHED", implementationStatus: "DATA_ONLY", normativeStatus: "FOREIGN_INDUSTRY_STANDARD", limits: ["Not Peru regulation.", "Does not certify a data center or operational resilience.", "Tier, N+1 and 2N are not universal architectural truths."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V4-CAPACITY-TEMPORAL", domain: "CAPACITY", claim: "Capacity must identify subject, process, time, state, allocation, suitability, endurance and growth or part-load behavior where relevant.", applicability: "Capacity claims involving people, equipment, routes, power, cooling, staff or service.", sourceBasis: ["v4.0 09_Capacity_Time", "v4.0 10_Performance", "v4.0 02_Invariants I4-010..I4-017"], researchStatus: "RESEARCHED", implementationStatus: "DERIVED_VIEW", normativeStatus: "REFERENCE", limits: ["A nominal count is not current available or assignable capacity.", "Initial capability is not sustained capability."], lastReviewed: "2026-09-19", humanReviewRequired: true },
];

export function createV4SubjectState(input: Omit<V4SubjectState, "humanReviewRequired">): V4SubjectState {
  return { ...input, humanReviewRequired: true };
}

export function validateV4SubjectState(state: V4SubjectState): boolean {
  return state.subjectId.length > 0 && state.subjectKind.length > 0 && state.evidence.every((item) => item.id.length > 0 && item.source.length > 0) && (state.dependencies ?? []).every((dependency) => dependency.from in (state.dimensions as object) || dependency.to in (state.dimensions as object));
}

export function deriveV4ActiveTopology(input: Omit<V4ActiveTopology, "derivedOnly" | "humanReviewRequired">): V4ActiveTopology {
  return { ...input, derivedOnly: true, humanReviewRequired: true };
}

export function evaluateV4DependencyGraph(graph: V4DependencyGraph): V4CapabilityResult {
  const essentialUnresolved = graph.nodes.some((node) => node.necessity === "ESSENTIAL" && node.status === "UNKNOWN");
  const essentialFailed = graph.nodes.some((node) => node.necessity === "ESSENTIAL" && node.status === "UNSATISFIED");
  const validAlternate = graph.orGroups.some((group) => group.length > 0 && group.some((id) => graph.nodes.find((node) => node.id === id)?.status === "SATISFIED"));
  if (essentialUnresolved && !validAlternate) return "UNKNOWN";
  if (essentialFailed && !validAlternate) return "UNSATISFIED";
  if (graph.nodes.some((node) => node.status === "PARTIAL")) return "PARTIAL";
  return "SATISFIED";
}

export function validateV4ConcurrentDemand(demand: V4ConcurrentDemand): boolean {
  return demand.activityIds.length > 0 && (demand.sharedResourceIds.length > 0 || demand.sharedSegmentIds.length > 0) && demand.reason.length > 0 && demand.evidence.every((item) => item.id.length > 0 && item.source.length > 0);
}

export function evaluateV4Redundancy(input: Omit<V4RedundancyAssessment, "result">): V4RedundancyAssessment {
  const unknown = input.independentFailureDomains === "UNKNOWN" || input.distributionPathsIndependent === "UNKNOWN" || input.plannedMaintenanceSupported === "UNKNOWN" || input.singleFailureSupported === "UNKNOWN" || input.endurance === "UNKNOWN";
  const sufficient = input.alternatePathIds.length > 0 && Boolean(input.remainingCapacity?.unit) && input.independentFailureDomains === true && input.distributionPathsIndependent === true && input.plannedMaintenanceSupported === true && input.singleFailureSupported === true && input.endurance !== "UNKNOWN";
  return { ...input, result: unknown ? "UNKNOWN" : sufficient ? "SATISFIED" : "PARTIAL", humanReviewRequired: true };
}

export function validateV4Coverage(record: V4CoverageRecord): boolean {
  return record.subjectId.length > 0 && record.claim.length > 0 && record.scope.length > 0 && record.humanReviewRequired && record.evidence.every((item) => item.id.length > 0 && item.source.length > 0);
}

export function validateV4KnowledgeUnit(unit: V4KnowledgeUnit): boolean {
  return unit.humanReviewRequired && unit.sourceBasis.length > 0 && unit.limits.length > 0 && unit.lastReviewed.length > 0;
}

export function summarizeV4Delta() {
  return { version: ARKI_V4_RESEARCH_DELTA.version, knowledgeUnits: ARKI_V4_KNOWLEDGE_UNITS.length, invariantCount: ARKI_V4_RESEARCH_DELTA.invariantCount, sourceCount: ARKI_V4_RESEARCH_DELTA.sourceIds.length, researchOnlyAuthority: true, humanAuthority: true, noParallelEngine: true, scopeCount: ARKI_V4_RESEARCH_DELTA.researchScope.length };
}
