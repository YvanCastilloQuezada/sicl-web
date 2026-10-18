export const LUKITA_LIVE_CAPTURE_CONTRACT = {
  version: "LUKITA-LIVE-CAPTURE-01",
  modes: ["photo", "video"],
  cameras: ["front", "rear"],
  flow: ["request_permission", "choose_camera", "meet_lukita", "capture", "review", "share_explicitly"],
  privacy: {
    permissionRequired: true,
    noAutomaticPublication: true,
    noIdentityRecognition: true,
    noGameTruthAccess: true,
  },
  preCapture: {
    countdownSeconds: 3,
    userCanPrepare: true,
  },
  review: {
    requiredBeforeShare: true,
    previewControls: ["play", "pause", "seek"] as const,
    discardAllowed: true,
  },
  share: {
    destinations: ["device_sheet", "x", "whatsapp", "instagram", "tiktok"] as const,
    userInitiatedOnly: true,
    automaticUpload: false,
  },
  output: {
    preferredVideoContainer: "mp4",
    browserFallback: "webm",
    userMustReviewBeforeShare: true,
  },
} as const;

export const isExplicitLukitaLiveShareFlow = () =>
  LUKITA_LIVE_CAPTURE_CONTRACT.privacy.permissionRequired &&
  LUKITA_LIVE_CAPTURE_CONTRACT.privacy.noAutomaticPublication &&
  LUKITA_LIVE_CAPTURE_CONTRACT.output.userMustReviewBeforeShare;
