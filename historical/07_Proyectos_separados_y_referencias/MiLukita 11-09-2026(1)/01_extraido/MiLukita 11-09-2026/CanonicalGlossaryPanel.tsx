import { useEffect, useRef } from "react";
import { BookOpen, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_GLOSSARY } from "../../../shared/canonicalGlossary";

type CanonicalGlossaryPanelProps = { open: boolean; onClose: () => void };

export default function CanonicalGlossaryPanel({ open, onClose }: CanonicalGlossaryPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <button type="button" aria-label="Cerrar glosario" className="absolute inset-0 bg-[#020907]/70 backdrop-blur-sm" onClick={onClose} />
      <aside id="canonical-glossary-panel" role="dialog" aria-modal="true" aria-labelledby="canonical-glossary-title" className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-emerald-200/20 bg-[#071812] text-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-300">Identidad del ecosistema</p>
            <h2 id="canonical-glossary-title" className="mt-2 font-display text-3xl text-white">Glosario canónico</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">Las palabras que usamos para explicar MiLukita, LUKA y sus experiencias.</p>
          </div>
          <Button ref={closeButtonRef} type="button" variant="outline" size="icon" onClick={onClose} aria-label="Cerrar glosario" className="shrink-0 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <div className="grid gap-3">
            {CANONICAL_GLOSSARY.map((entry) => (
              <article key={entry.term} className="border border-white/10 bg-white/[.04] p-4">
                <div className="flex items-start gap-3"><BookOpen className="mt-1 h-4 w-4 shrink-0 text-amber-200" /><div><h3 className="text-base font-bold text-white">{entry.term}</h3><p className="mt-1 text-sm leading-6 text-slate-200">{entry.meaning}</p><p className="mt-2 text-xs leading-5 text-slate-400"><span className="font-semibold text-emerald-200">Se usa en:</span> {entry.use}</p></div></div>
              </article>
            ))}
          </div>
          <section className="mt-5 border border-cyan-200/15 bg-cyan-200/[.05] p-4" aria-label="Límite de autoridad">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-cyan-200" /><div><h3 className="text-sm font-bold text-cyan-100">Límite importante</h3><p className="mt-1 text-xs leading-5 text-cyan-50/80">Las experiencias y agentes de MiLukita no tienen autoridad sobre MJP CORE. El núcleo protegido conserva las reglas, resultados y registros críticos del juego.</p></div></div>
          </section>
          <p className="mt-5 text-[11px] leading-5 text-slate-500">Las variantes históricas como Lukallpa, LUKITA o Lukita pueden aparecer en documentos antiguos, pruebas o assets heredados. En material nuevo se utiliza esta nomenclatura canónica.</p>
        </div>
      </aside>
    </div>
  );
}
