import { getLaunchCapability, isLaunchCapabilityAvailable, type LukaLaunchCapabilityId } from "./lukaLaunchRegistry";
import { resolveLukaIntent, type ContextPermission, type LukaIntentId, type LukaMode } from "./lukaOsContract";
import { type LukaContextState, shouldExposeCapability } from "./lukaRuntimeContract";
import { type LukaControllerIntent } from "./lukaControllerState";

export const UNIVERSAL_MODALITIES = ["touch", "voice", "gesture", "controller"] as const;
export type UniversalModality = (typeof UNIVERSAL_MODALITIES)[number];

export type UniversalIntentId = LukaIntentId | "back" | "unknown";
export type UniversalContext = {
  permissions: LukaContextState;
  connected: boolean;
  role: "guest" | "user" | "operator" | "presenter" | "admin";
};

export type UniversalIntent = {
  id: UniversalIntentId;
  mode: LukaMode | null;
  modality: UniversalModality;
  source: string;
  capability: LukaLaunchCapabilityId | null;
  requiresConfirmation: boolean;
};

export type UniversalDecision =
  | { status: "AUTHORIZED"; intent: UniversalIntent }
  | { status: "NEEDS_CONTEXT"; intent: UniversalIntent; permission: ContextPermission }
  | { status: "DENIED"; intent: UniversalIntent; reason: string }
  | { status: "UNKNOWN"; intent: UniversalIntent };

const controllerToIntent: Record<LukaControllerIntent, UniversalIntentId> = {
  "enter-ar": "enter-world",
  "watch-tv": "watch-tv",
  "open-trackpad": "navigate-tv",
  "open-keyboard": "write",
  "open-gamepad": "play",
  back: "return-ar",
};

const capabilityByIntent: Partial<Record<UniversalIntentId, LukaLaunchCapabilityId>> = {
  "enter-world": "ar-visor",
  "return-ar": "ar-visor",
  "watch-tv": "luka-tv",
  "open-netflix": "luka-tv",
  "navigate-tv": "trackpad",
  write: "keyboard",
  play: "gamepad",
  audio: "audio",
  "lights-climate": "lights-climate",
  wearables: "wearables",
  "vehicle-dashboard": "vehicle-dashboard",
};

const permissionByCapability: Partial<Record<LukaLaunchCapabilityId, ContextPermission>> = {
  "ar-visor": "camera",
};

export function universalIntentFromVoice(source: string): UniversalIntent {
  const resolved = resolveLukaIntent(source);
  return {
    id: resolved.id,
    mode: resolved.mode,
    modality: "voice",
    source,
    capability: capabilityByIntent[resolved.id] ?? null,
    requiresConfirmation: false,
  };
}

export function universalIntentFromTouch(command: string): UniversalIntent {
  return { ...universalIntentFromVoice(command), modality: "touch" };
}

export function universalIntentFromGesture(gesture: "swipe-up" | "tap-logo" | "back"): UniversalIntent {
  const command = gesture === "swipe-up" ? "Ver TV" : gesture === "back" ? "Volver a la calle" : "El Mundo de MiLukita";
  return { ...universalIntentFromTouch(command), modality: "gesture" };
}

export function universalIntentFromController(intent: LukaControllerIntent): UniversalIntent {
  const id = controllerToIntent[intent];
  return { id, mode: id === "watch-tv" ? "tv-media" : id === "enter-world" || id === "return-ar" ? "ar" : id === "write" ? "keyboard" : id === "play" ? "gamepad" : id === "navigate-tv" ? "trackpad" : null, modality: "controller", source: intent, capability: capabilityByIntent[id] ?? null, requiresConfirmation: false };
}

export function decideUniversalIntent(intent: UniversalIntent, context: UniversalContext): UniversalDecision {
  if (intent.id === "unknown" || !intent.capability) return { status: "UNKNOWN", intent };
  const capability = getLaunchCapability(intent.capability);
  if (!isLaunchCapabilityAvailable(intent.capability)) return { status: "DENIED", intent, reason: capability.reason };
  if (context.role === "guest" && intent.capability !== "ar-visor" && intent.capability !== "luka-tv") return { status: "DENIED", intent, reason: "La capacidad requiere una sesión autorizada." };
  const permission = permissionByCapability[intent.capability];
  if (permission && !shouldExposeCapability(intent.capability === "ar-visor" ? "ar" : "tv", { connected: context.connected, permission: context.permissions[permission] })) return { status: "NEEDS_CONTEXT", intent, permission };
  if (intent.capability === "luka-tv" && !context.connected) return { status: "NEEDS_CONTEXT", intent, permission: "microphone" };
  return { status: "AUTHORIZED", intent };
}

export function areEquivalentUniversalIntents(a: UniversalIntent, b: UniversalIntent): boolean {
  return a.id !== "unknown" && a.id === b.id && a.capability === b.capability;
}

export function getMobileShellUniversalIntents(): readonly UniversalIntentId[] {
  return ["enter-world", "watch-tv"];
}
