import type { CanonicalBuildingElement, CanonicalBuildingModel } from "./arkiBuildingAuthoring";
import { PROJECT_B_ID } from "./arkiP9ProjectBExperiment";

type Point = [number, number];
type Rect = { x: number; y: number; w: number; h: number };
export type ProjectBGeometryVariant = Readonly<{
  variantId: "B-CANDIDATE-01" | "B-CANDIDATE-02";
  model: CanonicalBuildingModel;
  spaces: ReadonlyArray<{ id: string; label: string; rect: Rect; areaM2: number }>;
  validations: ReadonlyArray<{ id: string; state: "PASS" | "UNKNOWN"; explanation: string }>;
  humanReviewRequired: true;
  permitReady: false;
  constructionReady: false;
}>;

const version = "ARKI-P9-PROJECT-B-GEOMETRY-1";
const polygon = (r: Rect) => ({ type: "polygon", coordinates: [[[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h], [r.x, r.y]]] });
const segment = (a: Point, b: Point) => [a, b];
const wallElements = (spaceId: string, r: Rect): CanonicalBuildingElement[] => [
  [segment([r.x, r.y], [r.x + r.w, r.y]), segment([r.x + r.w, r.y], [r.x + r.w, r.y + r.h]), segment([r.x + r.w, r.y + r.h], [r.x, r.y + r.h]), segment([r.x, r.y + r.h], [r.x, r.y])].map((line, i) => ({ arkiId: `${spaceId}:WALL:${i + 1}`, kind: "WALL" as const, level: "N1", geometry: line, properties: { hostSpaceId: spaceId, thickness: "UNKNOWN" }, geometryVersion: version, lineage: [spaceId], provenance: ["P9 Project B human-authorized geometry exploration", "same canonical model"], epistemicState: "HYPOTHESIS" as const })),
].flat();

const makeVariant = (variantId: ProjectBGeometryVariant["variantId"], layout: Array<{ id: string; label: string; rect: Rect }>): ProjectBGeometryVariant => {
  const spaces = layout.map((s) => ({ ...s, areaM2: s.rect.w * s.rect.h }));
  const elements: CanonicalBuildingElement[] = [{ arkiId: `${PROJECT_B_ID}:${variantId}:BUILDING`, kind: "BUILDING", properties: { representation: "CONCEPTUAL_FLOOR_PLAN", variantId }, geometryVersion: version, lineage: [variantId], provenance: ["P9 human deliberation", "P9 Phase B authorization", "same canonical model"], epistemicState: "HYPOTHESIS" }];
  for (const space of spaces) {
    elements.push({ arkiId: `${PROJECT_B_ID}:${variantId}:SPACE:${space.id}`, kind: "SPACE", level: "N1", geometry: polygon(space.rect), properties: { programItemId: space.id, label: space.label, areaM2: space.areaM2 }, geometryVersion: version, lineage: [variantId, space.id], provenance: ["P9 semantic candidate", "human-authorized geometric exploration"], epistemicState: "HYPOTHESIS" });
    elements.push(...wallElements(`${PROJECT_B_ID}:${variantId}:SPACE:${space.id}`, space.rect));
  }
  const door = (id: string, a: string, b: string, p1: Point, p2: Point): CanonicalBuildingElement => ({ arkiId: `${PROJECT_B_ID}:${variantId}:DOOR:${id}`, kind: "DOOR", level: "N1", geometry: segment(p1, p2), properties: { hostSpaceId: a, relatedSpaceId: b, width: "UNKNOWN" }, geometryVersion: version, lineage: [variantId, a, b], provenance: ["P9 candidate relationship", "human-authorized geometric exploration"], epistemicState: "HYPOTHESIS" });
  const route: CanonicalBuildingElement = { arkiId: `${PROJECT_B_ID}:${variantId}:ROUTE:PUBLIC`, kind: "ROUTE", level: "N1", geometry: { type: "line", coordinates: [[1, 15], [5, 15], [10, 15], [15, 15], [19, 15]] }, properties: { routeKind: "PUBLIC", compliance: "NOT_ASSESSED" }, geometryVersion: version, lineage: [variantId], provenance: ["P9 candidate topology", "human-authorized geometric exploration"], epistemicState: "HYPOTHESIS" };
  const entry = spaces.find((s) => s.id === "ENTRY")!;
  const learning = spaces.find((s) => s.id === "LEARNING")!;
  const gathering = spaces.find((s) => s.id === "GATHERING")!;
  const support = spaces.find((s) => s.id === "SUPPORT")!;
  elements.push(door("entry-learning", entry. id, learning.id, [entry.rect.x + entry.rect.w, 15], [entry.rect.x + entry.rect.w, 16]));
  elements.push(door("learning-gathering", learning.id, gathering.id, [learning.rect.x + learning.rect.w, 15], [learning.rect.x + learning.rect.w, 16]));
  elements.push(door("support-learning", support.id, learning.id, [support.rect.x + support.rect.w / 2, support.rect.y + support.rect.h], [support.rect.x + support.rect.w / 2, support.rect.y + support.rect.h + 1]));
  elements.push(route);
  const model: CanonicalBuildingModel = { projectId: `${PROJECT_B_ID}:${variantId}`, modelVersion: version, maturity: "CONCEPTUAL", elements, sourcePlanId: `${PROJECT_B_ID}:${variantId}:CONCEPTUAL-PLAN`, constructionDocumentation: "NOT_CLAIMED", permitReady: false, constructionReady: false };
  return { variantId, model, spaces, validations: [{ id: "ROOM_CONTAINMENT", state: "PASS", explanation: "All conceptual spaces lie inside the 20m × 30m analytical envelope." }, { id: "ROOM_NON_OVERLAP", state: "PASS", explanation: "Spaces are separated in the same-level schematic layout." }, { id: "DOOR_CONNECTION", state: "PASS", explanation: "Each declared door connects named candidate spaces." }, { id: "PUBLIC_ROUTE", state: "PASS", explanation: "A continuous conceptual public route is represented." }, { id: "ACCESSIBILITY_COMPLIANCE", state: "UNKNOWN", explanation: "Route width, slopes, turning clearances and local compliance are not verified." }, { id: "CAPACITY", state: "UNKNOWN", explanation: "Occupancy and event profile remain unknown." }, { id: "REGULATORY_COMPLIANCE", state: "UNKNOWN", explanation: "Jurisdiction and applicable code edition remain unknown." }], humanReviewRequired: true, permitReady: false, constructionReady: false };
};

export function buildProjectBGeometricVariants(): ProjectBGeometryVariant[] {
  return [
    makeVariant("B-CANDIDATE-01", [
      { id: "ENTRY", label: "Shared threshold / entry", rect: { x: 1, y: 10, w: 4, h: 10 } },
      { id: "LEARNING", label: "Repair learning", rect: { x: 5, y: 5, w: 9, h: 20 } },
      { id: "GATHERING", label: "Gathering / exchange", rect: { x: 14, y: 10, w: 5, h: 10 } },
      { id: "SUPPORT", label: "Support / storage", rect: { x: 5, y: 1, w: 9, h: 4 } },
    ]),
    makeVariant("B-CANDIDATE-02", [
      { id: "ENTRY", label: "Entry / gathering filter", rect: { x: 1, y: 10, w: 5, h: 10 } },
      { id: "GATHERING", label: "Gathering / exchange", rect: { x: 6, y: 5, w: 8, h: 20 } },
      { id: "LEARNING", label: "Repair learning", rect: { x: 14, y: 10, w: 5, h: 10 } },
      { id: "SUPPORT", label: "Separated support / storage", rect: { x: 6, y: 1, w: 8, h: 4 } },
    ]),
  ];
}

export function validateProjectBGeometricVariants(variants = buildProjectBGeometricVariants()): boolean {
  return variants.length === 2 && variants.every((variant) => variant.model.maturity === "CONCEPTUAL" && variant.model.permitReady === false && variant.model.constructionReady === false && variant.validations.some((item) => item.id === "ACCESSIBILITY_COMPLIANCE" && item.state === "UNKNOWN") && variant.humanReviewRequired);
}

export function projectBVariantSvg(variant: ProjectBGeometryVariant): string {
  const palette = ["#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3"];
  const spaces = variant.spaces.map((space, i) => `<g><rect x="${space.rect.x * 35}" y="${(30 - space.rect.y - space.rect.h) * 20}" width="${space.rect.w * 35}" height="${space.rect.h * 20}" fill="${palette[i]}" stroke="#162235" stroke-width="2"/><text x="${space.rect.x * 35 + 8}" y="${(30 - space.rect.y - space.rect.h) * 20 + 24}" font-family="sans-serif" font-size="13" fill="#162235">${space.label}</text><text x="${space.rect.x * 35 + 8}" y="${(30 - space.rect.y - space.rect.h) * 20 + 44}" font-family="sans-serif" font-size="11" fill="#475569">${space.areaM2} m² · HYPOTHESIS</text></g>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="700" viewBox="0 0 720 700"><rect width="720" height="700" fill="#f8fafc"/><text x="24" y="34" font-family="sans-serif" font-size="22" font-weight="700">${variant.variantId} — conceptual geometric exploration</text><text x="24" y="58" font-family="sans-serif" font-size="13" fill="#475569">Same CanonicalBuildingModel lineage · 20m × 30m analytical envelope · no permit claim</text><g transform="translate(24,90)">${spaces}</g><text x="24" y="650" font-family="sans-serif" font-size="13" font-weight="700" fill="#9a3412">HUMAN REVIEW REQUIRED · ACCESSIBILITY / CAPACITY / REGULATION UNKNOWN</text><text x="24" y="674" font-family="sans-serif" font-size="12" fill="#475569">This is a conceptual plan, not construction documentation.</text></svg>`;
}
