import React, { Component, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Metrics, SpatialElement, SpatialRepresentation } from "./UPAO001SpatialViewer";

type Point2 = [number, number];
type Point3 = [number, number, number];

export type DerivedMass = {
  element: SpatialElement;
  ring: Point2[];
  base: number;
  height: number;
  floorCount: number | null;
};

type Bounds = { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };

type ViewerProps = { representation: SpatialRepresentation; metrics?: Metrics; language?: string };

/** LOCAL_ENU (x=east, y=north, z=up) → Three renderer (x=east, y=up, z=-north). */
export function spatialToRenderer(point: Point3): Point3 {
  return [point[0], point[2], -point[1]];
}

function numeric(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function point2(value: unknown): value is Point2 {
  return Array.isArray(value) && numeric(value[0]) && numeric(value[1]);
}

function point3(value: unknown): value is Point3 {
  return Array.isArray(value) && numeric(value[0]) && numeric(value[1]) && numeric(value[2]);
}

function polygonRing(element: SpatialElement): Point2[] {
  const coordinates = element.geometry.coordinates;
  if (element.geometry.type === "polygon" && Array.isArray(coordinates) && Array.isArray(coordinates[0])) {
    return coordinates[0].filter(point2);
  }
  if (element.geometry.type === "multipolygon" && Array.isArray(coordinates) && Array.isArray(coordinates[0])) {
    const first = coordinates[0];
    return Array.isArray(first?.[0]) ? first[0].filter(point2) : [];
  }
  return [];
}

function massRing(element: SpatialElement): Point2[] {
  if (element.geometry.type === "volume" && Array.isArray(element.geometry.coordinates)) {
    const vertices = element.geometry.coordinates.filter(point3);
    const half = Math.floor(vertices.length / 2);
    return vertices.slice(0, half).map(([x, y]) => [x, y]);
  }
  return polygonRing(element);
}

export function deriveMasses(representation: SpatialRepresentation): DerivedMass[] {
  return representation.elements.flatMap((element) => {
    if (element.element_type !== "BuildingMass") return [];
    const ring = massRing(element);
    const height = Number(element.metadata?.height);
    const base = Number(element.metadata?.base_elevation ?? 0);
    if (ring.length < 3 || !Number.isFinite(height) || height <= 0 || !Number.isFinite(base)) return [];
    const floorValue = Number(element.metadata?.floor_count);
    return [{ element, ring, base, height, floorCount: Number.isFinite(floorValue) ? floorValue : null }];
  });
}

function ringFromElement(element: SpatialElement): Point2[] {
  return element.element_type === "BuildingMass" ? massRing(element) : polygonRing(element);
}

function allPoints(representation: SpatialRepresentation): Point3[] {
  return representation.elements.flatMap((element) => ringFromElement(element).map(([x, y]) => [x, y, Number(element.metadata?.base_elevation ?? 0)] as Point3));
}

function boundsFor(representation: SpatialRepresentation): Bounds {
  const points = allPoints(representation);
  const xs = points.map(([x]) => x); const ys = points.map(([, y]) => y); const zs = points.map(([, , z]) => z);
  const masses = deriveMasses(representation);
  const maxHeight = masses.reduce((max, mass) => Math.max(max, mass.base + mass.height), 0);
  return {
    minX: Math.min(...xs, 0), maxX: Math.max(...xs, 1), minY: Math.min(...ys, 0), maxY: Math.max(...ys, 1),
    minZ: Math.min(...zs, 0), maxZ: Math.max(maxHeight, 1),
  };
}

function shapeFor(ring: Point2[]): THREE.Shape {
  const shape = new THREE.Shape();
  ring.forEach(([x, y], index) => index === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y));
  shape.closePath();
  return shape;
}

function RenderableShape({ ring, color, opacity, y = 0, selected = false, onClick, spatialId }: { ring: Point2[]; color: string; opacity: number; y?: number; selected?: boolean; onClick?: () => void; spatialId: string }) {
  const geometry = useMemo(() => new THREE.ShapeGeometry(shapeFor(ring)), [ring]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} userData={{ spatialId }} onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onClick?.(); }}>
    <meshBasicMaterial color={selected ? "#facc15" : color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
  </mesh>;
}

function MassMesh({ mass, selected, onSelect }: { mass: DerivedMass; selected: boolean; onSelect: () => void }) {
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(shapeFor(mass.ring), { depth: mass.height, bevelEnabled: false }), [mass.ring, mass.height]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, mass.base, 0]} userData={{ spatialId: mass.element.id, elementType: mass.element.element_type, height: mass.height, floorCount: mass.floorCount }} onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(); }}>
    <meshStandardMaterial color={selected ? "#facc15" : "#f97316"} transparent opacity={selected ? 1 : 0.78} roughness={0.8} metalness={0} />
  </mesh>;
}

function CameraController({ bounds, controlsRef }: { bounds: Bounds; controlsRef: React.MutableRefObject<OrbitControls | null> }) {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = true; controls.minDistance = 8; controls.maxDistance = 160;
    controlsRef.current = controls;
    const centerX = (bounds.minX + bounds.maxX) / 2; const centerY = (bounds.minY + bounds.maxY) / 2; const centerZ = (bounds.minZ + bounds.maxZ) / 2;
    const span = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, bounds.maxZ - bounds.minZ, 1);
    camera.position.set(centerX + span * 0.95, centerZ + span * 2.5, -centerY - span * 0.95);
    controls.target.set(centerX, centerZ, -centerY); controls.saveState(); controls.update();
    return () => { controls.dispose(); controlsRef.current = null; };
  }, [bounds, camera, gl, controlsRef]);
  return null;
}

function Scene({ representation, selectedId, onSelect, controlsRef }: { representation: SpatialRepresentation; selectedId: string | null; onSelect: (mass: DerivedMass) => void; controlsRef: React.MutableRefObject<OrbitControls | null> }) {
  const bounds = useMemo(() => boundsFor(representation), [representation]);
  const masses = useMemo(() => deriveMasses(representation), [representation]);
  const site = representation.elements.find((element) => element.element_type === "SiteBoundary");
  const zones = representation.elements.filter((element) => element.element_type === "SpatialZone");
  const centerX = (bounds.minX + bounds.maxX) / 2; const centerY = (bounds.minY + bounds.maxY) / 2;
  const northRadians = (representation.north_degrees * Math.PI) / 180;
  const northOrigin: [number, number, number] = [centerX, bounds.maxZ + 0.05, -centerY];
  const northDirection = new THREE.Vector3(Math.sin(northRadians), 0, -Math.cos(northRadians));
  return <>
    <CameraController bounds={bounds} controlsRef={controlsRef} />
    <ambientLight intensity={1.8} />
    <directionalLight position={[20, 40, 20]} intensity={1.2} />
    <group position={[-centerX, 0, centerY]}>
      {site && <RenderableShape ring={ringFromElement(site)} color="#dbeafe" opacity={0.7} y={-0.03} spatialId={site.id} />}
      {zones.map((zone) => <RenderableShape key={zone.id} ring={ringFromElement(zone)} color="#22c55e" opacity={0.18} y={0.03} spatialId={zone.id} />)}
      {masses.map((mass) => <MassMesh key={mass.element.id} mass={mass} selected={selectedId === mass.element.id} onSelect={() => onSelect(mass)} />)}
      <gridHelper args={[Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 1.5, 20, "#cbd5e1", "#e2e8f0"]} position={[0, -0.06, 0]} rotation={[0, 0, 0]} />
      <arrowHelper args={[northDirection, new THREE.Vector3(northOrigin[0] - centerX, northOrigin[1], northOrigin[2] + centerY), 8, "#2563eb"]} />
    </group>
  </>;
}

/** WebXR scene adapter: reuses the same derived masses and element IDs as the desktop 3D viewer. */
export function RealityScene({ representation, scaleFactor = 1, rotationY = 0 }: { representation: SpatialRepresentation; scaleFactor?: number; rotationY?: number }) {
  const bounds = useMemo(() => boundsFor(representation), [representation]);
  const masses = useMemo(() => deriveMasses(representation), [representation]);
  const site = representation.elements.find((element) => element.element_type === "SiteBoundary");
  const zones = representation.elements.filter((element) => element.element_type === "SpatialZone");
  const centerX = (bounds.minX + bounds.maxX) / 2; const centerY = (bounds.minY + bounds.maxY) / 2;
  return <>
    <ambientLight intensity={1.8} />
    <directionalLight position={[20, 40, 20]} intensity={1.2} />
    <group position={[-centerX, 0, centerY]} scale={[scaleFactor, scaleFactor, scaleFactor]} rotation={[0, rotationY, 0]}>
      {site && <RenderableShape ring={ringFromElement(site)} color="#dbeafe" opacity={0.35} y={-0.03} spatialId={site.id} />}
      {zones.map((zone) => <RenderableShape key={zone.id} ring={ringFromElement(zone)} color="#22c55e" opacity={0.12} y={0.03} spatialId={zone.id} />)}
      {masses.map((mass) => <MassMesh key={mass.element.id} mass={mass} selected={false} onSelect={() => undefined} />)}
    </group>
  </>;
}

class Viewer3DErrorBoundary extends Component<{ fallback: React.ReactNode; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function UPAO001MassingViewer3D({ representation, metrics }: ViewerProps) {
  const controlsRef = useRef<OrbitControls | null>(null);
  const [selected, setSelected] = useState<DerivedMass | null>(null);
  const masses = useMemo(() => deriveMasses(representation), [representation]);
  const bounds = useMemo(() => boundsFor(representation), [representation]);
  const resetCamera = () => controlsRef.current?.reset();
  const fallback = <div role="alert" className="rounded-md border border-amber-300 bg-amber-50 p-6 text-amber-950"><h2 className="font-semibold">3D visualization unavailable.</h2><p className="mt-2 text-sm">Use the 2D spatial view and textual metrics.</p></div>;
  return <section className="space-y-4" aria-label="Analytical 3D massing viewer">
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">MODEL PROJECT / EDUCATIONAL EXAMPLE</p><p className="mt-1 text-sm text-muted-foreground">Synthetic analytical geometry · LOCAL_ENU · m</p><p className="mt-1 text-xs text-muted-foreground">Alternative: {representation.alternative_id} · {representation.generator_version} · {representation.representation_version}</p></div>
    <div className="relative h-[520px] overflow-hidden rounded-md border border-border bg-slate-50" style={{ height: 520 }} data-testid="massing-3d-viewer">
      <Viewer3DErrorBoundary fallback={fallback}><Canvas camera={{ position: [55, 38, -55], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true }} onCreated={({ gl }) => { gl.setClearColor("#f8fafc"); }}>
        <Scene representation={representation} selectedId={selected?.element.id ?? null} onSelect={setSelected} controlsRef={controlsRef} />
      </Canvas></Viewer3DErrorBoundary><button type="button" onClick={resetCamera} className="absolute right-3 top-3 rounded-md border border-slate-400 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm">Reset camera</button>
    </div>
    <div className="grid gap-4 md:grid-cols-[1fr_280px]">
      <div className="rounded-md border border-border bg-card p-4 text-card-foreground"><h3 className="font-semibold">3D navigation</h3><p className="mt-1 text-sm text-muted-foreground">Orbit: drag · Pan: right-drag · Zoom: wheel · Reset: button</p><p className="mt-2 text-xs text-muted-foreground">Derived from the same SpatialRepresentation as the 2D view. No geometry is persisted.</p></div>
      <div className="rounded-md border border-border bg-card p-4 text-card-foreground"><h3 className="font-semibold">Selected mass</h3>{selected ? <dl className="mt-2 space-y-1 text-sm"><div><dt className="inline font-medium">ID: </dt><dd className="inline break-all">{selected.element.id}</dd></div><div><dt className="inline font-medium">Height: </dt><dd className="inline">{selected.height.toFixed(1)} m</dd></div><div><dt className="inline font-medium">Floors: </dt><dd className="inline">{selected.floorCount ?? "—"}</dd></div></dl> : <p className="mt-2 text-sm text-muted-foreground">Select a BuildingMass to inspect its spatial ID and height.</p>}</div>
    </div>
    {masses.length === 0 && <p role="status" className="text-sm text-amber-700">No valid BuildingMass elements are available for 3D derivation.</p>}
    {metrics && <p className="text-xs text-muted-foreground">Metrics preserved: site {metrics.site_area?.toFixed(1) ?? "—"} m² · footprint {metrics.footprint_area?.toFixed(1) ?? "—"} m² · height {metrics.height?.toFixed(1) ?? "—"} m</p>}
  </section>;
}
