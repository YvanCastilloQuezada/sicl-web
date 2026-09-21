import { createHash } from "node:crypto";

export type ResearchStage = "DISCOVERED" | "ABSTRACTED" | "STAGED_FOR_EXCEL" | "HUMAN_CONFIRMED" | "REJECTED" | "UNKNOWN";
export type ResearchEpistemicStatus = "SOURCE_METADATA" | "CANDIDATE_KNOWLEDGE" | "VOCABULARY_CANDIDATE" | "UNKNOWN";
export type ResearchRights = "PUBLIC_METADATA_ONLY" | "OPEN_LICENSE" | "COPYRIGHTED" | "UNKNOWN";
export type ReviewDecision = "PENDING" | "APPROVED_FOR_CORE" | "REJECTED";

const DEFAULT_LEASE_MINUTES = 10;
const MAX_EXPLICIT_EXTENSION_MINUTES = 120;

export const ARKI_RESEARCH_SUPERPOWER = {
  version: "ARKI-WEB-RESEARCH-1.2",
  mode: "DEFENSIVE_EPISTEMIC_RESEARCH",
  truthRule: "WEB_SOURCE_NEVER_BECOMES_FACT_WITHOUT_HUMAN_VALIDATION",
  sourceTextPolicy: "METADATA_AND_ABSTRACT_ONLY",
  defaultWriteTarget: "EXCEL_REVIEW_STAGING_NOT_CANONICAL_CORE",
  maxPagesPerCycle: 30,
  defaultCadence: "DAILY_OWNER_AUTHORIZED",
  preferredSourceFamily: "INTERNET_ARCHIVE",
  preferredSourceHost: "archive.org",
  internetAccess: "LEASE_REQUIRED_FAIL_CLOSED",
  defaultLeaseMinutes: DEFAULT_LEASE_MINUTES,
  extensionRequiresExplicitOwnerAuthorization: true,
  rightsRule: "ARCHIVE_ORG_ACCESS_DOES_NOT_AUTOMATICALLY_PROVE_PUBLIC_DOMAIN_OR_OPEN_LICENSE",
  allowedSourceFamilies: ["INTERNET_ARCHIVE", "ARCHITECTURE_PUBLISHERS", "PRITZKER_PRIZE", "PROFESSIONAL_INSTITUTIONS", "UNIVERSITIES", "OFFICIAL_ARCHITECT_PAGES", "PUBLIC_REGULATORY_SOURCES"],
  invariants: ["NO_UNBOUNDED_CRAWLING", "NO_COPYRIGHTED_SOURCE_REPRODUCTION", "NO_AUTOMATIC_FACT_PROMOTION", "NO_SILENT_EXCEL_CANONIZATION", "UNKNOWN_IS_PRESERVED", "EVERY_CANDIDATE_HAS_PROVENANCE", "HUMAN_REVIEW_FINAL", "OWNER_AUTHORITY_ONLY", "INTERNET_LEASE_EXPIRES_AUTOMATICALLY", "NO_RESEARCH_WITHOUT_ACTIVE_LEASE"],
} as const;

const ALLOWED_HOST_SUFFIXES = ["archive.org", "archdaily.com", "dezeen.com", "worldarchitecture.org", "pritzkerprize.com", "architecture.com", "nobelprize.org", "un.org", "unesco.org", "edu", "gob.pe"];
const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

type ResearchInternetLease = {
  leaseId: string;
  grantedAt: string;
  expiresAt: string;
  durationMinutes: number;
  explicitlyExtended: boolean;
  authority: "OWNER_HUMAN_CONFIRMED";
};

let activeLease: ResearchInternetLease | null = null;

export function grantResearchInternetLease(input: { ownerAuthorized: boolean; durationMinutes?: number; explicitlyExtended?: boolean }): ResearchInternetLease {
  if (!input.ownerAuthorized) throw new Error("OWNER_HUMAN_AUTHORITY_REQUIRED");
  const durationMinutes = input.durationMinutes ?? DEFAULT_LEASE_MINUTES;
  if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > MAX_EXPLICIT_EXTENSION_MINUTES) throw new Error("RESEARCH_LEASE_DURATION_INVALID");
  const explicitlyExtended = durationMinutes > DEFAULT_LEASE_MINUTES;
  if (explicitlyExtended && input.explicitlyExtended !== true) throw new Error("EXPLICIT_OWNER_EXTENSION_REQUIRED");
  const grantedAt = new Date();
  const expiresAt = new Date(grantedAt.getTime() + durationMinutes * 60_000);
  activeLease = { leaseId: `RIL-${crypto.randomUUID()}`, grantedAt: grantedAt.toISOString(), expiresAt: expiresAt.toISOString(), durationMinutes, explicitlyExtended, authority: "OWNER_HUMAN_CONFIRMED" };
  return activeLease;
}

export function closeResearchInternetAccess(): { closed: true; closedAt: string } {
  activeLease = null;
  return { closed: true, closedAt: new Date().toISOString() };
}

export function researchInternetLeaseStatus() {
  if (!activeLease) return { active: false as const, reason: "NO_ACTIVE_RESEARCH_LEASE" as const, defaultLeaseMinutes: DEFAULT_LEASE_MINUTES };
  if (Date.now() >= Date.parse(activeLease.expiresAt)) {
    activeLease = null;
    return { active: false as const, reason: "RESEARCH_LEASE_EXPIRED" as const, defaultLeaseMinutes: DEFAULT_LEASE_MINUTES };
  }
  return { active: true as const, lease: activeLease, remainingSeconds: Math.max(0, Math.floor((Date.parse(activeLease.expiresAt) - Date.now()) / 1000)) };
}

function requireActiveResearchInternetLease() {
  const status = researchInternetLeaseStatus();
  if (!status.active) throw new Error(status.reason);
  return status.lease;
}

export type ResearchCandidate = ReturnType<typeof buildExcelReviewRow> & {
  candidateId: string;
  reviewDecision: ReviewDecision;
  correctedAbstract?: string;
  correctedTerms?: string[];
  updatedAt: string;
};
const candidateStore = new Map<string, ResearchCandidate>();

function hostnameFromUrl(rawUrl: string): string {
  let url: URL;
  try { url = new URL(rawUrl); } catch { throw new Error("RESEARCH_URL_INVALID"); }
  if (url.protocol !== "https:") throw new Error("RESEARCH_URL_MUST_USE_HTTPS");
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(hostname) || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) throw new Error("RESEARCH_PRIVATE_OR_IP_HOST_BLOCKED");
  return hostname;
}

export function isAllowedResearchUrl(rawUrl: string): boolean {
  try { const hostname = hostnameFromUrl(rawUrl); return ALLOWED_HOST_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)); } catch { return false; }
}

export function normalizeResearchUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  if (!isAllowedResearchUrl(url.toString())) throw new Error("RESEARCH_DOMAIN_NOT_ALLOWLISTED");
  url.hash = "";
  return url.toString();
}

function htmlMeta(html: string, pattern: RegExp): string | undefined {
  const match = html.match(pattern);
  return match?.[1]?.replace(/\s+/g, " ").trim().slice(0, 500);
}

export async function inspectPublicResearchSource(rawUrl: string, signal?: AbortSignal) {
  const lease = requireActiveResearchInternetLease();
  const url = normalizeResearchUrl(rawUrl);
  const response = await fetch(url, { signal, headers: { "user-agent": "ARKI-Research/1.2 (+metadata-only; lease-enforced)" } });
  if (!response.ok) throw new Error(`RESEARCH_SOURCE_HTTP_${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) throw new Error("RESEARCH_SOURCE_NOT_HTML");
  const html = (await response.text()).slice(0, 1_000_000);
  const title = htmlMeta(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ?? "UNTITLED_SOURCE";
  const description = htmlMeta(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ?? "UNKNOWN";
  const contentHash = createHash("sha256").update(html).digest("hex");
  return { sourceId: `WEB-${contentHash.slice(0, 16).toUpperCase()}`, url, host: new URL(url).hostname, title, description, contentHash, rights: "UNKNOWN" as const, stage: "DISCOVERED" as const, epistemicStatus: "SOURCE_METADATA" as const, sourceTextStored: false as const, provenance: `PUBLIC_WEB_METADATA:${url}`, leaseId: lease.leaseId };
}

export function buildExcelReviewRow(input: { sourceId: string; title: string; author?: string; url: string; topic: string; abstract: string; terms: string[]; rights?: ResearchRights }) {
  if (!input.sourceId || !input.title || !input.url) throw new Error("RESEARCH_EXCEL_ROW_REQUIRES_PROVENANCE");
  return { ID: input.sourceId, "AUTOR / INSTITUCIÓN": input.author ?? "UNKNOWN", OBRA: input.title, TIPO: "WEB", TEMA: input.topic || "UNKNOWN", PRIORIDAD: "REVIEW", "ESTADO LECTURA": "ABSTRACT_ONLY", DERECHOS: input.rights ?? "UNKNOWN", DESTINO: "EXCEL_REVIEW_STAGING", NOTAS: `URL=${input.url} | ABSTRACT=${input.abstract.slice(0, 800)} | TERMS=${input.terms.join(", ")} | EPISTEMIC=CANDIDATE_KNOWLEDGE | HUMAN_REVIEW_REQUIRED=YES` };
}

export function stageResearchCandidate(input: Parameters<typeof buildExcelReviewRow>[0]): ResearchCandidate {
  const candidate = { ...buildExcelReviewRow(input), candidateId: `RC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, reviewDecision: "PENDING" as const, updatedAt: new Date().toISOString() };
  candidateStore.set(candidate.candidateId, candidate);
  return candidate;
}
export function listResearchCandidates(): ResearchCandidate[] { return Array.from(candidateStore.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }
export function reviewResearchCandidate(candidateId: string, decision: ReviewDecision, correction?: { abstract?: string; terms?: string[] }): ResearchCandidate {
  const current = candidateStore.get(candidateId);
  if (!current) throw new Error("RESEARCH_CANDIDATE_NOT_FOUND");
  const next = { ...current, reviewDecision: decision, correctedAbstract: correction?.abstract, correctedTerms: correction?.terms, updatedAt: new Date().toISOString() };
  candidateStore.set(candidateId, next);
  return next;
}

export function authorizeResearchWrite(input: { humanApproved: boolean; rights: ResearchRights; target: "EXCEL_REVIEW_STAGING" | "CANONICAL_CORE" }) {
  if (input.target === "CANONICAL_CORE") return { allowed: false as const, reason: "CANONICAL_CORE_REQUIRES_SEPARATE_HUMAN_VALIDATION" };
  if (!input.humanApproved) return { allowed: false as const, reason: "HUMAN_REVIEW_REQUIRED" };
  if (input.rights === "COPYRIGHTED") return { allowed: false as const, reason: "COPYRIGHTED_SOURCE_NOT_REPRODUCED" };
  return { allowed: true as const, reason: "STAGED_METADATA_ONLY" };
}

export function researchCyclePolicy() {
  return { ...ARKI_RESEARCH_SUPERPOWER, scheduleEnabled: true, authority: "OWNER_HUMAN_ONLY", schedule: "0 3 * * * UTC", reason: "Daily discovery is bounded to 30 sources, requires an active ten-minute lease, and never promotes to Core automatically.", recommendedFlow: ["OWNER_GRANTS_10_MINUTE_LEASE", "PREFER_ARCHIVE_ORG", "FETCH_METADATA", "ABSTRACT", "EXTRACT_TERMS", "STAGE_EXCEL_ROW", "AUTO_CLOSE_LEASE", "HUMAN_REVIEW", "OPTIONAL_CORE_PROMOTION"] } as const;
}

export const RESEARCH_LEASE_LIMITS = { defaultMinutes: DEFAULT_LEASE_MINUTES, maxExplicitExtensionMinutes: MAX_EXPLICIT_EXTENSION_MINUTES, archiveRightsMustBeVerified: true } as const;
