import { describe, expect, it } from "vitest";
import { createExperience, experienceStateCanMove, experienceStateFromEvent, EXPERIENCE_TEMPLATES } from "./experienceEngine";
import { eventFromRound } from "./eventEngine";

describe("Experience Engine v1", () => {
  it("crea una experiencia de lotería virtual desde una plantilla reutilizable", () => {
    const experience = createExperience({ experienceId: "EXP-1", eventId: "ROUND-1", gameId: "loteria_39" });
    expect(experience.templateId).toBe("LOTTERY_STANDARD");
    expect(experience.phases).toContain("DRAW");
    expect(experience.virtualOnly).toBe(true);
    expect(experience.mobileMode).toBe("CONTROLLER");
  });

  it("mantiene el estado de experiencia subordinado al evento autoritativo", () => {
    const event = eventFromRound({ publicId: "ROUND-2", gameType: "loteria_39", state: "locked", openAt: 100, closeAt: 200, drawAt: 300 });
    expect(experienceStateFromEvent(event)).toBe("LOCKED");
    expect(experienceStateCanMove("LOCKED", "DRAWING")).toBe(true);
    expect(experienceStateCanMove("OPEN", "RESULT")).toBe(false);
  });

  it("incluye plantillas explícitas sin convertirlas en fuente matemática", () => {
    expect(EXPERIENCE_TEMPLATES.SPECIAL_EVENT.interactionMode).toBe("ENTERTAINMENT_ONLY");
    expect(EXPERIENCE_TEMPLATES.BINGO_STANDARD.virtualOnly).toBe(true);
  });
});
