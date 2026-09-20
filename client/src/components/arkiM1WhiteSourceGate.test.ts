import { describe, expect, it } from "vitest";
import { auditWhiteSource, m1WhiteSourceGateMarkdown, runM1WhiteSourceGate, validateM1WhiteSourceGate } from "./arkiM1WhiteSourceGate";

describe("M1 Edward T. White primary-source gate", () => {
  it("does not infer a primary source from prior references", () => {
    const audit = auditWhiteSource(["client/src/components/arkiRPartiManual.ts", "docs/ARKI-MASTER-HANDOFF-SINCE-INCEPTION-2026-09-19.md"]);
    expect(audit.sourceStatus).toBe("PRIMARY_SOURCE_NOT_AVAILABLE");
    expect(audit.edition).toBe("UNKNOWN");
  });

  it("prepares architecture while blocking content ingestion", () => {
    const report = runM1WhiteSourceGate({ head: "83aa7eb5ba2397a8dd5c77f825c27066591ae23c", remoteHead: "83aa7eb5ba2397a8dd5c77f825c27066591ae23c", workspaceFiles: [] });
    expect(report.architectureMap.parallelSystems).toBe(false);
    expect(report.manualIntegration.status).toBe("PREPARED_NOT_POPULATED");
    expect(report.inventory.sourceEntries).toBe(0);
    expect(report.nextStep).toBe("BLOCKED_BY_PRIMARY_SOURCE");
  });

  it("preserves ANEXO I and human authority without duplicating the source", () => {
    const report = runM1WhiteSourceGate({ head: "83aa7eb5ba2397a8dd5c77f825c27066591ae23c", remoteHead: "83aa7eb5ba2397a8dd5c77f825c27066591ae23c", workspaceFiles: [] });
    expect(validateM1WhiteSourceGate(report)).toBe(true);
    expect(m1WhiteSourceGateMarkdown(report)).toContain("BLOCKED_BY_PRIMARY_SOURCE");
  });
});
