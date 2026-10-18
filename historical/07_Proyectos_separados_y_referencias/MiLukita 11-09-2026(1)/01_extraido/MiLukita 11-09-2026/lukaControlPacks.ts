import type { LukaIntentId, LukaMode } from "./lukaOsContract";

export type ControlPackId = "trackpad" | "keyboard" | "gamepad" | "lights-climate" | "audio" | "wearables" | "vehicle-dashboard" | "tv";
export type SimulatedDeviceKind = "pc" | "whiteboard" | "console" | "light" | "thermostat" | "speaker" | "headphones" | "smartwatch" | "bike" | "scooter" | "smart-tv";

export type ControlPack = {
  id: ControlPackId;
  label: string;
  reason: string;
  devices: readonly string[];
  center: string;
  activation: string;
  intentIds: readonly LukaIntentId[];
  mode: LukaMode;
  nextActions: readonly (ControlPackId | "ar")[];
};

export const CONTROL_PACKS: readonly ControlPack[] = [
  { id: "trackpad", label: "LUKA Trackpad", reason: "Navegar por interfaces digitales", devices: ["PC", "Pizarras", "Consolas"], center: "Superficie Trackpad", activation: "Quiero navegar", intentIds: ["navigate-tv"], mode: "trackpad", nextActions: ["ar"] },
  { id: "keyboard", label: "LUKA Keyboard", reason: "Escribir texto en una pantalla", devices: ["PC", "Pizarras"], center: "Campo de texto + mini teclado", activation: "Quiero escribir", intentIds: ["write"], mode: "keyboard", nextActions: ["gamepad"] },
  { id: "gamepad", label: "LUKA Gamepad", reason: "Jugar con controles de acción", devices: ["Consolas", "PC"], center: "D-Pad + acción", activation: "Quiero jugar", intentIds: ["play"], mode: "gamepad", nextActions: ["keyboard"] },
  { id: "lights-climate", label: "LUKA Lights & Climate", reason: "Ajustar el ambiente del hogar", devices: ["Luces", "AC", "Termostatos", "Cortinas", "Purificadores"], center: "Sliders + interruptores", activation: "Baja la luz", intentIds: ["lights-climate"], mode: "config", nextActions: ["audio"] },
  { id: "audio", label: "LUKA Audio", reason: "Controlar música y volumen", devices: ["Soundbars", "Bocinas", "Auriculares"], center: "Volumen + play/pause", activation: "Sube el volumen", intentIds: ["audio"], mode: "config", nextActions: ["tv"] },
  { id: "wearables", label: "LUKA Wearables", reason: "Consultar señales y notificaciones personales", devices: ["Smartwatches", "Smart Rings"], center: "Mini-board de notificaciones", activation: "Muéstrame mi pulso", intentIds: ["wearables"], mode: "config", nextActions: ["audio"] },
  { id: "vehicle-dashboard", label: "LUKA Vehicle Dashboard", reason: "Consultar el estado de movilidad eléctrica", devices: ["Bicicletas eléctricas", "Patinetes", "Motos eléctricas"], center: "Sliders de estado", activation: "Muestra el estado de mi bici", intentIds: ["vehicle-dashboard"], mode: "config", nextActions: ["lights-climate"] },
  { id: "tv", label: "LUKA TV", reason: "Controlar TV, TV Box y cine en casa", devices: ["Smart TV", "TV Boxes", "DVD", "Cine en casa"], center: "Numérico + volumen + streaming", activation: "Quiero ver TV", intentIds: ["watch-tv", "open-netflix"], mode: "tv-media", nextActions: ["trackpad", "gamepad"] },
] as const;

export type SimulatedDevice = { id: string; kind: SimulatedDeviceKind; name: string; packId: ControlPackId; protocol: "simulated"; batteryPercent: number; signalPercent: number };

const SIMULATED_DEVICES: readonly SimulatedDevice[] = [
  { id: "sim-pc-01", kind: "pc", name: "PC de prueba", packId: "trackpad", protocol: "simulated", batteryPercent: 84, signalPercent: 92 },
  { id: "sim-console-01", kind: "console", name: "Consola de prueba", packId: "gamepad", protocol: "simulated", batteryPercent: 72, signalPercent: 86 },
  { id: "sim-light-01", kind: "light", name: "Luz de sala", packId: "lights-climate", protocol: "simulated", batteryPercent: 100, signalPercent: 78 },
  { id: "sim-speaker-01", kind: "speaker", name: "Bocina de prueba", packId: "audio", protocol: "simulated", batteryPercent: 61, signalPercent: 89 },
  { id: "sim-watch-01", kind: "smartwatch", name: "Smartwatch de prueba", packId: "wearables", protocol: "simulated", batteryPercent: 48, signalPercent: 74 },
  { id: "sim-bike-01", kind: "bike", name: "Bicicleta eléctrica de prueba", packId: "vehicle-dashboard", protocol: "simulated", batteryPercent: 66, signalPercent: 69 },
  { id: "sim-tv-02", kind: "smart-tv", name: "Smart TV de prueba", packId: "tv", protocol: "simulated", batteryPercent: 100, signalPercent: 96 },
];

export function getControlPack(id: ControlPackId) {
  return CONTROL_PACKS.find((pack) => pack.id === id) ?? CONTROL_PACKS[0];
}

export function detectSimulatedDevices(): readonly SimulatedDevice[] {
  return SIMULATED_DEVICES;
}

export function resolvePackFromDevice(kind: SimulatedDeviceKind) {
  return SIMULATED_DEVICES.find((device) => device.kind === kind)?.packId ?? "tv";
}

export function tickSimulatedTelemetry(devices: readonly SimulatedDevice[], tick: number): SimulatedDevice[] {
  return devices.map((device, index) => ({
    ...device,
    batteryPercent: device.batteryPercent <= 20 ? 100 : Math.max(20, device.batteryPercent - ((tick + index) % 3 === 0 ? 1 : 0)),
    signalPercent: 58 + ((device.signalPercent + tick * 3 + index * 5) % 43),
  }));
}

export type SimulatedDiscoverySource = "wifi" | "bluetooth";
export type SimulatedDiscoveredDevice = SimulatedDevice & { source: SimulatedDiscoverySource; discoveredAt: number };

export function scanSimulatedDevices(source: SimulatedDiscoverySource, now = Date.now()): readonly SimulatedDiscoveredDevice[] {
  const bluetoothKinds: readonly SimulatedDeviceKind[] = ["console", "headphones", "speaker", "smartwatch", "bike", "scooter"];
  return SIMULATED_DEVICES.filter((device) => source === "wifi" ? !bluetoothKinds.includes(device.kind) : bluetoothKinds.includes(device.kind)).map((device) => ({ ...device, source, discoveredAt: now }));
}

export function activatePackFromDevice(device: Pick<SimulatedDevice, "kind">): ControlPackId {
  return resolvePackFromDevice(device.kind);
}

export function getSimulatedDiscoverySummary(now = Date.now()) {
  return { wifi: scanSimulatedDevices("wifi", now), bluetooth: scanSimulatedDevices("bluetooth", now), authority: "presentation-only" as const };
}
