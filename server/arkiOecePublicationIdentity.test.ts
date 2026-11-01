import { describe, expect, it } from "vitest";
import {
  assertOeceChildBelongsToPublication,
  oeceChildRowKey,
  oecePublicationKey,
  type OecePublicationIdentity,
} from "./arkiOecePublicationIdentity";

const publication = (mainId: string): OecePublicationIdentity => ({
  mainId,
  ocid: "ocds-dgv273-seacev3-123",
  releaseId: "release-123",
  releaseDate: "2026-09-14T00:00:00Z",
  publishedDate: "2026-11-01T00:00:00Z",
  sourceArtifactSha256: "a".repeat(64),
  sourceArtifactRef: "OECE:2026-09:main.csv",
  observedAt: "2026-11-01T12:00:00Z",
});

describe("OECE publication identity", () => {
  it("does not collapse two publication rows sharing the same OCID", () => {
    expect(oecePublicationKey(publication("main-row-1")))
      .not.toBe(oecePublicationKey(publication("main-row-2")));
  });

  it("keeps the same child identifier distinct across publication contexts", () => {
    const first = { mainId: "main-row-1", ocid: publication("main-row-1").ocid, childId: "doc-1", dataset: "tender_documents" as const };
    const second = { ...first, mainId: "main-row-2" };
    expect(oeceChildRowKey(first)).not.toBe(oeceChildRowKey(second));
  });

  it("accepts the exact composite link (mainId, ocid)", () => {
    const main = publication("main-row-1");
    expect(() => assertOeceChildBelongsToPublication(main, {
      mainId: "main-row-1", ocid: main.ocid, childId: "award-1", dataset: "awards",
    })).not.toThrow();
  });

  it("rejects a child joined by OCID alone when mainId differs", () => {
    const main = publication("main-row-1");
    expect(() => assertOeceChildBelongsToPublication(main, {
      mainId: "main-row-2", ocid: main.ocid, childId: "award-1", dataset: "awards",
    })).toThrow("OECE_CHILD_PUBLICATION_LINK_MISMATCH");
  });

  it("rejects missing publication identity and malformed source hashes", () => {
    expect(() => oecePublicationKey({ ...publication(""), mainId: "" })).toThrow();
    expect(() => oecePublicationKey({ ...publication("main-row-1"), sourceArtifactSha256: "not-a-hash" })).toThrow();
  });

  it("preserves separate release and package publication dates", () => {
    const value = publication("main-row-1");
    expect(value.releaseDate).toBe("2026-09-14T00:00:00Z");
    expect(value.publishedDate).toBe("2026-11-01T00:00:00Z");
  });
});
