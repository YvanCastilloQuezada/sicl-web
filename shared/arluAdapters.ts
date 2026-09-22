export type AdapterKind = "VOICE_FIELD" | "DEVICE_INTEROP" | "DISTRIBUTION";
export type AdapterState = "AVAILABLE" | "PERMISSION_REQUIRED" | "HOST_REQUIRED" | "BLOCKED";
export type AdapterProbe = { adapter: AdapterKind; state: AdapterState; capabilities: string[]; evidence: string[]; humanReviewRequired: true; canPublish: false; canMutateCore: false };

export function probeVoiceFieldAdapter(env: { secureContext: boolean; mediaDevices: boolean; geolocation: boolean; speechRecognition: boolean }): AdapterProbe {
  const capabilities = [env.mediaDevices ? "CAMERA_MICROPHONE" : "NO_MEDIA_DEVICES", env.geolocation ? "GEOLOCATION" : "NO_GEOLOCATION", env.speechRecognition ? "BROWSER_SPEECH_RECOGNITION" : "TRANSCRIPTION_SERVICE_REQUIRED"];
  const state: AdapterState = !env.secureContext ? "BLOCKED" : env.mediaDevices && env.geolocation ? "PERMISSION_REQUIRED" : "HOST_REQUIRED";
  return { adapter: "VOICE_FIELD", state, capabilities, evidence: ["HTTPS_REQUIRED", "USER_PERMISSION_REQUIRED", "FIELD_OBSERVATION_PROVENANCE"], humanReviewRequired: true, canPublish: false, canMutateCore: false };
}

export function createDeviceInteroperabilityAdapter(input: { protocol: "BROADCAST_CHANNEL" | "WEBRTC" | "WEBSOCKET" | "CAST"; secureContext: boolean; userGesture: boolean; receiverId?: string }): AdapterProbe {
  const protocolAvailable = input.protocol === "BROADCAST_CHANNEL" ? typeof BroadcastChannel !== "undefined" : input.protocol === "WEBRTC" ? typeof RTCPeerConnection !== "undefined" : input.protocol === "WEBSOCKET" ? typeof WebSocket !== "undefined" : false;
  const state: AdapterState = !input.secureContext || !input.userGesture ? "PERMISSION_REQUIRED" : protocolAvailable ? "AVAILABLE" : "HOST_REQUIRED";
  return { adapter: "DEVICE_INTEROP", state, capabilities: [input.protocol, input.receiverId ? "RECEIVER_IDENTIFIED" : "RECEIVER_DISCOVERY_REQUIRED"], evidence: ["USER_GESTURE", "SECURE_CONTEXT", "PAIRING_AUDIT_REQUIRED"], humanReviewRequired: true, canPublish: false, canMutateCore: false };
}

export function prepareDistributionAdapter(input: { provider: "SOCIAL" | "OTT" | "CDN" | "QR"; assetChecksum: string; metadataComplete: boolean; humanApproved: boolean }): AdapterProbe & { dispatch: "PREVIEW_ONLY" | "QUEUED_FOR_HUMAN_APPROVAL" } {
  const state: AdapterState = !input.assetChecksum || !input.metadataComplete ? "BLOCKED" : input.humanApproved ? "PERMISSION_REQUIRED" : "HOST_REQUIRED";
  return { adapter: "DISTRIBUTION", state, capabilities: [input.provider, input.metadataComplete ? "METADATA_VALIDATED" : "METADATA_MISSING"], evidence: [`ASSET_CHECKSUM:${input.assetChecksum || "MISSING"}`, "PROVIDER_CREDENTIALS_SERVER_SIDE", "PUBLICATION_HUMAN_GATE"], humanReviewRequired: true, canPublish: false, canMutateCore: false, dispatch: input.humanApproved ? "QUEUED_FOR_HUMAN_APPROVAL" : "PREVIEW_ONLY" };
}
