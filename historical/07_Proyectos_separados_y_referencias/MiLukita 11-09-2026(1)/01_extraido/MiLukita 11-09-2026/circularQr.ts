export const CIRCULAR_QR_VARIANTS = ["central", "circle", "integrated"] as const;
export type CircularQrVariant = (typeof CIRCULAR_QR_VARIANTS)[number];

export type CircularQrMatrix = ReadonlyArray<ReadonlyArray<boolean>>;

export type CircularQrSource = {
  imageDataUrl: string | null;
  matrix?: CircularQrMatrix | null;
  payload: Record<string, string> | null;
  targetUrl: string | null;
  verifyUrl: string | null;
  expiresAt: string | null;
  signed: boolean;
  available: boolean;
};

export function normalizeCircularQrVariant(value: string | null | undefined): CircularQrVariant {
  return value === "central" || value === "integrated" ? value : "circle";
}

/** Presentation-only projection: no QR payload field is created or changed. */
export function getCircularQrPresentation(source: CircularQrSource, variant: CircularQrVariant) {
  return {
    variant,
    imageDataUrl: source.imageDataUrl,
    matrix: source.matrix ?? null,
    payload: source.payload,
    targetUrl: source.targetUrl,
    verifyUrl: source.verifyUrl,
    expiresAt: source.expiresAt,
    signed: source.signed,
    available: source.available,
  };
}
