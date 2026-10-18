import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Activity, AlertTriangle, CheckCircle2, Download, ExternalLink, FileCheck2, LockKeyhole, RefreshCw, Radio, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { matchesControlRoomSearch } from "../../../shared/controlRoomSearch";
import { deriveSystemStatus, OBSERVABILITY_NOT_IMPLEMENTED } from "../../../shared/observabilityContract";
const BrandPreviewPanel = lazy(() => import("@/components/BrandPreviewPanel"));
const LukitaScriptsPanel = lazy(() => import("@/components/LukitaScriptsPanel"));
const AuditReportsPanel = lazy(() => import("@/components/AuditReportsPanel"));
const AgentPermissionsPanel = lazy(() => import("@/components/AgentPermissionsPanel"));
const BossFightTestPanel = lazy(() => import("@/components/BossFightTestPanel"));
const AutonomyMonitoringPanel = lazy(() => import("@/components/AutonomyMonitoringPanel"));
const ExperienceAgentProposalsPanel = lazy(() => import("@/components/ExperienceAgentProposalsPanel"));
const MasterFlowMonitor = lazy(() => import("@/components/MasterFlowMonitor"));
const EntertainmentOsHelpPanel = lazy(() => import("@/components/EntertainmentOsHelpPanel"));
const CharacterExperiencePanel = lazy(() => import("@/components/CharacterExperiencePanel"));
const CharacterEventLogPanel = lazy(() => import("@/components/CharacterEventLogPanel"));
const CharacterDecisionMonitor = lazy(() => import("@/components/CharacterDecisionMonitor"));
const DistributionOsPanel = lazy(() => import("@/components/DistributionOsPanel"));
const IntelligenceAgentsPanel = lazy(() => import("@/components/IntelligenceAgentsPanel"));
const AgentRegistryPanel = lazy(() => import("@/components/AgentRegistryPanel"));
const ConsolidationStatusPanel = lazy(() => import("@/components/ConsolidationStatusPanel"));
const FailSafeAlertsPanel = lazy(() => import("@/components/FailSafeAlertsPanel"));
const MasterOrderStatusPanel = lazy(() => import("@/components/MasterOrderStatusPanel"));
const HumanAuthorityDocumentsPanel = lazy(() => import("@/components/HumanAuthorityDocumentsPanel"));
const FinancialTaxIntelligencePanel = lazy(() => import("@/components/FinancialTaxIntelligencePanel"));
const ConstitutionalOrgChartPanel = lazy(() => import("@/components/ConstitutionalOrgChartPanel"));
const ConstitutionalContractReviewPanel = lazy(() => import("@/components/ConstitutionalContractReviewPanel"));
const IdentityParticipationPanel = lazy(() => import("@/components/IdentityParticipationPanel"));
const MarketingIntelligencePanel = lazy(() => import("@/components/MarketingIntelligencePanel"));
const AgentAutonomyPlanPanel = lazy(() => import("@/components/AgentAutonomyPlanPanel"));
const LukitaGeoPlacementPanel = lazy(() => import("@/components/LukitaGeoPlacementPanel"));

function DeferredPanel({ label, children }: { label: string; children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = panelRef.current;
    if (!node || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "560px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={panelRef} className={`control-room-deferred-panel${shouldLoad ? " is-loaded" : ""}`} data-panel-state={shouldLoad ? "loaded" : "deferred"}>{shouldLoad ? <Suspense fallback={<div className="mt-6 border border-white/10 bg-black/20 p-5 text-sm text-slate-400" role="status" aria-live="polite">Cargando {label}…</div>}>{children}</Suspense> : <div className="mt-6 border border-white/10 bg-black/10 p-5 text-sm text-slate-500" role="status" aria-label={`${label} pendiente de carga`}>Se cargará {label} al acercarte.</div>}</div>;
}

function statusTone(status: string | undefined) {
  if (status === "PASS" || status === "NORMAL" || status === "healthy") return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
  if (status === "CRITICAL" || status === "STOPPED" || status === "offline") return "border-rose-300/25 bg-rose-300/10 text-rose-100";
  return "border-amber-300/25 bg-amber-300/10 text-amber-100";
}

function HealthBadge({ label, status }: { label: string; status?: string }) {
  return <Badge className={`gap-2 border ${statusTone(status)}`}><span aria-hidden className="h-2 w-2 rounded-full bg-current" />{label}: {status ?? "NOT MEASURED"}</Badge>;
}

type ControlHistoryEntry = { id: string; at: string; area: string; status: string; detail: string; type?: string; characterId?: string | null; severity?: "INFO" | "WARNING" | "CRITICAL" };
const CONTROL_HISTORY_KEY = "milukita-control-history-v1";

function readControlHistory(): ControlHistoryEntry[] {
  try { const parsed = JSON.parse(window.localStorage.getItem(CONTROL_HISTORY_KEY) ?? "[]") as unknown; return Array.isArray(parsed) ? parsed.slice(0, 30) as ControlHistoryEntry[] : []; } catch { return []; }
}

function csvCell(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }

function downloadControlCsv(rows: Array<Record<string, unknown>>) {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const csv = [columns.map(csvCell).join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\\n");
  const blob = new Blob([`\\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = `milukita-control-room-${new Date().toISOString().slice(0, 19).replaceAll(":", "-")}.csv`; anchor.click(); URL.revokeObjectURL(url);
}

export default function ControlRoom() {
  const { user, isAuthenticated } = useAuth();
  const isOperator = isAuthenticated && user?.role === "admin";
  const rounds = trpc.broadcast.rounds.useQuery(undefined, { enabled: isOperator, refetchInterval: 5_000 });
  const control = trpc.operations.controlState.useQuery(undefined, { enabled: isOperator, refetchInterval: 5_000 });
  const watchdog = trpc.operations.watchdogHealth.useQuery(undefined, { enabled: isOperator, refetchInterval: 10_000 });
  const events = trpc.operations.operationalEvents.useQuery({ limit: 12 }, { enabled: isOperator, refetchInterval: 5_000 });
  const signal = trpc.operations.broadcastSignalMetrics.useQuery({ limit: 1 }, { enabled: isOperator, refetchInterval: 10_000 });
  const [history, setHistory] = useState<ControlHistoryEntry[]>(() => readControlHistory());
  const [historyType, setHistoryType] = useState("ALL");
  const [historySeverity, setHistorySeverity] = useState("ALL");
  const [historyCharacter, setHistoryCharacter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");
  const lastHistoryKey = useRef<string | null>(null);
  const active = rounds.data?.find((round) => round != null && (round.state === "open" || round.state === "locked" || round.state === "drawn")) ?? rounds.data?.find((round) => round != null);
  const manifest = active?.manifest;
  const signalMetrics = signal.data?.[0] as { status?: string; p50Ms?: number; p95Ms?: number; p99Ms?: number; reconnects?: number; reconnectP95Ms?: number } | undefined;
  const historyKey = `${control.data?.mode ?? "NOT_MEASURED"}|${watchdog.data?.status ?? "NOT_MEASURED"}|${signalMetrics?.status ?? "NOT_MEASURED"}|${manifest?.event.status ?? "NOT_MEASURED"}|${manifest?.qr.available ? "QR_READY" : "QR_OFF"}`;
  useEffect(() => {
    if (lastHistoryKey.current === historyKey || historyKey.includes("NOT_MEASURED")) return;
    lastHistoryKey.current = historyKey;
    const currentStatus = control.data?.mode ?? "UNKNOWN";
    const severity: ControlHistoryEntry["severity"] = currentStatus === "STOPPED" || watchdog.data?.status === "FAIL" ? "CRITICAL" : signalMetrics?.status === "WARNING" ? "WARNING" : "INFO";
    const entry: ControlHistoryEntry = { id: `${Date.now()}-${historyKey}`, at: new Date().toISOString(), area: "Sistema", status: currentStatus, type: "STATE_CHANGE", severity, detail: `Watchdog ${watchdog.data?.status ?? "UNKNOWN"} · Señal ${signalMetrics?.status ?? "UNKNOWN"} · Evento ${manifest?.event.status ?? "UNKNOWN"}` };
    setHistory((current) => { const next = [entry, ...current].slice(0, 30); window.localStorage.setItem(CONTROL_HISTORY_KEY, JSON.stringify(next)); return next; });
  }, [historyKey, control.data?.mode, watchdog.data?.status, signal.data?.[0]?.status, manifest?.event.status]);
  const filteredEvents = (events.data ?? []).filter((event) => matchesControlRoomSearch(searchQuery, [event.eventType, event.aggregateType, event.aggregateId, event.source]));
  const filteredHistory = history.filter((item) => { const at = new Date(item.at); const afterFrom = !historyFrom || at >= new Date(`${historyFrom}T00:00:00`); const beforeTo = !historyTo || at <= new Date(`${historyTo}T23:59:59.999`); const matchesSearch = matchesControlRoomSearch(searchQuery, [item.area, item.status, item.detail, item.type, item.characterId]); return (historyType === "ALL" || (item.type ?? "STATE_CHANGE") === historyType) && (historySeverity === "ALL" || (item.severity ?? "INFO") === historySeverity) && (historyCharacter === "ALL" || (item.characterId ?? "NONE") === historyCharacter) && matchesSearch && afterFrom && beforeTo; });
  const exportFilteredHistory = () => { downloadControlCsv(filteredHistory.map((item) => ({ fecha: item.at, area: item.area, tipo: item.type ?? "STATE_CHANGE", personaje: item.characterId ?? "NONE", estado: item.status, severidad: item.severity ?? "INFO", detalle: item.detail }))); toast.success("Exportación completada", { description: `${filteredHistory.length} registros del historial fueron preparados en CSV.` }); };
  const exportCurrentData = () => {
    const currentRows: Array<Record<string, unknown>> = [{ tipo: "metric", fecha: new Date().toISOString(), sistema: control.data?.mode ?? "NOT_MEASURED", watchdog: watchdog.data?.status ?? "NOT_MEASURED", senal_tv: signalMetrics?.status ?? "NOT_MEASURED", latencia_p50_ms: signalMetrics?.p50Ms ?? "—", latencia_p95_ms: signalMetrics?.p95Ms ?? "—", latencia_p99_ms: signalMetrics?.p99Ms ?? "—", reconexiones: signalMetrics?.reconnects ?? "—", reconexion_p95_ms: signalMetrics?.reconnectP95Ms ?? "—", evento: manifest?.event.eventId ?? "—", juego: manifest?.event.gameName ?? "—", estado_evento: manifest?.event.status ?? "—", qr: manifest?.qr.available ? "PASS" : "OFF", autonomia: autonomySnapshotLabel }];
    downloadControlCsv([...currentRows, ...history.map((item) => ({ tipo: "history", fecha: item.at, area: item.area, estado: item.status, detalle: item.detail }))]);
    toast.success("Exportación completada", { description: "Las métricas actuales y el historial fueron preparados en CSV." });
  };
  const autonomySnapshotLabel = control.data?.mode === "STOPPED" ? "STOPPED" : "OBSERVATION";
  const observabilityStatus = deriveSystemStatus({ critical: control.data?.mode === "STOPPED" || watchdog.data?.status === "FAIL", degraded: signalMetrics?.status === "WARNING", warning: Boolean(events.data && events.data.length === 0), dataSufficient: Boolean(control.data && watchdog.data && signalMetrics && events.data) });

  if (!isAuthenticated) return <main className="min-h-screen bg-[#06120e] px-6 py-20 text-white"><div className="mx-auto max-w-xl border border-white/10 bg-white/5 p-8 text-center"><LockKeyhole className="mx-auto h-8 w-8 text-amber-200" /><h1 className="mt-4 font-display text-3xl">Control Room</h1><p className="mt-3 text-sm text-slate-300">Inicia sesión para acceder al centro de operación virtual.</p><Button onClick={() => startLogin()} className="mt-6 gold-button">Iniciar sesión</Button></div></main>;
  if (!isOperator) return <main className="min-h-screen bg-[#06120e] px-6 py-20 text-white"><div className="mx-auto max-w-xl border border-amber-200/20 bg-amber-200/5 p-8 text-center"><AlertTriangle className="mx-auto h-8 w-8 text-amber-200" /><h1 className="mt-4 font-display text-3xl">Acceso restringido</h1><p className="mt-3 text-sm text-slate-300">Control Room requiere rol de operador. El piloto no permite controles operativos desde una cuenta de jugador.</p><Link href="/"><Button variant="outline" className="mt-6 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">Volver al portal</Button></Link></div></main>;

  return <main className="min-h-screen bg-[#06120e] px-4 py-8 text-white sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end"><div><p className="eyebrow text-emerald-200">MiLukita Experience OS · control humano</p><h1 className="font-display mt-2 text-4xl sm:text-5xl">Control Room</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Centro operativo de observación. El servidor conserva la autoridad sobre rondas, resultados, reglas y créditos virtuales.</p></div><div className="flex flex-wrap gap-2"><HealthBadge label="Sistema" status={control.data?.mode} /><HealthBadge label="Watchdog" status={watchdog.data?.status} /><Link href="/tv"><Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Radio className="mr-2 h-4 w-4" /> TV</Button></Link><Link href="/auditoria-resumen"><Button variant="outline" className="border-cyan-200/20 bg-cyan-200/5 text-cyan-100 hover:bg-cyan-200/10 hover:text-cyan-50"><FileCheck2 className="mr-2 h-4 w-4" /> Auditoría</Button></Link></div></header>

<section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><div className="border border-white/10 bg-white/5 p-5"><p className="text-xs uppercase tracking-[.14em] text-slate-500">Evento actual</p><p className="mt-2 truncate text-xl font-bold text-white">{manifest?.event.eventId ?? "NOT MEASURED"}</p><p className="mt-1 text-xs text-slate-400">{manifest?.event.gameName ?? "Sin ronda activa"}</p></div><div className="border border-white/10 bg-white/5 p-5"><p className="text-xs uppercase tracking-[.14em] text-slate-500">Experiencia</p><p className="mt-2 text-xl font-bold text-emerald-100">{manifest?.experience.templateId ?? "NOT MEASURED"}</p><p className="mt-1 text-xs text-slate-400">{manifest?.experience.phase ?? "—"}</p></div><div className="border border-white/10 bg-white/5 p-5"><p className="text-xs uppercase tracking-[.14em] text-slate-500">Estado</p><p className="mt-2 text-xl font-bold text-amber-100">{manifest?.event.status ?? "NOT MEASURED"}</p><p className="mt-1 text-xs text-slate-400">Secuencia {manifest?.sequence ?? "—"}</p></div><div className="border border-white/10 bg-white/5 p-5"><p className="text-xs uppercase tracking-[.14em] text-slate-500">Tiempo restante</p><p className="mt-2 text-xl font-bold text-cyan-100">{manifest?.countdown.seconds == null ? "—" : `${manifest.countdown.seconds}s`}</p><p className="mt-1 text-xs text-slate-400">Basado en cierre del servidor</p></div></section>

<section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><div className="border border-white/10 bg-black/20 p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-200">Componentes</p><p className="mt-1 text-xs text-slate-400">Semáforo con texto; el color no es la única señal.</p></div><Activity className="h-5 w-5 text-emerald-200" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="flex items-center justify-between border border-white/8 bg-white/3 p-3 text-sm"><span>TV</span><HealthBadge label="TV" status={signal.data?.[0]?.status ?? "NOT MEASURED"} /></div><div className="flex items-center justify-between border border-white/8 bg-white/3 p-3 text-sm"><span>Mobile</span><HealthBadge label="Mobile" status="NOT MEASURED" /></div><div className="flex items-center justify-between border border-white/8 bg-white/3 p-3 text-sm"><span>QR</span><HealthBadge label="QR" status={manifest?.qr.available ? "PASS" : "WARNING"} /></div><div className="flex items-center justify-between border border-white/8 bg-white/3 p-3 text-sm"><span>Event Store</span><HealthBadge label="Store" status={events.data ? "PASS" : "NOT MEASURED"} /></div><div className="flex items-center justify-between border border-white/8 bg-white/3 p-3 text-sm"><span>Scheduler</span><HealthBadge label="Scheduler" status="NOT MEASURED" /></div><div className="flex items-center justify-between border border-white/8 bg-white/3 p-3 text-sm"><span>Autonomy</span><HealthBadge label="Autonomy" status={control.data?.mode === "STOPPED" ? "STOPPED" : "NOT MEASURED"} /></div></div></div><div className="border border-cyan-200/15 bg-cyan-200/5 p-5"><div className="flex items-start gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-cyan-200" /><div><p className="font-bold text-cyan-100">Autoridad y límites</p><p className="mt-2 text-xs leading-5 text-cyan-100/75">Este panel observa y controla el modo operativo. No puede modificar resultados, reglas, premios, RTP ni activar dinero real.</p><p className="mt-4 text-xs text-slate-400">Modo actual: <strong className="text-white">{control.data?.mode ?? "NOT MEASURED"}</strong></p></div></div></div></section>

<section className="mt-6 border border-cyan-200/15 bg-cyan-200/5 p-5" aria-labelledby="observability-title"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-200">Observability OS</p><h2 id="observability-title" className="mt-1 text-xl font-black text-white">Estado medible, sin false green</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300">Los indicadores no sustituyen evidencia. Los datos ausentes permanecen como NO_DATA y una condición crítica siempre domina cualquier promedio.</p></div><Badge className="border border-cyan-200/25 bg-cyan-200/10 text-cyan-100">Sistema: {observabilityStatus}</Badge></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><div className="border border-white/10 bg-black/20 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">Business</p><p className="mt-2 font-bold text-slate-200">NO_DATA</p></div><div className="border border-white/10 bg-black/20 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">Experience</p><p className="mt-2 font-bold text-slate-200">NO_DATA</p></div><div className="border border-white/10 bg-black/20 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">Agents</p><p className="mt-2 font-bold text-slate-200">INSPECT</p></div><div className="border border-white/10 bg-black/20 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">Governance</p><p className="mt-2 font-bold text-emerald-100">BOUNDED</p></div><div className="border border-emerald-200/20 bg-emerald-200/5 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-emerald-200">Core integrity</p><p className="mt-2 font-bold text-emerald-100">PROTECTED</p></div></div><p className="mt-4 text-xs text-slate-400">Aún no implementado como pipeline persistente: {OBSERVABILITY_NOT_IMPLEMENTED.length} capacidades reservadas. No se trata como fallo de producto ni como salud positiva.</p></section>

<IdentityParticipationPanel /><DeferredPanel label="Marketing Intelligence"><MarketingIntelligencePanel /></DeferredPanel><DeferredPanel label="avance autónomo de agentes"><AgentAutonomyPlanPanel /></DeferredPanel>
<section className="mt-6 border border-white/10 bg-black/20 p-5"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-200">Event log en vivo</p><p className="mt-1 text-xs text-slate-400">Eventos operativos recientes, con polling como fallback.</p></div><div className="flex flex-wrap items-center gap-2"><label className="flex min-w-[240px] flex-1 items-center gap-2 border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-400"><span className="sr-only">Buscar en Control Room</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Buscar evento, agente o detalle…" aria-label="Buscar en Control Room" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />{searchQuery ? <button type="button" onClick={() => setSearchQuery("")} aria-label="Limpiar búsqueda" className="text-slate-400 hover:text-white">×</button> : null}</label><span className="text-xs text-slate-500">{filteredEvents.length + filteredHistory.length} coincidencias</span></div><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => { void events.refetch(); void rounds.refetch(); }} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><RefreshCw className="mr-2 h-3.5 w-3.5" /> Actualizar</Button><Button size="sm" type="button" onClick={exportCurrentData} className="bg-cyan-200 text-[#10251e] hover:bg-cyan-100"><Download className="mr-2 h-3.5 w-3.5" /> Exportar CSV</Button></div></div><div className="mt-4 divide-y divide-white/8">{filteredEvents.map((event) => <div key={event.publicId} className="flex flex-col gap-1 py-3 text-xs sm:flex-row sm:items-center sm:justify-between"><span className="text-slate-400">{new Date(event.createdAt).toLocaleTimeString()} · {event.eventType}</span><span className="text-white">{event.aggregateType}/{event.aggregateId}</span><span className="text-slate-500">{event.source}</span></div>)}{!filteredEvents.length ? <p className="py-5 text-sm text-slate-500">{searchQuery ? "No hay coincidencias para esta búsqueda." : "Sin eventos operativos medidos."}</p> : null}</div></section><section className="mt-6 border border-white/10 bg-black/20 p-5" aria-labelledby="control-history-title"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-amber-200">Historial de control</p><h2 id="control-history-title" className="mt-1 text-xl font-black text-white">Alertas y cambios recientes</h2><p className="mt-1 text-xs text-slate-400">Registro local de transiciones observadas en esta sesión del panel.</p></div><Badge className="border border-white/10 bg-white/5 text-slate-300">{filteredHistory.length}/{history.length} registros</Badge></div><div className="mt-4 grid gap-2 sm:grid-cols-4"><select value={historyType} onChange={(event) => setHistoryType(event.target.value)} className="border border-white/10 bg-black/20 px-2 py-2 text-xs text-white"><option value="ALL">Todos los tipos</option><option value="STATE_CHANGE">Cambio de estado</option><option value="ALERT">Alerta</option></select><select value={historySeverity} onChange={(event) => setHistorySeverity(event.target.value)} className="border border-white/10 bg-black/20 px-2 py-2 text-xs text-white"><option value="ALL">Todas las severidades</option><option value="INFO">Información</option><option value="WARNING">Advertencia</option><option value="CRITICAL">Crítica</option></select><input type="date" value={historyFrom} onChange={(event) => setHistoryFrom(event.target.value)} aria-label="Fecha inicial" className="border border-white/10 bg-black/20 px-2 py-2 text-xs text-white" /><input type="date" value={historyTo} onChange={(event) => setHistoryTo(event.target.value)} aria-label="Fecha final" className="border border-white/10 bg-black/20 px-2 py-2 text-xs text-white" /><select aria-label="Filtrar historial por personaje" value={historyCharacter} onChange={(event) => setHistoryCharacter(event.target.value)} className="border border-white/10 bg-black/20 px-2 py-2 text-xs text-white"><option value="ALL">Todos los personajes</option><option value="lukita-main">Lukita</option><option value="ruli">Ruli</option><option value="mascota">Mascota</option><option value="tematico-demo">Temático</option><option value="NONE">Sin personaje</option></select><Button size="sm" type="button" onClick={exportFilteredHistory} className="border border-amber-200/25 bg-amber-200/10 text-amber-100"><Download className="mr-2 h-3.5 w-3.5" /> Exportar filtrado</Button></div><div className="mt-4 divide-y divide-white/8">{filteredHistory.map((item) => <div key={item.id} className="flex flex-col gap-1 py-3 text-xs sm:flex-row sm:items-start sm:justify-between sm:gap-4"><span className="shrink-0 text-slate-500">{new Date(item.at).toLocaleString()}</span><span className="font-bold text-amber-100">{item.area} · {item.status}</span><span className="text-slate-400 sm:max-w-xl">{item.detail}</span></div>)}{!history.length ? <p className="py-5 text-sm text-slate-500">Aún no se han observado transiciones.</p> : null}</div></section>\n\n<DeferredPanel label="estado de la Orden Maestra"><MasterOrderStatusPanel /></DeferredPanel><DeferredPanel label="organigrama constitucional"><ConstitutionalOrgChartPanel /></DeferredPanel><DeferredPanel label="contrato constitucional y quality gates"><ConstitutionalContractReviewPanel /></DeferredPanel><DeferredPanel label="gestión documental"><HumanAuthorityDocumentsPanel /></DeferredPanel><DeferredPanel label="Financial/Tax Intelligence"><FinancialTaxIntelligencePanel /></DeferredPanel><DeferredPanel label="estado de consolidación"><ConsolidationStatusPanel /></DeferredPanel><DeferredPanel label="alertas fail-safe"><FailSafeAlertsPanel /></DeferredPanel><DeferredPanel label="registro de agentes"><AgentRegistryPanel /></DeferredPanel><DeferredPanel label="mapa de escenas Lukita"><LukitaGeoPlacementPanel /></DeferredPanel><DeferredPanel label="monitoreo de autonomía"><AutonomyMonitoringPanel /></DeferredPanel><DeferredPanel label="experiencia de personajes"><CharacterExperiencePanel /></DeferredPanel><DeferredPanel label="eventos de personajes"><CharacterEventLogPanel /></DeferredPanel><DeferredPanel label="decisiones de personajes"><CharacterDecisionMonitor /></DeferredPanel><DeferredPanel label="Distribution OS"><DistributionOsPanel /></DeferredPanel><DeferredPanel label="agentes de inteligencia"><IntelligenceAgentsPanel /></DeferredPanel><DeferredPanel label="propuestas del Experience Agent"><ExperienceAgentProposalsPanel /></DeferredPanel><DeferredPanel label="flujo maestro"><MasterFlowMonitor /></DeferredPanel><DeferredPanel label="ayuda de Entertainment OS"><EntertainmentOsHelpPanel /></DeferredPanel><DeferredPanel label="vista previa de marca"><BrandPreviewPanel /></DeferredPanel><DeferredPanel label="Lukita Script Lab"><LukitaScriptsPanel /></DeferredPanel><DeferredPanel label="informes de auditoría"><AuditReportsPanel /></DeferredPanel><DeferredPanel label="permisos de agentes"><AgentPermissionsPanel /></DeferredPanel><DeferredPanel label="prueba de Boss Fight"><BossFightTestPanel /></DeferredPanel>

{manifest ? <section className="mt-6 flex flex-wrap gap-3"><Link href={`/overlay/${manifest.event.eventId}`}><Button className="gold-button"><ExternalLink className="mr-2 h-4 w-4" /> Abrir overlay</Button></Link><span className="flex items-center gap-2 border border-emerald-300/20 bg-emerald-300/5 px-4 text-xs text-emerald-100"><CheckCircle2 className="h-4 w-4" /> Piloto virtual activo</span></section> : null}</div></main>;
}
