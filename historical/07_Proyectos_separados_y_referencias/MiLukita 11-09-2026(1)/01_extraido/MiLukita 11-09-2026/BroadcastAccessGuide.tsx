import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Radio, Smartphone, Tv, Monitor, Tablet, Wifi } from "lucide-react";

type Mode = "live" | "online";

const DEVICES = [
  { icon: Tv, device: "Smart TV", access: "Jugar en vivo", interaction: "Ver la transmisión y escanear el QR con el celular.", note: "La TV muestra el sorteo; el celular confirma la participación." },
  { icon: Monitor, device: "Computadora / laptop", access: "Jugar en vivo o en línea", interaction: "Abrir el canal TV en una pestaña o entrar directamente a un juego.", note: "Recomendado para operación, overlay y verificación." },
  { icon: Tablet, device: "Tablet", access: "Jugar en vivo o en línea", interaction: "Tocar el botón elegido y seleccionar números en pantalla.", note: "La experiencia se adapta al ancho táctil." },
  { icon: Smartphone, device: "Celular", access: "Jugar en línea", interaction: "Abrir el enlace del QR y confirmar desde la PWA/web móvil.", note: "También puede ver la TV, pero el QR abre la ronda directamente." },
];

export default function BroadcastAccessGuide() {
  const [mode, setMode] = useState<Mode>("live");
  const [transitioning, setTransitioning] = useState(false);
  const current = useMemo(() => DEVICES.filter((item) => mode === "live" ? item.access.includes("vivo") : item.access.includes("línea")), [mode]);
  const changeMode = (next: Mode) => {
    if (next === mode || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => { setMode(next); setTransitioning(false); }, 120);
  };
  return <section className="mt-8 rounded-[2rem] border border-cyan-200/15 bg-[#0a1d22] p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="eyebrow text-cyan-200">Elige tu acceso</p><h2 className="font-display mt-2 text-3xl text-white sm:text-4xl">¿Jugar en vivo o jugar en línea?</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">La opción depende del dispositivo y de si deseas mirar la emisión o entrar directamente al juego virtual.</p></div><div className="flex flex-wrap gap-2" role="tablist" aria-label="Modo de acceso"><Button type="button" role="tab" aria-selected={mode === "live"} onClick={() => changeMode("live")} className={mode === "live" ? "gold-button" : "border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"}><Radio className="mr-2 h-4 w-4" /> Jugar en vivo</Button><Button type="button" role="tab" aria-selected={mode === "online"} variant="outline" onClick={() => changeMode("online")} className={mode === "online" ? "border-cyan-200/40 bg-cyan-200/15 text-cyan-50" : "border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"}><Wifi className="mr-2 h-4 w-4" /> Jugar en línea</Button></div></div><div className={`mt-6 transition duration-150 ease-out motion-reduce:transition-none ${transitioning ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`} aria-live="polite"><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left text-sm"><thead><tr className="border-b border-white/10 text-xs uppercase tracking-[.12em] text-cyan-100"><th className="px-3 py-3">Dispositivo</th><th className="px-3 py-3">Acceso sugerido</th><th className="px-3 py-3">Interacción</th><th className="px-3 py-3">Nota</th></tr></thead><tbody>{current.map(({ icon: Icon, device, access, interaction, note }) => <tr key={device} className="border-b border-white/8 align-top text-slate-300"><td className="px-3 py-4 font-bold text-white"><Icon className="mr-2 inline h-4 w-4 text-emerald-300" />{device}</td><td className="px-3 py-4 text-emerald-100">{access}</td><td className="px-3 py-4">{interaction}</td><td className="px-3 py-4 text-slate-400">{note}</td></tr>)}</tbody></table></div></div><div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5"><p className="text-xs leading-5 text-slate-400">Los créditos son gratuitos y virtuales. El QR conecta con la ronda; no realiza cobros ni retiros.</p><Link href={mode === "live" ? "/tv" : "/"}><Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">{mode === "live" ? "Ver transmisión" : "Explorar juegos en línea"}</Button></Link></div></section>;
}
