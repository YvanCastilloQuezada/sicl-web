/**
 * ARKI Solar Shadows — Motor de Sombras Dinámicas
 * -------------------------------------------------
 * Calcula la dirección e intensidad de la luz solar para renderizado 3D.
 * Integración con Three.js (UPAO001MassingViewer3D).
 *
 * Autoridad: ARKI-GIA · Tríada Sensaciones + Forma
 * Depende de: arkiSolarEngine.ts (MO-HELIODON-01)
 *
 * Reglas de diseño:
 * - Puro: sin side effects, sin I/O directo.
 * - Determinista: mismos inputs → mismos outputs.
 * - Compatible con Three.js: retorna vectores normalizados.
 * - Testeable: cada función pública tiene contrato verificable.
 */

import { computeSolarPosition, type SolarInput, type SolarPosition } from "./arkiSolarEngine";

export interface ShadowDirection {
  /** Vector de dirección de la luz solar (normalizado, apunta HACIA el sol). */
  x: number;
  y: number;
  z: number;
  /** Intensidad de la luz (0-1). 0=noche, 1=mediodía despejado. */
  intensity: number;
  /** Color de la luz (temperatura). Día: blanco cálido, amanecer/atardecer: naranja. */
  color: { r: number; g: number; b: number };
  /** Posición solar completa (para debug/overlay). */
  solarPosition: SolarPosition;
}

/**
 * Convierte elevación y azimut solares a un vector de dirección 3D (Three.js).
 * 
 * Convención Three.js:
 * - X: este
 * - Y: arriba (cenit)
 * - Z: sur
 * 
 * @param elevation Grados sobre el horizonte (0-90).
 * @param azimuth Grados desde el norte, horario (0=N, 90=E, 180=S, 270=W).
 * @returns Vector normalizado apuntando HACIA el sol.
 */
export function solarDirectionToVector3(
  elevation: number,
  azimuth: number,
): { x: number; y: number; z: number } {
  const elevRad = (elevation * Math.PI) / 180;
  const azRad = (azimuth * Math.PI) / 180;

  // Componente horizontal (proyección en plano XZ)
  const horizontalLength = Math.cos(elevRad);

  // Azimut: 0°=Norte (Z+), 90°=Este (X+), 180°=Sur (Z-), 270°=Oeste (X-)
  const x = horizontalLength * Math.sin(azRad); // Este
  const z = -horizontalLength * Math.cos(azRad); // Sur (negativo porque azimut 180°=Sur)
  const y = Math.sin(elevRad); // Arriba

  // Normalizar (ya debería estar normalizado, pero por seguridad)
  const length = Math.sqrt(x * x + y * y + z * z);
  return {
    x: x / length,
    y: y / length,
    z: z / length,
  };
}

/**
 * Calcula la intensidad de la luz solar (0-1) basada en la elevación.
 * 
 * - elevation <= 0°: intensidad 0 (noche)
 * - elevation = 90°: intensidad 1 (cenit)
 * - Transición suave entre 0° y 90°
 */
export function computeLightIntensity(elevation: number): number {
  if (elevation < 0) return 0;
  if (elevation >= 90) return 1;
  // Función suave: sin(elevation)
  return Math.sin((elevation * Math.PI) / 180);
}

/**
 * Calcula el color de la luz solar basado en la elevación.
 * 
 * - Amanecer/atardecer (0-15°): naranja cálido (255, 180, 100)
 * - Mediodía (60-90°): blanco cálido (255, 250, 240)
 * - Transición suave entre ambos
 */
export function computeLightColor(elevation: number): { r: number; g: number; b: number } {
  if (elevation < 0) return { r: 0, g: 0, b: 0 };
  
  // Normalizar elevación a 0-1 (0°=0, 90°=1)
  const t = Math.min(elevation / 90, 1);
  
  // Interpolación lineal entre naranja (t=0) y blanco cálido (t=1)
  const r = 255;
  const g = Math.round(180 + (250 - 180) * t);
  const b = Math.round(100 + (240 - 100) * t);
  
  return { r, g, b };
}

/**
 * Calcula la dirección e intensidad de la luz solar para un input dado.
 */
export function computeShadowDirection(input: SolarInput): ShadowDirection {
  const solarPos = computeSolarPosition(input);
  const direction = solarDirectionToVector3(solarPos.elevation, solarPos.azimuth);
  const intensity = computeLightIntensity(solarPos.elevation);
  const color = computeLightColor(solarPos.elevation);

  return {
    x: direction.x,
    y: direction.y,
    z: direction.z,
    intensity,
    color,
    solarPosition: solarPos,
  };
}

/**
 * Calcula las sombras para un rango de horas (útil para animación).
 */
export function computeShadowTimeline(
  input: Omit<SolarInput, "datetime"> & { date: string },
  startHour: number,
  endHour: number,
  stepMinutes: number = 60,
): ShadowDirection[] {
  const timeline: ShadowDirection[] = [];
  const [year, month, day] = input.date.split("-").map(Number);

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60 && (hour < endHour || minute === 0); minute += stepMinutes) {
      const datetime = new Date(year, month - 1, day, hour, minute, 0);
      const shadow = computeShadowDirection({
        latitude: input.latitude,
        longitude: input.longitude,
        timezoneOffset: input.timezoneOffset,
        datetime,
      });
      timeline.push(shadow);
    }
  }

  return timeline;
}
