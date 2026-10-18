import PilotLayout from "@/components/PilotLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, ArrowUpRight, BookOpenCheck, Check, Clock3, LockKeyhole, Scale, ShieldCheck, Sparkles, TicketCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const blockedThemes = ["política y elecciones", "leyes o decisiones públicas", "finanzas y criptoactivos", "salud individual", "violencia, tragedias y menores"];

export default function MultiMarketPage() {
  const { isAuthenticated } = useAuth();
  const [contracts, setContracts] = useState(1);
  const [batchMarketPublicId, setBatchMarketPublicId] = useState<string | null>(null);
  const [batchManuals, setBatchManuals] = useState<Array<{ side: "yes" | "no"; copies: number }>>([]);
  const [batchCopies, setBatchCopies] = useState(1);
  const [randomPositionCount, setRandomPositionCount] = useState(0);
  const [batchPreview, setBatchPreview] = useState<{ publicId: string; selectionHash: string; signature: string; expiresAt: string; selections: Array<{ side: "yes" | "no"; unitCostCredits: number; source: "manual" | "random" }>; totalPositions: number; estimatedCost: number } | null>(null);
  const [batchReceipt, setBatchReceipt] = useState<{ batchPublicId: string; totalPositions: number; virtualCost: number } | null>(null);
  const marketsQuery = trpc.market.list.useQuery();
  const utils = trpc.useUtils();
  const batchPositionCount = batchManuals.reduce((total, item) => total + item.copies, 0) + randomPositionCount;
  const selectedBatchMarket = marketsQuery.data?.find((market) => market.publicId === batchMarketPublicId);

  const reserve = trpc.market.reserve.useMutation({
    onSuccess: (position) => {
      toast.success("Posición virtual confirmada", { description: `${position.publicId} · ${position.virtualCost} créditos virtuales.` });
      utils.market.list.invalidate();
      utils.wallet.summary.invalidate();
    },
    onError: (error) => toast.error("No se pudo registrar la posición", { description: error.message }),
  });
  const previewBatch = trpc.market.previewBatch.useMutation({
    onSuccess: (preview) => {
      setBatchPreview(preview);
      toast.success("Lote de posiciones previsualizado", { description: `Hash ${preview.selectionHash.slice(0, 12)}… · vence en 10 minutos.` });
    },
    onError: (error) => toast.error("No se pudo previsualizar el lote", { description: error.message }),
  });
  const confirmBatch = trpc.market.confirmBatchPreview.useMutation({
    onSuccess: (batch) => {
      setBatchReceipt(batch);
      setBatchPreview(null);
      setBatchManuals([]);
      setRandomPositionCount(0);
      setBatchMarketPublicId(null);
      utils.market.list.invalidate();
      utils.wallet.summary.invalidate();
      toast.success("Lote virtual confirmado", { description: `${batch.totalPositions} posiciones individuales · ${batch.virtualCost} créditos.` });
    },
    onError: (error) => toast.error("No se pudo confirmar el lote firmado", { description: error.message }),
  });

  const reservePosition = (marketPublicId: string, side: "yes" | "no") => {
    if (!isAuthenticated) {
      toast.message("Inicia sesión para participar", { description: "La cuenta protege tu saldo e historial virtual." });
      startLogin();
      return;
    }
    reserve.mutate({ marketPublicId, side, contracts, idempotencyKey: `market-${marketPublicId}-${side}-${Date.now()}-${Math.random().toString(16).slice(2)}` });
  };
  const addManualToBatch = (marketPublicId: string, side: "yes" | "no") => {
    if (!isAuthenticated) {
      toast.message("Inicia sesión para configurar un lote virtual.");
      startLogin();
      return;
    }
    if (batchMarketPublicId && batchMarketPublicId !== marketPublicId) {
      toast.error("Un lote de MultiMarket solo puede usar un mercado curado.");
      return;
    }
    if (batchPositionCount + batchCopies > 10) {
      toast.error("El lote admite un máximo de 10 posiciones virtuales.");
      return;
    }
    setBatchMarketPublicId(marketPublicId);
    setBatchManuals((current) => [...current, { side, copies: batchCopies }]);
    setBatchCopies(1);
    setBatchPreview(null);
  };
  const submitBatch = () => {
    if (!isAuthenticated) {
      toast.message("Inicia sesión para confirmar un lote virtual.");
      startLogin();
      return;
    }
    if (!batchMarketPublicId || !batchPositionCount || batchPositionCount > 10) {
      toast.error("Configura entre 1 y 10 posiciones para un único mercado curado.");
      return;
    }
    previewBatch.mutate({ marketPublicId: batchMarketPublicId, manual: batchManuals, randomCount: randomPositionCount });
  };

  return <PilotLayout><main className="container py-9 sm:py-14">
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-[#0a2023] p-6 sm:p-10">
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div><Badge className="border border-cyan-200/25 bg-cyan-200/10 px-3 py-1.5 text-cyan-100 hover:bg-cyan-200/10"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> MULTIMARKET · PILOTO VIRTUAL</Badge><p className="eyebrow mt-5">Predicciones curadas</p><h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">Explora escenarios, no arriesgues dinero.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Contratos fijos de <strong className="text-cyan-100">SÍ / NO</strong> con créditos virtuales. No existe intercambio entre usuarios, cotización real, retiro ni publicación automática de mercados.</p><Link href="/aprender?game=multimarket" className="mt-5 inline-flex items-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-2.5 text-sm font-bold text-emerald-50 hover:bg-emerald-300/20"><Sparkles className="mr-2 h-4 w-4" />Practicar resolución local</Link></div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><ShieldCheck className="h-6 w-6 text-emerald-300" /><p className="mt-4 text-sm font-bold text-white">Curaduría antes que volumen</p><p className="mt-2 text-sm leading-6 text-slate-300">Solo categorías culturales, educativas, tecnológicas o de entretenimiento con fuente y regla de resolución públicas.</p><a href="#criterios" className="mt-4 inline-flex items-center text-sm font-bold text-cyan-100 hover:text-white">Ver criterios <ArrowUpRight className="ml-1 h-4 w-4" /></a></div>
      </div>
    </section>

    <section className="mt-7 flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Mercados activos</p><h2 className="font-display mt-1 text-3xl text-white">Posiciones de prueba</h2></div><div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1"><Button variant="ghost" size="sm" onClick={() => setContracts((value) => Math.max(1, value - 1))} className="text-white hover:bg-white/10 hover:text-white">−</Button><span className="min-w-20 text-center text-sm font-bold text-white">{contracts} contrato{contracts > 1 ? "s" : ""}</span><Button variant="ghost" size="sm" onClick={() => setContracts((value) => Math.min(10, value + 1))} className="text-white hover:bg-white/10 hover:text-white">+</Button></div></section>

    <section className="mt-5 grid gap-5 lg:grid-cols-2">
      {marketsQuery.isLoading ? <div className="rounded-2xl border border-white/10 bg-white/4 p-7 text-sm text-slate-300">Cargando mercados curados…</div> : marketsQuery.data?.length ? marketsQuery.data.map((market) => {
        const batchLockedToOtherMarket = Boolean(batchMarketPublicId && batchMarketPublicId !== market.publicId);
        return <article key={market.publicId} className="rounded-[1.7rem] border border-white/10 bg-[#0b1d1b] p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><Badge className="border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/10">{market.category}</Badge><span className="flex items-center text-xs text-slate-400"><Clock3 className="mr-1.5 h-3.5 w-3.5" />Cierra {new Date(market.closesAt).toLocaleString("es-PE")}</span></div>
          <h3 className="font-display mt-5 text-2xl leading-tight text-white">{market.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{market.description}</p>
          <div className="mt-5 rounded-xl border border-white/8 bg-black/20 p-4 text-xs leading-5 text-slate-300"><p className="font-bold text-white">Regla de resolución</p><p className="mt-1">{market.resolutionRule}</p><a className="mt-2 inline-flex items-center font-semibold text-cyan-100 hover:text-white" href={market.sourceUrl} target="_blank" rel="noreferrer">Fuente: {market.sourceLabel} <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></a></div>
          <div className="mt-5 grid grid-cols-2 gap-3"><Button disabled={market.state !== "open" || reserve.isPending} onClick={() => reservePosition(market.publicId, "yes")} className="border border-emerald-300/25 bg-emerald-300/15 text-emerald-50 hover:bg-emerald-300/25">SÍ · {market.yesPriceCredits} cr.</Button><Button disabled={market.state !== "open" || reserve.isPending} onClick={() => reservePosition(market.publicId, "no")} variant="outline" className="border-rose-200/25 bg-rose-300/10 text-rose-50 hover:bg-rose-300/20">NO · {market.noPriceCredits} cr.</Button></div>
          <div className="mt-4 rounded-xl border border-violet-200/15 bg-violet-300/5 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-100">Lote firmado</p><p className="mt-1 text-[11px] leading-5 text-slate-300">Hasta 10 posiciones para este único mercado. Las copias SÍ/NO son deliberadas y el modo aleatorio elige una cara con probabilidad uniforme.</p></div><Badge className="border border-violet-200/20 bg-violet-200/10 text-violet-100">PRV</Badge></div><div className="mt-3 flex items-end gap-2"><label className="flex-1 text-[11px] text-slate-300">Copias<select value={batchCopies} disabled={batchLockedToOtherMarket} onChange={(event) => setBatchCopies(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-white/15 bg-[#0b1913] px-2 py-2 text-sm text-white">{Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label><Button size="sm" disabled={market.state !== "open" || batchLockedToOtherMarket} onClick={() => addManualToBatch(market.publicId, "yes")} className="border border-emerald-300/25 bg-emerald-300/15 text-emerald-50 hover:bg-emerald-300/25">Añadir SÍ</Button><Button size="sm" variant="outline" disabled={market.state !== "open" || batchLockedToOtherMarket} onClick={() => addManualToBatch(market.publicId, "no")} className="border-rose-200/25 bg-rose-300/10 text-rose-50 hover:bg-rose-300/20">Añadir NO</Button></div>{batchLockedToOtherMarket ? <p className="mt-2 text-[11px] text-amber-100/80">El lote actual está vinculado a otro mercado y no mezcla eventos.</p> : null}</div>
          <p className="mt-3 text-[11px] text-slate-500">Contrato virtual uniforme: 1 crédito por lado. Pago virtual por contrato acertado: {market.payoutCredits} cr. No representa una cotización ni garantiza probabilidad del evento.</p>
        </article>;
      }) : <div className="rounded-[1.7rem] border border-dashed border-cyan-200/20 bg-cyan-200/5 p-7 lg:col-span-2"><BookOpenCheck className="h-6 w-6 text-cyan-200" /><h3 className="font-display mt-4 text-2xl text-white">Aún no hay mercados abiertos</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">El piloto los publica únicamente tras verificar fuente, categoría permitida, cierre y regla de resolución. No se rellena esta sección con eventos inventados.</p></div>}
    </section>

    {batchMarketPublicId ? <section className="mt-7 rounded-[1.7rem] border border-violet-200/20 bg-gradient-to-br from-[#1a1730] to-[#0a1b14] p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow text-violet-100">Lote MultiMarket</p><h2 className="font-display mt-1 text-3xl text-white">{selectedBatchMarket?.title ?? batchMarketPublicId}</h2><p className="mt-2 text-sm leading-6 text-slate-300">Solo este mercado se incluirá en la firma y la confirmación. No hay compras automáticas ni dinero real.</p></div><Button variant="ghost" onClick={() => { setBatchMarketPublicId(null); setBatchManuals([]); setRandomPositionCount(0); setBatchPreview(null); }} className="text-slate-300 hover:bg-white/10 hover:text-white">Limpiar lote</Button></div><div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]"><div className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold text-white">Posiciones manuales</p><label className="text-xs text-slate-300">Aleatorias SÍ/NO<select value={randomPositionCount} onChange={(event) => { setRandomPositionCount(Number(event.target.value)); setBatchPreview(null); }} className="ml-2 rounded-lg border border-white/15 bg-[#0b1913] px-2 py-1.5 text-sm text-white">{Array.from({ length: 11 }, (_, index) => index).map((value) => <option key={value} value={value}>{value}</option>)}</select></label></div>{batchManuals.length ? <div className="mt-3 space-y-2">{batchManuals.map((item, index) => <div key={`${item.side}-${index}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs"><span className="text-slate-100">{item.copies}× posición {item.side === "yes" ? "SÍ" : "NO"}</span><button type="button" onClick={() => { setBatchManuals((current) => current.filter((_, position) => position !== index)); setBatchPreview(null); }} className="text-rose-200 hover:text-rose-100">Quitar</button></div>)}</div> : <p className="mt-3 text-sm text-slate-400">Añade una posición SÍ o NO desde la tarjeta del mercado.</p>}</div><div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm"><p className="text-slate-300">{batchPositionCount} posiciones configuradas</p><p className="mt-2 font-black text-white">{batchPreview ? batchPreview.estimatedCost : "—"} créditos estimados</p><p className="mt-2 text-[11px] leading-5 text-slate-400">El costo se fija en la previsualización y se verifica de nuevo al confirmar.</p></div></div>{batchPreview ? <div className="mt-5 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-4"><p className="font-bold text-emerald-100">Previsualización firmada · {batchPreview.totalPositions} posiciones</p><p className="mt-1 break-all font-mono text-[10px] text-emerald-100/75">Hash: {batchPreview.selectionHash}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{batchPreview.selections.map((item, index) => <p key={`${item.source}-${index}`} className="rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-xs text-slate-100">{index + 1}. {item.source === "random" ? "Aleatorio" : "Manual"} · {item.side === "yes" ? "SÍ" : "NO"} · {item.unitCostCredits} cr.</p>)}</div><Button disabled={confirmBatch.isPending} onClick={() => confirmBatch.mutate({ previewPublicId: batchPreview.publicId, idempotencyKey: `confirm-market-preview-${batchPreview.publicId}-${Date.now()}` })} className="gold-button mt-4 w-full"><TicketCheck className="mr-2 h-4 w-4" />{confirmBatch.isPending ? "Confirmando…" : "Confirmar lote firmado"}</Button></div> : <Button disabled={previewBatch.isPending || !batchPositionCount || batchPositionCount > 10} onClick={submitBatch} className="gold-button mt-5 w-full"><TicketCheck className="mr-2 h-4 w-4" />{previewBatch.isPending ? "Generando posiciones…" : "Previsualizar lote firmado"}</Button>}<p className="mt-3 text-[11px] leading-5 text-slate-400">Las posiciones aleatorias solo seleccionan SÍ/NO dentro del mercado curado elegido. La firma expira a los 10 minutos y no modifica la resolución del evento.</p></section> : null}

    {batchReceipt ? <section className="mt-5 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm text-emerald-50"><p className="flex items-center gap-2 font-bold"><Check className="h-4 w-4" />Lote virtual preparado</p><p className="mt-2 leading-6 text-emerald-100/80">{batchReceipt.batchPublicId} · {batchReceipt.totalPositions} posiciones individuales · {batchReceipt.virtualCost} créditos virtuales.</p></section> : null}

    <section id="criterios" className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-[1.7rem] border border-emerald-300/15 bg-emerald-300/5 p-6"><Scale className="h-5 w-5 text-emerald-300" /><h2 className="font-display mt-4 text-2xl text-white">Qué puede publicarse</h2><p className="mt-3 text-sm leading-6 text-slate-300">Un operador aprobado debe incluir fuente, fecha de cierre, resultado binario comprobable y enlace de resolución. Cada posición queda en el registro de auditoría.</p></div><div className="rounded-[1.7rem] border border-amber-200/15 bg-amber-200/5 p-6"><AlertTriangle className="h-5 w-5 text-amber-200" /><h2 className="font-display mt-4 text-2xl text-white">Qué queda excluido</h2><p className="mt-3 text-sm leading-6 text-slate-300">{blockedThemes.join(" · ")}. Tampoco se aceptan mercados creados por usuarios ni apuestas que usen dinero real.</p><p className="mt-3 flex gap-2 text-xs leading-5 text-amber-100/75"><LockKeyhole className="h-4 w-4 shrink-0" />El piloto no permite transferir contratos entre usuarios ni convertir créditos a dinero.</p></div></section>
  </main></PilotLayout>;
}
