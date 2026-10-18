import { describe, expect, it } from "vitest";
import { createManifestFixture } from "./tvManifest";
import { projectShowState } from "./showState";

describe("ShowState projection", () => {
  it("projects an open manifest consistently for TV and mobile", () => {
    const state = projectShowState(createManifestFixture("OPEN"));
    expect(state.currentPhase).toBe("INTERACTION");
    expect(state.qrState).toBe("AVAILABLE");
    expect(state.mobileState).toBe("CONTROLLER");
    expect(state.authoritativeSource).toBe("MJP_CORE");
    expect(state.virtualOnly).toBe(true);
  });
  it("does not claim a QR when the manifest is completed", () => {
    const state = projectShowState(createManifestFixture("COMPLETED"));
    expect(state.currentPhase).toBe("RESULT");
    expect(state.qrState).toBe("UNAVAILABLE");
    expect(state.countdown).toBeNull();
  });
});
