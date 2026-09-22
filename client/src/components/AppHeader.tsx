import React from "react";
import { Camera, ChevronDown, Copy, Mail, MessageCircle, Mic, Monitor, Moon, Network, Plus, ScanLine, Search, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import HelpButton from "@/components/HelpButton";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ensureProjectId } from "@/lib/project-id";
import { trpc } from "@/lib/trpc";

export const ARKI_CONTROL_CENTER_PATH = "/control-center";

function projectName(project: unknown): string {
  const value = project as { name?: unknown };
  return typeof value.name === "string" && value.name.trim() ? value.name : "Proyecto sin nombre";
}

function projectDate(project: unknown): string {
  const value = project as { updatedAt?: unknown; updated_at?: unknown; createdAt?: unknown; created_at?: unknown };
  const raw = value.updatedAt ?? value.updated_at ?? value.createdAt ?? value.created_at;
  if (!raw) return "Fecha no disponible";
  const date = new Date(String(raw));
  return Number.isNaN(date.getTime()) ? "Fecha no disponible" : `Modificado ${date.toLocaleDateString()}`;
}

function projectInitials(project: unknown): string {
  return projectName(project).split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "P").join("");
}

type ProjectSummary = { projectId: string; name?: string; updatedAt?: string | Date; updated_at?: string | Date; createdAt?: string | Date; created_at?: string | Date };

function ProjectListLoader({ enabled, onProjects }: { enabled: boolean; onProjects: (projects: ProjectSummary[]) => void }) {
  const projects = trpc.projects.list.useQuery(undefined, { retry: false, enabled });
  useEffect(() => { onProjects((projects.data ?? []) as ProjectSummary[]); }, [projects.data, onProjects]);
  return null;
}

export default function AppHeader({ compact = false, hideBrand = false }: { compact?: boolean; hideBrand?: boolean }) {
  const { preference, setThemePreference } = useTheme();
  const { t } = useTranslation();
  const headerRef = useRef<HTMLElement>(null);
  const [voiceActive, setVoiceActive] = React.useState(false);
  const [projectCode, setProjectCode] = React.useState(() => {
    const code = ensureProjectId(localStorage.getItem("arki-active-project-id"));
    localStorage.setItem("arki-active-project-id", code);
    return code;
  });
  const [projectVersion, setProjectVersion] = React.useState(() => localStorage.getItem("arki-project-version") ?? "v1");
  const [copyStatus, setCopyStatus] = React.useState("");
  const [projectMenuOpen, setProjectMenuOpen] = React.useState(false);
  const [projectSearch, setProjectSearch] = React.useState("");
  const [projects, setProjects] = React.useState<ProjectSummary[]>([]);
  const handleProjects = React.useCallback((items: ProjectSummary[]) => setProjects(items), []);

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

  useEffect(() => {
    const handleVersion = (event: Event) => {
      const version = (event as CustomEvent<{ version?: string }>).detail?.version;
      if (version) setProjectVersion(version);
    };
    window.addEventListener("arki:project-version", handleVersion);
    return () => window.removeEventListener("arki:project-version", handleVersion);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("arki-active-project-id");
    const first = projects[0]?.projectId;
    if (!stored && first) {
      setProjectCode(first);
      localStorage.setItem("arki-active-project-id", first);
      setProjectVersion(localStorage.getItem(`arki-project-version:${first}`) ?? "v1");
    }
  }, [projects]);

  const selectProject = (projectId: string) => {
    setProjectCode(projectId);
    localStorage.setItem("arki-active-project-id", projectId);
    setProjectVersion(localStorage.getItem(`arki-project-version:${projectId}`) ?? "v1");
    window.dispatchEvent(new CustomEvent("arki:project-selected", { detail: { projectId } }));
  };

  const projectShareText = `Proyecto ARKI ${projectCode} · ${projectVersion}`;
  const copyProjectReference = async () => {
    try { await navigator.clipboard.writeText(projectShareText); setCopyStatus("Copiado"); }
    catch { setCopyStatus("Copia manualmente"); }
    window.setTimeout(() => setCopyStatus(""), 2200);
  };
  const shareProjectReference = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: projectShareText, text: projectShareText, url: window.location.href }); return; } catch { /* cancelación del usuario */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${projectShareText} ${window.location.href}`)}`, "_blank", "noopener,noreferrer");
  };
  const emailProjectReference = () => { window.location.href = `mailto:?subject=${encodeURIComponent(projectShareText)}&body=${encodeURIComponent(`${projectShareText}\n\nAbrir proyecto: ${window.location.href}`)}`; };
  const projectOptions = Array.from(new Map<ProjectSummary["projectId"], ProjectSummary>([{ projectId: projectCode, name: "Proyecto activo" }, ...projects].map((project) => [project.projectId, project])).values());
  const filteredProjects = projectOptions.filter((project) => `${project.projectId} ${projectName(project)}`.toLowerCase().includes(projectSearch.toLowerCase().trim()));
  const createNewProject = () => {
    const nextCode = ensureProjectId();
    setProjectCode(nextCode);
    setProjectVersion("v1");
    localStorage.setItem("arki-active-project-id", nextCode);
    localStorage.setItem(`arki-project-version:${nextCode}`, "v1");
    setProjectSearch("");
    setProjectMenuOpen(false);
    window.dispatchEvent(new CustomEvent("arki:create-project", { detail: { projectId: nextCode } }));
  };

  return (
    <header ref={headerRef} className={cn("sticky top-0 z-50 border-b border-[#28445b] bg-[#07121e]/95 backdrop-blur", compact ? "px-4 py-2" : "px-5 py-3 md:px-10")}>
      {projectMenuOpen && <ProjectListLoader enabled onProjects={handleProjects} />}
      <div className="mx-auto grid max-w-[1500px] gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        {!hideBrand && <div className="min-w-0">
          <div className="flex items-baseline gap-2"><h1 className={cn("font-serif leading-none tracking-[-0.04em]", compact ? "text-2xl" : "text-3xl md:text-4xl")}>{t("header.title")}</h1><span className={cn("font-medium text-muted-foreground", compact ? "text-xs" : "text-sm md:text-base")}>· by SICL</span></div>
          <p className={cn("font-semibold leading-4 text-foreground", compact ? "mt-0 text-[10px]" : "mt-1 text-xs md:text-sm")}>{t("header.identity_line2")}</p>
        </div>}
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <LanguageSelector />
          <button type="button" onClick={() => window.location.assign(ARKI_CONTROL_CENTER_PATH)} title="Abrir ARKI Control Center" aria-label="Abrir ARKI Control Center" className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#28445b] bg-[#102538] px-3 py-2 text-xs font-semibold text-[#e8f1f7] transition-colors hover:border-[#d4ff3a] hover:bg-[#102538] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff3a]"><Network className="h-3.5 w-3.5 text-[#7dd3fc]" /><span className="hidden sm:inline">Control Center</span></button>
          <HelpButton />
          <div className="flex items-center gap-1 border border-border bg-card p-1" role="group" aria-label="Entrada conversacional ARKI">
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("arki:open-conversation", { detail: { mode: "voice" } }))} title={t("header.voice", "Dictar encargo")} aria-label={t("header.voice", "Dictar encargo")} aria-pressed={voiceActive} className={cn("inline-flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", voiceActive && "animate-pulse rounded-full bg-[#f0a35b] text-[#07121e] ring-2 ring-[#f0a35b]")}><Mic className={cn("h-4 w-4", voiceActive && "animate-bounce")} /></button>
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("arki:open-conversation", { detail: { mode: "camera" } }))} title={t("header.camera", "Añadir contexto visual")} aria-label={t("header.camera", "Añadir contexto visual")} className="inline-flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Camera className="h-4 w-4" /></button>
            <button type="button" onClick={() => window.location.assign("/spatial?mode=ar")} title="Abrir realidad aumentada" aria-label="Abrir realidad aumentada" className="inline-flex h-8 items-center justify-center gap-1 px-1.5 text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ScanLine className="h-4 w-4" /><span className="text-[10px] font-semibold tracking-wide">AR</span></button>
          </div>
          <div role="group" aria-label={t("theme.system")} className="flex items-center border border-border bg-card p-1 text-xs text-foreground">
            <button type="button" onClick={() => setThemePreference("system")} aria-pressed={preference === "system"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "system" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Monitor className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.system")}</span></button>
            <button type="button" onClick={() => setThemePreference("light")} aria-pressed={preference === "light"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "light" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Sun className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.light")}</span></button>
            <button type="button" onClick={() => setThemePreference("dark")} aria-pressed={preference === "dark"} className={cn("inline-flex items-center gap-1 px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", preference === "dark" ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Moon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{t("theme.dark")}</span></button>
          </div>
        </div>
        <div className="relative flex flex-wrap items-center justify-end gap-2 border border-border bg-card px-2 py-1.5 text-xs text-foreground lg:col-start-2 lg:justify-self-end" aria-label="Código y versión del proyecto"><span className="text-muted-foreground">Proyecto</span><button type="button" onClick={() => setProjectMenuOpen((open) => !open)} aria-expanded={projectMenuOpen} aria-haspopup="listbox" className="inline-flex max-w-[15rem] items-center gap-1 font-mono font-semibold tracking-[0.08em] hover:bg-secondary"><span className="truncate">{projectCode}</span><ChevronDown className="h-3.5 w-3.5 shrink-0" /></button><span className="text-muted-foreground">· versión</span><strong>{projectVersion}</strong><button type="button" onClick={() => void copyProjectReference()} title="Copiar código y versión" aria-label="Copiar código y versión" className="inline-flex h-7 w-7 items-center justify-center hover:bg-secondary"><Copy className="h-3.5 w-3.5" /></button><button type="button" onClick={emailProjectReference} title="Enviar por correo" aria-label="Enviar por correo" className="inline-flex h-7 w-7 items-center justify-center hover:bg-secondary"><Mail className="h-3.5 w-3.5" /></button><button type="button" onClick={() => void shareProjectReference()} title="Compartir por WhatsApp o sistema" aria-label="Compartir por WhatsApp o sistema" className="inline-flex h-7 w-7 items-center justify-center hover:bg-secondary"><MessageCircle className="h-3.5 w-3.5" /></button>{copyStatus && <span role="status" className="text-[11px] text-primary">{copyStatus}</span>}{projectMenuOpen && <div role="listbox" aria-label="Proyectos almacenados" className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-md border border-border bg-card p-2 text-foreground shadow-xl"><div className="relative"><Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input autoFocus value={projectSearch} onChange={(event) => setProjectSearch(event.target.value)} placeholder="Buscar por código o nombre" aria-label="Buscar proyectos" className="h-8 w-full rounded border border-border bg-background pl-7 pr-2 text-xs outline-none focus:ring-2 focus:ring-ring" /></div><div className="mt-2 max-h-64 space-y-1 overflow-y-auto">{filteredProjects.map((project) => <button type="button" role="option" aria-selected={project.projectId === projectCode} key={project.projectId} onClick={() => { selectProject(project.projectId); setProjectMenuOpen(false); }} className={cn("flex w-full items-center gap-2 rounded p-2 text-left hover:bg-secondary", project.projectId === projectCode && "bg-secondary")}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">{projectInitials(project)}</span><span className="min-w-0 flex-1"><span className="block truncate font-mono text-xs font-semibold">{project.projectId}</span><span className="block truncate text-[11px] text-muted-foreground">{projectName(project)} · {projectDate(project)}</span></span>{project.projectId === projectCode && <span className="text-[10px] text-primary">Activo</span>}</button>)}{filteredProjects.length === 0 && <p className="p-3 text-center text-xs text-muted-foreground">No se encontraron proyectos.</p>}</div><button type="button" onClick={createNewProject} className="mt-2 flex w-full items-center gap-2 border-t border-border px-2 pt-2 text-left text-xs font-semibold text-primary hover:text-primary/80"><Plus className="h-3.5 w-3.5" />Crear nuevo proyecto</button></div>}</div>
        {t("header.identity_line3") && <p className="max-w-5xl text-xs leading-5 text-muted-foreground lg:col-span-2 md:text-sm">{t("header.identity_line3")}</p>}
      </div>
    </header>
  );
}
