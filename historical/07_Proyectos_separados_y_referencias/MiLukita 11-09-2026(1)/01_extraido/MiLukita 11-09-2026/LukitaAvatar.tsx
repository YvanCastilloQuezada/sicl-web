import { Mic2, Radio } from "lucide-react";

const AVATAR_ASSETS = {
  show: "/manus-storage/lukita_show_8d0e700b.png",
  tv: "/manus-storage/lukita_tv_57e76c38.png",
  web: "/manus-storage/lukita_web_6b2b1aeb.png",
  celebration: "/manus-storage/lukita_celebration_f975b023.png",
  contingencia: "/manus-storage/lukita_contingencia_0775b612.png",
} as const;

type LukitaMood = "ready" | "speaking" | "fallback";
type LukitaVariant = keyof typeof AVATAR_ASSETS;

export function LukitaAvatar({ mood = "ready", variant = "web" }: { mood?: LukitaMood; variant?: LukitaVariant }) {
  const label = mood === "speaking" ? "Lukita hablando" : mood === "fallback" ? "Fallback activo" : "Lukita lista";
  const asset = mood === "fallback" ? AVATAR_ASSETS.contingencia : mood === "speaking" && variant === "web" ? AVATAR_ASSETS.tv : AVATAR_ASSETS[variant];
  return (
    <div className="lukita-avatar flex items-center gap-3" aria-label={`${label}, anfitriona visual no autoritativa`}>
      <div className={`lukita-avatar-face relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-lg font-black text-slate-950 ${mood === "speaking" ? "is-speaking" : ""}`}>
        <img src={asset} alt="" className="h-full w-full object-contain" aria-hidden="true" />
        <span className="absolute -right-1 -top-1 rounded-full bg-white/90 p-1 text-slate-900"><Radio className="h-3 w-3" /></span>
      </div>
      <div><p className="font-display text-lg text-white">Lukita</p><p className="flex items-center gap-1 text-xs text-slate-400"><Mic2 className="h-3 w-3 text-amber-200" />{label}</p></div>
    </div>
  );
}

export { AVATAR_ASSETS };
