import React, { useMemo, useState } from "react";
import { scaleTime } from "d3-scale";
import { axisBottom } from "d3-axis";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import ChartEmptyState from "./ChartEmptyState";
import { chartMargins, formatTimestamp, innerSize } from "../lib/d3Setup";
import type { EventData } from "../models/eventModel";

type Props = { data: EventData | null; width?: number; height?: number };

export default function EventTimeline({ data, width = 760, height = 220 }: Props) {
  const axisRef = useRef<SVGGElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const size = innerSize(width, height);
  const events = data?.events ?? [];
  const minTime = data?.timeRange.min;
  const maxTime = data?.timeRange.max;
  const domain = minTime !== null && minTime !== undefined && maxTime !== null && maxTime !== undefined ? [new Date(minTime), new Date(maxTime)] as [Date, Date] : [new Date(0), new Date(1)] as [Date, Date];
  const xScale = useMemo(() => scaleTime().domain(domain).range([0, size.width]), [domain[0]?.getTime(), domain[1]?.getTime(), size.width]);
  useEffect(() => { if (axisRef.current) select(axisRef.current).call(axisBottom(xScale).ticks(5) as never); }, [xScale]);
  if (!data || events.length === 0) return <ChartEmptyState message="Sin eventos" />;
  return <div className="overflow-x-auto rounded-xl border border-[#d7d8cf] bg-[#fbfaf6] p-3">
    <div className="mb-2 flex flex-wrap gap-3 text-xs text-[#52645a]">{Object.entries(data.legend).map(([type, item]) => <span key={type} className="inline-flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.label}</span>)}</div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Timeline de eventos" className="min-w-[560px]">
      <g transform={`translate(${chartMargins.left},${chartMargins.top})`}>
        <g ref={axisRef} transform={`translate(0,${size.height / 2})`} />
        {events.map((event) => <circle key={event.id} cx={xScale(event.x)} cy={size.height / 2} r={selected === event.id ? 7 : 5} fill={data.legend[event.type]?.color ?? "#385348"} onMouseEnter={() => setSelected(event.id)} onMouseLeave={() => setSelected(null)}><title>{`${event.type} · ${formatTimestamp(event.timestamp)}${event.actor ? ` · ${event.actor}` : ""}`}</title></circle>)}
      </g>
    </svg>
    {selected && <div className="mt-1 text-xs text-[#718078]">Evento seleccionado: {selected}</div>}
  </div>;
}
