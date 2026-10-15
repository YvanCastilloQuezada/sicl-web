"use strict";
/** MO-07.3: dual-mission advisory classification; never confuses classification with proof. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {enrich}=require("./arki-mo072-semantic-reconstruction.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const ARCH=/arquitect|espaci|geometr|topolog|diseñ|parti|bim|cad|mep|estructura|territor|gis|clima|terreno|cost|normativ|rvt|ifc|glb|gltf|visual|3d|xr|cámara|gps|planos|tipolog|room|wall|simulaci/i;
const SELF=/conocim|aprendiz|tutor|book|libro|delta|razon|estrateg|evidenc|fuente|ocr|ingesti|idea|backlog|bitácora|ruta|rfc|gobern|version|identidad|core|replay|observaci|voz|llm|human|autoridad|evaluaci|transferencia|capacidad|runtime|conexión|registro/i;
function classify(piece){
 const s=String(piece.name||"")+" "+(piece.purpose?.epistemicStatus==="HISTORICAL_DOCUMENTARY_INTERPRETATION"?String(piece.purpose.text||""):"");
 const a=ARCH.test(s),b=SELF.test(s);
 const missions=[...(a?["SUPER_ARCHITECT"]:[]),...(b?["SELF_SUFFICIENCY"]:[])];
 return {missions:missions.length?missions:["UNRESOLVED"],status:"CANDIDATE_SEMANTIC_CLASSIFICATION",basis:"TITLE_PLUS_DOCUMENTED_PURPOSE_ONLY_NO_GENERATED_HYPOTHESIS",authority:"PO_APPROVAL_REQUIRED"};
}
function assess(registry,roots){
 const previous=enrich(registry,roots);
 const pieces=previous.pieces.map(p=>({...p,missionAssessment:p.id==="I-24"?{missions:["OUT_OF_SCOPE"],status:"EXPLICIT_HISTORICAL_SCOPE_EXCLUSION",basis:"RESEARCH_ONLY_OUT_OF_SCOPE",authority:"PO_APPROVAL_REQUIRED"}:classify(p)}));
 const result={schema:"ARKI-MO073-DUAL-MISSION-CLASSIFICATION-1",sourceReceipt:previous.receiptSha256,
  missions:{SUPER_ARCHITECT:"Multiobjective and multiscale architectural intelligence",SELF_SUFFICIENCY:"Self-inspection, research, learning, testing, correction and operational autonomy"},
  authority:{po:"SOLE_APPROVER_OF_CANONICAL_CHANGES",advisoryResearchAllowed:true,canonicalWrites:false,autonomousPromotion:false},
  counts:{total:pieces.length,both:pieces.filter(p=>p.missionAssessment.missions.length===2).length,unresolved:pieces.filter(p=>p.missionAssessment.missions.includes("UNRESOLVED")).length},
  pieces};result.receiptSha256=sha(result);return result;
}
module.exports={assess,classify};
if(require.main===module){
 const root=path.resolve(__dirname,"../.."),registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(assess(registry,{web:root,core:process.argv[2]||null,acs:process.argv[3]||null}),null,2)+"\n");
}
