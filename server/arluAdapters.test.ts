import { describe, expect, it } from "vitest";
import { createDeviceInteroperabilityAdapter, prepareDistributionAdapter, probeVoiceFieldAdapter } from "../shared/arluAdapters";

describe("AR-LU adapters", () => {
  it("probes voice and field capabilities without bypassing permissions", () => {
    const result = probeVoiceFieldAdapter({ secureContext: true, mediaDevices: true, geolocation: true, speechRecognition: false });
    expect(result.state).toBe("PERMISSION_REQUIRED");
    expect(result.capabilities).toContain("TRANSCRIPTION_SERVICE_REQUIRED");
    expect(result.canMutateCore).toBe(false);
  });

  it("uses real browser protocol availability for device pairing", () => {
    const result = createDeviceInteroperabilityAdapter({ protocol: "BROADCAST_CHANNEL", secureContext: true, userGesture: true, receiverId: "receiver-1" });
    expect(result.state).toBe("AVAILABLE");
    expect(result.capabilities).toContain("RECEIVER_IDENTIFIED");
  });

  it("keeps external distribution in preview or gated queue", () => {
    expect(prepareDistributionAdapter({ provider: "SOCIAL", assetChecksum: "sha256:abc", metadataComplete: true, humanApproved: false }).dispatch).toBe("PREVIEW_ONLY");
    expect(prepareDistributionAdapter({ provider: "SOCIAL", assetChecksum: "sha256:abc", metadataComplete: true, humanApproved: true }).dispatch).toBe("QUEUED_FOR_HUMAN_APPROVAL");
    expect(prepareDistributionAdapter({ provider: "SOCIAL", assetChecksum: "", metadataComplete: true, humanApproved: true }).state).toBe("BLOCKED");
  });
});
