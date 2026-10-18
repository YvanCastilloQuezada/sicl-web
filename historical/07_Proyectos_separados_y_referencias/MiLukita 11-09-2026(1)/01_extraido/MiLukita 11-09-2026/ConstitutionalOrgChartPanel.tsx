import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers3, Minus, Plus, RotateCcw, Search, ShieldCheck, Download, FileText, X, Maximize2, ChevronDown, ChevronRight, Share2, Sun, Moon, Check } from "lucide-react";
import { MASTER_ORGANIGRAM } from "@/../../shared/milukitaMasterOrder";
import { buildConstitutionalOrgPrintHtml, buildConstitutionalOrgSvg, getUniqueOrgMatch, ORGANIGRAM_DESCRIPTION, type OrgLayer } from "@/lib/constitutionalOrgChartExport";
import { useTheme } from "@/contexts/ThemeContext";
import { LUKITA_LIVE_ARCHITECTURE_CONTRACT } from "@/../../shared/lukitaLiveArchitecture";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function initialView() {
  if (typeof window === "undefined") return { query: "", layer: MASTER_ORGANIGRAM[0].layer };
  const params = new URLSearchParams(window.location.search);
  const layer = params.get("layer");
  return {
    query: params.get("q") ?? "",
    layer: layer && MASTER_ORGANIGRAM.some((item: OrgLayer) => item.layer === layer) ? layer : MASTER_ORGANIGRAM[0].layer,
  };
}

function downloadPng(svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 900;
    const context = canvas.getContext("2d");
    if (!context) { URL.revokeObjectURL(url); return; }
    context.fillStyle = "#06120e";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    const link = document.createElement("a");
    link.download = "milukita-organigrama-constitucional.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}

function openPdfPrint(svg: string) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    window.alert("El navegador bloqueó la ventana de exportación. Permite ventanas emergentes para generar el PDF.");
    return;
  }
  printWindow.document.write(buildConstitutionalOrgPrintHtml(svg));
  printWindow.document.close();
}

export default function ConstitutionalOrgChartPanel() {
  const view = initialView();
  const { theme, toggleTheme } = useTheme();
  const [selectedLayer, setSelectedLayer] = useState<string>(view.layer);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState(view.query);
  const [orgFilter, setOrgFilter] = useState("all");
  const [autoSelectedLayer, setAutoSelectedLayer] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(Boolean(view.query || view.layer));
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">("idle");
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selected: OrgLayer = MASTER_ORGANIGRAM.find((item: OrgLayer) => item.layer === selectedLayer) ?? MASTER_ORGANIGRAM[0];
  const filterOptions = useMemo(() => Array.from(new Set<string>(MASTER_ORGANIGRAM.flatMap((item: OrgLayer) => item.units))).sort((a, b) => a.localeCompare(b)), []);
  const filteredLayers = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return MASTER_ORGANIGRAM.filter((item: OrgLayer) => {
      const matchesQuery = !normalized || `${item.layer} ${item.units.join(" ")}`.toLocaleLowerCase().includes(normalized);
      const matchesFilter = orgFilter === "all" || orgFilter === `layer:${item.layer}` || (orgFilter.startsWith("unit:") && (item.units as readonly string[]).includes(orgFilter.slice(5)));
      return matchesQuery && matchesFilter;
    });
  }, [orgFilter, query]);
  const uniqueMatch = useMemo(() => getUniqueOrgMatch(filteredLayers, query), [filteredLayers, query]);

  useEffect(() => {
    if (!query.trim()) { setAutoSelectedLayer(null); return; }
    if (uniqueMatch) { setSelectedLayer(uniqueMatch.layer); setAutoSelectedLayer(uniqueMatch.layer); }
    else setAutoSelectedLayer(null);
  }, [query, uniqueMatch]);

  useEffect(() => {
    if (orgFilter !== "all" && filteredLayers.length && !filteredLayers.some((item) => item.layer === selectedLayer)) {
      setSelectedLayer(filteredLayers[0].layer);
      setDetailsOpen(true);
    }
  }, [filteredLayers, orgFilter, selectedLayer]);

  const pan = (x: number, y: number) => setOffset((current) => ({ x: clamp(current.x + x, -120, 120), y: clamp(current.y + y, -80, 80) }));
  const resetView = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };
  const clearSearch = () => { setQuery(""); setAutoSelectedLayer(null); };
  const buildExport = () => buildConstitutionalOrgSvg(filteredLayers, selected, query, zoom, offset);
  const openDetails = (layer: OrgLayer) => { setSelectedLayer(layer.layer); setDetailsOpen(true); };
  const toggleBranch = (layer: string) => setExpandedLayers((current) => ({ ...current, [layer]: !current[layer] }));
  const shareCurrentView = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("layer", selectedLayer);
    if (query.trim()) url.searchParams.set("q", query.trim()); else url.searchParams.delete("q");
    const shareData = { title: "Organigrama constitucional MiLukita", text: `Vista de ${selectedLayer}`, url: url.toString() };
    if (navigator.share) {
      try { await navigator.share(shareData); setShareStatus("shared"); return; } catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 2200);
    } catch {
      window.prompt("Copia este enlace de revisión", url.toString());
    }
  };
  const handleNodeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!query.trim() || filteredLayers.length < 2) return;
    const isNext = event.key === "ArrowDown" || event.key === "ArrowRight";
    const isPrevious = event.key === "ArrowUp" || event.key === "ArrowLeft";
    if (!isNext && !isPrevious && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? filteredLayers.length - 1 : (index + (isNext ? 1 : -1) + filteredLayers.length) % filteredLayers.length;
    const nextLayer = filteredLayers[nextIndex];
    setSelectedLayer(nextLayer.layer);
    setAutoSelectedLayer(nextLayer.layer);
    setDetailsOpen(true);
    nodeRefs.current[nextLayer.layer]?.focus();
  };

  return <section data-org-theme={theme} className={`org-chart-panel relative mt-7 border border-emerald-200/15 p-6 sm:p-8 ${theme === "light" ? "org-chart-panel--light" : ""}`} aria-labelledby="org-chart-title">
    <div className="flex items-start justify-between gap-4"><div><Badge className="border border-emerald-200/25 bg-emerald-200/10 text-emerald-100"> <Layers3 className="mr-1.5 h-3.5 w-3.5" /> ARQUITECTURA CONSTITUCIONAL</Badge><h2 id="org-chart-title" className="font-display mt-3 text-3xl text-white">Organigrama interactivo</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Explora las capas de MiLukita, busca roles o departamentos y exporta la vista actual. La capa protegida no es editable por agentes.</p></div><div className="flex items-center gap-2"><Button size="sm" variant="outline" onClick={() => toggleTheme?.()} aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`} title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">{theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}</Button><ShieldCheck className="h-6 w-6 text-emerald-200" /></div></div>
    <section className="mt-6 border border-cyan-200/15 bg-cyan-200/[0.04] p-4" aria-labelledby="lukita-live-layers-title"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">Lukita Live · arquitectura de experiencia</p><h3 id="lukita-live-layers-title" className="mt-1 text-lg font-semibold text-white">La protagonista sobre una plataforma protegida</h3><p className="mt-1 max-w-3xl text-xs leading-5 text-slate-300">Vista contractual de solo lectura: Lukita presenta; los agentes proponen; MJP CORE conserva la verdad autoritativa del juego.</p></div><span className="border border-emerald-200/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200">{LUKITA_LIVE_ARCHITECTURE_CONTRACT.version}</span></div><div className="mt-3 flex flex-wrap gap-2">{LUKITA_LIVE_ARCHITECTURE_CONTRACT.layers.map((layer) => <span key={layer} className={`border px-2 py-1 text-[10px] ${layer === "PROTECTED_MJP_CORE" ? "border-amber-200/40 bg-amber-200/10 text-amber-100" : "border-cyan-200/20 bg-cyan-200/5 text-cyan-100"}`}>{layer}</span>)}</div></section>
    <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><div className="flex max-w-xl flex-1 flex-col gap-2 sm:flex-row"><div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar capa, rol o departamento…" aria-label="Buscar roles o departamentos del organigrama" className="border-white/15 bg-black/20 pl-9 pr-10 text-white placeholder:text-slate-500" />{query && <button type="button" onClick={clearSearch} aria-label="Limpiar búsqueda" title="Limpiar búsqueda" className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-200"><X className="h-4 w-4" /></button>}</div><select value={orgFilter} onChange={(event) => setOrgFilter(event.target.value)} aria-label="Filtrar organigrama por nivel o departamento" className="border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"><option value="all">Todas las capas</option><optgroup label="Nivel jerárquico">{MASTER_ORGANIGRAM.map((item: OrgLayer) => <option key={item.layer} value={`layer:${item.layer}`}>{item.layer}</option>)}</optgroup><optgroup label="Departamento / módulo">{filterOptions.map((unit) => <option key={unit} value={`unit:${unit}`}>{unit}</option>)}</optgroup></select></div><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={shareCurrentView} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">{shareStatus === "copied" ? <Check className="mr-2 h-3.5 w-3.5" /> : <Share2 className="mr-2 h-3.5 w-3.5" />}{shareStatus === "copied" ? "Enlace copiado" : shareStatus === "shared" ? "Compartido" : "Compartir enlace"}</Button><Button size="sm" variant="outline" onClick={() => downloadPng(buildExport())} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><Download className="mr-2 h-3.5 w-3.5" /> Exportar PNG</Button><Button size="sm" variant="outline" onClick={() => openPdfPrint(buildExport())} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><FileText className="mr-2 h-3.5 w-3.5" /> Imprimir / PDF</Button></div></div>
    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-400"><span>{filteredLayers.length} de {MASTER_ORGANIGRAM.length} capas visibles{query ? ` para “${query}”` : ""}{orgFilter !== "all" ? " · filtro activo" : ""}{uniqueMatch ? " · selección automática aplicada" : ""}</span><span>{query && filteredLayers.length > 1 ? "Usa ↑ ↓ ← → para recorrer coincidencias." : "Abre ramas para consultar sus módulos."}</span></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><div><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-slate-400">Zoom {Math.round(zoom * 100)}% · desplazamiento {offset.x}, {offset.y}</p><div className="flex gap-2"><Button size="sm" variant="outline" aria-label="Alejar organigrama" onClick={() => setZoom((value) => clamp(value - 0.1, 0.8, 1.6))} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><Minus className="h-3.5 w-3.5" /></Button><Button size="sm" variant="outline" aria-label="Acercar organigrama" onClick={() => setZoom((value) => clamp(value + 0.1, 0.8, 1.6))} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><Plus className="h-3.5 w-3.5" /></Button><Button size="sm" variant="outline" onClick={resetView} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><RotateCcw className="mr-2 h-3.5 w-3.5" /> Restablecer</Button></div></div><div className="relative border border-white/10 bg-black/20 p-3"><div className="org-chart-minimap" aria-label="Minimapa del organigrama"><span className="org-chart-minimap__title">Mapa</span>{MASTER_ORGANIGRAM.map((item: OrgLayer, index) => <button key={item.layer} type="button" onClick={() => openDetails(item)} className={`org-chart-minimap__node ${item.layer === selectedLayer ? "is-active" : ""}`} style={{ left: `${12 + (index % 3) * 34}%`, top: `${22 + Math.floor(index / 3) * 18}%` }} aria-label={`Ir a ${item.layer}`} title={item.layer} />)}<span className="org-chart-minimap__viewport" style={{ transform: `translate(${offset.x / 2}px, ${offset.y / 2}px) scale(${zoom})` }} aria-hidden="true" /></div><div className="mx-auto max-w-xl space-y-2" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: "center top" }}>{filteredLayers.map((item: OrgLayer, index) => <div key={item.layer} className={`group relative ${item.layer === autoSelectedLayer ? "org-node-auto-selected" : ""} ${orgFilter !== "all" ? "org-node-filter-match" : ""}`}><div className="flex gap-2"><Button ref={(element) => { nodeRefs.current[item.layer] = element; }} type="button" variant="outline" onClick={() => openDetails(item)} onKeyDown={(event) => handleNodeKeyDown(event, index)} title={`${item.layer}: ${ORGANIGRAM_DESCRIPTION[item.layer] ?? "Capa informativa de revisión."}`} aria-label={`Seleccionar ${item.layer}. ${ORGANIGRAM_DESCRIPTION[item.layer] ?? "Capa informativa."}`} className={`flex-1 justify-between border-white/10 bg-black/20 text-left text-white hover:bg-white/10 hover:text-white ${item.layer === selectedLayer ? "border-emerald-200/40 bg-emerald-200/10" : ""} ${item.layer === autoSelectedLayer ? "border-cyan-200/90 bg-cyan-200/15 ring-2 ring-cyan-200/40" : ""}`}><span><span className="mr-3 text-xs text-emerald-200">{String(index + 1).padStart(2, "0")}</span>{item.layer}</span><span className="flex items-center gap-2 text-xs text-slate-400">{item.layer === autoSelectedLayer && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200" aria-label="Coincidencia seleccionada automáticamente" />}{item.units.length} módulos</span></Button><Button type="button" size="sm" variant="outline" onClick={() => toggleBranch(item.layer)} aria-expanded={Boolean(expandedLayers[item.layer])} aria-label={`${expandedLayers[item.layer] ? "Contraer" : "Expandir"} rama ${item.layer}`} title={`${expandedLayers[item.layer] ? "Contraer" : "Expandir"} rama ${item.layer}`} className="shrink-0 border-white/15 bg-black/20 px-2 text-white hover:bg-white/10 hover:text-white">{expandedLayers[item.layer] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</Button></div>{expandedLayers[item.layer] && <div className="org-branch-children ml-4 border-l border-emerald-200/20 pl-4">{item.units.map((unit: string) => <span key={unit} className="inline-flex border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">{unit}</span>)}</div>}<div role="tooltip" className="pointer-events-none absolute bottom-full left-2 z-20 mb-2 hidden w-[min(28rem,calc(100vw-3rem))] border border-emerald-200/25 bg-[#0b2119] p-3 text-xs leading-5 text-emerald-50 shadow-xl group-hover:block group-focus-within:block"><strong className="block text-emerald-200">{item.layer}</strong><span>{ORGANIGRAM_DESCRIPTION[item.layer] ?? "Capa informativa de revisión."}</span><span className="mt-1 block text-slate-300">Roles/módulos: {item.units.join(" · ")}</span></div></div>)}{!filteredLayers.length ? <div className="p-8 text-center text-sm text-slate-400">No encontramos roles o departamentos que coincidan con “{query}”.</div> : null}</div></div><div className="mt-3 flex flex-wrap justify-center gap-2"><Button size="sm" variant="outline" aria-label="Desplazar organigrama a la izquierda" onClick={() => pan(-24, 0)} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">←</Button><Button size="sm" variant="outline" aria-label="Desplazar organigrama hacia arriba" onClick={() => pan(0, -18)} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">↑</Button><Button size="sm" variant="outline" aria-label="Desplazar organigrama hacia abajo" onClick={() => pan(0, 18)} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">↓</Button><Button size="sm" variant="outline" aria-label="Desplazar organigrama a la derecha" onClick={() => pan(24, 0)} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">→</Button></div></div><div className={`relative border border-white/10 bg-black/20 p-5 ${detailsOpen ? "org-details-open" : ""}`} aria-live="polite"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-emerald-200">Capa seleccionada</p><h3 className="mt-2 text-xl font-bold text-white">{detailsOpen ? selected.layer : "Detalles del nodo"}</h3></div>{detailsOpen && <Button size="sm" variant="outline" onClick={() => setDetailsOpen(false)} aria-label="Cerrar detalles del nodo" className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><X className="h-3.5 w-3.5" /></Button>}</div>{detailsOpen ? <><p className="mt-3 text-sm leading-6 text-slate-300">{ORGANIGRAM_DESCRIPTION[selected.layer] ?? "Capa informativa de revisión."}</p><div className="mt-4 flex flex-wrap gap-2">{selected.units.map((unit: string) => <span key={unit} title={`${unit} · módulo de ${selected.layer}`} className="border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200">{unit}</span>)}</div><p className="mt-5 text-xs leading-5 text-slate-400">Vista informativa y de revisión. No concede permisos ni modifica contratos o datos.</p></> : <p className="mt-3 text-sm leading-6 text-slate-400">Haz clic en un nodo, especialmente en la coincidencia resaltada, para desplegar sus detalles aquí.</p>}</div></div>
    <Button type="button" variant="outline" onClick={resetView} className="absolute bottom-5 right-5 rounded-full border-emerald-200/30 bg-[#0b2119]/95 px-4 py-2 text-xs font-bold text-emerald-100 shadow-lg shadow-black/20 hover:bg-emerald-200/15 hover:text-white" title="Ajustar a la pantalla" aria-label="Ajustar organigrama a la pantalla"><Maximize2 className="mr-2 h-3.5 w-3.5" /> Ajustar a la pantalla</Button>
  </section>;
}
