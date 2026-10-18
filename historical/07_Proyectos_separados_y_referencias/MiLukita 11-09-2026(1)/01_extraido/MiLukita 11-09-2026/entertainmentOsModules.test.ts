import { describe, expect, it } from "vitest";
import { getContent, moderateContent, renderSafeContent, rotateContent } from "./contentEngine";
import { executeRecovery, planRecovery, detectFailure } from "../server/recovery/RecoveryEngine";
import { resolveConflict } from "../server/scheduler/SchedulerService";
import { present } from "../server/lukita/LukitaVoiceEngine";

describe("Entertainment OS safe modules", () => {
  it("returns versioned v2 content and rotates deterministically", () => {
    const items = getContent("v2", "OPENING");
    expect(items[0]?.version).toBe("v2");
    expect(rotateContent("OPENING", 0)?.id).toBe(items[0]?.id);
    expect(moderateContent(items[0]!)).toBe(true);
  });

  it("rejects risky content and falls back safely", () => {
    expect(moderateContent("dinero real y ganancia garantizada")).toBe(false);
    const variant = renderSafeContent({ gameName: "Ruleta", state: "OPEN", resultAvailable: false, virtualOnly: true }, "dinero real");
    expect(variant.source).toBe("SAFE_FALLBACK");
    expect(variant.virtualOnly).toBe(true);
  });

  it("plans recovery without executing mutations", () => {
    const result = executeRecovery(planRecovery(detectFailure("heartbeat", "timeout", "CRITICAL")));
    expect(result.status).toBe("ESCALATED");
    expect(result.executed).toBe(false);
    expect(result.plan.authority).toBe("NO_RESULT_AUTHORITY");
  });

  it("keeps Lukita voice and lip-sync in preproduction preview", async () => {
    const preview = await present("Bienvenidos a MiLukita", "WARM");
    expect(preview.integration).toBe("PREPRODUCTION_PREVIEW");
    expect(preview.audio.productionEnabled).toBe(false);
    expect(preview.lipSync.testOnly).toBe(true);
  });

  it("escalates scheduler conflicts to a human", () => {
    expect(resolveConflict({ eventId: "E1", reason: "overlap" })).toEqual({ eventId: "E1", reason: "overlap", resolution: "ESCALATE_HUMAN", automaticMutation: false });
  });
});
