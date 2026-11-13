import type { IntegratedArchitectCycle } from "../../arkiIntegratedArchitectCycle";
import { generateAdvancedGeometry, type ComplexGeometry } from "../../arkiAdvancedGeometry";
import type { RenderData, RenderMaterial, RenderVertex, RenderFace, RenderCamera, RenderLighting } from "./types";

function materialFromSustainability(materialId: string): RenderMaterial {
  const isGlass = materialId.includes("glass");
  const isMetal = materialId.includes("steel") || materialId.includes("aluminium");
  const isWood = materialId.includes("timber");
  const isInsulation = materialId.includes("insulation");
  const isVegetation = materialId.includes("vegetation");

  if (isGlass) {
    return { id: materialId, type: "glass", color: "#88ccff", roughness: 0.05, metalness: 0.0, transmission: 0.9 };
  }
  if (isMetal) {
    return { id: materialId, type: "metal", color: "#cccccc", roughness: 0.3, metalness: 0.9 };
  }
  if (isWood) {
    return { id: materialId, type: "wood", color: "#8b5a2b", roughness: 0.7, metalness: 0.0 };
  }
  if (isInsulation) {
    return { id: materialId, type: "concrete", color: "#a0a0a0", roughness: 0.9, metalness: 0.0 };
  }
  if (isVegetation) {
    return { id: materialId, type: "vegetation", color: "#4a7c3f", roughness: 0.95, metalness: 0.0 };
  }
  return { id: materialId, type: "concrete", color: "#999999", roughness: 0.8, metalness: 0.0 };
}

function conceptForTypology(typology: string): ComplexGeometry["concept"] {
  if (typology === "rascacielos" || typology === "mixed-use-tower") return "TWISTED_TOWER";
  if (typology === "oficinas" || typology === "educativo") return "FOLDED_COURTYARD";
  if (typology === "cultural" || typology === "museo") return "BRANCHING_CANOPY";
  return "CUSTOM_PARAMETRIC";
}

function complexGeometryToRender(geom: ComplexGeometry, materialId: string): { vertices: RenderVertex[]; faces: RenderFace[] } {
  const vertices: RenderVertex[] = geom.vertices.map((v) => [v.x, v.y, v.z]);
  const faces: RenderFace[] = geom.faces.map((f) => ({
    vertices: f as [number, number, number],
    materialId,
  }));
  return { vertices, faces };
}

function principalMaterial(cycle: IntegratedArchitectCycle): string {
  const sustainability = cycle.evaluation.engines["sustainability"];
  if (sustainability && typeof sustainability.values === "object") {
    const values = sustainability.values as Record<string, unknown>;
    if (typeof values.principal_material === "string") return values.principal_material;
  }
  return "glass-double";
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

export function exportRenderData(cycle: IntegratedArchitectCycle): RenderData {
  const concept = conceptForTypology(cycle.project.typology);
  const materialId = principalMaterial(cycle);

  const geom = generateAdvancedGeometry(concept, {
    floors: 10,
    sides: 16,
    radius: 22,
    twistRadians: Math.PI / 2,
    floorHeight: 3.2,
  });

  const { vertices, faces } = complexGeometryToRender(geom, materialId);
  const material = materialFromSustainability(materialId);
  const maxCoord = Math.max(...vertices.flatMap((v) => v.map(Math.abs)), 1);

  return {
    projectId: cycle.project.projectId,
    typology: cycle.project.typology,
    vertices,
    faces,
    materials: [material],
    cameras: defaultCameras(maxCoord),
    lighting: lightingFromContext(cycle),
  };
}
