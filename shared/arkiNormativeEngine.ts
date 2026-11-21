/**
 * ARKI Normative Engine — FUSIÓN LEGACY + MODULAR (Pilar 3)
 * -----------------------------------------------------------
 * Mantiene los exports legacy (validateAgainstRne, NormativeFact,
 * NormativeResult) consumidos por arkiF7NormativeProjection.ts y
 * deriveProjectConstraints.ts, Y el nuevo motor modular (INormativeEngine,
 * RNE_A040_Engine, ASHRAE_Generic_Engine, getNormativeEngine).
 *
 * Autor: Yvan Castillo · ARKI-GIA · 2026-11-19
 */

import type { ClimateProfile } from "./arkiKoppenGeiger";

// ============================================================
// SECCIÓN A: MOTOR MODULAR (nuevo, Pilar 3)
// ============================================================

/**
 * ARKI Normative Engine Interface
 * -------------------------------
 * Patrón de diseño para evaluar cumplimiento normativo de forma modular.
 * Permite cambiar entre RNE (Perú), ASHRAE (EE.UU.), CTE (España), etc.
 */


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

// ============================================================
// SECCIÓN B: CAPA DE COMPATIBILIDAD LEGACY
// (exports consumidos por arkiF7NormativeProjection.ts y
//  deriveProjectConstraints.ts — NO ELIMINAR)
// ============================================================

export const ARKI_NORMATIVE_ENGINE_VERSION = "ARKI-NORMATIVE-ENGINE-1.0" as const;

export type NormativeRule = {
  id: string; domain: string; title: string; variable: string; operator: ">=" | "<=" | "==";
  min: number | null; max: number | null; unit: string; legalReference: string; appliesTo: string[];
  status: "REFERENCE_SEED"; evidenceRequired: true; source: string;
};
export type NormativeFact = { variable: string; value: number; unit?: string; source?: string };
export type NormativeResult = { ruleId: string; status: "PASS" | "FAIL" | "UNKNOWN"; observed: number | null; message: string; legalReference: string; evidenceRequired: true };

export const RNE_PERU_REFERENCE_RULES: readonly NormativeRule[] = [
  {
    "id": "RNE-GH.020",
    "domain": "habilitacion_urbana",
    "title": "Aporte mínimo de recreación pública",
    "variable": "aporte_recreacion_pct",
    "operator": ">=",
    "min": 8.0,
    "max": null,
    "unit": "%",
    "legalReference": "RNE GH.020 Art. 7",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-GH.020a",
    "domain": "habilitacion_urbana",
    "title": "Aporte mínimo de parques zonales",
    "variable": "aporte_parques_zonales_pct",
    "operator": ">=",
    "min": 2.0,
    "max": null,
    "unit": "%",
    "legalReference": "RNE GH.020 Art. 7",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-GH.020b",
    "domain": "habilitacion_urbana",
    "title": "Aporte mínimo de educación",
    "variable": "aporte_educacion_pct",
    "operator": ">=",
    "min": 1.0,
    "max": null,
    "unit": "%",
    "legalReference": "RNE GH.020 Art. 7",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-GH.020c",
    "domain": "habilitacion_urbana",
    "title": "Aporte mínimo de salud",
    "variable": "aporte_salud_pct",
    "operator": ">=",
    "min": 1.0,
    "max": null,
    "unit": "%",
    "legalReference": "RNE GH.020 Art. 7",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-GH.020d",
    "domain": "habilitacion_urbana",
    "title": "Aporte mínimo de otros usos",
    "variable": "aporte_otros_usos_pct",
    "operator": ">=",
    "min": 2.0,
    "max": null,
    "unit": "%",
    "legalReference": "RNE GH.020 Art. 7",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-GH.020e",
    "domain": "habilitacion_urbana",
    "title": "Ancho mínimo de vías locales",
    "variable": "ancho_via_local_m",
    "operator": ">=",
    "min": 9.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE GH.020 Art. 12",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-GH.020f",
    "domain": "habilitacion_urbana",
    "title": "Ancho mínimo de vías colectoras",
    "variable": "ancho_via_colectora_m",
    "operator": ">=",
    "min": 12.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE GH.020 Art. 12",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-GH.020g",
    "domain": "habilitacion_urbana",
    "title": "Ancho mínimo de vías arteriales",
    "variable": "ancho_via_arterial_m",
    "operator": ">=",
    "min": 20.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE GH.020 Art. 12",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.1",
    "domain": "habitabilidad",
    "title": "Altura mínima de ambientes (vivienda)",
    "variable": "altura_libre_vivienda_m",
    "operator": ">=",
    "min": 2.3,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.010 Art. 6",
    "appliesTo": [
      "Vivienda"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.2",
    "domain": "habitabilidad",
    "title": "Altura mínima de ambientes (oficina)",
    "variable": "altura_libre_oficina_m",
    "operator": ">=",
    "min": 2.5,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.010 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.3",
    "domain": "habitabilidad",
    "title": "Altura mínima de ambientes (comercio)",
    "variable": "altura_libre_comercio_m",
    "operator": ">=",
    "min": 3.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.010 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.4",
    "domain": "habitabilidad",
    "title": "Área mínima de dormitorio principal",
    "variable": "area_dormitorio_principal_m2",
    "operator": ">=",
    "min": 11.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.010 Art. 8",
    "appliesTo": [
      "Vivienda"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.5",
    "domain": "habitabilidad",
    "title": "Área mínima de dormitorio secundario",
    "variable": "area_dormitorio_secundario_m2",
    "operator": ">=",
    "min": 8.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.010 Art. 8",
    "appliesTo": [
      "Vivienda"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.6",
    "domain": "habitabilidad",
    "title": "Área mínima de cocina",
    "variable": "area_cocina_m2",
    "operator": ">=",
    "min": 5.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.010 Art. 8",
    "appliesTo": [
      "Vivienda"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.7",
    "domain": "habitabilidad",
    "title": "Ancho mínimo de pasajes de circulación",
    "variable": "ancho_pasillo_m",
    "operator": ">=",
    "min": 1.2,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.010 Art. 9",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.8",
    "domain": "seguridad",
    "title": "Coeficiente de ocupación máxima",
    "variable": "coeficiente_ocupacion",
    "operator": "<=",
    "min": null,
    "max": 1.5,
    "unit": "",
    "legalReference": "RNE A.010 Art. 10",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.010.9",
    "domain": "seguridad",
    "title": "Distancia mínima a edificaciones vecinas",
    "variable": "distancia_vecinos_m",
    "operator": ">=",
    "min": 3.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.010 Art. 11",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.020.1",
    "domain": "vivienda",
    "title": "Área mínima de vivienda unifamiliar",
    "variable": "area_vivienda_unifamiliar_m2",
    "operator": ">=",
    "min": 40.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.020 Art. 4",
    "appliesTo": [
      "Vivienda"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.020.2",
    "domain": "vivienda",
    "title": "Densidad neta mínima",
    "variable": "densidad_neta_hab_ha",
    "operator": ">=",
    "min": 100.0,
    "max": null,
    "unit": "hab/ha",
    "legalReference": "RNE A.020 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.020.3",
    "domain": "vivienda",
    "title": "Ventilación mínima en dormitorios",
    "variable": "ventilacion_dormitorio_m2",
    "operator": ">=",
    "min": 1.5,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.020 Art. 10",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.030.1",
    "domain": "hospedaje",
    "title": "Área mínima de habitación simple",
    "variable": "area_habitacion_simple_m2",
    "operator": ">=",
    "min": 9.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.030 Art. 5",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.030.2",
    "domain": "hospedaje",
    "title": "Área mínima de habitación doble",
    "variable": "area_habitacion_doble_m2",
    "operator": ">=",
    "min": 14.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.030 Art. 5",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.040.1",
    "domain": "educacion",
    "title": "Área mínima de aula inicial",
    "variable": "area_aula_inicial_m2",
    "operator": ">=",
    "min": 1.5,
    "max": null,
    "unit": "m²/estudiante",
    "legalReference": "RNE A.040 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.040.2",
    "domain": "educacion",
    "title": "Área mínima de aula primaria",
    "variable": "area_aula_primaria_m2",
    "operator": ">=",
    "min": 1.3,
    "max": null,
    "unit": "m²/estudiante",
    "legalReference": "RNE A.040 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.040.3",
    "domain": "educacion",
    "title": "Área mínima de aula secundaria",
    "variable": "area_aula_secundaria_m2",
    "operator": ">=",
    "min": 1.3,
    "max": null,
    "unit": "m²/estudiante",
    "legalReference": "RNE A.040 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.050.1",
    "domain": "salud",
    "title": "Ancho mínimo de circulación pública en hospital",
    "variable": "ancho_circulacion_hospital_m",
    "operator": ">=",
    "min": 2.4,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.050 Art. 7",
    "appliesTo": [
      "Hospital"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.050.3",
    "domain": "salud",
    "title": "Área mínima de UCI por cama",
    "variable": "area_uci_cama_m2",
    "operator": ">=",
    "min": 18.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.050 Art. 15",
    "appliesTo": [
      "Hospital"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.050.4",
    "domain": "salud",
    "title": "Área mínima de consultorio",
    "variable": "area_consultorio_m2",
    "operator": ">=",
    "min": 12.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.050 Art. 8",
    "appliesTo": [
      "Hospital"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.060.1",
    "domain": "industria",
    "title": "Retiro mínimo frontal",
    "variable": "retiro_frontal_industria_m",
    "operator": ">=",
    "min": 5.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.060 Art. 5",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.060.2",
    "domain": "industria",
    "title": "Área mínima de patio de maniobras",
    "variable": "patio_maniobras_m2",
    "operator": ">=",
    "min": 200.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.060 Art. 8",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.070.1",
    "domain": "comercio",
    "title": "Ancho mínimo de pasajes principales",
    "variable": "ancho_pasaje_principal_m",
    "operator": ">=",
    "min": 2.4,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.070 Art. 9",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.070.2",
    "domain": "comercio",
    "title": "Número mínimo de salidas de emergencia",
    "variable": "num_salidas_emergencia",
    "operator": ">=",
    "min": 2.0,
    "max": null,
    "unit": "",
    "legalReference": "RNE A.070 Art. 23",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.070.3",
    "domain": "comercio",
    "title": "Ancho mínimo de puertas de emergencia",
    "variable": "ancho_puerta_emergencia_m",
    "operator": ">=",
    "min": 1.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.070 Art. 23",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.080.1",
    "domain": "oficinas",
    "title": "Área mínima por persona en oficina",
    "variable": "area_por_persona_oficina_m2",
    "operator": ">=",
    "min": 9.5,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.080 Art. 5",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.080.2",
    "domain": "oficinas",
    "title": "Altura mínima de piso a techo",
    "variable": "altura_libre_oficina_m",
    "operator": ">=",
    "min": 2.5,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.080 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.090.1",
    "domain": "servicios_comunales",
    "title": "Altura mínima de ambientes",
    "variable": "altura_libre_comunal_m",
    "operator": ">=",
    "min": 2.5,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.090 Art. 5",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.100.1",
    "domain": "recreacion",
    "title": "Altura mínima de estadio cubierto",
    "variable": "altura_libre_estadio_m",
    "operator": ">=",
    "min": 20.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.100 Art. 6",
    "appliesTo": [
      "Estadio"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.100.2",
    "domain": "recreacion",
    "title": "Ancho mínimo de pasajes de evacuación en estadio",
    "variable": "ancho_evacuacion_estadio_m",
    "operator": ">=",
    "min": 1.2,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.100 Art. 12",
    "appliesTo": [
      "Estadio"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.100.3",
    "domain": "recreacion",
    "title": "Tiempo máximo de evacuación en estadio",
    "variable": "tiempo_evacuacion_min",
    "operator": "<=",
    "min": null,
    "max": 15.0,
    "unit": "min",
    "legalReference": "RNE A.100 Art. 15",
    "appliesTo": [
      "Estadio"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.100.4",
    "domain": "recreacion",
    "title": "Número mínimo de salidas de evacuación (80k)",
    "variable": "num_salidas_evacuacion",
    "operator": ">=",
    "min": 8.0,
    "max": null,
    "unit": "",
    "legalReference": "RNE A.100 Art. 15",
    "appliesTo": [
      "Estadio"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.100.5",
    "domain": "recreacion",
    "title": "Ancho mínimo de butacas en gradas",
    "variable": "ancho_butaca_gradas_m",
    "operator": ">=",
    "min": 0.5,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.100 Art. 10",
    "appliesTo": [
      "Estadio"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.100.6",
    "domain": "recreacion",
    "title": "Área mínima de camerinos",
    "variable": "area_camerino_m2",
    "operator": ">=",
    "min": 20.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.100 Art. 20",
    "appliesTo": [
      "Estadio"
    ],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.120.1",
    "domain": "accesibilidad",
    "title": "Ancho mínimo de rampa",
    "variable": "ancho_rampa_m",
    "operator": ">=",
    "min": 1.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.120 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.120.2",
    "domain": "accesibilidad",
    "title": "Pendiente máxima de rampa",
    "variable": "pendiente_rampa_pct",
    "operator": "<=",
    "min": null,
    "max": 8.0,
    "unit": "%",
    "legalReference": "RNE A.120 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.120.3",
    "domain": "accesibilidad",
    "title": "Ancho mínimo de puerta accesible",
    "variable": "ancho_puerta_accesible_m",
    "operator": ">=",
    "min": 0.9,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.120 Art. 8",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.120.4",
    "domain": "accesibilidad",
    "title": "Área mínima de baño accesible",
    "variable": "area_bano_accesible_m2",
    "operator": ">=",
    "min": 4.0,
    "max": null,
    "unit": "m²",
    "legalReference": "RNE A.120 Art. 12",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.120.5",
    "domain": "accesibilidad",
    "title": "Número de estacionamientos accesibles",
    "variable": "pct_estacionamiento_accesible",
    "operator": ">=",
    "min": 5.0,
    "max": null,
    "unit": "%",
    "legalReference": "RNE A.120 Art. 15",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.120.6",
    "domain": "accesibilidad",
    "title": "Ancho mínimo de espacio de ascensor",
    "variable": "ancho_ascensor_m",
    "operator": ">=",
    "min": 1.2,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.120 Art. 18",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.130.1",
    "domain": "seguridad",
    "title": "Tiempo de evacuación máxima (general)",
    "variable": "tiempo_evacuacion_min",
    "operator": "<=",
    "min": null,
    "max": 15.0,
    "unit": "min",
    "legalReference": "RNE A.130 Art. 5",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.130.2",
    "domain": "seguridad",
    "title": "Ancho mínimo de escalera de emergencia",
    "variable": "ancho_escalera_emergencia_m",
    "operator": ">=",
    "min": 1.2,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.130 Art. 12",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.130.3",
    "domain": "seguridad",
    "title": "Distancia máxima de recorrido a salida",
    "variable": "distancia_max_salida_m",
    "operator": "<=",
    "min": null,
    "max": 45.0,
    "unit": "m",
    "legalReference": "RNE A.130 Art. 8",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.130.4",
    "domain": "seguridad",
    "title": "Resistencia al fuego de estructura",
    "variable": "resistencia_fuego_horas",
    "operator": ">=",
    "min": 2.0,
    "max": null,
    "unit": "h",
    "legalReference": "RNE A.130 Art. 14",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.140.1",
    "domain": "patrimonio",
    "title": "Retiro mínimo en zona monumental",
    "variable": "retiro_zona_monumental_m",
    "operator": ">=",
    "min": 3.0,
    "max": null,
    "unit": "m",
    "legalReference": "RNE A.140 Art. 6",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  },
  {
    "id": "RNE-A.140.2",
    "domain": "patrimonio",
    "title": "Altura máxima en zona monumental",
    "variable": "altura_max_monumental_m",
    "operator": "<=",
    "min": null,
    "max": 12.0,
    "unit": "m",
    "legalReference": "RNE A.140 Art. 8",
    "appliesTo": [],
    "status": "REFERENCE_SEED",
    "evidenceRequired": true,
    "source": "00000Mejoras2.docx / RNE seed; verify against current official text before professional use"
  }
] as const;

export function applicableNormativeRules(typology?: string) {
  return RNE_PERU_REFERENCE_RULES.filter((rule) => !rule.appliesTo.length || !typology || rule.appliesTo.some((value) => value.toLocaleLowerCase() === typology.toLocaleLowerCase()));
}

export function validateAgainstRne(input: { typology?: string; facts: NormativeFact[]; ruleIds?: string[] }) {
  const factMap = new Map(input.facts.map((fact) => [fact.variable, fact]));
  const rules = applicableNormativeRules(input.typology).filter((rule) => !input.ruleIds?.length || input.ruleIds.includes(rule.id));
  const results: NormativeResult[] = rules.map((rule) => {
    const fact = factMap.get(rule.variable);
    if (!fact || !Number.isFinite(fact.value)) return { ruleId: rule.id, status: "UNKNOWN", observed: null, message: `Falta evidencia para ${rule.variable}.`, legalReference: rule.legalReference, evidenceRequired: true as const };
    const pass = rule.operator === ">=" ? fact.value >= (rule.min ?? Number.NEGATIVE_INFINITY) : rule.operator === "<=" ? fact.value <= (rule.max ?? Number.POSITIVE_INFINITY) : fact.value === (rule.min ?? rule.max);
    return { ruleId: rule.id, status: pass ? "PASS" : "FAIL", observed: fact.value, message: pass ? "Cumple el umbral de referencia." : `No cumple ${rule.operator} ${rule.min ?? rule.max} ${rule.unit}.`, legalReference: rule.legalReference, evidenceRequired: true as const };
  });
  return { engineVersion: ARKI_NORMATIVE_ENGINE_VERSION, country: "PE", normCode: "RNE", normVersion: "REFERENCE_SEED_2026", typology: input.typology ?? "UNKNOWN", ruleCount: rules.length, pass: results.filter((r) => r.status === "PASS").length, fail: results.filter((r) => r.status === "FAIL").length, unknown: results.filter((r) => r.status === "UNKNOWN").length, results, humanReviewRequired: true as const, canonicalPromotion: "NOT_REQUESTED" as const };
}

export function normativeContract() { return { version: ARKI_NORMATIVE_ENGINE_VERSION, source: "RNE Peru reference seed", ruleCount: RNE_PERU_REFERENCE_RULES.length, onlineRefresh: "DISABLED_UNTIL_HUMAN_RESEARCH_LEASE", professionalSignoff: "REQUIRED", humanReviewRequired: true as const }; }
