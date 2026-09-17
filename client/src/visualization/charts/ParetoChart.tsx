import React, { useMemo, useState } from "react";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import ChartEmptyState from "./ChartEmptyState";
import { chartMargins, innerSize, type ChartStatus } from "../lib/d3Setup";
import type { ParetoData } from "../models/paretoModel";

type Props = { data: ParetoData | null; width?: number; height?: number; selectedId?: string | null; onSelect?: (id: string) => void };

export default function ParetoChart({ data, width = 720, height = 400, selectedId = null, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);
  const size = innerSize(width, height);
  const points = data?.points.filter((point) => point.x !== null && point.y !== null) ?? [];
  const xScale = useMemo(() => scaleLinear().domain([0, Math.max(100, ...points.map((point) => point.x ?? 0))]).range([0, size.width]), [points, size.width]);
  const yScale = useMemo(() => scaleLinear().domain([Math.max(100, ...points.map((point) => point.y ?? 0)), 0]).range([size.height, 0]), [points, size.height]);

  useEffect(() => { if (xAxisRef.current) select(xAxisRef.current).call(axisBottom(xScale).ticks(5) as never); if (yAxisRef.current) select(yAxisRef.current).call(axisLeft(yScale).ticks(5) as never); }, [xScale, yScale]);
  if (!data || data.points.length === 0) return <ChartEmptyState message="Sin datos de Pareto" />;

  const color: Record<ChartStatus, string> = { front: "#385348", dominated: "#b9c4bd", incomplete: "#d07b4a" };
  return <div className="relative overflow-x-auto rounded-xl border border-[#d7d8cf] bg-[#fbfaf6] p-3">
    <div className="mb-2 flex flex-wrap gap-3 text-xs text-[#52645a]">{Object.entries(data.legend).map(([status, item]) => <span key={status} className="inline-flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.label}</span>)}</div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Frente de Pareto" className="min-w-[560px]">
      <g transform={`translate(${chartMargins.left},${chartMargins.top})`}>
        <g ref={xAxisRef} transform={`translate(0,${size.height})`} />
        <g ref={yAxisRef} />
        <text x={size.width / 2} y={size.height + 44} textAnchor="middle" fill="#385348" fontSize="12">{data.axes.x.label}</text>
        <text transform={`translate(-44,${size.height / 2}) rotate(-90)`} textAnchor="middle" fill="#385348" fontSize="12">{data.axes.y.label}</text>
        {points.map((point) => <circle key={point.id} data-testid={`pareto-point-${point.id}`} aria-label={`${point.id} ${point.status}`} aria-selected={selectedId === point.id} tabIndex={0} cx={xScale(point.x ?? 0)} cy={yScale(point.y ?? 0)} r={selectedId === point.id || hovered === point.id ? 8 : 5} fill={color[point.status]} stroke={selectedId === point.id ? "#111827" : "#fbfaf6"} strokeWidth={selectedId === point.id ? 3 : 2} onMouseEnter={() => setHovered(point.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(point.id)} onBlur={() => setHovered(null)} onClick={() => onSelect?.(point.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect?.(point.id); } }}><title>{`${point.id}: ${point.x}, ${point.y} (${point.status})`}</title></circle>)}
      </g>
    </svg>
    {(selectedId || hovered) && <div className="mt-1 text-xs text-[#718078]">Alternativa seleccionada: {selectedId ?? hovered}</div>}
  </div>;
}
