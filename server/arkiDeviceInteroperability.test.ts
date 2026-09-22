import { describe, expect, it } from "vitest";
import { ARKI_DEVICE_MODES, buildArkiDeviceLinkPlan, isPrivilegedDeviceAction } from "../shared/arkiDeviceInteroperability";

describe("ARKI device interoperability", () => {
  const localDevice = {
    capabilities: ["NAVIGATION", "POINTER", "KEYBOARD", "GAMEPAD", "CAMERA", "MICROPHONE", "GEOLOCATION", "HIT_TEST", "PRESENTATION", "TEXT_INPUT"] as const,
    protocols: ["ARKI_RECEIVER", "WEBSOCKET", "WEBRTC", "BROADCAST_CHANNEL"] as const,
    status: "LOCAL" as const,
  };

  it("preserves MiLukita's universal modes without granting authority", () => {
    expect(ARKI_DEVICE_MODES).toEqual(["REMOTE", "GAMEPAD", "TRACKPAD", "KEYBOARD", "AR", "FIELD", "PRESENTATION"]);
    const plan = buildArkiDeviceLinkPlan("FIELD", localDevice);
    expect(plan.requiredCapabilities).toEqual(["CAMERA", "MICROPHONE", "GEOLOCATION"]);
    expect(plan.authority).toBe("NONE");
    expect(plan.humanReviewRequired).toBe(true);
  });

  it("does not pretend a missing host or capability is connected", () => {
    const plan = buildArkiDeviceLinkPlan("PRESENTATION", { capabilities: ["NAVIGATION", "POINTER", "PRESENTATION"], protocols: [], status: "LOCAL" });
    expect(plan.status).toBe("EXTERNAL_HOST_REQUIRED");
    const missing = buildArkiDeviceLinkPlan("AR", { capabilities: ["POINTER"], protocols: ["WEBSOCKET"], status: "LOCAL" });
    expect(missing.status).toBe("CAPABILITY_REQUIRED");
  });

  it("blocks privileged actions from device bridges", () => {
    expect(isPrivilegedDeviceAction("PUBLISH")).toBe(true);
    expect(isPrivilegedDeviceAction("POINTER_MOVE")).toBe(false);
  });
});
