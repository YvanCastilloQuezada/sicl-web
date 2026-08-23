import { afterEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const user = { id: 7, openId: "actor-7", email: "actor@example.test", name: "Actor", loginMethod: "test", role: "user" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
const ctx: TrpcContext = { user, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
const response = () => new Response(JSON.stringify({ contract_version: "sicl-core-http/0.1", project_id: "SICL-1", observed_version: 2 }), { status: 200, headers: { "content-type": "application/json" } });

describe("tRPC to SICL Core delegation", () => {
  afterEach(() => { delete process.env.SICL_CORE_URL; delete process.env.SICL_CORE_SERVICE_TOKEN; vi.unstubAllGlobals(); });

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

  it("rejects a human recommendation at the web contract boundary", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const caller = appRouter.createCaller(ctx);
    await expect(caller.projects.recommendationCreate({ projectId: "SICL-1", expectedVersion: 1, recommendationId: "REC-1", alternativeId: "ALT-A", basedOn: "human", basedOnKind: "BINARY", reason: "Human reason is explicit", source: "HUMAN" as never })).rejects.toThrow();
  });
});

  it.each([401, 409, 422])("preserves core adapter error %s", async (status) => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status })));
    const caller = appRouter.createCaller(ctx);
    await expect(caller.projects.recommendationCreate({ projectId: "SICL-1", expectedVersion: 1, recommendationId: "REC-1", alternativeId: "ALT-A", basedOn: "CMP-1", basedOnKind: "BINARY", reason: "Explicit analytical basis", source: "ANALYTICAL" })).rejects.toThrow(String(status));
  });


describe("production core boundary", () => {
  afterEach(() => { delete process.env.SICL_CORE_URL; delete process.env.SICL_CORE_SERVICE_TOKEN; process.env.NODE_ENV = "test"; vi.unstubAllGlobals(); });

  it("fails closed when production has no canonical core URL", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.SICL_CORE_URL;
    const caller = appRouter.createCaller(ctx);
    await expect(caller.projects.list()).rejects.toThrow("SICL_CORE_URL is required in production");
  });
});
