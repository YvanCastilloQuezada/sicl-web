// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CanonicalOrthographicViewer, deriveOrthographicProjection } from "./CanonicalOrthographicViewer";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";

const rep: SpatialRepresentation={id:"SR-A01",alternative_id:"A01",spatial_scope:"edificacion",representation_version:"1.0",generator_version:"test",coordinate_system:"LOCAL_ENU",units:"m",input_fingerprint:"f".repeat(64),north_degrees:0,elements:[
{id:"mass-1",element_type:"BuildingMass",geometry:{type:"volume",coordinates:[[10,20,0],[30,20,0],[30,40,0],[10,40,0],[10,20,15],[30,20,15],[30,40,15],[10,40,15]]}}
]};
afterEach(()=>cleanup());
describe("canonical orthographic derivation",()=>{
 it("preserves canonical identity in section and elevation",()=>{
  const section=deriveOrthographicProjection(rep,"SECTION","Y"); const elevation=deriveOrthographicProjection(rep,"ELEVATION","X");
  for(const view of [section,elevation]){expect(view.representationId).toBe(rep.id);expect(view.alternativeId).toBe(rep.alternative_id);expect(view.inputFingerprint).toBe(rep.input_fingerprint);}
 });
 it("derives dimensions from the same BuildingMass coordinates",()=>{
  const s=deriveOrthographicProjection(rep,"SECTION","Y"); expect(s.primitives[0]).toMatchObject({id:"mass-1",x:20,y:0,width:20,height:15});
  const e=deriveOrthographicProjection(rep,"ELEVATION","X"); expect(e.primitives[0]).toMatchObject({id:"mass-1",x:10,y:0,width:20,height:15});
 });
 it("renders provenance markers without fabricating another geometry",()=>{
  render(React.createElement(CanonicalOrthographicViewer,{representation:rep,mode:"SECTION"}));
  const viewer=screen.getByTestId("canonical-orthographic-viewer");
  expect(viewer.getAttribute("data-representation-id")).toBe("SR-A01");
  expect(viewer.getAttribute("data-input-fingerprint")).toBe("f".repeat(64));
  expect(document.querySelector('[data-spatial-id="mass-1"]')).toBeTruthy();
 });
});
