import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

interface SolarHouse3DProps {
  elevation: number; // grados sobre horizonte
  azimuth: number; // grados desde norte, horario
  houseRotation: number; // grados de rotación de la casa (0 = norte alineado)
}

function SunLight({ elevation, azimuth }: { elevation: number; azimuth: number }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // Convertir elevación y azimut a posición de luz
  const position = useMemo(() => {
    const elevRad = (elevation * Math.PI) / 180;
    const azRad = (azimuth * Math.PI) / 180;
    
    // Distancia de la luz (lejos para sombras paralelas)
    const distance = 50;
    
    // Posición: x=este, y=arriba, z=sur
    const x = distance * Math.cos(elevRad) * Math.sin(azRad);
    const y = distance * Math.sin(elevRad);
    const z = -distance * Math.cos(elevRad) * Math.cos(azRad);
    
    return [x, y, z] as [number, number, number];
  }, [elevation, azimuth]);

  return (
    <directionalLight
      ref={lightRef}
      position={position}
      intensity={2}
      color="#fff5e6"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-far={100}
      shadow-camera-left={-20}
      shadow-camera-right={20}
      shadow-camera-top={20}
      shadow-camera-bottom={-20}
    />
  );
}

function House({ rotation }: { rotation: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (rotation * Math.PI) / 180;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Piso */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[10, 0.2, 10]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Paredes (semi-transparentes para ver interior) */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[10, 3, 10]} />
        <meshStandardMaterial 
          color="#E8DCC4" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Techo */}
      <mesh castShadow position={[0, 3.1, 0]}>
        <boxGeometry args={[10.5, 0.2, 10.5]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Ventana frontal (fachada sur) */}
      <mesh position={[0, 1.5, 5.01]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Puerta frontal */}
      <mesh position={[-2, 1, 5.01]}>
        <planeGeometry args={[1.5, 2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Mobiliario básico (mesa) */}
      <mesh castShadow receiveShadow position={[2, 0.6, 0]}>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh castShadow receiveShadow position={[2, 0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  );
}

export default function SolarHouse3D({ elevation, azimuth, houseRotation }: SolarHouse3DProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [15, 10, 15], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.3} />
      <SunLight elevation={elevation} azimuth={azimuth} />
      <House rotation={houseRotation} />
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={10}
        maxDistance={30}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.2}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
