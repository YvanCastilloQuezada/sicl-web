import { describe, expect, it } from "vitest";
import { runLucaAutonomousCycle } from "../shared/lucaAutonomousOperatingContract";
import { ARKI_TV_FROZEN_CONTRACT } from "../shared/arkiTvFrozenContract";

describe("LUCA final operating contracts", () => {
  it("stages routine work and blocks publication behind a human gate", () => {
    const staged = runLucaAutonomousCycle({ cycleId: "LUCA-CYCLE-001", mode: "AUTONOMOUS_STAGING", sourceIds: ["SRC-001"], requestedAction: "PREPARE_CAMPAIGN" });
    expect(staged.result).toBe("STAGED");
    expect(staged.completed).toContain("VALIDATE");
    expect(runLucaAutonomousCycle({ cycleId: "LUCA-CYCLE-002", mode: "AUTONOMOUS_STAGING", sourceIds: ["SRC-001"], requestedAction: "PUBLISH" }).pendingHumanGate).toBe(true);
  });
  it("preserves frozen ARKI-TV invariants", () => {
    expect(ARKI_TV_FROZEN_CONTRACT.status).toBe("FROZEN");
    expect(ARKI_TV_FROZEN_CONTRACT.publicationEnabled).toBe(false);
    expect(ARKI_TV_FROZEN_CONTRACT.coreMutationEnabled).toBe(false);
  });
});
