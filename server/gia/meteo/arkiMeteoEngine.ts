/**
 * ARKI Meteo Engine — Cliente de Open-Meteo
 * -----------------------------------------
 * Obtiene datos climáticos históricos o de pronóstico sin API key.
 * Endpoint: https://open-meteo.com/
 */

import { assessBioclimaticStrategy, type ClimateData, type ClimateAssessment } from "../../../shared/arkiClimateUtils";

export interface MeteoResult {
  tempC: number;
  rh: number;
  windSpeedMs: number;
  solarRadiationWm2: number;
  assessment: ClimateAssessment;
  timestamp: string;
}

/**
 * Obtiene datos climáticos para una fecha y coordenadas dadas.
 * Usa el endpoint 'historical' si la fecha es pasada, o 'forecast' si es cercana.
 * Para simplificar, usamos el endpoint de pronóstico que cubre 7 días atrás y 16 adelante.
 */
export async function getClimateData(
  lat: number,
  lon: number,
  dateStr: string, // YYYY-MM-DD
  hour: number = 12, // 0-23
): Promise<MeteoResult> {
  // Open-Meteo forecast endpoint cubre pasado reciente y futuro
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,shortwave_radiation&timezone=America/Lima&start_date=${dateStr}&end_date=${dateStr}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }
    const data = await response.json();

    // Encontrar el índice de la hora solicitada
    const times = data.hourly.time as string[];
    const targetTime = `${dateStr}T${String(hour).padStart(2, "0")}:00`;
    const idx = times.findIndex((t) => t.startsWith(targetTime));

    if (idx === -1) {
      throw new Error(`Hora ${targetTime} no encontrada en la respuesta de Open-Meteo`);
    }

    const tempC = data.hourly.temperature_2m[idx];
    const rh = data.hourly.relative_humidity_2m[idx];
    const windSpeedKmh = data.hourly.wind_speed_10m[idx];
    const windSpeedMs = windSpeedKmh / 3.6; // Convertir km/h a m/s
    const solarRadiationWm2 = data.hourly.shortwave_radiation[idx];

    const climateData: ClimateData = { tempC, rh, windSpeedMs, solarRadiationWm2 };
    const assessment = assessBioclimaticStrategy(climateData);

    return {
      tempC,
      rh,
      windSpeedMs,
      solarRadiationWm2,
      assessment,
      timestamp: times[idx],
    };
  } catch (error) {
    console.error("Error fetching Open-Meteo data:", error);
    throw error;
  }
}
