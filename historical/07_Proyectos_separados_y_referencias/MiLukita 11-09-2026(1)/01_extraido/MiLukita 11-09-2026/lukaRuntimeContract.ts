import type { ContextPermission, LukaIntentId, LukaMode } from "./lukaOsContract";

export type LukaTvRuntime = "android-tv" | "webos" | "roku";
export type LukaRuntimeStatus = "idle" | "discovering" | "found" | "connected" | "not-found" | "qr-fallback";
export type LukaIntentConfirmation = "pending" | "confirmed" | "rejected" | "expired";
export type LukaCapability = "tv" | "lights-climate" | "audio" | "wearables" | "vehicle-dashboard" | "ar";

export type LukaRuntimeProfile = {
  id: LukaTvRuntime;
  label: string;
  protocol: "simulated-webos-sdk" | "simulated-cloud-connector" | "simulated-cast-twa";
  navigation: "lrud";
  statusCopy: { connected: string; notFound: string };
};

export const LUKA_RUNTIME_PROFILES: readonly LukaRuntimeProfile[] = [
  { id: "android-tv", label: "Android TV / Google TV", protocol: "simulated-cast-twa", navigation: "lrud", statusCopy: { connected: "Conectado a Smart TV", notFound: "No he encontrado tu TV" } },
  { id: "webos", label: "LG webOS", protocol: "simulated-webos-sdk", navigation: "lrud", statusCopy: { connected: "Conectado a Smart TV", notFound: "No he encontrado tu TV" } },
  { id: "roku", label: "Roku", protocol: "simulated-cloud-connector", navigation: "lrud", statusCopy: { connected: "Conectado a Smart TV", notFound: "No he encontrado tu TV" } },
] as const;

export type LukaRuntimeEvent =
  | { type: "discover"; runtime: LukaTvRuntime }
  | { type: "connect"; runtime: LukaTvRuntime }
  | { type: "qr-fallback"; runtime: LukaTvRuntime }
  | { type: "navigate"; key: "up" | "down" | "left" | "right" | "enter" | "back" | "home" };

export const LUKA_RUNTIME_SAFE_EVENTS: readonly LukaRuntimeEvent["type"][] = ["discover", "connect", "qr-fallback", "navigate"];

export function getRuntimeProfile(runtime: LukaTvRuntime) {
  return LUKA_RUNTIME_PROFILES.find((profile) => profile.id === runtime) ?? LUKA_RUNTIME_PROFILES[0];
}

export function nextRuntimeStatus(status: LukaRuntimeStatus, event: LukaRuntimeEvent["type"]): LukaRuntimeStatus {
  if (event === "discover" && status === "idle") return "discovering";
  if (event === "connect" && (status === "found" || status === "discovering")) return "connected";
  if (event === "qr-fallback" && status === "not-found") return "qr-fallback";
  return status;
}

export type LukaConfirmation = { intentId: LukaIntentId; mode: LukaMode | null; text: string; status: LukaIntentConfirmation; expiresAt: number };

export function createIntentConfirmation(intentId: LukaIntentId, mode: LukaMode | null, text: string, now = Date.now(), ttlMs = 10_000): LukaConfirmation {
  return { intentId, mode, text, status: "pending", expiresAt: now + ttlMs };
}

export function resolveIntentConfirmation(confirmation: LukaConfirmation, answer: string, now = Date.now()): LukaConfirmation {
  if (confirmation.status !== "pending" || now > confirmation.expiresAt) return { ...confirmation, status: "expired" };
  const normalized = answer.toLocaleLowerCase("es-PE").trim();
  if (["sí", "si", "yes", "confirmar", "confirma"].includes(normalized)) return { ...confirmation, status: "confirmed" };
  if (["no", "cancelar", "cancela"].includes(normalized)) return { ...confirmation, status: "rejected" };
  return confirmation;
}

export type LukaPermissionState = "not-requested" | "requested" | "granted" | "denied";
export type LukaContextState = Record<ContextPermission, LukaPermissionState>;

export const INITIAL_CONTEXT_STATE: LukaContextState = { camera: "not-requested", microphone: "not-requested", geolocation: "not-requested" };

export function requestContextPermission(state: LukaContextState, permission: ContextPermission, capability: LukaCapability): LukaContextState {
  if (capability !== "ar" && permission !== "microphone") return state;
  return { ...state, [permission]: state[permission] === "not-requested" ? "requested" : state[permission] };
}

export function shouldExposeCapability(capability: LukaCapability, context: { connected: boolean; permission: LukaPermissionState }) {
  if (capability === "ar") return context.permission === "granted";
  return context.connected;
}

export type LukaHomeDevice = { id: string; label: string; capability: LukaCapability; status: "simulated-online" | "not-connected"; value?: number };

export const SIMULATED_HOME_DEVICES: readonly LukaHomeDevice[] = [
  { id: "living-room-light", label: "Luz de sala", capability: "lights-climate", status: "simulated-online", value: 70 },
  { id: "living-room-audio", label: "Audio de sala", capability: "audio", status: "simulated-online", value: 42 },
  { id: "bike-dashboard", label: "Bicicleta eléctrica", capability: "vehicle-dashboard", status: "not-connected", value: 66 },
];

export function runSafeRuntimeEvent(event: LukaRuntimeEvent): boolean {
  return LUKA_RUNTIME_SAFE_EVENTS.includes(event.type);
}

export type LukaHomeInteractiveAction = "toggle" | "increase" | "decrease";
export type LukaHomeDeviceState = LukaHomeDevice & { interactive: boolean; enabled: boolean; lastAction: LukaHomeInteractiveAction | null };

export const SIMULATED_INTERACTIVE_HOME_DEVICES: readonly LukaHomeDeviceState[] = [
  { id: "living-room-light", label: "Luz inteligente de sala", capability: "lights-climate", status: "simulated-online", value: 70, interactive: true, enabled: true, lastAction: null },
  { id: "ambient-light", label: "Luz ambiental", capability: "lights-climate", status: "simulated-online", value: 35, interactive: true, enabled: false, lastAction: null },
  { id: "living-room-audio", label: "Audio de sala", capability: "audio", status: "simulated-online", value: 42, interactive: false, enabled: true, lastAction: null },
];

export function applyHomeDeviceAction(devices: readonly LukaHomeDeviceState[], index: number, action: LukaHomeInteractiveAction): LukaHomeDeviceState[] {
  return devices.map((device, deviceIndex) => {
    if (deviceIndex !== index || !device.interactive || device.status !== "simulated-online") return device;
    const nextValue = action === "increase" ? Math.min(100, (device.value ?? 0) + 10) : action === "decrease" ? Math.max(0, (device.value ?? 0) - 10) : device.value;
    return { ...device, enabled: action === "toggle" ? !device.enabled : device.enabled, value: nextValue, lastAction: action };
  });
}
