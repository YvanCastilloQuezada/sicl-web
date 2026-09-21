import { ARKI_AUTHORIZED_POWER_SET, ARKI_AUTHORITY_PROFILE, type AuthorizedPowerMode } from "./arkiAuthorityProfile";

export const ARKI_SYSTEM_POWER_SET = [
  "PROJECT_ORCHESTRATION",
  "PROJECT_ID_GENERATION",
  "MULTIMODAL_SOURCE_INGESTION",
  "PROVENANCE_AND_EPISTEMIC_CLASSIFICATION",
  "KNOWLEDGE_RETRIEVAL",
  "TYPOLOGY_TRANSFER",
  "PARTI_GENERATION",
  "TOPOLOGY_GENERATION",
  "CONCEPTUAL_GEOMETRY",
  "ADVANCED_COMPLEX_GEOMETRY",
  "JURISDICTIONAL_REGULATION_RETRIEVAL",
  "HIGH_QUALITY_PLAN_REPRESENTATION",
  "PHOTOREALISTIC_VISUAL_GENERATION",
  "SELECTABLE_VISUAL_RESOLUTION",
  "PHOTOREALISTIC_AR_OVERLAY",
  "EVIDENCE_BOUNDED_VISION",
  "ALTERNATIVE_COMPARISON",
  "ADVERSARIAL_EVALUATION",
  "MUTATION_REJECTION_BACKTRACK",
  "LEARNING_CANDIDATE_REGISTRATION",
  "FROZEN_ORDER_EXECUTION",
  "ASSEMBLY_GAP_ANALYSIS",
  "EXTERNAL_EVIDENCE_COMPARISON",
  "APPLICABILITY_PROTOCOL_EXECUTION",
  "VISUAL_PLAN_PRESENTATION",
  "CONCEPTUAL_EXPORT_PREPARATION",
  "REGRESSION_AND_AUDIT",
  "HUMAN_REVIEW_HANDOFF",
] as const;
export type ArkiSystemPower = typeof ARKI_SYSTEM_POWER_SET[number];

type PowerClass = "EXECUTION" | "EVIDENCE" | "EVALUATION" | "REPRESENTATION" | "GOVERNANCE";
export type SystemPower = { power: ArkiSystemPower; class: PowerClass; operationalPermission: string; gate: string; prohibitedClaim: string; humanReview: string };

export const ARKI_SYSTEM_AUTHORITY: SystemPower[] = [
  { power: "PROJECT_ORCHESTRATION", class: "EXECUTION", operationalPermission: "Run the complete project trace through one motor.", gate: "ONE_MOTOR_REGRESSION", prohibitedClaim: "Cannot approve a professional project.", humanReview: "Architect reviews project state." },
  { power: "PROJECT_ID_GENERATION", class: "GOVERNANCE", operationalPermission: "Generate unique XXX-XXX-XXX-XXX identifiers with six leading letters and six trailing digits.", gate: "IDENTIFIER_CONTRACT", prohibitedClaim: "Cannot imply legal registration.", humanReview: "Owner confirms project identity." },
  { power: "MULTIMODAL_SOURCE_INGESTION", class: "EXECUTION", operationalPermission: "Read images, plans and documents through the existing ingestion path.", gate: "SOURCE_REVIEW", prohibitedClaim: "OCR is not automatically fact.", humanReview: "Human validates source observations." },
  { power: "PROVENANCE_AND_EPISTEMIC_CLASSIFICATION", class: "GOVERNANCE", operationalPermission: "Attach source lineage and distinguish FACT, HYPOTHESIS and UNKNOWN.", gate: "EPISTEMIC_INTEGRITY", prohibitedClaim: "Cannot promote unsupported claims.", humanReview: "Human promotes knowledge." },
  { power: "KNOWLEDGE_RETRIEVAL", class: "EVIDENCE", operationalPermission: "Retrieve canonical and preserved architectural knowledge.", gate: "KNOWLEDGE_PROVENANCE", prohibitedClaim: "Retrieval is not authority.", humanReview: "Architect reviews applicability." },
  { power: "TYPOLOGY_TRANSFER", class: "EXECUTION", operationalPermission: "Attempt TRANSFER, ADAPT, DO_NOT_TRANSFER or UNKNOWN with trace.", gate: "TRANSFER_EVIDENCE", prohibitedClaim: "Cannot assume two typologies are equivalent.", humanReview: "Architect validates transfer." },
  { power: "PARTI_GENERATION", class: "EXECUTION", operationalPermission: "Generate multiple parti hypotheses for one brief.", gate: "PARTI_PROOF_PASS", prohibitedClaim: "Parti is not form, topology or geometry.", humanReview: "Architect selects or rejects parti." },
  { power: "TOPOLOGY_GENERATION", class: "EXECUTION", operationalPermission: "Derive adjacency and flow structures from parti and knowledge.", gate: "D6.2_M_PASS", prohibitedClaim: "Topology is not a finished plan.", humanReview: "Architect checks functional organization." },
  { power: "CONCEPTUAL_GEOMETRY", class: "EXECUTION", operationalPermission: "Materialize traceable conceptual geometry from topology.", gate: "D6.3_G_PASS", prohibitedClaim: "Conceptual geometry is not construction documentation.", humanReview: "Architect reviews geometry." },
  { power: "ADVANCED_COMPLEX_GEOMETRY", class: "EXECUTION", operationalPermission: "Generate parametrically complex forms, levels, faces and plan projections beyond conventional primitives.", gate: "ADVANCED_GEOMETRY_PROOF", prohibitedClaim: "Complex form is not automatically structurally feasible or buildable.", humanReview: "Architect and structural specialist review." },
  { power: "JURISDICTIONAL_REGULATION_RETRIEVAL", class: "EVIDENCE", operationalPermission: "Resolve official regulatory sources by country and jurisdiction through the web source registry.", gate: "OFFICIAL_SOURCE_AND_CURRENT_VERSION", prohibitedClaim: "Source retrieval is not compliance certification.", humanReview: "Licensed local professional verifies clauses." },
  { power: "HIGH_QUALITY_PLAN_REPRESENTATION", class: "REPRESENTATION", operationalPermission: "Produce legible multi-level plan sheets with walls, openings, circulation and annotations.", gate: "REPRESENTATION_AND_DIMENSION_REVIEW", prohibitedClaim: "High representation quality is not permit-ready documentation.", humanReview: "Architect validates notation and dimensions." },
  { power: "PHOTOREALISTIC_VISUAL_GENERATION", class: "REPRESENTATION", operationalPermission: "Generate photorealistic architectural, material, interior, exterior and site-context proposals from the canonical model or references.", gate: "VISUAL_PROVIDER_AND_REFERENCE_REVIEW", prohibitedClaim: "A render is not a measurement, survey, or compliance proof.", humanReview: "Architect reviews geometry and material fidelity." },
  { power: "SELECTABLE_VISUAL_RESOLUTION", class: "REPRESENTATION", operationalPermission: "Request HD, 2K, Full HD, 4K, 8K or 16K target output with provider capability metadata and an explicit upscale/external-render gate for sizes the provider cannot deliver natively.", gate: "PROVIDER_RESOLUTION_VERIFICATION", prohibitedClaim: "Requested 8K or 16K is not proof that the provider returned native 8K or 16K.", humanReview: "User verifies delivered resolution and approves any upscale or external render worker." },
  { power: "PHOTOREALISTIC_AR_OVERLAY", class: "REPRESENTATION", operationalPermission: "Place a photorealistic reference render or canonical model over the live camera using geolocation, two-stake calibration and optional WebXR.", gate: "SITE_CALIBRATION_AND_DEVICE_REVIEW", prohibitedClaim: "AR overlay is not a surveyed as-built position.", humanReview: "Architect or site operator validates anchor and scale." },
  { power: "EVIDENCE_BOUNDED_VISION", class: "EVIDENCE", operationalPermission: "Use camera, plans, documents and OCR as bounded visual observations with evidence class, qualifier, uncertainty and human review.", gate: "VISIBLE_EVIDENCE_OR_UNKNOWN", prohibitedClaim: "Vision cannot claim what is not visible, legible or measured.", humanReview: "Human validates every promoted observation." },
  { power: "ALTERNATIVE_COMPARISON", class: "EVALUATION", operationalPermission: "Compare alternatives by explicit criteria and UNKNOWNs.", gate: "COMPARISON_TRACE", prohibitedClaim: "Cannot select without human decision.", humanReview: "Architect decides." },
  { power: "ADVERSARIAL_EVALUATION", class: "EVALUATION", operationalPermission: "Construct counterexamples and identify failure modes.", gate: "DG01E_RESULT_REVIEW", prohibitedClaim: "Adversarial output is not certification.", humanReview: "Human interprets result." },
  { power: "MUTATION_REJECTION_BACKTRACK", class: "EXECUTION", operationalPermission: "Mutate, reject and backtrack alternatives while preserving lineage.", gate: "LINEAGE_INTEGRITY", prohibitedClaim: "Cannot erase failed candidates.", humanReview: "Architect reviews history." },
  { power: "LEARNING_CANDIDATE_REGISTRATION", class: "EVIDENCE", operationalPermission: "Register learning candidates from reviewed cases.", gate: "HUMAN_KNOWLEDGE_PROMOTION", prohibitedClaim: "No autonomous learning promotion to FACT.", humanReview: "Human validates candidate." },
  { power: "FROZEN_ORDER_EXECUTION", class: "EXECUTION", operationalPermission: "Execute authorized MC-02 work items through the common trace.", gate: "PRODUCT_OWNER_REVIEW_PER_ORDER", prohibitedClaim: "Frozen order is not automatically completed.", humanReview: "Owner reviews each order." },
  { power: "ASSEMBLY_GAP_ANALYSIS", class: "EVALUATION", operationalPermission: "Use MC-03 to inspect system connections and gaps.", gate: "ARCHITECTURE_REVIEW", prohibitedClaim: "Assembly is not proof of maturity.", humanReview: "Chief architect reviews." },
  { power: "EXTERNAL_EVIDENCE_COMPARISON", class: "EVIDENCE", operationalPermission: "Use DS-EVAL-001 and similar evidence in comparisons.", gate: "EXTERNAL_EVIDENCE_REVIEW", prohibitedClaim: "External evidence cannot rewrite runtime facts.", humanReview: "Reviewer validates relevance." },
  { power: "APPLICABILITY_PROTOCOL_EXECUTION", class: "EVALUATION", operationalPermission: "Run authorized DG-01B blind/adversarial applicability protocol.", gate: "DG01E_RESULT_REVIEW", prohibitedClaim: "Running protocol does not mean PASS.", humanReview: "Human reviews outcomes." },
  { power: "VISUAL_PLAN_PRESENTATION", class: "REPRESENTATION", operationalPermission: "Present conceptual plans, diagrams and visual comparisons.", gate: "REPRESENTATION_LABELING", prohibitedClaim: "SVG is not DWG, Revit or a licensed plan.", humanReview: "Architect verifies visual result." },
  { power: "CONCEPTUAL_EXPORT_PREPARATION", class: "REPRESENTATION", operationalPermission: "Prepare structured export specifications and mappings for future CAD/BIM/GIS adapters.", gate: "EXPORT_ADAPTER_PROOF", prohibitedClaim: "Does not claim native professional export.", humanReview: "Specialist validates export." },
  { power: "REGRESSION_AND_AUDIT", class: "GOVERNANCE", operationalPermission: "Run focused regression, preserve evidence and report deltas.", gate: "REGRESSION_SUITE", prohibitedClaim: "Green tests do not equal professional compliance.", humanReview: "Human reviews release." },
  { power: "HUMAN_REVIEW_HANDOFF", class: "GOVERNANCE", operationalPermission: "Produce a complete review package with assumptions, alternatives, UNKNOWNs and decisions pending.", gate: "HUMAN_AUTHORITY_FINAL", prohibitedClaim: "Cannot sign or approve on behalf of an architect.", humanReview: "Architect has final authority." },
];

export function getArkiSystemAuthority() {
  return { version: "ARKI-SYSTEM-AUTHORITY-2.0", mode: "SUPER_ARCHITECT_GOVERNED", powers: ARKI_SYSTEM_AUTHORITY, inheritedExplicitPowers: [...ARKI_AUTHORIZED_POWER_SET], priorProfilePowers: ARKI_AUTHORITY_PROFILE.map((power) => power.pieceId), invariant: "HUMAN_AUTHORITY_FINAL", oneMotor: true, nativeProfessionalExport: false, autonomousProfessionalSignoff: false };
}

export function hasSystemPower(power: string): power is ArkiSystemPower { return ARKI_SYSTEM_POWER_SET.includes(power as ArkiSystemPower); }
