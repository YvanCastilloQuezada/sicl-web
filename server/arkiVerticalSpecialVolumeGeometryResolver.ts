import type { VerticalDecision } from "../shared/arkiVerticalDecision";
import type {
  ResolvedVerticalGeometry,
  VerticalLevel,
  VerticalSpecialVolume,
} from "../shared/arkiVerticalSystem";

export type ResolutionFailureCode =
  | "SPECIAL_VOLUME_ARCHITECTURAL_BASE_AUTHORIZATION_INVALID"
  | "SPECIAL_VOLUME_ARCHITECTURAL_BASE_AUTHORIZATION_NOT_SUPPORTED"
  | "SPECIAL_VOLUME_ARCHITECTURAL_BASE_KIND_INVALID"
  | "SPECIAL_VOLUME_ARCHITECTURAL_BASE_LEVEL_NOT_FOUND"
  | "SPECIAL_VOLUME_BASE_ELEVATION_DECISION_NOT_FOUND"
  | "SPECIAL_VOLUME_BASE_ELEVATION_DECISION_TARGET_MISMATCH"
  | "SPECIAL_VOLUME_BASE_ELEVATION_DECISION_KIND_MISMATCH"
  | "SPECIAL_VOLUME_BASE_ELEVATION_DECISION_NOT_RESOLVED"
  | "SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_MISSING"
  | "SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_NOT_INTEGER"
  | "SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_NOT_FINITE"
  | "SPECIAL_VOLUME_EXTENT_DECISION_NOT_FOUND"
  | "SPECIAL_VOLUME_EXTENT_DECISION_TARGET_MISMATCH"
  | "SPECIAL_VOLUME_EXTENT_DECISION_KIND_MISMATCH"
  | "SPECIAL_VOLUME_EXTENT_DECISION_NOT_RESOLVED"
  | "SPECIAL_VOLUME_EXTENT_DECISION_VALUE_MISSING"
  | "SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_INTEGER"
  | "SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_FINITE"
  | "SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_POSITIVE"
  | "SPECIAL_VOLUME_INDEPENDENT_DATUM_PENDING";

export type ResolutionFailure = { ok: false; code: ResolutionFailureCode };
export type ResolutionSuccess = { ok: true; value: ResolvedVerticalGeometry };
export type SpecialVolumeGeometryResolution = ResolutionSuccess | ResolutionFailure;

const fail = (code: ResolutionFailureCode): ResolutionFailure => ({ ok: false, code });

const encode = (value: string): string => `${value.length}:${value}`;

export function canonicalDeclarationId(input: { volumeId: string; levelId: string }): string {
  return `SVA_BASE_V1|${encode(input.volumeId)}|LEVEL_BASE|${encode(input.levelId)}|ELEVATION_AS_BASE`;
}

export function resolveSpecialVolumeGeometry(
  volume: VerticalSpecialVolume,
  levels: ReadonlyMap<string, VerticalLevel>,
  decisions: ReadonlyMap<string, VerticalDecision>,
): SpecialVolumeGeometryResolution {
  const base = volume.architecturalBase;
  if (base === undefined) return fail("SPECIAL_VOLUME_INDEPENDENT_DATUM_PENDING");

  if (base.kind !== "LEVEL_BASE") {
    return fail("SPECIAL_VOLUME_ARCHITECTURAL_BASE_KIND_INVALID");
  }

  // V1 recognizes only ELEVATION_AS_BASE. A different well-formed string is a
  // future-version/unsupported vocabulary value, not evidence of support elsewhere.
  const authorization = (base as unknown as { authorization?: unknown }).authorization;
  if (typeof authorization !== "string") {
    return fail("SPECIAL_VOLUME_ARCHITECTURAL_BASE_AUTHORIZATION_INVALID");
  }
  if (authorization !== "ELEVATION_AS_BASE") {
    return fail("SPECIAL_VOLUME_ARCHITECTURAL_BASE_AUTHORIZATION_NOT_SUPPORTED");
  }

  const level = levels.get(base.levelId);
  if (!level) return fail("SPECIAL_VOLUME_ARCHITECTURAL_BASE_LEVEL_NOT_FOUND");

  const elevation = decisions.get(level.elevationDecisionId);
  if (!elevation) return fail("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_NOT_FOUND");
  if (elevation.target.kind !== "LEVEL" || elevation.target.levelId !== base.levelId) {
    return fail("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_TARGET_MISMATCH");
  }
  if (elevation.dimensionKind !== "ELEVATION") {
    return fail("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_KIND_MISMATCH");
  }
  if (elevation.status !== "RESOLVED") {
    return fail("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_NOT_RESOLVED");
  }
  if (elevation.selectedDimension_mm === null) {
    return fail("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_MISSING");
  }
  if (!Number.isFinite(elevation.selectedDimension_mm)) {
    return fail("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_NOT_FINITE");
  }
  if (!Number.isInteger(elevation.selectedDimension_mm)) {
    return fail("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_NOT_INTEGER");
  }

  if (!volume.volumeDecisionId) return fail("SPECIAL_VOLUME_EXTENT_DECISION_NOT_FOUND");
  const extent = decisions.get(volume.volumeDecisionId);
  if (!extent) return fail("SPECIAL_VOLUME_EXTENT_DECISION_NOT_FOUND");
  if (extent.target.kind !== "SPECIAL_VOLUME" || extent.target.volumeId !== volume.volumeId) {
    return fail("SPECIAL_VOLUME_EXTENT_DECISION_TARGET_MISMATCH");
  }
  if (extent.dimensionKind !== "SPECIAL_VERTICAL") {
    return fail("SPECIAL_VOLUME_EXTENT_DECISION_KIND_MISMATCH");
  }
  if (extent.status !== "RESOLVED") {
    return fail("SPECIAL_VOLUME_EXTENT_DECISION_NOT_RESOLVED");
  }
  if (extent.selectedDimension_mm === null) {
    return fail("SPECIAL_VOLUME_EXTENT_DECISION_VALUE_MISSING");
  }
  if (!Number.isFinite(extent.selectedDimension_mm)) {
    return fail("SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_FINITE");
  }
  if (!Number.isInteger(extent.selectedDimension_mm)) {
    return fail("SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_INTEGER");
  }
  if (extent.selectedDimension_mm <= 0) {
    return fail("SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_POSITIVE");
  }

  return {
    ok: true,
    value: {
      baseElevation_mm: elevation.selectedDimension_mm,
      verticalExtent_mm: extent.selectedDimension_mm,
      baseElevationProvenance: {
        kind: "LEVEL_INHERITANCE_DECLARED",
        volumeId: volume.volumeId,
        levelId: base.levelId,
        levelDecisionId: elevation.decisionId,
        declarationId: canonicalDeclarationId({ volumeId: volume.volumeId, levelId: base.levelId }),
      },
      verticalExtentProvenance: {
        kind: "SPECIAL_VERTICAL",
        volumeId: volume.volumeId,
        decisionId: extent.decisionId,
      },
    },
  };
}
