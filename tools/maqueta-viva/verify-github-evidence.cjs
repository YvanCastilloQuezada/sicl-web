"use strict";
/**
 * ARKI Maqueta Viva: read-only GitHub evidence observer.
 * Usage: node tools/maqueta-viva/verify-github-evidence.cjs arki-maqueta-borrador.json [arki-maqueta-evidencia.json]
 * Network required; optional GH_TOKEN/GITHUB_TOKEN. No writes to GitHub, no test execution.
 * OBSERVED_SOURCE and CI_RUN_SUCCESS_AT_SHA are not integration verification.
 */
const fs=require("node:fs"),path=require("node:path");
const SCHEMA="ARKI-MAQUETA-GITHUB-OBSERVATION-1";
const hex=/^[a-f0-9]{40}$/i;
function validateInput(draft){
  if(!draft||draft.schema!=="ARKI-MAQUETA-DRAFT-1"||!draft.reviews||typeof draft.reviews!=="object"||Array.isArray(draft.reviews))throw Error("Borrador sin fichas válidas");
  const entries=[];
  for(const [id,r] of Object.entries(draft.reviews)){
    if(!/^(I-\d{2}|HC-\d{2})$/.test(id)||!r||typeof r!=="object")throw Error("ID o ficha inválida");
    if(!/^[\w.-]+\/[\w.-]+$/.test(r.repo||"")||!hex.test(r.sha||"")||typeof r.file!=="string"||!r.file||r.file.startsWith("/")||r.file.split("/").includes("..")||r.file.includes("\\")||r.file.includes("?")||r.file.includes("#"))throw Error("Referencia GitHub inválida para "+id);
    entries.push({id,repo:r.repo,file:r.file,sha:r.sha.toLowerCase(),declared_test:String(r.test||"")});
  }
  if(entries.length>100)throw Error("Demasiadas fichas");
  return entries;
}
function apiPath(...parts){return "https://api.github.com/"+parts.map(p=>String(p).split("/").map(encodeURIComponent).join("/")).join("/");}
async function githubGet(url,fetcher=fetch,token=process.env.GH_TOKEN||process.env.GITHUB_TOKEN||""){
  const headers={"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"arki-maqueta-viva-observer"};
  if(token)headers.Authorization="Bearer "+token;
  try{
    const response=await fetcher(url,{headers,signal:AbortSignal.timeout(15000)});
    if(!response.ok)return {ok:false,http_status:response.status};
    return {ok:true,data:await response.json()};
  }catch(e){return {ok:false,http_status:null,error:"NETWORK_OR_PARSE_ERROR"};}
}
async function observe(entry,fetcher=fetch,token=process.env.GH_TOKEN||process.env.GITHUB_TOKEN||""){
  const root=apiPath("repos",entry.repo);
  const commit=await githubGet(root+"/commits/"+encodeURIComponent(entry.sha),fetcher,token);
  const source={status:"UNKNOWN",http_status:commit.http_status??200};
  if(commit.ok&&String(commit.data.sha||"").toLowerCase()===entry.sha){
    const file=await githubGet(root+"/contents/"+entry.file.split("/").map(encodeURIComponent).join("/")+"?ref="+entry.sha,fetcher,token);
    source.status=file.ok&&file.data.type==="file"?"OBSERVED_SOURCE_AT_SHA":"UNKNOWN";
    source.http_status=file.http_status??200;
    if(file.ok&&file.data.type==="file")source.blob_sha=file.data.sha||null;
  }
  const ci={status:"UNKNOWN",runs_checked:0};
  if(commit.ok&&String(commit.data.sha||"").toLowerCase()===entry.sha){
    const runs=await githubGet(root+"/actions/runs?head_sha="+entry.sha+"&per_page=100",fetcher,token);
    if(runs.ok&&Array.isArray(runs.data.workflow_runs)){
      const exact=runs.data.workflow_runs.filter(r=>String(r.head_sha||"").toLowerCase()===entry.sha);
      ci.runs_checked=exact.length;
      ci.status=exact.some(r=>r.status==="completed"&&r.conclusion==="success")?"CI_RUN_SUCCESS_AT_SHA":
        exact.some(r=>r.status!=="completed")?"CI_PENDING":
        exact.length?"CI_NO_SUCCESS_OBSERVED":"NO_RUN_OBSERVED";
      ci.successful_runs=exact.filter(r=>r.status==="completed"&&r.conclusion==="success").map(r=>({id:r.id,name:r.name,url:r.html_url||null})).slice(0,20);
    }
  }
  return {id:entry.id,repo:entry.repo,file:entry.file,sha:entry.sha,declared_test:entry.declared_test,source,ci,assessment:"READ_ONLY_OBSERVATION_NOT_INTEGRATION_VERIFICATION"};
}
async function observeAll(draft,fetcher=fetch,token=""){
  const entries=validateInput(draft),observations=[];
  for(const e of entries)observations.push(await observe(e,fetcher,token));
  return {schema:SCHEMA,observed_at:new Date().toISOString(),authority:"READ_ONLY_EXTERNAL_GITHUB_OBSERVATION",warning:"An imported report is not attested by the offline browser. A successful CI run does not prove that the declared test was executed. No canonical integration or debt clearance.",observations};
}
async function main(){
  const input=process.argv[2],output=process.argv[3]||"arki-maqueta-evidencia.json";
  if(!input)throw Error("Uso: node tools/maqueta-viva/verify-github-evidence.cjs <borrador.json> [salida.json]");
  const draft=JSON.parse(fs.readFileSync(path.resolve(input),"utf8"));
  const report=await observeAll(draft,fetch,process.env.GH_TOKEN||process.env.GITHUB_TOKEN||"");
  fs.writeFileSync(path.resolve(output),JSON.stringify(report,null,2)+"\n",{flag:"w"});
  console.log("ARKI GitHub observation: "+report.observations.length+" fichas. Salida: "+path.resolve(output));
  for(const x of report.observations)console.log(x.id+" SOURCE="+x.source.status+" CI="+x.ci.status+" (NO CANONICAL PROMOTION)");
}
if(require.main===module)main().catch(e=>{console.error("ERROR: "+e.message);process.exitCode=1;});
module.exports={SCHEMA,validateInput,githubGet,observe,observeAll};
