import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Crosshair, HeartPulse, Play, ShieldCheck } from "lucide-react";

export default function BossFightTestPanel() {
  const [roundId, setRoundId] = useState("demo-round");
  const [fightId, setFightId] = useState("boss-demo");
  const [playerId, setPlayerId] = useState("player:demo-round:device-test");
  const input = { roundId, fightId };
  const state = trpc.bossFight.state.useQuery(input, { enabled: roundId.length >= 4 && fightId.length >= 4, refetchInterval: 1_000 });
  const start = trpc.bossFight.start.useMutation({ onSuccess: () => state.refetch() });
  const hit = trpc.bossFight.hit.useMutation({ onSuccess: () => state.refetch() });
  const current = state.data;
  return <section className="mt-6 border border-rose-200/15 bg-rose-200/5 p-5" aria-labelledby="boss-fight-test-title">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-rose-200">Preproducción · Boss Fight</p><h2 id="boss-fight-test-title" className="mt-1 text-2xl font-black text-white">Prueba de autoridad server-side</h2><p className="mt-2 max-w-3xl text-xs leading-5 text-slate-300">Herramienta protegida para validar estados y detección de impactos. No publica el combate, no liquida premios y no modifica wallet ni MJP CORE.</p></div><Badge className="border border-rose-200/25 bg-rose-200/10 text-rose-100"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Solo operador</Badge></div>
    <div className="mt-5 grid gap-3 md:grid-cols-3"><label className="text-xs text-slate-400">Round ID<input value={roundId} onChange={(e) => setRoundId(e.target.value)} className="mt-1 h-10 w-full border border-white/10 bg-black/20 px-3 text-sm text-white" /></label><label className="text-xs text-slate-400">Fight ID<input value={fightId} onChange={(e) => setFightId(e.target.value)} className="mt-1 h-10 w-full border border-white/10 bg-black/20 px-3 text-sm text-white" /></label><label className="text-xs text-slate-400">Player ID<input value={playerId} onChange={(e) => setPlayerId(e.target.value)} className="mt-1 h-10 w-full border border-white/10 bg-black/20 px-3 text-sm text-white" /></label></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-4"><div className="border border-white/10 bg-black/20 p-3"><p className="text-[11px] uppercase tracking-[.12em] text-slate-500">Fase</p><p className="mt-1 text-xl font-black text-rose-100">{current?.phase ?? "—"}</p></div><div className="border border-white/10 bg-black/20 p-3"><p className="text-[11px] uppercase tracking-[.12em] text-slate-500">Salud</p><p className="mt-1 flex items-center gap-2 text-xl font-black text-white"><HeartPulse className="h-4 w-4 text-rose-200" />{current ? `${current.bossHealth}/${current.maxHealth}` : "—"}</p></div><div className="border border-white/10 bg-black/20 p-3"><p className="text-[11px] uppercase tracking-[.12em] text-slate-500">Patrón</p><p className="mt-1 text-xl font-black text-white">{current ? ["SWEEP", "PULSE", "ORBIT"][current.patternIndex] : "—"}</p></div><div className="border border-white/10 bg-black/20 p-3"><p className="text-[11px] uppercase tracking-[.12em] text-slate-500">Posición</p><p className="mt-1 font-mono text-sm text-cyan-100">{current ? `${current.bossPosition.x.toFixed(3)}, ${current.bossPosition.y.toFixed(3)}` : "—"}</p></div></div>
    <div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => start.mutate(input)} disabled={start.isPending} className="bg-rose-500 text-white hover:bg-rose-400"><Play className="mr-2 h-4 w-4" />Iniciar combate</Button><Button variant="outline" onClick={() => { if (!current) return; hit.mutate({ ...input, playerId, requestId: `test-${crypto.randomUUID()}`, clientTime: Date.now(), aim: current.bossPosition }); }} disabled={!current || current.phase !== "ACTIVE" || hit.isPending} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Crosshair className="mr-2 h-4 w-4" />Impacto sobre posición actual</Button></div>
    {hit.data ? <p className="mt-3 text-xs text-rose-100/80" role="status">Servidor: {hit.data.accepted ? `impacto aceptado · daño ${hit.data.damage}` : `impacto rechazado · ${hit.data.reason}`}</p> : null}
  </section>;
}
