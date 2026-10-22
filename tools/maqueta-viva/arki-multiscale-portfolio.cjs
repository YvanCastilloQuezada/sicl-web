"use strict";
/**
 * Multiscale conceptual dependency fabric. Every scale retains its own
 * evidence and rules; parent edits invalidate descendants for reevaluation.
 */
const {SCALES,design}=require("./arki-multiscale-design.cjs");
function assert(ok,msg){if(!ok)throw Error(msg)}
function buildPortfolio(briefs){
 assert(Array.isArray(briefs)&&briefs.length>0&&briefs.length<=100,"INVALID_PORTFOLIO");
 const designs=briefs.map(b=>design(b));
 const map=new Map();
 for(const d of designs){assert(!map.has(d.briefId),"DUPLICATE_BRIEF");map.set(d.briefId,d)}
 const edges=[];
 for(const d of designs){
  if(!d.parent)continue;
  const p=map.get(d.parent.id);
  assert(p&&p.scale===d.parent.scale&&SCALES[d.scale].parent===p.scale,"MISSING_OR_INVALID_PARENT");
  edges.push({from:p.briefId,to:d.briefId,kind:"CONCEPTUAL_SCALE_DEPENDENCY",verified:false});
 }
 return {schema:"ARKI-MULTISCALE-PORTFOLIO-1",designs,edges,canonicalMutation:false,canonicalPromotion:"BLOCKED",scaleNorms:"SEPARATE_UNVERIFIED_CHECKS"};
}
function impact(portfolio,changedId){
 assert(portfolio&&portfolio.schema==="ARKI-MULTISCALE-PORTFOLIO-1","INVALID_PORTFOLIO");
 assert(portfolio.designs.some(d=>d.briefId===changedId),"UNKNOWN_CHANGED_NODE");
 const affected=new Set(),queue=[changedId];
 while(queue.length){const id=queue.shift();for(const edge of portfolio.edges.filter(e=>e.from===id)){if(!affected.has(edge.to)){affected.add(edge.to);queue.push(edge.to)}}}
 return {schema:"ARKI-MULTISCALE-IMPACT-1",changedId,affected:[...affected],action:"RECOMPUTE_AND_REVERIFY_DESCENDANTS",automaticCanonicalUpdate:false,canonicalMutation:false};
}
module.exports={buildPortfolio,impact};
