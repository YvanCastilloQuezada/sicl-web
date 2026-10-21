"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ADN = require("./arki-adn-mejora-continua.cjs");
const MEMORY = require("./arki-autonomy-memory.cjs");

const STORE_SCHEMA = "ARKI-AUTOMEJORA-MEMORY-STORE-1";
const MAX_STORE_BYTES = 10_000_000;

function digest(value) {
  return crypto.createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}


function withStoreLock(file, operation) {
  if (typeof file !== "string" || !path.isAbsolute(file)) {
    throw Error("ABSOLUTE_MEMORY_PATH_REQUIRED");
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const lockPath = file + ".lock";
  let fd;
  try {
    fd = fs.openSync(lockPath, "wx", 0o600);
  } catch (error) {
    if (error && error.code === "EEXIST") {
      throw Error("MEMORY_STORE_LOCKED");
    }
    throw error;
  }

  try {
    fs.writeFileSync(fd, JSON.stringify({
      pid: process.pid,
      acquiredAt: new Date().toISOString()
    }) + "\n", "utf8");
    fs.fsyncSync(fd);
    return operation();
  } finally {
    try { fs.closeSync(fd); } catch {}
    try { fs.unlinkSync(lockPath); } catch {}
  }
}

function requireEvidenceRef(value) {
  if (typeof value !== "string" || !value.trim() ||
      value.length > 2048) {
    throw Error("EVIDENCE_REFERENCE_REQUIRED");
  }
  return value;
}

function readStore(file) {
  if (typeof file !== "string" || !path.isAbsolute(file)) {
    throw Error("ABSOLUTE_MEMORY_PATH_REQUIRED");
  }

  if (!fs.existsSync(file)) {
    return { schema: STORE_SCHEMA, events: [] };
  }

  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() ||
      stat.size > MAX_STORE_BYTES) {
    throw Error("UNSAFE_MEMORY_STORE");
  }

  const store = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!store || store.schema !== STORE_SCHEMA ||
      !Array.isArray(store.events)) {
    throw Error("INVALID_MEMORY_STORE");
  }

  MEMORY.validate(store.events);
  return store;
}

function persistStore(file, store) {
  const directory = path.dirname(file);
  fs.mkdirSync(directory, { recursive: true });

  // Reject a symlink or a non-regular existing target.
  if (fs.existsSync(file)) {
    const stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw Error("UNSAFE_MEMORY_TARGET");
    }
  }

  const temp = file + ".tmp-" + process.pid;
  let fd;

  try {
    fd = fs.openSync(temp, "wx", 0o600);
    fs.writeFileSync(
      fd,
      JSON.stringify(store, null, 2) + "\n",
      "utf8"
    );
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = undefined;
    fs.renameSync(temp, file);
  } catch (error) {
    if (fd !== undefined) {
      try { fs.closeSync(fd); } catch {}
    }
    try { fs.unlinkSync(temp); } catch {}
    throw error;
  }
}

function appendEvent(events, input) {
  return MEMORY.record(events, input);
}

function appendEvents(inputs, options) {
  if (!options || typeof options.memoryFile !== "string") {
    throw Error("MEMORY_FILE_REQUIRED");
  }
  if (!Array.isArray(inputs) || inputs.length < 1 || inputs.length > 1000) {
    throw Error("INVALID_MEMORY_EVENTS");
  }
  for (const input of inputs) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw Error("INVALID_MEMORY_EVENT");
    }
    requireEvidenceRef(input.evidenceRef);
    const key = input.payload && input.payload.idempotencyKey;
    if (key !== undefined &&
        (typeof key !== "string" || !key.trim() || key.length > 512)) {
      throw Error("INVALID_IDEMPOTENCY_KEY");
    }
  }

  return withStoreLock(options.memoryFile, () => {
    const store = readStore(options.memoryFile);
    let events = store.events;
    const seen = new Set(events
      .map(event => event.payload && event.payload.idempotencyKey)
      .filter(key => typeof key === "string" && key));
    let appendedCount = 0;
    let duplicateCount = 0;

    for (const input of inputs) {
      const key = input.payload && input.payload.idempotencyKey;
      if (key && seen.has(key)) {
        duplicateCount += 1;
        continue;
      }
      events = appendEvent(events, input);
      if (key) seen.add(key);
      appendedCount += 1;
    }

    if (appendedCount > 0) {
      persistStore(options.memoryFile, { schema: STORE_SCHEMA, events });
    }

    return {
      events,
      memory: MEMORY.summarize(events),
      appendedCount,
      duplicateCount,
      canonicalMutation: false
    };
  });
}

function observe(input, options) {
  if (!options || typeof options.memoryFile !== "string") {
    throw Error("MEMORY_FILE_REQUIRED");
  }

  const evidenceRef = requireEvidenceRef(options.evidenceRef);
  const observation = ADN.normalize(input);
  const proposal = ADN.propose(observation);
  return withStoreLock(options.memoryFile, () => {
  const store = readStore(options.memoryFile);
  let events = store.events;

  events = appendEvent(events, {
    type: "OBSERVATION",
    subject: observation.observationId,
    sourceSha: observation.sourceCommit,
    evidenceRef,
    payload: {
      schema: observation.schema,
      observationId: observation.observationId,
      metrics: observation.metrics,
      observationDigest: digest(observation)
    }
  });

  events = appendEvent(events, {
    type: "DEFICIT",
    subject: observation.observationId,
    sourceSha: observation.sourceCommit,
    evidenceRef,
    payload: { deficits: proposal.deficits }
  });

  events = appendEvent(events, {
    type: "PROPOSAL",
    subject: observation.observationId,
    sourceSha: observation.sourceCommit,
    evidenceRef,
    payload: {
      schema: proposal.schema,
      proposal,
      observation
    }
  });

  persistStore(options.memoryFile, { schema: STORE_SCHEMA, events });

  return {
    schema: "ARKI-AUTOMEJORA-OPERATION-1",
    observationId: observation.observationId,
    deficits: proposal.deficits,
    proposals: proposal.proposals,
    memory: MEMORY.summarize(events),
    execution: "OBSERVATION_AND_PROPOSAL_ONLY",
    experimentExecuted: false,
    learningVerified: false,
    canonicalMutation: false
  };
  });
}

function resolveReceiptPublicKey(options) {
  let publicKeyPem;
  if (typeof options.receiptPublicKey === "string" &&
      options.receiptPublicKey.trim()) {
    publicKeyPem = options.receiptPublicKey;
  } else {
    const keyPath = options.receiptPublicKeyPath ||
      process.env.ARKI_RECEIPT_PUBLIC_KEY_PATH;
    if (typeof keyPath !== "string" || !keyPath) {
      throw Error("RECEIPT_PUBLIC_KEY_REQUIRED");
    }
    if (!path.isAbsolute(keyPath)) {
      throw Error("RECEIPT_PUBLIC_KEY_PATH_MUST_BE_ABSOLUTE");
    }
    try {
      const stat = fs.lstatSync(keyPath);
      if (stat.isSymbolicLink() || !stat.isFile()) {
        throw Error("RECEIPT_PUBLIC_KEY_FILE_INVALID");
      }
      publicKeyPem = fs.readFileSync(keyPath, "utf8");
    } catch (error) {
      if (error && error.message === "RECEIPT_PUBLIC_KEY_FILE_INVALID") {
        throw error;
      }
      throw Error("RECEIPT_PUBLIC_KEY_FILE_INVALID");
    }
  }

  let actualFingerprint;
  try {
    const key = crypto.createPublicKey(publicKeyPem);
    const der = key.export({ type: "spki", format: "der" });
    actualFingerprint = crypto.createHash("sha256").update(der).digest("hex");
  } catch {
    throw Error("RECEIPT_PUBLIC_KEY_INVALID");
  }

  const expected = options.receiptPublicKeySha256 ||
    process.env.ARKI_RECEIPT_PUBLIC_KEY_SHA256;
  if (typeof expected !== "string" || !/^[a-fA-F0-9]{64}$/.test(expected)) {
    throw Error("RECEIPT_PUBLIC_KEY_FINGERPRINT_REQUIRED");
  }
  if (actualFingerprint !== expected.toLowerCase()) {
    throw Error("RECEIPT_PUBLIC_KEY_FINGERPRINT_MISMATCH");
  }
  return publicKeyPem;
}

function evaluateLatest(receipt, options) {
  if (!options || typeof options.memoryFile !== "string") {
    throw Error("MEMORY_FILE_REQUIRED");
  }

  const evidenceRef = requireEvidenceRef(options.evidenceRef);
  return withStoreLock(options.memoryFile, () => {
  const store = readStore(options.memoryFile);

  let latest;
  for (let i = store.events.length - 1; i >= 0; i--) {
    const event = store.events[i];
    if (event.type === "PROPOSAL" &&
        event.payload && event.payload.proposal) {
      latest = event.payload;
      break;
    }
  }

  if (!latest) throw Error("NO_PRIOR_PROPOSAL");

  const publicKey = resolveReceiptPublicKey(options);
  const result = ADN.evaluate(latest.proposal, receipt, { publicKey });
  const receiptDigest = crypto.createHash("sha256")
    .update(ADN.receiptSigningPayload(receipt))
    .digest("hex");

  const duplicate = [...store.events].reverse().find(event =>
    event.type === "EXPERIMENT_RESULT" &&
    event.payload && event.payload.receiptDigest === receiptDigest
  );
  if (duplicate) {
    return {
      ...duplicate.payload.result,
      duplicateReceipt: true,
      memory: MEMORY.summarize(store.events),
      canonicalMutation: false
    };
  }

  const events = appendEvent(store.events, {
    type: "EXPERIMENT_RESULT",
    subject: result.candidateId,
    sourceSha: receipt.sourceCommit,
    evidenceRef,
    payload: {
      result,
      receiptDigest
    }
  });

  persistStore(options.memoryFile, { schema: STORE_SCHEMA, events });

  return {
    ...result,
    duplicateReceipt: false,
    memory: MEMORY.summarize(events),
    canonicalMutation: false
  };
  });
}

function reassess(beforeInput, afterInput, options) {
  if (!options || typeof options.memoryFile !== "string") {
    throw Error("MEMORY_FILE_REQUIRED");
  }

  const evidenceRef = requireEvidenceRef(options.evidenceRef);
  return withStoreLock(options.memoryFile, () => {
  const before = ADN.normalize(beforeInput);
  const after = ADN.normalize(afterInput);
  const result = ADN.compareObservations(before, after);
  const store = readStore(options.memoryFile);

  const events = appendEvent(store.events, {
    type: "REASSESSMENT",
    subject: after.observationId,
    sourceSha: after.sourceCommit,
    evidenceRef,
    payload: {
      beforeObservationId: before.observationId,
      afterObservationId: after.observationId,
      result
    }
  });

  persistStore(options.memoryFile, { schema: STORE_SCHEMA, events });

  return {
    ...result,
    memory: MEMORY.summarize(events),
    canonicalMutation: false
  };
  });
}

module.exports = {
  STORE_SCHEMA,
  appendEvents,
  observe,
  evaluateLatest,
  reassess,
  readStore
};
