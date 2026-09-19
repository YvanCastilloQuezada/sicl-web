import type { Rect, ResidentialRoom } from "./residentialConstructivePlan";

export type FunctionalVoidStatus = "INTENTIONAL_VOID" | "CIRCULATION" | "SERVICE" | "UNASSIGNED_RESIDUAL";

export type FunctionalVoidFinding = {
  levelId: string;
  cell: Rect;
  areaM2: number;
  status: FunctionalVoidStatus;
  reason: string;
};

const contains = (outer: Rect, x: number, y: number) => x >= outer.minX && x < outer.maxX && y >= outer.minY && y < outer.maxY;

export function auditFunctionalVoids(envelope: Rect, rooms: ResidentialRoom[], levelId: string, cellSizeM = 0.5): FunctionalVoidFinding[] {
  const findings: FunctionalVoidFinding[] = [];
  for (let y = envelope.minY; y < envelope.maxY; y += cellSizeM) {
    for (let x = envelope.minX; x < envelope.maxX; x += cellSizeM) {
      const centerX = x + cellSizeM / 2;
      const centerY = y + cellSizeM / 2;
      if (rooms.some((room) => room.levelId === levelId && contains(room.footprint, centerX, centerY))) continue;
      findings.push({
        levelId,
        cell: { minX: x, minY: y, maxX: Math.min(x + cellSizeM, envelope.maxX), maxY: Math.min(y + cellSizeM, envelope.maxY) },
        areaM2: cellSizeM * cellSizeM,
        status: "UNASSIGNED_RESIDUAL",
        reason: "No program, circulation, service, intentional void or exterior function was assigned to this part of the envelope.",
      });
    }
  }
  return findings;
}

export function summarizeFunctionalVoids(envelope: Rect, rooms: ResidentialRoom[]) {
  const byLevel = ["N1", "N2"].map((levelId) => auditFunctionalVoids(envelope, rooms, levelId));
  const residualAreaM2 = byLevel.flat().reduce((sum, finding) => sum + finding.areaM2, 0);
  return {
    status: residualAreaM2 === 0 ? "PASS" as const : "REQUIRES_REPLAN" as const,
    residualAreaM2,
    findings: byLevel.flat(),
    rule: "Every enclosed or exposed part of a floor must have a declared functional role; otherwise it is residual and blocks a functional-pass claim.",
    humanReviewRequired: true as const,
  };
}

