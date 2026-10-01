import type { CapabilityProvider } from "./compasAdapter";
import { selectCapabilityProvider } from "./registry";
import type {
  CapabilityRequest,
  CapabilityResult,
  CapabilitySelectionFailure,
} from "./types";

export type CapabilityExecutionResult<TOutput = unknown> =
  | { ok: true; result: CapabilityResult<TOutput> }
  | { ok: false; code: CapabilitySelectionFailure | "PROVIDER_EXECUTION_FAILED"; diagnostic?: string };

export class CapabilityRouter {
  readonly #providers: readonly CapabilityProvider[];

  constructor(providers: readonly CapabilityProvider[]) {
    const ids = providers.map(provider => provider.descriptor.providerId);
    if (new Set(ids).size !== ids.length) {
      throw new Error("DUPLICATE_PROVIDER_ID");
    }
    this.#providers = Object.freeze([...providers]);
  }

  descriptors() {
    return Object.freeze(this.#providers.map(provider => provider.descriptor));
  }

  async execute<TInput, TOutput>(
    request: CapabilityRequest<TInput>,
  ): Promise<CapabilityExecutionResult<TOutput>> {
    const selection = selectCapabilityProvider(
      this.#providers.map(provider => provider.descriptor),
      request.capability,
      request.operation,
      request.selectedProviderId,
    );
    if (!selection.ok) return selection;

    const provider = this.#providers.find(
      candidate => candidate.descriptor.providerId === selection.provider.providerId,
    );
    if (!provider) {
      return { ok: false, code: "PROVIDER_EXECUTION_FAILED", diagnostic: "SELECTED_PROVIDER_MISSING" };
    }

    try {
      const result = await provider.execute(request) as CapabilityResult<TOutput>;
      if (
        result.providerId !== provider.descriptor.providerId ||
        result.requestId !== request.requestId ||
        result.capability !== request.capability ||
        result.operation !== request.operation ||
        result.canonicalMutation !== false
      ) {
        return {
          ok: false,
          code: "PROVIDER_EXECUTION_FAILED",
          diagnostic: "PROVIDER_RESULT_CONTRACT_VIOLATION",
        };
      }
      return { ok: true, result };
    } catch (error) {
      return {
        ok: false,
        code: "PROVIDER_EXECUTION_FAILED",
        diagnostic: error instanceof Error ? error.message : "UNKNOWN_PROVIDER_ERROR",
      };
    }
  }
}
