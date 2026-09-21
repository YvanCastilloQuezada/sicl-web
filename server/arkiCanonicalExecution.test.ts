import { afterEach, describe, expect, it, vi } from "vitest";
import { executeCanonicalBrainAndD62 } from "./arkiCanonicalExecution";

const input = {
  projectId: "HOS-TRU-400-001",
  name: "Hospital Trujillo",
  typology: "HOSPITAL",
  brief: "Hospital general de 400 camas con flujos públicos, clínicos y de servicio.",
  location: "Trujillo",
  jurisdiction: "PE",
  site: { area_m2: 20000 },
  knownFacts: ["400 camas"],
  assumptions: [],
  unknowns: ["Norma específica debe ser revisada"],
  conflicts: [],
  requirements: ["área de recreación"],
  objectives: [],
  constraints: ["mantener separación de flujos"],
  preferences: [],
  activities: [{ id: "public", label: "public arrival", subjects: ["visitor"], capacity: 400, frequency: "daily", duration: "long", temporalOverlap: true, privacy: "shared" }],
  relationships: [],
  capacities: { beds: 400 },
  stakeholders: ["owner"],
  sourceIds: ["SRC-USER-BRIEF"],
  brainExecutionId: "BRAIN-HOS-TRU-400-001",
  d62ExecutionId: "D62-HOS-TRU-400-001",
  requestedReasoningDepth: "DEEP" as const,
  seed: "HOS-TRU-400-001",
};

const snapshot = (version: number, projectId = input.projectId) => ({ contract_version: "sicl-core-http/0.4", project_id: projectId, observed_version: version, snapshot: {} });
const ok = (version: number) => new Response(JSON.stringify({ contract_version: "sicl-core-http/0.4", project_id: input.projectId, observed_version: version, accepted: true }), { status: 200, headers: { "content-type": "application/json" } });
const conflict = (detail = "expected project version does not match") => new Response(JSON.stringify({ error: "CONCURRENCY_CONFLICT", detail }), { status: 409, headers: { "content-type": "application/json" } });

function useRemoteFetch(...responses: Response[]) {
  process.env.SICL_CORE_URL = "https://core.example.test";
  process.env.SICL_CORE_SERVICE_TOKEN = "test-service-token";
  const fetchSpy = vi.fn();
  for (const response of responses) fetchSpy.mockResolvedValueOnce(response);
  vi.stubGlobal("fetch", fetchSpy);
  return fetchSpy;
}

afterEach(() => {
  delete process.env.SICL_CORE_URL;
  delete process.env.SICL_CORE_SERVICE_TOKEN;
  vi.unstubAllGlobals();
});

describe("canonical Brain and D6.2 execution", () => {
  it("fails closed when the canonical Core URL is absent", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await expect(executeCanonicalBrainAndD62(input)).rejects.toThrow("SICL_CORE_URL is required");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reads, commits Brain, rereads, commits D6.2, and preserves review status", async () => {
    const fetchSpy = useRemoteFetch(
      new Response(JSON.stringify(snapshot(7)), { status: 200, headers: { "content-type": "application/json" } }),
      ok(8),
      new Response(JSON.stringify(snapshot(8)), { status: 200, headers: { "content-type": "application/json" } }),
      ok(9),
    );

    const result = await executeCanonicalBrainAndD62(input);

    expect(result.persistence).toBe("CANONICAL_CORE");
    expect(result.promotion).toBe("HUMAN_REVIEW_REQUIRED");
    expect(result.versions).toEqual({ initial: 7, afterBrain: 8, afterD62: 9 });
    expect(result.brain.status).toBe("PASS_WITH_BOUNDS");
    expect(result.d62.execution.projectId).toBe(input.projectId);
    expect(fetchSpy).toHaveBeenCalledTimes(4);
    expect(fetchSpy.mock.calls.map(([url]) => url)).toEqual([
      "https://core.example.test/v1/projects/HOS-TRU-400-001/snapshot",
      "https://core.example.test/v1/projects/HOS-TRU-400-001/reasoning-executions",
      "https://core.example.test/v1/projects/HOS-TRU-400-001/snapshot",
      "https://core.example.test/v1/projects/HOS-TRU-400-001/reasoning-executions",
    ]);
    const brainPayload = JSON.parse(String((fetchSpy.mock.calls[1]?.[1] as RequestInit).body));
    const d62Payload = JSON.parse(String((fetchSpy.mock.calls[3]?.[1] as RequestInit).body));
    expect(brainPayload).toMatchObject({ execution_id: input.brainExecutionId, engine: "ARKI-PROJECT-BRAIN-WAVE-1", expected_project_version: 7, human_review_required: true });
    expect(d62Payload).toMatchObject({ execution_id: input.d62ExecutionId, engine: "ARKI-D6.2-M", expected_project_version: 8, human_review_required: true });
    expect(JSON.stringify(d62Payload)).not.toContain("test-service-token");
  });

  it("aborts at the Brain commit on a canonical 409 and never starts D6.2", async () => {
    const fetchSpy = useRemoteFetch(
      new Response(JSON.stringify(snapshot(7)), { status: 200, headers: { "content-type": "application/json" } }),
      conflict("expected project version 7, got 8"),
    );

    await expect(executeCanonicalBrainAndD62(input)).rejects.toMatchObject({ status: 409, errorCode: "CONCURRENCY_CONFLICT" });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[1]?.[0]).toContain("reasoning-executions");
  });

  it("aborts when the canonical snapshot changes after Brain commit", async () => {
    const fetchSpy = useRemoteFetch(
      new Response(JSON.stringify(snapshot(7)), { status: 200, headers: { "content-type": "application/json" } }),
      ok(8),
      new Response(JSON.stringify(snapshot(9)), { status: 200, headers: { "content-type": "application/json" } }),
    );

    await expect(executeCanonicalBrainAndD62(input)).rejects.toThrow("CORE_VERSION_CHANGED_AFTER_BRAIN_COMMIT");
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(fetchSpy.mock.calls.some(([url]) => String(url).endsWith("/reasoning-executions"))).toBe(true);
    expect(fetchSpy.mock.calls[3]).toBeUndefined();
  });

  it("aborts when the D6.2 commit returns a canonical 409", async () => {
    const fetchSpy = useRemoteFetch(
      new Response(JSON.stringify(snapshot(7)), { status: 200, headers: { "content-type": "application/json" } }),
      ok(8),
      new Response(JSON.stringify(snapshot(8)), { status: 200, headers: { "content-type": "application/json" } }),
      conflict("expected project version 8, got 9"),
    );

    await expect(executeCanonicalBrainAndD62(input)).rejects.toMatchObject({ status: 409, errorCode: "CONCURRENCY_CONFLICT" });
    expect(fetchSpy).toHaveBeenCalledTimes(4);
  });

  it("rejects a canonical snapshot belonging to another project", async () => {
    useRemoteFetch(new Response(JSON.stringify(snapshot(7, "OTHER-PROJECT")), { status: 200, headers: { "content-type": "application/json" } }));
    await expect(executeCanonicalBrainAndD62(input)).rejects.toThrow("CORE_PROJECT_ID_MISMATCH");
  });
});
