import { describe, expect, it } from "vitest";
import { ecosystemAssets } from "./ecosystemHarvest";
import { assertExecutableHarvest, evaluateHarvestLicense } from "./licenseGate";

describe("harvest license gate", () => {
  const asset = (id: string) => {
    const found = ecosystemAssets().find(item => item.assetId === id);
    if (!found) throw new Error(`TEST_ASSET_NOT_FOUND:${id}`);
    return found;
  };

  it("allows verified permissive reuse", () => {
    expect(evaluateHarvestLicense(asset("dynashape")).decision).toBe("REUSE_ALLOWED");
    expect(() => assertExecutableHarvest(asset("dynashape"))).not.toThrow();
  });

  it("blocks unknown licenses from executable integration", () => {
    const gate = evaluateHarvestLicense(asset("archicad-gdl"));
    expect(gate.decision).toBe("BLOCKED_UNKNOWN");
    expect(gate.atlasEligible).toBe(true);
    expect(gate.executableIntegrationAllowed).toBe(false);
  });

  it("keeps AGPL harvest reference-only and requires clean-room evidence for reimplementation", () => {
    const gate = evaluateHarvestLicense(asset("floorplan6"));
    expect(gate.decision).toBe("REFERENCE_ONLY");
    expect(gate.cleanRoomRequired).toBe(true);
    expect(() => assertExecutableHarvest(asset("floorplan6"))).toThrow(
      "LICENSE_GATE_BLOCKED:floorplan6:REFERENCE_ONLY",
    );
  });
});
