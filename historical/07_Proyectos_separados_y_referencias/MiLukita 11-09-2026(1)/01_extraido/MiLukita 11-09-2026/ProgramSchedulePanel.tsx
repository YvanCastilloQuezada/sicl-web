import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CheckCircle2, Filter, TriangleAlert } from "lucide-react";

const candidates = [
  { gameId: "loteria_39", title: "Lotería 39", frequencyPerWeek: 5, durationMinutes: 5, priority: "HIGH" as const, primeTime: true, minGapMinutes: 120, category: "lottery" },
  { gameId: "bingo_75", title: "Bingo Americano", frequencyPerWeek: 3, durationMinutes: 5, priority: "NORMAL" as const, primeTime: false, minGapMinutes: 60, category: "bingo" },
  { gameId: "pick_3", title: "Loto 3", frequencyPerWeek: 7, durationMinutes: 3, priority: "NORMAL" as const, primeTime: false, minGapMinutes: 30, category: "rapid" },
];

type BlockFilter = "all" | "needs_approval" | "ready_review";

export default function ProgramSchedulePanel({ isOperator }: { isOperator: boolean }) {
  const [hours, setHours] = useState(4);
  const [filter, setFilter] = useState<BlockFilter>("all");
  const startAt = useMemo(() => Date.now(), []);
  const proposal = trpc.operations.scheduleProposal.useQuery({ startAt, hours, candidates }, { enabled: isOperator });
  const blocks = useMemo(() => {
    const all = proposal.data?.blocks ?? [];
    if (filter === "all") return all;
    if (filter === "needs_approval") return all;
    return all.filter(() => !(proposal.data?.conflicts?.length));
  }, [filter, proposal.data]);
  if (!isOperator) return null;
  return <section className="mt-7 rounded-[2rem] border border-indigo-200/15 bg-[#11152b] p-6 sm:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="eyebrow text-indigo-200">Event Engine · Scheduler</p><h2 className="font-display mt-2 text-3xl text-white">Programación revisable</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Propone bloques sin publicar automáticamente. El operador revisa conflictos y conserva el control.</p></div><CalendarClock className="h-6 w-6 text-indigo-200" /></div>
    <div className="mt-5 flex flex-wrap items-center gap-3"><label className="text-sm text-slate-300" htmlFor="schedule-hours">Ventana</label><select id="schedule-hours" value={hours} onChange={(event) => setHours(Number(event.target.value))} className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white"><option value={2}>2 horas</option><option value={4}>4 horas</option><option value={8}>8 horas</option></select><span className="text-xs text-amber-200">Modo propuesta · no publicado</span></div>
    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4"><Filter className="h-4 w-4 text-indigo-200" /><span className="text-xs uppercase tracking-[.12em] text-slate-400">Filtrar bloques</span>{(["all", "needs_approval", "ready_review"] as BlockFilter[]).map((option) => <Button key={option} type="button" size="sm" variant="outline" onClick={() => setFilter(option)} className={filter === option ? "border-amber-200/40 bg-amber-200/15 text-amber-50" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"}>{option === "all" ? "Todos" : option === "needs_approval" ? "Requieren aprobación" : "Sin conflicto"}</Button>)}<span className="text-xs text-slate-500">{blocks.length} bloque(s)</span></div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">{blocks.map((block) => <div key={block.blockId} className="border border-white/10 bg-white/5 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-white">{block.title}</p><p className="text-xs text-slate-400">{new Date(block.startsAt).toLocaleTimeString()} – {new Date(block.endsAt).toLocaleTimeString()}</p></div><Badge className="border border-amber-200/30 bg-amber-200/10 text-amber-100 hover:bg-amber-200/10">Requiere aprobación</Badge></div><div className="mt-3 flex flex-wrap gap-2">{block.items.map((item, index) => <span key={`${block.blockId}-${index}`} className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-300">{item.kind}{item.gameId ? ` · ${item.gameId}` : ""}</span>)}</div></div>)}{!blocks.length && <p className="border border-dashed border-white/10 p-4 text-sm text-slate-400">No hay bloques que coincidan con el filtro actual.</p>}{proposal.data?.conflicts.map((conflict) => <div key={conflict} className="border border-amber-200/20 bg-amber-200/5 p-4 text-sm text-amber-100"><TriangleAlert className="mb-2 h-4 w-4" />{conflict}</div>)}</div>
    <div className="mt-5 flex flex-wrap items-center gap-3"><Button variant="outline" className="border-indigo-200/20 bg-indigo-200/5 text-indigo-100 hover:bg-indigo-200/10 hover:text-white" onClick={() => proposal.refetch()}>Regenerar propuesta</Button><p className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-200" />Ningún bloque se publica sin aprobación humana.</p></div>
  </section>;
}
