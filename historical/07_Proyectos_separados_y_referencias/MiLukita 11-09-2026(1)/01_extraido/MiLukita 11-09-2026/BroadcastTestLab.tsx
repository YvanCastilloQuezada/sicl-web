import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MonitorSmartphone, Radio, Smartphone, TabletSmartphone } from "lucide-react";

type DeviceState = "offline" | "connected" | "ready" | "acknowledged";

export default function BroadcastTestLab() {
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [devices, setDevices] = useState<Record<string, DeviceState>>({ tv: "offline", mobile: "offline" });
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setDevices({ tv: "ready", mobile: "acknowledged" });
      setEvents((current) => [...current, "TV virtual recibió el estado de ronda", "Celular virtual abrió el QR y confirmó recepción"]);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [running]);

  const result = useMemo(() => {
    if (!running) return "Sin ejecutar";
    if (devices.tv === "ready" && devices.mobile === "acknowledged") return "PASS · sincronización cerrada completada";
    return "RUNNING · esperando interacción de los dos dispositivos";
  }, [devices.mobile, devices.tv, running]);

  const start = () => {
    setRunning(true);
    setStartedAt(Date.now());
    setDevices({ tv: "connected", mobile: "connected" });
    setEvents(["Prueba aislada iniciada", "Ronda virtual de prueba creada en memoria del navegador"]);
  };

  return <section className="mt-6 border border-violet-200/15 bg-violet-200/5 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-violet-100">Laboratorio aislado</p><h3 className="mt-2 text-xl font-bold text-white">Prueba cerrada con dos dispositivos virtuales</h3><p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">Simula TV/OBS y celular/QR en el navegador. No crea rondas, no reserva boletos y no mueve créditos oficiales.</p></div><Button type="button" onClick={start} className="gold-button"><Radio className="mr-2 h-4 w-4" /> {running ? "Repetir prueba" : "Iniciar prueba"}</Button></div><div className="mt-5 grid gap-3 md:grid-cols-2"><div className="border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between"><span className="font-bold text-white"><MonitorSmartphone className="mr-2 inline h-4 w-4 text-emerald-300" />TV / OBS virtual</span><span className="text-xs text-emerald-200">{devices.tv}</span></div><p className="mt-2 text-xs text-slate-400">Presenta ronda, QR y estado sin decidir el resultado.</p></div><div className="border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between"><span className="font-bold text-white"><Smartphone className="mr-2 inline h-4 w-4 text-cyan-300" />Celular / PWA virtual</span><span className="text-xs text-cyan-200">{devices.mobile}</span></div><p className="mt-2 text-xs text-slate-400">Abre el QR, recibe la ronda y confirma el enlace.</p></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"><span className={`flex items-center gap-2 text-sm font-bold ${result.startsWith("PASS") ? "text-emerald-200" : "text-amber-200"}`}>{result.startsWith("PASS") ? <CheckCircle2 className="h-4 w-4" /> : <TabletSmartphone className="h-4 w-4" />}{result}</span>{startedAt ? <span className="text-xs text-slate-500">Inicio local: {new Date(startedAt).toLocaleTimeString()}</span> : null}</div>{events.length ? <div className="mt-4 space-y-1 text-xs text-slate-400">{events.map((event, index) => <p key={`${event}-${index}`}>· {event}</p>)}</div> : null}</section>;
}
