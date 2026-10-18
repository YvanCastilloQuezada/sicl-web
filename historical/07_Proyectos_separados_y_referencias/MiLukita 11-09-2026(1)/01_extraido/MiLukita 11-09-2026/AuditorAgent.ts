import { buildUnifiedHealth, type UnifiedHealth } from "../../shared/health";

export type AuditVerdict = "PASS" | "WARN" | "FAIL";
export type AuditorFinding = { code: string; verdict: AuditVerdict; message: string };
export type AuditorReport = {
  id: "MILUKITA_AUDITOR";
  mode: "READ_ONLY";
  checkedAt: string;
  verdict: AuditVerdict;
  findings: AuditorFinding[];
  health: UnifiedHealth;
  actionsExecuted: false;
};

type AuditInput = {
  liveEventId?: string | null;
  manifestEventId?: string | null;
  persistedEventId?: string | null;
  heartbeatAt?: string | null;
  now?: string;
  health?: Partial<UnifiedHealth> & Pick<UnifiedHealth, "state">;
};

export function auditReadOnly(input: AuditInput): AuditorReport {
  const checkedAt = input.now ?? new Date().toISOString();
  const findings: AuditorFinding[] = [];
  const ids = [input.liveEventId, input.manifestEventId, input.persistedEventId].filter((id): id is string => Boolean(id));
  if (ids.length === 0) findings.push({ code: "NO_DATA", verdict: "WARN", message: "No hay detalles adicionales disponibles." });
  else if (new Set(ids).size !== 1 || ids.length !== 3) findings.push({ code: "EVENT_MISMATCH", verdict: "FAIL", message: "Las fuentes autoritativas no coinciden o están incompletas." });
  else findings.push({ code: "EVENT_CONSISTENT", verdict: "PASS", message: "Evento LIVE, manifest y evento persistido consistentes." });

  if (input.heartbeatAt) {
    const ageMs = Date.parse(checkedAt) - Date.parse(input.heartbeatAt);
    if (Number.isFinite(ageMs) && ageMs > 90_000) findings.push({ code: "HEARTBEAT_STALE", verdict: "WARN", message: "Heartbeat retrasado." });
  }
  const verdict = findings.some((item) => item.verdict === "FAIL") ? "FAIL" : findings.some((item) => item.verdict === "WARN") ? "WARN" : "PASS";
  return { id: "MILUKITA_AUDITOR", mode: "READ_ONLY", checkedAt, verdict, findings, health: buildUnifiedHealth({ ...(input.health ?? { state: verdict === "PASS" ? "HEALTHY" : "DEGRADED" }), timestamp: checkedAt, eventId: input.liveEventId ?? null, auditorStatus: "READ_ONLY" }), actionsExecuted: false };
}
