import { useEffect, useRef, useState } from "react";
import { Bell, CalendarClock, CircleDot, Megaphone, Users, Wifi } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { playTvRemoteTone } from "@/hooks/useTvRemoteNavigation";

function formatLiveCountdown(totalSeconds: number | null) {
  if (totalSeconds === null) return "--:--:--";
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((safe % 3600) / 60).toString().padStart(2, "0");
  const seconds = Math.floor(safe % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function getStoredReminder(): 1 | 5 | 10 | null {
  const stored = window.localStorage.getItem("milukita-live-reminder-minutes");
  return stored === "1" ? 1 : stored === "5" ? 5 : stored === "10" ? 10 : null;
}

export default function LiveChannelPanel() {
  const live = trpc.broadcast.livePreview.useQuery(undefined, { refetchInterval: 15_000 });
  const manifest = live.data?.manifest;
  const [nextSeconds, setNextSeconds] = useState<number | null>(null);
  const [eventRemainingSeconds, setEventRemainingSeconds] = useState<number | null>(null);
  const [eventNotice, setEventNotice] = useState<string | null>(null);
  const [qrPulse, setQrPulse] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState<1 | 5 | 10 | null>(() => getStoredReminder());
  const previousEventId = useRef<string | null>(null);
  const previousQr = useRef<"READY" | "HIDDEN" | "EXPIRED" | null>(null);
  const nextDeadline = useRef<number | null>(null);
  const eventDeadline = useRef<number | null>(null);
  const nextEventKey = useRef<string | null>(null);
  const remindedEventKey = useRef<string | null>(null);

  useEffect(() => {
    if (!manifest) return;
    const eventChanged = previousEventId.current !== null && previousEventId.current !== manifest.eventId;
    if (eventChanged) {
      setEventNotice(`Comenzó ${manifest.label}`);
      playTvRemoteTone("select");
      const noticeTimer = window.setTimeout(() => setEventNotice(null), 6000);
      previousEventId.current = manifest.eventId;
      return () => window.clearTimeout(noticeTimer);
    }
    previousEventId.current = manifest.eventId;
  }, [manifest?.eventId, manifest?.label]);

  useEffect(() => {
    if (!manifest) return;
    if (previousQr.current !== null && previousQr.current !== "READY" && manifest.qr === "READY") {
      setQrPulse(true);
      const pulseTimer = window.setTimeout(() => setQrPulse(false), 1400);
      previousQr.current = manifest.qr;
      return () => window.clearTimeout(pulseTimer);
    }
    previousQr.current = manifest.qr;
  }, [manifest?.qr]);

  useEffect(() => {
    if (!manifest || manifest.durationSeconds <= 0) {
      eventDeadline.current = null;
      setEventRemainingSeconds(null);
      return;
    }
    if (eventDeadline.current === null || previousEventId.current === manifest.eventId) {
      eventDeadline.current = Date.now() + manifest.remainingSeconds * 1000;
    }
    const update = () => setEventRemainingSeconds(Math.max(0, Math.ceil(((eventDeadline.current ?? Date.now()) - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [manifest?.eventId, manifest?.remainingSeconds, manifest?.durationSeconds]);

  useEffect(() => {
    const next = manifest?.nextEvent;
    if (!next) {
      nextDeadline.current = null;
      nextEventKey.current = null;
      setNextSeconds(null);
      return;
    }
    if (nextEventKey.current !== next.eventId) {
      nextDeadline.current = Date.now() + next.startsInSeconds * 1000;
      nextEventKey.current = next.eventId;
      remindedEventKey.current = null;
    }
    const update = () => setNextSeconds(Math.max(0, Math.ceil(((nextDeadline.current ?? Date.now()) - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [manifest?.nextEvent?.eventId, manifest?.nextEvent?.startsInSeconds]);

  useEffect(() => {
    const next = manifest?.nextEvent;
    if (!next || reminderMinutes === null || nextEventKey.current !== next.eventId || remindedEventKey.current === next.eventId) return;
    const deadline = (nextDeadline.current ?? Date.now()) - reminderMinutes * 60_000;
    const notify = () => {
      if (remindedEventKey.current === next.eventId) return;
      remindedEventKey.current = next.eventId;
      setEventNotice(`Falta ${reminderMinutes} ${reminderMinutes === 1 ? "minuto" : "minutos"} para ${next.label}`);
      playTvRemoteTone("select");
      window.setTimeout(() => setEventNotice(null), 6000);
    };
    const delay = deadline - Date.now();
    if (delay <= 0) notify();
    else {
      const timer = window.setTimeout(notify, delay);
      return () => window.clearTimeout(timer);
    }
  }, [manifest?.nextEvent?.eventId, manifest?.nextEvent?.label, reminderMinutes, nextSeconds]);

  const changeReminder = (value: 1 | 5 | 10 | null) => {
    setReminderMinutes(value);
    if (value === null) window.localStorage.removeItem("milukita-live-reminder-minutes");
    else window.localStorage.setItem("milukita-live-reminder-minutes", String(value));
    remindedEventKey.current = null;
  };

  if (live.isLoading) return <section className="mt-6 border border-emerald-300/15 bg-black/20 p-5 text-sm text-slate-400">Cargando programación de MiLukita LIVE…</section>;
  if (live.isError || !manifest) return <section className="mt-6 border border-amber-200/20 bg-amber-200/5 p-5 text-sm text-amber-100">MiLukita LIVE está temporalmente en contingencia. La experiencia de rondas y verificación permanece separada.</section>;

  const duration = Math.max(1, manifest.durationSeconds);
  const remaining = eventRemainingSeconds ?? manifest.remainingSeconds;
  const elapsed = Math.max(0, duration - remaining);
  const progress = Math.min(100, Math.max(0, (elapsed / duration) * 100));

  return <section className="mt-6 border border-emerald-300/20 bg-[#07150f] p-5 sm:p-6" aria-label="MiLukita LIVE"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-emerald-200"><CircleDot className="h-4 w-4" /> MiLukita LIVE · piloto</div><span className="inline-flex items-center gap-2 text-xs text-slate-400"><Wifi className="h-3.5 w-3.5 text-emerald-300" /> Manifest de MJP CORE · solo virtual</span></div>{eventNotice ? <div className="live-event-notice mt-4 flex items-center gap-3 border border-amber-200/35 bg-amber-200/10 px-4 py-3" role="status" aria-live="assertive"><Megaphone className="h-5 w-5 shrink-0 text-amber-200" /><div><p className="font-bold text-amber-50">Aviso de MiLukita LIVE</p><p className="text-sm text-amber-100/80">{eventNotice}</p></div></div> : null}<div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_.8fr]"> <div className="border border-white/10 bg-white/[.03] p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Ahora</p><h2 className="mt-2 font-display text-3xl text-white">{manifest.label}</h2><div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300"><span className="border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-emerald-100">{manifest.state}</span><span className="inline-flex items-center gap-2 border border-white/10 px-3 py-2"><Users className="h-4 w-4" />{manifest.players} jugadores</span><span className={`border px-3 py-2 text-amber-100 ${qrPulse ? "live-qr-available" : "border-amber-200/20 bg-amber-200/10"}`}>{manifest.qr === "READY" ? "QR listo para escanear" : "QR fuera de ventana"}</span></div><div className="mt-6" aria-label="Progreso del evento actual"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.14em] text-slate-400"><span>Progreso del evento</span><span className="text-emerald-200">{Math.round(progress)} %</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-200 transition-[width] duration-500" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>Transcurrido {formatLiveCountdown(elapsed)}</span><span>Restante {formatLiveCountdown(remaining)}</span></div></div></div><div className="border border-cyan-200/20 bg-cyan-200/5 p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-cyan-200"><CalendarClock className="h-4 w-4" /> Próximo evento</p><h3 className="mt-3 font-display text-2xl text-white">{manifest.nextEvent?.label ?? "Fin de agenda"}</h3><p className="mt-2 text-xs uppercase tracking-[.15em] text-cyan-100/70">Comienza en</p><p className="live-next-countdown mt-1 font-mono text-5xl font-black tabular-nums text-white" aria-live="polite">{formatLiveCountdown(nextSeconds)}</p><p className="mt-2 text-sm text-slate-400">{manifest.nextEvent ? "La programación continúa sin bloquear la participación." : "La agenda se reinicia de forma controlada."}</p><div className="mt-4 border-t border-cyan-200/15 pt-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-cyan-100/80"><Bell className="h-3.5 w-3.5" /> Recordarme</p><div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Recordatorio del próximo evento"><button type="button" onClick={() => changeReminder(1)} aria-pressed={reminderMinutes === 1} className={`border px-3 py-2 text-xs font-bold ${reminderMinutes === 1 ? "border-cyan-200 bg-cyan-200/20 text-white" : "border-white/15 text-slate-300 hover:bg-white/10"}`}>1 min</button><button type="button" onClick={() => changeReminder(5)} aria-pressed={reminderMinutes === 5} className={`border px-3 py-2 text-xs font-bold ${reminderMinutes === 5 ? "border-cyan-200 bg-cyan-200/20 text-white" : "border-white/15 text-slate-300 hover:bg-white/10"}`}>5 min</button><button type="button" onClick={() => changeReminder(10)} aria-pressed={reminderMinutes === 10} className={`border px-3 py-2 text-xs font-bold ${reminderMinutes === 10 ? "border-cyan-200 bg-cyan-200/20 text-white" : "border-white/15 text-slate-300 hover:bg-white/10"}`}>10 min</button><button type="button" onClick={() => changeReminder(null)} aria-pressed={reminderMinutes === null} className={`border px-3 py-2 text-xs font-bold ${reminderMinutes === null ? "border-white/35 bg-white/10 text-white" : "border-white/15 text-slate-300 hover:bg-white/10"}`}>No</button></div><p className="mt-2 text-[11px] leading-4 text-slate-500">Se guarda en este dispositivo y funciona mientras la vista TV permanezca abierta.</p></div></div></div><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span>Evento: {manifest.eventId}</span><span>Resultado: {manifest.result === "AVAILABLE" ? "disponible" : "pendiente"}</span><span>Fuente autoritativa: MJP CORE</span></div></section>;
}
