#!/usr/bin/env node
"use strict";
/* Read-only ARKI continuity snapshot. Git is evidence of commits, not of decisions or CI success. */
const fs=require("node:fs"),cp=require("node:child_process"),path=require("node:path");
const root=path.resolve(__dirname,"../..");
function git(args){return cp.execFileSync("git",args,{cwd:root,encoding:"utf8",timeout:30000,maxBuffer:16*1024*1024}).trim();}
function lines(s){return s?s.split("\n").filter(Boolean):[];}
function safe(s){return String(s).replace(/[\r\n|]/g," ").slice(0,200);}
function loadLedger(){const p=path.join(root,"docs/arki-master-map/ARKI_CONTINUITY_EVENTS.jsonl");return fs.existsSync(p)?lines(fs.readFileSync(p,"utf8")).map((s,i)=>{let v;try{v=JSON.parse(s)}catch{throw Error("Invalid event line "+(i+1))}if(!v.id||!v.at||!v.kind||!v.summary||!v.evidence)throw Error("Incomplete event line "+(i+1));return v}):[];}
function build(){const sha=git(["rev-parse","HEAD"]),branch=git(["rev-parse","--abbrev-ref","HEAD"]);
 const history=lines(git(["log","-80","--format=%H%x09%cI%x09%s"])).map(s=>{const [sha,at,...rest]=s.split("\t");return {sha,at,summary:rest.join(" ")}});const events=loadLedger();
 const seen=new Set();for(const e of events){if(seen.has(e.id))throw Error("Duplicate event "+e.id);seen.add(e.id);}
 const latest=history[0]||null;
 const out=["# ARKI — MAPA VIVO DE CONTINUIDAD","","> GENERADO A PARTIR DE GIT + EVENTOS DECLARADOS. No es el Event Store canónico del Core. No verifica CI, arquitectura ni despliegue.","","## Cómo retomar en un nuevo chat","1. Leer este documento y el historial `ARKI_CONTINUITY_EVENTS.jsonl`.","2. Comprobar SHA remoto y CI; no asumir que una declaración es evidencia ejecutada.","3. Continuar desde pendientes sin repetir inventarios ya documentados.","","## Estado observado",`- Rama: \`${safe(branch)}\``,`- SHA observado: \`${sha}\``,`- Último commit: ${latest?safe(latest.at)+" — "+safe(latest.summary):"UNKNOWN"}`,"- Estado de Core/D-2/AGK: NOT_VERIFIED","- CI exacto y E2E: NOT_VERIFIED","- Promoción canónica: NO_AUTORIZADA_POR_ESTE_MAPA","", "## Decisiones y acciones explícitamente registradas (orden del ledger)"];
 for(const e of events)out.push(`- **${safe(e.at)}** [${safe(e.kind)}] ${safe(e.id)} — ${safe(e.summary)}; evidencia: ${safe(e.evidence)}; estado: ${safe(e.status||"UNKNOWN")}`);
 out.push("","## Últimos 80 commits observados (no son aprobación)");
 for(const c of history)out.push(`- ${safe(c.at)} — \`${c.sha.slice(0,12)}\` — ${safe(c.summary)}`);
 out.push("","## Fuentes complementarias","- `docs/arki-master-map/ARKI_M10_001_MACROORDERS.md` — ruta de macroórdenes.","- `docs/arki-master-map/ARKI_BOLSA_IDEAS_DOBLE_FECHA_ESTADO_BIC_008.md` — doble fecha de ideas.","- `docs/arki-master-map/ARKI_BOLSA_IDEAS_CRONOLOGIA_BIC_007.md` — cronología verificada.","- `docs/arki-master-map/ARKI_CONTINUITY_EVENTS.jsonl` — eventos declarados; nunca sustituye eventos Core.","","## Pendientes de continuidad","- Conectar captura automática de decisiones de conversación con autorización y trazabilidad.","- Verificar CI del workflow y lectura en un chat nuevo.","- Reconciliar la continuidad documental con el Event Store Core sin duplicarlo.","");
 return out.join("\n");
}
function main(){const output=path.join(root,"docs/arki-master-map/ARKI_MAPA_VIVO_CONTINUIDAD.md");const generated=build();if(process.argv.includes("--check")){if(!fs.existsSync(output)||fs.readFileSync(output,"utf8")!==generated)process.exitCode=1;return;}fs.writeFileSync(output,generated);console.log("ARKI continuity snapshot generated");}
if(require.main===module)main();
module.exports={build,loadLedger};
