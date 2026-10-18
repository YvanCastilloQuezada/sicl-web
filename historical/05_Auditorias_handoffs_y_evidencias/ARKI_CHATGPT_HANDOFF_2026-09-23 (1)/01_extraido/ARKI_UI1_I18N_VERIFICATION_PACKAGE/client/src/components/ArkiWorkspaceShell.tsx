import { useEffect, useMemo, useState } from "react";
import { BarChart3, Box, Building2, CircleHelp, ClipboardCheck, DoorOpen, FileText, Layers3, LayoutDashboard, LogOut, PanelLeft, Settings2, ShieldAlert, SlidersHorizontal, WalletCards, Workflow } from "lucide-react";
import { toast } from "sonner";
import type { ArkiAccess } from "./ArkiGateway";
import { accessColor, accessLabel, accessSubtitle, isAccessAllowed, type ArkiModuleDefinition } from "./ArkiGateway";
import { useTranslation } from "../i18n/useTranslation";
import { supportedLanguages } from "../i18n/languages";
import type { TranslationKey } from "../i18n/catalog";

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



const MODULE_LABEL_KEYS: Record<string, TranslationKey> = { Inicio: "home", Biblioteca: "library", Proyectos: "projectsModule", Generador: "generatorModule", "Modelo BIM": "bimModule", Planta: "plan", Corte: "section", "3D": "model3d", Metrados: "quantities", Presupuesto: "budget", "Costos contractuales": "contractCosts", "4D": "schedule4d", Clashes: "clashesModule", Expediente: "dossier", "O&M": "operations", Administración: "administration" };
function moduleLabelKey(name: string) { return MODULE_LABEL_KEYS[name] ?? name; }
export function moduleDefinition(name: string) { return MODULE_DEFINITIONS.find((module) => module.name === name); }

function EmptyModuleState({ name }: { name: string }) {
  const { t } = useTranslation();
  const definition = moduleDefinition(name);
  return <div className="arki-empty-module"><div className="arki-empty-module-icon"><Workflow size={24} /></div><span className="arki-context-kicker">MÓDULO REGISTRADO · {definition?.status ?? "PENDING"}</span><h2>{t(moduleLabelKey(name))}</h2><p>Este módulo está integrado al workspace, pero su integración de dominio aún está pendiente. El generador funcional permanece disponible desde la pestaña Generador.</p><small>{t("status")}: {definition?.status ?? "NOT AVAILABLE"} · {t("ui1")}</small></div>;
}

export default function ArkiWorkspaceShell({ access, onExit, children }: { access: ArkiAccess; onExit: () => void; children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState("Generador");
  const [navOpen, setNavOpen] = useState(true);
  const { language, setLanguage, t } = useTranslation();
  const roleColor = accessColor(access);
  const availableModules = useMemo(() => MODULE_DEFINITIONS.filter(({ name }) => isAccessAllowed(access, name)), [access]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); toast.info(t("searchCommands"), { description: t("commandHint") }); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); toast.success(t("localDraft"), { description: t("backendLater") }); }
      if (event.key === "Escape") toast.dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectModule = (name: string) => { setActiveModule(name); if (name !== "Generador") toast.info(`${name} seleccionado`, { description: t("moduleStateShown") }); };
  const changeLanguage = () => { const currentIndex = supportedLanguages.findIndex(({ code }) => code === language); const next = supportedLanguages[(currentIndex + 1) % supportedLanguages.length]; setLanguage(next.code); toast.info(`${t("languageSelected")}: ${next.nativeLabel}`, { description: t("languagePrepared") }); };
  const activeDefinition = moduleDefinition(activeModule);

  return <div className="arki-workspace"><header className="arki-workspace-top"><div className="arki-workspace-brand"><div className="arki-mini-mark"><Workflow size={16} /></div><div><strong>ARKI</strong><span>{t("workspace")}</span></div></div><div className="arki-project-context"><span>{t("activeProject")}</span><b>{t("projectName")}</b><i>v1.0 · {t("local")}</i></div><div className="arki-top-actions"><span className={`arki-role-badge role-${roleColor}`}>{accessLabel(access)} · PERFIL LOCAL</span><button className="arki-language-button" title={t("changeLanguage")} onClick={changeLanguage}>🌐 {language.toUpperCase()}</button><button className="arki-icon-button" title={t("help")} onClick={() => toast.info(t("help"), { description: t("commandHint") })}><CircleHelp size={16} /></button><button className="arki-icon-button" title={t("exit")} onClick={onExit}><LogOut size={16} /></button></div></header><div className="arki-workspace-tabs">{["Inicio", "Generador", "Planta", "Corte", "3D", "BIM", "Presupuesto", "4D", "Clashes", "Expediente"].map((tab) => { const name = tab === "BIM" ? "Modelo BIM" : tab; return <button key={tab} className={activeModule === name ? "active" : ""} onClick={() => selectModule(name)}>{t(tab === "Inicio" ? "home" : tab === "Generador" ? "generatorModule" : tab === "Planta" ? "plan" : tab === "Corte" ? "section" : tab === "3D" ? "model3d" : tab === "BIM" ? "bimModule" : tab === "Presupuesto" ? "budget" : tab === "4D" ? "schedule4d" : tab === "Clashes" ? "clashesModule" : "dossier")}</button>; })}</div><div className="arki-workspace-body"><aside className={`arki-module-nav ${navOpen ? "open" : "closed"}`}><button className="arki-collapse" onClick={() => setNavOpen((value) => !value)}><PanelLeft size={14} />{navOpen && t("navigator")}</button>{navOpen && <><div className="arki-nav-context"><span>{t("activeProfile")}</span><strong>{t(accessSubtitle(access))}</strong><small>{t("prototype")}</small></div><nav>{availableModules.map(({ name, icon: Icon, status }) => <button key={name} className={activeModule === name ? "active" : ""} onClick={() => selectModule(name)}><Icon size={14} /><span>{t(moduleLabelKey(name))}</span><small className={`arki-module-status status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</small></button>)}</nav><div className="arki-nav-foot"><span className="arki-engine-dot" /> {t("engine")}</div></>}</aside><main className="arki-workspace-canvas"><div className="arki-context-toolbar"><div><span className="arki-context-kicker"><Workflow size={12} /> {activeModule.toUpperCase()} · {activeDefinition?.status ?? "PENDING"}</span><strong>{activeModule === "Generador" ? t("generator") : t(moduleLabelKey(activeModule))}</strong></div><div className="arki-context-actions"><span>PE · RNE-PE</span><span>ESCALA 1:100</span><span>UI-1</span></div></div><div className="arki-legacy-content">{activeModule === "Generador" ? children : <EmptyModuleState name={activeModule} />}</div></main><aside className="arki-info-box"><div className="arki-info-head"><span>{t("infoBox")} · {t("pendingSelection")}</span><button onClick={() => toast.info(t("selectionUi2"))}>?</button></div><div className="arki-info-empty"><DoorOpen size={22} /><strong>{t("noSelection")}</strong><p>El canvas aún no emite un contrato de selección. Cuando se integre, aquí aparecerán propiedades, materiales, metrados, costo y trazabilidad.</p></div><div className="arki-info-status"><span className="arki-engine-dot" />{t(accessLabel(access))}<b>{t("local")}</b></div></aside></div><footer className="arki-workspace-status"><span><i className="arki-engine-dot" /> MOTOR OPERATIVO</span><span>{t("units")}</span><span>{t("discipline")}</span><span>{t("phase")}</span><span className="arki-status-warning">{t("visibleStates")}</span><span className="arki-status-spacer" /><span>{t("commands")}</span></footer></div>;
}
