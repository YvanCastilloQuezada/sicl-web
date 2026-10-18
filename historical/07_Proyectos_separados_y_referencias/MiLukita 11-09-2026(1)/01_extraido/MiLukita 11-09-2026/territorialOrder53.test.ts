import { describe, expect, it } from "vitest";
import { canPublishWorldObject, isRuntimeVisible } from "./territorialTrust";
import { appRouter } from "../server/routers";

describe("Order 53 Mapper backend contract", () => {
  it("exposes observation capture and review-request procedures", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("territorial.addObservation");
    expect(procedures).toContain("territorial.requestReview");
  });

  it("keeps field-captured data out of runtime until explicit publication", () => {
    expect(isRuntimeVisible("CAPTURED")).toBe(false);
    expect(canPublishWorldObject("CAPTURED", 100, 1, 1)).toBe(false);
    expect(canPublishWorldObject("VERIFIED", 1, 1, 1)).toBe(true);
  });
});
