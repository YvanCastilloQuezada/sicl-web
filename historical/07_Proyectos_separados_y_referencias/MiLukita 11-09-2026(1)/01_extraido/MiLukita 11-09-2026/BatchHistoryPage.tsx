import PilotLayout from "@/components/PilotLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Download, FileCheck2, Filter, History } from "lucide-react";
import { useState } from "react";

const gameFilters = [
  { value: "", label: "Todos los juegos" },
  { value: "ruleta", label: "Ruleta" },
  { value: "jackpot", label: "Jackpot" },
  { value: "bingo", label: "Bingo" },
  { value: "loteria_19", label: "Lotería 19" },
  { value: "loteria_29", label: "Lotería 29" },
  { value: "loteria_39", label: "Lotería 39" },
  { value: "loteria_49", label: "Lotería 49" },
  { value: "loteria_59", label: "Lotería 59" },
  { value: "cartas", label: "Trío 13" },
];

const gameLabels: Record<string, string> = { ruleta: "Ruleta", jackpot: "Jackpot", bingo: "Bingo", loteria_19: "Lotería 19", loteria_29: "Lotería 29", loteria_39: "Lotería 39", loteria_49: "Lotería 49", loteria_59: "Lotería 59", cartas: "Trío 13" };

export default function BatchHistoryPage() {
  const { isAuthenticated } = useAuth();
  const [gameType, setGameType] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const batches = trpc.batches.mine.useQuery(gameType ? { gameType: gameType as "ruleta" | "jackpot" | "bingo" | "loteria_19" | "loteria_29" | "loteria_39" | "loteria_49" | "loteria_59" | "cartas" } : undefined, { enabled: isAuthenticated });
  const receipt = trpc.batches.receipt.useQuery({ batchPublicId: selectedBatchId ?? "LOT-PENDIENTE" }, { enabled: Boolean(selectedBatchId) && isAuthenticated });
  const exportReceipt = () => {
    if (!receipt.data) return;
    const content = JSON.stringify({ format: "mjp-virtual-batch-receipt-v1", exportedAt: new Date().toISOString(), ...receipt.data }, null, 2);
    const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${receipt.data.batchPublicId}-comprobante-virtual.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return <PilotLayout><main className="container py-9 sm:py-14"><section className="rounded-[2rem] border border-violet-200/20 bg-gradient-to-br from-[#1c1830] to-[#0a1813] p-7 sm:p-10"><Badge className="border border-violet-200/25 bg-violet-200/10 text-violet-100"><History className="mr-2 h-4 w-4" />HISTORIAL VERIFICABLE</Badge><p className="eyebrow mt-6">Lotes virtuales</p><h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">Tus lotes, comprobantes y hashes.</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">Cada lote confirma participaciones individuales. Los comprobantes exportados son JSON verificable del piloto y no contienen pagos, conversión monetaria ni datos de dinero real.</p></section>{!isAuthenticated ? <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-[#0a1b14] p-7 text-sm text-slate-300"><p>Inicia sesión para consultar tus lotes virtuales y descargar sus comprobantes.</p><Button onClick={() => startLogin()} className="gold-button mt-5">Ingresar al piloto</Button></section> : <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.95fr]"><article className="rounded-[1.7rem] border border-white/10 bg-[#0a1b14] p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Consulta</p><h2 className="font-display mt-1 text-3xl text-white">Lotes confirmados</h2></div><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-xs text-slate-200"><Filter className="h-4 w-4 text-violet-200" /><select value={gameType} onChange={(event) => { setGameType(event.target.value); setSelectedBatchId(null); }} className="bg-transparent text-xs text-white outline-none">{gameFilters.map((filter) => <option key={filter.value} value={filter.value} className="bg-[#0a1b14]">{filter.label}</option>)}</select></label></div><div className="mt-5 space-y-3">{batches.isLoading ? <p className="text-sm text-slate-300">Cargando historial…</p> : batches.data?.batches.length ? batches.data.batches.map((batch) => <button key={batch.publicId} type="button" onClick={() => setSelectedBatchId(batch.publicId)} className={`w-full rounded-xl border p-4 text-left ${selectedBatchId === batch.publicId ? "border-violet-200/50 bg-violet-200/10" : "border-white/10 bg-black/15 hover:border-white/25"}`}><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-xs text-violet-100">{batch.publicId}</p><p className="mt-1 font-bold text-white">{gameLabels[batch.gameType] ?? batch.gameType} · {batch.totalTickets} participaciones</p></div><p className="text-right text-sm font-black text-emerald-100">{batch.virtualCost} cr.<br /><span className="text-[11px] font-normal text-slate-400">{new Date(batch.createdAt).toLocaleString("es-PE")}</span></p></div></button>) : <p className="rounded-xl border border-white/10 bg-black/15 p-4 text-sm text-slate-300">No hay lotes que coincidan con este filtro.</p>}</div></article><aside className="rounded-[1.7rem] border border-cyan-200/15 bg-cyan-300/5 p-6"><p className="eyebrow text-cyan-100">Comprobante</p><h2 className="font-display mt-1 text-3xl text-white">Exportación verificable</h2>{receipt.isLoading ? <p className="mt-5 text-sm text-slate-300">Cargando comprobante…</p> : receipt.data ? <div className="mt-5"><div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-slate-200"><p className="font-mono text-cyan-100">{receipt.data.batchPublicId}</p><p className="mt-2">{receipt.data.totalTickets} participaciones · {receipt.data.virtualCost} créditos virtuales</p><p className="mt-2">{receipt.data.tickets.map((ticket) => `${ticket.publicId}: ${ticket.picks.join("·")}${ticket.extraPick ? ` + Extra ${ticket.extraPick}` : ""}`).join(" | ")}</p><p className="mt-2 text-slate-400">{receipt.data.virtualOnly ? "Solo créditos virtuales" : ""} · {receipt.data.noRealMoney ? "sin dinero real" : ""}</p></div><Button onClick={exportReceipt} className="gold-button mt-4 w-full"><Download className="mr-2 h-4 w-4" />Descargar JSON verificable</Button></div> : <div className="mt-5 rounded-xl border border-white/10 bg-black/15 p-5 text-sm leading-6 text-slate-300"><FileCheck2 className="mb-3 h-5 w-5 text-cyan-200" />Elige un lote a la izquierda para revisar y exportar sus comprobantes individuales.</div>}</aside></section>}</main></PilotLayout>;
}
