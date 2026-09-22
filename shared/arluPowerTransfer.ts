export const ARLU_POWER_TRANSFER_VERSION = "AR-LU-POWER-PACK-1.0" as const;
export type PowerTransferStatus = "CANDIDATE" | "HUMAN_REVIEW" | "APPROVED" | "FROZEN" | "REJECTED";
export type PowerTransferDisposition = "SHARED_CONTRACT" | "READ_ONLY_ADAPTER" | "NOT_TRANSFERRED";

export type ArluPower = {
  id: string;
  name: string;
  purpose: string;
  disposition: PowerTransferDisposition;
  lucaCanUseFor: string[];
  lucaCannotDo: string[];
  sourceEvidence: string[];
  requiresHumanGate: true;
  canMutateCore: false;
  transfersSecrets: false;
};

export const ARKI_POWER_PACK_FOR_LUCA: readonly ArluPower[] = [
  {
    id: "POWER-MANIAC-GUARDRAILS",
    name: "Seguridad federada MANIAC",
    purpose: "Aplicar defensa por capas, fail-closed, límites de entrada y separación de secretos.",
    disposition: "SHARED_CONTRACT",
    lucaCanUseFor: ["validar origen y tamaño", "degradar con seguridad", "bloquear operaciones no autorizadas", "registrar intentos y alertas"],
    lucaCannotDo: ["recibir tokens de ARKI/Core", "desactivar autenticación", "convertir alertas en permisos"],
    sourceEvidence: ["shared/arkiLucaSecurityFederation.ts", "docs/arki-architecture/ARKI_LUCA_FEDERATED_SECURITY_AND_TV_AUDIT.md"],
    requiresHumanGate: true, canMutateCore: false, transfersSecrets: false,
  },
  {
    id: "POWER-DETERMINISTIC-EVIDENCE",
    name: "Razonamiento determinista y control de incertidumbre",
    purpose: "Separar observación, inferencia, propuesta, UNKNOWN y hecho validado.",
    disposition: "SHARED_CONTRACT",
    lucaCanUseFor: ["contexto georreferenciado", "OCR y visión con confianza explícita", "explicar supuestos", "pedir datos faltantes"],
    lucaCannotDo: ["inventar coordenadas, fechas o atributos", "elevar una captura a FACT sin evidencia", "ocultar UNKNOWNs"],
    sourceEvidence: ["docs/arki-architecture/ARKI_SPATIAL_FIELD_BRIDGE_API_SPEC_V1.md", "shared/arluKnowledgeExchange.ts"],
    requiresHumanGate: true, canMutateCore: false, transfersSecrets: false,
  },
  {
    id: "POWER-PROVENANCE-DELTA62",
    name: "Provenance, Delta 6.2 y aprendizaje por etapas",
    purpose: "Conservar fuente, commit, archivo, estado epistemológico y trazabilidad de cada aprendizaje.",
    disposition: "SHARED_CONTRACT",
    lucaCanUseFor: ["staging de libros y fuentes", "clasificación de registros", "consumo inmediato de registros aprobados", "cuarentena de desacuerdos"],
    lucaCannotDo: ["canonizar sin aprobación", "borrar automáticamente registros", "transferir archivos sin licencia o checksum"],
    sourceEvidence: ["shared/arluKnowledgeExchange.ts", "docs/arki-architecture/LUCA_FINAL_CONSOLIDATED_OPERATING_MANUAL.md"],
    requiresHumanGate: true, canMutateCore: false, transfersSecrets: false,
  },
  {
    id: "POWER-CONSEQUENCE-VOI",
    name: "Radar de consecuencias y valor de información",
    purpose: "Priorizar qué dato falta, qué riesgo genera una decisión y cuándo detenerse para preguntar.",
    disposition: "SHARED_CONTRACT",
    lucaCanUseFor: ["priorizar observaciones de campo", "evaluar campañas y puntos AR", "detectar decisiones de alto impacto", "proponer siguiente evidencia"],
    lucaCannotDo: ["aprobar campañas públicas", "realizar acciones financieras", "decidir por el propietario"],
    sourceEvidence: ["server/arkiSuperpowersPack.ts", "shared/federatedAssistantDirector.ts"],
    requiresHumanGate: true, canMutateCore: false, transfersSecrets: false,
  },
  {
    id: "POWER-CONTRADICTION-REDTEAM",
    name: "Cazador de contradicciones y revisión adversarial",
    purpose: "Buscar conflictos entre fuentes, contexto espacial, restricciones y propuestas antes de presentarlas.",
    disposition: "SHARED_CONTRACT",
    lucaCanUseFor: ["comparar observaciones", "señalar incoherencias de ubicación", "detectar claims incompatibles", "preparar revisión humana"],
    lucaCannotDo: ["resolver conflictos destruyendo evidencia", "convertir una puntuación en verdad", "publicar sin revisión"],
    sourceEvidence: ["server/arkiProjectBrain.ts", "docs/arki-knowledge/demonstration-gates/DG-01/DG-01B_BLIND_ADVERSARIAL_PROTOCOL.md"],
    requiresHumanGate: true, canMutateCore: false, transfersSecrets: false,
  },
  {
    id: "POWER-SPATIAL-FIELD-CONTEXT",
    name: "Interpretación espacial arquitectónica",
    purpose: "Leer relaciones entre objeto, sitio, territorio, paisaje, movilidad y experiencia sin convertirlas automáticamente en diseño firmado.",
    disposition: "READ_ONLY_ADAPTER",
    lucaCanUseFor: ["clasificar lugares y patrimonio", "describir morfología urbana", "preparar guías y escenas AR", "solicitar análisis arquitectónico a ARKI"],
    lucaCannotDo: ["firmar proyectos", "emitir cálculo profesional", "sustituir especialista o autoridad local"],
    sourceEvidence: ["docs/arki-architecture/ARKI_SPATIAL_FIELD_BRIDGE_API_SPEC_V1.md", "server/arkiSpatialFieldBridge.ts"],
    requiresHumanGate: true, canMutateCore: false, transfersSecrets: false,
  },
  {
    id: "POWER-HUMAN-HANDOFF",
    name: "Handoff humano y bandeja de revisión",
    purpose: "Convertir toda propuesta sensible en un paquete claro con evidencia, límites, unknowns y decisión pendiente.",
    disposition: "SHARED_CONTRACT",
    lucaCanUseFor: ["aprobar, rechazar o congelar candidatos", "preparar publicaciones", "delegar a profesional", "registrar decisión y rollback"],
    lucaCannotDo: ["autoaprobarse", "publicar por defecto", "borrar la trazabilidad", "mutar Core"],
    sourceEvidence: ["shared/federatedAssistantDirector.ts", "docs/ARKI_AUTHORITY_PROFILE.md"],
    requiresHumanGate: true, canMutateCore: false, transfersSecrets: false,
  },
] as const;

export type ArluPowerTransferManifest = {
  version: typeof ARLU_POWER_TRANSFER_VERSION;
  sourceProduct: "ARKI";
  targetProduct: "LUCA";
  sourceCommit: string;
  targetCommit: string;
  status: PowerTransferStatus;
  powers: readonly ArluPower[];
  excludedDomains: readonly string[];
  rollbackPoint: string;
  humanAuthority: "FINAL";
};

export function createLucaPowerTransferManifest(input: { sourceCommit: string; targetCommit: string; rollbackPoint: string; status?: PowerTransferStatus }): ArluPowerTransferManifest {
  if (!input.sourceCommit.trim() || !input.targetCommit.trim() || !input.rollbackPoint.trim()) throw new Error("SOURCE_TARGET_COMMITS_AND_ROLLBACK_REQUIRED");
  return {
    version: ARLU_POWER_TRANSFER_VERSION,
    sourceProduct: "ARKI",
    targetProduct: "LUCA",
    sourceCommit: input.sourceCommit,
    targetCommit: input.targetCommit,
    status: input.status ?? "HUMAN_REVIEW",
    powers: ARKI_POWER_PACK_FOR_LUCA,
    excludedDomains: ["ARKI_CORE", "MJP_CORE", "PROJECT_STATE", "SECRETS", "TOKENS", "WALLET", "LEDGER", "RNG", "RTP", "PUBLICATION", "PROFESSIONAL_SIGNATURE"],
    rollbackPoint: input.rollbackPoint,
    humanAuthority: "FINAL",
  };
}

export function authorizeLucaPowerUse(input: { powerId: string; humanApproved: boolean; targetRuntimeReady: boolean; changesCanonicalState: boolean; transfersSecrets: boolean }) {
  const power = ARKI_POWER_PACK_FOR_LUCA.find((candidate) => candidate.id === input.powerId);
  if (!power) return { allowed: false as const, reason: "POWER_NOT_IN_PACK" };
  if (!input.humanApproved) return { allowed: false as const, reason: "HUMAN_REVIEW_REQUIRED" };
  if (!input.targetRuntimeReady) return { allowed: false as const, reason: "TARGET_RUNTIME_NOT_READY" };
  if (input.changesCanonicalState) return { allowed: false as const, reason: "CANONICAL_MUTATION_FORBIDDEN" };
  if (input.transfersSecrets) return { allowed: false as const, reason: "SECRET_TRANSFER_FORBIDDEN" };
  return { allowed: true as const, reason: "POWER_USE_APPROVED", power };
}

export function arluPowerTransferSummary() {
  return { version: ARLU_POWER_TRANSFER_VERSION, count: ARKI_POWER_PACK_FOR_LUCA.length, canMutateCore: false as const, transfersSecrets: false as const, humanAuthority: "FINAL" as const };
}
