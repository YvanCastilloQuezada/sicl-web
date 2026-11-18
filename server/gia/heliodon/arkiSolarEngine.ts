/**
 * ARKI Solar Engine — Motor Solar Canónico
 * Implementación determinista de fórmulas NOAA simplificadas.
 * Precisión: ±1° en elevación y azimut.
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
  solarNoonMinutes: number;
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

export function equationOfTime(d: Date): number {
  const g = gammaFraction(d);
  return 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
}

export function solarDeclination(d: Date): number {
  const g = gammaFraction(d);
  const declRad = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  return declRad * RAD;
}

export function computeSolarPosition(input: SolarInput): SolarPosition {
  const d = typeof input.datetime === "string" ? new Date(input.datetime) : input.datetime;
  if (Number.isNaN(d.getTime())) throw new Error("ARKI_SOLAR_ENGINE: datetime inválido");
  if (input.latitude < -90 || input.latitude > 90) throw new Error("ARKI_SOLAR_ENGINE: latitude fuera de rango");
  if (input.longitude < -180 || input.longitude > 180) throw new Error("ARKI_SOLAR_ENGINE: longitude fuera de rango");

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
  const cosAz = (Math.sin(latRad) * Math.sin(elevRad) - Math.sin(declRad)) / (Math.cos(latRad) * Math.cos(elevRad));
  const clampedCosAz = Math.max(-1, Math.min(1, cosAz));
  let azimuth = Math.acos(clampedCosAz) * RAD;
  if (hourAngle > 0) azimuth = 360 - azimuth;

  const solarNoonMinutes = 720 - 4 * input.longitude - eqTime + 60 * input.timezoneOffset;

  return {
    elevation: Math.round(elevation * 100) / 100,
    azimuth: Math.round(azimuth * 100) / 100,
    declination: Math.round(declDeg * 100) / 100,
    equationOfTime: Math.round(eqTime * 100) / 100,
    hourAngle: Math.round(hourAngle * 100) / 100,
    solarNoonMinutes: Math.round(solarNoonMinutes * 100) / 100,
    inputIso: d.toISOString(),
  };
}

export function isSunAboveHorizon(pos: SolarPosition): boolean {
  return pos.elevation > 0;
}
