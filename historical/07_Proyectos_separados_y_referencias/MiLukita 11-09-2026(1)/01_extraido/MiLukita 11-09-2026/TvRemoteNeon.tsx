import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Circle } from "lucide-react";

const NEON_COLORS = [
  { name: "Cian", value: "#22f5d0" },
  { name: "Fucsia", value: "#ff3cac" },
  { name: "Lima", value: "#b8ff2c" },
  { name: "Naranja", value: "#ff8a1f" },
  { name: "Violeta", value: "#a66cff" },
] as const;

type Direction = "up" | "left" | "select" | "right" | "down";

export default function TvRemoteNeon({ onAction }: { onAction?: (action: Direction) => void }) {
  const [colorIndex] = useState(() => Math.floor(Math.random() * NEON_COLORS.length));
  const color = NEON_COLORS[colorIndex];
  const action = (value: Direction) => onAction?.(value);

  return (
    <section
      className="tv-remote-neon fixed bottom-3 right-3 z-30 w-[160px] border bg-black/85 p-2 text-white backdrop-blur-md"
      style={{ borderColor: `${color.value}99`, boxShadow: `0 0 14px ${color.value}66, inset 0 0 20px ${color.value}12` }}
      aria-label={`Control remoto TV, color neón ${color.name}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[.18em]" style={{ color: color.value }}>Remote TV</p>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color.value, boxShadow: `0 0 8px ${color.value}` }} aria-label={`Color de sesión ${color.name}`} />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
        <span />
        <button type="button" onClick={() => action("up")} className="grid h-7 place-items-center border border-white/15 bg-white/5 hover:bg-white/15" aria-label="Control remoto: arriba"><ArrowUp className="h-4 w-4" /></button>
        <span />
        <button type="button" onClick={() => action("left")} className="grid h-7 place-items-center border border-white/15 bg-white/5 hover:bg-white/15" aria-label="Control remoto: izquierda"><ArrowLeft className="h-4 w-4" /></button>
        <button type="button" onClick={() => action("select")} className="grid h-7 place-items-center border text-black" style={{ borderColor: color.value, backgroundColor: color.value, boxShadow: `0 0 10px ${color.value}99` }} aria-label="Control remoto: seleccionar"><Circle className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={() => action("right")} className="grid h-7 place-items-center border border-white/15 bg-white/5 hover:bg-white/15" aria-label="Control remoto: derecha"><ArrowRight className="h-4 w-4" /></button>
        <span />
        <button type="button" onClick={() => action("down")} className="grid h-7 place-items-center border border-white/15 bg-white/5 hover:bg-white/15" aria-label="Control remoto: abajo"><ArrowDown className="h-4 w-4" /></button>
        <span />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
        <span>Neón {color.name}</span>
        <span>Controller Lab</span>
      </div>
    </section>
  );
}
