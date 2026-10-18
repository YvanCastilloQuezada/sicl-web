import { useEffect, useMemo, useRef, useState } from "react";
import type { ConstructionModel, Muro } from "@shared/arkiConstructionOntology";
import { selectionFromElement, type BimElementKind } from "@shared/arkiBimSelection";
import type { CanvasView } from "./types";
import { useBimSelection } from "./SelectionProvider";

const kinds: Array<[keyof ConstructionModel, BimElementKind]> = [["walls", "wall"], ["columns", "column"], ["beams", "beam"], ["slabs", "slab"], ["doors", "door"], ["windows", "window"]];

type PlanElement = { element: unknown; kind: BimElementKind; id: string; level: number };
type Point = { x: number; y: number };

export default function CanvasPlanView({ model, view, onViewChange }: { model: ConstructionModel | null; view: CanvasView; onViewChange: (view: CanvasView) => void }) {
  const { selection, select, clear } = useBimSelection();
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") clear(); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [clear]);
  const elements = useMemo<PlanElement[]>(() => model ? kinds.flatMap(([key, kind]) => (model[key] as Array<{ id: string; level?: number; nivel_piso?: number; specialty?: string; especialidad_principal?: string; status?: string; estado?: string }>).map((element) => ({ element, kind, id: element.id, level: element.level ?? element.nivel_piso ?? 0 })).filter((item) => {
    if (item.level !== view.level) return false;
    const category = item.kind === "wall" ? "Muros" : item.kind === "door" ? "Puertas" : item.kind === "window" ? "Ventanas" : item.kind === "column" ? "Columnas" : item.kind === "beam" ? "Vigas" : "Losas";
    if (!view.visibleCategories.includes(category)) return false;
    const source = item.element as { specialty?: string; especialidad_principal?: string; status?: string; estado?: string };
    const discipline = source.specialty ?? source.especialidad_principal ?? "arquitectura";
    const phase = source.status ?? source.estado ?? "borrador";
    return (view.discipline === "all" || discipline === view.discipline) && (view.phase === "all" || phase === view.phase);
  })) : [], [model, view.level, view.visibleCategories, view.discipline, view.phase]);
  const walls = elements.filter((item) => item.kind === "wall");
  const maxX = Math.max(20, ...walls.map(({ element }) => { const wall = element as Muro; return Math.max(wall.x_inicio_m, wall.x_fin_m); }));
  const maxY = Math.max(20, ...walls.map(({ element }) => { const wall = element as Muro; return Math.max(wall.y_inicio_m, wall.y_fin_m); }));
  const sx = (value: number) => 80 + (value / maxX) * 840;
  const sy = (value: number) => 70 + (value / maxY) * 520;
  const isSelected = (id: string) => selection.items.some((item) => item.elementId === id);
  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => { event.preventDefault(); const factor = event.deltaY < 0 ? 1.1 : .9; onViewChange({ ...view, viewport: { ...view.viewport, scale: Math.max(.55, Math.min(3, view.viewport.scale * factor)) } }); };
  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => { setDragging(true); dragStart.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); };
  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => { if (!dragging || !dragStart.current) return; const dx = event.clientX - dragStart.current.x; const dy = event.clientY - dragStart.current.y; dragStart.current = { x: event.clientX, y: event.clientY }; onViewChange({ ...view, viewport: { ...view.viewport, translateX: view.viewport.translateX + dx, translateY: view.viewport.translateY + dy } }); };
  const finishDrag = () => { setDragging(false); dragStart.current = null; };
  return <section className="arki-plan-canvas" aria-label="Canvas de planta BIM"><div className="arki-canvas-head"><div><span>CANVAS · PLANTA</span><b>Nivel {view.level + 1}</b></div><div><span>{elements.length} elementos</span><span>{model ? `${model.walls.length} muros · ${model.summary.doorCount} puertas` : "sin modelo"}</span><span>{selection.items.length} seleccionados</span></div></div><div className="arki-canvas-stage"><svg viewBox="0 0 1000 680" role="img" aria-label="Planta BIM con muros y puertas" onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishDrag} onPointerCancel={finishDrag} onClick={() => clear()}><defs><pattern id="arki-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(148,163,184,.12)" strokeWidth="1" /></pattern></defs><rect width="1000" height="680" fill="url(#arki-grid)" /><g transform={`translate(${view.viewport.translateX} ${view.viewport.translateY}) scale(${view.viewport.scale})`}>{view.showAxes && <><line x1="60" y1="50" x2="950" y2="50" stroke="#60a5fa" strokeDasharray="4 4" /><line x1="60" y1="50" x2="60" y2="620" stroke="#60a5fa" strokeDasharray="4 4" /></>}{view.showGrid && <rect x="80" y="70" width="840" height="520" fill="none" stroke="rgba(103,232,249,.25)" />}{elements.map((item) => <PlanShape key={item.id} item={item} walls={walls} x={sx} y={sy} selected={isSelected(item.id)} onSelect={(event) => { event.stopPropagation(); select(selectionFromElement(item.element, item.kind), event.shiftKey); }} />)}</g></svg>{!model && <div className="arki-canvas-empty"><strong>Planta sin modelo</strong><span>Genera una propuesta para cargar el ConstructionModel.</span></div>}</div><div className="arki-canvas-foot"><span>Muros perimetrales · puerta P-1 · abertura 0.90 × 2.10 m</span><span>Click: seleccionar · Shift + click: añadir · Escape: limpiar</span><span>Zoom {Math.round(view.viewport.scale * 100)}%</span></div></section>;
}

function PlanShape({ item, walls, x, y, selected, onSelect }: { item: PlanElement; walls: PlanElement[]; x: (value: number) => number; y: (value: number) => number; selected: boolean; onSelect: (event: React.MouseEvent<SVGElement>) => void }) {
  if (item.kind === "wall") {
    const wall = item.element as Muro;
    const openings = wall.aberturas.filter((opening) => opening.tipo === "puerta" || opening.tipo === "ventana").sort((a, b) => a.posicion_m - b.posicion_m);
    return <g data-element-id={item.id} onClick={onSelect}>{wallSegments(wall, openings, x, y).map((segment, index) => <line key={`${item.id}-segment-${index}`} x1={segment.start.x} y1={segment.start.y} x2={segment.end.x} y2={segment.end.y} stroke={selected ? "#ff8a4c" : "#f2f5f9"} strokeWidth={selected ? 10 : 6} strokeLinecap="round" />)}</g>;
  }
  const element = item.element as Record<string, unknown>;
  const hostWall = item.kind === "door" || item.kind === "window" ? walls.find((wall) => { const source = item.element as { tracesTo?: unknown }; return Array.isArray(source.tracesTo) && source.tracesTo.includes(wall.id); }) : undefined;
  const opening = hostWall ? (hostWall.element as Muro).aberturas.find((candidate) => candidate.tipo === (item.kind === "door" ? "puerta" : "ventana")) : undefined;
  if (hostWall && opening) {
    const wall = hostWall.element as Muro;
    const point = pointAt(wall, opening.posicion_m, x, y);
    const horizontal = Math.abs(wall.x_fin_m - wall.x_inicio_m) >= Math.abs(wall.y_fin_m - wall.y_inicio_m);
    const openingWidth = Math.max(12, Math.abs((opening.ancho_m / Math.max(wall.longitud_m(), 1)) * (horizontal ? x(Math.max(wall.x_inicio_m, wall.x_fin_m)) - x(Math.min(wall.x_inicio_m, wall.x_fin_m)) : y(Math.max(wall.y_inicio_m, wall.y_fin_m)) - y(Math.min(wall.y_inicio_m, wall.y_fin_m)))));
    return item.kind === "door" ? <g data-element-id={item.id} onClick={onSelect} className="arki-door-symbol"><rect x={horizontal ? point.x - openingWidth / 2 : point.x - 8} y={horizontal ? point.y - 8 : point.y - openingWidth / 2} width={horizontal ? openingWidth : 16} height={horizontal ? 16 : openingWidth} fill={selected ? "#ff8a4c" : "#fbbf24"} stroke={selected ? "#fff" : "#080736"} strokeWidth={selected ? 3 : 1.5} /><path d={horizontal ? `M ${point.x} ${point.y} A ${openingWidth} ${openingWidth} 0 0 1 ${point.x + openingWidth} ${point.y - openingWidth}` : `M ${point.x} ${point.y} A ${openingWidth} ${openingWidth} 0 0 0 ${point.x + openingWidth} ${point.y + openingWidth}`} fill="none" stroke="#fbbf24" strokeWidth="2" /></g> : <rect data-element-id={item.id} onClick={onSelect} x={horizontal ? point.x - openingWidth / 2 : point.x - 5} y={horizontal ? point.y - 5 : point.y - openingWidth / 2} width={horizontal ? openingWidth : 10} height={horizontal ? 10 : openingWidth} fill={selected ? "#ff8a4c" : "#60a5fa"} stroke={selected ? "#fff" : "#080736"} strokeWidth={selected ? 3 : 1} />;
  }
  const geometry = (element.geometry as Record<string, unknown> | undefined) ?? {};
  const px = typeof geometry.x === "number" ? x(geometry.x) : 200 + (Math.abs(item.id.length * 31) % 600);
  const py = typeof geometry.y === "number" ? y(geometry.y) : 150 + (Math.abs(item.id.length * 17) % 350);
  const color = item.kind === "column" ? "#67e8f9" : item.kind === "beam" ? "#fbbf24" : item.kind === "slab" ? "#4ade80" : "#60a5fa";
  return <rect data-element-id={item.id} onClick={onSelect} x={px - 7} y={py - 7} width="14" height="14" rx="2" fill={selected ? "#ff8a4c" : color} stroke={selected ? "#fff" : "#080736"} strokeWidth={selected ? 3 : 1} />;
}

function pointAt(wall: Muro, distance: number, x: (value: number) => number, y: (value: number) => number): Point {
  const length = Math.max(wall.longitud_m(), 1);
  const ratio = Math.max(0, Math.min(1, distance / length));
  return { x: x(wall.x_inicio_m + (wall.x_fin_m - wall.x_inicio_m) * ratio), y: y(wall.y_inicio_m + (wall.y_fin_m - wall.y_inicio_m) * ratio) };
}

function wallSegments(wall: Muro, openings: Muro["aberturas"], x: (value: number) => number, y: (value: number) => number): Array<{ start: Point; end: Point }> {
  const length = Math.max(wall.longitud_m(), 1);
  const breaks = [0, ...openings.flatMap((opening) => [Math.max(0, opening.posicion_m - opening.ancho_m / 2), Math.min(length, opening.posicion_m + opening.ancho_m / 2)]), length].sort((a, b) => a - b);
  const segments: Array<{ start: Point; end: Point }> = [];
  for (let index = 0; index < breaks.length - 1; index += 1) { const start = breaks[index]; const end = breaks[index + 1]; const midpoint = (start + end) / 2; if (openings.some((opening) => midpoint > opening.posicion_m - opening.ancho_m / 2 && midpoint < opening.posicion_m + opening.ancho_m / 2)) continue; segments.push({ start: pointAt(wall, start, x, y), end: pointAt(wall, end, x, y) }); }
  return segments;
}
