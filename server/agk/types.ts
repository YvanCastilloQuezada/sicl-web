export type AgkFeatureKind = "EXTRUDE_RECTANGLE";

export interface AgkFeature {
  featureId: string;
  kind: AgkFeatureKind;
  producesObjectId: string;
  parameters: {
    width_mm: number;
    depth_mm: number;
    height_mm: number;
    x_mm: number;
    y_mm: number;
    z_mm: number;
  };
  inputFeatureIds: readonly string[];
}

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
