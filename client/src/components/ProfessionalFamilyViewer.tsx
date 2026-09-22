import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { GeneratedBuilding } from "@shared/arkiDynamicFamilies";

type ViewMode = "PLAN" | "SECTION" | "MODEL_3D";
type Quality = "baja" | "media" | "alta" | "ultra";
type Resolution = "hd" | "fullhd" | "2k" | "4k" | "8k" | "16k";

const RESOLUTIONS: Record<Resolution, { width: number; height: number; label: string }> = { hd: { width: 1280, height: 720, label: "HD 720p" }, fullhd: { width: 1920, height: 1080, label: "Full HD" }, "2k": { width: 2560, height: 1440, label: "2K QHD" }, "4k": { width: 3840, height: 2160, label: "4K UHD" }, "8k": { width: 7680, height: 4320, label: "8K UHD" }, "16k": { width: 15360, height: 8640, label: "16K" } };

export default function ProfessionalFamilyViewer({ building, mode = "MODEL_3D", quality = "alta", resolution = "2k" }: { building?: GeneratedBuilding | null; mode?: ViewMode; quality?: Quality; resolution?: Resolution }) {
  const dpr = quality === "ultra" ? 2 : quality === "alta" ? 1.5 : quality === "media" ? 1.2 : 1;
  return <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded bg-[#090e14]"><Canvas shadows dpr={dpr} camera={{ position: [180, 150, 220], fov: 42, near: 0.1, far: 20000 }} gl={{ antialias: true, logarithmicDepthBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1, preserveDrawingBuffer: true }}><ProfessionalScene building={building} mode={mode} quality={quality} /></Canvas><div className="pointer-events-none absolute bottom-2 left-2 rounded border border-white/10 bg-black/40 px-2 py-1 text-[10px] text-[#b7c8d9]">{RESOLUTIONS[resolution].label} · PBR · sombras suaves · {quality}</div></div>;
}

function ProfessionalScene({ building, mode, quality }: { building?: GeneratedBuilding | null; mode: ViewMode; quality: Quality }) {
  const { camera } = useThree();
  const dims = building?.geometry3d ?? { floors: 1, heightM: 12, massing: "COURTYARD_MASS" };
  const plan = building?.geometry2d ?? { widthM: 80, depthM: 50, footprintM2: 4000, courtyardM2: 0 };
  const box = useMemo(() => ({ width: Math.max(8, plan.widthM / 5), depth: Math.max(8, plan.depthM / 5), height: Math.max(4, dims.heightM / 5) }), [dims.heightM, plan.depthM, plan.widthM]);
  useEffect(() => { if (mode === "PLAN") { camera.position.set(0, 260, 0.01); camera.lookAt(0, 0, 0); } else if (mode === "SECTION") { camera.position.set(180, 90, 0); camera.lookAt(0, box.height / 2, 0); } else { camera.position.set(180, 140, 220); camera.lookAt(0, box.height / 2, 0); } }, [box.height, camera, mode]);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(mode === "PLAN" ? "#f0a35b" : "#6ea8ff"), roughness: quality === "ultra" ? 0.38 : 0.55, metalness: 0.15, transparent: true, opacity: 0.9 }), [mode, quality]);
  return <><color attach="background" args={["#090e14"]} /><hemisphereLight args={["#cfe8ff", "#25251f", 0.7]} /><directionalLight castShadow position={[300, 500, 200]} intensity={2.2} shadow-mapSize-width={quality === "ultra" ? 4096 : 2048} shadow-mapSize-height={quality === "ultra" ? 4096 : 2048} /><directionalLight position={[-200, 300, -300]} color="#8ab4f8" intensity={0.45} /><gridHelper args={[Math.max(box.width, box.depth) * 8, 48, "#2a2a35", "#151c25"]} position={[0, -0.05, 0]} /><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow><planeGeometry args={[Math.max(box.width, box.depth) * 10, Math.max(box.width, box.depth) * 10]} /><meshStandardMaterial color="#161b22" roughness={0.95} /></mesh>{mode === "PLAN" ? <PlanMass box={box} material={material} courtyard={plan.courtyardM2 ?? 0} /> : <BuildingMass box={box} material={material} floors={dims.floors} section={mode === "SECTION"} />}{mode !== "PLAN" && <NativeOrbitControls />}</>;
}
function NativeOrbitControls() { const { camera, gl } = useThree(); const ref = useRef<OrbitControls | null>(null); useEffect(() => { const controls = new OrbitControls(camera, gl.domElement); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 20; controls.maxDistance = 5000; controls.maxPolarAngle = Math.PI / 2.05; controls.screenSpacePanning = true; ref.current = controls; return () => { controls.dispose(); ref.current = null; }; }, [camera, gl]); return null; }
function BuildingMass({ box, material, floors, section }: { box: { width: number; depth: number; height: number }; material: THREE.Material; floors: number; section: boolean }) { return <group>{Array.from({ length: Math.max(1, Math.min(floors, 20)) }, (_, index) => <mesh key={index} castShadow receiveShadow position={[0, (index + 0.5) * (box.height / Math.max(floors, 1)), 0]} material={material}><boxGeometry args={[box.width, box.height / Math.max(floors, 1) * 0.92, box.depth]} /><Edges /></mesh>)}{section && <mesh position={[0, box.height / 2, box.depth / 2 + 0.02]}><planeGeometry args={[box.width, box.height]} /><meshBasicMaterial color="#f0a35b" wireframe transparent opacity={0.6} /></mesh>}</group>; }
function PlanMass({ box, material, courtyard }: { box: { width: number; depth: number; height: number }; material: THREE.Material; courtyard: number }) { return <group rotation={[-Math.PI / 2, 0, 0]}><mesh castShadow receiveShadow material={material}><planeGeometry args={[box.width, box.depth]} /><Edges /></mesh>{courtyard > 0 && <mesh position={[0, 0, 0.02]}><planeGeometry args={[box.width * 0.28, box.depth * 0.28]} /><meshBasicMaterial color="#39b86a" wireframe transparent opacity={0.85} /></mesh>}</group>; }
function Edges() { return <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} /><lineBasicMaterial color="#ffffff" transparent opacity={0.12} /></lineSegments>; }

export { RESOLUTIONS };
export type { ViewMode, Quality, Resolution };
