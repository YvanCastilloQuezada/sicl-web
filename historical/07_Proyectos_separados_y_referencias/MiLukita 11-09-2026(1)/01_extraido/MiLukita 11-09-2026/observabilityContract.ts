export const OBSERVABILITY_ORDER_ID = "MILUKITA-AGENT-OBSERVABILITY-01" as const;

export type DataStatus = "REAL" | "SIMULATED" | "ESTIMATED" | "INFERRED" | "UNAVAILABLE";
export type DataTrust = "AUTHORITATIVE" | "NON_AUTHORITATIVE" | "UNKNOWN";
export type ObservabilityResult = "IMPLEMENTED" | "PARTIAL" | "PENDING" | "NOT_VERIFIABLE" | "BLOCKED" | "REQUIRES_HUMAN" | "SIMULATED" | "DEGRADED" | "EXTERNAL_REQUIRED" | "BASELINE_PENDING" | "NO_DATA";
export type ExecutionStatus = "SUCCESS" | "FAILED" | "BLOCKED" | "REJECTED" | "ESCALATED" | "TIMEOUT" | "PARTIAL" | "NO_DATA" | "SIMULATED";
export type AlertSeverity = "OK" | "WARNING" | "CRITICAL";
export type AlertLifecycle = "OPEN" | "ACKNOWLEDGED" | "INVESTIGATING" | "MITIGATED" | "RESOLVED" | "CLOSED";
export type TrendState = "IMPROVING" | "STABLE" | "DEGRADING" | "VOLATILE" | "INSUFFICIENT_DATA";

export type MetricValue = number | null;

export type KpiDefinition = {
  kpiId: string;
  name: string;
  domain: string;
  agentId: string;
  definition: string;
  formula: string;
  unit: "count" | "ratio" | "percentage" | "milliseconds" | "currency";
  source: string;
  target: MetricValue;
  warningThreshold: MetricValue;
  criticalThreshold: MetricValue;
  aggregation: "point" | "batch" | "windowed" | "rolling" | "trend" | "baseline";
  window: string;
  baseline: MetricValue;
  status: "ACTIVE" | "BASELINE_PENDING" | "NO_DATA" | "DISABLED";
  version: string;
};

export type AgentTelemetryEvent = {
  eventId: string;
  timestamp: number;
  agentId: string;
  agentVersion: string;
  taskId: string;
  action: string;
  inputReference: string | null;
  outputReference: string | null;
  authorityReference: string;
  policyReference: string;
  status: ExecutionStatus;
  durationMs: number | null;
  confidence: number | null;
  dataStatus: DataStatus;
  dataTrust: DataTrust;
  humanRequired: boolean;
  coreAccess: "NONE" | "READ_ONLY" | "BLOCKED";
  coreImpact: "NONE" | "ATTEMPTED" | "IMPACTED";
  errorCode: string | null;
  errorMessage: string | null;
};

export type ObservabilityAlert = {
  alertId: string;
  correlationId: string;
  severity: AlertSeverity;
  lifecycle: AlertLifecycle;
  source: string;
  agentId: string | null;
  reason: string;
  detectedAt: number;
  acknowledgedAt: number | null;
  resolvedAt: number | null;
  coreImpact: boolean;
  humanIntervention: boolean;
};

export const OBSERVABILITY_AGENT_METRICS = ["HEALTH", "QUALITY", "IMPACT", "GOVERNANCE", "TRUST"] as const;
export const OBSERVABILITY_AGENT_STATES = ["PLANNED", "DISABLED", "INITIALIZING", "OPERATIONAL", "DEGRADED", "FAILED", "BLOCKED", "MAINTENANCE", "REQUIRES_HUMAN", "NO_DATA"] as const;
export const OBSERVABILITY_DOMAINS = ["BUSINESS", "EXPERIENCE", "AGENTS", "GOVERNANCE", "CORE"] as const;
export const OBSERVABILITY_ROUTES = ["/control-room", "/control-room/core", "/control-room/audit", "/control-room/incidents", "/control-room/kpi", "/control-room/decisions"] as const;

export const CORE_INTEGRITY_TARGETS = {
  coreSurvivalRate: 1,
  unauthorizedCoreAccess: 0,
  coreModificationAttempts: 0,
  resultAlterationAttempts: 0,
  walletImpact: 0,
  ledgerImpact: 0,
} as const;

export const OBSERVABILITY_NOT_IMPLEMENTED = [
  "PERSISTENT_TELEMETRY_PIPELINE",
  "CENTRAL_KPI_ENGINE",
  "DEDUPLICATED_ALERT_ENGINE",
  "INCIDENT_STORE",
  "KPI_HISTORY_STORE",
  "CROSS_PROCESS_AUDIT_STREAM",
  "EXTERNAL_EMAIL_SLACK_TELEGRAM_NOTIFICATIONS",
  "PRODUCTION_CONTROL_ROOM_CERTIFICATION",
] as const;

export function noDataMetric(): { value: null; status: "NO_DATA"; dataStatus: "UNAVAILABLE" } {
  return { value: null, status: "NO_DATA", dataStatus: "UNAVAILABLE" };
}

export function deriveSystemStatus(input: { critical: boolean; degraded: boolean; warning: boolean; dataSufficient: boolean }): AlertSeverity | "NO_DATA" {
  if (input.critical) return "CRITICAL";
  if (input.degraded) return "WARNING";
  if (input.warning) return "WARNING";
  return input.dataSufficient ? "OK" : "NO_DATA";
}

export function isCriticalOverride(input: { coreIntegrityCritical: boolean; authorityViolation: boolean; averageScore: number | null }): boolean {
  return input.coreIntegrityCritical || input.authorityViolation;
}

export function canClaimFromMetric(input: { value: MetricValue; dataStatus: DataStatus; dataTrust: DataTrust; baselineReady: boolean }): false {
  void input;
  return false;
}

export function isCoreIsolated(event: Pick<AgentTelemetryEvent, "coreAccess" | "coreImpact">): boolean {
  return event.coreAccess === "NONE" && event.coreImpact === "NONE";
}

export function shouldDeduplicateAlert(existing: Pick<ObservabilityAlert, "correlationId" | "lifecycle">, incoming: Pick<ObservabilityAlert, "correlationId">): boolean {
  return existing.correlationId === incoming.correlationId && existing.lifecycle !== "CLOSED";
}
