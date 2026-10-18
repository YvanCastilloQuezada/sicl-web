import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PilotLayout from "@/components/PilotLayout";
import { games, getGame, volumeBenefits } from "@/data/games";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, Check, CircleHelp, Clock3, Crown, LockKeyhole, LoaderCircle, Minus, Plus, Radio, Sparkles, TicketCheck } from "lucide-react";
import { formatCountdown, useCountdown } from "@/hooks/useCountdown";
import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import RealtimePlayerLobby from "@/components/RealtimePlayerLobby";

const cardRanks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export default function GamePage() {
  const [, params] = useRoute("/juegos/:game");
  const game = getGame(params?.game);
  const isLottery = game.key.startsWith("loteria_");
  const isDigitGame = game.key === "pick_3" || game.key === "pick_4";
  const supportsTicketBatch = ["ruleta", "jackpot", "bingo", "loteria_19", "loteria_29", "loteria_39", "loteria_49", "loteria_59", "cartas", "sueldo_vida", "pick_3", "pick_4", "loto_diario", "loto_express"].includes(game.key);
  const { isAuthenticated } = useAuth();
  const broadcastRoundId = new URLSearchParams(window.location.search).get("round");
  const broadcastRoundQuery = trpc.broadcast.round.useQuery({ roundId: broadcastRoundId ?? "" }, { enabled: Boolean(broadcastRoundId), refetchInterval: 5000 });
  const recordProductEvent = trpc.operations.recordProductEvent.useMutation();
  useEffect(() => {
    if (!isAuthenticated) return;
    const sessionKey = "mjp-analytics-session-id";
    const sessionId = window.localStorage.getItem(sessionKey) ?? `sess-${crypto.randomUUID()}`;
    window.localStorage.setItem(sessionKey, sessionId);
    const day = new Date().toISOString().slice(0, 10);
    recordProductEvent.mutate({ eventType: "game_viewed", gameType: game.key, sessionId, source: "web", idempotencyKey: `game_viewed:${sessionId}:${game.key}:${day}` });
  }, [game.key, isAuthenticated]);
  const broadcastCountdown = useCountdown(broadcastRoundQuery.data?.closeAt);
  const roundsQuery = trpc.games.rounds.useQuery();
  const connectedRound = broadcastRoundQuery.data?.gameType === game.key ? broadcastRoundQuery.data : null;
  const connectedOpenRound = connectedRound?.state === "open" ? connectedRound : null;
  const liveRoundPublicId = broadcastRoundId ? connectedOpenRound?.roundId : roundsQuery.data?.find((round) => round.gameType === game.key && round.state === "open")?.publicId;
  const latestSettledRound = roundsQuery.data?.find((round) => round.gameType === game.key && round.state === "settled");
  const nextEvent = broadcastRoundQuery.data?.manifest?.nextEvent;
  const qrFlowLoading = Boolean(broadcastRoundId) && broadcastRoundQuery.isLoading;
  const qrFlowError = Boolean(broadcastRoundId) && broadcastRoundQuery.isError;
  const qrRoundMismatch = Boolean(broadcastRoundId && broadcastRoundQuery.data && broadcastRoundQuery.data.gameType !== game.key);
  const [selected, setSelected] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [extraPick, setExtraPick] = useState<number | null>(null);
  const [bonusBallCount, setBonusBallCount] = useState(0);
  const [batchManuals, setBatchManuals] = useState<Array<{ picks: number[]; copies: number; extraPick?: number; bonusBallCount?: number; planPublicId?: string }>>([]);
  const [batchCopies, setBatchCopies] = useState(1);
  const [randomTicketCount, setRandomTicketCount] = useState(0);
  const [randomMjpExtra, setRandomMjpExtra] = useState(false);
  const [randomBonusBallCount, setRandomBonusBallCount] = useState(0);
  const [batchPreview, setBatchPreview] = useState<{ publicId: string; selectionHash: string; signature: string; expiresAt: string; selections: Array<{ picks: number[]; extraPick?: number; bonusBallCount?: number; source: "manual" | "random" }>; totalTickets: number } | null>(null);
  const [batchReceipt, setBatchReceipt] = useState<{ batchPublicId: string; tickets: Array<{ publicId: string; virtualCost: number }> } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [planCode, setPlanCode] = useState<"semana_4" | "mes_16" | "trimestre_48" | "semestre_96" | "anual_192">("mes_16");
  const [planConsent, setPlanConsent] = useState(false);
  const [selectedPlanPublicId, setSelectedPlanPublicId] = useState<string | null>(null);
  const [ticketReceipt, setTicketReceipt] = useState<{ publicId: string; ticketHash: string; virtualCost: number } | null>(null);

  const tier = useMemo(() => [...volumeBenefits].reverse().find((benefit) => quantity >= benefit.minimum) ?? volumeBenefits[0], [quantity]);
  const subtotal = game.price * quantity;
  const isMjpLottery = game.key === "loteria_39";
  const supportsAssistedPlan = ["loteria_29", "loteria_39", "loteria_49", "loteria_59"].includes(game.key);
  const bonusOptions = [0];
  const isConsolationLottery = bonusOptions.length > 1;
  const extraCost = extraPick ? quantity : 0;
  const total = Math.round(subtotal * (1 - tier.discount / 100)) + extraCost + bonusBallCount * quantity;
  const batchTicketCount = batchManuals.reduce((sum, item) => sum + item.copies, 0) + randomTicketCount;
  const batchTier = useMemo(() => [...volumeBenefits].reverse().find((benefit) => batchTicketCount >= benefit.minimum) ?? volumeBenefits[0], [batchTicketCount]);
  const batchExtraCount = batchManuals.reduce((sum, item) => sum + (item.extraPick ? item.copies : 0), 0) + (randomMjpExtra ? randomTicketCount : 0);
  const batchBonusCost = batchManuals.reduce((sum, item) => sum + (item.bonusBallCount ?? 0) * item.copies, 0) + randomBonusBallCount * randomTicketCount;
  const batchEstimatedCost = batchTicketCount ? Math.round(game.price * batchTicketCount * (1 - batchTier.discount / 100)) + batchExtraCount + batchBonusCost : 0;
  const planDefinitions = trpc.plans.list.useQuery(undefined, { enabled: supportsAssistedPlan });
  const myPlans = trpc.plans.mine.useQuery(undefined, { enabled: supportsAssistedPlan && isAuthenticated });
  const selectedPlan = myPlans.data?.find((plan) => plan.publicId === selectedPlanPublicId);
  const reserveTicket = trpc.games.reserveTicket.useMutation({
    onSuccess: (ticket) => {
      setSubmitted(true);
      setTicketReceipt(ticket);
      toast.success("Boleto ficticio confirmado", { description: `${ticket.publicId} · saldo virtual: ${ticket.balanceAfter} créditos.` });
      roundsQuery.refetch();
      myPlans.refetch();
    },
    onError: (error) => toast.error("No se pudo reservar el boleto", { description: error.message }),
  });
  const enrollPlan = trpc.plans.enroll.useMutation({
    onSuccess: (plan) => {
      setSelectedPlanPublicId(plan.publicId);
      setPlanConsent(false);
      myPlans.refetch();
      toast.success("Plan virtual guardado", { description: "No se descontaron créditos. Cada boleto requerirá tu confirmación." });
    },
    onError: (error) => toast.error("No se pudo guardar el plan", { description: error.message }),
  });
  const updatePlanStatus = trpc.plans.updateStatus.useMutation({
    onSuccess: () => myPlans.refetch(),
    onError: (error) => toast.error("No se pudo actualizar el plan", { description: error.message }),
  });
  const previewTicketBatch = trpc.games.previewTicketBatch.useMutation({
    onSuccess: (preview) => {
      setBatchPreview(preview);
      toast.success("Lote previsualizado y firmado", { description: `Hash ${preview.selectionHash.slice(0, 12)}… · vence en 10 minutos.` });
    },
    onError: (error) => toast.error("No se pudo previsualizar el lote", { description: error.message }),
  });
  const confirmTicketBatchPreview = trpc.games.confirmTicketBatchPreview.useMutation({
    onSuccess: (batch) => {
      setBatchReceipt(batch);
      setBatchPreview(null);
      setBatchManuals([]);
      setRandomTicketCount(0);
      setRandomMjpExtra(false);
      toast.success("Lote virtual confirmado", { description: `${batch.totalTickets} boletos individuales · ${batch.virtualCost} créditos.` });
      roundsQuery.refetch();
      myPlans.refetch();
    },
    onError: (error) => toast.error("No se pudo confirmar el lote firmado", { description: error.message }),
  });

  const choose = (number: number) => {
    if (game.key === "bingo") {
      setSelected([number]);
      return;
    }
    setSelected((current) => {
      if (isDigitGame) return current.length >= game.pickLimit ? current : [...current, number];
      if (current.includes(number)) return current.filter((value) => value !== number);
      if (current.length >= game.pickLimit) return current;
      const next = [...current, number].sort((a, b) => a - b);
      if (extraPick && next.includes(extraPick)) setExtraPick(null);
      return next;
    });
  };

  const quickPick = () => {
    if (isDigitGame) {
      setSelected(Array.from({ length: game.pickLimit }, () => Math.floor(Math.random() * 10)));
      return;
    }
    const pool = Array.from({ length: game.numberRange }, (_, index) => game.key === "ruleta" ? index : index + 1);
    const picks: number[] = [];
    while (picks.length < game.pickLimit) {
      const next = pool[Math.floor(Math.random() * pool.length)];
      if (!picks.includes(next)) picks.push(next);
    }
    setSelected(picks.sort((a, b) => a - b));
    setExtraPick(null);
  };

  const submitTicket = () => {
    if (selected.length !== game.pickLimit) {
      toast.error(`Completa tu selección: ${game.pickLimit === 1 ? "elige una opción" : `elige ${game.pickLimit} números`}.`);
      return;
    }
    if (!isAuthenticated) {
      toast.message("Inicia sesión para reservar", { description: "La autenticación protege tu billetera virtual, historial y boleto ficticio." });
      return;
    }
    if (!liveRoundPublicId) {
      toast.message("La ronda conectada aún no está abierta", { description: "Un operador debe crear y publicar la ronda desde el panel de operación." });
      return;
    }
    reserveTicket.mutate({
      roundPublicId: liveRoundPublicId,
      picks: selected,
      quantity,
      idempotencyKey: `ticket-${liveRoundPublicId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      planPublicId: selectedPlan?.publicId,
      extraPick: extraPick ?? undefined,
      bonusBallCount,
    });
  };

  const savePlan = () => {
    if (!supportsAssistedPlan) return;
    if (selected.length !== game.pickLimit) {
      toast.error("Completa los seis números antes de guardar el plan.");
      return;
    }
    if (!isAuthenticated) {
      toast.message("Inicia sesión para guardar un plan virtual.");
      return;
    }
    if (!planConsent) {
      toast.error("Confirma que entiendes que cada boleto seguirá requiriendo tu autorización.");
      return;
    }
    enrollPlan.mutate({ planCode, gameType: game.key as "loteria_29" | "loteria_39" | "loteria_49" | "loteria_59", picks: selected });
  };

  const addManualToBatch = () => {
    if (selected.length !== game.pickLimit) {
      toast.error(`Completa tu selección de ${game.pickLimit} números antes de añadirla al lote.`);
      return;
    }
    if (batchTicketCount + batchCopies > 10) {
      toast.error("El lote admite un máximo de 10 boletos virtuales.");
      return;
    }
    setBatchManuals((current) => [...current, { picks: selected, copies: batchCopies, extraPick: extraPick ?? undefined, bonusBallCount, planPublicId: selectedPlan?.publicId }]);
    setBatchCopies(1);
  };

  const submitBatch = () => {
    if (!supportsTicketBatch || !liveRoundPublicId) {
      toast.error("El lote requiere una ronda abierta de esta modalidad.");
      return;
    }
    if (!isAuthenticated) {
      toast.message("Inicia sesión para confirmar un lote virtual.");
      return;
    }
    if (!batchTicketCount || batchTicketCount > 10) {
      toast.error("Configura entre 1 y 10 boletos para el lote.");
      return;
    }
    previewTicketBatch.mutate({ roundPublicId: liveRoundPublicId, manual: batchManuals, randomCount: randomTicketCount, randomMjpExtra: isMjpLottery && randomMjpExtra, randomBonusBallCount: isConsolationLottery ? randomBonusBallCount : 0 });
  };

  const previewSpin = () => {
    setSpinning(true);
    window.setTimeout(() => setSpinning(false), 1050);
  };

  if (qrFlowLoading) return <PilotLayout><main className="container grid min-h-[60vh] place-items-center py-12"><section className="w-full max-w-lg border border-cyan-200/20 bg-cyan-200/5 p-8 text-center" role="status" aria-live="polite"><LoaderCircle className="mx-auto h-10 w-10 animate-spin text-cyan-200" /><p className="mt-5 font-display text-3xl text-white">Procesando tu código QR</p><p className="mt-3 text-sm leading-6 text-slate-300">Estamos verificando la ronda, la firma y la conexión con el evento siguiente. No cierres esta pantalla.</p><div className="mx-auto mt-6 h-1.5 max-w-xs overflow-hidden bg-white/10"><div className="h-full w-2/3 animate-pulse bg-cyan-200" /></div></section></main></PilotLayout>;
  if (qrFlowError || qrRoundMismatch) return <PilotLayout><main className="container grid min-h-[60vh] place-items-center py-12"><section className="w-full max-w-lg border border-amber-200/25 bg-amber-200/5 p-8 text-center" role="alert"><AlertCircle className="mx-auto h-10 w-10 text-amber-200" /><p className="mt-5 font-display text-3xl text-white">No pudimos abrir este evento</p><p className="mt-3 text-sm leading-6 text-slate-300">El código QR puede haber expirado, no corresponde a este juego o la ronda ya no admite participación. Solicita en TV un QR actualizado e inténtalo nuevamente.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Button type="button" onClick={() => void broadcastRoundQuery.refetch()} className="gold-button">Reintentar</Button><Link href={`/juegos/${game.key}`}><Button type="button" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">Entrar sin QR</Button></Link></div></section></main></PilotLayout>;

  return (
    <PilotLayout>
      <main className="container py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {games.map((item) => (
            <Link key={item.key} href={`/juegos/${item.key}`} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${item.key === game.key ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/4 text-slate-300 hover:bg-white/8"}`}>
              {item.name}
            </Link>
          ))}
        </div>

        <section className="grid gap-7 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c2118] p-5 shadow-2xl shadow-black/30 sm:p-8">
            <div className="absolute -right-16 -top-12 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{game.eyebrow}</p>
                <h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">{game.name}</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">{game.description}</p>
              </div>
              <Badge className="border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-cyan-100 hover:bg-cyan-300/10"><Clock3 className="mr-1.5 h-3.5 w-3.5" /> Cierra en {game.closesIn}</Badge>
            </div>
            <Link href={`/aprender?game=${game.key}`} className="relative mt-5 inline-flex items-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-2.5 text-sm font-bold text-emerald-50 hover:bg-emerald-300/20"><CircleHelp className="mr-2 h-4 w-4" />Practicar {game.name} antes de reservar</Link>
            {broadcastRoundQuery.data ? <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3 border border-cyan-200/20 bg-cyan-200/8 px-4 py-3 text-sm text-cyan-50"><span className="flex items-center gap-2"><Radio className="h-4 w-4 text-cyan-200" /><strong>Ronda TV conectada:</strong> {broadcastRoundQuery.data.gameName} · {broadcastRoundQuery.data.state === "open" ? `cierra en ${formatCountdown(broadcastCountdown.remaining)}` : "participación cerrada"}</span><Link href={`/overlay/${broadcastRoundQuery.data.roundId}`} className="font-bold text-emerald-200">Ver señal</Link></div> : null}
            {broadcastRoundId && broadcastRoundQuery.isFetching ? <div className="relative mt-3 flex items-center gap-2 border border-cyan-200/15 bg-cyan-200/5 px-4 py-2 text-xs text-cyan-100" role="status" aria-live="polite"><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Sincronizando el evento y su siguiente ronda…</div> : null}
            {nextEvent?.available && nextEvent.eventId && nextEvent.gameId ? <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3 border border-amber-200/20 bg-amber-200/8 px-4 py-3 text-sm text-amber-50"><span><strong>Próximo evento:</strong> {nextEvent.gameName ?? nextEvent.gameId}{nextEvent.scheduledStart ? ` · ${new Date(nextEvent.scheduledStart).toLocaleString()}` : ""}</span><Link href={`/juegos/${nextEvent.gameId}?round=${encodeURIComponent(nextEvent.eventId)}`} className="font-bold text-amber-100">Preparar participación</Link></div> : null}

            <div className="relative mt-8 rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">1. Arma tu participación</p>
                  <p className="mt-1 text-xs text-slate-400">{game.key === "bingo" ? "Selecciona una cartilla virtual." : game.key === "cartas" ? "Elige tres rangos de carta diferentes." : isDigitGame ? `Toca ${game.pickLimit} dígitos en orden; se permiten repeticiones.` : `Elige ${game.pickLimit === 1 ? "una opción" : `${game.pickLimit} números`}.`}</p>
                </div>
                <div className="flex gap-2"><Button variant="outline" onClick={quickPick} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Sparkles className="mr-2 h-4 w-4 text-amber-200" />Selección rápida</Button>{isDigitGame ? <Button variant="outline" onClick={() => setSelected((current) => current.slice(0, -1))} disabled={!selected.length} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">Borrar último</Button> : null}</div>
              </div>

              <div className={`grid gap-2 ${game.key === "bingo" ? "grid-cols-1 sm:grid-cols-3" : game.key === "cartas" ? "grid-cols-4 sm:grid-cols-7" : "grid-cols-6 sm:grid-cols-7"}`}>
                {Array.from({ length: game.numberRange }, (_, index) => game.key === "ruleta" || isDigitGame ? index : index + 1).map((number) => {
                  const active = selected.includes(number);
                  return (
                    <button
                      key={number}
                      type="button"
                      onClick={() => choose(number)}
                      className={`${game.key === "bingo" ? "h-20 rounded-xl px-4 text-left" : game.key === "cartas" ? "aspect-[3/4] rounded-xl" : "aspect-square rounded-xl"} grid place-items-center border text-sm font-black transition ${active ? "border-amber-200 bg-amber-200 text-[#152415] shadow-lg shadow-amber-200/10" : game.key === "cartas" ? "border-rose-200/25 bg-gradient-to-br from-rose-300/15 to-amber-200/10 text-rose-100 hover:border-amber-200/60" : "border-white/10 bg-white/5 text-slate-200 hover:border-emerald-300/50 hover:bg-emerald-300/10"}`}
                    >
                      {game.key === "bingo" ? <span>Cartilla {String(number).padStart(2, "0")}</span> : game.key === "cartas" ? <span className="font-display text-2xl">{cardRanks[number - 1]}</span> : number}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <CircleHelp className="h-4 w-4 text-emerald-300" />
                Selección: <span className="font-bold text-white">{selected.length ? selected.map((value, index) => game.key === "cartas" ? cardRanks[value - 1] : isDigitGame ? `${index + 1}º:${value}` : value).join(" · ") : "pendiente"}</span>
                <span className="text-slate-500">· La animación solo mostrará el resultado cerrado por servidor.</span>
              </div>
              {isMjpLottery ? <div className="mt-5 rounded-2xl border border-fuchsia-200/20 bg-fuchsia-300/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-fuchsia-100">MJP Extra opcional</p><p className="mt-1 max-w-lg text-xs leading-5 text-slate-300">Elige un séptimo número distinto. Suma 1 crédito virtual por boleto; si coincide con el Extra verificable, duplica únicamente los premios de 2 a 5 aciertos. RTP total con Extra: 75,1562 %.</p></div><Badge className="border border-fuchsia-200/20 bg-fuchsia-300/10 text-fuchsia-50">+1 cr. / boleto</Badge></div>
                <div className="mt-3 grid grid-cols-7 gap-1.5 sm:grid-cols-13">{Array.from({ length: 39 }, (_, index) => index + 1).map((number) => <button key={number} type="button" disabled={selected.includes(number)} onClick={() => setExtraPick((current) => current === number ? null : number)} className={`h-8 rounded-lg border text-xs font-bold ${selected.includes(number) ? "cursor-not-allowed border-white/5 bg-black/15 text-slate-600" : extraPick === number ? "border-fuchsia-200 bg-fuchsia-200 text-[#25162a]" : "border-white/10 bg-black/15 text-slate-200 hover:border-fuchsia-200/60"}`}>{number}</button>)}</div>
                <p className="mt-3 text-xs text-fuchsia-100/80">Extra seleccionado: <strong>{extraPick ?? "ninguno"}</strong> · Puedes quitarlo sin perder tu selección principal.</p>
              </div> : null}
              {isConsolationLottery ? <div className="mt-5 rounded-2xl border border-amber-200/20 bg-amber-200/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-100">Bolas de consuelo opcionales</p><p className="mt-1 max-w-lg text-xs leading-5 text-slate-300">Tras la extracción principal, el servidor revela las bolas adicionales comprometidas. Si una coincide con un número de tu boleto que no salió entre las principales, suma el consuelo una única vez. No modifica la Lotería 39 MJP.</p></div><Badge className="border border-amber-200/20 bg-amber-200/10 text-amber-50">+1 cr. por bola</Badge></div>
                <div className="mt-3 flex flex-wrap gap-2">{bonusOptions.map((count) => <button key={count} type="button" onClick={() => setBonusBallCount(count)} className={`rounded-xl border px-3 py-2 text-xs font-bold ${bonusBallCount === count ? "border-amber-200 bg-amber-200 text-[#251d0c]" : "border-white/10 bg-black/15 text-slate-200 hover:border-amber-200/60"}`}>{count === 0 ? "Sin bolas" : `${count} bola${count > 1 ? "s" : ""} · +${count} cr.`}</button>)}</div>
                <p className="mt-3 text-xs text-amber-100/80">Paquete elegido: <strong>{bonusBallCount === 0 ? "sin bolas de consuelo" : `${bonusBallCount} bola${bonusBallCount > 1 ? "s" : ""}`}</strong> · El RTP exacto está publicado en la regla de la ronda.</p>
              </div> : null}
            </div>
            <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
              {game.key === "ruleta" ? <div className="rounded-2xl border border-amber-200/15 bg-amber-200/5 p-4 sm:col-span-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-200">Animación desacoplada</p><div className="mt-3 flex items-center gap-4"><button type="button" onClick={previewSpin} className={`grid h-16 w-16 place-items-center rounded-full border-4 border-amber-200/70 bg-[conic-gradient(#e8bd5b_0_9%,#132c20_9%_18%,#c74343_18%_27%,#132c20_27%_36%,#e8bd5b_36%_45%,#132c20_45%_54%,#c74343_54%_63%,#132c20_63%_72%,#e8bd5b_72%_81%,#132c20_81%)] shadow-lg shadow-amber-200/15 ${spinning ? "animate-[spin_1s_cubic-bezier(0.23,1,0.32,1)]" : ""}`} aria-label="Reproducir animación de ruleta"><span className="rounded-full bg-[#0a1812] px-2 py-1 text-xs font-black text-white">{latestSettledRound?.resultJson ? JSON.parse(latestSettledRound.resultJson).number : "?"}</span></button><p className="text-sm leading-6 text-slate-300">Pulsa la rueda para reproducir la animación. El giro visual no decide nada: al cerrarse una ronda, reproduce únicamente el resultado del servidor.</p></div></div> : null}
              {game.key === "jackpot" ? <div className="rounded-2xl border border-amber-200/15 bg-amber-200/5 p-4 sm:col-span-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-200">Tabla virtual verificable · 1 crédito</p><div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-black/20 p-3"><strong className="block text-lg text-white">5</strong><span className="text-slate-400">coincidencias · 11 750 cr.</span></div><div className="rounded-xl bg-black/20 p-3"><strong className="block text-lg text-white">4</strong><span className="text-slate-400">coincidencias · 5 cr.</span></div><div className="rounded-xl bg-black/20 p-3"><strong className="block text-lg text-white">3</strong><span className="text-slate-400">coincidencias · 1 cr.</span></div></div><p className="mt-3 text-xs leading-5 text-slate-400">RTP teórico: 84,98 %. La tabla fija sustituye el pozo progresivo para conservar una tarifa virtual exacta de 1 crédito.</p></div> : null}
              {game.key === "bingo" ? <div className="rounded-2xl border border-cyan-200/15 bg-cyan-200/5 p-4 sm:col-span-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-200">Cinco cartillas y llamados verificables</p>{latestSettledRound?.resultJson ? <div className="mt-3"><p className="text-sm text-white">Cartilla ganadora: <strong>{JSON.parse(latestSettledRound.resultJson).winningCartilla}</strong></p><div className="mt-3 flex flex-wrap gap-2">{JSON.parse(latestSettledRound.resultJson).calls.map((call: number) => <span key={call} className="grid h-8 w-8 place-items-center rounded-full border border-cyan-200/25 bg-cyan-200/10 text-xs font-bold text-cyan-50">{call}</span>)}</div><p className="mt-3 text-xs leading-5 text-cyan-100/75">La condición de victoria se cumple cuando la cartilla seleccionada coincide con la cartilla ganadora publicada por el servidor.</p></div> : <p className="mt-2 text-sm leading-6 text-slate-300">La cartilla ganadora y los 15 llamados se publican tras el cierre. Un acierto paga 4 créditos virtuales; RTP teórico 80 %.</p>}</div> : null}
              {ticketReceipt ? <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4 sm:col-span-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-200">Comprobante virtual</p><p className="mt-1 font-mono text-sm text-white">{ticketReceipt.publicId}</p><p className="mt-2 break-all text-[11px] text-emerald-100/75">Hash: {ticketReceipt.ticketHash}</p></div> : null}
              {game.key === "cartas" ? <div className="rounded-2xl border border-rose-200/20 bg-rose-300/5 p-4 sm:col-span-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-rose-100">Tabla Trío 13 · RTP virtual 84,97%</p><div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-black/20 p-3"><strong className="block text-lg text-white">3</strong><span className="text-slate-400">coincidencias · 48 cr.</span></div><div className="rounded-xl bg-black/20 p-3"><strong className="block text-lg text-white">2</strong><span className="text-slate-400">coincidencias · 2 cr.</span></div><div className="rounded-xl bg-black/20 p-3"><strong className="block text-lg text-white">1</strong><span className="text-slate-400">coincidencia · 1 cr.</span></div></div><p className="mt-3 text-xs leading-5 text-rose-100/75">La baraja se genera desde la semilla comprometida; la animación solo representa el resultado ya cerrado por el servidor.</p></div> : null}
            </div>
          </div>

          <aside className="space-y-5">
            {broadcastRoundId && connectedRound ? <RealtimePlayerLobby roundId={connectedRound.roundId} /> : null}
            <div className="rounded-[2rem] border border-amber-200/15 bg-gradient-to-b from-[#262010] to-[#111b14] p-6 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between"><p className="text-sm font-bold text-white">2. Ajusta tus boletos</p><Crown className="h-5 w-5 text-amber-200" /></div>
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-2">
                <Button size="icon" variant="ghost" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="text-white hover:bg-white/10 hover:text-white"><Minus className="h-4 w-4" /></Button>
                <div className="text-center"><p className="text-2xl font-black text-white">{quantity}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">boletos ficticios</p></div>
                <Button size="icon" variant="ghost" onClick={() => setQuantity((value) => Math.min(10, value + 1))} className="text-white hover:bg-white/10 hover:text-white"><Plus className="h-4 w-4" /></Button>
              </div>

              <div className="mt-5 space-y-3">
                {volumeBenefits.map((benefit) => (
                  <div key={benefit.minimum} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs ${tier.minimum === benefit.minimum ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-50" : "border-white/8 bg-white/3 text-slate-400"}`}>
                    <span className="font-semibold">{benefit.label} <span className="font-normal">· {benefit.note}</span></span>
                    <span className="font-black">{benefit.discount ? `−${benefit.discount}%` : "sin descuento"} · {benefit.multiplier}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                <div className="flex justify-between text-slate-300"><span>Precio virtual</span><span>{subtotal} cr.</span></div>
                {isMjpLottery && extraPick ? <div className="flex justify-between text-fuchsia-100"><span>MJP Extra</span><span>+{extraCost} cr.</span></div> : null}
                {isConsolationLottery && bonusBallCount ? <div className="flex justify-between text-amber-100"><span>Bolas de consuelo</span><span>+{bonusBallCount * quantity} cr.</span></div> : null}
                <div className="flex justify-between text-emerald-200"><span>Beneficio piloto</span><span>−{selectedPlan?.definition?.discountPercent ?? tier.discount}%</span></div>
                <div className="flex justify-between pt-2 text-base font-black text-white"><span>Total</span><span>{selectedPlan ? Math.round(subtotal * (1 - selectedPlan.definition!.discountPercent / 100)) + extraCost + bonusBallCount * quantity : total} créditos</span></div>
              </div>
              {supportsAssistedPlan ? <div className="mt-6 rounded-2xl border border-cyan-200/20 bg-cyan-300/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-100">Plan virtual asistido</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">Guarda tus seis números y un descuento para futuras confirmaciones manuales. No se cobra nada al crear el plan ni se generan boletos automáticamente.</p>
                <select value={planCode} onChange={(event) => setPlanCode(event.target.value as typeof planCode)} className="mt-3 w-full rounded-xl border border-white/15 bg-[#0b1913] px-3 py-2 text-sm text-white">
                  {planDefinitions.data?.plans.map((plan) => <option key={plan.code} value={plan.code}>{plan.name} · {plan.confirmationsIncluded} confirmaciones · −{plan.discountPercent}%</option>)}
                </select>
                <label className="mt-3 flex cursor-pointer gap-2 text-xs leading-5 text-slate-300"><input checked={planConsent} onChange={(event) => setPlanConsent(event.target.checked)} type="checkbox" className="mt-1 accent-emerald-300" />Entiendo que cada boleto requiere confirmación explícita y que este plan no cobra ni renueva automáticamente.</label>
                <Button variant="outline" disabled={enrollPlan.isPending} onClick={savePlan} className="mt-3 w-full border-cyan-200/25 bg-white/5 text-cyan-50 hover:bg-white/10 hover:text-white">{enrollPlan.isPending ? "Guardando…" : "Guardar selección en plan"}</Button>
                {myPlans.data?.filter((plan) => plan.gameType === game.key && ["active", "paused"].includes(plan.status)).map((plan) => <div key={plan.publicId} className={`mt-3 rounded-xl border p-3 text-xs ${selectedPlanPublicId === plan.publicId ? "border-emerald-300/40 bg-emerald-300/10" : "border-white/10 bg-black/15"}`}>
                  <div className="flex items-start justify-between gap-2"><div><p className="font-bold text-white">{plan.definition?.name ?? plan.planCode}</p><p className="mt-1 text-slate-400">{plan.remainingConfirmations} confirmaciones restantes · −{plan.definition?.discountPercent ?? 0}%</p></div><Badge className="border border-white/10 bg-white/5 text-slate-200">{plan.status}</Badge></div>
                  <p className="mt-2 text-slate-400">Números: {JSON.parse(plan.picksJson).join(" · ")}</p>
                  <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => { setSelected(JSON.parse(plan.picksJson)); setSelectedPlanPublicId(plan.publicId); }} className="border-emerald-300/30 bg-emerald-300/10 text-emerald-50 hover:bg-emerald-300/20 hover:text-white">Usar para confirmar</Button>{plan.status === "active" ? <Button size="sm" variant="ghost" onClick={() => updatePlanStatus.mutate({ publicId: plan.publicId, action: "pause" })} className="text-slate-300 hover:bg-white/10 hover:text-white">Pausar</Button> : <Button size="sm" variant="ghost" onClick={() => updatePlanStatus.mutate({ publicId: plan.publicId, action: "resume" })} className="text-slate-300 hover:bg-white/10 hover:text-white">Reanudar</Button>}<Button size="sm" variant="ghost" onClick={() => updatePlanStatus.mutate({ publicId: plan.publicId, action: "cancel" })} className="text-rose-200 hover:bg-rose-300/10 hover:text-rose-100">Cancelar</Button></div>
                </div>)}
              </div> : null}
              {supportsTicketBatch ? <div className="mt-6 rounded-2xl border border-violet-200/20 bg-violet-300/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-100">Lote mixto · hasta 10 participaciones</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">Combina tu selección con participaciones aleatorias del servidor. Una misma combinación puede repetirse; cada copia recibe hash y comprobante propios.</p>
                <div className="mt-3 grid grid-cols-2 gap-2"><label className="text-xs text-slate-300">Copias manuales<select value={batchCopies} onChange={(event) => setBatchCopies(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-white/15 bg-[#0b1913] px-2 py-2 text-sm text-white">{Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label className="text-xs text-slate-300">Boletos aleatorios<select value={randomTicketCount} onChange={(event) => setRandomTicketCount(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-white/15 bg-[#0b1913] px-2 py-2 text-sm text-white">{Array.from({ length: 11 }, (_, index) => index).map((value) => <option key={value} value={value}>{value}</option>)}</select></label></div>
                {isMjpLottery ? <label className="mt-3 flex cursor-pointer gap-2 text-xs leading-5 text-slate-300"><input type="checkbox" checked={randomMjpExtra} onChange={(event) => setRandomMjpExtra(event.target.checked)} className="mt-1 accent-fuchsia-300" />Aplicar MJP Extra aleatorio (+1 cr. por boleto aleatorio).</label> : null}
                {isConsolationLottery ? <label className="mt-3 block text-xs text-slate-300">Bolas para boletos aleatorios<select value={randomBonusBallCount} onChange={(event) => setRandomBonusBallCount(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-white/15 bg-[#0b1913] px-2 py-2 text-sm text-white">{bonusOptions.map((count) => <option key={count} value={count}>{count === 0 ? "Sin bolas" : `${count} bola${count > 1 ? "s" : ""} (+${count} cr.)`}</option>)}</select></label> : null}
                <Button variant="outline" onClick={addManualToBatch} className="mt-3 w-full border-violet-200/25 bg-white/5 text-violet-50 hover:bg-white/10 hover:text-white">Añadir selección actual al lote</Button>
                {batchManuals.length ? <div className="mt-3 space-y-2">{batchManuals.map((item, index) => <div key={`${item.picks.join("-")}-${index}`} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-xs"><span className="text-slate-200">{item.copies}× {item.picks.map((pick) => game.key === "cartas" ? cardRanks[pick - 1] : pick).join("·")}{item.extraPick ? ` + Extra ${item.extraPick}` : ""}{item.bonusBallCount ? ` + ${item.bonusBallCount} bola${item.bonusBallCount > 1 ? "s" : ""}` : ""}</span><button type="button" onClick={() => setBatchManuals((current) => current.filter((_, position) => position !== index))} className="text-rose-200 hover:text-rose-100">Quitar</button></div>)}</div> : null}
                <div className="mt-4 border-t border-white/10 pt-3 text-xs"><div className="flex justify-between text-slate-300"><span>{batchTicketCount} participaciones configuradas</span><span>{batchTier.discount ? `−${batchTier.discount}% por lote` : "sin descuento"}</span></div><div className="mt-1 flex justify-between font-bold text-white"><span>Total estimado</span><span>{batchEstimatedCost} créditos</span></div></div>
                {batchPreview ? <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-xs"><p className="font-bold text-emerald-100">Previsualización firmada · {batchPreview.totalTickets} participaciones</p><p className="mt-1 break-all font-mono text-[10px] text-emerald-100/75">Hash: {batchPreview.selectionHash}</p><div className="mt-3 max-h-36 space-y-1 overflow-y-auto text-slate-100">{batchPreview.selections.map((item, index) => <p key={`${item.source}-${index}`}>{index + 1}. {item.source === "random" ? "Aleatorio" : "Manual"}: {item.picks.map((pick) => game.key === "cartas" ? cardRanks[pick - 1] : pick).join("·")}{item.extraPick ? ` + Extra ${item.extraPick}` : ""}{item.bonusBallCount ? ` + ${item.bonusBallCount} bola${item.bonusBallCount > 1 ? "s" : ""}` : ""}</p>)}</div><Button disabled={confirmTicketBatchPreview.isPending} onClick={() => confirmTicketBatchPreview.mutate({ previewPublicId: batchPreview.publicId, idempotencyKey: `confirm-preview-${batchPreview.publicId}-${Date.now()}` })} className="gold-button mt-3 w-full"><TicketCheck className="mr-2 h-4 w-4" />{confirmTicketBatchPreview.isPending ? "Confirmando…" : "Confirmar lote firmado"}</Button></div> : <Button disabled={previewTicketBatch.isPending || !batchTicketCount || batchTicketCount > 10} onClick={submitBatch} className="gold-button mt-4 w-full"><TicketCheck className="mr-2 h-4 w-4" />{previewTicketBatch.isPending ? "Generando selección…" : "Previsualizar lote firmado"}</Button>}
                <p className="mt-2 text-[11px] leading-5 text-slate-400">Las participaciones aleatorias se generan y se firman por el servidor antes de la confirmación final; no alteran el sorteo ni crean compras automáticas.</p>
              </div> : null}
              <Button disabled={reserveTicket.isPending} onClick={submitTicket} className="gold-button mt-6 w-full"><TicketCheck className="mr-2 h-4 w-4" />{reserveTicket.isPending ? "Reservando…" : selectedPlan ? "Confirmar boleto del plan" : "Reservar boleto ficticio"}</Button>
              <p className="mt-3 flex gap-2 text-[11px] leading-5 text-slate-400"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />No se cobra dinero, no se procesa Yape y no existen retiros en este piloto.</p>
            </div>

            {submitted || batchReceipt ? <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-5 text-sm text-emerald-50"><div className="flex items-center gap-2 font-bold"><Check className="h-4 w-4" />{batchReceipt ? "Lote virtual preparado" : "Participación de prueba preparada"}</div>{batchReceipt ? <p className="mt-2 leading-6 text-emerald-100/80">Lote {batchReceipt.batchPublicId} · comprobantes: {batchReceipt.tickets.map((ticket) => ticket.publicId).join(" · ")}</p> : null}<p className="mt-2 leading-6 text-emerald-100/80">Al cerrar la ronda, el expediente público mostrará hash, semilla, reglas y resultado reproducible.</p></div> : null}
          </aside>
        </section>
      </main>
    </PilotLayout>
  );
}
