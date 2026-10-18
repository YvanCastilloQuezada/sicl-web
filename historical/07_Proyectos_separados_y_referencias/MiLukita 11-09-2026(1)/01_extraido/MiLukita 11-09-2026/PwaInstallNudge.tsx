import { Button } from "@/components/ui/button";
import PwaInstallButton from "./PwaInstallButton";
import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

const VISIT_KEY = "mjp-pwa-visits";
const DISMISS_KEY = "mjp-pwa-install-nudge-dismissed";

export default function PwaInstallNudge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const visits = Number.parseInt(localStorage.getItem(VISIT_KEY) ?? "0", 10) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));
    if (visits >= 3 && localStorage.getItem(DISMISS_KEY) !== "1") setOpen(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;
  return <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-emerald-300/25 bg-[#0a1d16]/95 p-4 text-white shadow-2xl backdrop-blur sm:left-auto sm:right-6 sm:mx-0" aria-label="Invitación para instalar la aplicación"><button type="button" onClick={dismiss} className="absolute right-3 top-3 rounded-md p-1 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Cerrar invitación de instalación"><X className="h-4 w-4" /></button><div className="flex gap-3 pr-6"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-300/15 text-emerald-100"><Download className="h-5 w-5" /></div><div><p className="font-bold">Instala MiLukita</p><p className="mt-1 text-xs leading-5 text-slate-300">Después de varias visitas, puedes añadir el piloto a tu inicio para abrirlo como aplicación.</p><div className="mt-3 flex items-center gap-2"><PwaInstallButton /><Button type="button" variant="ghost" size="sm" onClick={dismiss} className="text-slate-300 hover:bg-white/10 hover:text-white">Ahora no</Button></div></div></div></aside>;
}
