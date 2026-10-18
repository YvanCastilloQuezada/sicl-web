import { describe, expect, it } from "vitest";
import { transformParetoData } from "./paretoModel";

describe("S6 canonical Pareto transport", () => {
  const response = {
    objectives: ["GROSS_MASSING_AREA", "OPEN_SITE_AREA"],
    alternatives: [
      { alternative_id: "UPAO-001-A", gross_massing_area: 5483.52, open_site_area: 857.28, raw_pareto_status: "NON_DOMINATED" },
      { alternative_id: "UPAO-001-B", gross_massing_area: 4157.96, open_site_area: 828.75, raw_pareto_status: "DOMINATED" },
      { alternative_id: "UPAO-001-C", gross_massing_area: 1717.90, open_site_area: 985.26, raw_pareto_status: "NON_DOMINATED" },
    ],
    provenance: ["SYNTHETIC", "DETERMINISTIC_DERIVED", "EDUCATIONAL"],
    read_only: true,
  };

  it("uses Core alternative_id and raw status without recomputing Pareto", () => {
    const data = transformParetoData(response);
    expect(data.axes).toEqual({
      x: { label: "GROSS_MASSING_AREA", direction: "MAXIMIZE" },
      y: { label: "OPEN_SITE_AREA", direction: "MAXIMIZE" },
    });
    expect(data.points).toEqual([
      { id: "UPAO-001-A", x: 5483.52, y: 857.28, status: "front" },
      { id: "UPAO-001-B", x: 4157.96, y: 828.75, status: "dominated" },
      { id: "UPAO-001-C", x: 1717.9, y: 985.26, status: "front" },
    ]);
  });

  it("does not create positional or legacy identity mappings", () => {
    const ids = transformParetoData(response).points.map((point) => point.id);
    expect(ids).toEqual(["UPAO-001-A", "UPAO-001-B", "UPAO-001-C"]);
    expect(ids.some((id) => /^ALT-|^\d+$/.test(id))).toBe(false);
  });
});
