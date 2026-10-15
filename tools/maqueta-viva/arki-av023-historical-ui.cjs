"use strict";
/** AV-023: Serve the PO-selected historical AV-UI-001 frontend without rebuilding it. */
const http=require("node:http"),fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process");
const {snapshot}=require("./arki-av020-tree.cjs");
const {project}=require("./arki-mo05-operational.cjs");
const {readContinuity}=require("./arki-mo053-continuity.cjs");
const COMMIT="1de8814382367cbdd8198a496e70ebe66851a02f";
const FILE="tools/maqueta-viva/av-ui-001-readonly-prototype.html";
const STATE="docs/arki-master-map/ARKI_MASTER_MAP_STATE.json";
const REGISTRY="tools/maqueta-viva/assembly-registry.json";
const CATALOG="tools/maqueta-viva/av-ui-001-capability-catalog.json";
function continuityPaths(){const j=process.env.ARKI_MO05_JOURNAL,a=process.env.ARKI_MO05_ANCHOR;return j&&a&&path.isAbsolute(j)&&path.isAbsolute(a)?{journal:j,anchor:a}:null}
function gitShow(root,file){return cp.execFileSync("git",["show",COMMIT+":"+file],{cwd:root,encoding:"utf8",maxBuffer:8*1024*1024,timeout:15000})}
function safeData(raw){const data=JSON.parse(raw);return JSON.stringify(data).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}
function page(root){
 const original=gitShow(root,FILE);
 if(!original.includes("__ARKI_EMBEDDED_STATE__")||!original.includes("__ARKI_EMBEDDED_REGISTRY__")||!original.includes("__ARKI_EMBEDDED_CAPABILITY_CATALOG__"))throw Error("HISTORICAL_FRONTEND_MISMATCH");
 const boot='<script>window.__ARKI_EMBEDDED_STATE__='+safeData(gitShow(root,STATE))+';window.__ARKI_EMBEDDED_REGISTRY__='+safeData(gitShow(root,REGISTRY))+';window.__ARKI_EMBEDDED_CAPABILITY_CATALOG__='+safeData(gitShow(root,CATALOG))+';</script>';
 const operationalBridge=`<script>
(function(){
 const panel=document.createElement("section");panel.id="arki-mo05-operational";panel.setAttribute("aria-label","ARKI estado operativo");
 panel.style.cssText="margin:12px 0;padding:12px;border:1px solid #527b8e;border-radius:9px;background:#10283b;color:#eaf1f7;font:13px system-ui";
 const mount=document.getElementById("arki-proposal-panel");if(!mount)return;mount.prepend(panel);
 async function refresh(){try{const response=await fetch("/api/operational",{cache:"no-store"});if(!response.ok)throw Error("HTTP "+response.status);
 const data=await response.json();if(data.schema!=="ARKI-MO05-OPERATIONAL-PROJECTION-1"||data.policy?.canonicalMutation!==false||data.policy?.poApproval!=="REQUIRED_PER_EXECUTION")throw Error("INVALID_PROJECTION");
 panel.replaceChildren();const h=document.createElement("strong");h.textContent="ARKI · Estado operativo MO-05";panel.append(h);
 const p=document.createElement("p");p.textContent="Plano Vivo: "+data.summary.ordered+"/"+data.summary.total+" ordenadas · "+data.summary.issues+" problemas · ciclos: "+(data.summary.cycle?"sí":"no");panel.append(p);
 const continuity=document.createElement("p");continuity.textContent="Continuidad: "+(data.continuity?.restartStatus||"NO_CONFIGURADA")+" · historial: "+(data.continuity?.history?.length??"sin configurar");panel.append(continuity);
 const list=document.createElement("ol");for(const a of data.views.arbol.activities.slice(0,10)){const li=document.createElement("li");li.textContent=a.id+" · "+a.title+" · antecesoras: "+(a.dependsOn.join(", ")||"ninguna declarada")+" · "+a.dependencyState;list.append(li)}panel.append(list);
 const foot=document.createElement("small");foot.textContent="Solo lectura · ideas liberadas para planificación · ejecución requiere autorización PO · Gemelo no simulado";panel.append(foot);
 }catch(e){panel.textContent="MO-05 no disponible: "+e.message}}
 refresh();const timer=setInterval(()=>{if(!document.hidden)refresh()},15000);window.addEventListener("pagehide",()=>clearInterval(timer),{once:true});
})();
</script>`;
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
 return original.replace("<script>",boot+"\n<script>").replace("</body>",operationalBridge+bridge+"</body>");
}
function start(root,proposal,ledger,port=8768){
 const html=page(root);snapshot(proposal,ledger);
 const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,"http://localhost").pathname;
 if(req.method!=="GET"||!["/","/api/tree","/api/operational"].includes(pathname)){res.writeHead(404);res.end("Not found");return}
 if(pathname==="/"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(html);return}
 try{let data;if(pathname==="/api/operational"){const registry=JSON.parse(gitShow(root,REGISTRY));data=project(registry);const paths=continuityPaths();if(paths){const c=readContinuity(paths.journal,paths.anchor,registry);const {projection,...continuity}=c;data={...data,continuity}}else data={...data,continuity:{restartStatus:"NOT_CONFIGURED",history:{length:0}}}}else data=snapshot(proposal,ledger);res.writeHead(200,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});res.end(JSON.stringify(data))}
 catch(e){res.writeHead(503,{"Content-Type":"application/json"});res.end(JSON.stringify({error:"EVIDENCE_UNAVAILABLE"}))}
 });server.listen(port,"127.0.0.1");return server;
}
module.exports={page,start,COMMIT,FILE};
if(require.main===module){try{const [root,proposal,ledger,portArg]=process.argv.slice(2);if(!root||!proposal||!ledger)throw Error("USAGE: node arki-av023-historical-ui.cjs REPO_ROOT PROPOSAL_JSON LEDGER_DIR [PORT]");const port=portArg?Number(portArg):8768;if(!Number.isInteger(port)||port<1024||port>65535)throw Error("INVALID_PORT");start(path.resolve(root),proposal,ledger,port);process.stdout.write("ARKI_AV023_HISTORICAL_TREE http://127.0.0.1:"+port+"\n")}catch(e){process.stderr.write("ARKI_AV023_FAIL "+e.message+"\n");process.exitCode=1}}
