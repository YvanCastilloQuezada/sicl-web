import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import type { ArkiSnapshot } from "@shared/persistence/arkiPersistence";
import type { SceneNode } from "@shared/arkiSceneModel";
import { compareSceneModels } from "@shared/arkiSceneComparison";

type ViewControls = { viewMode: "perspective" | "orthographic"; level: number | "all"; heightFilterActive: boolean; heightFilter: number };

function SnapshotViewport({ nodes, bounds, controls, onChange }: { nodes: SceneNode[]; bounds: { widthM: number; depthM: number; heightM: number }; controls: ViewControls; onChange: (next: ViewControls) => void }) {
  const visibleNodes = nodes.filter((node) => (controls.level === "all" || node.level === controls.level) && (!controls.heightFilterActive || node.position[1] <= controls.heightFilter));
  return <div className="scene-side-by-side-viewport">
    <div className="scene-side-by-side-controls">
      <label>Vista <select value={controls.viewMode} onChange={(event) => onChange({ ...controls, viewMode: event.target.value as ViewControls["viewMode"] })}><option value="perspective">Perspectiva</option><option value="orthographic">Ortográfica</option></select></label>
      <label>Nivel <select value={String(controls.level)} onChange={(event) => onChange({ ...controls, level: event.target.value === "all" ? "all" : Number(event.target.value) })}><option value="all">Todos</option><option value="0">Nivel 1</option><option value="1">Nivel 2</option><option value="2">Nivel 3</option></select></label>
      <label>Filtro por altura <input type="checkbox" checked={controls.heightFilterActive} onChange={(event) => onChange({ ...controls, heightFilterActive: event.target.checked })} /></label>
      {controls.heightFilterActive && <input aria-label="Altura" type="range" min="0" max={Math.max(3, bounds.heightM)} step="0.1" value={controls.heightFilter} onChange={(event) => onChange({ ...controls, heightFilter: Number(event.target.value) })} />}
    </div>
    <Canvas gl={{ antialias: true }}>
      {controls.viewMode === "orthographic" ? <OrthographicCamera makeDefault position={[Math.max(12, bounds.widthM * 1.35), Math.max(10, bounds.heightM * 1.15), Math.max(12, bounds.depthM * 1.35)]} zoom={18} /> : <PerspectiveCamera makeDefault position={[Math.max(12, bounds.widthM * 1.35), Math.max(10, bounds.heightM * 1.15), Math.max(12, bounds.depthM * 1.35)]} fov={42} />}
      <ambientLight intensity={1.1} /><directionalLight position={[10, 18, 8]} intensity={2.2} />
      <Grid args={[Math.max(40, bounds.widthM * 2), Math.max(40, bounds.depthM * 2)]} position={[bounds.widthM / 2, 0, bounds.depthM / 2]} cellSize={1} cellThickness={0.6} cellColor="#26334f" sectionSize={5} sectionColor="#42577c" />
      {visibleNodes.map((node) => <mesh key={node.id} position={node.position} rotation={[0, node.rotationY, 0]}><boxGeometry args={node.dimensions} /><meshStandardMaterial color={node.color} transparent opacity={node.opacity} /></mesh>)}
      <OrbitControls target={[bounds.widthM / 2, bounds.heightM / 2, bounds.depthM / 2]} />
    </Canvas>
  </div>;
}

export default function SceneComparisonSideBySide({ left, right }: { left: ArkiSnapshot; right: ArkiSnapshot }) {
  const comparison = compareSceneModels(left.scene, right.scene);
  const initialControls: ViewControls = { viewMode: "perspective", level: "all", heightFilterActive: false, heightFilter: 3 };
  const [leftControls, setLeftControls] = useState<ViewControls>(initialControls);
  const [rightControls, setRightControls] = useState<ViewControls>(initialControls);
  return <section className="scene-side-by-side"><header><strong>Comparación persistente</strong><span>{left.version} ↔ {right.version}</span><small>+{comparison.added.length} · ~{comparison.modified.length} · -{comparison.removed.length} · ={comparison.unchanged.length}</small></header><div className="scene-side-by-side-viewports"><div><label>{left.version} · {left.gateStatus.toUpperCase()}</label><SnapshotViewport nodes={left.scene.nodes} bounds={left.scene.bounds} controls={leftControls} onChange={setLeftControls} /></div><div><label>{right.version} · {right.gateStatus.toUpperCase()}</label><SnapshotViewport nodes={right.scene.nodes} bounds={right.scene.bounds} controls={rightControls} onChange={setRightControls} /></div></div></section>;
}
