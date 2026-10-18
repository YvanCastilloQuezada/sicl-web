export const AGENT_MAP_PERMISSIONS = ["READ", "WRITE", "PROPOSE", "EXECUTE"] as const;
export type AgentMapPermission = (typeof AGENT_MAP_PERMISSIONS)[number];
export type AgentMapStatus = "IMPLEMENTED" | "IMPLEMENTED / LIMITED" | "PREPARED" | "CONCEPTUAL" | "BLOCKED" | "NOT IMPLEMENTED";
export type PermissionLevel = "ALLOWED" | "LIMITED" | "NOT ALLOWED" | "NOT APPLICABLE";

export type AgentPermissionProfile = {
  id: string;
  name: string;
  status: AgentMapStatus;
  authority: string;
  canRead: string;
  canWrite: string;
  canPropose: string;
  canExecute: string;
  forbidden: string[];
  events: string;
  evidence: string;
};

export const AGENT_PERMISSION_PROFILES: AgentPermissionProfile[] = [
  {
    id: "auditor-agent",
    name: "Auditor Agent",
    status: "CONCEPTUAL",
    authority: "MJP CORE",
    canRead: "Rondas, draws, reglas, manifest y eventos autorizados",
    canWrite: "Auditoría y reportes",
    canPropose: "Correcciones para revisión humana",
    canExecute: "NOT ALLOWED",
    forbidden: ["Resultados", "RNG", "Premios", "Wallet", "Settlement"],
    events: "AUDIT_* (futuro)",
    evidence: "No existe como agente autónomo separado; existen auditoría, verificación y pruebas.",
  },
  {
    id: "scheduler",
    name: "Scheduler",
    status: "PREPARED",
    authority: "Round Engine",
    canRead: "Calendario, registry y estados operativos",
    canWrite: "Propuestas y órdenes autorizadas",
    canPropose: "Próximas rondas y ventanas",
    canExecute: "LIMITED",
    forbidden: ["Resultados", "RNG", "Reglas activas", "Settlement"],
    events: "SCHEDULE_*",
    evidence: "Existe schedulerEngine y soporte de heartbeat; la autonomía operativa completa no está activa.",
  },
  {
    id: "autopilot",
    name: "Autopilot",
    status: "IMPLEMENTED / LIMITED",
    authority: "MJP CORE",
    canRead: "Estado operativo permitido",
    canWrite: "Acciones dentro de allowlist",
    canPropose: "Acciones de automatización",
    canExecute: "LIMITED",
    forbidden: ["RNG", "Reglas", "Premios", "Wallet", "Resultados"],
    events: "AUTOPILOT_*",
    evidence: "shared/autonomyEngine.ts aplica allowlist, modo detenido y aprobación requerida.",
  },
  {
    id: "watchdog",
    name: "Watchdog",
    status: "CONCEPTUAL",
    authority: "Operación / MJP CORE",
    canRead: "Health, eventos y métricas",
    canWrite: "Alertas y solicitudes de recuperación futuras",
    canPropose: "Diagnósticos y recuperación",
    canExecute: "NOT ALLOWED",
    forbidden: ["Resultados", "Reglas", "Settlement", "Cambios irreversibles"],
    events: "WATCHDOG_* (futuro)",
    evidence: "Hay health checks y métricas, pero no servicio persistente independiente.",
  },
  {
    id: "supervisor",
    name: "Supervisor",
    status: "CONCEPTUAL",
    authority: "MJP CORE",
    canRead: "Estados operativos permitidos",
    canWrite: "Informes y acciones administrativas limitadas",
    canPropose: "Decisiones operativas",
    canExecute: "LIMITED",
    forbidden: ["Verdad del juego", "Resultados", "RNG", "Rulesets"],
    events: "SUPERVISOR_* (futuro)",
    evidence: "No existe un agente supervisor independiente en runtime.",
  },
  {
    id: "lukita",
    name: "Lukita — Host Visual Agent",
    status: "IMPLEMENTED / LIMITED",
    authority: "MjpTvManifest",
    canRead: "MjpTvManifest y estado público autorizado",
    canWrite: "Estado local de presentación",
    canPropose: "Mensajes, poses y animaciones permitidas",
    canExecute: "LIMITED",
    forbidden: ["Números", "Ganadores", "Premios", "Rondas", "Wallet", "RNG", "RTP", "Rulesets"],
    events: "PRESENTATION_*",
    evidence: "Scripts y visor de revisión; no es fuente oficial ni está integrado en este cambio.",
  },
  {
    id: "content-script",
    name: "Content / Script",
    status: "IMPLEMENTED / LIMITED",
    authority: "Revisión humana",
    canRead: "Contexto público y biblioteca aprobada",
    canWrite: "Borradores de texto",
    canPropose: "Variantes de guion",
    canExecute: "NOT ALLOWED",
    forbidden: ["Resultados", "Reglas", "Claims oficiales sin revisión"],
    events: "CONTENT_*",
    evidence: "shared/lukitaScripts.ts y panel de guiones con revisión.",
  },
  {
    id: "monitoring",
    name: "Monitoring",
    status: "IMPLEMENTED / LIMITED",
    authority: "Operación",
    canRead: "Métricas, logs y health",
    canWrite: "Alertas y diagnósticos",
    canPropose: "Acciones de observabilidad",
    canExecute: "NOT ALLOWED",
    forbidden: ["Datos de juego", "Wallet", "Resultados"],
    events: "MONITOR_*",
    evidence: "Paneles operativos, métricas de señal, logs y health checks.",
  },
  {
    id: "safety",
    name: "Safety",
    status: "PREPARED",
    authority: "Política / MJP CORE",
    canRead: "Señales, límites y políticas",
    canWrite: "Bloqueos permitidos",
    canPropose: "Restricciones y escalamiento",
    canExecute: "LIMITED",
    forbidden: ["Resultado del sorteo", "RNG", "Premios"],
    events: "SAFETY_* (futuro)",
    evidence: "Controles de uso responsable, acceso y KYC/AML neutral; no hay KYC real activo.",
  },
] as const;

export const AGENT_MAP_PROHIBITIONS = [
  "Generar resultados oficiales",
  "Alterar una semilla después de iniciar una ronda",
  "Modificar resultados, RTP, rulesets o premios",
  "Crear ganadores o alterar la wallet",
  "Liquidar sin autorización del Settlement Engine",
  "Eliminar o modificar retrospectivamente evidencia de auditoría",
  "Modificar MjpTvManifest para ocultar una discrepancia",
  "Convertir créditos virtuales en dinero o activar pagos/retiros",
  "Activar KYC/AML real u operación monetaria",
  "Desactivar controles de seguridad sin autorización",
] as const;

export function permissionBadgeTone(level: PermissionLevel) {
  if (level === "ALLOWED") return "allowed";
  if (level === "LIMITED") return "limited";
  return "blocked";
}
