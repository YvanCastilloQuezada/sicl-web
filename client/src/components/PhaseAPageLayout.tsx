import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import LanguageSelector from "@/components/LanguageSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Activity, BookOpen, FileText, GitBranch, LayoutDashboard, Monitor, Moon, Scale, ShieldCheck, Sun, Target, Waypoints } from "lucide-react";
import { useTranslation } from "react-i18next";

type PhaseAPage = "evidence" | "evaluations" | "comparisons";

type NavigationItem = {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  active?: PhaseAPage;
};

const navigation: NavigationItem[] = [
  { id: "overview", label: "nav.project", icon: LayoutDashboard, path: "/" },
  { id: "context", label: "nav.context", icon: Waypoints, path: "/#context" },
  { id: "problem", label: "nav.objectives", icon: Target, path: "/#problem" },
  { id: "alternatives", label: "nav.alternatives", icon: GitBranch, path: "/#alternatives" },
  { id: "evidence", label: "nav.evidence", icon: FileText, path: "/evidence", active: "evidence" },
  { id: "evaluations", label: "nav.evaluations", icon: Activity, path: "/evaluations", active: "evaluations" },
  { id: "comparisons", label: "nav.comparisons", icon: Scale, path: "/comparisons", active: "comparisons" },
  { id: "council", label: "nav.council", icon: Scale, path: "/#council" },
  { id: "audit", label: "nav.decision", icon: ShieldCheck, path: "/#audit" },
];

export default function PhaseAPageLayout({ active, children }: { active: PhaseAPage; children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const { preference, setThemePreference } = useTheme();
  const { t } = useTranslation();

  if (loading) return <div className="min-h-screen bg-[#f4f1ea]" />;
  if (!user) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] p-6"><div className="max-w-md border border-[#cbd2c9] bg-[#fbfaf6] p-10 text-center"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d07b4a]">SiMS-DeI Command Center</p><h1 className="mt-4 font-serif text-4xl text-[#1d2925]">Sign in to preserve the record.</h1><p className="mt-4 text-sm leading-6 text-[#718078]">Authentication identifies the actor. It does not grant decision authority.</p><button type="button" onClick={() => startLogin()} className="mt-7 bg-[#385348] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#294038]">Sign in</button></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1d2925]">
      <header className="border-b border-[#d7d8cf] bg-[#f4f1ea]/95 px-6 py-5 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#60766b]"><span className="h-2 w-2 rounded-full bg-[#d07b4a]" /> {t("header.subtitle")}</div>
            <h1 className="font-serif text-3xl tracking-[-0.04em] md:text-4xl">{t("header.title")}</h1>
            <p className="mt-1 text-sm text-[#718078]">{t("header.tagline")}</p>
          </div>
          <div className="flex items-center gap-3"><LanguageSelector /><div role="group" aria-label={t("theme.system")} className="flex items-center border border-[#b9c4bd] bg-[#fbfaf6] p-1 text-xs text-[#385348]"><button type="button" onClick={() => setThemePreference("system")} aria-pressed={preference === "system"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#385348]", preference === "system" ? "bg-[#385348] text-white" : "hover:bg-[#e9ede5]")}><Monitor className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.system")}</span></button><button type="button" onClick={() => setThemePreference("light")} aria-pressed={preference === "light"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#385348]", preference === "light" ? "bg-[#385348] text-white" : "hover:bg-[#e9ede5]")}><Sun className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.light")}</span></button><button type="button" onClick={() => setThemePreference("dark")} aria-pressed={preference === "dark"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#385348]", preference === "dark" ? "bg-[#385348] text-white" : "hover:bg-[#e9ede5]")}><Moon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.dark")}</span></button></div><Badge variant="outline" className="hidden border-[#b9c4bd] bg-[#eef1eb] text-[#385348] md:inline-flex">{t("header.version")}</Badge><div className="hidden items-center gap-2 text-xs text-[#718078] lg:flex"><Activity className="h-4 w-4" /> Traceable workspace</div></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-b border-[#d7d8cf] bg-[#e9ede5] p-4 md:min-h-[calc(100vh-105px)] md:border-b-0 md:border-r md:p-5">
          <div className="mb-6 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a7d72]">Project modules</span><BookOpen className="h-4 w-4 text-[#8b9a90]" /></div>
          <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {navigation.map((item) => { const Icon = item.icon; const isActive = item.active === active; return <button key={item.id} type="button" onClick={() => { window.location.assign(item.path); }} aria-current={isActive ? "page" : undefined} className={cn("group relative flex items-center gap-3 border px-3 py-3 text-left text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#385348]", isActive ? "border-[#385348] bg-[#385348] font-semibold text-white shadow-[inset_4px_0_0_#d07b4a,0_3px_10px_rgba(56,83,72,0.18)]" : "border-transparent text-[#52645a] hover:border-[#b9c4bd] hover:bg-[#f4f1ea]")}>{isActive && <span aria-hidden="true" className="absolute left-0 top-2 h-7 w-1 rounded-r bg-[#d07b4a]" />}<Icon className={cn("h-4 w-4", isActive ? "text-[#f4d5bf]" : "group-hover:text-[#385348]")} /><span>{t(item.label)}</span>{isActive && <span className="ml-auto text-[10px] uppercase tracking-[0.12em] text-[#f4d5bf]">Activo</span>}</button>; })}
          </nav>
          <div className="mt-8 border-t border-[#cbd2c9] pt-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a8c82]">Integrity rule</p><p className="mt-2 text-xs leading-5 text-[#65756c]">Council observes. Recommendation describes. HumanReview records. Decision requires explicit authority.</p></div>
        </aside>
        <main className="p-5 md:p-10 [&_form]:border-[#d4d8d0] [&_form]:bg-[#fbfaf6] [&_form]:shadow-none [&_input]:border-[#b9c4bd] [&_input]:bg-[#fbfaf6] [&_textarea]:border-[#b9c4bd] [&_textarea]:bg-[#fbfaf6] [&_select]:border [&_select]:border-[#b9c4bd] [&_select]:bg-[#fbfaf6] [&_button[type=submit]]:bg-[#385348] [&_button[type=submit]]:px-4 [&_button[type=submit]]:py-2 [&_button[type=submit]]:text-sm [&_button[type=submit]]:font-medium [&_button[type=submit]]:text-white [&_button[type=submit]]:hover:bg-[#294038] [&_table]:w-full [&_table]:text-left [&_th]:border-b [&_th]:border-[#d4d8d0] [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-[#60766b] [&_td]:border-b [&_td]:border-[#e2e4dd] [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm">{children}</main>
      </div>
    </div>
  );
}
