import { describe, expect, it } from "vitest";
import { ARKI_SECURITY_LAYERS, authorizeManiacCoreTrust } from "./arkiSecurityLayers";

describe("ARKI defensive three-layer security", () => {
  it("declares defensive-only operation and MANIAC Core/Trust", () => {
    expect(ARKI_SECURITY_LAYERS.mode).toBe("DEFENSIVE_ONLY");
    expect(ARKI_SECURITY_LAYERS.layers.at(-1)?.id).toBe("CORE_TRUST_MANiac");
    expect(ARKI_SECURITY_LAYERS.invariants).toContain("CORE_TRUST_DENIES_UNKNOWN_OPERATIONS");
  });

  it("fails closed for unauthenticated, unknown, conflicted and tampered commits", () => {
    expect(authorizeManiacCoreTrust({ action: "UNKNOWN", actorAuthenticated: true }).allowed).toBe(false);
    expect(authorizeManiacCoreTrust({ action: "PROJECT_CREATE", actorAuthenticated: true }).allowed).toBe(true);
    expect(authorizeManiacCoreTrust({ action: "PROJECT_STATE_COMMIT", actorAuthenticated: false }).allowed).toBe(false);
    expect(authorizeManiacCoreTrust({ action: "PROJECT_STATE_COMMIT", actorAuthenticated: true, expectedVersionMatches: false }).allowed).toBe(false);
    expect(authorizeManiacCoreTrust({ action: "PROJECT_STATE_COMMIT", actorAuthenticated: true, auditIntegrityValid: false }).allowed).toBe(false);
  });

  it("requires explicit human approval for human authority actions", () => {
    expect(authorizeManiacCoreTrust({ action: "HUMAN_DECISION_APPEND", actorAuthenticated: true, humanApproved: false }).allowed).toBe(false);
    expect(authorizeManiacCoreTrust({ action: "HUMAN_DECISION_APPEND", actorAuthenticated: true, humanApproved: true }).allowed).toBe(true);
  });
});
