import { describe, expect, it } from "vitest";
import { eventFromRound, eventStatusCanMove } from "./eventEngine";
import { createInteraction } from "./interactionEngine";
import { buildAvatarScript } from "./avatarScripts";
import { contentForView, experienceView } from "./experienceEngine";
import { proposeSchedule } from "../server/schedulerEngine";

describe("MJP Event Engine", () => {
  it("projects a persisted open round into an event with QR and virtual-only display", () => {
    const event = eventFromRound({ publicId: "RP-1", gameType: "loteria_39", state: "open", openAt: 100, closeAt: 200, drawAt: 300, rulesetPublicId: "RULE-1" }, "Lotería 39");
    expect(event.status).toBe("OPEN");
    expect(event.qrConfiguration.roundId).toBe("RP-1");
    expect(event.displayConfiguration.virtualOnly).toBe(true);
    expect(experienceView(event)).toBe("OPEN");
    expect(contentForView("OPEN", "Lotería 39").virtualOnly).toBe(true);
  });
  it("rejects event jumps that bypass the official lifecycle", () => {
    expect(eventStatusCanMove("OPEN", "RESULT_VERIFIED")).toBe(false);
    expect(eventStatusCanMove("LOCKED", "DRAWING")).toBe(true);
  });
  it("keeps avatar and interaction subordinate to the event", () => {
    expect(buildAvatarScript("RESULT_VERIFIED", "Lotería 39").canChangeOfficialState).toBe(false);
    expect(createInteraction({ interactionId: "I-1", eventId: "RP-1", type: "TRIVIA", kind: "ENTERTAINMENT_INTERACTION", prompt: "¿Listo?", options: ["Sí", "Aún no"], closesAt: null }).virtualOnly).toBe(true);
  });
  it("proposes non-published blocks and reports invalid candidates", () => {
    const proposal = proposeSchedule([{ gameId: "loteria_39", title: "Lotería 39", frequencyPerWeek: 1, durationMinutes: 5, priority: "HIGH", primeTime: true, minGapMinutes: 10, category: "lottery" }, { gameId: "bad", title: "Bad", frequencyPerWeek: 0, durationMinutes: 5, priority: "LOW", primeTime: false, minGapMinutes: 0, category: "test" }], 0, 1);
    expect(proposal.blocks).toHaveLength(1);
    expect(proposal.published).toBe(false);
    expect(proposal.requiresApproval).toBe(true);
    expect(proposal.conflicts).toHaveLength(1);
  });
});
