import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import type { SpatialRepresentation, TransportPayload } from "@/components/UPAO001SpatialViewer";
import { isValidVolumeGeometry } from "@/components/UPAO001MassingViewer3D";

const ArkiRealityView = lazy(() => import("@/components/ArkiRealityView"));

type Props = { projectId: string; onClose: () => void };
export function hasValidRenderGeometry(element: SpatialRepresentation["elements"][number]): boolean {
  const { type, coordinates } = element.geometry;
  if (element.element_type === "BuildingMass") {
    if (type !== "volume" || !Array.isArray(coordinates)) return false;
    return isValidVolumeGeometry(element);
  }
  if (!["BuildingFootprint", "SpatialZone"].includes(element.element_type)) return false;
  const normalizedType = type.toLowerCase();
  if (!["polygon", "multipolygon"].includes(normalizedType) || !Array.isArray(coordinates)) return false;

  // The current renderer draws only one exterior ring. Block holes and multiple
  // polygon parts rather than silently omitting geometry.
  let ring: unknown;
  if (normalizedType === "polygon") {
    if (coordinates.length !== 1) return false; // no interior rings (holes)
    ring = coordinates[0];
  } else {
    if (coordinates.length !== 1 || !Array.isArray(coordinates[0]) || coordinates[0].length !== 1) return false;
    ring = coordinates[0][0]; // one polygon, one exterior ring only
  }
  if (!Array.isArray(ring)) return false;
  const points = ring.filter((point): point is [number, number] =>
    Array.isArray(point) && point.length >= 2 &&
    typeof point[0] === "number" && Number.isFinite(point[0]) &&
    typeof point[1] === "number" && Number.isFinite(point[1])
  );
  const distinct = new Set(points.map(([x, y]) => `${x},${y}`));
  return distinct.size >= 3;
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
        {representation && representation.elements.some(hasValidRenderGeometry) ? <Suspense fallback={<div className="rounded border border-slate-700 p-6 text-sm">Cargando AR existente…</div>}><ArkiRealityView representation={representation} projectId={projectId} /></Suspense> : <div role="status" className="rounded border border-amber-500/50 p-4 text-sm text-amber-200">La alternativa seleccionada no contiene elementos espaciales renderizables (BuildingMass, BuildingFootprint o SpatialZone). AR bloqueado; no se genera geometría de reemplazo.</div>}
      </>}
    </main>
  </div>;
}
