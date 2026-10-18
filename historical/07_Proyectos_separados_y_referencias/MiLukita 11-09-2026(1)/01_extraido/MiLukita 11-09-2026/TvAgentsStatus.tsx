import { Eye, ShieldCheck, TriangleAlert } from "lucide-react";

type AgentHealth = {
  watchdog?: { status: "HEALTHY" | "WARNING" | "CRITICAL" | "NOT_REPORTED"; mode: "ALERT_ONLY"; checks?: Array<{ key: string; status: string; message: string }> };
  auditor?: { status: "OBSERVING" | "REPORTING"; mode: "READ_ONLY" };
};

export default function TvAgentsStatus({ health, maintenance = false }: { health?: AgentHealth; maintenance?: boolean }) {
  const watchdog = health?.watchdog?.status ?? "NOT_REPORTED";
  const auditor = health?.auditor?.status ?? "OBSERVING";
  const watchdogAlert = watchdog === "WARNING" || watchdog === "CRITICAL";
  return <section className={`tv-agents-status ${maintenance ? "tv-agents-status-maintenance" : ""}`} aria-label="Estado de agentes de continuidad">
    <div className={`tv-agent-chip ${watchdogAlert ? "tv-agent-alert" : ""}`} role="status"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /><span>Watchdog {watchdog === "HEALTHY" ? "activo" : watchdog === "NOT_REPORTED" ? "sin reporte" : watchdog.toLowerCase()}</span><small>ALERT_ONLY</small></div>
    <div className="tv-agent-chip" role="status"><Eye className="h-3.5 w-3.5" aria-hidden="true" /><span>Auditor {auditor === "REPORTING" ? "reportando" : "observando"}</span><small>READ_ONLY</small></div>
    {watchdogAlert ? <p className="tv-agent-alert-copy"><TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" /> El Watchdog detectó una condición que requiere revisión.</p> : null}
  </section>;
}
