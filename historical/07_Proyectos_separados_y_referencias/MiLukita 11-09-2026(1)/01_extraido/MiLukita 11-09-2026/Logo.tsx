import { Sparkles } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="milukita-logo flex items-center gap-3" aria-label="MiLukita">
    <span className="milukita-logo-mark inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black text-slate-950">ML</span>
    <span className="min-w-0"><strong className="block font-display text-xl leading-none text-white">MiLukita</strong>{!compact ? <span className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200"><Sparkles className="h-3 w-3" /> entretenimiento verificable</span> : null}</span>
  </div>;
}
