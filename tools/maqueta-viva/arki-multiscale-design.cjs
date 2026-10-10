"use strict";
/**
 * ARKI experimental multiscale conceptual designer.
 * Deterministic geometry and adaptive strategy preference; no AGK/Core mutation.
 * No normative, engineering, environmental or real-world performance verification.
 */
const crypto=require("node:crypto");
const SCHEMA="ARKI-MULTISCALE-DESIGN-1";
const SCALES=Object.freeze({
 OBJECT:{parent:"INTERIOR",concept:"PRODUCT",minArea:0.01,maxArea:100},
 INTERIOR:{parent:"ARCHITECTURE",concept:"INTERIOR",minArea:1,maxArea:100000},
 ARCHITECTURE:{parent:"URBANISM",concept:"BUILDING",minArea:10,maxArea:1000000},
 LANDSCAPE:{parent:"URBANISM",concept:"LANDSCAPE",minArea:10,maxArea:100000000},
 URBANISM:{parent:"REGIONAL",concept:"CITY",minArea:100,maxArea:1000000000},
 REGIONAL:{parent:"MACROREGIONAL",concept:"REGION",minArea:10000,maxArea:1000000000000},
 MACROREGIONAL:{parent:null,concept:"MACROREGION",minArea:1000000,maxArea:100000000000000}
});
const STRATEGIES=["COMPACT","LINEAR","COURTYARD","CLUSTER"];
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function guard(ok,reason){if(!ok)throw Error(reason)}
function normalize(raw){
 guard(raw&&raw.schema==="ARKI-MULTISCALE-BRIEF-1","INVALID_BRIEF_SCHEMA");
 guard(typeof raw.id==="string"&&/^[a-zA-Z0-9_-]{1,80}$/.test(raw.id),"INVALID_BRIEF_ID");
 guard(Object.hasOwn(SCALES,raw.scale),"INVALID_SCALE");
 guard(typeof raw.sourceCommit==="string"&&/^[a-f0-9]{40}$/.test(raw.sourceCommit),"INVALID_SOURCE_COMMIT");
 const s=SCALES[raw.scale],site=raw.site;
 guard(site&&Number.isFinite(site.widthM)&&Number.isFinite(site.depthM)&&site.widthM>0&&site.depthM>0,"INVALID_SITE");
 const area=site.widthM*site.depthM;
 guard(Number.isFinite(area)&&area>=s.minArea&&area<=s.maxArea,"SITE_AREA_OUTSIDE_SCALE");
 guard(raw.program&&Number.isInteger(raw.program.units)&&raw.program.units>=1&&raw.program.units<=64,"INVALID_PROGRAM");
 guard(Number.isFinite(raw.program.targetCoverage)&&raw.program.targetCoverage>=0.05&&raw.program.targetCoverage<=0.85,"INVALID_COVERAGE");
 const objectives=raw.objectives;
 guard(objectives&&Number.isFinite(objectives.compactness)&&Number.isFinite(objectives.openSpace)&&Number.isFinite(objectives.connectivity),"INVALID_OBJECTIVES");
 guard(Math.abs(objectives.compactness+objectives.openSpace+objectives.connectivity-1)<1e-8&&Object.values(objectives).every(x=>x>=0&&x<=1),"INVALID_OBJECTIVE_WEIGHTS");
 guard(raw.constraints&&Number.isFinite(raw.constraints.maxCoverage)&&raw.constraints.maxCoverage>=0.05&&raw.constraints.maxCoverage<=0.9,"INVALID_MAX_COVERAGE");
 guard(Array.isArray(raw.constraints.requiredChecks)&&raw.constraints.requiredChecks.length<=30&&raw.constraints.requiredChecks.every(x=>typeof x==="string"&&x.length>0&&x.length<=100),"INVALID_REQUIRED_CHECKS");
 const parent=raw.parent||null;
 guard(parent===null||(typeof parent.id==="string"&&parent.id.length>0&&parent.scale===s.parent),"INVALID_PARENT_SCALE");
 return {schema:raw.schema,id:raw.id,scale:raw.scale,sourceCommit:raw.sourceCommit,site:{widthM:site.widthM,depthM:site.depthM},program:{units:raw.program.units,targetCoverage:raw.program.targetCoverage},objectives:{...objectives},constraints:{maxCoverage:raw.constraints.maxCoverage,requiredChecks:[...raw.constraints.requiredChecks]},parent};
}
const round=x=>Number(x.toPrecision(12));
function geometry(brief,strategy){
 const {widthM:w,depthM:d}=brief.site;
 const desired=Math.min(brief.program.targetCoverage,brief.constraints.maxCoverage);
 const cells=[],unitCount=brief.program.units;
 // Rectangles are normalized within the site. Strategies encode distinct spatial organizations.
 if(strategy==="COMPACT"){
  const side=Math.sqrt(desired),cols=Math.ceil(Math.sqrt(unitCount)),rows=Math.ceil(unitCount/cols);
  for(let i=0;i<unitCount;i++){const c=i%cols,r=Math.floor(i/cols);cells.push([0.5-side/2+c*side/cols,0.5-side/2+r*side/rows,side/cols,side/rows])}
 }else if(strategy==="LINEAR"){
  const band=Math.min(desired,0.8);
  for(let i=0;i<unitCount;i++)cells.push([0.1+i*0.8/unitCount,0.5-band/2,0.8/unitCount,band]);
 }else if(strategy==="COURTYARD"){
  const ring=Math.min(0.2,desired/2),side=0.8;
  // Divide perimeter into unitCount angular positions with small isolated rectangular volumes.
  const r=Math.min(0.36,Math.max(0.15,Math.sqrt(desired/(unitCount*4))));
  const cellSide=Math.min(0.18,Math.sqrt(desired/unitCount));
  for(let i=0;i<unitCount;i++){const a=2*Math.PI*i/unitCount;cells.push([0.5+r*Math.cos(a)-cellSide/2,0.5+r*Math.sin(a)-cellSide/2,cellSide,cellSide])}
 }else{
  const cols=Math.ceil(Math.sqrt(unitCount)),rows=Math.ceil(unitCount/cols);
  const side=Math.min(0.18,Math.sqrt(desired/unitCount));
  for(let i=0;i<unitCount;i++){const c=i%cols,r=Math.floor(i/cols);cells.push([0.1+(cols===1?0.4:c*0.8/(cols-1))-side/2,0.1+(rows===1?0.4:r*0.8/(rows-1))-side/2,side,side])}
 }
 const shapes=cells.map(([x,y,cw,ch],i)=>({id:"U"+(i+1),type:"CONCEPTUAL_RECTANGLE",xM:round(x*w),yM:round(y*d),widthM:round(cw*w),depthM:round(ch*d)}));
 const invalid=shapes.some(s=>s.xM<0||s.yM<0||s.xM+s.widthM>w+1e-7||s.yM+s.depthM>d+1e-7);
 // Detect overlap; not a geometric union algorithm.
 let overlap=false;
 for(let i=0;i<shapes.length;i++)for(let j=i+1;j<shapes.length;j++){
  const a=shapes[i],b=shapes[j];
  if(Math.min(a.xM+a.widthM,b.xM+b.widthM)-Math.max(a.xM,b.xM)>1e-7&&Math.min(a.yM+a.depthM,b.yM+b.depthM)-Math.max(a.yM,b.yM)>1e-7)overlap=true;
 }
 const occupied=shapes.reduce((sum,s)=>sum+s.widthM*s.depthM,0),siteArea=w*d;
 const coverage=occupied/siteArea;
 const centroids=shapes.map(s=>[s.xM+s.widthM/2,s.yM+s.depthM/2]);
 let distance=0,links=0;
 for(let i=1;i<centroids.length;i++){distance+=Math.hypot(centroids[i][0]-centroids[i-1][0],centroids[i][1]-centroids[i-1][1]);links++}
 const compactness=Math.min(1,Math.sqrt(Math.max(0,coverage)));
 const openSpace=Math.max(0,1-coverage);
 const connectivity=links===0?1:Math.max(0,1-distance/(links*Math.hypot(w,d)));
 const metrics={coverage:round(coverage),compactness:round(compactness),openSpace:round(openSpace),connectivity:round(connectivity)};
 const failures=[...(invalid?["OUT_OF_SITE"]:[]),...(overlap?["GEOMETRY_OVERLAP"]:[]),...(coverage>brief.constraints.maxCoverage+1e-8?["MAX_COVERAGE"]:[])];
 return {strategy,shapes,metrics,failures,valid:failures.length===0};
}
function score(candidate,weights){
 const m=candidate.metrics;
 return round(m.compactness*weights.compactness+m.openSpace*weights.openSpace+m.connectivity*weights.connectivity);
}
function design(raw,memory=[],verifyLearning){
 const brief=normalize(raw);
 guard(Array.isArray(memory)&&memory.length<=100,"INVALID_MEMORY");
 const relevant=memory.filter(x=>x&&x.schema==="ARKI-MULTISCALE-LEARNING-1"&&x.scale===brief.scale&&STRATEGIES.includes(x.strategy)&&x.evidenceStatus==="INDEPENDENTLY_VERIFIED"&&x.sourceCommit===brief.sourceCommit&&typeof verifyLearning==="function"&&verifyLearning(x)===true);
 const candidates=STRATEGIES.map(strategy=>{
  const g=geometry(brief,strategy),historical=relevant.filter(x=>x.strategy===strategy);
  const adjustment=historical.length?historical.reduce((s,x)=>s+x.reward,0)/historical.length:0;
  guard(Number.isFinite(adjustment)&&Math.abs(adjustment)<=1,"INVALID_LEARNING_REWARD");
  return {...g,objectiveScore:score(g,brief.objectives),historicalAdjustment:round(adjustment*0.1),rankingScore:g.valid?round(score(g,brief.objectives)+adjustment*0.1):null};
 });
 const ranked=candidates.filter(x=>x.valid).sort((a,b)=>b.rankingScore-a.rankingScore||STRATEGIES.indexOf(a.strategy)-STRATEGIES.indexOf(b.strategy));
 const selected=ranked[0]||null;
 return {schema:SCHEMA,briefId:brief.id,scale:brief.scale,parent:brief.parent,sourceCommit:brief.sourceCommit,briefDigest:hash(brief),candidates,selectedStrategy:selected?.strategy||null,selectedGeometry:selected?.shapes||[],selectedMetrics:selected?.metrics||null,requiredChecks:brief.constraints.requiredChecks.map(id=>({id,status:"NOT_VERIFIED",jurisdiction:"NOT_RESOLVED"})),status:selected?"CONCEPTUAL_PROPOSAL":"NO_VALID_CANDIDATE",simulation:"HEURISTIC_ONLY",learning:"VERIFIED_FEEDBACK_ONLY",canonicalPromotion:"BLOCKED",canonicalMutation:false};
}
function learn(result,feedback,verifyEvidence){
 guard(result&&result.schema===SCHEMA&&result.canonicalMutation===false,"INVALID_DESIGN_RESULT");
 guard(feedback&&feedback.schema==="ARKI-MULTISCALE-FEEDBACK-1"&&feedback.briefDigest===result.briefDigest&&feedback.sourceCommit===result.sourceCommit,"FEEDBACK_MISMATCH");
 guard(STRATEGIES.includes(feedback.strategy)&&result.candidates.some(c=>c.strategy===feedback.strategy&&c.valid),"INVALID_FEEDBACK_STRATEGY");
 guard(Number.isFinite(feedback.reward)&&feedback.reward>=-1&&feedback.reward<=1,"INVALID_REWARD");
 guard(feedback.verifier==="EXTERNAL"&&feedback.evidenceStatus==="INDEPENDENTLY_VERIFIED"&&/^[a-f0-9]{64}$/.test(feedback.evidenceDigest||""),"UNVERIFIED_FEEDBACK");
 guard(typeof verifyEvidence==="function"&&verifyEvidence(feedback)===true,"INDEPENDENT_VERIFICATION_REQUIRED");
 // External callback must authenticate evidence, not merely inspect the label.
 return {schema:"ARKI-MULTISCALE-LEARNING-1",scale:result.scale,strategy:feedback.strategy,sourceCommit:result.sourceCommit,briefDigest:result.briefDigest,reward:feedback.reward,evidenceDigest:feedback.evidenceDigest,evidenceStatus:"INDEPENDENTLY_VERIFIED",verificationClaimOnly:false,canonicalPromotion:"BLOCKED",canonicalMutation:false};
}
module.exports={SCHEMA,SCALES,STRATEGIES,normalize,geometry,design,learn};
