import React, { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Activity,
  BookOpen,
  ChevronDown,
  FileText,
  GitBranch,
  LayoutDashboard,
  Library,
  Search,
  Scale,
  ShieldCheck,
  Target,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppHeader from "@/components/AppHeader";
import { TEMPORARY_DIRECT_ACCESS } from "@/_core/auth-access";

export type WorkspaceSection =
  | "overview"
  | "context"
  | "problem"
  | "alternatives"
  | "evidence"
  | "evaluations"
  | "comparisons"
  | "council"
  | "audit"
  | "governance";
type NavigationItem = { id: WorkspaceSection; label: string; icon: typeof LayoutDashboard; path: string };
type ResourceItem = { id: string; label: string; description: string; icon: typeof BookOpen; path: string };
type IndexGroup = { id: string; label: string; items: Array<NavigationItem | ResourceItem> };

export const workspaceNavigation: NavigationItem[] = [
  { id: "overview", label: "nav.project", icon: LayoutDashboard, path: "/" },
  { id: "context", label: "nav.context", icon: Waypoints, path: "/#context" },
  { id: "problem", label: "nav.objectives", icon: Target, path: "/#problem" },
  { id: "alternatives", label: "nav.alternatives", icon: GitBranch, path: "/#alternatives" },
  { id: "evidence", label: "nav.evidence", icon: FileText, path: "/evidence" },
  { id: "evaluations", label: "nav.evaluations", icon: Activity, path: "/evaluations" },
  { id: "comparisons", label: "nav.comparisons", icon: Scale, path: "/comparisons" },
  { id: "council", label: "nav.council", icon: Scale, path: "/#council" },
  { id: "audit", label: "nav.decision", icon: ShieldCheck, path: "/#audit" },
  { id: "governance", label: "nav.governance", icon: FileText, path: "/#governance" },
];

export const fieldClass = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
const shellMainClass = "min-w-0 p-5 text-foreground md:p-10 [&_form]:rounded-md [&_form]:border [&_form]:border-border [&_form]:bg-card [&_form]:p-4 [&_form]:shadow-sm [&_label]:text-sm [&_label]:font-medium [&_input]:mt-1 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-input [&_input]:bg-background [&_input]:px-3 [&_input]:py-2 [&_input]:text-foreground [&_input]:placeholder:text-muted-foreground [&_textarea]:mt-1 [&_textarea]:w-full [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:border-input [&_textarea]:bg-background [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-foreground [&_textarea]:placeholder:text-muted-foreground [&_select]:mt-1 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-input [&_select]:bg-background [&_select]:px-3 [&_select]:py-2 [&_select]:text-foreground [&_table]:w-full [&_table]:text-left [&_th]:border-b [&_th]:border-border [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-muted-foreground [&_td]:border-b [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_button[type=submit]]:rounded-md [&_button[type=submit]]:bg-primary [&_button[type=submit]]:px-4 [&_button[type=submit]]:py-2 [&_button[type=submit]]:text-sm [&_button[type=submit]]:font-medium [&_button[type=submit]]:text-primary-foreground [&_button[type=submit]]:hover:opacity-90";

const resourceNavigation: ResourceItem[] = [
  { id: "book", label: "ARKI · Libro Vivo", description: "Lectura, capítulos y perfiles", icon: BookOpen, path: "/arki-book" },
  { id: "sources", label: "Biblioteca de fuentes", description: "Cámara, documentos y OCR", icon: Library, path: "/sources" },
];

export default function ProjectWorkspace({ active, children, projectId, onNavigate }: { active: WorkspaceSection; children: React.ReactNode; projectId?: string; onNavigate?: (section: WorkspaceSection) => void }) {
  const { loading, user } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ modules: true, resources: true });

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!user && !TEMPORARY_DIRECT_ACCESS) return <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground"><div className="max-w-md border border-border bg-card p-10 text-center shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t("header.title")}</p><h1 className="mt-4 font-serif text-4xl">{t("auth.sign_in_title", "Inicia sesión para conservar el registro.")}</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">{t("auth.sign_in_description", "La autenticación identifica al actor. No concede autoridad para decidir.")}</p><button type="button" onClick={() => startLogin()} className="mt-7 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">{t("auth.sign_in", "Iniciar sesión")}</button></div></div>;

  const navigate = (item: NavigationItem | ResourceItem) => {
    if ("id" in item && workspaceNavigation.some((entry) => entry.id === item.id)) {
      if (onNavigate) return onNavigate(item.id as WorkspaceSection);
      if (item.id !== "overview") { window.location.hash = item.id; return; }
    }
    const path = item.id === "sources" ? `${item.path}?project=${encodeURIComponent(projectId ?? "")}` : item.path;
    setLocation(path);
  };

  const groups = useMemo<IndexGroup[]>(() => [
    { id: "modules", label: "Módulos del proyecto", items: workspaceNavigation },
    { id: "resources", label: "Recursos ARKI", items: resourceNavigation },
  ], []);
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredGroups = groups.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      const label = t(item.label, item.label);
      const description = "description" in item ? item.description : "";
      return !normalizedSearch || `${label} ${description}`.toLocaleLowerCase().includes(normalizedSearch);
    }),
  })).filter((group) => group.items.length > 0);
  const toggleGroup = (id: string) => setOpenGroups((current) => ({ ...current, [id]: !current[id] }));

  return <div className="min-h-screen bg-background text-foreground"><AppHeader /><div className="mx-auto grid max-w-[1500px] grid-cols-1 md:grid-cols-[280px_1fr]">
    <aside className="border-b border-border bg-secondary p-4 md:sticky md:top-[var(--app-header-height,0px)] md:h-[calc(100svh-var(--app-header-height,0px))] md:overflow-y-auto md:border-b-0 md:border-r md:p-5" aria-label="Índice del proyecto">
      <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Índice ARKI</p><p className="mt-1 text-xs text-muted-foreground">Todo el proyecto, en un solo panel</p></div><BookOpen className="h-4 w-4 text-muted-foreground" /></div>
      <label className="relative block"><span className="sr-only">Buscar módulos y recursos</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en el índice..." className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /></label>
      <nav className="mt-5 space-y-3" aria-label={t("nav.navigation", "Navegación principal")}>
        {filteredGroups.map((group) => <section key={group.id} className="border-t border-border pt-3 first:border-t-0 first:pt-0"><button type="button" onClick={() => toggleGroup(group.id)} aria-expanded={openGroups[group.id] || Boolean(normalizedSearch)} className="flex w-full items-center justify-between gap-3 px-1 py-2 text-left text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"><span>{group.label}</span><ChevronDown className={cn("h-4 w-4 transition-transform", (openGroups[group.id] || normalizedSearch) && "rotate-180")} /></button>{(openGroups[group.id] || Boolean(normalizedSearch)) && <div className="mt-1 space-y-2">{group.items.map((item) => { const Icon = item.icon; const isActive = "id" in item && item.id === active; const label = t(item.label, item.label); const description = "description" in item ? item.description : undefined; return <button key={item.id} type="button" onClick={() => navigate(item)} aria-current={isActive ? "page" : undefined} className={cn("group relative flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", isActive ? "border-primary bg-primary font-semibold text-primary-foreground shadow-[inset_4px_0_0_var(--accent)]" : "border-transparent text-secondary-foreground hover:border-border hover:bg-background")}>{isActive && <span aria-hidden="true" className="absolute left-0 top-2 h-7 w-1 rounded-r bg-accent" />}<Icon className={cn("mt-0.5 h-4 w-4 shrink-0", isActive ? "text-accent" : "group-hover:text-primary")} /><span className="min-w-0"><span className="block">{label}</span>{description && <span className={cn("mt-1 block text-xs leading-4", isActive ? "text-primary-foreground/75" : "text-muted-foreground")}>{description}</span>}</span>{isActive && <span className="ml-auto shrink-0 text-[10px] uppercase tracking-[0.12em] text-accent">{t("guided.status.active", "Activo")}</span>}</button>; })}</div>}</section>)}
        {filteredGroups.length === 0 && <p className="rounded-md border border-dashed border-border p-3 text-xs leading-5 text-muted-foreground">No hay coincidencias. Prueba con otro término.</p>}
      </nav>
      <div className="mt-6 border-t border-border pt-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("page.integrity_rule", "Regla de integridad")}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{t("page.integrity_description", "El Consejo observa. La Recomendación describe. HumanReview registra. La Decision requiere autoridad explícita.")}</p></div>
    </aside>
    <main className={shellMainClass}>{children}</main>
  </div></div>;
}

export type { NavigationItem };
export { workspaceNavigation as navigation };
export { shellMainClass };
export const projectWorkspaceNavigation = workspaceNavigation;
export const workspaceSections = workspaceNavigation;
export const projectModules = workspaceNavigation;
export const canonicalWorkspaceNavigation = workspaceNavigation;
export const workspaceMenu = workspaceNavigation;
export const projectMenu = workspaceNavigation;
export const projectRoutes = workspaceNavigation;
export const workspaceRoutes = workspaceNavigation;
export function getWorkspaceSectionFromHash(hash: string): WorkspaceSection { const value = hash.replace(/^#/, "") as WorkspaceSection; return workspaceNavigation.some((item) => item.id === value) ? value : "overview"; }
export type { WorkspaceSection as ProjectWorkspaceSection };
export type { WorkspaceSection as ProjectSection };
