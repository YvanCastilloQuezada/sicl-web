import { useEffect, useState } from "react";
import { Link } from "wouter";
import QRCode from "qrcode";
import { ArrowLeft, Download, Info, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import MiLukitaCircularQR from "@/components/MiLukitaCircularQR";
import { buildCustomizedQrSvg, buildQrDownloadName, qrMatrixFromData } from "@/lib/customQrGenerator";
import type { CircularQrSource, CircularQrVariant } from "@/../../shared/circularQr";

const PREVIEW_PAYLOAD: Record<string, string> = {
  event: "MILUKITA-QR-PREVIEW",
  destination: "organigrama-constitucional",
  state: "REVIEW_ONLY",
  authority: "NO_AUTHORITATIVE_ROUND",
  createdAt: "2026-08-27",
};

const variants: Array<{ id: CircularQrVariant; title: string; detail: string }> = [
  { id: "central", title: "L Central", detail: "La marca se concentra en el centro de la composición." },
  { id: "circle", title: "L en Círculo", detail: "La L aparece integrada en un anillo de identidad." },
  { id: "integrated", title: "L Integrada", detail: "La marca se presenta como parte del marco visual." },
];

function downloadText(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadPng(svg: string, size: number, name: string) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvas.getContext("2d")?.drawImage(image, 0, 0, size, size);
    URL.revokeObjectURL(url);
    const link = document.createElement("a");
    link.download = name;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}

export default function CircularQrPreviewPage() {
  const [source, setSource] = useState<CircularQrSource>({ imageDataUrl: null, matrix: null, payload: null, targetUrl: null, verifyUrl: null, expiresAt: null, signed: false, available: false });

  useEffect(() => {
    let active = true;
    const generated = QRCode.create(JSON.stringify(PREVIEW_PAYLOAD), { errorCorrectionLevel: "H" });
    const matrix = qrMatrixFromData(generated.modules);
    if (active) {
      setSource({ imageDataUrl: null, matrix, payload: PREVIEW_PAYLOAD, targetUrl: `${window.location.origin}/organigrama-constitucional?preview=qr-circular`, verifyUrl: null, expiresAt: null, signed: false, available: true });
    }
    return () => { active = false; };
  }, []);

  const getVariantSvg = (variant: typeof variants[number]) => source.available ? buildCustomizedQrSvg(source.imageDataUrl ?? "", { matrix: source.matrix ?? undefined, size: 900, label: variant.title, accentColor: "#f5c96a", backgroundColor: "#071a12", variant: variant.id }) : null;
  const handleDownload = (variant: typeof variants[number], format: "svg" | "png") => {
    const svg = getVariantSvg(variant);
    if (!svg) return;
    if (format === "svg") downloadText(svg, buildQrDownloadName(`milukita-${variant.id}`, "svg"), "image/svg+xml;charset=utf-8");
    else downloadPng(svg, 900, buildQrDownloadName(`milukita-${variant.id}`, "png"));
  };

  return <main className="min-h-screen bg-[#06120e] px-5 py-8 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow text-emerald-200">MiLukita · revisión visual</p><h1 className="font-display mt-3 text-4xl sm:text-5xl">QR circular de Lukita</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Vista aproximada de las tres variantes visuales del componente, generada con un payload de demostración para revisar la dirección de arte antes de usar un evento real.</p></div><Link href="/tv" className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"><ArrowLeft className="h-4 w-4" /> Volver a TV</Link></div>
    <div className="mt-8 flex items-start gap-3 border border-amber-200/25 bg-amber-200/10 p-4 text-sm text-amber-50"><Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" /><div><strong className="block">Preview / Review — no es un QR operativo</strong><span className="mt-1 block leading-6 text-amber-100/80">Este enlace permite evaluar el aspecto aproximado. El payload está marcado como `REVIEW_ONLY`, no está firmado, no representa una ronda ni concede participación. El QR autoritativo continúa siendo emitido por MJP CORE.</span></div></div>
    <section className="mt-8 grid gap-5 lg:grid-cols-3" aria-label="Variantes del QR circular MiLukita">{variants.map((variant) => <article key={variant.id} className="border border-emerald-200/20 bg-emerald-200/5 p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-200">Variante {variant.id}</p><h2 className="mt-2 text-xl font-bold">{variant.title}</h2></div><ShieldCheck className="h-5 w-5 text-emerald-200" /></div><div className="mt-6 flex justify-center"><MiLukitaCircularQR source={source} variant={variant.id} size={260} /></div><p className="mt-5 text-sm leading-6 text-slate-300">{variant.detail}</p><div className="mt-5 flex flex-wrap gap-2"><Button type="button" size="sm" onClick={() => handleDownload(variant, "svg")} disabled={!source.available} className="bg-amber-200 text-slate-950 hover:bg-amber-100"><Download className="mr-2 h-3.5 w-3.5" /> SVG</Button><Button type="button" size="sm" variant="outline" onClick={() => handleDownload(variant, "png")} disabled={!source.available} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><Download className="mr-2 h-3.5 w-3.5" /> PNG</Button></div></article>)}</section>
    <section className="mt-8 border border-white/10 bg-black/20 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-200">Contrato de demostración</p><p className="mt-2 text-sm text-slate-300">Estado: <strong className="text-white">{source.available ? "QR generado localmente" : "Preparando imagen QR…"}</strong></p></div><Link href="/organigrama-constitucional" className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/10">Ver organigrama <ExternalLink className="h-3.5 w-3.5" /></Link></div><pre className="mt-4 overflow-auto border border-white/10 bg-[#020806] p-4 text-xs leading-6 text-emerald-100">{JSON.stringify(PREVIEW_PAYLOAD, null, 2)}</pre></section>
  </div></main>;
}
