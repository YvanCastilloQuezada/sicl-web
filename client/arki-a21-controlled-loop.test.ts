import { describe, expect, it } from "vitest";
import { buildA21ControlledDesignLoop, rejectUnauthorizedA21Revision, validateA21ControlledDesignLoop } from "./src/components/arkiA21ControlledDesignLoop";
import { synthesizeHouseA21Configuration } from "./src/components/a21SpatialConfiguration";

describe("A21 controlled architectural design loop", () => {
  it("proves canonical bridge and containment without changing Core", () => {
    const loop = buildA21ControlledDesignLoop();
    expect(loop.parent.alternativeId).toBe("HOUSE-A21-ALT-PARENT");
    expect(loop.parent.spatialRepresentation.alternative_id).toBe("HOUSE-A21-ALT-PARENT");
    expect(loop.containment.state).toBe("CONTAINED");
    expect(loop.containment.boundaryValidity).toBe("SUPPORTED");
    expect(loop.containment.isContainment).toBe(true);
  });

  it("rejects unauthorized mutation and preserves the parent", () => {
    const parent = synthesizeHouseA21Configuration();
    const rejected = rejectUnauthorizedA21Revision(parent, false);
    expect(rejected).toEqual(parent);
    expect(rejected.configurationId).toBe("HOUSE-A21-CONFIG-A");
  });

  it("creates an authorized child with meaningful minimal geometry change", () => {
    const loop = buildA21ControlledDesignLoop();
    expect(loop.revision.state).toBe("VERIFIED");
    expect(loop.revision.parentImmutable).toBe(true);
    expect(loop.revision.authorizationReference).toBe("HOUSE-A21-CONTROLLED-FIXTURE-AUTHORIZATION");
    expect(loop.child?.configurationId).toBe("HOUSE-A21-CONFIG-A-CHILD");
    expect(loop.comparison?.observedChanges.length).toBeGreaterThan(0);
    expect(loop.comparison?.unchanged).toContain("all non-KITCHEN space geometries");
    expect(loop.comparison?.automaticWinner).toBe("NONE");
  });

  it("proves physical boundaries, passage, windows and bounded vertical status", () => {
    const loop = buildA21ControlledDesignLoop();
    expect(loop.physicalAccess.passages.length).toBeGreaterThan(0);
    expect(loop.physicalAccess.accessPoints.length).toBeGreaterThan(0);
    expect(loop.physicalAccess.verticalConnections.length).toBe(1);
    expect(loop.physicalAccess.state).toBe("PARTIAL");
    expect(loop.architecturalElements.walls.length).toBeGreaterThan(0);
    expect(loop.architecturalElements.openings.length).toBeGreaterThan(0);
    expect(loop.architecturalElements.windows.length).toBeGreaterThan(0);
    expect(loop.architecturalElements.envelope.length).toBe(1);
  });

  it("proves fresh visual parent/child comparison and preserves authority", () => {
    const loop = buildA21ControlledDesignLoop();
    expect(loop.visual.renderer).toBe("SpatialSvgViewer");
    expect(loop.visual.differenceElementIds.length).toBeGreaterThan(0);
    expect(loop.freshReadback.childIsFresh).toBe(true);
    expect(loop.freshReadback.childSpaceObservations).toBeGreaterThan(0);
    expect(loop.humanAuthority).toBe("PRESERVED");
    expect(loop.noAutomaticDecision).toBe(true);
    expect(validateA21ControlledDesignLoop(loop)).toBe(true);
  });
});
