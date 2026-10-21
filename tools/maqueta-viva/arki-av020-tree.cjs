"use strict";
/** AV-020 local read-only Tree dashboard. Binds AV-017 proposal and verified AV-019 ledger. */
const http=require("node:http"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {readLedger}=require("./arki-av019-ledger.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function snapshot(proposalFile,ledgerDir){
 const stat=fs.lstatSync(proposalFile);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>3000000)throw Error("UNSAFE_PROPOSAL_FILE");
 const proposal=JSON.parse(fs.readFileSync(proposalFile,"utf8"));
 if(proposal.schema!=="ARKI-AV017-PO-PROPOSAL-1"||!proposal.receiptSha256)throw Error("INVALID_PROPOSAL");
 const {receiptSha256,...body}=proposal;
 if(hash(body)!==receiptSha256||proposal.policy?.approved!==false||proposal.policy?.canonicalMutation!==false||proposal.decision?.status!=="AWAITING_PO"||proposal.scope!=="CONTROLLED_FIXTURE_ONLY")throw Error("UNSAFE_PROPOSAL");
 const events=readLedger(ledgerDir);
 const matching=events.filter(e=>e.decision.proposalReceipt===receiptSha256);
 if(matching.length>1)throw Error("DUPLICATE_PROPOSAL");
 const latest=matching[0]?.decision||null;
 return {schema:"ARKI-AV020-TREE-SNAPSHOT-1",proposal:{receipt:receiptSha256,head:proposal.originalHead,scope:proposal.scope,incident:proposal.incident,alternatives:proposal.alternatives},decision:latest?{status:latest.decisionStatus,selected:latest.selected,action:latest.action,receipt:latest.receiptSha256}:{status:"AWAITING_PO",selected:null},history:{verified:true,events:events.length,head:events.at(-1)?.eventHash||null},gates:{coreWrite:false,canonicalIntegration:false,realDefectRepairProven:false,poIdentityAuthenticated:false}};
}
const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ARKI · Árbol Vivo — Decisiones</title><style>
:root{color-scheme:dark;font:15px system-ui,sans-serif;background:#0c1420;color:#e6eef7}body{margin:0}header{padding:20px 28px;border-bottom:1px solid #334254;background:#152237}h1{font-size:23px;margin:0}small{color:#9fb3c8}main{display:grid;grid-template-columns:240px minmax(320px,1fr) 320px;gap:16px;padding:20px;max-width:1500px;margin:auto}.panel{border:1px solid #35465b;border-radius:12px;background:#152237;padding:18px;min-width:0}h2{font-size:17px;margin-top:0}.phase{padding:8px;border-left:3px solid #4cba87;margin:4px 0;background:#1b2c40}.phase.current{border-color:#ad8aff}.candidate{border:1px solid #45556c;border-radius:9px;padding:12px;margin:12px 0}.good{color:#8ee0b5}.bad{color:#ffb5b5}.mono{font-family:monospace;overflow-wrap:anywhere}button{background:#304b6c;color:white;border:1px solid #557297;border-radius:8px;padding:10px;cursor:pointer}button:focus-visible{outline:3px solid #9fd0ff}dl{display:grid;grid-template-columns:auto 1fr;gap:8px}dt{color:#9fb3c8}dd{margin:0;overflow-wrap:anywhere}@media(max-width:900px){main{grid-template-columns:1fr}} </style></head><body><header><h1>ARKI · Árbol Vivo</h1><small>AV-020 · Mesa de decisiones · Solo lectura · Sin escritura al Core</small></header><main><aside class="panel"><h2>Tronco F1–F10</h2><div id="phases"></div><p><small>Visualización de fases; su madurez no se infiere de las pruebas AV.</small></p></aside><section class="panel"><h2>Expediente experimental</h2><div id="proposal" role="status">Cargando evidencias…</div><button id="reload">Actualizar evidencias</button></section><aside class="panel"><h2>Decisiones y bloqueos</h2><div id="decision"></div><h2>Historial verificable</h2><div id="history"></div><p><small>Las decisiones requieren el flujo externo del PO. Esta pantalla no emite aprobaciones.</small></p></aside></main><script>
const el=id=>document.getElementById(id);
const put=(node,tag,value,cls)=>{const e=document.createElement(tag);e.textContent=String(value);if(cls)e.className=cls;node.append(e);return e};
for(let i=10;i>=1;i--){const p=put(el("phases"),"div","F"+i+" · Estado no verificado","phase"+(i===6?" current":""));p.title="Sin afirmación de madurez";}
async function load(){try{const response=await fetch("/api/tree",{cache:"no-store"});if(!response.ok)throw Error("HTTP "+response.status);const data=await response.json();el("proposal").replaceChildren();el("decision").replaceChildren();el("history").replaceChildren();put(el("proposal"),"p","Alcance: "+data.proposal.scope);put(el("proposal"),"p","Commit: "+data.proposal.head,"mono");put(el("proposal"),"p","Evidencia: "+data.proposal.receipt,"mono");for(const a of data.proposal.alternatives){const card=put(el("proposal"),"div","","candidate");put(card,"strong","Alternativa "+a.id+" · "+a.status,a.status==="PASS"?"good":"bad");put(card,"p",a.label||"Sin descripción");put(card,"small","Reversión: "+(a.rollbackVerified?"verificada":"NO VERIFICADA")+" · Revisión: "+(a.eligibleForReview?"elegible":"bloqueada"));}put(el("decision"),"p","Estado: "+data.decision.status);put(el("decision"),"p","Selección: "+(data.decision.selected||"ninguna"));for(const [k,v] of Object.entries(data.gates))put(el("decision"),"p",(v?"HABILITADO: ":"BLOQUEADO: ")+k,v?"good":"bad");put(el("history"),"p","Eventos: "+data.history.events);put(el("history"),"p","Cadena: "+(data.history.verified?"verificada":"no verificada"));put(el("history"),"small",data.history.head||"Sin decisiones registradas");}catch(err){el("proposal").textContent="Evidencia no disponible: "+err.message;el("decision").textContent="Operación bloqueada";}}
el("reload").addEventListener("click",load);load();
</script></body></html>`;
function start(proposalFile,ledgerDir,port=8765){
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,"http://localhost");
  if(req.method!=="GET"||!["/","/api/tree"].includes(url.pathname)){res.writeHead(404);res.end("Not found");return}
  try{
   if(url.pathname==="/"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(html)}
   else{const data=snapshot(proposalFile,ledgerDir);res.writeHead(200,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(JSON.stringify(data))}
  }catch(e){res.writeHead(503,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});res.end(JSON.stringify({error:"EVIDENCE_UNAVAILABLE",message:e.message}))}
 });
 server.listen(port,"127.0.0.1");return server;
}
module.exports={snapshot,start};
if(require.main===module){try{const [proposal,ledger,portArg]=process.argv.slice(2);if(!proposal||!ledger)throw Error("USAGE: node arki-av020-tree.cjs PROPOSAL_JSON LEDGER_DIR [PORT]");const port=portArg===undefined?8765:Number(portArg);if(!Number.isInteger(port)||port<1024||port>65535)throw Error("INVALID_PORT");snapshot(proposal,ledger);start(proposal,ledger,port);process.stdout.write("ARKI_AV020_READ_ONLY http://127.0.0.1:"+port+"\n")}catch(e){process.stderr.write("ARKI_AV020_FAIL: "+e.message+"\n");process.exitCode=1}}
