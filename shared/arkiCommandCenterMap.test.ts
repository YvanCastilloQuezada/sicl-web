import { describe, expect, it } from "vitest";
import { commandCenterPhases, organismNodes } from "./arkiCommandCenterMap";

describe("ARKI live command center map",()=>{
 it("keeps exactly ten product phases",()=>{
  expect(commandCenterPhases).toHaveLength(10);
  expect(commandCenterPhases.map(p=>p.id)).toEqual(["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10"]);
 });
 it("marks only phase 6 as the declared current phase",()=>{
  expect(commandCenterPhases.filter(p=>p.status==="IN_PROGRESS").map(p=>p.id)).toEqual(["F6"]);
 });
 it("does not fabricate historical phase names before reconciliation",()=>{
  for(const p of commandCenterPhases) expect(p.name).toBe(`Fase ${p.id.slice(1)}`);
 });
 it("keeps critical organism organs visible",()=>{
  const ids=new Set(organismNodes.map(n=>n.id));
  for(const id of ["ARKI","UNIVERSITY","RESEARCH","ACS","AI_LAB","D2","FUNNEL","AGK","LUCA","CORP"]) expect(ids.has(id)).toBe(true);
 });
 it("keeps unresolved work explicit rather than verified",()=>{
  expect(organismNodes.some(n=>n.status==="RECONCILIATION_REQUIRED")).toBe(true);
 });
});