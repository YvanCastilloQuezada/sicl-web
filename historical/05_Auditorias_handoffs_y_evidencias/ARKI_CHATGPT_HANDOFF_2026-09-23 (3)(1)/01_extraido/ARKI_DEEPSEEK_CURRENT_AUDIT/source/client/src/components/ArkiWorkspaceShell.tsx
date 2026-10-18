import { useEffect, useMemo, useState } from "react";
import { BarChart3, Box, Building2, CircleHelp, ClipboardCheck, DoorOpen, FileText, Layers3, LayoutDashboard, LogOut, PanelLeft, Settings2, ShieldAlert, SlidersHorizontal, WalletCards, Workflow } from "lucide-react";
import { toast } from "sonner";
import type { ArkiAccess } from "./ArkiGateway";
import { accessColor, accessLabel, isAccessAllowed, type ArkiModuleDefinition } from "./ArkiGateway";
import { useTranslation } from "../i18n/useTranslation";
import { supportedLanguages } from "../i18n/languages";
import ArkiNavigator, { moduleLabelKey } from "./ArkiNavigator";
import ModuleToolbar from "../modules/ModuleToolbar";
import type { TranslationKey } from "../i18n/catalog";
import { useProjectContext } from "../contexts/ProjectContext";
import BimModule from "../modules/BimModule";
import DossierModule from "../modules/DossierModule";

export const MODULE_DEFINITIONS: readonly ArkiModuleDefinition[] = [
  { name: "Data", icon: LayoutDashboard, status: "IMPLEMENTED", allowed: ["visitor", "user", "specialist", "corporate"] },
  { name: "Biblioteca", icon: Layers3, status: "PARTIAL", allowed: ["visitor", "user", "specialist", "corporate"] },
  { name: "Proyectos", icon: Building2, status: "CONCEPTUAL", allowed: ["user", "specialist", "corporate"] },
  { name: "Generador", icon: Workflow, status: "VERIFIED", allowed: ["user", "specialist", "corporate"] },
  { name: "Modelo BIM", icon: Layers3, status: "VERIFIED", allowed: ["user", "specialist", "corporate"] },
  { name: "Planta", icon: PanelLeft, status: "CONCEPTUAL", allowed: ["user", "specialist", "corporate"] },
  { name: "Corte", icon: SlidersHorizontal, status: "CONCEPTUAL", allowed: ["user", "specialist", "corporate"] },
  { name: "3D", icon: Box, status: "CONCEPTUAL", allowed: ["user", "specialist", "corporate"] },
  { name: "Metrados", icon: BarChart3, status: "VERIFIED", allowed: ["user", "specialist", "corporate"] },
  { name: "PRESUP-5D", icon: WalletCards, status: "VERIFIED", allowed: ["user", "specialist", "corporate"] },
  { name: "GASTOS", icon: WalletCards, status: "NOT AVAILABLE", allowed: ["user", "specialist", "corporate"] },
  { name: "4D", icon: ClipboardCheck, status: "PARTIAL", allowed: ["user", "specialist", "corporate"] },
  { name: "Clashes", icon: ShieldAlert, status: "PARTIAL", allowed: ["specialist", "corporate"] },
  { name: "EXP-TEC", icon: FileText, status: "PARTIAL", allowed: ["user", "specialist", "corporate"] },
  { name: "O-M", icon: Settings2, status: "FUTURE REFERENCE", allowed: ["user", "specialist", "corporate"] },
  { name: "ADM", icon: Settings2, status: "FUTURE REFERENCE", allowed: ["corporate"] },
];



export const MODULE_LABEL_KEYS: Record<string, TranslationKey> = { Data: "dataModule", Biblioteca: "library", Proyectos: "projectsModule", Generador: "generatorModule", "Modelo BIM": "bimModule", Planta: "plan", Corte: "section", "3D": "model3d", Metrados: "quantities", "PRESUP-5D": "budget5d", GASTOS: "expensesModule", "4D": "schedule4d", Clashes: "clashesModule", "EXP-TEC": "technicalDossier", "O-M": "operationsManagement", ADM: "administrationModule" };
// moduleLabelKey is shared with the overlay Navigator.
export function moduleDefinition(name: string) { return MODULE_DEFINITIONS.find((module) => module.name === name); }

function EmptyModuleState({ name }: { name: string }) {
  const { t } = useTranslation();
  const definition = moduleDefinition(name);
  return <div className="arki-empty-module"><div className="arki-empty-module-icon"><Workflow size={24} /></div><span className="arki-context-kicker">MÓDULO REGISTRADO · {definition?.status ?? "PENDING"}</span><h2>{t(moduleLabelKey(name))}</h2><p>Este módulo está integrado al workspace, pero su integración de dominio aún está pendiente. El generador funcional permanece disponible desde la pestaña Generador.</p><small>{t("status")}: {definition?.status ?? "NOT AVAILABLE"} · {t("ui1")}</small></div>;
}

export default function ArkiWorkspaceShell({ access, onExit, children }: { access: ArkiAccess; onExit: () => void; children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState("Generador");
  const [navOpen, setNavOpen] = useState(false);
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
  const { building } = useProjectContext();

  return <div className="arki-workspace"><header className="arki-workspace-top"><div className="arki-workspace-brand"><div className="arki-mini-mark"><Workflow size={16} /></div><div><strong>ARKI</strong><span>{t("workspace")}</span></div></div><div className="arki-project-context"><span>{t("activeProject")}</span><b>{t("projectName")}</b><i>v1.0 · {t("local")}</i></div><div className="arki-top-actions"><span className={`arki-role-badge role-${roleColor}`}>{accessLabel(access)}</span><button className="arki-language-button" title={t("changeLanguage")} onClick={changeLanguage}>🌐 {language.toUpperCase()}</button><button className="arki-icon-button" title={t("help")} onClick={() => toast.info(t("help"), { description: t("commandHint") })}><CircleHelp size={16} /></button><button className="arki-icon-button" title={t("exit")} onClick={onExit}><LogOut size={16} /></button></div></header><div className="arki-workspace-tabs"><span className="arki-project-chip">PROYECTO ACTIVO · {t("projectName")}</span>{availableModules.map(({ name, status }) => { const disabled = status === "NOT AVAILABLE" || status === "FUTURE REFERENCE"; return <button key={name} className={activeModule === name ? "active" : ""} disabled={disabled} title={disabled ? t("unavailableModuleTooltip") : undefined} onClick={() => selectModule(name)}><i className={`arki-tab-status-dot status-${status.toLowerCase().replaceAll(" ", "-")}`} />{t(moduleLabelKey(name))}</button>; })}</div><div className="arki-workspace-body"><ArkiNavigator access={access} activeModule={activeModule} modules={MODULE_DEFINITIONS} open={navOpen} onToggle={() => setNavOpen((value) => !value)} onSelect={selectModule} /><main className="arki-workspace-canvas"><div className="arki-context-toolbar"><div><strong>{activeModule === "Generador" ? t("generator") : t(moduleLabelKey(activeModule))}</strong></div><div className="arki-context-actions"><span>{activeDefinition?.status ?? "PENDING"}</span></div></div><ModuleToolbar module={activeModule} /><div className="arki-legacy-content">{activeModule === "Generador" ? children : activeModule === "Modelo BIM" ? <BimModule building={building} /> : activeModule === "EXP-TEC" ? <DossierModule building={building} /> : <EmptyModuleState name={activeModule} />}</div></main><aside className="arki-info-box"><div className="arki-info-head"><span>{t("infoBox")} · {t("pendingSelection")}</span><button onClick={() => toast.info(t("selectionUi2"))}>?</button></div><div className="arki-info-empty"><DoorOpen size={22} /><strong>{t("noSelection")}</strong><p>El canvas aún no emite un contrato de selección. Cuando se integre, aquí aparecerán propiedades, materiales, metrados, costo y trazabilidad.</p></div><div className="arki-info-status"><span className="arki-engine-dot" />{t(accessLabel(access))}<b>{t("local")}</b></div></aside></div><footer className="arki-workspace-status"><span><i className="arki-engine-dot" /> MOTOR OPERATIVO</span><span>v1.0 · {t("local")}</span><span className="arki-status-warning">{t("unavailableModuleTooltip")}</span></footer></div>;
}
