// ARKI — Recalculation
// Entrega 1C — recálculo determinista con snapshots inmutables.
// Maneja update-formwork y update-specification con UNSUPPORTED_CHANGE.
// Valida constraints. Presupuesto global = base + mamparas.

import type { FamilyInstance } from "./arkiParametricFamilies";
import type { ConstructionModel, ScheduleTask } from "./arkiConstructionOntology";
import type { ConstructionModelDTO } from "./arkiConstructionDTOs";
import {
  constructionModelToDTO,
  constructionModelFromDTO,
} from "./arkiConstructionDTOs";
import {
  MAMPARA_FAMILY_ID,
  MAMPARA_FAMILY,
  computeMamparaQuantities,
  computeMamparaCosts,
  computeMamparaSchedule,
  computeMamparaGeometry,
  instanceToMamparaParameters,
  type MamparaParameters,
  type MamparaQuantities,
  type MamparaCosts,
  type MamparaSchedule,
  type MamparaGeometry,
} from "./arkiMamparaFamily";
import type { PriceBook } from "./arkiPriceBook";

// ---------------------------------------------------------------------------
// ProjectChange: cambios soportados y no soportados.
// ---------------------------------------------------------------------------
export type ProjectChange =
  | {
      kind: "update-instance-parameter";
      instanceId: string;
      parameterId: string;
      value: number | string | boolean;
    }
  | {
      kind: "update-formwork";
      formworkId: string;
      field: "system" | "estimatedDays" | "reuseCycles";
      value: string | number;
    }
  | {
      kind: "update-specification";
      specificationCode: string;
      field: "title" | "description";
      value: string;
    };

export type RuleSet = {
  priceBookId: string;
  priceBookVersion: number;
  formworkRulesVersion: number;
};

export type ProvenanceRecord = {
  entityId: string;
  entityKind: "familyInstance" | "formwork" | "specification" | "budget" | "schedule";
  action: "created" | "updated" | "invalidated" | "recalculated";
  cause: string;
  sourceSnapshotId: string;
  timestamp: string;
};

export type ProjectSnapshot = {
  schema: "ARKI-PROJECT-SNAPSHOT-1.0";
  id: string;
  version: number;
  sourceVersion: number;
  familyInstances: FamilyInstance[];
  constructionModel: ConstructionModelDTO;
  mamparaQuantities: Record<string, MamparaQuantities>;
  mamparaCosts: Record<string, MamparaCosts>;
  mamparaSchedule: Record<string, MamparaSchedule>;
  mamparaGeometry: Record<string, MamparaGeometry>;
  budget: {
    currency: "PEN";
    basePen: number;
    mamparasPen: number;
    totalPen: number;
    priceBookId: string;
    priceBookVersion: number;
  };
  schedule: ScheduleTask[];
  invalidations: string[];
  provenance: ProvenanceRecord[];
  generatedAt: string;
};

// Determinismo: hash estable. Sin Math.random ni Date.now.
export function stableHash(input: unknown): string {
  const json = JSON.stringify(input);
  let hash = 2166136261;
  for (let i = 0; i < json.length; i += 1) {
    hash = Math.imul(hash ^ json.charCodeAt(i), 16777619);
  }
  return `ARKI-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function applyInstanceChange(
  instance: FamilyInstance,
  parameterId: string,
  value: number | string | boolean,
): FamilyInstance {
  if (!(parameterId in instance.parameters)) {
    throw new Error(`PARAMETER_NOT_FOUND: instance=${instance.id} parameter=${parameterId}`);
  }
  const updated: FamilyInstance = {
    ...instance,
    parameters: { ...instance.parameters, [parameterId]: value },
    version: instance.version + 1,
    status: "overridden",
  };
  // Validación de constraints al reconstruir parámetros.
  instanceToMamparaParameters(updated);
  return updated;
}

function recalculateMampara(instance: FamilyInstance): {
  quantities: MamparaQuantities;
  costs: MamparaCosts;
  schedule: MamparaSchedule;
  geometry: MamparaGeometry;
} {
  if (instance.familyId !== MAMPARA_FAMILY_ID) {
    throw new Error(`UNSUPPORTED_FAMILY: ${instance.familyId}`);
  }
  const p: MamparaParameters = instanceToMamparaParameters(instance);
  const quantities = computeMamparaQuantities(p);
  const costs = computeMamparaCosts(p, quantities);
  const schedule = computeMamparaSchedule(quantities);
  const geometry = computeMamparaGeometry(p, instance.transform, instance.hostId);
  return { quantities, costs, schedule, geometry };
}

export function recalculateProject(input: {
  source: ProjectSnapshot;
  changes: ProjectChange[];
  rules: RuleSet;
  priceBook: PriceBook;
}): ProjectSnapshot {
  const invalidations: string[] = [];
  const provenance: ProvenanceRecord[] = [];
  const now = input.source.generatedAt;

  let instances: FamilyInstance[] = input.source.familyInstances.map((i) => ({
    ...i,
    parameters: { ...i.parameters },
  }));

  for (const change of input.changes) {
    if (change.kind === "update-instance-parameter") {
      const idx = instances.findIndex((i) => i.id === change.instanceId);
      if (idx < 0) throw new Error(`INSTANCE_NOT_FOUND: ${change.instanceId}`);
      instances[idx] = applyInstanceChange(instances[idx], change.parameterId, change.value);
      invalidations.push(`familyInstance:${change.instanceId}.parameters.${change.parameterId}`);
      provenance.push({
        entityId: change.instanceId,
        entityKind: "familyInstance",
        action: "updated",
        cause: `update-instance-parameter ${change.parameterId}=${change.value}`,
        sourceSnapshotId: input.source.id,
        timestamp: now,
      });
    } else if (change.kind === "update-formwork") {
      throw new Error(
        `UNSUPPORTED_CHANGE: update-formwork not implemented in 1C (formworkId=${change.formworkId})`,
      );
    } else if (change.kind === "update-specification") {
      throw new Error(
        `UNSUPPORTED_CHANGE: update-specification not implemented in 1C (specificationCode=${change.specificationCode})`,
      );
    }
  }

  const mamparaQuantities: Record<string, MamparaQuantities> = { ...input.source.mamparaQuantities };
  const mamparaCosts: Record<string, MamparaCosts> = { ...input.source.mamparaCosts };
  const mamparaSchedule: Record<string, MamparaSchedule> = { ...input.source.mamparaSchedule };
  const mamparaGeometry: Record<string, MamparaGeometry> = { ...input.source.mamparaGeometry };

  for (const instance of instances) {
    if (instance.familyId !== MAMPARA_FAMILY_ID) continue;
    const { quantities, costs, schedule, geometry } = recalculateMampara(instance);
    mamparaQuantities[instance.id] = quantities;
    mamparaCosts[instance.id] = costs;
    mamparaSchedule[instance.id] = schedule;
    mamparaGeometry[instance.id] = geometry;
  }

  // Presupuesto global = base del modelo + mamparas.
  const basePen = input.source.budget.basePen;
  const mamparasPen = Number(
    Object.values(mamparaCosts).reduce((sum, c) => sum + c.total_pen, 0).toFixed(2),
  );
  const totalPen = Number((basePen + mamparasPen).toFixed(2));

  const budget = {
    currency: "PEN" as const,
    basePen,
    mamparasPen,
    totalPen,
    priceBookId: input.rules.priceBookId,
    priceBookVersion: input.rules.priceBookVersion,
  };

  // Recalcular cronograma: task-mamparas incluye duración agregada.
  const schedule: ScheduleTask[] = input.source.schedule.map((task) => {
    if (task.id === "task-mamparas") {
      const duracion = Object.values(mamparaSchedule).reduce((sum, s) => sum + s.duracion_horas, 0);
      const duracionDias = Number((duracion / 8).toFixed(2));
      return { ...task, duracion_dias: duracionDias };
    }
    return task;
  });

  if (totalPen !== input.source.budget.totalPen) invalidations.push("budget.totalPen");
  if (JSON.stringify(schedule) !== JSON.stringify(input.source.schedule)) invalidations.push("schedule");
  if (JSON.stringify(mamparaGeometry) !== JSON.stringify(input.source.mamparaGeometry)) {
    invalidations.push("mamparaGeometry");
  }

  return {
    schema: "ARKI-PROJECT-SNAPSHOT-1.0",
    id: stableHash({
      sourceId: input.source.id,
      changes: input.changes,
      rules: input.rules,
      priceBookId: input.priceBook.id,
    }),
    version: input.source.version + 1,
    sourceVersion: input.source.version,
    familyInstances: instances,
    constructionModel: input.source.constructionModel,
    mamparaQuantities,
    mamparaCosts,
    mamparaSchedule,
    mamparaGeometry,
    budget,
    schedule,
    invalidations,
    provenance,
    generatedAt: now,
  };
}

export function createInitialSnapshot(input: {
  model: ConstructionModel;
  instances: FamilyInstance[];
  priceBook: PriceBook;
  formworkRulesVersion: number;
}): ProjectSnapshot {
  const mamparaQuantities: Record<string, MamparaQuantities> = {};
  const mamparaCosts: Record<string, MamparaCosts> = {};
  const mamparaSchedule: Record<string, MamparaSchedule> = {};
  const mamparaGeometry: Record<string, MamparaGeometry> = {};

  for (const instance of input.instances) {
    if (instance.familyId !== MAMPARA_FAMILY_ID) continue;
    const { quantities, costs, schedule, geometry } = recalculateMampara(instance);
    mamparaQuantities[instance.id] = quantities;
    mamparaCosts[instance.id] = costs;
    mamparaSchedule[instance.id] = schedule;
    mamparaGeometry[instance.id] = geometry;
  }

  const mamparasPen = Number(
    Object.values(mamparaCosts).reduce((sum, c) => sum + c.total_pen, 0).toFixed(2),
  );
  const basePen = input.model.summary.totalBudgetPen;
  const totalPen = Number((basePen + mamparasPen).toFixed(2));

  return {
    schema: "ARKI-PROJECT-SNAPSHOT-1.0",
    id: stableHash({ modelId: input.model.projectId, initial: true }),
    version: 1,
    sourceVersion: 0,
    familyInstances: input.instances,
    constructionModel: constructionModelToDTO(input.model),
    mamparaQuantities,
    mamparaCosts,
    mamparaSchedule,
    mamparaGeometry,
    budget: {
      currency: "PEN",
      basePen,
      mamparasPen,
      totalPen,
      priceBookId: input.priceBook.id,
      priceBookVersion: input.priceBook.version,
    },
    schedule: input.model.schedule.concat([
      {
        id: "task-mamparas",
        codigo: "MAM-01",
        nombre: "Montaje de mamparas",
        fase: "acabados",
        duracion_dias: 0,
        inicio_dia: 0,
        fin_dia: 0,
        predecessors: [],
        elementIds: [],
        costo_pen: mamparasPen,
      },
    ]),
    invalidations: [],
    provenance: [],
    generatedAt: "2026-09-22T00:00:00.000Z",
  };
}

export function snapshotToConstructionModel(snapshot: ProjectSnapshot): ConstructionModel {
  return constructionModelFromDTO(snapshot.constructionModel);
}

export function getMamparaFamily() {
  return MAMPARA_FAMILY;
}
