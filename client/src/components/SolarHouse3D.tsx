import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

interface SolarHouse3DProps {
  elevation: number;
  azimuth: number;
  houseRotation: number;
}

function SunLight({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const position = useMemo(() => {
    const elevRad = (elevation * Math.PI) / 180;
    const azRad = (azimuth * Math.PI) / 180;
    const distance = 80;
    const x = distance * Math.cos(elevRad) * Math.sin(azRad);
    const y = distance * Math.sin(elevRad);
    const z = -distance * Math.cos(elevRad) * Math.cos(azRad);
    return [x, y, z] as [number, number, number];
  }, [elevation, azimuth]);

  return (
    <directionalLight
      position={position}
      intensity={2.5}
      color="#fff5e6"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-far={150}
      shadow-camera-left={-30}
      shadow-camera-right={30}
      shadow-camera-top={30}
      shadow-camera-bottom={-30}
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

  // Casa rectangular 1:2 (ancho=6, largo=12, alto=3)
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

      {/* Pared norte (largo, con 2 ventanas) */}
      <mesh castShadow receiveShadow position={[0, H / 2, -L / 2]}>
        <boxGeometry args={[W, H, wallThick]} />
        <meshStandardMaterial color="#E8DCC4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Ventanas pared norte */}
      <mesh position={[-W / 4, H / 2, -L / 2 - 0.01]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[W / 4, H / 2, -L / 2 - 0.01]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Pared sur (largo, con 2 ventanas) */}
      <mesh castShadow receiveShadow position={[0, H / 2, L / 2]}>
        <boxGeometry args={[W, H, wallThick]} />
        <meshStandardMaterial color="#E8DCC4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Ventanas pared sur */}
      <mesh position={[-W / 4, H / 2, L / 2 + 0.01]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[W / 4, H / 2, L / 2 + 0.01]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Pared este (corto, con 1 ventana) */}
      <mesh castShadow receiveShadow position={[W / 2, H / 2, 0]}>
        <boxGeometry args={[wallThick, H, L]} />
        <meshStandardMaterial color="#E8DCC4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Ventana pared este */}
      <mesh position={[W / 2 + 0.01, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Pared oeste (corto, con 1 ventana) */}
      <mesh castShadow receiveShadow position={[-W / 2, H / 2, 0]}>
        <boxGeometry args={[wallThick, H, L]} />
        <meshStandardMaterial color="#E8DCC4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Ventana pared oeste */}
      <mesh position={[-W / 2 - 0.01, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Puerta frontal (en pared sur, centro) */}
      <mesh position={[0, 1, L / 2 + 0.02]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Techo (toggle transparente) */}
      <mesh castShadow receiveShadow position={[0, H + 0.1, 0]}>
        <boxGeometry args={[W + 0.6, 0.15, L + 0.6]} />
        <meshStandardMaterial
          color="#A0522D"
          transparent={roofTransparent}
          opacity={roofTransparent ? 0.15 : 1}
        />
      </mesh>

      {/* Mobiliario básico: mesa */}
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

      {/* Cama */}
      <mesh castShadow receiveShadow position={[0, 0.4, 3]}>
        <boxGeometry args={[2, 0.3, 1.5]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
    </group>
  );
}

export default function SolarHouse3D({ elevation, azimuth, houseRotation }: SolarHouse3DProps) {
  const [roofTransparent, setRoofTransparent] = useState(true);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <SunLight elevation={elevation} azimuth={azimuth} />
        <House rotation={houseRotation} roofTransparent={roofTransparent} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={15}
          maxDistance={60}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
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
    </div>
  );
}
