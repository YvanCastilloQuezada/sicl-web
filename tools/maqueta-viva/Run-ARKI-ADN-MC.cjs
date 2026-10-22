"use strict";
/** One-shot self-proposal from independently supplied observations. No scheduler, no Core/AGK writes. */
const fs=require("node:fs");
const path=require("node:path");
const {propose,iterate}=require("./arki-adn-mejora-continua.cjs");
try{
 if(process.argv.length!==4)throw Error("USAGE: node Run-ARKI-ADN-MC.cjs observation.json output.json");
 const input=path.resolve(process.argv[2]),output=path.resolve(process.argv[3]);
 if(input===output)throw Error("OUTPUT_MUST_DIFFER_FROM_INPUT");
 if(fs.statSync(input).size>100000)throw Error("OBSERVATION_TOO_LARGE");
 if(fs.existsSync(output))throw Error("OUTPUT_ALREADY_EXISTS");
 const observation=JSON.parse(fs.readFileSync(input,"utf8"));
 const proposals=propose(observation),cycle=iterate(observation);
 const report={schema:"ARKI-ADN-MC-REPORT-1",proposals,cycle,producer:"EXPERIMENTAL_DETERMINISTIC_REFERENCE",autonomousInitiation:false,learningVerified:false,canonicalPromotion:"BLOCKED",canonicalMutation:false};
 fs.writeFileSync(output,JSON.stringify(report,null,2)+"\n",{encoding:"utf8",flag:"wx"});
 console.log("ARKI_ADN_MC_PROPOSALS="+proposals.proposals.length);
 console.log("ARKI_ADN_MC_DEFICITS="+proposals.deficits.length);
 console.log("AUTONOMOUS_RUNTIME=NOT_IMPLEMENTED");
 console.log("LEARNING_VERIFIED=NO");
 console.log("CANONICAL_MUTATION=FALSE");
 console.log("OUTPUT="+output);
}catch(error){console.error("ARKI_ADN_MC_FAILED: "+error.message);process.exitCode=1}
