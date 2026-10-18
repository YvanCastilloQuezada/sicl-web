export type LukaMode = "ar" | "tv-media" | "trackpad" | "gamepad" | "keyboard" | "config";
export type LukaIntentId = "enter-world" | "watch-tv" | "write" | "play" | "navigate-tv" | "return-ar" | "open-netflix" | "open-config" | "lights-climate" | "audio" | "wearables" | "vehicle-dashboard" | "unknown";
export type ContextPermission = "camera" | "microphone" | "geolocation";

export type LukaIntent = {
  id: LukaIntentId;
  mode: LukaMode | null;
  phrases: readonly string[];
  requiredPermissions: readonly ContextPermission[];
  action: "navigate" | "request-permission" | "no-op";
};

export type LukaDisclosure = {
  mode: LukaMode;
  visibleControls: readonly ("logo" | "microphone" | "connection" | "battery" | "wifi" | "clock" | "brightness" | "back" | "ok" | "home" | "ar" | "tv-media" | "trackpad" | "gamepad" | "keyboard" | "text-field" | "dpad" | "action" | "config")[];
  nextActions: readonly LukaMode[];
};

export const LUKA_INTENTS: readonly LukaIntent[] = [
  { id: "enter-world", mode: "ar", phrases: ["el mundo de milukita", "mundo luka", "entrar a mi mundo", "ver el mundo", "quiero estar en la calle"], requiredPermissions: ["camera"], action: "request-permission" },
  { id: "watch-tv", mode: "tv-media", phrases: ["ver tv", "quiero ver tv", "luka tv", "poner televisión"], requiredPermissions: [], action: "navigate" },
  { id: "write", mode: "keyboard", phrases: ["quiero escribir", "escribir"], requiredPermissions: [], action: "navigate" },
  { id: "play", mode: "gamepad", phrases: ["quiero jugar", "jugar"], requiredPermissions: [], action: "navigate" },
  { id: "navigate-tv", mode: "trackpad", phrases: ["navegar por el tv", "quiero navegar", "mover el cursor"], requiredPermissions: [], action: "navigate" },
  { id: "return-ar", mode: "ar", phrases: ["volver a la calle", "volver al mundo", "volver a ar"], requiredPermissions: ["camera"], action: "request-permission" },
  { id: "open-netflix", mode: "tv-media", phrases: ["pon netflix", "abrir netflix"], requiredPermissions: [], action: "navigate" },
  { id: "open-config", mode: "config", phrases: ["configuración", "luka configuración", "ajustes"], requiredPermissions: [], action: "navigate" },
  { id: "lights-climate", mode: "config", phrases: ["baja la luz", "sube la luz", "ajusta la temperatura", "enciende el aire", "disminuir las luces", "quiero disminuir las luces"], requiredPermissions: [], action: "navigate" },
  { id: "audio", mode: "config", phrases: ["sube el volumen", "baja el volumen", "pon música", "pausa la música", "aumentar la voz", "quiero aumentar la voz"], requiredPermissions: [], action: "navigate" },
  { id: "wearables", mode: "config", phrases: ["muéstrame mi pulso", "muestra mis notificaciones", "vibración del reloj"], requiredPermissions: [], action: "navigate" },
  { id: "vehicle-dashboard", mode: "config", phrases: ["muestra el estado de mi bici", "estado de mi patinete", "revisa mi vehículo"], requiredPermissions: [], action: "navigate" },
] as const;

export const LUKA_DISCLOSURE: readonly LukaDisclosure[] = [
  { mode: "ar", visibleControls: ["logo", "microphone", "connection", "battery", "wifi", "clock", "brightness", "ar", "tv-media"], nextActions: ["tv-media"] },
  { mode: "tv-media", visibleControls: ["logo", "microphone", "connection", "battery", "wifi", "clock", "brightness", "back", "ok", "home", "trackpad", "gamepad", "keyboard", "ar"], nextActions: ["trackpad", "gamepad", "keyboard", "ar"] },
  { mode: "trackpad", visibleControls: ["logo", "microphone", "connection", "battery", "wifi", "clock", "brightness", "back", "ok", "home", "ar"], nextActions: ["ar"] },
  { mode: "gamepad", visibleControls: ["logo", "microphone", "connection", "battery", "wifi", "clock", "brightness", "back", "ok", "home", "keyboard"], nextActions: ["keyboard"] },
  { mode: "keyboard", visibleControls: ["logo", "microphone", "connection", "battery", "wifi", "clock", "brightness", "back", "ok", "home", "text-field", "gamepad"], nextActions: ["gamepad"] },
  { mode: "config", visibleControls: ["logo", "microphone", "connection", "back", "ok", "home", "config"], nextActions: ["ar", "tv-media"] },
] as const;

function normalizeVoiceText(input: string) {
  return input.toLocaleLowerCase("es-PE").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñü\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function resolveLukaIntent(input: string): LukaIntent {
  const normalized = normalizeVoiceText(input);
  if (!normalized) return { id: "unknown", mode: null, phrases: [], requiredPermissions: [], action: "no-op" };
  return LUKA_INTENTS.find((intent) => intent.phrases.some((phrase) => normalized.includes(normalizeVoiceText(phrase)))) ?? { id: "unknown", mode: null, phrases: [], requiredPermissions: [], action: "no-op" };
}

export function getLukaDisclosure(mode: LukaMode): LukaDisclosure {
  return LUKA_DISCLOSURE.find((item) => item.mode === mode) ?? LUKA_DISCLOSURE[0];
}

export function shouldRequestPermission(permission: ContextPermission, mode: LukaMode) {
  return mode === "ar" && permission === "camera";
}

export function getContextualFallback(mode: LukaMode): LukaMode {
  if (mode === "trackpad") return "ar";
  if (mode === "gamepad") return "keyboard";
  if (mode === "keyboard") return "gamepad";
  return "ar";
}

export const LUKA_ENTRY_PROMPT = "Hola, soy LUKA. ¿Quieres entrar a mi mundo o ver TV?";
export const LUKA_WAKE_WORD = "LUKA";
export const LUKA_NO_RESPONSE_SECONDS = 10;

export const LUKA_ALTERNATIVE_COMMANDS = [
  "El Mundo de MiLukita",
  "Ver TV",
  "Quiero escribir",
  "Quiero jugar",
  "Quiero navegar por el TV",
  "Volver a la calle",
  "LUKA, configuración",
] as const;

export function getLukaAlternativeCommands(input = "") {
  const normalized = normalizeVoiceText(input);
  if (normalized.includes("tv") || normalized.includes("tele")) return ["Ver TV", "Pon Netflix", "Quiero navegar por el TV"] as const;
  if (normalized.includes("jugar") || normalized.includes("juego")) return ["Quiero jugar", "Quiero escribir", "Ver TV"] as const;
  if (normalized.includes("escrib") || normalized.includes("tecl")) return ["Quiero escribir", "Quiero jugar", "Quiero navegar por el TV"] as const;
  if (normalized.includes("ar") || normalized.includes("mundo")) return ["El Mundo de MiLukita", "Ver TV", "Volver a la calle"] as const;
  return LUKA_ALTERNATIVE_COMMANDS;
}

export type LukaVoiceHistoryItem = {
  id: string;
  transcript: string;
  intentId: LukaIntentId;
  createdAt: number;
};

export const LUKA_INTENT_TEST_COMMANDS = [
  "LUKA, quiero ver TV",
  "LUKA, quiero escribir",
  "LUKA, quiero jugar",
  "LUKA, quiero estar en la calle",
  "LUKA, quiero aumentar la voz",
  "LUKA, quiero disminuir las luces",
  "LUKA, configuración",
  "LUKA, quiero navegar por el TV",
  "LUKA, pon Netflix",
  "LUKA, muéstrame mi pulso",
] as const;

export function auditIntentCommandMatrix() {
  return LUKA_INTENT_TEST_COMMANDS.map((command) => ({ command, intent: resolveLukaIntent(command) }));
}
