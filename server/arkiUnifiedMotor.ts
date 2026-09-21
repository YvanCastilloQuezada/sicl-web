import { executeIntegratedArchitectCycle, type IntegratedArchitectCycle, type IntegratedArchitectInput } from "./arkiIntegratedArchitectCycle";
import { buildArkiTriadTrace, type TriadTrace } from "./arkiTriadIntegration";
import { emptySnapshot, type SiclSnapshot } from "./siclCore";

export type UnifiedPieceState = "ACTIVE" | "FROZEN_REFERENCE" | "BLOCKED_GATE" | "NOT_DEMONSTRATED" | "HISTORICAL_REFERENCE";
export type UnifiedPieceKind = "CAPABILITY" | "KNOWLEDGE" | "ORDER" | "EVALUATION" | "ASSET" | "GATE";

export type UnifiedPiece = {
  id: string;
  name: string;
  kind: UnifiedPieceKind;
  state: UnifiedPieceState;
  activationGate: string;
  usedByMotor: "EXECUTED" | "ROUTED_AS_REFERENCE" | "HELD";
  evidence: string[];
  boundary: string;
};

export type UnifiedMotorInput = IntegratedArchitectInput & {
  requestedPieces?: string[];
};

export type UnifiedMotorResult = {
  motorVersion: "ARKI-UNIFIED-MOTOR-1.0";
  project: IntegratedArchitectCycle["project"];
  cycle: IntegratedArchitectCycle;
  triad: TriadTrace;
  pieceRegistry: UnifiedPiece[];
  routing: Array<{ pieceId: string; route: "EXECUTE" | "REFERENCE" | "HOLD"; reason: string }>;
  frozenPreserved: string[];
  blockedPreserved: string[];
  unknowns: string[];
  humanAuthority: "FINAL";
  status: "PASS_WITH_BOUNDS" | "PARTIAL";
};

/**
 * One motor, many governed pieces. Frozen/blocked artifacts are routed into the
 * same trace instead of being silently activated or copied into a parallel engine.
 */
export const UNIFIED_PIECE_REGISTRY: UnifiedPiece[] = [
  { id: "D6.1", name: "Knowledge and curriculum lineage", kind: "KNOWLEDGE", state: "ACTIVE", activationGate: "KNOWLEDGE_PROVENANCE", usedByMotor: "EXECUTED", evidence: ["docs/arki-post-513-inventory", "docs/arki-knowledge"], boundary: "Knowledge is retrieved with epistemic status; it is not automatic authority." },
  { id: "D6.2-M", name: "Reasoning to topology bridge", kind: "CAPABILITY", state: "ACTIVE", activationGate: "D6.2_M_PASS", usedByMotor: "EXECUTED", evidence: ["server/arkiD62ReasoningHarness.ts", "server/arkiD62MinimalBridge.test.ts"], boundary: "Produces bounded reasoning and topology hypotheses." },
  { id: "D6.3-G", name: "Topology to conceptual geometry bridge", kind: "CAPABILITY", state: "ACTIVE", activationGate: "D6.3_G_PASS", usedByMotor: "EXECUTED", evidence: ["server/arkiD63GeometricBridge.ts", "server/arkiD63GeometricBridge.test.ts"], boundary: "Conceptual geometry only; regulatory and construction validity are not implied." },
  { id: "D6.4", name: "Multimodal ingestion and OCR", kind: "CAPABILITY", state: "ACTIVE", activationGate: "SOURCE_REVIEW", usedByMotor: "EXECUTED", evidence: ["server/arkiOcr.ts", "docs/arki-d64"], boundary: "OCR observations remain AI_PROPOSED until human review." },
  { id: "PARTI-CONTRACT-1.0", name: "Parti documentary contract", kind: "CAPABILITY", state: "ACTIVE", activationGate: "PARTI_PROOF_PASS", usedByMotor: "EXECUTED", evidence: ["server/arkiPartiContract.ts", "server/arkiPartiContract.test.ts"], boundary: "Parti is not form, topology or geometry; functional validity remains UNKNOWN." },
  { id: "ARKI-INTEGRATED-ARCHITECT-1.0", name: "Integrated architect cycle", kind: "CAPABILITY", state: "ACTIVE", activationGate: "INTEGRATED_CYCLE_PASS", usedByMotor: "EXECUTED", evidence: ["server/arkiIntegratedArchitectCycle.ts", "server/arkiIntegratedArchitectCycle.test.ts"], boundary: "Bounded conceptual architectural synthesis only." },
  { id: "ARKI-SUPER-ARCHITECT-1.0", name: "ARKI Super Architect", kind: "CAPABILITY", state: "ACTIVE", activationGate: "INTEGRATED_CYCLE_PASS", usedByMotor: "EXECUTED", evidence: ["server/arkiIntegratedArchitectCycle.ts", "server/arkiTriadIntegration.ts"], boundary: "Coordinates architectural reasoning, alternatives and backtracking; does not replace licensed specialists." },
  { id: "ARKI-GRAPHIC-INTELLIGENCE-1.0", name: "ARKI Graphic Intelligence", kind: "CAPABILITY", state: "ACTIVE", activationGate: "REPRESENTATION_AND_DIMENSION_REVIEW", usedByMotor: "EXECUTED", evidence: ["server/arkiVisualIntelligence.ts", "server/arkiTriadIntegration.ts"], boundary: "Derives controlled representations from one semantic identity; a render is not an approved technical document." },
  { id: "ARKI-ETI-BIM-1.0", name: "ARKI Expediente Técnico Integral BIM", kind: "CAPABILITY", state: "ACTIVE", activationGate: "BIM_INFORMATION_AND_SPECIALIST_REVIEW", usedByMotor: "EXECUTED", evidence: ["server/arkiEtiBim.ts", "server/arkiCostIntelligence.ts", "server/arkiProjectLifecycle.ts", "server/arkiTriadIntegration.ts"], boundary: "Semantic BIM, expediente blocks and cost provenance are available; native professional exports, engineering calculations, market-price adoption and signatures remain bounded." },
  { id: "ARKI-BIM-VISOR-1.0", name: "ARKI-BIM-VISOR", kind: "CAPABILITY", state: "ACTIVE", activationGate: "ADAPTER_AND_CLASH_REVIEW", usedByMotor: "EXECUTED", evidence: ["server/arkiBimViewer.ts", "client/src/pages/ArkiBimViewerPage.tsx", "server/arkiBimViewer.test.ts"], boundary: "ARK is canonical; IFC/DWG require adapters, RVT/DGN require authorized hosts, and clash candidates remain open issues for human review." },
  { id: "ARKI-MASTER-CURRICULUM-5000", name: "Cross-axis master curriculum", kind: "KNOWLEDGE", state: "ACTIVE", activationGate: "KNOWLEDGE_PROVENANCE", usedByMotor: "EXECUTED", evidence: ["docs/arki-research/ARKI_MASTER_CURRICULUM_5000.json"], boundary: "5,000 topics are structured for research and learning; RESEARCH_PENDING is not learned FACT." },
  { id: "MC-02", name: "Frozen future orders register", kind: "ORDER", state: "FROZEN_REFERENCE", activationGate: "EXPLICIT_FUTURE_GATE", usedByMotor: "ROUTED_AS_REFERENCE", evidence: ["docs/arki-mc02"], boundary: "Frozen is preserved and visible; it is not silently activated." },
  { id: "MC-03", name: "Complete assembly register", kind: "CAPABILITY", state: "FROZEN_REFERENCE", activationGate: "MC03_REVIEW_GATE", usedByMotor: "ROUTED_AS_REFERENCE", evidence: ["docs/arki-mc03"], boundary: "Assembly evidence is consulted as registry context; no unsupported capability is promoted." },
  { id: "DG-01B", name: "Blind adversarial applicability protocol", kind: "GATE", state: "BLOCKED_GATE", activationGate: "DG01E_AUTHORIZATION", usedByMotor: "HELD", evidence: ["docs/arki-knowledge/demonstration-gates/DG-01"], boundary: "Protocol is not executed by this motor without its defined authorization and evidence gates." },
  { id: "FKCG-02", name: "Fundamental knowledge preservation", kind: "KNOWLEDGE", state: "FROZEN_REFERENCE", activationGate: "KNOWLEDGE_PROMOTION_REVIEW", usedByMotor: "ROUTED_AS_REFERENCE", evidence: ["docs/arki-knowledge/fundamental-research/FKCG-02"], boundary: "Preserved source material is not promoted to FACT automatically." },
  { id: "DS-EVAL-001", name: "External evaluation", kind: "EVALUATION", state: "HISTORICAL_REFERENCE", activationGate: "EXTERNAL_EVIDENCE_REVIEW", usedByMotor: "ROUTED_AS_REFERENCE", evidence: ["docs/arki-knowledge/external-evaluation"], boundary: "External evaluation informs audit context; it does not change runtime status by itself." },
  { id: "BIM-DWG-REVIT-GIS", name: "Professional export ambitions", kind: "CAPABILITY", state: "NOT_DEMONSTRATED", activationGate: "CONSTRUCTION_EXPORT_PROOF", usedByMotor: "HELD", evidence: ["Historical requirements and inventory reports"], boundary: "Native DWG/Revit/GIS production is not claimed by this conceptual motor." },
];

function routeFor(piece: UnifiedPiece): { route: "EXECUTE" | "REFERENCE" | "HOLD"; reason: string } {
  if (piece.state === "ACTIVE") return { route: "EXECUTE", reason: "Active contract has a passing implementation and focused evidence." };
  if (piece.state === "FROZEN_REFERENCE" || piece.state === "HISTORICAL_REFERENCE") return { route: "REFERENCE", reason: "The motor includes this piece in the common trace without changing its frozen or historical state." };
  return { route: "HOLD", reason: `Activation gate ${piece.activationGate} is not satisfied; no unsupported capability is promoted.` };
}

export function executeArkiUnifiedMotor(input: UnifiedMotorInput, snapshot: SiclSnapshot = emptySnapshot(), coreKnowledgeVersion = 1, runtimeVersion = "ARKI-UNIFIED-MOTOR-1.0"): UnifiedMotorResult {
  const cycle = executeIntegratedArchitectCycle(input, snapshot, coreKnowledgeVersion, runtimeVersion);
  const triad = buildArkiTriadTrace(cycle);
  const selected = input.requestedPieces?.length ? UNIFIED_PIECE_REGISTRY.filter((piece) => input.requestedPieces!.includes(piece.id)) : UNIFIED_PIECE_REGISTRY;
  const routing = selected.map((piece) => ({ pieceId: piece.id, ...routeFor(piece) }));
  const frozenPreserved = selected.filter((piece) => piece.state === "FROZEN_REFERENCE" || piece.state === "HISTORICAL_REFERENCE").map((piece) => piece.id);
  const blockedPreserved = selected.filter((piece) => piece.state === "BLOCKED_GATE" || piece.state === "NOT_DEMONSTRATED").map((piece) => piece.id);
  return { motorVersion: "ARKI-UNIFIED-MOTOR-1.0", project: cycle.project, cycle, triad, pieceRegistry: selected, routing, frozenPreserved, blockedPreserved, unknowns: [...cycle.evaluation.unknowns, ...blockedPreserved.map((id) => `${id} remains held behind its activation gate.`)], humanAuthority: "FINAL", status: cycle.status === "CONCEPTUAL_CYCLE_PASS" ? "PASS_WITH_BOUNDS" : "PARTIAL" };
}

export function unifiedMotorCapability(result: UnifiedMotorResult) {
  return { oneMotor: true, totalPiecesRouted: result.pieceRegistry.length, activePiecesExecuted: result.routing.filter((item) => item.route === "EXECUTE").map((item) => item.pieceId), frozenPiecesPreserved: result.frozenPreserved, blockedPiecesHeld: result.blockedPreserved, triad: result.triad, canUseFrozenAsEvidence: result.frozenPreserved.length > 0, canSilentlyActivateFrozen: false, canClaimProfessionalCompletion: false, humanAuthority: result.humanAuthority, status: result.status };
}
