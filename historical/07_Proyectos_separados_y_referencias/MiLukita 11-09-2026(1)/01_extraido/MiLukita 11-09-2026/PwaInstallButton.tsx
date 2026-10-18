import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaInstallButton({ compact = false }: { compact?: boolean }) {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredInstallPrompt | null>(null);

  useEffect(() => {
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as DeferredInstallPrompt);
    };
    const clearPrompt = () => setDeferredPrompt(null);
    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", clearPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", clearPrompt);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      toast.message("Instalación desde el navegador", { description: "Abre el menú del navegador y selecciona “Instalar aplicación” o “Agregar a pantalla de inicio”." });
      return;
    }
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") toast.success("Instalación iniciada", { description: "MiLukita se añadirá como aplicación en este dispositivo." });
    setDeferredPrompt(null);
  };

  return <Button type="button" variant="outline" size={compact ? "icon" : "sm"} onClick={install} aria-label="Instalar MiLukita" className="border-emerald-300/25 bg-emerald-300/10 text-emerald-50 hover:bg-emerald-300/20 hover:text-white"><Download className={compact ? "h-4 w-4" : "mr-1.5 h-3.5 w-3.5"} />{compact ? null : "Instalar"}</Button>;
}
