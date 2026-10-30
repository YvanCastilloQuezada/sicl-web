import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { backupContinuityOutbox, restoreContinuityOutbox } from "./arki-memory-outbox-backup.mjs";

const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite");

test("SQLite outbox backup is a consistent, integrity-checked snapshot", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "arki-outbox-backup-test-"));
  const source = path.join(directory, "source.sqlite");
  const backupDir = path.join(directory, "backups");
  try {
    const db = new DatabaseSync(source);
    db.exec("CREATE TABLE arki_continuity_outbox(id INTEGER PRIMARY KEY, encrypted_envelope TEXT NOT NULL)");
    db.prepare("INSERT INTO arki_continuity_outbox(encrypted_envelope) VALUES (?)").run("encrypted-event-envelope");
    db.close();

    const result = await backupContinuityOutbox({ sourcePath: source, backupDir });
    assert.equal(result.manifest.integrity_check, "ok");
    assert.equal(result.manifest.bytes > 0, true);
    assert.equal(result.manifest.sha256.length, 64);

    const backup = new DatabaseSync(result.backupPath);
    try {
      assert.equal(backup.prepare("SELECT encrypted_envelope FROM arki_continuity_outbox").get()?.encrypted_envelope, "encrypted-event-envelope");
      assert.equal(backup.prepare("PRAGMA integrity_check").get()?.integrity_check, "ok");
    } finally { backup.close(); }

    const manifest = JSON.parse(await fs.readFile(result.manifestPath, "utf8"));
    assert.equal(manifest.sha256, result.manifest.sha256);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});


test("restore verifies manifest, preserves outbox data and never overwrites", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "arki-outbox-restore-test-"));
  const source = path.join(directory, "source.sqlite");
  const backupDir = path.join(directory, "backups");
  const target = path.join(directory, "restored", "outbox.sqlite");
  try {
    const db = new DatabaseSync(source);
    db.exec("CREATE TABLE arki_continuity_outbox(id INTEGER PRIMARY KEY, encrypted_envelope TEXT NOT NULL)");
    db.prepare("INSERT INTO arki_continuity_outbox(encrypted_envelope) VALUES (?)").run("ciphertext-preserved");
    db.close();

    const backup = await backupContinuityOutbox({ sourcePath: source, backupDir });
    const restored = await restoreContinuityOutbox({ backupPath: backup.backupPath, targetPath: target });
    assert.equal(restored.integrity_check, "ok");
    assert.equal(restored.sha256.length, 64);

    const recovered = new DatabaseSync(target);
    try {
      assert.equal(
        recovered.prepare("SELECT encrypted_envelope FROM arki_continuity_outbox").get()?.encrypted_envelope,
        "ciphertext-preserved",
      );
      assert.equal(recovered.prepare("PRAGMA integrity_check").get()?.integrity_check, "ok");
    } finally { recovered.close(); }

    await assert.rejects(
      restoreContinuityOutbox({ backupPath: backup.backupPath, targetPath: target }),
      /OUTBOX_RESTORE_TARGET_EXISTS/,
    );
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("restore rejects a backup whose manifest checksum does not match", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "arki-outbox-tamper-test-"));
  const source = path.join(directory, "source.sqlite");
  const backupDir = path.join(directory, "backups");
  const target = path.join(directory, "must-not-exist.sqlite");
  try {
    const db = new DatabaseSync(source);
    db.exec("CREATE TABLE arki_continuity_outbox(id INTEGER PRIMARY KEY, encrypted_envelope TEXT NOT NULL)");
    db.close();

    const backup = await backupContinuityOutbox({ sourcePath: source, backupDir });
    const manifest = JSON.parse(await fs.readFile(backup.manifestPath, "utf8"));
    manifest.sha256 = "0".repeat(64);
    await fs.writeFile(backup.manifestPath, JSON.stringify(manifest));

    await assert.rejects(
      restoreContinuityOutbox({ backupPath: backup.backupPath, targetPath: target }),
      /OUTBOX_BACKUP_CHECKSUM_MISMATCH/,
    );
    await assert.rejects(fs.access(target));
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
