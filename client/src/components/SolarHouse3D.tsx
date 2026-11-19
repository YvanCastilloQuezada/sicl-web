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

function SunLight({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const position = useMemo(
    () => sunToVector3(elevation, azimuth, 80),
    [elevation, azimuth],
  );

  return (
    <directionalLight
      position={position}
      intensity={2.5}
      color="#fff5e6"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-far={200}
      shadow-camera-left={-40}
      shadow-camera-right={40}
      shadow-camera-top={40}
      shadow-camera-bottom={-40}
    />
  );
}

function SunPathArc({ sunPath }: { sunPath: SunPathSample[] }) {
  const points = useMemo(
    () => sunPath.map((p) => sunToVector3(p.elevation, p.azimuth)),
    [sunPath],
  );

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
      {/* Arco de trayectoria solar */}
      <Line
        points={points}
        color="#f59e0b"
        lineWidth={2}
        transparent
        opacity={0.55}
      />
      {/* Marcadores horarios (cada 2h) */}
      {hourMarkers.map((m, i) => (
        <mesh key={i} position={m.pos}>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  );
}

function SunSphere({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const pos = useMemo(() => sunToVector3(elevation, azimuth), [elevation, azimuth]);
  const visible = elevation > -3;
  if (!visible) return null;
  return (
    <mesh position={pos}>
      <sphereGeometry args={[2.2, 24, 24]} />
      <meshStandardMaterial
        color="#fde047"
        emissive="#fbbf24"
        emissiveIntensity={2.2}
      />
    </mesh>
  );
}

function SunBeam({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const from = useMemo(() => sunToVector3(elevation, azimuth), [elevation, azimuth]);
  if (elevation <= 0) return null;
  return (
    <Line
      points={[from, [0, 1.5, 0]]}
      color="#fde047"
      lineWidth={1.5}
      dashed
      dashSize={1.5}
      gapSize={1}
      transparent
      opacity={0.7}
    />
  );
}

function House({ rotation, roofTransparent }: { rotation: number; roofTransparent: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (rotation * Math.PI) / 180;
    }
  });

  const W = 6;
  const L = 12;
  const H = 3;
  const wallThick = 0.15;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Piso */}
      <mesh receiveShadow position={[0, 0.01, 0]}>
        <boxGeometry args={[W + 0.4, 0.1, L + 0.4]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Pared norte (largo, 2 ventanas) */}
      <mesh castShadow receiveShadow position={[0, H / 2, -L / 2]}>
        <boxGeometry args={[W, H, wallThick]} />
        <meshStandardMaterial color="#E8DCC4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-W / 4, H / 2, -L / 2 - 0.01]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[W / 4, H / 2, -L / 2 - 0.01]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Pared sur (largo, 2 ventanas) */}
      <mesh castShadow receiveShadow position={[0, H / 2, L / 2]}>
        <boxGeometry args={[W, H, wallThick]} />
        <meshStandardMaterial color="#E8DCC4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-W / 4, H / 2, L / 2 + 0.01]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[W / 4, H / 2, L / 2 + 0.01]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Pared este (corto, 1 ventana) */}
      <mesh castShadow receiveShadow position={[W / 2, H / 2, 0]}>
        <boxGeometry args={[wallThick, H, L]} />
        <meshStandardMaterial color="#E8DCC4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[W / 2 + 0.01, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Pared oeste (corto, 1 ventana) */}
      <mesh castShadow receiveShadow position={[-W / 2, H / 2, 0]}>
        <boxGeometry args={[wallThick, H, L]} />
        <meshStandardMaterial color="#E8DCC4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-W / 2 - 0.01, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Puerta frontal (pared sur) */}
      <mesh position={[0, 1, L / 2 + 0.02]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Techo (toggle) */}
      <mesh castShadow receiveShadow position={[0, H + 0.1, 0]}>
        <boxGeometry args={[W + 0.6, 0.15, L + 0.6]} />
        <meshStandardMaterial
          color="#A0522D"
          transparent={roofTransparent}
          opacity={roofTransparent ? 0.15 : 1}
        />
      </mesh>

      {/* Mobiliario */}
      <mesh castShadow receiveShadow position={[0, 0.75, -2]}>
        <boxGeometry args={[2, 0.08, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.8, 0.375, -2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.75]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.8, 0.375, -2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.75]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.4, 3]}>
        <boxGeometry args={[2, 0.3, 1.5]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
    </group>
  );
}

export default function SolarHouse3D({ elevation, azimuth, houseRotation, sunPath }: SolarHouse3DProps) {
  const [roofTransparent, setRoofTransparent] = useState(true);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        camera={{ position: [28, 18, 28], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <SunLight elevation={elevation} azimuth={azimuth} />
        <SunPathArc sunPath={sunPath} />
        <SunSphere elevation={elevation} azimuth={azimuth} />
        <SunBeam elevation={elevation} azimuth={azimuth} />
        <House rotation={houseRotation} roofTransparent={roofTransparent} />
        {/* Terreno receptor de sombra */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[300, 300]} />
          <meshStandardMaterial color="#141b2d" />
        </mesh>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={15}
          maxDistance={120}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.05}
        />
        <Environment preset="city" />
      </Canvas>
      <button
        onClick={() => setRoofTransparent(!roofTransparent)}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: roofTransparent ? "#fbbf24" : "#475569",
          color: roofTransparent ? "#1e293b" : "#e2e8f0",
          border: "none",
          borderRadius: 6,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {roofTransparent ? "🏠 Techo Transparente" : "🏠 Techo Opaco"}
      </button>
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          background: "rgba(15,23,42,0.75)",
          color: "#fbbf24",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 11,
          zIndex: 10,
        }}
      >
        ◠ Trayectoria solar del día (fija al norte geográfico)
      </div>
    </div>
  );
}
