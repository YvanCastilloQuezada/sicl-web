import { describe, expect, it } from "vitest";
import { enterContingency, resolveContingency } from "./contingencyEngine";

describe("Contingency Engine", () => {
  it("preserves the last confirmed event and never invents a result", () => {
    const state = enterContingency("YOUTUBE", { eventId: "RP-1", status: "RESULT_VERIFIED", gameName: "Lotería 39", result: [1, 2, 3], verified: true, capturedAt: 10 });
    expect(state.mode).toBe("CONTINGENCY");
    expect(state.lastConfirmed?.eventId).toBe("RP-1");
    expect(state.lastConfirmed?.result).toEqual([1, 2, 3]);
  });
  it("returns to normal without carrying a fabricated snapshot", () => {
    expect(resolveContingency()).toEqual({ mode: "NORMAL", message: "La señal y el estado del evento están disponibles.", lastConfirmed: null, resultAuthorityPreserved: true });
  });
});
