import PilotLayout from "@/components/PilotLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowDownLeft, ArrowUpRight, CalendarDays, CheckCircle2, Gift, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const history = [
  { icon: Gift, label: "Bonificación de bienvenida", detail: "Créditos de prueba", value: "+2 000", tone: "text-amber-200" },
  { icon: Sparkles, label: "Misión: explora 2 modalidades", detail: "Progreso 1 de 2", value: "+120", tone: "text-cyan-200" },
  { icon: ArrowDownLeft, label: "Boleto de Lotería", detail: "RP-L-0311 · demostración", value: "−25", tone: "text-slate-200" },
  { icon: Trophy, label: "Premio de prueba", detail: "Ruleta · expediente RP-R-0141", value: "+360", tone: "text-emerald-200" },
];

export default function Wallet() {
  const { isAuthenticated } = useAuth();
  const [showControls, setShowControls] = useState(false);
  const [sessionLimit, setSessionLimit] = useState(60);
  const [pauseHours, setPauseHours] = useState(0);
  const summaryQuery = trpc.wallet.summary.useQuery(undefined, { enabled: isAuthenticated });
  const dailyReward = trpc.wallet.claimDailyReward.useMutation({
    onSuccess: (data) => {
      toast.success("Recompensa diaria acreditada", { description: `+${data.reward} créditos virtuales. Saldo: ${data.balance}.` });
      summaryQuery.refetch();
    },
    onError: (error) => toast.error("Recompensa no disponible", { description: error.message }),
  });
  const updateSettings = trpc.wallet.updateResponsibleSettings.useMutation({
    onSuccess: (settings) => {
      toast.success("Controles responsables actualizados", { description: settings.voluntaryPauseUntil ? "La pausa voluntaria está activa." : `Límite de sesión: ${settings.sessionLimitMinutes} minutos.` });
      summaryQuery.refetch();
      setShowControls(false);
    },
    onError: (error) => toast.error("No se pudieron actualizar los controles", { description: error.message }),
  });
  const claimMission = trpc.missions.claim.useMutation({
    onSuccess: (data) => {
      toast.success("Misión acreditada", { description: `+${data.reward} créditos virtuales. Saldo: ${data.balance}.` });
      summaryQuery.refetch();
    },
    onError: (error) => toast.error("No se pudo reclamar la misión", { description: error.message }),
  });
  const balance = summaryQuery.data?.wallet.balance ?? 2650;
  const missionSummary = summaryQuery.data?.missionSummary ?? [];
  const displayHistory = summaryQuery.data?.transactions.map((transaction) => ({
    icon: transaction.amount >= 0 ? Gift : ArrowDownLeft,
    label: transaction.description,
    detail: new Date(transaction.createdAt).toLocaleString("es-PE"),
    value: `${transaction.amount >= 0 ? "+" : ""}${transaction.amount}`,
    tone: transaction.amount >= 0 ? "text-emerald-200" : "text-slate-200",
  })) ?? history;

  const claim = () => {
    if (!isAuthenticated) {
      toast.message("Ingresa al piloto", { description: "La billetera virtual se vincula a tu cuenta para mantener el historial." });
      startLogin();
      return;
    }
    dailyReward.mutate();
  };

  const saveControls = () => {
    if (!isAuthenticated) {
      toast.message("Ingresa al piloto", { description: "Los límites y pausas se guardan de forma privada en tu perfil." });
      startLogin();
      return;
    }
    updateSettings.mutate({ sessionLimitMinutes: sessionLimit, pauseHours, countryCode: "PE" });
  };

  return (
    <PilotLayout>
      <main className="container py-9 sm:py-14">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-[radial-gradient(circle_at_82%_10%,rgba(242,194,96,0.20),transparent_28%),linear-gradient(130deg,#113628,#071510)] p-6 sm:p-9">
            <Badge className="border border-emerald-300/25 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Billetera piloto</Badge>
            <p className="mt-6 text-sm font-semibold text-emerald-100/70">Saldo disponible</p>
            <div className="mt-2 flex flex-wrap items-end gap-3"><h1 className="font-display text-6xl tracking-tight text-white sm:text-7xl">{balance.toLocaleString("es-PE")}</h1><span className="mb-2 text-lg font-bold text-amber-200">créditos</span></div>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">Los créditos se usan únicamente dentro del piloto. No son dinero, no se pueden transferir y no pueden retirarse.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button disabled={dailyReward.isPending} className="gold-button" onClick={claim}><Gift className="mr-2 h-4 w-4" />{dailyReward.isPending ? "Acreditando…" : "Reclamar recompensa diaria"}</Button><Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><ArrowUpRight className="mr-2 h-4 w-4" />Ver reglas de créditos</Button></div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#0c2118] p-6 sm:p-8">
            <p className="eyebrow">Ruta de bienvenida</p>
            <h2 className="font-display mt-2 text-3xl text-white">Gana por explorar</h2>
            <div className="mt-7 space-y-4">{missionSummary.length ? missionSummary.map((mission) => { const completed = Boolean(mission.progress?.completedAt); const claimed = Boolean(mission.progress?.claimedAt); return <div key={mission.code} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-3"><CheckCircle2 className={`h-5 w-5 ${completed ? "text-emerald-300" : "text-slate-500"}`} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-white">{mission.title}</p><p className="text-xs text-slate-400">{mission.progress?.progressCount ?? 0} de {mission.targetCount} · {mission.description}</p>{completed ? <span className="mt-2 inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-100">Insignia: {mission.badgeLabel}</span> : null}</div>{completed && !claimed ? <Button size="sm" disabled={claimMission.isPending} onClick={() => claimMission.mutate({ code: mission.code })} className="border border-amber-200/25 bg-amber-200/10 text-xs text-amber-100 hover:bg-amber-200/20">Reclamar +{mission.rewardCredits}</Button> : <span className="font-black text-amber-200">{claimed ? "Reclamada" : `+${mission.rewardCredits}`}</span>}</div> }) : <p className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm leading-6 text-slate-400">Las misiones se habilitan al preparar rondas desde la zona de operación.</p>}</div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#0a1b14] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Trazabilidad</p><h2 className="font-display mt-1 text-3xl text-white">Historial claro</h2></div><CalendarDays className="h-5 w-5 text-emerald-300" /></div>
            <div className="mt-6 divide-y divide-white/8">
              {displayHistory.map((item) => <div key={`${item.label}-${item.detail}`} className="flex items-center gap-4 py-4"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white/6"><item.icon className={`h-4 w-4 ${item.tone}`} /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-white">{item.label}</p><p className="mt-1 text-xs text-slate-400">{item.detail}</p></div><span className={`text-sm font-black ${item.tone}`}>{item.value} cr.</span></div>)}
            </div>
          </div>
          <div className="rounded-[2rem] border border-cyan-200/15 bg-[#0b2025] p-6 sm:p-8"><p className="eyebrow text-cyan-200">Uso responsable</p><h2 className="font-display mt-2 text-3xl text-white">Control a tu ritmo</h2><p className="mt-4 text-sm leading-6 text-slate-300">El piloto incluye límites de uso, historial y pausas voluntarias. Estas opciones se guardan de forma privada para el perfil autenticado.</p>{showControls ? <div className="mt-6 space-y-3 rounded-2xl border border-cyan-200/15 bg-black/15 p-4"><label className="block text-xs font-bold uppercase tracking-[0.12em] text-cyan-100">Límite de sesión<select value={sessionLimit} onChange={(event) => setSessionLimit(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-white/10 bg-[#071310] px-3 py-2 text-sm text-white"><option value={30}>30 minutos</option><option value={60}>60 minutos</option><option value={90}>90 minutos</option><option value={120}>120 minutos</option></select></label><label className="block text-xs font-bold uppercase tracking-[0.12em] text-cyan-100">Pausa voluntaria<select value={pauseHours} onChange={(event) => setPauseHours(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-white/10 bg-[#071310] px-3 py-2 text-sm text-white"><option value={0}>Sin pausa</option><option value={24}>24 horas</option><option value={168}>7 días</option><option value={720}>30 días</option></select></label><Button disabled={updateSettings.isPending} onClick={saveControls} className="w-full border border-cyan-200/25 bg-cyan-200/10 text-cyan-50 hover:bg-cyan-200/15">{updateSettings.isPending ? "Guardando…" : "Guardar controles"}</Button></div> : <Button variant="outline" className="mt-7 border-cyan-200/20 bg-cyan-200/5 text-cyan-50 hover:bg-cyan-200/10 hover:text-cyan-50" onClick={() => setShowControls(true)}>Configurar límites del piloto</Button>}</div>
        </section>
      </main>
    </PilotLayout>
  );
}
