import {
  ArkiSemanticId, ExternalSemanticMapping, SemanticConcept, SemanticScale
} from "./types";

function norm(v: string): string {
  return v.trim().toLocaleLowerCase("en-US").replace(/[\s_\-./]+/g, "");
}

export class SemanticRegistry {
  private readonly concepts = new Map<ArkiSemanticId, SemanticConcept>();
  private readonly names = new Map<string, ArkiSemanticId>();
  private readonly external = new Map<string, ArkiSemanticId>();

  constructor(seed: SemanticConcept[] = []) {
    for (const concept of seed) this.registerSeed(concept);
  }

  private mappingKey(m: ExternalSemanticMapping): string {
    return `${m.standard}|${m.version ?? "*"}|${norm(m.externalId)}`;
  }

  private registerSeed(concept: SemanticConcept): void {
    if (this.concepts.has(concept.id)) throw new Error(`DUPLICATE_SEMANTIC_ID:${concept.id}`);
    const names = [concept.canonicalName, ...(concept.aliases ?? [])].map(norm);
    for (const name of names) {
      const owner = this.names.get(name);
      if (owner && owner !== concept.id) throw new Error(`DUPLICATE_SEMANTIC_NAME:${name}`);
    }
    this.concepts.set(concept.id, structuredClone(concept));
    for (const name of names) this.names.set(name, concept.id);
    for (const m of concept.mappings) {
      const key = this.mappingKey(m);
      const owner = this.external.get(key);
      if (owner && owner !== concept.id && m.kind === "EXACT") {
        throw new Error(`DUPLICATE_EXACT_EXTERNAL_MAPPING:${key}`);
      }
      if (m.kind === "EXACT") this.external.set(key, concept.id);
    }
  }

  get(id: ArkiSemanticId): SemanticConcept | undefined {
    const value = this.concepts.get(id);
    return value ? structuredClone(value) : undefined;
  }

  findByName(name: string): SemanticConcept | undefined {
    const id = this.names.get(norm(name));
    return id ? this.get(id) : undefined;
  }

  findByExternal(
    standard: ExternalSemanticMapping["standard"],
    externalId: string,
    version?: string
  ): SemanticConcept | undefined {
    const exact = this.external.get(`${standard}|${version ?? "*"}|${norm(externalId)}`);
    const wildcard = this.external.get(`${standard}|*|${norm(externalId)}`);
    return exact ? this.get(exact) : wildcard ? this.get(wildcard) : undefined;
  }

  listByScale(scale: SemanticScale): SemanticConcept[] {
    return [...this.concepts.values()]
      .filter(c => c.scales.includes(scale))
      .map(c => structuredClone(c));
  }

  list(): SemanticConcept[] {
    return [...this.concepts.values()].map(c => structuredClone(c));
  }

  // Deliberately package-private style API: only governed commit integration should call this.
  _applyApprovedConcept(concept: SemanticConcept): void {
    this.registerSeed(concept);
  }
}
