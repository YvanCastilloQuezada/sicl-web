"use strict";
// Experimental conceptual design CLI; no source trust, normative approval, AGK execution or canonical mutation.
const fs=require("node:fs"),path=require("node:path");
const {design}=require("./arki-multiscale-design.cjs");
try{
 if(process.argv.length!==4)throw Error("USAGE: node Run-ARKI-Multiscale-Design.cjs brief.json report.json");
 const input=path.resolve(process.argv[2]),output=path.resolve(process.argv[3]);
 if(input===output)throw Error("INPUT_OUTPUT_SAME");
 const stat=fs.lstatSync(input);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>100000)throw Error("UNSAFE_INPUT");
 if(fs.existsSync(output))throw Error("OUTPUT_ALREADY_EXISTS");
 const brief=JSON.parse(fs.readFileSync(input,"utf8"));
 const result=design(brief);
 fs.writeFileSync(output,JSON.stringify(result,null,2)+"\n",{flag:"wx"});
 console.log("ARKI_MULTISCALE_SCALE="+result.scale);
 console.log("ARKI_MULTISCALE_CANDIDATES="+result.candidates.length);
 console.log("ARKI_MULTISCALE_SELECTED="+result.selectedStrategy);
 console.log("ARKI_MULTISCALE_PARETO="+result.paretoStrategies.join(","));
 console.log("ARCHITECTURAL_VERIFICATION=NOT_VERIFIED");
 console.log("AGK_EXECUTION=NOT_EXECUTED");
 console.log("LEARNING_AUTONOMY=NOT_YET_INTEGRATED");
 console.log("CANONICAL_PROMOTION=BLOCKED");
}catch(e){console.error("ARKI_MULTISCALE_FAIL: "+e.message);process.exitCode=1}
