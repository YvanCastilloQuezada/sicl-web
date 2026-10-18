import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { ArkiSnapshot } from "@shared/persistence/arkiPersistence";
import type { SceneNode } from "@shared/arkiSceneModel";
import { compareSceneModels } from "@shared/arkiSceneComparison";

function SnapshotViewport({ nodes, bounds }: { nodes: SceneNode[]; bounds: { widthM: number; depthM: number; heightM: number } }) {
  return <Canvas gl={{ antialias: true }}><PerspectiveCamera makeDefault position={[Math.max(12, bounds.widthM * 1.35), Math.max(10, bounds.heightM * 1.15), Math.max(12, bounds.depthM * 1.35)]} fov={42} /><ambientLight intensity={1.1} /><directionalLight position={[10, 18, 8]} intensity={2.2} /><Grid args={[Math.max(40, bounds.widthM * 2), Math.max(40, bounds.depthM * 2)]} position={[bounds.widthM / 2, 0, bounds.depthM / 2]} cellSize={1} cellThickness={0.6} cellColor="#26334f" sectionSize={5} sectionColor="#42577c" />{nodes.map((node) => <mesh key={node.id} position={node.position} rotation={[0, node.rotationY, 0]}><boxGeometry args={node.dimensions} /><meshStandardMaterial color={node.color} transparent opacity={node.opacity} /></mesh>)}<OrbitControls target={[bounds.widthM / 2, bounds.heightM / 2, bounds.depthM / 2]} /></Canvas>;
}

export default function SceneComparisonSideBySide({ left, right }: { left: ArkiSnapshot; right: ArkiSnapshot }) {
  const comparison = compareSceneModels(left.scene, right.scene);
  return <section className="scene-side-by-side"><header><strong>Comparación persistente</strong><span>{left.version} ↔ {right.version}</span><small>+{comparison.added.length} · ~{comparison.modified.length} · -{comparison.removed.length} · ={comparison.unchanged.length}</small></header><div className="scene-side-by-side-viewports"><div><label>{left.version} · {left.gateStatus.toUpperCase()}</label><SnapshotViewport nodes={left.scene.nodes} bounds={left.scene.bounds} /></div><div><label>{right.version} · {right.gateStatus.toUpperCase()}</label><SnapshotViewport nodes={right.scene.nodes} bounds={right.scene.bounds} /></div></div></section>;
}
