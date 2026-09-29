import type { VerticalExceptionKind } from "./arkiVerticalDecision";

export type VerticalSystemKind = "LEVEL_BASED" | "SPECIAL_VOLUME" | "HYBRID";

export type VerticalLevel = {
  levelId: string;
  name: string;
  members: string[];
  elevationDecisionId: string;
  floorToFloorDecisionId?: string;
  clearHeightDecisionId?: string;
};

export type SpecialVolumeArchitecturalBase = {
  kind: "LEVEL_BASE";
  levelId: string;
  authorization: "ELEVATION_AS_BASE";
};

export type VerticalSpecialVolume = {
  volumeId: string;
  kind: VerticalExceptionKind;
  members: string[];
  volumeDecisionId?: string;
  architecturalBase?: SpecialVolumeArchitecturalBase;
};

export type VerticalSystem = {
  systemId: string;
  kind: VerticalSystemKind;
  levels?: VerticalLevel[];
  specialVolumes?: VerticalSpecialVolume[];
  provenance: string[];
};


export type BaseElevationProvenance = {
  kind: "LEVEL_INHERITANCE_DECLARED";
  volumeId: string;
  levelId: string;
  levelDecisionId: string;
  declarationId: string;
};

export type VerticalExtentProvenance = {
  kind: "SPECIAL_VERTICAL";
  volumeId: string;
  decisionId: string;
};

export type ResolvedVerticalGeometry = {
  baseElevation_mm: number;
  verticalExtent_mm: number;
  baseElevationProvenance: BaseElevationProvenance;
  verticalExtentProvenance: VerticalExtentProvenance;
};
