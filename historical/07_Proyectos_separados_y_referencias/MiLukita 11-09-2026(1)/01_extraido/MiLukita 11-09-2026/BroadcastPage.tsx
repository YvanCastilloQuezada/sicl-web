import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PilotLayout from "@/components/PilotLayout";
import { trpc } from "@/lib/trpc";
import { formatCountdown } from "@/hooks/useCountdown";
import { AlertTriangle, BellRing, CheckCircle2, ExternalLink, LogOut, Radio, RefreshCw, ShieldCheck, Sparkles, Ticket, Tv, Volume2, VolumeX, Wifi, WifiOff, X } from "lucide-react";
import BroadcastAccessGuide from "@/components/BroadcastAccessGuide";
import ManifestConnectionStatus from "@/components/ManifestConnectionStatus";
import { describeManifestChange, getManifestConnectionState, type ManifestConnectionState, type ManifestNotice } from "../../../shared/manifestUi";
import { getQrExpiryState, getQrProgressPercent, getQrProgressTone } from "../../../shared/qrExpiry";
import ManifestStatsPanel from "@/components/ManifestStatsPanel";
import ManifestTestPanel from "@/components/ManifestTestPanel";
import TvModeStartScreen, { type TvViewingMode } from "@/components/TvModeStartScreen";
import MiLukitaCircularQR from "@/components/MiLukitaCircularQR";
import TVBrandGuide from "@/components/TVBrandGuide";
import TvScreensaver from "@/components/TvScreensaver";
import LiveChannelPanel from "@/components/LiveChannelPanel";
import TvHeartbeatStatus from "@/components/TvHeartbeatStatus";
import TvMaintenanceScreen from "@/components/TvMaintenanceScreen";
import TvAgentsStatus from "@/components/TvAgentsStatus";
import { playTvRemoteTone } from "@/hooks/useTvRemoteNavigation";
import { normalizeCircularQrVariant, type CircularQrVariant } from "../../../shared/circularQr";
import { getManifestTimingWindow } from "../../../shared/manifestTiming";
import { tvConnectionLabel, type TvConnectionState } from "../../../shared/tvGamesProductive";

function StatusBadge({ state }: { state?: string }) {
  const labels: Record<string, string> = { scheduled: "Programada", open: "Ronda abierta", locked: "Participación cerrada", drawn: "Resultado disponible", verified: "Verificada", cancelled: "Cancelada" };
  return <Badge className="border border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10">{labels[state ?? ""] ?? "Esperando"}</Badge>;
}

function readResultNumbers(value: unknown) {
  if (!value) return [] as number[];
  const raw = value as { numbers?: number[]; result?: number[] } | number[];
  return Array.isArray(raw) ? raw : raw.numbers ?? raw.result ?? [];
}

type NotificationTheme = "emerald" | "amber" | "midnight" | "contrast";
const notificationThemes: Record<NotificationTheme, { label: string; section: string; icon: string; title: string }> = {
  emerald: { label: "Esmeralda MJP", section: "border-emerald-300/25 bg-emerald-300/10", icon: "bg-emerald-300/15 text-emerald-200", title: "text-emerald-50" },
  amber: { label: "Dorado cálido", section: "border-amber-200/30 bg-amber-200/10", icon: "bg-amber-200/15 text-amber-100", title: "text-amber-50" },
  midnight: { label: "Azul medianoche", section: "border-sky-300/25 bg-sky-300/10", icon: "bg-sky-300/15 text-sky-100", title: "text-sky-50" },
  contrast: { label: "Alto contraste", section: "border-white/70 bg-white text-black", icon: "bg-black text-white", title: "text-black" },
};

type TvPromoSlide = { eyebrow: string; title: string; detail: string; icon: string; videoUrl?: string };

const tvPromoSlides: TvPromoSlide[] = [
  { eyebrow: "MiLukita aprende", title: "Juega entendiendo", detail: "Practica las reglas y explora el piloto con créditos virtuales.", icon: "✦" },
  { eyebrow: "Puente TV → celular", title: "Escanea cuando estés listo", detail: "El QR firmado te lleva a la ronda exacta sin perder la transmisión.", icon: "⌁" },
  { eyebrow: "Transparencia visible", title: "Verifica cada resultado", detail: "Consulta las reglas, el cierre y la evidencia pública del evento.", icon: "✓" },
];

function FullScreenManifestState({ state, title, detail }: { state: ManifestConnectionState; title: string; detail: string }) {
  return <main className="grid min-h-screen place-items-center bg-[#06100c] p-8 text-white"><div className="w-full max-w-xl"><ManifestConnectionStatus state={state} detail={detail} /><div className="manifest-shimmer mt-5 border border-white/10 bg-white/[.03] p-8 text-center"><div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${state === "disconnected" ? "bg-amber-200/10 text-amber-200" : "bg-emerald-300/10 text-emerald-200"}`}>{state === "disconnected" ? <WifiOff className="h-7 w-7" /> : <Tv className="h-7 w-7" />}</div><p className="mt-5 font-display text-3xl text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p></div></div></main>;
}

function QrContextTransition({ loading, updated, error, hasContext }: { loading: boolean; updated: boolean; error: boolean; hasContext: boolean }) {
  if (loading && !hasContext) return <div className="qr-context-transition mt-4 flex items-center gap-3 border border-cyan-200/20 bg-cyan-200/5 p-3 text-sm text-cyan-100" role="status" aria-live="polite"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cyan-200/30"><RefreshCw className="h-4 w-4 animate-spin" /></span><span><strong className="block">Preparando contexto QR…</strong><span className="text-xs text-cyan-100/70">Sincronizando evento y vencimiento autoritativo.</span></span></div>;
  if (error && !hasContext) return <div className="qr-context-transition mt-4 flex items-center gap-3 border border-amber-200/20 bg-amber-200/5 p-3 text-sm text-amber-100" role="status" aria-live="polite"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber-200/30">!</span><span><strong className="block">Contexto QR temporalmente desconectado</strong><span className="text-xs text-amber-100/70">Se conserva el último estado seguro disponible.</span></span></div>;
  if (updated) return <div className="qr-context-transition mt-4 flex items-center gap-3 border border-emerald-200/20 bg-emerald-200/5 p-3 text-sm text-emerald-100" role="status" aria-live="polite"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-emerald-200/30"><CheckCircle2 className="h-4 w-4" /></span><span><strong className="block">Contexto QR actualizado</strong><span className="text-xs text-emerald-100/70">El nuevo código ya coincide con el evento recibido.</span></span></div>;
  if (loading && hasContext) return <div className="mt-4 flex items-center gap-2 text-xs text-slate-400" role="status" aria-live="polite"><RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-200" />Actualizando contexto QR…</div>;
  return null;
}

function QrValidityIndicator({ qr, now = Date.now() }: { qr?: { available: boolean; signed: boolean; targetUrl: string | null; expiresAt: string | null } | null; now?: number }) {
  const expiry = getQrExpiryState(qr?.expiresAt, now);
  const { expiresAt, secondsRemaining, expired } = expiry;
  const valid = Boolean(qr?.available && qr.signed && qr.targetUrl && !expired && secondsRemaining !== null);
  const label = valid ? "QR válido" : expired ? "QR vencido" : qr?.available ? "QR requiere validación" : "QR inactivo";
  const detail = valid ? `Expira en ${formatCountdown(secondsRemaining ?? 0)} · ${new Date(expiresAt).toLocaleTimeString()}` : expired ? "La ronda cerró; no uses este código" : qr?.available ? "La TV conserva el manifest, pero el QR no está listo" : "Se habilita únicamente con una ronda abierta";
  return <span className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold ${valid ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : expired ? "border-amber-200/30 bg-amber-200/10 text-amber-100" : "border-white/15 bg-white/5 text-slate-300"}`} role="status" aria-label={`${label}: ${detail}`}><span className={`h-2 w-2 rounded-full ${valid ? "bg-emerald-300" : expired ? "bg-amber-200" : "bg-slate-500"}`} />{label}<span className="font-normal text-current/75">· {detail}</span></span>;
}

export function BroadcastOverlayPage() {
  const [, params] = useRoute("/overlay/:roundId");
  const roundQuery = trpc.broadcast.round.useQuery({ roundId: params?.roundId ?? "" }, { enabled: Boolean(params?.roundId), refetchInterval: 5000 });
  const manifestQuery = trpc.broadcast.manifest.useQuery({ roundId: params?.roundId ?? "" }, { enabled: Boolean(params?.roundId), refetchInterval: 5000 });
  const round = roundQuery.data;
  const manifest = manifestQuery.data;
  const unifiedQr = manifest?.qr;
  const connectionState: ManifestConnectionState = getManifestConnectionState({ isLoading: manifestQuery.isLoading, isError: manifestQuery.isError, hasManifest: Boolean(manifest) });
  const result = useMemo(() => readResultNumbers(manifest?.result.available ? manifest.result.value : round?.result), [manifest?.result.available, manifest?.result.value, round?.result]);

  if (roundQuery.isLoading) return <FullScreenManifestState state="loading" title="Preparando señal de ronda" detail="Estamos sincronizando el evento con MJP Core…" />;
  if (!round) return <FullScreenManifestState state="disconnected" title="Ronda no disponible" detail="El identificador no tiene una proyección pública vigente. Verifica el enlace del overlay." />;

  const countdownSeconds = manifest?.countdown.seconds ?? round.countdown;
  const timingWindow = manifest ? getManifestTimingWindow(manifest, Date.now()) : null;
  return <main className="min-h-screen bg-[radial-gradient(circle_at_85%_10%,rgba(39,211,157,.18),transparent_30%),#06100c] p-5 text-white sm:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.28em] text-emerald-300">MULTI JUEGOS PERÚ TV</p><h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">{manifest?.event.gameName ?? round.gameName}</h1><p className="mt-2 text-sm text-slate-400">Ronda {round.roundId} · Reglas {round.rulesetVersion}{round.event ? ` · Evento ${round.event.status}` : ""}</p></div><div className="w-full max-w-sm lg:w-80"><ManifestConnectionStatus state={connectionState} refreshing={manifestQuery.isFetching && Boolean(manifest)} detail={manifestQuery.isError ? "Respaldo temporal: última ronda conocida" : manifest ? `Secuencia ${manifest.sequence} · ${manifest.event.status}` : undefined} /></div></div><div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_320px]"><section className="text-center"><p className="text-sm font-bold uppercase tracking-[.25em] text-amber-200">{manifest?.event.status === "OPEN" || round.state === "open" ? "Cierre en" : manifest?.result.verified ? "Resultado verificado" : "Estado de ronda"}</p><p className="mt-3 font-mono text-7xl font-black tabular-nums text-emerald-200 sm:text-8xl">{countdownSeconds !== null && countdownSeconds !== undefined && (manifest?.event.status === "OPEN" || round.state === "open") ? formatCountdown(countdownSeconds) : manifest?.result.verified || round.state === "drawn" ? "LISTO" : "—"}</p>{result.length ? <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">{result.map((number, index) => <div key={`${number}-${index}`} className="grid h-16 w-16 place-items-center rounded-full border border-amber-200/40 bg-amber-200/10 text-2xl font-black text-amber-100 sm:h-20 sm:w-20 sm:text-3xl">{number}</div>)}</div> : <p className="mt-7 text-slate-400">El resultado se mostrará después del cierre autoritativo.</p>}</section><aside className="border border-white/10 bg-black/25 p-5 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Escanea para participar</p>{unifiedQr?.available && unifiedQr.imageDataUrl ? <MiLukitaCircularQR source={unifiedQr} variant="circle" size={260} timerProgress={timingWindow?.authoritative ? timingWindow.progressPercent ?? undefined : undefined} timerRemainingSeconds={timingWindow?.authoritative ? timingWindow.remainingSeconds ?? undefined : undefined} /> : <div className="mt-4 grid h-60 place-items-center border border-dashed border-white/15 text-sm text-slate-500">QR disponible<br />mientras la ronda está abierta</div>}<p className="mt-4 text-xs leading-5 text-slate-400">Créditos virtuales gratuitos.<br />Sin dinero real ni retiros.</p></aside></div>{manifest ? <ManifestStatsPanel manifest={manifest} /> : null}<footer className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><Radio className="h-4 w-4 text-emerald-300" /> Señal de estado del servidor</span><span>Verificación: /verificar · {round.virtualOnly ? "Piloto virtual" : ""}</span></footer></main>;
}

export default function BroadcastPage() {
  const broadcast = trpc.broadcast.id.useQuery();
  const rounds = trpc.broadcast.rounds.useQuery(undefined, { refetchInterval: 10000 });
  const heartbeatHealth = trpc.broadcast.liveHeartbeatHealth.useQuery(undefined, { refetchInterval: 15000 });
  const agentHealth = trpc.broadcast.agentHealth.useQuery(undefined, { refetchInterval: 20000 });
  const activeRoundId = rounds.data?.find((item) => item?.state === "open")?.roundId ?? rounds.data?.[0]?.roundId ?? "";
  const activeManifestQuery = trpc.broadcast.manifest.useQuery({ roundId: activeRoundId }, { enabled: Boolean(activeRoundId), refetchInterval: 5000, retry: 3, retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000) });
  const activeManifest = activeManifestQuery.data;
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("v")?.match(/^[a-zA-Z0-9_-]{6,20}$/)?.[0] ?? "";
  const promoVideoUrl = params.get("promoVideo")?.match(/^https:\/\/[a-zA-Z0-9./?=_-]+$/)?.[0] ?? "";
  const controllerSessionId = params.get("controllerSession") ?? "";
  const controllerScreenToken = params.get("controllerScreen") ?? "";
  const [promoMuted, setPromoMuted] = useState(() => window.localStorage.getItem("milukita-tv-promo-audio") !== "on");
  const [qrVariant, setQrVariant] = useState<CircularQrVariant>(() => normalizeCircularQrVariant(params.get("qrVariant")));
  const showManifestTest = import.meta.env.DEV && params.get("manifestTest") === "1";
  const [viewingMode, setViewingMode] = useState<TvViewingMode | null>(() => params.get("mode") === "live" || params.get("mode") === "online" ? params.get("mode") as TvViewingMode : null);
  const [signalDown, setSignalDown] = useState(() => params.get("signal") === "down");
  const [lastHeartbeat, setLastHeartbeat] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [promoIndex, setPromoIndex] = useState(0);
  const [qrRefreshPulse, setQrRefreshPulse] = useState(false);
  const [qrContextTimedOut, setQrContextTimedOut] = useState(false);
  const [showQrTestPanel, setShowQrTestPanel] = useState(() => params.get("tvTest") === "1");
  const lastQrKey = useRef<string | null>(null);
  const qrInitialSeconds = useRef<number | null>(null);
  const [reconnectIn, setReconnectIn] = useState(10);
  const [manifestNotice, setManifestNotice] = useState<ManifestNotice | null>(null);
  const [notificationTheme, setNotificationTheme] = useState<NotificationTheme>(() => {
    const saved = window.localStorage.getItem("mjp-tv-notification-theme");
    return saved === "emerald" || saved === "amber" || saved === "midnight" || saved === "contrast" ? saved : "emerald";
  });
  const previousManifest = useRef<{ sequence: number; eventId: string; qrKey: string } | null>(null);
  const previousHeartbeatStatus = useRef<string | null>(null);
  const [heartbeatRecoveryNotice, setHeartbeatRecoveryNotice] = useState(false);
  const [showAgentIndicators, setShowAgentIndicators] = useState(() => window.localStorage.getItem("milukita-tv-agent-indicators") !== "off");
  const lastWatchdogAlertKey = useRef<string | null>(null);
  const [watchdogAlertHistory, setWatchdogAlertHistory] = useState<Array<{ key: string; status: string; message: string; observedAt: string }>>(() => {
    try { return JSON.parse(window.localStorage.getItem("milukita-watchdog-alert-history") ?? "[]") as Array<{ key: string; status: string; message: string; observedAt: string }>; } catch { return []; }
  });
  const [controllerCursor, setControllerCursor] = useState(0);
  const [controllerNotice, setControllerNotice] = useState<string | null>(null);
  const controllerSocketRef = useRef<WebSocket | null>(null);
  const [controllerSocketStatus, setControllerSocketStatus] = useState<"connecting" | "connected" | "fallback" | "offline">("offline");
  const controllerSnapshot = trpc.controller.screenSnapshot.useQuery({ publicId: controllerSessionId, screenToken: controllerScreenToken, afterCommandId: controllerCursor }, { enabled: Boolean(controllerSessionId && controllerScreenToken), refetchInterval: controllerSocketStatus === "connected" ? false : 750, retry: 1 });
  const applyControllerCommand = (command: { id?: number; commandType: string }) => {
    if (command.id) setControllerCursor(command.id);
    if (command.commandType === "EXIT" || command.commandType === "BACK") setViewingMode(null);
    else if (command.commandType === "HOME") window.location.href = "/";
    else setControllerNotice(`Control vinculado: ${command.commandType.toLowerCase()} recibido`);
  };
  useEffect(() => {
    if (!controllerSessionId || !controllerScreenToken) return;
    let cancelled = false;
    let retry: number | undefined;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const connect = () => {
      if (cancelled) return;
      setControllerSocketStatus("connecting");
      const socket = new WebSocket(`${protocol}//${window.location.host}/controller-realtime`);
      controllerSocketRef.current = socket;
      socket.onopen = () => socket.send(JSON.stringify({ type: "CONTROLLER_AUTH", publicId: controllerSessionId, token: controllerScreenToken, channel: "screen" }));
      socket.onmessage = (event) => { try { const message = JSON.parse(event.data) as { type?: string; payload?: { commandType?: string; id?: number } }; if (message.type === "CONTROLLER_READY") setControllerSocketStatus("connected"); else if (message.type === "CONTROLLER_COMMAND" && message.payload?.commandType) applyControllerCommand({ id: message.payload.id, commandType: message.payload.commandType }); else if (message.type === "CONTROLLER_ERROR") setControllerSocketStatus("fallback"); } catch { setControllerSocketStatus("fallback"); } };
      socket.onerror = () => setControllerSocketStatus("fallback");
      socket.onclose = () => { if (!cancelled) { setControllerSocketStatus("fallback"); retry = window.setTimeout(connect, 2500); } };
    };
    connect();
    return () => { cancelled = true; if (retry) window.clearTimeout(retry); controllerSocketRef.current?.close(); controllerSocketRef.current = null; };
  }, [controllerSessionId, controllerScreenToken]);
  useEffect(() => {
    const commands = controllerSnapshot.data?.commands ?? [];
    if (!commands.length) return;
    applyControllerCommand(commands[commands.length - 1]);
  }, [controllerSnapshot.data?.commands]);
  useEffect(() => { if (!controllerNotice) return; const timer = window.setTimeout(() => setControllerNotice(null), 2500); return () => window.clearTimeout(timer); }, [controllerNotice]);
  useEffect(() => { if (!rounds.isError) setLastHeartbeat(Date.now()); }, [rounds.dataUpdatedAt, rounds.isError]);
  useEffect(() => {
    const alerts = agentHealth.data?.watchdog?.checks?.filter((check) => !["PASS", "OK", "HEALTHY"].includes(check.status)).map((check) => ({ ...check, observedAt: new Date().toISOString() })) ?? [];
    if (!alerts.length) return;
    const previous = watchdogAlertHistory;
    const merged = [...alerts, ...previous].filter((alert, index, list) => list.findIndex((item) => item.key === alert.key && item.status === alert.status && item.message === alert.message) === index).slice(0, 8);
    setWatchdogAlertHistory(merged);
    window.localStorage.setItem("milukita-watchdog-alert-history", JSON.stringify(merged));
  }, [agentHealth.data?.watchdog?.checks]);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    if (!activeManifestQuery.isFetching) { setQrContextTimedOut(false); return;
    }
    const timer = window.setTimeout(() => setQrContextTimedOut(true), 8000);
    return () => window.clearTimeout(timer);
  }, [activeManifestQuery.isFetching, activeRoundId]);
  useEffect(() => { const timer = window.setInterval(() => setPromoIndex((current) => (current + 1) % tvPromoSlides.length), 8000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    const qrKey = activeManifest ? `${activeManifest.sequence}:${activeManifest.qr.targetUrl ?? "none"}:${activeManifest.qr.expiresAt ?? "none"}` : null;
    if (qrKey && lastQrKey.current && qrKey !== lastQrKey.current) {
      qrInitialSeconds.current = getQrExpiryState(activeManifest?.qr.expiresAt, Date.now()).secondsRemaining;
      setQrRefreshPulse(true);
      const timer = window.setTimeout(() => setQrRefreshPulse(false), 650);
      lastQrKey.current = qrKey;
      return () => window.clearTimeout(timer);
    }
    if (qrKey) {
      if (lastQrKey.current === null) qrInitialSeconds.current = getQrExpiryState(activeManifest?.qr.expiresAt, Date.now()).secondsRemaining;
      lastQrKey.current = qrKey;
    }
  }, [activeManifest?.sequence, activeManifest?.qr.targetUrl, activeManifest?.qr.expiresAt]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.altKey && event.shiftKey && event.key.toLowerCase() === "q") setShowQrTestPanel((current) => !current); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
    useEffect(() => {
    const alerts = agentHealth.data?.watchdog?.checks?.filter((check) => !["PASS", "OK", "HEALTHY"].includes(check.status)) ?? [];
    const key = alerts.map((alert) => `${alert.key}:${alert.status}:${alert.message}`).join("|");
    if (lastWatchdogAlertKey.current !== null && key !== lastWatchdogAlertKey.current && alerts.length) playTvRemoteTone("select");
    lastWatchdogAlertKey.current = key;
  }, [agentHealth.data?.watchdog?.checks]);
  useEffect(() => { if (!activeManifest) return;
    const qrKey = `${activeManifest.qr.targetUrl ?? "none"}:${activeManifest.qr.expiresAt ?? "none"}:${activeManifest.qr.imageDataUrl ? "image" : "no-image"}`;
    const previous = previousManifest.current ? { sequence: previousManifest.current.sequence, event: { eventId: previousManifest.current.eventId, gameName: "", status: activeManifest.event.status } } : null;
    const notice = describeManifestChange(previous, { sequence: activeManifest.sequence, event: { eventId: activeManifest.event.eventId, gameName: activeManifest.event.gameName, status: activeManifest.event.status } });
    const qrWasUpdated = Boolean(previousManifest.current && previousManifest.current.qrKey !== qrKey && activeManifest.qr.available && activeManifest.qr.signed && activeManifest.qr.targetUrl);
    if (qrWasUpdated) setManifestNotice({ kind: "update", title: "QR actualizado correctamente", detail: `El código de ${activeManifest.event.gameName} ya está listo para escanear y conserva el payload firmado de MJP Core.` });
    else if (notice) setManifestNotice(notice);
    previousManifest.current = { sequence: activeManifest.sequence, eventId: activeManifest.event.eventId, qrKey };
  }, [activeManifest?.sequence, activeManifest?.event.eventId, activeManifest?.event.gameName, activeManifest?.event.status, activeManifest?.qr.targetUrl, activeManifest?.qr.expiresAt, activeManifest?.qr.available, activeManifest?.qr.signed, activeManifest?.qr.imageDataUrl]);
  useEffect(() => { if (!manifestNotice) return; const timer = window.setTimeout(() => setManifestNotice(null), 5000); return () => window.clearTimeout(timer); }, [manifestNotice]);
  useEffect(() => {
    const status = heartbeatHealth.data?.status;
    if (!status) return;
    const recovered = previousHeartbeatStatus.current !== null && previousHeartbeatStatus.current !== "CONNECTED" && status === "CONNECTED";
    if (recovered) {
      setHeartbeatRecoveryNotice(true);
      playTvRemoteTone("select");
      const timer = window.setTimeout(() => setHeartbeatRecoveryNotice(false), 6000);
      previousHeartbeatStatus.current = status;
      return () => window.clearTimeout(timer);
    }
    previousHeartbeatStatus.current = status;
  }, [heartbeatHealth.data?.status]);
  const stale = Date.now() - lastHeartbeat > 30000;
  const showingLive = viewingMode === "live";
  const maintenanceActive = heartbeatHealth.data?.status === "STOPPED" || heartbeatHealth.data?.controlMode === "STOPPED";
  const signalIssue = signalDown || rounds.isError || stale || !videoId;
  const contingency = showingLive && signalIssue;
  const tvConnectionState: TvConnectionState = viewingMode === "online" ? "SIMULATED_CONNECTED" : signalIssue ? "OFFLINE" : "REAL_CONNECTED";
  const manifestConnectionState: ManifestConnectionState = getManifestConnectionState({ isLoading: activeManifestQuery.isLoading, isError: activeManifestQuery.isError, hasManifest: Boolean(activeManifest) });
  useEffect(() => {
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("mjp-tv-signal") : null;
    const publish = () => channel?.postMessage({ healthy: !contingency, timestamp: Date.now(), videoId });
    publish();
    const timer = window.setInterval(publish, 5000);
    return () => { window.clearInterval(timer); channel?.close(); };
  }, [contingency, videoId]);
  useEffect(() => {
    if (!contingency || !videoId) return;
    setReconnectIn(10);
    const timer = window.setInterval(() => { setReconnectIn((current) => { if (current <= 1) { void rounds.refetch(); return 10; } return current - 1; }); }, 1000);
    return () => window.clearInterval(timer);
  }, [contingency, videoId, rounds.isError]);
  const alertTitle = !showingLive ? "Modo en línea activo" : !videoId ? "Señal pendiente de configuración" : signalDown || rounds.isError || stale ? "Estamos restableciendo la transmisión" : "Señal operativa";
  const restore = () => { setSignalDown(false); void rounds.refetch(); };
  const selectedNotificationTheme = notificationThemes[notificationTheme];
  const activePromo = tvPromoSlides[promoIndex];
  const qrExpiry = getQrExpiryState(activeManifest?.qr.expiresAt, now);
  const qrExpired = qrExpiry.expired;
  const qrSecondsRemaining = qrExpiry.secondsRemaining;
  const qrProgress = getQrProgressPercent(qrSecondsRemaining, qrInitialSeconds.current);
  const qrProgressTone = getQrProgressTone(qrSecondsRemaining);
  const qrProgressColor = qrProgressTone === "critical" ? "#ef4444" : "#f5c96a";
  const changeNotificationTheme = (theme: NotificationTheme) => { setNotificationTheme(theme); window.localStorage.setItem("mjp-tv-notification-theme", theme); };
  const togglePromoAudio = () => { setPromoMuted((current) => { const next = !current; window.localStorage.setItem("milukita-tv-promo-audio", next ? "off" : "on"); return next; }); };
  if (!viewingMode) return <TvModeStartScreen onSelect={setViewingMode} onExit={() => { window.location.href = "/"; }} />;
  if (maintenanceActive) return <>{showAgentIndicators ? <TvAgentsStatus health={agentHealth.data} maintenance /> : null}<TvHeartbeatStatus status="STOPPED" ageSeconds={heartbeatHealth.data?.ageSeconds} /><TvMaintenanceScreen reason="kill_switch_active" watchdogAlerts={watchdogAlertHistory.length ? watchdogAlertHistory : (agentHealth.data?.watchdog?.checks?.filter((check) => !["PASS", "OK", "HEALTHY"].includes(check.status)) ?? [])} showAgentIndicators={showAgentIndicators} onToggleAgentIndicators={() => { const next = !showAgentIndicators; setShowAgentIndicators(next); window.localStorage.setItem("milukita-tv-agent-indicators", next ? "on" : "off"); }} onRetry={() => { void heartbeatHealth.refetch(); void agentHealth.refetch(); }} /></>;

  return <PilotLayout><TvScreensaver />{showQrTestPanel ? <div className="fixed right-4 top-4 z-40 border border-cyan-200/35 bg-[#08251f]/95 px-3 py-2 text-[10px] font-black uppercase tracking-[.16em] text-cyan-100 shadow-lg" role="status">Modo prueba QR · TV TEST</div> : null}<main className="container py-9 sm:py-14" data-tv-connection={tvConnectionState} data-tv-authority="server-only">{controllerSessionId ? <section className={`mb-4 flex items-center justify-between gap-3 border px-4 py-3 text-xs ${controllerSnapshot.isError ? "border-amber-200/30 bg-amber-200/10 text-amber-100" : "border-cyan-200/30 bg-cyan-200/10 text-cyan-100"}`} role="status" aria-live="polite"><span className="flex items-center gap-2"><Wifi className="h-4 w-4" />{controllerSnapshot.isError ? "Control vinculado no disponible" : controllerSnapshot.data?.status === "CONNECTED" ? "Control QR vinculado · sincronización activa" : "Control QR pendiente de vínculo"}</span><span>Solo presentación</span></section> : null}{controllerNotice ? <section className="mb-4 border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100 controller-mode-stage" role="status" aria-live="polite">{controllerNotice}</section> : null}<div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-black/20 px-4 py-3">{heartbeatHealth.isLoading || heartbeatHealth.data?.status !== "CONNECTED" ? <TvHeartbeatStatus status={heartbeatHealth.data?.status} ageSeconds={heartbeatHealth.data?.ageSeconds} loading={heartbeatHealth.isLoading} reconnecting={heartbeatHealth.isFetching && !heartbeatHealth.isLoading && heartbeatHealth.data?.status !== "CONNECTED"} /> : null}<p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Modo seleccionado: <strong className={showingLive ? "text-emerald-200" : "text-amber-200"}>{showingLive ? "Ver transmisión en vivo" : "Ver en línea"}</strong><span className="ml-3 text-cyan-200">{tvConnectionLabel(tvConnectionState)}</span></p><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setViewingMode(null)} className="border-white/15 bg-white/5 text-xs text-slate-200 hover:bg-white/10">Cambiar modo</Button><Button type="button" variant="outline" onClick={() => { window.location.href = "/"; }} className="border-amber-200/25 bg-amber-200/10 text-xs text-amber-100 hover:bg-amber-200/20"><LogOut className="mr-1.5 h-3.5 w-3.5" /> Salir</Button></div></div><section className="rounded-[2rem] border border-emerald-300/15 bg-[radial-gradient(circle_at_90%_10%,rgba(41,226,170,.16),transparent_30%),#0a1e16] p-6 sm:p-10"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><Badge className="border border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10"><Tv className="mr-2 h-4 w-4" /> Canal virtual</Badge><h1 className="font-display mt-4 max-w-3xl text-4xl text-white sm:text-6xl">Sorteos en vivo, participación desde tu celular.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">La transmisión presenta el espectáculo; el servidor conserva la autoridad del cierre, el sorteo y la evidencia. Todo el piloto usa créditos virtuales gratuitos.</p></div><Link href="/verificar"><Button className="gold-button"><ShieldCheck className="mr-2 h-4 w-4" /> Verificar sorteos</Button></Link></div></section>
    {showAgentIndicators ? <TvAgentsStatus health={agentHealth.data} /> : <p className="mt-4 text-right text-xs text-slate-500">Indicadores de continuidad ocultos</p>}
    <LiveChannelPanel />
    {heartbeatRecoveryNotice ? <section className="tv-recovery-notice mt-4 flex items-center gap-3 border border-emerald-300/30 bg-emerald-300/10 p-4" role="status" aria-live="polite"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-200" /><div><p className="font-bold text-emerald-50">MiLukita LIVE restablecido</p><p className="text-sm text-emerald-100/80">La conexión volvió. Evento actual: <strong className="text-emerald-50">{activeManifest?.event.gameName ?? "en sincronización"}</strong>.</p><p className="mt-1 text-xs text-emerald-100/65">Contenido: {activeManifest?.event.gameName ? `emisión y participación de ${activeManifest.event.gameName}` : "preparando la programación confirmada"}.</p></div></section> : null}<section className={`mt-8 flex items-start gap-4 border p-4 sm:p-5 ${contingency ? "border-amber-200/30 bg-amber-200/10" : "border-emerald-300/20 bg-emerald-300/8"}`} role="status" aria-live="polite"><div className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${contingency ? "bg-amber-200/15 text-amber-100" : "bg-emerald-300/15 text-emerald-100"}`}>{contingency ? <WifiOff className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><p className={`font-bold ${contingency ? "text-amber-50" : "text-emerald-50"}`}>{alertTitle}</p><p className="mt-1 text-sm leading-6 text-slate-300">{contingency ? `La participación y los resultados no se pierden: consulta las rondas y la evidencia del servidor mientras vuelve la señal audiovisual. ${videoId ? `Nuevo intento automático en ${reconnectIn} s.` : ""}` : "La señal audiovisual y el estado de la ronda están disponibles."}</p></div>{contingency && videoId ? <Button type="button" variant="outline" onClick={restore} className="border-amber-200/30 bg-amber-200/10 text-amber-50 hover:bg-amber-200/20 hover:text-white">Reintentar señal</Button> : null}</section>
    {qrContextTimedOut ? <section className="mt-4 flex items-center gap-3 border border-amber-200/30 bg-amber-200/10 p-4" role="alert" aria-live="assertive"><RefreshCw className="h-5 w-5 shrink-0 animate-spin text-amber-200" /><div className="min-w-0 flex-1"><p className="font-bold text-amber-50">La conexión del contexto QR está tardando</p><p className="mt-1 text-sm text-slate-300">Reintentando automáticamente. Se conserva el último estado conocido y la autoridad del manifest no cambia.</p></div><Button type="button" variant="outline" onClick={() => { setQrContextTimedOut(false); void activeManifestQuery.refetch(); }} className="border-amber-200/30 bg-amber-200/10 text-amber-50 hover:bg-amber-200/20 hover:text-white">Reintentar ahora</Button></section> : null}
    {manifestNotice ? <section className={`manifest-toast mt-4 flex items-start gap-3 border p-4 ${selectedNotificationTheme.section}`} role="status" aria-live="polite"><div className={`manifest-connected-pulse grid h-9 w-9 shrink-0 place-items-center rounded-full ${selectedNotificationTheme.icon}`}>{manifestNotice.kind === "round" ? <Sparkles className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}</div><div className="min-w-0 flex-1"><p className={`font-bold ${selectedNotificationTheme.title}`}>{manifestNotice.title}</p><p className="mt-1 text-sm leading-6 text-slate-300">{manifestNotice.detail}</p></div><Button type="button" variant="ghost" onClick={() => setManifestNotice(null)} className="h-8 w-8 shrink-0 p-0 text-emerald-100 hover:bg-emerald-200/10" aria-label="Cerrar notificación"><X className="h-4 w-4" /></Button></section> : null}
    <section className="mt-4 flex flex-col gap-3 border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><Button type="button" variant="outline" onClick={() => { const next = !showAgentIndicators; setShowAgentIndicators(next); window.localStorage.setItem("milukita-tv-agent-indicators", next ? "on" : "off"); }} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">{showAgentIndicators ? "Ocultar agentes" : "Mostrar agentes"}</Button><span className="text-xs text-slate-500">Watchdog y Auditor, vista pública</span></div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Tema de avisos en tiempo real</p><p className="mt-1 text-sm text-slate-300">Adapta el color de las notificaciones a la identidad visual de tu marca.</p></div><label className="flex items-center gap-3 text-sm font-semibold text-white"><span className="sr-only">Seleccionar tema de notificaciones</span><select value={notificationTheme} onChange={(event) => changeNotificationTheme(event.target.value as NotificationTheme)} className="border border-white/15 bg-[#10241a] px-3 py-2 text-sm text-white outline-none focus:border-emerald-300"><option value="emerald">{notificationThemes.emerald.label}</option><option value="amber">{notificationThemes.amber.label}</option><option value="midnight">{notificationThemes.midnight.label}</option><option value="contrast">{notificationThemes.contrast.label}</option></select></label></section>
    {contingency ? <section className="mt-6 grid gap-6 rounded-[2rem] border border-white/10 bg-[#0b1712] p-6 sm:p-10 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><AlertTriangle className="h-8 w-8 text-amber-200" /><h2 className="font-display mt-5 text-4xl text-white">Modo de contingencia</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">El canal digital continúa operativo aunque YouTube no responda. Usa el historial de rondas para seguir el estado, abre el overlay alterno o revisa el expediente verificable. El servidor no depende de la señal para cerrar ni sortear.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/verificar"><Button className="gold-button">Consultar verificación</Button></Link><button type="button" onClick={() => setSignalDown(true)} className="border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10">Mantener aviso visible</button></div></div><div className="border border-amber-200/15 bg-[#211c10] p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-amber-200">Información preservada</p><div className="mt-5 space-y-4 text-sm text-slate-300"><p><strong className="text-white">Estado de ronda:</strong> actualizado desde el servidor.</p><p><strong className="text-white">QR:</strong> vuelve a mostrarse solo durante una ronda abierta.</p><p><strong className="text-white">Resultado:</strong> disponible mediante expediente verificable después del sorteo.</p></div></div></section> : null}
    <section className="mt-8 rounded-[2rem] border border-emerald-300/15 bg-[#0a1b14] p-6 sm:p-8" aria-live="polite"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="eyebrow text-emerald-200">MjpTvManifest v1</p><h2 className="font-display mt-2 text-3xl text-white">Estado unificado del evento</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">El TV Client, el overlay y la pantalla secundaria leen la misma proyección pública emitida por MJP Core.</p></div><ManifestConnectionStatus state={manifestConnectionState} refreshing={activeManifestQuery.isFetching && Boolean(activeManifest)} compact detail={activeManifestQuery.isError ? "Se conserva el último estado conocido" : activeManifest ? `Secuencia ${activeManifest.sequence} · ${activeManifest.event.status}` : undefined} /><QrValidityIndicator qr={activeManifest?.qr} now={now} /></div><QrContextTransition loading={activeManifestQuery.isFetching} updated={qrRefreshPulse} error={activeManifestQuery.isError} hasContext={Boolean(activeManifest)} />{activeManifest ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><div><p className="text-xs uppercase tracking-[.14em] text-slate-500">Evento</p><p className="mt-1 font-bold text-white">{activeManifest.event.gameName}</p><p className="text-xs text-slate-400">{activeManifest.event.eventId}</p></div><div><p className="text-xs uppercase tracking-[.14em] text-slate-500">Estado</p><p className="mt-1 font-bold text-emerald-200">{activeManifest.event.status}</p><p className="text-xs text-slate-400">Secuencia {activeManifest.sequence}</p></div><div><p className="text-xs uppercase tracking-[.14em] text-slate-500">Cuenta regresiva</p><p className="mt-1 font-mono text-xl font-bold text-white">{activeManifest.countdown.seconds === null ? "—" : formatCountdown(activeManifest.countdown.seconds)}</p><p className="text-xs text-slate-400">Fuente: servidor</p></div><div><p className="text-xs uppercase tracking-[.14em] text-slate-500">Participación</p><p className="mt-1 font-bold text-white">{activeManifest.participation.confirmedCount} confirmadas</p><p className="text-xs text-emerald-200">Solo créditos virtuales</p></div><div><p className="text-xs uppercase tracking-[.14em] text-slate-500">Evidencia</p><p className="mt-1 font-bold text-white">{activeManifest.result.verified ? "Resultado verificado" : "Pendiente"}</p><p className="text-xs text-slate-400">{activeManifest.verification.public ? "Consulta pública" : "No disponible"}</p></div></div> : <p className="mt-6 text-sm text-slate-400">{activeManifestQuery.isLoading ? "Cargando el manifest del evento activo…" : activeManifestQuery.isError ? "No se pudo leer el manifest. El historial de rondas se conserva como respaldo." : "No hay una ronda pública disponible para emitir."}</p>}{activeManifest?.nextEvent.available && activeManifest.nextEvent.eventId && activeManifest.nextEvent.gameId ? <div className="mt-5 flex flex-col gap-3 border border-cyan-200/20 bg-cyan-200/5 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-200">Siguiente evento enlazado</p><p className="mt-1 text-sm font-bold text-white">{activeManifest.nextEvent.gameName ?? activeManifest.nextEvent.gameId}</p><p className="mt-1 text-xs text-slate-400">{activeManifest.nextEvent.eventId}{activeManifest.nextEvent.scheduledStart ? ` · ${new Date(activeManifest.nextEvent.scheduledStart).toLocaleString()}` : ""}</p></div><Link href={`/juegos/${activeManifest.nextEvent.gameId}?round=${encodeURIComponent(activeManifest.nextEvent.eventId)}`} className="font-bold text-cyan-100">Preparar celular</Link></div> : null}</section>
    {activeManifest ? <section className="mt-6 grid gap-6 border border-amber-200/20 bg-[#211c10] p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-stretch" aria-label="Experiencia TV dividida en contenido y QR"><div className="flex min-h-[280px] flex-col justify-between border border-white/10 bg-black/25 p-5"><div><p className="eyebrow text-emerald-200">Experiencia TV · zona principal</p><h2 className="font-display mt-2 text-3xl text-white">{showingLive && videoId && !contingency ? "Transmisión y participación" : "Acompañamiento interactivo"}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Mientras el QR está activo, la pantalla continúa mostrando el evento, instrucciones y contenido de acompañamiento. La participación no bloquea la señal.</p></div>{showingLive && videoId && !contingency ? <iframe className="mt-5 aspect-video w-full" src={`https://www.youtube.com/embed/${videoId}?rel=0`} title="Contenido principal de MiLukita TV" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <div className="mt-5 flex flex-1 flex-col justify-between border border-emerald-300/15 bg-[radial-gradient(circle_at_70%_20%,rgba(41,226,170,.18),transparent_32%),#0b2018] p-6" aria-live="polite"><div className="flex items-center justify-between gap-4"><p className="eyebrow text-emerald-200">Contenido promocional · {promoIndex + 1}/{tvPromoSlides.length}</p><span className="text-xs font-semibold text-slate-500">Se actualiza automáticamente</span></div>{promoVideoUrl ? <div className="tv-promo-slide flex flex-1 flex-col items-center justify-center text-center" key={`video-${promoVideoUrl}`}><video className="max-h-[260px] w-full object-cover" src={promoVideoUrl} autoPlay muted={promoMuted} loop playsInline controls aria-label="Video promocional de MiLukita" /><button type="button" onClick={togglePromoAudio} className="mt-3 inline-flex items-center gap-2 border border-white/15 bg-black/25 px-3 py-2 text-xs font-bold text-white hover:bg-black/40" aria-pressed={!promoMuted}>{promoMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}{promoMuted ? "Activar audio" : "Silenciar audio"}</button><p className="mt-4 text-xs font-bold uppercase tracking-[.2em] text-amber-200">Video promocional configurable</p><p className="mt-2 text-sm text-slate-300">La señal continúa mientras se presenta contenido de MiLukita.</p></div> : <div className="tv-promo-slide flex flex-1 flex-col items-center justify-center text-center" key={promoIndex}><div className="grid h-16 w-16 place-items-center rounded-full bg-amber-200/15 text-3xl text-amber-100">{activePromo.icon}</div><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-amber-200">{activePromo.eyebrow}</p><p className="mt-3 font-display text-3xl text-white sm:text-4xl">{activePromo.title}</p><p className="mt-3 max-w-md text-sm leading-6 text-slate-300">{activePromo.detail}</p></div>}<div className="flex justify-center gap-2" aria-label="Indicador de diapositiva">{tvPromoSlides.map((slide, index) => <span key={slide.title} className={`h-1.5 w-8 ${index === promoIndex ? "bg-amber-200" : "bg-white/15"}`} />)}</div></div>}</div><aside className={`flex flex-col items-center justify-between border border-amber-200/20 bg-black/20 p-5 text-center ${qrRefreshPulse ? "qr-panel-refresh" : ""}`} aria-label="Panel lateral persistente del QR"><div className="w-full"><div className="flex items-center justify-between gap-3"><div className="text-left"><p className="eyebrow text-amber-200">Puente TV → celular</p><h2 className="font-display mt-2 text-2xl text-white">{activeManifest.qr.available && activeManifest.qr.imageDataUrl && !qrExpired ? "Escanea para participar" : qrExpired ? "QR vencido" : "QR no disponible"}</h2></div><select value={qrVariant} onChange={(event) => setQrVariant(normalizeCircularQrVariant(event.target.value))} aria-label="Variante visual del QR" className="border border-white/15 bg-[#10241a] px-2 py-2 text-[11px] font-bold text-white"><option value="central">L Central</option><option value="circle">L en Círculo</option><option value="integrated">L Integrada</option></select></div><div className="mt-4 flex justify-center">{activeManifest.qr.available && activeManifest.qr.imageDataUrl && !qrExpired ? <div className="qr-progress-wrap" aria-label={`Progreso restante del QR: ${Math.round(qrProgress)} por ciento${qrProgressTone === "critical" ? " · quedan menos de 30 segundos" : ""}`}><div className="qr-progress-inner"><MiLukitaCircularQR source={activeManifest.qr} variant={qrVariant} size={238} timerProgress={100 - qrProgress} /></div></div> : <div className="grid h-[260px] w-[260px] place-items-center border border-dashed border-rose-200/30 bg-black/20 px-6 text-xs text-rose-100"><div><AlertTriangle className="mx-auto mb-2 h-7 w-7 text-rose-200" />{qrExpired ? "Este código ya expiró. Espera el siguiente QR." : "El código aún no está listo para escanear."}</div></div>}</div><p className="mt-3 text-xs leading-5 text-slate-400">Payload firmado por MJP Core · créditos virtuales gratuitos.</p></div><div className="mt-4 w-full border border-amber-200/25 bg-amber-200/10 px-4 py-3 text-left"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-amber-200">Tiempo restante del QR</p><p className="mt-1 font-mono text-3xl font-black tabular-nums text-white" aria-live="polite">{qrSecondsRemaining === null ? "—" : formatCountdown(qrSecondsRemaining)}</p><p className="mt-1 text-xs leading-5 text-amber-100/70">{qrSecondsRemaining && qrSecondsRemaining > 0 ? "Escanéalo antes de que termine." : "Se renovará con el siguiente evento."}</p></div></aside></section> : null}
    {activeManifest ? <section className={`mt-6 hidden flex-col items-center gap-5 border p-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left ${activeManifest.qr.available && activeManifest.qr.imageDataUrl && !qrExpired ? "border-amber-200/20 bg-[#211c10]" : "border-rose-200/25 bg-rose-200/5"}`} aria-label="QR unificado del evento"><div><p className="eyebrow text-amber-200">Puente TV → celular</p><h2 className="font-display mt-2 text-2xl text-white">{activeManifest.qr.available && activeManifest.qr.imageDataUrl && !qrExpired ? "Escanea para participar" : qrExpired ? "Este QR ya expiró" : "QR no disponible para escanear"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{activeManifest.qr.available && activeManifest.qr.imageDataUrl && !qrExpired ? "Escanea con la cámara de tu celular. El código proviene del mismo MjpTvManifest y expira al cerrar la ronda." : qrExpired ? "La ronda ya cerró o cambió. No uses una captura anterior: espera a que TV muestre un QR actualizado." : "El código aún no está listo o la imagen no pudo cargarse. Solicita en TV un QR actualizado y vuelve a intentarlo."}</p>{activeManifest.qr.available && !qrExpired ? <div><p className="mt-2 text-xs text-amber-100/80">{activeManifest.qr.signed ? "Payload firmado" : "Payload no firmado"} · Válido hasta {activeManifest.qr.expiresAt ? new Date(activeManifest.qr.expiresAt).toLocaleTimeString() : "el cierre"}</p><div className="mt-4 border border-amber-200/25 bg-black/20 px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-amber-200">Tiempo restante del QR</p><p className="mt-1 font-mono text-3xl font-black tabular-nums text-white" aria-live="polite">{qrSecondsRemaining === null ? "—" : qrSecondsRemaining > 0 ? formatCountdown(qrSecondsRemaining) : "00:00"}</p><p className="mt-1 text-xs text-amber-100/70">{qrSecondsRemaining && qrSecondsRemaining > 0 ? "Escanéalo antes de que termine la cuenta regresiva." : "Este código ya no es escaneable. Espera un QR actualizado."}</p></div></div> : <Link href={`/juegos/${activeManifest.event.gameId}?round=${encodeURIComponent(activeManifest.event.eventId)}`} className="mt-3 inline-flex font-bold text-amber-100">Abrir evento actualizado manualmente</Link>}</div>{activeManifest.qr.available && activeManifest.qr.imageDataUrl && !qrExpired ? <img src={activeManifest.qr.imageDataUrl} alt={`QR unificado para ${activeManifest.event.gameName}`} className="h-44 w-44 shrink-0 bg-white p-2" /> : <div className="grid h-44 w-44 shrink-0 place-items-center border border-dashed border-rose-200/30 bg-black/20 px-4 text-xs text-rose-100"><AlertTriangle className="h-7 w-7 text-rose-200" />Sin código escaneable</div>}</section> : null}
    {showQrTestPanel ? <section className="tv-qr-test-panel mt-4 border border-cyan-200/25 bg-cyan-200/5 p-4" aria-label="Panel oculto de pruebas QR"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-200">Pruebas físicas · QR circular</p><p className="mt-1 text-xs text-slate-400">Solo presentación: el payload sigue viniendo de MjpTvManifest.</p></div><Button type="button" variant="ghost" onClick={() => setShowQrTestPanel(false)} className="text-xs text-cyan-100 hover:bg-cyan-200/10">Ocultar</Button></div><div className="mt-3 flex flex-wrap gap-2">{(["central", "circle", "integrated"] as CircularQrVariant[]).map((variant) => <Button key={variant} type="button" variant={qrVariant === variant ? "default" : "outline"} onClick={() => setQrVariant(variant)} className="text-xs">{variant === "central" ? "L Central" : variant === "circle" ? "L en Círculo" : "L Integrada"}</Button>)}</div></section> : null}
    <BroadcastAccessGuide />
    <TVBrandGuide />
    {showManifestTest ? <ManifestTestPanel /> : null}
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]"><div className="rounded-[2rem] border border-white/10 bg-[#0a1b14] p-4 sm:p-6">{showingLive && !contingency && videoId ? <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${videoId}?rel=0`} title="Sorteo en vivo" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <div className="grid aspect-video place-items-center bg-black/30 text-center"><div><Tv className="mx-auto h-10 w-10 text-emerald-300" /><p className="mt-4 font-semibold text-white">{!showingLive ? "Vista en línea activa" : videoId ? "La señal se encuentra temporalmente fuera de servicio" : "Transmisión YouTube pendiente de configuración"}</p><p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{!showingLive ? "El estado del manifest, el historial y la verificación continúan disponibles sin depender de la señal audiovisual." : videoId ? "Puedes continuar con la ronda y verificar sus evidencias desde los accesos de esta página." : "Abre esta página con ?v=ID_DEL_VIDEO cuando exista una emisión."}</p></div></div>}<div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-white">{broadcast.data?.broadcastId ?? "MULTI-JUEGOS-PERU-TV"}</p><a href={showingLive && videoId ? `https://www.youtube.com/watch?v=${videoId}` : "https://www.youtube.com"} target="_blank" rel="noreferrer" className="text-xs font-semibold text-emerald-200">Abrir en YouTube <ExternalLink className="ml-1 inline h-3.5 w-3.5" /></a></div></div><aside className="rounded-[2rem] border border-amber-200/15 bg-[#211c10] p-6"><p className="eyebrow text-amber-200">Rondas enlazadas</p><h2 className="font-display mt-2 text-3xl text-white">Historial de transmisión</h2><div className="mt-5 space-y-3">{rounds.data?.filter((item): item is NonNullable<typeof item> => item !== null).slice(0, 5).map((item) => <Link key={item.roundId} href={`/overlay/${item.roundId}`} className="block border border-white/10 bg-black/20 p-4 hover:bg-white/5"><div className="flex items-center justify-between gap-3"><span className="font-bold text-white">{item.gameName}</span><StatusBadge state={item.state} /></div><p className="mt-2 text-xs text-slate-400">{item.roundId} · {item.totalParticipants} participantes{item.event ? ` · ${item.event.status}` : ""}</p></Link>)}{!rounds.data?.length ? <p className="text-sm text-slate-400">No hay rondas públicas disponibles todavía.</p> : null}</div></aside></section><p className="mt-6 flex items-center gap-2 text-xs leading-5 text-slate-500"><Ticket className="h-4 w-4" />La participación y la liquidación permanecen sujetas a las reglas virtuales publicadas.</p></main></PilotLayout>;
}
