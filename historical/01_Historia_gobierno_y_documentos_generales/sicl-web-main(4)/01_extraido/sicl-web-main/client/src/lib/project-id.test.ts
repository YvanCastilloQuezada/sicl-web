import { describe, expect, it } from "vitest";
import { ensureProjectId, generateProjectId, isProjectId } from "./project-id";

describe("project identifiers", () => {
  it("generates six letters and six digits in four readable groups", () => {
    const id = generateProjectId();
    expect(id).toMatch(/^[A-Z]{3}-[A-Z]{3}-\d{3}-\d{3}$/);
    expect(id.replaceAll("-", "")).toHaveLength(12);
  });

  it("keeps valid IDs and replaces legacy formats", () => {
    expect(isProjectId("ABC-DEF-123-456")).toBe(true);
    expect(ensureProjectId("ABC-DEF-123-456")).toBe("ABC-DEF-123-456");
    expect(isProjectId(ensureProjectId("DEMO-001"))).toBe(true);
  });
});
