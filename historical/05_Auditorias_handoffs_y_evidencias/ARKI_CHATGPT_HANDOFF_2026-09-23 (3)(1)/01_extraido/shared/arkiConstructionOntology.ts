import { generateElementSet, type ElementRelation, type StructuralElement } from "./arkiConstructionElements";

export type FuncionMuro = "portante" | "tabique" | "contencion" | "fachada" | "aislamiento" | "cortina";
export type TipoMuro = "albañilería_confinada" | "albañilería_armada" | "concreto_armado" | "concreto_simple" | "drywall" | "vidrio" | "prefabricado" | "madera" | "acero" | "tierra";
export type MaterialCapa = "ladrillo_kk_18" | "ladrillo_kk_12" | "ladrillo_pandereta" | "bloque_concreto" | "concreto_f210" | "concreto_f280" | "mortero_cemento" | "yeso" | "drywall_std" | "drywall_rh" | "drywall_rf" | "aislante_termico" | "aislante_acustico" | "barrera_vapor" | "vidrio_templado" | "vidrio_laminado" | "aluminio" | "pvc";
export type AcabadoMuro = "tarrajeo" | "pintura_latex" | "pintura_esmalte" | "ceramico" | "porcelanato" | "zocalo_sanitario" | "enchapado_piedra" | "enchapado_madera" | "sin_acabado";
export type Especialidad = "arquitectura" | "estructuras" | "sanitarias" | "electricas" | "mecanicas" | "comunicaciones" | "seguridad";
export type EstadoMuro = "borrador" | "aprobado" | "en_construccion" | "construido" | "demolido" | "modificado";

export type CapaMuro = { id: string; nombre: string; material: MaterialCapa; espesor_m: number; funcion: "estructural" | "aislamiento" | "acabado"; densidad_kg_m3?: number; conductividad_w_mk?: number; resistencia_fuego_min?: number; orden?: number };
export type Acabado = { id: string; tipo: AcabadoMuro; cara: "exterior" | "interior" | "ambas"; espesor_m: number; area_m2?: number; material?: string };
export type Abertura = { id: string; tipo: "puerta" | "ventana" | "pasadizo" | "ducto"; ancho_m: number; alto_m: number; posicion_m: number; altura_antepecho_m?: number; tipo_marco?: string; tipo_vidrio?: string; permite_fuego?: boolean };
export type PartidaPresupuestal = { id: string; codigo: string; descripcion: string; unidad: "m2" | "m3" | "kg" | "und"; metrado: number; precio_unitario: number; parcial: number; especialidad: Especialidad; fase: "estructuras" | "arquitectura" | "acabados" };
export type Metrado = { m2_muro: number; m3_muro: number; m2_tarrajeo_exterior: number; m2_tarrajeo_interior: number; m2_pintura_exterior: number; m2_pintura_interior: number; m2_zocalo: number; kg_acero: number; m3_concreto: number; und_puertas: number; und_ventanas: number; m2_aberturas: number; peso_total_kg: number };
export type Interferencia = { id: string; especialidad: Especialidad; elemento_afectado: string; tipo: "duro" | "blando"; descripcion: string; severidad: "critica" | "alta" | "media" | "baja"; posicion_m?: number };
export type ApuInsumo = { nombre: string; unidad: string; cantidad: number; precio_unitario: number; parcial: number };
export type ApuPartida = { codigo: string; descripcion: string; unidad: string; insumos: ApuInsumo[]; costo_directo: number; gastos_generales: number; utilidad: number; subtotal: number; igv: number; precio_unitario: number };

const r = (value: number, digits = 2) => Number(value.toFixed(digits));
const id = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export class Muro {
  id!: string;
  proyecto_id!: string;
  nombre!: string;
  funcion!: FuncionMuro;
  tipo!: TipoMuro;
  especialidad_principal!: Especialidad;
  x_inicio_m!: number;
  y_inicio_m!: number;
  x_fin_m!: number;
  y_fin_m!: number;
  altura_m!: number;
  nivel_piso: number;
  capas: CapaMuro[] = [];
  acabados: Acabado[] = [];
  aberturas: Abertura[] = [];
  metrado: Metrado = emptyMetrado();
  partidas: PartidaPresupuestal[] = [];
  interferencias: Interferencia[] = [];
  estado: EstadoMuro = "borrador";
  autor_id?: string;
  version = 1;
  creado = new Date().toISOString();
  notas = "";
  metadata: Record<string, unknown> = {};

  constructor(input: { id: string; proyecto_id: string; nombre: string; funcion: FuncionMuro; tipo: TipoMuro; especialidad_principal: Especialidad; x_inicio_m: number; y_inicio_m: number; x_fin_m: number; y_fin_m: number; altura_m: number; nivel_piso?: number }) { Object.assign(this, input); this.nivel_piso = input.nivel_piso ?? 0; }
  longitud_m() { return Math.sqrt((this.x_fin_m - this.x_inicio_m) ** 2 + (this.y_fin_m - this.y_inicio_m) ** 2); }
  espesor_total_m() { return this.capas.reduce((sum, capa) => sum + capa.espesor_m, 0); }
  area_bruta_m2() { return this.longitud_m() * this.altura_m; }
  area_aberturas_m2() { return this.aberturas.reduce((sum, abertura) => sum + abertura.ancho_m * abertura.alto_m, 0); }
  area_neta_m2() { return Math.max(0, this.area_bruta_m2() - this.area_aberturas_m2()); }
  volumen_m3() { return this.area_neta_m2() * this.espesor_total_m(); }
  peso_total_kg() { return this.capas.reduce((sum, capa) => sum + (capa.densidad_kg_m3 ?? 0) * capa.espesor_m * this.area_neta_m2(), 0); }
  capa_estructural() { return this.capas.find((capa) => capa.funcion === "estructural"); }
  material_principal() { return this.capa_estructural()?.material; }
  resistencia_fuego_min() { const values = this.capas.map((capa) => capa.resistencia_fuego_min).filter((value): value is number => value !== undefined); return values.length ? Math.min(...values) : 0; }
  agregar_capa(capa: CapaMuro) { this.capas.push({ ...capa, orden: this.capas.length }); }
  agregar_acabado(acabado: Acabado) { this.acabados.push(acabado); }
  agregar_abertura(abertura: Abertura) { this.aberturas.push(abertura); }
  agregar_partida(partida: PartidaPresupuestal) { this.partidas.push(partida); }
  agregar_interferencia(interferencia: Interferencia) { this.interferencias.push(interferencia); }
  calcular_metrado(): Metrado {
    const m = emptyMetrado();
    m.m2_muro = r(this.area_neta_m2()); m.m3_muro = r(this.volumen_m3(), 3); m.peso_total_kg = r(this.peso_total_kg(), 0);
    for (const acabado of this.acabados) {
      if (acabado.tipo === "tarrajeo") { if (acabado.cara === "exterior" || acabado.cara === "ambas") m.m2_tarrajeo_exterior += this.area_neta_m2(); if (acabado.cara === "interior" || acabado.cara === "ambas") m.m2_tarrajeo_interior += this.area_neta_m2(); }
      if (acabado.tipo === "pintura_latex" || acabado.tipo === "pintura_esmalte") { if (acabado.cara === "exterior" || acabado.cara === "ambas") m.m2_pintura_exterior += this.area_neta_m2(); if (acabado.cara === "interior" || acabado.cara === "ambas") m.m2_pintura_interior += this.area_neta_m2(); }
      if (acabado.tipo === "zocalo_sanitario") m.m2_zocalo += this.area_neta_m2();
    }
    for (const abertura of this.aberturas) { if (abertura.tipo === "puerta") m.und_puertas += 1; if (abertura.tipo === "ventana") m.und_ventanas += 1; m.m2_aberturas += abertura.ancho_m * abertura.alto_m; }
    if (this.tipo === "concreto_armado") { m.m3_concreto = m.m3_muro; m.kg_acero = r(m.m3_concreto * 120, 0); }
    this.metrado = Object.fromEntries(Object.entries(m).map(([key, value]) => [key, typeof value === "number" ? r(value, key.includes("m3") ? 3 : 2) : value])) as Metrado;
    return this.metrado;
  }
  to_dict() { return { id: this.id, proyecto_id: this.proyecto_id, nombre: this.nombre, funcion: this.funcion, tipo: this.tipo, especialidad_principal: this.especialidad_principal, geometria: { x_inicio: this.x_inicio_m, y_inicio: this.y_inicio_m, x_fin: this.x_fin_m, y_fin: this.y_fin_m, altura: this.altura_m, nivel_piso: this.nivel_piso, longitud: r(this.longitud_m()), espesor_total: r(this.espesor_total_m(), 3) }, capas: this.capas, acabados: this.acabados, aberturas: this.aberturas, metrado: this.metrado, partidas: this.partidas, interferencias: this.interferencias, estado: this.estado, version: this.version, creado: this.creado, notas: this.notas, metadata: this.metadata }; }
}

function emptyMetrado(): Metrado { return { m2_muro: 0, m3_muro: 0, m2_tarrajeo_exterior: 0, m2_tarrajeo_interior: 0, m2_pintura_exterior: 0, m2_pintura_interior: 0, m2_zocalo: 0, kg_acero: 0, m3_concreto: 0, und_puertas: 0, und_ventanas: 0, m2_aberturas: 0, peso_total_kg: 0 }; }

export const APU_DATABASE: ApuPartida[] = [
  { codigo: "04.02.01", descripcion: "Muro de albañilería KK 18 huecos", unidad: "m²", insumos: [{ nombre: "Ladrillo KK 18 huecos", unidad: "und", cantidad: 18, precio_unitario: .85, parcial: 15.3 }, { nombre: "Cemento Portland", unidad: "bolsa", cantidad: .5, precio_unitario: 25, parcial: 12.5 }, { nombre: "Arena gruesa", unidad: "m³", cantidad: .02, precio_unitario: 60, parcial: 1.2 }, { nombre: "Operario", unidad: "h", cantidad: .4, precio_unitario: 18, parcial: 7.2 }, { nombre: "Peón", unidad: "h", cantidad: .4, precio_unitario: 12, parcial: 4.8 }], costo_directo: 41, gastos_generales: 4.1, utilidad: 2.05, subtotal: 47.15, igv: 8.49, precio_unitario: 55.64 },
  { codigo: "05.01.01", descripcion: "Tarrajeo de muro, e=2cm", unidad: "m²", insumos: [{ nombre: "Mortero cemento-arena", unidad: "m³", cantidad: .02, precio_unitario: 120, parcial: 2.4 }, { nombre: "Operario", unidad: "h", cantidad: .24, precio_unitario: 18, parcial: 4.32 }, { nombre: "Peón", unidad: "h", cantidad: .24, precio_unitario: 12, parcial: 2.88 }], costo_directo: 28.28, gastos_generales: 2.83, utilidad: 1.41, subtotal: 32.52, igv: 5.85, precio_unitario: 38.37 },
  { codigo: "05.03.01", descripcion: "Pintura látex en muro, dos manos", unidad: "m²", insumos: [{ nombre: "Pintura látex", unidad: "gal", cantidad: .06, precio_unitario: 48, parcial: 2.88 }, { nombre: "Operario", unidad: "h", cantidad: .08, precio_unitario: 18, parcial: 1.44 }], costo_directo: 4.32, gastos_generales: .43, utilidad: .22, subtotal: 4.97, igv: .89, precio_unitario: 5.86 },
  { codigo: "05.04.02", descripcion: "Puerta contraplacada 0.90x2.10", unidad: "und", insumos: [{ nombre: "Hoja, marco y herrajes", unidad: "und", cantidad: 1, precio_unitario: 680, parcial: 680 }, { nombre: "Instalación", unidad: "und", cantidad: 1, precio_unitario: 170, parcial: 170 }], costo_directo: 850, gastos_generales: 85, utilidad: 42.5, subtotal: 977.5, igv: 175.95, precio_unitario: 1153.45 },
  { codigo: "05.05.01", descripcion: "Ventana de aluminio y vidrio templado", unidad: "m²", insumos: [{ nombre: "Aluminio y vidrio", unidad: "m²", cantidad: 1, precio_unitario: 390, parcial: 390 }, { nombre: "Instalación", unidad: "h", cantidad: .4, precio_unitario: 24, parcial: 9.6 }], costo_directo: 399.6, gastos_generales: 39.96, utilidad: 19.98, subtotal: 459.54, igv: 82.72, precio_unitario: 542.26 },
];

function apu(codigo: string) { return APU_DATABASE.find((item) => item.codigo === codigo)!; }
function partida(wall: Muro, codigo: string, metrado: number, especialidad: Especialidad = "arquitectura", fase: PartidaPresupuestal["fase"] = "arquitectura"): PartidaPresupuestal { const item = apu(codigo); return { id: id("partida"), codigo, descripcion: item.descripcion, unidad: item.unidad === "m²" ? "m2" : "und", metrado: r(metrado), precio_unitario: item.precio_unitario, parcial: r(metrado * item.precio_unitario), especialidad, fase }; }

export type ConstructionSpace = { id: string; nombre: string; funcion: string; nivel_piso: number; area_m2: number; altura_libre_m: number; wallIds: string[]; requisitos: string[]; estado: "conceptual" | "coordinado" | "validado" };
export type ScheduleTask = { id: string; codigo: string; nombre: string; fase: "diseño" | "estructura" | "arquitectura" | "instalaciones" | "acabados" | "puesta_en_marcha"; duracion_dias: number; inicio_dia: number; fin_dia: number; predecessors: string[]; elementIds: string[]; costo_pen: number };
export type ConstructionModel = { schema: "ARKI-CONSTRUCTION-MODEL-1.0"; projectId: string; generatedAt: string; ontologyLevel: "CONSTRUCTIVE_ELEMENTS"; spaces: ConstructionSpace[]; walls: Muro[]; foundations: StructuralElement[]; columns: StructuralElement[]; beams: StructuralElement[]; slabs: StructuralElement[]; doors: StructuralElement[]; windows: StructuralElement[]; stairs: StructuralElement[]; floors: StructuralElement[]; roofs: StructuralElement[]; partitions: StructuralElement[]; relations: ElementRelation[]; schedule: ScheduleTask[]; apuDatabase: ApuPartida[]; summary: { wallCount: number; spaceCount: number; foundationCount: number; columnCount: number; beamCount: number; slabCount: number; doorCount: number; windowCount: number; stairCount: number; floorElementCount: number; roofCount: number; partitionCount: number; relationCount: number; floorCount: number; totalNetWallAreaM2: number; totalVolumeM3: number; totalWeightKg: number; totalBudgetPen: number; totalDurationDays: number; doors: number; windows: number; interferences: number }; gates: { semanticElements: boolean; quantitiesCalculated: boolean; apuLinked: boolean; scheduleLinked: boolean; specialistReviewRequired: true; notes: string[] } };

export function generateConstructionModel(input: { projectId: string; name: string; widthM: number; depthM: number; floors: number; familyCategory?: string }): ConstructionModel {
  const walls: Muro[] = [];
  const spaces: ConstructionSpace[] = [];
  const levels = Math.max(1, Math.min(input.floors, 80));
  for (let level = 0; level < levels; level += 1) {
    const y = level * 3.6;
    const specs = [{ name: "Muro norte", x1: 0, y1: 0, x2: input.widthM, y2: 0 }, { name: "Muro este", x1: input.widthM, y1: 0, x2: input.widthM, y2: input.depthM }, { name: "Muro sur", x1: input.widthM, y1: input.depthM, x2: 0, y2: input.depthM }, { name: "Muro oeste", x1: 0, y1: input.depthM, x2: 0, y2: 0 }];
    specs.forEach((spec, index) => {
      const isConcrete = input.familyCategory === "INDUSTRY" && level === 0;
      const wall = new Muro({ id: `muro-${level + 1}-${index + 1}`, proyecto_id: input.projectId, nombre: `${spec.name} · Nivel ${level + 1}`, funcion: isConcrete ? "portante" : "tabique", tipo: isConcrete ? "concreto_armado" : "albañilería_confinada", especialidad_principal: isConcrete ? "estructuras" : "arquitectura", x_inicio_m: spec.x1, y_inicio_m: spec.y1, x_fin_m: spec.x2, y_fin_m: spec.y2, altura_m: 3.6, nivel_piso: level });
      wall.agregar_capa({ id: id("capa"), nombre: isConcrete ? "Concreto estructural f'c=210" : "Tarrajeo exterior", material: isConcrete ? "concreto_f210" : "mortero_cemento", espesor_m: isConcrete ? .2 : .02, funcion: isConcrete ? "estructural" : "acabado", densidad_kg_m3: isConcrete ? 2400 : 2000, resistencia_fuego_min: isConcrete ? 180 : undefined });
      if (!isConcrete) { wall.agregar_capa({ id: id("capa"), nombre: "Albañilería KK 18 huecos", material: "ladrillo_kk_18", espesor_m: .13, funcion: "estructural", densidad_kg_m3: 1800, resistencia_fuego_min: 120 }); wall.agregar_capa({ id: id("capa"), nombre: "Tarrajeo interior", material: "mortero_cemento", espesor_m: .02, funcion: "acabado", densidad_kg_m3: 2000 }); }
      wall.agregar_acabado({ id: id("acabado"), tipo: "tarrajeo", cara: "ambas", espesor_m: .02 }); wall.agregar_acabado({ id: id("acabado"), tipo: "pintura_latex", cara: "ambas", espesor_m: .001 }); wall.agregar_acabado({ id: id("acabado"), tipo: "zocalo_sanitario", cara: "interior", espesor_m: .02 });
      if (index === 0) wall.agregar_abertura({ id: id("puerta"), tipo: "puerta", ancho_m: .9, alto_m: 2.1, posicion_m: Math.max(.9, spec.x2 / 2 - .45), tipo_marco: "aluminio" });
      if (index === 1 || index === 3) { const length = Math.abs(spec.y2 - spec.y1); const count = Math.max(1, Math.floor(length / 12)); for (let window = 0; window < count; window += 1) wall.agregar_abertura({ id: id("ventana"), tipo: "ventana", ancho_m: 1.8, alto_m: 1.4, posicion_m: (window + 1) * length / (count + 1) - .9, altura_antepecho_m: .9, tipo_marco: "aluminio", tipo_vidrio: "vidrio_templado" }); }
      wall.agregar_interferencia({ id: id("interf"), especialidad: "sanitarias", elemento_afectado: "Tubería PVC SAL 2\"", tipo: "blando", descripcion: "Pase sanitario previsto; verificar ubicación en coordinación MEP.", severidad: "media", posicion_m: wall.longitud_m() / 2 });
      const metrado = wall.calcular_metrado();
      wall.agregar_partida(partida(wall, isConcrete ? "04.01.01" : "04.02.01", metrado.m2_muro, isConcrete ? "estructuras" : "arquitectura", isConcrete ? "estructuras" : "arquitectura"));
      wall.agregar_partida(partida(wall, "05.01.01", metrado.m2_tarrajeo_exterior + metrado.m2_tarrajeo_interior, "arquitectura", "acabados"));
      wall.agregar_partida(partida(wall, "05.03.01", metrado.m2_pintura_exterior + metrado.m2_pintura_interior, "arquitectura", "acabados"));
      if (metrado.und_puertas) wall.agregar_partida(partida(wall, "05.04.02", metrado.und_puertas, "arquitectura", "acabados"));
      if (metrado.und_ventanas) wall.agregar_partida(partida(wall, "05.05.01", metrado.m2_aberturas - metrado.und_puertas * .9 * 2.1, "arquitectura", "acabados"));
      walls.push(wall);
    });
    const spaceNames = input.familyCategory === "SALUD" ? ["Consulta externa", "Sala de espera", "Diagnóstico", "Circulación clínica"] : ["Espacio principal", "Área pública", "Servicios", "Circulación"];
    spaceNames.forEach((spaceName, index) => spaces.push({ id: `space-${level + 1}-${index + 1}`, nombre: `${spaceName} · Nivel ${level + 1}`, funcion: index === 0 ? "principal" : index === 1 ? "pública" : index === 2 ? "servicio" : "circulación", nivel_piso: level, area_m2: r((input.widthM * input.depthM * .46) / spaceNames.length), altura_libre_m: 3.1, wallIds: walls.slice(-4).map((wall) => wall.id), requisitos: index === 0 ? ["Área mínima según programa", "Ventilación e iluminación", "Accesibilidad"] : ["Coordinación arquitectónica"], estado: "conceptual" }));
  }
  const total = walls.reduce((sum, wall) => sum + wall.partidas.reduce((subtotal, item) => subtotal + item.parcial, 0), 0);
  const elementSet = generateElementSet({ projectId: input.projectId, widthM: input.widthM, depthM: input.depthM, floors: levels, wallIds: walls.map((wall) => wall.id), doorCount: walls.reduce((sum, wall) => sum + wall.metrado.und_puertas, 0), windowCount: walls.reduce((sum, wall) => sum + wall.metrado.und_ventanas, 0) });
  const schedule: ScheduleTask[] = [{ id: "task-design", codigo: "D-01", nombre: "Diseño y coordinación de espacios", fase: "diseño", duracion_dias: 10, inicio_dia: 1, fin_dia: 10, predecessors: [], elementIds: spaces.map((space) => space.id), costo_pen: r(total * .03) }];
  for (let level = 0; level < levels; level += 1) { const levelWalls = walls.filter((wall) => wall.nivel_piso === level); const start = 11 + level * 14; schedule.push({ id: `task-structure-${level + 1}`, codigo: `E-${String(level + 1).padStart(2, "0")}`, nombre: `Estructura y muros · Nivel ${level + 1}`, fase: level === 0 ? "estructura" : "arquitectura", duracion_dias: 14, inicio_dia: start, fin_dia: start + 13, predecessors: level === 0 ? ["task-design"] : [`task-structure-${level}`], elementIds: levelWalls.map((wall) => wall.id), costo_pen: r(levelWalls.reduce((sum, wall) => sum + wall.partidas.reduce((subtotal, item) => subtotal + item.parcial, 0), 0) * .62) }); }
  const finishStart = 11 + levels * 14; schedule.push({ id: "task-mep", codigo: "M-01", nombre: "Instalaciones y coordinación MEP", fase: "instalaciones", duracion_dias: 12, inicio_dia: finishStart, fin_dia: finishStart + 11, predecessors: [`task-structure-${levels}`], elementIds: walls.flatMap((wall) => wall.interferencias.map((item) => item.id)), costo_pen: r(total * .12) }); schedule.push({ id: "task-finishes", codigo: "A-01", nombre: "Acabados, pruebas y entrega", fase: "acabados", duracion_dias: 15, inicio_dia: finishStart + 12, fin_dia: finishStart + 26, predecessors: ["task-mep"], elementIds: walls.flatMap((wall) => wall.partidas.filter((item) => item.fase === "acabados").map((item) => item.id)), costo_pen: r(total * .25) });
  const totalDurationDays = Math.max(...schedule.map((task) => task.fin_dia));
  return { schema: "ARKI-CONSTRUCTION-MODEL-1.0", projectId: input.projectId, generatedAt: new Date().toISOString(), ontologyLevel: "CONSTRUCTIVE_ELEMENTS", spaces, walls, foundations: elementSet.foundations, columns: elementSet.columns, beams: elementSet.beams, slabs: elementSet.slabs, doors: elementSet.doors, windows: elementSet.windows, stairs: elementSet.stairs, floors: elementSet.floors, roofs: elementSet.roofs, partitions: elementSet.partitions, relations: elementSet.relations, schedule, apuDatabase: APU_DATABASE, summary: { wallCount: walls.length, spaceCount: spaces.length, foundationCount: elementSet.foundations.length, columnCount: elementSet.columns.length, beamCount: elementSet.beams.length, slabCount: elementSet.slabs.length, doorCount: elementSet.doors.length, windowCount: elementSet.windows.length, stairCount: elementSet.stairs.length, floorElementCount: elementSet.floors.length, roofCount: elementSet.roofs.length, partitionCount: elementSet.partitions.length, relationCount: elementSet.relations.length, floorCount: levels, totalNetWallAreaM2: r(walls.reduce((sum, wall) => sum + wall.metrado.m2_muro, 0)), totalVolumeM3: r(walls.reduce((sum, wall) => sum + wall.metrado.m3_muro, 0), 3), totalWeightKg: r(walls.reduce((sum, wall) => sum + wall.metrado.peso_total_kg, 0) + elementSet.totalWeightKg, 0), totalBudgetPen: r(total + elementSet.budgetPen), totalDurationDays, doors: elementSet.doors.length, windows: elementSet.windows.length, interferences: walls.reduce((sum, wall) => sum + wall.interferencias.length, 0) + elementSet.columns.length + elementSet.beams.length + elementSet.slabs.length }, gates: { semanticElements: true, quantitiesCalculated: true, apuLinked: true, scheduleLinked: true, specialistReviewRequired: true, notes: ["Modelo constructivo conceptual generado desde la familia.", "Los precios APU son referenciales en soles y deben actualizarse con la base contractual.", "La coordinación estructural, sanitaria, eléctrica y mecánica requiere revisión especializada."] } };
}

export function exportConstructionIfc(model: ConstructionModel, metadata: { name: string; familyId: string; city?: string; country?: string }) {
  let next = 10;
  const projectId = next++; const siteId = next++; const buildingId = next++; const storeyId = next++;
  const lines = ["ISO-10303-21;", "HEADER;FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');FILE_NAME('ARKI-CONSTRUCTION','',('ARKI'),('ARKI'),'IFC4X3','ARKI','');FILE_SCHEMA(('IFC4X3'));ENDSEC;", "DATA;", `#${next++}=IFCSIUNIT('LENGTHUNIT','METRE');`, `#${next++}=IFCSIUNIT('AREAUNIT','SQUARE_METRE');`, `#${next++}=IFCSIUNIT('VOLUMEUNIT','CUBIC_METRE');`, `#${projectId}=IFCPROJECT(${step(ifcGuid(model.projectId))},${step(metadata.name)},'ARKI Construction Model');`, `#${siteId}=IFCSITE(${step(ifcGuid(`${model.projectId}:site`))},${step(metadata.city ?? "UNKNOWN")},${step(metadata.country ?? "PE")});`, `#${buildingId}=IFCBUILDING(${step(ifcGuid(metadata.familyId))},${step(metadata.name)},'GENERATED_CANDIDATE');`, `#${storeyId}=IFCBUILDINGSTOREY(${step(ifcGuid(`${model.projectId}:level-0`))},'Nivel 1','0.0');`, `#${next++}=IFCRELAGGREGATES(${step(ifcGuid(`${model.projectId}:rel-building`))},'Edificio ARKI',#${projectId},(#${buildingId}));`, `#${next++}=IFCRELAGGREGATES(${step(ifcGuid(`${model.projectId}:rel-storey`))},'Pisos del edificio',#${buildingId},(#${storeyId}));`];
  const wallRefs: number[] = [];
  for (const wall of model.walls) {
    const wallId = next++; wallRefs.push(wallId); lines.push(`#${wallId}=IFCWALL(${step(ifcGuid(wall.id))},${step(wall.nombre)},'${wall.tipo}',${wall.x_inicio_m},${wall.y_inicio_m},${wall.x_fin_m},${wall.y_fin_m},${wall.altura_m});`);
    const materialIds: number[] = [];
    for (const layer of wall.capas) { const materialId = next++; const layerId = next++; materialIds.push(layerId); lines.push(`#${materialId}=IFCMATERIAL('${layer.material}');`, `#${layerId}=IFCMATERIALLAYER(#${materialId},${layer.espesor_m},${step(layer.nombre)});`); }
    lines.push(`#${next++}=IFCMATERIALLAYERSET('${wall.id}:LAYERSET',${step(wall.nombre)},(${materialIds.map((value) => `#${value}`).join(",")}));`);
    const propId = next++; lines.push(`#${propId}=IFCPROPERTYSET('${wall.id}:PSET',${step(wall.nombre)},'Metrados y trazabilidad',('m2_muro',${wall.metrado.m2_muro},'m3_muro',${wall.metrado.m3_muro},'partidas',${wall.partidas.map((item) => item.codigo).join("|")},'especialidad','${wall.especialidad_principal}'));`);
    lines.push(`#${next++}=IFCRELDEFINESBYPROPERTIES('${wall.id}:PROPS',${step(wall.nombre)},(#${wallId}),#${propId});`);
  }
  const elementRefs: number[] = [...wallRefs];
  const emit = (element: StructuralElement) => { const ref = next++; elementRefs.push(ref); const entity = element.kind === "column" ? "IFCCOLUMN" : element.kind === "beam" ? "IFCBEAM" : element.kind === "slab" ? "IFCSLAB" : element.kind === "foundation" ? "IFCFOOTING" : element.kind === "door" ? "IFCDOOR" : element.kind === "window" ? "IFCWINDOW" : element.kind === "stair" ? "IFCSTAIR" : element.kind === "roof" ? "IFCROOF" : element.kind === "partition" ? "IFCWALLSTANDARDCASE" : "IFCSLAB"; lines.push(`#${ref}=${entity}(${step(ifcGuid(element.id))},${step(element.name)},'${element.kind}',${element.level});`); const prop = next++; lines.push(`#${prop}=IFCPROPERTYSET(${step(ifcGuid(`${element.id}:pset`))},${step(element.name)},'ARKI_ElementData',('area_m2',${element.quantity.areaM2},'volume_m3',${element.quantity.volumeM3},'weight_kg',${element.quantity.weightKg},'partidas',${element.costs.map((item) => item.code).join("|")},'specialty','${element.specialty}'));`, `#${next++}=IFCRELDEFINESBYPROPERTIES(${step(ifcGuid(`${element.id}:props`))},${step(element.name)},(#${ref}),#${prop});`); };
  [...model.foundations, ...model.columns, ...model.beams, ...model.slabs, ...model.doors, ...model.windows, ...model.stairs, ...model.floors, ...model.roofs, ...model.partitions].forEach(emit);
  for (const space of model.spaces) { const spaceRef = next++; lines.push(`#${spaceRef}=IFCSPACE('${space.id}',${step(space.nombre)},'${space.funcion}',${space.nivel_piso},${space.area_m2},${space.altura_libre_m});`); }
  for (const relation of model.relations) lines.push(`#${next++}=IFCRELASSOCIATES('${relation.id}',${step(relation.description)},'${relation.relation}','${relation.fromId}','${relation.toId}');`);
  lines.push(`#${next++}=IFCRELCONTAINEDINSPATIALSTRUCTURE('REL-CONTAINED','Elementos constructivos contenidos en niveles',(${elementRefs.map((value) => `#${value}`).join(",")}),#${storeyId});`, "ENDSEC;END-ISO-10303-21;");
  return { fileName: `${metadata.familyId}-construction-semantic.ifc`, mimeType: "application/x-step", content: lines.join("\n"), metadata: { schema: "ARKI-IFC4-SEMANTIC-CONSTRUCTION-1.0", entities: ["IFCWALL", "IFCWALLSTANDARDCASE", "IFCCOLUMN", "IFCBEAM", "IFCSLAB", "IFCFOOTING", "IFCDOOR", "IFCWINDOW", "IFCSTAIR", "IFCROOF", "IFCSPACE", "IFCMATERIALLAYER", "IFCPROPERTYSET", "IFCRELAGGREGATES", "IFCRELCONTAINEDINSPATIALSTRUCTURE"], wallCount: model.walls.length, elementCount: elementRefs.length, conceptualGeometryOnly: true, nativeRvt: false } };
}
function step(value: unknown) { return `'${String(value ?? "").replace(/'/g, "''")}'`; }
function ifcGuid(key: string) { let hash = 2166136261; for (let index = 0; index < key.length; index += 1) hash = Math.imul(hash ^ key.charCodeAt(index), 16777619); const hex = (hash >>> 0).toString(16).padStart(8, "0").toUpperCase(); return `${hex}ARKI${key.replace(/[^A-Z0-9]/gi, "").slice(0, 14).toUpperCase()}`.slice(0, 22); }

export function constructionSummary(model: ConstructionModel) { return { ...model.summary, budgetFormatted: `S/ ${model.summary.totalBudgetPen.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`, ontology: model.ontologyLevel }; }
