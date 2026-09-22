import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Droplets, Download, Play, RotateCcw, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LanguageSelector from "@/components/LanguageSelector";
import { trpc } from "@/lib/trpc";
import { ARKI_SPECIFIC_PARAMETERS, parametersByDomain, type ParameterDomain } from "@shared/arkiTypologyParameters";

type Primitive = string | number | boolean;
const DOMAINS: Array<{ id: ParameterDomain; label: string }> = [
  { id: "CAPACITY", label: "Capacidad" },
  { id: "GEOMETRY", label: "Geometría" },
  { id: "CIRCULATION", label: "Circulación" },
  { id: "ENVIRONMENT", label: "Ambiente" },
  { id: "SERVICES", label: "Servicios" },
  { id: "COST", label: "Costos" },
];

export default function ArkiGeneratorPage() {
  const [projectId, setProjectId] = useState("TIT-001");
  const [projectName, setProjectName] = useState("Parque Lacustre Titicaca");
  const [query, setQuery] = useState("");
  const [selectedTypology, setSelectedTypology] = useState("LAND_HUMEDAL_ARTIFICIAL");
  const [country, setCountry] = useState("PE");
  const [jurisdiction, setJurisdiction] = useState("Perú · sitio por verificar");
  const [overrides, setOverrides] = useState<Record<string, Primitive>>({ area_m2: 3500, capacity: 20000, levels: 1 });
  const [openDomains, setOpenDomains] = useState<Record<string, boolean>>({ CAPACITY: true, GEOMETRY: true, CIRCULATION: false, ENVIRONMENT: false, SERVICES: false, COST: false });
  const [water, setWater] = useState({ precipitationAnnualMm: 2800, catchmentRoofAreaM2: 3500, consumptionLitersPerPersonDay: 100, annualVisitors: 20000, residents: 50, location: "Iquitos", projectLocation: "Lago Titicaca" });
  const [waterResult, setWaterResult] = useState<any>(null);

  const typologies = trpc.parametricRuntime.typologies.useQuery();
  const parameterContract = trpc.parametricRuntime.parameterContract.useQuery();
  const stateContract = trpc.parametricRuntime.projectStateContract.useQuery();
  const geometryCatalog = trpc.parametricRuntime.specializedGeometry.useQuery();
  const normativeSources = trpc.parametricRuntime.normativeSources.useQuery();
  const generate = trpc.parametricRuntime.generateTypology.useMutation({ onSuccess: (data) => { setGeneration(data.generation); toast.success("Propuesta conceptual generada"); }, onError: (error) => toast.error(error.message) });
  const validate = trpc.parametricRuntime.validateTypology.useMutation({ onSuccess: () => toast.success("Validación normativa preparada para revisión humana"), onError: (error) => toast.error(error.message) });
  const waterBalance = trpc.parametricRuntime.waterBalance.useMutation({ onSuccess: (data) => { setWaterResult(data.result); toast.success("Balance hídrico calculado como propuesta"); }, onError: (error) => toast.error(error.message) });
  const createState = trpc.parametricRuntime.createProjectState.useMutation({ onSuccess: () => toast.success("Project State creado como propuesta"), onError: (error) => toast.error(error.message) });
  const [generation, setGeneration] = useState<any>(null);

  const filteredTypologies = useMemo(() => (typologies.data?.typologies ?? []).filter((item: any) => `${item.name} ${item.id} ${item.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 80), [typologies.data?.typologies, query]);
  const selected = (typologies.data?.typologies ?? []).find((item: any) => item.id === selectedTypology) as any;
  const updateOverride = (key: string, value: string) => setOverrides((current) => ({ ...current, [key]: Number.isNaN(Number(value)) ? value : Number(value) }));
  const runGeneration = () => generate.mutate({ typologyId: selectedTypology, overrides, country, jurisdiction });
  const reset = () => { setOverrides({ area_m2: 3500, capacity: 20000, levels: 1 }); setGeneration(null); setWaterResult(null); };
  const download = () => { if (!generation) return; const blob = new Blob([JSON.stringify(generation, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${selectedTypology.toLowerCase()}-propuesta.json`; a.click(); URL.revokeObjectURL(url); };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#edf4ff]">
      <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-[#273445] px-5 py-3">
        <div className="flex items-center gap-4"><div className="flex items-center gap-2 text-[#f0a35b]"><Sparkles className="h-5 w-5" /><span className="font-semibold tracking-[0.18em]">ARKI</span></div><div><div className="font-medium">Generador Paramétrico</div><div className="text-xs text-[#91a4b8]">{projectName} · propuesta gobernada</div></div></div>
        <div className="hidden items-center gap-2 md:flex"><LanguageSelector /><Badge className="border border-amber-300/30 bg-amber-400/10 text-amber-100">AI_PROPOSED</Badge><Badge className="border border-emerald-300/30 bg-emerald-400/10 text-emerald-100">Revisión humana requerida</Badge><Button variant="outline" className="border-[#40536a] text-[#d7e5f4]" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />Reiniciar</Button><Button className="bg-[#f0a35b] text-black hover:bg-[#ffc98f]" onClick={runGeneration} disabled={generate.isPending}><Play className="mr-2 h-4 w-4" />{generate.isPending ? "Generando…" : "Generar"}</Button></div>
      </header>
      <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-[310px_minmax(420px,1fr)_340px]">
        <aside className="border-b border-[#273445] bg-[#111821] p-4 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7e5f4]">Parámetros</h2><Badge variant="outline" className="border-[#40536a] text-[#91a4b8]">{ARKI_SPECIFIC_PARAMETERS.length}</Badge></div>
          <div className="mb-4 space-y-2"><Input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project ID" className="border-[#34485e] bg-[#0d1117] font-mono text-xs" /><Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Nombre del proyecto" className="border-[#34485e] bg-[#0d1117] text-xs" /><div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#71859b]" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar tipología…" className="border-[#34485e] bg-[#0d1117] pl-8 text-xs" /></div></div>
          <Select value={selectedTypology} onValueChange={setSelectedTypology}><SelectTrigger className="mb-4 border-[#f0a35b]/50 bg-[#1b2028] text-xs"><SelectValue placeholder="Seleccionar tipología" /></SelectTrigger><SelectContent>{filteredTypologies.map((item: any) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select>
          <div className="max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto pr-1">{DOMAINS.map((domain) => { const params = parametersByDomain(domain.id); const open = openDomains[domain.id]; return <div key={domain.id} className="border-b border-[#273445] pb-2"><button className="flex w-full items-center gap-2 py-2 text-left text-xs font-medium text-[#c8d8e8]" onClick={() => setOpenDomains((v) => ({ ...v, [domain.id]: !v[domain.id] }))}>{open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}<span>{domain.label}</span><span className="ml-auto text-[#71859b]">{params.length}</span></button>{open && <div className="space-y-3 pb-2">{params.map((param) => <label key={param.key} className="block text-[11px] text-[#91a4b8]"><span className="mb-1 flex justify-between"><span>{param.label}</span><span className="font-mono text-[#d7e5f4]">{String(overrides[param.key] ?? param.defaultValue)} {param.unit}</span></span><input type="range" min={param.min ?? 0} max={param.max ?? Math.max(Number(param.defaultValue) * 3, 10)} step={param.max !== undefined && param.max <= 1 ? 0.01 : 1} value={Number(overrides[param.key] ?? param.defaultValue)} onChange={(e) => updateOverride(param.key, e.target.value)} className="w-full accent-[#f0a35b]" /></label>)}</div>}</div>; })}</div>
        </aside>
        <main className="flex min-h-[680px] flex-col bg-[#0d1117] p-4 lg:p-6">
          <div className="mb-3 flex items-center justify-between"><div><div className="text-xs uppercase tracking-[0.18em] text-[#f0a35b]">Visor conceptual</div><h1 className="mt-1 text-xl font-semibold">{generation?.typology?.name ?? selected?.name ?? "Selecciona una tipología"}</h1></div><div className="flex gap-2"><Badge variant="outline" className="border-[#40536a] text-[#91a4b8]">3D · Perspectiva</Badge><Button size="sm" variant="outline" className="border-[#40536a] text-[#d7e5f4]" onClick={download} disabled={!generation}><Download className="mr-2 h-3.5 w-3.5" />JSON</Button></div></div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded border border-[#273445] bg-[radial-gradient(circle_at_50%_45%,#22364a_0%,#111821_48%,#0d1117_100%)]"><div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#89a2bb 1px, transparent 1px), linear-gradient(90deg, #89a2bb 1px, transparent 1px)", backgroundSize: "42px 42px" }} /><div className="relative h-[46%] w-[58%] min-w-[240px] max-w-[520px] border border-[#f0a35b] bg-[#f0a35b]/15 shadow-[0_0_70px_rgba(240,163,91,0.18)]" style={{ transform: "perspective(680px) rotateX(58deg) rotateZ(-8deg)" }}><div className="absolute inset-5 border border-[#f0a35b]/50" /><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs text-[#ffd5a8]">{generation?.geometry ? `${generation.geometry.widthM} × ${generation.geometry.depthM} m` : "Genera una propuesta para visualizar"}</div></div><div className="absolute bottom-4 left-4 text-xs text-[#71859b]">Geometría conceptual · sin mutación del Core · no sustituye expediente técnico</div></div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#273445] pt-3 text-xs md:grid-cols-4"><Metric label="Elementos" value={generation?.specializedGeometry?.metrics?.zone_count ?? "—"} /><Metric label="Área" value={generation?.metrics?.areaConstructedM2 ? `${generation.metrics.areaConstructedM2} m²` : "—"} /><Metric label="Niveles" value={generation?.geometry?.floors ?? "—"} /><Metric label="Estado" value="PROPUESTA" /></div>
        </main>
        <aside className="space-y-4 border-t border-[#273445] bg-[#111821] p-4 lg:border-l lg:border-t-0"><Card className="border-[#273445] bg-[#151d27]"><CardHeader className="pb-3"><CardTitle className="text-sm">Métricas y gates</CardTitle></CardHeader><CardContent className="space-y-3 text-xs">{generation ? <><Row label="Costo conceptual" value={`USD ${generation.metrics.estimatedCostUsdConceptual?.toLocaleString()}`} /><Row label="Jurisdicción" value={generation.jurisdiction} /><Row label="Evidencias" value={`${generation.evidenceRequired.length} requeridas`} /></> : <p className="text-[#91a4b8]">Genera una propuesta para ver métricas derivadas, geometría especializada y evidencias requeridas.</p>}<div className="flex items-center gap-2 border-t border-[#273445] pt-3 text-emerald-200"><ShieldCheck className="h-4 w-4" />{stateContract.data?.mutation ?? "OPTIMISTIC_VERSIONED_COMMIT"}</div></CardContent></Card>
          <Card className="border-[#273445] bg-[#151d27]"><CardHeader className="pb-3"><CardTitle className="text-sm">Validación normativa</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-xs text-[#91a4b8]">Fuentes: {normativeSources.data?.count ?? "—"}. La validación es referencial y exige revisión profesional.</p><Button className="w-full bg-[#294765] hover:bg-[#365d83]" disabled={validate.isPending} onClick={() => validate.mutate({ typologyId: selectedTypology, overrides, country, jurisdiction })}>{validate.isPending ? "Validando…" : "Validar contra reglas"}</Button></CardContent></Card>
          <Card className="border-[#273445] bg-[#151d27]"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Droplets className="h-4 w-4 text-cyan-300" />Balance hídrico anual</CardTitle></CardHeader><CardContent className="space-y-2"><div className="grid grid-cols-2 gap-2">{([['precipitationAnnualMm','Precipitación mm'],['catchmentRoofAreaM2','Techos m²'],['annualVisitors','Visitantes/año'],['residents','Residentes']] as const).map(([key, label]) => <label key={key} className="text-[10px] text-[#91a4b8]">{label}<Input type="number" value={water[key]} onChange={(e) => setWater({ ...water, [key]: Number(e.target.value) })} className="mt-1 h-8 border-[#34485e] bg-[#0d1117] font-mono text-xs" /></label>)}</div><div className="grid grid-cols-2 gap-2"><Input value={water.location} onChange={(e) => setWater({ ...water, location: e.target.value })} placeholder="Clima de referencia" className="border-[#34485e] bg-[#0d1117] text-xs" /><Input value={water.projectLocation} onChange={(e) => setWater({ ...water, projectLocation: e.target.value })} placeholder="Sitio de proyecto" className="border-[#34485e] bg-[#0d1117] text-xs" /></div><Button variant="outline" className="w-full border-cyan-400/40 text-cyan-100" disabled={waterBalance.isPending} onClick={() => waterBalance.mutate({ projectId, ...water, consumptionLitersPerPersonDay: 100 })}>{waterBalance.isPending ? "Calculando…" : "Calcular balance"}</Button>{waterResult && <div className="space-y-1 border-t border-[#273445] pt-2 text-xs"><Row label="Captación bruta" value={`${waterResult.calculations.grossRainwaterCaptureM3PerYear.toLocaleString()} m³/año`} /><Row label="Consumo total" value={`${waterResult.calculations.totalConsumptionM3PerYear.toLocaleString()} m³/año`} /><Row label="Balance neto bruto" value={`${waterResult.calculations.netBalanceM3PerYear.toLocaleString()} m³/año`} /><div className="flex gap-2 pt-1 text-amber-200"><AlertTriangle className="h-4 w-4 shrink-0" /><span>{waterResult.warnings?.[0] ?? waterResult.missingData?.[0]}</span></div></div>}</CardContent></Card>
          <Card className="border-[#273445] bg-[#151d27]"><CardHeader className="pb-3"><CardTitle className="text-sm">Project State</CardTitle></CardHeader><CardContent className="space-y-2"><Textarea placeholder="Describe la propuesta o los cambios para registrar…" className="min-h-[70px] border-[#34485e] bg-[#0d1117] text-xs" /><Button variant="outline" className="w-full border-[#40536a] text-[#d7e5f4]" onClick={() => createState.mutate({ projectId, parameters: overrides, metrics: generation?.metrics ?? {}, provenance: ["ARKI-GENERATOR-26"], unknowns: ["sitio_verificado", "revisión_profesional"] })}><CheckCircle2 className="mr-2 h-4 w-4" />Preparar propuesta de estado</Button></CardContent></Card><div className="text-[10px] leading-4 text-[#71859b]">{parameterContract.data?.values ?? "Los valores predeterminados son conceptuales, no hechos."} · Geometría: {geometryCatalog.data?.execution ?? "CONCEPTUAL"}</div></aside>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) { return <div><div className="text-[#71859b]">{label}</div><div className="mt-1 font-mono text-[#d7e5f4]">{value}</div></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-3"><span className="text-[#91a4b8]">{label}</span><span className="font-mono text-[#d7e5f4]">{value}</span></div>; }
