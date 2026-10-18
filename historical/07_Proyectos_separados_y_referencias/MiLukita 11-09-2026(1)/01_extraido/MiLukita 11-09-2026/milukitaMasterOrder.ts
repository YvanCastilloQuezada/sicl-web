export type MasterOrderMode = "CONSOLIDATION_FREEZE";
export type LrciStatus = "DEFINED" | "PLANNED" | "DISABLED" | "NOT_IMPLEMENTED";
export type PlannedCapabilityState = "PLANNED" | "DISABLED";
export type LegalAuthority = "ADVISORY_ONLY";
export type ConstitutionalState =
  | "EXISTING"
  | "PARTIALLY_IMPLEMENTED"
  | "SIMULATED"
  | "PROJECTION_ONLY"
  | "READY"
  | "EXTERNAL_REQUIRED"
  | "PLANNED"
  | "NOT_IMPLEMENTED"
  | "DISABLED"
  | "BLOCKED"
  | "HUMAN_REQUIRED";
export type EvidenceClass = "FACT" | "SUPPOSITION" | "ESTIMATE" | "SIMULATION" | "PROPOSAL" | "CLAIM" | "LEGAL_INTERPRETATION" | "DECISION";
export type OrderThreeSourceState = "EXISTS" | "IMPLEMENTED" | "PARTIAL" | "SIMULATED" | "PROJECTED" | "PLANNED" | "EXTERNAL_REQUIRED" | "HUMAN_REQUIRED" | "DISABLED" | "NOT_IMPLEMENTED";

/** Preserva los términos de la Orden Maestra 3 sin perder la taxonomía constitucional vigente. */
export const ORDER_THREE_STATE_EQUIVALENCE: Record<OrderThreeSourceState, ConstitutionalState> = {
  EXISTS: "EXISTING",
  IMPLEMENTED: "EXISTING",
  PARTIAL: "PARTIALLY_IMPLEMENTED",
  SIMULATED: "SIMULATED",
  PROJECTED: "PROJECTION_ONLY",
  PLANNED: "PLANNED",
  EXTERNAL_REQUIRED: "EXTERNAL_REQUIRED",
  HUMAN_REQUIRED: "HUMAN_REQUIRED",
  DISABLED: "DISABLED",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
};

export const MASTER_ORDER_ID = "MILUKITA-MASTER-REALIGNMENT-01" as const;

export const MASTER_ORDER = {
  id: MASTER_ORDER_ID,
  mode: "CONSOLIDATION_FREEZE" as MasterOrderMode,
  createdAt: "2026-08-27",
  title: "Orden Maestra de Reorientación y Consolidación de MiLukita",
  sourceDocuments: ["pasted_content_2.txt", "pasted_content_3.txt", "pasted_content_5.txt"],
  strategicDefinition: "Interactive Digital Entertainment, Education, Art, Culture & Social Impact Ecosystem",
  commercialDefinition: "MiLukita — Entretenimiento que cobra vida.",
  technologyDefinition: "MiLukita — Interactive Digital Entertainment & Culture Ecosystem.",
  expansionPolicy: "NO_NEW_AGENTS_OR_PUBLIC_FEATURES",
  priorities: ["CONSOLIDATION", "EVIDENCE", "STABILITY", "TESTING", "AUDIT", "DOCUMENTATION"],
  constitutionalLayers: [
    "MILUKITA NETWORK",
    "EXPERIENCE OS",
    "CONTENT OS",
    "BUSINESS OS",
    "AGENT OS",
    "GOVERNANCE OS",
    "KPI / OBSERVABILITY",
    "CONTROL ROOM",
    "AUTHORITY BOUNDARY",
    "MJP CORE",
  ],
  protectedCore: ["RNG", "RULES", "RESULTS", "WALLET", "LEDGER", "SETTLEMENT", "CREDITS", "MJP_TV_MANIFEST"],
  experiences: {
    kids: { name: "MiLukita Kids", state: "PLANNED" as ConstitutionalState, execution: "DISABLED" as ConstitutionalState, audience: "6–14 aprox.", purpose: "Educación, arte, cultura, creatividad y juego seguro.", roleOfLukita: "Educadora", safeguards: ["NO_REAL_MONEY", "NO_WAGERING", "PARENTAL_CONTROLS", "CHILD_SAFETY_REVIEW"] },
    main: { name: "MiLukita", state: "PARTIALLY_IMPLEMENTED" as ConstitutionalState, execution: "READY" as ConstitutionalState, audience: "18–55 aprox.", purpose: "Entretenimiento interactivo, eventos, comunidad y contenido.", roleOfLukita: "Anfitriona", safeguards: ["VIRTUAL_CREDITS_ONLY", "NO_REAL_MONEY", "LEGAL_REVIEW_FOR_REGULATED_PRODUCTS"] },
    olderAdults: { name: "MiLukita 55+", state: "PLANNED" as ConstitutionalState, execution: "DISABLED" as ConstitutionalState, audience: "55+", purpose: "Entretenimiento, cultura, participación, memoria y comunidad.", roleOfLukita: "Compañera", safeguards: ["ACCESSIBILITY_FIRST", "RESPONSIBLE_DESIGN", "LEGAL_REVIEW_FOR_REGULATED_PRODUCTS"] },
  },
  externalDistribution: { FAST: "EXTERNAL_REQUIRED" as ConstitutionalState, OTT: "EXTERNAL_REQUIRED" as ConstitutionalState, IPTV: "EXTERNAL_REQUIRED" as ConstitutionalState, CABLE: "PLANNED" as ConstitutionalState },
  legalCompliance: {
    name: "Legal & Compliance Intelligence",
    status: "PLANNED" as LrciStatus,
    implementation: "NOT_STARTED" as const,
    execution: "DISABLED" as PlannedCapabilityState,
    autonomy: 0,
    authority: "ADVISORY_ONLY" as LegalAuthority,
    humanReview: "REQUIRED" as const,
    externalIntegrations: "NONE" as const,
    coreAccess: "NONE" as const,
  },
  reservedContracts: ["Legal Intelligence", "Regulatory Intelligence", "Compliance Operations", "Legal Claim Guard", "IP & Licensing Intelligence", "Privacy & Data Governance", "Jurisdiction Engine", "AML/KYC/CDD", "Truth & Claims Governance"],
  qualityGates: ["PROPOSAL", "PRODUCT_CHECK", "EXPERIENCE_CHECK", "CONTENT_CHECK", "SECURITY_CHECK", "LEGAL_COMPLIANCE_CHECK", "POLICY_CHECK", "AUTHORITY_CHECK", "HUMAN_APPROVAL_IF_REQUIRED", "EXECUTION", "AUDIT", "KPI"],
  constitutionalRules: ["NO_DATA_NO_CLAIM", "NO_LEGAL_BASIS_NO_LEGAL_CLAIM", "NO_AUTONOMY_WITHOUT_AUTHORITY", "NO_EXTERNAL_DISTRIBUTION_CLAIM_WITHOUT_EXTERNAL_DISTRIBUTION", "NO_AGENT_MAY_BYPASS_GOVERNANCE", "NO_COMMERCIAL_AGENT_MAY_MODIFY_MJP_CORE"],
} as const;

/** Matriz central: declara evidencia y dependencias; nunca convierte preparación en operación. */
export const SYSTEM_TRUTH_REGISTRY = [
  { capability: "Web", state: "PARTIALLY_IMPLEMENTED" as ConstitutionalState, sourceState: "IMPLEMENTED" as OrderThreeSourceState, evidence: "Rutas y pruebas de regresión del proyecto", externalDependency: "NONE", humanApproval: "NOT_REQUIRED_FOR_VIRTUAL_PILOT" },
  { capability: "MiLukita LIVE", state: "PARTIALLY_IMPLEMENTED" as ConstitutionalState, sourceState: "PARTIAL" as OrderThreeSourceState, evidence: "Contrato de eventos, TV y auditorías UX", externalDependency: "NONE", humanApproval: "REQUIRED_FOR_PRODUCTION_CLAIM" },
  { capability: "QR / Second Screen", state: "PARTIALLY_IMPLEMENTED" as ConstitutionalState, sourceState: "PARTIAL" as OrderThreeSourceState, evidence: "Contrato QR, transiciones y pruebas de interfaz", externalDependency: "NONE", humanApproval: "REQUIRED_FOR_PHYSICAL_CERTIFICATION" },
  { capability: "MJP CORE", state: "EXISTING" as ConstitutionalState, sourceState: "IMPLEMENTED" as OrderThreeSourceState, evidence: "RNG, reglas, resultados y pruebas de frontera", externalDependency: "NONE", humanApproval: "REQUIRED_FOR_CORE_CHANGE" },
  { capability: "Wallet y Ledger virtual", state: "EXISTING" as ConstitutionalState, sourceState: "IMPLEMENTED" as OrderThreeSourceState, evidence: "Pruebas de movimientos y liquidación virtual", externalDependency: "NONE", humanApproval: "REQUIRED_FOR_REAL_MONEY_SCOPE" },
  { capability: "Agent OS", state: "PARTIALLY_IMPLEMENTED" as ConstitutionalState, sourceState: "PARTIAL" as OrderThreeSourceState, evidence: "Registro, matriz de permisos, eventos y pruebas negativas", externalDependency: "NONE", humanApproval: "REQUIRED_FOR_HIGH_IMPACT_ACTION" },
  { capability: "FAST / OTT / IPTV", state: "EXTERNAL_REQUIRED" as ConstitutionalState, sourceState: "EXTERNAL_REQUIRED" as OrderThreeSourceState, evidence: "Readiness arquitectónica solamente", externalDependency: "PROVIDER_AND_DISTRIBUTION_REQUIRED", humanApproval: "REQUIRED" },
  { capability: "Legal & Compliance Intelligence", state: "NOT_IMPLEMENTED" as ConstitutionalState, sourceState: "PLANNED" as OrderThreeSourceState, evidence: "Contrato LRCI y límites de autoridad", externalDependency: "QUALIFIED_PROFESSIONAL_AND_CURRENT_SOURCES_REQUIRED", humanApproval: "REQUIRED" },
  { capability: "Education, Art, Culture y Social Impact", state: "PLANNED" as ConstitutionalState, sourceState: "PLANNED" as OrderThreeSourceState, evidence: "Dominio estratégico documentado", externalDependency: "CONTENT_AND_PROGRAM_VALIDATION_REQUIRED", humanApproval: "REQUIRED" },
] as const;

/** Acciones cuyo avance necesita una decisión humana explícita y auditable. */
export const HUMAN_APPROVAL_MATRIX = [
  { action: "Declarar capacidad operacional o autonomía", required: true, reason: "Exige evidencia operacional verificable." },
  { action: "Activar distribución FAST, OTT, IPTV o cable", required: true, reason: "Depende de proveedor, acuerdos y operación externa." },
  { action: "Modificar MJP CORE o sus interfaces críticas", required: true, reason: "Protege RNG, reglas, resultados, wallet, ledger y settlement." },
  { action: "Emitir claim legal, regulatorio o de certificación", required: true, reason: "Exige base vigente y revisión profesional." },
  { action: "Aprobar una revisión documental", required: true, reason: "Registra evidencia; no concede autoridad productiva." },
] as const;

/** Dependencias que no deben declararse activas sin prueba externa verificable. */
export const DEPENDENCY_REGISTRY = [
  { dependency: "FAST / OTT / IPTV / cable", state: "EXTERNAL_REQUIRED" as ConstitutionalState, activationEvidence: "Proveedor, señal, acuerdos, operación y verificación." },
  { dependency: "Fuentes legales y regulatorias", state: "EXTERNAL_REQUIRED" as ConstitutionalState, activationEvidence: "Base vigente, jurisdicción y revisión profesional." },
  { dependency: "Pagos, KYC/AML y dinero real", state: "DISABLED" as ConstitutionalState, activationEvidence: "Orden separada, legalidad, proveedor e implementación auditada." },
  { dependency: "Certificación física TV y móvil", state: "HUMAN_REQUIRED" as ConstitutionalState, activationEvidence: "QA reproducible en hardware y lectores/escáneres aplicables." },
] as const;

export const MASTER_ORGANIGRAM = [
  { layer: "MILUKITA NETWORK", units: ["MiLukita Kids · PLANNED / DISABLED", "MiLukita · PARTIALLY_IMPLEMENTED", "MiLukita 55+ · PLANNED / DISABLED", "Lukita · EXISTING / PARTIALLY_IMPLEMENTED"] },
  { layer: "EXPERIENCE OS", units: ["Web", "Mobile", "TV", "QR", "UX", "Accessibility", "Second Screen"] },
  { layer: "CONTENT OS", units: ["Entertainment", "Education", "Art", "Culture", "Games", "Shows", "Events", "Lukita"] },
  { layer: "BUSINESS OS", units: ["Finance", "Revenue", "Sales", "Advertising", "Sponsors", "Partnerships", "Distribution", "Tax Intelligence"] },
  { layer: "AGENT OS", units: ["Audience / Experience", "Growth", "Content", "Business", "Operations", "Governance"] },
  { layer: "GOVERNANCE OS", units: ["Legal & Compliance Intelligence · PLANNED / DISABLED", "Regulatory", "Compliance", "Policy", "Audit", "Authority Control", "Human Governance"] },
  { layer: "KPI / OBSERVABILITY", units: ["Audience", "Business", "Experience", "Operations", "Governance", "Safety", "NO DATA → NO CLAIM"] },
  { layer: "CONTROL ROOM", units: ["Operational monitoring", "Human approval", "Evidence review", "Exportable audit trail"] },
  { layer: "AUTHORITY BOUNDARY", units: ["Quality gates", "Agent limits", "Human escalation", "Propose-only enforcement"] },
  { layer: "MJP CORE", units: ["RNG", "Rules", "Results", "Wallet", "Credits", "Ledger", "Settlement", "Integrity", "MjpTvManifest"] },
] as const;

export const LRCI_DOMAINS = ["CORPORATE_LEGAL", "REGULATORY_INTELLIGENCE", "GAMING_REGULATION", "ADVERTISING_COMPLIANCE", "CONSUMER_PROTECTION", "PRIVACY_DATA_PROTECTION", "INTELLECTUAL_PROPERTY", "CONTRACTS", "LICENSING", "AI_GOVERNANCE", "DIGITAL_SERVICES_ECOMMERCE", "INTERNATIONAL_EXPANSION", "LEGAL_CLAIMS_REPRESENTATION_GUARD"] as const;
export const LRCI_RESERVED_DOMAINS = ["JURISDICTION_ENGINE", "AML_KYC_CDD", "TRUTH_CLAIMS_GOVERNANCE"] as const;

export const LEGAL_ALLOWED_ACTIONS = ["READ", "ANALYZE", "CLASSIFY", "COMPARE", "DETECT", "SCORE_RISK", "PROPOSE", "ALERT", "ESCALATE"] as const;
export const LEGAL_FORBIDDEN_ACTIONS = ["SIGN_CONTRACT", "ACCEPT_LIABILITY", "REGISTER_COMPANY", "FILE_LEGAL_DOCUMENT", "REPRESENT_MILUKITA", "MAKE_BINDING_LEGAL_DECISION", "DECLARE_COMPLIANCE_DEFINITIVELY", "OBTAIN_LICENSE_AUTONOMOUSLY", "CHANGE_CORPORATE_STRUCTURE", "MODIFY_MJP_CORE", "MODIFY_RNG", "MODIFY_RTP", "MODIFY_RESULT", "MODIFY_WALLET", "MODIFY_LEDGER", "MODIFY_SETTLEMENT"] as const;

export function isExpansionFrozen(): boolean {
  return MASTER_ORDER.mode === "CONSOLIDATION_FREEZE" && MASTER_ORDER.expansionPolicy === "NO_NEW_AGENTS_OR_PUBLIC_FEATURES";
}

export function legalClaimGuardStatus(): "RESERVED_DISABLED" {
  return "RESERVED_DISABLED";
}

export function canLegalExecute(action: string): boolean {
  return (LEGAL_ALLOWED_ACTIONS as readonly string[]).includes(action) && MASTER_ORDER.legalCompliance.execution !== "DISABLED";
}

export function isProtectedCoreSurface(surface: string): boolean {
  return (MASTER_ORDER.protectedCore as readonly string[]).includes(surface);
}

export function isConstitutionalState(value: string): value is ConstitutionalState {
  return ["EXISTING", "PARTIALLY_IMPLEMENTED", "SIMULATED", "PROJECTION_ONLY", "READY", "EXTERNAL_REQUIRED", "PLANNED", "NOT_IMPLEMENTED", "DISABLED", "BLOCKED", "HUMAN_REQUIRED"].includes(value);
}

export function getMasterOrderSummary() {
  return {
    id: MASTER_ORDER.id,
    mode: MASTER_ORDER.mode,
    expansionFrozen: isExpansionFrozen(),
    legalStatus: MASTER_ORDER.legalCompliance.status,
    legalExecution: MASTER_ORDER.legalCompliance.execution,
    legalClaimGuard: legalClaimGuardStatus(),
    priorities: [...MASTER_ORDER.priorities],
    protectedCoreCount: MASTER_ORDER.protectedCore.length,
    lrciDomains: LRCI_DOMAINS.length,
    reservedDomains: LRCI_RESERVED_DOMAINS.length,
    constitutionalLayers: MASTER_ORDER.constitutionalLayers.length,
    experienceCount: Object.keys(MASTER_ORDER.experiences).length,
    qualityGateCount: MASTER_ORDER.qualityGates.length,
    sourceDocumentCount: MASTER_ORDER.sourceDocuments.length,
    truthRegistryCount: SYSTEM_TRUTH_REGISTRY.length,
    humanApprovalActionCount: HUMAN_APPROVAL_MATRIX.length,
    dependencyCount: DEPENDENCY_REGISTRY.length,
  };
}
