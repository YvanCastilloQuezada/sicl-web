/**
 * ARKI Solar Utils — Cálculo Solar Determinista (Cliente/Servidor)
 * Versión ligera del motor para respuesta inmediata en la UI.
 * (La versión completa con validaciones está en server/gia/heliodon/arkiSolarEngine.ts)
 */

export interface SolarInput {
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  datetime: string | Date;
}

export interface SolarPosition {
  elevation: number;
  azimuth: number;
  declination: number;
  equationOfTime: number;
  hourAngle: number;
  inputIso: string;
}

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function gammaFraction(d: Date): number {
  const n = dayOfYear(d);
  const hour = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
  const daysInYear = (d.getFullYear() % 4 === 0 && (d.getFullYear() % 100 !== 0 || d.getFullYear() % 400 === 0)) ? 366 : 365;
  return (2 * Math.PI / daysInYear) * (n - 1 + (hour - 12) / 24);
}

function equationOfTime(d: Date): number {
  const g = gammaFraction(d);
  return 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
}

function solarDeclination(d: Date): number {
  const g = gammaFraction(d);
  const declRad = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  return declRad * RAD;
}

export function computeSolarPositionClient(input: SolarInput): SolarPosition {
  const d = typeof input.datetime === "string" ? new Date(input.datetime) : input.datetime;
  const latRad = input.latitude * DEG;
  const eqTime = equationOfTime(d);
  const declDeg = solarDeclination(d);
  const declRad = declDeg * DEG;

  const timeOffsetMinutes = eqTime + 4 * input.longitude - 60 * input.timezoneOffset;
  const localMinutes = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
  const trueSolarTime = localMinutes + timeOffsetMinutes;

  let hourAngle = (trueSolarTime / 4) - 180;
  while (hourAngle < -180) hourAngle += 360;
  while (hourAngle > 180) hourAngle -= 360;
  const haRad = hourAngle * DEG;

  const sinElev = Math.sin(latRad) * Math.sin(declRad) + Math.cos(latRad) * Math.cos(declRad) * Math.cos(haRad);
  const elevation = Math.asin(Math.max(-1, Math.min(1, sinElev))) * RAD;

  const elevRad = elevation * DEG;
  // Fórmula atan2 infalible para azimut (desde el Norte, horario)
        const y = -Math.sin(haRad);
        const x = Math.cos(latRad) * Math.tan(declRad) - Math.sin(latRad) * Math.cos(haRad);
        let azimuth = Math.atan2(y, x) * RAD;
        azimuth = (azimuth + 360) % 360; // Normalizar a 0-360

  return {
    elevation: Math.round(elevation * 100) / 100,
    azimuth: Math.round(azimuth * 100) / 100,
    declination: Math.round(declDeg * 100) / 100,
    equationOfTime: Math.round(eqTime * 100) / 100,
    hourAngle: Math.round(hourAngle * 100) / 100,
    inputIso: d.toISOString(),
  };
}
