export type EpistemicClass = "FACT" | "COMPUTED" | "INTERPRETATION" | "HYPOTHESIS" | "UNKNOWN";
export type ReasoningBasis = "PROJECT_FACT" | "GEOMETRY" | "SPATIAL_RELATIONSHIP" | "SPATIAL_HIERARCHY" | "COMPUTED_METRIC" | "DESIGN_DISTANCE" | "EVALUATION" | "DESIGN_KNOWLEDGE" | "SITE_CONTEXT" | "PROJECT_OBJECTIVE" | "PROJECT_CONSTRAINT" | "PROJECT_PREFERENCE" | "AI_PROPOSED" | "UNKNOWN";

export type ReasoningStatement = { text: string; epistemicClass: EpistemicClass; basis: ReasoningBasis[]; support: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "INSUFFICIENT_INFORMATION" };
export type ArquiDesignReasoning = {
  subject: string;
  question: string;
  facts: ReasoningStatement[];
  computed: ReasoningStatement[];
  interpretations: ReasoningStatement[];
  hypotheses: ReasoningStatement[];
  unknowns: ReasoningStatement[];
  basis: ReasoningBasis[];
  availableActions: { label: string; target: string }[];
  winnerCreated: false;
  decisionCreated: false;
};

type Alternative = Record<string, unknown> & { alternative_id?: string; parameters?: Record<string, unknown>; label?: string };
type Input = { question: string; alternatives?: Alternative[]; selectedSubject?: string; hasGeometry?: boolean; hasKnowledge?: boolean; hasEvaluation?: boolean; hasConfirmedEvidence?: boolean };

function statement(text: string, epistemicClass: EpistemicClass, basis: ReasoningBasis[], support: ReasoningStatement["support"] = "SUPPORTED"): ReasoningStatement {
  return { text, epistemicClass, basis, support };
}
function parameterChanges(a: Alternative, b: Alternative): string[] {
  const left = a.parameters ?? {}; const right = b.parameters ?? {};
  return Object.keys({ ...left, ...right }).filter((key) => JSON.stringify(left[key]) !== JSON.stringify(right[key])).sort();
}

export function resolveDesignSubject(input: Input): string | null {
  if (input.selectedSubject?.trim()) return input.selectedSubject.trim();
  if ((input.alternatives ?? []).length === 2 && /\b(a|b|alternativas|diferenc|compare)/i.test(input.question)) return "A + B";
  if (/\b(courtyard|patio|cour|masa|mass|espacio|space|elemento)\b/i.test(input.question)) return "selected spatial element";
  return null;
}

export function deriveArchitecturalReasoning(input: Input): ArquiDesignReasoning {
  const subject = resolveDesignSubject(input);
  if (!subject) return { subject: "UNRESOLVED", question: input.question, facts: [], computed: [], interpretations: [], hypotheses: [], unknowns: [statement("A design subject must be selected before architectural reasoning can be provided.", "UNKNOWN", ["UNKNOWN"], "INSUFFICIENT_INFORMATION")], basis: ["UNKNOWN"], availableActions: [], winnerCreated: false, decisionCreated: false };
  const alts = input.alternatives ?? [];
  const facts: ReasoningStatement[] = [statement(`Subject resolved as ${subject}.`, "FACT", ["PROJECT_FACT"]), ...(input.hasGeometry ? [statement("Spatial geometry is available for inspection.", "FACT", ["GEOMETRY"])] : [])];
  const computed: ReasoningStatement[] = [];
  const interpretations: ReasoningStatement[] = [];
  const hypotheses: ReasoningStatement[] = [];
  const unknowns: ReasoningStatement[] = [];
  const actions: { label: string; target: string }[] = [];
  if (subject === "A + B" && alts.length === 2) {
    const changes = parameterChanges(alts[0], alts[1]);
    if (changes.length) computed.push(statement(`The represented alternatives differ in parameter dimensions: ${changes.join(", ")}.`, "COMPUTED", ["COMPUTED_METRIC", "DESIGN_DISTANCE"]));
    else unknowns.push(statement("No deterministic parameter difference is available in the current project read model.", "UNKNOWN", ["DESIGN_DISTANCE"], "INSUFFICIENT_INFORMATION"));
    interpretations.push(statement("The alternatives are architecturally different in the dimensions represented by the current data; this is an interpretation, not a quality judgment.", "INTERPRETATION", ["COMPUTED_METRIC", "DESIGN_DISTANCE"], changes.length ? "PARTIALLY_SUPPORTED" : "INSUFFICIENT_INFORMATION"));
    unknowns.push(statement("Environmental performance, regulatory compliance, cost, comfort and causation are not established by this comparison.", "UNKNOWN", ["UNKNOWN"], "INSUFFICIENT_INFORMATION"));
    actions.push({ label: "Open comparison", target: "comparisons" });
  } else {
    if (input.hasGeometry) interpretations.push(statement("The selected spatial subject can be interpreted only from the geometry and relationships currently represented.", "INTERPRETATION", ["GEOMETRY", "SPATIAL_RELATIONSHIP"], "PARTIALLY_SUPPORTED"));
    else unknowns.push(statement("No geometry is available to support a spatial claim about this subject.", "UNKNOWN", ["GEOMETRY"], "INSUFFICIENT_INFORMATION"));
    if (input.hasKnowledge) interpretations.push(statement("Available design knowledge may frame a possible architectural reading, but it is not a project fact or requirement.", "INTERPRETATION", ["DESIGN_KNOWLEDGE"], "PARTIALLY_SUPPORTED"));
    if (/what if|qué pasaría|cambiar|change|explore|explorar/i.test(input.question)) {
      hypotheses.push(statement("One bounded possibility is worth exploring with an existing supported operation; validation is still required.", "HYPOTHESIS", ["PROJECT_FACT", "DESIGN_KNOWLEDGE"], "PARTIALLY_SUPPORTED"));
      actions.push({ label: "Open spatial operations", target: "design" });
    }
    unknowns.push(statement("Downstream daylight, comfort, cost, compliance and real-world performance remain unknown unless an existing analysis supports them.", "UNKNOWN", ["UNKNOWN"], "INSUFFICIENT_INFORMATION"));
  }
  return { subject, question: input.question, facts, computed, interpretations, hypotheses, unknowns, basis: Array.from(new Set([...facts, ...computed, ...interpretations, ...hypotheses, ...unknowns].flatMap((item) => item.basis))), availableActions: actions, winnerCreated: false, decisionCreated: false };
}
