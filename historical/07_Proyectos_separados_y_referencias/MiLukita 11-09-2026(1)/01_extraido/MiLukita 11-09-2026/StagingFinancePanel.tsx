import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calculator, FlaskConical, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const RTP_BY_GAME: Record<string, number> = {
  "Ruleta 17": 0.94117647,
  "Ruleta 27": 0.96296296,
  "Ruleta 37": 0.97297297,
  "Lotería 29": 0.92259273,
  "Lotería 39": 0.87090234,
  "Lotería 49": 0.85082069,
  "Lotería 59": 0.94373633,
  "Pick 3": 0.851,
  "Pick 4": 0.8518,
  "Raspa Digital": 0.85,
  "Sueldo de por vida": 0.86002919,
  "Loto Express": 0.85,
};

const STAGING_GAMES = Object.keys(RTP_BY_GAME);

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function StagingFinancePanel({ isOperator }: { isOperator: boolean }) {
  const projectionQuery = trpc.operations.financialProjection.useQuery(undefined, { enabled: isOperator });
  const [game, setGame] = useState(STAGING_GAMES[0]);
  const [plays, setPlays] = useState(0);
  const [virtualSpend, setVirtualSpend] = useState(0);
  const [expectedPrize, setExpectedPrize] = useState(0);
  const rtp = RTP_BY_GAME[game];
  const unitHold = 1 - rtp;
  const projection = projectionQuery.data;
  const stageStatus = useMemo(() => plays ? `${plays} jugadas · ${soles(virtualSpend)} de referencia` : "Sin jugadas simuladas", [plays, virtualSpend]);

  if (!isOperator) return null;

  const simulate = (count: number) => {
    setPlays((value) => value + count);
    setVirtualSpend((value) => value + count);
    setExpectedPrize((value) => value + count * rtp);
    toast.success("Simulación agregada", { description: `${count} jugada(s) locales en ${game}; no se modificó ninguna billetera.` });
  };

  return (
    <section className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-violet-200/15 bg-[#171128] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><Badge className="border border-violet-200/25 bg-violet-200/10 text-violet-100 hover:bg-violet-200/10"><FlaskConical className="mr-1.5 h-3.5 w-3.5" /> STAGING · SOLO VIRTUAL</Badge><p className="eyebrow mt-5 text-violet-200">Prueba de tarifa objetivo</p><h2 className="font-display mt-2 text-3xl text-white">Simular a S/ 1</h2></div><WalletCards className="h-6 w-6 text-violet-200" /></div>
        <p className="mt-3 text-sm leading-6 text-slate-300">Prueba local de volumen y premio esperado. El precio es una unidad de referencia; no hay cobro, reserva, retiro, Yape ni movimiento de créditos oficiales.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"><select value={game} onChange={(event) => setGame(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white">{STAGING_GAMES.map((item) => <option key={item} value={item}>{item} · RTP {(RTP_BY_GAME[item] * 100).toFixed(2)}%</option>)}</select><div className="rounded-xl border border-violet-200/15 bg-violet-200/10 px-4 py-2.5 text-right text-xs text-violet-100"><strong>S/ 1.00</strong><br />por jugada simulada</div></div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-xl border border-white/8 bg-white/4 p-3"><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Jugadas</p><p className="mt-1 text-2xl font-bold text-white">{plays}</p></div><div className="rounded-xl border border-white/8 bg-white/4 p-3"><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Retención</p><p className="mt-1 text-2xl font-bold text-emerald-200">{(unitHold * 100).toFixed(2)}%</p></div><div className="rounded-xl border border-white/8 bg-white/4 p-3"><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Premio esp.</p><p className="mt-1 text-2xl font-bold text-amber-200">{soles(expectedPrize)}</p></div><div className="rounded-xl border border-white/8 bg-white/4 p-3"><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Gasto ref.</p><p className="mt-1 text-2xl font-bold text-white">{soles(virtualSpend)}</p></div></div>
        <div className="mt-5 flex flex-wrap gap-3"><Button className="gold-button" onClick={() => simulate(1)}>Simular 1</Button><Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={() => simulate(10)}>Simular 10</Button><Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={() => { setPlays(0); setVirtualSpend(0); setExpectedPrize(0); }}>Reiniciar</Button></div>
        <p className="mt-4 text-xs text-violet-100/70">{stageStatus}. El premio esperado es RTP × tarifa, no una promesa individual.</p>
      </div>
      <aside className="rounded-[2rem] border border-amber-200/15 bg-[#211b10] p-6 sm:p-8"><div className="flex items-center gap-3"><Calculator className="h-5 w-5 text-amber-200" /><div><p className="eyebrow text-amber-200">Modelo financiero proyectado</p><h2 className="font-display mt-1 text-3xl text-white">Escenario mensual</h2></div></div>{projection ? <><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/8 bg-black/20 p-4"><p className="text-xs text-slate-500">Jugadas</p><p className="mt-1 text-xl font-bold text-white">{projection.monthlyPlays.toLocaleString("es-PE")}</p></div><div className="rounded-xl border border-white/8 bg-black/20 p-4"><p className="text-xs text-slate-500">Ventas referencia</p><p className="mt-1 text-xl font-bold text-amber-100">{soles(projection.revenue)}</p></div><div className="rounded-xl border border-white/8 bg-black/20 p-4"><p className="text-xs text-slate-500">Premios RTP</p><p className="mt-1 text-xl font-bold text-rose-100">-{soles(projection.prizes)}</p></div><div className="rounded-xl border border-white/8 bg-black/20 p-4"><p className="text-xs text-slate-500">Contribución modelo</p><p className="mt-1 text-xl font-bold text-emerald-200">{soles(projection.contribution)}</p></div></div><div className="mt-5 space-y-2 text-sm text-slate-300"><p>Pasarela hipotética: <strong className="text-white">{(projection.assumptions.gatewayRate * 100).toFixed(1)}%</strong> · {soles(projection.gateway)}</p><p>Impuesto de juegos escenario: <strong className="text-white">{soles(projection.gameTax)}</strong> · ISC: {soles(projection.isc)}</p><p>Marketing supuesto: <strong className="text-white">{(projection.assumptions.marketingRate * 100).toFixed(1)}%</strong> · {soles(projection.marketing)}</p></div><p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-amber-100/70">{projection.disclaimer} No es presupuesto, proyección auditada ni recomendación tributaria.</p></> : <p className="mt-6 text-sm text-slate-400">Disponible únicamente para un usuario administrador autenticado.</p>}</aside>
    </section>
  );
}
