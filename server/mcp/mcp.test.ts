import { describe, expect, it } from "vitest";
import { handleRequest } from "./server";

describe("MCP — initialize", () => {
  it("retorna protocolVersion + capabilities + serverInfo", async () => {
    const res = await handleRequest({ jsonrpc: "2.0", id: 1, method: "initialize" });
    expect(res).toHaveProperty("result");
    if ("result" in res) {
      const r = res.result as any;
      expect(r.protocolVersion).toBe("2024-11-05");
      expect(r.serverInfo.name).toBe("arki-mcp");
      expect(r.capabilities).toHaveProperty("tools");
    }
  });
});

describe("MCP — tools/list", () => {
  it("retorna los 5 tools con name + inputSchema", async () => {
    const res = await handleRequest({ jsonrpc: "2.0", id: 1, method: "tools/list" });
    if ("result" in res) {
      const r = res.result as any;
      expect(r.tools).toHaveLength(5);
      const names = r.tools.map((t: any) => t.name).sort();
      expect(names).toEqual([
        "calculate_resilience",
        "calculate_retrofit",
        "calculate_sustainability",
        "evaluate_typology",
        "rag_query",
      ]);
      for (const t of r.tools) {
        expect(t.inputSchema.type).toBe("object");
      }
    }
  });
});

describe("MCP — tools/call", () => {
  it("evaluate_typology con 'hospital' retorna ciclo válido", async () => {
    const res = await handleRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "evaluate_typology", arguments: { typology: "hospital" } },
    });
    if ("result" in res) {
      const r = res.result as any;
      expect(r.content[0].type).toBe("text");
      const parsed = JSON.parse(r.content[0].text);
      expect(parsed.typology).toBe("hospital");
      expect(parsed.cycleVersion).toBe("ARKI-INTEGRATED-ARCHITECT-1.0");
    }
  });

  it("calculate_sustainability retorna embodied + score", async () => {
    const res = await handleRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "calculate_sustainability",
        arguments: {
          materials: [{ materialId: "concrete-c30", quantity_kg: 100000 }],
          area_m2: 100,
        },
      },
    });
    if ("result" in res) {
      const parsed = JSON.parse((res.result as any).content[0].text);
      expect(parsed.embodied.total_kgco2e).toBeGreaterThan(0);
      expect(parsed.score.overall).toBeDefined();
    }
  });

  it("rag_query con 'ancho mínimo de pasillo' retorna RNE A.010", async () => {
    const res = await handleRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "rag_query", arguments: { question: "ancho mínimo de pasillo", topK: 3 } },
    });
    if ("result" in res) {
      const parsed = JSON.parse((res.result as any).content[0].text);
      expect(parsed.length).toBeGreaterThan(0);
      expect(parsed[0].document.source).toBe("RNE A.010");
    }
  });

  it("tool desconocido retorna error -32601", async () => {
    const res = await handleRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "tool_inexistente" },
    });
    if ("error" in res) {
      expect(res.error.code).toBe(-32601);
    }
  });
});

describe("MCP — método desconocido", () => {
  it("retorna error -32601", async () => {
    const res = await handleRequest({ jsonrpc: "2.0", id: 1, method: "metodo_inexistente" });
    if ("error" in res) {
      expect(res.error.code).toBe(-32601);
    }
  });
});
