import { LUKITA_PROFILE, type CharacterChannel } from "./characterOs";

export const LUKA_PRESENCE_STATES = ["PRESENCE", "LISTENING", "SPEAKING", "THINKING", "SILENT"] as const;
export type LukaPresenceState = (typeof LUKA_PRESENCE_STATES)[number];
export type LukaPresenceSurface = "entry" | "ar" | "tv" | "voice";
export type LukaPresenceEvent = "listen-start" | "intent-detected" | "speak-start" | "context-ready" | "transition" | "stop" | "silence";

const transitionMap: Record<LukaPresenceState, Partial<Record<LukaPresenceEvent, LukaPresenceState>>> = {
  PRESENCE: { "listen-start": "LISTENING", "intent-detected": "THINKING", transition: "SPEAKING", silence: "SILENT" },
  LISTENING: { "intent-detected": "THINKING", stop: "PRESENCE", silence: "SILENT" },
  THINKING: { "speak-start": "SPEAKING", "context-ready": "SPEAKING", stop: "PRESENCE", silence: "SILENT" },
  SPEAKING: { transition: "SPEAKING", stop: "PRESENCE", silence: "SILENT" },
  SILENT: { "listen-start": "LISTENING", "context-ready": "PRESENCE", stop: "PRESENCE" },
};

export function transitionLukaPresence(previous: LukaPresenceState, event: LukaPresenceEvent): LukaPresenceState {
  return transitionMap[previous][event] ?? previous;
}

export function getLukaPresenceCopy(state: LukaPresenceState, surface: LukaPresenceSurface): string {
  if (state === "LISTENING") return "Te escucho.";
  if (state === "THINKING") return "Estoy preparando el siguiente paso.";
  if (state === "SPEAKING") return surface === "ar" ? "Te acompaño por el territorio." : surface === "tv" ? "Te acompaño en la pantalla." : "Te acompaño.";
  if (state === "SILENT") return "Estoy aquí cuando me necesites.";
  return surface === "entry" ? "Estoy aquí para acompañarte." : "Sigo contigo.";
}

export function getLukaContinuity(surface: LukaPresenceSurface, state: LukaPresenceState) {
  const channel: CharacterChannel = surface === "tv" ? "TV" : surface === "ar" ? "MOBILE" : "WEB";
  return { characterId: LUKITA_PROFILE.characterId, name: LUKITA_PROFILE.name, surface, state, channel, identityVersion: LUKITA_PROFILE.version, silentMode: state === "SILENT" } as const;
}

export function isAdvancedPresenceState(value: string): value is LukaPresenceState {
  return (LUKA_PRESENCE_STATES as readonly string[]).includes(value);
}
