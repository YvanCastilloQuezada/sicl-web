// ARKI — Construction DTOs
// Entrega 1A — serialización del modelo constructivo.
// WallDTO replica exactamente la forma de Muro.to_dict().
// No añade campos por diseño. No elimina campos existentes.

import {
  Muro,
  type CapaMuro,
  type Acabado,
  type Abertura,
  type Metrado,
  type PartidaPresupuestal,
  type Interferencia,
  type EstadoMuro,
  type FuncionMuro,
  type TipoMuro,
  type Especialidad,
  type ConstructionModel,
  type ConstructionSpace,
  type ScheduleTask,
  type ApuPartida,
} from "./arkiConstructionOntology";
import type { ElementRelation, StructuralElement } from "./arkiConstructionElements";

// Réplica exacta de Muro.to_dict().
// Si Muro.to_dict() cambia, este tipo y sus conversiones deben actualizarse.
export type WallDTO = {
  id: string;
  proyecto_id: string;
  nombre: string;
  funcion: FuncionMuro;
  tipo: TipoMuro;
  especialidad_principal: Especialidad;
  geometria: {
    x_inicio: number;
    y_inicio: number;
    x_fin: number;
    y_fin: number;
    altura: number;
    nivel_piso: number;
    longitud: number;
    espesor_total: number;
  };
  capas: CapaMuro[];
  acabados: Acabado[];
  aberturas: Abertura[];
  metrado: Metrado;
  partidas: PartidaPresupuestal[];
  interferencias: Interferencia[];
  estado: EstadoMuro;
  version: number;
  creado: string;
  notas: string;
  metadata: Record<string, unknown>;
};

// Paralelo a ConstructionModel con WallDTO[] en lugar de Muro[].
export type ConstructionModelDTO = {
  schema: "ARKI-CONSTRUCTION-MODEL-1.0";
  projectId: string;
  generatedAt: string;
  ontologyLevel: "CONSTRUCTIVE_ELEMENTS";
  spaces: ConstructionSpace[];
  walls: WallDTO[];
  foundations: StructuralElement[];
  columns: StructuralElement[];
  beams: StructuralElement[];
  slabs: StructuralElement[];
  doors: StructuralElement[];
  windows: StructuralElement[];
  stairs: StructuralElement[];
  floors: StructuralElement[];
  roofs: StructuralElement[];
  partitions: StructuralElement[];
  relations: ElementRelation[];
  schedule: ScheduleTask[];
  apuDatabase: ApuPartida[];
  summary: ConstructionModel["summary"];
  gates: ConstructionModel["gates"];
};

export function wallToDTO(wall: Muro): WallDTO {
  // LIMITACIÓN 1A: cast de tipo, sin validación estructural.
  // El test-serialization.ts verifica identidad contra Muro.to_dict().
  // Endurecer con validación de esquema en entrega posterior con ADR.
  return wall.to_dict() as WallDTO;
}

export function wallFromDTO(dto: WallDTO): Muro {
  const wall = new Muro({
    id: dto.id,
    proyecto_id: dto.proyecto_id,
    nombre: dto.nombre,
    funcion: dto.funcion,
    tipo: dto.tipo,
    especialidad_principal: dto.especialidad_principal,
    x_inicio_m: dto.geometria.x_inicio,
    y_inicio_m: dto.geometria.y_inicio,
    x_fin_m: dto.geometria.x_fin,
    y_fin_m: dto.geometria.y_fin,
    altura_m: dto.geometria.altura,
    nivel_piso: dto.geometria.nivel_piso,
  });
  wall.capas = dto.capas.map((capa) => ({ ...capa }));
  wall.acabados = dto.acabados.map((acabado) => ({ ...acabado }));
  wall.aberturas = dto.aberturas.map((abertura) => ({ ...abertura }));
  wall.metrado = { ...dto.metrado };
  wall.partidas = dto.partidas.map((partida) => ({ ...partida }));
  wall.interferencias = dto.interferencias.map((interferencia) => ({ ...interferencia }));
  wall.estado = dto.estado;
  wall.version = dto.version;
  wall.creado = dto.creado;
  wall.notas = dto.notas;
  wall.metadata = { ...dto.metadata };
  return wall;
}

export function constructionModelToDTO(model: ConstructionModel): ConstructionModelDTO {
  return {
    schema: model.schema,
    projectId: model.projectId,
    generatedAt: model.generatedAt,
    ontologyLevel: model.ontologyLevel,
    spaces: model.spaces,
    walls: model.walls.map(wallToDTO),
    foundations: model.foundations,
    columns: model.columns,
    beams: model.beams,
    slabs: model.slabs,
    doors: model.doors,
    windows: model.windows,
    stairs: model.stairs,
    floors: model.floors,
    roofs: model.roofs,
    partitions: model.partitions,
    relations: model.relations,
    schedule: model.schedule,
    apuDatabase: model.apuDatabase,
    summary: model.summary,
    gates: model.gates,
  };
}

export function constructionModelFromDTO(dto: ConstructionModelDTO): ConstructionModel {
  return {
    schema: dto.schema,
    projectId: dto.projectId,
    generatedAt: dto.generatedAt,
    ontologyLevel: dto.ontologyLevel,
    spaces: dto.spaces,
    walls: dto.walls.map(wallFromDTO),
    foundations: dto.foundations,
    columns: dto.columns,
    beams: dto.beams,
    slabs: dto.slabs,
    doors: dto.doors,
    windows: dto.windows,
    stairs: dto.stairs,
    floors: dto.floors,
    roofs: dto.roofs,
    partitions: dto.partitions,
    relations: dto.relations,
    schedule: dto.schedule,
    apuDatabase: dto.apuDatabase,
    summary: dto.summary,
    gates: dto.gates,
  };
}
