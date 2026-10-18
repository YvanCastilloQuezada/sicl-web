import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, ChevronDown, Download, FileCheck2, FileDown, FileText, LockKeyhole, Search, ShieldCheck, X } from "lucide-react";
import { MASTER_ORDER, MASTER_ORGANIGRAM, type ConstitutionalState } from "@/../../shared/milukitaMasterOrder";
import { trpc } from "@/lib/trpc";

const REVIEW_KEY = "milukita-constitutional-review-v1";
type Decision = "PENDING" | "HUMAN_APPROVED" | "HUMAN_REJECTED";
type GateFilter = "ALL" | "CONFIGURED" | "HUMAN_REQUIRED" | "BLOCKED_BY_FREEZE";

const stateCopy: Record<ConstitutionalState, string> = {
  EXISTING: "Existe y fue comprobado.",
  PARTIALLY_IMPLEMENTED: "Existe parcialmente y requiere consolidación.",
  SIMULATED: "Solo está disponible como simulación.",
  PROJECTION_ONLY: "Es una proyección, no una operación real.",
  READY: "Está preparado técnicamente, sin autorización externa.",
  EXTERNAL_REQUIRED: "Depende de proveedor, licencia o integración externa.",
  PLANNED: "Está definido para una fase futura.",
  NOT_IMPLEMENTED: "Está registrado, pero aún no cuenta con implementación operativa.",
  DISABLED: "Está explícitamente bloqueado para ejecución.",
  BLOCKED: "Está impedido por una regla técnica o constitucional.",
  HUMAN_REQUIRED: "Requiere decisión humana antes de continuar.",
};

function readDecision(): Decision {
  try {
    const value = window.localStorage.getItem(REVIEW_KEY);
    return value === "HUMAN_APPROVED" || value === "HUMAN_REJECTED" ? value : "PENDING";
  } catch {
    return "PENDING";
  }
}

function gateState(gate: string) {
  if (gate === "HUMAN_APPROVAL_IF_REQUIRED") return { label: "HUMAN REQUIRED", filter: "HUMAN_REQUIRED" as const, tone: "border-amber-300/25 bg-amber-300/10 text-amber-100" };
  if (gate === "EXECUTION") return { label: "BLOCKED BY FREEZE", filter: "BLOCKED_BY_FREEZE" as const, tone: "border-rose-300/25 bg-rose-300/10 text-rose-100" };
  return { label: "CONFIGURED", filter: "CONFIGURED" as const, tone: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100" };
}

function layerAuditState(layer: string): ConstitutionalState {
  if (layer === "MJP CORE") return "EXISTING";
  if (layer === "AUTHORITY BOUNDARY" || layer === "GOVERNANCE OS") return "HUMAN_REQUIRED";
  if (layer === "EXPERIENCE OS" || layer === "CONTENT OS" || layer === "BUSINESS OS") return "PARTIALLY_IMPLEMENTED";
  return "PLANNED";
}

export default function ConstitutionalContractReviewPanel() {
  const [decision, setDecision] = useState<Decision>(readDecision);
  const [comment, setComment] = useState("");
  const [selectedLayer, setSelectedLayer] = useState<string>(MASTER_ORGANIGRAM[0].layer);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [detailsLayer, setDetailsLayer] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [gateFilter, setGateFilter] = useState<GateFilter>("ALL");
  const [gateQuery, setGateQuery] = useState("");
  const [activeGate, setActiveGate] = useState<string | null>(null);
  const [pendingDecision, setPendingDecision] = useState<Exclude<Decision, "PENDING"> | null>(null);
  const detailCloseButtonRef = useRef<HTMLButtonElement>(null);
  const detailPanelRef = useRef<HTMLElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const detailCloseTimeoutRef = useRef<number | null>(null);
  const gateResultRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const reviewMutation = trpc.operations.reviewConstitutionalContract.useMutation({
    onSuccess: (_, variables) => {
      setDecision(variables.decision);
      window.localStorage.setItem(REVIEW_KEY, variables.decision);
      setPendingDecision(null);
      toast.success(variables.decision === "HUMAN_APPROVED" ? "Revisión humana registrada" : "Rechazo registrado", { description: "El contrato mantiene alcance documental y no concede autoridad sobre MJP CORE." });
    },
    onError: (error) => toast.error("No se pudo registrar la revisión", { description: error.message }),
  });
  const pdfMutation = trpc.operations.exportConstitutionalDecisionPdf.useMutation({
    onSuccess: (result) => {
      if (!result.url) {
        toast.error("No se pudo completar la descarga del PDF", { description: "El servidor no devolvió una URL segura para el resumen." });
        return;
      }
      const anchor = document.createElement("a");
      anchor.href = result.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.click();
      toast.success("Resumen PDF generado correctamente", { description: "La descarga se abrió en una pestaña segura y la exportación quedó auditada." });
    },
    onError: (error) => toast.error("Error al generar el resumen PDF", { description: error.message }),
  });

  const selected = useMemo(() => MASTER_ORGANIGRAM.find((group) => group.layer === selectedLayer) ?? MASTER_ORGANIGRAM[0], [selectedLayer]);
  const details = useMemo(() => MASTER_ORGANIGRAM.find((group) => group.layer === detailsLayer) ?? null, [detailsLayer]);
  const normalizedGateQuery = gateQuery.trim().toLowerCase();
  const visibleGates = useMemo(() => MASTER_ORDER.qualityGates.filter((gate) => (gateFilter === "ALL" || gateState(gate).filter === gateFilter) && (!normalizedGateQuery || gate.replaceAll("_", " ").toLowerCase().includes(normalizedGateQuery))), [gateFilter, normalizedGateQuery]);

  useEffect(() => {
    setActiveGate(visibleGates[0] ?? null);
  }, [visibleGates]);

  useEffect(() => () => {
    if (detailCloseTimeoutRef.current !== null) window.clearTimeout(detailCloseTimeoutRef.current);
  }, []);

  const submitDecision = (nextDecision: Exclude<Decision, "PENDING">) => {
    reviewMutation.mutate({ decision: nextDecision, comment: comment.trim() || undefined });
  };

  const downloadDecisionPdf = () => {
    if (!pendingDecision) return;
    pdfMutation.mutate({ decision: pendingDecision, comment: comment.trim() || undefined });
  };

  const openDetails = (layer: string) => {
    if (detailCloseTimeoutRef.current !== null) {
      window.clearTimeout(detailCloseTimeoutRef.current);
      detailCloseTimeoutRef.current = null;
    }
    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedLayer(layer);
    setDetailsLayer(layer);
    window.requestAnimationFrame(() => setDetailsOpen(true));
  };

  const closeDetails = () => {
    if (!detailsLayer || !detailsOpen) return;
    setDetailsOpen(false);
    const closeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
    detailCloseTimeoutRef.current = window.setTimeout(() => {
      setDetailsLayer(null);
      detailCloseTimeoutRef.current = null;
      lastFocusedElementRef.current?.focus();
    }, closeDelay);
  };

  useEffect(() => {
    if (!details || !detailsOpen) return;
    const frame = window.requestAnimationFrame(() => detailCloseButtonRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [details, detailsOpen]);

  const handleDetailsKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetails();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = detailPanelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if ((!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  };

  const handleGateResultKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!normalizedGateQuery || visibleGates.length < 2) return;
    const isNext = event.key === "ArrowDown" || event.key === "ArrowRight";
    const isPrevious = event.key === "ArrowUp" || event.key === "ArrowLeft";
    if (!isNext && !isPrevious && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? visibleGates.length - 1 : (index + (isNext ? 1 : -1) + visibleGates.length) % visibleGates.length;
    const nextGate = visibleGates[nextIndex];
    setActiveGate(nextGate);
    gateResultRefs.current[nextGate]?.focus();
  };

  return <section className="mt-6 border border-amber-200/15 bg-amber-200/[.04] p-6" aria-labelledby="constitutional-review-title">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Badge className="border border-amber-200/25 bg-amber-200/10 text-amber-100"><FileCheck2 className="mr-1.5 h-3.5 w-3.5" /> HUMAN AUTHORITY · CONSTITUTIONAL REVIEW</Badge>
        <h2 id="constitutional-review-title" className="mt-3 text-2xl font-black text-white">Contrato constitucional actualizado</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Revisa la Orden Maestra, sus estados y sus límites. Esta acción solo registra una revisión humana auditable; no activa experiencias, agentes, distribución externa ni cambios en MJP CORE.</p>
      </div>
      <Badge className={decision === "HUMAN_APPROVED" ? "border border-emerald-300/25 bg-emerald-300/10 text-emerald-100" : decision === "HUMAN_REJECTED" ? "border border-rose-300/25 bg-rose-300/10 text-rose-100" : "border border-amber-300/25 bg-amber-300/10 text-amber-100"}>{decision}</Badge>
    </div>

    <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
      <div className="border border-white/10 bg-black/20 p-5">
        <p className="text-xs uppercase tracking-[.14em] text-amber-100">{MASTER_ORDER.id}</p>
        <h3 className="mt-2 text-lg font-bold text-white">{MASTER_ORDER.title}</h3>
        <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
          <div><dt className="text-slate-500">Definición estratégica</dt><dd className="mt-1 text-slate-200">{MASTER_ORDER.strategicDefinition}</dd></div>
          <div><dt className="text-slate-500">Modo</dt><dd className="mt-1 text-slate-200">{MASTER_ORDER.mode}</dd></div>
          <div><dt className="text-slate-500">Política de expansión</dt><dd className="mt-1 text-slate-200">{MASTER_ORDER.expansionPolicy}</dd></div>
          <div><dt className="text-slate-500">Prioridades</dt><dd className="mt-1 text-slate-200">{MASTER_ORDER.priorities.join(" · ")}</dd></div>
        </dl>
        <div className="mt-5 flex items-start gap-3 border border-rose-200/15 bg-rose-200/[.05] p-3"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-rose-200" /><p className="text-xs leading-5 text-rose-100">MJP CORE permanece protegido: {MASTER_ORDER.protectedCore.join(" · ")}. La revisión no modifica ninguna de estas superficies.</p></div>
        <Textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1000} aria-label="Comentario de revisión constitucional" placeholder="Comentario opcional de la revisión humana" className="mt-4 min-h-20 border-white/10 bg-black/20 text-white placeholder:text-slate-600" />
        <div className="mt-3 flex flex-wrap gap-2"><Button type="button" className="gold-button" disabled={reviewMutation.isPending} onClick={() => setPendingDecision("HUMAN_APPROVED")}><CheckCircle2 className="mr-2 h-4 w-4" />{reviewMutation.isPending ? "Registrando…" : "Aprobar revisión"}</Button><Button type="button" variant="outline" disabled={reviewMutation.isPending} onClick={() => setPendingDecision("HUMAN_REJECTED")} className="border-rose-200/20 bg-rose-200/5 text-rose-100 hover:bg-rose-200/10 hover:text-rose-50">Rechazar revisión</Button></div>
      </div>

      <div className="border border-white/10 bg-black/20 p-5" aria-label="Estado de quality gates">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-cyan-100">Quality gates</p><p className="mt-1 text-xs text-slate-400">{visibleGates.length}/{MASTER_ORDER.qualityGates.length} controles visibles</p></div><ShieldCheck className="h-5 w-5 text-cyan-200" /></div>
        <label className="mt-4 flex items-center gap-2 border border-white/10 bg-black/20 px-3 py-2"><Search className="h-3.5 w-3.5 text-slate-500" /><span className="sr-only">Buscar quality gates por nombre</span><input value={gateQuery} onChange={(event) => setGateQuery(event.target.value)} placeholder="Buscar regla por nombre…" aria-label="Buscar quality gates por nombre" className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-500" /><button type="button" onClick={() => setGateQuery("")} disabled={!gateQuery} aria-label="Limpiar búsqueda de quality gates" className="inline-flex items-center gap-1 border border-white/10 px-2 py-1 text-[11px] font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/10 hover:text-white"><X className="h-3.5 w-3.5" /> Limpiar</button></label>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar quality gates por estado">{(["ALL", "CONFIGURED", "HUMAN_REQUIRED", "BLOCKED_BY_FREEZE"] as const).map((filter) => <Button key={filter} type="button" size="sm" variant="outline" aria-pressed={gateFilter === filter} onClick={() => setGateFilter(filter)} className={gateFilter === filter ? "border-cyan-200/40 bg-cyan-200/10 text-cyan-100" : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}>{filter === "ALL" ? `Todos (${MASTER_ORDER.qualityGates.length})` : filter === "CONFIGURED" ? "Configurados" : filter === "HUMAN_REQUIRED" ? "Aprobación" : "Bloqueados"}</Button>)}</div>
        <p className="mt-3 text-[11px] text-slate-500" aria-live="polite">{normalizedGateQuery && visibleGates.length > 1 ? "Usa ↑ ↓ ← →, Inicio o Fin para recorrer los resultados de búsqueda." : "Selecciona un filtro o busca una regla por nombre."}</p>
        <div className="mt-3 space-y-2" role="list" aria-label="Resultados de quality gates">{visibleGates.map((gate, index) => { const state = gateState(gate); const isActive = activeGate === gate; return <div key={gate} role="listitem"><button ref={(element) => { gateResultRefs.current[gate] = element; }} type="button" onFocus={() => setActiveGate(gate)} onKeyDown={(event) => handleGateResultKeyDown(event, index)} aria-current={isActive || undefined} className={`flex w-full items-center justify-between gap-3 border-b py-2 text-left text-xs outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 ${isActive ? "border-cyan-200/40 bg-cyan-200/[.06]" : "border-white/8 hover:bg-white/[.04]"}`}><span className="text-slate-300">{String(MASTER_ORDER.qualityGates.indexOf(gate) + 1).padStart(2, "0")} · {gate.replaceAll("_", " ")}</span><Badge className={state.tone}>{state.label}</Badge></button></div>; })}{!visibleGates.length ? <p className="py-3 text-xs text-slate-500">No hay gates que coincidan con la búsqueda y el filtro.</p> : null}</div>
      </div>
    </div>

    <div className="mt-5 border border-white/10 bg-black/20 p-5" aria-label="Mapa interactivo de estados constitucionales">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-violet-100">Mapa de estados</p><p className="mt-1 text-xs text-slate-400">Selecciona una capa; enfócala para ver su tooltip y abre sus detalles desde allí.</p></div><Badge className="border border-white/10 bg-white/5 text-slate-300">Solo lectura</Badge></div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[.9fr_1.1fr]">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">{MASTER_ORGANIGRAM.map((group, index) => <div key={group.layer} className="relative" onMouseEnter={() => setHoveredLayer(group.layer)} onMouseLeave={() => setHoveredLayer(null)}><button type="button" onClick={() => setSelectedLayer(group.layer)} onFocus={() => setHoveredLayer(group.layer)} onBlur={() => setHoveredLayer(null)} aria-pressed={selectedLayer === group.layer} aria-describedby={hoveredLayer === group.layer ? `constitutional-layer-tooltip-${index}` : undefined} className={`flex w-full items-center justify-between gap-3 border px-3 py-3 text-left transition-colors ${selectedLayer === group.layer ? "border-cyan-200/40 bg-cyan-200/10" : "border-white/10 bg-white/[.02] hover:bg-white/[.06]"}`}><span className="text-xs font-bold text-white">{String(index + 1).padStart(2, "0")} · {group.layer}</span><ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${selectedLayer === group.layer ? "-rotate-90" : ""}`} /></button>{hoveredLayer === group.layer ? <span id={`constitutional-layer-tooltip-${index}`} role="tooltip" className="pointer-events-auto absolute left-2 top-full z-20 mt-1 w-[min(92vw,22rem)] border border-cyan-200/25 bg-[#071a13] p-3 text-[11px] leading-5 text-slate-200 shadow-xl">{stateCopy[layerAuditState(group.layer)]} <span className="block text-slate-400">Unidades: {group.units.join(" · ")}</span><button type="button" onClick={() => openDetails(group.layer)} className="mt-2 inline-flex items-center gap-1 border border-cyan-200/25 bg-cyan-200/10 px-2 py-1 font-bold text-cyan-100 hover:bg-cyan-200/20" aria-label={`Expandir detalles de ${group.layer}`}><FileText className="h-3 w-3" /> Expandir detalles</button></span> : null}</div>)}</div>
        <div className="border border-cyan-200/15 bg-cyan-200/[.04] p-5"><p className="text-xs uppercase tracking-[.14em] text-cyan-100">Capa seleccionada</p><h3 className="mt-2 text-xl font-black text-white">{selected.layer}</h3><p className="mt-3 text-xs leading-5 text-slate-400">{selected.layer === "MJP CORE" ? "Frontera autoritativa del juego y la integridad." : "Capa constitucional informativa; sus unidades no adquieren autoridad por aparecer aquí."}</p><div className="mt-4 flex flex-wrap gap-2">{selected.units.map((unit) => <Badge key={unit} className="border border-white/10 bg-white/5 text-slate-200">{unit}</Badge>)}</div>{selected.layer === "MJP CORE" ? <p className="mt-5 text-xs font-bold text-rose-100">Estado: PROTECTED · acceso de agentes: NONE</p> : <p className="mt-5 text-xs font-bold text-amber-100">Estado: revisión constitucional / no autoriza ejecución</p>}</div>
      </div>
      {details ? <><div className={`constitutional-details-backdrop fixed inset-0 z-40 bg-black/60 ${detailsOpen ? "is-open" : ""}`} aria-hidden="true" onClick={closeDetails} /><aside ref={detailPanelRef} className={`constitutional-details-panel fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-violet-200/20 bg-[#0b2118] p-6 shadow-2xl ${detailsOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label={`Detalles de la capa ${details.layer}`} onKeyDown={handleDetailsKeyDown}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-violet-100">Panel lateral de detalle</p><h3 className="mt-1 text-xl font-black text-white">{details.layer}</h3></div><Button ref={detailCloseButtonRef} type="button" size="sm" variant="outline" onClick={closeDetails} aria-label="Cerrar panel de detalle" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">Cerrar</Button></div><p className="mt-5 text-sm leading-6 text-slate-300">{stateCopy[layerAuditState(details.layer)]}</p><div className="mt-4 flex flex-wrap gap-2">{details.units.map((unit) => <Badge key={unit} className="border border-white/10 bg-white/5 text-slate-200">{unit}</Badge>)}</div><p className="mt-5 text-xs font-bold text-amber-100">Esta capa es informativa y no puede autorizar ejecución ni modificar MJP CORE.</p></aside></> : null}
    </div>

    <Dialog open={pendingDecision !== null} onOpenChange={(open) => { if (!open && !reviewMutation.isPending && !pdfMutation.isPending) setPendingDecision(null); }}>
      <DialogContent className="border-white/10 bg-[#0b2118] text-white">
        <DialogHeader><DialogTitle className="text-white">Confirmar {pendingDecision === "HUMAN_APPROVED" ? "aprobación" : "rechazo"} documental</DialogTitle><DialogDescription className="text-slate-300">Verifica el resumen antes de registrar la decisión humana en Event Store.</DialogDescription></DialogHeader>
        <div className="space-y-3 border border-white/10 bg-black/20 p-4 text-sm"><p><strong className="text-cyan-100">Contrato:</strong> {MASTER_ORDER.id}</p><p><strong className="text-cyan-100">Decisión:</strong> {pendingDecision ?? "PENDING"}</p><p><strong className="text-cyan-100">Alcance:</strong> revisión documental únicamente.</p><p><strong className="text-cyan-100">No se habilita:</strong> MJP CORE, experiencias deshabilitadas, agentes, distribución externa ni dinero real.</p><p><strong className="text-cyan-100">Comentario:</strong> {comment.trim() || "Sin comentario"}</p></div>
        <DialogFooter><Button type="button" variant="outline" aria-busy={pdfMutation.isPending} disabled={reviewMutation.isPending || pdfMutation.isPending} onClick={downloadDecisionPdf} className="border-cyan-200/25 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/20 hover:text-white">{pdfMutation.isPending ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-cyan-100/30 border-t-cyan-100" aria-hidden="true" /><span role="status" aria-live="polite">Generando PDF…</span></> : <><Download className="mr-2 h-4 w-4" />Descargar resumen PDF</>}</Button><Button type="button" variant="outline" disabled={reviewMutation.isPending || pdfMutation.isPending} onClick={() => setPendingDecision(null)} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">Cancelar</Button><Button type="button" disabled={!pendingDecision || reviewMutation.isPending || pdfMutation.isPending} onClick={() => { if (pendingDecision) submitDecision(pendingDecision); }} className={pendingDecision === "HUMAN_APPROVED" ? "gold-button" : "bg-rose-700 text-white hover:bg-rose-600"}>{reviewMutation.isPending ? "Registrando…" : `Confirmar ${pendingDecision === "HUMAN_APPROVED" ? "aprobación" : "rechazo"}`}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </section>;
}
