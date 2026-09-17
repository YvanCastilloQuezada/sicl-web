import { useMemo, useState } from "react";
import UPAO001MassingViewer3D from "@/components/UPAO001MassingViewer3D";
import type { SpatialRepresentation } from "@/components/UPAO001SpatialViewer";

type SpatialElement = { id: string; element_type: string; geometry: { coordinates?: number[][][] }; labels?: Record<string, string>; metadata?: Record<string, unknown> };
type Alternative = { family?: string; representation?: { alternative_id?: string; elements?: any[] } };

export default function SpatialSynthesisPreview({ alternatives }: { alternatives: Alternative[] }) {
  const [selected, setSelected] = useState(0);
  const [studioAction, setStudioAction] = useState<"KEEP_THIS" | "CHANGE_THAT" | null>(null);
  const [constraintMode, setConstraintMode] = useState<"LOCK" | "FREE" | "RANGE">("FREE");
  const alternative = alternatives[selected] ?? alternatives[0];
  const elements = alternative?.representation?.elements ?? [];
  const representation = alternative?.representation as SpatialRepresentation | undefined;
  const bounds = useMemo(() => ({ minX: 0, minY: 0, maxX: 115, maxY: 48 }), []);
  if (!alternative) return null;
  const scaleX = (x: number) => 40 + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * 520;
  const scaleY = (y: number) => 285 - ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * 210;
  return <div className="mt-3 rounded border border-[#385348] bg-[#fbfaf6] p-3">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><strong>Generative Studio · Spatial organization</strong><span className="text-xs text-[#718078]">Synthetic deterministic geometry</span></div>
    <div className="mb-2 flex flex-wrap gap-1">{alternatives.map((item, index) => <button key={item.representation?.alternative_id ?? index} type="button" onClick={() => setSelected(index)} className={`rounded px-2 py-1 text-xs font-semibold ${index === selected ? "bg-[#385348] text-white" : "bg-[#e8eee8] text-[#385348]"}`}>{item.representation?.alternative_id ?? `P3-${index + 1}`} · {item.family}</button>)}</div>
    <svg viewBox="0 0 600 320" className="h-64 w-full rounded bg-[#e8eee8]" role="img" aria-label="Generated spatial organization">
      <rect x="20" y="20" width="560" height="280" fill="none" stroke="#385348" strokeWidth="2" strokeDasharray="6 4" />
      <text x="30" y="38" fill="#385348" fontSize="11">SITE / PROGRAM ENVELOPE</text>
      {elements.map((element) => { const ring = (element.geometry.coordinates?.[0] ?? []) as Array<[number, number]>; const points = ring.map(([x, y]: [number, number]) => `${scaleX(x)},${scaleY(y)}`).join(" "); const circulation = element.element_type === "CIRCULATION_ELEMENT"; return <g key={element.id}><polygon points={points} fill={circulation ? "#d07b4a" : "#7f9d86"} fillOpacity={circulation ? 0.8 : 0.75} stroke={circulation ? "#9b4f2c" : "#385348"} strokeWidth="1.5" /><text x={scaleX(ring[0]?.[0] ?? 0) + 3} y={scaleY(ring[0]?.[1] ?? 0) - 3} fill="#1d2925" fontSize="9">{element.labels?.name ?? element.element_type}</text></g>; })}
      <text x="535" y="45" fill="#385348" fontSize="14">N ↑</text>
    </svg>
    <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#385348]"><span>Zones: {elements.filter((item) => ["SPATIAL_ZONE", "SpatialZone"].includes(item.element_type)).length}</span><span>Circulation: {elements.filter((item) => item.element_type === "CIRCULATION_ELEMENT").length}</span><span>Alternative: {alternative.representation?.alternative_id}</span></div>
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      <section className="rounded border border-[#d7d8cf] bg-white p-3"><h3 className="text-sm font-semibold text-[#385348]">Branch gallery</h3><div className="mt-2 space-y-1 text-xs text-[#1d2925]">{alternatives.map((item, index) => <button key={item.representation?.alternative_id ?? index} type="button" onClick={() => setSelected(index)} className={`block w-full rounded px-2 py-1 text-left ${index === selected ? "bg-[#dce8df] font-semibold" : "hover:bg-[#eef1eb]"}`}>{index === 0 ? "BASE" : `BRANCH ${index}`} → {item.representation?.alternative_id ?? `P3-${index + 1}`} · {item.family ?? "generated"}</button>)}</div></section>
      <section className="rounded border border-[#d7d8cf] bg-white p-3"><h3 className="text-sm font-semibold text-[#385348]">Design evolution</h3><ol className="mt-2 space-y-1 text-xs text-[#1d2925]"><li>1. Architectural program + spatial graph</li><li>2. Generate {alternative.family ?? "spatial"} organization</li><li>3. Select {alternative.representation?.alternative_id ?? "alternative"}</li><li>4. Compare and continue designing</li></ol><p className="mt-2 text-xs text-[#718078]">Why this alternative exists: generated from the synthetic program, supported spatial graph and declared organizational family.</p></section>
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded border border-[#d7d8cf] bg-white p-3 text-xs"><span className="font-semibold text-[#385348]">Selected spatial organization</span><button type="button" onClick={() => setStudioAction("KEEP_THIS")} className={`rounded px-2 py-1 ${studioAction === "KEEP_THIS" ? "bg-[#385348] text-white" : "bg-[#e8eee8] text-[#385348]"}`}>KEEP THIS</button><button type="button" onClick={() => setStudioAction("CHANGE_THAT")} className={`rounded px-2 py-1 ${studioAction === "CHANGE_THAT" ? "bg-[#9b4f2c] text-white" : "bg-[#f3e2d8] text-[#7a3d27]"}`}>CHANGE THAT</button><span className="ml-1 text-[#718078]">Control:</span>{(["LOCK", "FREE", "RANGE"] as const).map((mode) => <button key={mode} type="button" onClick={() => setConstraintMode(mode)} className={`rounded border px-2 py-1 ${constraintMode === mode ? "border-[#385348] bg-[#dce8df] font-semibold" : "border-[#d7d8cf]"}`}>{mode}</button>)}{studioAction && <span className="basis-full text-[#718078]">Studio selection: {studioAction} · constraint mode {constraintMode}. GDI-P1 executes the operation; Human review and decision remain separate.</span>}</div>
    {representation && <div className="mt-3"><UPAO001MassingViewer3D representation={representation} /></div>}
  </div>;
}
