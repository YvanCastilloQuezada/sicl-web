import { describe, expect, it } from "vitest";
import { buildIndex, query } from "./tfidfIndex";
import { SAMPLE_DOCUMENTS } from "./sampleDocuments";

describe("RAG — buildIndex", () => {
  it("indexa 35 documentos", () => {
    const index = buildIndex(SAMPLE_DOCUMENTS);
    expect(index.documents.length).toBe(35);
    expect(index.N).toBe(35);
    expect(index.idf.size).toBeGreaterThan(0);
  });
});

describe("RAG — query", () => {
  const index = buildIndex(SAMPLE_DOCUMENTS);

  it("query 'ancho mínimo de pasillo' → RNE A.010", () => {
    const results = query(index, "ancho mínimo de pasillo", 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.source).toBe("RNE A.010");
  });

  it("query 'cómo se calcula la evacuación' → RNE A.130 en topK", () => {
    const results = query(index, "cómo se calcula la evacuación", 5);
    expect(results.length).toBeGreaterThan(0);
    const sources = results.map((r) => r.document.source);
    // TF-IDF es léxico, no semántico: puede devolver docs cortos con "evacuación"
    // antes que el doc más relevante. Verificamos que RNE A.130 está en el topK.
    expect(sources).toContain("RNE A.130");
  });

  it("query 'building permit Lima oficinas' → building permit", () => {
    const results = query(index, "building permit Lima oficinas", 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.type).toBe("BUILDING_PERMIT");
  });

  it("query sin match ('receta de ceviche') → array vacío o score bajo", () => {
    const results = query(index, "receta de ceviche", 3);
    // Todos los scores deben ser 0 o no hay resultados
    expect(results.every((r) => r.score === 0) || results.length === 0).toBe(true);
  });

  it("query con topK=3 → máximo 3 documentos", () => {
    const results = query(index, "ventilación", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });
});
