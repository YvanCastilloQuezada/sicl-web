import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Load test: Map.has (V10, O(1)) no degrada.
 * Si alguien reintroduce Array.from(...).some (V8, O(n)), este test falla.
 */

const N = 5_000;
const MAX_MEM_MS = 3_000;

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
    close: () => { vi.unstubAllEnvs(); vi.resetModules(); },
  };
}

describe("load: Map.has (V10) no degrada", () => {
  let mem: Awaited<ReturnType<typeof makeMemoryBackend>>;
  beforeEach(async () => { mem = await makeMemoryBackend(); });
  afterEach(() => { mem.close(); });

  it(`${N} inserts únicos + ${N} rechazos < ${MAX_MEM_MS}ms`, async () => {
    const t0 = performance.now();
    for (let i = 0; i < N; i++) {
      await mem.insert(makeFile(10 + (i % 100), `P${i % 50}`, `A${i}`));
    }
    const t1 = performance.now();
    let rejected = 0;
    for (let i = 0; i < N; i++) {
      try { await mem.insert(makeFile(10 + (i % 100), `P${i % 50}`, `A${i}`)); }
      catch { rejected++; }
    }
    const t2 = performance.now();
    console.log(`[load] inserts=${N} in ${(t1 - t0).toFixed(1)}ms; rejects=${rejected}/${N} in ${(t2 - t1).toFixed(1)}ms`);
    expect(rejected).toBe(N);
    expect(t1 - t0 + (t2 - t1)).toBeLessThan(MAX_MEM_MS);
  }, 60_000);
});
