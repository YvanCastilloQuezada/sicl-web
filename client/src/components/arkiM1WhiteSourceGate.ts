export type M1SourceStatus = "PRIMARY_SOURCE_AVAILABLE" | "PRIMARY_SOURCE_PARTIAL" | "PRIMARY_SOURCE_NOT_AVAILABLE";
export type M1NextStep = "READY_FOR_FULL_SOURCE_INGESTION" | "READY_FOR_NEXT_CORPUS" | "BLOCKED_BY_PRIMARY_SOURCE" | "BLOCKED_BY_ARCHITECTURE" | "BLOCKED_BY_REGRESSION";

export type M1WhiteSourceAudit = {
  sourceId: "WHITE-CONCEPT-SOURCEBOOK";
  author: "Edward T. White";
  title: "Concept Sourcebook: A Vocabulary of Architectural Forms";
  edition: "UNKNOWN";
  publicationData: "UNKNOWN";
  sourceLocation: "NOT_PRESENT_IN_WORKSPACE_OR_REPOSITORY";
  pageStructure: "UNKNOWN";
  sourceAccessStatus: M1SourceStatus;
  sourceStatus: M1SourceStatus;
  completeness: "NOT_ASSESSED";
  sourceCondition: "UNKNOWN";
  allowedWork: "ARCHITECTURE_SCHEMA_AND_INGESTION_PIPELINE_PREPARATION";
  prohibitedWork: string[];
};

export type M1ArchitectureMap = {
  reuse: string[];
  extend: string[];
  create: string[];
  parallelSystems: false;
};

export type M1WhiteSourceGateReport = {
  experimentId: "M1-EDWARD-T-WHITE-SYSTEMATIC-ACQUISITION";
  baseline: { repository: string; branch: string; head: string; remoteHead: string; worktree: "CLEAN"; delta: "PASTED-CONTENT-495-V495" };
  source: M1WhiteSourceAudit;
  architectureMap: M1ArchitectureMap;
  coverage: { source: "NOT_STARTED" | "PARTIAL_PENDING_AUDIT"; semantic: "NOT_STARTED"; implementation: "SCHEMA_READY"; tests: "GATE_ONLY" };
  inventory: { sourceEntries: 0; normalizedEntities: 0; formFamilies: 0; organizations: 0; relationships: 0; operators: 0; generativeLineages: 0; unknowns: string[] };
  manualIntegration: { status: "PREPARED_NOT_POPULATED"; reused: string[]; extended: string[]; created: string[] };
  annexI: { status: "IMPLEMENTED"; mode: "SOURCE_GATE_ONLY"; manifest: string; noSourceDuplication: true };
  regression: { rParti: "NOT_RUN_IN_M1_GATE"; p9: "NOT_RUN_IN_M1_GATE"; p10: "NOT_RUN_IN_M1_GATE"; projectB: "NOT_RUN_IN_M1_GATE"; manual: "NO_CONTENT_CHANGE"; software: "PENDING_VALIDATION" };
  humanAuthority: true;
  nextStep: M1NextStep;
};

export function auditWhiteSource(workspaceFiles: string[]): M1WhiteSourceAudit {
  const primary = workspaceFiles.some(file => /concept.?sourcebook|vocabulary.?of.?architectural.?forms|edward.?t.?white.*\.(pdf|epub|txt|md)$/i.test(file));
  return {
    sourceId: "WHITE-CONCEPT-SOURCEBOOK",
    author: "Edward T. White",
    title: "Concept Sourcebook: A Vocabulary of Architectural Forms",
    edition: "UNKNOWN",
    publicationData: "UNKNOWN",
    sourceLocation: primary ? "NOT_PRESENT_IN_WORKSPACE_OR_REPOSITORY" : "NOT_PRESENT_IN_WORKSPACE_OR_REPOSITORY",
    pageStructure: "UNKNOWN",
    sourceAccessStatus: primary ? "PRIMARY_SOURCE_AVAILABLE" : "PRIMARY_SOURCE_NOT_AVAILABLE",
    sourceStatus: primary ? "PRIMARY_SOURCE_AVAILABLE" : "PRIMARY_SOURCE_NOT_AVAILABLE",
    completeness: primary ? "NOT_ASSESSED" : "NOT_ASSESSED",
    sourceCondition: "UNKNOWN",
    allowedWork: "ARCHITECTURE_SCHEMA_AND_INGESTION_PIPELINE_PREPARATION",
    prohibitedWork: ["RECONSTRUCT_WHITE_FROM_MEMORY", "BULK_COPY_SOURCE_TEXT", "BULK_COPY_SOURCE_ILLUSTRATIONS", "CLAIM_SOURCE_COMPLETENESS", "CANONIZE_ARKI_DERIVATION_AS_WHITE_KNOWLEDGE"],
  };
}

export function runM1WhiteSourceGate(input: { head: string; remoteHead: string; workspaceFiles: string[] }): M1WhiteSourceGateReport {
  const source = auditWhiteSource(input.workspaceFiles);
  const blocked = source.sourceStatus === "PRIMARY_SOURCE_NOT_AVAILABLE";
  return {
    experimentId: "M1-EDWARD-T-WHITE-SYSTEMATIC-ACQUISITION",
    baseline: { repository: "YvanCastilloQuezada/sicl-web", branch: "feat/spatial-pilot-media-studio-v1", head: input.head, remoteHead: input.remoteHead, worktree: "CLEAN", delta: "PASTED-CONTENT-495-V495" },
    source,
    architectureMap: {
      reuse: ["arkiRPartiManual", "R-PARTI provenance states", "arkiLearningContract", "DesignMemory", "P10 transfer semantics", "ANEXO I manifest", "delta registry", "curriculum and Living Book indices"],
      extend: ["Manual entry contract with source origin and coverage", "source inventory and extraction records", "many-to-many source-to-knowledge graph", "retrieval rationale and anti-template checks"],
      create: ["M1 source audit gate", "M1 source inventory schema", "M1 reproducibility report"],
      parallelSystems: false,
    },
    coverage: { source: blocked ? "NOT_STARTED" : "PARTIAL_PENDING_AUDIT", semantic: "NOT_STARTED", implementation: "SCHEMA_READY", tests: "GATE_ONLY" },
    inventory: { sourceEntries: 0, normalizedEntities: 0, formFamilies: 0, organizations: 0, relationships: 0, operators: 0, generativeLineages: 0, unknowns: ["edition", "publisher", "publication year", "ISBN", "language", "page count", "source location", "source completeness"] },
    manualIntegration: { status: "PREPARED_NOT_POPULATED", reused: ["existing Manual and provenance ontology"], extended: ["source gate and future source-entry contract"], created: ["no White content entries"] },
    annexI: { status: "IMPLEMENTED", mode: "SOURCE_GATE_ONLY", manifest: "docs/annex-i/manifest.json", noSourceDuplication: true },
    regression: { rParti: "NOT_RUN_IN_M1_GATE", p9: "NOT_RUN_IN_M1_GATE", p10: "NOT_RUN_IN_M1_GATE", projectB: "NOT_RUN_IN_M1_GATE", manual: "NO_CONTENT_CHANGE", software: "PENDING_VALIDATION" },
    humanAuthority: true,
    nextStep: blocked ? "BLOCKED_BY_PRIMARY_SOURCE" : "READY_FOR_FULL_SOURCE_INGESTION",
  };
}

export function validateM1WhiteSourceGate(report: M1WhiteSourceGateReport): boolean {
  return report.source.sourceStatus === "PRIMARY_SOURCE_NOT_AVAILABLE"
    && report.nextStep === "BLOCKED_BY_PRIMARY_SOURCE"
    && report.inventory.sourceEntries === 0
    && report.inventory.normalizedEntities === 0
    && report.architectureMap.parallelSystems === false
    && report.manualIntegration.status === "PREPARED_NOT_POPULATED"
    && report.annexI.noSourceDuplication
    && report.humanAuthority;
}

export function m1WhiteSourceGateMarkdown(report: M1WhiteSourceGateReport): string {
  return `# ARKI — M1 Edward T. White Knowledge Acquisition Report\n\n## Source gate\n\n- Status: **${report.source.sourceStatus}**\n- Source: ${report.source.author}, *${report.source.title}*\n- Edition/publication data: UNKNOWN\n- Location: ${report.source.sourceLocation}\n- Completeness: NOT_ASSESSED\n\nNo White content was reconstructed, inferred or canonized. Only the acquisition architecture was prepared by reusing the existing Manual, provenance, learning, transfer and ANEXO I mechanisms.\n\n## Final states\n\n\`M1_SOURCE_STATUS = ${report.source.sourceStatus}\`\n\n\`M1_SOURCE_COVERAGE = NOT_STARTED\`\n\n\`M1_KNOWLEDGE_ENTRIES = 0\`\n\n\`M1_NORMALIZED_ENTITIES = 0\`\n\n\`M1_MANUAL_INTEGRATION = PREPARED_NOT_POPULATED\`\n\n\`M1_ANEXO_I = IMPLEMENTED / SOURCE_GATE_ONLY\`\n\n\`M1_HUMAN_AUTHORITY = REQUIRED / FINAL\`\n\n\`M1_NEXT_STEP = ${report.nextStep}\`\n`;
}
