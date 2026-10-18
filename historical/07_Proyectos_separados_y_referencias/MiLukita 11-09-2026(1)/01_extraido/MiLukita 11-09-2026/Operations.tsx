import PilotLayout from "@/components/PilotLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import StagingFinancePanel from "@/components/StagingFinancePanel";
import BroadcastOperationsPanel from "@/components/BroadcastOperationsPanel";
import AutonomyControlPanel from "@/components/AutonomyControlPanel";
import ProgramSchedulePanel from "@/components/ProgramSchedulePanel";
import { Activity, BarChart3, ClipboardCheck, LockKeyhole, Settings2, ShieldCheck, UsersRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const REVISION_GAMES = ["ruleta", "jackpot", "bingo", "bingo_flash", "bingo_keno", "bingo_75", "ruleta_7", "ruleta_17", "ruleta_27", "ruleta_37", "loteria_19", "loteria_29", "loteria_39", "loteria_49", "loteria_59", "cartas", "sueldo_vida", "raspa_digital", "pick_3", "pick_4", "loto_diario", "loto_express"] as const;

export default function Operations() {
  const { user, isAuthenticated } = useAuth();
  const isOperator = isAuthenticated && user?.role === "admin";
  const overviewQuery = trpc.operations.overview.useQuery(undefined, { enabled: isOperator });
  const bootstrap = trpc.operations.bootstrapPilot.useMutation({
    onSuccess: (data) => {
      toast.success("Rondas piloto preparadas", { description: data.created.length ? `${data.created.length} rondas publicadas.` : "Las rondas existentes permanecen abiertas." });
      overviewQuery.refetch();
    },
    onError: (error) => toast.error("No se pudieron preparar las rondas", { description: error.message }),
  });
  const activeRound = overviewQuery.data?.rounds.find((round) => round.state === "open");
  const closeAndDraw = trpc.operations.closeAndDraw.useMutation({
    onSuccess: (proof) => {
      toast.success("Ronda cerrada y sorteada", { description: `Resultado publicado para ${proof?.publicId ?? "la ronda"}.` });
      overviewQuery.refetch();
    },
    onError: (error) => toast.error("No se pudo cerrar la ronda", { description: error.message }),
  });
  const [revisionGame, setRevisionGame] = useState<typeof REVISION_GAMES[number]>("ruleta");
  const marketQuery = trpc.market.list.useQuery();
  const [marketDraft, setMarketDraft] = useState({ title: "", description: "", category: "cultura" as "cultura" | "entretenimiento" | "tecnologia" | "educacion", sourceLabel: "", sourceUrl: "", resolutionRule: "", closesAt: "" });
  const createMarket = trpc.operations.createCuratedMarket.useMutation({
    onSuccess: () => { toast.success("Mercado virtual abierto", { description: "La fuente y regla de resolución ya son públicas." }); setMarketDraft({ title: "", description: "", category: "cultura", sourceLabel: "", sourceUrl: "", resolutionRule: "", closesAt: "" }); marketQuery.refetch(); },
    onError: (error) => toast.error("No se pudo abrir el mercado", { description: error.message }),
  });
  const resolveMarket = trpc.operations.resolveCuratedMarket.useMutation({ onSuccess: () => { toast.success("Mercado liquidado en créditos virtuales"); marketQuery.refetch(); }, onError: (error) => toast.error("No se pudo resolver", { description: error.message }) });
  const voidMarket = trpc.operations.voidCuratedMarket.useMutation({ onSuccess: () => { toast.success("Mercado anulado y posiciones reembolsadas"); marketQuery.refetch(); }, onError: (error) => toast.error("No se pudo anular", { description: error.message }) });
  const closeMarket = trpc.operations.closeCuratedMarket.useMutation({ onSuccess: () => { toast.success("Participación cerrada; el mercado ya puede resolverse o anularse."); marketQuery.refetch(); overviewQuery.refetch(); }, onError: (error) => toast.error("No se pudo cerrar", { description: error.message }) });
  const publishRevision = trpc.operations.publishRulesetRevision.useMutation({
    onSuccess: (data) => { toast.success("Nueva regla publicada", { description: `${data.gameType} · ${data.version}. Las rondas ya cerradas conservan su versión original.` }); overviewQuery.refetch(); },
    onError: (error) => toast.error("No se pudo publicar la revisión", { description: error.message }),
  });
  const updatePromotion = trpc.operations.updatePromotionStatus.useMutation({
    onSuccess: () => { toast.success("Promoción actualizada"); overviewQuery.refetch(); },
    onError: (error) => toast.error("No se pudo actualizar la promoción", { description: error.message }),
  });
  const metrics = [
    { label: "Rondas abiertas", value: String(overviewQuery.data?.rounds.filter((round) => round.state === "open").length ?? 0).padStart(2, "0"), detail: "Reglas publicadas y semilla comprometida", icon: Activity },
    { label: "Participaciones piloto", value: String(overviewQuery.data?.ticketCount ?? 0), detail: "Boletos ficticios confirmados", icon: UsersRound },
    { label: "Eventos de auditoría", value: String(overviewQuery.data?.auditEvents.length ?? 0), detail: "Trazabilidad del piloto", icon: ClipboardCheck },
    { label: "Pagos reales", value: "0", detail: "Yape permanece desactivado", icon: BarChart3 },
  ];

  const prepare = () => {
    if (!isAuthenticated) {
      toast.message("Autenticación requerida", { description: "Inicia sesión. Solo el rol de operador puede preparar rondas." });
      startLogin();
      return;
    }
    if (!isOperator) {
      toast.error("Rol de operador requerido", { description: "Esta cuenta puede participar como jugador, pero no modificar la operación." });
      return;
    }
    bootstrap.mutate();
  };

  const close = () => {
    if (!isOperator || !activeRound) {
      toast.message("No hay una ronda operable", { description: "Primero prepara rondas con una cuenta de operador." });
      return;
    }
    closeAndDraw.mutate({ publicId: activeRound.publicId });
  };

  const publish = () => {
    if (!isOperator) { toast.error("Rol de operador requerido", { description: "Inicia sesión con el rol autorizado para publicar una revisión." }); return; }
    publishRevision.mutate({ gameType: revisionGame });
  };

  const openCuratedMarket = () => {
    if (!isOperator) { toast.error("Rol de operador requerido", { description: "Solo un operador puede abrir un mercado curado." }); return; }
    if (!marketDraft.closesAt) { toast.error("Define una fecha y hora de cierre."); return; }
    createMarket.mutate({ ...marketDraft, closesAt: new Date(marketDraft.closesAt) });
  };

  const settleMarket = (marketPublicId: string, outcome: "yes" | "no") => {
    const resolutionUrl = window.prompt("Pega el enlace público que comprueba la resolución:");
    if (resolutionUrl) resolveMarket.mutate({ marketPublicId, outcome, resolutionUrl });
  };

  const cancelMarket = (marketPublicId: string) => {
    const resolutionUrl = window.prompt("Pega el enlace público que justifica la anulación:");
    if (resolutionUrl) voidMarket.mutate({ marketPublicId, resolutionUrl });
  };

  const stopMarketParticipation = (marketPublicId: string) => {
    if (!isOperator) { toast.error("Rol de operador requerido"); return; }
    closeMarket.mutate({ marketPublicId });
  };

  return (
    <PilotLayout>
      <main className="container py-9 sm:py-14">
        <section className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-[#0b2018] p-6 sm:flex-row sm:items-end sm:justify-between sm:p-9"><div><p className="eyebrow">Zona de operación</p><h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">Control sin edición manual</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Las acciones sensibles se registran como eventos. Un operador autenticado podrá crear rondas, publicar versiones de reglas, cerrarlas y revisar métricas sin modificar datos críticos directamente.</p></div><Badge className="w-fit border border-amber-200/25 bg-amber-200/10 px-3 py-1.5 text-amber-100 hover:bg-amber-200/10"><LockKeyhole className="mr-1.5 h-3.5 w-3.5" /> Acceso de operador requerido</Badge></section>
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/4 p-5"><metric.icon className="h-4 w-4 text-emerald-300" /><p className="mt-7 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{metric.label}</p><p className="font-display mt-1 text-4xl text-white">{metric.value}</p><p className="mt-2 text-xs text-slate-500">{metric.detail}</p></div>)}</section>
        <section className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-[2rem] border border-white/10 bg-[#0a1b14] p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="eyebrow">Siguiente acción</p><h2 className="font-display mt-1 text-3xl text-white">{activeRound ? `Cerrar ${activeRound.publicId}` : "Preparar rondas piloto"}</h2></div><Settings2 className="h-5 w-5 text-amber-200" /></div><div className="mt-6 rounded-2xl border border-white/8 bg-white/4 p-5 text-sm text-slate-300"><p className="font-semibold text-white">Flujo protegido</p><p className="mt-2 leading-6">Al cerrar, el servidor bloquea boletos, calcula el hash del conjunto, genera el expediente y liquida únicamente créditos virtuales. No hay edición de celdas, registros o premios manuales.</p></div><div className="mt-5 flex flex-wrap gap-3"><Button disabled={closeAndDraw.isPending} className="gold-button" onClick={close}>{closeAndDraw.isPending ? "Cerrando…" : "Cerrar y sortear ronda"}</Button><Button disabled={bootstrap.isPending} variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={prepare}>{bootstrap.isPending ? "Preparando…" : "Preparar rondas y reglas"}</Button></div></div><aside className="rounded-[2rem] border border-cyan-200/15 bg-[#0a1d22] p-6 sm:p-8"><ShieldCheck className="h-6 w-6 text-cyan-200" /><h2 className="font-display mt-4 text-3xl text-white">Preparado para escalar</h2><div className="mt-5 space-y-4 text-sm leading-6 text-slate-300"><p><span className="font-bold text-cyan-100">Yape:</span> capa de referencias, estados e idempotencia diseñada, pero desactivada.</p><p><span className="font-bold text-cyan-100">Región:</span> Perú como configuración inicial; expansión regional se habilita por país y política.</p><p><span className="font-bold text-cyan-100">Datos:</span> el Excel queda como fuente de reglas y datos de prueba validados, no como sistema vivo.</p></div></aside></section>
        <section className="mt-7 grid gap-6 lg:grid-cols-2"><div className="rounded-[2rem] border border-amber-200/15 bg-[#211c10] p-6 sm:p-8"><p className="eyebrow text-amber-200">Reglas versionadas</p><h2 className="font-display mt-2 text-3xl text-white">Publicar una revisión</h2><p className="mt-3 text-sm leading-6 text-slate-300">La publicación crea una nueva versión y no altera reglas, boletos ni resultados históricos.</p><div className="mt-5 flex flex-wrap gap-2">{REVISION_GAMES.map((game) => <Button key={game} size="sm" variant={revisionGame === game ? "default" : "outline"} onClick={() => setRevisionGame(game)} className={revisionGame === game ? "gold-button" : "border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"}>{game === "loteria_19" ? "Lotería 19" : game === "loteria_39" ? "Lotería 39 MJP" : game.replace("_", " ")}</Button>)}</div><Button disabled={publishRevision.isPending} onClick={publish} className="mt-5 gold-button">{publishRevision.isPending ? "Publicando…" : "Publicar revisión"}</Button></div><div className="rounded-[2rem] border border-emerald-300/15 bg-[#0a1f16] p-6 sm:p-8"><p className="eyebrow">Bonificaciones</p><h2 className="font-display mt-2 text-3xl text-white">Promociones del piloto</h2><div className="mt-5 space-y-3">{overviewQuery.data?.promotions?.length ? overviewQuery.data.promotions.map((promotion) => <div key={promotion.code} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 p-4"><div><p className="font-bold text-white">{promotion.label}</p><p className="mt-1 text-xs text-slate-400">{promotion.isActive ? "Activa" : "Pausada"} · condiciones trazables</p></div><Button disabled={updatePromotion.isPending} size="sm" variant="outline" onClick={() => updatePromotion.mutate({ code: promotion.code, isActive: !promotion.isActive })} className="border-emerald-300/25 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20">{promotion.isActive ? "Pausar" : "Activar"}</Button></div>) : <p className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-slate-400">Prepara las rondas para crear las promociones iniciales.</p>}</div></div></section>
        <AutonomyControlPanel isOperator={isOperator} />
        <ProgramSchedulePanel isOperator={isOperator} />
        <StagingFinancePanel isOperator={isOperator} />
        <BroadcastOperationsPanel isOperator={isOperator} />
        <section className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><div className="rounded-[2rem] border border-cyan-200/15 bg-[#0a1d22] p-6 sm:p-8"><p className="eyebrow text-cyan-200">MultiMarket curado</p><h2 className="font-display mt-2 text-3xl text-white">Abrir mercado virtual</h2><p className="mt-3 text-sm leading-6 text-slate-300">Solo cultura, entretenimiento, tecnología o educación. No publiques política, finanzas, salud individual, violencia ni preguntas ambiguas.</p><div className="mt-5 grid gap-3"><input value={marketDraft.title} onChange={(event) => setMarketDraft({ ...marketDraft, title: event.target.value })} placeholder="Pregunta binaria verificable" className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white placeholder:text-slate-500" /><textarea value={marketDraft.description} onChange={(event) => setMarketDraft({ ...marketDraft, description: event.target.value })} placeholder="Contexto neutral del evento" className="min-h-20 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-slate-500" /><div className="grid gap-3 sm:grid-cols-2"><select value={marketDraft.category} onChange={(event) => setMarketDraft({ ...marketDraft, category: event.target.value as typeof marketDraft.category })} className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white"><option value="cultura">Cultura</option><option value="entretenimiento">Entretenimiento</option><option value="tecnologia">Tecnología</option><option value="educacion">Educación</option></select><input type="datetime-local" value={marketDraft.closesAt} onChange={(event) => setMarketDraft({ ...marketDraft, closesAt: event.target.value })} className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white" /></div><input value={marketDraft.sourceLabel} onChange={(event) => setMarketDraft({ ...marketDraft, sourceLabel: event.target.value })} placeholder="Nombre de la fuente pública" className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white placeholder:text-slate-500" /><input value={marketDraft.sourceUrl} onChange={(event) => setMarketDraft({ ...marketDraft, sourceUrl: event.target.value })} placeholder="https://fuente-verificable" className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white placeholder:text-slate-500" /><textarea value={marketDraft.resolutionRule} onChange={(event) => setMarketDraft({ ...marketDraft, resolutionRule: event.target.value })} placeholder="Regla concreta de resolución o anulación" className="min-h-20 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-slate-500" /></div><Button disabled={createMarket.isPending} onClick={openCuratedMarket} className="mt-5 gold-button">{createMarket.isPending ? "Abriendo…" : "Publicar tras revisión humana"}</Button></div><aside className="rounded-[2rem] border border-white/10 bg-[#0a1b14] p-6 sm:p-8"><p className="eyebrow">Resolución auditable</p><h2 className="font-display mt-2 text-3xl text-white">Mercados publicados</h2><div className="mt-5 space-y-3">{marketQuery.data?.length ? marketQuery.data.map((market) => <div key={market.publicId} className="rounded-xl border border-white/8 bg-white/4 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-white">{market.title}</p><p className="mt-1 text-xs text-slate-400">{market.publicId} · {market.state}</p></div><Badge className="border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/10">{market.category}</Badge></div>{market.state === "open" ? <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" disabled={closeMarket.isPending} onClick={() => stopMarketParticipation(market.publicId)} className="bg-cyan-200/15 text-cyan-50 hover:bg-cyan-200/25">Cerrar participación</Button><Button size="sm" onClick={() => cancelMarket(market.publicId)} variant="outline" className="border-amber-200/25 text-amber-100 hover:bg-amber-200/10">Anular y reembolsar</Button></div> : null}{market.state === "closed" ? <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => settleMarket(market.publicId, "yes")} className="bg-emerald-300/15 text-emerald-50 hover:bg-emerald-300/25">Resolver SÍ</Button><Button size="sm" onClick={() => settleMarket(market.publicId, "no")} variant="outline" className="border-rose-200/25 text-rose-100 hover:bg-rose-300/10">Resolver NO</Button><Button size="sm" onClick={() => cancelMarket(market.publicId)} variant="outline" className="border-amber-200/25 text-amber-100 hover:bg-amber-200/10">Anular y reembolsar</Button></div> : null}</div>) : <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm leading-6 text-slate-400">Todavía no hay mercados abiertos. El catálogo permanece vacío hasta que un operador publique fuente, cierre y regla válidos.</p>}</div></aside></section>
        <section className="mt-7 rounded-[2rem] border border-white/10 bg-[#0a1711] p-6 sm:p-8"><div className="flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-emerald-300" /><div><p className="eyebrow">Historial inmutable</p><h2 className="font-display mt-1 text-3xl text-white">Auditoría de MultiMarket</h2></div></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{overviewQuery.data?.marketAuditEvents?.length ? overviewQuery.data.marketAuditEvents.map((event) => <article key={event.publicId} className="rounded-xl border border-white/8 bg-white/4 p-4"><p className="font-mono text-[11px] text-emerald-200">{event.eventType}</p><p className="mt-2 text-sm font-bold text-white">{event.entityPublicId}</p><p className="mt-1 text-xs text-slate-400">{new Date(event.createdAt).toLocaleString("es-PE")}</p></article>) : <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400 md:col-span-2 xl:col-span-3">Las aperturas, cierres, resoluciones y anulaciones de mercados aparecerán aquí con su identificador y marca de tiempo.</p>}</div></section>
      </main>
    </PilotLayout>
  );
}
