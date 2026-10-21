"use strict";
/** Official ARKI Tree launcher: existing historical AV-UI-001 frontend, no template. */
const fs=require("node:fs"),path=require("node:path");
const {start}=require("./tools/maqueta-viva/arki-av023-historical-ui.cjs");
const root=__dirname;
function resolveInputs(env=process.env){
 const home=env.HOME;if(!home)throw Error("HOME_REQUIRED");
 const proposal=env.ARKI_PROPOSAL_FILE||path.join(home,"ARKI/continuity/arki-av017-proposal.json");
 const ledger=env.ARKI_LEDGER_DIR||path.join(home,"ARKI/continuity/arki-po-ledger");
 const port=Number(env.ARKI_TREE_PORT||8768);
 if(!Number.isInteger(port)||port<1024||port>65535)throw Error("INVALID_PORT");
 for(const [name,p] of [["PROPOSAL",proposal],["LEDGER",ledger]]){
  if(!fs.existsSync(p))throw Error(name+"_MISSING: "+p);
  const st=fs.lstatSync(p);
  if(st.isSymbolicLink())throw Error(name+"_SYMLINK_REJECTED");
  if(name==="LEDGER"?!st.isDirectory():!st.isFile())throw Error(name+"_INVALID_TYPE");
 }
 return {root,proposal,ledger,port};
}
module.exports={resolveInputs};
if(require.main===module){
 try{const x=resolveInputs();const server=start(x.root,x.proposal,x.ledger,x.port);
 server.on("listening",()=>process.stdout.write("ARKI_OFFICIAL_TREE_READY http://127.0.0.1:"+x.port+"\n"));
 server.on("error",e=>{process.stderr.write("ARKI_TREE_LISTEN_FAIL "+e.message+"\n");process.exitCode=1});
 }catch(e){process.stderr.write("ARKI_TREE_START_FAIL "+e.message+"\n");process.exitCode=1}
}
