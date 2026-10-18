import { ArrowRight, Building2, Calculator, Eye, ShieldCheck, UsersRound, Workflow, type LucideIcon } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
import type { TranslationKey } from "../i18n/catalog";

export type ArkiAccess = "visitor" | "user" | "specialist" | "corporate";
export type ArkiModuleStatus = "IMPLEMENTED" | "VERIFIED" | "PARTIAL" | "CONCEPTUAL" | "NOT AVAILABLE" | "FUTURE REFERENCE";
export type ArkiModuleDefinition = { name: string; icon: LucideIcon; status: ArkiModuleStatus; allowed: readonly ArkiAccess[] };
type AccessCard = { id: ArkiAccess; titleKey: TranslationKey; subtitleKey: TranslationKey; descriptionKey: TranslationKey; icon: LucideIcon; accent: "yellow" | "orange" | "cyan" | "green"; moduleKeys: readonly TranslationKey[] };

export const ACCESS_CARDS: readonly AccessCard[] = [
  { id: "visitor", titleKey: "visitor", subtitleKey: "visitorSubtitle", descriptionKey: "visitorDescription", icon: Eye, accent: "yellow", moduleKeys: ["demo", "publicLibrary", "documentation"] },
  { id: "user", titleKey: "user", subtitleKey: "userSubtitle", descriptionKey: "userDescription", icon: Building2, accent: "orange", moduleKeys: ["projects", "generatorShort", "bimShort"] },
  { id: "specialist", titleKey: "specialist", subtitleKey: "specialistSubtitle", descriptionKey: "specialistDescription", icon: UsersRound, accent: "cyan", moduleKeys: ["disciplines", "review", "interferences"] },
  { id: "corporate", titleKey: "corporate", subtitleKey: "corporateSubtitle", descriptionKey: "corporateDescription", icon: Calculator, accent: "green", moduleKeys: ["costs", "clashesShort", "governance"] },
];

export default function ArkiGateway({ onEnter }: { onEnter: (access: ArkiAccess) => void }) {
  const { t } = useTranslation();
  return <main className="arki-gateway"><div className="gateway-orbit gateway-orbit-a" /><div className="gateway-orbit gateway-orbit-b" /><section className="gateway-inner"><header className="gateway-brand"><div className="gateway-mark"><Workflow size={23} /></div><div><strong>{t("brand")}</strong><span>{t("runtime")}</span></div><div className="gateway-status"><span /> {t("engine")}</div></header><div className="gateway-copy"><span className="gateway-kicker"><ShieldCheck size={14} /> {t("gatewayKicker")}</span><h1>{t("gatewayTitle")}<br /><em>{t("gatewayTitleAccent")}</em></h1><p>{t("gatewayDescription")}</p></div><div className="access-grid">{ACCESS_CARDS.map((item) => { const Icon = item.icon; return <button key={item.id} className={`access-card access-${item.accent}`} onClick={() => onEnter(item.id)}><div className="access-card-top"><span className="access-icon"><Icon size={19} /></span><ArrowRight size={16} className="access-arrow" /></div><span className="access-subtitle">{t(item.subtitleKey)}</span><strong>{t(item.titleKey)}</strong><p>{t(item.descriptionKey)}</p><div className="access-modules">{item.moduleKeys.map((module) => <span key={module}>{t(module)}</span>)}</div></button>; })}</div><footer className="gateway-footer"><span>{t("prototypeFooter")}</span><span>{t("standardsFooter")}</span></footer></section></main>;
}

export function accessLabel(access: ArkiAccess): TranslationKey { return access; }
export function accessSubtitle(access: ArkiAccess): TranslationKey { return `${access}Subtitle` as TranslationKey; }
export function accessColor(access: ArkiAccess) { return ACCESS_CARDS.find((item) => item.id === access)?.accent ?? "orange"; }

const BASE_MODULE_ACCESS: Record<string, readonly ArkiAccess[]> = {
  Inicio: ["visitor", "user", "specialist", "corporate"], Biblioteca: ["visitor", "user", "specialist", "corporate"], Proyectos: ["user", "specialist", "corporate"], Generador: ["user", "specialist", "corporate"], "Modelo BIM": ["user", "specialist", "corporate"], Planta: ["user", "specialist", "corporate"], Corte: ["user", "specialist", "corporate"], "3D": ["user", "specialist", "corporate"], Metrados: ["user", "specialist", "corporate"], Presupuesto: ["user", "specialist", "corporate"], "Costos contractuales": ["corporate"], "4D": ["user", "specialist", "corporate"], Clashes: ["specialist", "corporate"], Expediente: ["user", "specialist", "corporate"], "O&M": ["specialist", "corporate"], Administración: ["corporate"],
};
export function isAccessAllowed(access: ArkiAccess, module: string) { return BASE_MODULE_ACCESS[module]?.includes(access) ?? false; }
export function moduleAccess(module: string) { return BASE_MODULE_ACCESS[module] ?? []; }
export function moduleNames() { return Object.keys(BASE_MODULE_ACCESS); }
