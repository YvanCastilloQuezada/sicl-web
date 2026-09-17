import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Activity, BookOpen, FileText, GitBranch, LayoutDashboard, Scale, ShieldCheck, Target, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import AppHeader from "@/components/AppHeader";

export type WorkspaceSection = "overview" | "context" | "problem" | "alternatives" | "evidence" | "evaluations" | "comparisons" | "council" | "audit" | "governance";
type NavigationItem = { id: WorkspaceSection; label: string; icon: typeof LayoutDashboard; path: string };

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
const shellMainClass = "min-w-0 p-5 text-foreground md:p-10 [&_form]:rounded-md [&_form]:border [&_form]:border-border [&_form]:bg-card [&_form]:p-4 [&_form]:shadow-sm [&_label]:text-sm [&_label]:font-medium [&_input]:mt-1 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-input [&_input]:bg-background [&_input]:px-3 [&_input]:py-2 [&_input]:text-foreground [&_input]:placeholder:text-muted-foreground [&_textarea]:mt-1 [&_textarea]:w-full [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:border-input [&_textarea]:bg-background [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-foreground [&_select]:mt-1 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-input [&_select]:bg-background [&_select]:px-3 [&_select]:py-2 [&_select]:text-foreground [&_table]:w-full [&_table]:text-left [&_th]:border-b [&_th]:border-border [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-muted-foreground [&_td]:border-b [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_button[type=submit]]:rounded-md [&_button[type=submit]]:bg-primary [&_button[type=submit]]:px-4 [&_button[type=submit]]:py-2 [&_button[type=submit]]:text-sm [&_button[type=submit]]:font-medium [&_button[type=submit]]:text-primary-foreground [&_button[type=submit]]:hover:opacity-90";

export default function ProjectWorkspace({ active, children, projectId, onNavigate }: { active: WorkspaceSection; children: React.ReactNode; projectId?: string; onNavigate?: (section: WorkspaceSection) => void }) {
  const { loading, user } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  if (loading) return <div className="min-h-screen bg-background" />;
  if (!user) return <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground"><div className="max-w-md border border-border bg-card p-10 text-center shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t("header.title")}</p><h1 className="mt-4 font-serif text-4xl">{t("auth.sign_in_title", "Inicia sesión para conservar el registro.")}</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">{t("auth.sign_in_description", "La autenticación identifica al actor. No concede autoridad para decidir.")}</p><button type="button" onClick={() => startLogin()} className="mt-7 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">{t("auth.sign_in", "Iniciar sesión")}</button></div></div>;
  const navigate = (item: NavigationItem) => { if (onNavigate) return onNavigate(item.id); if (item.id !== "overview") { window.location.hash = item.id; return; } setLocation(item.path); };
  return <div className="min-h-screen bg-background text-foreground"><AppHeader /><div className="mx-auto grid max-w-[1500px] grid-cols-1 md:grid-cols-[240px_1fr]"><aside className="border-b border-border bg-secondary p-4 md:min-h-[calc(100vh-105px)] md:border-b-0 md:border-r md:p-5"><div className="mb-6 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("page.project_modules", "Módulos del proyecto")}</span><BookOpen className="h-4 w-4 text-muted-foreground" /></div><nav className="grid grid-cols-2 gap-2 md:grid-cols-1" aria-label={t("nav.navigation", "Navegación principal")}>{workspaceNavigation.map((item) => { const Icon = item.icon; const isActive = item.id === active; return <button key={item.id} type="button" onClick={() => navigate(item)} aria-current={isActive ? "page" : undefined} className={cn("group relative flex items-center gap-3 border px-3 py-3 text-left text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", isActive ? "border-primary bg-primary font-semibold text-primary-foreground shadow-[inset_4px_0_0_var(--accent),0_3px_10px_rgba(56,83,72,0.18)]" : "border-transparent text-secondary-foreground hover:border-border hover:bg-background")}>{isActive && <span aria-hidden="true" className="absolute left-0 top-2 h-7 w-1 rounded-r bg-accent" />}<Icon className={cn("h-4 w-4", isActive ? "text-accent" : "group-hover:text-primary")} /><span>{t(item.label)}</span>{isActive && <span className="ml-auto text-[10px] uppercase tracking-[0.12em] text-accent">{t("guided.status.active", "Activo")}</span>}</button>; })}</nav><div className="mt-8 border-t border-border pt-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("page.integrity_rule", "Regla de integridad")}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{t("page.integrity_description", "El Consejo observa. La Recomendación describe. HumanReview registra. La Decision requiere autoridad explícita.")}</p></div></aside><main className={shellMainClass}>{children}</main></div></div>;
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
