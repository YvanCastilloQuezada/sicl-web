"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {cluster,terms}=require("./arki-mo078-branch-reconciliation.cjs");
test("MO078 retains five source versions and requires PO",()=>{
 const versions=Array.from({length:5},(_,i)=>({repository:"web",ref:"refs/heads/idea-"+i,path:"ideas.md",line:i+1,kind:"IDEA",title:"Aprendizaje espacial autónomo",terms:terms("Aprendizaje espacial autónomo")}));
 const groups=cluster(versions);
 assert.equal(groups.length,1);assert.equal(groups[0].versions.length,5);
 assert.equal(groups[0].approval,"PO_REQUIRED");assert.equal(groups[0].canonicalMutation,false);
 assert.equal(groups[0].enhancedProposal.uniqueContributions,"NOT_YET_ESTABLISHED");
});
test("MO078 avoids single-token overlap and invented merging",()=>{
 assert.equal(cluster([{repository:"web",ref:"a",path:"x",line:1,kind:"IDEA",terms:["geometry"]}]).length,0);
});
