"use strict";
/** Read-only GitHub observer tests with deterministic mocked API; no network. */
const assert=require("node:assert/strict");
const {validateInput,observe,observeAll}=require("./verify-github-evidence.cjs");
const sha="a".repeat(40);
const draft={schema:"ARKI-MAQUETA-DRAFT-1",reviews:{"I-01":{repo:"YvanCastilloQuezada/sicl-web",file:"shared/module.ts",sha,test:"pnpm test",dependencies:[]}}};
let count=0;function ok(name,condition){assert(condition,name);count++;console.log("PASS "+name);}
const entry=validateInput(draft)[0];
ok("known review accepted",entry.id==="I-01"&&entry.sha===sha);
for(const [name,change] of [
["short SHA",{sha:"abc"}],["invalid repo",{repo:"not-a-repo"}],["path traversal",{file:"../secret"}],["unknown piece ID",{id:"X-1"}]]){
let copy=JSON.parse(JSON.stringify(draft));
if(change.id){copy.reviews[change.id]=copy.reviews["I-01"];delete copy.reviews["I-01"];}else Object.assign(copy.reviews["I-01"],change);
let rejected=false;try{validateInput(copy);}catch(e){rejected=true;}
ok(name+" rejected",rejected);
}
function mockGet({commit=true,file=true,run=true,head=sha}={}){
const calls=[];
const fetcher=async url=>{
calls.push(url);
let status=200,data;
if(url.includes("/commits/")){status=commit?200:404;data={sha};}
else if(url.includes("/contents/")){status=file?200:404;data={type:"file",sha:"b".repeat(40)};}
else if(url.includes("/actions/runs")){status=run?200:403;data={workflow_runs:[{id:7,head_sha:head,status:"completed",conclusion:"success",name:"smoke"}]};}
else throw Error("unexpected URL");
return {ok:status===200,status,async json(){return data;}};
};
return {fetcher,calls};
}
(async()=>{
const good=mockGet();const a=await observe(entry,good.fetcher,"");
ok("source observed at exact SHA",a.source.status==="OBSERVED_SOURCE_AT_SHA");
ok("successful CI run at exact SHA",a.ci.status==="CI_RUN_SUCCESS_AT_SHA");
ok("no canonical promotion",a.assessment==="READ_ONLY_OBSERVATION_NOT_INTEGRATION_VERIFICATION");
ok("all API calls read-only GET",good.calls.length===3&&good.calls.every(x=>x.startsWith("https://api.github.com/")));
const noFile=await observe(entry,mockGet({file:false}).fetcher,"");
ok("missing source is unknown",noFile.source.status==="UNKNOWN");
const denied=await observe(entry,mockGet({run:false}).fetcher,"");
ok("permission denied CI is unknown",denied.ci.status==="UNKNOWN");
const wrong=await observe(entry,mockGet({head:"c".repeat(40)}).fetcher,"");
ok("unrelated CI run not accepted",wrong.ci.status==="NO_RUN_OBSERVED");
const missing=await observe(entry,mockGet({commit:false}).fetcher,"");
ok("missing commit blocks source and CI",missing.source.status==="UNKNOWN"&&missing.ci.status==="UNKNOWN");
const report=await observeAll(draft,mockGet().fetcher,"");
ok("report carries non-attested warning",report.schema==="ARKI-MAQUETA-GITHUB-OBSERVATION-1"&&report.warning.includes("not attested"));
console.log("RESULT "+count+"/"+count+" PASS (mocked network; no live GitHub verification)");
})().catch(e=>{console.error(e);process.exitCode=1;});
