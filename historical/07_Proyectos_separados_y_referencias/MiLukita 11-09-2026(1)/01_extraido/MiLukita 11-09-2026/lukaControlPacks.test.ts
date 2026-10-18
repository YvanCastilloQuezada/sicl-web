import { describe, expect, it } from "vitest";
import { activatePackFromDevice, CONTROL_PACKS, detectSimulatedDevices, getControlPack, getSimulatedDiscoverySummary, resolvePackFromDevice, scanSimulatedDevices, tickSimulatedTelemetry } from "./lukaControlPacks";
import { auditIntentCommandMatrix, LUKA_INTENT_TEST_COMMANDS } from "./lukaOsContract";

describe("LUKA Control Packs", () => {
  it("declares exactly eight contextual packs", () => {
    expect(CONTROL_PACKS).toHaveLength(8);
    expect(new Set(CONTROL_PACKS.map((pack) => pack.id)).size).toBe(8);
  });
  it("keeps simulated device detection bounded and explicit", () => {
    const devices = detectSimulatedDevices();
    expect(devices.length).toBeGreaterThan(5);
    expect(devices.every((device) => device.protocol === "simulated")).toBe(true);
    expect(resolvePackFromDevice("smart-tv")).toBe("tv");
  });
  it("updates telemetry within safe visual bounds", () => {
    const next = tickSimulatedTelemetry(detectSimulatedDevices(), 3);
    expect(next.every((device) => device.batteryPercent >= 20 && device.batteryPercent <= 100)).toBe(true);
    expect(next.every((device) => device.signalPercent >= 58 && device.signalPercent <= 100)).toBe(true);
  });
  it("separates simulated Wi-Fi and Bluetooth scans and activates a contextual pack", () => {
    const wifi = scanSimulatedDevices("wifi", 123);
    const bluetooth = scanSimulatedDevices("bluetooth", 123);
    expect(wifi.length).toBeGreaterThan(0);
    expect(bluetooth.length).toBeGreaterThan(0);
    expect(wifi.every((device) => device.source === "wifi" && device.discoveredAt === 123)).toBe(true);
    expect(bluetooth.every((device) => device.source === "bluetooth")).toBe(true);
    expect(activatePackFromDevice({ kind: "smart-tv" })).toBe("tv");
    expect(getSimulatedDiscoverySummary(123).authority).toBe("presentation-only");
  });
  it("resolves ten reproducible voice commands without exposing core actions", () => {
    const results = auditIntentCommandMatrix();
    expect(LUKA_INTENT_TEST_COMMANDS).toHaveLength(10);
    expect(results.every((result) => result.intent.id !== "unknown")).toBe(true);
  });
  it("keeps pack lookup deterministic", () => {
    expect(getControlPack("audio").center).toContain("Volumen");
    expect(getControlPack("tv").nextActions.length).toBeLessThanOrEqual(2);
  });
});
