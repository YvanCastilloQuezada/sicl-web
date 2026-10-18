import { describe, expect, it } from "vitest";
import { buildWorkerClaimKey, getWorkerBucket, isDuplicateClaimError, SUPERVISED_WORKER_WINDOW_HOURS } from "./supervisedWorker";

describe("supervised scheduler worker", () => {
  it("uses a deterministic one-minute bucket for idempotency", () => {
    const first = new Date("2026-08-26T12:00:00.000Z");
    const second = new Date("2026-08-26T12:00:59.999Z");
    expect(getWorkerBucket(first)).toBe(getWorkerBucket(second));
    expect(buildWorkerClaimKey("task-1", first)).toBe(buildWorkerClaimKey("task-1", second));
    expect(buildWorkerClaimKey("task-1", first)).not.toBe(buildWorkerClaimKey("task-2", first));
  });

  it("declares a bounded 24-hour supervised window", () => {
    expect(SUPERVISED_WORKER_WINDOW_HOURS).toBe(24);
  });

  it("recognizes unique-claim errors as duplicate executions", () => {
    expect(isDuplicateClaimError(new Error("Duplicate entry for key idempotencyKey"))).toBe(true);
    expect(isDuplicateClaimError(new Error("ER_DUP_ENTRY 1062"))).toBe(true);
    expect(isDuplicateClaimError(new Error("database unavailable"))).toBe(false);
  });
});
