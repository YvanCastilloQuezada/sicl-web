import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Camera, CheckCircle2, ClipboardCheck, Crosshair, Download, LocateFixed, Mic, MapPin, ShieldAlert, Smartphone, WifiOff, ZoomIn, ZoomOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const LazyMapView = lazy(() => import("@/components/Map").then(module => ({ default: module.MapView })));
import { Button } from "@/components/ui/button";
import { calculateConfidenceScore } from "../../../shared/territorialTrust";
import { trpc } from "@/lib/trpc";

type PermissionState = "UNKNOWN" | "REQUESTING" | "GRANTED" | "DENIED" | "UNSUPPORTED";

export function TerritorialPermissionPanel() {
  const [gps, setGps] = useState<PermissionState>("UNKNOWN");
  const [camera, setCamera] = useState<PermissionState>("UNKNOWN");
  const [microphone, setMicrophone] = useState<PermissionState>("UNKNOWN");
  const [coordinates, setCoordinates] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const secureContext = typeof window === "undefined" || window.isSecureContext;

  useEffect(() => {
    let disposed = false;
    const inspect = async () => {
      if (!navigator.permissions?.query) return;
      for (const [name, setter] of [["geolocation", setGps], ["camera", setCamera], ["microphone", setMicrophone]] as const) {
        try {
          const result = await navigator.permissions.query({ name: name as PermissionName });
          if (!disposed) setter(result.state === "granted" ? "GRANTED" : result.state === "denied" ? "DENIED" : "UNKNOWN");
        } catch { /* Algunos navegadores no exponen camera en Permissions API. */ }
      }
    };
    void inspect();
    return () => { disposed = true; };
  }, []);

  const requestGps = useCallback(() => {
    if (!secureContext) { setGps("UNSUPPORTED"); setMessage("GPS requiere HTTPS (o localhost durante desarrollo). Abre la URL segura y vuelve a intentarlo."); return; }
    if (!navigator.geolocation) { setGps("UNSUPPORTED"); setMessage("Este navegador no ofrece geolocalización. Puedes registrar coordenadas manualmente en el formulario."); return; }
    setGps("REQUESTING"); setMessage(null);
    navigator.geolocation.getCurrentPosition(position => {
      setGps("GRANTED");
      setCoordinates(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)} · ±${Math.round(position.coords.accuracy)} m`);
      setMessage("Ubicación recibida. Confirma siempre que el punto corresponde al lugar observado.");
    }, error => {
      setGps(error.code === error.PERMISSION_DENIED ? "DENIED" : "UNKNOWN");
      setMessage(error.code === error.PERMISSION_DENIED ? "GPS denegado. Actívalo en los permisos del navegador y vuelve a pulsar Solicitar GPS." : "No se pudo obtener GPS. Comprueba señal, precisión y que el dispositivo tenga ubicación activa.");
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  }, [secureContext]);

  const requestMicrophone = useCallback(async () => {
    if (!secureContext) { setMicrophone("UNSUPPORTED"); setMessage("El micrófono requiere HTTPS (o localhost durante desarrollo). Abre la URL segura y vuelve a intentarlo."); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setMicrophone("UNSUPPORTED"); setMessage("Este navegador no ofrece micrófono. Puedes continuar con observaciones escritas."); return; }
    setMicrophone("REQUESTING"); setMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      stream.getTracks().forEach(track => track.stop());
      setMicrophone("GRANTED"); setMessage("Micrófono autorizado. El Voice Copilot solo escucha cuando el operador pulsa Dictar.");
    } catch {
      setMicrophone("DENIED"); setMessage("Micrófono denegado. Permítelo desde el candado de la barra de direcciones y vuelve a intentarlo; también puedes escribir la observación.");
    }
  }, [secureContext]);

  const requestCamera = useCallback(async () => {
    if (!secureContext) { setCamera("UNSUPPORTED"); setMessage("La cámara requiere HTTPS (o localhost durante desarrollo). Abre la URL segura y vuelve a intentarlo."); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setCamera("UNSUPPORTED"); setMessage("Este navegador no ofrece cámara. Puedes adjuntar una fotografía existente desde el detalle del WorldObject."); return; }
    setCamera("REQUESTING"); setMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      stream.getTracks().forEach(track => track.stop());
      setCamera("GRANTED"); setMessage("Cámara autorizada. La captura se realiza únicamente cuando la acción de Mapper la solicite.");
    } catch {
      setCamera("DENIED"); setMessage("Cámara denegada. Permítela desde el candado de la barra de direcciones y vuelve a intentarlo; también puedes adjuntar un archivo existente.");
    }
  }, [secureContext]);

  const statusLabel = (state: PermissionState) => state === "GRANTED" ? "Permitido" : state === "DENIED" ? "Denegado" : state === "REQUESTING" ? "Solicitando…" : state === "UNSUPPORTED" ? "No disponible" : "No solicitado";
  const statusClass = (state: PermissionState) => state === "GRANTED" ? "border-emerald-200/30 bg-emerald-200/10 text-emerald-100" : state === "DENIED" ? "border-orange-200/30 bg-orange-200/10 text-orange-100" : "border-white/15 bg-white/5 text-slate-300";
  const exportDiagnostic = useCallback(() => {
    const report = [
      "MiLukita · Diagnóstico prepiloto de permisos",
      `Fecha UTC: ${new Date().toISOString()}`,
      `Contexto seguro HTTPS: ${secureContext ? "SÍ" : "NO"}`,
      `Conectividad navegador: ${navigator.onLine ? "ONLINE" : "OFFLINE"}`,
      `GPS: ${statusLabel(gps)}${coordinates ? ` · ${coordinates}` : ""}`,
      `Cámara: ${statusLabel(camera)}`,
      `Micrófono: ${statusLabel(microphone)}`,
      "Nota: este archivo registra el estado observado por el navegador; no sustituye el protocolo físico Field Gate 001.",
    ].join("\\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `milukita-diagnostico-${new Date().toISOString().slice(0, 10)}.txt`; link.click(); URL.revokeObjectURL(url);
    setMessage("Diagnóstico exportado correctamente. Conserva el archivo junto al registro del Field Gate.");
  }, [secureContext, gps, camera, microphone, coordinates]);

  return <section className="mt-6 border border-cyan-200/15 bg-cyan-200/[.03] p-5" aria-labelledby="permissions-title"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-200">Mapper · permisos de campo</p><h2 id="permissions-title" className="mt-1 font-display text-2xl text-white">Preparar captura real</h2><p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">Solicita permisos solo cuando los necesites. La denegación no borra datos: permite continuar con coordenadas o archivos manuales.</p></div><div className="flex flex-wrap items-center gap-2"><Badge className="border border-white/15 bg-white/5 text-slate-300"><ShieldAlert className="mr-2 h-3.5 w-3.5" />{secureContext ? "HTTPS verificado" : "Requiere HTTPS"}</Badge><Button type="button" size="sm" variant="outline" onClick={exportDiagnostic}><Download className="mr-2 h-4 w-4" />Exportar diagnóstico</Button></div></div><div className="mt-4 grid gap-3 md:grid-cols-3"><div className="border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-sm font-semibold text-white"><LocateFixed className="h-4 w-4 text-cyan-200" />GPS</span><Badge className={statusClass(gps)}>{statusLabel(gps)}</Badge></div><p className="mt-2 text-xs leading-5 text-slate-400">Registra posición y precisión; revisa el punto antes de guardarlo.</p><Button className="mt-3" size="sm" onClick={requestGps} disabled={gps === "REQUESTING" || !secureContext} variant="outline"><MapPin className="mr-2 h-4 w-4" />{gps === "REQUESTING" ? "Obteniendo…" : "Solicitar GPS"}</Button>{coordinates ? <p className="mt-2 font-mono text-[11px] text-emerald-200">{coordinates}</p> : null}</div><div className="border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-sm font-semibold text-white"><Camera className="h-4 w-4 text-cyan-200" />Cámara</span><Badge className={statusClass(camera)}>{statusLabel(camera)}</Badge></div><p className="mt-2 text-xs leading-5 text-slate-400">La vista previa y el archivo quedan bajo el workflow de evidencia.</p><Button className="mt-3" size="sm" onClick={() => void requestCamera()} disabled={camera === "REQUESTING" || !secureContext} variant="outline"><Camera className="mr-2 h-4 w-4" />{camera === "REQUESTING" ? "Solicitando…" : "Solicitar cámara"}</Button></div><div className="border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-sm font-semibold text-white"><Mic className="h-4 w-4 text-cyan-200" />Micrófono</span><Badge className={statusClass(microphone)}>{statusLabel(microphone)}</Badge></div><p className="mt-2 text-xs leading-5 text-slate-400">Necesario solo para dictar observaciones en Field Voice Copilot.</p><Button className="mt-3" size="sm" onClick={() => void requestMicrophone()} disabled={microphone === "REQUESTING" || !secureContext} variant="outline"><Mic className="mr-2 h-4 w-4" />{microphone === "REQUESTING" ? "Solicitando…" : "Solicitar micrófono"}</Button></div></div>{message ? <p className="mt-4 flex items-start gap-2 border border-amber-200/20 bg-amber-200/10 p-3 text-xs leading-5 text-amber-50" role="status"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />{message}</p> : null}</section>;
}

type TerritorialMapObject = { publicId: string; name: string; latitude: string | number; longitude: string | number; status: string; syncStatus?: string; version: number; accuracyMeters: number; confidenceScore?: number; claims?: unknown[]; sources?: unknown[]; evidence?: unknown[]; assets?: Array<{ publicId?: string; originalName?: string; mimeType?: string; accessScope?: string; url?: string }> };

export const TERRITORIAL_MAP_SYNC_FILTERS = ["ALL", "SYNCED", "SERVER_RECORD", "PENDING_SYNC", "CONFLICT"] as const;
export const TERRITORIAL_CONFIDENCE_FILTERS = ["ALL", "HIGH", "MEDIUM", "LOW"] as const;
export type TerritorialMapSyncFilter = (typeof TERRITORIAL_MAP_SYNC_FILTERS)[number];
export type TerritorialMapConfidenceFilter = (typeof TERRITORIAL_CONFIDENCE_FILTERS)[number];

export function matchesTerritorialMapFilters(point: { sync: string; confidence: number }, syncFilter: TerritorialMapSyncFilter, confidenceFilter: TerritorialMapConfidenceFilter) {
  const syncMatches = syncFilter === "ALL" || point.sync === syncFilter;
  const confidenceMatches = confidenceFilter === "ALL" || confidenceFilter === "HIGH" && point.confidence >= 80 || confidenceFilter === "MEDIUM" && point.confidence >= 50 && point.confidence < 80 || confidenceFilter === "LOW" && point.confidence < 50;
  return syncMatches && confidenceMatches;
}

export function openStreetMapTile(latitude: number, longitude: number, zoom = 13) {
  const scale = 2 ** zoom;
  const x = Math.floor(((longitude + 180) / 360) * scale);
  const latitudeRad = latitude * Math.PI / 180;
  const y = Math.floor((1 - Math.asinh(Math.tan(latitudeRad)) / Math.PI) / 2 * scale);
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

export function clusterTerritorialPoints<T extends { lat: number; lng: number }>(points: T[], precision = 3): Array<T & { count: number; members: T[] }> {
  const grouped = new Map<string, T & { count: number; members: T[] }>();
  points.forEach(point => {
    const key = `${point.lat.toFixed(precision)}:${point.lng.toFixed(precision)}`;
    const current = grouped.get(key);
    if (current) {
      current.count += 1;
      current.members.push(point);
    } else {
      grouped.set(key, { ...point, count: 1, members: [point] });
    }
  });
  return Array.from(grouped.values());
}

function tileCoordinates(latitude: number, longitude: number, zoom: number) {
  const scale = 2 ** zoom;
  const x = Math.floor(((longitude + 180) / 360) * scale);
  const latitudeRad = Math.max(-85.0511, Math.min(85.0511, latitude)) * Math.PI / 180;
  const y = Math.floor((1 - Math.asinh(Math.tan(latitudeRad)) / Math.PI) / 2 * scale);
  return { x, y, scale };
}

export function offlineMapTileUrls(latitude: number, longitude: number, zoom = 13, radius = 1) {
  const safeZoom = Math.max(1, Math.min(16, Math.round(zoom)));
  const safeRadius = Math.max(0, Math.min(1, Math.round(radius)));
  const { x, y, scale } = tileCoordinates(latitude, longitude, safeZoom);
  const urls: string[] = [];
  for (let offsetY = -safeRadius; offsetY <= safeRadius; offsetY += 1) {
    for (let offsetX = -safeRadius; offsetX <= safeRadius; offsetX += 1) {
      const wrappedX = (x + offsetX + scale) % scale;
      const tileY = Math.max(0, Math.min(scale - 1, y + offsetY));
      urls.push(`https://tile.openstreetmap.org/${safeZoom}/${wrappedX}/${tileY}.png`);
    }
  }
  return urls;
}

type OfflinePolygonPoint = { lat: number; lng: number };

export function offlineMapTileUrlsForPolygon(polygon: OfflinePolygonPoint[], zoom = 13) {
  if (polygon.length < 3) return [];
  const safeZoom = Math.max(1, Math.min(16, Math.round(zoom)));
  const minLat = Math.min(...polygon.map(point => point.lat));
  const maxLat = Math.max(...polygon.map(point => point.lat));
  const minLng = Math.min(...polygon.map(point => point.lng));
  const maxLng = Math.max(...polygon.map(point => point.lng));
  const southWest = tileCoordinates(minLat, minLng, safeZoom);
  const northEast = tileCoordinates(maxLat, maxLng, safeZoom);
  const urls: string[] = [];
  const maxTiles = 25;
  for (let y = northEast.y; y <= southWest.y && urls.length < maxTiles; y += 1) {
    for (let x = southWest.x; x <= northEast.x && urls.length < maxTiles; x += 1) {
      const { scale } = tileCoordinates(0, 0, safeZoom);
      urls.push(`https://tile.openstreetmap.org/${safeZoom}/${(x + scale) % scale}/${Math.max(0, Math.min(scale - 1, y))}.png`);
    }
  }
  return urls;
}

function polygonContains(point: OfflinePolygonPoint, polygon: OfflinePolygonPoint[]) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const currentPoint = polygon[index];
    const previousPoint = polygon[previous];
    const crosses = currentPoint.lng > point.lng !== previousPoint.lng > point.lng;
    if (crosses && point.lat < (previousPoint.lat - currentPoint.lat) * (point.lng - currentPoint.lng) / (previousPoint.lng - currentPoint.lng) + currentPoint.lat) inside = !inside;
  }
  return inside;
}

const FIELD_GATE_STEPS = [
  { title: "Preparar dispositivo A", detail: "Usa Mapper con sesión iniciada, rol MAPPER y conexión identificada. Registra modelo, sistema operativo y navegador." },
  { title: "Verificar permisos", detail: "Solicita GPS y cámara; registra concedido, denegado o no disponible. No inventes precisión ni borres errores." },
  { title: "Capturar sin conexión", detail: "Desactiva temporalmente la red, crea un WorldObject y evidencia, confirma LOCAL_PENDING y conserva la trazabilidad." },
  { title: "Revisar en dispositivo B", detail: "Con The Eye/Human Authority, recibe el objeto, revisa coordenadas, evidencia y confidence score explicable." },
  { title: "Probar conflicto y publicación", detail: "Genera dos versiones, confirma que ambas sobreviven y que Runtime solo consume la versión PUBLISHED autorizada." },
  { title: "Registrar resultado", detail: "Clasifica la incidencia, añade observaciones y guarda el resultado del gate para corregir solo lo observado." },
] as const;

type FieldGateSeverity = "PASS" | "BLOCKER" | "CRITICAL" | "MAJOR" | "MINOR" | "OBSERVATION";
type FieldGateStepStatus = "PENDING" | "PASS" | "FAIL" | "BLOCKED";
type FieldGateReport = { id: string; protocol: string; deviceA: string; deviceB: string; severity: FieldGateSeverity; observations: string; completedSteps: number[]; stepResults: Record<string, FieldGateStepStatus>; savedAt: string };

export function TerritorialFieldTestGuide() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [stepResults, setStepResults] = useState<Record<number, FieldGateStepStatus>>({});
  const [reportHistory, setReportHistory] = useState<FieldGateReport[]>([]);
  const [deviceA, setDeviceA] = useState("");
  const [deviceB, setDeviceB] = useState("");
  const [severity, setSeverity] = useState<FieldGateSeverity>("OBSERVATION");
  const [observations, setObservations] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const syncReport = trpc.territorial.syncFieldGateReport.useMutation();
  const exportReports = trpc.territorial.exportFieldGateReports.useMutation();
  const remoteReports = trpc.territorial.fieldGateReports.useQuery(undefined, { retry: false });
  useEffect(() => {
    try {
      const raw = localStorage.getItem("milukita:field-gate:reports");
      if (raw) {
        const reports = JSON.parse(raw) as FieldGateReport[];
        if (Array.isArray(reports)) setReportHistory(reports.slice(-20).reverse());
      }
    } catch { /* Historial local corrupto: se ignora sin bloquear el gate. */ }
  }, []);
  useEffect(() => {
    const flushPendingReports = () => {
      if (!navigator.onLine) return;
      try {
        const raw = localStorage.getItem("milukita:field-gate:reports");
        const reports = raw ? JSON.parse(raw) as FieldGateReport[] : [];
        reports.slice(-20).forEach(report => {
          void syncReport.mutateAsync({ report: { publicId: report.id, protocol: report.protocol, deviceA: report.deviceA, deviceB: report.deviceB, severity: report.severity, observations: report.observations, completedSteps: report.completedSteps, stepResults: report.stepResults } }).catch(() => undefined);
        });
      } catch { /* La cola local permanece disponible si el almacenamiento no es legible. */ }
    };
    window.addEventListener("online", flushPendingReports);
    flushPendingReports();
    return () => window.removeEventListener("online", flushPendingReports);
  }, []);
  const markStep = () => { setStepResults(current => ({ ...current, [step]: "PASS" })); setCompleted(current => current.includes(step) ? current : [...current, step]); };
  const saveReport = () => {
    const report: FieldGateReport = { id: `FIELD-${Date.now()}`, protocol: "TRUJILLO — PILOTO 001", deviceA, deviceB, severity, observations, completedSteps: completed, stepResults: Object.fromEntries(Object.entries(stepResults).map(([key, value]) => [key, value as FieldGateStepStatus])), savedAt: new Date().toISOString() };
    try {
      const raw = localStorage.getItem("milukita:field-gate:reports");
      const existing = raw ? JSON.parse(raw) as FieldGateReport[] : [];
      const next = [...existing, report].slice(-20);
      localStorage.setItem("milukita:field-gate:reports", JSON.stringify(next));
      localStorage.setItem("milukita:field-gate:last-report", JSON.stringify(report));
      setReportHistory(next.slice().reverse());
    } catch { /* La guía sigue funcionando aunque el almacenamiento local esté lleno. */ }
    setSavedAt(report.savedAt);
    if (navigator.onLine) {
      void syncReport.mutateAsync({ report: { publicId: report.id, protocol: report.protocol, deviceA: report.deviceA, deviceB: report.deviceB, severity: report.severity, observations: report.observations, completedSteps: report.completedSteps, stepResults: report.stepResults } }).catch(() => undefined);
    }
  };
  const downloadReports = async (format: "csv" | "pdf") => {
    const result = await exportReports.mutateAsync({ format });
    const href = result.encoding === "base64" ? `data:${result.contentType};base64,${result.content}` : `data:${result.contentType},${encodeURIComponent(result.content)}`;
    const anchor = document.createElement("a"); anchor.href = href; anchor.download = result.filename; anchor.click();
  };
  return <section className="mt-6 border border-violet-200/15 bg-violet-200/[.03] p-5" aria-labelledby="field-gate-title"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-violet-200">Gate de campo · QA humano</p><h2 id="field-gate-title" className="mt-1 font-display text-2xl text-white">Protocolo TRUJILLO — PILOTO 001</h2><p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">Guía interactiva para ejecutar la prueba en dos dispositivos reales. La aplicación no puede certificar hardware desde el sandbox: registra lo que el equipo observe.</p></div><Badge className="border border-violet-200/25 bg-violet-200/10 text-violet-100"><ClipboardCheck className="mr-2 h-3.5 w-3.5" />{completed.length}/{FIELD_GATE_STEPS.length} pasos</Badge></div><div className="mt-4 h-2 w-full bg-white/10"><div className="h-2 bg-violet-200 transition-[width] duration-200" style={{ width: `${((completed.length / FIELD_GATE_STEPS.length) * 100)}%` }} /></div><div className="mt-5 grid gap-3 md:grid-cols-[.8fr_1.2fr]"><div className="space-y-2">{FIELD_GATE_STEPS.map((item, index) => <button key={item.title} type="button" onClick={() => setStep(index)} className={`flex w-full items-start gap-3 border p-3 text-left ${step === index ? "border-violet-200/50 bg-violet-200/10" : "border-white/10 bg-black/15"}`}><span className={`grid h-6 w-6 shrink-0 place-items-center text-xs font-bold ${stepResults[index] === "PASS" ? "bg-emerald-300 text-[#062019]" : stepResults[index] === "FAIL" ? "bg-orange-300 text-[#2d1700]" : stepResults[index] === "BLOCKED" ? "bg-violet-300 text-[#21103d]" : "bg-white/10 text-slate-300"}`}>{stepResults[index] === "PASS" ? "✓" : stepResults[index] === "FAIL" ? "!" : stepResults[index] === "BLOCKED" ? "×" : index + 1}</span><span><strong className="block text-sm text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.detail}</span></span></button>)}</div><div className="border border-white/10 bg-black/20 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-violet-200"><Smartphone className="h-4 w-4" />Paso {step + 1} de {FIELD_GATE_STEPS.length}</div><h3 className="mt-2 text-lg font-semibold text-white">{FIELD_GATE_STEPS[step].title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{FIELD_GATE_STEPS[step].detail}</p><label className="mt-3 block text-xs text-slate-400">Estado del paso<select value={stepResults[step] ?? "PENDING"} onChange={event => { const value = event.target.value as FieldGateStepStatus; setStepResults(current => ({ ...current, [step]: value })); setCompleted(current => value === "PASS" ? (current.includes(step) ? current : [...current, step]) : current.filter(item => item !== step)); }} className="mt-1 block w-full border border-white/15 bg-[#071914] px-3 py-2 text-sm text-white"><option value="PENDING">Pendiente</option><option value="PASS">PASS</option><option value="FAIL">FAIL</option><option value="BLOCKED">BLOCKED</option></select></label><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs text-slate-400">Dispositivo A · Mapper<input value={deviceA} onChange={event => setDeviceA(event.target.value)} placeholder="Ej. Pixel 8 · Android 15 · Chrome" className="mt-1 w-full border border-white/15 bg-[#071914] px-3 py-2 text-sm text-white" /></label><label className="text-xs text-slate-400">Dispositivo B · The Eye<input value={deviceB} onChange={event => setDeviceB(event.target.value)} placeholder="Ej. iPhone · iOS · Safari" className="mt-1 w-full border border-white/15 bg-[#071914] px-3 py-2 text-sm text-white" /></label></div><div className="mt-3 flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" onClick={markStep}>{completed.includes(step) ? "Paso completado" : "Marcar paso completado"}</Button><Button type="button" size="sm" variant="outline" onClick={() => setStep(current => Math.max(0, current - 1))} disabled={step === 0}>Anterior</Button><Button type="button" size="sm" variant="outline" onClick={() => setStep(current => Math.min(FIELD_GATE_STEPS.length - 1, current + 1))} disabled={step === FIELD_GATE_STEPS.length - 1}>Siguiente</Button></div></div></div><div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto] md:items-end"><label className="text-xs text-slate-400">Resultado / severidad<select value={severity} onChange={event => setSeverity(event.target.value as FieldGateSeverity)} className="mt-1 block w-full border border-white/15 bg-[#071914] px-3 py-2 text-sm text-white"><option value="PASS">PASS</option><option value="BLOCKER">BLOCKER</option><option value="CRITICAL">CRITICAL</option><option value="MAJOR">MAJOR</option><option value="MINOR">MINOR</option><option value="OBSERVATION">OBSERVATION</option></select></label><label className="text-xs text-slate-400">Observaciones<textarea value={observations} onChange={event => setObservations(event.target.value)} rows={2} placeholder="Precisión observada, conectividad, tiempos, errores o decisiones…" className="mt-1 block w-full border border-white/15 bg-[#071914] px-3 py-2 text-sm text-white" /></label><Button type="button" onClick={saveReport}><ClipboardCheck className="mr-2 h-4 w-4" />Guardar reporte</Button></div>{savedAt ? <p className="mt-3 text-xs text-emerald-200" role="status">Reporte local guardado: {new Date(savedAt).toLocaleString()}</p> : null}{reportHistory.length || remoteReports.data?.length ? <div className="mt-5 border border-white/10 bg-black/20 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-violet-200">Registro de resultados</p><span className="text-[11px] text-slate-500">{reportHistory.length} locales · {remoteReports.data?.length ?? 0} sincronizados</span></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => void downloadReports("csv")} disabled={exportReports.isPending}>CSV</Button><Button type="button" size="sm" variant="outline" onClick={() => void downloadReports("pdf")} disabled={exportReports.isPending}>PDF</Button></div></div><div className="mt-3 space-y-2">{reportHistory.slice(0, 5).map(report => <div key={report.id} className="flex flex-wrap items-center justify-between gap-2 border border-white/10 px-3 py-2 text-xs"><span className="font-mono text-slate-300">{report.id}</span><span className="text-slate-400">{report.completedSteps.length}/{FIELD_GATE_STEPS.length} PASS · {report.severity}</span><span className="text-slate-500">{new Date(report.savedAt).toLocaleString()}</span></div>)}</div></div> : null}</section>;
}

export function TerritorialFieldMap({ objects }: { objects: TerritorialMapObject[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncFilter, setSyncFilter] = useState<TerritorialMapSyncFilter>("ALL");
  const [confidenceFilter, setConfidenceFilter] = useState<TerritorialMapConfidenceFilter>("ALL");
  const [gpsCenter, setGpsCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [offlinePan, setOfflinePan] = useState({ x: 0, y: 0 });
  const [offlinePolygon, setOfflinePolygon] = useState<OfflinePolygonPoint[]>([]);
  const [polygonMode, setPolygonMode] = useState(false);
  const [viewportBounds, setViewportBounds] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
  const [offlineConsent, setOfflineConsent] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [cachedObjects, setCachedObjects] = useState<TerritorialMapObject[]>([]);
  const [tileDownload, setTileDownload] = useState<{ state: "IDLE" | "DOWNLOADING" | "READY" | "ERROR"; completed: number; total: number; message?: string }>({ state: "IDLE", completed: 0, total: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("milukita:territorial-map-cache");
      if (raw) {
        const parsed = JSON.parse(raw) as { objects?: TerritorialMapObject[] };
        if (Array.isArray(parsed.objects)) setCachedObjects(parsed.objects.slice(0, 1000));
      }
    } catch { /* Cache local corrupta: se ignora sin bloquear Mapper. */ }
  }, []);
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/territorial-map-sw.js").catch(() => {
      setTileDownload(current => ({ ...current, state: "ERROR", message: "El navegador no habilitó la caché offline de teselas; los registros locales siguen disponibles." }));
    });
  }, []);

  const sourceObjects = offlineMode && cachedObjects.length ? cachedObjects : objects;
  const points = useMemo(() => sourceObjects
    .map(object => ({
      ...object,
      lat: Number(object.latitude),
      lng: Number(object.longitude),
      sync: object.syncStatus ?? (object.status === "PUBLISHED" ? "SYNCED" : "SERVER_RECORD"),
      confidence: typeof object.confidenceScore === "number" ? object.confidenceScore : calculateConfidenceScore({
        sourceCount: object.sources?.length ?? 0,
        evidenceCount: object.evidence?.length ?? 0,
        claimCount: object.claims?.length ?? 0,
        accuracyMeters: Number(object.accuracyMeters ?? 0),
        status: object.status as never,
      }),
    }))
    .filter(object => Number.isFinite(object.lat) && Number.isFinite(object.lng)), [sourceObjects]);
  const filteredPoints = useMemo(() => points.filter(point => matchesTerritorialMapFilters(point, syncFilter, confidenceFilter)), [points, syncFilter, confidenceFilter]);
  const viewportPoints = useMemo(() => viewportBounds
    ? filteredPoints.filter(point => point.lng >= viewportBounds.west && point.lng <= viewportBounds.east && point.lat >= viewportBounds.south && point.lat <= viewportBounds.north)
    : filteredPoints, [filteredPoints, viewportBounds]);
  const clusterPrecision = mapZoom >= 16 ? 4 : mapZoom >= 14 ? 3 : 2;
  const clusters = useMemo(() => clusterTerritorialPoints(viewportPoints, clusterPrecision), [viewportPoints, clusterPrecision]);
  const bounds = useMemo(() => {
    const lats = filteredPoints.map(point => point.lat);
    const lngs = filteredPoints.map(point => point.lng);
    return {
      minLat: Math.min(...lats, -90),
      maxLat: Math.max(...lats, 90),
      minLng: Math.min(...lngs, -180),
      maxLng: Math.max(...lngs, 180),
    };
  }, [filteredPoints]);
  const selected = filteredPoints.find(point => point.publicId === selectedId) ?? null;

  useEffect(() => { setViewportBounds(null); }, [offlineMode]);

  const centerOnGps = () => {
    if (!navigator.geolocation) {
      setGpsMessage("Este navegador no ofrece GPS; puedes usar las coordenadas registradas.");
      return;
    }
    setGpsMessage("Solicitando ubicación…");
    navigator.geolocation.getCurrentPosition(position => {
      const next = { lat: position.coords.latitude, lng: position.coords.longitude };
      setGpsCenter(next);
      setGpsMessage(`Mapa centrado en tu ubicación · precisión ±${Math.round(position.coords.accuracy)} m`);
    }, () => setGpsMessage("No se pudo obtener la ubicación. Revisa el permiso GPS y vuelve a intentarlo."), { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  const saveOfflineCache = () => {
    if (!offlineConsent) return;
    const payload = JSON.stringify({ savedAt: Date.now(), objects: objects.slice(0, 1000) });
    if (payload.length > 1_000_000) {
      setGpsMessage("La caché supera 1 MB; reduce los filtros o usa una sesión más pequeña.");
      return;
    }
    localStorage.setItem("milukita:territorial-map-cache", payload);
    setCachedObjects(objects.slice(0, 1000));
    setGpsMessage(`Caché offline guardada · ${Math.min(objects.length, 1000)} registros`);
  };

  const handleOfflineMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!polygonMode || (event.target as HTMLElement).closest("button")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    const ratioX = Math.max(0, Math.min(1, (event.clientX - rect.left) / width));
    const ratioY = Math.max(0, Math.min(1, (event.clientY - rect.top) / height));
    const next = { lat: bounds.maxLat - ratioY * (bounds.maxLat - bounds.minLat), lng: bounds.minLng + ratioX * (bounds.maxLng - bounds.minLng) };
    setOfflinePolygon(current => current.length >= 8 ? current : [...current, next]);
  };

  const downloadOfflineMap = async () => {
    if (!offlineConsent) {
      setTileDownload({ state: "ERROR", completed: 0, total: 0, message: "Primero acepta guardar una zona cartográfica local." });
      return;
    }
    if (!window.caches || !filteredPoints[0]) {
      setTileDownload({ state: "ERROR", completed: 0, total: 0, message: "Este navegador no permite descargar mapas o no hay registros filtrados." });
      return;
    }
    const urls = offlinePolygon.length >= 3 ? offlineMapTileUrlsForPolygon(offlinePolygon, mapZoom) : offlineMapTileUrls(filteredPoints[0].lat, filteredPoints[0].lng, mapZoom, 1);
    if (!urls.length) {
      setTileDownload({ state: "ERROR", completed: 0, total: 0, message: "Dibuja una zona con al menos tres vértices antes de descargar." });
      return;
    }
    setTileDownload({ state: "DOWNLOADING", completed: 0, total: urls.length });
    try {
      const cache = await window.caches.open("milukita-map-tiles-v1");
      for (let index = 0; index < urls.length; index += 1) {
        const url = urls[index];
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await cache.put(url, response.clone());
        setTileDownload({ state: "DOWNLOADING", completed: index + 1, total: urls.length });
      }
      setTileDownload({ state: "READY", completed: urls.length, total: urls.length, message: `Zona descargada: ${urls.length} teselas en zoom ${mapZoom}.` });
    } catch (error) {
      setTileDownload(current => ({ ...current, state: "ERROR", message: `No se pudo completar la descarga (${error instanceof Error ? error.message : "proveedor no disponible"}).` }));
    }
  };

  const polygonVertices = offlinePolygon.map(point => {
    const x = bounds.maxLng === bounds.minLng ? 50 : ((point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 86 + 7;
    const y = bounds.maxLat === bounds.minLat ? 50 : (1 - (point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 78 + 10;
    return `${x}% ${y}%`;
  }).join(", ");
  const polygonPointCount = offlinePolygon.length >= 3 ? filteredPoints.filter(point => polygonContains({ lat: point.lat, lng: point.lng }, offlinePolygon)).length : 0;
  const mapMarkers = clusters.map(point => ({
    id: point.publicId,
    position: { lat: point.lat, lng: point.lng },
    label: point.count > 1 ? String(point.count) : undefined,
    title: point.count > 1 ? `${point.count} puntos agrupados` : `${point.name} · ${point.status} · confianza ${point.confidence}/100`,
    status: point.status,
    onClick: () => setSelectedId(point.members[0]?.publicId ?? point.publicId),
  }));

  return (
    <section className="mt-6 border border-emerald-200/15 bg-emerald-200/[.03] p-5" aria-labelledby="field-map-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-200">World Engine · vista territorial</p>
          <h2 id="field-map-title" className="mt-1 font-display text-2xl text-white">Puntos de levantamiento</h2>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">Vista operativa del inventario cargado. El mapa no convierte un punto en dato publicado.</p>
        </div>
        <span className="flex items-center gap-2 text-xs text-slate-400"><WifiOff className="h-4 w-4 text-emerald-200" />{points.length} puntos</span>
      </div>

      <div className="mt-5 grid gap-3 border border-white/10 bg-black/20 p-3 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
        <label className="text-xs text-slate-400">Estado de sincronización
          <select value={syncFilter} onChange={event => setSyncFilter(event.target.value as TerritorialMapSyncFilter)} className="mt-1 block w-full border border-white/15 bg-[#071914] px-3 py-2 text-sm text-white">
            <option value="ALL">Todos</option><option value="SYNCED">SYNCED</option><option value="SERVER_RECORD">Registro server</option><option value="PENDING_SYNC">PENDING_SYNC</option><option value="CONFLICT">CONFLICT</option>
          </select>
        </label>
        <label className="text-xs text-slate-400">Nivel de confianza
          <select value={confidenceFilter} onChange={event => setConfidenceFilter(event.target.value as TerritorialMapConfidenceFilter)} className="mt-1 block w-full border border-white/15 bg-[#071914] px-3 py-2 text-sm text-white">
            <option value="ALL">Todos</option><option value="HIGH">Alto · 80–100</option><option value="MEDIUM">Medio · 50–79</option><option value="LOW">Bajo · 0–49</option>
          </select>
        </label>
        <p className="text-xs text-slate-500">Mostrando <strong className="text-white">{viewportPoints.length}</strong> de {points.length} · {clusters.length} grupos · {offlineMode ? "offline" : "online"}</p>
        <Button type="button" size="sm" variant="outline" onClick={centerOnGps}><Crosshair className="mr-2 h-4 w-4" />Centrar GPS</Button>
      </div>
      {gpsMessage ? <p className="mt-2 text-xs text-cyan-100" role="status">{gpsMessage}</p> : null}

      <div className="mt-3 flex flex-wrap items-center gap-3 border border-white/10 bg-black/20 p-3 text-xs">
        <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" checked={offlineConsent} onChange={event => setOfflineConsent(event.target.checked)} />Permitir caché local limitada a 1 MB</label>
        <Button type="button" size="sm" variant="outline" onClick={saveOfflineCache} disabled={!offlineConsent}>Guardar registros offline</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setOfflineMode(current => !current)} disabled={!cachedObjects.length}>{offlineMode ? "Usar datos online" : `Usar caché offline (${cachedObjects.length})`}</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => { setPolygonMode(current => !current); if (offlinePolygon.length >= 8) setOfflinePolygon([]); }}>{polygonMode ? "Finalizar polígono" : "Dibujar zona"}</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => { setOfflinePolygon([]); setPolygonMode(false); }}>Limpiar zona</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => void downloadOfflineMap()} disabled={!offlineConsent || tileDownload.state === "DOWNLOADING" || offlinePolygon.length < 3}>{tileDownload.state === "DOWNLOADING" ? `Descargando ${tileDownload.completed}/${tileDownload.total}` : "Descargar zona offline"}</Button>
        <span className="text-slate-500">Haz clic en el mapa para añadir 3–8 vértices · {offlinePolygon.length} vértices · {polygonPointCount} puntos dentro.</span>
      </div>
      {tileDownload.total > 0 ? <div className="mt-2 h-1.5 w-full bg-white/10" aria-label={`Progreso de mapas offline ${tileDownload.completed} de ${tileDownload.total}`}><div className={`h-1.5 ${tileDownload.state === "ERROR" ? "bg-orange-300" : "bg-cyan-200"}`} style={{ width: `${Math.min(100, (tileDownload.completed / tileDownload.total) * 100)}%` }} /></div> : null}
      {tileDownload.message ? <p className={`mt-2 text-xs ${tileDownload.state === "ERROR" ? "text-orange-200" : "text-emerald-200"}`} role="status">{tileDownload.message}</p> : null}

      <div className="mt-5 border border-white/10 bg-black/20 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-[.12em] text-cyan-200">Cartografía real · OpenStreetMap + Google Maps proxy</p><p className="text-[11px] text-slate-500">OpenStreetMap aporta contexto raster; el proxy habilita navegación cuando está disponible.</p></div>
        <div className="relative mt-3 h-[220px] overflow-hidden border border-white/10 bg-[#0b2520]"><img src={openStreetMapTile(filteredPoints[0]?.lat ?? -8.1116, filteredPoints[0]?.lng ?? -79.0287)} alt="Contexto cartográfico OpenStreetMap del territorio" className="h-full w-full object-cover opacity-80" loading="lazy" /><div className="absolute bottom-2 left-2 border border-white/15 bg-black/65 px-2 py-1 text-[10px] text-white">© OpenStreetMap contributors · capa de contexto</div></div>
        <Suspense fallback={<div className="grid min-h-[420px] place-items-center border border-cyan-200/15 bg-black/20 text-sm text-cyan-100" role="status" aria-live="polite">Cargando cartografía…</div>}><LazyMapView initialCenter={filteredPoints[0] ? { lat: filteredPoints[0].lat, lng: filteredPoints[0].lng } : { lat: -8.1116, lng: -79.0287 }} center={gpsCenter ?? undefined} initialZoom={13} zoom={mapZoom} onZoomChanged={setMapZoom} onViewportChanged={viewport => { setMapZoom(viewport.zoom); setViewportBounds(viewport.bounds); }} markers={mapMarkers} /></Suspense>
      </div>

      <div className={`relative mt-5 min-h-[320px] overflow-hidden border border-white/10 bg-[#091b18] ${polygonMode ? "cursor-crosshair" : ""}`} role="application" aria-label={`Mapa esquemático con ${filteredPoints.length} puntos de levantamiento`} onClick={handleOfflineMapClick}>
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 border border-white/15 bg-black/65 p-1" aria-label="Navegación offline del mapa"><span className="px-2 text-[10px] font-bold uppercase tracking-[.12em] text-cyan-100">Offline</span><button type="button" className="grid h-7 w-7 place-items-center text-slate-200 hover:bg-white/10" aria-label="Mover mapa arriba" onClick={() => setOfflinePan(current => ({ ...current, y: current.y - 8 }))}><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" className="grid h-7 w-7 place-items-center text-slate-200 hover:bg-white/10" aria-label="Mover mapa abajo" onClick={() => setOfflinePan(current => ({ ...current, y: current.y + 8 }))}><ArrowDown className="h-3.5 w-3.5" /></button><button type="button" className="grid h-7 w-7 place-items-center text-slate-200 hover:bg-white/10" aria-label="Mover mapa a la izquierda" onClick={() => setOfflinePan(current => ({ ...current, x: current.x - 8 }))}><ArrowLeft className="h-3.5 w-3.5" /></button><button type="button" className="grid h-7 w-7 place-items-center text-slate-200 hover:bg-white/10" aria-label="Mover mapa a la derecha" onClick={() => setOfflinePan(current => ({ ...current, x: current.x + 8 }))}><ArrowRight className="h-3.5 w-7" /></button><button type="button" className="grid h-7 w-7 place-items-center text-slate-200 hover:bg-white/10" aria-label="Acercar mapa offline" onClick={() => setMapZoom(current => Math.min(18, current + 1))}><ZoomIn className="h-3.5 w-3.5" /></button><button type="button" className="grid h-7 w-7 place-items-center text-slate-200 hover:bg-white/10" aria-label="Alejar mapa offline" onClick={() => setMapZoom(current => Math.max(8, current - 1))}><ZoomOut className="h-3.5 w-3.5" /></button></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(91,234,208,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(91,234,208,.35) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        {offlinePolygon.length >= 3 ? <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-cyan-200/70 bg-cyan-200/10" style={{ clipPath: `polygon(${polygonVertices})` }} aria-label="Zona offline seleccionada" /> : null}
        {offlinePolygon.map((point, index) => { const x = bounds.maxLng === bounds.minLng ? 50 : ((point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 86 + 7; const y = bounds.maxLat === bounds.minLat ? 50 : (1 - (point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 78 + 10; return <span key={`polygon-${index}`} className="pointer-events-none absolute grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cyan-100 text-[9px] font-bold text-[#062019]" style={{ left: `${x}%`, top: `${y}%` }}>{index + 1}</span>; })}
        {clusters.map(point => { const x = bounds.maxLng === bounds.minLng ? 50 : ((point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 86 + 7; const y = bounds.maxLat === bounds.minLat ? 50 : (1 - (point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 78 + 10; const tone = point.status === "PUBLISHED" ? "bg-emerald-300 text-[#062019]" : point.status === "CONFLICT" || point.status === "DISPUTED" ? "bg-orange-300 text-[#2d1700]" : "bg-cyan-200 text-[#062019]"; return <button key={point.publicId} type="button" onClick={() => setSelectedId(point.publicId)} className={`absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center border-2 border-[#071914] shadow-[0_0_0_3px_rgba(101,247,215,.18)] ${selectedId === point.publicId ? "ring-2 ring-white ring-offset-2 ring-offset-[#091b18]" : ""} ${tone}`} style={{ left: `calc(${x}% + ${offlinePan.x}px)`, top: `calc(${y}% + ${offlinePan.y}px)` }} title={`${point.name} · ${point.status} · confianza ${point.confidence}/100`} aria-label={`${point.count > 1 ? `${point.count} puntos agrupados` : point.name}, estado ${point.status}, confianza ${point.confidence} de 100`}><MapPin className="h-4 w-4" />{point.count > 1 ? <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-bold text-[#062019]">{point.count}</span> : null}</button>; })}
        {!filteredPoints.length ? <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-slate-500">No hay puntos que coincidan con los filtros activos.</div> : null}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 border border-white/10 bg-black/40 p-2 text-[11px] text-slate-300"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-200" />Registro</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-orange-300" />Conflicto</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-300" />Publicado</span></div>
        {selected ? <div className="absolute right-3 top-3 w-64 border border-white/15 bg-[#071914]/95 p-4 shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[11px] text-cyan-200">{selected.publicId}</p><p className="mt-1 text-sm font-bold text-white">{selected.name}</p></div><button type="button" aria-label="Cerrar detalle del punto" onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-white">×</button></div><p className="mt-3 text-xs text-slate-300">{selected.latitude}, {selected.longitude}</p><div className="mt-3 flex items-center justify-between text-xs"><span className="text-slate-500">Workflow · sync</span><strong className="text-white">{selected.status} · {selected.sync}</strong></div><div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-500">Confianza explicable</span><strong className="text-emerald-200">{selected.confidence}/100</strong></div><p className="mt-3 text-[11px] leading-4 text-slate-500">v{selected.version} · precisión ±{selected.accuracyMeters} m. Haz clic para abrir el expediente completo.</p></div> : null}
      </div>

      {selected ? <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="territorial-point-dialog"><div className="max-h-[85vh] w-full max-w-2xl overflow-auto border border-cyan-200/25 bg-[#071914] p-6 text-slate-100 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs text-cyan-200">{selected.publicId}</p><h3 id="territorial-point-dialog" className="mt-1 font-display text-3xl text-white">{selected.name}</h3><p className="mt-2 text-sm text-slate-400">Expediente completo del levantamiento · v{selected.version}</p></div><button type="button" aria-label="Cerrar modal del levantamiento" onClick={() => setSelectedId(null)} className="text-2xl text-slate-400 hover:text-white">×</button></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="border border-white/10 bg-black/20 p-3"><p className="text-xs text-slate-500">Coordenadas</p><p className="mt-1 text-sm text-white">{selected.latitude}, {selected.longitude}</p></div><div className="border border-white/10 bg-black/20 p-3"><p className="text-xs text-slate-500">Estado</p><p className="mt-1 text-sm text-white">{selected.status} · {selected.sync}</p></div><div className="border border-white/10 bg-black/20 p-3"><p className="text-xs text-slate-500">Confianza explicable</p><p className="mt-1 text-sm text-emerald-200">{selected.confidence}/100</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-3"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-cyan-200">Claims</p><p className="mt-2 text-sm text-slate-300">{selected.claims?.length ?? 0} registrados</p>{selected.claims?.slice(0, 3).map((claim, index) => <p key={`claim-${index}`} className="mt-2 text-xs leading-5 text-slate-400">{typeof claim === "string" ? claim : JSON.stringify(claim)}</p>)}</div><div><p className="text-xs font-bold uppercase tracking-[.12em] text-amber-200">Sources</p><p className="mt-2 text-sm text-slate-300">{selected.sources?.length ?? 0} registradas</p>{selected.sources?.slice(0, 3).map((source, index) => <p key={`source-${index}`} className="mt-2 text-xs leading-5 text-slate-400">{typeof source === "string" ? source : JSON.stringify(source)}</p>)}</div><div><p className="text-xs font-bold uppercase tracking-[.12em] text-emerald-200">Evidence & assets</p><p className="mt-2 text-sm text-slate-300">{(selected.evidence?.length ?? 0) + (selected.assets?.length ?? 0)} adjuntas</p>{selected.assets?.slice(0, 3).map((asset, index) => <p key={`asset-${index}`} className="mt-2 text-xs leading-5 text-slate-400">{asset.originalName ?? `Asset ${index + 1}`} · {asset.mimeType ?? "tipo no informado"} · {asset.accessScope ?? "scope protegido"}</p>)}</div></div><div className="mt-5 border border-white/10 bg-black/20 p-4"><p className="text-xs font-bold uppercase tracking-[.12em] text-slate-300">Matriz de evidencia</p><p className="mt-2 text-xs leading-5 text-slate-400">El score es una señal explicable para priorizar revisión; no certifica por sí solo la verdad del levantamiento ni habilita publicación.</p></div></div></div> : null}
    </section>
  );
}
