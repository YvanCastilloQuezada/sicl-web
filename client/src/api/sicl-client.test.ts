import { afterEach, describe, expect, it, vi } from "vitest";
import { siclClient } from "./sicl-client";

describe("siclClient REST bridge", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("creates a project through POST /projects", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8000");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "OK", code: "OK", message: "ok", data: { project_id: "TEST-API-001", name: "Test", stage: "DRAFT", version: 1 } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(siclClient.createProject({ project_id: "TEST-API-001", name: "Test" })).resolves.toMatchObject({ project_id: "TEST-API-001" });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/projects", expect.objectContaining({ method: "POST" }));
  });

  it("lists projects so the workspace can load an existing Railway project", async () => {
    vi.stubEnv("VITE_API_URL", "https://web-production-a93fa.up.railway.app");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "OK",
      code: "OK",
      message: "ok",
      data: { projects: [{ project_id: "TEST-E2E-001", name: "SICL Railway Smoke Test", stage: "DRAFT", version: 2 }] },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(siclClient.listProjects()).resolves.toMatchObject([{ project_id: "TEST-E2E-001" }]);
    expect(fetchMock).toHaveBeenCalledWith("https://web-production-a93fa.up.railway.app/projects", expect.anything());
  });

  it("executes a command and reads the refreshed project", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8000");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "OK", code: "OK", message: "ok", data: { key: "CLIMATE" } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "OK", code: "OK", message: "ok", data: { project_id: "TEST-API-001", name: "Test", stage: "DRAFT", version: 2, objectives: { CLIMATE: { value: "80" } } } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await siclClient.executeCommand("TEST-API-001", "/OBJECTIVE SET CLIMATE MAXIMIZE 80");
    const project = await siclClient.getProject("TEST-API-001");
    expect(project.objectives).toMatchObject({ CLIMATE: { value: "80" } });
    expect(fetchMock).toHaveBeenNthCalledWith(1, "http://localhost:8000/commands", expect.objectContaining({ method: "POST" }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "http://localhost:8000/projects/TEST-API-001", expect.anything());
  });

  it("surfaces API errors without hiding the response body", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8000");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: { code: "PROJECT_NOT_FOUND" } }), { status: 404 })));
    await expect(siclClient.getProject("MISSING")).rejects.toMatchObject({ status: 404, body: { detail: { code: "PROJECT_NOT_FOUND" } } });
  });
});
