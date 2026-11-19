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
  const position = useMemo(() => sunToVector3(elevation, azimuth, 80), [elevation, azimuth]);
  return (
    <directionalLight
      position={position}
      intensity={3.2}
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
      <Line points={points} color="#f59e0b" lineWidth={2} transparent opacity={0.55} />
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
  if (elevation <= -3) return null;
  return (
    <mesh position={pos}>
      <sphereGeometry args={[2.2, 24, 24]} />
      <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={2.2} />
    </mesh>
  );
}

function SunBeam({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const from = useMemo(() => sunToVector3(elevation, azimuth), [elevation, azimuth]);
  if (elevation <= 0) return null;
  return (
    <Line points={[from, [0, 0.5, 0]]} color="#fde047" lineWidth={1.5} dashed dashSize={1.5} gapSize={1} transparent opacity={0.7} />
  );
}

// ---- Geometría de pared con huecos REALES (Shape + ExtrudeGeometry) ----
interface Opening {
  x: number; // centro horizontal local
  y: number; // centro vertical local (desde piso)
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
      {/* Pared sólida con huecos: LANZA sombra (la luz solo pasa por el hueco) */}
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Vidrios en cada hueco: NO lanzan sombra (la luz los atraviesa) */}
      {openings.map((o, i) => (
        <mesh key={i} position={[o.x, o.y, 0]}>
          <planeGeometry args={[o.w, o.h]} />
          <meshStandardMaterial
            color={o.kind === "door" ? "#c9a06a" : "#9ec5e8"}
            transparent
            opacity={o.kind === "door" ? 0.35 : 0.22}
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

  const W = 6;   // ancho (eje X) -> fachadas norte/sur
  const L = 12;  // largo (eje Z) -> laterales este/oeste
  const H = 3;
  const T = 0.15;

  // Fachadas (6 m): 1 ventana. Sur añade puerta.
  const northOpenings: Opening[] = [{ x: 0, y: 1.7, w: 2.0, h: 1.4, kind: "window" }];
  const southOpenings: Opening[] = [
    { x: -1.6, y: 1.7, w: 1.6, h: 1.3, kind: "window" },
    { x: 1.5, y: 1.1, w: 1.3, h: 2.2, kind: "door" },
  ];
  // Laterales (12 m): 2 ventanas.
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
      {/* Piso interior CLARO para ver el parche de luz */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[W + 0.3, 0.05, L + 0.3]} />
        <meshStandardMaterial color="#d8c9a6" />
      </mesh>

      {/* Fachada norte (6 m, 1 ventana) */}
      <Wall width={W} height={H} thickness={T} openings={northOpenings} position={[0, 0, -L / 2]} rotationY={0} color="#e8dcc4" />
      {/* Fachada sur (6 m, 1 ventana + puerta) */}
      <Wall width={W} height={H} thickness={T} openings={southOpenings} position={[0, 0, L / 2]} rotationY={0} color="#e8dcc4" />
      {/* Lateral este (12 m, 2 ventanas) */}
      <Wall width={L} height={H} thickness={T} openings={eastOpenings} position={[W / 2, 0, 0]} rotationY={Math.PI / 2} color="#e8dcc4" />
      {/* Lateral oeste (12 m, 2 ventanas) */}
      <Wall width={L} height={H} thickness={T} openings={westOpenings} position={[-W / 2, 0, 0]} rotationY={Math.PI / 2} color="#e8dcc4" />

      {/* Techo (toggle transparente) */}
      <mesh castShadow receiveShadow position={[0, H + 0.1, 0]}>
        <boxGeometry args={[W + 0.6, 0.15, L + 0.6]} />
        <meshStandardMaterial color="#a0522d" transparent={roofTransparent} opacity={roofTransparent ? 0.12 : 1} />
      </mesh>

      {/* Mobiliario */}
      <mesh castShadow receiveShadow position={[0, 0.75, -2]}>
        <boxGeometry args={[2, 0.08, 1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.4, 3]}>
        <boxGeometry args={[2, 0.3, 1.5]} />
        <meshStandardMaterial color="#4682b4" />
      </mesh>
    </group>
  );
}

export default function SolarHouse3D({ elevation, azimuth, houseRotation, sunPath }: SolarHouse3DProps) {
  const [roofTransparent, setRoofTransparent] = useState(true);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas shadows camera={{ position: [26, 16, 26], fov: 45 }} style={{ width: "100%", height: "100%" }}>
        {/* Ambient bajo para maximizar contraste luz/sombra */}
        <ambientLight intensity={0.25} />
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
          background: "rgba(15,23,42,0.75)", color: "#fbbf24",
          borderRadius: 6, padding: "4px 10px", fontSize: 11, zIndex: 10,
        }}
      >
        ◠ Trayectoria solar (fija al norte) · La luz entra por ventanas y puerta
      </div>
    </div>
  );
}
