import { Box, Camera, CheckCircle2, Compass, Loader2, MapPin, Radar, RotateCcw, ShieldCheck, Smartphone, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { inspectSpatialArCapabilities, spatialArSessionOptions, type SpatialArReport } from "@/lib/spatialAr";
import { toast } from "sonner";

type PermissionState = "NOT_REQUESTED" | "READY" | "DENIED" | "UNAVAILABLE";
type SurfaceState = "IDLE" | "DETECTING" | "FOUND" | "NO_HIT_TEST" | "UNAVAILABLE";
type AnchorState = "NOT_ATTEMPTED" | "SUPPORTED" | "CREATED" | "UNSUPPORTED" | "FAILED";
type SpatialSession = { end: () => Promise<void>; addEventListener: (type: string, listener: () => void) => void; requestReferenceSpace: (type: string) => Promise<unknown>; requestAnimationFrame: (callback: (time: number, frame: SpatialFrame) => void) => number; requestHitTestSource?: (options: { space: unknown }) => Promise<unknown> };
type SpatialFrame = { session: SpatialSession; getHitTestResults?: (source: unknown) => Array<{ getPose: (space: unknown) => unknown }> };
type NavigatorWithXR = Navigator & { xr?: { requestSession: (mode: string, options: object) => Promise<SpatialSession> } };
type LocationFix = { latitude: number; longitude: number; accuracyMeters: number };
type BridgeSession = { sessionId: string; projectId: string; userId: number; deviceId: string; mode: "ONLINE" | "DEGRADED" | "OFFLINE" | "CORE_UNAVAILABLE" | "REVOKED"; scopes: string[]; observedProjectVersion: number; createdAt: string; expiresAt: string; provenance: "MILUQUITA_FIELD_SESSION" };

function getDeviceId() {
  const key = "arki-miluquita-device-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const generated = `milu-device-${window.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(key, generated);
  return generated;
}

export default function FieldModePage() {
  const { user } = useAuth();
  const projects = trpc.projects.list.useQuery(undefined, { enabled: Boolean(user) });
  const openBridgeSession = trpc.spatialFieldBridge.openSession.useMutation();
  const observeBridge = trpc.spatialFieldBridge.observe.useMutation();
  const [projectId, setProjectId] = useState("");
  const [deviceId] = useState(() => getDeviceId());
  const [bridgeSession, setBridgeSession] = useState<BridgeSession | null>(null);
  const [bridgeVersion, setBridgeVersion] = useState<number | null>(null);
  const [bridgeMessage, setBridgeMessage] = useState("Sesión no iniciada; el Core canónico debe estar conectado.");
  const [cameraState, setCameraState] = useState<PermissionState>("NOT_REQUESTED");
  const [locationState, setLocationState] = useState<PermissionState>("NOT_REQUESTED");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [locationFix, setLocationFix] = useState<LocationFix | null>(null);
  const [arReport, setArReport] = useState<SpatialArReport | null>(null);
  const [arState, setArState] = useState<"IDLE" | "CHECKING" | "RUNNING" | "DEGRADED" | "UNAVAILABLE">("IDLE");
  const [surfaceState, setSurfaceState] = useState<SurfaceState>("IDLE");
  const [anchorState, setAnchorState] = useState<AnchorState>("NOT_ATTEMPTED");
  const [heading, setHeading] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<SpatialSession | null>(null);
  const referenceSpaceRef = useRef<unknown>(null);
  const hitTestSourceRef = useRef<unknown>(null);
  const lastHitPoseRef = useRef<unknown>(null);

  useEffect(() => { if (!projectId && projects.data?.[0]?.projectId) setProjectId(projects.data[0].projectId); }, [projectId, projects.data]);
  useEffect(() => { if (videoRef.current && cameraStream) videoRef.current.srcObject = cameraStream; }, [cameraStream]);
  useEffect(() => { const onOrientation = (event: DeviceOrientationEvent) => { if (typeof event.alpha === "number") setHeading(Math.round(event.alpha)); }; window.addEventListener("deviceorientation", onOrientation); return () => window.removeEventListener("deviceorientation", onOrientation); }, []);

  const requestCamera = async () => { if (!navigator.mediaDevices?.getUserMedia) { setCameraState("UNAVAILABLE"); return; } try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }); setCameraStream(stream); setCameraState("READY"); } catch { setCameraState("DENIED"); } };
  const requestLocation = () => { if (!navigator.geolocation) { setLocationState("UNAVAILABLE"); return; } navigator.geolocation.getCurrentPosition((position) => { setLocationFix({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracyMeters: position.coords.accuracy }); setLocationState("READY"); }, () => setLocationState("DENIED"), { enableHighAccuracy: true, maximumAge: 60000 }); };
  const stopCamera = () => { cameraStream?.getTracks().forEach((track) => track.stop()); setCameraStream(null); setCameraState("NOT_REQUESTED"); };
  const processFrame = (_time: number, frame: SpatialFrame) => { const source = hitTestSourceRef.current; const space = referenceSpaceRef.current; if (source && space && frame.getHitTestResults) { const hit = frame.getHitTestResults(source)[0]; const pose = hit?.getPose(space); if (pose) { lastHitPoseRef.current = pose; setSurfaceState("FOUND"); } } if (sessionRef.current) sessionRef.current.requestAnimationFrame(processFrame); };
  const startSpatialAr = async () => { setArState("CHECKING"); setSurfaceState("IDLE"); setAnchorState("NOT_ATTEMPTED"); const report = await inspectSpatialArCapabilities(); setArReport(report); if (!report.capabilities.IMMERSIVE_AR) { setSurfaceState("UNAVAILABLE"); setArState(report.capabilities.CAMERA_OVERLAY ? "DEGRADED" : "UNAVAILABLE"); return; } try { const xr = (navigator as NavigatorWithXR).xr; if (!xr) throw new Error("WebXR unavailable"); const session = await xr.requestSession("immersive-ar", spatialArSessionOptions(document.body)); sessionRef.current = session; const localFloor = await session.requestReferenceSpace("local-floor"); referenceSpaceRef.current = localFloor; if (!session.requestHitTestSource) { setSurfaceState("NO_HIT_TEST"); setArState("RUNNING"); return; } const viewer = await session.requestReferenceSpace("viewer"); hitTestSourceRef.current = await session.requestHitTestSource({ space: viewer }); setSurfaceState("DETECTING"); session.addEventListener("end", () => { sessionRef.current = null; hitTestSourceRef.current = null; referenceSpaceRef.current = null; setArState("IDLE"); setSurfaceState("IDLE"); }); setArState("RUNNING"); session.requestAnimationFrame(processFrame); } catch { setArState("DEGRADED"); setSurfaceState("UNAVAILABLE"); } };
  const tryCreateAnchor = async () => { const session = sessionRef.current as SpatialSession & { createAnchor?: (transform: unknown, space: unknown) => Promise<unknown> }; if (!session || !lastHitPoseRef.current || !referenceSpaceRef.current) { setAnchorState("FAILED"); return; } if (!session.createAnchor) { setAnchorState("UNSUPPORTED"); return; } try { await session.createAnchor(lastHitPoseRef.current, referenceSpaceRef.current); setAnchorState("CREATED"); } catch { setAnchorState("FAILED"); } };
  const stopSpatialAr = () => { void sessionRef.current?.end(); sessionRef.current = null; hitTestSourceRef.current = null; referenceSpaceRef.current = null; setArState("IDLE"); setSurfaceState("IDLE"); setAnchorState("NOT_ATTEMPTED"); };
  const resetSpatialAr = () => { stopSpatialAr(); window.setTimeout(() => { void startSpatialAr(); }, 180); };
  const open3DFallback = () => { window.location.assign("/spatial?mode=3d"); };
  const label = (value: PermissionState) => value === "READY" ? "Disponible" : value === "DENIED" ? "Permiso no concedido" : value === "UNAVAILABLE" ? "No disponible" : "No solicitado";
  const surfaceLabel = surfaceState === "DETECTING" ? "Detectando superficies… mueve lentamente el teléfono" : surfaceState === "FOUND" ? "Superficie detectada" : surfaceState === "NO_HIT_TEST" ? "AR disponible, hit-test no expuesto" : surfaceState === "UNAVAILABLE" ? "Usando fallback: cámara/orientación" : "Sin iniciar";

  const ensureBridgeSession = async () => {
    if (!user) throw new Error("Inicia sesión para enviar observaciones al Core");
    if (!projectId) throw new Error("Selecciona un proyecto");
    if (bridgeSession && bridgeSession.projectId === projectId && Date.parse(bridgeSession.expiresAt) > Date.now()) return bridgeSession;
    const session = await openBridgeSession.mutateAsync({ projectId, deviceId, scopes: ["sfb:project:read", "sfb:project:observe"], ttlMinutes: 15 });
    setBridgeSession(session);
    setBridgeVersion(session.observedProjectVersion);
    setBridgeMessage(`Sesión ${session.sessionId} abierta; versión observada ${session.observedProjectVersion}.`);
    return session;
  };

  const sendObservation = async (kind: "CAMERA" | "GPS" | "HIT_TEST" | "VOICE" | "MANUAL", payload: Record<string, unknown>) => {
    try {
      const session = await ensureBridgeSession();
      const result = await observeBridge.mutateAsync({ projectId, session, kind, payload, confidence: kind === "GPS" && locationFix ? "HIGH" : "MEDIUM" });
      const nextSession = { ...session, observedProjectVersion: result.version };
      setBridgeSession(nextSession);
      setBridgeVersion(result.version);
      setBridgeMessage(`Observación ${result.observation.observationId} persistida en SICL Core; versión ${result.version}.`);
      toast.success("Observación enviada a ARKI y registrada para revisión humana");
      if (kind === "MANUAL" || kind === "VOICE") setNote("");
    } catch (error) { const message = error instanceof Error ? error.message : "No se pudo enviar la observación"; setBridgeMessage(message); toast.error(message); }
  };

  const sendNote = () => { if (!note.trim()) return; void sendObservation("MANUAL", { note: note.trim(), capturedAt: new Date().toISOString(), cameraReady: cameraState === "READY", locationAvailable: Boolean(locationFix), arSurfaceState: surfaceState }); };
  const sendGps = () => { if (!locationFix) return; void sendObservation("GPS", { ...locationFix, heading, capturedAt: new Date().toISOString() }); };
  const sendCamera = () => { void sendObservation("CAMERA", { cameraReady: cameraState === "READY", facingMode: "environment", capturedAt: new Date().toISOString(), note: note.trim() || undefined }); };
  const sendHitTest = () => { if (surfaceState !== "FOUND") return; void sendObservation("HIT_TEST", { surfaceDetected: true, anchorState, capturedAt: new Date().toISOString() }); };

  return <main className="min-h-screen bg-[#071a30] px-4 py-6 text-[#edf4ff] sm:px-6 lg:px-10"><div className="mx-auto max-w-6xl space-y-5"><header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#294765] pb-5"><div><p className="text-xs uppercase tracking-[0.22em] text-[#f0a35b]">ARKI FIELD MODE</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Estoy en el terreno</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#b8cbe0]">MiLukita captura el contexto; ARKI lo interpreta y SICL Core registra la observación. Ningún dispositivo puede publicar ni decidir.</p></div><div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100"><ShieldCheck className="h-4 w-4" /> Evidencia humana · escritura canónica protegida</div></header>

<section className="grid gap-4 lg:grid-cols-[1fr_1.4fr]"><Card className="border-[#294765] bg-[#0d223d] text-[#edf4ff]"><CardHeader><CardTitle>Conectar con ARKI</CardTitle></CardHeader><CardContent className="space-y-3"><div><Label htmlFor="field-project" className="text-xs text-[#b8cbe0]">Proyecto</Label><select id="field-project" value={projectId} onChange={(event) => { setProjectId(event.target.value); setBridgeSession(null); }} className="mt-1 w-full rounded-md border border-[#557da5] bg-[#081a30] px-3 py-2 text-sm text-[#edf4ff]"><option value="">Selecciona un proyecto</option>{projects.data?.map((project) => <option key={project.projectId} value={project.projectId}>{project.name} · v{project.version}</option>)}</select></div><div><Label htmlFor="field-device" className="text-xs text-[#b8cbe0]">Dispositivo</Label><Input id="field-device" value={deviceId} readOnly className="mt-1 border-[#557da5] bg-[#081a30] text-xs text-[#b8cbe0]" /></div><Button onClick={() => void ensureBridgeSession().catch((error) => { const message = error instanceof Error ? error.message : "No se pudo abrir la sesión"; setBridgeMessage(message); toast.error(message); })} disabled={!user || !projectId || openBridgeSession.isPending} className="w-full bg-[#f0a35b] text-black hover:bg-[#f6c995]">{openBridgeSession.isPending ? "Conectando…" : bridgeSession ? "Sesión SFB activa" : "Abrir sesión SFB"}</Button><div className="rounded-lg border border-[#557da5] bg-[#081a30] p-3 text-xs leading-5 text-[#b8cbe0]">{bridgeMessage}<br />{bridgeVersion ? `Versión canónica observada: ${bridgeVersion}` : "Las observaciones fallan cerrado mientras SICL_CORE_URL no esté conectado."}</div></CardContent></Card><Card className="border-[#294765] bg-[#0d223d] text-[#edf4ff]"><CardHeader><CardTitle>Regla de autoridad</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-[#b8cbe0]"><p><strong className="text-[#edf4ff]">MiLukita:</strong> cámara, GPS, AR y captura.</p><p><strong className="text-[#edf4ff]">ARKI:</strong> interpreta, conversa y propone.</p><p><strong className="text-[#edf4ff]">SICL Core:</strong> versiona y persiste.</p><p><strong className="text-[#edf4ff]">Humano:</strong> verifica, decide y publica.</p><p className="pt-2 text-xs text-amber-100">Cada envío queda como `AI_PROPOSED` o `USER_PROVIDED` y requiere revisión humana.</p></CardContent></Card></section>

<section className="grid gap-4 lg:grid-cols-3"><Card className="border-[#294765] bg-[#0d223d] text-[#edf4ff]"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Camera className="h-5 w-5 text-[#f0a35b]" />Cámara</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-xs text-[#9eb6ce]">Estado: <strong>{label(cameraState)}</strong></p>{cameraStream ? <><video ref={videoRef} autoPlay muted playsInline className="aspect-video w-full rounded-lg border border-[#557da5] bg-black object-cover" /><div className="flex flex-wrap gap-2"><Button onClick={sendCamera} disabled={!bridgeSession || observeBridge.isPending} className="bg-[#f0a35b] text-black hover:bg-[#f6c995]">Enviar observación</Button><Button variant="outline" onClick={stopCamera} className="border-[#557da5] text-[#d7e5f4]"><X className="mr-2 h-4 w-4" />Detener cámara</Button></div></> : <Button onClick={requestCamera} className="bg-[#f0a35b] text-black hover:bg-[#f6c995]"><Camera className="mr-2 h-4 w-4" />Solicitar cámara</Button>}</CardContent></Card><Card className="border-[#294765] bg-[#0d223d] text-[#edf4ff]"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-5 w-5 text-[#f0a35b]" />Ubicación</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-xs text-[#9eb6ce]">Estado: <strong>{label(locationState)}</strong></p>{locationFix && <p className="text-xs text-[#b8cbe0]">{locationFix.latitude.toFixed(6)}, {locationFix.longitude.toFixed(6)} ± {Math.round(locationFix.accuracyMeters)} m</p>}<div className="flex flex-wrap gap-2"><Button onClick={requestLocation} className="bg-[#6ea8ff] text-[#071a30] hover:bg-[#b8d5ff]"><MapPin className="mr-2 h-4 w-4" />Solicitar ubicación</Button><Button onClick={sendGps} disabled={!locationFix || !bridgeSession || observeBridge.isPending} variant="outline" className="border-[#557da5] text-[#d7e5f4]">Enviar GPS</Button></div><p className="text-[11px] text-[#7893af]">Se envía únicamente después de permiso y sesión autenticada.</p></CardContent></Card><Card className="border-[#294765] bg-[#0d223d] text-[#edf4ff]"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Smartphone className="h-5 w-5 text-[#f0a35b]" />Adaptador espacial</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-xs leading-5 text-[#b8cbe0]">WebXR immersive-ar, hit-test y dom-overlay se detectan por dispositivo. La disponibilidad no demuestra precisión ni anclaje persistente.</p><div className="flex flex-wrap gap-2"><span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] text-amber-100">{arState === "RUNNING" ? "IMMERSIVE_AR_RUNNING" : arState === "CHECKING" ? "CHECKING_CAPABILITIES" : arState === "DEGRADED" ? "CAMERA_ORIENTATION_FALLBACK" : arState === "UNAVAILABLE" ? "AR_UNAVAILABLE" : "AR_NOT_STARTED"}</span>{heading !== null && <span className="rounded-full border border-[#557da5] px-2.5 py-1 text-[11px] text-[#d7e5f4]"><Compass className="mr-1 inline h-3 w-3" />{heading}°</span>}</div>{(arState === "CHECKING" || surfaceState === "DETECTING") && <div className="flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100"><Loader2 className="h-4 w-4 animate-spin" />{surfaceLabel}</div>}{arState === "RUNNING" && surfaceState !== "DETECTING" && <div className="flex items-center gap-2 rounded-lg border border-[#557da5] px-3 py-2 text-xs text-[#d7e5f4]">{surfaceState === "FOUND" ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Radar className="h-4 w-4" />}{surfaceLabel}</div>}{arState === "RUNNING" ? <div className="flex flex-wrap gap-2"><Button onClick={stopSpatialAr} variant="outline" className="border-[#557da5] text-[#d7e5f4]"><Square className="mr-2 h-4 w-4" />Detener AR</Button><Button onClick={resetSpatialAr} variant="outline" className="border-amber-300/60 text-amber-100"><RotateCcw className="mr-2 h-4 w-4" />Reiniciar detección</Button><Button onClick={tryCreateAnchor} disabled={surfaceState !== "FOUND"} className="bg-[#f0a35b] text-black hover:bg-[#f6c995]">{anchorState === "CREATED" ? "Punto fijado" : "Intentar fijar punto"}</Button><Button onClick={sendHitTest} disabled={surfaceState !== "FOUND" || !bridgeSession || observeBridge.isPending} variant="outline" className="border-cyan-300/60 text-cyan-100">Enviar hit-test</Button></div> : <div className="flex flex-wrap gap-2"><Button onClick={startSpatialAr} className="bg-[#f0a35b] text-black hover:bg-[#f6c995]"><Smartphone className="mr-2 h-4 w-4" />Comprobar / iniciar AR</Button><Button onClick={open3DFallback} variant="outline" className="border-cyan-300/60 text-cyan-100"><Box className="mr-2 h-4 w-4" />Abrir visualización 3D alternativa</Button></div>}{arReport && <p className="text-[11px] leading-5 text-[#7893af]">{arReport.epistemicBoundary} Anclaje: {anchorState}.</p>}</CardContent></Card></section>

<Card className="border-[#294765] bg-[#0d223d] text-[#edf4ff]"><CardHeader><CardTitle>Observación de campo</CardTitle></CardHeader><CardContent className="space-y-3"><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Escribe una observación, medida o UNKNOWN..." className="min-h-32 w-full rounded-lg border border-[#557da5] bg-[#081a30] p-3 text-sm text-[#edf4ff] placeholder:text-[#7893af]" /><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-[11px] text-[#7893af]">{note ? "Observación preparada; se guardará como USER_PROVIDED y requerirá revisión" : "No se guardará nada hasta escribir una observación"}</span><Button variant="outline" onClick={sendNote} className="border-[#557da5] text-[#d7e5f4]" disabled={!note.trim() || !bridgeSession || observeBridge.isPending}>Enviar a ARKI</Button></div></CardContent></Card></div></main>;
}
