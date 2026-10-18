import { useEffect, useState } from "react";
import { Palette, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ADMIN_TIMER_PALETTE_STORAGE_KEY, DEFAULT_TIMER_PALETTE, normalizeTimerPalette, timerPaletteContrastReport, TIMER_PALETTE_EVENT, type TimerPalette } from "@/lib/customQrGenerator";

export default function TimerPaletteAdminPanel() {
  const [palette, setPalette] = useState<TimerPalette>(DEFAULT_TIMER_PALETTE);
  const [name, setName] = useState("Mi paleta de marca");
  const [status, setStatus] = useState("");
  const palettes = trpc.operations.qrTimerPalettes.useQuery(undefined, { refetchInterval: 30_000 });
  const savePalette = trpc.operations.qrTimerPaletteSave.useMutation({ onSuccess: (saved) => { publishLocal(saved.palette); void palettes.refetch(); setStatus(`Paleta “${saved.name}” guardada y activa`); window.setTimeout(() => setStatus(""), 2600); }, onError: (error) => setStatus(`No se pudo guardar: ${error.message}`) });
  const activatePalette = trpc.operations.qrTimerPaletteActivate.useMutation({ onSuccess: (active) => { publishLocal(active.palette); void palettes.refetch(); setStatus(`Paleta “${active.name}” activada`); window.setTimeout(() => setStatus(""), 2600); }, onError: (error) => setStatus(`No se pudo activar: ${error.message}`) });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(ADMIN_TIMER_PALETTE_STORAGE_KEY) ?? "null") as Partial<TimerPalette> | null;
      if (stored) setPalette(normalizeTimerPalette(stored));
    } catch { setPalette(DEFAULT_TIMER_PALETTE); }
  }, []);

  const publishLocal = (next: TimerPalette) => {
    const safePalette = normalizeTimerPalette(next);
    setPalette(safePalette);
    localStorage.setItem(ADMIN_TIMER_PALETTE_STORAGE_KEY, JSON.stringify(safePalette));
    window.dispatchEvent(new CustomEvent(TIMER_PALETTE_EVENT, { detail: safePalette }));
  };
  const contrastReport = timerPaletteContrastReport(palette);
  const publish = () => savePalette.mutate({ name: name.trim() || "Paleta de marca", palette, activate: true });
  const reset = () => { publishLocal(DEFAULT_TIMER_PALETTE); localStorage.removeItem(ADMIN_TIMER_PALETTE_STORAGE_KEY); setStatus("Se restauró la paleta base"); window.setTimeout(() => setStatus(""), 2600); };

  return <section className="mt-6 border border-cyan-200/15 bg-cyan-200/5 p-5">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-200">Configuración visual administrativa</p><h3 className="mt-2 text-xl font-bold text-white">Paleta temporal de marca</h3><p className="mt-2 max-w-2xl text-xs leading-5 text-slate-300">Guarda y activa paletas para compartirlas entre sesiones autenticadas. La configuración es visual y no modifica `MjpTvManifest`, resultados ni MJP CORE.</p></div><Palette className="h-5 w-5 shrink-0 text-cyan-200" /></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]"><input value={name} onChange={(event) => setName(event.target.value)} aria-label="Nombre de la paleta" placeholder="Nombre de la paleta" className="h-10 border border-white/15 bg-black/20 px-3 text-sm text-white placeholder:text-slate-500" />{(["green", "yellow", "orange", "red"] as const).map((key) => <label key={key} className="text-xs text-slate-300"><span className="mb-2 block">{key === "green" ? "Inicio" : key === "yellow" ? "Amarillo" : key === "orange" ? "Naranja" : "Final"}</span><input type="color" value={palette[key]} onChange={(event) => setPalette((current) => ({ ...current, [key]: event.target.value }))} aria-label={`Paleta administrativa ${key}`} className="h-10 w-full cursor-pointer border border-white/15 bg-black/20 p-1" /></label>)}</div>
    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400" aria-label="Reporte de contraste WCAG"><span>Contraste no textual AA (3:1):</span>{contrastReport.map((item) => <span key={item.stage} className={item.passesNonTextAA ? "text-emerald-200" : "text-amber-200"}>{item.stage} {item.ratio}:1 {item.passesNonTextAA ? "OK" : "revisar"}</span>)}</div>
    <div className="mt-4 flex flex-wrap items-center gap-2"><Button size="sm" onClick={publish} disabled={savePalette.isPending} className="bg-cyan-200 text-slate-950 hover:bg-cyan-100"><Save className="mr-2 h-3.5 w-3.5" />{savePalette.isPending ? "Guardando…" : "Guardar y activar"}</Button><Button size="sm" variant="outline" onClick={reset} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><RefreshCw className="mr-2 h-3.5 w-3.5" />Restaurar base</Button>{status && <span className="text-xs text-emerald-200" role="status">{status}</span>}</div>
    <div className="mt-4 border-t border-white/10 pt-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Historial de paletas y restauración</p><p className="mt-1 text-xs leading-5 text-slate-500">Cada versión conserva su fecha. “Restaurar” activa una versión anterior sin alterar el payload QR ni el manifest.</p><div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{(palettes.data ?? []).map((item) => <div key={item.publicId} className="flex items-center justify-between gap-3 border border-white/10 bg-black/15 p-3"><div className="min-w-0"><p className="truncate text-sm text-white">{item.name}</p><p className="text-[11px] text-slate-500">{item.isActive ? "Activa" : "Guardada · " + new Date(item.updatedAt).toLocaleString()}</p></div><Button size="sm" variant="outline" disabled={item.isActive || activatePalette.isPending} onClick={() => activatePalette.mutate({ publicId: item.publicId })} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">{item.isActive ? "Activa" : "Restaurar"}</Button></div>)}{!palettes.data?.length && <p className="text-xs text-slate-500">Todavía no hay paletas guardadas.</p>}</div></div>
  </section>;
}
