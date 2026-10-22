import React from "react";
import type { SpatialElement, SpatialRepresentation } from "./UPAO001SpatialViewer";

type Point3 = [number, number, number];
export type OrthographicPrimitive = { id: string; kind: "rect"; x: number; y: number; width: number; height: number };
export type OrthographicProjection = {
  representationId: string;
  alternativeId: string;
  inputFingerprint: string;
  mode: "SECTION" | "ELEVATION";
  axis: "X" | "Y";
  primitives: OrthographicPrimitive[];
};

function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
function point3(value: unknown): value is Point3 { return Array.isArray(value) && finite(value[0]) && finite(value[1]) && finite(value[2]); }

function bounds(element: SpatialElement) {
  if (element.element_type !== "BuildingMass" || element.geometry.type !== "volume" || !Array.isArray(element.geometry.coordinates)) return null;
  const points = element.geometry.coordinates.filter(point3);
  if (!points.length) return null;
  const xs=points.map(p=>p[0]), ys=points.map(p=>p[1]), zs=points.map(p=>p[2]);
  return { minX:Math.min(...xs), maxX:Math.max(...xs), minY:Math.min(...ys), maxY:Math.max(...ys), minZ:Math.min(...zs), maxZ:Math.max(...zs) };
}

export function deriveOrthographicProjection(representation: SpatialRepresentation, mode: "SECTION"|"ELEVATION", axis: "X"|"Y" = "X"): OrthographicProjection {
  const primitives = representation.elements.flatMap((element) => {
    const box=bounds(element); if(!box) return [];
    const horizontalMin=axis==="X"?box.minX:box.minY, horizontalMax=axis==="X"?box.maxX:box.maxY;
    return [{id:element.id,kind:"rect" as const,x:horizontalMin,y:box.minZ,width:horizontalMax-horizontalMin,height:box.maxZ-box.minZ}];
  });
  return {representationId:representation.id,alternativeId:representation.alternative_id,inputFingerprint:representation.input_fingerprint,mode,axis,primitives};
}

export function CanonicalOrthographicViewer({representation,mode}:{representation:SpatialRepresentation;mode:"SECTION"|"ELEVATION"}) {
  const projection=deriveOrthographicProjection(representation,mode,mode==="SECTION"?"Y":"X");
  const maxX=Math.max(1,...projection.primitives.map(p=>p.x+p.width)), minX=Math.min(0,...projection.primitives.map(p=>p.x));
  const maxY=Math.max(1,...projection.primitives.map(p=>p.y+p.height)), minY=Math.min(0,...projection.primitives.map(p=>p.y));
  const w=maxX-minX,h=maxY-minY;
  return <div data-testid="canonical-orthographic-viewer" data-representation-id={projection.representationId} data-input-fingerprint={projection.inputFingerprint} className="rounded border border-[#28445b] bg-[#071726] p-2">
    <div className="mb-2 flex justify-between text-[9px] tracking-[.12em] text-[#8fa8bc]"><span>{mode} · SAME SPATIAL REPRESENTATION</span><span>{projection.alternativeId}</span></div>
    <svg viewBox={`${minX-2} ${-(maxY+2)} ${w+4} ${h+4}`} className="h-48 w-full" role="img" aria-label={`${mode} derived from ${projection.representationId}`}>
      <g transform="scale(1,-1)">{projection.primitives.map(p=><rect key={p.id} data-spatial-id={p.id} x={p.x} y={p.y} width={p.width} height={p.height} fill="#16324c" stroke="#d4ff3a" strokeWidth=".35" />)}</g>
    </svg>
    <div className="mt-1 text-[8px] text-[#718b9a]">representation_id={projection.representationId} · fingerprint={projection.inputFingerprint.slice(0,12)}…</div>
  </div>;
}
