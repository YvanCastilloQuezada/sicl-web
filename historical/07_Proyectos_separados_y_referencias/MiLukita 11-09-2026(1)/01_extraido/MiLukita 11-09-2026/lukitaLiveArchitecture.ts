export type LukitaLiveLayer =
  | "LUKITA_CHARACTER"
  | "LUKITA_SPATIAL"
  | "LUKITA_AR"
  | "LUKITA_AI"
  | "LUKITA_COMPANION"
  | "EXPERIENCES"
  | "PLATFORM_CORE"
  | "PROTECTED_MJP_CORE";

export type LukitaBehaviorState =
  | "LUKITA_DISCOVERY"
  | "LUKITA_BEACON"
  | "LUKITA_APPROACH"
  | "LUKITA_GIANT"
  | "LUKITA_PERSONAL"
  | "LUKITA_GREETING"
  | "LUKITA_PLAY"
  | "LUKITA_DANCE"
  | "LUKITA_CELEBRATE"
  | "LUKITA_IDLE";

export type LukitaScaleBand = "DISCOVERY" | "BEACON" | "GIANT" | "PERSONAL";

export type LukitaPoint = {
  pointId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    altitudeM?: number;
  };
  orientation: {
    headingDegrees: number;
    pitchDegrees?: number;
  };
  spatialAnchor: "GPS_APPROXIMATE" | "DEVICE_ANCHOR" | "MANUAL_REVIEW";
  scaleProfile: "LUKITA_LIVE_DEFAULT" | "CUSTOM_PENDING_REVIEW";
  activationRadiusM: number;
  interactionRadiusM: number;
  visibility: "DRAFT" | "REVIEW" | "APPROVED" | "ACTIVE" | "PAUSED";
  experienceIds: readonly string[];
  assetVersion: string;
  audioProfile: string | null;
  publicQrId: string | null;
  scheduleId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LukitaBehaviorContext = {
  distanceM: number | null;
  orientation: "FACING" | "ORIENTED_AWAY" | "UNKNOWN";
  session: "DISCOVERING" | "ACTIVE" | "IDLE" | "ENDED";
  timeOfDay: "DAY" | "NIGHT" | "UNKNOWN";
  locationState: "AT_POINT" | "NEAR_POINT" | "OUTSIDE_RADIUS" | "UNKNOWN";
  experience: "NONE" | "SOCIAL" | "TUTORIAL" | "EVENT" | "CULTURAL" | "EDUCATIONAL";
  interaction: "NONE" | "LOOKING" | "TOUCHING" | "CAPTURE_REQUESTED" | "SHARING";
  presenceCount: number | null;
};

export type LukitaScaleResult = {
  band: LukitaScaleBand;
  targetHeightM: number;
  normalizedDistance: number | null;
  smoothing: "CONTINUOUS_SMOOTHSTEP";
  behaviorHint: "DISCOVER" | "BEACON" | "GROW" | "PERSONAL";
};

export const LUKITA_LIVE_ARCHITECTURE_CONTRACT = {
  version: "LUKITA-LIVE-ARCHITECTURE-01",
  protagonist: "LUKITA",
  layers: [
    "LUKITA_CHARACTER",
    "LUKITA_SPATIAL",
    "LUKITA_AR",
    "LUKITA_AI",
    "LUKITA_COMPANION",
    "EXPERIENCES",
    "PLATFORM_CORE",
    "PROTECTED_MJP_CORE",
  ] as const,
  flow: [
    "WORLD_CONTEXT",
    "LUKITA_CONTEXT",
    "BEHAVIOR_ENGINE",
    "SCALE_ENGINE",
    "EXPERIENCE_RENDERER",
    "CAMERA_CAPTURE",
    "HUMAN_REVIEW",
    "EXPLICIT_SHARE",
  ] as const,
  protectedSurfaces: [
    "RNG",
    "RESULTS",
    "RTP",
    "WALLET",
    "LEDGER",
    "SETTLEMENT",
    "GAME_RULES",
    "MJP_TV_MANIFEST",
  ] as const,
  authority: {
    lukita: "PRESENTATION_ONLY",
    agents: "PROPOSE_ONLY",
    platformCore: "INFRASTRUCTURE_ONLY",
    mjpCore: "AUTHORITATIVE_GAME_TRUTH",
  },
  irreversibleCapabilities: [
    "REAL_MONEY",
    "AUTOMATIC_PUBLICATION",
    "AUTONOMOUS_LEGAL_DECISION",
    "MJP_CORE_MUTATION",
  ] as const,
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function deriveLukitaScale(distanceM: number | null): LukitaScaleResult {
  if (distanceM === null || !Number.isFinite(distanceM)) {
    return {
      band: "DISCOVERY",
      targetHeightM: 0,
      normalizedDistance: null,
      smoothing: "CONTINUOUS_SMOOTHSTEP",
      behaviorHint: "DISCOVER",
    };
  }

  const distance = Math.max(0, distanceM);
  if (distance >= 50) {
    return {
      band: "DISCOVERY",
      targetHeightM: 0,
      normalizedDistance: 1,
      smoothing: "CONTINUOUS_SMOOTHSTEP",
      behaviorHint: "DISCOVER",
    };
  }
  if (distance >= 15) {
    return {
      band: "BEACON",
      targetHeightM: 8,
      normalizedDistance: clamp(distance / 50, 0, 1),
      smoothing: "CONTINUOUS_SMOOTHSTEP",
      behaviorHint: "BEACON",
    };
  }
  if (distance >= 5) {
    const t = clamp((distance - 5) / 10, 0, 1);
    const smooth = t * t * (3 - 2 * t);
    return {
      band: "GIANT",
      targetHeightM: 2 + smooth * 6,
      normalizedDistance: clamp(distance / 50, 0, 1),
      smoothing: "CONTINUOUS_SMOOTHSTEP",
      behaviorHint: "GROW",
    };
  }
  const t = clamp(distance / 5, 0, 1);
  return {
    band: "PERSONAL",
    targetHeightM: 1.8 + t * 0.2,
    normalizedDistance: clamp(distance / 50, 0, 1),
    smoothing: "CONTINUOUS_SMOOTHSTEP",
    behaviorHint: "PERSONAL",
  };
}

export function deriveLukitaBehavior(context: LukitaBehaviorContext): LukitaBehaviorState {
  if (context.session === "ENDED") return "LUKITA_IDLE";
  if (context.interaction === "SHARING" || context.interaction === "CAPTURE_REQUESTED") return "LUKITA_CELEBRATE";
  if (context.interaction === "TOUCHING" && context.orientation === "FACING") return "LUKITA_PLAY";
  if (context.experience === "EVENT" && context.orientation === "FACING") return "LUKITA_DANCE";
  if (context.orientation === "FACING" && context.locationState === "AT_POINT" && context.interaction === "LOOKING") return "LUKITA_GREETING";
  if (context.distanceM === null || context.locationState === "UNKNOWN") return "LUKITA_DISCOVERY";
  if (context.distanceM >= 50) return "LUKITA_DISCOVERY";
  if (context.distanceM >= 15) return "LUKITA_BEACON";
  if (context.distanceM >= 5) return "LUKITA_APPROACH";
  if (context.orientation === "FACING" && context.session === "ACTIVE") return "LUKITA_PERSONAL";
  return "LUKITA_IDLE";
}

export function isSafeLukitaPoint(point: LukitaPoint): boolean {
  return (
    point.pointId.length > 0 &&
    Number.isFinite(point.location.latitude) &&
    Number.isFinite(point.location.longitude) &&
    point.location.latitude >= -90 &&
    point.location.latitude <= 90 &&
    point.location.longitude >= -180 &&
    point.location.longitude <= 180 &&
    point.activationRadiusM > 0 &&
    point.interactionRadiusM > 0 &&
    point.interactionRadiusM <= point.activationRadiusM &&
    point.assetVersion.length > 0
  );
}

export function isLukitaLivePresentationOnly(): true {
  return true;
}
