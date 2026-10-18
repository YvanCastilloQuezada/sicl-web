import type { D63Input } from "./arkiD63GeometricBridge";

export type BrainEpistemicState = "FACT" | "ASSUMPTION" | "HYPOTHESIS" | "UNKNOWN" | "CONFLICT";
export type SufficiencyDisposition = "PROCEED" | "PROCEED_WITH_EXPLICIT_ASSUMPTIONS" | "ASK_HUMAN";
export type Criticality = "CRITICAL" | "IMPORTANT" | "ADVISORY";
export type BrainRecord = { id: string; label: string; state: BrainEpistemicState; provenance: string[]; note?: string };

export type CanonicalProjectBrain = {
  project: { projectId: string; name: string; typology: string; location?: string; jurisdiction?: string; site?: Record<string, unknown> };
  identity: BrainRecord[];
  evidence: { facts: BrainRecord[]; assumptions: BrainRecord[]; unknowns: BrainRecord[]; conflicts: BrainRecord[] };
  stakeholders: BrainRecord[];
  requirements: BrainRecord[];
  program: { activities: D63Input["activities"]; capacities: Record<string, number>; relationships: D63Input["relationships"] };
  problemFrame: { intent: string; tensions: string[]; hypotheses: string[]; provenance: string[] };
  architecture: { partis: DynamicParti[]; topology: string[]; geometry: string[] };
  engineering: { structure: BrainRecord[]; mep: BrainRecord[]; mobility: BrainRecord[]; accessibility: BrainRecord[] };
  regulations: BrainRecord[];
  economics: { cost: BrainRecord[]; schedule: BrainRecord[]; risks: BrainRecord[] };
  evaluations: EvaluationMatrix;
  decisions: BrainRecord[];
  mutations: BrainRecord[];
  backtracks: BrainRecord[];
  deliverables: BrainRecord[];
  construction: BrainRecord[];
  operations: BrainRecord[];
  outcomes: BrainRecord[];
  experience: BrainRecord[];
  learning: BrainRecord[];
  provenance: string[];
};

export type SufficiencyItem = { id: string; label: string; criticality: Criticality; canAssume: boolean; disposition: "EXPLICIT_ASSUMPTION" | "ASK_HUMAN" | "RESOLVED"; reason: string; resolutionPath: string };
export type SufficiencyAnalysis = { status: SufficiencyDisposition; known: string[]; missing: SufficiencyItem[]; assumptions: string[]; blockingUnknowns: string[]; humanQuestions: string[] };
export type ProblemFrame = CanonicalProjectBrain["problemFrame"];
export type DynamicParti = { id: string; title: string; organizingIdea: string; rules: string[]; flowStrategy: string; derivedFrom: string[]; status: "AI_PROPOSED"; humanReviewRequired: true };
export type EvaluationCell = { status: "PASS" | "PARTIAL" | "FAIL" | "UNKNOWN"; rationale: string; evidence: string[] };
export type EvaluationMatrix = { domains: string[]; alternatives: Record<string, Record<string, EvaluationCell>>; devilArchitect: { target: string; attacks: string[]; contradictions: string[]; weakAssumptions: string[]; uniqueFailures: string[]; displacedCosts: string[]; createdProblems: string[]; status: "AI_PROPOSED"; humanReviewRequired: true } };
export type GenealogyNode = { id: string; type: "PROBLEM" | "TENSION" | "HYPOTHESIS" | "PARTI" | "DECISION" | "TOPOLOGY" | "GEOMETRY" | "BUILDING_ELEMENT" | "COST" | "PERFORMANCE" | "CONSEQUENCE"; label: string; parentIds: string[]; state: BrainEpistemicState; provenance: string[] };
export type ArchitecturalGenealogy = { nodes: GenealogyNode[]; edges: Array<{ from: string; to: string; relation: string }>; why: string[]; removalImpact: string[] };

export type ProjectBrainInput = {
  projectId: string; name: string; typology: string; brief: string; location?: string; jurisdiction?: string; site?: Record<string, unknown>;
  knownFacts?: string[]; assumptions?: string[]; unknowns?: string[]; conflicts?: string[]; requirements?: string[]; objectives?: string[]; constraints?: string[]; preferences?: string[];
  activities: D63Input["activities"]; relationships: D63Input["relationships"]; capacities?: Record<string, number>; stakeholders?: string[]; sourceIds?: string[];
};

const DOMAINS = ["FUNCTION", "CLIMATE", "STRUCTURE", "CIRCULATION", "ACCESSIBILITY", "REGULATION", "COST", "CONSTRUCTION", "MAINTENANCE", "HUMAN_EXPERIENCE", "ARCHITECTURAL_COHERENCE"] as const;
const token = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || "PROJECT";
const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

export function analyzeInputSufficiency(input: ProjectBrainInput): SufficiencyAnalysis {
  const known = unique([...(input.knownFacts ?? []), input.location ? `LOCATION=${input.location}` : "", input.jurisdiction ? `JURISDICTION=${input.jurisdiction}` : "", input.activities.length ? `ACTIVITIES=${input.activities.length}` : "", input.relationships.length ? `RELATIONSHIPS=${input.relationships.length}` : ""]);
  const missing: SufficiencyItem[] = [];
  const add = (id: string, label: string, criticality: Criticality, canAssume: boolean, reason: string, resolutionPath: string) => missing.push({ id, label, criticality, canAssume, disposition: canAssume ? "EXPLICIT_ASSUMPTION" : "ASK_HUMAN", reason, resolutionPath });
  if (!input.location) add("LOCATION", "Ubicación y municipio", "CRITICAL", false, "Define jurisdicción, clima, accesos y fuentes normativas.", "ASK_HUMAN");
  if (!input.jurisdiction) add("JURISDICTION", "País y jurisdicción aplicable", "CRITICAL", false, "No se puede verificar regulación sin jurisdicción.", "ASK_HUMAN");
  if (!input.constraints?.length) add("CONSTRAINTS", "Restricciones del encargo", "IMPORTANT", true, "Puede desarrollarse una hipótesis, pero debe quedar explícita.", "EXPLICIT_ASSUMPTION");
  if (!input.activities.length) add("ACTIVITIES", "Actividades y operación", "CRITICAL", false, "Sin actividades no puede comprobarse la funcionalidad.", "ASK_HUMAN");
  if (!input.relationships.length) add("RELATIONSHIPS", "Relaciones funcionales", "IMPORTANT", true, "Se puede proponer una relación preliminar, no verificarla.", "EXPLICIT_ASSUMPTION");
  if (!input.site || Object.keys(input.site).length === 0) add("SITE", "Datos del terreno", "CRITICAL", false, "Topografía, accesos y forma afectan implantación y movilidad.", "ASK_HUMAN");
  const explicitAssumptions = [...(input.assumptions ?? []), ...missing.filter((item) => item.disposition === "EXPLICIT_ASSUMPTION").map((item) => `${item.label}: ${item.reason}`)];
  const blockingUnknowns = missing.filter((item) => item.criticality === "CRITICAL" && item.disposition === "ASK_HUMAN").map((item) => item.id);
  return { status: blockingUnknowns.length ? "ASK_HUMAN" : explicitAssumptions.length ? "PROCEED_WITH_EXPLICIT_ASSUMPTIONS" : "PROCEED", known, missing, assumptions: explicitAssumptions, blockingUnknowns, humanQuestions: missing.filter((item) => item.disposition === "ASK_HUMAN").map((item) => item.label) };
}

export function frameProblem(input: ProjectBrainInput, sufficiency: SufficiencyAnalysis): ProblemFrame {
  const constraints = input.constraints?.length ? input.constraints : ["El programa debe ser funcional y verificable antes de embellecerlo."];
  const tensions = unique([
    `Capacidad y operación deben coexistir con ${input.typology} legible.`,
    constraints.length > 1 ? `Restricciones simultáneas: ${constraints.slice(0, 3).join("; ")}.` : "La información incompleta limita la certeza del diseño.",
    input.relationships.length ? "Separar flujos sin perder orientación y proximidad funcional." : "Definir relaciones sin inventar un programa no suministrado.",
    sufficiency.blockingUnknowns.length ? `UNKNOWN críticos bloquean verificación: ${sufficiency.blockingUnknowns.join(", ")}.` : "El diseño puede avanzar con supuestos explícitos y revisables.",
  ]);
  const hypotheses = [
    `Organizar ${input.typology} mediante una estructura de flujos derivada de actividades y relaciones, no de una forma precargada.`,
    "Separar lo público, operativo y de servicio según las relaciones declaradas; conservar interfaces controladas.",
    "Mantener alternativas divergentes hasta que la matriz de evaluación y la autoridad humana decidan.",
  ];
  return { intent: input.brief, tensions, hypotheses, provenance: [...(input.sourceIds ?? []).map((id) => `SOURCE:${id}`), "PROJECT_INPUT", "SUFFICIENCY_ANALYSIS"] };
}

export function deriveDynamicPartis(input: ProjectBrainInput, frame: ProblemFrame): DynamicParti[] {
  const projectKey = token(`${input.projectId}-${input.typology}-${input.activities.map((a) => a.label).join("-")}`);
  const flowLabels = unique(input.activities.map((activity) => activity.label)).slice(0, 4);
  const relationshipLabels = unique(input.relationships.map((relationship) => `${relationship.from}->${relationship.to}:${relationship.relation}`)).slice(0, 4);
  const basis = [...flowLabels, ...relationshipLabels, ...frame.tensions.slice(0, 2)];
  return [
    { id: `PARTI-${projectKey}-SPINE`, title: "Separation spine", organizingIdea: `Una espina organiza los flujos derivados de ${flowLabels.join(", ") || "las actividades declaradas"}.`, rules: ["Ordenar secuencias antes de fijar forma.", "Separar interfaces incompatibles.", ...relationshipLabels], flowStrategy: "linear-separation", derivedFrom: basis, status: "AI_PROPOSED", humanReviewRequired: true },
    { id: `PARTI-${projectKey}-HUB`, title: "Central relational hub", organizingIdea: "Un nodo común reduce recorridos entre relaciones compatibles y controla las incompatibles.", rules: ["Concentrar orientación en un nodo legible.", "Mantener accesos diferenciados.", ...relationshipLabels.slice(0, 2)], flowStrategy: "central-hub", derivedFrom: basis, status: "AI_PROPOSED", humanReviewRequired: true },
    { id: `PARTI-${projectKey}-RINGS`, title: "Independent rings", organizingIdea: "Anillos diferenciados permiten operar flujos con menor interferencia entre sí.", rules: ["Anillo público primero.", "Anillo operativo separado.", "Anillo de servicio con acceso independiente."], flowStrategy: "nested-rings", derivedFrom: basis, status: "AI_PROPOSED", humanReviewRequired: true },
  ];
}

function cell(status: EvaluationCell["status"], rationale: string, evidence: string[]): EvaluationCell { return { status, rationale, evidence }; }
export function evaluateAlternatives(partis: DynamicParti[], sufficiency: SufficiencyAnalysis, input: ProjectBrainInput): EvaluationMatrix {
  const alternatives: EvaluationMatrix["alternatives"] = {};
  for (const parti of partis) {
    const unknown = sufficiency.blockingUnknowns.length > 0;
    alternatives[parti.id] = {
      FUNCTION: cell(input.activities.length ? "PARTIAL" : "UNKNOWN", "La actividad está registrada, pero el ajuste funcional requiere revisión.", ["ACTIVITIES", parti.id]),
      CLIMATE: cell("UNKNOWN", "No hay clima verificado o simulación ambiental en esta Wave.", ["UNKNOWN:CLIMATE"]),
      STRUCTURE: cell("UNKNOWN", "No hay cálculo estructural.", ["UNKNOWN:STRUCTURE"]),
      CIRCULATION: cell(input.relationships.length ? "PARTIAL" : "UNKNOWN", "Las relaciones alimentan el parti; anchos, radios y conflictos deben comprobarse.", ["RELATIONSHIPS", parti.id]),
      ACCESSIBILITY: cell("UNKNOWN", "No se ha verificado normativa ni recorrido accesible completo.", ["UNKNOWN:ACCESSIBILITY"]),
      REGULATION: cell(input.jurisdiction ? "UNKNOWN" : "UNKNOWN", "La jurisdicción o la aplicabilidad normativa aún requieren verificación.", ["JURISDICTION", "REGULATION"]),
      COST: cell("UNKNOWN", "No hay cantidades ni precios de esta alternativa en la entrada.", ["UNKNOWN:COST"]),
      CONSTRUCTION: cell("UNKNOWN", "La constructibilidad requiere estructura, materiales y método.", ["UNKNOWN:CONSTRUCTION"]),
      MAINTENANCE: cell("UNKNOWN", "No hay estrategia de mantenimiento declarada.", ["UNKNOWN:MAINTENANCE"]),
      HUMAN_EXPERIENCE: cell("PARTIAL", "Se conserva orientación y separación como intención, no como resultado medido.", [parti.id, "HYPOTHESIS"]),
      ARCHITECTURAL_COHERENCE: cell("PASS", "El parti conserva una regla organizadora coherente y trazable.", [parti.id, "PROBLEM_FRAME"]),
    };
    if (unknown) alternatives[parti.id].FUNCTION = cell("PARTIAL", "La suficiencia bloquea verificación; se mantiene como propuesta.", ["BLOCKING_UNKNOWN", parti.id]);
  }
  const favorite = partis[0]?.id ?? "NONE";
  return { domains: [...DOMAINS], alternatives, devilArchitect: { target: favorite, attacks: ["Intentar eliminar la interfaz controlada.", "Concentrar todos los flujos en un solo acceso.", "Suponer que la imagen prueba cumplimiento."], contradictions: ["La forma puede parecer ordenada aunque las relaciones operativas sean incompatibles."], weakAssumptions: sufficiency.assumptions.length ? sufficiency.assumptions : ["La demanda y la operación no están verificadas."], uniqueFailures: ["Un acceso único puede bloquear todo el sistema.", "Un cruce no controlado puede contaminar la separación de flujos."], displacedCosts: ["La alternativa más compacta puede trasladar costo a operación, seguridad o mantenimiento."], createdProblems: ["Toda solución puede crear recorridos excesivos, puntos ciegos o conflictos de servicio."], status: "AI_PROPOSED", humanReviewRequired: true } };
}

export function buildArchitecturalGenealogy(input: ProjectBrainInput, frame: ProblemFrame, partis: DynamicParti[], matrix: EvaluationMatrix): ArchitecturalGenealogy {
  const nodes: GenealogyNode[] = [
    { id: "G-PROBLEM", type: "PROBLEM", label: input.brief, parentIds: [], state: "FACT", provenance: ["PROJECT_INPUT"] },
    ...frame.tensions.map((label, index) => ({ id: `G-TENSION-${index + 1}`, type: "TENSION" as const, label, parentIds: ["G-PROBLEM"], state: "HYPOTHESIS" as const, provenance: ["PROBLEM_FRAME"] })),
    ...partis.map((parti, index) => ({ id: `G-PARTI-${index + 1}`, type: "PARTI" as const, label: parti.title, parentIds: ["G-PROBLEM", ...frame.tensions.slice(0, 2).map((_, tensionIndex) => `G-TENSION-${tensionIndex + 1}`)], state: "HYPOTHESIS" as const, provenance: parti.derivedFrom })),
    ...partis.map((parti, index) => ({ id: `G-TOPOLOGY-${index + 1}`, type: "TOPOLOGY" as const, label: parti.flowStrategy, parentIds: [`G-PARTI-${index + 1}`], state: "HYPOTHESIS" as const, provenance: [parti.id] })),
    { id: "G-DECISION", type: "DECISION", label: "Human selection remains pending", parentIds: partis.map((_, index) => `G-PARTI-${index + 1}`), state: "UNKNOWN", provenance: ["HUMAN_AUTHORITY_FINAL"] },
    { id: "G-CONSEQUENCE", type: "CONSEQUENCE", label: "Performance and cost consequences require further evidence", parentIds: ["G-DECISION"], state: "UNKNOWN", provenance: ["EVALUATION_MATRIX"] },
  ];
  const edges = nodes.flatMap((node) => node.parentIds.map((parentId) => ({ from: parentId, to: node.id, relation: `${node.type}_DERIVED_FROM` })));
  return { nodes, edges, why: [`WHY: ${input.brief}`, ...frame.tensions.map((item) => `TENSION: ${item}`), ...partis.map((item) => `PARTI: ${item.title} because ${item.organizingIdea}`), `EVALUATION: ${matrix.devilArchitect.target} is attacked before human decision.`], removalImpact: ["Removing the selected parti requires re-evaluating topology and geometry.", "Removing a critical relationship may invalidate the functional hypothesis.", "Removing the evidence chain converts the claim to UNKNOWN."] };
}

export function executeProjectBrainWave1(input: ProjectBrainInput) {
  const sufficiency = analyzeInputSufficiency(input);
  const problemFrame = frameProblem(input, sufficiency);
  const partis = deriveDynamicPartis(input, problemFrame);
  const evaluations = evaluateAlternatives(partis, sufficiency, input);
  const genealogy = buildArchitecturalGenealogy(input, problemFrame, partis, evaluations);
  const preservedUnknownLabels = unique([
    ...(input.unknowns ?? []),
    ...sufficiency.missing.filter((item) => item.disposition === "ASK_HUMAN").map((item) => item.label),
    "Functional fit requires activity-by-activity human review.",
    "Regulatory applicability requires jurisdiction-specific evidence and professional review.",
    "Structural, MEP, cost and maintenance validation require specialist inputs.",
  ]);
  const brain: CanonicalProjectBrain = {
    project: { projectId: input.projectId, name: input.name, typology: input.typology, location: input.location, jurisdiction: input.jurisdiction, site: input.site },
    identity: [{ id: "IDENTITY-001", label: input.projectId, state: "FACT", provenance: ["PROJECT_INPUT"] }],
    evidence: { facts: (input.knownFacts ?? []).map((label, index) => ({ id: `FACT-${index + 1}`, label, state: "FACT", provenance: input.sourceIds ?? ["PROJECT_INPUT"] })), assumptions: sufficiency.assumptions.map((label, index) => ({ id: `ASSUMPTION-${index + 1}`, label, state: "ASSUMPTION", provenance: ["SUFFICIENCY_ANALYSIS"] })), unknowns: preservedUnknownLabels.map((label, index) => ({ id: `UNKNOWN-${index + 1}`, label, state: "UNKNOWN", provenance: ["INPUT_SUFFICIENCY", "EVALUATION_BOUNDARY"] })), conflicts: (input.conflicts ?? []).map((label, index) => ({ id: `CONFLICT-${index + 1}`, label, state: "CONFLICT", provenance: ["PROJECT_INPUT"] })) },
    stakeholders: (input.stakeholders ?? []).map((label, index) => ({ id: `STAKEHOLDER-${index + 1}`, label, state: "FACT", provenance: ["PROJECT_INPUT"] })),
    requirements: [...(input.requirements ?? []), ...(input.objectives ?? [])].map((label, index) => ({ id: `REQUIREMENT-${index + 1}`, label, state: "FACT", provenance: ["PROJECT_INPUT"] })),
    program: { activities: input.activities, capacities: input.capacities ?? {}, relationships: input.relationships },
    problemFrame, architecture: { partis, topology: partis.map((parti) => `TOPOLOGY:${parti.flowStrategy}`), geometry: [] },
    engineering: { structure: [], mep: [], mobility: [], accessibility: [] }, regulations: [], economics: { cost: [], schedule: [], risks: [] }, evaluations, decisions: [], mutations: [], backtracks: [], deliverables: [], construction: [], operations: [], outcomes: [], experience: [], learning: [], provenance: ["ARKI-PROJECT-BRAIN-WAVE-1", ...(input.sourceIds ?? [])],
  };
  return { brain, sufficiency, problemFrame, partis, evaluations, genealogy, status: sufficiency.status === "ASK_HUMAN" ? "PARTIAL_REQUIRES_INPUT" as const : "PASS_WITH_BOUNDS" as const, humanAuthority: "FINAL" as const };
}

export function explainWhy(genealogy: ArchitecturalGenealogy, targetId: string) {
  const node = genealogy.nodes.find((item) => item.id === targetId);
  if (!node) return { status: "UNKNOWN" as const, targetId, explanation: ["Element not found in current genealogy."] };
  const explanation = [node.label, ...node.parentIds.map((parentId) => genealogy.nodes.find((item) => item.id === parentId)?.label).filter(Boolean) as string[]];
  return { status: "TRACEABLE" as const, targetId, explanation, state: node.state, provenance: node.provenance };
}

export function simulateRemoval(genealogy: ArchitecturalGenealogy, targetId: string) {
  const impacted = genealogy.edges.filter((edge) => edge.from === targetId).map((edge) => edge.to);
  return { targetId, impactedNodeIds: impacted, consequence: impacted.length ? "REQUIRES_REEVALUATION" as const : "NO_DOWNSTREAM_EDGE_RECORDED" as const, humanReviewRequired: true as const };
}
