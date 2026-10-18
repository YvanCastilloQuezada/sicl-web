import { ArkiObjectIdentity, ExternalIdentity } from "./types";

export class SemanticIdentityIndex {
  private readonly byArki = new Map<string, ArkiObjectIdentity>();
  private readonly byExternal = new Map<string, string>();

  private key(x: ExternalIdentity): string {
    return `${x.system}|${x.version ?? "*"}|${x.externalId}`;
  }

  add(identity: ArkiObjectIdentity): void {
    if (this.byArki.has(identity.arkiEntityId)) {
      throw new Error(`DUPLICATE_ARKI_ENTITY_ID:${identity.arkiEntityId}`);
    }
    for (const ext of identity.externalIdentities) {
      const key = this.key(ext);
      const owner = this.byExternal.get(key);
      if (owner && owner !== identity.arkiEntityId) {
        throw new Error(`EXTERNAL_IDENTITY_COLLISION:${key}`);
      }
    }
    this.byArki.set(identity.arkiEntityId, structuredClone(identity));
    for (const ext of identity.externalIdentities) {
      this.byExternal.set(this.key(ext), identity.arkiEntityId);
    }
  }

  get(arkiEntityId: string): ArkiObjectIdentity | undefined {
    const x = this.byArki.get(arkiEntityId);
    return x ? structuredClone(x) : undefined;
  }

  resolveExternal(external: ExternalIdentity): ArkiObjectIdentity | undefined {
    const id = this.byExternal.get(this.key(external));
    return id ? this.get(id) : undefined;
  }
}
