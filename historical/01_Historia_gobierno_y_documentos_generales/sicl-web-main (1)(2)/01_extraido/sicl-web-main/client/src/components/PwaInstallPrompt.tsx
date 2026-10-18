import { Download, RefreshCw, WifiOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface DeferredInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<DeferredInstallPrompt | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as DeferredInstallPrompt);
      setShowInstall(true);
    };
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    const onControllerChange = () => setShowUpdate(true);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    navigator.serviceWorker?.addEventListener("controllerchange", onControllerChange);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setShowInstall(false);
  };

  const update = () => {
    navigator.serviceWorker?.controller?.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  };

  if (!showInstall && !showUpdate && !offline) return null;
  return <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-xl flex-wrap items-center gap-3 rounded-xl border border-[#557da5] bg-[#071a30]/95 p-3 text-[#edf4ff] shadow-2xl backdrop-blur" role="status">
    {offline && <WifiOff className="h-4 w-4 text-amber-300" aria-hidden="true" />}
    {showInstall && <><div className="min-w-0 flex-1"><p className="text-sm font-semibold">Instala ARKI como WebApp</p><p className="text-xs text-[#b8cbe0]">Acceso rápido y una experiencia local preparada para conectividad intermitente.</p></div><Button onClick={() => void install()} className="bg-[#f0a35b] text-black hover:bg-[#f6c995]"><Download className="mr-2 h-4 w-4" />Instalar</Button></>}
    {showUpdate && <><div className="min-w-0 flex-1"><p className="text-sm font-semibold">Hay una actualización de ARKI</p><p className="text-xs text-[#b8cbe0]">Recarga para activar la nueva versión.</p></div><Button onClick={update} className="bg-[#6ea8ff] text-[#071a30] hover:bg-[#b8d5ff]"><RefreshCw className="mr-2 h-4 w-4" />Actualizar</Button></>}
    {offline && !showInstall && !showUpdate && <p className="flex-1 text-xs text-[#b8cbe0]">Sin conexión: se mantiene la interfaz local disponible; las operaciones protegidas requieren conexión.</p>}
    <button type="button" aria-label="Cerrar aviso PWA" onClick={() => { setShowInstall(false); setShowUpdate(false); }} className="rounded p-1 text-[#b8cbe0] hover:bg-white/10"><X className="h-4 w-4" /></button>
  </div>;
}
