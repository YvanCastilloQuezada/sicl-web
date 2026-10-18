import { Button } from "@/components/ui/button";
import PilotLayout from "@/components/PilotLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ROULETTE_BET_CODES, SIMPLIFIED_BINGO_CONFIG, SIMPLIFIED_BINGO_TYPES, SIMPLIFIED_ROULETTE_CONFIG, SIMPLIFIED_ROULETTE_TYPES, type SimplifiedBingoType, type SimplifiedRouletteType } from "@shared/simplifiedGames";
import { cn } from "@/lib/utils";
import { Check, Dices, Grid3X3, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

type SimplifiedGameType = SimplifiedBingoType | SimplifiedRouletteType;

function initialSimplifiedGame(mode: "bingo" | "ruleta"): SimplifiedGameType {
  const fallback = mode === "bingo" ? "bingo_flash" : "ruleta_7";
  if (typeof window === "undefined") return fallback;
  const requested = new URLSearchParams(window.location.search).get("game");
  const allowed = mode === "bingo" ? SIMPLIFIED_BINGO_TYPES : SIMPLIFIED_ROULETTE_TYPES;
  return allowed.includes(requested as never) ? requested as SimplifiedGameType : fallback;
}

const bingo75Columns = [
  { label: "B", values: Array.from({ length: 15 }, (_, index) => index + 1), required: 5 },
  { label: "I", values: Array.from({ length: 15 }, (_, index) => index + 16), required: 5 },
  { label: "N", values: Array.from({ length: 15 }, (_, index) => index + 31), required: 4 },
  { label: "G", values: Array.from({ length: 15 }, (_, index) => index + 46), required: 5 },
  { label: "O", values: Array.from({ length: 15 }, (_, index) => index + 61), required: 5 },
];

function randomNumbers(range: number, count: number) {
  const pool = Array.from({ length: range }, (_, index) => index + 1);
  return Array.from({ length: count }, () => pool.splice(Math.floor(Math.random() * pool.length), 1)[0]).sort((a, b) => a - b);
}

function randomBingo75() {
  return bingo75Columns.flatMap((column) => randomNumbers(15, column.required).map((value) => value + column.values[0] - 1)).sort((a, b) => a - b);
}

export default function SimplifiedGamesPage({ mode }: { mode: "bingo" | "ruleta" }) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [gameType, setGameType] = useState<SimplifiedGameType>(() => initialSimplifiedGame(mode));
  const [picks, setPicks] = useState<number[]>(() => mode === "ruleta" ? [ROULETTE_BET_CODES.red] : []);
  const rounds = trpc.games.rounds.useQuery();
  const reserve = trpc.games.reserveTicket.useMutation({ onSuccess: () => { rounds.refetch(); }, onError: () => undefined });
  const isBingo = SIMPLIFIED_BINGO_TYPES.includes(gameType as SimplifiedBingoType);
  const bingoConfig = isBingo ? SIMPLIFIED_BINGO_CONFIG[gameType as SimplifiedBingoType] : null;
  const rouletteConfig = !isBingo ? SIMPLIFIED_ROULETTE_CONFIG[gameType as SimplifiedRouletteType] : null;
  const participationPrice = isBingo ? 1 : rouletteConfig!.priceCredits;
  const detailText = isBingo
    ? `${bingoConfig!.draws} bolillas; incluye una bolilla de consuelo. Selecciona la cartilla manualmente o usa la generación automática. RTP ${(bingoConfig!.rtp * 100).toFixed(4)}%.`
    : `${rouletteConfig!.pockets} resultados; Color y Par/Impar devuelven ${rouletteConfig!.totalPayout} créditos totales al acertar.`;
  const round = rounds.data?.find((item) => item.gameType === gameType && item.state === "open");
  const valid = useMemo(() => {
    if (!isBingo) return picks.length === 1;
    if (gameType !== "bingo_75") return picks.length === bingoConfig?.pickLimit;
    return bingo75Columns.every((column) => picks.filter((value) => value >= column.values[0] && value <= column.values[column.values.length - 1]).length === column.required);
  }, [bingoConfig?.pickLimit, gameType, isBingo, picks]);

  const reset = () => setPicks(mode === "ruleta" ? [ROULETTE_BET_CODES.red] : []);
  const automatic = () => {
    if (!isBingo) return setPicks([Math.floor(Math.random() * 4)]);
    setPicks(gameType === "bingo_75" ? randomBingo75() : randomNumbers(bingoConfig!.range, bingoConfig!.pickLimit));
  };
  const toggle = (value: number) => {
    if (!isBingo) return setPicks([value]);
    const limit = gameType === "bingo_75" ? bingo75Columns.find((column) => column.values.includes(value))!.required : bingoConfig!.pickLimit;
    const peers = gameType === "bingo_75" ? picks.filter((pick) => bingo75Columns.find((column) => column.values.includes(value))!.values.includes(pick)) : picks;
    if (picks.includes(value)) return setPicks(picks.filter((pick) => pick !== value));
    if (peers.length >= limit) return;
    setPicks([...picks, value].sort((a, b) => a - b));
  };
  const reserveTicket = () => {
    if (!user) return startLogin();
    if (!round || !valid) return;
    reserve.mutate({ roundPublicId: round.publicId, picks, quantity: 1, idempotencyKey: `simple-${gameType}-${crypto.randomUUID()}` });
  };

  return <PilotLayout>
    <main className="container py-10 sm:py-14">
      <section className="mb-8 max-w-3xl">
        <p className="eyebrow">Modalidades virtuales verificables</p>
        <h1 className="font-display mt-3 text-4xl text-white sm:text-6xl">{mode === "bingo" ? "Bingos simplificados" : "Ruletas simplificadas"}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{mode === "bingo" ? "Selección manual o automática de cartón, sorteos HMAC verificables y créditos exclusivamente virtuales." : "Elige Color o Par/Impar; los sorteos usan HMAC verificable y créditos exclusivamente virtuales."} No hay pagos, retiros ni valor monetario.</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <aside className="space-y-3">
          {(mode === "bingo" ? SIMPLIFIED_BINGO_TYPES : SIMPLIFIED_ROULETTE_TYPES).map((type) => {
            const config = type.startsWith("bingo") ? SIMPLIFIED_BINGO_CONFIG[type as SimplifiedBingoType] : SIMPLIFIED_ROULETTE_CONFIG[type as SimplifiedRouletteType];
            const rtp = "rtp" in config ? config.rtp : 0;
            return <button key={type} onClick={() => { setGameType(type); setPicks(type.startsWith("ruleta") ? [ROULETTE_BET_CODES.red] : []); }} className={cn("w-full rounded-2xl border p-5 text-left", gameType === type ? "border-amber-200/60 bg-amber-200/10" : "border-white/10 bg-white/3 hover:bg-white/6")}>
              <div className="flex items-center justify-between gap-3"><strong className="text-white">{config.title}</strong><span className="text-xs font-bold text-emerald-200">RTP {(rtp * 100).toFixed(2)}%</span></div>
              <p className="mt-2 text-xs text-slate-400">{"pockets" in config ? `${config.pockets} resultados · edge ${(config.houseEdge * 100).toFixed(2)}%` : `${config.pickLimit} números · ${config.draws} bolillas`}</p>
            </button>;
          })}
        </aside>

        <section className="rounded-3xl border border-white/10 bg-[#0b1d16] p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">{participationPrice} {participationPrice === 1 ? "crédito virtual" : "créditos virtuales"} por participación</p><h2 className="font-display mt-2 text-3xl text-white">{isBingo ? bingoConfig!.title : rouletteConfig!.title}</h2><p className="mt-2 text-sm text-slate-300">{detailText}</p><Link href={`/aprender?game=${gameType}`} className="mt-4 inline-flex items-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-50 hover:bg-emerald-300/20"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Practicar esta modalidad</Link></div><div className="rounded-xl bg-emerald-300/10 px-4 py-3 text-right text-xs text-emerald-100">{round ? <>Ronda abierta<br/><strong>{round.publicId}</strong></> : <>Ronda pendiente de apertura<br/><strong>Operador requerido</strong></>}</div></div>

          {!isBingo ? <div className="mt-8 grid gap-3 sm:grid-cols-2">{Object.entries(ROULETTE_BET_CODES).map(([label, code]) => <button key={label} onClick={() => toggle(code)} className={cn("rounded-2xl border p-5 text-left capitalize", picks[0] === code ? "border-amber-200 bg-amber-200/15 text-white" : "border-white/10 bg-white/4 text-slate-200")}>{label === "red" ? "Rojo" : label === "black" ? "Negro" : label === "even" ? "Par" : "Impar"}</button>)}</div> : <>
            <div className="mt-7 flex flex-wrap items-center gap-3"><span className="rounded-lg border border-emerald-300/20 bg-emerald-300/5 px-3 py-2 text-xs font-bold text-emerald-100">MANUAL: toca los números del cartón</span><Button type="button" variant="outline" onClick={automatic}><Sparkles className="mr-2 h-4 w-4"/>Generar automático</Button><Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4"/>Limpiar</Button><span className="text-sm text-slate-400">{picks.length}/{bingoConfig!.pickLimit} seleccionados</span></div>
            {gameType === "bingo_75" ? <div className="mt-7 overflow-x-auto pb-2"><div className="grid min-w-[640px] grid-cols-5 gap-3">{bingo75Columns.map((column) => <div key={column.label} className="rounded-2xl border border-white/10 p-3"><h3 className="mb-3 text-center font-display text-2xl text-amber-200">{column.label}{column.label === "N" && <span className="ml-1 text-[10px] text-slate-400">LIBRE</span>}</h3><div className="grid grid-cols-3 gap-1">{column.values.map((value) => <button key={value} onClick={() => toggle(value)} className={cn("h-11 rounded-md text-sm font-bold", picks.includes(value) ? "bg-amber-300 text-[#132116]" : "bg-white/5 text-slate-200 hover:bg-white/10")}>{value}</button>)}</div></div>)}</div></div> : <div className="mt-7 grid grid-cols-5 gap-2 sm:grid-cols-10">{Array.from({ length: bingoConfig!.range }, (_, index) => index + 1).map((value) => <button key={value} onClick={() => toggle(value)} className={cn("h-11 rounded-lg text-sm font-bold", picks.includes(value) ? "bg-amber-300 text-[#132116]" : "bg-white/5 text-slate-200 hover:bg-white/10")}>{value}</button>)}</div>}
          </>}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6"><div className="text-sm text-slate-300">{valid ? <span className="inline-flex items-center gap-2 text-emerald-200"><Check className="h-4 w-4"/>Selección válida</span> : "Completa la selección para continuar."}</div><Button disabled={!round || !valid || reserve.isPending} onClick={reserveTicket} className="bg-amber-300 text-[#132116] hover:bg-amber-200">{reserve.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Dices className="mr-2 h-4 w-4"/>}{user ? "Confirmar ticket virtual" : "Ingresar para continuar"}</Button></div>
        </section>
      </div>
      <p className="mt-8 text-center text-xs text-slate-500"><Grid3X3 className="mr-1 inline h-3 w-3"/>La generación automática de esta pantalla solo prepara una selección. La reserva y el comprobante se realizan en el servidor.</p>
    </main>
  </PilotLayout>;
}
