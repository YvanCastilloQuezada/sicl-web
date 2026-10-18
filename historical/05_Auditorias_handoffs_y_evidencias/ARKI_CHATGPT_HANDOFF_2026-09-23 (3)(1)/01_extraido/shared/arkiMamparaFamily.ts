// ARKI — Mampara Family
// Entrega 1C — familia paramétrica demostrativa.
// Mampara de aluminio y vidrio templado.
// Primera ArkiParametricFamily concreta. No toca DynamicBuildingFamily.
// Sin typo espesor_vidio_mm. Validación de constraints exportada.

import type {
  ArkiParametricFamily,
  FamilyInstance,
  FamilyParameter,
  Material,
  QuantityRule,
  CostRule,
  ScheduleRule,
  Constraint,
  ReferencePlane,
  FamilyType,
} from "./arkiParametricFamilies";

export const MAMPARA_FAMILY_ID = "FAM-MAMPARA-ALUMINIO-VIDRIO";

export const MAMPARA_PARAMETERS: FamilyParameter[] = [
  { id: "ancho_m", label: "Ancho", type: "number", unit: "m", defaultValue: 1.2, min: 0.6, max: 3.0 },
  { id: "alto_m", label: "Alto", type: "number", unit: "m", defaultValue: 2.4, min: 1.8, max: 3.0 },
  { id: "espesor_vidrio_mm", label: "Espesor de vidrio", type: "number", unit: "mm", defaultValue: 6, min: 4, max: 12 },
  { id: "tipo_perfil", label: "Tipo de perfil", type: "string", defaultValue: "natural" },
  { id: "numero_hojas", label: "Número de hojas", type: "number", defaultValue: 2, min: 1, max: 4 },
];

export const MAMPARA_CONSTRAINTS: Constraint[] = [
  { id: "c-ancho-min", description: "Ancho mínimo según fabricación", parameterId: "ancho_m", kind: "min", value: 0.6 },
  { id: "c-ancho-max", description: "Ancho máximo por hoja individual", parameterId: "ancho_m", kind: "max", value: 3.0 },
  { id: "c-alto-min", description: "Alto mínimo", parameterId: "alto_m", kind: "min", value: 1.8 },
  { id: "c-alto-max", description: "Alto máximo", parameterId: "alto_m", kind: "max", value: 3.0 },
  { id: "c-espesor-min", description: "Espesor mínimo de vidrio", parameterId: "espesor_vidrio_mm", kind: "min", value: 4 },
  { id: "c-espesor-max", description: "Espesor máximo de vidrio", parameterId: "espesor_vidrio_mm", kind: "max", value: 12 },
  { id: "c-hojas-min", description: "Hojas mínimas", parameterId: "numero_hojas", kind: "min", value: 1 },
  { id: "c-hojas-max", description: "Hojas máximas", parameterId: "numero_hojas", kind: "max", value: 4 },
];

export const MAMPARA_REFERENCE_PLANES: ReferencePlane[] = [
  { id: "rp-izq", name: "Plano izquierdo", axis: "x", positionM: 0, isWeak: false },
  { id: "rp-der", name: "Plano derecho", axis: "x", positionM: 1.2, isWeak: true },
  { id: "rp-base", name: "Plano base", axis: "z", positionM: 0, isWeak: false },
  { id: "rp-tope", name: "Plano superior", axis: "z", positionM: 2.4, isWeak: true },
];

export const MAMPARA_MATERIALS: Material[] = [
  { id: "mat-vidrio-templado", name: "Vidrio templado", densityKgM3: 2500, costPenPerUnit: 180, unit: "m2", finish: "transparente" },
  { id: "mat-aluminio-natural", name: "Aluminio natural", densityKgM3: 2700, costPenPerUnit: 45, unit: "ml", finish: "natural" },
  { id: "mat-silicona-estructural", name: "Silicona estructural", costPenPerUnit: 35, unit: "ml", finish: "gris" },
];

export const MAMPARA_QUANTITY_RULES: QuantityRule[] = [
  { id: "q-area-vidrio", target: "area_vidrio_m2", unit: "m2", formula: "ancho_m * alto_m * numero_hojas", description: "Área total de vidrio" },
  { id: "q-long-perfiles", target: "longitud_perfiles_m", unit: "ml", formula: "(2 * alto_m + 2 * ancho_m) * numero_hojas + 2 * ancho_m + 2 * alto_m", description: "Longitud total de perfiles" },
  { id: "q-herrajes", target: "herrajes_und", unit: "und", formula: "numero_hojas * 3", description: "Herrajes por hoja" },
  { id: "q-peso", target: "peso_kg", unit: "kg", formula: "area_vidrio_m2 * (espesor_vidrio_mm / 1000) * 2500 + longitud_perfiles_m * 0.002 * 2700", description: "Peso total estimado" },
];

export const MAMPARA_COST_RULES: CostRule[] = [
  { id: "c-partida-AL01", target: "partida_AL-01", partidaCode: "AL-01", formula: "area_vidrio_m2 * 180", description: "Vidrio templado" },
  { id: "c-partida-AL02", target: "partida_AL-02", partidaCode: "AL-02", formula: "longitud_perfiles_m * 45", description: "Perfilería de aluminio" },
  { id: "c-partida-AL03", target: "partida_AL-03", partidaCode: "AL-03", formula: "herrajes_und * 12", description: "Herrajes y accesorios" },
];

export const MAMPARA_SCHEDULE_RULES: ScheduleRule[] = [
  { id: "s-montaje", target: "duracion_horas", unit: "horas", formula: "area_vidrio_m2 * 0.8 + longitud_perfiles_m * 0.2", description: "Duración de montaje" },
];

export const MAMPARA_TYPES: FamilyType[] = [
  { id: "tipo-2hojas", name: "Mampara 2 hojas", parameters: { numero_hojas: 2, ancho_m: 1.6, alto_m: 2.4, espesor_vidrio_mm: 6, tipo_perfil: "natural" } },
  { id: "tipo-3hojas", name: "Mampara 3 hojas", parameters: { numero_hojas: 3, ancho_m: 2.4, alto_m: 2.4, espesor_vidrio_mm: 8, tipo_perfil: "anodizado" } },
];

export const MAMPARA_FAMILY: ArkiParametricFamily = {
  schema: "ARKI-PARAMETRIC-FAMILY-1.0",
  id: MAMPARA_FAMILY_ID,
  name: "Mampara de aluminio y vidrio",
  category: "Mampara",
  discipline: "arquitectura",
  typologies: ["oficina", "salud", "comercio", "educacion"],
  geometry: {
    parameters: MAMPARA_PARAMETERS,
    constraints: MAMPARA_CONSTRAINTS,
    referencePlanes: MAMPARA_REFERENCE_PLANES,
    host: "wall",
  },
  materials: MAMPARA_MATERIALS,
  types: MAMPARA_TYPES,
  nestedFamilies: [],
  quantityRules: MAMPARA_QUANTITY_RULES,
  costRules: MAMPARA_COST_RULES,
  scheduleRules: MAMPARA_SCHEDULE_RULES,
  classification: {
    revitCategory: "Muros cortina",
    ifcClass: "IfcCurtainWall",
    customCodes: { ARKI: "MAMPARA-AL-VID" },
  },
  lifecycle: {
    status: "validated",
    version: 1,
    createdAt: "2026-09-22",
    updatedAt: "2026-09-22",
  },
};

export type MamparaParameters = {
  ancho_m: number;
  alto_m: number;
  espesor_vidrio_mm: number;
  tipo_perfil: string;
  numero_hojas: number;
};

export type MamparaQuantities = {
  area_vidrio_m2: number;
  longitud_perfiles_m: number;
  herrajes_und: number;
  peso_kg: number;
};

export type MamparaCosts = {
  partida_AL_01: number;
  partida_AL_02: number;
  partida_AL_03: number;
  total_pen: number;
};

export type MamparaSchedule = {
  duracion_horas: number;
};

export type ConstraintViolation = {
  code: "CONSTRAINT_VIOLATION";
  parameterId: string;
  value: number | string | boolean;
  constraintId: string;
  constraintKind: Constraint["kind"];
  allowedRange: string;
  message: string;
};

// Validación determinista contra constraints de la familia.
export function validateMamparaConstraints(
  parameters: MamparaParameters,
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];
  const byParam = new Map<string, Constraint[]>();
  for (const c of MAMPARA_CONSTRAINTS) {
    const list = byParam.get(c.parameterId) ?? [];
    list.push(c);
    byParam.set(c.parameterId, list);
  }

  const ranges = new Map<string, { min?: number; max?: number }>();
  for (const [paramId, constraints] of Array.from(byParam.entries())) {
    let min: number | undefined;
    let max: number | undefined;
    for (const c of constraints) {
      if (c.kind === "min" && typeof c.value === "number") min = c.value;
      if (c.kind === "max" && typeof c.value === "number") max = c.value;
    }
    ranges.set(paramId, { min, max });
  }

  const numericParams: Array<keyof MamparaParameters> = [
    "ancho_m",
    "alto_m",
    "espesor_vidrio_mm",
    "numero_hojas",
  ];

  for (const paramId of numericParams) {
    const value = parameters[paramId];
    if (typeof value !== "number") continue;
    const range = ranges.get(paramId);
    if (!range) continue;
    if (range.min !== undefined && value < range.min) {
      const c = byParam.get(paramId)!.find((x) => x.kind === "min")!;
      violations.push({
        code: "CONSTRAINT_VIOLATION",
        parameterId: paramId,
        value,
        constraintId: c.id,
        constraintKind: "min",
        allowedRange: `${range.min}..${range.max ?? "∞"}`,
        message: `CONSTRAINT_VIOLATION: parameter=${paramId} value=${value} allowedRange=${range.min}..${range.max ?? "∞"}`,
      });
    }
    if (range.max !== undefined && value > range.max) {
      const c = byParam.get(paramId)!.find((x) => x.kind === "max")!;
      violations.push({
        code: "CONSTRAINT_VIOLATION",
        parameterId: paramId,
        value,
        constraintId: c.id,
        constraintKind: "max",
        allowedRange: `${range.min ?? "-∞"}..${range.max}`,
        message: `CONSTRAINT_VIOLATION: parameter=${paramId} value=${value} allowedRange=${range.min ?? "-∞"}..${range.max}`,
      });
    }
  }

  return violations;
}

// Evaluación determinista. Sin eval(), sin dependencias dinámicas.
export function computeMamparaQuantities(p: MamparaParameters): MamparaQuantities {
  const area_vidrio_m2 = p.ancho_m * p.alto_m * p.numero_hojas;
  const longitud_perfiles_m =
    (2 * p.alto_m + 2 * p.ancho_m) * p.numero_hojas + 2 * p.ancho_m + 2 * p.alto_m;
  const herrajes_und = p.numero_hojas * 3;
  const peso_kg =
    area_vidrio_m2 * (p.espesor_vidrio_mm / 1000) * 2500 +
    longitud_perfiles_m * 0.002 * 2700;
  return {
    area_vidrio_m2: Number(area_vidrio_m2.toFixed(4)),
    longitud_perfiles_m: Number(longitud_perfiles_m.toFixed(4)),
    herrajes_und,
    peso_kg: Number(peso_kg.toFixed(2)),
  };
}

export function computeMamparaCosts(p: MamparaParameters, q: MamparaQuantities): MamparaCosts {
  const partida_AL_01 = Number((q.area_vidrio_m2 * 180).toFixed(2));
  const partida_AL_02 = Number((q.longitud_perfiles_m * 45).toFixed(2));
  const partida_AL_03 = Number((q.herrajes_und * 12).toFixed(2));
  const total_pen = Number((partida_AL_01 + partida_AL_02 + partida_AL_03).toFixed(2));
  return { partida_AL_01, partida_AL_02, partida_AL_03, total_pen };
}

export function computeMamparaSchedule(q: MamparaQuantities): MamparaSchedule {
  return { duracion_horas: Number((q.area_vidrio_m2 * 0.8 + q.longitud_perfiles_m * 0.2).toFixed(2)) };
}

// Geometría 2D/3D derivada de parámetros. Consumible por IFC y visor futuro.
export type MamparaGeometry = {
  widthM: number;
  heightM: number;
  depthM: number;
  glassAreaM2: number;
  panelCount: number;
  positionM: { x: number; y: number; z: number };
  rotationDeg: number;
  hostId?: string;
};

export function computeMamparaGeometry(
  p: MamparaParameters,
  transform: { xM: number; yM: number; zM: number; rotationDeg: number },
  hostId?: string,
): MamparaGeometry {
  const depthM = p.espesor_vidrio_mm / 1000 + 0.1;
  return {
    widthM: p.ancho_m,
    heightM: p.alto_m,
    depthM: Number(depthM.toFixed(4)),
    glassAreaM2: Number((p.ancho_m * p.alto_m * p.numero_hojas).toFixed(4)),
    panelCount: p.numero_hojas,
    positionM: { x: transform.xM, y: transform.yM, z: transform.zM },
    rotationDeg: transform.rotationDeg,
    hostId,
  };
}

export function createMamparaInstance(input: {
  id: string;
  projectId: string;
  sourceSnapshotId: string;
  parameters: MamparaParameters;
  hostId?: string;
}): FamilyInstance {
  const violations = validateMamparaConstraints(input.parameters);
  if (violations.length > 0) {
    throw new Error(violations[0].message);
  }
  return {
    schema: "ARKI-FAMILY-INSTANCE-1.0",
    id: input.id,
    familyId: MAMPARA_FAMILY_ID,
    typeId: "tipo-2hojas",
    projectId: input.projectId,
    hostId: input.hostId,
    elementRole: "architectural",
    transform: { xM: 0, yM: 0, zM: 0, rotationDeg: 0 },
    parameters: {
      ancho_m: input.parameters.ancho_m,
      alto_m: input.parameters.alto_m,
      espesor_vidrio_mm: input.parameters.espesor_vidrio_mm,
      tipo_perfil: input.parameters.tipo_perfil,
      numero_hojas: input.parameters.numero_hojas,
    },
    sourceSnapshotId: input.sourceSnapshotId,
    version: 1,
    status: "derived",
  };
}

// Conversión de FamilyInstance a MamparaParameters con validación.
export function instanceToMamparaParameters(instance: FamilyInstance): MamparaParameters {
  const p: MamparaParameters = {
    ancho_m: Number(instance.parameters.ancho_m),
    alto_m: Number(instance.parameters.alto_m),
    espesor_vidrio_mm: Number(instance.parameters.espesor_vidrio_mm),
    tipo_perfil: String(instance.parameters.tipo_perfil),
    numero_hojas: Number(instance.parameters.numero_hojas),
  };
  const violations = validateMamparaConstraints(p);
  if (violations.length > 0) {
    throw new Error(violations[0].message);
  }
  return p;
}
