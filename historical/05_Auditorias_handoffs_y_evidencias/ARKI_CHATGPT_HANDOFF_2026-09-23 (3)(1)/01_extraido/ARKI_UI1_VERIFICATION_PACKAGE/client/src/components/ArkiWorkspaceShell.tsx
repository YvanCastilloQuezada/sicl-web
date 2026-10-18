import { useEffect, useMemo, useState } from "react";
import { BarChart3, Box, Building2, CircleHelp, ClipboardCheck, DoorOpen, FileText, Layers3, LayoutDashboard, LogOut, PanelLeft, Settings2, ShieldAlert, SlidersHorizontal, WalletCards, Workflow } from "lucide-react";
import { toast } from "sonner";
import type { ArkiAccess } from "./ArkiGateway";
import { accessColor, accessLabel, accessSubtitle, isAccessAllowed, type ArkiModuleDefinition } from "./ArkiGateway";

export const MODULE_DEFINITIONS: readonly ArkiModuleDefinition[] = [
  { name: "Inicio", icon: LayoutDashboard, status: "IMPLEMENTED", allowed: ["visitor", "user", "specialist", "corporate"] },
  { name: "Biblioteca", icon: Layers3, status: "PARTIAL", allowed: ["visitor", "user", "specialist", "corporate"] },
  { name: "Proyectos", icon: Building2, status: "CONCEPTUAL", allowed: ["user", "specialist", "corporate"] },
  { name: "Generador", icon: Workflow, status: "VERIFIED", allowed: ["user", "specialist", "corporate"] },
  { name: "Modelo BIM", icon: Layers3, status: "VERIFIED", allowed: ["user", "specialist", "corporate"] },
  { name: "Planta", icon: PanelLeft, status: "CONCEPTUAL", allowed: ["user", "specialist", "corporate"] },
  { name: "Corte", icon: SlidersHorizontal, status: "CONCEPTUAL", allowed: ["user", "specialist", "corporate"] },
  { name: "3D", icon: Box, status: "CONCEPTUAL", allowed: ["user", "specialist", "corporate"] },
  { name: "Metrados", icon: BarChart3, status: "VERIFIED", allowed: ["user", "specialist", "corporate"] },
  { name: "Presupuesto", icon: WalletCards, status: "VERIFIED", allowed: ["user", "specialist", "corporate"] },
  { name: "Costos contractuales", icon: WalletCards, status: "NOT AVAILABLE", allowed: ["corporate"] },
  { name: "4D", icon: ClipboardCheck, status: "PARTIAL", allowed: ["user", "specialist", "corporate"] },
  { name: "Clashes", icon: ShieldAlert, status: "PARTIAL", allowed: ["specialist", "corporate"] },
  { name: "Expediente", icon: FileText, status: "PARTIAL", allowed: ["user", "specialist", "corporate"] },
  { name: "O&M", icon: Settings2, status: "FUTURE REFERENCE", allowed: ["specialist", "corporate"] },
  { name: "Administración", icon: Settings2, status: "FUTURE REFERENCE", allowed: ["corporate"] },
];

export function moduleDefinition(name: string) { return MODULE_DEFINITIONS.find((module) => module.name === name); }

function EmptyModuleState({ name }: { name: string }) {
  const definition = moduleDefinition(name);
  return <div className="arki-empty-module"><div className="arki-empty-module-icon"><Workflow size={24} /></div><span className="arki-context-kicker">MÓDULO REGISTRADO · {definition?.status ?? "PENDING"}</span><h2>{name}</h2><p>Este módulo está integrado al workspace, pero su integración de dominio aún está pendiente. El generador funcional permanece disponible desde la pestaña Generador.</p><small>Estado: {definition?.status ?? "NOT AVAILABLE"} · UI-1</small></div>;
}

export default function ArkiWorkspaceShell({ access, onExit, children }: { access: ArkiAccess; onExit: () => void; children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState("Generador");
  const [navOpen, setNavOpen] = useState(true);
  const roleColor = accessColor(access);
  const availableModules = useMemo(() => MODULE_DEFINITIONS.filter(({ name }) => isAccessAllowed(access, name)), [access]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); toast.info("Búsqueda de comandos", { description: "UI-1: usa las pestañas del workspace para navegar." }); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); toast.success("Borrador local listo", { description: "La persistencia corporativa se implementará en la fase de backend." }); }
      if (event.key === "Escape") toast.dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectModule = (name: string) => { setActiveModule(name); if (name !== "Generador") toast.info(`${name} seleccionado`, { description: "El estado del módulo ahora se muestra en el canvas." }); };
  const activeDefinition = moduleDefinition(activeModule);

  return <div className="arki-workspace"><header className="arki-workspace-top"><div className="arki-workspace-brand"><div className="arki-mini-mark"><Workflow size={16} /></div><div><strong>ARKI</strong><span>BIM WORKSPACE</span></div></div><div className="arki-project-context"><span>PROYECTO ACTIVO</span><b>Generador de familias</b><i>v1.0 · LOCAL</i></div><div className="arki-top-actions"><span className={`arki-role-badge role-${roleColor}`}>{accessLabel(access)} · PERFIL LOCAL</span><button className="arki-icon-button" title="Ayuda" onClick={() => toast.info("Ayuda ARKI", { description: "Ctrl/Cmd+K abre la búsqueda de comandos." })}><CircleHelp size={16} /></button><button className="arki-icon-button" title="Salir" onClick={onExit}><LogOut size={16} /></button></div></header><div className="arki-workspace-tabs">{["Inicio", "Generador", "Planta", "Corte", "3D", "BIM", "Presupuesto", "4D", "Clashes", "Expediente"].map((tab) => { const name = tab === "BIM" ? "Modelo BIM" : tab; return <button key={tab} className={activeModule === name ? "active" : ""} onClick={() => selectModule(name)}>{tab}</button>; })}</div><div className="arki-workspace-body"><aside className={`arki-module-nav ${navOpen ? "open" : "closed"}`}><button className="arki-collapse" onClick={() => setNavOpen((value) => !value)}><PanelLeft size={14} />{navOpen && "NAVEGADOR"}</button>{navOpen && <><div className="arki-nav-context"><span>PERFIL ACTIVO</span><strong>{accessSubtitle(access)}</strong><small>PROTOTIPO LOCAL</small></div><nav>{availableModules.map(({ name, icon: Icon, status }) => <button key={name} className={activeModule === name ? "active" : ""} onClick={() => selectModule(name)}><Icon size={14} /><span>{name}</span><small className={`arki-module-status status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</small></button>)}</nav><div className="arki-nav-foot"><span className="arki-engine-dot" /> MOTOR LOCAL OPERATIVO</div></>}</aside><main className="arki-workspace-canvas"><div className="arki-context-toolbar"><div><span className="arki-context-kicker"><Workflow size={12} /> {activeModule.toUpperCase()} · {activeDefinition?.status ?? "PENDING"}</span><strong>{activeModule === "Generador" ? "Generador dinámico de familias" : activeModule}</strong></div><div className="arki-context-actions"><span>PE · RNE-PE</span><span>ESCALA 1:100</span><span>UI-1</span></div></div><div className="arki-legacy-content">{activeModule === "Generador" ? children : <EmptyModuleState name={activeModule} />}</div></main><aside className="arki-info-box"><div className="arki-info-head"><span>INFO BOX · SELECCIÓN PENDIENTE</span><button onClick={() => toast.info("La selección de elementos se integrará con el canvas BIM en UI-2")}>?</button></div><div className="arki-info-empty"><DoorOpen size={22} /><strong>Sin selección</strong><p>El canvas aún no emite un contrato de selección. Cuando se integre, aquí aparecerán propiedades, materiales, metrados, costo y trazabilidad.</p></div><div className="arki-info-status"><span className="arki-engine-dot" />{accessLabel(access)}<b>LOCAL</b></div></aside></div><footer className="arki-workspace-status"><span><i className="arki-engine-dot" /> MOTOR OPERATIVO</span><span>UNIDADES: MÉTRICO</span><span>DISCIPLINA: ARQUITECTURA</span><span>FASE: PROPUESTA</span><span className="arki-status-warning">ESTADOS UI-1 VISIBLES</span><span className="arki-status-spacer" /><span>Ctrl/Cmd+K COMANDOS</span></footer></div>;
}
