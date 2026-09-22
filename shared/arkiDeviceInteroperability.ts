export const ARKI_DEVICE_MODES = ["REMOTE", "GAMEPAD", "TRACKPAD", "KEYBOARD", "AR", "FIELD", "PRESENTATION"] as const;
export type ArkiDeviceMode = (typeof ARKI_DEVICE_MODES)[number];

export const ARKI_DEVICE_PROTOCOLS = ["ARKI_RECEIVER", "CAST", "DLNA", "AIRPLAY", "WEBRTC", "WEBSOCKET", "BROADCAST_CHANNEL", "VENDOR"] as const;
export type ArkiDeviceProtocol = (typeof ARKI_DEVICE_PROTOCOLS)[number];

export const ARKI_DEVICE_CAPABILITIES = ["NAVIGATION", "POINTER", "KEYBOARD", "GAMEPAD", "CAMERA", "MICROPHONE", "GEOLOCATION", "HIT_TEST", "PRESENTATION", "TEXT_INPUT"] as const;
export type ArkiDeviceCapability = (typeof ARKI_DEVICE_CAPABILITIES)[number];

export type ArkiDeviceDescriptor = {
  deviceId: string;
  deviceName: string;
  platform: string;
  capabilities: ArkiDeviceCapability[];
  protocols: ArkiDeviceProtocol[];
  status: "LOCAL" | "DISCOVERED" | "PAIRING" | "CONNECTED" | "EXTERNAL_REQUIRED" | "BLOCKED";
  ownerUserId?: number;
};

export type ArkiDeviceLinkPlan = {
  mode: ArkiDeviceMode;
  recommendedProtocol: ArkiDeviceProtocol | null;
  fallbackProtocols: ArkiDeviceProtocol[];
  requiredCapabilities: ArkiDeviceCapability[];
  status: "READY" | "CAPABILITY_REQUIRED" | "EXTERNAL_HOST_REQUIRED" | "PERMISSION_REQUIRED" | "BLOCKED";
  humanReviewRequired: true;
  authority: "NONE";
  limitations: string[];
};

const MODE_CAPABILITIES: Record<ArkiDeviceMode, ArkiDeviceCapability[]> = {
  REMOTE: ["NAVIGATION", "POINTER", "PRESENTATION"],
  GAMEPAD: ["GAMEPAD", "POINTER"],
  TRACKPAD: ["POINTER", "NAVIGATION"],
  KEYBOARD: ["KEYBOARD", "TEXT_INPUT"],
  AR: ["CAMERA", "HIT_TEST"],
  FIELD: ["CAMERA", "MICROPHONE", "GEOLOCATION"],
  PRESENTATION: ["NAVIGATION", "POINTER", "PRESENTATION"],
};

const PROTOCOL_PRIORITY: Record<ArkiDeviceMode, ArkiDeviceProtocol[]> = {
  REMOTE: ["ARKI_RECEIVER", "WEBSOCKET", "CAST", "VENDOR"],
  GAMEPAD: ["ARKI_RECEIVER", "WEBRTC", "WEBSOCKET", "VENDOR"],
  TRACKPAD: ["ARKI_RECEIVER", "WEBRTC", "WEBSOCKET", "BROADCAST_CHANNEL"],
  KEYBOARD: ["ARKI_RECEIVER", "WEBSOCKET", "BROADCAST_CHANNEL", "VENDOR"],
  AR: ["WEBRTC", "BROADCAST_CHANNEL", "ARKI_RECEIVER"],
  FIELD: ["ARKI_RECEIVER", "WEBSOCKET", "WEBRTC"],
  PRESENTATION: ["ARKI_RECEIVER", "WEBSOCKET", "CAST", "AIRPLAY"],
};

export function requiredCapabilitiesForArkiMode(mode: ArkiDeviceMode): ArkiDeviceCapability[] {
  return [...MODE_CAPABILITIES[mode]];
}

export function buildArkiDeviceLinkPlan(mode: ArkiDeviceMode, device: Pick<ArkiDeviceDescriptor, "capabilities" | "protocols" | "status">): ArkiDeviceLinkPlan {
  const requiredCapabilities = requiredCapabilitiesForArkiMode(mode);
  const missing = requiredCapabilities.filter((capability) => !device.capabilities.includes(capability));
  const availableProtocols = PROTOCOL_PRIORITY[mode].filter((protocol) => device.protocols.includes(protocol));
  const recommendedProtocol = availableProtocols[0] ?? null;
  const fallbackProtocols = availableProtocols.slice(1);
  if (device.status === "BLOCKED") return { mode, recommendedProtocol: null, fallbackProtocols: [], requiredCapabilities, status: "BLOCKED", humanReviewRequired: true, authority: "NONE", limitations: ["El dispositivo está bloqueado por política."] };
  if (missing.length > 0) return { mode, recommendedProtocol, fallbackProtocols, requiredCapabilities, status: "CAPABILITY_REQUIRED", humanReviewRequired: true, authority: "NONE", limitations: [`Faltan capacidades: ${missing.join(", ")}.`, "No se simula una capacidad ausente."] };
  if (!recommendedProtocol) return { mode, recommendedProtocol: null, fallbackProtocols: [], requiredCapabilities, status: "EXTERNAL_HOST_REQUIRED", humanReviewRequired: true, authority: "NONE", limitations: ["No hay protocolo disponible en el navegador; requiere receptor u host autorizado."] };
  if (requiredCapabilities.some((capability) => capability === "CAMERA" || capability === "MICROPHONE" || capability === "GEOLOCATION")) return { mode, recommendedProtocol, fallbackProtocols, requiredCapabilities, status: "PERMISSION_REQUIRED", humanReviewRequired: true, authority: "NONE", limitations: ["El navegador debe solicitar permiso explícito antes de capturar contexto.", "La disponibilidad del dispositivo no demuestra precisión AR ni geográfica."] };
  return { mode, recommendedProtocol, fallbackProtocols, requiredCapabilities, status: "READY", humanReviewRequired: true, authority: "NONE", limitations: ["Preparado para pairing; la conexión real requiere un receptor compatible."] };
}

export function isArkiDeviceMode(value: string): value is ArkiDeviceMode {
  return ARKI_DEVICE_MODES.includes(value as ArkiDeviceMode);
}

export function isPrivilegedDeviceAction(action: string): boolean {
  return ["DECISION_COMMIT", "PUBLISH", "CHANGE_PERMISSIONS", "READ_CORE_SECRET", "ALTER_AUDIT"].includes(action);
}
