export type ExplorationAxisType = 
  | "PARAMETRIC"  // Varía pisos, área, densidad
  | "TIPOLOGIC"   // Varía forma (patio, L, U, tira)
  | "EVOLUTIONARY"; // Cruza las mejores propuestas anteriores

export interface ExplorationAxis {
  type: ExplorationAxisType;
  // Parámetros fijos (no cambian)
  fixed: {
    areaM2: number;
    city: string;
    jurisdiction: string;
    familyId: string;
  };
  // Parámetros que varían (el eje)
  variable: {
    min: number;
    max: number;
    steps: number; // Cuántas propuestas generar (ej. 9)
    parameterName?: string; // "floors", "courtyardRatio", "shapeType"
  };
  // Restricciones duras (filtros)
  constraints: {
    maxCost?: number;
    minArea?: number;
    requiredNorms?: string[]; // ["RNE-A.050", "RNE-A.130"]
  };
  // Número de propuestas finales (el embudo)
  funnel: {
    initial: number; // 9
    finalFour: number; // 4
    finalOne: number; // 1
  };
}
