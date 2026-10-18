import { describe, expect, it } from "vitest";
import { assertRoundTransition, canTransitionRound, isTerminalRoundState } from "./roundState";

describe("round lifecycle", () => {
  it("allows only the persisted forward lifecycle", () => {
    expect(canTransitionRound("draft", "open")).toBe(true);
    expect(canTransitionRound("open", "locked")).toBe(true);
    expect(canTransitionRound("locked", "drawn")).toBe(true);
    expect(canTransitionRound("drawn", "settled")).toBe(true);
    expect(canTransitionRound("settled", "open")).toBe(false);
    expect(canTransitionRound("drawn", "open")).toBe(false);
    expect(canTransitionRound("verified", "open")).toBe(false);
  });

  it("throws on invalid transitions and identifies terminal states", () => {
    expect(() => assertRoundTransition("open", "drawn")).toThrow("Transición de ronda no permitida");
    expect(isTerminalRoundState("settled")).toBe(true);
    expect(isTerminalRoundState("archived")).toBe(true);
    expect(isTerminalRoundState("open")).toBe(false);
  });
});
