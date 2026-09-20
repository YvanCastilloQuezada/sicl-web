import React from "react";
import { Camera, Mic, Monitor, Moon, ScanLine, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import HelpButton from "@/components/HelpButton";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function AppHeader() {
  const { preference, setThemePreference } = useTheme();
  const { t } = useTranslation();
  const headerRef = useRef<HTMLElement>(null);
  const [voiceActive, setVoiceActive] = React.useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateHeaderHeight = () => document.documentElement.style.setProperty("--app-header-height", `${header.getBoundingClientRect().height}px`);
    updateHeaderHeight();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVoiceState = (event: Event) => setVoiceActive(Boolean((event as CustomEvent<{ active?: boolean }>).detail?.active));
    window.addEventListener("arki:voice-state", handleVoiceState);
    return () => window.removeEventListener("arki:voice-state", handleVoiceState);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-border bg-background/95 px-5 py-3 backdrop-blur md:px-10">
      <div className="mx-auto grid max-w-[1500px] gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3"><h1 className="font-serif text-3xl leading-none tracking-[-0.04em] md:text-4xl">{t("header.title")}</h1><span className="text-sm font-medium text-muted-foreground md:text-base">· by SICL</span></div>
          <p className="mt-1 text-xs font-semibold leading-4 text-foreground md:text-sm">{t("header.identity_line2")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <LanguageSelector />
          <HelpButton />
          <div className="flex items-center gap-1 border border-border bg-card p-1" role="group" aria-label="Entrada conversacional ARKI">
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("arki:open-conversation", { detail: { mode: "voice" } }))} title={t("header.voice", "Dictar encargo")} aria-label={t("header.voice", "Dictar encargo")} aria-pressed={voiceActive} className={cn("inline-flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", voiceActive && "animate-pulse rounded-full bg-[#fbe5d6] text-[#a94524] ring-2 ring-[#d07b4a]")}><Mic className={cn("h-4 w-4", voiceActive && "animate-bounce")} /></button>
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("arki:open-conversation", { detail: { mode: "camera" } }))} title={t("header.camera", "Añadir contexto visual")} aria-label={t("header.camera", "Añadir contexto visual")} className="inline-flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Camera className="h-4 w-4" /></button>
            <button type="button" onClick={() => window.location.assign("/spatial?mode=ar")} title="Abrir realidad aumentada" aria-label="Abrir realidad aumentada" className="inline-flex h-8 items-center justify-center gap-1 px-1.5 text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ScanLine className="h-4 w-4" /><span className="text-[10px] font-semibold tracking-wide">AR</span></button>
          </div>
          <div role="group" aria-label={t("theme.system")} className="flex items-center border border-border bg-card p-1 text-xs text-foreground">
            <button type="button" onClick={() => setThemePreference("system")} aria-pressed={preference === "system"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "system" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Monitor className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.system")}</span></button>
            <button type="button" onClick={() => setThemePreference("light")} aria-pressed={preference === "light"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "light" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Sun className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.light")}</span></button>
            <button type="button" onClick={() => setThemePreference("dark")} aria-pressed={preference === "dark"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "dark" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Moon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.dark")}</span></button>
          </div>
        </div>
        <p className="max-w-5xl text-xs leading-5 text-muted-foreground lg:col-span-2 md:text-sm">{t("header.identity_line3")}</p>
      </div>
    </header>
  );
}
