export type WorldClassFacultyId =
  | "DESIGN_JUDGMENT"
  | "TYPOLOGICAL_MASTERY"
  | "SPATIAL_REASONING"
  | "MULTILEVEL_COHERENCE"
  | "UNIVERSAL_ACCESS"
  | "SAFETY_RESILIENCE"
  | "MATERIAL_LIFECYCLE"
  | "ECONOMIC_JUSTICE"
  | "EVIDENCE_NORMATIVE_REASONING"
  | "CULTURAL_CONTEXT"
  | "CRITICAL_REFLEXIVITY"
  | "PROFESSIONAL_COMMUNICATION";

export type FacultyState = "SUPPORTED" | "PARTIAL" | "REQUIRES_EVIDENCE" | "CONFLICTING" | "NOT_ASSESSED";
export type FacultyEvidence = { facultyId: WorldClassFacultyId; state: FacultyState; evidenceRefs: string[]; strengths: string[]; openQuestions: string[]; humanReviewRequired: true };
export type WorldClassArchitectAssessment = { projectId: string; faculties: FacultyEvidence[]; integratedStrengths: string[]; crossFacultyTensions: string[]; missingCapabilities: string[]; readiness: "PARTIAL_FOUNDATION" | "REQUIRES_PROJECT_EVIDENCE" | "CONFLICTING"; humanAuthority: "PRESERVED"; noAutomaticCertification: true; noAutomaticWinner: true; noAutomaticArchitectCredential: true; provenance: string[] };

export const WORLD_CLASS_ARCHITECT_FACULTIES: Array<{ id: WorldClassFacultyId; name: string; purpose: string; existingSurfaces: string[] }> = [
  { id: "DESIGN_JUDGMENT", name: "Juicio arquitectónico", purpose: "Relacionar belleza, carácter, proporción, utilidad, dignidad, complejidad y excelencia con el contexto.", existingSurfaces: ["A16", "A26"] },
  { id: "TYPOLOGICAL_MASTERY", name: "Dominio tipológico", purpose: "Adaptar programa, riesgos, flujos y experiencia a cada tipología sin usar una plantilla universal.", existingSurfaces: ["A24", "A26", "A27"] },
  { id: "SPATIAL_REASONING", name: "Razonamiento espacial", purpose: "Conectar programa, espacios, adyacencias, privacidad, jerarquía, circulación y forma.", existingSurfaces: ["A13", "A21", "A24"] },
  { id: "MULTILEVEL_COHERENCE", name: "Coherencia multinivel", purpose: "Mantener alineamiento, apilamiento, núcleos y continuidad entre niveles.", existingSurfaces: ["A22", "A23", "A24"] },
  { id: "UNIVERSAL_ACCESS", name: "Accesibilidad universal", purpose: "Garantizar que la ruta espacial considere diversidad corporal, sensorial, cognitiva y clínica.", existingSurfaces: ["A20-P2", "A27"] },
  { id: "SAFETY_RESILIENCE", name: "Seguridad y resiliencia", purpose: "Razonar sobre incendio, evacuación, redundancia, humo, sismo, clima y continuidad operativa.", existingSurfaces: ["A20-P3R", "A25", "A27"] },
  { id: "MATERIAL_LIFECYCLE", name: "Materialidad y ciclo de vida", purpose: "Comparar materiales por desempeño, carbono, durabilidad, mantenimiento, circularidad y disponibilidad.", existingSurfaces: ["A25", "A26", "A27"] },
  { id: "ECONOMIC_JUSTICE", name: "Economía y justicia", purpose: "Buscar excelencia a costo razonable y hacer visibles los sacrificios económicos y sociales.", existingSurfaces: ["A16", "A21", "A26"] },
  { id: "EVIDENCE_NORMATIVE_REASONING", name: "Evidencia y normativa", purpose: "Separar hecho, fuente, norma, observación, hipótesis, cálculo, preferencia y unknown.", existingSurfaces: ["A15", "A18", "A20-P3R", "A27"] },
  { id: "CULTURAL_CONTEXT", name: "Cultura y contexto", purpose: "Relacionar clima, territorio, historia, memoria, prácticas sociales, identidad y recursos locales.", existingSurfaces: ["A11", "A12", "A25", "A26"] },
  { id: "CRITICAL_REFLEXIVITY", name: "Crítica y autocrítica", purpose: "Comparar alternativas, detectar contradicciones, registrar límites y revisar hipótesis.", existingSurfaces: ["A16", "A17", "A19", "A21"] },
  { id: "PROFESSIONAL_COMMUNICATION", name: "Comunicación profesional", purpose: "Explicar decisiones, incertidumbres, métricas y consecuencias a equipos y autoridades.", existingSurfaces: ["A15", "A16", "A21", "A27"] },
];

const faculty = (facultyId: WorldClassFacultyId, state: FacultyState, evidenceRefs: string[], strengths: string[], openQuestions: string[]): FacultyEvidence => ({ facultyId, state, evidenceRefs, strengths, openQuestions, humanReviewRequired: true });

export function assessWorldClassArchitectFaculties(input: { projectId: string; evidenceByFaculty?: Partial<Record<WorldClassFacultyId, { state: FacultyState; evidenceRefs: string[]; strengths?: string[]; openQuestions?: string[] }>> }): WorldClassArchitectAssessment {
  const evidence = input.evidenceByFaculty ?? {};
  const faculties = WORLD_CLASS_ARCHITECT_FACULTIES.map(({ id }) => { const item = evidence[id]; return item ? faculty(id, item.state, item.evidenceRefs, item.strengths ?? [], item.openQuestions ?? []) : faculty(id, "NOT_ASSESSED", [], [], ["Collect project-specific evidence before claiming this faculty."]); });
  const integratedStrengths = faculties.filter((item) => item.state === "SUPPORTED" || item.state === "PARTIAL").flatMap((item) => item.strengths);
  const missingCapabilities = faculties.filter((item) => item.state === "NOT_ASSESSED" || item.state === "REQUIRES_EVIDENCE").map((item) => item.facultyId);
  const crossFacultyTensions = [
    "beauty versus affordability",
    "formal complexity versus constructability",
    "accessibility versus circulation efficiency",
    "infection control versus openness and public experience",
    "carbon reduction versus durability and hospital performance",
    "security versus dignity",
    "local identity versus universal legibility",
  ];
  const hasConflict = faculties.some((item) => item.state === "CONFLICTING");
  const readiness = hasConflict ? "CONFLICTING" : missingCapabilities.length ? "REQUIRES_PROJECT_EVIDENCE" : "PARTIAL_FOUNDATION";
  return { projectId: input.projectId, faculties, integratedStrengths, crossFacultyTensions, missingCapabilities, readiness, humanAuthority: "PRESERVED", noAutomaticCertification: true, noAutomaticWinner: true, noAutomaticArchitectCredential: true, provenance: ["A27 world-class architect criteria", "A21-A27 integrated capability surfaces"] };
}

export function validateWorldClassFacultyModel(assessment: WorldClassArchitectAssessment): boolean {
  const ids = new Set(WORLD_CLASS_ARCHITECT_FACULTIES.map((item) => item.id));
  return assessment.faculties.length === 12 && assessment.faculties.every((item) => ids.has(item.facultyId) && item.humanReviewRequired && item.evidenceRefs.every((ref) => ref.length > 0)) && assessment.humanAuthority === "PRESERVED" && assessment.noAutomaticCertification && assessment.noAutomaticWinner && assessment.noAutomaticArchitectCredential;
}
