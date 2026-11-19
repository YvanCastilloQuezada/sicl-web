/**
 * ARKI Normative Engine Interface
 * -------------------------------
 * Patrón de diseño para evaluar cumplimiento normativo de forma modular.
 * Permite cambiar entre RNE (Perú), ASHRAE (EE.UU.), CTE (España), etc.
 */

import type { ClimateProfile } from "./arkiKoppenGeiger";

export type NormativeStandard = "RNE-A040-PE" | "ASHRAE-55" | "CTE-DB-HE-ES" | "NOM-020-MX";

export interface SolarComplianceResult {
  standard: NormativeStandard;
  compliant: boolean;
  metric: string; // ej: "Horas de sol directo en solsticio de invierno"
  required: number;
  actual: number;
  recommendations: string[];
}

export interface INormativeEngine {
  standard: NormativeStandard;
  name: string;
  evaluateSolarAccess(actualSunHours: number, typology: string, climate: ClimateProfile): SolarComplianceResult;
  getBioclimaticRecommendations(climate: ClimateProfile, orientationDeg: number): string[];
}

// ============================================================
// IMPLEMENTACIÓN: RNE A.040 (PERÚ)
// ============================================================
export class RNE_A040_Engine implements INormativeEngine {
  standard: NormativeStandard = "RNE-A040-PE";
  name = "Reglamento Nacional de Edificaciones A.040 (Perú)";

  evaluateSolarAccess(actualSunHours: number, typology: string, _climate: ClimateProfile): SolarComplianceResult {
    const requirements: Record<string, number> = {
      "vivienda": 2,
      "hospital": 3,
      "escuela": 4,
      "oficina": 2,
    };
    
    const required = requirements[typology.toLowerCase()] || 2;
    const compliant = actualSunHours >= required;
    
    const recommendations: string[] = [];
    if (!compliant) {
      recommendations.push(`Aumentar aberturas al norte (hemisferio sur) o reducir obstrucciones.`);
      recommendations.push(`Considerar patios de luz o retranqueos para mejorar el asoleamiento.`);
    } else {
      recommendations.push(`El asoleamiento cumple con el mínimo. Verificar protección solar para evitar sobrecalentamiento.`);
    }

    return {
      standard: this.standard,
      compliant,
      metric: "Horas de sol directo (solsticio de invierno)",
      required,
      actual: actualSunHours,
      recommendations,
    };
  }

  getBioclimaticRecommendations(climate: ClimateProfile, orientationDeg: number): string[] {
    const recs = [...climate.passiveStrategies];
    
    // Ajuste por orientación (Hemisferio Sur: Norte = 0/360, Sur = 180)
    const isNorthFacing = (orientationDeg >= 315 || orientationDeg < 45);
    if (isNorthFacing && (climate.zone === "BWh" || climate.zone === "Cfb")) {
      recs.push("Excelente orientación para ganancia solar pasiva. Diseñar aleros para bloquear sol de verano (dic) y permitir sol de invierno (jun).");
    } else if (!isNorthFacing && climate.zone === "ET") {
      recs.push("Orientación no óptima para ganancia solar. Priorizar aislamiento y considerar reorientación de espacios habitables.");
    }
    
    return [...new Set(recs)]; // Eliminar duplicados
  }
}

// ============================================================
// IMPLEMENTACIÓN: ASHRAE 55 (GENÉRICO GLOBAL)
// ============================================================
export class ASHRAE_Generic_Engine implements INormativeEngine {
  standard: NormativeStandard = "ASHRAE-55";
  name = "ASHRAE Standard 55 (Thermal Environmental Conditions)";

  evaluateSolarAccess(actualSunHours: number, _typology: string, _climate: ClimateProfile): SolarComplianceResult {
    // ASHRAE 55 se enfoca más en confort térmico (PMV/PPD) que en horas de sol fijas,
    // pero usamos un umbral genérico de 2h para espacios habitables como fallback.
    const required = 2;
    return {
      standard: this.standard,
      compliant: actualSunHours >= required,
      metric: "Horas de acceso solar directo (fallback genérico)",
      required,
      actual: actualSunHours,
      recommendations: ["Evaluar confort térmico con modelo adaptativo ASHRAE 55."],
    };
  }

  getBioclimaticRecommendations(climate: ClimateProfile, _orientationDeg: number): string[] {
    return climate.passiveStrategies;
  }
}

// ============================================================
// FÁBRICA DE MOTORES
// ============================================================
export function getNormativeEngine(standard: NormativeStandard): INormativeEngine {
  switch (standard) {
    case "RNE-A040-PE": return new RNE_A040_Engine();
    case "ASHRAE-55": return new ASHRAE_Generic_Engine();
    default: return new RNE_A040_Engine(); // Fallback seguro
  }
}
