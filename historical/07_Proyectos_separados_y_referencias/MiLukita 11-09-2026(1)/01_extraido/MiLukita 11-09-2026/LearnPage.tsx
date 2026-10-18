import PilotLayout from "@/components/PilotLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PRACTICE_BINGO75_COLUMNS,
  PRACTICE_GAMES,
  automaticPracticePicks,
  isValidPracticePicks,
  runPracticeGame,
  type PracticeGameDefinition,
  type PracticeGameId,
  type PracticeResult,
} from "@/lib/practiceSimulator";
import { BookOpenCheck, Dices, GraduationCap, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const ROULETTE_BETS = ["Rojo", "Negro", "Par", "Impar"];

function gameById(id: PracticeGameId) {
  return PRACTICE_GAMES.find((game) => game.id === id) ?? PRACTICE_GAMES[0];
}

function initialPracticeGameId(): PracticeGameId {
  if (typeof window === "undefined") return "bingo_flash";
  const requested = new URLSearchParams(window.location.search).get("game");
  return PRACTICE_GAMES.some((game) => game.id === requested) ? requested as PracticeGameId : "bingo_flash";
}

export default function LearnPage() {
  const [gameId, setGameId] = useState<PracticeGameId>(initialPracticeGameId);
  const [picks, setPicks] = useState<number[]>([]);
  const [extraPick, setExtraPick] = useState<number | null>(null);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [history, setHistory] = useState<PracticeResult[]>([]);
  const [message, setMessage] = useState("Selecciona una modalidad y prepara una jugada local.");
  const game = useMemo(() => gameById(gameId), [gameId]);
  const valid = isValidPracticePicks(game, picks);

  const changeGame = (nextId: PracticeGameId) => {
    setGameId(nextId);
    setPicks([]);
    setExtraPick(null);
    setResult(null);
    setMessage("Prepara una selección manual o usa la generación automática.");
  };

  const autoPick = () => {
    const nextPicks = automaticPracticePicks(game);
    setPicks(nextPicks);
    setExtraPick(game.supportsMjpExtra ? Array.from({ length: game.range }, (_, index) => index + 1).find((value) => !nextPicks.includes(value)) ?? null : null);
    setResult(null);
    setMessage("Selección automática local preparada. Puedes ajustarla manualmente antes de simular.");
  };

  const togglePick = (value: number) => {
    if (game.isRouletteBet || game.isMarket) {
      setPicks([value]);
      return;
    }
    if (game.isPositionalDigits) {
      if (picks.length >= game.pickLimit) return;
      setPicks([...picks, value]);
      return;
    }
    if (picks.includes(value)) {
      setPicks(picks.filter((pick) => pick !== value));
      if (extraPick === value) setExtraPick(null);
      return;
    }
    if (game.isBingo75) {
      const column = PRACTICE_BINGO75_COLUMNS.find((item) => value >= item.minimum && value <= item.maximum)!;
      const used = picks.filter((pick) => pick >= column.minimum && pick <= column.maximum).length;
      if (used >= column.required) return;
    } else if (picks.length >= game.pickLimit) return;
    setPicks([...picks, value].sort((left, right) => left - right));
  };

  const simulate = () => {
    if (!valid) {
      setMessage("Completa una selección válida antes de ejecutar la práctica.");
      return;
    }
    const nextResult = runPracticeGame(game, picks, Math.random, extraPick ?? undefined);
    setResult(nextResult);
    setHistory((previous) => [nextResult, ...previous].slice(0, 5));
    setMessage("Resultado local generado. No se creó boleto ni movimiento de créditos.");
  };

  const clear = () => {
    setPicks([]);
    setExtraPick(null);
    setResult(null);
    setMessage("Selección reiniciada. La sesión continúa aislada de tu cuenta.");
  };

  const numberValues = game.id === "ruleta" || game.isPositionalDigits ? Array.from({ length: game.isPositionalDigits ? 10 : 37 }, (_, index) => index) : Array.from({ length: game.range }, (_, index) => index + 1);
  const selectedLabel = game.isRouletteBet ? (picks[0] === undefined ? "Sin apuesta" : ROULETTE_BETS[picks[0]]) : game.isMarket ? (picks[0] === undefined ? "Sin posición" : picks[0] === 0 ? "SÍ" : "NO") : game.isPositionalDigits ? (picks.length ? picks.map((digit, index) => `${index + 1}º:${digit}`).join(" · ") : `0/${game.pickLimit} dígitos`) : `${picks.length}/${game.pickLimit} números`;

  return <PilotLayout>
    <main className="container py-9 sm:py-14">
      <section className="rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-[#10261a] to-[#0a1711] p-7 sm:p-10">
        <Badge className="border border-emerald-300/25 bg-emerald-300/10 text-emerald-100"><GraduationCap className="mr-2 h-4 w-4" />SIMULADOR DE PRÁCTICA</Badge>
        <p className="eyebrow mt-6">Sesión local y aislada</p>
        <h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">Prueba todas las mecánicas sin tocar el piloto.</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">El simulador se ejecuta únicamente en este navegador. No requiere inicio de sesión, no crea rondas, boletos, comprobantes, premios persistidos ni movimientos en billetera. Sirve para verificar selecciones, sorteos locales y tablas de pago; las reglas oficiales siguen siendo las publicadas en Transparencia y Verificar.</p>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[0.68fr_1.32fr]">
        <aside className="rounded-[1.7rem] border border-white/10 bg-[#091812] p-5">
          <p className="eyebrow">Modalidades</p>
          <h2 className="font-display mt-1 text-3xl text-white">Elige qué probar</h2>
          <div className="mt-5 space-y-5">
            {(["Ruleta", "Bingo", "Lotería", "Otros"] as const).map((category) => <div key={category}><p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{category}</p><div className="space-y-2">{PRACTICE_GAMES.filter((item) => item.category === category).map((item) => <button key={item.id} type="button" onClick={() => changeGame(item.id)} className={cn("w-full rounded-xl border px-4 py-3 text-left", gameId === item.id ? "border-amber-200/60 bg-amber-200/10 text-white" : "border-white/10 bg-white/4 text-slate-300 hover:bg-white/8")}><div className="flex items-center justify-between gap-3"><strong>{item.title}</strong><span className="text-[11px] text-emerald-200">LOCAL</span></div><p className="mt-1 text-xs leading-5 text-slate-400">{item.pickLimit} selección{item.pickLimit === 1 ? "" : "es"}</p></button>)}</div></div>)}
          </div>
        </aside>

        <section className="rounded-[1.7rem] border border-white/10 bg-[#0a1b14] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">{game.category} · práctica local</p><h2 className="font-display mt-1 text-4xl text-white">{game.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{game.instructions}</p></div><div className="rounded-xl border border-cyan-200/15 bg-cyan-200/5 px-4 py-3 text-right"><p className="text-xs text-cyan-100">Selección</p><strong className="text-lg text-white">{selectedLabel}</strong></div></div>

          <div className="mt-7 flex flex-wrap gap-3"><Button type="button" onClick={autoPick} className="gold-button"><Sparkles className="mr-2 h-4 w-4" />Generar automático</Button>{game.isPositionalDigits ? <Button type="button" variant="outline" onClick={() => setPicks((current) => current.slice(0, -1))} disabled={!picks.length} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">Borrar último dígito</Button> : null}<Button type="button" variant="outline" onClick={clear} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><RefreshCw className="mr-2 h-4 w-4" />Limpiar selección</Button></div>

          <section className="mt-6 rounded-2xl border border-cyan-200/15 bg-cyan-200/5 p-4 sm:p-5"><div className="flex items-center gap-2"><BookOpenCheck className="h-5 w-5 text-cyan-100" /><div><p className="font-bold text-cyan-50">Reglas resumidas de {game.title}</p><p className="mt-1 text-xs text-cyan-100/80">Guía didáctica para esta modalidad. Las reglas operativas completas permanecen en Transparencia.</p></div></div><ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-200">{game.summaryRules.map((rule) => <li key={rule} className="flex gap-2"><Checkmark />{rule}</li>)}</ul></section>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold text-white">Selección manual</p><p className="mt-1 text-xs text-slate-400">{game.isBingo75 ? "Completa cada columna. N requiere cuatro números por su centro libre." : game.isRouletteBet ? "Selecciona Color o Par/Impar." : game.isMarket ? "Elige una resolución ficticia local." : game.isPositionalDigits ? "Toca los dígitos en orden. Puedes repetir un dígito; usa Borrar último si deseas corregirlo." : "Toca los valores que deseas incluir en la práctica."}</p></div><Badge className={valid ? "border border-emerald-300/25 bg-emerald-300/10 text-emerald-100" : "border border-white/10 bg-white/5 text-slate-300"}>{valid ? "Selección válida" : "Pendiente"}</Badge></div>
            {game.isRouletteBet ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{ROULETTE_BETS.map((label, index) => <button key={label} type="button" onClick={() => togglePick(index)} className={cn("rounded-xl border p-4 text-left font-bold", picks[0] === index ? "border-amber-200 bg-amber-200/15 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10")}>{label}</button>)}</div> : game.isMarket ? <div className="mt-5 grid grid-cols-2 gap-3">{["SÍ", "NO"].map((label, index) => <button key={label} type="button" onClick={() => togglePick(index)} className={cn("rounded-xl border p-4 text-left font-bold", picks[0] === index ? "border-amber-200 bg-amber-200/15 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10")}>{label}</button>)}</div> : game.isBingo75 ? <div className="mt-5 overflow-x-auto pb-2"><div className="grid min-w-[640px] grid-cols-5 gap-3">{PRACTICE_BINGO75_COLUMNS.map((column) => <div key={column.label} className="rounded-xl border border-white/10 bg-white/4 p-3"><p className="mb-3 text-center font-display text-2xl text-amber-200">{column.label}{column.label === "N" ? <span className="ml-1 text-[10px] text-slate-400">LIBRE</span> : null}</p><div className="grid grid-cols-3 gap-1">{Array.from({ length: column.maximum - column.minimum + 1 }, (_, index) => column.minimum + index).map((value) => <button key={value} type="button" onClick={() => togglePick(value)} className={cn("h-10 rounded text-sm font-bold", picks.includes(value) ? "bg-amber-300 text-[#132116]" : "bg-black/20 text-slate-200 hover:bg-white/10")}>{value}</button>)}</div><p className="mt-3 text-center text-[11px] text-slate-400">{picks.filter((value) => value >= column.minimum && value <= column.maximum).length}/{column.required}</p></div>)}</div></div> : <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10">{numberValues.map((value) => <button key={value} type="button" onClick={() => togglePick(value)} className={cn("h-10 rounded-lg text-sm font-bold", picks.includes(value) ? "bg-amber-300 text-[#132116]" : "bg-white/5 text-slate-200 hover:bg-white/10")}>{value}</button>)}</div>}
          </div>

          {game.supportsMjpExtra ? <div className="mt-5 rounded-2xl border border-cyan-200/15 bg-cyan-200/5 p-4"><p className="font-bold text-cyan-50">MJP Extra de práctica (opcional)</p><p className="mt-1 text-xs leading-5 text-cyan-100/80">Elige un número distinto de tus seis principales. Solo afecta el resultado local de esta demostración.</p><div className="mt-3 flex flex-wrap gap-2">{Array.from({ length: game.range }, (_, index) => index + 1).filter((value) => !picks.includes(value)).map((value) => <button key={value} type="button" onClick={() => setExtraPick(extraPick === value ? null : value)} className={cn("h-8 min-w-8 rounded-md px-2 text-xs font-bold", extraPick === value ? "bg-cyan-200 text-[#0d2023]" : "bg-black/20 text-slate-200 hover:bg-white/10")}>{value}</button>)}</div></div> : null}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6"><p className="max-w-xl text-sm text-slate-300">{message}</p><Button type="button" onClick={simulate} disabled={!valid} className="gold-button"><Dices className="mr-2 h-4 w-4" />Simular resultado local</Button></div>
        </section>
      </section>

      {result ? <section className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><article className="rounded-[1.7rem] border border-emerald-300/20 bg-emerald-300/5 p-6 sm:p-8"><p className="eyebrow text-emerald-100">Resultado local</p><h2 className="font-display mt-1 text-3xl text-white">{result.prize > 0 ? "Práctica con premio" : "Práctica sin premio"}</h2><p className="mt-4 break-words font-mono text-sm leading-7 text-cyan-50">{result.resultLabel}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-xs text-slate-400">Coincidencias</p><p className="mt-1 text-3xl font-black text-white">{result.matches}</p></div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-xs text-slate-400">Premio de práctica</p><p className="mt-1 text-3xl font-black text-amber-200">{result.prize} cr.</p></div></div><p className="mt-5 text-sm leading-6 text-slate-300">{result.explanation}</p><Button type="button" onClick={simulate} disabled={!valid} className="gold-button mt-5"><Dices className="mr-2 h-4 w-4" />Jugar de nuevo</Button></article><aside className="rounded-[1.7rem] border border-white/10 bg-[#091812] p-6"><p className="eyebrow">Últimas pruebas</p><h2 className="font-display mt-1 text-3xl text-white">Sesión local</h2><div className="mt-5 space-y-3">{history.map((entry, index) => <div key={`${entry.gameId}-${index}`} className="rounded-xl border border-white/10 bg-white/4 p-3"><div className="flex justify-between gap-3"><strong className="text-sm text-white">{gameById(entry.gameId).title}</strong><span className="text-sm font-black text-amber-200">{entry.prize} cr.</span></div><p className="mt-1 text-xs text-slate-400">{entry.resultLabel}</p></div>)}</div></aside></section> : <section className="mt-7 rounded-[1.7rem] border border-dashed border-white/15 bg-white/3 p-6 text-sm leading-6 text-slate-300"><ShieldCheck className="mb-3 h-5 w-5 text-emerald-300" />Cuando simules una selección válida, verás aquí el resultado, coincidencias y el premio demostrativo. Nada de este panel se envía al servidor.</section>}
    </main>
  </PilotLayout>;
}

function Checkmark() {
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />;
}
