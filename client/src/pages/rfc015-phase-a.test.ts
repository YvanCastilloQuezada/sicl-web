import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiErrorMessage, siclClient, SiclClientError } from "@/api/sicl-client";

describe("RFC-015 Fase A REST modules", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("lists Evidence and uses the canonical v1 route", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: { evidence: [{ evidence_id: "E-1", statement: "Observed", evidence_type: "OBSERVATION", state: "OBSERVED" }] } }), { status: 200 }));
    await expect(siclClient.listEvidence("P-1")).resolves.toHaveLength(1);
    expect(fetchMock.mock.calls[0]?.[0]).toContain("/v1/projects/P-1/evidence");
  });

  it("creates Evidence with the submitted payload", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: { evidence: { evidence_id: "E-1" } } }), { status: 200 }));
    await siclClient.createEvidence("P-1", { evidence_id: "E-1", statement: "Measured", evidence_type: "MEASUREMENT" });
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({ evidence_id: "E-1", evidence_type: "MEASUREMENT" });
  });

  it("creates and lists Source", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: { source: { source_id: "S-1", source_type: "OFFICIAL", title: "Registry" }, sources: [] } }), { status: 200 }));
    await siclClient.createSource("P-1", { source_id: "S-1", source_type: "OFFICIAL", title: "Registry" });
    await siclClient.listSources("P-1");
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("/v1/projects/P-1/sources");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("creates Evaluation and supports query filters", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: { evaluation: { evaluation_id: "EV-1" }, evaluations: [] } }), { status: 200 }));
    await siclClient.createEvaluation("P-1", { alternative: "A", objective: "ENERGY", value: 80 });
    await siclClient.listEvaluations("P-1", { alternative: "A", objective: "ENERGY" });
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain("alternative=A");
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain("objective=ENERGY");
  });

  it("creates and lists Comparison", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: { comparison: { comparison_id: "C-1" }, comparisons: [] } }), { status: 200 }));
    await siclClient.createComparison("P-1", { alternatives: ["A", "B"], objectives: ["ENERGY"] });
    await siclClient.listComparisons("P-1");
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({ alternatives: ["A", "B"], objectives: ["ENERGY"] });
  });

  it("maps required HTTP errors to visible user messages", () => {
    expect(apiErrorMessage(new SiclClientError(400, { message: "bad" }))).toContain("Datos inválidos");
    expect(apiErrorMessage(new SiclClientError(404, {}))).toBe("No encontrado");
    expect(apiErrorMessage(new SiclClientError(409, {}))).toContain("Conflicto");
    expect(apiErrorMessage(new SiclClientError(422, { detail: "missing" }))).toContain("Datos incompletos");
  });

  it("does not silently turn a failed request into data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ detail: "missing project" }), { status: 404 }));
    await expect(siclClient.listComparisons("missing")).rejects.toBeInstanceOf(SiclClientError);
  });

  it("keeps the client methods available for all three page modules", () => {
    expect(typeof siclClient.listEvidence).toBe("function");
    expect(typeof siclClient.listEvaluations).toBe("function");
    expect(typeof siclClient.listComparisons).toBe("function");
  });
});
