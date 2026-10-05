import { describe, expect, it } from "vitest";
import { assertNamingCommitAllowed, decideNamingEvent } from "../shared/arkiPersistentNaming";

describe("ARKI persistent naming minimal service",()=>{
 it("preserves only unique high-confidence correspondence",()=>{
  expect(decideNamingEvent({predecessorIds:["SEM:ROOF"],successorIds:["BREP:F1"],candidates:[{successorId:"BREP:F1",evidence:{semanticId:"SEM:ROOF",featureId:"F:BOX",role:"ROOF"},score:.98}]}).event).toBe("PRESERVE");
 });
 it("fails closed on symmetric competing candidates",()=>{
  const d=decideNamingEvent({predecessorIds:["SEM:SIDE"],successorIds:["F1","F2"],candidates:[{successorId:"F1",evidence:{geometrySignature:"equal-area"},score:.92},{successorId:"F2",evidence:{geometrySignature:"equal-area"},score:.91}]});
  expect(d.event).toBe("AMBIGUOUS"); expect(d.committed).toBe(false); expect(()=>assertNamingCommitAllowed(d)).toThrow("ARKI_NAMING_FAIL_CLOSED");
 });
 it("records explicit split",()=>expect(decideNamingEvent({predecessorIds:["ROOF"],successorIds:["R1","R2"],explicitLineage:"SPLIT"}).event).toBe("SPLIT"));
 it("records explicit merge",()=>expect(decideNamingEvent({predecessorIds:["R1","R2"],successorIds:["ROOF"],explicitLineage:"MERGE"}).event).toBe("MERGE"));
 it("records new",()=>expect(decideNamingEvent({predecessorIds:[],successorIds:["N"]}).event).toBe("NEW"));
 it("records deleted",()=>expect(decideNamingEvent({predecessorIds:["OLD"],successorIds:[]}).event).toBe("DELETED"));
 it("does not use low confidence as authority",()=>expect(decideNamingEvent({predecessorIds:["A"],successorIds:["B"],candidates:[{successorId:"B",evidence:{geometrySignature:"near"},score:.7}]}).event).toBe("AMBIGUOUS"));
});
