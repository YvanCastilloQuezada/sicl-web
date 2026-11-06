import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("memory parametric files backend", () => {
  let db: typeof import("./db");

  const makeFile = (
    ownerId: number,
    projectId: string,
    artifactId: string,
  ) => ({
    ownerId,
    projectId,
    artifactId,
    fileName: `${artifactId}.ifc`,
    format: "IFC",
    sizeBytes: 100,
    checksum: `checksum-${ownerId}-${artifactId}`,
    parsed: 0,
    declaredDependencies: "[]",
    capabilities: "[]",
    hostRequired: null,
    status: "INSPECTED" as const,
    storageKey: `${ownerId}/${artifactId}`,
    storageUrl: `local://${ownerId}/${artifactId}`,
    humanReviewRequired: 1,
  });

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv("DATABASE_URL", "");
    db = await import("./db");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("allows archive for matching owner and project", async () => {
    await db.insertParametricFile(makeFile(10, "P1", "A1"));

    expect(await db.archiveParametricFile(10, "P1", "A1")).toBe(true);
    expect(await db.listParametricFiles(10, "P1")).toHaveLength(0);
  });

  it("rejects archive by a different owner", async () => {
    await db.insertParametricFile(makeFile(10, "P1", "A1"));

    expect(await db.archiveParametricFile(20, "P1", "A1")).toBe(false);
    expect(await db.listParametricFiles(10, "P1")).toHaveLength(1);
  });

  it("rejects archive from a different project", async () => {
    await db.insertParametricFile(makeFile(10, "P1", "A1"));

    expect(await db.archiveParametricFile(10, "P2", "A1")).toBe(false);
    expect(await db.listParametricFiles(10, "P1")).toHaveLength(1);
  });

  it("rejects globally duplicated artifactId across owners", async () => {
    await db.insertParametricFile(makeFile(10, "P1", "A1"));

    await expect(
      db.insertParametricFile(makeFile(20, "P1", "A1")),
    ).rejects.toThrow(/globally unique/i);

    expect(await db.listParametricFiles(10, "P1")).toHaveLength(1);
    expect(await db.listParametricFiles(20, "P1")).toHaveLength(0);
  });

  it("rejects duplicate artifactId for the same owner in the same project", async () => {
    await db.insertParametricFile(makeFile(10, "P1", "A1"));

    await expect(
      db.insertParametricFile(makeFile(10, "P1", "A1")),
    ).rejects.toThrow(/globally unique/i);

    expect(await db.listParametricFiles(10, "P1")).toHaveLength(1);
  });

  it("rejects same artifactId across projects for the same owner", async () => {
    await db.insertParametricFile(makeFile(10, "P1", "A1"));

    await expect(
      db.insertParametricFile(makeFile(10, "P2", "A1")),
    ).rejects.toThrow(/globally unique/i);

    expect(await db.listParametricFiles(10, "P1")).toHaveLength(1);
    expect(await db.listParametricFiles(10, "P2")).toHaveLength(0);
  });

  it("does not archive another owner's file with the same artifactId", async () => {
    await db.insertParametricFile(makeFile(10, "P1", "A1"));

    expect(await db.archiveParametricFile(20, "P1", "A1")).toBe(false);
    expect(await db.archiveParametricFile(10, "P2", "A1")).toBe(false);
    expect(await db.archiveParametricFile(10, "P1", "A1")).toBe(true);
  });
});
