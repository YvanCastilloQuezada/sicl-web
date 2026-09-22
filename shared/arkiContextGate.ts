export const ARKI_CONTEXT_GATE_NAME = "A★" as const;
export const ARKI_CONTEXT_GATE_VERSION = "ARKI-CONTEXT-GATE-1.0" as const;
export const ARKI_CONTEXT_QR_KINDS = ["EXPERIENCE_QR", "CONTROL_QR"] as const;
export type ArkiContextQrKind = (typeof ARKI_CONTEXT_QR_KINDS)[number];

export function buildArkiContextQrPayload(input: { baseUrl: string; route: string; kind: ArkiContextQrKind; ownerId?: string; ttlMinutes?: number; now?: Date }) {
  const now = input.now ?? new Date();
  const ttlMinutes = Math.min(Math.max(Math.trunc(input.ttlMinutes ?? 10), 1), 60);
  const expiresAt = new Date(now.getTime() + ttlMinutes * 60_000).toISOString();
  const nonce = typeof globalThis.crypto?.randomUUID === "function" ? globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 16).toUpperCase() : Math.random().toString(36).slice(2, 18).toUpperCase();
  const contextId = `AG-${nonce}`;
  const url = new URL(input.route, input.baseUrl);
  url.searchParams.set("contextId", contextId);
  url.searchParams.set("qrKind", input.kind);
  url.searchParams.set("expiresAt", expiresAt);
  url.searchParams.set("coreAccess", "NONE");
  return { version: ARKI_CONTEXT_GATE_VERSION, contextId, kind: input.kind, url: url.toString(), expiresAt, ttlMinutes, ownerId: input.ownerId ?? "ANONYMOUS", coreAccess: "NONE" as const, credentialsIncluded: false as const, revocable: true as const };
}

export function isArkiContextQrExpired(payload: { expiresAt: string }, now = new Date()) {
  return Date.parse(payload.expiresAt) <= now.getTime();
}

export function classifyArkiQrAction(kind: ArkiContextQrKind) {
  return kind === "EXPERIENCE_QR" ? "OPEN_EXPERIENCE" as const : "PREPARE_CONTROLLED_PAIRING" as const;
}
