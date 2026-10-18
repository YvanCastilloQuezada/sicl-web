import type { EventStatus, MjpEvent } from "./eventEngine";

export type ExperienceView = "BEFORE_EVENT" | "OPEN" | "LOCKED" | "DRAWING" | "RESULT" | "COMPLETED" | "CONTINGENCY";
export type ContentMessage = { key: string; title: string; body: string; virtualOnly: true };

/** Estados narrativos de una experiencia; el estado oficial sigue perteneciendo al Event Engine. */
export const EXPERIENCE_STATES = [
  "SCHEDULED", "PREPARING", "READY", "PRE_SHOW", "OPEN", "INTERACTION", "LOCKED", "DRAWING",
  "RESULT", "VERIFICATION", "PUBLISHED", "TRANSITION", "COMPLETED", "CONTINGENCY", "CANCELLED",
] as const;
export type ExperienceState = (typeof EXPERIENCE_STATES)[number];

export const EXPERIENCE_PHASES = [
  "INTRO", "COUNTDOWN", "OPEN", "INTERACTION", "LOCK", "SUSPENSE", "DRAW", "RESULT", "VERIFICATION", "CELEBRATION", "NEXT_EVENT",
] as const;
export type ExperiencePhase = (typeof EXPERIENCE_PHASES)[number];
export type InteractionMode = "ENTERTAINMENT_ONLY" | "GAME_PARTICIPATION";
export type ExperienceTemplateId = "LOTTERY_STANDARD" | "LOTTERY_JACKPOT" | "BINGO_STANDARD" | "ROULETTE_STANDARD" | "TRIO_STANDARD" | "SPECIAL_EVENT";

export type ExperienceTemplate = {
  templateId: ExperienceTemplateId;
  label: string;
  phases: readonly ExperiencePhase[];
  interactionMode: InteractionMode;
  tvMode: "SHOW" | "MINIMAL";
  mobileMode: "CONTROLLER" | "INFO";
  avatarMode: "SCRIPTED" | "DISABLED";
  virtualOnly: true;
};

export const EXPERIENCE_TEMPLATES: Record<ExperienceTemplateId, ExperienceTemplate> = {
  LOTTERY_STANDARD: { templateId: "LOTTERY_STANDARD", label: "Lotería estándar", phases: ["INTRO", "COUNTDOWN", "OPEN", "INTERACTION", "LOCK", "SUSPENSE", "DRAW", "RESULT", "VERIFICATION", "CELEBRATION", "NEXT_EVENT"], interactionMode: "GAME_PARTICIPATION", tvMode: "SHOW", mobileMode: "CONTROLLER", avatarMode: "SCRIPTED", virtualOnly: true },
  LOTTERY_JACKPOT: { templateId: "LOTTERY_JACKPOT", label: "Lotería jackpot", phases: ["INTRO", "COUNTDOWN", "OPEN", "INTERACTION", "LOCK", "SUSPENSE", "DRAW", "RESULT", "VERIFICATION", "CELEBRATION", "NEXT_EVENT"], interactionMode: "GAME_PARTICIPATION", tvMode: "SHOW", mobileMode: "CONTROLLER", avatarMode: "SCRIPTED", virtualOnly: true },
  BINGO_STANDARD: { templateId: "BINGO_STANDARD", label: "Bingo estándar", phases: ["INTRO", "COUNTDOWN", "OPEN", "INTERACTION", "LOCK", "DRAW", "RESULT", "VERIFICATION", "CELEBRATION", "NEXT_EVENT"], interactionMode: "GAME_PARTICIPATION", tvMode: "SHOW", mobileMode: "CONTROLLER", avatarMode: "SCRIPTED", virtualOnly: true },
  ROULETTE_STANDARD: { templateId: "ROULETTE_STANDARD", label: "Ruleta estándar", phases: ["INTRO", "COUNTDOWN", "OPEN", "INTERACTION", "LOCK", "SUSPENSE", "DRAW", "RESULT", "VERIFICATION", "CELEBRATION", "NEXT_EVENT"], interactionMode: "GAME_PARTICIPATION", tvMode: "SHOW", mobileMode: "CONTROLLER", avatarMode: "SCRIPTED", virtualOnly: true },
  TRIO_STANDARD: { templateId: "TRIO_STANDARD", label: "Trío estándar", phases: ["INTRO", "COUNTDOWN", "OPEN", "INTERACTION", "LOCK", "DRAW", "RESULT", "VERIFICATION", "CELEBRATION", "NEXT_EVENT"], interactionMode: "GAME_PARTICIPATION", tvMode: "SHOW", mobileMode: "CONTROLLER", avatarMode: "SCRIPTED", virtualOnly: true },
  SPECIAL_EVENT: { templateId: "SPECIAL_EVENT", label: "Evento especial", phases: ["INTRO", "COUNTDOWN", "INTERACTION", "SUSPENSE", "RESULT", "VERIFICATION", "CELEBRATION", "NEXT_EVENT"], interactionMode: "ENTERTAINMENT_ONLY", tvMode: "SHOW", mobileMode: "INFO", avatarMode: "SCRIPTED", virtualOnly: true },
};

export type MjpExperience = {
  experienceId: string;
  eventId: string;
  gameId: string;
  version: string;
  durationSeconds: number;
  templateId: ExperienceTemplateId;
  phases: readonly ExperiencePhase[];
  contentKeys: readonly string[];
  interactionMode: InteractionMode;
  tvMode: ExperienceTemplate["tvMode"];
  mobileMode: ExperienceTemplate["mobileMode"];
  avatarMode: ExperienceTemplate["avatarMode"];
  contingencyPolicy: "STATIC_SAFE_FALLBACK" | "LAST_CONFIRMED_STATE";
  completionPolicy: "NEXT_EVENT" | "END_PROGRAM";
  virtualOnly: true;
};

export function createExperience(input: {
  experienceId: string;
  eventId: string;
  gameId: string;
  templateId?: ExperienceTemplateId;
  version?: string;
  durationSeconds?: number;
  contentKeys?: readonly string[];
  completionPolicy?: MjpExperience["completionPolicy"];
}): MjpExperience {
  const template = EXPERIENCE_TEMPLATES[input.templateId ?? inferTemplate(input.gameId)];
  if (!input.experienceId || !input.eventId || !input.gameId) throw new Error("La experiencia requiere experienceId, eventId y gameId.");
  if ((input.durationSeconds ?? 0) < 0) throw new Error("La duración de la experiencia no puede ser negativa.");
  return {
    experienceId: input.experienceId,
    eventId: input.eventId,
    gameId: input.gameId,
    version: input.version ?? "experience-v1",
    durationSeconds: input.durationSeconds ?? 0,
    templateId: template.templateId,
    phases: template.phases,
    contentKeys: input.contentKeys ?? ["intro", "countdown", "result", "verification", "next_event"],
    interactionMode: template.interactionMode,
    tvMode: template.tvMode,
    mobileMode: template.mobileMode,
    avatarMode: template.avatarMode,
    contingencyPolicy: "LAST_CONFIRMED_STATE",
    completionPolicy: input.completionPolicy ?? "NEXT_EVENT",
    virtualOnly: true,
  };
}

function inferTemplate(gameId: string): ExperienceTemplateId {
  const normalized = gameId.toLowerCase();
  if (normalized.includes("bingo")) return "BINGO_STANDARD";
  if (normalized.includes("ruleta")) return "ROULETTE_STANDARD";
  if (normalized.includes("trio")) return "TRIO_STANDARD";
  if (normalized.includes("jackpot") || normalized.includes("extra")) return "LOTTERY_JACKPOT";
  return "LOTTERY_STANDARD";
}

const EXPERIENCE_TRANSITIONS: Record<ExperienceState, readonly ExperienceState[]> = {
  SCHEDULED: ["PREPARING", "CANCELLED"], PREPARING: ["READY", "CONTINGENCY", "CANCELLED"], READY: ["PRE_SHOW", "CONTINGENCY", "CANCELLED"],
  PRE_SHOW: ["OPEN", "INTERACTION", "CONTINGENCY", "CANCELLED"], OPEN: ["INTERACTION", "LOCKED", "CONTINGENCY", "CANCELLED"],
  INTERACTION: ["LOCKED", "CONTINGENCY", "CANCELLED"], LOCKED: ["DRAWING", "CONTINGENCY", "CANCELLED"], DRAWING: ["RESULT", "CONTINGENCY"],
  RESULT: ["VERIFICATION", "PUBLISHED", "CONTINGENCY"], VERIFICATION: ["PUBLISHED", "CONTINGENCY"], PUBLISHED: ["TRANSITION", "COMPLETED"],
  TRANSITION: ["SCHEDULED", "COMPLETED"], COMPLETED: [], CONTINGENCY: ["PREPARING", "OPEN", "CANCELLED"], CANCELLED: [],
};

export function experienceStateCanMove(from: ExperienceState, to: ExperienceState): boolean {
  return EXPERIENCE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function experienceStateFromEvent(event: MjpEvent, online = true): ExperienceState {
  if (!online || event.recoveryState === "CONTINGENCY") return "CONTINGENCY";
  const map: Record<EventStatus, ExperienceState> = {
    SCHEDULED: "SCHEDULED", PREPARING: "PREPARING", OPEN: "OPEN", CLOSING: "LOCKED", LOCKED: "LOCKED", DRAWING: "DRAWING",
    RESULT_PENDING: "DRAWING", RESULT_VERIFIED: "RESULT", PUBLISHED: "PUBLISHED", COMPLETED: "COMPLETED", CANCELLED: "CANCELLED",
    SUSPENDED: "CONTINGENCY", ERROR: "CONTINGENCY", RECOVERY: "CONTINGENCY",
  };
  return map[event.status];
}

export function experienceView(event: MjpEvent, online = true): ExperienceView {
  const state = experienceStateFromEvent(event, online);
  if (state === "CONTINGENCY") return "CONTINGENCY";
  if (state === "SCHEDULED" || state === "PREPARING" || state === "READY" || state === "PRE_SHOW") return "BEFORE_EVENT";
  if (state === "OPEN" || state === "INTERACTION") return "OPEN";
  if (state === "LOCKED") return "LOCKED";
  if (state === "DRAWING") return "DRAWING";
  if (state === "RESULT" || state === "VERIFICATION" || state === "PUBLISHED") return "RESULT";
  return "COMPLETED";
}

export function contentForView(view: ExperienceView, gameTitle: string): ContentMessage {
  const messages: Record<ExperienceView, ContentMessage> = {
    BEFORE_EVENT: { key: "before_event", title: "Siguiente evento", body: `${gameTitle} se prepara.`, virtualOnly: true },
    OPEN: { key: "open", title: "Participación abierta", body: "Puedes participar con créditos virtuales hasta el cierre visible.", virtualOnly: true },
    LOCKED: { key: "locked", title: "Participación cerrada", body: "El sistema está preparando el sorteo.", virtualOnly: true },
    DRAWING: { key: "drawing", title: "Sorteo en curso", body: "El resultado se genera y verifica en el servidor.", virtualOnly: true },
    RESULT: { key: "result", title: "Resultado verificado", body: "Consulta la evidencia pública del evento.", virtualOnly: true },
    COMPLETED: { key: "completed", title: "Evento completado", body: "Revisa el siguiente evento del programa.", virtualOnly: true },
    CONTINGENCY: { key: "contingency", title: "Modo de contingencia", body: "Mostramos el último estado confirmado y no inventamos información.", virtualOnly: true },
  };
  return messages[view];
}
