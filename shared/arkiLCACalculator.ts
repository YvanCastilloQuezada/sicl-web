/**
 * ARKI LCA Calculator — Huella de Carbono Incorporado (Embodied Carbon)
 * ---------------------------------------------------------------------
 * Calcula una estimación temprana de kgCO2e basada en volúmenes/áreas 
 * de materiales del modelo conceptual (etapa de massing).
 * 
 * Referencia: Factores genéricos de bases de datos como ICE (Inventory of 
 * Carbon & Energy) o Ecoinvent. A futuro, esto se conectará a Brightway.
 */

export interface MaterialQuantity {
  material: string;
  quantity: number;
  unit: "m3" | "m2" | "kg";
}

export interface LCAResult {
  totalKgCO2e: number;
  kgCO2ePerM2: number;
  breakdown: Record<string, number>;
  methodology: string;
}

// Factores de emisión base (kgCO2e por unidad)
// Fuente: Aproximación basada en ICE Database / Ecoinvent (valores genéricos para etapa conceptual)
const EMISSION_FACTORS: Record<string, { factor: number; unit: "m3" | "m2" | "kg" }> = {
  "Concreto Estructural": { factor: 250, unit: "m3" },
  "Ladrillo de Arcilla": { factor: 150, unit: "m3" },
  "Vidrio Monolítico": { factor: 400, unit: "m2" },
  "Acero de Refuerzo": { factor: 1.8, unit: "kg" },
  "Aislamiento Térmico": { factor: 3.5, unit: "m2" }, // Por m2 de espesor estándar
};

/**
 * Calcula la huella de carbono incorporada de una lista de cantidades de materiales.
 */
export function calculateEmbodiedCarbon(quantities: MaterialQuantity[], buildingAreaM2: number): LCAResult {
  let totalKgCO2e = 0;
  const breakdown: Record<string, number> = {};

  for (const item of quantities) {
    const factorData = EMISSION_FACTORS[item.material];
    if (!factorData) {
      console.warn(`Material no encontrado en base de datos LCA: ${item.material}`);
      continue;
    }

    if (factorData.unit !== item.unit) {
      console.warn(`Unidad incorrecta para ${item.material}. Esperado: ${factorData.unit}, Recibido: ${item.unit}`);
      continue;
    }

    const emission = item.quantity * factorData.factor;
    totalKgCO2e += emission;
    breakdown[item.material] = emission;
  }

  return {
    totalKgCO2e: Math.round(totalKgCO2e * 100) / 100,
    kgCO2ePerM2: buildingAreaM2 > 0 ? Math.round((totalKgCO2e / buildingAreaM2) * 100) / 100 : 0,
    breakdown,
    methodology: "Estimación temprana basada en factores genéricos (ICE/Ecoinvent). Requiere validación con DAP específicas para etapa de detalle.",
  };
}

/**
 * Genera una estimación rápida para el modelo base "Caja 1:2" de ARKI (10x10x3m).
 */
export function estimateBaselineCarbon(): LCAResult {
  // Supuestos geométricos para una caja de 10x10m con altura de 3m (Área de piso = 100m2)
  // - Losa de concreto de 0.20m de espesor: 100m2 * 0.20m = 20 m3
  // - Muros de ladrillo de 0.15m de espesor, perímetro 40m, altura 3m, menos 20% de huecos: 
  //   (40 * 3 * 0.8) * 0.15 = 14.4 m3
  // - Ventanas de vidrio (20% de muro): (40 * 3 * 0.2) = 24 m2
  // - Acero de refuerzo estimado (aprox 80 kg/m3 de concreto): 20 m3 * 80 = 1600 kg
  
  const baselineQuantities: MaterialQuantity[] = [
    { material: "Concreto Estructural", quantity: 20, unit: "m3" },
    { material: "Ladrillo de Arcilla", quantity: 14.4, unit: "m3" },
    { material: "Vidrio Monolítico", quantity: 24, unit: "m2" },
    { material: "Acero de Refuerzo", quantity: 1600, unit: "kg" },
  ];

  return calculateEmbodiedCarbon(baselineQuantities, 100); // 100 m2 de área
}
