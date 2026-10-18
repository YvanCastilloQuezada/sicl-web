// ARKI — test-wall-coherence
// Entrega 1A — coherencia de capas, aberturas, áreas, volúmenes, pesos y metrados.
// Corrección aplicada:
//   - Verificación explícita de metrado.peso_total_kg contra peso_total_kg().

import { generateDynamicBuilding } from "../shared/arkiDynamicFamilies";
import type { Muro } from "../shared/arkiConstructionOntology";
import { wallToDTO, wallFromDTO } from "../shared/arkiConstructionDTOs";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(`ASSERTION_FAILED: ${message}`);
}

function approxEqual(a: number, b: number, tolerance = 0.01): boolean {
  return Math.abs(a - b) <= tolerance;
}

const building = generateDynamicBuilding({
  familyId: "FAM-HEALTH",
  variantId: "GENERAL",
  context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
  parameters: { areaM2: 20000, capacity: 400, floors: 4 },
});

assert(building.constructionModel, "constructionModel presente");
const model = building.constructionModel!;
assert(model.walls.length > 0, "hay muros para verificar");

const validFunciones = new Set(["estructural", "aislamiento", "acabado"]);
const validTiposAbertura = new Set(["puerta", "ventana", "pasadizo", "ducto"]);

let checked = 0;

for (const wall of model.walls) {
  // --- Capas ---
  for (const capa of wall.capas) {
    assert(capa.espesor_m > 0, `capa ${capa.id} en ${wall.id} tiene espesor > 0`);
    assert(validFunciones.has(capa.funcion), `capa ${capa.id} en ${wall.id} tiene función válida`);
  }

  // --- Aberturas ---
  const longitud = wall.longitud_m();
  for (const abertura of wall.aberturas) {
    assert(abertura.posicion_m >= 0, `abertura ${abertura.id} en ${wall.id} posición >= 0`);
    assert(
      abertura.posicion_m + abertura.ancho_m <= longitud + 0.001,
      `abertura ${abertura.id} en ${wall.id} cabe dentro del muro (pos ${abertura.posicion_m} + ancho ${abertura.ancho_m} <= longitud ${longitud})`,
    );
    assert(validTiposAbertura.has(abertura.tipo), `abertura ${abertura.id} en ${wall.id} tiene tipo válido`);
  }

  // --- Áreas y volúmenes ---
  const areaBruta = wall.area_bruta_m2();
  const areaAberturas = wall.area_aberturas_m2();
  const areaNeta = wall.area_neta_m2();
  const volumen = wall.volumen_m3();
  const peso = wall.peso_total_kg();
  const metrado = wall.calcular_metrado();

  assert(areaBruta >= 0, `area bruta >= 0 en ${wall.id}`);
  assert(areaAberturas >= 0, `area aberturas >= 0 en ${wall.id}`);
  assert(areaNeta >= 0, `area neta >= 0 en ${wall.id}`);
  assert(volumen >= 0, `volumen >= 0 en ${wall.id}`);
  assert(peso >= 0, `peso >= 0 en ${wall.id}`);
  assert(
    approxEqual(areaNeta, Math.max(0, areaBruta - areaAberturas)),
    `area neta == max(0, area bruta - aberturas) en ${wall.id}`,
  );
  assert(
    approxEqual(metrado.m2_muro, Number(areaNeta.toFixed(2))),
    `metrado.m2_muro == area_neta redondeada en ${wall.id}`,
  );
  assert(
    approxEqual(metrado.m3_muro, Number(volumen.toFixed(3)), 0.001),
    `metrado.m3_muro == volumen redondeado en ${wall.id}`,
  );

  const pesoEsperado = wall.capas.reduce(
    (sum, capa) => sum + (capa.densidad_kg_m3 ?? 0) * capa.espesor_m * areaNeta,
    0,
  );
  assert(
    approxEqual(peso, pesoEsperado, 1),
    `peso_total_kg coincide con suma de capas en ${wall.id} (esperado ~${pesoEsperado}, obtenido ${peso})`,
  );

  // CORRECCIÓN 3: metrado.peso_total_kg debe coincidir con peso_total_kg().
  assert(
    approxEqual(metrado.peso_total_kg, Number(peso.toFixed(0)), 1),
    `metrado.peso_total_kg coincide con peso_total_kg() en ${wall.id} (metrado ${metrado.peso_total_kg}, calculado ${peso})`,
  );

  // --- Coherencia DTO ↔ dominio ---
  const dto = wallToDTO(wall);
  const reconstructed: Muro = wallFromDTO(dto);
  assert(
    approxEqual(reconstructed.area_neta_m2(), areaNeta),
    `area neta preservada tras DTO en ${wall.id}`,
  );
  assert(
    approxEqual(reconstructed.volumen_m3(), volumen, 0.001),
    `volumen preservado tras DTO en ${wall.id}`,
  );
  assert(
    approxEqual(reconstructed.peso_total_kg(), peso, 1),
    `peso preservado tras DTO en ${wall.id}`,
  );

  checked += 1;
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      wallsChecked: checked,
      checks: [
        "capas con espesor > 0",
        "capas con función válida",
        "aberturas dentro del muro",
        "aberturas con tipo válido",
        "áreas no negativas",
        "área neta == max(0, bruta - aberturas)",
        "volumen no negativo",
        "peso no negativo",
        "metrado.m2_muro == area neta redondeada",
        "metrado.m3_muro == volumen redondeado",
        "peso_total_kg == suma de capas",
        "metrado.peso_total_kg == peso_total_kg()",
        "coherencia DTO ↔ dominio",
      ],
    },
    null,
    2,
  ),
);
