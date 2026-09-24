import { describe, expect, it } from "vitest";
import { createSuperArchitectModel, defaultSuperArchitectInputs } from "../shared/arkiSuperArchitectModel";

describe("ARKI Super-Architect model", () => {
  it("propagates site and program changes deterministically", () => {
    const base = createSuperArchitectModel(defaultSuperArchitectInputs);
    const changed = createSuperArchitectModel({ ...defaultSuperArchitectInputs, floors: 8, occupancy: 1200, setbacksM: 14, gridSpanM: 6 });
    expect(changed.totalHeightM).toBeGreaterThan(base.totalHeightM);
    expect(changed.builtAreaM2).toBeCloseTo((changed.buildableFootprintM2 - changed.courtyardM2) * changed.inputs.floors, 0);
    expect(changed.estimatedWaterM3Day).toBeGreaterThan(base.estimatedWaterM3Day);
    expect(changed.estimatedPowerKW).toBeGreaterThan(base.estimatedPowerKW);
    expect(changed.structuralBays.x).toBeGreaterThanOrEqual(base.structuralBays.x);
    expect(changed.propagation.length).toBeGreaterThan(3);
  });

  it("fails closed with a blocker when setbacks consume the site", () => {
    const model = createSuperArchitectModel({ ...defaultSuperArchitectInputs, siteWidthM: 20, siteDepthM: 20, setbacksM: 20 });
    expect(model.alerts.some((alert) => alert.code === "NO_BUILDABLE_AREA" && alert.severity === "BLOCKER")).toBe(true);
  });
});
