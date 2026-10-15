"use strict";
/** AV-022 serves the EXISTING Maqueta Viva frontend with same-origin verified AV-020 snapshots. */
const http=require("node:http"),fs=require("node:fs"),path=require("node:path");
const {snapshot}=require("./arki-av020-tree.cjs");
const SENTINEL="render();\n})();";
const INJECTION=`
const av022Update=async()=>{
 try{
  const response=await fetch("/api/tree",{cache:"no-store"});
  if(!response.ok)throw Error("AV022_EVIDENCE_HTTP_"+response.status);
  const incoming=validateAv020Observation(await response.json());
  const old=av020ImportedObservation;
  if(JSON.stringify(old)!==JSON.stringify(incoming)){av020ImportedObservation=incoming;render();}
 }catch(err){
  if(av020ImportedObservation!==null){av020ImportedObservation=null;draftNotice="AV-022: evidencia no disponible o inválida; observación retirada";render();}
 }
};
av022Update();
const av022Timer=setInterval(()=>{if(!document.hidden)av022Update();},15000);
window.addEventListener("pagehide",()=>clearInterval(av022Timer),{once:true});
`;
function integrate(template){
 if(typeof template!=="string"||template.split(SENTINEL).length!==2||!template.includes("function validateAv020Observation(d)")||!template.includes("function av020ObservationPanel()"))throw Error("UNSUPPORTED_ORIGINAL_TEMPLATE");
 return template.replace(SENTINEL,INJECTION+SENTINEL);
}
function start(templatePath,proposalFile,ledgerDir,port=8766){
 const stat=fs.lstatSync(templatePath);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>2000000)throw Error("UNSAFE_TEMPLATE");
 const html=integrate(fs.readFileSync(templatePath,"utf8"));
 snapshot(proposalFile,ledgerDir);
 const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,"http://localhost").pathname;
  if(req.method!=="GET"||!["/","/api/tree"].includes(pathname)){res.writeHead(404,{"Cache-Control":"no-store"});res.end("Not found");return}
  if(pathname==="/"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'self' data: blob: 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'"});res.end(html);return}
  try{const s=snapshot(proposalFile,ledgerDir);res.writeHead(200,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(JSON.stringify(s))}
  catch(e){res.writeHead(503,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});res.end(JSON.stringify({error:"EVIDENCE_UNAVAILABLE"}))}
 });
 server.listen(port,"127.0.0.1");return server;
}
module.exports={integrate,start};
if(require.main===module){try{
 const [template,proposal,ledger,portArg]=process.argv.slice(2);
 if(!template||!proposal||!ledger)throw Error("USAGE: node arki-av022-original-ui.cjs TEMPLATE_HTML PROPOSAL_JSON LEDGER_DIR [PORT]");
 const port=portArg===undefined?8766:Number(portArg);if(!Number.isInteger(port)||port<1024||port>65535)throw Error("INVALID_PORT");
 start(template,proposal,ledger,port);process.stdout.write("ARKI_AV022_ORIGINAL_TREE http://127.0.0.1:"+port+"\n");
 }catch(e){process.stderr.write("ARKI_AV022_FAIL: "+e.message+"\n");process.exitCode=1}}
