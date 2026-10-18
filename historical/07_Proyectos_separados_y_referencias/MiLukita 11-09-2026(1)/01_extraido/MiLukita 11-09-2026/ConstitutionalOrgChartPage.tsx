import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ConstitutionalOrgChartPanel from "@/components/ConstitutionalOrgChartPanel";
import { ArrowLeft, LockKeyhole } from "lucide-react";
export default function ConstitutionalOrgChartPage() {
  return <main className="min-h-screen bg-[#06120e] px-4 py-8 text-white sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow text-emerald-200">MiLukita · Governance OS</p><h1 className="font-display mt-2 text-4xl">Organigrama constitucional</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Vista pública de solo lectura para explorar las capas y sus límites. No contiene controles operativos.</p></div><Link href="/"><Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Volver al portal</Button></Link></header><div className="mt-6 flex items-center gap-2 border border-cyan-200/15 bg-cyan-200/5 px-4 py-3 text-xs text-cyan-100"><LockKeyhole className="h-4 w-4" /> Solo lectura · Sin autenticación · Sin permisos sobre MJP CORE</div><ConstitutionalOrgChartPanel /></div></main>;
}
