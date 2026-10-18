import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Activity, BadgeCheck, Clock3, Download, FileCheck2, Gauge, ImageDown, QrCode, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MjpTvManifest } from "../../../shared/tvManifest";
import { MILUKITA_BRAND } from "../../../shared/brandSystem";

type Props = { manifest: MjpTvManifest };

function formatUpdate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function Stat({ icon: Icon, label, value, detail, tone = "emerald" }: { icon: typeof Activity; label: string; value: string; detail: string; tone?: "emerald" | "gold" | "slate" | "amber" }) {
  const tones = { emerald: "text-emerald-200 bg-emerald-300/10", gold: "text-amber-200 bg-amber-200/10", slate: "text-slate-200 bg-white/10", amber: "text-amber-100 bg-amber-200/15" };
  return <div className="border border-white/10 bg-white/[.03] p-4 transition-colors duration-200 hover:border-emerald-300/25"><div className={`grid h-9 w-9 place-items-center rounded-full ${tones[tone]}`}><Icon className="h-4 w-4" /></div><p className="mt-4 text-xs uppercase tracking-[.14em] text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></div>;
}

export default function ManifestStatsPanel({ manifest }: Props) {
  const [isUpdated, setIsUpdated] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [brandName, setBrandName] = useState(() => window.localStorage.getItem("mjp-export-brand-name") ?? MILUKITA_BRAND.name);
  const [includeWatermark, setIncludeWatermark] = useState(() => window.localStorage.getItem("mjp-export-watermark") !== "false");
  const previousSequence = useRef(manifest.sequence);
  useEffect(() => {
    if (previousSequence.current === manifest.sequence) return;
    previousSequence.current = manifest.sequence;
    setIsUpdated(true);
    const timer = window.setTimeout(() => setIsUpdated(false), 950);
    return () => window.clearTimeout(timer);
  }, [manifest.sequence]);

  const countdown = manifest.countdown.seconds === null ? "—" : `${manifest.countdown.seconds}s`;
  const participation = manifest.participation.allowed ? "Abierta" : "Cerrada";
  const recovery = manifest.recovery.mode === "NORMAL" ? "Normal" : "Contingencia";

  const exportAsImage = () => {
    setIsExporting(true);
    setExportMessage(null);
    window.localStorage.setItem("mjp-export-brand-name", brandName.trim() || MILUKITA_BRAND.name);
    window.localStorage.setItem("mjp-export-watermark", String(includeWatermark));
    const safe = (value: string) => value.replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[character] ?? character);
    const rows = [
      ["Estado", manifest.event.status, `${manifest.event.gameName} · ${manifest.event.gameId}`],
      ["Cuenta regresiva", countdown, manifest.countdown.basedOn === "SERVER_CLOSE_AT" ? "Basada en cierre del servidor" : "Sin cuenta activa"],
      ["Participantes", String(manifest.participation.confirmedCount), participation],
      ["QR de acceso", manifest.qr.available ? "Disponible" : "No disponible", manifest.qr.signed ? "Firmado y con expiración" : "Solo durante ronda abierta"],
      ["Resultado", manifest.result.verified ? "Verificado" : "Pendiente", manifest.result.available ? "Valor publicado en el manifest" : "Aún no publicado"],
      ["Reglas", manifest.event.rulesVersion ?? "—", "Ruleset asociado al evento"],
      ["Canal", recovery, manifest.recovery.message ?? "Último estado confirmado"],
      ["Actualización", formatUpdate(manifest.generatedAt), "Hora local de visualización"],
    ];
    const watermark = includeWatermark ? `<text x="700" y="510" text-anchor="middle" fill="#9cf4d0" fill-opacity=".08" font-family="Arial,sans-serif" font-size="72" font-weight="700" transform="rotate(-28 700 510)">${safe(brandName.trim() || MILUKITA_BRAND.name)}</text>` : "";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="930" viewBox="0 0 1400 930"><rect width="1400" height="930" fill="#08150f"/><rect x="36" y="36" width="1328" height="858" rx="24" fill="#0b2118" stroke="#5ee8b6" stroke-opacity=".35"/><text x="78" y="102" fill="#9cf4d0" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="4">DATOS DEL MANIFEST</text><text x="78" y="164" fill="#ffffff" font-family="Georgia,serif" font-size="48">Panel operativo en tiempo real</text><text x="78" y="210" fill="#a8bdb4" font-family="Arial,sans-serif" font-size="22">${safe(manifest.event.gameName)} · Secuencia ${manifest.sequence}</text>${rows.map(([label, value, detail], index) => { const x = 78 + (index % 2) * 650; const y = 280 + Math.floor(index / 2) * 130; return `<rect x="${x}" y="${y}" width="590" height="96" rx="14" fill="#ffffff" fill-opacity=".04" stroke="#ffffff" stroke-opacity=".12"/><text x="${x + 22}" y="${y + 29}" fill="#82998f" font-family="Arial,sans-serif" font-size="16" letter-spacing="2">${safe(label.toUpperCase())}</text><text x="${x + 22}" y="${y + 61}" fill="#ffffff" font-family="Arial,sans-serif" font-size="25" font-weight="700">${safe(value)}</text><text x="${x + 22}" y="${y + 83}" fill="#a8bdb4" font-family="Arial,sans-serif" font-size="14">${safe(detail)}</text>`; }).join("")}${watermark}<text x="78" y="850" fill="#9cf4d0" font-family="Arial,sans-serif" font-size="16">${safe(brandName.trim() || MILUKITA_BRAND.name)} · MJP CORE · ${safe(manifest.participation.mode)} · SOLO CRÉDITOS VIRTUALES · ${safe(manifest.event.eventId)}</text></svg>`;
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1400;
      canvas.height = 930;
      const context = canvas.getContext("2d");
      if (!context) { setIsExporting(false); setExportMessage("No se pudo crear la imagen en este navegador."); return; }
      context.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) { setIsExporting(false); setExportMessage("No se pudo preparar la descarga."); return; }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `milukita-event-${manifest.event.eventId}-${manifest.sequence}.png`;
        link.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setExportMessage("Imagen descargada.");
      }, "image/png");
    };
    image.onerror = () => { setIsExporting(false); setExportMessage("No se pudo generar la imagen."); };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  return <section className={`manifest-stats-panel mt-8 border border-emerald-300/15 bg-[#0b1712] p-5 sm:p-6 ${isUpdated ? "manifest-stats-updated" : ""}`} aria-label="Estadísticas del evento desde el manifest"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="eyebrow text-emerald-200">{MILUKITA_BRAND.eventsName} · Datos del manifest</p><h2 className="font-display mt-2 text-3xl text-white">Panel operativo en tiempo real</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Valores leídos directamente de la última versión confirmada por {MILUKITA_BRAND.technicalCore}; no son estimaciones del navegador.</p></div><div className="flex flex-wrap items-center gap-2"><Badge className="w-fit border border-emerald-300/20 bg-emerald-300/10 text-emerald-100"><Activity className="mr-1.5 h-3.5 w-3.5" /> Secuencia {manifest.sequence}</Badge><Button type="button" variant="outline" onClick={exportAsImage} disabled={isExporting} className="border-emerald-300/25 bg-emerald-300/10 text-xs text-emerald-100 hover:bg-emerald-300/20">{isExporting ? <Download className="mr-1.5 h-3.5 w-3.5 animate-pulse" /> : <ImageDown className="mr-1.5 h-3.5 w-3.5" />}{isExporting ? "Preparando…" : "Exportar PNG"}</Button></div></div>{exportMessage ?       <p className="mt-3 text-xs font-semibold text-emerald-200" role="status" aria-live="polite">{exportMessage}</p> : null}<div className="mt-4 grid gap-3 border border-white/10 bg-white/[.02] p-3 sm:grid-cols-[1fr_auto] sm:items-end" aria-label="Personalización de exportación"><label className="text-xs text-slate-400">Marca de agua o logotipo textual<input value={brandName} onChange={(event: ChangeEvent<HTMLInputElement>) => { const value = event.currentTarget.value; setBrandName(value); window.localStorage.setItem("mjp-export-brand-name", value.trim() || MILUKITA_BRAND.name); }} maxLength={48} className="mt-1 block w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/60" placeholder={MILUKITA_BRAND.name} /></label><label className="flex items-center gap-2 pb-2 text-xs text-slate-300"><input type="checkbox" checked={includeWatermark} onChange={(event: ChangeEvent<HTMLInputElement>) => { setIncludeWatermark(event.currentTarget.checked); window.localStorage.setItem("mjp-export-watermark", String(event.currentTarget.checked)); }} /> Incluir marca de agua</label></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat icon={Gauge} label="Estado" value={manifest.event.status} detail={`${manifest.event.gameName} · ${manifest.event.gameId}`} tone={manifest.event.status === "RESULT_VERIFIED" ? "gold" : "emerald"} /><Stat icon={Clock3} label="Cuenta regresiva" value={countdown} detail={manifest.countdown.basedOn === "SERVER_CLOSE_AT" ? "Basada en cierre del servidor" : "Sin cuenta activa"} tone="gold" /><Stat icon={Users} label="Participantes" value={String(manifest.participation.confirmedCount)} detail={participation} /><Stat icon={QrCode} label="QR de acceso" value={manifest.qr.available ? "Disponible" : "No disponible"} detail={manifest.qr.signed ? "Firmado y con expiración" : "Solo durante ronda abierta"} tone={manifest.qr.available ? "emerald" : "slate"} /></div><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat icon={BadgeCheck} label="Resultado" value={manifest.result.verified ? "Verificado" : "Pendiente"} detail={manifest.result.available ? "Valor publicado en el manifest" : "Aún no publicado"} tone={manifest.result.verified ? "gold" : "slate"} /><Stat icon={FileCheck2} label="Reglas" value={manifest.event.rulesVersion ?? "—"} detail="Ruleset asociado al evento" tone="slate" /><Stat icon={Activity} label="Canal" value={recovery} detail={manifest.recovery.message ?? "Último estado confirmado"} tone={recovery === "Normal" ? "emerald" : "amber"} /><Stat icon={Clock3} label="Última actualización" value={formatUpdate(manifest.generatedAt)} detail="Hora local de visualización" tone="slate" /></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-500"><span>Evento: <strong className="text-slate-300">{manifest.event.eventId}</strong></span><span>Modo: <strong className="text-emerald-200">{manifest.participation.mode}</strong> · Sin dinero real</span></div></section>;
}
