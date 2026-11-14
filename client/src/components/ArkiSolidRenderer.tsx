import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import type { RenderData, RenderMaterial } from "../../../server/gia/visualization/types";

type ArkiSolidRendererProps = {
  renderData: RenderData;
  onExportPng?: (dataUrl: string) => void;
};

/**
 * Convierte RenderData (malla triangular + materiales PBR) en una escena Three.js.
 * No inventa geometría: cada vertice y cada face viene del cálculo de ARKI.
 * Los materiales son MeshPhysicalMaterial con transmission/metalness/roughness
 * derivados del motor de sostenibilidad.
 */
export default function ArkiSolidRenderer({ renderData, onExportPng }: ArkiSolidRendererProps) {
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const [exporting, setExporting] = useState(false);



  // Dirección del sol desde azimut/elevación
  const sunDir = useMemo(() => {
    const az = (renderData.lighting.sunAzimuthDeg * Math.PI) / 180;
    const el = (renderData.lighting.sunElevationDeg * Math.PI) / 180;
    return [Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)] as [number, number, number];
  }, [renderData.lighting]);

  // Preset HDRI según lighting.hdri
  const hdriPreset = useMemo(() => {
    switch (renderData.lighting.hdri) {
      case "blue_hour": return "sunset" as const;
      case "daylight": return "city" as const;
      case "overcast": return "dawn" as const;
      default: return "city" as const;
    }
  }, [renderData.lighting.hdri]);

  // Agrupar faces por material
  const facesByMaterial = useMemo(() => {
    const groups = new Map<string, [number, number, number][]>();
    for (const face of renderData.faces) {
      const arr = groups.get(face.materialId) ?? [];
      arr.push(face.vertices);
      groups.set(face.materialId, arr);
    }
    return groups;
  }, [renderData.faces]);

  // BufferGeometry por material
  const geometries = useMemo(() => {
    const out = new Map<string, THREE.BufferGeometry>();
    for (const [materialId, faces] of facesByMaterial) {
      const positions: number[] = [];
      for (const face of faces) {
        for (const idx of face) {
          const v = renderData.vertices[idx];
          if (!v) continue;
          positions.push(v[0], v[1], v[2]);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.computeVertexNormals();
      out.set(materialId, geo);
    }
    return out;
  }, [facesByMaterial, renderData.vertices]);

  // MeshPhysicalMaterial por material
  const materials = useMemo(() => {
    const out = new Map<string, THREE.MeshPhysicalMaterial>();
    for (const m of renderData.materials) {
      out.set(m.id, makeMaterial(m));
    }
    return out;
  }, [renderData.materials]);

  // Calcular Bounding Box para centrar y alejar la cámara perfectamente
  const { center, radius } = useMemo(() => {
    if (renderData.vertices.length === 0) return { center: [0, 0, 0] as [number, number, number], radius: 10 };
    const box = new THREE.Box3();
    for (const v of renderData.vertices) {
      box.expandByPoint(new THREE.Vector3(v[0], v[1], v[2]));
    }
    const c = new THREE.Vector3();
    box.getCenter(c);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    return { center: c.toArray() as [number, number, number], radius: sphere.radius || 10 };
  }, [renderData.vertices]);

  const camera = renderData.cameras.find((c) => c.id === "perspective") ?? renderData.cameras[0];
  const camDistance = radius * 1.5;

  // Cleanup
  useEffect(() => () => {
    for (const geo of geometries.values()) geo.dispose();
    for (const mat of materials.values()) mat.dispose();
  }, [geometries, materials]);

  const handleExport = () => {
    if (!glRef.current || !onExportPng) return;
    setExporting(true);
    try {
      const dataUrl = glRef.current.domElement.toDataURL("image/png");
      onExportPng(dataUrl);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ 
          position: [center[0] + camDistance, center[1] + camDistance, center[2] + camDistance], 
          fov: camera?.fov ?? 45 
        }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={({ gl }) => { glRef.current = gl; }}
        shadows
      >
        <color attach="background" args={["#0d223d"]} />
        <Environment preset={hdriPreset} />
        <directionalLight
          position={sunDir}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <ambientLight intensity={0.35} />
        <group>
          {Array.from(geometries.entries()).map(([materialId, geo]) => (
            <mesh key={materialId} geometry={geo} material={materials.get(materialId)} castShadow receiveShadow />
          ))}
        </group>
        <OrbitControls target={new THREE.Vector3(...center)} enableDamping />
      </Canvas>
      {onExportPng && (
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="absolute bottom-4 right-4 rounded-md bg-[#f0a35b] px-4 py-2 text-sm font-semibold text-[#071a30] hover:bg-[#f6c995] disabled:opacity-50"
        >
          {exporting ? "Exportando…" : "Exportar PNG"}
        </button>
      )}
    </div>
  );
}

function makeMaterial(m: RenderMaterial): THREE.MeshPhysicalMaterial {
  const params: THREE.MeshPhysicalMaterialParameters = {
    color: new THREE.Color(m.color),
    roughness: m.roughness,
    metalness: m.metalness,
    side: THREE.DoubleSide,
  };
  if (m.transmission !== undefined) {
    params.transmission = m.transmission;
    params.thickness = 0.5;
    params.ior = 1.5;
  }
  if (m.emissive) {
    params.emissive = new THREE.Color(m.emissive.color);
    params.emissiveIntensity = m.emissive.intensity;
  }
  return new THREE.MeshPhysicalMaterial(params);
}
