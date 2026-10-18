// ARKI — test-serialization
// Entrega 1A — ida y vuelta Muro ↔ WallDTO ↔ JSON y ConstructionModel ↔ DTO ↔ JSON.
// Correcciones aplicadas:
//   - Comparación profunda de reconstructed.metrado contra originalWall.metrado.
//   - Comparación profunda de reconstructed.to_dict() contra originalWall.to_dict().

import { generateDynamicBuilding } from "../shared/arkiDynamicFamilies";
import type { Muro } from "../shared/arkiConstructionOntology";
import {
  wallToDTO,
  wallFromDTO,
  constructionModelToDTO,
  constructionModelFromDTO,
} from "../shared/arkiConstructionDTOs";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(`ASSERTION_FAILED: ${message}`);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const building = generateDynamicBuilding({
  familyId: "FAM-HEALTH",
  variantId: "GENERAL",
  context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
  parameters: { areaM2: 20000, capacity: 400, floors: 4 },
});

assert(building.constructionModel, "constructionModel presente");
const model = building.constructionModel!;

// --- Round-trip de Muro individual ---
const originalWall: Muro = model.walls[0];
const originalDict = originalWall.to_dict();
const dto = wallToDTO(originalWall);
assert(deepEqual(dto, originalDict), "wallToDTO produce forma idéntica a Muro.to_dict()");

const json = JSON.stringify(dto);
const parsed = JSON.parse(json) as typeof dto;
assert(deepEqual(parsed, dto), "JSON.stringify/parse preserva WallDTO");

const reconstructed = wallFromDTO(parsed);
assert(reconstructed.id === originalWall.id, "id preservado");
assert(reconstructed.nombre === originalWall.nombre, "nombre preservado");
assert(reconstructed.tipo === originalWall.tipo, "tipo preservado");
assert(reconstructed.especialidad_principal === originalWall.especialidad_principal, "especialidad preservada");
assert(reconstructed.capas.length === originalWall.capas.length, "capas preservadas");
assert(reconstructed.aberturas.length === originalWall.aberturas.length, "aberturas preservadas");
assert(reconstructed.partidas.length === originalWall.partidas.length, "partidas preservadas");
assert(reconstructed.interferencias.length === originalWall.interferencias.length, "interferencias preservadas");
assert(reconstructed.estado === originalWall.estado, "estado preservado");
assert(reconstructed.version === originalWall.version, "version preservada");
assert(reconstructed.creado === originalWall.creado, "creado preservado");
assert(reconstructed.notas === originalWall.notas, "notas preservadas");
assert(deepEqual(reconstructed.metadata, originalWall.metadata), "metadata preservada");

// CORRECCIÓN 1: comparación profunda del metrado campo por campo.
assert(
  deepEqual(reconstructed.metrado, originalWall.metrado),
  "metrado preservado campo por campo",
);

// CORRECCIÓN 2: comparación profunda del to_dict() completo.
assert(
  deepEqual(reconstructed.to_dict(), originalDict),
  "to_dict() reconstruido idéntico a to_dict() original",
);

// El muro reconstruido debe calcular el mismo metrado.
const originalMetrado = originalWall.calcular_metrado();
const reconstructedMetrado = reconstructed.calcular_metrado();
assert(deepEqual(reconstructedMetrado, originalMetrado), "metrado recalculado coincide con el original");

// El muro reconstruido debe tener los mismos métodos operativos.
assert(typeof reconstructed.longitud_m() === "number", "longitud_m() operable");
assert(typeof reconstructed.area_neta_m2() === "number", "area_neta_m2() operable");
assert(typeof reconstructed.volumen_m3() === "number", "volumen_m3() operable");
assert(typeof reconstructed.peso_total_kg() === "number", "peso_total_kg() operable");
assert(reconstructed.longitud_m() === originalWall.longitud_m(), "longitud_m() coincide");
assert(reconstructed.espesor_total_m() === originalWall.espesor_total_m(), "espesor_total_m() coincide");

// --- Round-trip de ConstructionModel ---
const modelDTO = constructionModelToDTO(model);
const modelJSON = JSON.stringify(modelDTO);
const modelParsed = JSON.parse(modelJSON) as typeof modelDTO;
const modelReconstructed = constructionModelFromDTO(modelParsed);

assert(modelReconstructed.projectId === model.projectId, "projectId preservado");
assert(modelReconstructed.generatedAt === model.generatedAt, "generatedAt preservado");
assert(modelReconstructed.walls.length === model.walls.length, "walls preservados");
assert(modelReconstructed.spaces.length === model.spaces.length, "spaces preservados");
assert(modelReconstructed.foundations.length === model.foundations.length, "foundations preservadas");
assert(modelReconstructed.columns.length === model.columns.length, "columns preservadas");
assert(modelReconstructed.beams.length === model.beams.length, "beams preservadas");
assert(modelReconstructed.slabs.length === model.slabs.length, "slabs preservadas");
assert(modelReconstructed.doors.length === model.doors.length, "doors preservadas");
assert(modelReconstructed.windows.length === model.windows.length, "windows preservadas");
assert(modelReconstructed.stairs.length === model.stairs.length, "stairs preservadas");
assert(modelReconstructed.floors.length === model.floors.length, "floors preservados");
assert(modelReconstructed.roofs.length === model.roofs.length, "roofs preservados");
assert(modelReconstructed.partitions.length === model.partitions.length, "partitions preservadas");
assert(modelReconstructed.relations.length === model.relations.length, "relations preservadas");
assert(modelReconstructed.schedule.length === model.schedule.length, "schedule preservado");
assert(deepEqual(modelReconstructed.summary, model.summary), "summary preservado");
assert(deepEqual(modelReconstructed.gates, model.gates), "gates preservados");

// Los muros reconstruidos deben ser Muro operativos.
for (const wall of modelReconstructed.walls) {
  const m = wall.calcular_metrado();
  assert(typeof m.m2_muro === "number", `metrado.m2_muro calculable en ${wall.id}`);
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      wallCount: model.walls.length,
      modelSummary: model.summary,
      checks: [
        "wallToDTO identidad con Muro.to_dict()",
        "wallFromDTO reconstrucción operativa",
        "metrado profundo campo por campo",
        "to_dict() reconstruido idéntico al original",
        "metrado recalculado coincide",
        "ConstructionModel round-trip completo",
      ],
    },
    null,
    2,
  ),
);
