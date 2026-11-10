import { useEffect, useState } from "react";
import { MousePointer2 } from "lucide-react";

export default function CollaborationCursors() {
  const [pos, setPos] = useState({ x: 300, y: 300 });

  // Simulamos el movimiento de otro usuario (Yvan)
  useEffect(() => {
    const interval = setInterval(() => {
      setPos(prev => ({
        x: prev.x + (Math.random() * 40 - 20),
        y: prev.y + (Math.random() * 40 - 20)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed z-[9998] pointer-events-none transition-all duration-1000 ease-in-out"
      style={{ left: pos.x, top: pos.y }}
    >
      <MousePointer2 size={24} className="text-[#f0a35b] fill-[#f0a35b]" />
      <div className="bg-[#f0a35b] text-black text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
        Yvan (Tú)
      </div>
    </div>
  );
}
