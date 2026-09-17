import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useTranslation } from "react-i18next";
import { deriveMasses, spatialToRenderer, type DerivedMass } from "./UPAO001MassingViewer3D";
import { SpatialSvgViewer, type Metrics, type SpatialElement, type SpatialRepresentation, type TransportPayload } from "./UPAO001SpatialViewer";

type CameraState = { azimuth: number; elevation: number; distance: number };
type ComparisonProps = { payload: TransportPayload; selectedAlternativeId?: string | null; onSelect?: (id: string) => void; solarAzimuthDegrees?: number; solarElevationDegrees?: number };

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

function Mass({ mass, selected, onSelect }: { mass: DerivedMass; selected: boolean; onSelect: () => void }) {
  const geometry = useMemo(() => { const shape = new THREE.Shape(); mass.ring.forEach(([x, y], i) => i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)); shape.closePath(); return new THREE.ExtrudeGeometry(shape, { depth: mass.height, bevelEnabled: false }); }, [mass]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, mass.base, 0]} userData={{ spatialId: mass.element.id }} onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(); }}><meshStandardMaterial color={selected ? "#facc15" : "#f97316"} transparent opacity={selected ? 1 : 0.78} roughness={0.8} /></mesh>;
}

function ComparisonScene({ representation, cameraState, onCameraChange, selectedId, onSelect, solarAzimuthDegrees, solarElevationDegrees }: { representation: SpatialRepresentation; cameraState: CameraState; onCameraChange: (state: CameraState) => void; selectedId: string | null; onSelect: (mass: DerivedMass) => void; solarAzimuthDegrees?: number; solarElevationDegrees?: number }) {
  const bounds = useMemo(() => massBounds(representation), [representation]);
  const masses = useMemo(() => deriveMasses(representation), [representation]);
  const site = representation.elements.find((element) => element.element_type === "SiteBoundary");
  const siteRing = site ? numericPoints({ ...representation, elements: [site] }) : [];
  const centerX = (bounds.minX + bounds.maxX) / 2; const centerY = (bounds.minY + bounds.maxY) / 2;
  const north = new THREE.Vector3(Math.sin((representation.north_degrees * Math.PI) / 180), 0, -Math.cos((representation.north_degrees * Math.PI) / 180));
  const solarAzimuth = ((solarAzimuthDegrees ?? 0) * Math.PI) / 180;
  const solarElevation = Math.max(-0.2, ((solarElevationDegrees ?? 0) * Math.PI) / 180);
  const solar = new THREE.Vector3(Math.sin(solarAzimuth) * Math.cos(solarElevation), Math.sin(solarElevation), -Math.cos(solarAzimuth) * Math.cos(solarElevation));
  return <><CameraRig bounds={bounds} state={cameraState} onChange={onCameraChange} /><ambientLight intensity={1.8} /><directionalLight position={[20, 40, 20]} intensity={1.2} /><group position={[-centerX, 0, centerY]}>{siteRing.length >= 3 && <mesh rotation={[-Math.PI / 2, 0, 0]}><shapeGeometry args={[(() => { const shape = new THREE.Shape(); siteRing.forEach(([x, y], i) => i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)); shape.closePath(); return shape; })()]} /><meshBasicMaterial color="#dbeafe" transparent opacity={0.7} side={THREE.DoubleSide} /></mesh>}{masses.map((mass) => <Mass key={mass.element.id} mass={mass} selected={selectedId === mass.element.id} onSelect={() => onSelect(mass)} />)}<gridHelper args={[Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 1.5, 20, "#cbd5e1", "#e2e8f0"]} position={[0, -0.06, 0]} /><arrowHelper args={[north, new THREE.Vector3(0, bounds.maxZ + 0.05, 0), 8, "#2563eb"]} />{solarAzimuthDegrees !== undefined && <arrowHelper args={[solar, new THREE.Vector3(0, bounds.maxZ + 0.05, 0), 8, "#f59e0b"]} />}</group></>;
}

function Comparison3DPanel({ representation, selectedId, onSelect, cameraState, onCameraChange, solarAzimuthDegrees, solarElevationDegrees }: { representation: SpatialRepresentation; selectedId: string | null; onSelect: (mass: DerivedMass) => void; cameraState: CameraState; onCameraChange: (state: CameraState) => void; solarAzimuthDegrees?: number; solarElevationDegrees?: number }) {
  const [webglAvailable] = useState(() => {
    if (typeof document === "undefined") return false;
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  });
  return <div className="relative h-[360px] overflow-hidden rounded-md border border-border bg-slate-50" data-testid={`comparison-3d-${representation.alternative_id}`}>{webglAvailable ? <ThreeErrorBoundary alternativeId={representation.alternative_id}><Canvas camera={{ fov: 42 }} dpr={[1, 1.25]} gl={{ antialias: true }} onCreated={({ gl }) => gl.setClearColor("#f8fafc")}><ComparisonScene representation={representation} cameraState={cameraState} onCameraChange={onCameraChange} selectedId={selectedId} onSelect={onSelect} solarAzimuthDegrees={solarAzimuthDegrees} solarElevationDegrees={solarElevationDegrees} /></Canvas></ThreeErrorBoundary> : <div role="alert" className="flex h-full min-h-[300px] items-center justify-center bg-amber-50 p-5 text-center text-sm text-amber-950">3D unavailable in this browser. Use the 2D comparison and textual metrics.</div>}</div>;
}

function metricsSummary(metrics: Metrics | undefined): string[] {
  if (!metrics) return ["No metrics available"];
  return [`Height: ${metrics.height?.toFixed(1) ?? "—"} m`, `Floors: ${metrics.floor_count?.toFixed(0) ?? "—"}`, `Footprint: ${metrics.footprint_area?.toFixed(1) ?? "—"} m²`, `Coverage: ${metrics.coverage_ratio?.toFixed(3) ?? "—"}`];
}

export default function UPAO001SpatialComparison({ payload, selectedAlternativeId = null, onSelect, solarAzimuthDegrees, solarElevationDegrees }: ComparisonProps) {
  const { i18n, t: translate } = useTranslation();
  const [mode, setMode] = useState<"2d" | "3d">("3d");
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
  return <main className="space-y-5" aria-label="UPAO-001 spatial alternative comparison">
    <header className="rounded-2xl border border-primary/30 bg-card p-5 shadow-sm md:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t("eyebrow", "SPATIAL PILOT · DESIGN EXPLORATION")}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("project", "Project")} · UPAO-001</p><h1 className="mt-1 font-serif text-4xl tracking-[-0.04em]">{t("design", "Design")} · {focused ? t(ALT_KEYS[focused.alternative_id], ALT_TITLES[focused.alternative_id]) : "A/B/C"}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{t(ALT_READING_KEYS[focused?.alternative_id ?? "UPAO-001-A"], "Explore the current spatial alternative before opening technical data.")}</p></div>
        <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">{t("human_authority", "You are exploring alternatives. The system is not deciding for you.")}</div>
      </div>
    </header>
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6" aria-label="Focused spatial design">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{t("selected", "Focused design")}</p><h2 className="mt-1 text-2xl font-semibold">{focused ? `${focused.alternative_id} · ${t(ALT_KEYS[focused.alternative_id], ALT_TITLES[focused.alternative_id])}` : "—"}</h2></div><div className="flex flex-wrap gap-2" role="group" aria-label="Comparison mode"><button type="button" aria-pressed={mode === "3d"} onClick={() => setMode("3d")} className={`rounded-md border px-4 py-2 text-sm font-semibold ${mode === "3d" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground"}`}>{t("mode_3d", "3D massing")}</button><button type="button" aria-pressed={mode === "2d"} onClick={() => setMode("2d")} className={`rounded-md border px-4 py-2 text-sm font-semibold ${mode === "2d" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground"}`}>{t("mode_2d", "2D plan")}</button>{mode === "3d" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sync} onChange={(event) => setSync(event.target.checked)} /> {t("sync_view", "Synchronize view")}</label>}</div></div>
      {focused && <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]"><div>{mode === "2d" ? <SpatialSvgViewer representation={focused} metrics={payload.metrics[focused.alternative_id]} language={i18n.language.split("-")[0]} boundsOverride={commonBounds} solarAzimuthDegrees={solarAzimuthDegrees} /> : <Suspense fallback={<div role="status" className="flex h-[480px] items-center justify-center rounded border border-border bg-card text-sm text-muted-foreground">Loading 3D comparison…</div>}><Comparison3DPanel representation={focused} selectedId={selectedMass} onSelect={(mass) => { setSelectedMass(mass.element.id); selectAlternative(focused.alternative_id); }} cameraState={cameraState} onCameraChange={onCameraChange} solarAzimuthDegrees={solarAzimuthDegrees} solarElevationDegrees={solarElevationDegrees} /></Suspense>} {mode === "3d" && <p className="mt-2 text-xs text-muted-foreground">{t("camera_help", "Drag to rotate · wheel to zoom · right-drag to pan")}</p>}</div><div className="rounded-xl border border-border bg-muted/20 p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{t("architect_summary", "Spatial reading")}</p><p className="mt-2 text-sm leading-6 text-foreground">{t(ALT_READING_KEYS[focused.alternative_id], "Explore the current spatial alternative.")}</p><p className="mt-4 text-sm text-muted-foreground">{t(ALT_SUMMARY_KEYS[focused.alternative_id], "Spatial alternative")}</p><details className="mt-5 rounded-lg border border-border bg-card p-3"><summary className="cursor-pointer text-sm font-semibold">{t("details", "Technical details")}</summary><div className="mt-3 text-xs text-muted-foreground"><p className="font-semibold text-foreground">{t("metrics", "Metrics")}</p><ul className="mt-2 space-y-1">{metricsSummary(payload.metrics[focused.alternative_id]).map((line) => <li key={line}>{line}</li>)}<li>{t("masses", "Building masses")}: {deriveMasses(focused).length}</li><li>{t("representation", "Spatial representation")}: {focused.id}</li></ul></div></details></div></div>}
    </section>
    <section aria-label="Alternative navigation"><div className="mb-3 flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{t("alternatives", "Alternatives")}</p><h2 className="text-xl font-semibold">A / B / C</h2></div><p className="text-xs text-muted-foreground">{t("data_on_demand", "Open technical data only when needed.")}</p></div><div className="grid gap-3 md:grid-cols-3">{representations.map((representation) => { const metrics = payload.metrics[representation.alternative_id]; const isSelected = activeSelectedAlternativeId === representation.alternative_id; return <button type="button" key={representation.alternative_id} onClick={() => selectAlternative(representation.alternative_id)} aria-pressed={isSelected} className={`min-w-0 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${isSelected ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border bg-card"}`} data-testid={`comparison-panel-${representation.alternative_id}`}><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{representation.alternative_id}</p><h3 className="mt-1 text-lg font-semibold">{t(ALT_KEYS[representation.alternative_id], ALT_TITLES[representation.alternative_id])}</h3><p className="mt-1 text-xs text-muted-foreground">{t(ALT_SUMMARY_KEYS[representation.alternative_id], ALT_TITLES[representation.alternative_id])}</p></div><span className="rounded border border-border px-2 py-1 text-xs font-semibold">{isSelected ? t("selected_action", "Selected for inspection") : t("select", "Inspect")}</span></div><div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground"><span>{t("height", "Height")}: {metrics?.height?.toFixed(1) ?? "—"} m</span><span>{t("floors", "Floors")}: {metrics?.floor_count?.toFixed(0) ?? "—"}</span><span>{t("masses", "Building masses")}: {deriveMasses(representation).length}</span><span>{t("coverage", "Coverage")}: {metrics?.coverage_ratio?.toFixed(3) ?? "—"}</span></div></button>; })}</div></section>
    {representations.length < 3 && <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">Missing alternatives are shown explicitly; no geometry is fabricated.</div>}
    <div role="status" className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">Selected for inspection: <strong>{focused?.alternative_id}</strong>. {t("selection_note", "Selection is UI-only; it does not create a Decision, HumanReview, Recommendation, or approval.")}</div>
    <p className="text-xs text-muted-foreground">{t("common_site", "Common site reference is preserved across A/B/C.")}</p>
  </main>;
}

export { ALT_ORDER, ALT_TITLES, comparisonBounds, metricsSummary };
