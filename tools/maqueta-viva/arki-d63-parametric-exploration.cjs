"use strict";
/** Exploratory 2D spatial partitioning, NOT AGK, BIM, or regulatory validation. */
const crypto=require("node:crypto");
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function generate(input){
 if(!input||!input.envelope||!Number.isFinite(input.envelope.width)||!Number.isFinite(input.envelope.height)||input.envelope.width<=0||input.envelope.height<=0)throw Error("INVALID_ENVELOPE");
 const {width:w,height:h}=input.envelope;
 const margin=input.margin??0.5,buffer=input.buffer??1,minimum=input.minimumZoneDepth??2;
 for(const [k,v] of Object.entries({margin,buffer,minimum}))if(!Number.isFinite(v)||v<=0)throw Error("INVALID_"+k.toUpperCase());
 if(!Array.isArray(input.activities)||input.activities.length!==2||input.activities.some(x=>typeof x!=="string"||!x.trim())||new Set(input.activities).size!==2)throw Error("TWO_DISTINCT_ACTIVITIES_REQUIRED");
 const usableW=w-2*margin,usableH=h-2*margin;
 if(usableW<2*minimum+buffer||usableH<2*minimum+buffer)throw Error("INFEASIBLE_ENVELOPE");
 const x=margin,y=margin,halfW=(usableW-buffer)/2,halfH=(usableH-buffer)/2;
 const rect=(rx,ry,rw,rh)=>({x:rx,y:ry,width:rw,height:rh,area:rw*rh});
 const variants=[
 {id:"LATERAL",zones:[rect(x,y,halfW,usableH),rect(x+halfW+buffer,y,halfW,usableH)],interface:rect(x+halfW,y,buffer,usableH)},
 {id:"TRANSVERSE",zones:[rect(x,y,usableW,halfH),rect(x,y+halfH+buffer,usableW,halfH)],interface:rect(x,y+halfH,usableW,buffer)},
 {id:"ASYMMETRIC_LATERAL",zones:[rect(x,y,minimum,usableH),rect(x+minimum+buffer,y,usableW-minimum-buffer,usableH)],interface:rect(x+minimum,y,buffer,usableH)}
 ];
 const inside=r=>r.x>=0&&r.y>=0&&r.x+r.width<=w+1e-9&&r.y+r.height<=h+1e-9&&r.width>0&&r.height>0;
 const overlap=(a,b)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height;
 const candidates=variants.map(v=>{
  const parts=[...v.zones,v.interface],valid=parts.every(inside)&&parts.every((a,i)=>parts.every((b,j)=>i===j||!overlap(a,b)));
  const measures={zoneAreas:v.zones.map(z=>z.area),interfaceArea:v.interface.area,usableArea:usableW*usableH,areaClosureError:Math.abs(parts.reduce((s,r)=>s+r.area,0)-usableW*usableH)};
  return {id:v.id,zones:v.zones.map((geometry,i)=>({activity:input.activities[i],geometry})),interface:v.interface,measures,geometricValidity:valid&&measures.areaClosureError<1e-7?"PASS":"FAIL",functionalValidity:"UNKNOWN",regulatoryValidity:"NOT_EVALUATED",architecturalQuality:"NOT_EVALUATED"};
 });
 if(candidates.some(c=>c.geometricValidity!=="PASS"))throw Error("INTERNAL_GEOMETRY_VALIDATION_FAILED");
 const output={schema:"ARKI-D63-PARAMETRIC-EXPLORATION-1",input,candidates,engine:"ANALYTICAL_2D_ONLY_NOT_AGK",canonicalMutation:false,poApproval:"NOT_GRANTED",knowledgePromotion:false};
 output.receiptSha256=digest(output);return output;
}
module.exports={generate};
if(require.main===module){try{const fs=require("node:fs");if(process.argv.length!==3)throw Error("USAGE: node arki-d63-parametric-exploration.cjs INPUT_JSON");const p=process.argv[2],s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>1024*1024)throw Error("UNSAFE_INPUT");process.stdout.write(JSON.stringify(generate(JSON.parse(fs.readFileSync(p,"utf8"))),null,2)+"\n")}catch(e){process.stderr.write("D63_PARAMETRIC_FAIL: "+e.message+"\n");process.exitCode=1}}
