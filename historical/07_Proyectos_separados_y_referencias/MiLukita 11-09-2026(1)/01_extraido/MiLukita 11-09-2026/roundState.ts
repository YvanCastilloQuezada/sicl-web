export const PERSISTED_ROUND_STATES = ["draft", "open", "locked", "drawn", "settled", "archived"] as const;
export type PersistedRoundState = (typeof PERSISTED_ROUND_STATES)[number];

/**
 * Lifecycle used by the current database schema. The public broadcast layer may
 * project these states to scheduled/open/locked/drawn/verified/cancelled, but
 * official persistence remains constrained to the database enum.
 */
const ALLOWED_TRANSITIONS: Record<PersistedRoundState, readonly PersistedRoundState[]> = {
  draft: ["open", "archived"],
  open: ["locked", "archived"],
  locked: ["drawn", "archived"],
  drawn: ["settled", "archived"],
  settled: ["archived"],
  archived: [],
};

export function canTransitionRound(from: string, to: string): boolean {
  if (!PERSISTED_ROUND_STATES.includes(from as PersistedRoundState) || !PERSISTED_ROUND_STATES.includes(to as PersistedRoundState)) return false;
  return ALLOWED_TRANSITIONS[from as PersistedRoundState].includes(to as PersistedRoundState);
}

export function assertRoundTransition(from: string, to: PersistedRoundState): void {
  if (!canTransitionRound(from, to)) throw new Error(`Transición de ronda no permitida: ${from} → ${to}`);
}

export function isTerminalRoundState(state: string): boolean {
  return state === "settled" || state === "archived";
}

export const PUBLIC_ROUND_STATES = ["scheduled", "open", "locked", "drawing", "drawn", "verified", "cancelled"] as const;
export type PublicRoundState = (typeof PUBLIC_ROUND_STATES)[number];
