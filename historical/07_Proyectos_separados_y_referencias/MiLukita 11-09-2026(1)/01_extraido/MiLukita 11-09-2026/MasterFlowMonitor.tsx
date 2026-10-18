import { useEffect, useState } from "react";
import { CheckCircle2, Play, Radio, Smartphone, Tv, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stages = [
  ["TV", "Canal / evento autorizado", Tv],
  ["Lukita", "Presentación contextual", Radio],
  ["QR", "Payload firmado disponible", Wifi],
  ["Celular", "Second screen conectado", Smartphone],
  ["Interacción", "Acción virtual confirmada", CheckCircle2],
  ["Resultado", "Resultado leído desde Core", CheckCircle2],
  ["TV siguiente", "Próximo evento", Tv],
] as const;

export default function MasterFlowMonitor() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setStep((current) => { if (current >= stages.length - 1) { window.clearInterval(timer); setRunning(false); return current; } return current + 1; }), 900); return () => window.clearInterval(timer); }, [running]);
  const start = () => { setStep(0); setRunning(true); };
  return <section className="mt-6 border border-cyan-200/15 bg-cyan-200/5 p-5" aria-labelledby="master-flow-title"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-200">Prueba maestra · monitor</p><h2 id="master-flow-title" className="mt-2 text-2xl font-black text-white">TV → QR → celular → siguiente evento</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Recorrido visual reproducible de la cadena de experiencia. Es una simulación de interfaz: no crea rondas ni mueve créditos.</p></div><div className="flex items-center gap-2"><Badge className="border border-cyan-200/20 bg-white/5 text-cyan-100">{running ? "EJECUTANDO" : step === stages.length - 1 ? "COMPLETADA" : "LISTA"}</Badge><Button onClick={start} disabled={running} className="bg-cyan-200 text-[#10251e] hover:bg-cyan-100"><Play className="mr-2 h-4 w-4" /> {running ? "En curso…" : "Iniciar prueba"}</Button></div></div><div className="mt-6 grid gap-2 md:grid-cols-7">{stages.map(([label, description, Icon], index) => <div key={label} title={`${label}: ${description}`} tabIndex={0} aria-label={`${label}. ${description}`} className={`group relative border p-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-200/70 ${index <= step ? "border-emerald-300/40 bg-emerald-300/10" : "border-white/10 bg-black/20"}`}><span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-48 -translate-x-1/2 border border-cyan-200/20 bg-[#061b20] p-2 text-[11px] leading-4 text-cyan-50 shadow-xl group-hover:block group-focus:block">{description}</span><Icon className={`h-5 w-5 ${index <= step ? "text-emerald-200" : "text-slate-500"}`} /><p className="mt-3 text-sm font-bold text-white">{label}</p><p className="mt-1 text-[11px] leading-4 text-slate-400">{description}</p><p className="mt-3 text-[10px] uppercase tracking-[.12em] text-slate-500">{index < step ? "Completado" : index === step ? "Activo" : "Pendiente"}</p></div>)}</div><p className="mt-4 text-xs text-cyan-100/65">Autoridad: MJP CORE · estado mostrado: presentación/observación · cualquier resultado se lee, nunca se inventa.</p></section>;
}
