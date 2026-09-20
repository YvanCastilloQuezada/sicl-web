import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Point = [number, number];
type Geometry = { type: string; coordinates: unknown };
export type SpatialElement = {
  id: string;
  element_type: "SiteBoundary" | "BuildingFootprint" | "BuildingMass" | "SpatialZone" | "CirculationElement" | string;
  geometry: Geometry;
  level?: number | null;
  parent_id?: string | null;
  labels?: Record<string, string>;
  metadata?: Record<string, unknown>;
};
export type SpatialRepresentation = {
  id: string;
  alternative_id: string;
  spatial_scope: string;
  representation_version: string;
  generator_version: string;
  coordinate_system: string;
  units: string;
  input_fingerprint: string;
  seed?: string | number | null;
  coordinate_origin?: [number, number, number];
  north_degrees: number;
  elements: SpatialElement[];
};
export type Metrics = Record<string, number>;
export type TransportPayload = { representations: SpatialRepresentation[]; metrics: Record<string, Metrics>; explanations: Record<string, unknown>; provenance: string; read_only: boolean };
export type SpatialBounds = { minX: number; maxX: number; minY: number; maxY: number };

const UPAO001MassingViewer3D = lazy(() => import("./UPAO001MassingViewer3D"));
const ArkiRealityView = lazy(() => import("./ArkiRealityView"));

const WIDTH = 760;
const HEIGHT = 500;
const PADDING = 48;

function coordinatePairs(value: unknown, output: Point[] = []): Point[] {
  if (!Array.isArray(value)) return output;
  if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
    output.push([value[0], value[1]]);
    return output;
  }
  value.forEach((item) => coordinatePairs(item, output));
  return output;
}

function uniquePoints(points: Point[]): Point[] {
  return points.filter((point, index) => points.findIndex((candidate) => candidate[0] === point[0] && candidate[1] === point[1]) === index);
}

function sourcePoints(element: SpatialElement): Point[][] {
  const { type, coordinates } = element.geometry;
  if (type === "multipolygon" && Array.isArray(coordinates)) {
    return coordinates.flatMap((polygon) => {
      const rings = Array.isArray(polygon) ? polygon : [];
      return rings.length ? [coordinatePairs(rings[0])] : [];
    });
  }
  return [uniquePoints(coordinatePairs(coordinates))];
}

function project(point: Point, bounds: { minX: number; maxX: number; minY: number; maxY: number }): Point {
  const spanX = Math.max(bounds.maxX - bounds.minX, 1);
  const spanY = Math.max(bounds.maxY - bounds.minY, 1);
  const scale = Math.min((WIDTH - PADDING * 2) / spanX, (HEIGHT - PADDING * 2) / spanY);
  const drawnWidth = spanX * scale;
  const drawnHeight = spanY * scale;
  const offsetX = (WIDTH - drawnWidth) / 2;
  const offsetY = (HEIGHT - drawnHeight) / 2;
  return [offsetX + (point[0] - bounds.minX) * scale, HEIGHT - offsetY - (point[1] - bounds.minY) * scale];
}

function pointsString(points: Point[], bounds: { minX: number; maxX: number; minY: number; maxY: number }): string {
  return points.map((point) => project(point, bounds).join(",")).join(" ");
}

function labelFor(element: SpatialElement, language: string): string {
  return element.labels?.[language] ?? element.labels?.es ?? element.labels?.en ?? element.element_type;
}

function centroid(points: Point[]): Point {
  if (!points.length) return [0, 0];
  return [points.reduce((sum, point) => sum + point[0], 0) / points.length, points.reduce((sum, point) => sum + point[1], 0) / points.length];
}

function metricsLines(metrics: Metrics | undefined): string[] {
  if (!metrics) return [];
  return [
    `site_area: ${metrics.site_area?.toFixed(1) ?? "—"} m²`,
    `footprint_area: ${metrics.footprint_area?.toFixed(1) ?? "—"} m²`,
    `coverage_ratio: ${metrics.coverage_ratio?.toFixed(3) ?? "—"}`,
    `gross_massing_area: ${metrics.gross_massing_area?.toFixed(1) ?? "—"} m²`,
    `height: ${metrics.height?.toFixed(1) ?? "—"} m`,
    `floor_count: ${metrics.floor_count?.toFixed(0) ?? "—"}`,
  ];
}

function elementClass(elementType: string): string {
  return {
    SiteBoundary: "fill-[#dbeafe] fill-opacity-30 stroke-[#2563eb]",
    BuildingFootprint: "fill-[#f59e0b] fill-opacity-20 stroke-[#b45309]",
    BuildingMass: "fill-[#f97316] fill-opacity-45 stroke-[#9a3412]",
    SpatialZone: "fill-[#22c55e] fill-opacity-30 stroke-[#15803d]",
    CirculationElement: "fill-none stroke-[#7c3aed]",
  }[elementType] ?? "fill-none stroke-[#6b7280] stroke-dasharray-[4_4]";
}

type SvgPresentation = {
  fill: string;
  fillOpacity?: number;
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
};

function elementPresentation(elementType: string): SvgPresentation {
  return {
    SiteBoundary: { fill: "#dbeafe", fillOpacity: 0.3, stroke: "#2563eb", strokeWidth: 2 },
    BuildingFootprint: { fill: "#f59e0b", fillOpacity: 0.2, stroke: "#b45309", strokeWidth: 2 },
    BuildingMass: { fill: "#f97316", fillOpacity: 0.45, stroke: "#9a3412", strokeWidth: 2 },
    SpatialZone: { fill: "#22c55e", fillOpacity: 0.3, stroke: "#15803d", strokeWidth: 2 },
    CirculationElement: { fill: "none", stroke: "#7c3aed", strokeWidth: 3 },
  }[elementType] ?? { fill: "none", stroke: "#6b7280", strokeWidth: 2, strokeDasharray: "4 4" };
}

function labelOffset(element: SpatialElement): Point {
  if (element.element_type !== "SpatialZone") return [0, 0];
  if (element.id.includes("zone-circulation-service")) return [0, -14];
  if (element.id.includes("zone-residential")) return [0, 14];
  return [0, 0];
}

export function SpatialSvgViewer({ representation, metrics, language = "es", boundsOverride, solarAzimuthDegrees }: { representation: SpatialRepresentation; metrics?: Metrics; language?: string; boundsOverride?: SpatialBounds; solarAzimuthDegrees?: number }) {
  const [unsupported, setUnsupported] = useState<string[]>([]);
  const geometries = useMemo(() => representation.elements.flatMap((element) => sourcePoints(element)), [representation.elements]);
  const allPoints = geometries.flat();
  const bounds = useMemo(() => boundsOverride ?? ({ minX: Math.min(...allPoints.map((point) => point[0])), maxX: Math.max(...allPoints.map((point) => point[0])), minY: Math.min(...allPoints.map((point) => point[1])), maxY: Math.max(...allPoints.map((point) => point[1])) }), [allPoints, boundsOverride]);
  const title = `ARKI ${representation.alternative_id} spatial representation`;
  const north = project([bounds.minX + (bounds.maxX - bounds.minX) * 0.12, bounds.maxY - (bounds.maxY - bounds.minY) * 0.12], bounds);
  const northLength = 34;
  const northRadians = (representation.north_degrees * Math.PI) / 180;
  const northEnd: Point = [north[0] + Math.sin(northRadians) * northLength, north[1] - Math.cos(northRadians) * northLength];
  const solar = project([bounds.minX + (bounds.maxX - bounds.minX) * 0.88, bounds.minY + (bounds.maxY - bounds.minY) * 0.12], bounds);
  const solarRadians = ((solarAzimuthDegrees ?? 0) * Math.PI) / 180;
  const solarEnd: Point = [solar[0] + Math.sin(solarRadians) * 38, solar[1] + Math.cos(solarRadians) * 38];
  const summary = metricsLines(metrics);

  useEffect(() => {
    const unknown = representation.elements.map((element) => element.element_type).filter((type) => !("SiteBoundary BuildingFootprint BuildingMass SpatialZone CirculationElement".split(" ").includes(type)));
    setUnsupported(Array.from(new Set(unknown)));
  }, [representation.elements]);

  return <div className="space-y-4" data-testid="spatial-viewer">
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">MODEL PROJECT / EDUCATIONAL EXAMPLE</p>
      <h2 className="mt-2 text-xl font-semibold">{representation.alternative_id}</h2>
      <p className="text-sm text-muted-foreground">Synthetic analytical geometry · {representation.coordinate_system} · {representation.units}</p>
      <p className="mt-1 text-xs text-muted-foreground">Generator: {representation.generator_version} · Representation: {representation.representation_version}</p>
    </div>
    <div className="overflow-x-auto rounded-md border border-border bg-card p-2 text-card-foreground">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="spatial-title spatial-description" className="min-w-[620px] w-full">
        <title id="spatial-title">{title}</title>
        <desc id="spatial-description">Analytical 2D projection derived from the Core SpatialRepresentation. Synthetic educational model, not a surveyed site.</desc>
        <defs><marker id="solar-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#f59e0b" /></marker></defs>
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="transparent" />
        {representation.elements.map((element) => {
          const groups = sourcePoints(element);
          const label = labelFor(element, language);
          const presentation = elementPresentation(element.element_type);
          if (element.element_type === "CirculationElement") return <g key={element.id} data-spatial-id={element.id} aria-label={label}>{groups.map((points) => <polyline key={points.map(String).join("-")} points={pointsString(points, bounds)} className={`${elementClass(element.element_type)} stroke-[3]`} fill={presentation.fill} stroke={presentation.stroke} strokeWidth={presentation.strokeWidth} strokeDasharray={presentation.strokeDasharray} strokeLinecap="round" strokeLinejoin="round" />)}<title>{label}</title></g>;
          if (!["SiteBoundary", "BuildingFootprint", "BuildingMass", "SpatialZone"].includes(element.element_type)) return <g key={element.id} data-spatial-id={element.id} aria-label={label}><title>{label} (unsupported visual type)</title></g>;
          return <g key={element.id} data-spatial-id={element.id} aria-label={label}>{groups.map((points) => <polygon key={points.map(String).join("-")} points={pointsString(points, bounds)} className={`${elementClass(element.element_type)} stroke-[2]`} fill={presentation.fill} fillOpacity={presentation.fillOpacity} stroke={presentation.stroke} strokeWidth={presentation.strokeWidth} strokeDasharray={presentation.strokeDasharray} strokeLinejoin="round" />)}<title>{label}</title></g>;
        })}
        <g data-testid="north-indicator" aria-label={`North ${representation.north_degrees} degrees`}>
          <line x1={north[0]} y1={north[1]} x2={northEnd[0]} y2={northEnd[1]} className="stroke-[#111827] stroke-[3]" stroke="#111827" strokeWidth={3} />
          <text x={northEnd[0] + 5} y={northEnd[1] + 5} className="fill-foreground text-[14px] font-bold" fill="#111827" fontSize={14} fontWeight={700}>N</text>
        </g>
        {solarAzimuthDegrees !== undefined && <g data-testid="solar-indicator" aria-label={`Solar azimuth ${solarAzimuthDegrees.toFixed(1)} degrees`}><line x1={solar[0]} y1={solar[1]} x2={solarEnd[0]} y2={solarEnd[1]} stroke="#f59e0b" strokeWidth={4} markerEnd="url(#solar-arrow)" /><circle cx={solar[0]} cy={solar[1]} r={7} fill="#fbbf24" /><text x={solar[0] - 28} y={solar[1] + 24} fill="#92400e" fontSize={11} fontWeight={700}>SUN</text></g>}
        {representation.elements.filter((element) => ["BuildingMass", "SpatialZone"].includes(element.element_type)).map((element) => { const center = project(centroid(sourcePoints(element)[0]), bounds); const offset = labelOffset(element); return <text key={`${element.id}-label`} data-spatial-id={`${element.id}-label`} x={center[0] + offset[0]} y={center[1] + offset[1]} textAnchor="middle" className="pointer-events-none fill-foreground text-[10px] font-semibold" fill="#111827" fontSize={10} fontWeight={600} stroke="#ffffff" strokeWidth={3} strokeOpacity={0.85} paintOrder="stroke">{labelFor(element, language)}</text>; })}
      </svg>
    </div>
    <div className="grid gap-4 md:grid-cols-[1fr_220px]">
      <div className="rounded-md border border-border bg-card p-4 text-card-foreground"><h3 className="font-semibold">Spatial summary</h3><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{summary.map((line) => <li key={line}>{line}</li>)}</ul>{unsupported.length > 0 && <p role="status" className="mt-3 text-sm text-amber-700">Unsupported element types omitted: {unsupported.join(", ")}</p>}</div>
      <div className="rounded-md border border-border bg-card p-4 text-card-foreground"><h3 className="font-semibold">Legend</h3><ul className="mt-2 space-y-1 text-xs text-muted-foreground"><li>Boundary / footprint</li><li>Building mass</li><li>Program zone</li><li>Circulation / access</li><li>North: {representation.north_degrees.toFixed(1)}°</li></ul></div>
    </div>
  </div>;
}

export default function UPAO001SpatialViewer() {
  const { i18n } = useTranslation();
  const [payload, setPayload] = useState<TransportPayload | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [viewMode, setViewMode] = useState<"2d" | "3d" | "ar">(() => new URLSearchParams(window.location.search).get("mode") === "ar" ? "ar" : "2d");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/core/v1/projects/UPAO-001/spatial-representations", { headers: { accept: "application/json" } })
      .then(async (response) => { if (!response.ok) throw new Error(`Core spatial representation unavailable (${response.status})`); return response.json() as Promise<{ data: TransportPayload }>; })
      .then((body) => { if (!active) return; setPayload(body.data); setSelected(body.data.representations[0]?.alternative_id ?? ""); setError(""); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Spatial representation unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  if (loading) return <div role="status" className="rounded-md border border-border bg-card p-8 text-card-foreground">Loading spatial representation…</div>;
  if (error) return <div role="alert" className="rounded-md border border-destructive bg-card p-8 text-card-foreground"><h2 className="font-semibold">Spatial representation unavailable</h2><p className="mt-2 text-sm text-muted-foreground">{error}</p><p className="mt-2 text-sm text-muted-foreground">The viewer does not fabricate geometry. Configure the Core server-side transport and retry.</p></div>;
  if (!payload || payload.representations.length === 0) return <div role="status" className="rounded-md border border-border bg-card p-8 text-card-foreground">No spatial representation available.</div>;
  const representation = payload.representations.find((item) => item.alternative_id === selected) ?? payload.representations[0];
  return <div className="space-y-5"><header><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">ARKI · Spatial / {viewMode === "2d" ? "2D" : viewMode === "3d" ? "3D" : "AR"}</p><h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">UPAO-001 Spatial View</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Analytical spatial views generated by the deterministic SICL Core. The 2D, 3D and AR modes consume the same SpatialRepresentation.</p></header><div className="flex flex-wrap gap-2" role="group" aria-label="Spatial view mode"><button type="button" className={`rounded-md border px-4 py-2 text-sm font-semibold ${viewMode === "2d" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground"}`} aria-pressed={viewMode === "2d"} onClick={() => setViewMode("2d")}>2D</button><button type="button" className={`rounded-md border px-4 py-2 text-sm font-semibold ${viewMode === "3d" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground"}`} aria-pressed={viewMode === "3d"} onClick={() => setViewMode("3d")}>3D</button><button type="button" className={`rounded-md border px-4 py-2 text-sm font-semibold ${viewMode === "ar" ? "border-[#8bc34a] bg-[#385348] text-[#d9f99d]" : "border-border bg-card text-card-foreground"}`} aria-pressed={viewMode === "ar"} onClick={() => setViewMode("ar")}>AR</button></div>{viewMode !== "ar" && <fieldset className="rounded-md border border-border bg-card p-4 text-card-foreground"><legend className="px-2 text-sm font-semibold">Alternative</legend><div className="flex flex-wrap gap-2">{payload.representations.map((item) => <label key={item.alternative_id} className="flex cursor-pointer items-center gap-2 rounded border border-border px-3 py-2 text-sm"><input type="radio" name="spatial-alternative" value={item.alternative_id} checked={selected === item.alternative_id} onChange={() => setSelected(item.alternative_id)} />{item.alternative_id}</label>)}</div></fieldset>}{viewMode === "2d" ? <SpatialSvgViewer representation={representation} metrics={payload.metrics[representation.alternative_id]} language={i18n.language.split("-")[0]} /> : viewMode === "3d" ? <Suspense fallback={<div role="status" className="rounded-md border border-border bg-card p-8 text-card-foreground">Loading analytical 3D viewer…</div>}><UPAO001MassingViewer3D representation={representation} metrics={payload.metrics[representation.alternative_id]} language={i18n.language.split("-")[0]} /></Suspense> : <Suspense fallback={<div role="status" className="rounded-md border border-border bg-card p-8 text-card-foreground">Loading AR viewer…</div>}><ArkiRealityView representation={representation} /></Suspense>}</div>;
}
