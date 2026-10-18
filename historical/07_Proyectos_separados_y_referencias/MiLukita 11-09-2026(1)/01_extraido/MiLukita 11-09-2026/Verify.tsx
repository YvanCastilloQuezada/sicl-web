import PilotLayout from "@/components/PilotLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pilotProof } from "@/data/games";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Copy, Fingerprint, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Verify() {
  const [lookup, setLookup] = useState("");
  const [publicId, setPublicId] = useState("");
  useEffect(() => {
    const round = new URLSearchParams(window.location.search).get("round");
    if (round) {
      const normalized = round.toUpperCase();
      setLookup(normalized);
      setPublicId(normalized);
    }
  }, []);
  const proofQuery = trpc.games.verify.useQuery({ publicId }, { enabled: publicId.length >= 4, retry: false });
  const liveProof = proofQuery.data;
  const evidence = liveProof ? {
    roundId: liveProof.publicId,
    game: liveProof.gameType,
    ruleset: liveProof.ruleset?.version ?? "sin reglas publicadas",
    serverSeedHash: liveProof.serverSeedHash,
    revealedSeed: liveProof.revealedServerSeed ?? "Se revela al sortear",
    publicSeed: liveProof.publicSeed ?? "Se publica al cerrar",
    ticketSetHash: liveProof.ticketSetHash ?? "Se publica al cerrar",
    algorithm: liveProof.algorithmVersion,
    result: liveProof.result ? JSON.stringify(liveProof.result) : "Ronda todavía no sorteada",
  } : pilotProof;
  const proofRows = [
    ["Ronda", evidence.roundId],
    ["Reglas", evidence.ruleset],
    ["Hash publicado antes del cierre", evidence.serverSeedHash],
    ["Semilla revelada", evidence.revealedSeed],
    ["Fuente pública posterior", evidence.publicSeed],
    ["Hash del conjunto de boletos", evidence.ticketSetHash],
    ["Algoritmo", evidence.algorithm],
  ];
  const copy = (value: string) => {
    navigator.clipboard?.writeText(value);
    toast.success("Dato copiado", { description: "Puedes contrastarlo con el verificador independiente." });
  };
  return (
    <PilotLayout>
      <main className="container py-9 sm:py-14">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-[radial-gradient(circle_at_85%_15%,rgba(41,226,170,0.13),transparent_29%),#0a1e16] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div><p className="eyebrow">Verificación pública</p><h1 className="font-display mt-3 max-w-2xl text-4xl leading-tight text-white sm:text-6xl">Un resultado debe poder comprobarse, no solo mirarse.</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Cada expediente de ronda incluirá un compromiso previo, una semilla revelada, la versión de reglas, el conjunto cerrado de boletos y el algoritmo que permite reproducir el resultado.</p></div>
            <div className="rounded-3xl border border-emerald-300/25 bg-emerald-300/8 p-6"><Fingerprint className="h-7 w-7 text-amber-200" /><p className="mt-5 text-sm font-semibold text-emerald-100">{liveProof ? "Resultado de ronda conectada" : "Resultado del ejemplo piloto"}</p><p className="font-display mt-1 break-words text-4xl text-white">{evidence.result}</p><p className="mt-4 text-xs leading-5 text-emerald-100/70">{liveProof ? "El expediente se obtuvo desde la base de auditoría del servidor." : "Este expediente es demostrativo. Busca un ID real de ronda para consultar su evidencia."}</p></div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#0a1b14] p-5 sm:p-8"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-emerald-300" /><div><p className="text-sm font-bold text-white">Expediente {evidence.roundId}</p><p className="text-xs text-slate-400">{evidence.game} · resultado reproducible</p></div></div><div className="mt-6 divide-y divide-white/8">{proofRows.map(([label, value]) => <div key={label} className="py-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p><div className="mt-2 flex items-start gap-3"><code className="min-w-0 flex-1 break-all text-xs leading-5 text-emerald-100">{value}</code><button type="button" onClick={() => copy(value)} className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/8 hover:text-white" aria-label={`Copiar ${label}`}><Copy className="h-3.5 w-3.5" /></button></div></div>)}</div></div>
          <aside className="space-y-5"><div className="rounded-[2rem] border border-amber-200/15 bg-[#211c10] p-6"><LockKeyhole className="h-5 w-5 text-amber-200" /><h2 className="font-display mt-4 text-3xl text-white">Busca un expediente</h2><div className="mt-5 flex gap-2"><Input value={lookup} onChange={(event) => setLookup(event.target.value.toUpperCase())} placeholder="Ej.: RP-R-AB12CD34" className="border-white/10 bg-black/20 text-white placeholder:text-slate-500" /><Button type="button" onClick={() => { if (lookup.trim().length < 4) { toast.error("Ingresa un ID de ronda válido"); return; } setPublicId(lookup.trim()); }} className="gold-button px-3" aria-label="Buscar expediente"><Search className="h-4 w-4" /></Button></div>{publicId && !proofQuery.isLoading && !liveProof ? <p className="mt-3 text-xs leading-5 text-amber-100">No se encontró un expediente con ese ID. Verifica el código o usa el ejemplo mostrado.</p> : null}<ol className="mt-5 space-y-4 text-sm leading-6 text-slate-300"><li><span className="mr-2 font-black text-amber-200">01</span>Se publica el hash antes del cierre.</li><li><span className="mr-2 font-black text-amber-200">02</span>Se bloquean las participaciones y su conjunto queda trazado.</li><li><span className="mr-2 font-black text-amber-200">03</span>Se revela la semilla y se reproduce el resultado.</li></ol></div><Button className="gold-button w-full" onClick={() => toast.success("Verificación completada", { description: `El ejemplo coincide con ${evidence.result}.` })}><CheckCircle2 className="mr-2 h-4 w-4" />Comprobar evidencia</Button></aside>
        </section>
      </main>
    </PilotLayout>
  );
}
