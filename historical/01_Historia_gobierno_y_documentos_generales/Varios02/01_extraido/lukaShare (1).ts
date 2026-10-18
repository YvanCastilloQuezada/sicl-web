export const SHARE_TARGET_TYPES = [
  "PUBLIC_LUKA",
  "EXPERIENCE",
  "CONTROLLER",
  "LANDING",
  "CONTENT",
] as const;

export type ShareTargetType = (typeof SHARE_TARGET_TYPES)[number];

export const SHARE_CAPABILITIES = [
  "PUBLIC_EXPERIENCE",
  "TERRITORIAL_RUNTIME",
  "CONTROLLER_LAB",
  "AUDIT_VIEW",
  "AR_VIEW",
] as const;

export type ShareCapability = (typeof SHARE_CAPABILITIES)[number];

export const SHARE_STATUSES = ["ACTIVE", "REVOKED", "EXPIRED"] as const;
export type ShareStatus = (typeof SHARE_STATUSES)[number];

export type ShareDefinitionInput = {
  targetType: ShareTargetType;
  destinationPath: string;
  metadata?: Record<string, unknown>;
  capability: ShareCapability;
  priority?: number;
  expiresAt?: Date | null;
};

export type ShareTargetView = {
  publicId: string;
  targetType: ShareTargetType;
  destinationPath: string;
  metadata: Record<string, unknown>;
  capability: ShareCapability;
  priority: number;
  expiresAt: string | null;
  status: ShareStatus;
  session: boolean;
  coreAccess: "NONE";
};

export const SHARE_MIN_TTL_SECONDS = 60;
export const SHARE_MAX_TTL_SECONDS = 3_600;

const CORE_MARKERS = [
  "mjp",
  "rng",
  "wallet",
  "ledger",
  "settlement",
  "rtp",
  "rules",
  "protected-core",
];

export function assertSafeSharePath(path: string) {
  const normalized = path.trim();
  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    throw new Error("El destino ShareTarget debe ser una ruta interna absoluta.");
  }
  if (normalized.includes("..") || normalized.includes("\\")) {
    throw new Error("El destino ShareTarget contiene una secuencia no permitida.");
  }
  if (normalized.startsWith("/api/")) {
    throw new Error("Un ShareTarget no puede apuntar directamente a una API.");
  }
  const lower = normalized.toLowerCase();
  if (CORE_MARKERS.some(marker => lower.includes(marker))) {
    throw new Error("El destino ShareTarget intenta acceder a una capacidad protegida.");
  }
  return normalized;
}

export function assertSafeCapability(capability: ShareCapability) {
  if (!SHARE_CAPABILITIES.includes(capability)) {
    throw new Error("Capability ShareTarget no reconocida.");
  }
  return capability;
}

export function normalizeShareDefinition(input: ShareDefinitionInput) {
  const destinationPath = assertSafeSharePath(input.destinationPath);
  const capability = assertSafeCapability(input.capability);
  const priority = Math.min(1000, Math.max(0, Math.trunc(input.priority ?? 50)));
  const metadata = input.metadata ?? {};
  const serialized = JSON.stringify(metadata);
  if (serialized.length > 12_000) {
    throw new Error("Los metadatos ShareTarget superan el límite permitido.");
  }
  if (input.expiresAt && input.expiresAt.getTime() <= Date.now()) {
    throw new Error("La expiración ShareTarget debe estar en el futuro.");
  }
  return {
    ...input,
    destinationPath,
    capability,
    priority,
    metadata,
  };
}

export function clampShareTtl(seconds: number) {
  if (!Number.isFinite(seconds)) return SHARE_MIN_TTL_SECONDS;
  return Math.min(
    SHARE_MAX_TTL_SECONDS,
    Math.max(SHARE_MIN_TTL_SECONDS, Math.trunc(seconds))
  );
}
