import { describe, expect, it } from "vitest";
import { getVisibleLaunchCapabilities, isCoreProtectedAction, isLaunchCapabilityAvailable } from "./lukaLaunchRegistry";

describe("LUKA launch capability registry", () => {
  it("makes only MVP surfaces available and keeps secondary capabilities reserved or hidden", () => {
    const visible = getVisibleLaunchCapabilities();
    expect(visible.map((capability) => capability.id)).toEqual(["ar-visor", "luka-tv", "tv", "trackpad", "keyboard", "gamepad", "voice"]);
    expect(isLaunchCapabilityAvailable("ar-visor")).toBe(true);
    expect(isLaunchCapabilityAvailable("luka-tv")).toBe(true);
    expect(isLaunchCapabilityAvailable("trackpad")).toBe(true);
    expect(isLaunchCapabilityAvailable("keyboard")).toBe(true);
    expect(isLaunchCapabilityAvailable("gamepad")).toBe(true);
    expect(isLaunchCapabilityAvailable("lights-climate")).toBe(false);
    expect(isLaunchCapabilityAvailable("l-star-currency")).toBe(false);
  });
  it("identifies protected core actions", () => {
    expect(isCoreProtectedAction("consultar wallet y ledger")).toBe(true);
    expect(isCoreProtectedAction("abrir Visor AR")).toBe(false);
  });
});
