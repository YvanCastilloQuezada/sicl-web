import { describe, expect, it } from "vitest";
import type { VerticalDecision } from "../shared/arkiVerticalDecision";
import type { VerticalLevel, VerticalSpecialVolume } from "../shared/arkiVerticalSystem";
import { canonicalDeclarationId, resolveSpecialVolumeGeometry } from "./arkiVerticalSpecialVolumeGeometryResolver";

function fixture() {
  const level: VerticalLevel = { levelId: "L1", name: "Level 1", members: ["S1"], elevationDecisionId: "E1" };
  const volume: VerticalSpecialVolume = {
    volumeId: "V1", kind: "ATRIUM", members: ["S1"], volumeDecisionId: "H1",
    architecturalBase: { kind: "LEVEL_BASE", levelId: "L1", authorization: "ELEVATION_AS_BASE" },
  };
  const elevation: VerticalDecision = {
    decisionId: "E1", target: { kind: "LEVEL", levelId: "L1" }, dimensionKind: "ELEVATION",
    selectedDimension_mm: 0, regulatoryConstraints: [], designReferences: [], designDrivers: [], reasoning: "resolved",
    status: "RESOLVED", epistemicStatus: "HYPOTHESIS", decisionAuthority: "ARCHITECTURAL_DECISION",
    evidence: [], provenance: [], unknowns: [], conflicts: [], humanAuthorityRequired: false,
  };
  const extent: VerticalDecision = {
    ...elevation, decisionId: "H1", target: { kind: "SPECIAL_VOLUME", volumeId: "V1", members: ["S1"] },
    dimensionKind: "SPECIAL_VERTICAL", selectedDimension_mm: 6000,
  };
  return {
    volume,
    levels: new Map([["L1", level]]),
    decisions: new Map([["E1", elevation], ["H1", extent]]),
  };
}
function code(mutator: (x: ReturnType<typeof fixture>) => void) {
  const x = fixture(); mutator(x);
  const r = resolveSpecialVolumeGeometry(x.volume, x.levels, x.decisions);
  return r.ok ? "SUCCESS" : r.code;
}

describe("VERTICAL_SPECIAL_VOLUME_GEOMETRY_RESOLUTION", () => {
  it("resolves base, extent and reconstructible provenance", () => {
    const x=fixture(); x.decisions.get("E1")!.selectedDimension_mm=-1500;
    const r=resolveSpecialVolumeGeometry(x.volume,x.levels,x.decisions);
    expect(r).toEqual({ok:true,value:{
      baseElevation_mm:-1500, verticalExtent_mm:6000,
      baseElevationProvenance:{kind:"LEVEL_INHERITANCE_DECLARED",volumeId:"V1",levelId:"L1",levelDecisionId:"E1",declarationId:"SVA_BASE_V1|2:V1|LEVEL_BASE|2:L1|ELEVATION_AS_BASE"},
      verticalExtentProvenance:{kind:"SPECIAL_VERTICAL",volumeId:"V1",decisionId:"H1"},
    }});
  });
  it("accepts zero base elevation",()=>expect(code(()=>{})).toBe("SUCCESS"));
  it("accepts positive base elevation",()=>expect(code(x=>{x.decisions.get("E1")!.selectedDimension_mm=1500})).toBe("SUCCESS"));
  it("fails closed when architectural base is absent",()=>expect(code(x=>{delete x.volume.architecturalBase})).toBe("SPECIAL_VOLUME_INDEPENDENT_DATUM_PENDING"));
  it("rejects malformed base kind",()=>expect(code(x=>{(x.volume.architecturalBase as any).kind="BAD"})).toBe("SPECIAL_VOLUME_ARCHITECTURAL_BASE_KIND_INVALID"));
  it.each([undefined,null,42])("rejects non-string authorization %s",v=>expect(code(x=>{(x.volume.architecturalBase as any).authorization=v})).toBe("SPECIAL_VOLUME_ARCHITECTURAL_BASE_AUTHORIZATION_INVALID"));
  it("rejects well-formed unsupported authorization",()=>expect(code(x=>{(x.volume.architecturalBase as any).authorization="INDEPENDENT_DATUM_AS_BASE"})).toBe("SPECIAL_VOLUME_ARCHITECTURAL_BASE_AUTHORIZATION_NOT_SUPPORTED"));
  it("rejects missing level",()=>expect(code(x=>{x.volume.architecturalBase!.levelId="LX"})).toBe("SPECIAL_VOLUME_ARCHITECTURAL_BASE_LEVEL_NOT_FOUND"));
  it("rejects missing elevation decision",()=>expect(code(x=>{x.levels.get("L1")!.elevationDecisionId="EX"})).toBe("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_NOT_FOUND"));
  it("rejects elevation target kind mismatch",()=>expect(code(x=>{x.decisions.get("E1")!.target={kind:"WHOLE_PARTI"}})).toBe("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_TARGET_MISMATCH"));
  it("rejects elevation target level mismatch",()=>expect(code(x=>{x.decisions.get("E1")!.target={kind:"LEVEL",levelId:"L2"}})).toBe("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_TARGET_MISMATCH"));
  it("rejects elevation dimension mismatch",()=>expect(code(x=>{x.decisions.get("E1")!.dimensionKind="FLOOR_TO_FLOOR"})).toBe("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_KIND_MISMATCH"));
  it("rejects unresolved elevation",()=>expect(code(x=>{x.decisions.get("E1")!.status="UNKNOWN";x.decisions.get("E1")!.selectedDimension_mm=null})).toBe("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_NOT_RESOLVED"));
  it("rejects resolved null elevation",()=>expect(code(x=>{x.decisions.get("E1")!.selectedDimension_mm=null})).toBe("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_MISSING"));
  it("rejects fractional elevation",()=>expect(code(x=>{x.decisions.get("E1")!.selectedDimension_mm=0.5})).toBe("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_NOT_INTEGER"));
  it.each([NaN,Infinity,-Infinity])("rejects nonfinite elevation %s",v=>expect(code(x=>{x.decisions.get("E1")!.selectedDimension_mm=v})).toBe("SPECIAL_VOLUME_BASE_ELEVATION_DECISION_VALUE_NOT_FINITE"));

  it("rejects missing volumeDecisionId",()=>expect(code(x=>{delete x.volume.volumeDecisionId})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_NOT_FOUND"));
  it("rejects missing extent decision",()=>expect(code(x=>{x.volume.volumeDecisionId="HX"})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_NOT_FOUND"));
  it("rejects extent target mismatch",()=>expect(code(x=>{x.decisions.get("H1")!.target={kind:"SPECIAL_VOLUME",volumeId:"V2",members:["S1"]}})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_TARGET_MISMATCH"));
  it("rejects extent target kind mismatch",()=>expect(code(x=>{x.decisions.get("H1")!.target={kind:"LEVEL",levelId:"L1"}})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_TARGET_MISMATCH"));
  it("rejects extent dimension mismatch",()=>expect(code(x=>{x.decisions.get("H1")!.dimensionKind="CLEAR_HEIGHT"})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_KIND_MISMATCH"));
  it("rejects unresolved extent",()=>expect(code(x=>{x.decisions.get("H1")!.status="CONFLICTING";x.decisions.get("H1")!.selectedDimension_mm=null})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_NOT_RESOLVED"));
  it("rejects resolved null extent",()=>expect(code(x=>{x.decisions.get("H1")!.selectedDimension_mm=null})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_VALUE_MISSING"));
  it("rejects fractional extent",()=>expect(code(x=>{x.decisions.get("H1")!.selectedDimension_mm=1.5})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_INTEGER"));
  it.each([NaN,Infinity,-Infinity])("rejects nonfinite extent %s",v=>expect(code(x=>{x.decisions.get("H1")!.selectedDimension_mm=v})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_FINITE"));
  it.each([0,-1,-3000])("rejects non-positive extent %s",v=>expect(code(x=>{x.decisions.get("H1")!.selectedDimension_mm=v})).toBe("SPECIAL_VOLUME_EXTENT_DECISION_VALUE_NOT_POSITIVE"));

  it("canonical declaration ID is deterministic",()=>expect(canonicalDeclarationId({volumeId:"V1",levelId:"L1"})).toBe(canonicalDeclarationId({volumeId:"V1",levelId:"L1"})));
  it("canonical declaration ID is unambiguous with colons",()=>{
    expect(canonicalDeclarationId({volumeId:"V:1",levelId:"L:2"})).toBe("SVA_BASE_V1|3:V:1|LEVEL_BASE|3:L:2|ELEVATION_AS_BASE");
    expect(canonicalDeclarationId({volumeId:"V:1",levelId:"L:2"})).not.toBe(canonicalDeclarationId({volumeId:"V",levelId:"1:L:2"}));
  });
  it("canonical declaration ID exposes length-prefixed reconstructible fields",()=>expect(canonicalDeclarationId({volumeId:"ABC",levelId:"DE"})).toContain("|3:ABC|LEVEL_BASE|2:DE|"));

  it("does not infer base from members or typology",()=>{
    const x=fixture(); delete x.volume.architecturalBase; x.volume.kind="HANGAR"; x.levels.get("L1")!.members=["S1"];
    expect(resolveSpecialVolumeGeometry(x.volume,x.levels,x.decisions)).toEqual({ok:false,code:"SPECIAL_VOLUME_INDEPENDENT_DATUM_PENDING"});
  });
  it("does not mutate inputs and is deterministic",()=>{
    const x=fixture(); const before=JSON.stringify([x.volume,[...x.levels],[...x.decisions]]);
    const a=resolveSpecialVolumeGeometry(x.volume,x.levels,x.decisions); const b=resolveSpecialVolumeGeometry(x.volume,x.levels,x.decisions);
    expect(a).toEqual(b); expect(JSON.stringify([x.volume,[...x.levels],[...x.decisions]])).toBe(before);
  });
  it("success is discriminated and contains no code",()=>{
    const x=fixture(); const r=resolveSpecialVolumeGeometry(x.volume,x.levels,x.decisions);
    expect(r.ok).toBe(true); expect("code" in r).toBe(false); expect("value" in r).toBe(true);
  });
  it("failure is discriminated and contains no value",()=>{
    const x=fixture(); delete x.volume.architecturalBase; const r=resolveSpecialVolumeGeometry(x.volume,x.levels,x.decisions);
    expect(r.ok).toBe(false); expect("code" in r).toBe(true); expect("value" in r).toBe(false);
  });
});
