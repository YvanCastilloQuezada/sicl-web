import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { ArrowLeft, ExternalLink, LoaderCircle, QrCode, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

function getReturnPath() {
  const params = new URLSearchParams(window.location.search);
  return params.get("return") || "/";
}

export default function LukaContextQrPage() {
  const [, navigate] = useLocation();
  const returnPath = useMemo(getReturnPath, []);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrError, setQrError] = useState("");
  const activeShare = trpc.share.resolveActive.useQuery({}, { retry: false, staleTime: 30_000 });
  const targetPath = activeShare.data?.destinationPath || "/portal";
  const targetUrl = useMemo(() => `${window.location.origin}${targetPath.startsWith("/") ? targetPath : `/${targetPath}`}`, [targetPath]);
  const status = activeShare.isPending ? "Resolviendo contexto…" : activeShare.data ? "Contexto activo" : "Acceso público de LUKA";

  useEffect(() => {
    let cancelled = false;
    setQrError("");
    void QRCode.toDataURL(targetUrl, { width: 360, margin: 2, errorCorrectionLevel: "H", color: { dark: "#07110d", light: "#f4fffb" } })
      .then((url) => { if (!cancelled) setQrDataUrl(url); })
      .catch(() => { if (!cancelled) setQrError("No se pudo generar la vista QR."); });
    return () => { cancelled = true; };
  }, [targetUrl]);

  const close = () => {
    if (window.history.length > 1) window.history.back();
    else navigate(returnPath);
  };

  return (
    <main className="min-h-screen bg-[#020908] px-5 py-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={close} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" />Volver</Button>
          <span className="font-display text-lg text-amber-200">L★</span>
        </header>
        <section className="mt-8 flex flex-1 flex-col items-center justify-center rounded-[2rem] border border-cyan-200/25 bg-[radial-gradient(circle_at_50%_15%,rgba(39,245,208,.16),transparent_36%),#071512] p-6 text-center shadow-[0_0_60px_rgba(39,245,208,.12)]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-cyan-100/75"><QrCode className="h-4 w-4" />Acceso contextual</div>
          <h1 className="mt-4 font-display text-3xl text-white">LUKA te acompaña</h1>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">Este QR abre el contexto disponible y no concede permisos, roles ni acceso al núcleo del sistema.</p>
          <div className="mt-6 min-h-[300px] w-full max-w-[300px] rounded-[1.5rem] border border-cyan-100/40 bg-[#f4fffb] p-4 shadow-[0_0_35px_rgba(39,245,208,.2)]">
            {activeShare.isPending ? <div className="grid h-full min-h-[260px] place-items-center text-slate-700"><LoaderCircle className="h-8 w-8 animate-spin" /></div> : qrDataUrl ? <img src={qrDataUrl} alt="Código QR contextual de LUKA" className="h-full w-full object-contain" /> : <div className="grid h-full min-h-[260px] place-items-center text-sm text-slate-700">{qrError || "Preparando QR…"}</div>}
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-200"><ShieldCheck className="h-4 w-4" />{status}</div>
          <p className="mt-2 max-w-xs break-all text-xs text-slate-500">Destino: {targetUrl}</p>
          {activeShare.data?.resolution ? <p className="mt-2 text-xs uppercase tracking-[.14em] text-cyan-100/60">Resolución: {activeShare.data.resolution}</p> : null}
          <Button type="button" onClick={() => window.open(targetUrl, "_blank", "noopener,noreferrer")} className="mt-6 w-full bg-cyan-200 text-slate-950 hover:bg-cyan-100"><ExternalLink className="mr-2 h-4 w-4" />Abrir destino</Button>
        </section>
        <p className="pt-5 text-center text-xs text-slate-500">Al cerrar, volverás al estado anterior de LUKA.</p>
      </div>
    </main>
  );
}
