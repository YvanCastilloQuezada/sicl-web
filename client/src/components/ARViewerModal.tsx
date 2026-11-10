import { useState, useRef, useEffect } from "react";
import { X, Box, Move3d, Maximize, MousePointer2, Layers, RotateCw, Crosshair, Info } from "lucide-react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Componente para manejar la selección por raycasting desde el centro de la pantalla
function CrosshairSelector({ onSelect }: { onSelect: (obj: THREE.Object3D | null) => void }) {
  const { camera, scene, size } = useThree();
  
  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0); // Centro de la pantalla (NDC)

    const handleSelect = () => {
      raycaster.setFromCamera(center, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      // Filtramos para quedarnos solo con los meshes de nuestro modelo (ignorando luces, sombras, etc.)
      const validIntersects = intersects.filter(i => i.object.type === 'Mesh' && i.object.name !== 'ground');
      
      if (validIntersects.length > 0) {
        onSelect(validIntersects[0].object);
      } else {
        onSelect(null);
      }
    };

    // Escuchamos un evento personalizado o podemos exponer la función
    // Para simplificar, haremos la selección con un botón en la UI
    (window as any).selectObject = handleSelect;

    return () => { delete (window as any).selectObject; };
  }, [camera, scene, onSelect]);

  return null;
}

// Modelo 3D interactivo
function InteractiveBuilding({ onSelect, isSelected }: { onSelect: () => void, isSelected: boolean }) {
  return (
    <group position={[0, -1, 0]}>
      <mesh 
        castShadow 
        receiveShadow 
        position={[0, 1, 0]} 
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        name="building_base"
      >
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color={isSelected ? "#f0a35b" : "#38bdf8"} transparent opacity={0.9} />
      </mesh>
      <mesh 
        castShadow 
        receiveShadow 
        position={[0, 3, 0]} 
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        name="building_top"
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={isSelected ? "#f0a35b" : "#38bdf8"} transparent opacity={0.9} />
      </mesh>
      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2} far={4} />
    </group>
  );
}

export default function ARViewerModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const [tool, setTool] = useState<'move' | 'rotate' | 'scale' | 'select'>('select');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setLoading(false);
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        setLoading(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSelect = () => {
    if ((window as any).selectObject) {
      (window as any).selectObject();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
      {/* Header AR */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="text-white font-bold flex items-center gap-2 shadow-lg">
          <Crosshair size={18} className="text-[#f0a35b]" /> Visor AR - Selección Activa
        </h2>
        <button onClick={onClose} className="text-white bg-black/50 p-2 rounded-full hover:bg-black/80 transition">
          <X size={20} />
        </button>
      </div>

      {/* Video de fondo (Cámara) */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover" 
      />

      {/* Overlay de Three.js (El edificio 3D) */}
      {isPlaced && (
        <div className="absolute inset-0 z-10 cursor-crosshair">
          <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
            <CrosshairSelector onSelect={setSelectedObject} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            
            <InteractiveBuilding 
              onSelect={() => handleSelect()} 
              isSelected={!!selectedObject} 
            />
            
            {/* Controles de navegación (Deshabilitados en modo selección para no interferir) */}
            {tool !== 'select' && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
          </Canvas>
        </div>
      )}

      {/* Mira Central (Crosshair UI) */}
      {isPlaced && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute w-full h-0.5 bg-white/50"></div>
            <div className="absolute h-full w-0.5 bg-white/50"></div>
            <div className="w-2 h-2 bg-[#38bdf8] rounded-full border border-white"></div>
          </div>
        </div>
      )}

      {/* Panel de Información del Objeto Seleccionado */}
      {selectedObject && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-[#38bdf8]/50 text-white text-sm flex items-center gap-3">
          <Info size={16} className="text-[#38bdf8]" />
          <div>
            <p className="font-bold">Objeto Seleccionado</p>
            <p className="text-xs text-gray-300">Nombre: {selectedObject.name || 'Sin nombre'}</p>
            <p className="text-xs text-gray-300">Tipo: {selectedObject.type}</p>
          </div>
        </div>
      )}

      {/* UI Inferior - Barra de Herramientas Radial/Lineal */}
      <div className="absolute bottom-0 left-0 right-0 z-50 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
        {!isPlaced ? (
          <button 
            onClick={() => setIsPlaced(true)}
            className="bg-[#f0a35b] text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 shadow-2xl hover:scale-105 transition"
          >
            <Box size={24} /> Colocar Proyecto en el Terreno
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {/* Barra de Herramientas (Símbolos) */}
            <div className="flex gap-2 bg-black/50 backdrop-blur-md p-2 rounded-2xl border border-white/10">
              <button 
                onClick={() => setTool('select')}
                className={`p-3 rounded-xl transition ${tool === 'select' ? 'bg-[#38bdf8] text-black' : 'text-white hover:bg-white/20'}`}
                title="Seleccionar (Mira)"
              >
                <MousePointer2 size={20} />
              </button>
              <button 
                onClick={() => setTool('move')}
                className={`p-3 rounded-xl transition ${tool === 'move' ? 'bg-[#38bdf8] text-black' : 'text-white hover:bg-white/20'}`}
                title="Mover"
              >
                <Move3d size={20} />
              </button>
              <button 
                onClick={() => setTool('rotate')}
                className={`p-3 rounded-xl transition ${tool === 'rotate' ? 'bg-[#38bdf8] text-black' : 'text-white hover:bg-white/20'}`}
                title="Rotar"
              >
                <RotateCw size={20} />
              </button>
              <button 
                onClick={() => setTool('scale')}
                className={`p-3 rounded-xl transition ${tool === 'scale' ? 'bg-[#38bdf8] text-black' : 'text-white hover:bg-white/20'}`}
                title="Escalar"
              >
                <Maximize size={20} />
              </button>
              <button 
                onClick={handleSelect}
                className="p-3 rounded-xl transition text-[#f0a35b] hover:bg-white/20"
                title="Capturar Objeto (Crosshair)"
              >
                <Crosshair size={20} />
              </button>
            </div>
            <p className="text-white/80 text-xs mt-1 bg-black/50 px-3 py-1 rounded-full">
              {tool === 'select' ? 'Apunta con la mira y presiona el ícono de captura.' : 'Usa dos dedos para interactuar con el modelo.'}
            </p>
          </div>
        )}
      </div>

      {/* Pantalla de carga */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38bdf8] mb-4"></div>
          <p>Iniciando cámara AR...</p>
        </div>
      )}
    </div>
  );
}
