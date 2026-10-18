import {
  decideUniversalIntent,
  universalIntentFromController,
  type UniversalContext,
  type UniversalDecision,
  type UniversalIntent,
} from "./universalInteraction";
import type { LukaControllerIntent } from "./lukaControllerState";

export const UNIVERSAL_CONTROLLER_MODES = [
  "remote",
  "gamepad",
  "trackpad",
  "keyboard",
  "ar",
  "home",
  "field",
] as const;

export type UniversalControllerMode = (typeof UNIVERSAL_CONTROLLER_MODES)[number];

export type ControllerModeDescriptor = {
  id: UniversalControllerMode;
  label: string;
  capability: string;
  implementation: "existing-surface";
  authority: "none";
};

export const UNIVERSAL_CONTROLLER_REGISTRY: readonly ControllerModeDescriptor[] = [
  { id: "remote", label: "Remote", capability: "luka-tv", implementation: "existing-surface", authority: "none" },
  { id: "gamepad", label: "Gamepad", capability: "gamepad", implementation: "existing-surface", authority: "none" },
  { id: "trackpad", label: "Trackpad", capability: "trackpad", implementation: "existing-surface", authority: "none" },
  { id: "keyboard", label: "Keyboard", capability: "keyboard", implementation: "existing-surface", authority: "none" },
  { id: "ar", label: "AR Controller", capability: "ar-visor", implementation: "existing-surface", authority: "none" },
  { id: "home", label: "Home", capability: "lights-climate", implementation: "existing-surface", authority: "none" },
  { id: "field", label: "Field", capability: "trackpad", implementation: "existing-surface", authority: "none" },
];

const modeIntent: Record<Exclude<UniversalControllerMode, "home">, LukaControllerIntent> = {
  remote: "watch-tv",
  gamepad: "open-gamepad",
  trackpad: "open-trackpad",
  keyboard: "open-keyboard",
  ar: "enter-ar",
  field: "open-trackpad",
};

export function intentForControllerMode(mode: UniversalControllerMode): UniversalIntent {
  if (mode === "home") return { ...universalIntentFromController("watch-tv"), id: "lights-climate", source: "home", capability: "lights-climate" };
  return universalIntentFromController(modeIntent[mode]);
}

export function decideControllerMode(mode: UniversalControllerMode, context: UniversalContext): UniversalDecision {
  return decideUniversalIntent(intentForControllerMode(mode), context);
}

export function controllerModesShareIntentEngine(): boolean {
  return UNIVERSAL_CONTROLLER_REGISTRY.every((mode) => mode.implementation === "existing-surface" && mode.authority === "none");
}

export function controllerModeHasAuthority(mode: UniversalControllerMode): boolean {
  return UNIVERSAL_CONTROLLER_REGISTRY.find((entry) => entry.id === mode)?.authority !== "none";
}

export function controllerModeCapability(mode: UniversalControllerMode | "universal"): string | null {
  if (mode === "universal") return "luka-tv";
  return UNIVERSAL_CONTROLLER_REGISTRY.find((entry) => entry.id === mode)?.capability ?? null;
}

export function controllerModeDecisionIsSafe(decision: UniversalDecision): boolean {
  return decision.status !== "AUTHORIZED" || decision.intent.id !== "unknown";
}

export function isControllerMode(value: string): value is UniversalControllerMode {
  return UNIVERSAL_CONTROLLER_MODES.includes(value as UniversalControllerMode);
}

