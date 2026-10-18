import { describe, expect, it } from "vitest";
import {
  UNIVERSAL_CONTROLLER_MODES,
  UNIVERSAL_CONTROLLER_REGISTRY,
  controllerModeCapability,
  controllerModeDecisionIsSafe,
  controllerModesShareIntentEngine,
  controllerModeHasAuthority,
  decideControllerMode,
  intentForControllerMode,
  isControllerMode,
} from "./universalController";

describe("Fase E.4 Universal Controller", () => {
  const guestContext = {
    permissions: { camera: "GRANTED", microphone: "GRANTED", geolocation: "GRANTED" } as never,
    connected: true,
    role: "guest" as const,
  };

  it("registra Remote, Gamepad, Trackpad, Keyboard, AR, Home y Field sobre superficies existentes", () => {
    expect(UNIVERSAL_CONTROLLER_MODES).toEqual(["remote", "gamepad", "trackpad", "keyboard", "ar", "home", "field"]);
    expect(UNIVERSAL_CONTROLLER_REGISTRY).toHaveLength(7);
    expect(UNIVERSAL_CONTROLLER_REGISTRY.every((entry) => entry.implementation === "existing-surface")).toBe(true);
  });

  it("converge las modalidades en el Intent Engine y conserva capabilities explícitas", () => {
    expect(controllerModesShareIntentEngine()).toBe(true);
    expect(controllerModeCapability("remote")).toBe("luka-tv");
    expect(controllerModeCapability("ar")).toBe("ar-visor");
    expect(controllerModeCapability("home")).toBe("lights-climate");
    expect(intentForControllerMode("keyboard").id).toBe("write");
    expect(intentForControllerMode("field").capability).toBe("trackpad");
  });

  it("mantiene Controller ≠ Authority y Mode ≠ Authority", () => {
    for (const mode of UNIVERSAL_CONTROLLER_MODES) {
      expect(controllerModeHasAuthority(mode)).toBe(false);
      expect(controllerModeDecisionIsSafe(decideControllerMode(mode, guestContext))).toBe(true);
    }
  });

  it("rechaza modalidades desconocidas y conserva el gate para capacidades no públicas", () => {
    expect(isControllerMode("remote")).toBe(true);
    expect(isControllerMode("mjp-core")).toBe(false);
    expect(decideControllerMode("gamepad", guestContext).status).toBe("DENIED");
    expect(decideControllerMode("home", guestContext).status).toBe("DENIED");
  });
});
