import { useRef, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { src: string; alt: string; className?: string };
export default function ImagePanZoom({ src, alt, className = "" }: Props) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const last = useRef({ x: 0, y: 0 });
  const clamp = (value: number) => Math.min(4, Math.max(0.5, Number(value.toFixed(2))));
  const zoom = (delta: number) => setScale((value) => clamp(value + delta));
  const reset = () => { setScale(1); setOffset({ x: 0, y: 0 }); };
  return <div className={`relative overflow-hidden rounded-lg border border-slate-700 bg-[#061326] ${className}`} onWheel={(event) => { event.preventDefault(); zoom(event.deltaY > 0 ? -0.15 : 0.15); }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); last.current = { x: event.clientX, y: event.clientY }; setDragging(true); }} onPointerMove={(event) => { if (!dragging) return; const dx = event.clientX - last.current.x; const dy = event.clientY - last.current.y; last.current = { x: event.clientX, y: event.clientY }; setOffset((value) => ({ x: value.x + dx, y: value.y + dy })); }} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)} role="application" aria-label="Visor con zoom y paneo"><img src={src} alt={alt} draggable={false} className={`h-full w-full select-none object-contain transition-transform duration-100 ${dragging ? "cursor-grabbing" : "cursor-grab"}`} style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }} /><div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md border border-slate-600 bg-[#081a32]/90 p-1 shadow-lg"><Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-slate-100 hover:bg-slate-700" onClick={() => zoom(-0.25)} aria-label="Reducir zoom"><Minus className="h-4 w-4" /></Button><span className="min-w-12 text-center text-xs text-slate-200">{Math.round(scale * 100)}%</span><Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-slate-100 hover:bg-slate-700" onClick={() => zoom(0.25)} aria-label="Aumentar zoom"><Plus className="h-4 w-4" /></Button><Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-slate-100 hover:bg-slate-700" onClick={reset} aria-label="Restablecer visor"><RotateCcw className="h-4 w-4" /></Button><Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-slate-100 hover:bg-slate-700" onClick={() => setScale(4)} aria-label="Ampliar al máximo"><Maximize2 className="h-4 w-4" /></Button></div><p className="pointer-events-none absolute left-3 top-3 rounded bg-[#081a32]/80 px-2 py-1 text-[10px] text-slate-300">Rueda: zoom · Arrastra: paneo</p></div>;
}
