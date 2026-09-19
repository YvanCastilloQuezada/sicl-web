import { describe, expect, it } from "vitest";
import { validateProposalDelivery } from "./arkiProposalDeliveryContract";

describe("proposal delivery contract", () => {
  it("requires a named plan and visible entry/circulation arrows for every level", () => {
    expect(validateProposalDelivery({
      floorPlans: [
        { levelId: "N1", roomLabels: ["Sala", "Cocina"], circulationArrows: [{ from: "SUR", to: "Sala", kind: "ENTRY" }, { from: "Sala", to: "Cocina", kind: "INTERNAL" }] },
        { levelId: "N2", roomLabels: ["Dormitorio 1", "Baño"], circulationArrows: [{ from: "Escalera", to: "Galería", kind: "VERTICAL" }, { from: "Galería", to: "Dormitorio 1", kind: "ENTRY" }] },
      ],
      humanReviewRequired: true,
    })).toEqual([]);
  });

  it("rejects a proposal without a plan, labels or entry evidence", () => {
    expect(validateProposalDelivery({ floorPlans: [{ levelId: "N1", roomLabels: [], circulationArrows: [] }], humanReviewRequired: true })).toEqual([
      "ROOM_LABELS_REQUIRED:N1", "CIRCULATION_ARROWS_REQUIRED:N1", "ENTRY_ARROW_REQUIRED:N1",
    ]);
  });
});
