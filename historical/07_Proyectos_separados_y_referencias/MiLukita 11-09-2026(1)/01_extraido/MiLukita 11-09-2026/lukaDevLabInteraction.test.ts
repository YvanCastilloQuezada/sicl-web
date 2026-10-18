import { describe, expect, it } from "vitest";
import { DEV_LAB_GPS_POINTS, DEV_LAB_PAIRED_DEVICES, DEV_LAB_SAMPLE_VOICE_LOGS, DEV_LAB_TV_TRANSPORT_CONTRACTS, createSimulatedWorldQrPayload, describeSimulatedTvTransport, formatSimulatedCoordinates, getSimulatedMvpMetrics, isValidSimulatedCoordinates, nextSimulatedQrStatus, nextSimulatedTvPairingState, reconnectSimulatedTvDevice, serializeDevLabVoiceLogs, serializeSimulatedPairedDevices, simulateTvPairingError, removeSimulatedPairedDevice, isSimulatedPairedDeviceExpired, type DevLabPairedDevice } from "./lukaDevLabInteraction";

describe("LUKA Dev Lab interaction contract", () => {
  it("offers reproducible territorial GPS points", () => {
    expect(DEV_LAB_GPS_POINTS).toHaveLength(3);
    expect(DEV_LAB_GPS_POINTS.map((point) => point.label)).toContain("Huaca del Sol");
    expect(formatSimulatedCoordinates(DEV_LAB_GPS_POINTS[0].latitude, DEV_LAB_GPS_POINTS[0].longitude)).toBe("-12.0464, -77.0428");
  });

  it("keeps voice records explicitly simulated", () => {
    expect(DEV_LAB_SAMPLE_VOICE_LOGS.every((log) => log.source === "simulated")).toBe(true);
    expect(DEV_LAB_SAMPLE_VOICE_LOGS.map((log) => log.intent)).toContain("tv-channel");
  });

  it("accepts valid custom coordinates and rejects invalid ranges", () => {
    expect(isValidSimulatedCoordinates(-12.04, -77.03)).toBe(true);
    expect(isValidSimulatedCoordinates(91, 0)).toBe(false);
    expect(isValidSimulatedCoordinates(0, -181)).toBe(false);
  });

  it("serializes the simulated voice log for CSV and JSON export", () => {
    const csv = serializeDevLabVoiceLogs(DEV_LAB_SAMPLE_VOICE_LOGS, "csv");
    const json = serializeDevLabVoiceLogs(DEV_LAB_SAMPLE_VOICE_LOGS, "json");
    expect(csv.extension).toBe("csv");
    expect(csv.body).toContain("id,transcript,intent,status,source");
    expect(json.extension).toBe("json");
    expect(JSON.parse(json.body)).toHaveLength(3);
  });

  it("keeps QR, MVP metrics and TV transport explicitly simulated", () => {
    expect(createSimulatedWorldQrPayload("mundo-luka")).toContain("LUKA-SIM|mundo-luka|");
    expect(getSimulatedMvpMetrics()).toEqual({ timeToFirstLukaMs: 4200, timeToFirstActionMs: 11800, source: "simulated" });
    expect(describeSimulatedTvTransport("simulated-ready")).toContain("simulado");
  });

  it("progresses the simulated QR flow and TV pairing flow deterministically", () => {
    expect(nextSimulatedQrStatus("idle")).toBe("generated");
    expect(nextSimulatedQrStatus("scanning")).toBe("matched");
    expect(nextSimulatedTvPairingState("idle")).toBe("scanning");
    expect(nextSimulatedTvPairingState("pairing")).toBe("paired");
  });

  it("supports quick reconnection and controlled pairing errors", () => {
    expect(DEV_LAB_PAIRED_DEVICES).toHaveLength(2);
    expect(reconnectSimulatedTvDevice(DEV_LAB_PAIRED_DEVICES[0]).state).toBe("paired");
    expect(simulateTvPairingError().state).toBe("error");
  });
});


describe("controlled TV history and transport contract", () => {
  it("keeps Cast and DLNA as simulated presentation-only contracts", () => {
    expect(DEV_LAB_TV_TRANSPORT_CONTRACTS.map((item) => item.protocol)).toEqual(["cast", "dlna"]);
    expect(DEV_LAB_TV_TRANSPORT_CONTRACTS.every((item) => item.discovery === "simulated" && item.writeAuthority === "presentation-only")).toBe(true);
  });

  it("removes only the requested paired device", () => {
    const devices = [{ id: "a" }, { id: "b" }] as DevLabPairedDevice[];
    expect(removeSimulatedPairedDevice(devices, "a").map((device) => device.id)).toEqual(["b"]);
  });

  it("expires timestamped devices according to the selected retention", () => {
    const device = { id: "old", lastConnectedAt: 0 } as DevLabPairedDevice;
    expect(isSimulatedPairedDeviceExpired(device, 8 * 24 * 60 * 60 * 1000, 7)).toBe(true);
    expect(isSimulatedPairedDeviceExpired(device, 8 * 24 * 60 * 60 * 1000, 0)).toBe(false);
  });

  it("serializes the controlled history as JSON", () => {
    const body = serializeSimulatedPairedDevices([{ id: "a" }] as DevLabPairedDevice[]);
    expect(JSON.parse(body)).toEqual([{ id: "a" }]);
  });
});
