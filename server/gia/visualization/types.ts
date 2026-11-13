export type RenderVertex = [number, number, number];

export type RenderFace = {
  vertices: [number, number, number];
  materialId: string;
};

export type RenderMaterial = {
  id: string;
  type: "glass" | "metal" | "concrete" | "wood" | "vegetation" | "emissive";
  color: string;
  roughness: number;
  metalness: number;
  transmission?: number;
  emissive?: { color: string; intensity: number };
};

export type RenderCamera = {
  id: "perspective" | "axonometric" | "pedestrian" | "aerial";
  position: RenderVertex;
  target: RenderVertex;
  fov: number;
};

export type RenderLighting = {
  hdri: "blue_hour" | "daylight" | "overcast";
  sunAzimuthDeg: number;
  sunElevationDeg: number;
};

export type RenderData = {
  projectId: string;
  typology: string;
  vertices: RenderVertex[];
  faces: RenderFace[];
  materials: RenderMaterial[];
  cameras: RenderCamera[];
  lighting: RenderLighting;
  partiId: string;
  flowStrategy: string;
  organizingIdea: string;
};
