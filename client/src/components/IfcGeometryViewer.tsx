import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { IfcGeometryLoadResult, IfcRenderableElement } from "@/lib/ifcGeometryAdapter";

function IfcMesh({ element, onSelect }: { element: IfcRenderableElement; onSelect: (element: IfcRenderableElement) => void }) {
  const geometry = useMemo(() => { const value = new THREE.BufferGeometry(); value.setAttribute("position", new THREE.BufferAttribute(element.positions, 3)); value.setIndex(new THREE.BufferAttribute(element.indices, 1)); value.computeVertexNormals(); return value; }, [element]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const color = element.sourceRepresentation === "BREP" ? "#f59e0b" : element.sourceRepresentation === "CSG" ? "#a78bfa" : element.sourceRepresentation === "MESH" ? "#38bdf8" : "#94a3b8";
  return <mesh geometry={geometry} onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(element); }}><meshStandardMaterial color={color} roughness={0.72} metalness={0.05} side={THREE.DoubleSide} /></mesh>;
}
function Camera({ result }: { result: IfcGeometryLoadResult }) {
  const { camera, gl } = useThree(); const controlsRef = useRef<OrbitControls | null>(null);
  useEffect(() => { const controls = new OrbitControls(camera, gl.domElement); controls.enableDamping = true; controls.dampingFactor = 0.08; controlsRef.current = controls; const points = result.elements.flatMap((element) => Array.from({ length: element.positions.length / 3 }, (_, index) => [element.positions[index * 3], element.positions[index * 3 + 1], element.positions[index * 3 + 2]] as [number, number, number])); const max = Math.max(...points.flatMap((point) => point.map((value) => Math.abs(value))), 1); camera.position.set(max * 1.4, max * 1.2, max * 1.4); controls.target.set(0, 0, 0); controls.update(); return () => { controls.dispose(); controlsRef.current = null; }; }, [camera, gl, result]);
  return null;
}
export default function IfcGeometryViewer({ result, onSelect }: { result: IfcGeometryLoadResult; onSelect?: (element: IfcRenderableElement) => void }) {
  return <div className="relative h-[520px] overflow-hidden rounded-xl border border-border bg-slate-950" data-testid="ifc-geometry-viewer"><Canvas camera={{ position: [20, 16, 20], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}><Camera result={result} /><ambientLight intensity={1.4} /><directionalLight position={[20, 30, 20]} intensity={1.8} />{result.elements.map((element, index) => <IfcMesh key={`${element.expressID}-${index}`} element={element} onSelect={(selected) => onSelect?.(selected)} />)}</Canvas><div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/20 bg-slate-950/80 px-3 py-2 text-xs text-white">IFC4 · {result.elements.length} geometrías · {result.sourceKinds.join(" / ") || "sin clasificación"}</div></div>;
}
