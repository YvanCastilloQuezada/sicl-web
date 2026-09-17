import { useCallback, useEffect, useState } from "react";
import UPAO001SpatialComparison from "@/components/UPAO001SpatialComparison";
import SolarTemporalOverlay, { type EnvironmentalScenarioViewState, type SolarAnalysis } from "@/components/SolarTemporalOverlay";
import type { TransportPayload } from "@/components/UPAO001SpatialViewer";
import ParetoChart from "@/visualization/charts/ParetoChart";
import { transformParetoData, type ParetoCoreResponse } from "@/visualization/models/paretoModel";

export default function SpatialComparisonPage() {
  const [payload, setPayload] = useState<TransportPayload | null>(null);
  const [pareto, setPareto] = useState<ParetoCoreResponse | null>(null);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [solarAnalysis, setSolarAnalysis] = useState<SolarAnalysis | null>(null);
  const [scenario, setScenario] = useState<EnvironmentalScenarioViewState>({ scenarioType: "PROXY_EDUCATIONAL", selectedDate: "", selectedTime: "", activeLayers: ["SUN_POSITION", "SOLAR_RADIATION", "ANALYTICAL_SOLAR_SHADOW", ], locationName: "Trujillo, Peru" });
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
      .then(([spatialBody, paretoBody]) => {
        if (!active) return;
        let derived: Record<string, unknown> | null = null;
        let bounded: Record<string, unknown> | null = null;
        try { derived = JSON.parse(window.sessionStorage.getItem("sims-dei.div-p0.exploration") ?? "null") as Record<string, unknown> | null; bounded = JSON.parse(window.sessionStorage.getItem("sims-dei.gdi.exploration") ?? "null") as Record<string, unknown> | null; } catch { derived = null; bounded = null; }
        const generated = [derived?.representation, ...((bounded?.candidates as Array<Record<string, unknown>> | undefined) ?? []).map((candidate) => candidate.representation)].filter(Boolean) as TransportPayload["representations"];
        const generatedMetrics = generated.reduce<Record<string, Record<string, number>>>((acc, representation) => {
          const candidate = ((bounded?.candidates as Array<Record<string, unknown>> | undefined) ?? []).find((item) => (item.representation as { alternative_id?: string } | undefined)?.alternative_id === representation.alternative_id);
          acc[representation.alternative_id] = (candidate?.metrics as Record<string, number> | undefined) ?? {};
          return acc;
        }, {});
        const generatedExplanations = generated.reduce<Record<string, unknown>>((acc, representation) => { acc[representation.alternative_id] = { parent_alternative_id: ((bounded?.candidates as Array<Record<string, unknown>> | undefined) ?? []).find((item) => (item.representation as { alternative_id?: string } | undefined)?.alternative_id === representation.alternative_id)?.parent_alternative_id ?? derived?.parent_alternative_id, why: "Architect-guided GDI-P1 operation", generated: true }; return acc; }, {});
        const nextPayload = generated.length ? { ...spatialBody.data, representations: [...spatialBody.data.representations, ...generated], metrics: { ...spatialBody.data.metrics, ...generatedMetrics }, explanations: { ...spatialBody.data.explanations, ...generatedExplanations } } : spatialBody.data;
        setPayload(nextPayload); setPareto(paretoBody.data);
      })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Spatial comparison unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const solar = solarAnalysis?.analyses.find((item) => item.alternative_id === selectedAlternativeId) ?? solarAnalysis?.analyses[0];
  return <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8"><div className="mx-auto max-w-[1600px]">{loading && <div role="status" className="rounded border border-border bg-card p-8 text-card-foreground">Loading spatial comparison…</div>}{error && <div role="alert" className="rounded border border-destructive bg-card p-8 text-card-foreground"><h1 className="font-semibold">Spatial comparison unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><p className="mt-2 text-sm text-muted-foreground">The comparison does not fabricate geometry. Configure the Core server-side transport and retry.</p></div>}{payload && pareto && <><UPAO001SpatialComparison payload={payload} selectedAlternativeId={selectedAlternativeId} onSelect={setSelectedAlternativeId} solarAzimuthDegrees={(scenario.activeLayers.includes("SUN_POSITION") || scenario.activeLayers.includes("ANALYTICAL_SOLAR_SHADOW")) ? solar?.derived_metrics.solar_azimuth_degrees : undefined} solarElevationDegrees={scenario.activeLayers.includes("ANALYTICAL_SOLAR_SHADOW") ? solar?.derived_metrics.solar_elevation_degrees : undefined} windSpeedMetersPerSecond={scenario.activeLayers.includes("WEATHER_WIND") ? solar?.derived_metrics.wind_speed_m_s : undefined} windDirectionDegrees={scenario.activeLayers.includes("WEATHER_WIND") ? solar?.derived_metrics.wind_direction_degrees : undefined} activeEnvironmentalLayers={scenario.activeLayers} /><SolarTemporalOverlay selectedAlternativeId={selectedAlternativeId} onAnalysisChange={handleSolarAnalysisChange} onScenarioChange={setScenario} /><section className="rounded-lg border border-border bg-card p-4 text-card-foreground"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">RAW PARETO · UPAO-001</p><ParetoChart data={transformParetoData(pareto)} selectedId={selectedAlternativeId} onSelect={setSelectedAlternativeId} /></section></>}</div></main>;
}
