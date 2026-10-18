export const AVATAR_TRIGGERS = ["EVENT_START", "EVENT_CLOSING", "DRAW_STARTED", "RESULT_VERIFIED", "TRANSITION", "INTERACTION"] as const;
export type AvatarTrigger = (typeof AVATAR_TRIGGERS)[number];

export type AvatarScript = {
  trigger: AvatarTrigger;
  locale: "es-PE";
  text: string;
  source: "deterministic_template";
  canChangeOfficialState: false;
};

const templates: Record<AvatarTrigger, (game: string) => string> = {
  EVENT_START: (game) => `Comienza ${game}. Revisa las reglas y participa con créditos virtuales.`,
  EVENT_CLOSING: (game) => `La participación de ${game} está por cerrar.`,
  DRAW_STARTED: () => "El sorteo virtual ha comenzado. El resultado lo determina el motor autorizado.",
  RESULT_VERIFIED: () => "El resultado ha sido verificado. Puedes consultar su evidencia pública.",
  TRANSITION: () => "Pasamos al siguiente evento del programa.",
  INTERACTION: () => "Ahora puedes responder la interacción de entretenimiento.",
};

export function buildAvatarScript(trigger: AvatarTrigger, game: string): AvatarScript {
  return { trigger, locale: "es-PE", text: templates[trigger](game), source: "deterministic_template", canChangeOfficialState: false };
}
