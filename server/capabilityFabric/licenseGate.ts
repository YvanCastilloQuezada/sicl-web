import type { EcosystemAsset, HarvestDisposition } from "./ecosystemHarvest";

export type LicenseGateDecision =
  | "REUSE_ALLOWED"
  | "EXTERNAL_ONLY"
  | "REFERENCE_ONLY"
  | "BLOCKED_UNKNOWN";

export type LicenseGateResult = {
  assetId: string;
  decision: LicenseGateDecision;
  atlasEligible: boolean;
  executableIntegrationAllowed: boolean;
  cleanRoomRequired: boolean;
  reason: string;
};

const COPYLEFT_REFERENCE_ONLY = new Set(["GPL-2.0", "GPL-3.0", "AGPL-3.0"]);

export function evaluateHarvestLicense(asset: EcosystemAsset): LicenseGateResult {
  if (!asset.licenseVerified || !asset.licenseSpdx) {
    return {
      assetId: asset.assetId,
      decision: "BLOCKED_UNKNOWN",
      atlasEligible: true,
      executableIntegrationAllowed: false,
      cleanRoomRequired: false,
      reason: "License is not verified; metadata/reference may be catalogued but code integration is blocked.",
    };
  }

  if (COPYLEFT_REFERENCE_ONLY.has(asset.licenseSpdx)) {
    return {
      assetId: asset.assetId,
      decision: "REFERENCE_ONLY",
      atlasEligible: true,
      executableIntegrationAllowed: false,
      cleanRoomRequired: true,
      reason: "Strong copyleft source is reference-only under the current ARKI policy; independent reimplementation requires clean-room evidence.",
    };
  }

  if (asset.disposition === "REFERENCE_ONLY") {
    return {
      assetId: asset.assetId,
      decision: "REFERENCE_ONLY",
      atlasEligible: true,
      executableIntegrationAllowed: false,
      cleanRoomRequired: false,
      reason: "Harvest disposition explicitly forbids executable integration.",
    };
  }

  if (asset.disposition === "EXTERNAL_HOST") {
    return {
      assetId: asset.assetId,
      decision: "EXTERNAL_ONLY",
      atlasEligible: true,
      executableIntegrationAllowed: true,
      cleanRoomRequired: false,
      reason: "Capability may execute only across its declared external-host boundary.",
    };
  }

  return {
    assetId: asset.assetId,
    decision: "REUSE_ALLOWED",
    atlasEligible: true,
    executableIntegrationAllowed: true,
    cleanRoomRequired: false,
    reason: "Verified license and harvest disposition permit bounded reuse/adaptation.",
  };
}

export function assertExecutableHarvest(asset: EcosystemAsset): void {
  const gate = evaluateHarvestLicense(asset);
  if (!gate.executableIntegrationAllowed) {
    throw new Error(`LICENSE_GATE_BLOCKED:${asset.assetId}:${gate.decision}`);
  }
}
