"use strict";

const crypto=require("node:crypto");

const {
  publicDiagnosis
}=require("./arki-av029-diagnosis-bridge.cjs");

const sha256=value=>crypto
  .createHash("sha256")
  .update(JSON.stringify(value))
  .digest("hex");

const STRATEGY_TEMPLATES=Object.freeze([
  {
    id:"A",
    type:"EVIDENCE_DISCOVERY",
    title:"Localizar evidencia existente",
    description:
      "Inspeccionar contratos, pruebas y artefactos " +
      "existentes antes de proponer implementación."
  },
  {
    id:"B",
    type:"ISOLATED_EXPERIMENT",
    title:"Diseñar prueba aislada",
    description:
      "Especificar una prueba reproducible fuera " +
      "del estado canónico."
  },
  {
    id:"C",
    type:"DEPENDENCY_RESEARCH",
    title:"Investigar dependencias",
    description:
      "Identificar requisitos y bloqueos, sin " +
      "asumir compatibilidad ni cobertura."
  }
]);

function assertDiagnosis(d){
  if(!d || d.schema!=="ARKI-AV029-DIAGNOSIS-1")
    throw Error("INVALID_DIAGNOSIS_SCHEMA");

  if(
    d.policy?.canonicalWrite!==false ||
    d.policy?.automaticRepair!==false ||
    d.policy?.poApproval!=="REQUIRED"
  )throw Error("UNSAFE_DIAGNOSIS_POLICY");

  if(!Array.isArray(d.unknowns) ||
     !Array.isArray(d.checks))
    throw Error("INVALID_DIAGNOSIS_COLLECTIONS");

  const ids=new Set();

  for(const item of [...d.unknowns,...d.checks]){
    if(typeof item.id!=="string" ||
       !/^[A-Z][A-Z0-9_]*$/.test(item.id))
      throw Error("INVALID_NEED_ID");

    if(ids.has(item.id))
      throw Error("DUPLICATE_NEED_ID");

    ids.add(item.id);
  }

  for(const item of d.unknowns){
    if(item.status!=="UNKNOWN")
      throw Error("UNKNOWN_STATUS_MISMATCH");
  }

  for(const item of d.checks){
    if(!["PASS","FAIL"].includes(item.status))
      throw Error("CHECK_STATUS_MISMATCH");
  }
}

function makeStrategies(){
  return STRATEGY_TEMPLATES.map(t=>({
    ...t,
    status:"HYPOTHESIS",
    evidenceVerified:false,
    metricsVerified:false,
    executionAuthorized:false,
    geometryMutation:false,
    canonicalWrite:false
  }));
}

function makeNeed(item,sourceType,head){
  const id="AV031-N-"+item.id;

  const blocked=sourceType==="UNKNOWN";

  return {
    id,
    sourceId:item.id,
    sourceType,
    sourceHead:head,
    title:item.id.replaceAll("_"," "),
    diagnosisStatus:item.status,
    evidence:{
      source:"AV029_DIAGNOSIS",
      sourceCheck:item.id,
      detail:item.reason||item.detail||null,
      verification:"NOT_INDEPENDENTLY_VERIFIED"
    },
    phaseMapping:{
      phases:[],
      status:"UNRESOLVED",
      rationale:
        "No se asigna F1-F10 sin evidencia de trazabilidad."
    },
    dependencies:{
      required:[],
      verified:[],
      unresolved:true,
      status:"UNKNOWN"
    },
    priority:{
      value:null,
      status:"NOT_EVALUATED"
    },
    strategies:makeStrategies(),
    state:blocked
      ?"RESEARCH_REQUIRED"
      :"FAILURE_REVIEW_REQUIRED",
    promotion:"BLOCKED",
    propagation:"BLOCKED",
    executionAuthorized:false,
    poApproval:"REQUIRED"
  };
}

function buildNeeds(diagnosis){
  assertDiagnosis(diagnosis);

  const sources=[
    ...diagnosis.unknowns.map(x=>[x,"UNKNOWN"]),
    ...diagnosis.checks
      .filter(x=>x.status==="FAIL")
      .map(x=>[x,"FAIL"])
  ];

  const needs=sources
    .map(([item,type])=>
      makeNeed(item,type,diagnosis.head))
    .sort((a,b)=>a.id.localeCompare(b.id));

  const result={
    schema:"ARKI-AV031-NEEDS-1",
    source:{
      schema:diagnosis.schema,
      head:diagnosis.head,
      receiptSha256:diagnosis.receiptSha256
    },
    summary:{
      total:needs.length,
      unknown:needs.filter(x=>
        x.sourceType==="UNKNOWN").length,
      failed:needs.filter(x=>
        x.sourceType==="FAIL").length,
      pendingApproval:needs.length,
      executable:0
    },
    needs,
    gates:{
      readOnly:true,
      agkOnly:true,
      frozenPreserved:true,
      canonicalWrite:false,
      automaticRepair:false,
      dependencyPropagation:false,
      poApprovalRequired:true
    }
  };

  result.receiptSha256=sha256(result);
  return result;
}

function fromRepository(root){
  return buildNeeds(publicDiagnosis(root));
}

module.exports={
  buildNeeds,
  fromRepository,
  assertDiagnosis
};

if(require.main===module){
  const root=process.argv[2];
  if(!root){
    console.error(
      "USAGE: node arki-av031-needs-engine.cjs REPO"
    );
    process.exit(1);
  }

  try{
    console.log(
      JSON.stringify(fromRepository(root),null,2)
    );
  }catch(error){
    console.error("ARKI_AV031_FAIL:",error.message);
    process.exitCode=1;
  }
}
