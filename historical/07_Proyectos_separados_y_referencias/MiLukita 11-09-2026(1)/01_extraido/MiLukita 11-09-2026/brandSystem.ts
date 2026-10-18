export const MILUKITA_BRAND = {
  name: "MiLukita",
  host: "Lukita",
  domain: "MiLukita.com",
  tvName: "MiLukita TV",
  gamesName: "MiLukita Juegos",
  eventsName: "MiLukita Eventos",
  verificationName: "MiLukita Verificación",
  tagline: "Entretenimiento interactivo, claro y verificable.",
  pilotNotice: "Piloto gratuito · créditos virtuales · sin dinero real · sin retiros",
  hostRole: "Anfitrión digital",
  technicalCore: "MJP CORE",
} as const;

export const MILUKITA_NOW_NEXT_LABELS = {
  now: "AHORA",
  next: "SIGUIENTE",
  later: "DESPUÉS",
} as const;

export const MILUKITA_HOST_SCRIPTS = {
  WELCOME: "Bienvenidos a MiLukita.",
  PREPARING: "Estamos preparando el próximo evento.",
  COUNTDOWN: "Faltan pocos segundos para comenzar.",
  OPEN: "La participación está abierta con créditos virtuales.",
  LOCK: "La participación está cerrada. Preparando el sorteo.",
  DRAW: "Vamos con el resultado.",
  RESULT: "Ya tenemos el resultado oficial.",
  VERIFY: "Puedes verificarlo desde MiLukita Verificación.",
  NEXT: "Y ahora, nuestro próximo evento.",
  CONTINGENCY: "Estamos recuperando la conexión. El resultado oficial permanece protegido.",
} as const;

export type MilukitaExperienceState = keyof typeof MILUKITA_HOST_SCRIPTS;

export function isMilukitaTechnicalAlias(value: string) {
  return value === "MJP CORE" || value.startsWith("MJP-") || value.startsWith("MJP_") || value.startsWith("RP-MJP-");
}
