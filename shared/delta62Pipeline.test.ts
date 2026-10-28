import { describe, expect, it } from "vitest";
import {
  DELTA62_PIPELINE,
  createCandidate,
  validateEntry,
  promoteEntry,
  recordInLedger
} from "./delta62Pipeline";

describe("ARKI Delta 6.2 Pipeline", () => {
  it("declares human-only authority", () => {
    expect(DELTA62_PIPELINE.authority).toBe("HUMAN_ONLY");
    expect(DELTA62_PIPELINE.autoPromotion).toBe(false);
  });

  it("creates a candidate", () => {
    const entry = createCandidate("K-001", "docs/example.md", ["evidence-1"]);
    expect(entry.stage).toBe("CANDIDATE");
  });

  it("rejects candidate without evidence", () => {
    expect(() => createCandidate("K-001", "docs/example.md", [])).toThrow("EVIDENCE_REQUIRED");
  });

  it("validates candidate with passing test", () => {
    const entry = createCandidate("K-001", "docs/example.md", ["evidence-1"]);
    const validated = validateEntry(entry, true);
    expect(validated.stage).toBe("VALIDATED");
  });

  it("rejects candidate with failing test", () => {
    const entry = createCandidate("K-001", "docs/example.md", ["evidence-1"]);
    const rejected = validateEntry(entry, false);
    expect(rejected.stage).toBe("REJECTED");
  });

  it("requires human authority to promote", () => {
    const entry = createCandidate("K-001", "docs/example.md", ["evidence-1"]);
    const validated = validateEntry(entry, true);
    expect(() => promoteEntry(validated, "")).toThrow("HUMAN_AUTHORITY_REQUIRED");
  });

  it("promotes with human authority", () => {
    const entry = createCandidate("K-001", "docs/example.md", ["evidence-1"]);
    const validated = validateEntry(entry, true);
    const promoted = promoteEntry(validated, "PO");
    expect(promoted.stage).toBe("PROMOTED");
    expect(promoted.promotedBy).toBe("PO");
  });

  it("records in ledger", () => {
    const entry = createCandidate("K-001", "docs/example.md", ["evidence-1"]);
    const validated = validateEntry(entry, true);
    const promoted = promoteEntry(validated, "PO");
    const recorded = recordInLedger(promoted);
    expect(recorded.stage).toBe("LEDGER");
  });
});
