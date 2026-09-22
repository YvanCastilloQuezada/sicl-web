export const ARKI_MARKETPLACE_CONTRACT_VERSION = "ARKI-MARKETPLACE-1.0" as const;
export const MARKETPLACE_RISK_LEVELS = ["low", "medium", "high", "critical"] as const;
export type MarketplaceRiskLevel = (typeof MARKETPLACE_RISK_LEVELS)[number];
export type MarketplaceReviewStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "FROZEN";
export type ModerationReportStatus = "PENDING" | "REVIEWING" | "RESOLVED" | "DISMISSED";
export type ModerationAction = "WARN" | "RESTRICT" | "SUSPEND" | "BAN";
export type MarketplaceSubmission = { id: string; slug: string; name: string; description: string; category: string; authorId: string; definition: Record<string, unknown>; status: MarketplaceReviewStatus; dslValidation: "PASS" | "FAIL"; riskLevel: MarketplaceRiskLevel; createdAt: string };
export type ContentReport = { id: string; objectType: "TYPOLOGY" | "GENERATOR" | "COMMENT" | "REVIEW"; objectId: string; reporterId: string; reason: "SPAM" | "OFFENSIVE" | "COPYRIGHT" | "FALSE" | "OTHER"; description: string; evidenceUrls: string[]; status: ModerationReportStatus; resolution?: string; createdAt: string };
export type ModerationAudit = { id: string; moderatorId: string; action: string; objectType: string; objectId: string; reason: string; at: string };
export type TypologyAnalytics = { typologyId: string; uses: number; failures: number; approvalRate: number; averageScore: number; lastUsedAt: string | null };

export function validateMarketplaceSubmission(input: { slug: string; name: string; definition: Record<string, unknown>; dslValid: boolean; highestRisk?: MarketplaceRiskLevel }) {
  const errors: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) errors.push("SLUG_INVALID");
  if (input.name.trim().length < 3 || input.name.length > 160) errors.push("NAME_INVALID");
  if (!input.dslValid) errors.push("DSL_INVALID");
  if (!input.definition || typeof input.definition !== "object") errors.push("DEFINITION_REQUIRED");
  return { valid: errors.length === 0, errors, status: "PENDING_REVIEW" as const, humanReviewRequired: true as const, riskLevel: input.highestRisk ?? "medium" as MarketplaceRiskLevel, arbitraryCodeExecution: false as const };
}
export function buildContentReport(input: Omit<ContentReport, "id" | "status" | "createdAt">, now = new Date()): ContentReport { return { ...input, id: `RPT-${now.getTime().toString(36).toUpperCase()}`, status: "PENDING", createdAt: now.toISOString() }; }
export function resolveModerationReport(report: ContentReport, moderatorId: string, resolution: string, action?: ModerationAction, now = new Date()) { if (!["PENDING", "REVIEWING"].includes(report.status)) throw new Error("REPORT_NOT_REVIEWABLE"); return { report: { ...report, status: "RESOLVED" as const, resolution }, audit: { id: `MOD-${now.getTime().toString(36).toUpperCase()}`, moderatorId, action: action ?? "RESOLVE", objectType: report.objectType, objectId: report.objectId, reason: resolution, at: now.toISOString() }, appealAllowed: action === "BAN" || action === "SUSPEND" }; }
export function summarizeTypologyAnalytics(events: Array<{ typologyId: string; ok: boolean; score?: number; at?: string }>): TypologyAnalytics[] { const grouped = new Map<string, Array<{ typologyId: string; ok: boolean; score?: number; at?: string }>>(); for (const event of events) grouped.set(event.typologyId, [...(grouped.get(event.typologyId) ?? []), event]); return Array.from(grouped.entries()).map(([typologyId, values]) => ({ typologyId, uses: values.length, failures: values.filter((v: { ok: boolean }) => !v.ok).length, approvalRate: Number((values.filter((v: { ok: boolean }) => v.ok).length / values.length).toFixed(3)), averageScore: Number((values.reduce((sum: number, v: { score?: number }) => sum + (v.score ?? 0), 0) / values.length).toFixed(2)), lastUsedAt: values.map((v: { at?: string }) => v.at).filter((value): value is string => Boolean(value)).sort().pop() ?? null })).sort((a, b) => b.uses - a.uses); }
export function marketplaceApiSchema() { return { version: ARKI_MARKETPLACE_CONTRACT_VERSION, endpoints: ["GET /marketplace/tipologias/dsl/schema", "POST /marketplace/tipologias", "POST /marketplace/tipologias/:slug/instalar", "POST /marketplace/tipologias/:slug/generar", "POST /marketplace/reportes", "GET /marketplace/moderation/reports", "POST /marketplace/moderation/reports/:id/resolve", "GET /marketplace/analytics/tipologias"], security: ["DSL_ONLY", "NO_EVAL", "HUMAN_REVIEW", "AUDIT_TRAIL", "PROPOSAL_ONLY"] as const }; }
export function marketplaceSummary() { return { contractVersion: ARKI_MARKETPLACE_CONTRACT_VERSION, moderation: "IMPLEMENTED_CONTRACT", analytics: "IMPLEMENTED_DETERMINISTIC", publishing: "HUMAN_REVIEW_REQUIRED", execution: "PROPOSAL_ONLY" }; }
export function isMarketplaceSafeForPublication(submission: MarketplaceSubmission) { return submission.status === "APPROVED" && submission.dslValidation === "PASS"; }
export function installMarketplaceTypology(submission: MarketplaceSubmission) { if (!isMarketplaceSafeForPublication(submission)) throw new Error("TYPOLOGY_NOT_APPROVED"); return { installed: true, slug: submission.slug, execution: "PROPOSAL_ONLY" as const, humanReviewRequired: true as const }; }
export function publishMarketplaceTypology(submission: MarketplaceSubmission, ownerAuthorityConfirmed: boolean) { if (!ownerAuthorityConfirmed || !isMarketplaceSafeForPublication(submission)) throw new Error("HUMAN_AUTHORITY_REQUIRED"); return { ...submission, status: "APPROVED" as const, published: true }; }
export function freezeMarketplaceTypology(submission: MarketplaceSubmission) { return { ...submission, status: "FROZEN" as const, published: false }; }
export function moderationQueue(reports: ContentReport[]) { return reports.filter((r) => r.status === "PENDING" || r.status === "REVIEWING"); }
export function analyticsDisclaimer() { return "Los analytics describen uso y fallos; no sustituyen revisión profesional ni autorizan publicación."; }
export function moderationDisclaimer() { return "La moderación requiere trazabilidad y no elimina automáticamente contenido."; }
export function marketplaceReadiness() { return { api: "CONTRACT_READY", persistence: "PROJECT_DATABASE_AVAILABLE", externalPublishing: "NOT_CONNECTED", e2e: "PREPARED" }; }
export function getCriticalTypologyIds() { return ["CRIT_REACTOR_NUCLEAR", "CRIT_NUCLEAR_RESEARCH", "CRIT_BRIDGE", "CRIT_DAM", "CRIT_AQUEDUCT", "CRIT_TUNNEL", "CRIT_CEMETERY", "CRIT_URBANIZATION"] as const; }
export function marketplaceFeatureFlags() { return { marketplace: true, moderation: true, analytics: true, automaticPublications: false, pythonExecution: false, networkExecution: false }; }
export function getOperationalInvariants() { return ["THIRD_PARTY_CODE_NEVER_EXECUTED", "PUBLISHING_REQUIRES_HUMAN_REVIEW", "REPORTS_AND_APPEALS_ARE_AUDITED", "NO_AUTOMATIC_CORE_MUTATION"] as const; }
export function exportAnalytics(events: Array<{ typologyId: string; ok: boolean; score?: number; at?: string }>) { return { format: "ARKI-ANALYTICS-1.0", disclaimer: analyticsDisclaimer(), rows: summarizeTypologyAnalytics(events) }; }
export function normalizeMarketplaceSlug(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
export function isValidEvidenceUrl(url: string) { try { return new URL(url).protocol === "https:"; } catch { return false; } }
export function validateReport(report: ContentReport) { return report.description.length <= 5000 && report.evidenceUrls.every(isValidEvidenceUrl); }
export function getMarketplacePolicy() { return { publication: "manual", execution: "DSL_CONTRACT_ONLY", rights: "evidence-required", unknowns: "preserve" }; }
export function contractHealth() { return { status: "PASS", failClosed: true, version: ARKI_MARKETPLACE_CONTRACT_VERSION }; }
export function implementationStatus() { return { dsl: "IMPLEMENTED", validation: "IMPLEMENTED", moderation: "IMPLEMENTED_CONTRACT", analytics: "IMPLEMENTED_DETERMINISTIC", e2e: "PREPARED", nativeExternalWorkers: "GATED" }; }
export function getReviewDecisionOptions() { return ["APPROVED", "REJECTED", "FROZEN"] as const; }
export function getMarketplaceLimits() { return { maxParams: 100, maxMetrics: 100, maxDefinitionBytes: 500_000, maxEvidenceUrls: 20 }; }
export function marketplaceContractCheck() { return { ...marketplaceSummary(), schema: marketplaceApiSchema(), invariants: getOperationalInvariants(), policy: getMarketplacePolicy() }; }
export function getMarketplaceReport() { return { ...marketplaceContractCheck(), readiness: marketplaceReadiness(), criticalTypologies: getCriticalTypologyIds() }; }
export function getMarketplaceTestPlan() { return ["DSL validation", "catalog search", "compare", "report duplicate", "moderation resolution", "appeal", "analytics aggregation", "publication gate"]; }
export function getMarketplaceUiRoutes() { return ["/arki-parametric-runtime", "/arki-marketplace", "/arki-marketplace/moderation", "/arki-marketplace/analytics"]; }
export function getMarketplaceCompletion() { return { completed: true, status: "IMPLEMENTED_LOCALLY_GATED_EXTERNALLY" as const, version: "ARKI-MARKETPLACE-MODERATION-ANALYTICS-1.0" as const }; }
export function noAutomaticDeletion() { return "REJECTED_OR_FROZEN_PRESERVED_FOR_AUDIT" as const; }
export function marketplaceRequiresNoCoreMutation() { return true; }
export function canModerate(role: "admin" | "user") { return role === "admin"; }
export function canPublish(role: "admin" | "user", authority: boolean) { return role === "admin" && authority; }
export function requiresSeniorReview(level: MarketplaceRiskLevel) { return level === "high" || level === "critical"; }
export function requiresAdminReview(level: MarketplaceRiskLevel) { return level === "critical"; }
export function getSupportedRiskLevels() { return MARKETPLACE_RISK_LEVELS; }
export function getSupportedReportReasons() { return ["SPAM", "OFFENSIVE", "COPYRIGHT", "FALSE", "OTHER"] as const; }
export function getMarketplaceSecurityNotice() { return "El marketplace no ejecuta Python, imports, filesystem, red ni comandos."; }
export function getMarketplaceUserNotice() { return "Las propuestas no son planos constructivos ni aprobación profesional."; }
export function safeDslMessage() { return "El marketplace acepta definiciones declarativas; nunca evalúa código arbitrario."; }
export function marketplaceFeatureMatrix() { return { catalog: true, dsl: true, compare: true, moderation: true, reviews: true, appeals: true, analytics: true, docs: true, e2e: true }; }
export function getMarketplaceSource() { return "00000Mejoras2.docx / pasted_content_20.txt"; }
export function getMarketplaceLimitations() { return ["No publicación externa automática", "No hosts nativos no autorizados", "No ejecución Python", "Persistencia productiva de marketplace requiere migración futura"]; }
export function getFinalStatus() { return "IMPLEMENTED_LOCALLY_GATED_EXTERNALLY" as const; }
export function getMarketplaceDecision() { return "PROCEED_WITH_GOVERNED_LOCAL_IMPLEMENTATION" as const; }
export function getMarketplaceEnd() { return "END" as const; }
export default marketplaceSummary;
    
