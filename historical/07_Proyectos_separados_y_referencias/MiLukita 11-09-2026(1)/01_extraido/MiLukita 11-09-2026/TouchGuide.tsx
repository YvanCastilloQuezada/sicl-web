import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CircleHelp, Gamepad2, Hand, Keyboard, MousePointer2, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  { icon: Gamepad2, title: "Game Pad · navegación y escenas", text: "Usa las flechas, foco, volumen, canales y acciones de escena en horizontal. Es el modo recomendado para controlar una pantalla a distancia." },
  { icon: MousePointer2, title: "Track Pad · gestos precisos", text: "Desliza con un dedo, toca dos veces o usa dos dedos para desplazarte y pellizcar. La estrella amarilla confirma cada contacto." },
  { icon: Keyboard, title: "Mini Teclado · escribir y apuntar", text: "Escribe en el área principal y usa el trackpad lateral para mover el puntero. En vertical, el teclado queda arriba y el trackpad abajo." },
  { icon: Sparkles, title: "AR Stage · colocar a Lukita", text: "Activa la ubicación AR, arrastra para mover la composición, pellizca para escalar y usa foto o video. Revisa siempre antes de compartir." },
  { icon: PlayCircle, title: "Prueba antes de participar", text: "Usa el modo de práctica o Aprender para realizar simulaciones locales sin crear boletos ni movimientos." },
  { icon: ShieldCheck, title: "Límites del Controller Lab", text: "Los controles son presentation-only: no acceden a RNG, resultados, wallet, ledger, settlement ni reglas de MJP CORE." },
] as const;

export default function TouchGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("mjp-touch-guide-seen") !== "1") setOpen(true);
  }, []);

  useEffect(() => {
    const showGuide = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener("mjp-open-touch-guide", showGuide);
    return () => window.removeEventListener("mjp-open-touch-guide", showGuide);
  }, []);

  const close = () => {
    localStorage.setItem("mjp-touch-guide-seen", "1");
    setOpen(false);
  };
  const current = STEPS[step];
  const Icon = current.icon;

  return <>
    <Button type="button" variant="outline" size="icon" onClick={() => { setStep(0); setOpen(true); }} aria-label="Abrir guía táctil" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><CircleHelp className="h-4 w-4" /></Button>
    <Sheet open={open} onOpenChange={(value) => value ? setOpen(true) : close()}>
      <SheetContent side="bottom" className="border-emerald-300/20 bg-[#0a1d16] text-white sm:mx-auto sm:max-w-xl sm:rounded-t-3xl">
        <SheetHeader className="pr-12"><p className="eyebrow">Guía inicial</p><SheetTitle className="font-display text-3xl text-white">Usa el piloto con controles táctiles.</SheetTitle><SheetDescription className="text-slate-300">Paso {step + 1} de {STEPS.length}. Puedes volver a abrir esta guía cuando quieras.</SheetDescription></SheetHeader>
        <div className="px-4 pb-2"><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5"><Icon className="h-7 w-7 text-amber-200" /><h3 className="mt-4 text-lg font-bold text-white">{current.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{current.text}</p></div><div className="mt-4 flex gap-2">{STEPS.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-emerald-300" : "bg-white/15"}`} />)}</div></div>
        <SheetFooter className="flex-row justify-between"><Button type="button" variant="outline" onClick={close} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">Cerrar</Button><Button type="button" onClick={() => step === STEPS.length - 1 ? close() : setStep((currentStep) => currentStep + 1)} className="gold-button">{step === STEPS.length - 1 ? "Entendido" : "Siguiente"}</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  </>;
}
