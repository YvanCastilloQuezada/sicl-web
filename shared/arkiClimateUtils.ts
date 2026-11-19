/**
 * ARKI Climate Utils — Carta Bioclimática de Givoni Simplificada
 * --------------------------------------------------------------
 * Determina estrategias de diseño pasivo basadas en:
 * - Temperatura del aire (°C)
 * - Humedad relativa (%)
 * - Velocidad del viento (m/s)
 * 
 * Referencia: Olgyay / Givoni Bioclimatic Chart
 */

export type PassiveStrategy =
  | "Ganancia solar directa"
  | "Masa térmica"
  | "Ventilación natural"
  | "Ventilación cruzada forzada"
  | "Enfriamiento evaporativo"
  | "Sombreado pesado"
  | "Aislamiento térmico"
  | "Confort térmico"
  | "Calefacción activa requerida";

export interface ClimateData {
  tempC: number;
  rh: number; // 0-100
  windSpeedMs: number;
  solarRadiationWm2?: number;
}

export interface ClimateAssessment {
  strategy: PassiveStrategy;
  comfortLevel: "Frío" | "Fresco" | "Confort" | "Cálido" | "Caluroso";
  description: string;
}

/**
 * Evalúa las condiciones climáticas y devuelve la estrategia pasiva recomendada.
 * Basado en zonas de la carta bioclimática de Givoni.
 */
export function assessBioclimaticStrategy(data: ClimateData): ClimateAssessment {
  const { tempC, rh, windSpeedMs } = data;

  // 1. Zonas de Confort (aproximación Givoni: 20°C - 26°C, 30% - 70% HR)
  if (tempC >= 20 && tempC <= 26 && rh >= 30 && rh <= 70) {
    return {
      strategy: "Confort térmico",
      comfortLevel: "Confort",
      description: "Condiciones ideales. Priorizar ventilación natural para mantenimiento.",
    };
  }

  // 2. Zonas Frías (< 20°C)
  if (tempC < 20) {
    if (tempC < 10) {
      return {
        strategy: "Ganancia solar directa",
        comfortLevel: "Frío",
        description: "Priorizar orientación norte (hemisferio sur), vidrios de alta transmitancia y masa térmica para almacenar calor diurno.",
      };
    }
    if (rh > 70) {
      return {
        strategy: "Aislamiento térmico",
        comfortLevel: "Fresco",
        description: "Ambiente frío y húmedo. Requiere aislamiento en envolvente y ganancia solar controlada.",
      };
    }
    return {
      strategy: "Masa térmica",
      comfortLevel: "Fresco",
      description: "Ambiente frío y seco (ej. Puno). Usar inercia térmica (muros gruesos) para amortiguar oscilación y captar sol.",
    };
  }

  // 3. Zonas Cálidas (> 26°C)
  if (tempC > 26) {
    if (rh > 70) {
      // Cálido y húmedo (ej. Iquitos, Trujillo verano)
      if (windSpeedMs < 1.5) {
        return {
          strategy: "Ventilación cruzada forzada",
          comfortLevel: "Caluroso",
          description: "Alta humedad impide evaporación. Priorizar ventilación cruzada, aleros profundos y sombreado total de fachadas este/oeste.",
        };
      }
      return {
        strategy: "Ventilación natural",
        comfortLevel: "Cálido",
        description: "La humedad es alta, pero hay viento. Diseñar para canalizar brisas predominantes.",
      };
    } else {
      // Cálido y seco (ej. Costa norte, sierra media)
      if (rh < 40) {
        return {
          strategy: "Enfriamiento evaporativo",
          comfortLevel: "Cálido",
          description: "Clima seco. Patios con agua, vegetación y muros gruesos para retraso térmico (desfase).",
        };
      }
      return {
        strategy: "Sombreado pesado",
        comfortLevel: "Caluroso",
        description: "Proteger fachadas con aleros, persianas o vegetación. Ventilación nocturna para purgar calor.",
      };
    }
  }

  // Fallback
  return {
    strategy: "Confort térmico",
    comfortLevel: "Confort",
    description: "Condiciones dentro de rangos aceptables.",
  };
}
