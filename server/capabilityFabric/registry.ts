import type {
  CapabilityOperation,
  CapabilityProviderDescriptor,
  CapabilitySelectionFailure,
} from "./types";

export type CapabilitySelectionResult =
  | { ok: true; provider: CapabilityProviderDescriptor }
  | { ok: false; code: CapabilitySelectionFailure };

function validToken(value: string): boolean {
  return value.trim().length > 0 && value === value.trim();
}

export function validateProviderDescriptor(
  provider: CapabilityProviderDescriptor,
): CapabilitySelectionFailure | null {
  if (!validToken(provider.providerId)) return "PROVIDER_DESCRIPTOR_INVALID";
  if (!Number.isSafeInteger(provider.priority)) return "PROVIDER_DESCRIPTOR_INVALID";
  if (provider.authority !== "NON_CANONICAL_PROVIDER") return "PROVIDER_DESCRIPTOR_INVALID";
  if (provider.capabilities.length === 0 || provider.operations.length === 0) {
    return "PROVIDER_DESCRIPTOR_INVALID";
  }
  if (new Set(provider.capabilities).size !== provider.capabilities.length) {
    return "PROVIDER_DESCRIPTOR_INVALID";
  }
  if (new Set(provider.operations).size !== provider.operations.length) {
    return "PROVIDER_DESCRIPTOR_INVALID";
  }
  if (provider.capabilities.some(capability => !validToken(capability))) {
    return "PROVIDER_DESCRIPTOR_INVALID";
  }
  return null;
}

export function resolveCapabilityProviders(
  providers: readonly CapabilityProviderDescriptor[],
  capability: string,
  operation: CapabilityOperation,
): { ok: true; providers: readonly CapabilityProviderDescriptor[] } | { ok: false; code: CapabilitySelectionFailure } {
  if (!validToken(capability)) return { ok: false, code: "CAPABILITY_INVALID" };

  for (const provider of providers) {
    const failure = validateProviderDescriptor(provider);
    if (failure) return { ok: false, code: failure };
  }

  const capable = providers.filter(
    provider => provider.enabled && provider.capabilities.includes(capability),
  );
  if (capable.length === 0) return { ok: false, code: "NO_PROVIDER" };

  const operable = capable
    .filter(provider => provider.operations.includes(operation))
    .sort((a, b) => a.providerId.localeCompare(b.providerId));
  if (operable.length === 0) return { ok: false, code: "OPERATION_UNSUPPORTED" };

  return { ok: true, providers: Object.freeze(operable) };
}

export function selectCapabilityProvider(
  providers: readonly CapabilityProviderDescriptor[],
  capability: string,
  operation: CapabilityOperation,
  selectedProviderId?: string,
): CapabilitySelectionResult {
  const resolved = resolveCapabilityProviders(providers, capability, operation);
  if (!resolved.ok) return resolved;

  if (selectedProviderId) {
    const selected = resolved.providers.find(provider => provider.providerId === selectedProviderId);
    return selected
      ? { ok: true, provider: selected }
      : { ok: false, code: "SELECTED_PROVIDER_UNAVAILABLE" };
  }

  if (resolved.providers.length !== 1) {
    return { ok: false, code: "PROVIDER_SELECTION_REQUIRED" };
  }

  return { ok: true, provider: resolved.providers[0] };
}
