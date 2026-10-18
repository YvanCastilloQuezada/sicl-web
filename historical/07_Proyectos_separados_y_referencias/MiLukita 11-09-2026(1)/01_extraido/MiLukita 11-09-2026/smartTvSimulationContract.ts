export type SmartTvSimulationState = "idle" | "scanning" | "found" | "connecting" | "connected" | "failed";
export type SmartTvRoute = "home" | "media" | "apps" | "settings";
export type SmartTvAction = "up" | "down" | "left" | "right" | "ok" | "back" | "home";

export type SimulatedSmartTv = {
  id: string;
  name: string;
  protocol: "simulated";
  signal: "excellent" | "good";
  model: string;
};

export const SIMULATED_SMART_TV: SimulatedSmartTv = {
  id: "sim-tv-luka-01",
  name: "Sala · Smart TV de prueba",
  protocol: "simulated",
  signal: "excellent",
  model: "LUKA Display Simulator",
};

export const SMART_TV_SIMULATION_STEPS = [
  { state: "idle", label: "Listo para buscar" },
  { state: "scanning", label: "Buscando Smart TV" },
  { state: "found", label: "TV encontrada" },
  { state: "connecting", label: "Conectando entorno simulado" },
  { state: "connected", label: "Conectado · navegación disponible" },
] as const;

export function nextSmartTvRoute(route: SmartTvRoute, action: SmartTvAction): SmartTvRoute {
  if (action === "home") return "home";
  if (action === "back") return route === "home" ? "home" : "home";
  if (action === "right") return route === "home" ? "media" : route === "media" ? "apps" : route;
  if (action === "left") return route === "apps" ? "media" : route === "media" ? "home" : route;
  if (action === "ok" && route === "home") return "media";
  return route;
}

export function isSafeSmartTvSimulationAction(action: SmartTvAction) {
  return ["up", "down", "left", "right", "ok", "back", "home"].includes(action);
}

export const SMART_TV_CONNECTED_MESSAGE = "Conectado a Smart TV";
export const SMART_TV_NOT_FOUND_MESSAGE = "No he encontrado tu TV. Escanea el QR o prueba con otro dispositivo";

export function mapSmartTvKeyToAction(key: string): SmartTvAction | null {
  if (key === "ArrowUp") return "up";
  if (key === "ArrowDown") return "down";
  if (key === "ArrowLeft") return "left";
  if (key === "ArrowRight") return "right";
  if (key === "Enter") return "ok";
  if (key === "Escape" || key === "BrowserBack") return "back";
  if (key === "Home") return "home";
  return null;
}

export const ANDROID_TV_PHASE_ONE_CHECKLIST = [
  "Descubrimiento simulado de TV en la misma red",
  "Estado visible Conectado a Smart TV",
  "Navegación LRUD y Enter/Back",
  "Fallback por QR si no se encuentra TV",
  "Focus management sin teclado físico obligatorio",
  "Sin escritura en MJP CORE",
] as const;

export type AndroidTvProfile = {
  id: string;
  label: string;
  model: string;
  focusNotes: string;
};

export const ANDROID_TV_PROFILES: readonly AndroidTvProfile[] = [
  { id: "google-tv-reference", label: "Google TV · referencia", model: "Chromecast con Google TV (simulado)", focusNotes: "LRUD y Enter" },
  { id: "android-tv-reference", label: "Android TV · referencia", model: "Android TV 12 (simulado)", focusNotes: "LRUD y Back" },
  { id: "android-tv-low-bandwidth", label: "Android TV · red limitada", model: "Android TV · perfil de conectividad reducida (simulado)", focusNotes: "LRUD y fallback QR" },
] as const;
