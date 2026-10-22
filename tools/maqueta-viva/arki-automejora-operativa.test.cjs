"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");

const OPS = require("./arki-automejora-operativa.cjs");
const ADN = require("./arki-adn-mejora-continua.cjs");

function fingerprint(publicKeyPem) {
  return crypto.createHash("sha256")
    .update(crypto.createPublicKey(publicKeyPem).export({
      type: "spki", format: "der"
    }))
    .digest("hex");
}

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "arki-mc-"));
  const memoryFile = path.join(dir, "memory.json");
  const commit = "a".repeat(40);
  const observation = {
    schema: "ARKI-ADN-OBSERVATION-1",
    observationId: "baseline-001",
    sourceCommit: commit,
    metrics: [{
      id: "duration",
      value: 10,
      target: 5,
      direction: "MINIMIZE",
      unit: "seconds",
      verified: true
    }]
  };
  return { dir, memoryFile, commit, observation };
}

test("observación produce propuestas y persiste memoria", () => {
  const f = fixture();
  const result = OPS.observe(f.observation, {
    memoryFile: f.memoryFile,
    evidenceRef: "test-fixture:baseline-001"
  });

  assert.equal(result.proposals.length, 2);
  assert.equal(result.canonicalMutation, false);
  assert.equal(result.learningVerified, false);

  const store = OPS.readStore(f.memoryFile);
  assert.equal(store.events.length, 3);
  assert.equal(store.events[0].type, "OBSERVATION");
  assert.equal(store.events[1].type, "DEFICIT");
  assert.equal(store.events[2].type, "PROPOSAL");
});

test("rechaza observación sin referencia de evidencia", () => {
  const f = fixture();
  assert.throws(
    () => OPS.observe(f.observation, {
      memoryFile: f.memoryFile,
      evidenceRef: ""
    }),
    /EVIDENCE_REFERENCE_REQUIRED/
  );
  assert.equal(fs.existsSync(f.memoryFile), false);
});

test("rechaza ruta de memoria relativa", () => {
  assert.throws(
    () => OPS.readStore("memory.json"),
    /ABSOLUTE_MEMORY_PATH_REQUIRED/
  );
});

test("evaluación requiere una propuesta previa", () => {
  const f = fixture();
  const receipt = {};
  assert.throws(
    () => OPS.evaluateLatest(receipt, {
      memoryFile: f.memoryFile,
      evidenceRef: "test-fixture:receipt"
    }),
    /NO_PRIOR_PROPOSAL/
  );
});

test("compara observaciones y conserva el resultado", () => {
  const f = fixture();
  const after = {
    ...f.observation,
    observationId: "after-001",
    metrics: [{
      ...f.observation.metrics[0],
      value: 8
    }]
  };

  const result = OPS.reassess(f.observation, after, {
    memoryFile: f.memoryFile,
    evidenceRef: "test-fixture:comparison"
  });

  assert.equal(result.summary.improvements, 1);
  assert.equal(result.learningVerified, false);
  assert.equal(result.canonicalMutation, false);

  const store = OPS.readStore(f.memoryFile);
  assert.equal(store.events.length, 1);
  assert.equal(store.events[0].type, "REASSESSMENT");
});

test("evaluación de experimento válido queda pendiente de revisión", () => {
 const f=fixture();
 const keys=crypto.generateKeyPairSync("rsa",{modulusLength:2048});
 const publicKeyPem=keys.publicKey.export({type:"spki",format:"pem"});
 const proposal=OPS.observe(f.observation,{memoryFile:f.memoryFile,evidenceRef:"test-fixture:baseline"}).proposals[0];
 const receipt={
  schema:"ARKI-ADN-EXPERIMENT-RECEIPT-1",
  observationDigest: OPS.readStore(f.memoryFile).events[2].payload.proposal.observationDigest,
  candidateId:proposal.id,
  outcome:"SUCCESS",
  authorization:"EXTERNAL_APPROVED",
  producerIdentity:"AUTHENTICATED_BY_EXTERNAL_VERIFIER",
  evidenceDigest:crypto.createHash("sha256").update("fixture evidence").digest("hex"),
  sourceCommit:f.commit,
  regressionCount:0,
  safetyGate:"PASS",
  before:proposal.baselineValue,
  after:proposal.baselineValue-1
 };
 receipt.signature=crypto.sign("sha256",Buffer.from(ADN.receiptSigningPayload(receipt)),keys.privateKey).toString("base64");
 const options={memoryFile:f.memoryFile,evidenceRef:"test-fixture:verified-receipt",receiptPublicKey:publicKeyPem,receiptPublicKeySha256:fingerprint(publicKeyPem)};
 assert.throws(()=>OPS.evaluateLatest({...receipt,after:receipt.after-1},options),/RECEIPT_SIGNATURE_INVALID/);
 assert.equal(OPS.readStore(f.memoryFile).events.length,3);
 const rejectWithoutPersisting = (candidate, candidateOptions, pattern) => {
  if (pattern) {
   assert.throws(() => OPS.evaluateLatest(candidate, candidateOptions), pattern);
  } else {
   assert.throws(() => OPS.evaluateLatest(candidate, candidateOptions));
  }
  assert.equal(OPS.readStore(f.memoryFile).events.length,3);
 };
 rejectWithoutPersisting({...receipt,signature:""},options);
 rejectWithoutPersisting({...receipt,signature:"%%%"},options);
 rejectWithoutPersisting(receipt,{...options,receiptPublicKey:"not a PEM key"});
 const relativeOptions={...options,receiptPublicKeyPath:"relative-key.pem"};
 delete relativeOptions.receiptPublicKey;
 rejectWithoutPersisting(receipt,relativeOptions,/RECEIPT_PUBLIC_KEY_PATH_MUST_BE_ABSOLUTE/);
 const missingOptions={...options,receiptPublicKeyPath:path.join(f.dir,"missing-public-key.pem")};
 delete missingOptions.receiptPublicKey;
 rejectWithoutPersisting(receipt,missingOptions,/RECEIPT_PUBLIC_KEY_FILE_INVALID/);
 const directoryOptions={...options,receiptPublicKeyPath:f.dir};
 delete directoryOptions.receiptPublicKey;
 rejectWithoutPersisting(receipt,directoryOptions,/RECEIPT_PUBLIC_KEY_FILE_INVALID/);
 const linkPath=path.join(f.dir,"public-key-link.pem");
 fs.symlinkSync(path.join(f.dir,"public-key.pem"),linkPath);
 const linkOptions={...options,receiptPublicKeyPath:linkPath};
 delete linkOptions.receiptPublicKey;
 rejectWithoutPersisting(receipt,linkOptions,/RECEIPT_PUBLIC_KEY_FILE_INVALID/);
 const noFingerprint={...options};
 delete noFingerprint.receiptPublicKeySha256;
 rejectWithoutPersisting(receipt,noFingerprint,/RECEIPT_PUBLIC_KEY_FINGERPRINT_REQUIRED/);
 rejectWithoutPersisting(receipt,{...options,receiptPublicKeySha256:"0".repeat(64)},/RECEIPT_PUBLIC_KEY_FINGERPRINT_MISMATCH/);
 const result=OPS.evaluateLatest(receipt,options);
 assert.equal(result.duplicateReceipt,false);
 assert.equal(result.status,"EVIDENCE_SUBMITTED_REQUIRES_INDEPENDENT_REVIEW");
 assert.equal(result.learningVerified,false);
 assert.equal(result.canonicalMutation,false);
 assert.equal(OPS.readStore(f.memoryFile).events.length,4);

 const duplicate=OPS.evaluateLatest(receipt,options);
 assert.equal(duplicate.duplicateReceipt,true);
 assert.equal(duplicate.canonicalMutation,false);
 assert.equal(OPS.readStore(f.memoryFile).events.length,4);
});

test("bloqueo existente impide escrituras y conserva los bytes", () => {
 const f=fixture();
 OPS.observe(f.observation,{
   memoryFile:f.memoryFile,
   evidenceRef:"test-fixture:lock-baseline"
 });
 const before=fs.readFileSync(f.memoryFile);
 const lockPath=f.memoryFile+".lock";
 fs.writeFileSync(lockPath,"owned-by-test\n",{flag:"wx"});
 try {
   assert.throws(
     () => OPS.observe({...f.observation,observationId:"blocked-write"},{
       memoryFile:f.memoryFile,
       evidenceRef:"test-fixture:blocked"
     }),
     /MEMORY_STORE_LOCKED/
   );
   assert.deepEqual(fs.readFileSync(f.memoryFile),before);
   assert.equal(fs.existsSync(lockPath),true);
 } finally {
   fs.unlinkSync(lockPath);
 }
});
