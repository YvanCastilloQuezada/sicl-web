import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRealtimePlayer } from "@/hooks/useRealtimePlayer";
import { AlertCircle, Loader2, LogOut, Radio, RefreshCw, Users } from "lucide-react";

type Props = { roundId: string };
const avatars = ["L", "M", "C", "S"];
const phaseCopy = {
  WAITING: { label: "Esperando inicio", detail: "Ya estás dentro de la sala. Mantén esta pantalla abierta mientras la TV prepara el evento." },
  ACTIVE: { label: "Evento en vivo", detail: "La ronda está activa. Las acciones válidas se sincronizan con el servidor." },
  CLOSING: { label: "Cierre en curso", detail: "La participación está finalizando. Espera la confirmación oficial del servidor." },
  FINISHED: { label: "Evento finalizado", detail: "El resultado queda disponible después del cierre y la verificación correspondiente." },
} as const;

export default function RealtimePlayerLobby({ roundId }: Props) {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("L");
  const [submitted, setSubmitted] = useState(false);
  const realtime = useRealtimePlayer({ roundId, nickname: submitted ? nickname : "", avatar });
  const connected = realtime.status === "connected";
  const connecting = realtime.status === "connecting" || realtime.status === "reconnecting";
  return (
    <section className="rounded-[2rem] border border-cyan-200/15 bg-cyan-200/5 p-5" aria-labelledby="realtime-lobby-title">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-200">TV · lobby realtime</p><h2 id="realtime-lobby-title" className="mt-1 text-xl font-black text-white">Únete a la sala</h2><p className="mt-1 text-xs leading-5 text-slate-300">Tu nickname y avatar solo identifican esta sesión virtual. La ronda y los resultados siguen bajo control del servidor.</p></div>
        <Badge className={connected ? "border border-emerald-200/25 bg-emerald-200/10 text-emerald-100" : "border border-amber-200/25 bg-amber-200/10 text-amber-100"}><Radio className="mr-1.5 h-3.5 w-3.5" />{connecting ? "Conectando" : connected ? "Conectado" : "Sin conexión"}</Badge>
      </div>
      {!submitted ? <form className="mt-4 space-y-3" onSubmit={(event) => { event.preventDefault(); if (nickname.trim()) setSubmitted(true); }}>
        <Input value={nickname} onChange={(event) => setNickname(event.target.value.slice(0, 24))} placeholder="Tu nickname" minLength={2} maxLength={24} required className="border-white/15 bg-black/20 text-white placeholder:text-slate-500" />
        <div className="flex flex-wrap gap-2" aria-label="Elige un avatar">
          {avatars.map((value) => <button key={value} type="button" onClick={() => setAvatar(value)} aria-pressed={avatar === value} className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-black ${avatar === value ? "border-amber-200 bg-amber-200 text-[#1a2419]" : "border-white/15 bg-white/5 text-white"}`}>{value}</button>)}
        </div>
        <Button type="submit" disabled={!nickname.trim() || connecting} className="w-full bg-cyan-200 text-[#10251e] hover:bg-cyan-100">{connecting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Conectando al lobby…</> : "Entrar al lobby"}</Button>
      </form> : <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between border border-white/10 bg-black/15 px-3 py-2"><span className="text-sm text-white">{realtime.player?.avatar ?? avatar} · {realtime.player?.nickname ?? nickname}</span><span className="text-xs text-slate-400">{realtime.player?.status ?? "pendiente"}</span></div>
        {realtime.error ? <div className="flex items-start gap-2 border border-rose-200/25 bg-rose-200/10 p-3 text-xs text-rose-100" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{realtime.error}</div> : null}
        <div className="border border-cyan-200/15 bg-cyan-200/5 p-4" aria-live="polite" aria-busy={connecting}><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-200">Estado de la sala</p><p className="mt-1 text-lg font-black text-white">{phaseCopy[realtime.lobby?.state ?? "WAITING"].label}</p></div><span className="grid h-10 w-10 place-items-center rounded-full border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">{realtime.lobby?.state === "ACTIVE" ? "▶" : realtime.lobby?.state === "FINISHED" ? "✓" : "…"}</span></div><p className="mt-2 text-xs leading-5 text-slate-300">{phaseCopy[realtime.lobby?.state ?? "WAITING"].detail}</p></div>
        <div className="flex items-center justify-between text-sm text-slate-300"><span className="flex items-center gap-2"><Users className="h-4 w-4 text-cyan-200" />Jugadores conectados</span><strong className="text-white">{realtime.lobby?.connectedCount ?? 0}/{realtime.lobby?.maxPlayers ?? 100}</strong></div>{connecting ? <p className="flex items-center gap-2 text-xs text-cyan-100" role="status"><Loader2 className="h-3.5 w-3.5 animate-spin" />Sincronizando tu sesión con la TV…</p> : null}
        {realtime.status === "error" || realtime.status === "closed" ? <Button type="button" variant="outline" onClick={realtime.connect} className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><RefreshCw className="mr-2 h-4 w-4" />Reintentar conexión</Button> : null}
        <Button type="button" variant="ghost" onClick={() => { realtime.disconnect(); setSubmitted(false); }} className="w-full text-slate-300 hover:bg-white/10 hover:text-white"><LogOut className="mr-2 h-4 w-4" />Salir del lobby</Button>
      </div>}
    </section>
  );
}
