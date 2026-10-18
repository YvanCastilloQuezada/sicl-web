import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Snowflake, Scale, Network } from "lucide-react";
import { getMasterOrderSummary, MASTER_ORDER, MASTER_ORGANIGRAM } from "@/../../shared/milukitaMasterOrder";
import { getLrciContractSummary } from "@/../../shared/legalAgent";

const stateLabel: Record<string, string> = {
  PLANNED: "PLANNED",
  PARTIALLY_IMPLEMENTED: "PARTIALLY_IMPLEMENTED",
  READY: "READY",
  DISABLED: "DISABLED",
};

export default function MasterOrderStatusPanel() {
  const summary = getMasterOrderSummary();
  const lrci = getLrciContractSummary();
  const experiences = Object.values(MASTER_ORDER.experiences);

  return (
    <Card className="border-cyan-200/20 bg-cyan-200/[.04] p-5 text-white" aria-label="Estado constitucional de MiLukita">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-200">Orden Maestra · Reorientación y consolidación</p>
          <h2 className="mt-1 text-xl font-black">{MASTER_ORDER.commercialDefinition}</h2>
          <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-400">{MASTER_ORDER.strategicDefinition}. La arquitectura prioriza consolidación, evidencia, estabilidad, pruebas, auditoría y documentación; no habilita expansión pública por sí sola.</p>
        </div>
        <Badge className="border border-cyan-200/25 bg-cyan-200/10 text-cyan-100"><Snowflake className="mr-2 h-3.5 w-3.5" />{summary.mode}</Badge>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="border border-white/10 bg-white/[.03] p-3"><div className="flex items-center gap-2 text-xs font-bold text-emerald-100"><ShieldCheck className="h-4 w-4" />MJP CORE protegido</div><p className="mt-2 text-[11px] text-slate-400">{summary.protectedCoreCount} superficies protegidas · sin mutación desde OS comerciales o agentes.</p></div>
        <div className="border border-white/10 bg-white/[.03] p-3"><div className="flex items-center gap-2 text-xs font-bold text-amber-100"><Scale className="h-4 w-4" />Legal & Compliance</div><p className="mt-2 text-[11px] text-slate-400">{summary.legalStatus} · ejecución {summary.legalExecution} · autonomía 0.</p></div>
        <div className="border border-white/10 bg-white/[.03] p-3"><p className="text-xs font-bold text-cyan-100">Capas constitucionales</p><p className="mt-2 text-[11px] text-slate-400">{summary.constitutionalLayers} capas · {summary.qualityGateCount} quality gates.</p></div>
        <div className="border border-white/10 bg-white/[.03] p-3"><p className="text-xs font-bold text-violet-100">Legal Claim Guard</p><p className="mt-2 text-[11px] text-slate-400">{summary.legalClaimGuard} · reservado y deshabilitado.</p><p className="mt-1 text-[10px] text-slate-500">LRCI: {lrci.status} · {lrci.execution} · autonomía {lrci.autonomy}.</p></div>
      </div>

      <div className="mt-4 border border-white/10 bg-white/[.02] p-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-slate-400"><Network className="h-4 w-4 text-cyan-200" />Tres experiencias oficiales</div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">{experiences.map((experience) => <div key={experience.name} className="border border-white/10 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-bold text-white">{experience.name}</p><Badge className="border border-white/15 bg-white/5 text-[10px] text-slate-300">{stateLabel[experience.state] ?? experience.state}</Badge></div><p className="mt-2 text-[11px] leading-5 text-slate-400">{experience.purpose}</p><p className="mt-2 text-[10px] uppercase tracking-[.1em] text-amber-100">Ejecución: {stateLabel[experience.execution] ?? experience.execution}</p></div>)}</div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{MASTER_ORGANIGRAM.map((group) => <div key={group.layer} className="border border-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">{group.layer}</p><p className="mt-2 text-xs leading-5 text-slate-300">{group.units.join(" · ")}</p></div>)}</div>
      <p className="mt-4 text-[11px] text-slate-500">ID de orden: {summary.id}. Registro arquitectónico informativo; no equivale a autorización jurídica, operación externa ni aprobación productiva.</p>
    </Card>
  );
}
