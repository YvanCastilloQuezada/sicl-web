import type { IntegratedArchitectCycle } from "../../arkiIntegratedArchitectCycle";
import { generateAdvancedGeometry, type ComplexGeometry } from "../../arkiAdvancedGeometry";
import type { DynamicParti } from "../../arkiProjectBrain";
import type { RenderData, RenderMaterial, RenderVertex, RenderFace, RenderCamera, RenderLighting } from "./types";

function materialFromSustainability(materialId: string): RenderMaterial {
  const isGlass = materialId.includes("glass");
  const isMetal = materialId.includes("steel") || materialId.includes("aluminium");
  const isWood = materialId.includes("timber");
  const isInsulation = materialId.includes("insulation");
  const isVegetation = materialId.includes("vegetation");

  if (isGlass) return { id: materialId, type: "glass", color: "#88ccff", roughness: 0.05, metalness: 0.0, transmission: 0.9 };
  if (isMetal) return { id: materialId, type: "metal", color: "#cccccc", roughness: 0.3, metalness: 0.9 };
  if (isWood) return { id: materialId, type: "wood", color: "#8b5a2b", roughness: 0.7, metalness: 0.0 };
  if (isInsulation) return { id: materialId, type: "concrete", color: "#a0a0a0", roughness: 0.9, metalness: 0.0 };
  if (isVegetation) return { id: materialId, type: "vegetation", color: "#4a7c3f", roughness: 0.95, metalness: 0.0 };
  return { id: materialId, type: "concrete", color: "#999999", roughness: 0.8, metalness: 0.0 };
}

function conceptFromParti(parti: DynamicParti): ComplexGeometry["concept"] {
  switch (parti.flowStrategy) {
    case "linear-separation": return "TWISTED_TOWER";
    case "central-hub":       return "FOLDED_COURTYARD";
    case "nested-rings":      return "BRANCHING_CANOPY";
    default:                  return "CUSTOM_PARAMETRIC";
  }
}

function geometryParamsFromCycle(cycle: IntegratedArchitectCycle, parti: DynamicParti): Record<string, number> {
  const width = 40;
  const height = 60;
  const floorHeight = 3.2;
  const floors = Math.max(2, Math.round(height / floorHeight));
  const radius = Math.min(width, height) / 2;
  const sides = parti.flowStrategy === "nested-rings" ? 12 : 16;
  const twistRadians = parti.flowStrategy === "linear-separation" ? Math.PI / 3 : 0;
  return { floors, sides, radius, twistRadians, floorHeight };
}

function complexGeometryToRender(geom: ComplexGeometry, materialId: string): { vertices: RenderVertex[]; faces: RenderFace[] } {
  const vertices: RenderVertex[] = geom.vertices.map((v) => [v.x, v.y, v.z]);
  const faces: RenderFace[] = geom.faces.map((f) => ({ vertices: f as [number, number, number], materialId }));
  return { vertices, faces };
}

function allMaterialsFromCycle(cycle: IntegratedArchitectCycle): RenderMaterial[] {
  const sustainability = cycle.evaluation.engines["sustainability"];
  let materialIds: string[] = [];
  if (sustainability && typeof sustainability.values === "object") {
    const values = sustainability.values as Record<string, unknown>;
    if (Array.isArray(values.materials)) {
      materialIds = values.materials.filter((m): m is string => typeof m === "string");
    } else if (typeof values.principal_material === "string") {
      materialIds = [values.principal_material];
    }
  }
  if (materialIds.length === 0) {
    materialIds = ["glass-double", "steel-rebar", "concrete-c30"];
  }
  return materialIds.map(materialFromSustainability);
}

function lightingFromContext(cycle: IntegratedArchitectCycle): RenderLighting {
  const context = (cycle.reasoning as unknown as { context?: Record<string, unknown> })?.context ?? {};
  const sunAzimuth = typeof context.sun_azimuth_deg === "number" ? context.sun_azimuth_deg : 240;
  const sunElevation = typeof context.sun_elevation_deg === "number" ? context.sun_elevation_deg : 5;
  return { hdri: "blue_hour", sunAzimuthDeg: sunAzimuth, sunElevationDeg: sunElevation };
}

function defaultCameras(scale: number): RenderCamera[] {
  return [
    { id: "perspective", position: [scale * 1.5, scale * 1.0, scale * 1.5], target: [0, scale * 0.4, 0], fov: 45 },
    { id: "axonometric", position: [scale * 2, scale * 2, scale * 2], target: [0, scale * 0.4, 0], fov: 35 },
    { id: "pedestrian", position: [scale * 0.8, scale * 0.1, scale * 1.2], target: [0, scale * 0.5, 0], fov: 60 },
    { id: "aerial", position: [0, scale * 3, 0.01], target: [0, 0, 0], fov: 30 },
  ];
}

export function exportRenderDataForParti(cycle: IntegratedArchitectCycle, parti: DynamicParti): RenderData {
  const concept = conceptFromParti(parti);
  const params = geometryParamsFromCycle(cycle, parti);
  const geom = generateAdvancedGeometry(concept, params);
  const materials = allMaterialsFromCycle(cycle);
  const primaryMaterialId = materials[0]?.id ?? "glass-double";
  const { vertices, faces } = complexGeometryToRender(geom, primaryMaterialId);
  const maxCoord = Math.max(...vertices.flatMap((v) => v.map(Math.abs)), 1);

  return {
    projectId: cycle.project.projectId,
    typology: cycle.project.typology,
    vertices,
    faces,
    materials,
    cameras: defaultCameras(maxCoord),
    lighting: lightingFromContext(cycle),
    partiId: parti.id,
    flowStrategy: parti.flowStrategy,
    organizingIdea: parti.organizingIdea,
  };
}

export function exportRenderDataForAllPartis(cycle: IntegratedArchitectCycle): RenderData[] {
  return cycle.projectPartis.map((parti) => exportRenderDataForParti(cycle, parti));
}

export function exportRenderData(cycle: IntegratedArchitectCycle): RenderData {
  if (cycle.projectPartis.length > 0) {
    return exportRenderDataForParti(cycle, cycle.projectPartis[0]);
  }
  return exportRenderDataForParti(cycle, {
    id: "PARTI-DEFAULT",
    title: "Default",
    organizingIdea: "Default parti",
    rules: [],
    flowStrategy: "linear-separation",
    derivedFrom: [],
    status: "AI_PROPOSED",
    humanReviewRequired: true,
  });
}
