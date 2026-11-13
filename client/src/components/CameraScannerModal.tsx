import { useState, useRef, useEffect } from "react";
import { X, Camera, RefreshCw, ScanLine, Layers } from "lucide-react";

export default function CameraScannerModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // 1. Encender la cámara al abrir el modal
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } // Prioriza la cámara trasera en celulares
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        alert("No se pudo acceder a la cámara. Revisa los permisos de tu navegador.");
      }
    };

    startCamera();

    // Limpiar la cámara al cerrar
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 2. Capturar el fotograma
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageUrl);
      
      // Detener la cámara después de capturar
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // 3. Simular el escaneo 3D y generación de planos
  const processImage = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        pendiente: "12%",
        orientacion: "Norte",
        contexto: "Zona residencial con edificios de 3-4 pisos.",
        planoGenerado: true
      });
    }, 3000); // Simulamos 3 segundos de procesamiento IA
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setScanResult(null);
    // Volver a encender la cámara
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(s => {
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#050b14]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1e293b] bg-[#0f172a]">
        <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
          <Camera size={18} className="text-[#f0a35b]" /> Escáner 3D de Terreno (Visión IA)
        </h2>
        <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0] bg-[#1e293b] p-1 rounded">
          <X size={20} />
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        
        {/* Visor de Cámara / Imagen */}
        <div className="flex-1 relative bg-black rounded-xl overflow-hidden border border-[#334155] flex items-center justify-center">
          {!capturedImage ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover" 
              />
              {/* Guía de escaneo */}
              <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none flex items-center justify-center">
                <div className="w-3/4 h-3/4 border-2 border-dashed border-[#38bdf8] rounded-xl relative">
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#f0a35b]"></div>
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#f0a35b]"></div>
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#f0a35b]"></div>
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#f0a35b]"></div>
                </div>
              </div>
            </>
          ) : (
            <img src={capturedImage} className="w-full h-full object-cover" alt="Terreno capturado" />
          )}

          {/* Botones flotantes */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            {!capturedImage ? (
              <button 
                onClick={captureFrame}
                className="w-16 h-16 bg-white rounded-full border-4 border-[#334155] flex items-center justify-center hover:scale-105 transition"
              >
                <Camera size={24} className="text-black" />
              </button>
            ) : (
              <div className="flex gap-4">
                <button onClick={resetScanner} className="bg-[#334155] text-white p-3 rounded-full hover:bg-[#475569]">
                  <RefreshCw size={20} />
                </button>
                {!scanResult && (
                  <button 
                    onClick={processImage}
                    disabled={isScanning}
                    className="bg-[#38bdf8] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#0284c7] transition"
                  >
                    {isScanning ? <ScanLine className="animate-spin" size={20} /> : <Layers size={20} />}
                    {isScanning ? "Procesando IA..." : "Generar Plano 2D/3D"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Panel de Resultados */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex-1">
            <h3 className="text-[#38bdf8] font-bold mb-4 flex items-center gap-2">
              <ScanLine size={16} /> Análisis de Contexto
            </h3>
            
            {!scanResult ? (
              <div className="text-[#64748b] text-sm space-y-4">
                <p>1. Encuadra el terreno en el marco celeste.</p>
                <p>2. Toma una foto del entorno.</p>
                <p>3. La IA extraerá la topografía y generará el plano base.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                  <p className="text-[10px] text-[#64748b] uppercase">Pendiente Estimada</p>
                  <p className="text-sm text-[#e2e8f0]">{scanResult.pendiente}</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                  <p className="text-[10px] text-[#64748b] uppercase">Orientación</p>
                  <p className="text-sm text-[#e2e8f0]">{scanResult.orientacion}</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                  <p className="text-[10px] text-[#64748b] uppercase">Contexto Urbano</p>
                  <p className="text-sm text-[#e2e8f0]">{scanResult.contexto}</p>
                </div>
                <div className="mt-4 p-3 bg-[#38bdf8]/10 border border-[#38bdf8] rounded-lg text-center">
                  <p className="text-[#38bdf8] text-sm font-bold">¡Plano Base Generado!</p>
                  <p className="text-[#64748b] text-xs mt-1">Listo para ser usado en el Funnel.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Canvas oculto para capturar el frame */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
