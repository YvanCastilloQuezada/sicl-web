import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiErrorMessage, siclClient } from "@/api/sicl-client";
import { toast } from "sonner";

const BASE = { alternative_id: "UPAO-001-A", project_id: "UPAO-001", name: "COMPACT", description: "UPAO-001 synthetic pilot", parameters: { strategy: "compact", footprint_ratio: 0.42, floors: 5, floor_to_floor: 3.2, access_side: "south" }, status: "GENERATED", version: 1, source: "SPATIAL_OPERATION_P0" };
type Action = "SCALE_MASS" | "CHANGE_HEIGHT" | "CREATE_COURTYARD" | "SET_GAP" | "MOVE_MASS" | "ROTATE_MASS";

const ACTIONS: Array<{ id: Action; label: string; status: "AVAILABLE" | "PARTIAL" }> = [
  { id: "SCALE_MASS", label: "Scale mass", status: "AVAILABLE" },
  { id: "CHANGE_HEIGHT", label: "Change height", status: "AVAILABLE" },
  { id: "CREATE_COURTYARD", label: "Create courtyard", status: "AVAILABLE" },
  { id: "SET_GAP", label: "Set gap", status: "AVAILABLE" },
  { id: "MOVE_MASS", label: "Move mass", status: "PARTIAL" },
  { id: "ROTATE_MASS", label: "Rotate mass", status: "PARTIAL" },
];

export default function SpatialOperationsPanel({ projectId }: { projectId?: string }) {
  const [action, setAction] = useState<Action>("SCALE_MASS");
  const [selected, setSelected] = useState("MASS_01");
  const [preview, setPreview] = useState<Record<string, unknown>>();
  const [result, setResult] = useState<Record<string, unknown>>();
  const [exploration, setExploration] = useState<Record<string, unknown>>();
  const [mode, setMode] = useState<"DESIGN" | "PLACE">("DESIGN");
  const [pointPreview, setPointPreview] = useState<{ latitude: number; longitude: number }>();
  const [pointResult, setPointResult] = useState<Record<string, unknown>>();
  const [latitude, setLatitude] = useState("-12.0518");
  const [longitude, setLongitude] = useState("-77.0365");
  const [busy, setBusy] = useState(false);

  const selectedAction = useMemo(() => ACTIONS.find((item) => item.id === action), [action]);
  const parameters = useMemo(() => {
    if (action === "CHANGE_HEIGHT") return { floors: 3, target: selected };
    if (action === "SET_GAP") return { distance: 6, target: selected };
    if (action === "CREATE_COURTYARD") return { courtyard_ratio: 0.3, target: selected };
    if (action === "SCALE_MASS") return { footprint_ratio: 0.5, target: selected };
    if (action === "MOVE_MASS") return { dx: 1, dy: 0, target: selected };
    return { angle_degrees: 15, target: selected };
  }, [action, selected]);

  const reset = () => { setPreview(undefined); setResult(undefined); setPointPreview(undefined); setPointResult(undefined); };
  const runPreview = async () => {
    if (!projectId) return;
    reset(); setBusy(true);
    try {
      setPreview(await siclClient.previewSpatialOperation(projectId, { alternative: BASE, operation_type: action, parameters }));
    } catch (error) { toast.error(apiErrorMessage(error)); }
    finally { setBusy(false); }
  };
  const execute = async () => {
    if (!projectId || !preview) return;
    setBusy(true);
    try {
      setResult(await siclClient.executeSpatialOperation(projectId, { alternative: BASE, operation_type: action, parameters, human_confirmed: true }));
      toast.success("Confirmed spatial operation");
    } catch (error) { toast.error(apiErrorMessage(error)); }
    finally { setBusy(false); }
  };
  const previewPoint = () => {
    const next = { latitude: Number(latitude), longitude: Number(longitude) };
    if (!Number.isFinite(next.latitude) || !Number.isFinite(next.longitude)) { toast.error("Enter valid coordinates"); return; }
    setPointResult(undefined); setPointPreview(next);
  };
  const confirmPoint = async () => {
    if (!projectId || !pointPreview) return;
    setBusy(true);
    try {
      const value = await siclClient.createSpatialEvidence(projectId, { statement: "Architect-placed spatial point", evidence_type: "OBSERVATION", spatial_scope: "parcela_sitio", observation_type: "DIRECT_PLACED_POINT", epistemic_state: "HUMAN_CONFIRMED_OBSERVATION", evidence_state: "OBSERVED", observation_point: { ...pointPreview, crs: "EPSG:4326" } });
      setPointResult(value as Record<string, unknown>);
      toast.success("Point confirmed and recorded as evidence");
    } catch (error) { toast.error(apiErrorMessage(error)); }
    finally { setBusy(false); }
  };
  const exploreBounded = async () => {
    if (!projectId) return; setBusy(true);
    try { setExploration(await siclClient.advancedEvolution(projectId, { mode: "BOUNDED_DIVERSE", parent: BASE, direction: "MORE_OPEN", budget: "STANDARD", human_confirmed: true, controls: { floors: { mode: "LOCK", value: 5 }, courtyard_ratio: { mode: "RANGE", min: 0.2, max: 0.35 }, mass_separation: { mode: "RANGE", min: 4, max: 10 } } })); }
    catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  return <Card className="mx-6 mb-3 border-[#385348] bg-white shadow-none" data-testid="direct-spatial-interaction">
    <CardHeader className="pb-2"><CardTitle className="text-base text-[#385348]">Direct spatial interaction · P1</CardTitle><p className="text-xs text-[#718078]">Select → inspect → preview → confirm. Cancel never mutates canonical state.</p></CardHeader>
    <CardContent className="space-y-3 text-xs text-[#1d2925]">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Interaction mode"><Button size="sm" variant={mode === "DESIGN" ? "default" : "outline"} onClick={() => { setMode("DESIGN"); reset(); }}>Design element</Button><Button size="sm" variant={mode === "PLACE" ? "default" : "outline"} onClick={() => { setMode("PLACE"); reset(); }}>Place point</Button></div>
      {mode === "DESIGN" ? <>
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto_auto_auto]">
          <label className="flex flex-col gap-1"><span className="font-semibold">Selected object</span><select aria-label="Selected object" value={selected} onChange={(event) => { setSelected(event.target.value); reset(); }} className="h-9 rounded border bg-white px-2"><option value="MASS_01">Building mass · MASS_01</option><option value="MASS_02">Building mass · MASS_02</option><option value="ALL_MASSES">All masses</option></select></label>
          <label className="flex flex-col gap-1"><span className="font-semibold">Action</span><select aria-label="Spatial action" value={action} onChange={(event) => { setAction(event.target.value as Action); reset(); }} className="h-9 rounded border bg-white px-2">{ACTIONS.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.status}</option>)}</select></label>
          <Button className="self-end" variant="outline" onClick={runPreview} disabled={busy || !projectId}>Preview</Button><Button className="self-end" onClick={execute} disabled={busy || !preview || Boolean(result)}>Confirm</Button><Button className="self-end" variant="ghost" onClick={reset} disabled={busy}>Cancel</Button>
        </div>
        <p className="text-[#718078]">{selectedAction?.status === "PARTIAL" ? `${selectedAction.label} remains PARTIAL: the canonical geometry engine does not yet expose this transformation.` : "The exact numeric parameter remains available through the existing operation contract."}</p>
        {preview && <div className="rounded border bg-[#f8faf7] p-3" data-testid="spatial-preview"><strong>Preview · no canonical mutation</strong><p className="mt-1">{String((preview.parent as { alternative_id?: string })?.alternative_id)} → {String((preview.proposed_child as { alternative_id?: string })?.alternative_id)}</p><p>Operation: {String((preview.operation as { operation_type?: string })?.operation_type)} · target: {String((preview.operation as { target?: string })?.target)}</p><p>Expected effect: deterministic spatial transformation. Inspect before confirmation.</p></div>}
        {result && <div className="rounded border border-[#385348] bg-[#eef1eb] p-3" data-testid="spatial-confirmed"><strong>Confirmed operation</strong><p className="mt-1">Observed effect: SpatialRepresentation and derived metrics were recomputed.</p><p>Human confirmation preserved. No winner, recommendation or decision was created.</p></div>}
        <Button size="sm" variant="outline" onClick={exploreBounded} disabled={busy || !projectId}>Explore bounded design space</Button>
        {exploration && <div className="rounded border border-[#385348] bg-[#eef1eb] p-2"><strong>Bounded exploration</strong><p>{String(exploration.valid_candidate_count)} valid candidates · no automatic winner</p></div>}
      </> : <>
        <div className="grid gap-2 md:grid-cols-2"><label className="flex flex-col gap-1"><span className="font-semibold">Latitude</span><Input value={latitude} onChange={(event) => setLatitude(event.target.value)} inputMode="decimal" /></label><label className="flex flex-col gap-1"><span className="font-semibold">Longitude</span><Input value={longitude} onChange={(event) => setLongitude(event.target.value)} inputMode="decimal" /></label></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={previewPoint}>Preview point</Button><Button onClick={confirmPoint} disabled={busy || !pointPreview || Boolean(pointResult)}>Confirm point</Button><Button variant="ghost" onClick={reset}>Cancel</Button></div>
        {pointPreview && <div className="rounded border bg-[#f8faf7] p-3" data-testid="point-preview"><strong>Point preview · not yet recorded</strong><p className="mt-1">EPSG:4326 · {pointPreview.latitude}, {pointPreview.longitude}</p><p>This reuses canonical spatial Evidence after human confirmation; it is not an AR control point.</p></div>}
        {pointResult && <div className="rounded border border-[#385348] bg-[#eef1eb] p-3" data-testid="point-confirmed"><strong>Point confirmed</strong><p>Recorded through Evidence and Event Log. Decision created: false.</p></div>}
      </>}
    </CardContent>
  </Card>;
}

export { ACTIONS };
