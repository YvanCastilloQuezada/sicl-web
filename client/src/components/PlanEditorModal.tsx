import { useRef, useState, useEffect } from "react";
import { X, PenTool, Eraser } from "lucide-react";

export default function PlanEditorModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#38bdf8";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#0a1825]">
      <div className="flex items-center justify-between p-3 border-b border-[#1e293b] bg-[#0f172a]">
        <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2"><PenTool size={18} className="text-[#a78bfa]"/> Editor de Planos</h2>
        <div className="flex items-center gap-2">
          <button onClick={clearCanvas} className="text-[#64748b] hover:text-[#ef4444] bg-[#1e293b] p-1.5 rounded flex items-center gap-1 text-sm"><Eraser size={16} /> Limpiar</button>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0] bg-[#1e293b] p-1 rounded"><X size={20} /></button>
        </div>
      </div>
      <div className="flex-1 p-4 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1200}
          height={700}
          className="bg-[#0f172a] border border-[#1e293b] rounded shadow-2xl cursor-crosshair max-w-full max-h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}
