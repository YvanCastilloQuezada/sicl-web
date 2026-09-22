import { useMemo, useState } from "react";
import { Download, Search, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function TypologyExecutionPanel() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("RES_UNIFAMILIAR");
  const [capacity, setCapacity] = useState("100");
  const [area, setArea] = useState("1000");
  const catalog = trpc.parametricRuntime.typologies.useQuery();
  const search = trpc.parametricRuntime.searchTypologies.useQuery({ query, topK: 8 }, { enabled: query.trim().length > 0 });
  const generate = trpc.parametricRuntime.generateTypology.useMutation({ onSuccess: () => toast.success("Propuesta tipológica generada; requiere revisión humana."), onError: (error) => toast.error(error.message) });
  const validate = trpc.parametricRuntime.validateTypology.useMutation({ onSuccess: () => toast.success("Validación ejecutada sin promover al Core."), onError: (error) => toast.error(error.message) });
  const exportMutation = trpc.parametricRuntime.exportTypology.useMutation({ onSuccess: ({ export: result }) => { const blob = new Blob([result.content], { type: result.mimeType }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = result.fileName; anchor.click(); URL.revokeObjectURL(url); toast.success(`Exportado: ${result.fileName}`); }, onError: (error) => toast.error(error.message) });
  const options = useMemo(() => search.data?.length ? search.data.map((item) => ({ id: item.typologyId, name: item.name })) : (catalog.data?.typologies ?? []).slice(0, 8).map((item) => ({ id: item.id, name: item.name })), [catalog.data?.typologies, search.data]);
  const overrides = { capacity: Number(capacity), area_m2: Number(area) };
  const run = (action: "generate" | "validate" | "export", format?: "JSON" | "GEOJSON" | "SVG") => {
    if (!selected) return;
    if (action === "generate") generate.mutate({ typologyId: selected, overrides });
    if (action === "validate") validate.mutate({ typologyId: selected, overrides });
    if (action === "export" && format) exportMutation.mutate({ typologyId: selected, overrides, format });
  };
  return <Card className="border-[#294765] bg-[#0d223d] text-[#d7e5f4]">
    <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-[#f0a35b]" />Biblioteca ejecutable de tipologías</CardTitle><p className="text-xs text-[#9eb6ce]">Generación conceptual, búsqueda determinista, normativa de referencia y exportación. Todo permanece en propuesta.</p></CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr]">
        <div><label className="mb-1 block text-[11px] uppercase tracking-wide text-[#7893af]">Buscar tipología</label><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7893af]" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="hospital, escuela, parque…" className="border-[#557da5] bg-[#081a30] pl-9 text-[#edf4ff]" /></div></div>
        <div><label className="mb-1 block text-[11px] uppercase tracking-wide text-[#7893af]">Tipología</label><select value={selected} onChange={(e) => setSelected(e.target.value)} className="h-10 w-full rounded-md border border-[#557da5] bg-[#081a30] px-3 text-sm text-[#edf4ff]"><option value="">Seleccionar</option>{options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
        <div className="flex items-end"><Badge className="border-amber-400/30 bg-amber-400/10 text-amber-200">{catalog.data?.typologies.length ?? "…"} referencias</Badge></div>
      </div>
      <div className="grid gap-3 md:grid-cols-2"><Input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} aria-label="Capacidad" placeholder="Capacidad" className="border-[#557da5] bg-[#081a30] text-[#edf4ff]" /><Input type="number" min="1" value={area} onChange={(e) => setArea(e.target.value)} aria-label="Área" placeholder="Área m²" className="border-[#557da5] bg-[#081a30] text-[#edf4ff]" /></div>
      <div className="flex flex-wrap gap-2"><Button onClick={() => run("generate")} disabled={generate.isPending} className="bg-[#f0a35b] text-[#071a30]">Generar propuesta</Button><Button onClick={() => run("validate")} disabled={validate.isPending} variant="outline" className="border-[#557da5] text-[#d7e5f4]"><ShieldCheck className="mr-1.5 h-4 w-4" />Validar</Button><Button onClick={() => run("export", "JSON")} variant="outline" className="border-[#557da5] text-[#d7e5f4]"><Download className="mr-1.5 h-4 w-4" />JSON</Button><Button onClick={() => run("export", "GEOJSON")} variant="outline" className="border-[#557da5] text-[#d7e5f4]">GeoJSON</Button><Button onClick={() => run("export", "SVG")} variant="outline" className="border-[#557da5] text-[#d7e5f4]">SVG</Button></div>
      {query && <div className="rounded-lg border border-[#294765] bg-[#081a30] p-3 text-xs text-[#b8cbe0]"><strong>Resultados:</strong> {search.data?.map((item) => `${item.name} (${Math.round(item.score * 100)}%)`).join(" · ") || "buscando…"}</div>}
      <p className="text-[11px] leading-5 text-[#7893af]">La exportación es conceptual. No crea expedientes, modelos nativos RVT/3DM ni decisiones canónicas. La normativa se debe verificar por país, versión vigente y especialista responsable.</p>
    </CardContent>
  </Card>;
}
