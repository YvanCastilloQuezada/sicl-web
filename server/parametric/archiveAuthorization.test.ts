import { describe, expect, it } from "vitest";
import { canArchiveParametricFile } from "./archiveAuthorization";

describe("canArchiveParametricFile", () => {
  const file = { ownerId: 10, projectId: "P1" };

  it("permite al propietario correcto en el proyecto correcto", () => {
    expect(canArchiveParametricFile(file, 10, "P1")).toBe(true);
  });

  it("rechaza a otro propietario aunque conozca el artifactId", () => {
    expect(canArchiveParametricFile(file, 20, "P1")).toBe(false);
  });

  it("rechaza otro proyecto del mismo propietario", () => {
    expect(canArchiveParametricFile(file, 10, "P2")).toBe(false);
  });

  it("rechaza un recurso inexistente", () => {
    expect(canArchiveParametricFile(undefined, 10, "P1")).toBe(false);
  });
});
