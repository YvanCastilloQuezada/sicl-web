export const LUKITA_LIVE_BOUNDARIES = {
  experienceQr: {
    name: "Experience QR",
    purpose: "Entrada pública a una experiencia de Lukita para cámara, interacción, captura y share.",
    mayAccess: ["experience_id", "lukita_point_id", "public_expiry", "presentation_config"],
    mustNotAccess: ["control_qr_payload", "rng", "results", "wallet", "ledger", "settlement"],
  },
  controlQr: {
    name: "Control QR",
    purpose: "Vinculación operativa entre TV y Controller Lab para control de presentación.",
    mayAccess: ["tv_session_id", "controller_session_id", "role", "latency", "control_capabilities"],
    mustNotAccess: ["experience_qr_payload", "rng", "results", "wallet", "ledger", "settlement"],
  },
  controllerLab: {
    name: "Controller Lab",
    purpose: "Backstage de control de TV y presentación; no es parte del mundo narrativo de Lukita.",
    status: "BACKSTAGE_ONLY",
    mayControl: ["navigation", "volume", "scene", "cursor", "presentation_mode"],
    mustNotControl: ["game_truth", "rng", "results", "rtp", "wallet", "ledger", "mjp_core"],
  },
  lukita: {
    name: "Lukita",
    purpose: "Protagonista viva de la experiencia; presenta, interactúa y acompaña.",
    authority: "PRESENTATION_ONLY",
    mustNotGovern: ["game_truth", "rng", "results", "wallet", "ledger", "settlement", "mjp_core"],
  },
} as const;

export const hasSeparatedLukitaLiveBoundaries = () =>
  String(LUKITA_LIVE_BOUNDARIES.experienceQr.name) !== String(LUKITA_LIVE_BOUNDARIES.controlQr.name) &&
  LUKITA_LIVE_BOUNDARIES.controllerLab.status === "BACKSTAGE_ONLY" &&
  LUKITA_LIVE_BOUNDARIES.lukita.authority === "PRESENTATION_ONLY";
