import { beforeEach, describe, expect, it, vi } from "vitest";

const seen = new Set<string>();
vi.mock("./onlineTvPersistence", () => ({
  persistOnlineTvSession: vi.fn().mockResolvedValue(undefined),
  finalizeOnlineTvAction: vi.fn().mockResolvedValue(undefined),
  recordOnlineTvAction: vi.fn(async (_sessionId: string, action: { actionId?: string }) => {
    const key = action.actionId ?? "missing";
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }),
}));

import { createOnlineTvSession, submitOnlineTvActionPersisted } from "./onlineTvGames";

describe("TV en línea anti-replay", () => {
  beforeEach(() => seen.clear());

  it("rechaza una segunda acción con el mismo actionId sin duplicar puntuación", async () => {
    const session = createOnlineTvSession("TRAFFIC_LIGHT", "STANDARD", 1_000);
    const action = { type: "TRAFFIC_LIGHT" as const, signal: "GO" as const, participantId: "p-1", actionId: "action-1" };
    const first = await submitOnlineTvActionPersisted(session.sessionId, action, 1_001);
    const second = await submitOnlineTvActionPersisted(session.sessionId, action, 1_002);

    expect(first.accepted).toBe(true);
    expect(first.scoreDelta).toBe(100);
    expect(second.accepted).toBe(false);
    expect(second.scoreDelta).toBe(0);
    expect(second.message).toContain("duplicada");
  });
});
