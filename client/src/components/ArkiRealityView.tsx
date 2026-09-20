import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { SpatialElement, SpatialRepresentation } from "./UPAO001SpatialViewer";
import { RealityScene } from "./UPAO001MassingViewer3D";
import { ensureProjectId } from "@/lib/project-id";

type Point = [number, number];
type GeoPoint = { latitude: number; longitude: number };
type Props = { representation: SpatialRepresentation };
type ArStatus = "IDLE" | "REQUESTING_CAMERA" | "READY" | "CALIBRATED" | "WEBXR_ACTIVE" | "ERROR";
type ArSession = XRSession;

type WindowWithXR = Window & { XRSystem?: { isSessionSupported?: (mode: string) => Promise<boolean>; requestSession?: (mode: string, options?: Record<string, unknown>) => Promise<ArSession> } };

const STAKE_GUIDE = [
  { title: "Elige el origen A", text: "Coloca la estaca A en una esquina o punto fijo del terreno que puedas identificar en el plano. No la coloques sobre tierra suelta, vegetación móvil ni una superficie que vaya a cambiar." },
  { title: "Orienta el eje hacia B", text: "Coloca la estaca B sobre una línea recta y visible desde A, preferentemente paralela a un lindero o eje de replanteo. La distancia A–B debe ser conocida y mayor que 5 m cuando el terreno lo permita." },
  { title: "Mide y conserva", text: "Mide la distancia horizontal entre A y B con cinta, estación total o levantamiento confiable. No muevas ninguna estaca después de medirla y conserva la misma unidad: metros." },
  { title: "Registra A y B", text: "Desde cada estaca, captura su latitud y longitud con el mismo dispositivo o instrumento. Espera una precisión estable; si el error GPS es alto, ARKI debe mantener el estado UNKNOWN." },
  { title: "Calibra y verifica", text: "Escribe la distancia que representa el eje de referencia del modelo, aplica la calibración y camina alrededor del terreno. Si el edificio deriva, corrige el levantamiento o repite la medición; no ajustes a ojo." },
] as const;

function StakeMinimap({ stakeA, stakeB }: { stakeA: GeoPoint | null; stakeB: GeoPoint | null }) {
  const points = [stakeA, stakeB].filter((point): point is GeoPoint => Boolean(point));
  const minLat = Math.min(...points.map((point) => point.latitude), 0);
  const maxLat = Math.max(...points.map((point) => point.latitude), 1);
  const minLon = Math.min(...points.map((point) => point.longitude), 0);
  const maxLon = Math.max(...points.map((point) => point.longitude), 1);
  const mapPoint = (point: GeoPoint | null): [number, number] => {
    if (!point) return [0, 0];
    const x = 18 + ((point.longitude - minLon) / Math.max(maxLon - minLon, 0.000001)) * 164;
    const y = 98 - ((point.latitude - minLat) / Math.max(maxLat - minLat, 0.000001)) * 76;
    return [x, y];
  };
  const a = stakeA ? mapPoint(stakeA) : [42, 76] as [number, number];
  const b = stakeB ? mapPoint(stakeB) : [158, 30] as [number, number];
  return <div className="rounded border border-slate-600 bg-[#081d31] p-2" aria-label="Minimapa de orientación de estacas"><div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-slate-400"><span>Vista previa de orientación</span><span>N ↑</span></div><svg viewBox="0 0 200 112" className="mt-1 h-24 w-full"><rect x="8" y="8" width="184" height="96" rx="4" fill="#102f48" stroke="#45627a" /><path d="M18 98 L182 14 M18 74 L182 74 M18 50 L182 50 M18 26 L182 26" stroke="#2a4a61" strokeWidth="1" strokeDasharray="3 4" /><path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#b8e26a" strokeWidth="2" strokeDasharray="4 3" /><circle cx={a[0]} cy={a[1]} r="6" fill="#f97316" stroke="#fff" /><circle cx={b[0]} cy={b[1]} r="6" fill="#38bdf8" stroke="#fff" /><text x={a[0] + 8} y={a[1] + 4} fill="#fed7aa" fontSize="10" fontWeight="700">A</text><text x={b[0] + 8} y={b[1] + 4} fill="#bae6fd" fontSize="10" fontWeight="700">B</text><path d="M178 35 L178 16 M178 16 L174 22 M178 16 L182 22" stroke="#d9f99d" strokeWidth="1.5" /></svg><p className="text-[10px] leading-4 text-slate-400">A es el origen. B define la dirección del eje. La línea discontinua debe coincidir con una referencia real del terreno.</p></div>;
}

function coordinatePairs(value: unknown, output: Point[] = []): Point[] {
  if (!Array.isArray(value)) return output;
  if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") { output.push([value[0], value[1]]); return output; }
  value.forEach((item) => coordinatePairs(item, output));
  return output;
}

function polygonPoints(element: SpatialElement): Point[] {
  const coordinates = element.geometry.coordinates;
  if (element.geometry.type.toLowerCase().includes("polygon") && Array.isArray(coordinates)) {
    const first = Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0]) ? coordinates[0][0] : coordinates[0];
    return coordinatePairs(first);
  }
  return coordinatePairs(coordinates);
}

function distanceMeters(a: GeoPoint, b: GeoPoint): number {
  const r = 6371000;
  const dLat = (b.latitude - a.latitude) * Math.PI / 180;
  const dLon = (b.longitude - a.longitude) * Math.PI / 180;
  const lat = ((a.latitude + b.latitude) / 2) * Math.PI / 180;
  return Math.sqrt((r * dLat) ** 2 + (r * Math.cos(lat) * dLon) ** 2);
}

function bearingDegrees(a: GeoPoint, b: GeoPoint): number {
  const lat1 = a.latitude * Math.PI / 180;
  const lat2 = b.latitude * Math.PI / 180;
  const dLon = (b.longitude - a.longitude) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function projectLocal(point: Point, bounds: { minX: number; maxX: number; minY: number; maxY: number }, width: number, height: number, scale: number, offsetX: number, offsetY: number): Point {
  const x = (point[0] - bounds.minX) * scale + offsetX;
  const y = height - ((point[1] - bounds.minY) * scale + offsetY);
  return [x, y];
}

function readInitialGeo(): GeoPoint | null {
  try {
    const raw = localStorage.getItem("arki-ar-anchor");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GeoPoint>;
    return typeof parsed.latitude === "number" && typeof parsed.longitude === "number" ? { latitude: parsed.latitude, longitude: parsed.longitude } : null;
  } catch { return null; }
}

export default function ArkiRealityView({ representation }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const xrSessionRef = useRef<ArSession | null>(null);
  const [status, setStatus] = useState<ArStatus>("IDLE");
  const [message, setMessage] = useState("El modelo se mostrará sobre la cámara usando la misma SpatialRepresentation.");
  const [anchor, setAnchor] = useState<GeoPoint | null>(readInitialGeo);
  const [devicePosition, setDevicePosition] = useState<GeoPoint | null>(null);
  const [heading, setHeading] = useState(0);
  const [stakeA, setStakeA] = useState<GeoPoint | null>(null);
  const [stakeB, setStakeB] = useState<GeoPoint | null>(null);
  const [referenceDistance, setReferenceDistance] = useState("10");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [webXrSupported, setWebXrSupported] = useState(false);
  const [webXrActive, setWebXrActive] = useState(false);
  const [showCalibration, setShowCalibration] = useState(true);
  const [guideStep, setGuideStep] = useState(0);
  const [projectCode] = useState(() => {
    const code = ensureProjectId(localStorage.getItem("arki-active-project-id"));
    localStorage.setItem("arki-active-project-id", code);
    return code;
  });
  const [copyStatus, setCopyStatus] = useState("");

  const masses = useMemo(() => representation.elements.filter((element) => ["BuildingMass", "BuildingFootprint", "SpatialZone"].includes(element.element_type) && polygonPoints(element).length >= 3), [representation.elements]);
  const allPoints = useMemo(() => masses.flatMap(polygonPoints), [masses]);
  const bounds = useMemo(() => ({ minX: Math.min(...allPoints.map((point) => point[0]), 0), maxX: Math.max(...allPoints.map((point) => point[0]), 10), minY: Math.min(...allPoints.map((point) => point[1]), 0), maxY: Math.max(...allPoints.map((point) => point[1]), 10) }), [allPoints]);
  const stakeDistance = stakeA && stakeB ? distanceMeters(stakeA, stakeB) : null;
  const stakeBearing = stakeA && stakeB ? bearingDegrees(stakeA, stakeB) : null;
  const calibrated = Boolean(anchor && stakeDistance && stakeDistance > 0 && Number(referenceDistance) > 0);

  useEffect(() => {
    const xr = (navigator as Navigator & { xr?: WindowWithXR["XRSystem"] }).xr;
    if (xr?.isSessionSupported) void xr.isSessionSupported("immersive-ar").then(setWebXrSupported).catch(() => setWebXrSupported(false));
    return () => { cameraStream?.getTracks().forEach((track) => track.stop()); void xrSessionRef.current?.end(); };
  }, [cameraStream]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition((position) => setDevicePosition({ latitude: position.coords.latitude, longitude: position.coords.longitude }), () => setMessage("Ubicación no disponible. Puedes declarar el anclaje manualmente o usar dos estacas."), { enableHighAccuracy: true, maximumAge: 3000 });
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const value = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ?? event.alpha ?? 0;
      setHeading(value);
    };
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => { window.removeEventListener("deviceorientationabsolute", handleOrientation, true); window.removeEventListener("deviceorientation", handleOrientation, true); };
  }, []);

  const startCamera = async () => {
    setStatus("REQUESTING_CAMERA");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      setCameraStream(stream);
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setStatus(calibrated ? "CALIBRATED" : "READY");
      setMessage(calibrated ? "Cámara activa y anclaje calibrado por georreferencia." : "Cámara activa. Declara la ubicación del terreno o calibra con dos estacas.");
    } catch { setStatus("ERROR"); setMessage("No se pudo acceder a la cámara. Revisa permisos del navegador y usa HTTPS en el dispositivo."); }
  };

  const useCurrentPosition = () => {
    if (!devicePosition) { setMessage("Aún no hay una posición GPS disponible; espera el permiso o completa las coordenadas manualmente."); return; }
    setAnchor(devicePosition);
    localStorage.setItem("arki-ar-anchor", JSON.stringify(devicePosition));
    setStatus(cameraStream ? "CALIBRATED" : "READY");
    setMessage("Terreno anclado a la ubicación actual declarada por el dispositivo. La precisión GPS debe verificarse en sitio.");
  };

  const applyTwoStakeCalibration = () => {
    if (!stakeA || !stakeB || !stakeDistance || stakeDistance < 1) { setMessage("Se requieren dos estacas con coordenadas válidas y separadas al menos 1 m."); return; }
    setAnchor(stakeA);
    localStorage.setItem("arki-ar-anchor", JSON.stringify(stakeA));
    setStatus(cameraStream ? "CALIBRATED" : "READY");
    setMessage(`Anclaje por dos estacas preparado: ${stakeDistance.toFixed(1)} m medidos, dirección ${stakeBearing?.toFixed(1)}°. La escala del modelo se ajustará a ${referenceDistance} m de referencia.`);
  };

  const startWebXr = async () => {
    const xr = (navigator as Navigator & { xr?: WindowWithXR["XRSystem"] }).xr;
    if (!xr?.requestSession) { setMessage("WebXR inmersivo no está disponible; se usará el modo cámara con superposición georreferenciada."); return; }
    try {
      xrSessionRef.current = await xr.requestSession("immersive-ar", { requiredFeatures: ["local-floor"], optionalFeatures: ["hit-test", "anchors"] });
      setStatus("WEBXR_ACTIVE");
      setWebXrActive(true);
      setMessage("Sesión WebXR activa. La geometría canónica se mantiene como referencia AR; el anclaje geográfico requiere calibración en sitio.");
      xrSessionRef.current.addEventListener?.("end", () => { setWebXrActive(false); setStatus(cameraStream ? "CALIBRATED" : "READY"); });
    } catch { setMessage("WebXR no pudo iniciar. Se conserva el modo cámara, sin inventar precisión de anclaje."); }
  };

  const copyProjectCode = async () => {
    try {
      await navigator.clipboard.writeText(projectCode);
      setCopyStatus("Código copiado");
    } catch {
      setCopyStatus("Copia manualmente el código");
    }
    window.setTimeout(() => setCopyStatus(""), 2200);
  };

  const shareProject = async () => {
    const text = `Proyecto ARKI ${projectCode}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Proyecto ARKI", text, url: window.location.href }); return; } catch { /* el usuario canceló o el navegador no permite compartir */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${window.location.href}`)}`, "_blank", "noopener,noreferrer");
  };

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(`Proyecto ARKI ${projectCode}`)}&body=${encodeURIComponent(`Código del proyecto: ${projectCode}\n\nAbrir proyecto: ${window.location.href}`)}`;
  };

  const overlayTransform = useMemo(() => {
    if (!anchor || !devicePosition) return { x: 0, y: 0, opacity: 0.78 };
    const east = distanceMeters({ latitude: anchor.latitude, longitude: anchor.longitude }, { latitude: anchor.latitude, longitude: devicePosition.longitude }) * Math.sign(devicePosition.longitude - anchor.longitude || 1);
    const north = distanceMeters({ latitude: anchor.latitude, longitude: anchor.longitude }, { latitude: devicePosition.latitude, longitude: anchor.longitude }) * Math.sign(devicePosition.latitude - anchor.latitude || 1);
    return { x: Math.max(-180, Math.min(180, east * 3)), y: Math.max(-90, Math.min(90, -north * 3)), opacity: Math.max(0.35, Math.min(0.9, 1 - Math.hypot(east, north) / 100)) };
  }, [anchor, devicePosition]);

  const width = 520;
  const height = 360;
  const modelScale = calibrated ? Number(referenceDistance) / Math.max(stakeDistance ?? 1, 1) * 22 : 22;
  const modelWidth = Math.max(bounds.maxX - bounds.minX, 1) * modelScale;
  const modelHeight = Math.max(bounds.maxY - bounds.minY, 1) * modelScale;

  return <section className="space-y-4 rounded-lg border border-[#8bc34a]/60 bg-[#071a2d] p-4 text-[#f8fafc]" data-testid="arki-ar-view">
    <header><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8e26a]">ARKI · AR / GEOSPATIAL ANCHOR</p><h2 className="mt-1 font-serif text-2xl">Proyecto anclado en el terreno</h2><p className="mt-1 text-sm text-slate-300">Misma SpatialRepresentation · {representation.alternative_id} · {representation.coordinate_system}</p><div className="mt-3 flex flex-wrap items-center gap-2 rounded border border-[#8bc34a]/50 bg-[#102f48] p-2"><span className="text-[10px] uppercase tracking-wide text-slate-400">Código del proyecto</span><code className="rounded bg-[#071a2d] px-2 py-1 font-mono text-sm font-bold tracking-[0.16em] text-[#d9f99d]">{projectCode}</code><button type="button" onClick={() => void copyProjectCode()} className="rounded border border-[#b8e26a] px-2 py-1 text-[11px] text-[#d9f99d]">Copiar</button><button type="button" onClick={shareByEmail} className="rounded border border-slate-500 px-2 py-1 text-[11px] text-slate-200">Correo</button><button type="button" onClick={() => void shareProject()} className="rounded border border-slate-500 px-2 py-1 text-[11px] text-slate-200">WhatsApp / compartir</button>{copyStatus && <span role="status" className="text-[11px] text-[#b8e26a]">{copyStatus}</span>}</div></header>
    <div className="grid gap-3 md:grid-cols-[1.25fr_.75fr]">
      <div className="relative min-h-[360px] overflow-hidden rounded border border-slate-600 bg-black"><video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover" aria-label="Vista de cámara del terreno" />{!cameraStream && <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-slate-300">Activa la cámara para recorrer el terreno con el modelo superpuesto.</div>}{webXrActive ? <Canvas className="absolute inset-0" camera={{ position: [18, 12, -18], fov: 55 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => { gl.xr.enabled = true; if (xrSessionRef.current) void gl.xr.setSession(xrSessionRef.current); }}><RealityScene representation={representation} scaleFactor={calibrated ? Number(referenceDistance) / Math.max(stakeDistance ?? 1, 1) : 1} rotationY={((stakeBearing ?? representation.north_degrees) - heading) * Math.PI / 180} /></Canvas> : <div className="pointer-events-none absolute inset-0 overflow-hidden"><svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" style={{ opacity: overlayTransform.opacity, transform: `translate(${overlayTransform.x}px, ${overlayTransform.y}px) rotate(${(stakeBearing ?? representation.north_degrees) - heading}deg) scale(${calibrated ? 1 : 0.88})`, transformOrigin: "50% 65%" }}><g transform={`translate(${width / 2 - modelWidth / 2} ${height * .62 - modelHeight / 2})`}>{masses.map((element) => { const points = polygonPoints(element).map((point) => projectLocal(point, bounds, width, height, modelScale, 0, 0)); const heightM = Number(element.metadata?.height_m ?? element.metadata?.height ?? 3); return <g key={element.id}><polygon points={points.map((point) => point.join(",")).join(" ")} fill="#b8e26a" fillOpacity=".26" stroke="#e8ff9d" strokeWidth="2" /><polygon points={points.map(([x, y]) => `${x},${y - heightM * 3}`).join(" ")} fill="#b8e26a" fillOpacity=".12" stroke="#e8ff9d" strokeWidth="1" strokeDasharray="4 3" /></g>; })}</g></svg></div>}<div className="absolute left-3 top-3 rounded bg-black/65 px-2 py-1 text-[11px] text-[#d9f99d]">{status} · heading {heading.toFixed(0)}°{anchor ? " · anchor OK" : " · anchor UNKNOWN"}</div></div>
      <div className="space-y-3 rounded border border-slate-700 bg-[#0d2740] p-3 text-sm"><p className="font-semibold text-[#d9f99d]">ARKI te guía en el replanteo</p><p className="text-xs text-slate-300">{message}</p><StakeMinimap stakeA={stakeA} stakeB={stakeB} /><div className="rounded border border-[#8bc34a]/60 bg-[#102f48] p-3 transition-all duration-300"><div className="mb-3 h-2 overflow-hidden rounded-full bg-[#071a2d]" aria-label={`Progreso de calibración: ${guideStep + 1} de ${STAKE_GUIDE.length}`}><div className="h-full rounded-full bg-[#b8e26a] transition-all duration-500 ease-out" style={{ width: `${((guideStep + 1) / STAKE_GUIDE.length) * 100}%` }} /></div><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-wide text-[#b8e26a]">Paso {guideStep + 1} de {STAKE_GUIDE.length}</p><span className="text-[10px] text-slate-400">{guideStep === STAKE_GUIDE.length - 1 ? "Listo para verificar" : "Siguiente paso"}</span></div><p className="mt-1 font-medium text-white">{STAKE_GUIDE[guideStep].title}</p><p className="mt-1 text-xs leading-5 text-slate-300">{STAKE_GUIDE[guideStep].text}</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => setGuideStep((step) => Math.max(0, step - 1))} disabled={guideStep === 0} className="rounded border border-slate-600 px-2 py-1 text-[11px] text-slate-300 disabled:opacity-40">Anterior</button><button type="button" onClick={() => setGuideStep((step) => Math.min(STAKE_GUIDE.length - 1, step + 1))} disabled={guideStep === STAKE_GUIDE.length - 1} className="rounded bg-[#b8e26a] px-2 py-1 text-[11px] font-semibold text-[#071a2d] disabled:opacity-40">Confirmar paso</button></div></div><div className="grid gap-2"><button type="button" onClick={() => void startCamera()} disabled={status === "REQUESTING_CAMERA"} className="rounded bg-[#b8e26a] px-3 py-2 text-left text-xs font-semibold text-[#071a2d]">{status === "REQUESTING_CAMERA" ? "Solicitando cámara…" : "Activar cámara trasera"}</button><button type="button" onClick={useCurrentPosition} className="rounded border border-[#b8e26a] px-3 py-2 text-left text-xs text-[#d9f99d]">Anclar a mi ubicación GPS</button>{webXrSupported && <button type="button" onClick={() => void startWebXr()} className="rounded border border-[#8bc34a] px-3 py-2 text-left text-xs text-[#d9f99d]">Iniciar WebXR inmersivo</button>}</div><p className="border-t border-slate-700 pt-3 text-[11px] text-slate-300">GPS actual: {devicePosition ? `${devicePosition.latitude.toFixed(6)}, ${devicePosition.longitude.toFixed(6)}` : "UNKNOWN"}</p><p className="text-[11px] text-slate-300">Ancla: {anchor ? `${anchor.latitude.toFixed(6)}, ${anchor.longitude.toFixed(6)}` : "UNKNOWN"}</p><button type="button" onClick={() => setShowCalibration((value) => !value)} className="text-left text-xs font-semibold text-[#b8e26a]">{showCalibration ? "Ocultar campos de calibración" : "Mostrar campos de calibración"}</button>{showCalibration && <div className="space-y-2 rounded border border-slate-600 p-2"><p className="text-[11px] text-slate-300">A fija el origen; B fija dirección y escala. Registra ambas estacas sin moverlas después de medir.</p><div className="grid grid-cols-2 gap-2"><input aria-label="Estaca A latitud" placeholder="A latitud" className="rounded bg-slate-900 p-2 text-xs" onChange={(event) => setStakeA((current) => ({ latitude: Number(event.target.value), longitude: current?.longitude ?? 0 }))} /><input aria-label="Estaca A longitud" placeholder="A longitud" className="rounded bg-slate-900 p-2 text-xs" onChange={(event) => setStakeA((current) => ({ latitude: current?.latitude ?? 0, longitude: Number(event.target.value) }))} /><input aria-label="Estaca B latitud" placeholder="B latitud" className="rounded bg-slate-900 p-2 text-xs" onChange={(event) => setStakeB((current) => ({ latitude: Number(event.target.value), longitude: current?.longitude ?? 0 }))} /><input aria-label="Estaca B longitud" placeholder="B longitud" className="rounded bg-slate-900 p-2 text-xs" onChange={(event) => setStakeB((current) => ({ latitude: current?.latitude ?? 0, longitude: Number(event.target.value) }))} /></div><label className="block text-[11px] text-slate-300">Distancia de referencia del modelo (m)<input value={referenceDistance} onChange={(event) => setReferenceDistance(event.target.value)} className="mt-1 w-full rounded bg-slate-900 p-2 text-xs" /></label><button type="button" onClick={applyTwoStakeCalibration} className="w-full rounded bg-[#b8e26a] px-3 py-2 text-xs font-semibold text-[#071a2d]">Aplicar dos estacas</button><p className="text-[11px] text-slate-400">Medido: {stakeDistance ? `${stakeDistance.toFixed(2)} m · bearing ${stakeBearing?.toFixed(1)}°` : "UNKNOWN"}</p></div>}</div>
    </div>
    <footer className="grid gap-2 border-t border-slate-700 pt-3 text-[11px] text-slate-400 md:grid-cols-3"><p>Precisión: GPS + orientación del dispositivo; requiere verificación en sitio.</p><p>Geometría: derivada del mismo modelo canónico, no una imagen independiente.</p><p>Limitación: sin WebXR/hit-test, la superposición es una ayuda visual y no documentación topográfica.</p></footer>
  </section>;
}
