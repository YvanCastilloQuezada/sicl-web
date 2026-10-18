export type DevLabGpsPoint = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  note: string;
};

export const DEV_LAB_GPS_POINTS: readonly DevLabGpsPoint[] = [
  { id: "plaza", label: "Plaza de Armas", latitude: -12.0464, longitude: -77.0428, note: "Punto urbano de referencia" },
  { id: "huaca", label: "Huaca del Sol", latitude: -8.1158, longitude: -79.0187, note: "Punto patrimonial de referencia" },
  { id: "comisaria", label: "Comisaría", latitude: -12.0542, longitude: -77.0365, note: "Punto de servicio de referencia" },
];

export type DevLabVoiceLog = {
  id: string;
  transcript: string;
  intent: string;
  status: "recognized" | "confirmed" | "rejected";
  source: "simulated";
};

export const DEV_LAB_SAMPLE_VOICE_LOGS: readonly DevLabVoiceLog[] = [
  { id: "sample-1", transcript: "LUKA, quiero estar en la calle", intent: "enter-world", status: "recognized", source: "simulated" },
  { id: "sample-2", transcript: "LUKA, canal 15", intent: "tv-channel", status: "confirmed", source: "simulated" },
  { id: "sample-3", transcript: "LUKA, aumenta la voz", intent: "audio-volume-up", status: "recognized", source: "simulated" },
];

export function formatSimulatedCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function isValidSimulatedCoordinates(latitude: number, longitude: number) {
  return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

function escapeCsvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function serializeDevLabVoiceLogs(logs: readonly DevLabVoiceLog[], format: "csv" | "json") {
  if (format === "json") {
    return { body: JSON.stringify(logs, null, 2), mimeType: "application/json", extension: "json" } as const;
  }
  const body = ["id,transcript,intent,status,source", ...logs.map((log) => [log.id, log.transcript, log.intent, log.status, log.source].map(escapeCsvCell).join(","))].join("\n");
  return { body, mimeType: "text/csv;charset=utf-8", extension: "csv" } as const;
}

export type DevLabTvTransportState = "simulated-ready" | "simulated-searching" | "simulated-disconnected";

export type DevLabMvpMetrics = {
  timeToFirstLukaMs: number;
  timeToFirstActionMs: number;
  source: "simulated";
};

export function createSimulatedWorldQrPayload(origin = "luka-world") {
  return `LUKA-SIM|${origin}|${new Date().toISOString().slice(0, 10)}`;
}

export function getSimulatedMvpMetrics(): DevLabMvpMetrics {
  return { timeToFirstLukaMs: 4200, timeToFirstActionMs: 11800, source: "simulated" };
}

export function describeSimulatedTvTransport(state: DevLabTvTransportState) {
  if (state === "simulated-ready") return "Cast / DLNA simulado listo";
  if (state === "simulated-searching") return "Buscando transporte simulado…";
  return "Transporte simulado desconectado";
}

export type DevLabQrStatus = "idle" | "generated" | "scanning" | "matched";

export function nextSimulatedQrStatus(status: DevLabQrStatus): DevLabQrStatus {
  if (status === "idle") return "generated";
  if (status === "generated") return "scanning";
  if (status === "scanning") return "matched";
  return "generated";
}

export type DevLabTvPairingState = "idle" | "scanning" | "device-found" | "pairing" | "paired" | "error";

export function nextSimulatedTvPairingState(state: DevLabTvPairingState): DevLabTvPairingState {
  if (state === "idle") return "scanning";
  if (state === "scanning") return "device-found";
  if (state === "device-found") return "pairing";
  if (state === "pairing") return "paired";
  return "scanning";
}

export type DevLabPairedDevice = {
  id: string;
  name: string;
  profile: string;
  lastConnected: string;
  lastConnectedAt?: number;
  transport: "Cast simulado" | "DLNA simulado";
};

export const DEV_LAB_PAIRED_DEVICES: readonly DevLabPairedDevice[] = [
  { id: "google-tv-reference", name: "Google TV de referencia", profile: "Android TV / Google TV", lastConnected: "Hoy · 09:40", transport: "Cast simulado" },
  { id: "tizen-reference", name: "Samsung Tizen de referencia", profile: "Perfil DLNA", lastConnected: "Ayer · 18:15", transport: "DLNA simulado" },
];

export function reconnectSimulatedTvDevice(device: DevLabPairedDevice) {
  return { deviceId: device.id, state: "paired" as const, message: `${device.name} reconectado en sandbox` };
}

export function simulateTvPairingError() {
  return { state: "error" as const, message: "No se pudo completar el emparejamiento simulado" };
}


export type DevLabTvTransportContract = {
  protocol: "cast" | "dlna";
  discovery: "simulated";
  endpoint: "local-sandbox";
  auth: "not-configured";
  writeAuthority: "presentation-only";
};

export const DEV_LAB_TV_TRANSPORT_CONTRACTS: readonly DevLabTvTransportContract[] = [
  { protocol: "cast", discovery: "simulated", endpoint: "local-sandbox", auth: "not-configured", writeAuthority: "presentation-only" },
  { protocol: "dlna", discovery: "simulated", endpoint: "local-sandbox", auth: "not-configured", writeAuthority: "presentation-only" },
];

export type DevLabHistoryRetentionDays = 7 | 30 | 0;

export function isSimulatedPairedDeviceExpired(device: DevLabPairedDevice, now = Date.now(), retentionDays: DevLabHistoryRetentionDays = 30) {
  if (retentionDays === 0) return false;
  const timestamp = device.lastConnectedAt ?? Date.parse(device.lastConnected);
  return Number.isFinite(timestamp) && now - timestamp > retentionDays * 24 * 60 * 60 * 1000;
}

export function serializeSimulatedPairedDevices(devices: readonly DevLabPairedDevice[]) {
  return JSON.stringify(devices, null, 2);
}

export function removeSimulatedPairedDevice(devices: readonly DevLabPairedDevice[], deviceId: string) {
  return devices.filter((device) => device.id !== deviceId);
}

export function describePairingErrorForRetry() {
  return "No se pudo completar el emparejamiento simulado. Revisa el perfil y vuelve a intentar.";
}
