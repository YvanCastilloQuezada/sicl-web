import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import type { SpatialRepresentation, TransportPayload } from "@/components/UPAO001SpatialViewer";

const ArkiRealityView = lazy(() => import("@/components/ArkiRealityView"));

type Props = { projectId: string; onClose: () => void };
function hasValidRenderGeometry(element: SpatialRepresentation["elements"][number]): boolean {
  const { type, coordinates } = element.geometry;
  if (element.element_type === "BuildingMass") {
    if (type !== "volume" || !Array.isArray(coordinates)) return false;
    const vertices = coordinates.filter((point) => Array.isArray(point) && point.length >= 3 && point.slice(0, 3).every((value) => typeof value === "number" && Number.isFinite(value)));
    const height = Number(element.metadata?.height);
    return vertices.length >= 6 && Number.isFinite(height) && height > 0;
  }
  if (!["BuildingFootprint", "SpatialZone"].includes(element.element_type) || !["polygon", "multipolygon"].includes(type.toLowerCase())) return false;
  const pairs: [number, number][] = [];
  const collect = (value: unknown) => {
    if (!Array.isArray(value)) return;
    if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number" && Number.isFinite(value[0]) && Number.isFinite(value[1])) { pairs.push([value[0], value[1]]); return; }
    value.forEach(collect);
  };
  collect(coordinates);
  return new Set(pairs.map(([x, y]) => `${x},${y}`)).size >= 3;
}


export default function CockpitSpatialARModal({ projectId, onClose }: Props) {
  const [payload, setPayload] = useState<TransportPayload | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setPayload(null);
    setSelectedAlternative("");
    fetch("/api/core/v1/projects/" + encodeURIComponent(projectId) + "/spatial-representations", {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`SpatialRepresentation unavailable (${response.status})`);
        return response.json() as Promise<{ data: TransportPayload }>;
      })
      .then((body) => {
        if (!body?.data || !Array.isArray(body.data.representations)) throw new Error("Respuesta espacial inválida: falta representations.");
        if (mounted) {
          setPayload(body.data);
          setSelectedAlternative(body.data.representations[0]?.alternative_id ?? "");
        }
      })
      .catch((reason) => {
        if (mounted) setError(reason instanceof Error ? reason.message : "No se pudo cargar la representación espacial.");
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [projectId]);

  const representation: SpatialRepresentation | undefined = useMemo(
    () => payload?.representations.find((item) => item.alternative_id === selectedAlternative),
    [payload, selectedAlternative],
  );

  return <div className="fixed inset-0 z-[9999] flex flex-col bg-[#071522] text-slate-100">
    <header className="flex items-center justify-between gap-3 border-b border-slate-700 bg-[#0b1d2c] px-4 py-3">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">ARKI · Cockpit / Spatial AR</p>
        <h2 className="truncate text-lg font-semibold">Contexto espacial del proyecto</h2>
        <p className="truncate font-mono text-xs text-slate-400">{projectId}</p>
      </div>
      <button type="button" onClick={onClose} className="rounded border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800">Cerrar</button>
    </header>
    <main className="flex-1 overflow-auto p-4">
      {loading && <div role="status" className="rounded border border-slate-700 p-6 text-sm text-slate-300">Consultando SICL-Core · SpatialRepresentation…</div>}
      {!loading && error && <div role="alert" className="rounded border border-amber-500/50 bg-amber-950/30 p-4 text-sm text-amber-200"><strong>AR bloqueado: no hay representación espacial disponible.</strong><p className="mt-2">{error}</p><p className="mt-2">No se ha creado ni sustituido geometría.</p></div>}
      {!loading && !error && payload && payload.representations.length === 0 && <div role="status" className="rounded border border-amber-500/50 bg-amber-950/30 p-4 text-sm text-amber-200">SICL-Core no devolvió alternativas espaciales para este proyecto. AR no se inicia.</div>}
      {!loading && !error && payload && payload.representations.length > 0 && <>
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded border border-slate-700 p-3">
          <label className="text-sm">Alternativa espacial
            <select value={selectedAlternative} onChange={(event) => setSelectedAlternative(event.target.value)} className="ml-2 rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm">
              {payload.representations.map((item) => <option key={item.alternative_id} value={item.alternative_id}>{item.alternative_id}</option>)}
            </select>
          </label>
          <span className="text-xs text-slate-400">Origen: {payload.provenance} · {payload.read_only ? "solo lectura" : "editable"}</span>
        </div>
        {representation && representation.elements.some(hasValidRenderGeometry)) ? <Suspense fallback={<div className="rounded border border-slate-700 p-6 text-sm">Cargando AR existente…</div>}><ArkiRealityView representation={representation} projectId={projectId} /></Suspense> : <div role="status" className="rounded border border-amber-500/50 p-4 text-sm text-amber-200">La alternativa seleccionada no contiene elementos espaciales renderizables (BuildingMass, BuildingFootprint o SpatialZone). AR bloqueado; no se genera geometría de reemplazo.</div>}
      </>}
    </main>
  </div>;
}
