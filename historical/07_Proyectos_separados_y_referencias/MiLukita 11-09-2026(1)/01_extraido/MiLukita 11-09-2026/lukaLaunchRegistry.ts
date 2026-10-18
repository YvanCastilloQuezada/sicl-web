import type { ControlPackId } from "./lukaControlPacks";

export type LukaLaunchCapabilityId = ControlPackId | "ar-visor" | "luka-tv" | "voice" | "l-star-currency";
export type LukaLaunchCapabilityState = "available" | "reserved" | "hidden";

export type LukaLaunchCapability = {
  id: LukaLaunchCapabilityId;
  label: string;
  state: LukaLaunchCapabilityState;
  reason: string;
  launchSurface: "luka-entry" | "contextual" | "none";
};

export const LUKA_LAUNCH_CAPABILITIES: readonly LukaLaunchCapability[] = [
  { id: "ar-visor", label: "LUKA AR · El Mundo de MiLukita", state: "available", reason: "Estado inicial y experiencia principal de descubrimiento", launchSurface: "luka-entry" },
  { id: "luka-tv", label: "LUKA TV", state: "available", reason: "Superficie diaria de control y entretenimiento", launchSurface: "luka-entry" },
  { id: "tv", label: "LUKA TV Control", state: "available", reason: "Control contextual dentro de LUKA TV", launchSurface: "contextual" },
  { id: "trackpad", label: "LUKA Trackpad", state: "available", reason: "Superficie contextual del controlador universal", launchSurface: "contextual" },
  { id: "keyboard", label: "LUKA Keyboard", state: "available", reason: "Superficie contextual del controlador universal", launchSurface: "contextual" },
  { id: "gamepad", label: "LUKA Gamepad", state: "available", reason: "Superficie contextual del controlador universal", launchSurface: "contextual" },
  { id: "voice", label: "LUKA Voice", state: "available", reason: "Vía de transición y control contextual", launchSurface: "contextual" },
  { id: "lights-climate", label: "LUKA Lights & Climate", state: "reserved", reason: "Fase 2 doméstica; no forma parte del MVP de lanzamiento", launchSurface: "none" },
  { id: "audio", label: "LUKA Audio", state: "reserved", reason: "Fase 2; reservado hasta validar el núcleo", launchSurface: "none" },
  { id: "wearables", label: "LUKA Wearables", state: "reserved", reason: "Fuera del MVP actual", launchSurface: "none" },
  { id: "vehicle-dashboard", label: "LUKA Vehicle Dashboard", state: "reserved", reason: "Fuera del MVP actual", launchSurface: "none" },
  { id: "l-star-currency", label: "Moneda L*", state: "hidden", reason: "Fuera del MVP y sujeta a programa legal independiente", launchSurface: "none" },
] as const;

export function getLaunchCapability(id: LukaLaunchCapabilityId) {
  return LUKA_LAUNCH_CAPABILITIES.find((capability) => capability.id === id) ?? LUKA_LAUNCH_CAPABILITIES[0];
}

export function isLaunchCapabilityAvailable(id: LukaLaunchCapabilityId) {
  return getLaunchCapability(id).state === "available";
}

export function getVisibleLaunchCapabilities() {
  return LUKA_LAUNCH_CAPABILITIES.filter((capability) => capability.state === "available");
}

export function isCoreProtectedAction(action: string) {
  return /rng|rtp|wallet|ledger|settlement|rule|manifest|mjp\s*core/i.test(action);
}
