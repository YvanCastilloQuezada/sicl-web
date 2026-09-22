import type { Delta62KnowledgeRecord, Delta62Product, Delta62State } from "./delta62Knowledge";

export const ARLU_KNOWLEDGE_EXCHANGE_VERSION = "AR-LU-KNOWLEDGE-EXCHANGE-1.0" as const;
export type KnowledgeExchangeTarget = "ARKI" | "LUCA" | "BOTH";
export type KnowledgeExchangeStatus = "READY_FOR_TRANSFER" | "PENDING_REVIEW" | "QUARANTINED" | "REVOKE_PENDING_REVIEW" | "REJECTED";
export type KnowledgeExchangeNotification = { notificationId: string; source: Delta62Product; target: KnowledgeExchangeTarget; recordId: string; title: string; domains: string[]; message: string; status: KnowledgeExchangeStatus; sourceCommit: string; sourceFile: string; createdAt: string };

const ARKI_INTEREST = new Set(["GIS", "GEOSPATIAL", "ARCHITECTURE", "LANDSCAPE", "URBANISM", "BIM", "COST", "COMPUTER_VISION", "DEVICE_INTEROP"]);
const LUCA_INTEREST = new Set(["GIS", "GEOSPATIAL", "ARCHITECTURE", "LANDSCAPE", "TOURISM", "URBANISM", "COMPUTER_VISION", "DEVICE_INTEROP", "MARKETING"]);
const APPROVED_STATES = new Set<Delta62State>(["VALIDATED", "CANONICAL", "FROZEN"]);

export function classifyKnowledgeInterest(input: { source: Delta62Product; domains: string[] }): KnowledgeExchangeTarget {
  const normalized = input.domains.map((domain) => domain.trim().toUpperCase());
  const forArki = normalized.some((domain) => ARKI_INTEREST.has(domain));
  const forLuca = normalized.some((domain) => LUCA_INTEREST.has(domain));
  if (forArki && forLuca) return "BOTH";
  if (forArki) return "ARKI";
  if (forLuca) return "LUCA";
  return input.source === "ARKI" ? "ARKI" : "LUCA";
}

export function prepareKnowledgeExchange(record: Delta62KnowledgeRecord, input: { now?: Date; targetOverride?: KnowledgeExchangeTarget } = {}): KnowledgeExchangeNotification {
  const target = input.targetOverride ?? classifyKnowledgeInterest({ source: record.product, domains: [record.domain] });
  const approved = APPROVED_STATES.has(record.state);
  const status: KnowledgeExchangeStatus = record.state === "REJECTED" ? "REJECTED" : approved ? "READY_FOR_TRANSFER" : "PENDING_REVIEW";
  const now = input.now ?? new Date();
  return { notificationId: `KX-${record.recordId}-${now.getTime()}`, source: record.product, target, recordId: record.recordId, title: record.title, domains: [record.domain], message: approved ? `Conocimiento aprobado disponible para ${target}: ${record.title}` : `Nuevo conocimiento pendiente de aprobación: ${record.title}`, status, sourceCommit: record.sourceCommit, sourceFile: record.sourceFile, createdAt: now.toISOString() };
}

export function reconcileKnowledgeDisagreement(input: { recordId: string; source: Delta62Product; disagreement: boolean; humanReview: boolean }) {
  if (!input.disagreement) return { action: "KEEP" as const, status: "READY_FOR_TRANSFER" as const };
  if (!input.humanReview) return { action: "QUARANTINE" as const, status: "REVOKE_PENDING_REVIEW" as const, reason: "DISAGREEMENT_REQUIRES_HUMAN_REVIEW" };
  return { action: "QUARANTINE" as const, status: "QUARANTINED" as const, reason: "REVIEW_DECIDES_KEEP_REVISE_OR_REJECT" };
}

export function canTransferKnowledge(notification: KnowledgeExchangeNotification, targetTestsPass: boolean) {
  if (notification.status !== "READY_FOR_TRANSFER") return { allowed: false as const, reason: "SOURCE_APPROVAL_REQUIRED" };
  if (!notification.sourceCommit || !notification.sourceFile) return { allowed: false as const, reason: "PROVENANCE_REQUIRED" };
  if (!targetTestsPass) return { allowed: false as const, reason: "TARGET_VALIDATION_REQUIRED" };
  return { allowed: true as const, reason: "TRANSFER_READY" };
}

export function knowledgeExchangeSummary() {
  return { version: ARLU_KNOWLEDGE_EXCHANGE_VERSION, approvedStates: Array.from(APPROVED_STATES), automaticDeletion: false as const, disagreementPolicy: "QUARANTINE_AND_HUMAN_REVIEW" as const, notifications: true as const };
}
