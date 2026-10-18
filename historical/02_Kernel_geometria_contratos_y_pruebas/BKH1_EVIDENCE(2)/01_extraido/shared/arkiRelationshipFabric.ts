export type RelationshipFamily = "SPATIAL" | "GEOMETRIC" | "STRUCTURAL" | "MEP" | "FUNCTIONAL" | "PARAMETRIC" | "CAUSAL" | "DOCUMENTAL" | "EPISTEMIC";
export type RelationshipDirection = "DIRECTED" | "UNDIRECTED" | "BIDIRECTIONAL";
export type RelationshipOrigin = "CANONICAL" | "LEGACY_ADAPTER" | "DERIVED" | "IMPORTED" | "HUMAN_ASSERTED";
export type EpistemicStatus = "PROPOSED" | "OBSERVED" | "COMPUTED" | "VERIFIED" | "REJECTED" | "UNKNOWN";
export type RelationshipScale = "HUMAN" | "COMPONENT" | "OBJECT" | "ACTIVITY" | "SPACE" | "SYSTEM" | "BUILDING" | "SITE" | "BLOCK" | "NEIGHBORHOOD" | "DISTRICT" | "CITY" | "METROPOLITAN_PROVINCIAL" | "REGION" | "COUNTRY";
export type RelationshipDiscipline = "architecture" | "estructuras" | "sanitarias" | "electricas" | "mecanicas" | "comunicaciones" | "seguridad" | "coordination" | "cost" | "schedule" | "documentary" | "unknown";

export type RelationshipTypeDefinition = {
  typeId: string;
  family: RelationshipFamily;
  direction: RelationshipDirection;
  inverseType?: string;
  selfRelationAllowed: boolean;
  cyclePolicy: "ALLOW" | "REJECT" | "REQUIRE_EVIDENCE";
  allowedSourceScales: RelationshipScale[];
  allowedTargetScales: RelationshipScale[];
  allowedSourceDisciplines: RelationshipDiscipline[];
  allowedTargetDisciplines: RelationshipDiscipline[];
  minimumEvidence: "none" | "reference" | "reproducible" | "human_review";
  validationRules: string[];
  status: "ACTIVE" | "DEPRECATED";
  version: string;
};

export type RelationshipEvidence = { kind: "fixture" | "calculation" | "source" | "human_review" | "legacy"; reference: string; detail?: string };
export type RelationshipProvenance = { source: string; adapter?: string; transformations: string[] };

export type RelationshipRecord = {
  relationshipId: string;
  relationshipRevisionId: string;
  relationshipType: string;
  family: RelationshipFamily;
  sourceEntityId: string;
  targetEntityId: string;
  direction: RelationshipDirection;
  sourceScale: RelationshipScale;
  targetScale: RelationshipScale;
  applicabilityScale: RelationshipScale;
  sourceDiscipline: RelationshipDiscipline;
  targetDiscipline: RelationshipDiscipline;
  relationshipDiscipline?: RelationshipDiscipline;
  origin: RelationshipOrigin;
  evidence: RelationshipEvidence[];
  epistemicStatus: EpistemicStatus;
  projectVersion: string;
  validFrom?: string;
  validTo?: string;
  scenario?: string;
  provenance: RelationshipProvenance;
  legacyRefs?: string[];
  derivedFrom?: string[];
};

const allScales: RelationshipScale[] = ["HUMAN", "COMPONENT", "OBJECT", "ACTIVITY", "SPACE", "SYSTEM", "BUILDING", "SITE", "BLOCK", "NEIGHBORHOOD", "DISTRICT", "CITY", "METROPOLITAN_PROVINCIAL", "REGION", "COUNTRY"];
const allDisciplines: RelationshipDiscipline[] = ["architecture", "estructuras", "sanitarias", "electricas", "mecanicas", "comunicaciones", "seguridad", "coordination", "cost", "schedule", "documentary", "unknown"];
const definition = (input: Omit<RelationshipTypeDefinition, "allowedSourceScales" | "allowedTargetScales" | "allowedSourceDisciplines" | "allowedTargetDisciplines" | "status" | "version"> & Partial<Pick<RelationshipTypeDefinition, "allowedSourceScales" | "allowedTargetScales" | "allowedSourceDisciplines" | "allowedTargetDisciplines" | "status" | "version">>): RelationshipTypeDefinition => ({ allowedSourceScales: allScales, allowedTargetScales: allScales, allowedSourceDisciplines: allDisciplines, allowedTargetDisciplines: allDisciplines, status: "ACTIVE", version: "1.0", ...input });

export const RelationshipTypeRegistry: Readonly<Record<string, RelationshipTypeDefinition>> = Object.freeze({
  HOSTS: definition({ typeId: "HOSTS", family: "SPATIAL", direction: "DIRECTED", inverseType: "HOSTED_BY", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reference", validationRules: ["source hosts target"] }),
  HOSTED_BY: definition({ typeId: "HOSTED_BY", family: "SPATIAL", direction: "DIRECTED", inverseType: "HOSTS", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reference", validationRules: ["target hosts source"] }),
  BOUNDS: definition({ typeId: "BOUNDS", family: "SPATIAL", direction: "DIRECTED", inverseType: "BOUNDED_BY", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reference", validationRules: ["boundary contains entity"] }),
  BOUNDED_BY: definition({ typeId: "BOUNDED_BY", family: "SPATIAL", direction: "DIRECTED", inverseType: "BOUNDS", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reference", validationRules: ["entity has boundary"] }),
  SUPPORTS: definition({ typeId: "SUPPORTS", family: "STRUCTURAL", direction: "DIRECTED", inverseType: "RESTS_ON", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reproducible", validationRules: ["support relation is directed"] }),
  RESTS_ON: definition({ typeId: "RESTS_ON", family: "STRUCTURAL", direction: "DIRECTED", inverseType: "SUPPORTS", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reproducible", validationRules: ["rest relation is directed"] }),
  OPENS_TO: definition({ typeId: "OPENS_TO", family: "GEOMETRIC", direction: "DIRECTED", inverseType: "OPENED_BY", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reference", validationRules: ["opening belongs to host"] }),
  OPENED_BY: definition({ typeId: "OPENED_BY", family: "GEOMETRIC", direction: "DIRECTED", inverseType: "OPENS_TO", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reference", validationRules: ["host has opening"] }),
  CONNECTS_TO: definition({ typeId: "CONNECTS_TO", family: "MEP", direction: "BIDIRECTIONAL", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reference", validationRules: ["connectors are compatible"] }),
  PRECEDES: definition({ typeId: "PRECEDES", family: "FUNCTIONAL", direction: "DIRECTED", inverseType: "FOLLOWS", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reproducible", validationRules: ["schedule precedence is acyclic"] }),
  FOLLOWS: definition({ typeId: "FOLLOWS", family: "FUNCTIONAL", direction: "DIRECTED", inverseType: "PRECEDES", selfRelationAllowed: false, cyclePolicy: "REJECT", minimumEvidence: "reproducible", validationRules: ["schedule precedence is acyclic"] }),
  APPLIES_TO: definition({ typeId: "APPLIES_TO", family: "DOCUMENTAL", direction: "DIRECTED", selfRelationAllowed: false, cyclePolicy: "ALLOW", minimumEvidence: "reference", validationRules: ["document references entity"] }),
  IMPACTS: definition({ typeId: "IMPACTS", family: "CAUSAL", direction: "DIRECTED", selfRelationAllowed: false, cyclePolicy: "REQUIRE_EVIDENCE", minimumEvidence: "human_review", validationRules: ["causal evidence is explicit"] }),
  DERIVED_FROM: definition({ typeId: "DERIVED_FROM", family: "EPISTEMIC", direction: "DIRECTED", selfRelationAllowed: false, cyclePolicy: "ALLOW", minimumEvidence: "reference", validationRules: ["provenance is preserved"] }),
});

const hash = (input: string): string => { let value = 2166136261; for (let index = 0; index < input.length; index += 1) { value ^= input.charCodeAt(index); value = Math.imul(value, 16777619); } return (value >>> 0).toString(16).padStart(8, "0"); };
const semanticKey = (input: Pick<RelationshipRecord, "relationshipType" | "sourceEntityId" | "targetEntityId" | "direction" | "sourceScale" | "targetScale" | "applicabilityScale" | "sourceDiscipline" | "targetDiscipline" | "relationshipDiscipline">): string => [input.relationshipType, input.sourceEntityId, input.targetEntityId, input.direction, input.sourceScale, input.targetScale, input.applicabilityScale, input.sourceDiscipline, input.targetDiscipline, input.relationshipDiscipline ?? ""].join("|");

export const stableRelationshipId = (input: Pick<RelationshipRecord, "relationshipType" | "sourceEntityId" | "targetEntityId" | "direction" | "sourceScale" | "targetScale" | "applicabilityScale" | "sourceDiscipline" | "targetDiscipline" | "relationshipDiscipline">): string => `rel:${hash(semanticKey(input))}`;
export const relationshipRevisionId = (relationshipId: string, projectVersion: string): string => `rev:${hash(`${relationshipId}|${projectVersion}`)}`;

export type RelationshipInput = Omit<RelationshipRecord, "relationshipId" | "relationshipRevisionId" | "family"> & { relationshipId?: string; relationshipRevisionId?: string };

export function createRelationship(input: RelationshipInput): RelationshipRecord {
  const type = RelationshipTypeRegistry[input.relationshipType];
  if (!type) throw new Error(`Unknown relationship type: ${input.relationshipType}`);
  const relationshipId = input.relationshipId ?? stableRelationshipId(input);
  const record: RelationshipRecord = { ...input, relationshipId, relationshipRevisionId: input.relationshipRevisionId ?? relationshipRevisionId(relationshipId, input.projectVersion), family: type.family };
  validateRelationship(record);
  return record;
}

export function validateRelationship(record: RelationshipRecord): void {
  const type = RelationshipTypeRegistry[record.relationshipType];
  if (!type) throw new Error(`Relationship type is not registered: ${record.relationshipType}`);
  if (!record.sourceEntityId || !record.targetEntityId) throw new Error("Relationship entities are required");
  if (!type.selfRelationAllowed && record.sourceEntityId === record.targetEntityId) throw new Error("Self relationship is not allowed");
  if (!type.allowedSourceScales.includes(record.sourceScale) || !type.allowedTargetScales.includes(record.targetScale)) throw new Error("Relationship scale is not allowed by registry");
  if (!type.allowedSourceDisciplines.includes(record.sourceDiscipline) || !type.allowedTargetDisciplines.includes(record.targetDiscipline)) throw new Error("Relationship discipline is not allowed by registry");
  if (record.relationshipType === "IMPACTS" && record.epistemicStatus !== "VERIFIED" && record.epistemicStatus !== "PROPOSED") throw new Error("Causal impact requires explicit epistemic status");
  if (!record.provenance.source || record.provenance.transformations.some((item) => !item)) throw new Error("Relationship provenance is incomplete");
  if (record.epistemicStatus === "VERIFIED" && record.evidence.length === 0) throw new Error("Verified relationship requires evidence");
}

export function inverseRelationship(record: RelationshipRecord): RelationshipRecord | undefined {
  const inverseType = RelationshipTypeRegistry[record.relationshipType]?.inverseType;
  if (!inverseType) return undefined;
  return createRelationship({ ...record, relationshipType: inverseType, sourceEntityId: record.targetEntityId, targetEntityId: record.sourceEntityId, relationshipId: undefined, relationshipRevisionId: undefined, legacyRefs: record.legacyRefs ? [...record.legacyRefs, record.relationshipId] : [record.relationshipId], provenance: { ...record.provenance, transformations: [...record.provenance.transformations, "inverse"] } });
}

export class RelationshipFabric {
  private readonly records = new Map<string, RelationshipRecord>();
  add(record: RelationshipRecord): RelationshipRecord { validateRelationship(record); const existing = this.records.get(record.relationshipId); if (existing) { if (semanticKey(existing) !== semanticKey(record)) throw new Error(`Relationship identity collision: ${record.relationshipId}`); return existing; } this.records.set(record.relationshipId, record); return record; }
  addMany(records: RelationshipRecord[]): RelationshipRecord[] { return records.map((record) => this.add(record)); }
  get(relationshipId: string): RelationshipRecord | undefined { return this.records.get(relationshipId); }
  all(): RelationshipRecord[] { return Array.from(this.records.values()).sort((left, right) => left.relationshipId.localeCompare(right.relationshipId)); }
  byEntity(entityId: string): RelationshipRecord[] { return this.all().filter((record) => record.sourceEntityId === entityId || record.targetEntityId === entityId); }
  inverseOf(relationshipId: string): RelationshipRecord | undefined { const record = this.get(relationshipId); return record ? inverseRelationship(record) : undefined; }
  toJSON(): RelationshipRecord[] { return this.all(); }
  static fromJSON(records: RelationshipRecord[]): RelationshipFabric { const fabric = new RelationshipFabric(); fabric.addMany(records); return fabric; }
}
