import { describe, expect, it } from "vitest";
import { applyHomeDeviceAction, createIntentConfirmation, getRuntimeProfile, INITIAL_CONTEXT_STATE, LUKA_RUNTIME_PROFILES, nextRuntimeStatus, requestContextPermission, resolveIntentConfirmation, runSafeRuntimeEvent, shouldExposeCapability, SIMULATED_HOME_DEVICES, SIMULATED_INTERACTIVE_HOME_DEVICES } from "./lukaRuntimeContract";

describe("LUKA universal runtime contract", () => {
  it("defines the three non-production TV runtimes with LRUD", () => {
    expect(LUKA_RUNTIME_PROFILES).toHaveLength(3);
    expect(LUKA_RUNTIME_PROFILES.every((profile) => profile.navigation === "lrud" && profile.protocol.startsWith("simulated-"))).toBe(true);
    expect(getRuntimeProfile("roku").label).toBe("Roku");
  });
  it("keeps runtime status transitions bounded", () => {
    expect(nextRuntimeStatus("idle", "discover")).toBe("discovering");
    expect(nextRuntimeStatus("found", "connect")).toBe("connected");
    expect(nextRuntimeStatus("not-found", "qr-fallback")).toBe("qr-fallback");
    expect(nextRuntimeStatus("connected", "navigate")).toBe("connected");
  });
  it("requires explicit confirmation before an intent is executable", () => {
    const pending = createIntentConfirmation("audio", "config", "Subiré el volumen", 1_000, 10_000);
    expect(resolveIntentConfirmation(pending, "sí", 2_000).status).toBe("confirmed");
    expect(resolveIntentConfirmation(pending, "no", 2_000).status).toBe("rejected");
    expect(resolveIntentConfirmation(pending, "sí", 12_000).status).toBe("expired");
  });
  it("requests only contextual permissions and exposes AR only after camera grant", () => {
    const requested = requestContextPermission(INITIAL_CONTEXT_STATE, "camera", "ar");
    expect(requested.camera).toBe("requested");
    expect(shouldExposeCapability("ar", { connected: true, permission: "requested" })).toBe(false);
    expect(shouldExposeCapability("ar", { connected: true, permission: "granted" })).toBe(true);
    expect(requestContextPermission(INITIAL_CONTEXT_STATE, "geolocation", "audio")).toEqual(INITIAL_CONTEXT_STATE);
  });
  it("toggles and adjusts only interactive simulated home lights", () => {
    const toggled = applyHomeDeviceAction(SIMULATED_INTERACTIVE_HOME_DEVICES, 0, "toggle");
    expect(toggled[0].enabled).toBe(false);
    expect(toggled[0].lastAction).toBe("toggle");
    const increased = applyHomeDeviceAction(toggled, 0, "increase");
    expect(increased[0].value).toBe(80);
    const audioAttempt = applyHomeDeviceAction(increased, 2, "increase");
    expect(audioAttempt[2]).toEqual(increased[2]);
  });
  it("keeps home devices simulated and rejects core-affecting events", () => {
    expect(SIMULATED_HOME_DEVICES.every((device) => device.status.includes("simulated") || device.status === "not-connected")).toBe(true);
    expect(runSafeRuntimeEvent({ type: "navigate", key: "home" })).toBe(true);
    expect(runSafeRuntimeEvent({ type: "wallet" } as never)).toBe(false);
  });
});
