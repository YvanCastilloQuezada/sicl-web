import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

const user = { id: 7, openId: "actor-7", email: "actor@example.test", name: "Actor", loginMethod: "test", role: "user" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
const ctx: TrpcContext = { user, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
const response = () => new Response(JSON.stringify({ contract_version: "sicl-core-http/0.1", project_id: "SICL-1", observed_version: 2 }), { status: 200, headers: { "content-type": "application/json" } });

describe("tRPC to SICL Core delegation", () => {
  afterEach(() => { delete process.env.SICL_CORE_URL; delete process.env.SICL_CORE_SERVICE_TOKEN; vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it("delegates the three human-boundary operations", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const fetchSpy = vi.fn().mockImplementation(() => Promise.resolve(response()));
    vi.stubGlobal("fetch", fetchSpy);
    const caller = appRouter.createCaller(ctx);
    await caller.projects.recommendationCreate({ projectId: "SICL-1", expectedVersion: 1, recommendationId: "REC-1", alternativeId: "ALT-A", basedOn: "CMP-1", basedOnKind: "MULTI_CRITERIA", reason: "Explicit analytical basis", source: "ANALYTICAL" });
    await caller.projects.reviewRecord({ projectId: "SICL-1", expectedVersion: 1, reviewId: "REV-1", recommendationId: "REC-1", actorId: "actor-7", confirmationId: "CONF-1", reason: "Explicit human review", recommendationVersion: 1, status: "ACCEPTED" });
    await caller.projects.decisionRecord({ projectId: "SICL-1", expectedVersion: 1, decisionId: "DEC-1", selectedAlternativeId: "ALT-A", actorId: "actor-7", authorityBasis: "PRODUCT_OWNER", confirmationId: "CONF-2", rationale: "Explicit human decision" });
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(JSON.parse((fetchSpy.mock.calls[0]?.[1] as RequestInit).body as string).based_on_kind).toBe("MULTI_CRITERIA");
    expect(fetchSpy.mock.calls.map(([url]) => url)).toEqual([
      "https://core.example.test/v1/projects/SICL-1/recommendations",
      "https://core.example.test/v1/projects/SICL-1/human-reviews",
      "https://core.example.test/v1/projects/SICL-1/decisions",
    ]);
  });

  it("translates canonical read 404 into NOT_FOUND with upstream detail", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    vi.spyOn(db, "getSiclProject").mockResolvedValue({ projectId: "SICL-404", ownerId: 7, name: "Remote project", location: "Test", version: 1, snapshot: "{}", status: "DRAFT", createdAt: new Date(), updatedAt: new Date() } as any);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "PROJECT_NOT_FOUND", detail: "No canonical project exists", trace_id: "trace-404" }), { status: 404, headers: { "content-type": "application/json" } })));
    const caller = appRouter.createCaller(ctx);
    await expect(caller.projects.get({ projectId: "SICL-404" })).rejects.toMatchObject({ code: "NOT_FOUND", message: "No canonical project exists" });
  });

  it("rejects a human recommendation at the web contract boundary", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const caller = appRouter.createCaller(ctx);
    await expect(caller.projects.recommendationCreate({ projectId: "SICL-1", expectedVersion: 1, recommendationId: "REC-1", alternativeId: "ALT-A", basedOn: "human", basedOnKind: "BINARY", reason: "Human reason is explicit", source: "HUMAN" as never })).rejects.toThrow();
  });
});

  it.each([
    [401, "invalid service authentication"],
    [409, "expected project version 1, got 2"],
    [422, "authority context is invalid"],
  ])("preserves core adapter error %s and detail", async (status, detail) => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: `UPSTREAM_${status}`, detail }), { status, headers: { "content-type": "application/json" } })));
    const caller = appRouter.createCaller(ctx);
    await expect(caller.projects.recommendationCreate({ projectId: "SICL-1", expectedVersion: 1, recommendationId: "REC-1", alternativeId: "ALT-A", basedOn: "CMP-1", basedOnKind: "BINARY", reason: "Explicit analytical basis", source: "ANALYTICAL" })).rejects.toThrow(`${status}: ${detail}`);
  });

  it("preserves a Python authority rejection at the human decision boundary", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "AUTHORITY_CONTEXT_INVALID", detail: "authority basis is not sufficient" }), { status: 422, headers: { "content-type": "application/json" } })));
    const caller = appRouter.createCaller(ctx);
    await expect(caller.projects.decisionRecord({ projectId: "SICL-1", expectedVersion: 1, decisionId: "DEC-1", selectedAlternativeId: "ALT-A", actorId: "actor-7", authorityBasis: "UNVERIFIED", confirmationId: "CONF-2", rationale: "Explicit human decision" })).rejects.toThrow("422: authority basis is not sufficient");
  });


describe("core environment boundary", () => {
  afterEach(() => {
    delete process.env.SICL_CORE_URL;
    delete process.env.SICL_CORE_SERVICE_TOKEN;
    delete process.env.SICL_ALLOW_LOCAL_CORE;
    process.env.NODE_ENV = "test";
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fails closed when production has no canonical core URL", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.SICL_CORE_URL;
    process.env.SICL_ALLOW_LOCAL_CORE = "true";
    const caller = appRouter.createCaller(ctx);
    await expect(caller.projects.list()).rejects.toThrow("SICL_CORE_URL is required");
  });

  it("allows the explicit local fallback during development", async () => {
    process.env.NODE_ENV = "development";
    process.env.SICL_ALLOW_LOCAL_CORE = "true";
    vi.spyOn(db, "listSiclProjects").mockResolvedValue([]);
    const result = await appRouter.createCaller(ctx).projects.list();
    expect(result).toEqual([]);
  });

  it("still fails closed in development when the local flag is absent", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.SICL_ALLOW_LOCAL_CORE;
    await expect(appRouter.createCaller(ctx).projects.list()).rejects.toThrow("SICL_CORE_URL is required");
  });
});



  it("exposes the canonical operations research catalog as read-only", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      contract_version: "sicl-core-http/0.2",
      read_only: true,
      methods: [{ method: "MCDA_WEIGHTED_SUM", required_constraints: ["weights_sum_to_one"], required_provenance: ["source_id", "source_timestamp", "source_version"], feasibility_states: ["COMPARISON", "INSUFFICIENT_DATA", "UNKNOWN"], sensitivity_outputs: ["method", "parameters", "limitations"] }],
    }), { status: 200, headers: { "content-type": "application/json" } })));
    const caller = appRouter.createCaller(ctx);
    const result = await caller.projects.operationsResearchMethods();
    expect(result).toMatchObject({ read_only: true, methods: [{ method: "MCDA_WEIGHTED_SUM", required_constraints: ["weights_sum_to_one"], required_provenance: ["source_id", "source_timestamp", "source_version"], feasibility_states: ["COMPARISON", "INSUFFICIENT_DATA", "UNKNOWN"], sensitivity_outputs: ["method", "parameters", "limitations"] }] });
  });

describe("local recommendation reference semantics", () => {
  beforeEach(() => { delete process.env.SICL_CORE_URL; delete process.env.SICL_CORE_SERVICE_TOKEN; process.env.NODE_ENV = "test"; });
  afterEach(() => { delete process.env.SICL_ALLOW_LOCAL_CORE; delete process.env.SICL_CORE_URL; delete process.env.SICL_CORE_SERVICE_TOKEN; vi.restoreAllMocks(); });

  const project = {
    projectId: "SICL-LOCAL",
    ownerId: 7,
    name: "Local semantics",
    location: "Test",
    version: 1,
    status: "DRAFT" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    snapshot: JSON.stringify({
      alternatives: [{ id: "ALT-A", name: "Option A" }],
      comparisons: [{ id: "CMP-1" }],
      multiComparisons: [{ id: "MCMP-1" }],
      recommendations: [],
      humanReviews: [],
      decisions: [],
      events: [],
    }),
  };

  it("accepts MULTI_CRITERIA when the reference exists in multiComparisons", async () => {
    process.env.SICL_ALLOW_LOCAL_CORE = "true";
    vi.spyOn(db, "getSiclProject").mockResolvedValue(project as any);
    vi.spyOn(db, "updateSiclProject").mockResolvedValue(project as any);
    const result = await appRouter.createCaller(ctx).projects.recommendationCreate({ projectId: "SICL-LOCAL", expectedVersion: 1, recommendationId: "REC-1", alternativeId: "ALT-A", basedOn: "MCMP-1", basedOnKind: "MULTI_CRITERIA", reason: "Explicit multicriteria analytical basis", source: "ANALYTICAL" });
    expect(result.version).toBe(2);
  });

  it("rejects a cross-collection reference with the declared-kind error", async () => {
    process.env.SICL_ALLOW_LOCAL_CORE = "true";
    vi.spyOn(db, "getSiclProject").mockResolvedValue(project as any);
    await expect(appRouter.createCaller(ctx).projects.recommendationCreate({ projectId: "SICL-LOCAL", expectedVersion: 1, recommendationId: "REC-2", alternativeId: "ALT-A", basedOn: "CMP-1", basedOnKind: "MULTI_CRITERIA", reason: "Explicit multicriteria analytical basis", source: "ANALYTICAL" })).rejects.toThrow("existing comparison of the declared kind");
  });
});


describe("local analytical workflow integration", () => {
  beforeEach(() => { delete process.env.SICL_CORE_URL; delete process.env.SICL_CORE_SERVICE_TOKEN; process.env.NODE_ENV = "test"; process.env.SICL_ALLOW_LOCAL_CORE = "true"; });
  afterEach(() => { delete process.env.SICL_ALLOW_LOCAL_CORE; delete process.env.SICL_CORE_URL; delete process.env.SICL_CORE_SERVICE_TOKEN; vi.restoreAllMocks(); });

  it("creates Evaluation and Comparison before an analytical Recommendation", async () => {
    let currentProject: any = {
      projectId: "SICL-FLOW",
      ownerId: 7,
      name: "Integrated analytical flow",
      location: "Test",
      version: 1,
      status: "DRAFT",
      createdAt: new Date(),
      updatedAt: new Date(),
      snapshot: JSON.stringify({
        requirements: [{ id: "REQ-1", name: "Access" }],
        objectives: [{ id: "OBJ-1", name: "Daylight", requirementId: "REQ-1", direction: "MAXIMIZE" }],
        alternatives: [{ id: "ALT-A", name: "Scheme A" }, { id: "ALT-B", name: "Scheme B" }],
        evaluations: [], comparisons: [], multiComparisons: [], recommendations: [], humanReviews: [], decisions: [], events: [],
      }),
    };
    vi.spyOn(db, "getSiclProject").mockImplementation(async () => currentProject);
    vi.spyOn(db, "updateSiclProject").mockImplementation(async (_ownerId, _projectId, expectedVersion, snapshot, status) => {
      if (currentProject.version !== expectedVersion) return undefined;
      currentProject = { ...currentProject, version: expectedVersion + 1, snapshot, status: status ?? currentProject.status };
      return currentProject;
    });
    const caller = appRouter.createCaller(ctx);

    const evaluationA = await caller.projects.addRecord({ projectId: "SICL-FLOW", expectedVersion: 1, kind: "evaluations", record: { id: "EVAL-A", name: "Evaluation A", alternativeId: "ALT-A", objectiveId: "OBJ-1", criterion: "daylight_lux", value: 650, unit: "lux", method: "site_measurement", inputs: [{ sensor_id: "S-07" }], provenance: ["SRC-001", "EVD-004"] } });
    expect(evaluationA.version).toBe(2);
    const evaluationB = await caller.projects.addRecord({ projectId: "SICL-FLOW", expectedVersion: 2, kind: "evaluations", record: { id: "EVAL-B", name: "Evaluation B", alternativeId: "ALT-B", objectiveId: "OBJ-1", criterion: "daylight_lux", value: 540, unit: "lux", method: "site_measurement", inputs: [{ sensor_id: "S-08" }], provenance: ["SRC-001", "EVD-005"] } });
    expect(evaluationB.version).toBe(3);
    const comparison = await caller.projects.addRecord({ projectId: "SICL-FLOW", expectedVersion: 3, kind: "comparisons", record: { id: "CMP-1", name: "Daylight comparison", objectiveId: "OBJ-1", comparisonKind: "BINARY", evaluationIds: ["EVAL-A", "EVAL-B"], direction: "MAXIMIZE", feasibilityStatus: "FEASIBLE" } });
    expect(comparison.version).toBe(4);
    const recommendation = await caller.projects.recommendationCreate({ projectId: "SICL-FLOW", expectedVersion: 4, recommendationId: "REC-1", alternativeId: "ALT-A", basedOn: "CMP-1", basedOnKind: "BINARY", reason: "Explicit analytical basis from the declared comparison", source: "ANALYTICAL" });
    expect(recommendation.version).toBe(5);
    const snapshot = recommendation.snapshot as any;
    expect(snapshot.evaluations.map((item: any) => item.id)).toEqual(["EVAL-A", "EVAL-B"]);
    expect(snapshot.comparisons[0]).toMatchObject({ id: "CMP-1", evaluationIds: ["EVAL-A", "EVAL-B"], direction: "MAXIMIZE", feasibilityStatus: "FEASIBLE" });
    expect(snapshot.recommendations[0]).toMatchObject({ id: "REC-1", basedOn: "CMP-1", basedOnKind: "BINARY", recommendationVersion: 1 });
    expect(snapshot.decisions).toHaveLength(0);
  });
});


describe("decision condition canonical boundary", () => {
  afterEach(() => { delete process.env.SICL_CORE_URL; delete process.env.SICL_CORE_SERVICE_TOKEN; process.env.NODE_ENV = "test"; process.env.SICL_ALLOW_LOCAL_CORE = "true"; vi.restoreAllMocks(); });

  it("fails closed instead of writing a local condition when a remote core is configured", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    vi.spyOn(db, "getSiclProject").mockResolvedValue({ projectId: "SICL-DC", ownerId: 7, name: "Decision conditions", location: "Test", version: 1, snapshot: JSON.stringify({ alternatives: [{ id: "ALT-DC", name: "Scheme" }], objectives: [{ id: "OBJ-DC", name: "Cost" }], decisionConditions: [], events: [] }), status: "DRAFT", createdAt: new Date(), updatedAt: new Date() } as any);
    await expect(appRouter.createCaller(ctx).projects.addRecord({ projectId: "SICL-DC", expectedVersion: 1, kind: "decisionConditions", record: { id: "COND-1", name: "Cost boundary", alternativeId: "ALT-DC", objectiveId: "OBJ-DC", criterion: "annual_cost", operator: "<=", threshold: 100000, unit: "USD/year", rationale: "Declared boundary", provenance: ["SRC-1"], conditionStatus: "DECLARED" } })).rejects.toThrow("require a canonical endpoint");
  });
});
