import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import SolarTemporalOverlay, { type SolarAnalysis } from "@/components/SolarTemporalOverlay";
import type { TransportPayload } from "@/components/UPAO001SpatialViewer";
import ParetoChart from "@/visualization/charts/ParetoChart";
import { transformParetoData, type ParetoCoreResponse } from "@/visualization/models/paretoModel";

const UPAO001SpatialComparison = lazy(() => import("@/components/UPAO001SpatialComparison"));

export default function SpatialComparisonPage() {
  const [payload, setPayload] = useState<TransportPayload | null>(null);
  const [pareto, setPareto] = useState<ParetoCoreResponse | null>(null);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [solarAnalysis, setSolarAnalysis] = useState<SolarAnalysis | null>(null);
  const handleSolarAnalysisChange = useCallback((value: SolarAnalysis | null) => setSolarAnalysis(value), []);
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
  const solar = solarAnalysis?.analyses.find((item) => item.alternative_id === selectedAlternativeId) ?? solarAnalysis?.analyses[0];
  return <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8"><div className="mx-auto max-w-[1600px]">{loading && <div role="status" className="rounded border border-border bg-card p-8 text-card-foreground">Loading spatial comparison…</div>}{error && <div role="alert" className="rounded border border-destructive bg-card p-8 text-card-foreground"><h1 className="font-semibold">Spatial comparison unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><p className="mt-2 text-sm text-muted-foreground">The comparison does not fabricate geometry. Configure the Core server-side transport and retry.</p></div>}{payload && pareto && <><section className="mb-6 rounded-lg border border-border bg-card p-4 text-card-foreground"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">RAW PARETO · UPAO-001</p><ParetoChart data={transformParetoData(pareto)} selectedId={selectedAlternativeId} onSelect={setSelectedAlternativeId} /></section><SolarTemporalOverlay selectedAlternativeId={selectedAlternativeId} onAnalysisChange={handleSolarAnalysisChange} /><Suspense fallback={<div role="status" className="rounded border border-border bg-card p-8 text-card-foreground">Loading 3D comparison tools…</div>}><UPAO001SpatialComparison payload={payload} selectedAlternativeId={selectedAlternativeId} onSelect={setSelectedAlternativeId} solarAzimuthDegrees={solar?.derived_metrics.solar_azimuth_degrees} solarElevationDegrees={solar?.derived_metrics.solar_elevation_degrees} /></Suspense></>}</div></main>;
}
