import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Parity memoria: contrato global.
 * Verifica que la memoria rechaza duplicados globales (E1–E5).
 * SQLite repo no existe en main; cuando se reactive, añadir E1–E5 contra SQLite.
 */

const makeFile = (ownerId: number, projectId: string, artifactId: string) => ({
  ownerId, projectId, artifactId,
  fileName: `${artifactId}.ifc`, format: "IFC", sizeBytes: 100,
  checksum: `checksum-${ownerId}-${artifactId}`, parsed: 0,
  declaredDependencies: "[]", capabilities: "[]", hostRequired: null,
  status: "INSPECTED" as const,
  storageKey: `${ownerId}/${artifactId}`, storageUrl: `local://${ownerId}/${artifactId}`,
  humanReviewRequired: 1,
});

async function makeMemoryBackend() {
  vi.resetModules();
  vi.stubEnv("DATABASE_URL", "");
  const db = await import("./db");
  return {
    insert: (f: ReturnType<typeof makeFile>) => db.insertParametricFile(f),
    list: (o: number, p: string) => db.listParametricFiles(o, p),
    archive: (o: number, p: string, a: string) => db.archiveParametricFile(o, p, a),
    close: () => { vi.unstubAllEnvs(); vi.resetModules(); },
  };
}

describe("parity: memoria — artifactId global (ADR-0001)", () => {
  let mem: Awaited<ReturnType<typeof makeMemoryBackend>>;

  beforeEach(async () => { mem = await makeMemoryBackend(); });
  afterEach(() => { mem.close(); });

  it("E1: rechaza duplicado entre owners", async () => {
    await mem.insert(makeFile(10, "P1", "A1"));
    await expect(mem.insert(makeFile(20, "P1", "A1"))).rejects.toThrow(/globally unique/i);
    expect(await mem.list(10, "P1")).toHaveLength(1);
    expect(await mem.list(20, "P1")).toHaveLength(0);
  });

  it("E2: rechaza duplicado mismo owner, mismo project", async () => {
    await mem.insert(makeFile(10, "P1", "A1"));
    await expect(mem.insert(makeFile(10, "P1", "A1"))).rejects.toThrow(/globally unique/i);
    expect(await mem.list(10, "P1")).toHaveLength(1);
  });

  it("E3: rechaza duplicado mismo owner, distinto project", async () => {
    await mem.insert(makeFile(10, "P1", "A1"));
    await expect(mem.insert(makeFile(10, "P2", "A1"))).rejects.toThrow(/globally unique/i);
    expect(await mem.list(10, "P1")).toHaveLength(1);
    expect(await mem.list(10, "P2")).toHaveLength(0);
  });

  it("E4: archive cross-owner devuelve false", async () => {
    await mem.insert(makeFile(10, "P1", "A1"));
    expect(await mem.archive(20, "P1", "A1")).toBe(false);
    expect(await mem.archive(10, "P1", "A1")).toBe(true);
  });

  it("E5: archive cross-project devuelve false", async () => {
    await mem.insert(makeFile(10, "P1", "A1"));
    expect(await mem.archive(10, "P2", "A1")).toBe(false);
    expect(await mem.archive(10, "P1", "A1")).toBe(true);
  });
});
