/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { siclClient } from "./sicl-client";

describe("siclClient REST bridge", () => {
  afterEach(() => {
    window.localStorage.removeItem("sims-dei.mock-core");
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("uses explicit mock data without making network requests", async () => {
    window.localStorage.setItem("sims-dei.mock-core", "true");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const projects = await siclClient.listProjects();
    expect(projects[0]).toMatchObject({ project_id: "MOCK-ARKI-001" });
    await expect(siclClient.getProject("MOCK-ARKI-001")).resolves.toMatchObject({ stage: "OPEN" });
    await siclClient.executeCommand("MOCK-ARKI-001", "/HISTORY");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("creates a project through POST /projects", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "OK", code: "OK", message: "ok", data: { project_id: "TEST-API-001", name: "Test", stage: "DRAFT", version: 1 } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(siclClient.createProject({ project_id: "TEST-API-001", name: "Test" })).resolves.toMatchObject({ project_id: "TEST-API-001" });
    expect(fetchMock).toHaveBeenCalledWith("/api/core/projects", expect.objectContaining({ method: "POST" }));
  });

  it("uses the same-origin server proxy when no browser API URL is configured", async () => {
    vi.stubEnv("VITE_API_URL", "");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "OK", code: "OK", message: "ok", data: { projects: [] } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(siclClient.listProjects()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith("/api/core/projects", expect.anything());
  });

  it("lists projects so the workspace can load an existing Railway project", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "OK",
      code: "OK",
      message: "ok",
      data: { projects: [{ project_id: "TEST-E2E-001", name: "SICL Railway Smoke Test", stage: "DRAFT", version: 2 }] },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(siclClient.listProjects()).resolves.toMatchObject([{ project_id: "TEST-E2E-001" }]);
    expect(fetchMock).toHaveBeenCalledWith("/api/core/projects", expect.anything());
  });

  it("executes a command and reads the refreshed project", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "OK", code: "OK", message: "ok", data: { key: "CLIMATE" } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "OK", code: "OK", message: "ok", data: { project_id: "TEST-API-001", name: "Test", stage: "DRAFT", version: 2, objectives: { CLIMATE: { value: "80" } } } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await siclClient.executeCommand("TEST-API-001", "/OBJECTIVE SET CLIMATE MAXIMIZE 80");
    const project = await siclClient.getProject("TEST-API-001");
    expect(project.objectives).toMatchObject({ CLIMATE: { value: "80" } });
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/core/commands", expect.objectContaining({ method: "POST" }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/core/projects/TEST-API-001", expect.anything());
  });

  it("surfaces API errors without hiding the response body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: { code: "PROJECT_NOT_FOUND" } }), { status: 404 })));
    await expect(siclClient.getProject("MISSING")).rejects.toMatchObject({ status: 404, body: { detail: { code: "PROJECT_NOT_FOUND" } } });
  });
});
