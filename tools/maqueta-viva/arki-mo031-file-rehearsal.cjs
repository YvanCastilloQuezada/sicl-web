"use strict";
/** MO-031E: actual temporary-file metadata correction with verified rollback. */
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
function rehearseFile(binding,registryPath){
 if(binding?.schema!=="ARKI-MO031-EVIDENCE-BINDING-1"||binding.policy?.canonicalMutation!==false||binding.policy?.autoApproval!==false||!Array.isArray(binding.items))throw Error("INVALID_BINDING");
 const st=fs.lstatSync(registryPath);
 if(!st.isFile()||st.isSymbolicLink()||st.size>2e6)throw Error("UNSAFE_REGISTRY");
 const source=fs.readFileSync(registryPath),before=sha(source);
 if(sha(Buffer.from(JSON.stringify(JSON.parse(source))))!==binding.registryDigest)throw Error("REGISTRY_DIGEST_MISMATCH");
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo031-"));
 let correction=false,rollback=false,temporaryFile=null;
 try{
  temporaryFile=path.join(dir,"registry.json");
  fs.writeFileSync(temporaryFile,source,{flag:"wx",mode:0o600});
  const clone=JSON.parse(fs.readFileSync(temporaryFile,"utf8"));
  const entries=[...clone.ideas,...clone.components];
  const eligible=binding.items.filter(x=>x.status==="EVIDENCE_REQUIRED");
  for(const item of eligible){
   const target=entries.find(x=>x.id===item.id);
   if(!target)throw Error("MISSING_SANDBOX_TARGET");
   target.mo031Review={status:"EVIDENCE_REQUIRED",origin:item.origin,authorization:"PENDING_PO",architecturalCorrection:"NOT_EXECUTED"};
  }
  fs.writeFileSync(temporaryFile,JSON.stringify(clone,null,2)+"\n");
  correction=sha(fs.readFileSync(temporaryFile))!==before;
  // Byte-exact rollback of sandbox file; source is never written.
  fs.writeFileSync(temporaryFile,source);
  rollback=sha(fs.readFileSync(temporaryFile))===before&&sha(fs.readFileSync(registryPath))===before;
  if(!rollback)throw Error("ROLLBACK_FAILED");
  return {schema:"ARKI-MO031-FILE-REHEARSAL-1",temporaryCorrectionApplied:correction,temporaryCorrectionCount:eligible.length,rollbackVerified:rollback,sourceUnchanged:true,sourceSha256:before,policy:{sourceWrites:0,canonicalMutation:false,architecturalCorrection:"NOT_EXECUTED",poApproval:"NOT_GRANTED"}};
 }finally{if(temporaryFile){try{fs.unlinkSync(temporaryFile)}catch(e){if(e.code!=="ENOENT")throw e}}fs.rmdirSync(dir)}
}
function read(p){const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>2e6)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(p,"utf8"))}
module.exports={rehearseFile};
if(require.main===module){try{if(process.argv.length!==4)throw Error("USAGE: node arki-mo031-file-rehearsal.cjs EVIDENCE_JSON REGISTRY_JSON");process.stdout.write(JSON.stringify(rehearseFile(read(process.argv[2]),process.argv[3]),null,2)+"\n")}catch(e){process.stderr.write("ARKI_MO031_FILE_REHEARSAL_FAIL: "+e.message+"\n");process.exitCode=1}}
