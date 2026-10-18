import { ArrowRight, Building2, Calculator, Eye, ShieldCheck, UsersRound, Workflow, type LucideIcon } from "lucide-react";

export type ArkiAccess = "visitor" | "user" | "specialist" | "corporate";
export type ArkiModuleStatus = "IMPLEMENTED" | "VERIFIED" | "PARTIAL" | "CONCEPTUAL" | "NOT AVAILABLE" | "FUTURE REFERENCE";
export type ArkiModuleDefinition = { name: string; icon: LucideIcon; status: ArkiModuleStatus; allowed: readonly ArkiAccess[] };

type AccessCard = { id: ArkiAccess; title: string; subtitle: string; description: string; icon: LucideIcon; accent: "yellow" | "orange" | "cyan" | "green"; modules: string[] };

export const ACCESS_CARDS: AccessCard[] = [
  { id: "visitor", title: "Visitante", subtitle: "Explora ARKI", description: "Conoce el motor BIM, las familias y el flujo completo sin acceder a información privada.", icon: Eye, accent: "yellow", modules: ["Demostraciones", "Biblioteca pública", "Documentación"] },
  { id: "user", title: "Usuario / Proyecto", subtitle: "Diseña tu proyecto", description: "Crea propuestas, revisa espacios, compara versiones y prepara tu expediente.", icon: Building2, accent: "orange", modules: ["Proyectos", "Generador", "Modelo BIM"] },
  { id: "specialist", title: "Especialista / Coordinación", subtitle: "Revisa por disciplina", description: "Trabaja con arquitectura, estructuras, MEP, costos, coordinación y construcción.", icon: UsersRound, accent: "cyan", modules: ["Disciplinas", "Revisión", "Interferencias"] },
  { id: "corporate", title: "Corporativo", subtitle: "Costos e interferencias", description: "Administra estándares, PriceBook, APU, clashes, CDE e integraciones.", icon: Calculator, accent: "green", modules: ["Costos", "Clashes", "Gobierno"] },
];

export default function ArkiGateway({ onEnter }: { onEnter: (access: ArkiAccess) => void }) {
  return <main className="arki-gateway"><div className="gateway-orbit gateway-orbit-a" /><div className="gateway-orbit gateway-orbit-b" /><section className="gateway-inner"><header className="gateway-brand"><div className="gateway-mark"><Workflow size={23} /></div><div><strong>ARKI</strong><span>PARAMETRIC BIM RUNTIME</span></div><div className="gateway-status"><span /> MOTOR LOCAL OPERATIVO</div></header><div className="gateway-copy"><span className="gateway-kicker"><ShieldCheck size={14} /> ESTACIÓN CORPORATIVA DE DISEÑO Y COORDINACIÓN</span><h1>Elige tu espacio<br /><em>de trabajo.</em></h1><p>Una plataforma para pasar de la intención arquitectónica al modelo, el costo, la coordinación y el ciclo de vida del proyecto.</p></div><div className="access-grid">{ACCESS_CARDS.map((item) => { const Icon = item.icon; return <button key={item.id} className={`access-card access-${item.accent}`} onClick={() => onEnter(item.id)}><div className="access-card-top"><span className="access-icon"><Icon size={19} /></span><ArrowRight size={16} className="access-arrow" /></div><span className="access-subtitle">{item.subtitle}</span><strong>{item.title}</strong><p>{item.description}</p><div className="access-modules">{item.modules.map((module) => <span key={module}>{module}</span>)}</div></button>; })}</div><footer className="gateway-footer"><span>PROTOTIPO LOCAL · UI-1 · NO ES AUTENTICACIÓN DE PRODUCCIÓN</span><span>PE · RNE-PE · IFC4X3</span></footer></section></main>;
}

export function accessLabel(access: ArkiAccess) { return ACCESS_CARDS.find((item) => item.id === access)?.title ?? "Workspace"; }
export function accessSubtitle(access: ArkiAccess) { return ACCESS_CARDS.find((item) => item.id === access)?.subtitle ?? "Workspace BIM"; }
export function accessColor(access: ArkiAccess) { return ACCESS_CARDS.find((item) => item.id === access)?.accent ?? "orange"; }

const BASE_MODULE_ACCESS: Record<string, readonly ArkiAccess[]> = {
  Inicio: ["visitor", "user", "specialist", "corporate"], Biblioteca: ["visitor", "user", "specialist", "corporate"], Proyectos: ["user", "specialist", "corporate"], Generador: ["user", "specialist", "corporate"], "Modelo BIM": ["user", "specialist", "corporate"], Planta: ["user", "specialist", "corporate"], Corte: ["user", "specialist", "corporate"], "3D": ["user", "specialist", "corporate"], Metrados: ["user", "specialist", "corporate"], Presupuesto: ["user", "specialist", "corporate"], "Costos contractuales": ["corporate"], "4D": ["user", "specialist", "corporate"], Clashes: ["specialist", "corporate"], Expediente: ["user", "specialist", "corporate"], "O&M": ["specialist", "corporate"], Administración: ["corporate"],
};

export function isAccessAllowed(access: ArkiAccess, module: string) { return BASE_MODULE_ACCESS[module]?.includes(access) ?? false; }
export function moduleAccess(module: string) { return BASE_MODULE_ACCESS[module] ?? []; }
export function moduleNames() { return Object.keys(BASE_MODULE_ACCESS); }
