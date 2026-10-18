import { describe, expect, it } from "vitest";
import { simulateDualInstanceClaim } from "./dualInstanceSimulation";

describe("simulación de dos instancias LIVE", () => {
  it("acepta un solo claim para el mismo evento y bucket", async () => {
    const report = await simulateDualInstanceClaim("LIVE-SHARED-001");
    expect(report.claims).toHaveLength(2);
    expect(report.acquiredCount).toBe(1);
    expect(report.storedClaimCount).toBe(1);
    expect(new Set(report.claims.map((claim) => claim.key)).size).toBe(1);
  });
});
