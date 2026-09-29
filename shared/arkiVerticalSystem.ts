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

export type VerticalSpecialVolume = {
  volumeId: string;
  kind: VerticalExceptionKind;
  members: string[];
  volumeDecisionId?: string;
};

export type VerticalSystem = {
  systemId: string;
  kind: VerticalSystemKind;
  levels?: VerticalLevel[];
  specialVolumes?: VerticalSpecialVolume[];
  provenance: string[];
};
