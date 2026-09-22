export const ARKI_PROJECT_STATE_VERSION = "ARKI-PROJECT-STATE-1.0" as const;

export type ProjectStateStatus = "DRAFT" | "PROPOSED" | "APPROVED" | "REJECTED" | "FROZEN";
export type ProposalStatus = "PENDING_HUMAN_REVIEW" | "APPROVED" | "REJECTED" | "FROZEN";

export type ArkiProjectState = {
  stateId: string;
  projectId: string;
  version: number;
  status: ProjectStateStatus;
  parameters: Record<string, unknown>;
  metrics: Record<string, unknown>;
  provenance: string[];
  unknowns: string[];
  createdAt: string;
  updatedAt: string;
  humanApprovalRequired: true;
};

export type ArkiChangeProposal = {
  proposalId: string;
  stateId: string;
  previousParameters: Record<string, unknown>;
  nextParameters: Record<string, unknown>;
  reason: string;
  origin: "SYSTEM" | "AI_PROPOSED" | "HUMAN";
  risk: "LOW" | "MEDIUM" | "HIGH";
  status: ProposalStatus;
  requiredRole: "OWNER" | "PROFESSIONAL";
  createdAt: string;
};

export function createProjectState(input: { projectId: string; parameters: Record<string, unknown>; metrics?: Record<string, unknown>; provenance?: string[]; unknowns?: string[]; now?: string }): ArkiProjectState {
  const now = input.now ?? new Date().toISOString();
  return { stateId: `PS-${input.projectId}-${Date.parse(now)}`, projectId: input.projectId, version: 1, status: "DRAFT", parameters: { ...input.parameters }, metrics: { ...(input.metrics ?? {}) }, provenance: [...(input.provenance ?? [])], unknowns: [...(input.unknowns ?? [])], createdAt: now, updatedAt: now, humanApprovalRequired: true };
}

export function proposeProjectChange(state: ArkiProjectState, nextParameters: Record<string, unknown>, reason: string, origin: ArkiChangeProposal["origin"] = "AI_PROPOSED"): ArkiChangeProposal {
  if (!reason.trim()) throw new Error("A change proposal requires a reason");
  return { proposalId: `PROP-${state.stateId}-${state.version + 1}`, stateId: state.stateId, previousParameters: { ...state.parameters }, nextParameters: { ...nextParameters }, reason, origin, risk: state.unknowns.length ? "HIGH" : "MEDIUM", status: "PENDING_HUMAN_REVIEW", requiredRole: "OWNER", createdAt: new Date().toISOString() };
}

export function applyApprovedProjectChange(state: ArkiProjectState, proposal: ArkiChangeProposal, reviewerRole: "OWNER" | "PROFESSIONAL", reviewNote: string): ArkiProjectState {
  if (proposal.status !== "APPROVED") throw new Error("Only an approved proposal can mutate Project State");
  if (reviewerRole !== proposal.requiredRole && reviewerRole !== "OWNER") throw new Error("Required human authority is missing");
  if (!reviewNote.trim()) throw new Error("A human review note is required");
  const now = new Date().toISOString();
  return { ...state, version: state.version + 1, status: "APPROVED", parameters: { ...proposal.nextParameters }, provenance: [...state.provenance, `HUMAN_REVIEW:${proposal.proposalId}`], updatedAt: now };
}

export function projectStateContract() {
  return { version: ARKI_PROJECT_STATE_VERSION, persistence: "SICL_PROJECT_SNAPSHOT", mutation: "OPTIMISTIC_VERSIONED_COMMIT", humanApprovalRequired: true, automaticPromotion: false, automaticDeletion: false, statuses: ["DRAFT", "PROPOSED", "APPROVED", "REJECTED", "FROZEN"] as const };
}
