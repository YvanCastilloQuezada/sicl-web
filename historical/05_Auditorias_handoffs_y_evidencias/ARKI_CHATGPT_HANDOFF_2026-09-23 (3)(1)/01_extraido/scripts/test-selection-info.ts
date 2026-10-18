import { Muro } from "../shared/arkiConstructionOntology";
import { selectionFromElement } from "../shared/arkiBimSelection";

const wall = new Muro({ id: "muro-test-1", proyecto_id: "P-1", nombre: "Muro test", funcion: "tabique", tipo: "albañilería_confinada", especialidad_principal: "arquitectura", x_inicio_m: 0, y_inicio_m: 0, x_fin_m: 5, y_fin_m: 0, altura_m: 3 });
wall.agregar_capa({ id: "capa-1", nombre: "Ladrillo", material: "ladrillo_kk_18", espesor_m: .13, funcion: "estructural", densidad_kg_m3: 1800 });
wall.calcular_metrado();
const selection = selectionFromElement(wall, "wall");
if (selection.elementId !== "muro-test-1" || selection.kind !== "wall") throw new Error("wall selection identity failed");
if (!selection.family || !selection.materials?.length || !selection.metrics || typeof selection.cost !== "number") throw new Error("wall inspector data incomplete");
console.log("test-selection-info: PASS");
