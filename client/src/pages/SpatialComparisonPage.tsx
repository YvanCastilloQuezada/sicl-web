import { useEffect, useState } from "react";
import UPAO001SpatialComparison from "@/components/UPAO001SpatialComparison";
import type { TransportPayload } from "@/components/UPAO001SpatialViewer";
import ParetoChart from "@/visualization/charts/ParetoChart";
import { transformParetoData, type ParetoCoreResponse } from "@/visualization/models/paretoModel";

export default function SpatialComparisonPage() {
  const [payload, setPayload] = useState<TransportPayload | null>(null);
  const [pareto, setPareto] = useState<ParetoCoreResponse | null>(null);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/core/v1/projects/UPAO-001/spatial-representations", { headers: { accept: "application/json" } }),
      fetch("/api/core/v1/examples/UPAO-001/pareto", { headers: { accept: "application/json" } }),
    ])
      .then(async ([spatialResponse, paretoResponse]) => {
        if (!spatialResponse.ok) throw new Error(`Core spatial representation unavailable (${spatialResponse.status})`);
        if (!paretoResponse.ok) throw new Error(`Core Pareto transport unavailable (${paretoResponse.status})`);
        return Promise.all([
          spatialResponse.json() as Promise<{ data: TransportPayload }>,
          paretoResponse.json() as Promise<{ data: ParetoCoreResponse }>,
        ]);
      })
      .then(([spatialBody, paretoBody]) => { if (active) { setPayload(spatialBody.data); setPareto(paretoBody.data); } })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Spatial comparison unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8"><div className="mx-auto max-w-[1600px]">{loading && <div role="status" className="rounded border border-border bg-card p-8 text-card-foreground">Loading spatial comparison…</div>}{error && <div role="alert" className="rounded border border-destructive bg-card p-8 text-card-foreground"><h1 className="font-semibold">Spatial comparison unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><p className="mt-2 text-sm text-muted-foreground">The comparison does not fabricate geometry. Configure the Core server-side transport and retry.</p></div>}{payload && pareto && <><section className="mb-6 rounded-lg border border-border bg-card p-4 text-card-foreground"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">RAW PARETO · UPAO-001</p><ParetoChart data={transformParetoData(pareto)} selectedId={selectedAlternativeId} onSelect={setSelectedAlternativeId} /></section><UPAO001SpatialComparison payload={payload} selectedAlternativeId={selectedAlternativeId} onSelect={setSelectedAlternativeId} /></>}</div></main>;
}
