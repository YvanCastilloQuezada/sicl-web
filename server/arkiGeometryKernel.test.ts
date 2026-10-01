import { describe, expect, it } from "vitest";
import {
  applyAgkCommand,
  deriveAgkPlan,
  materializeD63Geometry,
  createAgkState,
} from "./arkiGeometryKernel";

const input = {
  geometry: {
    type: "Polygon",
    coordinates: [[[1, 2], [4, 2], [4, 6], [1, 6], [1, 2]]],
  },
  coordinateSystem: "LOCAL_PROJECT_2D",
  units: "m",
  baseElevation_mm: 0,
  verticalExtent_mm: 2800,
};

describe("AGK-001 operational spine", () => {
  it("materializes the current D6.3 rectangle through AGK deterministically", () => {
    const a = materializeD63Geometry("space-1", input);
    const b = materializeD63Geometry("space-1", input);
    expect(a).toEqual(b);
    expect(a.ok && a.value.objects[0].geometry).toEqual({
      kind: "EXTRUDED_RECTANGLE",
      profile: { width_mm: 3000, depth_mm: 4000, radius_mm: null },
      x_mm: 1000,
      y_mm: 2000,
      z_mm: 0,
      height_mm: 2800,
    });
  });

  it("commits MOVE +600 mm atomically and derives plan from the committed state", () => {
    const initial = materializeD63Geometry("space-1", input);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;

    const moved = applyAgkCommand(initial.value, {
      kind: "MOVE",
      objectId: "space-1",
      delta_mm: { x: 600, y: 0, z: 0 },
    });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;

    expect(initial.value.objects[0].geometry.x_mm).toBe(1000);
    expect(moved.value.state.objects[0].geometry.x_mm).toBe(1600);
    expect(moved.value.state.revision).toBe(1);
    expect(moved.value.beforeStateId).toBe(initial.value.stateId);
    expect(moved.value.afterStateId).toBe(moved.value.state.stateId);
    expect(deriveAgkPlan(moved.value.state)).toEqual([{
      objectId: "space-1",
      kind: "RECTANGLE",
      x_mm: 1600,
      y_mm: 2000,
      width_mm: 3000,
      depth_mm: 4000,
    }]);
  });

  it("produces the same transaction identity for the same state and command", () => {
    const initial = materializeD63Geometry("space-1", input);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    const command = { kind: "MOVE" as const, objectId: "space-1", delta_mm: { x: 600, y: 0, z: 0 } };
    expect(applyAgkCommand(initial.value, command)).toEqual(applyAgkCommand(initial.value, command));
  });

  it("fails closed without producing a partial state", () => {
    const initial = materializeD63Geometry("space-1", input);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;

    expect(applyAgkCommand(initial.value, {
      kind: "MOVE",
      objectId: "missing",
      delta_mm: { x: 600, y: 0, z: 0 },
    })).toEqual({ ok: false, code: "OBJECT_NOT_FOUND" });

    expect(applyAgkCommand(initial.value, {
      kind: "MOVE",
      objectId: "space-1",
      delta_mm: { x: 0.5, y: 0, z: 0 },
    })).toEqual({ ok: false, code: "MOVE_DELTA_NOT_INTEGER" });

    expect(initial.value.revision).toBe(0);
    expect(initial.value.objects[0].geometry.x_mm).toBe(1000);
  });
  it("propagates HOSTS dependency and preserves identities", () => {
    const wall = { objectId: "wall-1", geometry: { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 4000, depth_mm: 200, radius_mm: null }, x_mm: 1000, y_mm: 2000, z_mm: 0, height_mm: 2800 } };
    const window = { objectId: "window-1", geometry: { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 1200, depth_mm: 200, radius_mm: null }, x_mm: 2200, y_mm: 2000, z_mm: 900, height_mm: 1200 } };
    const initial = createAgkState([wall, window], [{ kind: "HOSTS", hostObjectId: "wall-1", dependentObjectId: "window-1" }]);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    const moved = applyAgkCommand(initial.value, { kind: "MOVE", objectId: "wall-1", delta_mm: { x: 600, y: 0, z: 0 } });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    expect(moved.value.affectedObjectIds).toEqual(["wall-1", "window-1"]);
    expect(moved.value.state.objects.map((object) => [object.objectId, object.geometry.x_mm])).toEqual([["wall-1", 1600], ["window-1", 2800]]);
    expect(moved.value.state.dependencies).toEqual([{ kind: "HOSTS", hostObjectId: "wall-1", dependentObjectId: "window-1" }]);
    expect(deriveAgkPlan(moved.value.state).map((item) => [item.objectId, item.x_mm])).toEqual([["wall-1", 1600], ["window-1", 2800]]);
  });

  it("rejects invalid HOSTS graphs before commit", () => {
    const wall = { objectId: "wall-1", geometry: { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 1000, depth_mm: 200, radius_mm: null }, x_mm: 0, y_mm: 0, z_mm: 0, height_mm: 2800 } };
    expect(createAgkState([wall], [{ kind: "HOSTS", hostObjectId: "wall-1", dependentObjectId: "missing" }])).toEqual({ ok: false, code: "DEPENDENCY_OBJECT_NOT_FOUND" });
    expect(createAgkState([wall], [{ kind: "HOSTS", hostObjectId: "wall-1", dependentObjectId: "wall-1" }])).toEqual({ ok: false, code: "DEPENDENCY_SELF_REFERENCE" });
  });

  it("rejects a dependency cycle before committed state exists", () => {
    const geometry = { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 1000, depth_mm: 200, radius_mm: null }, x_mm: 0, y_mm: 0, z_mm: 0, height_mm: 2800 };
    expect(createAgkState(
      [{ objectId: "a", geometry }, { objectId: "b", geometry }, { objectId: "c", geometry }],
      [
        { kind: "HOSTS", hostObjectId: "a", dependentObjectId: "b" },
        { kind: "HOSTS", hostObjectId: "b", dependentObjectId: "c" },
        { kind: "HOSTS", hostObjectId: "c", dependentObjectId: "a" },
      ]
    )).toEqual({ ok: false, code: "DEPENDENCY_CYCLE" });
  });

  it("gives graph-equivalent reordered states the same stateId", () => {
    const a = { objectId: "a", geometry: { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 1000, depth_mm: 200, radius_mm: null }, x_mm: 0, y_mm: 0, z_mm: 0, height_mm: 2800 } };
    const b = { objectId: "b", geometry: { ...a.geometry, x_mm: 1000 } };
    const first = createAgkState([a, b], [{ kind: "HOSTS", hostObjectId: "a", dependentObjectId: "b" }]);
    const second = createAgkState([b, a], [{ kind: "HOSTS", hostObjectId: "a", dependentObjectId: "b" }]);
    expect(first.ok && second.ok && first.value.stateId).toBe(second.ok ? second.value.stateId : "invalid");
  });

  it("deep-freezes committed geometry and records transaction provenance", () => {
    const initial = materializeD63Geometry("space-1", input);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    expect(Object.isFrozen(initial.value.objects[0])).toBe(true);
    expect(Object.isFrozen(initial.value.objects[0].geometry)).toBe(true);
    expect(Object.isFrozen(initial.value.objects[0].geometry.profile)).toBe(true);
    const moved = applyAgkCommand(initial.value, { kind: "MOVE", objectId: "space-1", delta_mm: { x: 600, y: 0, z: 0 } });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    expect(moved.value.provenance).toEqual({
      kind: "AGK_COMMAND_COMMITTED",
      transactionId: moved.value.transactionId,
      beforeStateId: initial.value.stateId,
      afterStateId: moved.value.state.stateId,
      command: { kind: "MOVE", objectId: "space-1", delta_mm: { x: 600, y: 0, z: 0 } },
      affectedObjectIds: ["space-1"],
    });
  });

  it("AGK-002 selectively regenerates hosted child and leaves independent object untouched", () => {
    const g=(id:string,x:number,w:number,h:number)=>({objectId:id,geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:w,depth_mm:200,radius_mm:null},x_mm:x,y_mm:0,z_mm:0,height_mm:h}});
    const objects=[g("wall-1",1000,4000,2800),g("window-1",2200,1200,1200),g("column-1",9000,400,2800)];
    const causalModel={features:[
      {featureId:"f-wall",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"wall-1",parameters:{width_mm:4000,depth_mm:200,height_mm:2800,x_mm:1000,y_mm:0,z_mm:0},inputFeatureIds:[]},
      {featureId:"f-window",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"window-1",parameters:{width_mm:1200,depth_mm:200,height_mm:1200,x_mm:2200,y_mm:0,z_mm:0},inputFeatureIds:["f-wall"]},
      {featureId:"f-column",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"column-1",parameters:{width_mm:400,depth_mm:400,height_mm:2800,x_mm:9000,y_mm:0,z_mm:0},inputFeatureIds:[]},
    ],constraints:[{constraintId:"c-host",kind:"HOSTED_LOCAL_OFFSET" as const,hostObjectId:"wall-1",dependentObjectId:"window-1",offset_mm:{x:1200,y:0,z:0},requireWithinHostX:true}]};
    const initial=createAgkState(objects,[{kind:"HOSTS",hostObjectId:"wall-1",dependentObjectId:"window-1"}],causalModel);
    expect(initial.ok).toBe(true); if(!initial.ok)return;
    const moved=applyAgkCommand(initial.value,{kind:"MOVE",objectId:"wall-1",delta_mm:{x:600,y:0,z:0}});
    expect(moved.ok).toBe(true); if(!moved.ok)return;
    expect(moved.value.state.objects.map(o=>[o.objectId,o.geometry.x_mm])).toEqual([["wall-1",1600],["window-1",2800],["column-1",9000]]);
    expect(moved.value.regenerationReport?.regeneratedObjectIds).toEqual(["wall-1","window-1"]);
    expect(moved.value.regenerationReport?.unchangedObjectIds).toEqual(["column-1"]);
    expect(moved.value.regenerationReport?.executionOrder).toEqual(["f-wall","f-window"]);
  });

  it("AGK-002 rejects violated hosted range atomically", () => {
    const wall={objectId:"wall",geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:2000,depth_mm:200,radius_mm:null},x_mm:0,y_mm:0,z_mm:0,height_mm:2800}};
    const child={objectId:"child",geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:1200,depth_mm:200,radius_mm:null},x_mm:1500,y_mm:0,z_mm:0,height_mm:1200}};
    const model={features:[
      {featureId:"a",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"wall",parameters:{width_mm:2000,depth_mm:200,height_mm:2800,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:[]},
      {featureId:"b",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"child",parameters:{width_mm:1200,depth_mm:200,height_mm:1200,x_mm:1500,y_mm:0,z_mm:0},inputFeatureIds:["a"]},
    ],constraints:[{constraintId:"bad",kind:"HOSTED_LOCAL_OFFSET" as const,hostObjectId:"wall",dependentObjectId:"child",offset_mm:{x:1500,y:0,z:0},requireWithinHostX:true}]};
    const initial=createAgkState([wall,child],[{kind:"HOSTS",hostObjectId:"wall",dependentObjectId:"child"}],model);
    expect(initial.ok).toBe(true); if(!initial.ok)return;
    const before=initial.value;
    expect(applyAgkCommand(before,{kind:"MOVE",objectId:"wall",delta_mm:{x:600,y:0,z:0}})).toEqual({ok:false,code:"CONSTRAINT_VIOLATED"});
    expect(before.revision).toBe(0);
    expect(before.objects[0].geometry.x_mm).toBe(0);
  });

  it("AGK-002 SET_FEATURE_PARAMETER changes height and preserves object identity", () => {
    const wall={objectId:"wall",geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:4000,depth_mm:200,radius_mm:null},x_mm:0,y_mm:0,z_mm:0,height_mm:2800}};
    const model={features:[{featureId:"f-wall",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"wall",parameters:{width_mm:4000,depth_mm:200,height_mm:2800,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:[]}],constraints:[]};
    const initial=createAgkState([wall],[],model); expect(initial.ok).toBe(true); if(!initial.ok)return;
    const changed=applyAgkCommand(initial.value,{kind:"SET_FEATURE_PARAMETER",featureId:"f-wall",parameter:"height_mm",value:3200});
    expect(changed.ok).toBe(true); if(!changed.ok)return;
    expect(changed.value.state.objects[0].objectId).toBe("wall");
    expect(changed.value.state.objects[0].geometry.height_mm).toBe(3200);
    expect(changed.value.regenerationReport?.regeneratedObjectIds).toEqual(["wall"]);
  });

  it("AGK-002 regenerates a causal chain in deterministic topological order", () => {
    const mk=(id:string,x:number)=>({objectId:id,geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:1000,depth_mm:200,radius_mm:null},x_mm:x,y_mm:0,z_mm:0,height_mm:1000}});
    const objects=[mk("a",0),mk("b",1000),mk("c",2000),mk("d",3000)];
    const features=objects.map((o,i)=>({featureId:"f-"+o.objectId,kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:o.objectId,parameters:{width_mm:1000,depth_mm:200,height_mm:1000,x_mm:o.geometry.x_mm,y_mm:0,z_mm:0},inputFeatureIds:i===0?[]:["f-"+objects[i-1].objectId]}));
    const deps=[["a","b"],["b","c"],["c","d"]].map(([hostObjectId,dependentObjectId])=>({kind:"HOSTS" as const,hostObjectId,dependentObjectId}));
    const initial=createAgkState(objects,deps,{features,constraints:[]}); expect(initial.ok).toBe(true); if(!initial.ok)return;
    const moved=applyAgkCommand(initial.value,{kind:"MOVE",objectId:"a",delta_mm:{x:100,y:0,z:0}}); expect(moved.ok).toBe(true); if(!moved.ok)return;
    expect(moved.value.regenerationReport?.executionOrder).toEqual(["f-a","f-b","f-c","f-d"]);
    expect(moved.value.state.objects.map(o=>o.geometry.x_mm)).toEqual([100,1100,2100,3100]);
  });

  it("AGK-002 fan-out leaves an unrelated object unchanged", () => {
    const mk=(id:string,x:number)=>({objectId:id,geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:500,depth_mm:200,radius_mm:null},x_mm:x,y_mm:0,z_mm:0,height_mm:1000}});
    const objects=["a","b","c","d","e"].map((id,i)=>mk(id,i*1000));
    const features=objects.map(o=>({featureId:"f-"+o.objectId,kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:o.objectId,parameters:{width_mm:500,depth_mm:200,height_mm:1000,x_mm:o.geometry.x_mm,y_mm:0,z_mm:0},inputFeatureIds:["b","c","d"].includes(o.objectId)?["f-a"]:[]}));
    const deps=["b","c","d"].map(dependentObjectId=>({kind:"HOSTS" as const,hostObjectId:"a",dependentObjectId}));
    const initial=createAgkState(objects,deps,{features,constraints:[]}); expect(initial.ok).toBe(true); if(!initial.ok)return;
    const moved=applyAgkCommand(initial.value,{kind:"MOVE",objectId:"a",delta_mm:{x:50,y:0,z:0}}); expect(moved.ok).toBe(true); if(!moved.ok)return;
    expect(moved.value.regenerationReport?.affectedObjectIds).toEqual(["a","b","c","d"]);
    expect(moved.value.regenerationReport?.unchangedObjectIds).toEqual(["e"]);
    expect(moved.value.state.objects.find(o=>o.objectId==="e")?.geometry.x_mm).toBe(4000);
  });

  it("AGK-002 diamond regenerates the join exactly once", () => {
    const mk=(id:string)=>({objectId:id,geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:500,depth_mm:200,radius_mm:null},x_mm:0,y_mm:0,z_mm:0,height_mm:1000}});
    const objects=["a","b","c","d"].map(mk);
    const features=[
      {featureId:"fa",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"a",parameters:{width_mm:500,depth_mm:200,height_mm:1000,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:[]},
      {featureId:"fb",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"b",parameters:{width_mm:500,depth_mm:200,height_mm:1000,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:["fa"]},
      {featureId:"fc",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"c",parameters:{width_mm:500,depth_mm:200,height_mm:1000,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:["fa"]},
      {featureId:"fd",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"d",parameters:{width_mm:500,depth_mm:200,height_mm:1000,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:["fb","fc"]},
    ];
    const deps=[["a","b"],["a","c"],["b","d"],["c","d"]].map(([hostObjectId,dependentObjectId])=>({kind:"HOSTS" as const,hostObjectId,dependentObjectId}));
    const initial=createAgkState(objects,deps,{features,constraints:[]}); expect(initial.ok).toBe(true); if(!initial.ok)return;
    const moved=applyAgkCommand(initial.value,{kind:"MOVE",objectId:"a",delta_mm:{x:10,y:0,z:0}}); expect(moved.ok).toBe(true); if(!moved.ok)return;
    expect(moved.value.regenerationReport?.executionOrder).toEqual(["fa","fb","fc","fd"]);
    expect(moved.value.regenerationReport?.regeneratedObjectIds.filter(id=>id==="d")).toHaveLength(1);
  });

  it("AGK-002 graph ordering does not change regeneration semantics", () => {
    const mk=(id:string,x:number)=>({objectId:id,geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:500,depth_mm:200,radius_mm:null},x_mm:x,y_mm:0,z_mm:0,height_mm:1000}});
    const a=mk("a",0),b=mk("b",1000),c=mk("c",2000);
    const fs=[
      {featureId:"fa",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"a",parameters:{width_mm:500,depth_mm:200,height_mm:1000,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:[]},
      {featureId:"fb",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"b",parameters:{width_mm:500,depth_mm:200,height_mm:1000,x_mm:1000,y_mm:0,z_mm:0},inputFeatureIds:["fa"]},
      {featureId:"fc",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"c",parameters:{width_mm:500,depth_mm:200,height_mm:1000,x_mm:2000,y_mm:0,z_mm:0},inputFeatureIds:["fa"]},
    ];
    const ds=[{kind:"HOSTS" as const,hostObjectId:"a",dependentObjectId:"b"},{kind:"HOSTS" as const,hostObjectId:"a",dependentObjectId:"c"}];
    const x=createAgkState([a,b,c],ds,{features:fs,constraints:[]}), y=createAgkState([c,b,a],[...ds].reverse(),{features:[...fs].reverse(),constraints:[]});
    expect(x.ok&&y.ok).toBe(true); if(!x.ok||!y.ok)return;
    const cmd={kind:"MOVE" as const,objectId:"a",delta_mm:{x:25,y:0,z:0}};
    const rx=applyAgkCommand(x.value,cmd),ry=applyAgkCommand(y.value,cmd); expect(rx.ok&&ry.ok).toBe(true); if(!rx.ok||!ry.ok)return;
    const norm=(r:typeof rx.value)=>r.state.objects.map(o=>[o.objectId,o.geometry.x_mm]).sort((p,q)=>String(p[0]).localeCompare(String(q[0])));
    expect(norm(rx.value)).toEqual(norm(ry.value));
    expect(rx.value.regenerationReport?.executionOrder).toEqual(ry.value.regenerationReport?.executionOrder);
  });

  it("AGK-002 state identity includes causal semantics but ignores causal array order", () => {
    const mk=(id:string)=>({objectId:id,geometry:{kind:"EXTRUDED_RECTANGLE" as const,profile:{width_mm:1000,depth_mm:200,radius_mm:null},x_mm:0,y_mm:0,z_mm:0,height_mm:1000}});
    const objects=[mk("a"),mk("b")], deps=[{kind:"HOSTS" as const,hostObjectId:"a",dependentObjectId:"b"}];
    const fa={featureId:"fa",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"a",parameters:{width_mm:1000,depth_mm:200,height_mm:1000,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:[]};
    const fb={featureId:"fb",kind:"EXTRUDE_RECTANGLE" as const,producesObjectId:"b",parameters:{width_mm:1000,depth_mm:200,height_mm:1000,x_mm:0,y_mm:0,z_mm:0},inputFeatureIds:["fa"]};
    const c1={constraintId:"c1",kind:"HOSTED_LOCAL_OFFSET" as const,hostObjectId:"a",dependentObjectId:"b",offset_mm:{x:0,y:0,z:0},requireWithinHostX:true};
    const x=createAgkState(objects,deps,{features:[fa,fb],constraints:[c1]});
    const y=createAgkState(objects,deps,{features:[fb,fa],constraints:[c1]});
    const z=createAgkState(objects,deps,{features:[fa,fb],constraints:[{...c1,offset_mm:{x:1,y:0,z:0}}]});
    expect(x.ok&&y.ok&&z.ok).toBe(true); if(!x.ok||!y.ok||!z.ok)return;
    expect(x.value.stateId).toBe(y.value.stateId);
    expect(x.value.stateId).not.toBe(z.value.stateId);
  });

});
