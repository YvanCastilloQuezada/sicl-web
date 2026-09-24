import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, GitBranch, RefreshCw, RotateCcw, ShieldCheck, SlidersHorizontal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  createDemoCandidates,
  createDesignFunnel,
  completeDeepEvaluation,
  promoteToFinalFour,
  selectForDevelopment,
  returnToFinalFour,
  setComparisonMode,
  type ComparisonMode,
  type DesignCandidate,
  type DesignFunnelState,
} from "@shared/arkiDesignFunnel";
import { estimateCandidateCost, markCostStale, recalculateCost, type CostDelta, type CostEstimate, type CostFidelity } from "@shared/arkiCostBudgetS2";

const PROJECT_ID = "DEMO-PROJECT";
const initialState = () => createDesignFunnel({ projectId: PROJECT_ID, candidates: createDemoCandidates(PROJECT_ID) });
const visualModes: Array<{ key: ComparisonMode; label: string }> = [
  { key: "PREVIEW", label: "Vista" },
  { key: "PLAN", label: "Planta" },
  { key: "3D", label: "3D" },
  { key: "SECTION", label: "Corte" },
  { key: "PROGRAM", label: "Programa" },
];

function displayId(candidateId: string, candidates: DesignCandidate[]) {
  const index = candidates.findIndex((candidate) => candidate.id === candidateId);
  return index >= 0 ? `P${index + 1}` : candidateId;
}

function fidelityFor(stage: DesignFunnelState["stage"]): CostFidelity {
  return stage === "DESIGN_EXPLORER_16" ? "RAPID_16" : stage === "FINALIST_4" || stage === "RETURNED_TO_FINALISTS" ? "DEEP_4" : "DEVELOPMENT_1";
}

function estimateFor(candidate: DesignCandidate, state: DesignFunnelState, revision: number): CostEstimate {
  return estimateCandidateCost({
    projectId: state.projectId,
    candidateId: candidate.id,
    generationId: state.generationId,
    areaM2: Number(candidate.metrics.area),
    location: "Trujillo",
    currency: "PEN",
    baseDate: "2026-09-24",
    designRevision: revision,
  }, fidelityFor(state.stage));
}

function Visual({ id, mode, large = false }: { id: string; mode: ComparisonMode; large?: boolean }) {
  return <div className={`relative overflow-hidden rounded-md border border-[#28445b] bg-[#071726] ${large ? "h-64" : "h-28"}`}>
    <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(rgba(212,255,58,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,255,58,.08) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
    <div className="absolute left-[18%] right-[18%] top-[22%] bottom-[20%] border border-[#d4ff3a]/70 bg-[#16324c]/75" />
    <div className="absolute left-[31%] right-[31%] top-[38%] bottom-[35%] border border-dashed border-[#f5aa56]/80" />
    <div className="absolute bottom-2 left-3 text-[10px] uppercase tracking-[.18em] text-[#d4ff3a]">{mode === "PREVIEW" ? "Arquitectura" : mode}</div>
    <div className="absolute right-3 top-2 text-xs font-semibold text-[#d7e8f2]">{id}</div>
  </div>;
}

function Status({ state }: { state: DesignFunnelState }) {
  const summary = useMemo(() => ({
    explorer: state.candidates.filter((candidate) => candidate.stage === "SURVIVOR").length,
    finalists: state.candidates.filter((candidate) => candidate.stage === "FINALIST_4").length,
    archived: state.candidates.filter((candidate) => candidate.stage === "ARCHIVED").length,
  }), [state]);
  return <div className="flex flex-wrap items-center gap-2 text-xs text-[#9eb5c4]">
    <span className="rounded border border-[#28445b] px-2 py-1">N → 16 → 4 → 1</span>
    <span>Exploración: {summary.explorer || 16}</span><span>Final Four: {summary.finalists}</span><span>Archivadas: {summary.archived}</span>
    <span className="text-[#d4ff3a]">{state.waitState === "NONE" ? state.stage : state.waitState}</span>
  </div>;
}

function CostPanel({ state, revision, activeId, onSelect }: { state: DesignFunnelState; revision: number; activeId?: string; onSelect: (id: string) => void }) {
  const candidates = state.candidates.filter((candidate) => candidate.stage === "SURVIVOR" || candidate.stage === "FINALIST_4" || candidate.stage === "SELECTED_FOR_DEVELOPMENT");
  const fidelity = fidelityFor(state.stage);
  const target = fidelity === "RAPID_16" ? "≤ ±10% objetivo" : fidelity === "DEEP_4" ? "≤ ±5% objetivo" : "≤ ±2% objetivo";
  return <Card className="border-[#28445b] bg-[#0b2031] p-4">
    <div className="text-xs uppercase tracking-[.18em] text-[#d4ff3a]">COSTOS / FINANZAS · {fidelity}</div>
    <h2 className="mt-1 text-lg font-semibold">Comparación económica</h2>
    <p className="mt-2 text-xs leading-5 text-[#9eb5c4]">{target}. La incertidumbre mostrada es la demostrada por el modelo, no una precisión fabricada.</p>
    <div className="mt-4 space-y-2">
      {candidates.slice(0, fidelity === "RAPID_16" ? 16 : 4).map((candidate) => {
        const estimate = estimateFor(candidate, state, revision);
        const label = displayId(candidate.id, state.candidates);
        return <button type="button" key={candidate.id} onClick={() => onSelect(candidate.id)} className={`w-full rounded border p-3 text-left transition ${candidate.id === activeId ? "border-[#d4ff3a] bg-[#132b3f]" : "border-[#28445b] bg-[#071726] hover:border-[#7893af]"}`}>
          <div className="flex items-center justify-between gap-2"><span className="font-semibold text-[#edf4ff]">{label}</span><span className="text-sm text-[#d4ff3a]">S/ {estimate.centralEstimate.toLocaleString("es-PE")}</span></div>
          <div className="mt-1 text-[11px] text-[#9eb5c4]">Rango S/ {estimate.lowEstimate.toLocaleString("es-PE")}–{estimate.highEstimate.toLocaleString("es-PE")} · ±{Math.round(estimate.contingency * 100)}% · {estimate.epistemicState}</div>
          {estimate.unknowns.length > 0 && <div className="mt-2 flex gap-1 text-[10px] text-[#f5aa56]"><AlertTriangle className="size-3" />{estimate.unknowns.join(" · ")}</div>}
        </button>;
      })}
    </div>
    <div className="mt-4 border-t border-[#28445b] pt-3 text-[11px] text-[#718b9a]">ESTIMACIÓN ≠ PRESUPUESTO FINAL · UNKNOWN ≠ CERO</div>
  </Card>;
}

function Inspector({ candidate, state, revision, lastDelta }: { candidate?: DesignCandidate; state: DesignFunnelState; revision: number; lastDelta?: CostDelta }) {
  if (!candidate) return <Card className="border-[#28445b] bg-[#0b2031] p-4 text-sm text-[#9eb5c4]">Selecciona una propuesta para inspeccionar su contexto.</Card>;
  const estimate = estimateFor(candidate, state, revision);
  return <Card className="border-[#28445b] bg-[#0b2031] p-4">
    <div className="text-xs uppercase tracking-[.18em] text-[#d4ff3a]">Inspector contextual · {displayId(candidate.id, state.candidates)}</div>
    <h2 className="mt-1 text-xl font-semibold">{candidate.title}</h2>
    <div className="mt-3 grid gap-2 text-sm text-[#b8cbe0]"><div><span className="text-[#7893af]">Estrategia:</span> {candidate.strategy}</div><div><span className="text-[#7893af]">Estado:</span> {candidate.stage} · {candidate.status}</div><div><span className="text-[#7893af]">Área:</span> {String(candidate.metrics.area)} m²</div><div><span className="text-[#7893af]">Eficiencia:</span> {String(candidate.metrics.efficiency)}</div></div>
    <div className="mt-4 border-t border-[#28445b] pt-3"><div className="text-xs uppercase tracking-[.16em] text-[#d4ff3a]">Economía disponible</div><div className="mt-2 text-lg text-[#edf4ff]">S/ {estimate.centralEstimate.toLocaleString("es-PE")}</div><div className="text-xs text-[#9eb5c4]">Rango S/ {estimate.lowEstimate.toLocaleString("es-PE")}–{estimate.highEstimate.toLocaleString("es-PE")} · {estimate.epistemicState}</div></div>
    {lastDelta && <div className="mt-4 rounded border border-[#f5aa56]/50 bg-[#2b2118] p-3 text-xs text-[#f6d3aa]"><div className="font-semibold">CostDelta trazado</div><div className="mt-1">{lastDelta.absoluteDelta >= 0 ? "+" : ""}S/ {lastDelta.absoluteDelta.toLocaleString("es-PE")} {lastDelta.percentageDelta === null ? "" : `(${lastDelta.percentageDelta}%)`}</div><div className="mt-1 text-[#d7b58d]">Cambio: {lastDelta.designChangeRefs.join(" · ")}</div></div>}
    <div className="mt-4 grid gap-3 text-xs"><div><div className="mb-1 text-[#7893af]">UNKNOWNs</div>{candidate.unknowns.length ? candidate.unknowns.join(" · ") : "No registrado en esta etapa."}</div><div><div className="mb-1 text-[#7893af]">Evidencia</div>{candidate.evidence.join(" · ")}</div><div><div className="mb-1 text-[#7893af]">Provenance interna</div>{candidate.provenance.join(" · ")}</div></div>
  </Card>;
}

export default function ArkiDesignFunnelPage() {
  const [state, setState] = useState<DesignFunnelState>(() => initialState());
  const [selected, setSelected] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string>("A01");
  const [mode, setMode] = useState<ComparisonMode>("PREVIEW");
  const [notice, setNotice] = useState("Selección humana requerida. ARKI no elige ganadores automáticamente.");
  const [reason, setReason] = useState("");
  const [revision, setRevision] = useState(1);
  const [lastDelta, setLastDelta] = useState<CostDelta>();
  const visible = state.stage === "DESIGN_EXPLORER_16" ? state.candidates : state.candidates.filter((candidate) => candidate.stage === "FINALIST_4" || candidate.stage === "SELECTED_FOR_DEVELOPMENT" || candidate.stage === "BLOCKED");
  const active = state.candidates.find((candidate) => candidate.id === activeId) ?? visible[0];

  const activate = (id: string) => {
    setActiveId(id);
    if (state.stage === "DESIGN_EXPLORER_16") {
      setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 4 ? current : [...current, id]);
    }
  };
  const promote = () => { try { setState(promoteToFinalFour(state, selected, "HUMAN_ARCHITECT", reason)); setSelected([]); setActiveId(selected[0] ?? "A01"); setNotice("4 candidatos promovidos. Las otras 12 permanecen preservadas y comenzó la evaluación profunda."); } catch (error) { setNotice(error instanceof Error ? error.message : "No se pudo promover la selección"); } };
  const evaluate = () => { const ids = state.candidates.filter((candidate) => candidate.stage === "FINALIST_4").map((candidate) => candidate.id); const results = Object.fromEntries(ids.map((id) => [id, { status: "READY", findings: ["Comparación geométrica, programática y económica disponible"], unknowns: ["Precios requieren fuente de mercado o cotización"] }])); setState(completeDeepEvaluation(state.stage === "RETURNED_TO_FINALISTS" ? { ...state, stage: "FINALIST_4" } : state, results as never)); setNotice("Evaluación profunda completada. La decisión sigue siendo humana."); };
  const selectOne = () => { try { setState(selectForDevelopment(state, activeId, "HUMAN_ARCHITECT", reason)); setSelected([]); setNotice(`${displayId(activeId, state.candidates)} quedó en SELECTED_FOR_DEVELOPMENT. Los otros finalistas siguen recuperables.`); } catch (error) { setNotice(error instanceof Error ? error.message : "Selecciona un candidato"); } };
  const restore = () => { try { setState(returnToFinalFour(state, "Reconsideración humana / fallo técnico reversible")); setSelected([]); setNotice("Retorno reversible al Final Four ejecutado. No se eliminó la exploración."); } catch (error) { setNotice(error instanceof Error ? error.message : "No hay Final Four archivado para restaurar"); } };
  const changeMode = (next: ComparisonMode) => { setMode(next); setState(setComparisonMode(state, next)); };
  const recalculate = () => { if (!active) return; const current = estimateFor(active, state, revision); const stale = markCostStale(current, "Geometry revision changed by human action"); const nextInput = { projectId: state.projectId, candidateId: active.id, generationId: state.generationId, areaM2: Number(active.metrics.area) + 250, location: "Trujillo", currency: "PEN", baseDate: "2026-09-24", designRevision: revision + 1 }; const result = recalculateCost(stale, nextInput, fidelityFor(state.stage)); setLastDelta(result.delta); setRevision((value) => value + 1); setNotice(`La estimación anterior quedó STALE y se generó un CostDelta para ${displayId(active.id, state.candidates)}. La versión anterior permanece preservada.`); };

  return <main className="min-h-screen bg-[#061522] px-4 py-5 text-[#d7e8f2] md:px-8"><header className="mx-auto max-w-[1500px] border-b border-[#28445b] pb-4"><div className="flex items-center justify-between gap-4"><div><div className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#d4ff3a]">ARKI · Arquitectura predictiva S1 + S2</div><h1 className="mt-1 text-2xl font-semibold tracking-tight">Embudo de diseño</h1><p className="text-sm text-[#9eb5c4]">Global a la izquierda · arquitectura al centro · detalle contextual a la derecha.</p></div><Badge className="border-[#d4ff3a]/40 bg-[#102538] text-[#d4ff3a]">MANIAC · fail-closed</Badge></div><div className="mt-4"><Status state={state} /></div></header><section className="mx-auto mt-5 grid max-w-[1500px] gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]"><aside><CostPanel state={state} revision={revision} activeId={active?.id} onSelect={activate} /></aside><section className="min-w-0"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-[#9eb5c4]"><GitBranch className="size-4 text-[#d4ff3a]" />Arquitectura / {state.stage}</div><div className="flex flex-wrap gap-1">{visualModes.map((item) => <Button key={item.key} size="sm" variant={mode === item.key ? "default" : "outline"} onClick={() => changeMode(item.key)}>{item.label}</Button>)}</div></div><div className={`grid gap-3 ${state.stage === "DESIGN_EXPLORER_16" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-2"}`}>{visible.map((candidate) => { const activeCard = candidate.id === active?.id; const label = displayId(candidate.id, state.candidates); return <Card key={candidate.id} onClick={() => activate(candidate.id)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(candidate.id); } }} aria-label={`Activar ${label}`} className={`cursor-pointer overflow-hidden border-[#28445b] bg-[#0b2031] p-2 ${activeCard ? "ring-2 ring-[#d4ff3a]" : "hover:border-[#7893af]"}`}><Visual id={label} mode={mode} large={state.stage !== "DESIGN_EXPLORER_16"} /></Card>; })}</div></section><aside className="space-y-3"><Inspector candidate={active} state={state} revision={revision} lastDelta={lastDelta} /><Card className="border-[#28445b] bg-[#0b2031] p-4"><div className="flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="size-4 text-[#d4ff3a]" />Decisión humana</div><p className="mt-2 text-sm text-[#9eb5c4]">{notice}</p><label className="mt-3 block text-xs text-[#9eb5c4]">Razón opcional</label><textarea value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 min-h-20 w-full rounded border border-[#28445b] bg-[#071726] p-2 text-sm outline-none focus:border-[#d4ff3a]" placeholder="Puedes omitirla" />{state.stage === "DESIGN_EXPLORER_16" && <Button className="mt-3 w-full" disabled={selected.length !== 4} onClick={promote}>Promover 4 <ChevronRight /></Button>}{(state.stage === "FINALIST_4" || state.stage === "RETURNED_TO_FINALISTS") && <><Button className="mt-3 w-full" variant="secondary" onClick={evaluate}>Ejecutar evaluación profunda</Button><Button className="mt-2 w-full" disabled={!active} onClick={selectOne}>Seleccionar para desarrollo</Button></>}{state.stage === "SELECTED_FOR_DEVELOPMENT" && <><Button className="mt-3 w-full" variant="outline" onClick={recalculate}><RefreshCw /> Propagar geometría y recalcular</Button><Button className="mt-2 w-full" variant="outline" onClick={restore}><RotateCcw /> Volver al Final Four</Button></>}<div className="mt-4 border-t border-[#28445b] pt-3 text-xs text-[#9eb5c4]"><div className="flex justify-between"><span>Propuestas seleccionadas</span><strong className="text-[#d4ff3a]">{selected.length} / {state.stage === "DESIGN_EXPLORER_16" ? 4 : 1}</strong></div><div className="mt-2 flex items-center gap-2"><ShieldCheck className="size-4 text-[#d4ff3a]" />Sin ganador automático</div></div></Card><Card className="border-[#28445b] bg-[#0b2031] p-4"><div className="text-xs uppercase tracking-[.18em] text-[#d4ff3a]">Historial</div><div className="mt-3 space-y-2 text-xs text-[#9eb5c4]">{state.events.slice(-5).map((event) => <div key={event.eventId} className="border-l border-[#d4ff3a]/50 pl-2"><div className="text-[#d7e8f2]">{event.type}</div><div>{"candidateIds" in event ? event.candidateIds.join(", ") : event.selectedCandidateIds.join(", ")}</div></div>)}</div></Card></aside></section><footer className="mx-auto mt-5 flex max-w-[1500px] items-center gap-2 text-xs text-[#718b9a]"><ArrowLeft className="size-3" />Los costos son estimaciones trazables; no sustituyen expediente, cotización, cálculo ni firma profesional.</footer></main>;
}
