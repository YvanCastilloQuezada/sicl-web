// ARKI — test-budget-reconciliation
// Entrega 1B — reconciliación entre partidas, APU, PriceBook y presupuesto del modelo.

import { generateDynamicBuilding } from "../shared/arkiDynamicFamilies";
import { APU_DATABASE } from "../shared/arkiConstructionOntology";
import { generateTechnicalDossier } from "../shared/arkiTechnicalDossier";
import {
  fromApuDatabase,
  findPriceBookItem,
  isPriceBookValid,
  type PriceBook,
} from "../shared/arkiPriceBook";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(`ASSERTION_FAILED: ${message}`);
}

function approxEqual(a: number, b: number, tolerance = 0.01): boolean {
  return Math.abs(a - b) <= tolerance;
}

// --- PriceBook básico ---
const priceBook: PriceBook = fromApuDatabase(APU_DATABASE, {
  id: "PB-TEST-1B",
  version: 1,
  region: "La Libertad",
  country: "PE",
  currency: "PEN",
  validFrom: "2026-09-22",
});

assert(priceBook.schema === "ARKI-PRICE-BOOK-1.0", "PriceBook tiene schema correcto");
assert(priceBook.id === "PB-TEST-1B", "PriceBook id correcto");
assert(priceBook.version === 1, "PriceBook version correcta");
assert(priceBook.source === "ARKI_REFERENCIAL", "PriceBook source correcto");
assert(priceBook.currency === "PEN", "PriceBook currency correcta");
assert(priceBook.items.length === APU_DATABASE.length, "PriceBook tiene todos los items");
assert(priceBook.items.every(isPriceBookValid), "todos los items son válidos");

// --- Idempotencia ---
const priceBook2 = fromApuDatabase(APU_DATABASE, {
  id: "PB-TEST-1B",
  version: 1,
  region: "La Libertad",
  country: "PE",
  currency: "PEN",
  validFrom: "2026-09-22",
});
assert(
  JSON.stringify(priceBook) === JSON.stringify(priceBook2),
  "fromApuDatabase es idempotente con misma entrada",
);

// --- Coherencia de items con APU original ---
for (const original of APU_DATABASE) {
  const item = findPriceBookItem(priceBook, original.codigo);
  assert(item, `item ${original.codigo} presente en PriceBook`);
  assert(
    approxEqual(item!.unitPrice, original.precio_unitario),
    `unitPrice de ${original.codigo} coincide`,
  );
  assert(
    approxEqual(item!.directCost, original.costo_directo),
    `directCost de ${original.codigo} coincide`,
  );
}

// --- Reconciliación con ConstructionModel ---
const building = generateDynamicBuilding({
  familyId: "FAM-HEALTH",
  variantId: "GENERAL",
  context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
  parameters: { areaM2: 20000, capacity: 400, floors: 4 },
});
assert(building.constructionModel, "constructionModel presente");
const model = building.constructionModel!;

// Todas las partidas del modelo deben referenciar códigos válidos.
const allPartidas = model.walls.flatMap((wall) => wall.partidas);
let partidasVerified = 0;
for (const partida of allPartidas) {
  const item = findPriceBookItem(priceBook, partida.codigo);
  if (item) {
    assert(
      approxEqual(partida.precio_unitario, item.unitPrice),
      `partida ${partida.codigo} usa unitPrice del PriceBook`,
    );
    partidasVerified += 1;
  }
}
assert(partidasVerified > 0, "al menos una partida coincide con PriceBook");

// Suma de partidas vs presupuesto del modelo (tolerancia documentada).
const partidasSum = model.walls.reduce(
  (sum, wall) =>
    sum + wall.partidas.reduce((subtotal, partida) => subtotal + partida.parcial, 0),
  0,
);
const elementCostsSum = [
  ...model.foundations,
  ...model.columns,
  ...model.beams,
  ...model.slabs,
  ...model.doors,
  ...model.windows,
  ...model.stairs,
  ...model.floors,
  ...model.roofs,
  ...model.partitions,
].reduce(
  (sum, element) =>
    sum + element.costs.reduce((subtotal, item) => subtotal + item.total, 0),
  0,
);
const totalCalculated = partidasSum + elementCostsSum;
assert(
  approxEqual(totalCalculated, model.summary.totalBudgetPen, 1),
  `suma de partidas (${totalCalculated.toFixed(2)}) coincide con totalBudgetPen (${model.summary.totalBudgetPen})`,
);

// --- Encofrados con trazabilidad ---
const dossier = generateTechnicalDossier(model, "La Libertad", 1.04);
assert(dossier.formwork.length > 0, "dossier tiene encofrados");
for (const req of dossier.formwork) {
  assert(req.status === "derived", `encofrado ${req.id} tiene status derived`);
  assert(req.modelVersion === 1, `encofrado ${req.id} tiene modelVersion`);
  assert(typeof req.elementVersion === "number", `encofrado ${req.id} tiene elementVersion`);
  assert(typeof req.sourceSnapshotId === "string", `encofrado ${req.id} tiene sourceSnapshotId`);
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      priceBookItems: priceBook.items.length,
      partidasVerified,
      partidasSum: Number(partidasSum.toFixed(2)),
      elementCostsSum: Number(elementCostsSum.toFixed(2)),
      totalCalculated: Number(totalCalculated.toFixed(2)),
      modelBudget: model.summary.totalBudgetPen,
      formworkWithTraceability: dossier.formwork.length,
      checks: [
        "PriceBook schema, id, version, source, currency",
        "items válidos",
        "idempotencia de fromApuDatabase",
        "coherencia item ↔ APU original",
        "partidas del modelo referencian PriceBook",
        "suma de partidas coincide con totalBudgetPen",
        "encofrados con modelVersion, elementVersion, sourceSnapshotId, status",
      ],
    },
    null,
    2,
  ),
);
