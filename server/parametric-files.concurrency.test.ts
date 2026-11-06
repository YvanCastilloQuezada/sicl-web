import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Concurrency: 10 workers mismo artifactId → 1 OK, 9 rechazos.
 * JS es single-threaded; Promise.allSettled no intercala Map.has/Map.set.
 * El test verifica el resultado observable (1/9).
 */

const WORKERS = 10;

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

describe("concurrency: artifactId global", () => {
  let mem: Awaited<ReturnType<typeof makeMemoryBackend>>;
  beforeEach(async () => { mem = await makeMemoryBackend(); });
  afterEach(() => { mem.close(); });

  it(`${WORKERS} workers mismo artifactId → 1 OK, ${WORKERS - 1} rechazos`, async () => {
    const results = await Promise.allSettled(
      Array.from({ length: WORKERS }, (_, i) => mem.insert(makeFile(10 + i, "P1", "SAME"))),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const ko = results.filter((r) => r.status === "rejected").length;
    expect(ok).toBe(1);
    expect(ko).toBe(WORKERS - 1);
  }, 30_000);

  it(`${WORKERS} distinct artifactIds → todos OK (sin falsos positivos)`, async () => {
    const results = await Promise.allSettled(
      Array.from({ length: WORKERS }, (_, i) => mem.insert(makeFile(10, "P1", `A${i}`))),
    );
    expect(results.every((r) => r.status === "fulfilled")).toBe(true);
  }, 30_000);
});
