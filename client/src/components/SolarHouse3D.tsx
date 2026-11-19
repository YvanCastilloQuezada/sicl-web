import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Line } from "@react-three/drei";
import * as THREE from "three";

export interface SunPathSample {
  elevation: number;
  azimuth: number;
  hour: number;
}

interface SolarHouse3DProps {
  elevation: number;
  azimuth: number;
  houseRotation: number;
  sunPath: SunPathSample[];
}

const SUN_RADIUS = 70;

export function sunToVector3(
  elevation: number,
  azimuth: number,
  R: number = SUN_RADIUS,
): [number, number, number] {
  const elevRad = (elevation * Math.PI) / 180;
  const azRad = (azimuth * Math.PI) / 180;
  const x = R * Math.cos(elevRad) * Math.sin(azRad);
  const y = R * Math.sin(elevRad);
  const z = -R * Math.cos(elevRad) * Math.cos(azRad);
  return [x, y, z];
}

// Luz solar BLANCA pura e intensa: sobre piso azul noche genera parches
// de luz casi blancos (contraste tipo heliodon fisico).
function SunLight({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const position = useMemo(() => sunToVector3(elevation, azimuth, 80), [elevation, azimuth]);
  const intensity = elevation > 0 ? 4.5 : 0.15;
  return (
    <directionalLight
      position={position}
      intensity={intensity}
      color="#ffffff"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-far={200}
      shadow-camera-left={-40}
      shadow-camera-right={40}
      shadow-camera-top={40}
      shadow-camera-bottom={-40}
      shadow-bias={-0.0002}
    />
  );
}

function SunPathArc({ sunPath }: { sunPath: SunPathSample[] }) {
  const points = useMemo(() => sunPath.map((p) => sunToVector3(p.elevation, p.azimuth)), [sunPath]);
  const hourMarkers = useMemo(
    () =>
      sunPath
        .filter((p) => p.hour % 2 === 0 && p.elevation > 0)
        .map((p) => ({ pos: sunToVector3(p.elevation, p.azimuth), hour: p.hour })),
    [sunPath],
  );
  if (points.length < 2) return null;
  return (
    <group>
      <Line points={points} color="#f59e0b" lineWidth={2} transparent opacity={0.45} />
      {hourMarkers.map((m, i) => (
        <mesh key={i} position={m.pos}>
          <sphereGeometry args={[0.6, 12, 12]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  );
}

function SunSphere({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const pos = useMemo(() => sunToVector3(elevation, azimuth), [elevation, azimuth]);
  if (elevation <= -3) return null;
  return (
    <mesh position={pos}>
      <sphereGeometry args={[2.4, 24, 24]} />
      <meshStandardMaterial color="#ffffff" emissive="#fff3c4" emissiveIntensity={3} />
    </mesh>
  );
}

function SunBeam({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const from = useMemo(() => sunToVector3(elevation, azimuth), [elevation, azimuth]);
  if (elevation <= 0) return null;
  return (
    <Line
      points={[from, [0, 0.5, 0]]}
      color="#ffffff"
      lineWidth={1.5}
      dashed
      dashSize={1.5}
      gapSize={1}
      transparent
      opacity={0.85}
    />
  );
}

interface Opening {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "window" | "door";
}

function makeWallGeometry(width: number, height: number, thickness: number, openings: Opening[]) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(width / 2, height);
  shape.lineTo(-width / 2, height);
  shape.closePath();
  for (const o of openings) {
    const hole = new THREE.Path();
    hole.moveTo(o.x - o.w / 2, o.y - o.h / 2);
    hole.lineTo(o.x + o.w / 2, o.y - o.h / 2);
    hole.lineTo(o.x + o.w / 2, o.y + o.h / 2);
    hole.lineTo(o.x - o.w / 2, o.y + o.h / 2);
    hole.closePath();
    shape.holes.push(hole);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geo.translate(0, 0, -thickness / 2);
  geo.computeVertexNormals();
  return geo;
}

function Wall({
  width,
  height,
  thickness,
  openings,
  position,
  rotationY,
  color,
}: {
  width: number;
  height: number;
  thickness: number;
  openings: Opening[];
  position: [number, number, number];
  rotationY: number;
  color: string;
}) {
  const geo = useMemo(() => makeWallGeometry(width, height, thickness, openings), [width, height, thickness, openings]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </mesh>
      {openings.map((o, i) => (
        <mesh key={i} position={[o.x, o.y, 0]}>
          <planeGeometry args={[o.w, o.h]} />
          <meshStandardMaterial
            color={o.kind === "door" ? "#7a5230" : "#bfe3ff"}
            transparent
            opacity={o.kind === "door" ? 0.25 : 0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function House({ rotation, roofTransparent }: { rotation: number; roofTransparent: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y = (rotation * Math.PI) / 180;
  });

  const W = 6;
  const L = 12;
  const H = 3;
  const T = 0.15;

  const northOpenings: Opening[] = [{ x: 0, y: 1.7, w: 2.0, h: 1.4, kind: "window" }];
  const southOpenings: Opening[] = [
    { x: -1.6, y: 1.7, w: 1.6, h: 1.3, kind: "window" },
    { x: 1.5, y: 1.1, w: 1.3, h: 2.2, kind: "door" },
  ];
  const eastOpenings: Opening[] = [
    { x: -3, y: 1.7, w: 2.2, h: 1.4, kind: "window" },
    { x: 3, y: 1.7, w: 2.2, h: 1.4, kind: "window" },
  ];
  const westOpenings: Opening[] = [
    { x: -3, y: 1.7, w: 2.2, h: 1.4, kind: "window" },
    { x: 3, y: 1.7, w: 2.2, h: 1.4, kind: "window" },
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* PISO AZUL NOCHE: la luz blanca entra como parches brillantes */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[W + 0.3, 0.05, L + 0.3]} />
        <meshStandardMaterial color="#13243d" roughness={0.9} metalness={0} />
      </mesh>

      <Wall width={W} height={H} thickness={T} openings={northOpenings} position={[0, 0, -L / 2]} rotationY={0} color="#c9b892" />
      <Wall width={W} height={H} thickness={T} openings={southOpenings} position={[0, 0, L / 2]} rotationY={0} color="#c9b892" />
      <Wall width={L} height={H} thickness={T} openings={eastOpenings} position={[W / 2, 0, 0]} rotationY={Math.PI / 2} color="#c9b892" />
      <Wall width={L} height={H} thickness={T} openings={westOpenings} position={[-W / 2, 0, 0]} rotationY={Math.PI / 2} color="#c9b892" />

      <mesh castShadow receiveShadow position={[0, H + 0.1, 0]}>
        <boxGeometry args={[W + 0.6, 0.15, L + 0.6]} />
        <meshStandardMaterial color="#8a4a2b" transparent={roofTransparent} opacity={roofTransparent ? 0.12 : 1} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.75, -2]}>
        <boxGeometry args={[2, 0.08, 1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.4, 3]}>
        <boxGeometry args={[2, 0.3, 1.5]} />
        <meshStandardMaterial color="#3a6ea5" />
      </mesh>
    </group>
  );
}

export default function SolarHouse3D({ elevation, azimuth, houseRotation, sunPath }: SolarHouse3DProps) {
  const [roofTransparent, setRoofTransparent] = useState(true);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas shadows camera={{ position: [26, 16, 26], fov: 45 }} style={{ width: "100%", height: "100%" }}>
        {/* Ambient azulado MUY bajo: la noche se ve azul profunda, no negra */}
        <ambientLight intensity={0.15} color="#2a4a7a" />
        <hemisphereLight args={["#3b5a8a", "#0a1220", 0.25]} />
        <SunLight elevation={elevation} azimuth={azimuth} />
        <SunPathArc sunPath={sunPath} />
        <SunSphere elevation={elevation} azimuth={azimuth} />
        <SunBeam elevation={elevation} azimuth={azimuth} />
        <House rotation={houseRotation} roofTransparent={roofTransparent} />
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[300, 300]} />
          <meshStandardMaterial color="#0a1424" />
        </mesh>
        <OrbitControls enablePan enableZoom minDistance={15} maxDistance={120} minPolarAngle={0} maxPolarAngle={Math.PI / 2.05} />
        <Environment preset="city" />
      </Canvas>

      <button
        onClick={() => setRoofTransparent(!roofTransparent)}
        style={{
          position: "absolute", top: 8, right: 8,
          background: roofTransparent ? "#fbbf24" : "#475569",
          color: roofTransparent ? "#1e293b" : "#e2e8f0",
          border: "none", borderRadius: 6, padding: "6px 12px",
          fontSize: 12, fontWeight: 600, cursor: "pointer", zIndex: 10,
        }}
      >
        {roofTransparent ? "🏠 Techo Transparente" : "🏠 Techo Opaco"}
      </button>

      <div
        style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(10,18,36,0.85)", color: "#fbbf24",
          borderRadius: 6, padding: "4px 10px", fontSize: 11, zIndex: 10,
        }}
      >
        ◠ Trayectoria solar (fija al norte) · La luz blanca entra por ventanas y puerta
      </div>
    </div>
  );
}
