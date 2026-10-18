export const INTERACTION_TYPES = ["CHOICE", "POLL", "TRIVIA", "NUMBER_SELECTION", "YES_NO", "COLOR", "ODD_EVEN", "VOTE", "REACTION", "PREDICTION"] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];
export type InteractionKind = "ENTERTAINMENT_INTERACTION" | "GAME_PARTICIPATION";

export type MjpInteraction = {
  interactionId: string;
  eventId: string;
  type: InteractionType;
  kind: InteractionKind;
  prompt: string;
  options: string[];
  closesAt: number | null;
  virtualOnly: true;
};

export function createInteraction(input: Omit<MjpInteraction, "virtualOnly">): MjpInteraction {
  if (!input.eventId || !input.prompt || input.options.length < 2) throw new Error("La interacción requiere evento, pregunta y al menos dos opciones.");
  return { ...input, virtualOnly: true };
}

export function isEntertainmentOnly(interaction: MjpInteraction): boolean {
  return interaction.kind === "ENTERTAINMENT_INTERACTION";
}
