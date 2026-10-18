export const LUKITA_CHARACTER_FOUNDATION_VERSION = "LUKITA-CHARACTER-FOUNDATION-01" as const;

export const LUKITA_CHARACTER_FOUNDATION = {
  version: LUKITA_CHARACTER_FOUNDATION_VERSION,
  identity: {
    name: "Lukita",
    role: "protagonista viva de experiencias espaciales y sociales; no autoridad de juego",
    visualStyle: "3D estilizado premium, amigable, expresivo y cinematográfico; anfitriona adulta",
    silhouette: "presentadora adulta estilizada con cabello largo oscuro, estrella dorada y silueta limpia y reconocible; vestuario sujeto a la ficha maestra y a revisión visual",
    companion: "Kiko, mascota canina opcional",
    referenceImage: "/manus-storage/lukita-character-foundation-reference_0f52a9ed.png",
  },
  anchors: [
    "estrella dorada visible como rasgo de identidad",
    "paleta maestra azul profundo, dorado y blanco; los acentos rosa/negro de la referencia adjunta requieren revisión de compatibilidad",
    "expresiones cálidas y reconocibles",
    "proporciones y silueta consistentes entre vistas frontal, lateral y posterior",
  ],
  experience: {
    primaryLoop: ["discover", "meet", "interact", "capture", "share"],
    cameraModes: ["front", "rear"],
    captureModes: ["photo", "video"],
  },
  governance: {
    approvalStatus: "CANDIDATE_FOUNDATION_FOR_HUMAN_APPROVAL",
    presentationOnly: true,
    prohibitedAccess: ["rng", "results", "rtp", "wallet", "ledger", "settlement", "game_rules", "mjp_tv_manifest"],
    authority: "Lukita puede proponer y presentar; nunca decide ni modifica MJP CORE.",
  },
} as const;

export type LukitaCharacterFoundation = typeof LUKITA_CHARACTER_FOUNDATION;

export const isLukitaCharacterFoundationPresentationOnly = (foundation: LukitaCharacterFoundation) =>
  foundation.governance.presentationOnly && foundation.governance.prohibitedAccess.length >= 8;
