export type DistributionChannel = "WEB" | "PWA" | "ANDROID_TV" | "IOS" | "TIZEN" | "WEBOS" | "OTT" | "IPTV" | "CABLE" | "YOUTUBE" | "SOCIAL";
export type DistributionReadiness = "READY" | "PARTIAL" | "BLOCKED" | "EXTERNAL_REQUIRED" | "NO_DATA";
export type DistributionGate = "CONTENT_APPROVED" | "LEGAL_CLEARED" | "EXPERIENCE_CLEARED" | "ASSET_READY" | "METADATA_READY" | "PROVIDER_CONNECTED" | "QA_PASSED" | "HUMAN_APPROVED";

export type DistributionChannelAssessment = {
  channel: DistributionChannel;
  readiness: DistributionReadiness;
  gates: readonly DistributionGate[];
  missingGates: readonly DistributionGate[];
  provider: string | null;
  evidence: readonly string[];
};

export const DISTRIBUTION_CORE_DENIALS = ["MJP_CORE", "RNG", "RESULT", "RTP", "WALLET", "LEDGER", "SETTLEMENT"] as const;
export const DISTRIBUTION_REQUIRED_GATES = ["CONTENT_APPROVED", "LEGAL_CLEARED", "EXPERIENCE_CLEARED", "ASSET_READY", "METADATA_READY", "PROVIDER_CONNECTED", "QA_PASSED", "HUMAN_APPROVED"] as const;

export function assessDistributionChannel(input: { channel: DistributionChannel; gates?: readonly DistributionGate[]; provider?: string | null; evidence?: readonly string[] }): DistributionChannelAssessment {
  const gates = Array.from(new Set(input.gates ?? []));
  const missingGates = DISTRIBUTION_REQUIRED_GATES.filter((gate) => !gates.includes(gate));
  const readiness: DistributionReadiness = missingGates.includes("PROVIDER_CONNECTED") ? "EXTERNAL_REQUIRED" : missingGates.length === 0 ? "READY" : "PARTIAL";
  return { channel: input.channel, readiness, gates, missingGates, provider: input.provider ?? null, evidence: [...(input.evidence ?? [])] };
}

export function distributionCanPublish(_assessment: DistributionChannelAssessment): false {
  return false;
}

export function distributionCanWriteCore(_target: string): false {
  return false;
}

export function distributionStatusIsHonest(status: DistributionReadiness, evidence: readonly string[]): boolean {
  return status === "NO_DATA" ? evidence.length === 0 : status !== "READY" || evidence.length > 0;
}
