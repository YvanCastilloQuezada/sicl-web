import { useMemo, useState } from "react";
import { AlertTriangle, ArrowUpDown, BarChart3, CheckCircle2, Download, FileCheck2, LockKeyhole, PauseCircle, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { AUDIT_SUMMARY_ITEMS, filterAuditSummary, type AuditPriority, type AuditStatus } from "../../../shared/auditSummary";

const auditItems = AUDIT_SUMMARY_ITEMS;

function downloadAuditCsv(items: typeof auditItems) {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const rows = [["Área", "Estado", "Prioridad", "Título", "Detalle"], ...items.map((item) => [item.area, item.status, item.priority, item.title, item.detail])];
  const blob = new Blob([rows.map((row) => row.map(escape).join(",")).join("\\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `milukita-auditoria-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

const statusStyle: Record<string, string> = {
  VERIFICADO: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  CORREGIDO: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  LOCAL: "border-sky-300/30 bg-sky-300/10 text-sky-100",
  SIMULADO: "border-violet-300/30 bg-violet-300/10 text-violet-100",
  PAUSADO: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  "NO VERIFICADO": "border-orange-300/30 bg-orange-300/10 text-orange-100",
  PENDIENTE: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  PREPRODUCCIÓN: "border-slate-300/30 bg-slate-300/10 text-slate-100",
};

export default function AuditSummaryPage() {
  const { user, isAuthenticated } = useAuth();
  const isOperator = isAuthenticated && user?.role === "admin";
  const [status, setStatus] = useState<"TODOS" | AuditStatus>("TODOS");
  const [priority, setPriority] = useState<"TODAS" | AuditPriority>("TODAS");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "status" | "area">("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const simulation = trpc.operations.autonomySimulationPreview.useQuery(undefined, { enabled: isOperator, refetchInterval: 5_000 });
  const pdfExport = trpc.operations.generateAuditReportPdf.useMutation();
  const filtered = useMemo(() => {
    const priorityRank: Record<string, number> = { P0: 0, P1: 1, P2: 2 };
    return [...filterAuditSummary(auditItems, query, status, priority)].sort((left, right) => {
      const leftValue = sortBy === "priority" ? priorityRank[left.priority] : left[sortBy];
      const rightValue = sortBy === "priority" ? priorityRank[right.priority] : right[sortBy];
      const comparison = String(leftValue).localeCompare(String(rightValue), "es", { numeric: true });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [priority, query, sortBy, sortDirection, status]);
  const verified = auditItems.filter((item) => item.status === "VERIFICADO" || item.status === "CORREGIDO").length;
  const paused = auditItems.filter((item) => item.status === "PAUSADO").length;
  const open = auditItems.filter((item) => item.status === "PENDIENTE" || item.status === "NO VERIFICADO").length;
  const handlePdfExport = async () => {
    const result = await pdfExport.mutateAsync();
    window.open(result.storageUrl, "_blank", "noopener,noreferrer");
  };

  if (!isAuthenticated) return <main className="min-h-screen bg-[#06120e] px-6 py-20 text-white"><div className="mx-auto max-w-xl border border-white/10 bg-white/5 p-8 text-center"><LockKeyhole className="mx-auto h-8 w-8 text-amber-200" /><h1 className="mt-4 font-display text-3xl">Resumen de auditoría</h1><p className="mt-3 text-sm text-slate-300">Inicia sesión para acceder a la vista operativa.</p><Button onClick={() => startLogin()} className="mt-6 gold-button">Iniciar sesión</Button></div></main>;
  if (!isOperator) return <main className="min-h-screen bg-[#06120e] px-6 py-20 text-white"><div className="mx-auto max-w-xl border border-amber-200/20 bg-amber-200/5 p-8 text-center"><AlertTriangle className="mx-auto h-8 w-8 text-amber-200" /><h1 className="mt-4 font-display text-3xl">Acceso restringido</h1><p className="mt-3 text-sm text-slate-300">Esta vista es solo para el operador del piloto.</p><Link href="/"><Button variant="outline" className="mt-6 border-white/15 bg-white/5 text-white">Volver</Button></Link></div></main>;

  return <main className="min-h-screen bg-[#06120e] px-4 py-8 text-white sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow text-emerald-200">MiLukita · auditoría externa</p><h1 className="mt-2 font-display text-4xl sm:text-5xl">Resumen verificable</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Vista interactiva del expediente técnico. Los estados distinguen evidencia real, validación local, simulación, pausas y brechas abiertas.</p></div><div className="flex flex-wrap gap-2"><Link href="/control-room"><Button variant="outline" className="border-white/15 bg-white/5 text-white">Control Room</Button></Link><a href="/docs/MILUKITA_AUDITORIA_TOTAL_EXTERNA.md" target="_blank" rel="noreferrer"><Button className="bg-cyan-200 text-[#10251e] hover:bg-cyan-100"><FileCheck2 className="mr-2 h-4 w-4" /> Expediente</Button></a></div></header>

<section className="mt-7 grid gap-4 md:grid-cols-3"><div className="border border-emerald-300/20 bg-emerald-300/5 p-5"><CheckCircle2 className="h-5 w-5 text-emerald-200" /><p className="mt-4 text-xs uppercase tracking-[.14em] text-slate-400">Verificado/corregido</p><p className="mt-1 text-3xl font-black text-emerald-100">{verified}</p></div><div className="border border-amber-300/20 bg-amber-300/5 p-5"><PauseCircle className="h-5 w-5 text-amber-200" /><p className="mt-4 text-xs uppercase tracking-[.14em] text-slate-400">Pausado por propietario</p><p className="mt-1 text-3xl font-black text-amber-100">{paused}</p></div><div className="border border-rose-300/20 bg-rose-300/5 p-5"><AlertTriangle className="h-5 w-5 text-rose-200" /><p className="mt-4 text-xs uppercase tracking-[.14em] text-slate-400">Abierto/no verificado</p><p className="mt-1 text-3xl font-black text-rose-100">{open}</p></div></section>

<section className="mt-7 border border-white/10 bg-black/20 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-cyan-200" /><div><h2 className="font-bold">Filtros y exportación</h2><p className="text-xs text-slate-400">La vista es de solo lectura y no cambia resultados.</p></div></div><div className="flex flex-wrap gap-2"><Button onClick={() => downloadAuditCsv(filtered)} variant="outline" className="border-white/15 bg-white/5 text-white"><Download className="mr-2 h-4 w-4" /> CSV visible</Button><Button onClick={handlePdfExport} disabled={pdfExport.isPending} className="bg-cyan-200 text-[#10251e] hover:bg-cyan-100"><FileCheck2 className="mr-2 h-4 w-4" /> {pdfExport.isPending ? "Generando…" : "Informe PDF"}</Button></div></div><div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_180px_180px]"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar área, riesgo o componente" className="border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500" /><select value={status} onChange={(event) => setStatus(event.target.value as "TODOS" | AuditStatus)} className="border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"><option value="TODOS">Todos los estados</option>{Array.from(new Set<AuditStatus>(auditItems.map((item) => item.status))).map((value: AuditStatus) => <option key={value} value={value}>{value}</option>)}</select><select value={priority} onChange={(event) => setPriority(event.target.value as "TODAS" | AuditPriority)} className="border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"><option value="TODAS">Todas las prioridades</option><option value="P0">P0 crítico</option><option value="P1">P1 alto</option><option value="P2">P2 medio</option></select><select value={sortBy} onChange={(event) => setSortBy(event.target.value as "priority" | "status" | "area")} className="border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"><option value="priority">Ordenar: prioridad</option><option value="status">Ordenar: estado</option><option value="area">Ordenar: área</option></select></div><Button onClick={() => setSortDirection((current) => current === "asc" ? "desc" : "asc")} variant="outline" className="mt-3 border-white/15 bg-white/5 text-xs text-slate-300"><ArrowUpDown className="mr-2 h-3 w-3" /> Dirección: {sortDirection === "asc" ? "ascendente" : "descendente"}</Button></section>

<section className="mt-6 border border-violet-300/20 bg-violet-300/5 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-violet-200" /><div><h2 className="font-bold text-violet-100">Simulación de operación 24/7</h2><p className="text-xs text-violet-100/65">Lectura local del reporte determinista; no representa producción ni staging.</p></div><Badge className={simulation.data?.summary.passed ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-100"}>{simulation.isFetching ? "ACTUALIZANDO" : simulation.data?.summary.passed ? "PASS" : "SIN DATOS"}</Badge></div><Button onClick={() => void simulation.refetch()} variant="outline" className="border-violet-200/20 bg-white/5 text-violet-100">Actualizar</Button></div>{simulation.data ? <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><div><p className="text-xs text-slate-400">Ventana</p><p className="mt-1 text-xl font-bold text-white">{simulation.data.summary.windowHours} h</p></div><div><p className="text-xs text-slate-400">Ticks</p><p className="mt-1 text-xl font-bold text-white">{simulation.data.summary.ticks}</p></div><div><p className="text-xs text-slate-400">Intentos</p><p className="mt-1 text-xl font-bold text-white">{simulation.data.summary.totalAttempts}</p></div><div><p className="text-xs text-slate-400">Claims únicos</p><p className="mt-1 text-xl font-bold text-emerald-100">{simulation.data.summary.uniqueClaims}</p></div><div><p className="text-xs text-slate-400">Duplicados omitidos</p><p className="mt-1 text-xl font-bold text-cyan-100">{simulation.data.summary.duplicateClaims}</p></div></div> : <p className="mt-4 text-sm text-slate-400">No hay reporte disponible; la vista no inventa métricas.</p>}<p className="mt-4 text-xs text-violet-100/65">Fuente: {simulation.data?.source ?? "pendiente"} · muestras visibles: {simulation.data?.sampleCount ?? 0} · restricciones: cron real, red pública, hardware y multiinstancia real no están incluidos.</p><div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => window.open("/api/trpc/admin.autonomySimulationExport?input=%7B%22json%22%3A%7B%22format%22%3A%22csv%22%7D%7D", "_blank", "noopener,noreferrer")} variant="outline" className="border-violet-200/20 bg-white/5 text-violet-100"><Download className="mr-2 h-4 w-4" /> Exportar simulación CSV</Button></div></section>

<section className="mt-6 grid gap-3">{filtered.map((item) => <article key={`${item.area}-${item.title}`} className="border border-white/10 bg-white/[.035] p-5"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><div className="flex flex-wrap items-center gap-2"><Badge className={`border ${statusStyle[item.status]}`}>{item.status}</Badge><Badge className="border border-white/10 bg-white/5 text-slate-300">{item.priority}</Badge><span className="text-xs uppercase tracking-[.14em] text-slate-500">{item.area}</span></div><h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{item.detail}</p></div><span className="text-xs text-slate-500">Evidencia en expediente</span></div></article>)}{filtered.length === 0 ? <p className="border border-white/10 p-8 text-center text-sm text-slate-400">No hay resultados con esos filtros.</p> : null}</section>

<footer className="mt-8 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">Corte del resumen: 27 de agosto de 2026 · Checkpoint base: `955b21ed` · Staging persistente y multiinstancia real permanecen pausados a pedido del propietario.</footer></div></main>;
}
