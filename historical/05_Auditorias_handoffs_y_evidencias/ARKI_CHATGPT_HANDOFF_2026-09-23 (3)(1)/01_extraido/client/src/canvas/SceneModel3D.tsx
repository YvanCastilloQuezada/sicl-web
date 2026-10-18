import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, OrthographicCamera, PerspectiveCamera, Text } from "@react-three/drei";
import type { ConstructionModel } from "@shared/arkiConstructionOntology";
import { selectionFromElement, type BimElementKind } from "@shared/arkiBimSelection";
import { sceneModelFromConstruction, type SceneNode } from "@shared/arkiSceneModel";
import { compareSceneModels } from "@shared/arkiSceneComparison";
import { snapshotRecord, stableSnapshotPayload, type ArkiSnapshot } from "@shared/persistence/arkiPersistence";
import { approveArkiSnapshot, listArkiSnapshots, saveArkiSnapshot } from "../persistence/arkiIndexedDb";
import SceneComparisonSideBySide from "../comparison/SceneComparisonSideBySide";
import Ifc4Panel from "../ifc4/Ifc4Panel";
import { useBimSelection } from "./SelectionProvider";

const KIND_LABELS: Record<string, string> = { wall: "Muros", door: "Puertas", window: "Ventanas", column: "Columnas", beam: "Vigas", slab: "Losas", foundation: "Cimentaciones", stair: "Escaleras", floor: "Pisos", roof: "Cubiertas", partition: "Tabiques" };

type SceneSource = { value: unknown; kind: BimElementKind };

function SceneNodeMesh({ node, selected, onSelect }: { node: SceneNode; selected: boolean; onSelect: () => void }) {
  return <mesh position={node.position} rotation={[0, node.rotationY, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
    <boxGeometry args={node.dimensions} />
    <meshStandardMaterial color={selected ? "#f4c95d" : node.color} transparent opacity={selected ? 1 : node.opacity} emissive={selected ? "#7b5b13" : "#000000"} emissiveIntensity={selected ? 0.35 : 0} />
  </mesh>;
}

type ViewMode = "perspective" | "orthographic" | "plan" | "elevation" | "section";

function SceneContent({ nodes, selectedIds, onSelect, onClear, bounds, viewMode }: { nodes: SceneNode[]; selectedIds: Set<string>; onSelect: (node: SceneNode) => void; onClear: () => void; bounds: { widthM: number; depthM: number; heightM: number }; viewMode: ViewMode }) {
  const centerX = bounds.widthM / 2;
  const centerZ = bounds.depthM / 2;
  return <>
    {viewMode === "orthographic" || viewMode === "plan" ? <OrthographicCamera makeDefault position={viewMode === "plan" ? [centerX, Math.max(20, bounds.heightM * 3), centerZ] : [Math.max(12, bounds.widthM * 1.35), Math.max(10, bounds.heightM * 1.15), Math.max(12, bounds.depthM * 1.35)]} zoom={viewMode === "plan" ? 32 : 18} /> : <PerspectiveCamera makeDefault position={viewMode === "elevation" ? [centerX, bounds.heightM / 2, Math.max(30, bounds.depthM * 3)] : viewMode === "section" ? [Math.max(30, bounds.widthM * 3), bounds.heightM / 2, centerZ] : [Math.max(12, bounds.widthM * 1.35), Math.max(10, bounds.heightM * 1.15), Math.max(12, bounds.depthM * 1.35)]} fov={42} />}
    <ambientLight intensity={1.1} />
    <directionalLight position={[10, 18, 8]} intensity={2.2} castShadow />
    <Grid args={[Math.max(40, bounds.widthM * 2), Math.max(40, bounds.depthM * 2)]} position={[centerX, 0, centerZ]} cellSize={1} cellThickness={0.6} cellColor="#26334f" sectionSize={5} sectionThickness={1.2} sectionColor="#42577c" fadeDistance={80} />
    <axesHelper args={[3]} position={[0, 0.01, 0]} />
    <group onPointerMissed={onClear}>
      {nodes.map((node) => <SceneNodeMesh key={node.id} node={node} selected={selectedIds.has(node.id)} onSelect={() => onSelect(node)} />)}
    </group>
    <Text position={[0, 0.05, -2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.36} color="#9bb3d6" anchorX="left" anchorY="middle">ARCHI · SCENE MODEL</Text>
    <OrbitControls makeDefault target={[centerX, bounds.heightM / 2, centerZ]} enableDamping dampingFactor={0.08} minDistance={3} maxDistance={100} />
  </>;
}

export default function SceneModel3D({ model }: { model: ConstructionModel | null }) {
  const { selection, select, clear } = useBimSelection();
  const scene = useMemo(() => model ? sceneModelFromConstruction(model) : null, [model]);
  const [activeLevel, setActiveLevel] = useState<number | "all">("all");
  const [visibleKinds, setVisibleKinds] = useState<Set<string>>(() => new Set());
  const [referenceScene, setReferenceScene] = useState<typeof scene>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captureMessage, setCaptureMessage] = useState(" ");
  const [snapshots, setSnapshots] = useState<ArkiSnapshot[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("perspective");
  const [clippingActive, setClippingActive] = useState(false);
  const [clipHeight, setClipHeight] = useState(3);
  const [isolatedIds, setIsolatedIds] = useState<Set<string>>(() => new Set());
  const [frozenIds, setFrozenIds] = useState<Set<string>>(() => new Set());
  const [viewpoints, setViewpoints] = useState<Array<{ name: string; viewMode: ViewMode; level: number | "all"; clipping: boolean; clipHeight: number; selectedIds: string[] }>>([]);
  const [measurement, setMeasurement] = useState(" ");

  const sources = useMemo(() => {
    if (!model) return new Map<string, SceneSource>();
    const all: Array<SceneSource & { id: string }> = [
      ...model.walls.map((value) => ({ id: value.id, value, kind: "wall" as const })),
      ...[...model.foundations, ...model.columns, ...model.beams, ...model.slabs, ...model.doors, ...model.windows, ...model.stairs, ...model.floors, ...model.roofs, ...model.partitions].map((value) => ({ id: value.id, value, kind: value.kind })),
    ];
    return new Map(all.map(({ id, value, kind }) => [id, { value, kind }]));
  }, [model]);

  useEffect(() => { void listArkiSnapshots("active-project").then(setSnapshots).catch(() => setCaptureMessage("IndexedDB no disponible")); }, [scene]);

  if (!model || !scene) return <div className="scene-empty">Genera una propuesta para abrir el SceneModel 3D.</div>;
  const categories = Array.from(new Set(scene.nodes.map((node) => node.kind)));
  const nodes = scene.nodes.filter((node) => (activeLevel === "all" || node.level === activeLevel) && (visibleKinds.size === 0 || visibleKinds.has(node.kind)) && (!clippingActive || node.position[1] <= clipHeight) && (isolatedIds.size === 0 || isolatedIds.has(node.id))).map((node) => frozenIds.has(node.id) ? { ...node, opacity: Math.min(node.opacity, 0.22) } : node);
  const selectedIds = new Set(selection.items.map((item) => item.elementId));
  const comparison = referenceScene ? compareSceneModels(referenceScene, scene) : null;
  const toggleKind = (kind: string) => setVisibleKinds((current) => { const next = new Set(current); if (next.has(kind)) next.delete(kind); else next.add(kind); return next; });
  const selectNode = (node: SceneNode) => { const source = sources.get(node.id); if (source) select(selectionFromElement(source.value, source.kind), false); };
  const captureScene = async () => {
    const canvas = canvasRef.current;
    if (!canvas) { setCaptureMessage("Canvas no disponible"); return; }
    const dataUrl = canvas.toDataURL("image/png");
    const binary = atob(dataUrl.split(",")[1] ?? "");
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const hash = Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("");
    const metadata = { schema: "ARKI-SCENE-CAPTURE-1.0", sha256: hash, viewport: { width: canvas.width, height: canvas.height }, level: activeLevel, visibleKinds: Array.from(visibleKinds), selectedIds: Array.from(selectedIds), nodes: nodes.length, generatedAt: new Date().toISOString() };
    const download = (content: BlobPart, type: string, filename: string) => { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url); };
    download(bytes, "image/png", `arki-scene-${hash.slice(0, 12)}.png`);
    download(JSON.stringify(metadata, null, 2), "application/json", `arki-scene-${hash.slice(0, 12)}.json`);
    setCaptureMessage(`SHA-256 ${hash.slice(0, 16)}…`);
  };
  const saveSnapshot = async () => {
    const version = `v${String(snapshots.length + 1).padStart(3, "0")}`;
    const draft = snapshotRecord({ projectId: "active-project", version, scene, gateStatus: "draft", createdAt: new Date().toISOString(), contentHash: "pending" });
    const payload = new TextEncoder().encode(stableSnapshotPayload(draft));
    const digest = await crypto.subtle.digest("SHA-256", payload);
    draft.contentHash = Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("");
    await saveArkiSnapshot(draft);
    setSnapshots(await listArkiSnapshots("active-project"));
    setCaptureMessage(`Snapshot ${version} guardado · DRAFT`);
  };
  const approveLatestSnapshot = async () => {
    const latest = snapshots.at(-1);
    if (!latest) { setCaptureMessage("Guarda un snapshot antes de aprobar"); return; }
    const approved = await approveArkiSnapshot("active-project", latest.version);
    if (approved) { setSnapshots(await listArkiSnapshots("active-project")); setCaptureMessage(`Snapshot ${approved.version} · APPROVED`); }
  };
  const isolateSelection = () => setIsolatedIds(new Set(selectedIds));
  const freezeSelection = () => setFrozenIds((current) => new Set([...Array.from(current), ...Array.from(selectedIds)]));
  const resetVisibility = () => { setIsolatedIds(new Set()); setFrozenIds(new Set()); };
  const measureSelection = () => {
    const selected = scene.nodes.filter((node) => selectedIds.has(node.id));
    if (selected.length < 2) { setMeasurement("Selecciona dos elementos para medir"); return; }
    const [first, second] = selected;
    const distance = Math.hypot(first.position[0] - second.position[0], first.position[1] - second.position[1], first.position[2] - second.position[2]);
    setMeasurement(`Distancia ${distance.toFixed(2)} m · snap: centroide`);
  };
  const saveViewpoint = () => { const name = `Vista ${viewpoints.length + 1}`; setViewpoints((current) => [...current, { name, viewMode, level: activeLevel, clipping: clippingActive, clipHeight, selectedIds: Array.from(selectedIds) }]); setCaptureMessage(`${name} guardada`); };

  return <section className="scene-model-panel">
    <Ifc4Panel scene={scene} />
    <div className="scene-model-toolbar">
      <div><span className="eyebrow compact">E5 · SCENE MODEL</span><h3>Visor BIM 3D</h3><p>{nodes.length} elementos visibles · {scene.levels.length} niveles · selección sincronizada</p></div>
      <div className="scene-model-actions"><label>Nivel <select value={String(activeLevel)} onChange={(event) => setActiveLevel(event.target.value === "all" ? "all" : Number(event.target.value))}><option value="all">Todos</option>{scene.levels.map((level) => <option key={level} value={level}>Nivel {level + 1}</option>)}</select></label><label>Vista <select value={viewMode} onChange={(event) => setViewMode(event.target.value as ViewMode)}><option value="perspective">Perspectiva</option><option value="orthographic">Ortográfica</option><option value="plan">Planta</option><option value="elevation">Elevación</option><option value="section">Corte</option></select></label><label>Clipping <input type="checkbox" checked={clippingActive} onChange={(event) => setClippingActive(event.target.checked)} /></label>{clippingActive && <label>Altura <input type="range" min="0" max={Math.max(3, scene.bounds.heightM)} step="0.1" value={clipHeight} onChange={(event) => setClipHeight(Number(event.target.value))} /></label>}<button onClick={captureScene}>Capturar PNG + hash</button><button onClick={saveSnapshot}>Guardar snapshot</button><button onClick={approveLatestSnapshot}>Aprobar último</button><button onClick={measureSelection}>Medir selección</button><button onClick={isolateSelection}>Aislar</button><button onClick={freezeSelection}>Congelar</button><button onClick={resetVisibility}>Mostrar todo</button><button onClick={saveViewpoint}>Guardar viewpoint</button>{snapshots.length >= 2 && <button onClick={() => setComparisonOpen((open) => !open)}>{comparisonOpen ? "Ocultar comparación" : "Comparar snapshots"}</button>}<button onClick={() => setReferenceScene(scene)}>Capturar referencia</button><button onClick={clear}>Limpiar selección</button></div>
    </div>
    <div className="scene-model-canvas"><Canvas shadows gl={{ preserveDrawingBuffer: true, antialias: true }} onCreated={({ gl }) => { canvasRef.current = gl.domElement; }} onPointerMissed={clear}><SceneContent nodes={nodes} selectedIds={selectedIds} onSelect={selectNode} onClear={clear} bounds={scene.bounds} viewMode={viewMode} /></Canvas><div className="scene-model-hud"><strong>{selection.items.length ? `${selection.items.length} seleccionado(s)` : "Sin selección"}</strong><span>{viewMode} · {clippingActive ? `clipping ${clipHeight.toFixed(1)}m` : "sin clipping"}</span>{captureMessage.trim() && <small>{captureMessage}</small>}{measurement.trim() && <small>{measurement}</small>}{viewpoints.length > 0 && <small>{viewpoints.length} viewpoint(s)</small>}</div></div>
    <div className="scene-model-layers"><span>Capas</span>{categories.map((kind) => <button className={visibleKinds.size === 0 || visibleKinds.has(kind) ? "active" : ""} key={kind} onClick={() => toggleKind(kind)}><i style={{ backgroundColor: scene.nodes.find((node) => node.kind === kind)?.color }} />{KIND_LABELS[kind] ?? kind}</button>)}</div>
    {comparison && <div className="scene-model-comparison"><strong>Comparación de referencia</strong><span>+{comparison.added.length} nuevos</span><span>~{comparison.modified.length} modificados</span><span>-{comparison.removed.length} eliminados</span><span>= {comparison.unchanged.length} sin cambios</span></div>}
    {snapshots.length > 0 && <div className="scene-model-comparison"><strong>Snapshots IndexedDB</strong>{snapshots.map((snapshot) => <span key={snapshot.id}>{snapshot.version} · {snapshot.gateStatus.toUpperCase()}</span>)}</div>}
    {comparisonOpen && snapshots.length >= 2 && <SceneComparisonSideBySide left={snapshots.at(-2)!} right={snapshots.at(-1)!} />}
  </section>;
}
