"use strict";
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const root=path.resolve(__dirname,"../..");
const output=path.join(root,"ARKI_HANDOFF.md");
const git=(args)=>cp.execFileSync("git",args,{cwd:root,encoding:"utf8",timeout:15000}).trim();
const sha=git(["rev-parse","HEAD"]),branch=git(["rev-parse","--abbrev-ref","HEAD"]);
const now=new Date().toISOString();
const tracked=git(["log","-12","--format=%H%x09%s%x09%cI"]).split("\n").filter(Boolean).map(line=>{const [sha,subject,at]=line.split("\t");return {sha,subject,at}});
const auditPath=path.join(__dirname,"ARKI_AUDIT_INDEX.json");
const audits=JSON.parse(fs.readFileSync(auditPath,"utf8")).audits;
const lines=[
 "# ARKI_HANDOFF — Punto de entrada para todo nuevo chat",
 "",
 "> GENERADO AUTOMATICAMENTE. Lectura de Git local, no validacion de CI, pruebas ni despliegue.",
 "",
 "## Identidad y ley",
 "ARKI/ARQUI: arquitecto inteligente multiescala, 3D-First, kernel AGK unificado, aprendizaje y evaluacion con evidencia. Antes de crear una capacidad, identificar, auditar y reutilizar la existente. No duplicar fuentes de verdad.",
 "",
 "## Corte de observacion",
 "- Generado: "+now,
 "- Repositorio: YvanCastilloQuezada/sicl-web",
 "- Rama: "+branch,
 "- HEAD observado: "+sha,
 "- Estado de integracion Core: NO_VERIFICADO",
 "- Estado de CI y E3: NO_VERIFICADO",
 "- Estado de dependencias y ruta critica: UNKNOWN",
 "- Promocion canonica: BLOCKED",
 "",
 "## Ultimos commits observados (no equivalen a aprobacion)",
 ...tracked.map(x=>"- `"+x.sha.slice(0,12)+"` · "+x.at+" · "+x.subject.replace(/[\r\n]/g," ")),
 "",
 "## Auditorias registradas (historicas, no revalidadas)",
 ...audits.map(a=>"- "+a.id+" · "+a.topic+" · "+a.reportedVerdict+" · "+a.currentVerification+" · "+(a.sha||"SHA_UNKNOWN")+" · "+a.nextAction),
 "",
 "## Fuente documental y orden de lectura",
 "1. `ARKI_HANDOFF.md` (este archivo; fecha y SHA de corte).",
 "2. `tools/maqueta-viva/ARKI-STRATEGIC-AUDIT-MEMORY.md` (vision y contexto).",
 "3. `tools/maqueta-viva/ARKI_AUDIT_INDEX.json` (auditorias y brechas).",
 "4. `tools/maqueta-viva/ARKI-MEMORY-REUSE-AUDIT.md` (evidencia de reutilizacion de Core).",
 "5. `tools/maqueta-viva/ARKI-MEMORY-REUSE-LAW.md` (ley de no duplicacion).",
 "",
 "## Siguiente trabajo propuesto",
 "Reconciliar memoria institucional y Event Store existentes en sicl-core con la memoria operativa del desarrollo de ARKI. No integrar el prototipo paralelo como autoridad. Construir ingestión verificable, replay, vistas derivadas y exportacion; ejecutar pruebas E2E.",
 "",
 "## Instrucciones al siguiente agente",
 "Comprobar primero el SHA actual y compararlo con este corte; leer fuentes y auditorias; distinguir CLAIM / IMPLEMENTED / EXECUTED / VERIFIED; identificar tareas desbloqueadas; preservar FROZEN y Core; no declarar automatizacion integral sin pruebas.",
 "",
 "## Limites",
 "Este handoff no observa automáticamente repositorios externos ni garantiza que CI, auditorias o estado remoto esten al dia. Si el workflow no corrio, este archivo esta desfasado.",
 ""
];
const body=lines.join("\n");
if(process.argv.includes("--check")){
 if(!fs.existsSync(output)||fs.readFileSync(output,"utf8")!==body){console.error("ARKI_HANDOFF_STALE");process.exit(1)}
 console.log("ARKI_HANDOFF_CURRENT");process.exit(0);
}
fs.writeFileSync(output,body,"utf8");
console.log("ARKI_HANDOFF_GENERATED="+sha);
