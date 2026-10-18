export const LUKA_CONTROLLER_STATES = ["ar", "tv", "trackpad", "keyboard", "gamepad"] as const;
export type LukaControllerState = (typeof LUKA_CONTROLLER_STATES)[number];

export type LukaControllerIntent = "enter-ar" | "watch-tv" | "open-trackpad" | "open-keyboard" | "open-gamepad" | "back";

const TRANSITIONS: Record<LukaControllerIntent, LukaControllerState> = {
  "enter-ar": "ar",
  "watch-tv": "tv",
  "open-trackpad": "trackpad",
  "open-keyboard": "keyboard",
  "open-gamepad": "gamepad",
  back: "ar",
};

export function transitionLukaController(_current: LukaControllerState, intent: LukaControllerIntent): LukaControllerState {
  return TRANSITIONS[intent];
}

export function getContextualControllerActions(state: LukaControllerState): readonly LukaControllerIntent[] {
  if (state === "ar") return ["watch-tv"];
  if (state === "tv") return ["open-trackpad", "open-keyboard", "open-gamepad", "enter-ar"];
  if (state === "trackpad") return ["enter-ar"];
  if (state === "keyboard") return ["open-gamepad", "enter-ar"];
  return ["open-keyboard", "watch-tv", "enter-ar"];
}

export function isControllerState(value: string): value is LukaControllerState {
  return (LUKA_CONTROLLER_STATES as readonly string[]).includes(value);
}
