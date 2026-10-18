import type { ConstructionModel, ConstructionSpace, Muro, ScheduleTask } from "./arkiConstructionOntology";
import type { ElementRelation, StructuralElement } from "./arkiConstructionElements";
import { createRelationship, type RelationshipDiscipline, type RelationshipRecord, type RelationshipScale } from "./arkiRelationshipFabric";

const relationType = (value: ElementRelation["relation"]): string => ({ supports: "SUPPORTS", rests_on: "RESTS_ON", hosts: "HOSTS", bounds: "BOUNDS", opens_to: "OPENS_TO", coordinates_with: "CONNECTS_TO" })[value];
const scaleForKind = (kind: StructuralElement["kind"]): RelationshipScale => kind === "stair" || kind === "floor" ? "SPACE" : "OBJECT";
const discipline = (value: string | undefined): RelationshipDiscipline => ["architecture", "estructuras", "sanitarias", "electricas", "mecanicas", "comunicaciones", "seguridad"].includes(value ?? "") ? value as RelationshipDiscipline : "unknown";
const versionFor = (model: ConstructionModel): string => `construction:${model.schema}:${model.generatedAt}`;

type EntityInfo = { scale: RelationshipScale; discipline: RelationshipDiscipline };

function indexEntities(model: ConstructionModel): Map<string, EntityInfo> {
  const index = new Map<string, EntityInfo>();
  for (const wall of model.walls) index.set(wall.id, { scale: "OBJECT", discipline: discipline(wall.especialidad_principal) });
  const structural: StructuralElement[] = [...model.foundations, ...model.columns, ...model.beams, ...model.slabs, ...model.doors, ...model.windows, ...model.stairs, ...model.floors, ...model.roofs, ...model.partitions];
  for (const element of structural) index.set(element.id, { scale: scaleForKind(element.kind), discipline: discipline(element.specialty) });
  for (const space of model.spaces) index.set(space.id, { scale: "SPACE", discipline: "architecture" });
  for (const task of model.schedule) index.set(task.id, { scale: "ACTIVITY", discipline: "schedule" });
  return index;
}

function infoFor(index: Map<string, EntityInfo>, id: string): EntityInfo {
  return index.get(id) ?? { scale: "OBJECT", discipline: "unknown" };
}

function recordFor(model: ConstructionModel, input: { type: string; sourceId: string; targetId: string; description: string; source?: EntityInfo; target?: EntityInfo; origin?: RelationshipRecord["origin"]; legacyRefs?: string[]; evidenceKind?: "fixture" | "calculation" | "source" | "human_review" | "legacy" }): RelationshipRecord {
  const index = indexEntities(model);
  const source = input.source ?? infoFor(index, input.sourceId);
  const target = input.target ?? infoFor(index, input.targetId);
  return createRelationship({ relationshipType: input.type, sourceEntityId: input.sourceId, targetEntityId: input.targetId, direction: "DIRECTED", sourceScale: source.scale, targetScale: target.scale, applicabilityScale: "BUILDING", sourceDiscipline: source.discipline, targetDiscipline: target.discipline, relationshipDiscipline: source.discipline === target.discipline ? source.discipline : "coordination", origin: input.origin ?? "LEGACY_ADAPTER", evidence: [{ kind: input.evidenceKind ?? "legacy", reference: input.legacyRefs?.[0] ?? input.description, detail: input.description }], epistemicStatus: "OBSERVED", projectVersion: versionFor(model), provenance: { source: "ConstructionModel", adapter: "arkiRelationshipAdapters", transformations: ["legacy-to-fabric"] }, legacyRefs: input.legacyRefs });
}

export function adaptElementRelation(model: ConstructionModel, relation: ElementRelation): RelationshipRecord {
  return recordFor(model, { type: relationType(relation.relation), sourceId: relation.fromId, targetId: relation.toId, description: relation.description, legacyRefs: [relation.id], evidenceKind: relation.verified ? "source" : "calculation" });
}

export function adaptTrace(model: ConstructionModel, sourceId: string, targetId: string): RelationshipRecord {
  return recordFor(model, { type: "DERIVED_FROM", sourceId, targetId, description: `Legacy tracesTo ${sourceId} → ${targetId}`, legacyRefs: [`tracesTo:${sourceId}:${targetId}`], origin: "DERIVED", evidenceKind: "calculation" });
}

export function adaptSpaceBoundary(model: ConstructionModel, space: ConstructionSpace, wallId: string): RelationshipRecord {
  return recordFor(model, { type: "BOUNDED_BY", sourceId: space.id, targetId: wallId, description: `Space ${space.id} bounded by wall ${wallId}`, legacyRefs: [`space.wallIds:${space.id}:${wallId}`] });
}

export function adaptScheduleLink(model: ConstructionModel, task: ScheduleTask, elementId: string): RelationshipRecord {
  return recordFor(model, { type: "APPLIES_TO", sourceId: task.id, targetId: elementId, description: `Schedule ${task.id} applies to ${elementId}`, source: { scale: "ACTIVITY", discipline: "schedule" }, legacyRefs: [`schedule.elementIds:${task.id}:${elementId}`] });
}

export function adaptConstructionModelRelationships(model: ConstructionModel): RelationshipRecord[] {
  const records: RelationshipRecord[] = [];
  for (const relation of model.relations) records.push(adaptElementRelation(model, relation));
  const structural: StructuralElement[] = [...model.foundations, ...model.columns, ...model.beams, ...model.slabs, ...model.doors, ...model.windows, ...model.stairs, ...model.floors, ...model.roofs, ...model.partitions];
  for (const element of structural) for (const targetId of element.tracesTo) records.push(adaptTrace(model, element.id, targetId));
  for (const space of model.spaces) for (const wallId of space.wallIds) records.push(adaptSpaceBoundary(model, space, wallId));
  for (const task of model.schedule) for (const elementId of task.elementIds) records.push(adaptScheduleLink(model, task, elementId));
  const unique = new Map<string, RelationshipRecord>();
  for (const record of records) unique.set(record.relationshipId, record);
  return Array.from(unique.values()).sort((left, right) => left.relationshipId.localeCompare(right.relationshipId));
}

export function migrateLegacyRelations(model: ConstructionModel): { relationships: RelationshipRecord[]; unknownLegacyTypes: string[] } {
  const relationships = adaptConstructionModelRelationships(model);
  return { relationships, unknownLegacyTypes: [] };
}
