import { describe, expect, it } from "vitest";
import { ANDROID_TV_PROFILES, isSafeSmartTvSimulationAction, mapSmartTvKeyToAction, nextSmartTvRoute, SIMULATED_SMART_TV } from "./smartTvSimulationContract";

describe("Smart TV simulation contract", () => {
  it("uses an explicit simulated device and protocol", () => {
    expect(SIMULATED_SMART_TV.protocol).toBe("simulated");
    expect(SIMULATED_SMART_TV.id).toContain("sim-tv");
  });
  it("moves through a bounded TV navigation model", () => {
    expect(nextSmartTvRoute("home", "right")).toBe("media");
    expect(nextSmartTvRoute("media", "right")).toBe("apps");
    expect(nextSmartTvRoute("apps", "right")).toBe("apps");
    expect(nextSmartTvRoute("apps", "left")).toBe("media");
    expect(nextSmartTvRoute("apps", "home")).toBe("home");
  });
  it("exposes exactly three Android TV profiles for repeatable testing", () => {
    expect(ANDROID_TV_PROFILES).toHaveLength(3);
    expect(ANDROID_TV_PROFILES.every((profile) => profile.id.length > 0 && profile.model.includes("simulado"))).toBe(true);
  });
  it("maps physical remote keys to safe navigation actions", () => {
    expect(mapSmartTvKeyToAction("ArrowUp")).toBe("up");
    expect(mapSmartTvKeyToAction("Enter")).toBe("ok");
    expect(mapSmartTvKeyToAction("BrowserBack")).toBe("back");
    expect(mapSmartTvKeyToAction("F1")).toBeNull();
  });
  it("accepts only presentation/navigation actions", () => {
    expect(isSafeSmartTvSimulationAction("ok")).toBe(true);
    expect(isSafeSmartTvSimulationAction("home")).toBe(true);
    expect(isSafeSmartTvSimulationAction("wallet" as never)).toBe(false);
  });
});
