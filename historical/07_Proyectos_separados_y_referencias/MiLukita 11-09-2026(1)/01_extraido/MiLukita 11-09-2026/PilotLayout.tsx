import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme, type FontScale } from "@/contexts/ThemeContext";
import { languageNames, supportedLanguages, useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accessibility, BookOpen, Contrast, MapPin, Menu, Minus, Moon, Pause, Plus, ShieldCheck, Sparkles, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import PwaInstallButton from "./PwaInstallButton";
import PwaInstallNudge from "./PwaInstallNudge";
import TouchGuide from "./TouchGuide";
import { MILUKITA_BRAND } from "../../../shared/brandSystem";
import CanonicalGlossaryPanel from "./CanonicalGlossaryPanel";

const navigation = [
  { key: "roulette", href: "/juegos/ruleta" }, { key: "tv", label: "TV en vivo", href: "/tv" }, { key: "tvOnline", label: "TV en línea", href: "/tv-en-linea" }, { key: "jackpot", href: "/juegos/jackpot" }, { key: "bingo", href: "/juegos/bingo" }, { key: "lottery", href: "/juegos/loteria" }, { key: "trio", href: "/juegos/cartas" }, { key: "market", href: "/multimarket" }, { key: "impact", href: "/impacto" }, { key: "tables", href: "/transparencia" }, { key: "rtp", href: "/rtp" }, { key: "learn", href: "/aprender" }, { key: "batches", href: "/lotes" }, { key: "wallet", href: "/billetera" }, { key: "verify", href: "/verificar" }, { key: "profile", href: "/perfil" }, { key: "operations", href: "/operacion" },
];

export default function PilotLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, locale, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, fontScale, setFontScale, highContrast, setHighContrast, reduceMotion, setReduceMotion } = useTheme();
  const walletQuery = trpc.wallet.summary.useQuery(undefined, { enabled: isAuthenticated });
  const walletBalance = walletQuery.data?.wallet.balance ?? 2650;
  const [location] = useLocation();
  const [open, setOpen] = useState(() => new URLSearchParams(window.location.search).get("a11yPreview") === "1" || new URLSearchParams(window.location.search).get("menuPreview") === "1");
  const [accessibilityOpen, setAccessibilityOpen] = useState(() => new URLSearchParams(window.location.search).get("a11yPreview") === "1");
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const scaleSteps: FontScale[] = [100, 125, 150];
  const updateScale = (direction: -1 | 1) => {
    const current = scaleSteps.indexOf(fontScale);
    const next = Math.max(0, Math.min(scaleSteps.length - 1, current + direction));
    setFontScale(scaleSteps[next]);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === "dark" ? "bg-[#071310] text-[#f3efe6]" : "bg-[#edf6ef] text-[#143222]"}`}>
      <div className="pilot-ribbon" aria-label={MILUKITA_BRAND.pilotNotice}>
        <div className="container flex items-center justify-center gap-2 text-center text-[11px] font-semibold tracking-[0.12em] text-emerald-50 sm:text-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          {MILUKITA_BRAND.pilotNotice}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#071310]/85 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3" aria-label={t("explore")}>
            <div className="brand-mark grid h-10 w-10 place-items-center rounded-xl text-sm font-black text-[#05251a]">ML</div>
            <div>
              <p className="font-display text-lg leading-none tracking-tight text-white">{MILUKITA_BRAND.name}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">{MILUKITA_BRAND.host} · {MILUKITA_BRAND.hostRole}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 xl:flex" aria-label="Navegación principal">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-xs ${location === item.href ? "text-emerald-200" : ""}`}
              >
                {item.key === "rtp" ? "RTP" : item.label ?? t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <label className="sr-only" htmlFor="language-selector">{t("language")}</label>
            <select id="language-selector" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="h-9 rounded-lg border border-white/15 bg-white/5 px-2 text-xs font-semibold text-white outline-none focus:border-emerald-300">
              {supportedLanguages.map((code) => <option key={code} value={code} className="bg-[#0a1d16] text-white">{languageNames[code]}</option>)}
            </select>
            <div className="relative">
              <Button type="button" variant="outline" size="icon" onClick={() => setAccessibilityOpen(value => !value)} aria-expanded={accessibilityOpen} aria-controls="accessibility-panel" aria-label={t("accessibility")} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Accessibility className="h-4 w-4" />
              </Button>
              {accessibilityOpen ? (
                <section id="accessibility-panel" className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-emerald-200/15 bg-[#0a1d16] p-4 text-sm text-white shadow-2xl" aria-label="Preferencias de accesibilidad">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">{t("accessibility")}</p>
                  <div className="mt-4 flex items-center justify-between gap-3"><span>{t("fontSize")}</span><div className="flex items-center gap-1"><Button type="button" variant="ghost" size="icon" onClick={() => updateScale(-1)} disabled={fontScale === 100} aria-label={t("decrease")}><Minus className="h-4 w-4" /></Button><span className="w-10 text-center text-xs font-bold text-emerald-200">{fontScale}%</span><Button type="button" variant="ghost" size="icon" onClick={() => updateScale(1)} disabled={fontScale === 150} aria-label={t("increase")}><Plus className="h-4 w-4" /></Button></div></div>
                  <label className="mt-4 flex cursor-pointer items-center justify-between gap-3"><span className="flex items-center gap-2"><Contrast className="h-4 w-4 text-emerald-300" /> {t("contrast")}</span><input type="checkbox" checked={highContrast} onChange={event => setHighContrast(event.target.checked)} /></label>
                  <label className="mt-4 flex cursor-pointer items-center justify-between gap-3"><span className="flex items-center gap-2"><Pause className="h-4 w-4 text-emerald-300" /> {t("reduceMotion")}</span><input type="checkbox" checked={reduceMotion} onChange={event => setReduceMotion(event.target.checked)} /></label>
                </section>
              ) : null}
            </div>
            <Button type="button" variant="outline" onClick={() => setGlossaryOpen(true)} aria-expanded={glossaryOpen} aria-controls="canonical-glossary-panel" className="border-emerald-200/20 bg-emerald-300/5 text-emerald-100 hover:bg-emerald-300/10 hover:text-white"><BookOpen className="mr-2 h-4 w-4" />Glosario</Button>
            <PwaInstallButton />
            <TouchGuide />
            <Button type="button" variant="outline" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
            <span className="hidden items-center gap-1 rounded-lg border border-cyan-200/20 bg-cyan-200/8 px-2 py-1.5 text-[10px] font-bold text-cyan-100 2xl:inline-flex" title="Indicador visual de demostración; no accede a la ubicación del dispositivo."><MapPin className="h-3.5 w-3.5" />Perú · SIM</span>
            <Badge className="border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100 hover:bg-emerald-400/10">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> {walletBalance.toLocaleString(locale)} {t("credits")}
            </Badge>
            {isAuthenticated ? (
              <Button onClick={logout} variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                {t("exit")}
              </Button>
            ) : (
              <Button onClick={() => startLogin()} className="gold-button">{t("signIn")}</Button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:hidden"><Button type="button" variant="ghost" size="icon" onClick={() => setGlossaryOpen(true)} aria-expanded={glossaryOpen} aria-controls="canonical-glossary-panel" aria-label="Abrir glosario canónico" className="border border-emerald-200/20 text-emerald-100 hover:bg-emerald-300/10 hover:text-white"><BookOpen className="h-4 w-4" /></Button><PwaInstallButton compact /><TouchGuide /><Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"} className="border border-white/10 text-white hover:bg-white/10 hover:text-white">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button><Button type="button" variant="ghost" size="icon" onClick={() => setOpen((value) => !value)} className="border border-white/10 text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label={t("openMenu")}>{open ? <X /> : <Menu />}</Button></div>
        </div>

        {open ? (
          <div className="border-t border-white/10 bg-[#081913] px-4 py-4 lg:hidden">
            <nav className="container grid gap-2" aria-label="Navegación móvil">
              <section className="mb-1 rounded-xl border border-emerald-200/15 bg-white/5 px-4 py-3" aria-label={t("language")}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-200">{t("language")}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {supportedLanguages.map((code) => <Button key={code} type="button" variant="outline" onClick={() => setLanguage(code)} className={language === code ? "border-emerald-300 bg-emerald-300/15 text-emerald-50" : "border-white/15 bg-[#0a1d16] text-white hover:bg-white/10 hover:text-white"}>{languageNames[code]}</Button>)}
                </div>
              </section>
              <section className="mb-2 rounded-xl border border-emerald-200/15 bg-white/5 px-4 py-4 text-sm text-white" aria-label={t("accessibility")}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">{t("accessibility")}</p>
                <div className="mt-3 flex items-center justify-between gap-3"><span>{t("fontSize")}</span><div className="flex items-center gap-1"><Button type="button" variant="ghost" size="icon" onClick={() => updateScale(-1)} disabled={fontScale === 100} aria-label={t("decrease")}><Minus className="h-4 w-4" /></Button><span className="w-10 text-center text-xs font-bold text-emerald-200">{fontScale}%</span><Button type="button" variant="ghost" size="icon" onClick={() => updateScale(1)} disabled={fontScale === 150} aria-label={t("increase")}><Plus className="h-4 w-4" /></Button></div></div>
                <label className="mt-3 flex cursor-pointer items-center justify-between gap-3"><span className="flex items-center gap-2"><Contrast className="h-4 w-4 text-emerald-300" /> {t("contrast")}</span><input type="checkbox" checked={highContrast} onChange={event => setHighContrast(event.target.checked)} /></label>
                <label className="mt-3 flex cursor-pointer items-center justify-between gap-3"><span className="flex items-center gap-2"><Pause className="h-4 w-4 text-emerald-300" /> {t("reduceMotion")}</span><input type="checkbox" checked={reduceMotion} onChange={event => setReduceMotion(event.target.checked)} /></label>
              </section>
              <p className="rounded-xl border border-cyan-200/15 bg-cyan-200/5 px-4 py-3 text-xs leading-5 text-cyan-50"><MapPin className="mr-1 inline h-3.5 w-3.5" /><strong>Perú · ubicación simulada.</strong> Este indicador no accede a la ubicación de tu dispositivo.</p>
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/8">
                  {item.key === "rtp" ? "RTP" : item.label ?? t(item.key)}
                </Link>
              ))}
              {!isAuthenticated ? <Button onClick={() => startLogin()} className="gold-button mt-2">{t("signIn")}</Button> : <p className="px-4 py-2 text-sm text-emerald-200">{t("hello")}, {user?.name ?? t("profile")}</p>}
            </nav>
          </div>
        ) : null}
      </header>

      {language !== "es" ? <div className="border-b border-cyan-200/15 bg-cyan-300/5"><div className="container py-2 text-center text-xs leading-5 text-cyan-50">{t("referenceLanguage")}</div></div> : null}

      {children}
      <CanonicalGlossaryPanel open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      <footer className="border-t border-white/10 bg-[#050d0a] py-10">
        <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white"><ShieldCheck className="h-4 w-4 text-emerald-300" /> {t("responsibleTitle")}</div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">{t("responsibleText")}</p>
          </div>
          <div className="text-left text-xs text-slate-400 md:text-right">{t("footerArea")}</div>
        </div>
      </footer>
      <PwaInstallNudge />
    </div>
  );
}
