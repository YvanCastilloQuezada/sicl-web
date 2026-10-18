import { executeArkiUnifiedMotor, type UnifiedMotorInput, type UnifiedMotorResult } from "./arkiUnifiedMotor";
import { buildSemanticBimRepresentation, calculateLifecycleBudget, type BimElement, type CostLine } from "./arkiProjectLifecycle";

export type WaveStatus = "PASS_WITH_BOUNDS" | "PARTIAL" | "READY_FOR_REVIEW" | "SPECIALIST_REQUIRED" | "BLOCKED" | "NOT_IMPLEMENTED";
export type EvidenceValue = { id: string; domain: string; value: string | number | boolean; unit?: string; sourceIds: string[]; method: string; status: "FACT" | "ESTIMATE" | "UNKNOWN"; humanReviewRequired: true };

export type Wave2Input = {
  measurements: EvidenceValue[];
  peakDemand?: number;
  accessibleRoutes?: Array<{ id: string; widthM: number; slopePercent?: number; sourceIds: string[] }>;
  evacuation?: Array<{ id: string; capacity: number; travelDistanceM: number; sourceIds: string[] }>;
  climate?: Array<{ id: string; metric: string; value: number; unit: string; sourceIds: string[] }>;
};
export type Wave2Result = { status: WaveStatus; checks: Array<{ domain: string; status: "PASS" | "PARTIAL" | "UNKNOWN"; reason: string; evidenceIds: string[] }>; unknowns: string[]; humanReviewRequired: true };

export function evaluateWave2(input: Wave2Input): Wave2Result {
  const byDomain = (domain: string) => input.measurements.filter((item) => item.domain === domain);
  const checks: Wave2Result["checks"] = [];
  const unknowns: string[] = [];
  const add = (domain: string, items: EvidenceValue[], reason: string) => {
    const status = items.length && items.every((item) => item.status === "FACT") ? "PASS" : items.length ? "PARTIAL" : "UNKNOWN";
    if (status !== "PASS") unknowns.push(`${domain}: verified measurements and method required`);
    checks.push({ domain, status, reason, evidenceIds: items.map((item) => item.id) });
  };
  add("CAPACITY_AND_AREA", byDomain("CAPACITY") .concat(byDomain("AREA")), "Capacity and area require measured inputs; no silent compression.");
  add("ACCESSIBILITY", [...byDomain("ACCESSIBILITY"), ...(input.accessibleRoutes ?? []).map((route) => ({ id: route.id, domain: "ACCESSIBILITY", value: route.widthM, unit: "m", sourceIds: route.sourceIds, method: "route measurement", status: "ESTIMATE" as const, humanReviewRequired: true as const }))], "Routes are evidence-bounded and require applicable standards review.");
  add("EVACUATION", [...byDomain("EVACUATION"), ...(input.evacuation ?? []).map((item) => ({ id: item.id, domain: "EVACUATION", value: item.travelDistanceM, unit: "m", sourceIds: item.sourceIds, method: "travel path measurement", status: "ESTIMATE" as const, humanReviewRequired: true as const }))], "Egress is not certified by a label alone.");
  add("CLIMATE_AND_COMFORT", byDomain("CLIMATE"), "Climate and comfort require location-specific measured or sourced data.");
  const status = checks.some((check) => check.status === "UNKNOWN") ? "PARTIAL" : checks.some((check) => check.status === "PARTIAL") ? "READY_FOR_REVIEW" : "PASS_WITH_BOUNDS";
  return { status, checks, unknowns, humanReviewRequired: true };
}

export type Wave3Result = { status: WaveStatus; engineering: { structure: "SPECIALIST_REQUIRED"; mep: "SPECIALIST_REQUIRED"; fire: "SPECIALIST_REQUIRED"; mobility: "SPECIALIST_REQUIRED" }; budget?: ReturnType<typeof calculateLifecycleBudget>; bim: ReturnType<typeof buildSemanticBimRepresentation>; quantities: { status: "INPUT_REQUIRED"; sourceIds: string[] }; schedule: { status: "CONCEPTUAL"; phases: string[] }; maintenance: { status: "CONCEPTUAL"; unknowns: string[] }; humanReviewRequired: true };
export function executeWave3(costLines: CostLine[] = [], elements: BimElement[] = []): Wave3Result {
  const budget = costLines.length ? calculateLifecycleBudget(costLines) : undefined;
  return { status: "SPECIALIST_REQUIRED", engineering: { structure: "SPECIALIST_REQUIRED", mep: "SPECIALIST_REQUIRED", fire: "SPECIALIST_REQUIRED", mobility: "SPECIALIST_REQUIRED" }, budget, bim: buildSemanticBimRepresentation(elements), quantities: { status: "INPUT_REQUIRED", sourceIds: [] }, schedule: { status: "CONCEPTUAL", phases: ["design", "procurement", "construction", "commissioning", "operation"] }, maintenance: { status: "CONCEPTUAL", unknowns: ["asset register", "maintenance intervals", "replacement costs", "operator procedures"] }, humanReviewRequired: true };
}

export type Wave4Input = { jurisdiction: string; regulatorySources: Array<{ id: string; jurisdiction: string; version: string; sourceUrl: string; retrievedAt: string; status: "OFFICIAL" | "UNVERIFIED" }>; users: Array<{ id: string; role: "OWNER" | "ARCHITECT" | "SPECIALIST" | "REVIEWER" }>; coreEndpointConfigured: boolean };
export type Wave4Result = { status: WaveStatus; core: { configured: boolean; persistence: "REMOTE_CANONICAL" | "LOCAL_ONLY" | "UNKNOWN" }; roles: Wave4Input["users"]; regulatory: { sources: number; unverified: string[]; versioned: true }; collaboration: { auditTrail: true; multiUserPersistence: "DEMONSTRATED" | "NOT_DEMONSTRATED" }; humanReviewRequired: true };
export function executeWave4(input: Wave4Input): Wave4Result {
  const unverified = input.regulatorySources.filter((source) => source.status !== "OFFICIAL").map((source) => source.id);
  const configured = input.coreEndpointConfigured;
  return { status: configured && !unverified.length ? "READY_FOR_REVIEW" : configured ? "PARTIAL" : "BLOCKED", core: { configured, persistence: configured ? "REMOTE_CANONICAL" : "LOCAL_ONLY" }, roles: input.users, regulatory: { sources: input.regulatorySources.length, unverified, versioned: true }, collaboration: { auditTrail: true, multiUserPersistence: configured ? "DEMONSTRATED" : "NOT_DEMONSTRATED" }, humanReviewRequired: true };
}

export type Wave5Result = { status: WaveStatus; agents: Array<{ id: string; domain: string; authority: "PROPOSE" | "CHECK" | "RETRIEVE"; humanGate: string }>; academy: { lessonTemplate: string; assessment: "RANDOMIZED_REVIEW_REQUIRED"; profiles: string[] }; livingBook: { versioned: true; publicBoundary: "FILTERED"; internalContent: "RESTRICTED" }; research: { learningCandidate: "REGISTERED_NOT_PROMOTED"; regressionCase: "REQUIRED" }; humanReviewRequired: true };
export function executeWave5(): Wave5Result {
  return { status: "READY_FOR_REVIEW", agents: [{ id: "AGENT-BRIEF", domain: "brief sufficiency", authority: "CHECK", humanGate: "architect review" }, { id: "AGENT-PARTI", domain: "parti alternatives", authority: "PROPOSE", humanGate: "architect selection" }, { id: "AGENT-REGULATION", domain: "jurisdiction retrieval", authority: "RETRIEVE", humanGate: "licensed local review" }, { id: "AGENT-COST", domain: "cost evidence", authority: "CHECK", humanGate: "cost specialist" }], academy: { lessonTemplate: "CONTEXT → PRINCIPLE → EXAMPLE → EXERCISE → RANDOM REVIEW → HUMAN FEEDBACK", assessment: "RANDOMIZED_REVIEW_REQUIRED", profiles: ["JUNIOR", "SENIOR", "MASTER", "CRAZY"] }, livingBook: { versioned: true, publicBoundary: "FILTERED", internalContent: "RESTRICTED" }, research: { learningCandidate: "REGISTERED_NOT_PROMOTED", regressionCase: "REQUIRED" }, humanReviewRequired: true };
}

export type CorporationWavesInput = UnifiedMotorInput & { wave2?: Wave2Input; costLines?: CostLine[]; bimElements?: BimElement[]; wave4: Wave4Input };
export type CorporationWavesResult = { motor: UnifiedMotorResult; wave2: Wave2Result; wave3: Wave3Result; wave4: Wave4Result; wave5: Wave5Result; status: "CORPORATION_WAVES_PARTIAL_WITH_BOUNDS"; humanAuthority: "FINAL" };
export function executeCorporationWaves(input: CorporationWavesInput): CorporationWavesResult {
  const motor = executeArkiUnifiedMotor(input);
  return { motor, wave2: evaluateWave2(input.wave2 ?? { measurements: [] }), wave3: executeWave3(input.costLines, input.bimElements), wave4: executeWave4(input.wave4), wave5: executeWave5(), status: "CORPORATION_WAVES_PARTIAL_WITH_BOUNDS", humanAuthority: "FINAL" };
}
