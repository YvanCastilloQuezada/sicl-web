export type AgkFeatureKind = "EXTRUDE_RECTANGLE" | "EXTRUDE_POLYGON" | "EXTRUDE_CIRCLE" | "MULTI_SOLID" | "FLOATING_SLAB" | "EXTRUDE_ARC" | "SLOPED_ROOF" | "VOID_EXTRUSION";

export type AgkExtrudeRectangleParameters = {
  width_mm: number;
  depth_mm: number;
  height_mm: number;
  x_mm: number;
  y_mm: number;
  z_mm: number;
};

export type AgkFeatureParameterName = keyof AgkExtrudeRectangleParameters;

export interface AgkFeatureExtrudeRectangle {
  featureId: string;
  kind: "EXTRUDE_RECTANGLE";
  producesObjectId: string;
  parameters: AgkExtrudeRectangleParameters;
  inputFeatureIds: readonly string[];
}

export interface AgkFeatureExtrudePolygon {
  featureId: string;
  kind: "EXTRUDE_POLYGON";
  producesObjectId: string;
  parameters: {
    polygon_mm: Array<{ x_mm: number; y_mm: number }>;
    voids_mm: Array<Array<{ x_mm: number; y_mm: number }>>;
    height_mm: number;
    x_mm: number;
    y_mm: number;
    z_mm: number;
  };
  inputFeatureIds: readonly string[];
}

export interface AgkFeatureExtrudeCircle {
  featureId: string;
  kind: "EXTRUDE_CIRCLE";
  producesObjectId: string;
  parameters: {
    radius_mm: number;
    height_mm: number;
    x_mm: number;
    y_mm: number;
    z_mm: number;
  };
  inputFeatureIds: readonly string[];
}

export interface AgkFeatureMultiSolid {
  featureId: string;
  kind: "MULTI_SOLID";
  producesObjectId: string;
  parameters: {
    solids: Array<{
      width_mm: number;
      depth_mm: number;
      height_mm: number;
      x_mm: number;
      y_mm: number;
      z_mm: number;
    }>;
  };
  inputFeatureIds: readonly string[];
}

export interface AgkFeatureFloatingSlab {
  featureId: string;
  kind: "FLOATING_SLAB";
  producesObjectId: string;
  parameters: {
    width_mm: number;
    depth_mm: number;
    height_mm: number;
    thickness_mm: number;
    x_mm: number;
    y_mm: number;
    z_mm: number;
  };
  inputFeatureIds: readonly string[];
}

export interface AgkFeatureExtrudeArc {
  featureId: string;
  kind: "EXTRUDE_ARC";
  producesObjectId: string;
  parameters: {
    radius_mm: number;
    startAngle_rad: number;
    endAngle_rad: number;
    height_mm: number;
    x_mm: number;
    y_mm: number;
    z_mm: number;
  };
  inputFeatureIds: readonly string[];
}

export interface AgkFeatureSlopedRoof {
  featureId: string;
  kind: "SLOPED_ROOF";
  producesObjectId: string;
  parameters: {
    width_mm: number;
    depth_mm: number;
    height_mm: number;
    slopeAngle_rad: number;
    x_mm: number;
    y_mm: number;
    z_mm: number;
  };
  inputFeatureIds: readonly string[];
}

export interface AgkFeatureVoidExtrusion {
  featureId: string;
  kind: "VOID_EXTRUSION";
  producesObjectId: string;
  parameters: {
    outerPolygon_mm: Array<{ x_mm: number; y_mm: number }>;
    innerPolygons_mm: Array<Array<{ x_mm: number; y_mm: number }>>;
    height_mm: number;
    x_mm: number;
    y_mm: number;
    z_mm: number;
  };
  inputFeatureIds: readonly string[];
}

export type AgkFeature = AgkFeatureExtrudeRectangle | AgkFeatureExtrudePolygon | AgkFeatureExtrudeCircle | AgkFeatureMultiSolid | AgkFeatureFloatingSlab | AgkFeatureExtrudeArc | AgkFeatureSlopedRoof | AgkFeatureVoidExtrusion;

export interface AgkHostedOffsetConstraint {
  constraintId: string;
  kind: "HOSTED_TRANSLATION_OFFSET";
  hostObjectId: string;
  dependentObjectId: string;
  offset_mm: { x: number; y: number; z: number };
  requireWithinHostX: boolean;
}

export type AgkConstraint = AgkHostedOffsetConstraint;

export interface AgkCausalModel {
  features: readonly AgkFeature[];
  constraints: readonly AgkConstraint[];
}

export interface AgkRegenerationReport {
  rootChangedObjectIds: readonly string[];
  affectedObjectIds: readonly string[];
  affectedFeatureIds: readonly string[];
  evaluatedConstraintIds: readonly string[];
  regeneratedObjectIds: readonly string[];
  unchangedObjectIds: readonly string[];
  executionOrder: readonly string[];
}
