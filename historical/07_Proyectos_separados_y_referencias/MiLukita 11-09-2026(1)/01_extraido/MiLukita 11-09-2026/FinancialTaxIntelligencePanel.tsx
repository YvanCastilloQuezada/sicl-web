import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Calculator, FileSearch, ShieldCheck } from "lucide-react";

const tone = (value: string) => value === "OBSERVED" ? "bg-emerald-300" : value === "PLANNED" ? "bg-cyan-300" : "bg-amber-300";
export default function FinancialTaxIntelligencePanel() {
  const projection = trpc.operations.financialProjection.useQuery(undefined, { refetchInterval: 10_000 });
  const rows = [
    { label: "Proyección financiera", value: projection.data ? "OBSERVED" : "NO_DATA", progress: projection.data ? 100 : 0, note: projection.data ? "Escenario administrativo disponible" : "Sin datos de proyección" },
    { label: "Auditoría de premios", value: "NO_DATA", progress: 0, note: "Requiere evidencia operativa persistente" },
    { label: "Tax Intelligence", value: "PLANNED", progress: 0, note: "Sin asesoría tributaria automática" },
    { label: "Costos externos", value: "NO_DATA", progress: 0, note: "No hay proveedores ni cobros reales activos" },
  ];
  return <section className="mt-7 border border-violet-200/15 bg-violet-200/5 p-6 sm:p-8" aria-labelledby="financial-tax-title"><div className="flex items-start justify-between gap-4"><div><Badge className="border border-violet-200/25 bg-violet-200/10 text-violet-100"><Calculator className="mr-1.5 h-3.5 w-3.5" /> BUSINESS OS</Badge><h2 id="financial-tax-title" className="font-display mt-3 text-3xl text-white">Financial / Tax Intelligence</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Pruebas y auditorías observables, con progreso basado en evidencia disponible; sin completar artificialmente los estados.</p></div><FileSearch className="h-6 w-6 text-violet-200" /></div><div className="mt-6 grid gap-3 md:grid-cols-2">{rows.map((row) => <div key={row.label} className="border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-white">{row.label}</p><Badge className={row.value === "OBSERVED" ? "border-emerald-200/20 bg-emerald-200/10 text-emerald-100" : "border-amber-200/20 bg-amber-200/10 text-amber-100"}>{row.value}</Badge></div><div className="mt-3 h-2 w-full bg-white/10" role="progressbar" aria-label={`Progreso ${row.label}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={row.progress}><div className={`h-2 ${tone(row.value)}`} style={{ width: `${row.progress}%` }} /></div><p className="mt-2 text-xs text-slate-400">{row.progress}% · {row.note}</p></div>)}</div><div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-violet-100/75"><ShieldCheck className="h-4 w-4" /> No modifica precios, créditos, wallet, ledger, impuestos reales ni liquidación.</div></section>;
}
