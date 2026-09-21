export type SelfCareProposalStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type SelfCareProposalKind = "REPAIR" | "IMPROVEMENT";
export type SelfCareProposal = { id: string; kind: SelfCareProposalKind; title: string; summary: string; risk: "LOW" | "MEDIUM" | "HIGH"; files: string[]; expectedTests: string[]; rollback: string; status: SelfCareProposalStatus; createdAt: string; decidedAt?: string; decidedBy?: string; decisionRationale?: string };
const proposals: SelfCareProposal[] = [];
const MAX_PROPOSALS = 100;

export function listSelfCareProposals() { return { schema: "ARKI-SELF-CARE-PROPOSALS-1.0", persistence: "IN_MEMORY_REVIEW_QUEUE", humanAuthorityRequired: true as const, proposals: [...proposals].reverse() }; }
export function stageSelfCareProposal(input: Omit<SelfCareProposal, "id" | "status" | "createdAt">) { const proposal: SelfCareProposal = { ...input, id: `SCP-${crypto.randomUUID()}`, status: "PENDING_REVIEW", createdAt: new Date().toISOString() }; proposals.push(proposal); if (proposals.length > MAX_PROPOSALS) proposals.shift(); return proposal; }
export function decideSelfCareProposal(input: { proposalId: string; decision: "APPROVED" | "REJECTED"; rationale: string; actorId: string }) { const proposal = proposals.find((item) => item.id === input.proposalId); if (!proposal) throw new Error("SELF_CARE_PROPOSAL_NOT_FOUND"); if (proposal.status !== "PENDING_REVIEW") throw new Error("SELF_CARE_PROPOSAL_ALREADY_DECIDED"); proposal.status = input.decision; proposal.decidedAt = new Date().toISOString(); proposal.decidedBy = input.actorId; proposal.decisionRationale = input.rationale; return { ...proposal, execution: input.decision === "APPROVED" ? "APPROVED_FOR_SEPARATE_EXECUTION_GATE" : "NOT_AUTHORIZED" };
}
