// ARKI — test-recalculation
// Entrega 1C — cadena completa de la mampara.
// Verifica propagación, invalidaciones, provenance, determinismo,
// constraints, UNSUPPORTED_CHANGE, IFC diferente y Markdown diferente.

import { generateDynamicBuilding } from "../shared/arkiDynamicFamilies";
import { APU_DATABASE } from "../shared/arkiConstructionOntology";
import { fromApuDatabase } from "../shared/arkiPriceBook";
import {
  MAMPARA_FAMILY_ID,
  createMamparaInstance,
  validateMamparaConstraints,
  type MamparaParameters,
} from "../shared/arkiMamparaFamily";
import {
  createInitialSnapshot,
  recalculateProject,
  stableHash,
  type ProjectChange,
  type RuleSet,
} from "../shared/arkiRecalculation";
import {
  exportSnapshotToIfc,
  exportSnapshotToMarkdown,
} from "../shared/arkiSnapshotExports";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(`ASSERTION_FAILED: ${message}`);
}

function expectError(fn: () => void, contains: string): void {
  let raised = false;
  try {
    fn();
  } catch (e) {
    raised = true;
    const message = String((e as Error).message);
    if (!message.includes(contains)) {
      throw new Error(`EXPECTED_ERROR_CONTAINING: ${contains} GOT: ${message}`);
    }
  }
  if (!raised) throw new Error(`EXPECTED_ERROR_NOT_RAISED: ${contains}`);
}

const building = generateDynamicBuilding({
  familyId: "FAM-HEALTH",
  variantId: "GENERAL",
  context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
  parameters: { areaM2: 20000, capacity: 400, floors: 4 },
});
assert(building.constructionModel, "constructionModel presente");
const model = building.constructionModel!;

const priceBook = fromApuDatabase(APU_DATABASE, {
  id: "PB-1C",
  version: 1,
  region: "La Libertad",
  country: "PE",
  currency: "PEN",
  validFrom: "2026-09-22",
});

const rules: RuleSet = {
  priceBookId: priceBook.id,
  priceBookVersion: priceBook.version,
  formworkRulesVersion: 1,
};

const initialParams: MamparaParameters = {
  ancho_m: 1.2,
  alto_m: 2.4,
  espesor_vidrio_mm: 6,
  tipo_perfil: "natural",
  numero_hojas: 2,
};

const instance = createMamparaInstance({
  id: "mampara-01",
  projectId: model.projectId,
  sourceSnapshotId: "snapshot:initial",
  parameters: initialParams,
});
assert(instance.familyId === MAMPARA_FAMILY_ID, "familia correcta");

const snapshot0 = createInitialSnapshot({
  model,
  instances: [instance],
  priceBook,
  formworkRulesVersion: 1,
});
assert(snapshot0.version === 1, "snapshot inicial v1");

const q0 = snapshot0.mamparaQuantities["mampara-01"];
const c0 = snapshot0.mamparaCosts["mampara-01"];
const s0 = snapshot0.mamparaSchedule["mampara-01"];
const g0 = snapshot0.mamparaGeometry["mampara-01"];
assert(q0, "cantidades iniciales presentes");
assert(c0, "costos iniciales presentes");
assert(s0, "cronograma inicial presente");
assert(g0, "geometría inicial presente");

// Presupuesto base = modelo + mamparas
assert(snapshot0.budget.basePen === model.summary.totalBudgetPen, "basePen = modelo");
assert(snapshot0.budget.mamparasPen === c0.total_pen, "mamparasPen = costo mampara");
assert(
  snapshot0.budget.totalPen === snapshot0.budget.basePen + snapshot0.budget.mamparasPen,
  "totalPen = base + mamparas",
);

// IFC y Markdown iniciales
const ifc0 = exportSnapshotToIfc(snapshot0);
const md0 = exportSnapshotToMarkdown(snapshot0);
assert(ifc0.content.includes("IFCBUILDINGELEMENTPROXY"), "IFC inicial contiene IFCBUILDINGELEMENTPROXY");
assert(ifc0.content.includes("IFCPROPERTYSET"), "IFC inicial contiene IFCPROPERTYSET");
assert(md0.content.includes("mampara-01"), "Markdown inicial menciona la mampara");

// --- Cambio 1: ancho 1.2 → 1.5 ---
const change1: ProjectChange = {
  kind: "update-instance-parameter",
  instanceId: "mampara-01",
  parameterId: "ancho_m",
  value: 1.5,
};

const snapshot1 = recalculateProject({
  source: snapshot0,
  changes: [change1],
  rules,
  priceBook,
});

assert(snapshot1.version === 2, "snapshot1 version 2");
assert(
  snapshot1.invalidations.some((s) => s.includes("ancho_m")),
  "invalidaciones mencionan ancho_m",
);
assert(
  snapshot1.provenance.some((p) => p.entityId === "mampara-01" && p.action === "updated"),
  "provenance registra la actualización",
);

const q1 = snapshot1.mamparaQuantities["mampara-01"];
const c1 = snapshot1.mamparaCosts["mampara-01"];
const s1 = snapshot1.mamparaSchedule["mampara-01"];
const g1 = snapshot1.mamparaGeometry["mampara-01"];

assert(q1.area_vidrio_m2 > q0.area_vidrio_m2, "área de vidrio aumentó");
assert(q1.longitud_perfiles_m > q0.longitud_perfiles_m, "perfiles aumentaron");
assert(q1.peso_kg > q0.peso_kg, "peso aumentó");
assert(c1.partida_AL_01 > c0.partida_AL_01, "partida AL-01 aumentó");
assert(c1.partida_AL_02 > c0.partida_AL_02, "partida AL-02 aumentó");
assert(c1.partida_AL_03 === c0.partida_AL_03, "partida AL-03 igual");
assert(c1.total_pen > c0.total_pen, "costo total aumentó");
assert(s1.duracion_horas !== s0.duracion_horas, "duración cambió");
assert(g1.widthM !== g0.widthM, "geometría widthM cambió");
assert(g1.widthM === 1.5, "geometría widthM = 1.5");

// Presupuesto global refleja el cambio
assert(snapshot1.budget.mamparasPen === c1.total_pen, "mamparasPen actualizado");
assert(
  snapshot1.budget.totalPen === snapshot1.budget.basePen + snapshot1.budget.mamparasPen,
  "totalPen actualizado = base + mamparas",
);
assert(snapshot1.budget.totalPen !== snapshot0.budget.totalPen, "total global cambió");

// 4D cambió
const t0 = snapshot0.schedule.find((t) => t.id === "task-mamparas")!;
const t1 = snapshot1.schedule.find((t) => t.id === "task-mamparas")!;
assert(t0.duracion_dias !== t1.duracion_dias, "duración 4D cambió");

// IFC cambió
const ifc1 = exportSnapshotToIfc(snapshot1);
assert(ifc0.content !== ifc1.content, "IFC cambió tras ancho");
assert(ifc1.content.includes("IFCBUILDINGELEMENTPROXY"), "IFC 1 contiene IFCBUILDINGELEMENTPROXY");
// El ancho 1.5 debe aparecer en el IFC de snapshot1
assert(ifc1.content.includes("1.5"), "IFC 1 contiene valor 1.5");

// Markdown cambió
const md1 = exportSnapshotToMarkdown(snapshot1);
assert(md0.content !== md1.content, "Markdown cambió tras ancho");
assert(md1.content.includes("1.5"), "Markdown 1 contiene 1.5");

// --- Cambio 2: alto 2.4 → 2.7 ---
const change2: ProjectChange = {
  kind: "update-instance-parameter",
  instanceId: "mampara-01",
  parameterId: "alto_m",
  value: 2.7,
};

const snapshot2 = recalculateProject({
  source: snapshot1,
  changes: [change2],
  rules,
  priceBook,
});

assert(snapshot2.version === 3, "snapshot2 version 3");
const q2 = snapshot2.mamparaQuantities["mampara-01"];
const c2 = snapshot2.mamparaCosts["mampara-01"];
const g2 = snapshot2.mamparaGeometry["mampara-01"];
assert(q2.area_vidrio_m2 > q1.area_vidrio_m2, "área vidrio aumentó tras alto");
assert(c2.total_pen > c1.total_pen, "costo aumentó tras alto");
assert(g2.heightM === 2.7, "geometría heightM = 2.7");

const ifc2 = exportSnapshotToIfc(snapshot2);
const md2 = exportSnapshotToMarkdown(snapshot2);
assert(ifc1.content !== ifc2.content, "IFC cambió tras alto");
assert(md1.content !== md2.content, "Markdown cambió tras alto");

// --- Determinismo ---
const snapshot1b = recalculateProject({
  source: snapshot0,
  changes: [change1],
  rules,
  priceBook,
});
const hashA = stableHash({
  invalidations: snapshot1.invalidations,
  budget: snapshot1.budget,
  quantities: snapshot1.mamparaQuantities,
  geometry: snapshot1.mamparaGeometry,
  schedule: snapshot1.schedule,
});
const hashB = stableHash({
  invalidations: snapshot1b.invalidations,
  budget: snapshot1b.budget,
  quantities: snapshot1b.mamparaQuantities,
  geometry: snapshot1b.mamparaGeometry,
  schedule: snapshot1b.schedule,
});
assert(hashA === hashB, "recalculateProject es determinista");

// --- Constraints ---
expectError(
  () =>
    recalculateProject({
      source: snapshot0,
      changes: [
        {
          kind: "update-instance-parameter",
          instanceId: "mampara-01",
          parameterId: "ancho_m",
          value: 10,
        },
      ],
      rules,
      priceBook,
    }),
  "CONSTRAINT_VIOLATION",
);

expectError(
  () =>
    recalculateProject({
      source: snapshot0,
      changes: [
        {
          kind: "update-instance-parameter",
          instanceId: "mampara-01",
          parameterId: "alto_m",
          value: 0.5,
        },
      ],
      rules,
      priceBook,
    }),
  "CONSTRAINT_VIOLATION",
);

const directViolations = validateMamparaConstraints({
  ancho_m: 10,
  alto_m: 2.4,
  espesor_vidrio_mm: 6,
  tipo_perfil: "natural",
  numero_hojas: 2,
});
assert(directViolations.length > 0, "validateMamparaConstraints detecta violación directa");
assert(directViolations[0].code === "CONSTRAINT_VIOLATION", "código correcto");

// --- UNSUPPORTED_CHANGE ---
expectError(
  () =>
    recalculateProject({
      source: snapshot0,
      changes: [
        {
          kind: "update-formwork",
          formworkId: "fw-001",
          field: "estimatedDays",
          value: 5,
        },
      ],
      rules,
      priceBook,
    }),
  "UNSUPPORTED_CHANGE",
);

expectError(
  () =>
    recalculateProject({
      source: snapshot0,
      changes: [
        {
          kind: "update-specification",
          specificationCode: "ET-EST-001",
          field: "title",
          value: "Nuevo título",
        },
      ],
      rules,
      priceBook,
    }),
  "UNSUPPORTED_CHANGE",
);

// --- Invalidaciones y provenance ---
assert(snapshot1.invalidations.length > 0, "invalidaciones no vacías");
assert(snapshot1.provenance.length > 0, "provenance no vacío");
assert(
  snapshot1.provenance.every((p) => p.sourceSnapshotId === snapshot0.id),
  "provenance referencia el snapshot fuente",
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      snapshot0: {
        version: snapshot0.version,
        areaVidrio: q0.area_vidrio_m2,
        costo: c0.total_pen,
        duracionHoras: s0.duracion_horas,
        widthM: g0.widthM,
        budget: snapshot0.budget,
      },
      snapshot1: {
        version: snapshot1.version,
        areaVidrio: q1.area_vidrio_m2,
        costo: c1.total_pen,
        duracionHoras: s1.duracion_horas,
        widthM: g1.widthM,
        budget: snapshot1.budget,
        invalidations: snapshot1.invalidations,
      },
      snapshot2: {
        version: snapshot2.version,
        areaVidrio: q2.area_vidrio_m2,
        costo: c2.total_pen,
        heightM: g2.heightM,
      },
      ifc: {
        length0: ifc0.content.length,
        length1: ifc1.content.length,
        length2: ifc2.content.length,
        changed: ifc0.content !== ifc1.content && ifc1.content !== ifc2.content,
      },
      markdown: {
        length0: md0.content.length,
        length1: md1.content.length,
        length2: md2.content.length,
        changed: md0.content !== md1.content && md1.content !== md2.content,
      },
      determinism: hashA === hashB ? "PASS" : "FAIL",
      checks: [
        "ancho cambia área de vidrio",
        "ancho cambia perfiles",
        "ancho cambia peso",
        "ancho cambia partida AL-01",
        "ancho cambia partida AL-02",
        "ancho no cambia partida AL-03",
        "ancho cambia costo total",
        "ancho cambia geometría widthM",
        "ancho cambia duración",
        "ancho cambia presupuesto global (base + mamparas)",
        "ancho cambia cronograma 4D",
        "ancho cambia IFC",
        "ancho cambia Markdown",
        "alto cambia área y costo",
        "alto cambia geometría heightM",
        "alto cambia IFC",
        "alto cambia Markdown",
        "recalculateProject es determinista",
        "CONSTRAINT_VIOLATION para ancho_m fuera de rango",
        "CONSTRAINT_VIOLATION para alto_m fuera de rango",
        "validateMamparaConstraints directo",
        "UNSUPPORTED_CHANGE para update-formwork",
        "UNSUPPORTED_CHANGE para update-specification",
        "invalidaciones no vacías",
        "provenance registra cambios",
      ],
    },
    null,
    2,
  ),
);
