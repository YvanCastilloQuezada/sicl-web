export type FloorPlanDelivery = {
  levelId: string;
  roomLabels: string[];
  circulationArrows: Array<{ from: string; to: string; kind: "ENTRY" | "INTERNAL" | "VERTICAL" }>;
};

export type ProposalDelivery = { floorPlans: FloorPlanDelivery[]; humanReviewRequired: true };

export function validateProposalDelivery(delivery: ProposalDelivery): string[] {
  const errors: string[] = [];
  if (!delivery.floorPlans.length) errors.push("FLOOR_PLAN_REQUIRED");
  for (const plan of delivery.floorPlans) {
    if (!plan.levelId) errors.push("LEVEL_ID_REQUIRED");
    if (!plan.roomLabels.length) errors.push(`ROOM_LABELS_REQUIRED:${plan.levelId}`);
    if (!plan.circulationArrows.length) errors.push(`CIRCULATION_ARROWS_REQUIRED:${plan.levelId}`);
    if (!plan.circulationArrows.some((arrow) => arrow.kind === "ENTRY")) errors.push(`ENTRY_ARROW_REQUIRED:${plan.levelId}`);
  }
  if (delivery.humanReviewRequired !== true) errors.push("HUMAN_REVIEW_REQUIRED");
  return errors;
}
