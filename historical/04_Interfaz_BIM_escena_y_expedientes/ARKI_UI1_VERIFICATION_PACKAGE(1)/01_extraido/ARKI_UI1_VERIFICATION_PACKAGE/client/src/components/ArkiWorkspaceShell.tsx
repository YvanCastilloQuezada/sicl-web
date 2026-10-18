import { useEffect, useMemo, useState } from "react";
import { BarChart3, Box, Building2, ChevronLeft, CircleHelp, ClipboardCheck, DoorOpen, FileText, Layers3, LayoutDashboard, LogOut, Network, PanelLeft, Settings2, ShieldAlert, SlidersHorizontal, WalletCards, Workflow } from "lucide-react";
import { toast } from "sonner";
import type { ArkiAccess } from "./ArkiGateway";
import { accessColor, accessLabel, accessSubtitle, isAccessAllowed } from "./ArkiGateway";

const modules = [
  ["Inicio", LayoutDashboard], ["Proyectos", Building2], ["Generador", Workflow], ["Modelo BIM", Layers3], ["Planta", PanelLeft], ["Corte", SlidersHorizontal], ["3D", Box], ["Metrados", BarChart3], ["Presupuesto", WalletCards], ["4D", ClipboardCheck], ["Clashes", ShieldAlert], ["Expediente", FileText], ["O&M", Settings2], ["Configuración", Settings2],
] as const;

export default function ArkiWorkspaceShell({ access, onExit, children }: { access: ArkiAccess; onExit: () => void; children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState("Generador");
  const [navOpen, setNavOpen] = useState(true);
  const roleColor = accessColor(access);
  const availableModules = useMemo(() => modules.filter(([name]) => isAccessAllowed(access, name)), [access]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); toast.info("Búsqueda de comandos", { description: "UI-1: usa las pestañas del workspace para navegar." }); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); toast.success("Borrador local listo", { description: "La persistencia corporativa se implementará en la fase de backend." }); }
      if (event.key === "Escape") toast.dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectModule = (name: string) => {
    setActiveModule(name);
    if (name !== "Generador") toast.info(`${name} seleccionado`, { description: "El módulo está registrado en el shell; su integración de dominio se habilita por fase." });
  };

  return <div className="arki-workspace"><header className="arki-workspace-top"><div className="arki-workspace-brand"><div className="arki-mini-mark"><Workflow size={16} /></div><div><strong>ARKI</strong><span>BIM WORKSPACE</span></div></div><div className="arki-project-context"><span>PROYECTO ACTIVO</span><b>Generador de familias</b><i>v1.0 · LOCAL</i></div><div className="arki-top-actions"><span className={`arki-role-badge role-${roleColor}`}>{accessLabel(access)} · PERFIL LOCAL</span><button className="arki-icon-button" title="Ayuda" onClick={() => toast.info("Ayuda ARKI", { description: "Ctrl/Cmd+K abre la búsqueda de comandos." })}><CircleHelp size={16} /></button><button className="arki-icon-button" title="Salir" onClick={onExit}><LogOut size={16} /></button></div></header><div className="arki-workspace-tabs">{["Inicio", "Generador", "Planta", "Corte", "3D", "BIM", "Presupuesto", "4D", "Clashes", "Expediente"].map((tab) => <button key={tab} className={activeModule === tab || (tab === "BIM" && activeModule === "Modelo BIM") ? "active" : ""} onClick={() => selectModule(tab === "BIM" ? "Modelo BIM" : tab)}>{tab}</button>)}</div><div className="arki-workspace-body"><aside className={`arki-module-nav ${navOpen ? "open" : "closed"}`}><button className="arki-collapse" onClick={() => setNavOpen((value) => !value)}><PanelLeft size={14} />{navOpen && "NAVEGADOR"}</button>{navOpen && <><div className="arki-nav-context"><span>PERFIL ACTIVO</span><strong>{accessSubtitle(access)}</strong><small>PROTOTIPO LOCAL</small></div><nav>{availableModules.map(([name, Icon]) => <button key={name} className={activeModule === name ? "active" : ""} onClick={() => selectModule(name)}><Icon size={14} /><span>{name}</span>{["Costos contractuales", "Administración"].includes(name) && <small>PRO</small>}</button>)}</nav><div className="arki-nav-foot"><span className="arki-engine-dot" /> MOTOR LOCAL OPERATIVO</div></>}</aside><main className="arki-workspace-canvas"><div className="arki-context-toolbar"><div><span className="arki-context-kicker"><Workflow size={12} /> {activeModule.toUpperCase()}</span><strong>{activeModule === "Generador" ? "Generador dinámico de familias" : activeModule}</strong></div><div className="arki-context-actions"><span>PE · RNE-PE</span><span>ESCALA 1:100</span><span>UI-1</span></div></div><div className="arki-legacy-content">{children}</div></main><aside className="arki-info-box"><div className="arki-info-head"><span>INFO BOX</span><button onClick={() => toast.info("Selecciona un elemento del canvas")}>?</button></div><div className="arki-info-empty"><DoorOpen size={22} /><strong>Sin selección</strong><p>Selecciona una familia, espacio o elemento para consultar sus propiedades, materiales, metrados, costo y trazabilidad.</p></div><div className="arki-info-status"><span className="arki-engine-dot" />{accessLabel(access)}<b>LOCAL</b></div></aside></div><footer className="arki-workspace-status"><span><i className="arki-engine-dot" /> MOTOR OPERATIVO</span><span>UNIDADES: MÉTRICO</span><span>DISCIPLINA: ARQUITECTURA</span><span>FASE: PROPUESTA</span><span className="arki-status-warning">REVISIÓN ESPECIALISTA REQUERIDA</span><span className="arki-status-spacer" /><span>Ctrl/Cmd+K COMANDOS</span></footer></div>;
}
