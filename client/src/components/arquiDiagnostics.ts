export type DiagnosticCategory = "PENDING_REVIEW" | "UNKNOWN" | "NOT_DOCUMENTED" | "REQUIRED_BUT_MISSING" | "CONTRADICTORY" | "UNAVAILABLE" | "BLOCKED";
export type DiagnosticSeverity = "BLOCKING" | "ACTION_REQUIRED" | "REVIEW_REQUIRED" | "INFORMATION_GAP" | "ADVISORY";
export type Diagnostic = { id: string; category: DiagnosticCategory; severity: DiagnosticSeverity; messageKey: string; messageParams?: Record<string, unknown>; basisKey: string; consequenceKey: string; action?: { target: string; labelKey: string; params?: Record<string, unknown> } };
export type DiagnosticContext = { pendingReview: number; alternatives: number; locationRegistered: boolean; hasAnalysis: boolean };

export function deriveArquiDiagnostics(context: DiagnosticContext): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  if (context.pendingReview > 0) diagnostics.push({ id: "pending-review", category: "PENDING_REVIEW", severity: "REVIEW_REQUIRED", messageKey: "arqui.diagnostic_pending_review", messageParams: { count: context.pendingReview }, basisKey: "arqui.basis_review", consequenceKey: "arqui.consequence_review", action: { target: "evidence", labelKey: "arqui.review_action", params: { count: context.pendingReview } } });
  if (context.alternatives > 0 && context.alternatives < 2) diagnostics.push({ id: "compare-blocked", category: "BLOCKED", severity: "BLOCKING", messageKey: "arqui.diagnostic_compare_blocked", messageParams: { count: context.alternatives }, basisKey: "arqui.basis_capability", consequenceKey: "arqui.consequence_compare", action: { target: "alternatives", labelKey: "arqui.view_alternatives" } });
  if (!context.locationRegistered) diagnostics.push({ id: "registration-unknown", category: "UNKNOWN", severity: "INFORMATION_GAP", messageKey: "arqui.diagnostic_registration_unknown", basisKey: "arqui.basis_project", consequenceKey: "arqui.consequence_registration", action: { target: "context", labelKey: "arqui.review_registration" } });
  return diagnostics;
}
