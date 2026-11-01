import { describe, expect, it } from "vitest";
import { joinOeceChildRows, type OeceMainRow } from "./arkiOeceBulkJoin";
import type { OeceChildRow } from "./arkiOeceBulkJoin";

const main = (mainId: string, ocid = "ocds-process-1"): OeceMainRow => ({
  mainId,
  ocid,
  sourceArtifactSha256: "a".repeat(64),
  sourceArtifactRef: "OECE:2026:main.csv",
  observedAt: "2026-11-01T10:00:00Z",
  publishedDate: "2026-11-01T00:00:00Z",
});

const child = (mainId: string, childId: string, ocid = "ocds-process-1"): OeceChildRow => ({
  mainId,
  ocid,
  childId,
  dataset: "contracts",
});

describe("OECE bulk OCDS exact composite join", () => {
  it("joins only by the exact (mainId, ocid) pair", () => {
    const result = joinOeceChildRows(
      [main("main-1"), main("main-2")],
      [child("main-2", "contract-1")],
    );
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0].publication.mainId).toBe("main-2");
  });

  it("does not attach a child to another publication sharing only the OCID", () => {
    const result = joinOeceChildRows(
      [main("main-1")],
      [child("main-2", "contract-1")],
    );
    expect(result.matched).toHaveLength(0);
    expect(result.unmatched).toMatchObject([{
      child: { mainId: "main-2", ocid: "ocds-process-1" },
      reason: "PARENT_PUBLICATION_NOT_FOUND",
    }]);
  });

  it("preserves all child rows and reports unmatched rows explicitly", () => {
    const result = joinOeceChildRows(
      [main("main-1")],
      [child("main-1", "contract-1"), child("missing-main", "contract-2")],
    );
    expect(result.matched.length + result.unmatched.length).toBe(2);
    expect(result.unmatched).toHaveLength(1);
  });

  it("rejects duplicate main publication composite keys", () => {
    expect(() => joinOeceChildRows(
      [main("main-1"), main("main-1")],
      [child("main-1", "contract-1")],
    )).toThrow("OECE_DUPLICATE_MAIN_PUBLICATION_KEY");
  });

  it("rejects malformed publication and child identities", () => {
    expect(() => joinOeceChildRows(
      [{ ...main("main-1"), sourceArtifactSha256: "bad" }],
      [child("main-1", "contract-1")],
    )).toThrow();
    expect(() => joinOeceChildRows(
      [main("main-1")],
      [{ ...child("main-1", "contract-1"), childId: "" }],
    )).toThrow();
  });
});
