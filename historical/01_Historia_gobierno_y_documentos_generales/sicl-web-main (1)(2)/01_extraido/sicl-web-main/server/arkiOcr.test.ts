import { describe, expect, it } from "vitest";
import { classifyDocumentStructure, extractOcr } from "./arkiOcr";

describe("ARKI OCR adapter", () => {
  it("classifies extracted text provisionally and keeps table ambiguity explicit", () => {
    const result = classifyDocumentStructure("PLANTA PRIMER NIVEL\nAmbiente\tÁrea\nSala\t20 m2");
    expect(result.title).toBe("PLANTA PRIMER NIVEL");
    expect(result.headings).toContain("PLANTA PRIMER NIVEL");
    expect(result.tableStructure).toBe("DETECTED");
    expect(result.metadataStatus).toBe("PROVISIONAL");
  });

  it("rejects non-data inputs instead of fabricating OCR", async () => {
    await expect(extractOcr({ sourceId: "SRC-1", dataUrl: "not-an-image", kind: "IMAGE" })).rejects.toThrow("base64 data URL");
  });
});
