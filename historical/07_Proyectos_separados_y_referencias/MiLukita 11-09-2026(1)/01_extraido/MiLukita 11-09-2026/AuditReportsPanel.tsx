import { useState } from "react";
import { FileDown, FileText, History, RefreshCw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

function formatBytes(value: number) {
  return `${(value / 1024).toFixed(1)} KB`;
}

export default function AuditReportsPanel() {
  const [showPreview, setShowPreview] = useState(false);
  const preview = trpc.operations.auditReportPreview.useQuery(undefined, { enabled: showPreview });
  const history = trpc.operations.auditReportHistory.useQuery({ limit: 20 });
  const utils = trpc.useUtils();
  const generate = trpc.operations.generateAuditReportPdf.useMutation({
    onSuccess: () => history.refetch(),
  });

  const download = async (publicId: string) => {
    const artifact = await utils.operations.auditReportDownload.fetch({ publicId });
    window.open(artifact.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mt-6 border border-amber-200/15 bg-amber-200/[0.04] p-5" aria-labelledby="audit-reports-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 shrink-0 text-amber-200" aria-hidden />
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-amber-200">Documentación administrativa</p>
            <h2 id="audit-reports-title" className="mt-1 text-xl font-bold text-white">Informes de auditoría</h2>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-300">Revisa el informe unificado antes de generar un PDF. Cada generación queda registrada con versión, hash, tamaño y actor administrativo.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowPreview((value) => !value)} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <FileText className="mr-2 h-4 w-4" /> {showPreview ? "Ocultar preview" : "Vista previa"}
          </Button>
          <Button size="sm" onClick={() => generate.mutate()} disabled={generate.isPending} className="gold-button">
            {generate.isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            {generate.isPending ? "Generando…" : "Generar PDF"}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <div className="mt-5 border border-white/10 bg-black/25 p-4">
          {preview.isLoading ? <p className="text-sm text-slate-400">Cargando informe…</p> : null}
          {preview.error ? <p className="text-sm text-rose-200">No se pudo cargar la vista previa.</p> : null}
          {preview.data ? (
            <>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300"><Badge className="border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">{preview.data.lineCount} líneas</Badge><span>{formatBytes(preview.data.byteSize)}</span><span className="truncate">SHA-256: {preview.data.sha256}</span></div>
              <pre className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-5 text-slate-200">{preview.data.markdown}</pre>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><History className="h-4 w-4 text-cyan-200" aria-hidden /><p className="text-sm font-semibold text-white">Historial de PDFs generados</p></div><Button size="sm" variant="ghost" onClick={() => history.refetch()} className="text-slate-300 hover:bg-white/10 hover:text-white"><RefreshCw className="mr-2 h-3.5 w-3.5" /> Actualizar</Button></div>
        <div className="mt-3 divide-y divide-white/10">
          {(history.data ?? []).map((artifact) => <div key={artifact.publicId} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">Versión {artifact.version} · {artifact.title}</p><p className="mt-1 text-[11px] text-slate-400">{new Date(artifact.createdAt).toLocaleString()} · {formatBytes(artifact.byteSize)} · SHA-256 {artifact.sha256.slice(0, 16)}…</p></div><Button size="sm" variant="outline" onClick={() => void download(artifact.publicId)} className="w-fit border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><FileDown className="mr-2 h-3.5 w-3.5" /> Descargar</Button></div>)}
          {!history.data?.length ? <div className="py-5 text-sm text-slate-500">Aún no hay PDFs generados.</div> : null}
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-[11px] text-emerald-100/70"><ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Solo administradores; no se publica en rutas públicas.</p>
    </section>
  );
}
