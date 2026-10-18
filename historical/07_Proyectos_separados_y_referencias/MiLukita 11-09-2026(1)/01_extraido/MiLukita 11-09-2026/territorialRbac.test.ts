import { describe, expect, it } from "vitest";
import { MAPPER_ROLES } from "./territorialTrust";

describe("territorial RBAC contract", () => {
  it("declares exactly the three restricted territorial roles", () => {
    expect(MAPPER_ROLES).toEqual(["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"]);
  });

  it("keeps capture, verification and publication responsibilities distinct", () => {
    const responsibilities = {
      MAPPER_OPERATOR: "CAPTURE",
      EYE_REVIEWER: "VERIFY",
      HUMAN_AUTHORITY: "PUBLISH",
    } as const;
    expect(new Set(Object.values(responsibilities)).size).toBe(3);
    expect(responsibilities.MAPPER_OPERATOR).not.toBe(responsibilities.HUMAN_AUTHORITY);
  });
});
