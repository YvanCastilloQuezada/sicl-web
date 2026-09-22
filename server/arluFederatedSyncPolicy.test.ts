import { describe, expect, it } from "vitest";
import { authorizeFederatedSync, classifyFederatedSyncPath } from "../shared/arluFederatedSyncPolicy";

describe("AR-LU federated sync policy", () => {
  it("auto-syncs only explicitly shared contracts and documents", () => {
    expect(classifyFederatedSyncPath("shared/arLuLiveTelemetry.ts")).toBe("AUTO_SYNC");
    expect(classifyFederatedSyncPath("docs/AR_LU_PROVIDER_CATALOG.md")).toBe("AUTO_SYNC");
  });
  it("requires review for implementation, security and schema changes", () => {
    expect(classifyFederatedSyncPath("server/routers.ts")).toBe("MIRROR_WITH_REVIEW");
    expect(classifyFederatedSyncPath("server/arkiSecurityLayers.ts")).toBe("MIRROR_WITH_REVIEW");
    expect(authorizeFederatedSync({ direction: "ARKI_TO_LUCA", paths: ["server/routers.ts"], sourceCommit: "abc", targetTestsPass: true, provenance: "abc:server/routers.ts", rollbackPoint: "checkpoint-1" }).reason).toBe("HUMAN_REVIEW_REQUIRED");
  });
  it("never transfers secrets, product data, games or Core state", () => {
    expect(classifyFederatedSyncPath(".env")).toBe("NEVER_SYNC");
    expect(classifyFederatedSyncPath("server/wallet.ts")).toBe("NEVER_SYNC");
    expect(classifyFederatedSyncPath("projectState/snapshot.json")).toBe("NEVER_SYNC");
    expect(authorizeFederatedSync({ direction: "LUCA_TO_ARKI", paths: ["server/wallet.ts"], sourceCommit: "abc", targetTestsPass: true, provenance: "abc:server/wallet.ts", rollbackPoint: "checkpoint-1", humanReview: true }).allowed).toBe(false);
  });
  it("allows a reviewed, tested mirror in either direction", () => {
    expect(authorizeFederatedSync({ direction: "LUCA_TO_ARKI", paths: ["server/fieldVoiceCopilot.ts"], sourceCommit: "abc", targetTestsPass: true, provenance: "abc:fieldVoiceCopilot", rollbackPoint: "checkpoint-2", humanReview: true }).allowed).toBe(true);
  });
});
