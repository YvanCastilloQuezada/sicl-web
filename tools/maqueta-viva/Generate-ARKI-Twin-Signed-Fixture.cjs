"use strict";
/**
 * Creates a SYNTHETIC ECDSA P-256 signed receipt for UI testing only.
 * NEVER use the output as evidence of Core/AGK execution.
 * Private key is ephemeral and is NOT written to disk.
 * Usage: node tools/maqueta-viva/Generate-ARKI-Twin-Signed-Fixture.cjs <output-directory>
 */
const fs=require("node:fs");
const path=require("node:path");
const {webcrypto}=require("node:crypto");
async function main(){
 const destination=process.argv[2];
 if(!destination||destination.startsWith("-"))throw Error("Provide an explicit output directory");
 const dir=path.resolve(destination);
 fs.mkdirSync(dir,{recursive:true});
 const pair=await webcrypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},true,["sign","verify"]);
 const jwk=await webcrypto.subtle.exportKey("jwk",pair.publicKey);
 jwk.alg="ES256";jwk.ext=true;jwk.key_ops=["verify"];
 const keyId="SYNTHETIC-DEMO-KEY";
 const publicKey={schema:"ARKI-TWIN-PUBLIC-KEY-1",keyId,jwk};
 const payload=JSON.stringify({
  schema:"ARKI-TWIN-EXECUTION-RECEIPTS-1",
  receipts:[{id:"SYNTHETIC-DEMO-001",producer:"AGK",outcome:"UNKNOWN",timestamp:"2026-10-10T12:00:00-05:00",operation:"synthetic-contract-test",commit:"0".repeat(40),phaseId:"F6"}]
 });
 const signature=Buffer.from(await webcrypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},pair.privateKey,new TextEncoder().encode(payload))).toString("base64url");
 const envelope={schema:"ARKI-TWIN-SIGNED-RECEIPTS-1",algorithm:"ECDSA-P256-SHA256",keyId,payload,signature};
 const write=(name,value)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+"\n",{encoding:"utf8",flag:"wx"});
 write("ARKI-TWIN-SYNTHETIC-PUBLIC-KEY.json",publicKey);
 write("ARKI-TWIN-SYNTHETIC-SIGNED-RECEIPTS.json",envelope);
 console.log("SYNTHETIC_FIXTURE_CREATED");
 console.log("NOT_REAL_CORE_OR_AGK_EXECUTION");
 console.log("PRIVATE_KEY_NOT_PERSISTED");
 console.log("OUTPUT="+dir);
}
main().catch(error=>{console.error("FIXTURE_FAILED: "+error.message);process.exitCode=1});
