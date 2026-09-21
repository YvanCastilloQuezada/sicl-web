import type { IntegratedArchitectCycle } from "./arkiIntegratedArchitectCycle";

export type ArkiTriadComponent = "ARKI_SUPER_ARCHITECT" | "ARKI_GRAPHIC_INTELLIGENCE" | "ARKI_ETI_BIM";
export type TriadComponentStatus = "EXECUTED" | "CONTRACTED_WITH_BOUNDS" | "SPECIALIST_REQUIRED";

export type TriadComponentContract = {
  id: ArkiTriadComponent;
  name: string;
  mission: string;
  inputs: string[];
  outputs: string[];
  gate: string;
  boundary: string;
};

export const ARKI_TRIAD_CONTRACT: TriadComponentContract[] = [
  {
    id: "ARKI_SUPER_ARCHITECT",
    name: "ARKI Super Architect",
    mission: "Interpretar encargos, recuperar conocimiento, producir alternativas, transferir tipologías y coordinar el ciclo arquitectónico completo.",
    inputs: ["PROJECT_STATE", "BRIEF", "CONTEXT", "CONSTRAINTS", "KNOWLEDGE", "UNKNOWN_REGISTER"],
    outputs: ["REASONING_TRACE", "PARTI_ALTERNATIVES", "TOPOLOGY", "CONCEPTUAL_GEOMETRY", "EVALUATION_AND_BACKTRACK_TRACE"],
    gate: "INTEGRATED_CYCLE_PASS",
    boundary: "Produce síntesis conceptual acotada; no firma, certifica ni reemplaza especialistas.",
  },
  {
    id: "ARKI_GRAPHIC_INTELLIGENCE",
    name: "ARKI Graphic Intelligence",
    mission: "Cambiar la representación sin cambiar la identidad semántica del proyecto.",
    inputs: ["CANONICAL_PROJECT_STATE", "BIM_INFORMATION", "AUDIENCE", "DELIVERABLE_CONTEXT", "RESOLUTION_PROFILE"],
    outputs: ["THINKING_REPRESENTATION", "CLIENT_REPRESENTATION", "TECHNICAL_REPRESENTATION", "OFFICIAL_REPRESENTATION", "CONSTRUCTION_REPRESENTATION", "OPERATION_REPRESENTATION"],
    gate: "REPRESENTATION_AND_DIMENSION_REVIEW",
    boundary: "Una imagen, render o lámina conceptual no es automáticamente un plano aprobado, modelo coordinado ni expediente contractual.",
  },
  {
    id: "ARKI_ETI_BIM",
    name: "ARKI-ETI-BIM",
    mission: "Mantener la continuidad informacional del expediente técnico desde requisitos hasta operación.",
    inputs: ["PROJECT_STATE", "OIR_AIR_PIR_EIR", "BEP", "CDE", "SEMANTIC_BIM", "COSTS", "SCHEDULE", "SPECIALIST_INPUTS"],
    outputs: ["EXPEDIENTE_TECNICO_PACKAGE", "BIM_INFORMATION_DELIVERY", "COORDINATION_REGISTER", "QUANTITY_AND_COST_TRACE", "COST_MODEL_WITH_PROVENANCE", "SPECIFICATION_TRACE", "HANDOVER_AND_ASSET_INFORMATION"],
    gate: "BIM_INFORMATION_AND_SPECIALIST_REVIEW",
    boundary: "Native IFC/RVT/DWG/GIS authoring, engineering calculations, regulatory approval, market-price adoption and professional signatures remain adapter- or specialist-dependent.",
  },
];

export type TriadTrace = {
  version: "ARKI-TRIAD-INTEGRATION-1.0";
  oneMotor: true;
  components: Array<{
    id: ArkiTriadComponent;
    status: TriadComponentStatus;
    evidence: string[];
    nextGate: string;
  }>;
  canonicalIdentity: "ONE_PROJECT_STATE";
  representationPolicy: "SAME_SEMANTIC_IDENTITY_MULTIPLE_CONTROLLED_REPRESENTATIONS";
  humanAuthority: "FINAL";
};

export function buildArkiTriadTrace(cycle: IntegratedArchitectCycle): TriadTrace {
  const conceptualPass = cycle.status === "CONCEPTUAL_CYCLE_PASS";
  return {
    version: "ARKI-TRIAD-INTEGRATION-1.0",
    oneMotor: true,
    components: [
      {
        id: "ARKI_SUPER_ARCHITECT",
        status: conceptualPass ? "EXECUTED" : "CONTRACTED_WITH_BOUNDS",
        evidence: cycle.stages.map((stage) => `${stage.stage}:${stage.status}`),
        nextGate: "HUMAN_REVIEW_AND_PROJECT_DECISION",
      },
      {
        id: "ARKI_GRAPHIC_INTELLIGENCE",
        status: conceptualPass ? "EXECUTED" : "CONTRACTED_WITH_BOUNDS",
        evidence: ["THINKING_REPRESENTATION", "CLIENT_REPRESENTATION", "TECHNICAL_REPRESENTATION", "OFFICIAL_REPRESENTATION", "CONSTRUCTION_REPRESENTATION", "OPERATION_REPRESENTATION"],
        nextGate: "REPRESENTATION_AND_DIMENSION_REVIEW",
      },
      {
        id: "ARKI_ETI_BIM",
        status: "SPECIALIST_REQUIRED",
        evidence: ["ARKI-ETI-BIM-1.0", "ARKI-COST-MODEL-1.0", "LIFECYCLE_GATE_TRACE", "MODEL_CALCULATION_DRAWING_QUANTITY_COST_SPECIFICATION_SCHEDULE_DECISION"],
        nextGate: "BIM_INFORMATION_AND_SPECIALIST_REVIEW",
      },
    ],
    canonicalIdentity: "ONE_PROJECT_STATE",
    representationPolicy: "SAME_SEMANTIC_IDENTITY_MULTIPLE_CONTROLLED_REPRESENTATIONS",
    humanAuthority: "FINAL",
  };
}

export function summarizeArkiTriad(trace: TriadTrace) {
  return {
    oneMotor: trace.oneMotor,
    componentStatuses: Object.fromEntries(trace.components.map((component) => [component.id, component.status])),
    canProduceMultipleRepresentations: trace.components.some((component) => component.id === "ARKI_GRAPHIC_INTELLIGENCE"),
    etiBimIsNativeProfessionalExport: false,
    humanAuthority: trace.humanAuthority,
  };
}
