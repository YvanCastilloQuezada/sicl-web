import { useEffect, useState } from "react";
import { ArrowRight, Tv } from "lucide-react";
import { useLocation } from "wouter";

const PORTAL_ART = "/manus-storage/luka-portal-reference_367f0066.png";

export default function Home() {
  const [, navigate] = useLocation();
  const [leaving, setLeaving] = useState(false);
  useEffect(() => () => setLeaving(false), []);

  const enter = (path: string) => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => navigate(path), 260);
  };

  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#020707] text-white ${leaving ? "animate-pulse" : ""}`} aria-busy={leaving}>
      <div className="absolute inset-0 bg-[#020707]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: `url(${PORTAL_ART})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(10,53,57,.08),rgba(1,7,7,.72)_75%)]" aria-hidden="true" />

      <section className="relative z-[1] flex min-h-screen flex-col items-center justify-end px-5 pb-10 pt-24 text-center sm:pb-14">
        <div className="w-full max-w-md rounded-3xl border border-cyan-100/25 bg-[#061011]/75 p-5 shadow-[0_0_60px_rgba(0,255,230,.15)] backdrop-blur-md sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-100/80">El mundo de MiLukita</p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-white sm:text-4xl">¿Quieres entrar al mundo de LUKA o ver TV?</h1>
          <div className="mt-5 grid gap-3">
            <button type="button" onClick={() => enter("/luka-entry?entry=portal")} disabled={leaving} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-cyan-100/60 bg-cyan-100/15 px-5 text-base font-black text-white transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-100/25 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:cursor-wait disabled:opacity-75">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-200 text-slate-950"><ArrowRight className="h-4 w-4" /></span>
              {leaving ? "CARGANDO…" : "ENTRAR AL MUNDO"}
            </button>
            <button type="button" onClick={() => enter("/touch-remote?focus=controller&mode=remote")} disabled={leaving} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/40 bg-white/10 px-5 text-base font-black text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-wait disabled:opacity-75">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-950"><Tv className="h-4 w-4" /></span>
              {leaving ? "CARGANDO…" : "VER TV"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
