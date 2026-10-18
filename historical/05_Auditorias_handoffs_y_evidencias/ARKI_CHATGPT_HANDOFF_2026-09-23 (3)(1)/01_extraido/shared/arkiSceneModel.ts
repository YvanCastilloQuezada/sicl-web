import type { StructuralElement } from "./arkiConstructionElements";
import type { ConstructionModel, ConstructionSpace, Muro } from "./arkiConstructionOntology";
import type { BimElementKind } from "./arkiBimSelection";

export type SceneNode = {
  id: string;
  kind: BimElementKind;
  category: string;
  level: number;
  position: [number, number, number];
  dimensions: [number, number, number];
  rotationY: number;
  color: string;
  opacity: number;
  selectable: boolean;
  relatedIds: string[];
};

export type SceneModel = {
  schema: "ARKI-SCENE-MODEL-1.0";
  projectId: string;
  nodes: SceneNode[];
  levels: number[];
  bounds: { widthM: number; depthM: number; heightM: number };
};

const COLORS: Record<string, string> = {
  wall: "#7b83b8",
  column: "#d9a441",
  beam: "#e8b45b",
  slab: "#4f8da8",
  foundation: "#596275",
  door: "#e07a5f",
  window: "#54c2d9",
  stair: "#b9a4d8",
  floor: "#53657d",
  roof: "#c96b5b",
  partition: "#9aa7b8",
  space: "#55c2a5",
};

function numberValue(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function sceneFromWall(wall: Muro): SceneNode {
  const dx = wall.x_fin_m - wall.x_inicio_m;
  const dy = wall.y_fin_m - wall.y_inicio_m;
  const length = Math.max(0.1, wall.longitud_m());
  return {
    id: wall.id,
    kind: "wall",
    category: "Muros",
    level: wall.nivel_piso,
    position: [(wall.x_inicio_m + wall.x_fin_m) / 2, wall.nivel_piso * 3.6 + wall.altura_m / 2, (wall.y_inicio_m + wall.y_fin_m) / 2],
    dimensions: [length, wall.altura_m, Math.max(0.08, wall.espesor_total_m())],
    rotationY: Math.atan2(dy, dx),
    color: COLORS.wall,
    opacity: 0.88,
    selectable: true,
    relatedIds: wall.aberturas.map((opening) => opening.id),
  };
}

function sceneFromElement(element: StructuralElement): SceneNode {
  const geometry = element.geometry;
  const x = numberValue(geometry.x, numberValue(geometry.widthM, 0) / 2);
  const z = numberValue(geometry.y, numberValue(geometry.depthM, 0) / 2);
  const width = numberValue(geometry.widthM, numberValue(geometry.lengthM, element.kind === "door" || element.kind === "window" ? 0.9 : 1));
  const depth = numberValue(geometry.depthM, numberValue(geometry.thicknessM, element.kind === "column" ? 0.3 : 0.2));
  const height = numberValue(geometry.heightM, element.kind === "slab" || element.kind === "floor" ? 0.2 : element.kind === "stair" ? 1.5 : 3.6);
  const dimensions: [number, number, number] = [Math.max(0.08, width), Math.max(0.08, height), Math.max(0.08, depth)];
  return {
    id: element.id,
    kind: element.kind,
    category: element.kind === "column" || element.kind === "beam" || element.kind === "slab" || element.kind === "foundation" ? "Estructura" : "Elementos constructivos",
    level: element.level,
    position: [x, element.level * 3.6 + height / 2, z],
    dimensions,
    rotationY: geometry.axis === "Y" ? Math.PI / 2 : 0,
    color: COLORS[element.kind] ?? "#8aa0b7",
    opacity: element.kind === "window" ? 0.42 : 0.82,
    selectable: true,
    relatedIds: element.tracesTo,
  };
}

function sceneFromSpace(space: ConstructionSpace, widthM: number, depthM: number): SceneNode {
  const side = Math.max(1, Math.sqrt(Math.max(1, space.area_m2)));
  return {
    id: space.id,
    kind: "space",
    category: "Zonas",
    level: space.nivel_piso,
    position: [widthM / 2, space.nivel_piso * 3.6 + space.altura_libre_m / 2, depthM / 2],
    dimensions: [side, Math.max(0.1, space.altura_libre_m), side],
    rotationY: 0,
    color: COLORS.space,
    opacity: 0.12,
    selectable: true,
    relatedIds: space.wallIds,
  };
}

export function sceneModelFromConstruction(model: ConstructionModel): SceneModel {
  const structural = [
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
  ];
  const footprintWidthM = Math.max(...model.walls.map((wall) => Math.max(wall.x_inicio_m, wall.x_fin_m)), 1);
  const footprintDepthM = Math.max(...model.walls.map((wall) => Math.max(wall.y_inicio_m, wall.y_fin_m)), 1);
  const nodes = [...model.walls.map(sceneFromWall), ...model.spaces.map((space) => sceneFromSpace(space, footprintWidthM, footprintDepthM)), ...structural.map(sceneFromElement)];
  const widthM = Math.max(...nodes.map((node) => node.position[0] + node.dimensions[0] / 2), 1);
  const depthM = Math.max(...nodes.map((node) => node.position[2] + node.dimensions[2] / 2), 1);
  const heightM = Math.max(...nodes.map((node) => node.position[1] + node.dimensions[1] / 2), 3.6);
  return {
    schema: "ARKI-SCENE-MODEL-1.0",
    projectId: model.projectId,
    nodes,
    levels: Array.from(new Set(nodes.map((node) => node.level))).sort((a, b) => a - b),
    bounds: { widthM, depthM, heightM },
  };
}
