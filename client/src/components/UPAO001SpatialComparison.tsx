import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useTranslation } from "react-i18next";
import { downloadExport, exportFileName, resolveExportCapabilities, spatialToDxf, spatialToGlb, spatialToIfc, type ExportTarget } from "../lib/spatialExport";
import { deriveMasses, spatialToRenderer, type DerivedMass } from "./UPAO001MassingViewer3D";
import { SpatialSvgViewer, type EnvironmentalLayerId, type Metrics, type SpatialElement, type SpatialRepresentation, type TransportPayload } from "./UPAO001SpatialViewer";

type CameraState = { azimuth: number; elevation: number; distance: number };
type PresentationMode = "lines" | "lines_faces" | "faces" | "faces_shadows" | "simple_materials" | "materials_shadows" | "realistic" | "photo_realistic";
const PRESENTATION_MODES: Array<{ id: PresentationMode; key: string; purpose: string; quality: string; profile: string; availability: "AVAILABLE" | "DEGRADED" | "NOT_AVAILABLE" }> = [
  { id: "lines", key: "presentation_lines", purpose: "Structure", quality: "P0", profile: "FAST", availability: "AVAILABLE" },
  { id: "lines_faces", key: "presentation_lines_faces", purpose: "Technical", quality: "P1", profile: "FAST", availability: "AVAILABLE" },
  { id: "faces", key: "presentation_faces", purpose: "Volumes", quality: "P2", profile: "FAST", availability: "AVAILABLE" },
  { id: "faces_shadows", key: "presentation_faces_shadows", purpose: "Depth", quality: "P3", profile: "BALANCED", availability: "AVAILABLE" },
  { id: "simple_materials", key: "presentation_simple_materials", purpose: "Architectural", quality: "P4", profile: "BALANCED", availability: "AVAILABLE" },
  { id: "materials_shadows", key: "presentation_materials_shadows", purpose: "Presentation", quality: "P5", profile: "HIGH QUALITY", availability: "AVAILABLE" },
  { id: "realistic", key: "presentation_realistic", purpose: "Higher quality", quality: "P6", profile: "HIGH QUALITY", availability: "DEGRADED" },
  { id: "photo_realistic", key: "presentation_photo_realistic", purpose: "Maximum quality", quality: "P7", profile: "MAXIMUM QUALITY", availability: "NOT_AVAILABLE" },
];
type ComparisonProps = { payload: TransportPayload; selectedAlternativeId?: string | null; onSelect?: (id: string) => void; solarAzimuthDegrees?: number; solarElevationDegrees?: number; activeEnvironmentalLayers?: EnvironmentalLayerId[] };

const ALT_ORDER = ["UPAO-001-A", "UPAO-001-B", "UPAO-001-C"];
const ALT_TITLES: Record<string, string> = {
  "UPAO-001-A": "COMPACT",
  "UPAO-001-B": "COURTYARD / VOID",
  "UPAO-001-C": "ARTICULATED / SEPARATED MASSES",
};
const ALT_KEYS: Record<string, string> = { "UPAO-001-A": "compact", "UPAO-001-B": "courtyard", "UPAO-001-C": "articulated" };
const ALT_SUMMARY_KEYS: Record<string, string> = { "UPAO-001-A": "compact_summary", "UPAO-001-B": "courtyard_summary", "UPAO-001-C": "articulated_summary" };
const ALT_READING_KEYS: Record<string, string> = { "UPAO-001-A": "compact_reading", "UPAO-001-B": "courtyard_reading", "UPAO-001-C": "articulated_reading" };

function labelFor(element: SpatialElement, language: string): string {
  return element.labels?.[language] ?? element.labels?.es ?? element.labels?.en ?? element.element_type;
}

function numericPoints(representation: SpatialRepresentation): Array<[number, number]> {
  return representation.elements.flatMap((element) => {
    const walk = (value: unknown): Array<[number, number]> => {
      if (!Array.isArray(value)) return [];
      if (typeof value[0] === "number" && typeof value[1] === "number") return [[value[0], value[1]]];
      return value.flatMap(walk);
    };
    return walk(element.geometry.coordinates);
  });
}

function comparisonBounds(representations: SpatialRepresentation[]) {
  const points = representations.flatMap(numericPoints);
  return {
    minX: Math.min(...points.map(([x]) => x), 0), maxX: Math.max(...points.map(([x]) => x), 1),
    minY: Math.min(...points.map(([, y]) => y), 0), maxY: Math.max(...points.map(([, y]) => y), 1),
  };
}

function massBounds(representation: SpatialRepresentation) {
  const points = representation.elements.flatMap((element) => numericPoints({ ...representation, elements: [element] }));
  const masses = deriveMasses(representation);
  const maxHeight = Math.max(...masses.map((mass) => mass.base + mass.height), 1);
  return {
    minX: Math.min(...points.map(([x]) => x), 0), maxX: Math.max(...points.map(([x]) => x), 1),
    minY: Math.min(...points.map(([, y]) => y), 0), maxY: Math.max(...points.map(([, y]) => y), 1), minZ: 0, maxZ: maxHeight,
  };
}

function ThreeErrorBoundary({ children, alternativeId }: { children: React.ReactNode; alternativeId: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="alert" className="flex h-full min-h-[300px] items-center justify-center bg-amber-50 p-5 text-sm text-amber-950">3D unavailable for {alternativeId}. Use the 2D comparison and textual metrics.</div>;
  return <ErrorCatcher onError={() => setFailed(true)}>{children}</ErrorCatcher>;
}

class ErrorCatcher extends React.Component<{ children: React.ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function CameraRig({ bounds, state, onChange }: { bounds: ReturnType<typeof massBounds>; state: CameraState; onChange: (next: CameraState) => void }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);
  const applying = useRef(false);
  const center = useMemo(() => ({ x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2, z: (bounds.minZ + bounds.maxZ) / 2 }), [bounds]);
  const span = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, bounds.maxZ - bounds.minZ, 1);
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = true; controls.minDistance = 8; controls.maxDistance = 180;
    controlsRef.current = controls;
    const apply = (next: CameraState) => {
      applying.current = true;
      const distance = next.distance * span;
      camera.position.set(center.x + Math.sin(next.azimuth) * Math.cos(next.elevation) * distance, center.z + Math.sin(next.elevation) * distance, -center.y - Math.cos(next.azimuth) * Math.cos(next.elevation) * distance);
      controls.target.set(center.x, center.z, -center.y); controls.update();
      applying.current = false;
    };
    apply(state);
    const handleChange = () => {
      if (applying.current) return;
      const offset = camera.position.clone().sub(new THREE.Vector3(center.x, center.z, -center.y));
      const distance = Math.max(offset.length() / span, 0.1);
      onChange({ azimuth: Math.atan2(offset.x, -offset.z), elevation: Math.asin(offset.y / offset.length()), distance });
    };
    controls.addEventListener("change", handleChange);
    return () => { controls.removeEventListener("change", handleChange); controls.dispose(); controlsRef.current = null; };
  }, [camera, center, gl, onChange, span, state]);
  return null;
}

function Mass({ mass, selected, onSelect, presentationMode }: { mass: DerivedMass; selected: boolean; onSelect: () => void; presentationMode: PresentationMode }) {
  const geometry = useMemo(() => { const shape = new THREE.Shape(); mass.ring.forEach(([x, y], i) => i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)); shape.closePath(); return new THREE.ExtrudeGeometry(shape, { depth: mass.height, bevelEnabled: false }); }, [mass]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const wireframe = presentationMode === "lines" || presentationMode === "lines_faces";
  const visualShadows = presentationMode === "faces_shadows" || presentationMode === "materials_shadows";
  const color = selected ? "#facc15" : presentationMode === "lines" || presentationMode === "lines_faces" ? "#f97316" : presentationMode === "faces" ? "#94a3b8" : presentationMode === "realistic" || presentationMode === "materials_shadows" ? "#d97706" : "#f97316";
  return <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, mass.base, 0]} userData={{ spatialId: mass.element.id }} castShadow={visualShadows} receiveShadow={visualShadows} onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(); }}><meshStandardMaterial color={color} transparent opacity={selected ? 1 : 0.82} roughness={presentationMode === "realistic" ? 0.45 : 0.8} metalness={presentationMode === "realistic" ? 0.08 : 0} wireframe={wireframe} /></mesh>;
}

function ComparisonScene({ representation, cameraState, onCameraChange, selectedId, onSelect, solarAzimuthDegrees, solarElevationDegrees, presentationMode }: { representation: SpatialRepresentation; cameraState: CameraState; onCameraChange: (state: CameraState) => void; selectedId: string | null; onSelect: (mass: DerivedMass) => void; solarAzimuthDegrees?: number; solarElevationDegrees?: number; presentationMode: PresentationMode }) {
  const bounds = useMemo(() => massBounds(representation), [representation]);
  const masses = useMemo(() => deriveMasses(representation), [representation]);
  const site = representation.elements.find((element) => element.element_type === "SiteBoundary");
  const siteRing = site ? numericPoints({ ...representation, elements: [site] }) : [];
  const centerX = (bounds.minX + bounds.maxX) / 2; const centerY = (bounds.minY + bounds.maxY) / 2; const groundSize = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 1.8;
  const north = new THREE.Vector3(Math.sin((representation.north_degrees * Math.PI) / 180), 0, -Math.cos((representation.north_degrees * Math.PI) / 180));
  const solarAzimuth = ((solarAzimuthDegrees ?? 0) * Math.PI) / 180;
  const solarElevation = Math.max(-0.2, ((solarElevationDegrees ?? 0) * Math.PI) / 180);
  const solar = new THREE.Vector3(Math.sin(solarAzimuth) * Math.cos(solarElevation), Math.sin(solarElevation), -Math.cos(solarAzimuth) * Math.cos(solarElevation));
  return <><CameraRig bounds={bounds} state={cameraState} onChange={onCameraChange} /><ambientLight intensity={presentationMode === "realistic" || presentationMode === "materials_shadows" ? 1.35 : 1.8} /><directionalLight castShadow={presentationMode === "faces_shadows" || presentationMode === "materials_shadows"} position={[20, 40, 20]} intensity={presentationMode === "realistic" || presentationMode === "materials_shadows" ? 1.6 : 1.2} shadow-mapSize={[1024, 1024]} /><group position={[-centerX, 0, centerY]}>{siteRing.length >= 3 && <mesh rotation={[-Math.PI / 2, 0, 0]}><shapeGeometry args={[(() => { const shape = new THREE.Shape(); siteRing.forEach(([x, y], i) => i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)); shape.closePath(); return shape; })()]} /><meshBasicMaterial color="#dbeafe" transparent opacity={0.7} side={THREE.DoubleSide} /></mesh>}{masses.map((mass) => <Mass key={mass.element.id} mass={mass} selected={selectedId === mass.element.id} onSelect={() => onSelect(mass)} presentationMode={presentationMode} />)}<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow={presentationMode === "faces_shadows" || presentationMode === "materials_shadows"}><planeGeometry args={[groundSize, groundSize]} /><meshStandardMaterial color={presentationMode === "realistic" || presentationMode === "materials_shadows" ? "#cbd5e1" : "#e2e8f0"} roughness={0.92} metalness={0} /></mesh><gridHelper args={[Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 1.5, 20, "#cbd5e1", "#e2e8f0"]} position={[0, -0.06, 0]} /><arrowHelper args={[north, new THREE.Vector3(0, bounds.maxZ + 0.05, 0), 8, "#2563eb"]} />{solarAzimuthDegrees !== undefined && <arrowHelper args={[solar, new THREE.Vector3(0, bounds.maxZ + 0.05, 0), 8, "#f59e0b"]} />}</group></>;
}

function Comparison3DPanel({ representation, selectedId, onSelect, cameraState, onCameraChange, solarAzimuthDegrees, solarElevationDegrees, presentationMode, onCanvasReady }: { representation: SpatialRepresentation; selectedId: string | null; onSelect: (mass: DerivedMass) => void; cameraState: CameraState; onCameraChange: (state: CameraState) => void; solarAzimuthDegrees?: number; solarElevationDegrees?: number; presentationMode: PresentationMode; onCanvasReady: (canvas: HTMLCanvasElement | null) => void }) {
  const [webglAvailable] = useState(() => {
    if (typeof document === "undefined") return false;
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  });
  return <div className="relative h-[360px] overflow-hidden rounded-md border border-border bg-slate-50" data-testid={`comparison-3d-${representation.alternative_id}`}>{webglAvailable ? <ThreeErrorBoundary alternativeId={representation.alternative_id}><Canvas camera={{ fov: 42 }} dpr={[1, 1.25]} gl={{ antialias: true }} shadows onCreated={({ gl }) => { gl.setClearColor("#f8fafc"); onCanvasReady(gl.domElement); }}><ComparisonScene representation={representation} cameraState={cameraState} onCameraChange={onCameraChange} selectedId={selectedId} onSelect={onSelect} solarAzimuthDegrees={solarAzimuthDegrees} solarElevationDegrees={solarElevationDegrees} presentationMode={presentationMode} /></Canvas></ThreeErrorBoundary> : <div role="alert" className="flex h-full min-h-[300px] items-center justify-center bg-amber-50 p-5 text-center text-sm text-amber-950">3D unavailable in this browser. Use the 2D comparison and textual metrics.</div>}</div>;
}

function polygonArea(representation: SpatialRepresentation): number | null {
  const boundary = representation.elements.find((element) => element.element_type === "SiteBoundary");
  const points = boundary ? numericPoints({ ...representation, elements: [boundary] }) : [];
  if (points.length < 3) return null;
  return Math.abs(points.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = points[(index + 1) % points.length];
    return sum + x * nextY - nextX * y;
  }, 0) / 2);
}

function metricsSummary(metrics: Metrics | undefined): string[] {
  if (!metrics) return ["No metrics available"];
  return [`Height: ${metrics.height?.toFixed(1) ?? "—"} m`, `Floors: ${metrics.floor_count?.toFixed(0) ?? "—"}`, `Footprint: ${metrics.footprint_area?.toFixed(1) ?? "—"} m²`, `Coverage: ${metrics.coverage_ratio?.toFixed(3) ?? "—"}`];
}

export default function UPAO001SpatialComparison({ payload, selectedAlternativeId = null, onSelect, solarAzimuthDegrees, solarElevationDegrees, activeEnvironmentalLayers = ["SUN_POSITION", "SOLAR_RADIATION", "ANALYTICAL_SOLAR_SHADOW"] }: ComparisonProps) {
  const { i18n, t: translate } = useTranslation();
  const [mode, setMode] = useState<"2d" | "3d">("3d");
  const [scope, setScope] = useState<"edificacion" | "parcela_sitio">("edificacion");
  const [presentationMode, setPresentationMode] = useState<PresentationMode>("simple_materials");
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  useEffect(() => { if (!recording) { setRecordingSeconds(0); return; } const started = Date.now(); const timer = window.setInterval(() => setRecordingSeconds(Math.floor((Date.now() - started) / 1000)), 250); return () => window.clearInterval(timer); }, [recording]);
  const chunksRef = useRef<Blob[]>([]);
  const [savedViews, setSavedViews] = useState<Array<{ id: string; alternativeId: string; mode: PresentationMode; camera: CameraState }>>(() => { try { return JSON.parse(localStorage.getItem("sims-dei-spatial-views") ?? "[]"); } catch { return []; } });
  const viewportRef = useRef<HTMLElement | null>(null);
  const [sync, setSync] = useState(true);
  const [localSelectedAlternativeId, setLocalSelectedAlternativeId] = useState<string | null>("UPAO-001-A");
  const [selectedMass, setSelectedMass] = useState<string | null>(null);
  const controlled = onSelect !== undefined;
  const activeSelectedAlternativeId = controlled && selectedAlternativeId ? selectedAlternativeId : localSelectedAlternativeId;
  const selectAlternative = (id: string) => { if (onSelect) onSelect(id); else setLocalSelectedAlternativeId(id); };
  const [cameraState, setCameraState] = useState<CameraState>({ azimuth: 0.75, elevation: 0.72, distance: 1.8 });
  const representations = ALT_ORDER.map((id) => payload.representations.find((item) => item.alternative_id === id)).filter((item): item is SpatialRepresentation => Boolean(item));
  const commonBounds = useMemo(() => comparisonBounds(representations), [representations]);
  const onCameraChange = (next: CameraState) => { if (sync) setCameraState(next); };
  const selected = representations.find((item) => item.alternative_id === activeSelectedAlternativeId);
  const t = (key: string, fallback: string) => {
    const value = translate(`spatialPilot.${key}`);
    return value === `spatialPilot.${key}` ? fallback : value;
  };
  const focused = selected ?? representations[0];
  const siteArea = focused ? polygonArea(focused) : null;
  const exportCapabilities = focused ? resolveExportCapabilities(focused, ["geometry", "BuildingMass", "height", "units", "orientation"]) : [];
  const exportStatus = (target: ExportTarget) => exportCapabilities.find((capability) => capability.target === target)?.status ?? "NOT_APPLICABLE";
  const downloadBlob = (blob: Blob, name: string) => { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); };
  const captureImage = () => { if (!canvas) return; canvas.toBlob((blob) => { if (blob) downloadBlob(blob, `sims-dei-${focused?.alternative_id ?? "design"}-${presentationMode}.png`); }, "image/png"); };
  const startRecording = () => { if (!canvas || typeof MediaRecorder === "undefined" || !canvas.captureStream) return; const stream = canvas.captureStream(30); const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm"; const recorder = new MediaRecorder(stream, { mimeType }); chunksRef.current = []; recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); }; recorder.onstop = () => { downloadBlob(new Blob(chunksRef.current, { type: mimeType }), `sims-dei-${focused?.alternative_id ?? "design"}-walkthrough.webm`); setRecording(false); }; recorder.start(); recorderRef.current = recorder; setRecordingSeconds(0); setRecording(true); };
  const stopRecording = () => { recorderRef.current?.stop(); recorderRef.current = null; };
  const exportMeta = (representation: SpatialRepresentation) => ({ projectId: "UPAO-001", alternativeId: representation.alternative_id, alternativeName: ALT_TITLES[representation.alternative_id] ?? representation.alternative_id, provenance: payload.provenance, units: "m", coordinateSystem: "LOCAL_ENU" });
  const exportCurrent = (format: "ifc" | "dxf" | "glb") => { if (!focused || exportStatus(format.toUpperCase() as ExportTarget) !== "AVAILABLE") return; const meta = exportMeta(focused); if (format === "ifc") downloadExport(spatialToIfc(focused, meta), exportFileName(meta, "ifc"), "application/ifc"); if (format === "dxf") downloadExport(spatialToDxf(focused, meta), exportFileName(meta, "dxf"), "application/dxf"); if (format === "glb") downloadExport(spatialToGlb(focused, meta), exportFileName(meta, "glb"), "model/gltf-binary"); };
  const exportAll = (format: "ifc" | "dxf" | "glb") => { representations.forEach((representation) => { const meta = exportMeta(representation); if (format === "ifc") downloadExport(spatialToIfc(representation, meta), exportFileName(meta, "ifc"), "application/ifc"); if (format === "dxf") downloadExport(spatialToDxf(representation, meta), exportFileName(meta, "dxf"), "application/dxf"); if (format === "glb") downloadExport(spatialToGlb(representation, meta), exportFileName(meta, "glb"), "model/gltf-binary"); }); };
  const saveView = () => { const view = { id: `${Date.now()}`, alternativeId: focused?.alternative_id ?? "UPAO-001-A", mode: presentationMode, camera: cameraState }; const next = [...savedViews, view]; setSavedViews(next); localStorage.setItem("sims-dei-spatial-views", JSON.stringify(next)); };
  const restoreView = (view: { alternativeId: string; mode: PresentationMode; camera: CameraState }) => { selectAlternative(view.alternativeId); setPresentationMode(view.mode); setCameraState(view.camera); };
  const deleteView = (id: string) => { const next = savedViews.filter((view) => view.id !== id); setSavedViews(next); localStorage.setItem("sims-dei-spatial-views", JSON.stringify(next)); };
  const toggleFullscreen = () => { if (!viewportRef.current) return; if (document.fullscreenElement) void document.exitFullscreen(); else void viewportRef.current.requestFullscreen?.(); };
  return <main className="space-y-5" aria-label="UPAO-001 spatial alternative comparison">
    <header className="rounded-2xl border border-primary/30 bg-card p-5 shadow-sm md:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t("eyebrow", "SPATIAL PILOT · DESIGN EXPLORATION")}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2" data-testid="scope-navigation"><span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]" data-testid="scope-indicator">{scope === "edificacion" ? t("scope_building", "EDIFICACIÓN") : t("scope_site", "PARCELA / SITIO")}</span><span className="text-xs text-muted-foreground">{t("scope_semantics", "Semantic scope; camera zoom does not change it.")}</span><button type="button" onClick={() => setScope("parcela_sitio")} disabled={scope === "parcela_sitio"} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-50">{t("view_in_site", "View in site")}</button><button type="button" onClick={() => setScope("edificacion")} disabled={scope === "edificacion"} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-50">{t("inspect_building", "Inspect building")}</button></div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("project", "Project")} · UPAO-001</p><h1 className="mt-1 font-serif text-4xl tracking-[-0.04em]">{t("design", "Design")} · {focused ? t(ALT_KEYS[focused.alternative_id], ALT_TITLES[focused.alternative_id]) : "A/B/C"}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{scope === "parcela_sitio" ? t("site_reading", "The selected building remains identifiable inside its available site context.") : t(ALT_READING_KEYS[focused?.alternative_id ?? "UPAO-001-A"], "Explore the current spatial alternative before opening technical data.")}</p></div>
        <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">{t("human_authority", "You are exploring alternatives. The system is not deciding for you.")}</div>
      </div>
    </header>
    <section className="rounded-2xl border border-border bg-card p-3 shadow-sm" aria-label="Presentation studio"><div className="flex flex-wrap items-center gap-2"><p className="mr-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{t("presentation_mode", "Presentation mode")}</p>{PRESENTATION_MODES.map((option) => <button key={option.id} type="button" onClick={() => option.availability !== "NOT_AVAILABLE" && setPresentationMode(option.id)} disabled={option.availability === "NOT_AVAILABLE"} aria-pressed={presentationMode === option.id} className={`rounded-lg border px-3 py-2 text-left text-xs transition disabled:cursor-not-allowed disabled:opacity-60 ${presentationMode === option.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground hover:border-primary/60"}`}><span className="block font-semibold">{t(option.key, option.id)}</span><span className="block opacity-75">{option.availability} · {option.profile}</span><span className="block opacity-70">{t(`purpose_${option.id}`, option.purpose)}</span></button>)}<button type="button" onClick={captureImage} disabled={!canvas} className="ml-auto rounded-lg border border-border px-3 py-2 text-xs font-semibold disabled:opacity-50">{t("capture_image", "Capture image")}</button>{recording ? <button type="button" onClick={stopRecording} className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-xs font-semibold">● {t("stop_recording", "Stop recording")} · {recordingSeconds}s</button> : <button type="button" onClick={startRecording} disabled={!canvas} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold disabled:opacity-50">● {t("record_video", "Record video")}</button>}<button type="button" onClick={toggleFullscreen} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold">{t("fullscreen", "Fullscreen")}</button><button type="button" onClick={() => setCameraState({ azimuth: 0.75, elevation: 0.72, distance: 1.8 })} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold">{t("reset_view", "Reset view")}</button></div></section>
    <section ref={viewportRef} className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6" aria-label={scope === "parcela_sitio" ? "Parcel site context" : "Focused spatial design"}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{scope === "parcela_sitio" ? t("site_primary_view", "Primary site view") : t("selected", "Focused design")}</p><h2 className="mt-1 text-2xl font-semibold">{focused ? `${focused.alternative_id} · ${t(ALT_KEYS[focused.alternative_id], ALT_TITLES[focused.alternative_id])}` : "—"}</h2></div><div className="flex flex-wrap gap-2" role="group" aria-label="Comparison mode"><button type="button" aria-pressed={mode === "3d"} onClick={() => setMode("3d")} className={`rounded-md border px-4 py-2 text-sm font-semibold ${mode === "3d" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground"}`}>{t("mode_3d", "3D massing")}</button><button type="button" aria-pressed={mode === "2d"} onClick={() => setMode("2d")} className={`rounded-md border px-4 py-2 text-sm font-semibold ${mode === "2d" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground"}`}>{t("mode_2d", "2D plan")}</button>{mode === "3d" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sync} onChange={(event) => setSync(event.target.checked)} /> {t("sync_view", "Synchronize view")}</label>}</div></div>
      {focused && <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]"><div>{scope === "parcela_sitio" && <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950"><p className="font-semibold">{t("site_context_title", "Parcel / site context")}</p><p className="mt-1">{t("site_context_description", "The site representation is synthetic educational context; it is not cadastral, surveyed or geographic data.")}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wide">{t("provenance", "Provenance")}: {payload.provenance} · {t("terrain_status", "Terrain data")}: {t("not_available", "NOT AVAILABLE")}</p></div>}{mode === "2d" ? <SpatialSvgViewer representation={focused} metrics={payload.metrics[focused.alternative_id]} language={i18n.language.split("-")[0]} boundsOverride={commonBounds} solarAzimuthDegrees={solarAzimuthDegrees} solarElevationDegrees={solarElevationDegrees} activeEnvironmentalLayers={activeEnvironmentalLayers} /> : <Suspense fallback={<div role="status" className="flex h-[480px] items-center justify-center rounded border border-border bg-card text-sm text-muted-foreground">Loading 3D comparison…</div>}><Comparison3DPanel representation={focused} selectedId={selectedMass} onSelect={(mass) => { setSelectedMass(mass.element.id); selectAlternative(focused.alternative_id); }} cameraState={cameraState} onCameraChange={onCameraChange} solarAzimuthDegrees={solarAzimuthDegrees} solarElevationDegrees={solarElevationDegrees} presentationMode={presentationMode} onCanvasReady={setCanvas} /></Suspense>} {mode === "3d" && <p className="mt-2 text-xs text-muted-foreground">{t("camera_help", "Drag to rotate · wheel to zoom · right-drag to pan")}</p>}</div><div className="rounded-xl border border-border bg-muted/20 p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{t("architect_summary", "Spatial reading")}</p><p className="mt-2 text-sm leading-6 text-foreground">{t(ALT_READING_KEYS[focused.alternative_id], "Explore the current spatial alternative.")}</p><p className="mt-4 text-sm text-muted-foreground">{scope === "parcela_sitio" ? t("site_context_summary", "Same site context; building alternative remains selected.") : t(ALT_SUMMARY_KEYS[focused.alternative_id], "Spatial alternative")}</p><details className="mt-5 rounded-lg border border-border bg-card p-3"><summary className="cursor-pointer text-sm font-semibold">{t("details", "Technical details")}</summary><div className="mt-3 text-xs text-muted-foreground"><p className="font-semibold text-foreground">{t("metrics", "Metrics")}</p><ul className="mt-2 space-y-1">{metricsSummary(payload.metrics[focused.alternative_id]).map((line) => <li key={line}>{line}</li>)}<li>{t("masses", "Building masses")}: {deriveMasses(focused).length}</li><li>{t("representation", "Spatial representation")}: {focused.id}</li>{scope === "parcela_sitio" && <><li>{t("site_area", "Site area")}: {siteArea?.toFixed(1) ?? "—"} m²</li><li>{t("building_placement", "Building placement")}: {t("available", "AVAILABLE")}</li><li>{t("orientation", "Orientation")}: {focused.north_degrees.toFixed(1)}°</li></>}</ul></div></details></div></div>}
    </section>
    <section className="rounded-xl border border-primary/30 bg-card p-3" aria-label="Export spatial design"><div className="flex flex-wrap items-center gap-2"><div className="mr-2"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{t("export_title", "Export")}</p><p className="text-xs text-muted-foreground">{t("export_current", "Current alternative")}: <strong>{focused?.alternative_id}</strong></p></div><button type="button" onClick={() => exportCurrent("ifc")} disabled={!focused || exportStatus("IFC") !== "AVAILABLE"} className="rounded-md border border-border px-3 py-2 text-xs font-semibold">{t("export_ifc", "BIM · IFC")}</button><button type="button" onClick={() => exportCurrent("dxf")} disabled={!focused || exportStatus("DXF") !== "AVAILABLE"} className="rounded-md border border-border px-3 py-2 text-xs font-semibold">{t("export_dxf", "CAD · DXF")}</button><button type="button" onClick={() => exportCurrent("glb")} disabled={!focused || exportStatus("GLB") !== "AVAILABLE"} className="rounded-md border border-border px-3 py-2 text-xs font-semibold">{t("export_glb", "3D · GLB")}</button><details className="ml-auto"><summary className="cursor-pointer rounded-md border border-border px-3 py-2 text-xs font-semibold">{t("export_all", "Export A / B / C")}</summary><div className="mt-2 flex gap-2 rounded-md border border-border bg-card p-2"><button type="button" onClick={() => exportAll("ifc")} className="text-xs font-semibold">IFC</button><button type="button" onClick={() => exportAll("dxf")} className="text-xs font-semibold">DXF</button><button type="button" onClick={() => exportAll("glb")} className="text-xs font-semibold">GLB</button></div></details></div><p className="mt-2 text-xs text-muted-foreground">{t("export_disclosure", "IFC: spatial/massing BIM exchange. DXF: CAD spatial geometry. GLB: portable 3D visualization model.")} <span className="font-semibold">{focused?.spatial_scope} · IFC {exportStatus("IFC")} · DXF {exportStatus("DXF")} · GLB {exportStatus("GLB")}</span></p></section>
    <section className="rounded-xl border border-border bg-card p-3" aria-label="Saved views"><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={saveView} className="rounded-md border border-border px-3 py-2 text-xs font-semibold">{t("save_view", "Save current view")}</button>{savedViews.map((view) => <span key={view.id} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"><button type="button" onClick={() => restoreView(view)} className="font-semibold">{view.alternativeId} · {view.mode}</button><button type="button" onClick={() => deleteView(view.id)} aria-label={`${t("delete_view", "Delete view")} ${view.alternativeId}`}>×</button></span>)}</div></section>
    <section aria-label="Alternative navigation"><div className="mb-3 flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{t("alternatives", "Alternatives")}</p><h2 className="text-xl font-semibold">A / B / C</h2></div><p className="text-xs text-muted-foreground">{t("data_on_demand", "Open technical data only when needed.")}</p></div><div className="grid gap-3 md:grid-cols-3">{representations.map((representation) => { const metrics = payload.metrics[representation.alternative_id]; const isSelected = activeSelectedAlternativeId === representation.alternative_id; return <button type="button" key={representation.alternative_id} onClick={() => selectAlternative(representation.alternative_id)} aria-pressed={isSelected} className={`min-w-0 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${isSelected ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border bg-card"}`} data-testid={`comparison-panel-${representation.alternative_id}`}><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{representation.alternative_id}</p><h3 className="mt-1 text-lg font-semibold">{t(ALT_KEYS[representation.alternative_id], ALT_TITLES[representation.alternative_id])}</h3><p className="mt-1 text-xs text-muted-foreground">{t(ALT_SUMMARY_KEYS[representation.alternative_id], ALT_TITLES[representation.alternative_id])}</p></div><span className="rounded border border-border px-2 py-1 text-xs font-semibold">{isSelected ? t("selected_action", "Selected for inspection") : t("select", "Inspect")}</span></div><div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground"><span>{t("height", "Height")}: {metrics?.height?.toFixed(1) ?? "—"} m</span><span>{t("floors", "Floors")}: {metrics?.floor_count?.toFixed(0) ?? "—"}</span><span>{t("masses", "Building masses")}: {deriveMasses(representation).length}</span><span>{t("coverage", "Coverage")}: {metrics?.coverage_ratio?.toFixed(3) ?? "—"}</span></div></button>; })}</div></section>
    {representations.length < 3 && <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">Missing alternatives are shown explicitly; no geometry is fabricated.</div>}
    <div role="status" className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">Selected for inspection: <strong>{focused?.alternative_id}</strong>. {t("selection_note", "Selection is UI-only; it does not create a Decision, HumanReview, Recommendation, or approval.")}</div>
    <p className="text-xs text-muted-foreground">{scope === "parcela_sitio" ? t("site_truth", "Synthetic parcel/site context is shown truthfully; missing cadastral, terrain and neighboring data remain missing.") : t("common_site", "Common site reference is preserved across A/B/C.")}</p>
  </main>;
}

export { ALT_ORDER, ALT_TITLES, comparisonBounds, metricsSummary };
