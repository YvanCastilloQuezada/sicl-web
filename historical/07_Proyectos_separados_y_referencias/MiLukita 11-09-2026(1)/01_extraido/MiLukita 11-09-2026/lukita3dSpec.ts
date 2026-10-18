export const LUKITA_3D_APPROVED_VERSION = "LUKITA-A+B+C-2D-APPROVED-01" as const;

export const LUKITA_3D_POSES = ["neutral", "welcome", "present", "celebrate", "contingency"] as const;
export const LUKITA_3D_EXPRESSIONS = ["neutral", "smile", "focus", "celebrate", "contingency"] as const;
export const SUPPORTED_3D_EXTENSIONS = [".glb", ".gltf"] as const;
export const LUKITA_3D_ANNOTATION_CATEGORIES = ["Silueta", "Rostro", "Cabello", "Vestuario", "Proporción", "Accesorio"] as const;
export type LukitaAnnotationCategory = typeof LUKITA_3D_ANNOTATION_CATEGORIES[number];
export type LukitaAnnotation = { id: number; x: number; y: number; category: LukitaAnnotationCategory; note: string };

export const LUKITA_3D_CANDIDATE_ID = "LUKITA-3D-CANDIDATE-01" as const;
export const LUKITA_3D_REVIEW_STATUSES = ["PENDING HUMAN APPROVAL", "APPROVED · TECHNICAL BLOCKOUT ONLY", "REJECTED · CORRECTION REQUIRED"] as const;
export type Lukita3DReviewStatus = typeof LUKITA_3D_REVIEW_STATUSES[number];
export type Lukita3DReviewDecision = { status: Lukita3DReviewStatus; changedAt: string; note?: string };
export type Lukita3DAssetGate = Partial<Record<"license" | "provenance" | "identity" | "technical", boolean>>;
export type Lukita3DChecklistStatus = "approved" | "pending";
export function isRejected3DAsset(name: string) {
  return /elasticgirl|mrs[._ -]?incredible|incredible|superhero/.test(name.toLowerCase());
}
export function getCandidateChecklistStatus(name: string, gate: Lukita3DAssetGate): Lukita3DChecklistStatus {
  return !isRejected3DAsset(name) && isCandidateReadyForHumanReview(gate) ? "approved" : "pending";
}
export function isCandidateReadyForHumanReview(gate: Lukita3DAssetGate, isRejected = false) {
  return !isRejected && ["license", "provenance", "identity", "technical"].every((key) => gate[key as keyof Lukita3DAssetGate] === true);
}

export function clampCameraZoom(value: number) {
  return Math.min(1.8, Math.max(0.65, Number.isFinite(value) ? value : 1));
}

export function clampCameraAzimuth(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function clampCameraElevation(value: number) {
  return Math.min(1.35, Math.max(-0.7, Number.isFinite(value) ? value : 0.02));
}

export function clampCameraPan(value: number) {
  return Math.min(1.25, Math.max(-1.25, Number.isFinite(value) ? value : 0));
}

export function parseAnnotationSession(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const candidate = input as { schema?: unknown; annotations?: unknown };
  if (candidate.schema !== "milukita-review-annotations.v1" || !Array.isArray(candidate.annotations)) return null;
  const annotations = candidate.annotations.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const value = item as Partial<LukitaAnnotation>;
    if (!Number.isFinite(value.id) || typeof value.note !== "string" || !LUKITA_3D_ANNOTATION_CATEGORIES.includes(value.category as LukitaAnnotationCategory)) return [];
    return [{ id: Math.trunc(value.id as number), x: clampAnnotationCoordinate(Number(value.x)), y: clampAnnotationCoordinate(Number(value.y)), category: value.category as LukitaAnnotationCategory, note: value.note.slice(0, 240) }];
  }).slice(0, 100);
  return { annotations };
}

export function clampAnnotationCoordinate(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function isSupported3DFileName(name: string) {
  const normalized = name.toLowerCase();
  return SUPPORTED_3D_EXTENSIONS.some((extension) => normalized.endsWith(extension));
}

export function isSupported3DModelUrl(value: string) {
  try {
    const url = new URL(value.trim());
    const pathname = url.pathname.toLowerCase();
    return url.protocol === "https:" && SUPPORTED_3D_EXTENSIONS.some((extension) => pathname.endsWith(extension));
  } catch {
    return false;
  }
}

export function get3DVersionLabel(name: string) {
  return name.trim().slice(0, 80) || "Versión sin nombre";
}
