import { describe, expect, it } from "vitest";
import { evidenceFromAgkEnvelope, validateAgkGeometryEvidenceEnvelope, type AgkGeometryEvidenceEnvelope } from "../shared/arkiPersistentNaming";

const good=():AgkGeometryEvidenceEnvelope=>({schema:"ARKI_AGK_GEOMETRY_EVIDENCE_V1",authority:"AGK_OCCT",operationId:"OP:42",revision:1,producedAt:"2026-10-05T03:15:46-05:00",predecessors:["SEM:ROOF"],successors:["BREP:F1"],featureId:"F:BOX",role:"ROOF",operationHistory:["Modified"],geometrySignatures:["A=280"],topologySignatures:["FACE"]});

describe("AGK geometry evidence envelope boundary",()=>{
 it("accepts evidence explicitly produced by AGK/OCCT",()=>expect(()=>validateAgkGeometryEvidenceEnvelope(good())).not.toThrow());
 it("rejects a non-AGK geometry authority",()=>expect(()=>validateAgkGeometryEvidenceEnvelope({...good(),authority:"AGK_OCCT" as const,schema:"BAD" as any})).toThrow("ARKI_NAMING_UNTRUSTED_GEOMETRY_EVIDENCE"));
 it("rejects invalid revision/provenance",()=>expect(()=>validateAgkGeometryEvidenceEnvelope({...good(),revision:0})).toThrow("ARKI_NAMING_INVALID_GEOMETRY_EVIDENCE"));
 it("rejects empty geometry transactions",()=>expect(()=>validateAgkGeometryEvidenceEnvelope({...good(),predecessors:[],successors:[]})).toThrow("ARKI_NAMING_EMPTY_GEOMETRY_EVIDENCE"));
 it("adapts evidence without creating geometry",()=>{
  const e=evidenceFromAgkEnvelope(good()); expect(e.featureId).toBe("F:BOX");expect(e.role).toBe("ROOF");expect(e.operationHistory).toEqual(["Modified"]);
 });
});
