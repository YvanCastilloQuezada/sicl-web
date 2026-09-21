import { useMemo, useState } from "react";
import { AlertTriangle, Box, ExternalLink, FileUp, Link2, Ruler, ShieldCheck, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

const SAMPLE_MODELS = [{
  modelId: "ARK-SAMPLE-COORDINATION",
  name: "Ejemplo de coordinación interdisciplinaria",
  format: "ARK" as const,
  version: "1.0",
  units: "m",
  coordinateSystem: "LOCAL",
  sourceIds: ["SAMPLE-ARCH", "SAMPLE-SANITARY"],
  humanReviewRequired: true as const,
  elements: [
    { id: "WALL-001", kind: "WALL" as const, name: "Muro de arquitectura", discipline: "ARCHITECTURE", box: { min: [0, 0, 0] as [number, number, number], max: [5, 0.25, 3] as [number, number, number] }, sourceId: "SAMPLE-ARCH" },
    { id: "PIPE-001", kind: "PIPE" as const, name: "Tubería sanitaria", discipline: "SANITARY", box: { min: [2, -0.15, 1] as [number, number, number], max: [3, 0.35, 2] as [number, number, number] }, sourceId: "SAMPLE-SANITARY" },
  ],
}];

export default function ArkiBimViewerPage() {
  const [inspection, setInspection] = useState<{ fileName: string; status: string; format?: string; checksum?: string; adapter?: { status: string; input: string; boundary: string } }>();
  const [selectedFile, setSelectedFile] = useState("");
  const contract = trpc.bimViewer.contract.useQuery();
  const inspect = trpc.bimViewer.inspect.useMutation({ onSuccess: setInspection });
  const inspectIfc4 = trpc.bimViewer.inspectIfc4.useMutation();
  const clashes = trpc.bimViewer.clashes.useMutation();
  const [clashResult, setClashResult] = useState<Awaited<ReturnType<typeof clashes.mutateAsync>> | null>(null);
  const [ifcResult, setIfcResult] = useState<{ status: string; schema?: string | null; recordCount?: number; geometryDecoded?: boolean; warnings?: string[] } | null>(null);
  const predimensioning = trpc.transversal.predimensioning.useMutation();

  const previewBoxes = useMemo(() => SAMPLE_MODELS[0].elements.map((element, index) => ({ ...element, x: 92 + index * 180, y: 145 - index * 22 })), []);
  const projectId = "BIM-DEMO-001";

  async function readFile(file: File) {
    setSelectedFile(file.name);
    const content = await file.text();
    if (/\.ifc$/i.test(file.name)) { const parsed = await inspectIfc4.mutateAsync({ projectId, content }); setIfcResult(parsed); }
    else inspect.mutate({ projectId, fileName: file.name, content });
  }

  async function runClashCheck() {
    const result = await clashes.mutateAsync({ projectId, models: SAMPLE_MODELS, tolerance: 0.001 });
    setClashResult(result);
  }

  async function runPredimensioning() {
    await predimensioning.mutateAsync({ projectId, use: "HOUSE", floors: 2, typicalSpanM: 5, floorToFloorM: 3, structuralSystem: "REINFORCED_CONCRETE_FRAME", columnWidthM: 0.3, columnDepthM: 0.3, beamDepthM: 0.4, slabThicknessM: 0.15, wetAreaCount: 4, electricalRoomCount: 1, hvacRequired: false, healthcareCritical: false, serviceShaftCount: 1 });
  }

  return <main className="min-h-screen bg-background px-5 py-8 text-foreground md:px-10">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-2xl border border-[#f0a35b]/40 bg-[#f0a35b]/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a35c22]">ARKI-BIM-VISOR · BIM</p><h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">Visor BIM y coordinación interdisciplinaria</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Visor canónico sobre ARK, preparado para normalizar IFC y DWG, y para conectar Revit y MicroStation mediante hosts autorizados. Las interferencias son incidencias abiertas, no aprobaciones automáticas.</p></div>
          <Button asChild className="bg-[#f0a35b] text-black hover:bg-[#f6c995]"><a href="/arki-parametric-runtime"><ExternalLink className="mr-2 h-4 w-4" />Usar ARKI-Parametric</a></Button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Box className="h-5 w-5 text-[#d07b4a]" />Vista previa canónica ARK</CardTitle></CardHeader><CardContent>
          <div className="overflow-hidden rounded-xl border border-border bg-slate-950 p-3"><svg viewBox="0 0 620 320" role="img" aria-label="Vista previa BIM de coordinación" className="h-auto w-full"><defs><linearGradient id="bim-bg" x1="0" x2="1"><stop offset="0" stopColor="#0f172a" /><stop offset="1" stopColor="#172554" /></linearGradient></defs><rect width="620" height="320" rx="12" fill="url(#bim-bg)" /><path d="M40 265H580M52 48V278" stroke="#334155" strokeDasharray="5 7" /><text x="48" y="38" fill="#cbd5e1" fontSize="13">ARK normalized coordination scene · LOCAL / m</text>{previewBoxes.map((element) => <g key={element.id}><rect x={element.x} y={element.y} width="230" height="74" rx="5" fill={element.kind === "PIPE" ? "#38bdf8" : "#f59e0b"} fillOpacity="0.35" stroke={element.kind === "PIPE" ? "#38bdf8" : "#f59e0b"} strokeWidth="3" /><text x={element.x + 10} y={element.y + 28} fill="#f8fafc" fontSize="14">{element.name}</text><text x={element.x + 10} y={element.y + 51} fill="#cbd5e1" fontSize="11">{element.discipline} · {element.id}</text></g>)}</svg></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Formato canónico</p><p className="mt-1 font-semibold">ARK</p></div><div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Modelos de muestra</p><p className="mt-1 font-semibold">{SAMPLE_MODELS.length}</p></div><div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Revisión</p><p className="mt-1 font-semibold">Humana final</p></div></div>
        </CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileUp className="h-5 w-5 text-[#d07b4a]" />Importar y normalizar</CardTitle></CardHeader><CardContent className="space-y-4"><label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d07b4a]/60 bg-[#d07b4a]/5 p-6 text-center"><UploadCloud className="h-8 w-8 text-[#d07b4a]" /><span className="mt-2 text-sm font-semibold">Seleccionar ARK, IFC, RVT, DGN o DWG</span><span className="mt-1 text-xs text-muted-foreground">IFC4 se inspecciona sin ejecutar contenido; la geometría requiere adaptador antes de declarar PASS.</span><input className="sr-only" type="file" accept=".ark,.ifc,.rvt,.dgn,.dwg" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file); }} /></label>{selectedFile && <p className="text-sm text-muted-foreground">Archivo: <strong>{selectedFile}</strong></p>}{ifcResult && <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/5 p-3 text-sm"><div className="flex items-center justify-between"><span>Parser IFC4</span><Badge>{ifcResult.status}</Badge></div><p className="mt-2 text-xs text-muted-foreground">Esquema: {ifcResult.schema ?? "UNKNOWN"} · Entidades: {ifcResult.recordCount ?? 0} · Geometría decodificada: {ifcResult.geometryDecoded ? "sí" : "no"}</p>{ifcResult.warnings?.map((warning) => <p className="mt-1 text-xs text-amber-600" key={warning}>{warning}</p>)}</div>}{inspection && <div className="rounded-lg border border-border p-3 text-sm"><div className="flex items-center justify-between"><span>Estado</span><Badge>{inspection.status}</Badge></div>{inspection.format && <p className="mt-2">Formato: {inspection.format}</p>}{inspection.adapter && <p className="mt-2 text-xs text-muted-foreground">{inspection.adapter.boundary}</p>}</div>}<div className="flex flex-wrap gap-2"><Button variant="outline" asChild><a href="/arki-host-connections"><Link2 className="mr-2 h-4 w-4" />Configurar host Revit/Dynamo</a></Button></div><div className="space-y-2 text-xs text-muted-foreground">{contract.data?.formats && Object.entries(contract.data.formats).map(([format, adapter]) => <div className="flex items-center justify-between rounded border border-border px-3 py-2" key={format}><span>{format}</span><span>{adapter.status}</span></div>)}</div></CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />Interferencias</CardTitle></CardHeader><CardContent><div className="flex flex-wrap items-center gap-3"><Button onClick={() => void runClashCheck()} disabled={clashes.isPending}><AlertTriangle className="mr-2 h-4 w-4" />{clashes.isPending ? "Analizando…" : "Ejecutar detección de interferencias"}</Button><Button variant="outline" asChild><a href="/arki-parametric-runtime"><ShieldCheck className="mr-2 h-4 w-4" />Abrir runtime paramétrico</a></Button></div>{clashResult && <div className="mt-5 grid gap-4 md:grid-cols-3"><div className="rounded-lg border border-border p-4"><p className="text-xs text-muted-foreground">Estado</p><p className="mt-1 font-semibold">{clashResult.status}</p></div><div className="rounded-lg border border-border p-4"><p className="text-xs text-muted-foreground">Pares revisados</p><p className="mt-1 font-semibold">{clashResult.checkedPairs}</p></div><div className="rounded-lg border border-border p-4"><p className="text-xs text-muted-foreground">Incidencias abiertas</p><p className="mt-1 font-semibold text-amber-600">{clashResult.interferences.length}</p></div>{clashResult.interferences.map((issue) => <div className="md:col-span-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4" key={issue.id}><div className="flex flex-wrap items-center justify-between gap-2"><strong>{issue.id} · {issue.severity}</strong><Badge variant="outline">{issue.status}</Badge></div><p className="mt-2 text-sm">{issue.leftElementId} ↔ {issue.rightElementId} · {issue.disciplines.join(" / ")}</p><p className="mt-1 text-xs text-muted-foreground">{issue.reason}</p></div>)}</div>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Ruler className="h-5 w-5 text-[#d07b4a]" />Predimensionamiento transversal</CardTitle></CardHeader><CardContent><p className="max-w-3xl text-sm text-muted-foreground">Antes de coordinar interferencias, ARKI revisa preliminarmente columnas, vigas, losas, shafts sanitarios, cuartos eléctricos y requisitos HVAC. El resultado orienta el diseño y no sustituye el cálculo firmado.</p><Button className="mt-4 bg-[#d07b4a] text-white hover:bg-[#b8653d]" onClick={() => void runPredimensioning()} disabled={predimensioning.isPending}><Ruler className="mr-2 h-4 w-4" />{predimensioning.isPending ? "Revisando…" : "Ejecutar predimensionamiento de ejemplo"}</Button>{predimensioning.data && <div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Estado</p><p className="mt-1 font-semibold">{predimensioning.data.status}</p></div><div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Comprobaciones</p><p className="mt-1 font-semibold">{predimensioning.data.checks.length}</p></div><div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Gate siguiente</p><p className="mt-1 text-sm font-semibold">{predimensioning.data.downstreamGate}</p></div><div className="md:col-span-3 space-y-2">{predimensioning.data.checks.map((check) => <div className="rounded border border-border p-3 text-sm" key={check.id}><div className="flex flex-wrap justify-between gap-2"><strong>{check.id} · {check.title}</strong><Badge variant="outline">{check.status}</Badge></div><p className="mt-1 text-muted-foreground">{check.finding}</p><p className="mt-1 text-xs text-muted-foreground">{check.recommendedAction}</p></div>)}</div></div>}</CardContent></Card>
    </div>
  </main>;
}
