// ARKI — Parametric Families
// Entrega 1A — contrato paramétrico y entidades de familia.
// No reemplaza a DynamicBuildingFamily. La complementa.
//
// Reutiliza FamilyParameter de arkiDynamicFamilies.ts.
// No redeclarar tipos existentes. Cualquier divergencia requiere ADR.

import type { FamilyParameter } from "./arkiDynamicFamilies";

export type { FamilyParameter };

export type ImportSource = {
  format: "RFA" | "RVT" | "IFC" | "DWG" | "DXF" | "OBJ" | "STEP" | "GLB" | "CSV" | "MANUAL";
  fileName?: string;
  fileVersion?: string;
  importedAt?: string;
  checksum?: string;
};

export type Constraint = {
  id: string;
  description: string;
  parameterId: string;
  kind: "min" | "max" | "range" | "equals" | "formula";
  value?: number | string;
  formula?: string;
};

export type ReferencePlane = {
  id: string;
  name: string;
  axis: "x" | "y" | "z";
  positionM: number;
  isWeak: boolean;
};

// Material catalogado con identidad y costo.
// No confundir con MaterialCapa (union de strings en arkiConstructionOntology.ts)
// ni con CapaMuro.material (referencia a un material en una capa).
export type Material = {
  id: string;
  name: string;
  densityKgM3?: number;
  costPenPerUnit?: number;
  unit?: "m2" | "m3" | "kg" | "und" | "ml";
  finish?: string;
};

export type FamilyType = {
  id: string;
  name: string;
  parameters: Record<string, string | number | boolean>;
  description?: string;
};

export type QuantityRule = {
  id: string;
  target: string;
  unit: "m2" | "m3" | "kg" | "und" | "ml";
  formula: string;
  description?: string;
};

export type CostRule = {
  id: string;
  target: string;
  partidaCode: string;
  formula: string;
  description?: string;
};

export type ScheduleRule = {
  id: string;
  target: string;
  unit: "horas" | "dias";
  formula: string;
  description?: string;
};

export type QuantityResult = {
  target: string;
  unit: "m2" | "m3" | "kg" | "und" | "ml";
  value: number;
  formula: string;
};

export type CostResult = {
  partidaCode: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type ScheduleLink = {
  activityId: string;
  durationHours: number;
};

export type ArkiParametricFamily = {
  schema: "ARKI-PARAMETRIC-FAMILY-1.0";
  id: string;
  name: string;
  category: string;
  discipline:
    | "arquitectura"
    | "estructuras"
    | "sanitarias"
    | "electricas"
    | "mecanicas"
    | "comunicaciones"
    | "seguridad";
  typologies: string[];
  source?: ImportSource;
  geometry: {
    parameters: FamilyParameter[];
    constraints: Constraint[];
    referencePlanes: ReferencePlane[];
    host: "wall" | "floor" | "roof" | "face" | "level" | "none";
  };
  materials: Material[];
  types: FamilyType[];
  nestedFamilies: string[];
  quantityRules: QuantityRule[];
  costRules: CostRule[];
  scheduleRules: ScheduleRule[];
  classification: {
    revitCategory?: string;
    ifcClass?: string;
    uniformat?: string;
    omniclass?: string;
    customCodes: Record<string, string>;
  };
  lifecycle: {
    status: "draft" | "validated" | "approved" | "deprecated";
    version: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type FamilyInstance = {
  schema: "ARKI-FAMILY-INSTANCE-1.0";
  id: string;
  familyId: string;
  typeId: string;
  projectId: string;
  hostId?: string;
  elementRole:
    | "architectural"
    | "structural"
    | "mep"
    | "furniture"
    | "equipment";
  transform: {
    xM: number;
    yM: number;
    zM: number;
    rotationDeg: number;
  };
  parameters: Record<string, string | number | boolean>;
  materialOverrides?: Record<string, string>;
  quantity?: QuantityResult;
  cost?: CostResult;
  schedule?: ScheduleLink;
  sourceSnapshotId: string;
  version: number;
  status: "derived" | "overridden" | "stale";
};

export function createEmptyParametricFamily(input: {
  id: string;
  name: string;
  category: string;
  discipline: ArkiParametricFamily["discipline"];
  host: ArkiParametricFamily["geometry"]["host"];
}): ArkiParametricFamily {
  const now = new Date().toISOString();
  return {
    schema: "ARKI-PARAMETRIC-FAMILY-1.0",
    id: input.id,
    name: input.name,
    category: input.category,
    discipline: input.discipline,
    typologies: [],
    geometry: {
      parameters: [],
      constraints: [],
      referencePlanes: [],
      host: input.host,
    },
    materials: [],
    types: [],
    nestedFamilies: [],
    quantityRules: [],
    costRules: [],
    scheduleRules: [],
    classification: { customCodes: {} },
    lifecycle: {
      status: "draft",
      version: 1,
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function createEmptyFamilyInstance(input: {
  id: string;
  familyId: string;
  typeId: string;
  projectId: string;
  elementRole: FamilyInstance["elementRole"];
  sourceSnapshotId: string;
}): FamilyInstance {
  return {
    schema: "ARKI-FAMILY-INSTANCE-1.0",
    id: input.id,
    familyId: input.familyId,
    typeId: input.typeId,
    projectId: input.projectId,
    elementRole: input.elementRole,
    transform: { xM: 0, yM: 0, zM: 0, rotationDeg: 0 },
    parameters: {},
    sourceSnapshotId: input.sourceSnapshotId,
    version: 1,
    status: "derived",
  };
}
