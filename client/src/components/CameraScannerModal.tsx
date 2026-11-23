import { useState, useRef, useEffect } from "react";
import { X, Camera, RefreshCw, ScanLine, Download } from "lucide-react";

export default function CameraScannerModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setCameraReady(false);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Este navegador no permite acceso a la cámara.");
      stopCamera();
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo iniciar la cámara.";
      setCameraError(message);
      stopCamera();
    }
  };

  useEffect(() => {
    void startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth || !video.videoHeight) {
      setCameraError("La cámara todavía no está lista. Espera y vuelve a intentar.");
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) { setCameraError("No se pudo preparar la captura de imagen."); return; }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.92));
    stopCamera();
  };

  const downloadCapture = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `arki-camera-capture-${new Date().toISOString().replace(/[:.]/g, "-")}.jpg`;
    link.click();
  };

  const resetScanner = () => { setCapturedImage(null); void startCamera(); };
  const handleClose = () => { stopCamera(); onClose(); };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#050b14]">
      <div className="flex items-center justify-between p-4 border-b border-[#1e293b] bg-[#0f172a]">
        <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2"><Camera size={18} className="text-[#f0a35b}" /> Cámara — Visión Inteligente ARKI</h2>
        <button onClick={handleClose} aria-label="Cerrar cámara" className="text-[#64748b] hover:text-[#e2e8f0] bg-[#1e293b] p-1 rounded"><X size={20} /></button>
      </div>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        <div className="flex-1 relative bg-black rounded-xl overflow-hidden border border-[#334155] flex items-center justify-center">
          {!capturedImage ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none flex items-center justify-center">
                <div className="w-3/4 h-3/4 border-2 border-dashed border-[#38bdf8] rounded-xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#f0a35b]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#f0a35b]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#f0a35b]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#f0a35b]" />
                </div>
              </div>
            </>
          ) : <img src={capturedImage} className="w-full h-full object-contain" alt="Captura de cámara" />}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
            {!capturedImage ? (
              <button onClick={captureFrame} disabled={!cameraReady} aria-label="Capturar imagen" className="w-16 h-16 bg-white rounded-full border-4 border-[#334155] flex items-center justify-center hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"><Camera size={24} className="text-black" /></button>
            ) : (
              <div className="flex gap-4">
                <button onClick={resetScanner} aria-label="Volver a capturar" className="bg-[#334155] text-white p-3 rounded-full hover:bg-[#475569]"><RefreshCw size={20} /></button>
                <button onClick={downloadCapture} className="bg-[#38bdf8] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#0284c7] transition"><Download size={20} /> Descargar captura</button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex-1">
            <h3 className="text-[#38bdf8] font-bold mb-4 flex items-center gap-2"><ScanLine size={16} /> Estado de captura</h3>
            {cameraError ? (
              <div role="alert" className="p-3 bg-red-500/10 border border-red-500/40 rounded-lg text-red-300 text-sm">{cameraError}<button onClick={() => void startCamera()} className="block mt-3 px-3 py-2 rounded bg-[#334155] text-white">Reintentar cámara</button></div>
            ) : capturedImage ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/60 rounded-lg text-center"><p className="text-amber-300 text-sm font-bold">Captura disponible</p><p className="text-slate-400 text-xs mt-1">Imagen capturada. El análisis visual IA y la extracción de información aún no están conectados a este módulo; no se generan resultados técnicos ficticios.</p></div>
            ) : (
              <div className="text-[#64748b] text-sm space-y-3"><p>1. Permite el acceso a la cámara.</p><p>2. Encuadra el sitio dentro de la guía.</p><p>3. Captura la imagen. El análisis inteligente se implementará mediante el flujo de comandos validado de SICL.</p>{!cameraReady && !cameraError && <p className="text-amber-300">Iniciando cámara…</p>}</div>
            )}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
