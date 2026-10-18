import { describe, expect, it } from "vitest";
import { getContextualControllerActions, isControllerState, transitionLukaController } from "./lukaControllerState";

describe("LUKA contextual controller state", () => {
  it("transitions through the MVP states without reaching MJP CORE", () => {
    expect(transitionLukaController("ar", "watch-tv")).toBe("tv");
    expect(transitionLukaController("tv", "open-trackpad")).toBe("trackpad");
    expect(transitionLukaController("trackpad", "enter-ar")).toBe("ar");
    expect(transitionLukaController("tv", "open-keyboard")).toBe("keyboard");
    expect(transitionLukaController("tv", "open-gamepad")).toBe("gamepad");
  });

  it("reveals only contextual next actions", () => {
    expect(getContextualControllerActions("ar")).toEqual(["watch-tv"]);
    expect(getContextualControllerActions("tv")).toContain("open-trackpad");
    expect(getContextualControllerActions("tv")).not.toContain("open-config");
  });

  it("validates only the five presentation controller states", () => {
    expect(isControllerState("ar")).toBe(true);
    expect(isControllerState("mjp-core")).toBe(false);
  });
});
