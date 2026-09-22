export const MILUQUITA_TRANSFER_SOURCE = {
  repository: "YvanCastilloQuezada/milukita",
  branch: "transfer/arki-corp-milukita-ordenes-001-008",
  commit: "2fb937a223752d44e8958ca526d6df8f642482d5",
  originalProductPreserved: true,
} as const;

export const ABSORBED_CAPABILITIES = [
  "FIELD_VOICE_INTENT_CONTRACT",
  "CAMERA_GPS_OBSERVATION_MODEL",
  "AR_HIT_TEST_AND_ANCHOR_CONTRACT",
  "TERRITORIAL_EVIDENCE_AND_PROVENANCE",
  "OFFLINE_CAPTURE_CONFLICT_MODEL",
  "HUMAN_REVIEW_AND_PUBLICATION_GATES",
  "QR_PROJECT_ENTRY_PATTERN",
] as const;

export const EXCLUDED_CAPABILITIES = [
  "GAMES",
  "ROULETTE",
  "BINGO",
  "LOTTERIES",
  "JACKPOT",
  "MULTIMARKET",
  "RTP",
  "RNG",
  "WALLET",
  "REWARD_LEDGER",
  "SETTLEMENT",
  "MJP_CORE",
  "ENTERTAINMENT_COMMERCIAL_SURFACES",
] as const;

export function selectiveAbsorptionManifest() {
  return {
    ...MILUQUITA_TRANSFER_SOURCE,
    target: "ARKI",
    mode: "DEPURATED_CONTRACT_ABSORPTION" as const,
    absorbed: [...ABSORBED_CAPABILITIES],
    excluded: [...EXCLUDED_CAPABILITIES],
    canonicalFlow: "MILUQUITA_CAPTURE -> ARKI_INTERPRETATION -> SICL_CORE_REVIEWED_PERSISTENCE",
    deletionScope: "ARKI_COPY_ONLY" as const,
    humanReviewRequired: true as const,
    deviceDecisionAuthority: false as const,
    devicePublicationAuthority: false as const,
  };
}
