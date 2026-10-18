import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { ArrowRight, Camera, CheckCircle2, Eye, FileCheck2, MapPinned, Mic, ShieldCheck, Wifi } from "lucide-react";
import { Link, useLocation } from "wouter";
import TerritorialTrustPage from "./TerritorialTrustPage";

const brand = {
  ink: "#04110d",
  panel: "rgba(8, 31, 24, .82)",
  line: "rgba(91, 255, 215, .26)",
  mint: "#76f7cf",
  gold: "#ffe9a6",
};

function FieldIcon({ mode }: { mode: "mapper" | "the-eye" }) {
  return mode === "mapper" ? <MapPinned size={30} strokeWidth={1.5} /> : <Eye size={30} strokeWidth={1.5} />;
}

export default function TerritorialFieldEntryPage() {
  const [location] = useLocation();
  const mode = location.includes("the-eye") ? "the-eye" : "mapper";
  const { user, loading } = useAuth();
  const isMapper = mode === "mapper";
  const title = isMapper ? "Mapper" : "The Eye";
  const role = isMapper ? "Mapper Operator" : "Eye Reviewer";
  const description = isMapper
    ? "Captura el territorio, sus Claims y la evidencia que permite confiar en él."
    : "Contrasta fuentes, evidencia y cambios antes de que una autoridad humana publique.\n";

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center px-6" style={{ background: brand.ink, color: "white" }}>
        <div className="flex items-center gap-3 text-sm tracking-[.16em] uppercase" style={{ color: brand.mint }}>
          <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: brand.mint }} />
          Preparando entrada de campo…
        </div>
      </main>
    );
  }

  if (user) return <TerritorialTrustPage surface={mode} />;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: `radial-gradient(circle at 74% 18%, rgba(48, 145, 112, .22), transparent 28%), ${brand.ink}`, color: "white" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: brand.line }}>
          <Link href="/" className="group flex items-center gap-3 rounded-full px-1 py-1 outline-none focus-visible:ring-2" style={{ color: brand.gold }} aria-label="Volver al portal MiLukita">
            <span className="grid h-11 w-11 place-items-center rounded-full border text-xl shadow-[0_0_28px_rgba(255,233,166,.24)] transition duration-200 group-hover:shadow-[0_0_38px_rgba(255,233,166,.65)]" style={{ borderColor: "rgba(255,233,166,.62)", background: "rgba(255,233,166,.08)" }}>L★</span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[.2em] sm:inline">MiLukita · Field Gate</span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em]" style={{ color: brand.mint }}><Wifi size={14} /> Preview seguro</div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.2em]" style={{ color: brand.mint }}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl border" style={{ borderColor: brand.line, background: "rgba(118,247,207,.08)" }}><FieldIcon mode={mode} /></span>
              Territorial Trust Layer
            </div>
            <p className="mb-3 text-xs uppercase tracking-[.24em] text-white/45">Field Gate 001 · acceso controlado</p>
            <h1 className="max-w-xl font-serif text-5xl leading-[.98] tracking-[-.045em] sm:text-7xl">{title}<br /><span style={{ color: brand.mint }}>en el territorio real.</span></h1>
            <p className="mt-7 max-w-lg whitespace-pre-line text-base leading-7 text-white/65 sm:text-lg">{description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => startLogin()} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-6 text-sm font-bold uppercase tracking-[.12em] text-[#04110d] transition duration-200 hover:brightness-110 active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76f7cf]" style={{ background: brand.mint }}>
                Iniciar sesión segura <ArrowRight size={18} />
              </button>
              <Link href="/" className="inline-flex min-h-14 items-center justify-center rounded-full border px-6 text-sm font-bold uppercase tracking-[.12em] text-white/75 transition duration-200 hover:border-white/55 hover:text-white" style={{ borderColor: "rgba(255,255,255,.22)" }}>Volver al portal</Link>
            </div>
            <p className="mt-5 max-w-md text-xs leading-5 text-white/42">La autenticación y el RBAC se aplican al abrir el módulo. Esta entrada no expone datos, evidencias ni permisos antes de iniciar sesión.</p>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[3rem] opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, rgba(118,247,207,.22), transparent 64%)" }} />
            <div className="relative overflow-hidden rounded-[2rem] border p-5 shadow-[0_24px_80px_rgba(0,0,0,.35)] sm:p-7" style={{ borderColor: brand.line, background: brand.panel, backdropFilter: "blur(22px)" }}>
              <div className="mb-7 flex items-start justify-between gap-4 border-b pb-5" style={{ borderColor: brand.line }}>
                <div><p className="text-xs uppercase tracking-[.22em]" style={{ color: brand.mint }}>Tu rol de entrada</p><h2 className="mt-2 text-2xl font-semibold">{role}</h2></div>
                <ShieldCheck size={24} style={{ color: brand.gold }} />
              </div>
              <div className="space-y-3">
                {(isMapper ? [
                  [Camera, "GPS y cámara", "Captura con permiso explícito"],
                  [FileCheck2, "Evidencia trazable", "Fotos, fuentes y observaciones"],
                  [CheckCircle2, "Cola offline", "Sincronización con conflicto visible"],
                ] : [
                  [Eye, "Revisión comparativa", "Contrasta Claims y fuentes"],
                  [FileCheck2, "Audit trail", "Cada decisión queda registrada"],
                  [ShieldCheck, "Autoridad humana", "Publicar nunca es automático"],
                ]).map(([Icon, label, copy]) => {
                  const IconComponent = Icon as typeof Camera;
                  return <div key={label as string} className="flex items-center gap-4 rounded-2xl border p-4" style={{ borderColor: "rgba(255,255,255,.1)", background: "rgba(0,0,0,.14)" }}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ color: brand.mint, background: "rgba(118,247,207,.1)" }}><IconComponent size={20} strokeWidth={1.6} /></span><div><p className="font-medium text-white/90">{label as string}</p><p className="mt-1 text-xs text-white/48">{copy as string}</p></div></div>;
                })}
              </div>
              <div className="mt-7 border-t pt-5" style={{ borderColor: brand.line }}><p className="text-[11px] leading-5 text-white/45">MJP CORE permanece aislado. Mapper y The Eye no pueden escribir RNG, wallet, reglas, ledger, settlement ni resultados oficiales.</p></div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t py-4 text-[10px] uppercase tracking-[.16em] text-white/35 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: brand.line }}><span>MiLukita · WorldObject · Claims · Sources · Evidence</span><span>Human-in-the-loop · No publication without approval</span></footer>
      </div>
    </main>
  );
}
