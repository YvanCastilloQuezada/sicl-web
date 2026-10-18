export const DEV_LAB_TABS = ["registry", "ar", "tv"] as const;
export type DevLabTab = (typeof DEV_LAB_TABS)[number];

export const DEV_LAB_AR_POINTS = ["Huaca del Sol", "Comisaría", "Plaza de Armas"] as const;

export type DevLabTvPreview = {
  title: string;
  subtitle: string;
  accent: string;
};

export function clampTvVolume(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function nextTvChannel(channel: number, delta: number) {
  return Math.max(1, Math.min(999, Math.round(channel + delta)));
}

export function getDevLabTvPreview(channel: number): DevLabTvPreview {
  const safeChannel = Math.max(1, Math.min(999, Math.round(channel)));
  const previews: readonly DevLabTvPreview[] = [
    { title: "Noticias de LUKA", subtitle: `Señal simulada · canal ${safeChannel}`, accent: "from-cyan-300/40 via-emerald-300/15 to-transparent" },
    { title: "LUKALLPA en ruta", subtitle: `Guía territorial · canal ${safeChannel}`, accent: "from-amber-200/40 via-orange-300/15 to-transparent" },
    { title: "Experiencias AR", subtitle: `Visor aumentado · canal ${safeChannel}`, accent: "from-fuchsia-300/35 via-cyan-300/15 to-transparent" },
  ];
  return previews[safeChannel % previews.length];
}

export function toggleDevCapability(state: "available" | "reserved" | "hidden") {
  return state === "available" ? "hidden" : "available";
}

export function describeArPreview(planesDetected: boolean, point: string | null) {
  if (!planesDetected) return "Activa la detección de planos para iniciar una guía simulada.";
  return point ? `Ruta holográfica simulada hacia ${point}.` : "Planos detectados; elige un punto de interés.";
}
