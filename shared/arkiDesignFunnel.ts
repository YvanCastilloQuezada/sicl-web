export const ARKI_DESIGN_FUNNEL_VERSION = "ARKI-PREDICTIVE-ARCHITECTURE-001.S1" as const;
export type FunnelStage = "GENERATED" | "SCREENED" | "SURVIVOR" | "DESIGN_EXPLORER_16" | "FINALIST_4" | "SELECTED_FOR_DEVELOPMENT" | "DEVELOPMENT_IN_PROGRESS" | "BLOCKED" | "RETURNED_TO_FINALISTS" | "ARCHIVED" | "SUPERSEDED";
export type HumanWaitState = "NONE" | "AWAITING_16_TO_4_SELECTION" | "AWAITING_4_TO_1_SELECTION";
export type CandidateStatus = "ELIGIBLE" | "UNKNOWN" | "FAILED";
export type ComparisonMode = "PREVIEW" | "PLAN" | "3D" | "ELEVATION" | "SECTION" | "PROGRAM" | "CIRCULATION" | "ENERGY" | "DAYLIGHT" | "STRUCTURE" | "COST" | "TECHNICAL";
export type DesignCandidate = { id: string; projectId: string; generationId: string; stage: FunnelStage; status: CandidateStatus; title: string; strategy: string; preview: string; metrics: Record<string, number | string>; evidence: string[]; unknowns: string[]; failureReasons: string[]; provenance: string[] };
export type HumanDesignSelectionEvent = { eventId: string; type: "HUMAN_DESIGN_SELECTION"; projectId: string; explorationId: string; generationId: string; selectionStage: "16_TO_4" | "4_TO_1"; availableCandidateIds: string[]; selectedCandidateIds: string[]; nonSelectedCandidateIds: string[]; humanActor: string; timestamp: string; optionalReason?: string; evidenceRefs: string[]; uiContext: string };
export type FunnelEvent = HumanDesignSelectionEvent | { eventId: string; type: "DEEP_EVALUATION_STARTED" | "DEEP_EVALUATION_COMPLETED" | "RETURN_TO_FINAL_FOUR" | "CANDIDATE_BLOCKED" | "NEW_GENERATION_REQUESTED"; projectId: string; candidateIds: string[]; timestamp: string; evidenceRefs: string[]; reason?: string };
export type DesignFunnelState = { version: typeof ARKI_DESIGN_FUNNEL_VERSION; projectId: string; explorationId: string; generationId: string; stage: FunnelStage; waitState: HumanWaitState; candidates: DesignCandidate[]; events: FunnelEvent[]; comparisonMode: ComparisonMode; deepEvaluation: Record<string, { status: "NOT_EVALUATED" | "RUNNING" | "READY" | "BLOCKED"; findings: string[]; unknowns: string[] }>; selectedCandidateId?: string; explicitHumanAuthority: true };
export const FUNNEL_LIMITS = { explorer: 16, finalists: 4, selected: 1 } as const;
const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function createDesignFunnel(input: { projectId: string; explorationId?: string; generationId?: string; candidates: DesignCandidate[]; timestamp?: string }): DesignFunnelState {
  if (input.candidates.length !== 16) throw new Error("DESIGN_EXPLORER_REQUIRES_16_CANDIDATES");
  const generationId = input.generationId ?? "GEN-001";
  return { version: ARKI_DESIGN_FUNNEL_VERSION, projectId: input.projectId, explorationId: input.explorationId ?? "EXP-001", generationId, stage: "DESIGN_EXPLORER_16", waitState: "AWAITING_16_TO_4_SELECTION", candidates: input.candidates.map((candidate) => ({ ...candidate, projectId: input.projectId, stage: candidate.stage === "GENERATED" ? "SURVIVOR" : candidate.stage })), events: [], comparisonMode: "PREVIEW", deepEvaluation: {}, explicitHumanAuthority: true };
}
function assertCandidateSet(state: DesignFunnelState, ids: string[], expected: number) {
  if (new Set(ids).size !== ids.length) throw new Error("DUPLICATE_CANDIDATE_SELECTION");
  if (ids.length !== expected) throw new Error(`SELECTION_REQUIRES_${expected}`);
  const selected = state.candidates.filter((candidate) => ids.includes(candidate.id));
  if (selected.length !== ids.length) throw new Error("CANDIDATE_NOT_IN_CURRENT_FUNNEL");
  if (selected.some((candidate) => candidate.projectId !== state.projectId)) throw new Error("CROSS_PROJECT_SELECTION");
  if (selected.some((candidate) => candidate.stage === "ARCHIVED" || candidate.stage === "BLOCKED")) throw new Error("STALE_FINALIST_SELECTION");
}
export function promoteToFinalFour(state: DesignFunnelState, selectedIds: string[], humanActor: string, reason?: string, timestamp = now()): DesignFunnelState {
  if (state.stage !== "DESIGN_EXPLORER_16" || state.waitState !== "AWAITING_16_TO_4_SELECTION") throw new Error("INVALID_16_TO_4_STAGE");
  if (!humanActor.trim()) throw new Error("HUMAN_AUTHORITY_REQUIRED");
  assertCandidateSet(state, selectedIds, 4);
  const available = state.candidates.map((candidate) => candidate.id); const nonSelected = available.filter((candidateId) => !selectedIds.includes(candidateId));
  const event: HumanDesignSelectionEvent = { eventId: id("HSE"), type: "HUMAN_DESIGN_SELECTION", projectId: state.projectId, explorationId: state.explorationId, generationId: state.generationId, selectionStage: "16_TO_4", availableCandidateIds: available, selectedCandidateIds: [...selectedIds], nonSelectedCandidateIds: nonSelected, humanActor, timestamp, ...(reason?.trim() ? { optionalReason: reason.trim() } : {}), evidenceRefs: [`FUNNEL:${state.generationId}`, "HUMAN_SELECTION_EVIDENCE"], uiContext: "DESIGN_EXPLORER_4X4" };
  const candidates = state.candidates.map((candidate) => selectedIds.includes(candidate.id) ? { ...candidate, stage: "FINALIST_4" as const } : { ...candidate, stage: "ARCHIVED" as const });
  const deepEvaluation = Object.fromEntries(selectedIds.map((candidateId) => [candidateId, { status: "RUNNING" as const, findings: [], unknowns: [] }]));
  return { ...state, stage: "FINALIST_4", waitState: "NONE", candidates, events: [...state.events, event, { eventId: id("EVAL"), type: "DEEP_EVALUATION_STARTED", projectId: state.projectId, candidateIds: selectedIds, timestamp, evidenceRefs: [event.eventId] }], deepEvaluation };
}
export function completeDeepEvaluation(state: DesignFunnelState, results: Record<string, { status: "READY" | "BLOCKED"; findings?: string[]; unknowns?: string[] }>, timestamp = now()): DesignFunnelState {
  if (state.stage !== "FINALIST_4") throw new Error("FINAL_FOUR_REQUIRED");
  const ids = state.candidates.filter((candidate) => candidate.stage === "FINALIST_4").map((candidate) => candidate.id); const deepEvaluation = { ...state.deepEvaluation };
  const candidates = state.candidates.map((candidate) => { const result = results[candidate.id]; if (!ids.includes(candidate.id) || !result) return candidate; deepEvaluation[candidate.id] = { status: result.status, findings: result.findings ?? [], unknowns: result.unknowns ?? [] }; return result.status === "BLOCKED" ? { ...candidate, stage: "BLOCKED" as const, failureReasons: [...candidate.failureReasons, ...(result.findings ?? [])] } : candidate; });
  return { ...state, waitState: "AWAITING_4_TO_1_SELECTION", candidates, deepEvaluation, events: [...state.events, { eventId: id("EVAL"), type: "DEEP_EVALUATION_COMPLETED", projectId: state.projectId, candidateIds: ids, timestamp, evidenceRefs: [state.events[state.events.length - 1]?.eventId ?? ""] }] };
}
export function selectForDevelopment(state: DesignFunnelState, selectedId: string, humanActor: string, reason?: string, timestamp = now()): DesignFunnelState {
  if ((state.stage !== "FINALIST_4" && state.stage !== "RETURNED_TO_FINALISTS") || state.waitState !== "AWAITING_4_TO_1_SELECTION") throw new Error("INVALID_4_TO_1_STAGE"); if (!humanActor.trim()) throw new Error("HUMAN_AUTHORITY_REQUIRED"); assertCandidateSet(state, [selectedId], 1);
  const available = state.candidates.filter((candidate) => candidate.stage === "FINALIST_4").map((candidate) => candidate.id); const nonSelected = available.filter((candidateId) => candidateId !== selectedId);
  const event: HumanDesignSelectionEvent = { eventId: id("HSE"), type: "HUMAN_DESIGN_SELECTION", projectId: state.projectId, explorationId: state.explorationId, generationId: state.generationId, selectionStage: "4_TO_1", availableCandidateIds: available, selectedCandidateIds: [selectedId], nonSelectedCandidateIds: nonSelected, humanActor, timestamp, ...(reason?.trim() ? { optionalReason: reason.trim() } : {}), evidenceRefs: ["HUMAN_SELECTION_EVIDENCE", "FINAL_FOUR_CONTRACT"], uiContext: "FINAL_FOUR_2X2" };
  const candidates = state.candidates.map((candidate) => candidate.id === selectedId ? { ...candidate, stage: "SELECTED_FOR_DEVELOPMENT" as const } : candidate.stage === "FINALIST_4" ? { ...candidate, stage: "ARCHIVED" as const } : candidate);
  return { ...state, stage: "SELECTED_FOR_DEVELOPMENT", waitState: "NONE", selectedCandidateId: selectedId, candidates, events: [...state.events, event] };
}
export function returnToFinalFour(state: DesignFunnelState, reason: string, timestamp = now()): DesignFunnelState {
  if (state.stage !== "SELECTED_FOR_DEVELOPMENT" && state.stage !== "BLOCKED") throw new Error("RETURN_TO_FINAL_FOUR_NOT_AVAILABLE");
  const selectedEvent = [...state.events].reverse().find((event): event is HumanDesignSelectionEvent => event.type === "HUMAN_DESIGN_SELECTION" && event.selectionStage === "4_TO_1"); if (!selectedEvent) throw new Error("NO_ARCHIVED_FINALISTS");
  const candidates = state.candidates.map((candidate) => selectedEvent.availableCandidateIds.includes(candidate.id) ? { ...candidate, stage: "FINALIST_4" as const } : candidate); const ids = selectedEvent.availableCandidateIds;
  return { ...state, stage: "RETURNED_TO_FINALISTS", waitState: "AWAITING_4_TO_1_SELECTION", selectedCandidateId: undefined, candidates, events: [...state.events, { eventId: id("RETURN"), type: "RETURN_TO_FINAL_FOUR", projectId: state.projectId, candidateIds: ids, timestamp, reason, evidenceRefs: ["REVERSIBLE_SELECTION"] }] };
}
export function setComparisonMode(state: DesignFunnelState, mode: ComparisonMode): DesignFunnelState { const supported: ComparisonMode[] = ["PREVIEW", "PLAN", "3D", "SECTION", "PROGRAM", "COST", "TECHNICAL"]; if (!supported.includes(mode)) throw new Error("COMPARISON_MODE_NOT_IMPLEMENTED"); return { ...state, comparisonMode: mode }; }
export function requestNewGeneration(state: DesignFunnelState, reason: string, timestamp = now()): DesignFunnelState { if (!reason.trim()) throw new Error("GENERATION_REASON_REQUIRED"); return { ...state, events: [...state.events, { eventId: id("GEN"), type: "NEW_GENERATION_REQUESTED", projectId: state.projectId, candidateIds: state.candidates.map((candidate) => candidate.id), timestamp, reason, evidenceRefs: ["DESIGN_HISTORY"] }] }; }
export function createDemoCandidates(projectId = "DEMO-PROJECT"): DesignCandidate[] { return Array.from({ length: 16 }, (_, index) => ({ id: `A${String(index + 1).padStart(2, "0")}`, projectId, generationId: "GEN-007", stage: "SURVIVOR" as const, status: "ELIGIBLE" as const, title: `Alternativa ${String(index + 1).padStart(2, "0")}`, strategy: ["Patio central", "Espina pública", "Núcleo compacto", "Borde climático"][index % 4], preview: "PREVIEW_LOCAL_CONCEPTUAL", metrics: { area: 12000 + index * 175, efficiency: `${78 + (index % 7) * 2}%`, cost: 100 + index * 3 }, evidence: ["ELIGIBILITY_SCREENING", "FUNCTIONAL_FIT"], unknowns: index % 5 === 0 ? ["Estructura aún no evaluada"] : [], failureReasons: [], provenance: ["GEN-007", `CANDIDATE-${index + 1}`] })); }
