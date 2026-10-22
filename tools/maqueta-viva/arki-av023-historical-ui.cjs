"use strict";
/** AV-023: Serve the PO-selected historical AV-UI-001 frontend without rebuilding it. */
const http=require("node:http"),fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process");
const {snapshot}=require("./arki-av020-tree.cjs");
const COMMIT="1de8814382367cbdd8198a496e70ebe66851a02f";
const FILE="tools/maqueta-viva/av-ui-001-readonly-prototype.html";
const STATE="docs/arki-master-map/ARKI_MASTER_MAP_STATE.json";
const REGISTRY="tools/maqueta-viva/assembly-registry.json";
const CATALOG="tools/maqueta-viva/av-ui-001-capability-catalog.json";
function gitShow(root,file){return cp.execFileSync("git",["show",COMMIT+":"+file],{cwd:root,encoding:"utf8",maxBuffer:8*1024*1024,timeout:15000})}
const {publicDiagnosis,script:diagnosisScript}=require("./arki-av029-diagnosis-bridge.cjs");
const {publicNeeds,script:needsScript}=require("./arki-av032-needs-bridge.cjs");
const COMMIT="1de8814382367cbdd8198a496e70ebe66851a02f";
const FILE="tools/maqueta-viva/av-ui-001-readonly-prototype.html";
const FROZEN="tools/maqueta-viva/historical/av-ui-001-frozen.html";
const STATE="docs/arki-master-map/ARKI_MASTER_MAP_STATE.json";
const REGISTRY="tools/maqueta-viva/assembly-registry.json";
const CATALOG="tools/maqueta-viva/av-ui-001-capability-catalog.json";
function gitShow(root,file){
 if(file===FILE){
  const frozen=path.join(root,FROZEN);
  if(!fs.existsSync(frozen))throw Error("HISTORICAL_FRONTEND_ASSET_MISSING");
  const html=fs.readFileSync(frozen,"utf8");
  if(!html.includes("ARKI")||!html.includes("__ARKI_EMBEDDED_STATE__"))
   throw Error("HISTORICAL_FRONTEND_ASSET_INVALID");
  return html;
 }
 return cp.execFileSync("git",["show","HEAD:"+file],{
  cwd:root,encoding:"utf8",maxBuffer:8*1024*1024,timeout:15000
 });
}
function safeData(raw){const data=JSON.parse(raw);return JSON.stringify(data).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}
function page(root){
 const original=gitShow(root,FILE);
 if(!original.includes("__ARKI_EMBEDDED_STATE__")||!original.includes("__ARKI_EMBEDDED_REGISTRY__")||!original.includes("__ARKI_EMBEDDED_CAPABILITY_CATALOG__"))throw Error("HISTORICAL_FRONTEND_MISMATCH");
 const boot='<script>window.__ARKI_EMBEDDED_STATE__='+safeData(gitShow(root,STATE))+';window.__ARKI_EMBEDDED_REGISTRY__='+safeData(gitShow(root,REGISTRY))+';window.__ARKI_EMBEDDED_CAPABILITY_CATALOG__='+safeData(gitShow(root,CATALOG))+';</script>';
 const bridge=`<script>
(function(){
 const panel=document.createElement("section");
 panel.id="arki-av023-evidence";
 panel.setAttribute("aria-label","Evidencias verificadas AV");
 panel.style.cssText="margin:12px 0;padding:12px;border:1px solid #55758a;border-radius:9px;background:#10283b;color:#eaf1f7;font:13px system-ui";
 const mount=document.getElementById("arki-proposal-panel");
 if(!mount)throw Error("ARKI_PROPOSAL_PANEL_MISSING");
 mount.prepend(panel);
 const heading=document.createElement("strong");heading.textContent="ARKI · Evidencia experimental AV";panel.append(heading);
 const status=document.createElement("div");status.setAttribute("role","status");panel.append(status);
 const details=document.createElement("div");panel.append(details);
 async function refresh(){
 try{const response=await fetch("/api/tree",{cache:"no-store"});if(!response.ok)throw Error("HTTP "+response.status);
 const data=await response.json();if(data.schema!=="ARKI-AV020-TREE-SNAPSHOT-1"||data.gates?.coreWrite!==false||data.gates?.canonicalIntegration!==false||data.history?.verified!==true)throw Error("INVALID_EVIDENCE");
 status.textContent="Historial: "+data.history.events+" evento(s) · "+data.decision.status;
 details.replaceChildren();
 for(const a of data.proposal.alternatives||[]){const line=document.createElement("p");line.textContent=a.id+" · "+a.status+" · rollback "+(a.rollbackVerified?"sí":"no");details.append(line)}
 const scope=document.createElement("small");scope.textContent="CONTROLLED_FIXTURE_ONLY · Sin autorización de escritura";details.append(scope);
 const head=document.createElement("p");head.textContent="Procedencia: "+data.proposal.head+" · SHA "+data.proposal.receipt;head.style.overflowWrap="anywhere";details.append(head);
 const ledger=document.createElement("p");ledger.textContent="Cadena AV-019: "+(data.history.head||"vacía")+" · "+(data.history.verified?"verificada":"sin verificar");ledger.style.overflowWrap="anywhere";details.append(ledger);
 const gates=document.createElement("small");gates.textContent="Core: BLOQUEADO · AGK: BLOQUEADO · Integración: BLOQUEADA · Identidad PO: NO AUTENTICADA";details.append(gates);
 }catch(err){status.textContent="Evidencia no disponible: "+err.message;details.replaceChildren();}
 }
 refresh();const timer=setInterval(()=>{if(!document.hidden)refresh()},15000);window.addEventListener("pagehide",()=>clearInterval(timer),{once:true});
})();
</script>`;
 if(!original.includes("<script>")||!original.includes("</body>"))throw Error("HISTORICAL_HTML_INVALID");
 return original.replace("<script>",boot+"\n<script>").replace("</body>",bridge+"</body>");
 return original.replace("<script>",boot+"\n<script>").replace("</body>",bridge+diagnosisScript+needsScript+"</body>");
}
function start(root,proposal,ledger,port=8768){
 const html=page(root);snapshot(proposal,ledger);
 const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,"http://localhost").pathname;
 if(req.method!=="GET"||!["/","/api/tree"].includes(pathname)){res.writeHead(404);res.end("Not found");return}
 if(req.method!=="GET"||!["/","/api/tree","/api/diagnosis","/api/needs"].includes(pathname)){res.writeHead(404);res.end("Not found");return}
 if(pathname==="/api/needs"){
  try{
    const result=publicNeeds(root);
    res.writeHead(200,{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":"no-store",
      "X-Content-Type-Options":"nosniff"
    });
    res.end(JSON.stringify(result));
  }catch(error){
    res.writeHead(503,{
      "Content-Type":"application/json",
      "Cache-Control":"no-store"
    });
    res.end(JSON.stringify({
      error:"NEEDS_UNAVAILABLE"
    }));
  }
  return;
 }
 if(pathname==="/api/diagnosis"){
  try{
    const result=publicDiagnosis(root);
    res.writeHead(200,{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":"no-store",
      "X-Content-Type-Options":"nosniff"
    });
    res.end(JSON.stringify(result));
  }catch(e){
    res.writeHead(503,{"Content-Type":"application/json"});
    res.end(JSON.stringify({error:"DIAGNOSIS_UNAVAILABLE"}));
  }
  return;
 }
 if(pathname==="/"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(html);return}
 try{res.writeHead(200,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});res.end(JSON.stringify(snapshot(proposal,ledger)))}
 catch(e){res.writeHead(503,{"Content-Type":"application/json"});res.end(JSON.stringify({error:"EVIDENCE_UNAVAILABLE"}))}
 });server.listen(port,"127.0.0.1");return server;
}
module.exports={page,start,COMMIT,FILE};
if(require.main===module){try{const [root,proposal,ledger,portArg]=process.argv.slice(2);if(!root||!proposal||!ledger)throw Error("USAGE: node arki-av023-historical-ui.cjs REPO_ROOT PROPOSAL_JSON LEDGER_DIR [PORT]");const port=portArg?Number(portArg):8768;if(!Number.isInteger(port)||port<1024||port>65535)throw Error("INVALID_PORT");start(path.resolve(root),proposal,ledger,port);process.stdout.write("ARKI_AV023_HISTORICAL_TREE http://127.0.0.1:"+port+"\n")}catch(e){process.stderr.write("ARKI_AV023_FAIL "+e.message+"\n");process.exitCode=1}}
