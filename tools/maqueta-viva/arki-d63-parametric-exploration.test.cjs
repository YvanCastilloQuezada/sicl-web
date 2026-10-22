"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {generate}=require("./arki-d63-parametric-exploration.cjs");
const base={envelope:{width:18,height:12},activities:["public-orientation","staff-intake"],margin:1,buffer:2,minimumZoneDepth:2};
test("three measured, distinct alternatives with closed area",()=>{const r=generate(base);assert.equal(r.candidates.length,3);assert.equal(new Set(r.candidates.map(c=>JSON.stringify(c.zones))).size,3);for(const c of r.candidates){assert.equal(c.geometricValidity,"PASS");assert.equal(c.measures.areaClosureError,0);assert.equal(c.functionalValidity,"UNKNOWN")}assert.equal(r.canonicalMutation,false);assert.equal(r.engine,"ANALYTICAL_2D_ONLY_NOT_AGK")});
test("dimension change changes geometry and receipt deterministically",()=>{const a=generate(base),b=generate({...base,envelope:{width:22,height:12}});assert.notEqual(a.receiptSha256,b.receiptSha256);assert.notDeepEqual(a.candidates[0].zones,b.candidates[0].zones);assert.deepEqual(a,generate(base))});
test("buffer change affects interface and zone but preserves envelope",()=>{const a=generate(base),b=generate({...base,buffer:3});assert.notEqual(a.candidates[0].interface.width,b.candidates[0].interface.width);assert.equal(a.candidates[0].measures.usableArea,b.candidates[0].measures.usableArea)});
test("reject infeasible and malformed input",()=>{for(const input of [{...base,envelope:{width:5,height:5}},{...base,buffer:-1},{...base,activities:["same","same"]},{...base,envelope:{width:Infinity,height:12}}])assert.throws(()=>generate(input))});
