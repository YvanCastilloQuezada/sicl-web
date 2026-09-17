import React from "react";
import { Activity, Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import HelpButton from "@/components/HelpButton";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function AppHeader() {
  const { preference, setThemePreference } = useTheme();
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 px-6 py-4 backdrop-blur md:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-accent" /> {t("header.subtitle")}</div>
          <h1 className="font-serif text-3xl tracking-[-0.04em] md:text-4xl">{t("header.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("header.tagline")}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <HelpButton />
          <div role="group" aria-label={t("theme.system")} className="flex items-center border border-border bg-card p-1 text-xs text-foreground">
            <button type="button" onClick={() => setThemePreference("system")} aria-pressed={preference === "system"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "system" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Monitor className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.system")}</span></button>
            <button type="button" onClick={() => setThemePreference("light")} aria-pressed={preference === "light"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "light" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Sun className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.light")}</span></button>
            <button type="button" onClick={() => setThemePreference("dark")} aria-pressed={preference === "dark"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "dark" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Moon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.dark")}</span></button>
          </div>
          <Badge variant="outline" className="hidden border-border bg-secondary text-secondary-foreground md:inline-flex">{t("header.version")}</Badge>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex"><Activity className="h-4 w-4" /> Traceable workspace</div>
        </div>
      </div>
    </header>
  );
}
